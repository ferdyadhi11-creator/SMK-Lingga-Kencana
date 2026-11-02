"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter(); const [ready,setReady]=useState(false);
  useEffect(()=>{ fetch('/api/auth/session',{cache:'no-store'}).then(r=>{ if(!r.ok) throw new Error('unauthorized'); setReady(true); }).catch(()=>router.replace('/admin/login')); },[router]);
  if(!ready) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-500">Memeriksa akses admin...</div>;
  return <>{children}</>;
}
