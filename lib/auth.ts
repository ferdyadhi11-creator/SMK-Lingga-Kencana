import crypto from 'crypto';
import { getJSON, setJSON } from '@/lib/store';

const SESSION_COOKIE = 'smk_admin_session';
const SESSION_DAYS = 7;

type AdminUser = { id: number; username: string; password_hash: string };

function secret() {
  // SESSION_SECRET dianjurkan; ADMIN_PASSWORD dipakai sebagai cadangan agar tetap berjalan.
  const s = (process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '').trim();
  if (!s) throw new Error('ADMIN_PASSWORD belum dikonfigurasi. Isi environment variable ADMIN_PASSWORD (dan SESSION_SECRET) di pengaturan hosting.');
  return s;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(password, salt, 32).toString('hex');
  return `scrypt$${salt}$${key}`;
}

function checkPassword(password: string, stored: string) {
  const [scheme, salt, key] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !key) return false;
  const a = Buffer.from(key, 'hex');
  const b = crypto.scryptSync(password, salt, 32);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function ensureAdminUser(): Promise<AdminUser> {
  const existing = await getJSON<AdminUser>('admin-user');
  if (existing) return existing;
  const bootstrapPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!bootstrapPassword) {
    throw new Error('ADMIN_PASSWORD belum dikonfigurasi. Isi environment variable ADMIN_PASSWORD di pengaturan hosting sebelum menjalankan dashboard admin.');
  }
  const user: AdminUser = { id: 1, username: 'admin', password_hash: hashPassword(bootstrapPassword) };
  await setJSON('admin-user', user);
  return user;
}

export async function verifyCredentials(username: string, password: string) {
  const user = await ensureAdminUser();
  if (username !== user.username || !checkPassword(password, user.password_hash)) return null;
  return { id: user.id, username: user.username };
}

export async function setAdminPassword(newPassword: string) {
  const user = await ensureAdminUser();
  await setJSON('admin-user', { ...user, password_hash: hashPassword(newPassword) });
}

/* Sesi tanpa database: token bertanda tangan HMAC. Mengganti password otomatis mencabut semua sesi lama. */
const sign = (payload: string) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export async function createSession(userId: number) {
  const user = await ensureAdminUser();
  const expires = Date.now() + SESSION_DAYS * 86400000;
  const payload = Buffer.from(JSON.stringify({ u: userId, n: user.username, e: expires, v: user.password_hash.slice(-12) })).toString('base64url');
  return { token: `${payload}.${sign(payload)}`, expires: new Date(expires).toISOString() };
}

export async function getSession(token?: string) {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    const expected = sign(payload);
    const a = Buffer.from(sig), b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.e || data.e <= Date.now()) return null;
    const user = await getJSON<AdminUser>('admin-user');
    if (!user || user.password_hash.slice(-12) !== data.v) return null;
    return { user_id: data.u as number, username: data.n as string, expires_at: new Date(data.e).toISOString() };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
