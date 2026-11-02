import { NextRequest, NextResponse } from 'next/server';
import { createSession, SESSION_COOKIE, verifyCredentials } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const user = await verifyCredentials(String(username || ''), String(password || ''));
    if (!user) return NextResponse.json({ error: 'Username atau password tidak sesuai.' }, { status: 401 });
    const session = await createSession(user.id);
    const response = NextResponse.json({ success: true, user: { username: user.username } });
    response.cookies.set(SESSION_COOKIE, session.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 7 * 86400 });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login gagal.';
    if (message.includes('ADMIN_PASSWORD')) return NextResponse.json({ error: message }, { status: 500 });
    return NextResponse.json({ error: 'Permintaan login tidak valid.' }, { status: 400 });
  }
}
