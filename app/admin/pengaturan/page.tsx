"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => { if (data?.user?.username) setUsername(data.user.username); })
      .catch(() => {});
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak sama.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah password.");
      setMessage(data.message || "Password berhasil diperbarui.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-50 p-5 md:p-8">
        <div className="mx-auto max-w-5xl">
          <button onClick={() => router.push("/admin")} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
            <ArrowLeft size={17} /> Kembali ke Dashboard
          </button>
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[.15em] text-blue-700">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-black">Pengaturan</h1>
            <p className="mt-2 text-slate-500">Kelola akun administrator dan keamanan akses dashboard.</p>
          </div>

          {message && <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800"><CheckCircle2 size={18} />{message}</div>}
          {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">{error}</div>}

          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><ShieldCheck size={24} /></div>
              <h2 className="mt-5 text-xl font-black">Akun Administrator</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Akun yang sedang digunakan untuk mengelola konten website.</p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Username</p>
                <p className="mt-1 font-black text-slate-900">{username}</p>
              </div>
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                Sesi administrator aktif dan dilindungi oleh cookie HTTP-only.
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3"><span className="rounded-2xl bg-blue-50 p-3 text-blue-700"><KeyRound size={21} /></span><div><h2 className="text-xl font-black">Ubah Password</h2><p className="text-sm text-slate-500">Gunakan minimal 6 karakter.</p></div></div>
              <form onSubmit={changePassword} className="mt-6 space-y-4">
                <label className="block text-sm font-bold">Password Saat Ini<input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" /></label>
                <label className="block text-sm font-bold">Password Baru<input required minLength={6} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" /></label>
                <label className="block text-sm font-bold">Konfirmasi Password Baru<input required minLength={6} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" /></label>
                <button disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Password"}</button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}
