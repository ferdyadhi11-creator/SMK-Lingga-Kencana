import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession, SESSION_COOKIE } from '@/lib/auth';
import { saveUpload } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Batas request Netlify Functions ±6 MB, jadi gambar dibatasi 4 MB.
const MAX_SIZE = 4 * 1024 * 1024;
const allowed = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

export async function POST(req: NextRequest) {
  const session = await getSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: 'Akses admin diperlukan.' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'File gambar belum dipilih.' }, { status: 400 });
  if (!allowed.has(file.type)) return NextResponse.json({ error: 'Format harus JPG, PNG, atau WebP.' }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Ukuran gambar maksimal 4 MB.' }, { status: 400 });

  const ext = allowed.get(file.type)!;
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const url = await saveUpload(filename, await file.arrayBuffer(), file.type);
  return NextResponse.json({ url, filename }, { status: 201 });
}
