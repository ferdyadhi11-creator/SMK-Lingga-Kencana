import {
  BookOpen,
  Building2,
  Trophy,
  UsersRound,
} from "lucide-react";

const items = [
  { title: "Program Keahlian", desc: "Pilihan bidang keahlian", icon: BookOpen, href: "/program-keahlian" },
  { title: "Fasilitas", desc: "Pendukung pembelajaran", icon: Building2, href: "/fasilitas" },
  { title: "Prestasi", desc: "Pencapaian sekolah & siswa", icon: Trophy, href: "/prestasi" },
  { title: "Kegiatan Siswa", desc: "Aktivitas dan dokumentasi", icon: UsersRound, href: "/galeri" },
];

export default function QuickInfo() {
  return (
    <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ title, desc, icon: Icon, href }) => (
        <a
          key={title}
          href={href}
          className="card-hover rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Icon size={21} />
          </div>
          <h3 className="mt-5 font-extrabold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{desc}</p>
          <span className="mt-5 inline-block text-sm font-bold text-brand-600">
            Lihat selengkapnya →
          </span>
        </a>
      ))}
    </div>
  );
}