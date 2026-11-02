import { NextRequest, NextResponse } from 'next/server';
import { COLLECTIONS, listRows } from '@/lib/store';
import { getSession, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await getSession(req.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Akses admin diperlukan.' }, { status: 401 });
  }
  const entries = await Promise.all(COLLECTIONS.map(async (c) => [c, (await listRows(c)).length] as const));
  const counts = Object.fromEntries(entries);
  return NextResponse.json({ counts, totalContent: Object.values(counts).reduce((sum, count) => sum + count, 0) });
}
