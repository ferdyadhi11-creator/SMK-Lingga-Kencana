import { NextRequest, NextResponse } from 'next/server';
import { COLLECTIONS, CollectionName, deleteRow, insertRow, listRows, updateRow } from '@/lib/store';
import { getSession, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const schemas: Record<string, string[]> = {
  news: ['category','date','title','excerpt','content','image_url'],
  announcements: ['category','date','title','content'],
  ppdb: ['title','period','schedule','requirements','pathways','documents','fees','registration','registration_url','faq','contact'],
  programs: ['name','description','competencies','activities','supporting_facilities','documentation','prospects','image_url'],
  teachers: ['name','role','subject','image_url'],
  facilities: ['name','description','function','image_url'],
  achievements: ['title','recipient','level','year','event','description','image_url'],
  gallery: ['title','category','date','image_url','description'],
  extracurriculars: ['name','description','schedule','coach','image_url'],
  faqs: ['category','question','answer'],
};
const required: Record<string, string[]> = {
  news: ['category','title','excerpt'],
  announcements: ['title','content'],
  ppdb: ['title'],
  programs: ['name'],
  teachers: ['name'],
  facilities: ['name'],
  achievements: ['title'],
  gallery: ['title'],
  extracurriculars: ['name'],
  faqs: ['question','answer'],
};
const isCollection = (c: string): c is CollectionName => (COLLECTIONS as readonly string[]).includes(c);
const pick = (collection: string, body: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const key of schemas[collection]) if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key] ?? null;
  return out;
};
const missingRequired = (collection: string, body: Record<string, unknown>) => required[collection].filter((key) => typeof body[key] !== 'string' || !String(body[key]).trim());

type Ctx = { params: Promise<{ collection: string }> };
const unauthorized = () => NextResponse.json({ error: 'Akses admin diperlukan.' }, { status: 401 });
const notFoundCollection = () => NextResponse.json({ error: 'Collection tidak tersedia' }, { status: 404 });

export async function GET(_: NextRequest, { params }: Ctx) {
  const { collection } = await params;
  if (!isCollection(collection)) return notFoundCollection();
  return NextResponse.json(await listRows(collection));
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { collection } = await params;
  if (!isCollection(collection)) return notFoundCollection();
  if (!(await getSession(req.cookies.get(SESSION_COOKIE)?.value))) return unauthorized();
  const body = await req.json();
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  const missing = missingRequired(collection, body);
  if (missing.length) return NextResponse.json({ error: `Field wajib belum diisi: ${missing.join(', ')}` }, { status: 400 });
  const data = pick(collection, body);
  if (!Object.keys(data).length) return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  const row = await insertRow(collection, data);
  return NextResponse.json(row, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { collection } = await params;
  if (!isCollection(collection)) return notFoundCollection();
  if (!(await getSession(req.cookies.get(SESSION_COOKIE)?.value))) return unauthorized();
  const body = await req.json();
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  const missing = missingRequired(collection, body);
  if (missing.length) return NextResponse.json({ error: `Field wajib belum diisi: ${missing.join(', ')}` }, { status: 400 });
  const id = Number(body.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
  const data = pick(collection, body);
  if (!Object.keys(data).length) return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  if (!(await updateRow(collection, id, data))) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { collection } = await params;
  if (!isCollection(collection)) return notFoundCollection();
  if (!(await getSession(req.cookies.get(SESSION_COOKIE)?.value))) return unauthorized();
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
  if (!(await deleteRow(collection, id))) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ success: true });
}
