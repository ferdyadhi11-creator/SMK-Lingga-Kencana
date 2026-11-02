import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getRow } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DetailBerita({ params }: { params: Promise<{ id:string }> }) {
  const { id } = await params;
  const item = (await getRow("news", Number(id))) as any;
  if(!item) notFound();
  return <><Navbar/><main className="section-padding bg-white"><article className="container-page max-w-4xl"><a href="/berita" className="text-sm font-bold text-brand-700">← Kembali ke Berita</a><div className="mt-8"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{item.category||"Berita"}</span><h1 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-6xl">{item.title}</h1><p className="mt-4 text-sm text-slate-400">{item.date||""}</p>{item.image_url&&<img src={item.image_url} alt={item.title} className="mt-8 aspect-video w-full rounded-[30px] object-cover shadow-sm"/>}<div className="prose prose-slate mt-10 max-w-none"><p className="whitespace-pre-line text-lg leading-9 text-slate-600">{item.content||item.excerpt||""}</p></div></div></article></main><Footer/></>;
}
