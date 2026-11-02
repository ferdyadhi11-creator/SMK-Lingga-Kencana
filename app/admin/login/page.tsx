"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function clearNotice() { setError(""); setMessage(""); }

  async function submitLogin(e: FormEvent) {
    e.preventDefault(); clearNotice(); setLoading(true);
    try {
      const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Login gagal.');
      router.replace('/admin');
    } catch (e) { setError(e instanceof Error ? e.message : 'Login gagal.'); }
    finally { setLoading(false); }
  }

  async function submitReset(e: FormEvent) {
    e.preventDefault(); clearNotice();
    if (newPassword !== confirmPassword) { setError('Konfirmasi password baru tidak sama.'); return; }
    setLoading(true);
    try {
      const r = await fetch('/api/auth/reset-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username, recoveryPassword, newPassword}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Reset password gagal.');
      setMessage(d.message || 'Password berhasil direset.');
      setPassword(''); setRecoveryPassword(''); setNewPassword(''); setConfirmPassword('');
      setMode('login');
    } catch (e) { setError(e instanceof Error ? e.message : 'Reset password gagal.'); }
    finally { setLoading(false); }
  }

  return <main className="grid min-h-screen place-items-center bg-slate-950 px-5 py-10">
    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl md:p-9">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700"><ShieldCheck size={28}/></div>
      <p className="mt-7 text-xs font-black uppercase tracking-[.18em] text-blue-700">Admin Panel</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900">{mode === 'login' ? 'Masuk ke Dashboard' : 'Reset Password Admin'}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">{mode === 'login' ? 'Kelola informasi website sekolah melalui dashboard administrator.' : 'Gunakan ADMIN_PASSWORD dari .env.local sebagai kode pemulihan. Data website tidak akan dihapus.'}</p>

      {message && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
      {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      {mode === 'login' ? <form onSubmit={submitLogin} className="mt-7 space-y-4">
        <label className="block"><span className="text-sm font-bold">Username</span><input required value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="admin" autoComplete="username" /></label>
        <label className="block"><span className="text-sm font-bold">Password</span><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Password admin" autoComplete="current-password" /></label>
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-black text-white hover:bg-blue-800 disabled:opacity-60"><LockKeyhole size={18}/>{loading?'Memproses...':'Masuk'}</button>
      </form> : <form onSubmit={submitReset} className="mt-7 space-y-4">
        <label className="block"><span className="text-sm font-bold">Username</span><input required value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="admin" autoComplete="username" /></label>
        <label className="block"><span className="text-sm font-bold">ADMIN_PASSWORD</span><input required type="password" value={recoveryPassword} onChange={e=>setRecoveryPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Nilai ADMIN_PASSWORD" autoComplete="off" /></label>
        <label className="block"><span className="text-sm font-bold">Password Baru</span><input required minLength={6} type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Minimal 6 karakter" autoComplete="new-password" /></label>
        <label className="block"><span className="text-sm font-bold">Konfirmasi Password Baru</span><input required minLength={6} type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Ulangi password baru" autoComplete="new-password" /></label>
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-black text-white hover:bg-blue-800 disabled:opacity-60"><KeyRound size={18}/>{loading?'Memproses...':'Reset Password'}</button>
      </form>}

      <button type="button" onClick={()=>{setMode(mode==='login'?'reset':'login');clearNotice();}} className="mt-5 w-full text-center text-sm font-bold text-blue-700 hover:text-blue-900">
        {mode === 'login' ? 'Lupa password? Reset password admin' : 'Kembali ke login'}
      </button>

      <div className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">Jangan bagikan ADMIN_PASSWORD kepada pengguna lain. Setelah berhasil masuk, gunakan menu Pengaturan untuk mengganti password admin.</div>
    </div>
  </main>;
}
