"use client";
import AdminGuard from "@/components/admin/AdminGuard";
import NewsManager from "@/components/admin/NewsManager";
import { ArrowLeft } from "lucide-react";
export default function AdminBeritaPage(){ return <AdminGuard><main className="min-h-screen bg-slate-50 p-5 md:p-8"><div className="mx-auto max-w-6xl"><a href="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700"><ArrowLeft size={17}/> Kembali ke Dashboard</a><div className="mb-8"><p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">Admin / Berita</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Kelola Berita</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Tambah, edit, dan hapus berita. Data disimpan melalui API ke database penyimpanan data.</p></div><NewsManager/></div></main></AdminGuard> }
