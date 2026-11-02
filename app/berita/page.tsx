"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";

type News = { id:number; title:string; category?:string; date?:string; excerpt?:string; image_url?:string|null; content?:string };

export default function BeritaPage() {
  const [items,setItems]=useState<News[]>([]); const [schoolName,setSchoolName]=useState("Website Profil Sekolah"); const [query,setQuery]=useState(""); const [category,setCategory]=useState("Semua"); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  useEffect(()=>{fetch("/api/profile",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>d?.name&&setSchoolName(d.name)).catch(()=>{});fetch("/api/content/news",{cache:"no-store"}).then(async r=>{const d=await r.json(); if(!r.ok) throw new Error(d.error||"Gagal mengambil berita."); return d}).then(setItems).catch(e=>setError(e instanceof Error?e.message:"Gagal mengambil berita.")).finally(()=>setLoading(false))},[]);
  const categories=useMemo(()=>["Semua",...Array.from(new Set(items.map(x=>x.category).filter(Boolean) as string[]))],[items]);
  const filtered=useMemo(()=>items.filter(x=>{const q=query.toLowerCase().trim(); const matchQ=!q||[x.title,x.excerpt,x.content,x.category].filter(Boolean).join(" ").toLowerCase().includes(q); const matchC=category==="Semua"||x.category===category; return matchQ&&matchC}),[items,query,category]);
  return <><Navbar/><main className="section-padding bg-white"><div className="container-page"><span className="eyebrow">Berita & Informasi</span><h1 className="mt-3 text-4xl font-black text-slate-900 md:text-6xl">Berita terbaru sekolah</h1><p className="mt-5 max-w-3xl leading-8 text-slate-600">Temukan kegiatan, informasi, dan kabar terbaru dari {schoolName}.</p>
  <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px]"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari berita..." className="rounded-2xl border border-slate-200 px-5 py-3.5 outline-none focus:border-brand-500"/><select value={category} onChange={e=>setCategory(e.target.value)} className="rounded-2xl border border-slate-200 px-5 py-3.5 outline-none focus:border-brand-500">{categories.map(c=><option key={c}>{c}</option>)}</select></div>
  {loading&&<p className="mt-10 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Memuat berita...</p>}
  {error&&!loading&&<p className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>}
  {!loading&&!error&&filtered.length===0&&<p className="mt-10 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Belum ada berita yang sesuai.</p>}
  {!loading&&!error&&filtered.length>0&&<div className="mt-10 grid gap-6 md:grid-cols-3">{filtered.map(item=><NewsCard key={item.id} item={item as any}/>)}</div>}
  </div></main><Footer/></>;
}
