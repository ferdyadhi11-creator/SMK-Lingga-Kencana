import { NextRequest, NextResponse } from 'next/server';
import { readUpload } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return new NextResponse('Not found', { status: 404 });
  try {
    const file = await readUpload(name);
    if (!file) return new NextResponse('Not found', { status: 404 });
    return new NextResponse(file.data, {
      headers: { 'Content-Type': file.contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
