"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => { fetch("/api/profile", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(setProfile).catch(() => {}); }, []);
  const name = profile?.name || "Website Profil Sekolah";
  const location = profile?.location || "";
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-900 text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-black text-brand-700">{profile?.logo_url ? <img src={profile.logo_url} alt={`Logo ${name}`} className="h-full w-full rounded-full object-contain p-1" /> : "LK"}</div>
            <div><p className="font-black">{name}</p><p className="text-xs text-blue-200">{location}</p></div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100">Website profil sekolah sebagai media informasi terpadu bagi masyarakat dan calon siswa.</p>
        </div>
        <div><h3 className="font-extrabold">Navigasi</h3><div className="mt-4 grid grid-cols-2 gap-3 text-sm text-blue-100"><a href="/profil" className="hover:text-white">Profil</a><a href="/program-keahlian" className="hover:text-white">Program</a><a href="/berita" className="hover:text-white">Berita</a><a href="/prestasi" className="hover:text-white">Prestasi</a><a href="/galeri" className="hover:text-white">Galeri</a><a href="/kontak" className="hover:text-white">Kontak</a><a href="/ekstrakurikuler" className="hover:text-white">Ekstrakurikuler</a><a href="/calon-siswa" className="hover:text-white">Calon Siswa</a><a href="/faq" className="hover:text-white">FAQ</a></div></div>
        <div><h3 className="font-extrabold">Kontak</h3><div className="mt-4 space-y-2 text-sm leading-6 text-blue-100"><p>{profile?.address || "Alamat belum diisi"}</p><p>{profile?.phone || "Nomor telepon belum diisi"}</p><p>{profile?.email || "Email belum diisi"}</p>{profile?.whatsapp&&<a href={`https://wa.me/${String(profile.whatsapp).replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer" className="block hover:text-white">WhatsApp</a>}{profile?.instagram&&<a href={profile.instagram} target="_blank" rel="noreferrer" className="block hover:text-white">Instagram</a>}{profile?.facebook&&<a href={profile.facebook} target="_blank" rel="noreferrer" className="block hover:text-white">Facebook</a>}{profile?.youtube&&<a href={profile.youtube} target="_blank" rel="noreferrer" className="block hover:text-white">YouTube</a>}{profile?.tiktok&&<a href={profile.tiktok} target="_blank" rel="noreferrer" className="block hover:text-white">TikTok</a>}</div></div>
      </div>
      <div className="border-t border-white/10"><div className="container-page flex flex-col gap-2 py-5 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between"><p>© {year} {name}. All rights reserved.</p><p>Website Profil Sekolah</p></div></div>
    </footer>
  );
}
