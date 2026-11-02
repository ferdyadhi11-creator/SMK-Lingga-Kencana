import { NextRequest, NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/store';
import { getSession, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getProfile());
}

export async function PUT(req: NextRequest) {
  if (!(await getSession(req.cookies.get(SESSION_COOKIE)?.value))) return NextResponse.json({ error: 'Akses admin diperlukan.' }, { status: 401 });
  const body = await req.json();
  await saveProfile(body && typeof body === 'object' ? body : {});
  return NextResponse.json({ success: true });
}
