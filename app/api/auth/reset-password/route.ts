import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SESSION_COOKIE, setAdminPassword } from '@/lib/auth';

const sha = (v: string) => crypto.createHash('sha256').update(v).digest();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || '').trim();
    const recoveryPassword = String(body.recoveryPassword || '');
    const newPassword = String(body.newPassword || '');
    if (username !== 'admin') return NextResponse.json({ error: 'Reset hanya tersedia untuk akun admin.' }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: 'Password baru minimal 6 karakter.' }, { status: 400 });
    const bootstrapPassword = process.env.ADMIN_PASSWORD?.trim();
    if (!bootstrapPassword) return NextResponse.json({ error: 'ADMIN_PASSWORD belum dikonfigurasi di environment variable hosting.' }, { status: 500 });
    if (!crypto.timingSafeEqual(sha(recoveryPassword), sha(bootstrapPassword))) return NextResponse.json({ error: 'Kode pemulihan tidak sesuai dengan ADMIN_PASSWORD.' }, { status: 401 });
    await setAdminPassword(newPassword);
    const response = NextResponse.json({ ok: true, message: 'Password admin berhasil direset. Silakan login kembali.' });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ error: 'Permintaan reset password tidak valid.' }, { status: 400 });
  }
}
