"use client";
import AdminGuard from "@/components/admin/AdminGuard";
import ContentManager from "@/components/admin/ContentManager";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CrudPage(props:any){
  const router=useRouter();
  return <AdminGuard><main className="min-h-screen bg-slate-50 p-5 md:p-8"><div className="mx-auto max-w-5xl"><button onClick={()=>router.push('/admin')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700"><ArrowLeft size={17}/> Kembali ke Dashboard</button><div className="mb-7"><p className="text-xs font-black uppercase tracking-[.15em] text-blue-700">Admin Panel</p><h1 className="mt-1 text-3xl font-black">Kelola {props.title}</h1><p className="mt-2 text-slate-500">{props.description}</p></div><ContentManager {...props}/></div></main></AdminGuard>
}
