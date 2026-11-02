/**
 * Lapisan penyimpanan data yang kompatibel dengan Netlify.
 *
 * - Produksi (Netlify): memakai Netlify Blobs (tanpa server database).
 * - Lokal (`npm run dev`): memakai file JSON di folder ./data (otomatis).
 *   Paksa mode file dengan STORAGE=file, atau paksa Blobs dengan STORAGE=blobs.
 */
import fs from 'fs/promises';
import path from 'path';

export const COLLECTIONS = [
  'news', 'announcements', 'ppdb', 'programs', 'teachers',
  'facilities', 'achievements', 'gallery', 'extracurriculars', 'faqs',
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
export type Row = { id: number; created_at?: string; updated_at?: string; [key: string]: any };

const useBlobs = () => {
  const mode = process.env.STORAGE;
  if (mode === 'file') return false;
  if (mode === 'blobs') return true;
  return process.env.NODE_ENV === 'production' || !!process.env.NETLIFY;
};

async function blobStore(name: string) {
  const { getStore } = await import('@netlify/blobs');
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  // Di Netlify konfigurasi otomatis; siteID+token hanya dibutuhkan bila dijalankan di luar Netlify.
  if (siteID && token) return getStore({ name, siteID, token, consistency: 'strong' });
  return getStore({ name, consistency: 'strong' });
}

const dataDir = path.join(process.cwd(), 'data');
const fileFor = (key: string) => path.join(dataDir, key.replace(/[^a-zA-Z0-9_.-]/g, '_') + '.json');

export async function getJSON<T>(key: string): Promise<T | null> {
  if (useBlobs()) {
    const store = await blobStore('smk-data');
    const value = await store.get(key, { type: 'json' });
    return (value as T) ?? null;
  }
  try {
    return JSON.parse(await fs.readFile(fileFor(key), 'utf8')) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  if (useBlobs()) {
    const store = await blobStore('smk-data');
    await store.setJSON(key, value);
    return;
  }
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(fileFor(key), JSON.stringify(value, null, 2));
}

/* ---------- Koleksi konten ---------- */

const seeds: Partial<Record<CollectionName, Record<string, any>[]>> = {
  programs: [
    { name: 'Administrasi Perkantoran', description: 'Program keahlian administrasi perkantoran.' },
    { name: 'Akuntansi', description: 'Program keahlian akuntansi.' },
    { name: 'Perbankan', description: 'Program keahlian perbankan.' },
  ],
};

export async function listRows(collection: CollectionName): Promise<Row[]> {
  let rows = await getJSON<Row[]>(`collection-${collection}`);
  if (!rows) {
    const now = new Date().toISOString();
    rows = (seeds[collection] || []).map((r, i) => ({ id: i + 1, ...r, created_at: now, updated_at: now }));
    if (rows.length) await setJSON(`collection-${collection}`, rows);
  }
  return [...rows].sort((a, b) => b.id - a.id); // terbaru dulu (sama seperti ORDER BY id DESC)
}

export async function getRow(collection: CollectionName, id: number): Promise<Row | null> {
  return (await listRows(collection)).find((r) => r.id === id) ?? null;
}

export async function insertRow(collection: CollectionName, data: Record<string, any>): Promise<Row> {
  const rows = await listRows(collection);
  const now = new Date().toISOString();
  const row: Row = { ...data, id: rows.reduce((m, r) => Math.max(m, r.id), 0) + 1, created_at: now, updated_at: now };
  await setJSON(`collection-${collection}`, [...rows, row]);
  return row;
}

export async function updateRow(collection: CollectionName, id: number, data: Record<string, any>): Promise<boolean> {
  const rows = await listRows(collection);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return false;
  rows[idx] = { ...rows[idx], ...data, id, updated_at: new Date().toISOString() };
  await setJSON(`collection-${collection}`, rows);
  return true;
}

export async function deleteRow(collection: CollectionName, id: number): Promise<boolean> {
  const rows = await listRows(collection);
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  await setJSON(`collection-${collection}`, next);
  return true;
}

/* ---------- Profil sekolah ---------- */

export const PROFILE_FIELDS = ['name','location','address','description','history','vision','mission','phone','email','logo_url','hero_url','profile_image_url','students','teachers_count','hero_badge','hero_title','hero_description','hero_programs','principal_message','accreditation','legal_status','whatsapp','instagram','facebook','youtube','tiktok','service_hours'];

const defaultProfile: Record<string, any> = {
  id: 1,
  name: 'SMK Lingga Kencana Depok',
  location: 'Depok, Jawa Barat',
  address: 'Jalan Raya Sawangan No. 47, Rangkapan Jaya Baru, Pancoran Mas, Depok, Jawa Barat',
  description: 'Informasi profil sekolah akan disesuaikan dengan data resmi yang dikonfirmasi bersama pihak sekolah.',
  history: 'Belum diisi. Data sejarah sekolah akan dikonfirmasi sebelum dipublikasikan.',
  vision: 'Belum diisi. Visi resmi sekolah akan dikonfirmasi sebelum dipublikasikan.',
  mission: 'Belum diisi. Misi resmi sekolah akan dikonfirmasi sebelum dipublikasikan.',
  phone: 'Belum diisi',
  email: 'Belum diisi',
  logo_url: '', hero_url: '', profile_image_url: '', students: '', teachers_count: '',
  hero_badge: 'Website Profil Sekolah',
  hero_title: 'Kenali Sekolah, Temukan Potensi, Siapkan Masa Depan.',
  hero_description: 'Informasi profil, program keahlian, fasilitas, kegiatan, prestasi, dan PPDB dalam satu media yang mudah diakses.',
  hero_programs: 'Program keahlian · Fasilitas · PPDB',
  principal_message: '', accreditation: '', legal_status: '', whatsapp: '', instagram: '',
  facebook: '', youtube: '', tiktok: '', service_hours: '',
};

export async function getProfile(): Promise<Record<string, any>> {
  const saved = await getJSON<Record<string, any>>('school-profile');
  return { ...defaultProfile, ...(saved || {}) };
}

export async function saveProfile(body: Record<string, any>): Promise<void> {
  const next: Record<string, any> = { id: 1 };
  for (const f of PROFILE_FIELDS) next[f] = body[f] ?? '';
  next.updated_at = new Date().toISOString();
  await setJSON('school-profile', next);
}

/* ---------- Upload gambar ---------- */

export async function saveUpload(filename: string, data: ArrayBuffer, contentType: string): Promise<string> {
  if (useBlobs()) {
    const store = await blobStore('smk-uploads');
    await store.set(filename, data, { metadata: { contentType } });
    return `/api/media/${filename}`;
  }
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(data));
  return `/uploads/${filename}`;
}

export async function readUpload(filename: string): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  const store = await blobStore('smk-uploads');
  const res = await store.getWithMetadata(filename, { type: 'arrayBuffer' });
  if (!res) return null;
  return { data: res.data as ArrayBuffer, contentType: String((res.metadata as any)?.contentType || 'application/octet-stream') };
}
