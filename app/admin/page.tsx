"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { BarChart3, Bell, BookOpen, ChevronRight, FileText, FolderOpen, Image as ImageIcon, LayoutDashboard, LogOut, Menu, Settings, Trophy, Users, X } from "lucide-react";

const moduleDefs = [
  { name: "Profil Sekolah", icon: FileText, countKey: "profile", path: "profil" },
  { name: "PPDB", icon: FileText, countKey: "ppdb", path: "ppdb" },
  { name: "Pengumuman", icon: Bell, countKey: "announcements", path: "pengumuman" },
  { name: "Berita", icon: FileText, countKey: "news", path: "berita" },
  { name: "Program Keahlian", icon: BookOpen, countKey: "programs", path: "program-keahlian" },
  { name: "Guru & Tendik", icon: Users, countKey: "teachers", path: "guru-tendik" },
  { name: "Fasilitas", icon: FolderOpen, countKey: "facilities", path: "fasilitas" },
  { name: "Prestasi", icon: Trophy, countKey: "achievements", path: "prestasi" },
  { name: "Galeri", icon: ImageIcon, countKey: "gallery", path: "galeri" },
  { name: "Ekstrakurikuler", icon: Users, countKey: "extracurriculars", path: "ekstrakurikuler" },
  { name: "FAQ", icon: FileText, countKey: "faqs", path: "faq" },
];

export default function AdminPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [schoolName, setSchoolName] = useState("SMK Lingga Kencana Depok");
  const [studentCount, setStudentCount] = useState("-");
  const [username, setUsername] = useState("Admin");
  const modules = useMemo(() => moduleDefs.map((m) => ({ ...m, count: m.countKey === "profile" ? 1 : (counts[m.countKey] ?? 0) })), [counts]);
  const stats = useMemo(() => [
    ["Total Siswa", studentCount, "Data profil sekolah", Users],
    ["Guru & Tendik", String(counts.teachers ?? 0), "Jumlah data di penyimpanan data", Users],
    ["Program Keahlian", String(counts.programs ?? 0), "Jumlah data di penyimpanan data", BookOpen],
    ["Konten Website", String(Object.values(counts).reduce<number>((sum, count) => sum + Number(count), 0)), "Total konten dari database", FileText],
  ], [counts]);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => { if (d?.user?.username) setUsername(d.user.username); }).catch(() => {});
    fetch("/api/profile", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => { if (d?.name) setSchoolName(d.name); if (d?.students) setStudentCount(String(d.students)); }).catch(() => {});
    fetch("/api/dashboard/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil statistik.");
        setCounts(data.counts || {});
      })
      .catch(() => setCounts({}))
      .finally(() => setStatsLoading(false));
  }, []);

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/admin/login"); }

  return (
    <AdminGuard><div className="min-h-screen bg-slate-50 text-slate-900">
      {open && <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2 py-2"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">Admin Panel</p><h1 className="mt-1 text-lg font-black">{schoolName}</h1></div><button onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"><X size={19} /></button></div>
        <nav className="mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto pb-4">
          {["Dashboard", ...modules.map((m) => m.name), "Pengaturan"].map((item) => { const mod = modules.find((m) => m.name === item); const Icon = mod?.icon ?? (item === "Dashboard" ? LayoutDashboard : Settings); return <button key={item} onClick={() => { setActive(item); setOpen(false); if (item === "Berita") router.push("/admin/berita");
 if (item === "Program Keahlian") router.push("/admin/program-keahlian");
 if (item === "Guru & Tendik") router.push("/admin/guru-tendik");
 if (item === "Fasilitas") router.push("/admin/fasilitas");
 if (item === "Prestasi") router.push("/admin/prestasi");
 if (item === "Galeri") router.push("/admin/galeri");
 if (item === "Ekstrakurikuler") router.push("/admin/ekstrakurikuler");
 if (item === "FAQ") router.push("/admin/faq");
 if (item === "Profil Sekolah") router.push("/admin/profil");
 if (item === "PPDB") router.push("/admin/ppdb");
 if (item === "Pengumuman") router.push("/admin/pengumuman");
 if (item === "Pengaturan") router.push("/admin/pengaturan"); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${active === item ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={19} /><span>{item}</span>{mod && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs">{mod.count}</span>}</button>; })}
        </nav>
        <div className="mt-4 shrink-0 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Status</p><p className="mt-1 text-sm font-bold text-emerald-700">Admin Aktif</p><p className="mt-1 text-xs leading-5 text-slate-500">Terhubung ke penyimpanan data / API.</p></div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button onClick={() => setOpen(true)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"><Menu size={22} /></button><div><p className="text-xs font-bold text-slate-500">Panel Administrasi</p><p className="font-black">{active}</p></div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold sm:flex"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-700 text-white">{username.slice(0,1).toUpperCase()}</span> {username}</button><button onClick={logout} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" title="Keluar"><LogOut size={19} /></button></div></header>

        <div className="mx-auto max-w-7xl p-5 md:p-8">
          
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-black uppercase tracking-[.15em] text-blue-700">Dashboard</p><h2 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">Selamat datang, Admin.</h2><p className="mt-2 max-w-2xl leading-7 text-slate-500">Kelola konten website sekolah dari satu tempat. Data konten dikelola melalui API dan database penyimpanan data.</p></div><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-800">Lihat Website</a></div>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, desc, Icon]) => { const I = Icon as typeof Users; return <div key={label as string} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-2xl bg-blue-50 p-3 text-blue-700"><I size={21} /></span><BarChart3 size={18} className="text-slate-300" /></div><p className="mt-5 text-3xl font-black">{value as string}</p><p className="mt-1 font-bold">{label as string}</p><p className="mt-2 text-xs leading-5 text-slate-500">{desc as string}</p></div> })}</section>
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="text-xl font-black">Modul Konten</h3><p className="mt-1 text-sm text-slate-500">Modul konten yang terhubung ke API dan database penyimpanan data.</p></div><Settings size={20} className="text-slate-400" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{modules.map(({name, icon: Icon, count}) => <button key={name} onClick={() => router.push(`/admin/${modules.find(m => m.name === name)?.path ?? ""}`)} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50"><span className="rounded-xl bg-slate-100 p-3 text-slate-700"><Icon size={19} /></span><span><span className="block font-bold">{name}</span><span className="mt-1 block text-xs text-slate-500">{statsLoading ? "Memuat..." : `${count} data di penyimpanan data`}</span></span><ChevronRight className="ml-auto text-slate-300" size={18} /></button>)}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-black">Alur Pengembangan</h3><div className="mt-6 space-y-4">{["Frontend publik", "Dashboard admin", "API backend", "penyimpanan data (saat ini)", "Login & hak akses"].map((x, i) => <div key={x} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-700">{i + 1}</span><span className="text-sm font-bold">{x}</span>{i === 3 && <span className="ml-auto text-xs font-semibold text-emerald-600">aktif</span>}</div>)}</div><div className="mt-7 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800"><b>Catatan:</b> data resmi sekolah sebaiknya dimasukkan setelah validasi dengan pihak sekolah.</div></div></section>
        </div>
      </main>
    </div></AdminGuard>
  );
}
