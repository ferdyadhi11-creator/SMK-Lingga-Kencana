import { ArrowRight, Award, Building2, CheckCircle2, GraduationCap, MapPin, Users, WalletCards } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickInfo from "@/components/QuickInfo";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";
import NewsCard from "@/components/NewsCard";
import Gallery from "@/components/Gallery";
import SchoolMap from "@/components/SchoolMap";
import Footer from "@/components/Footer";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import LiveClock from "@/components/LiveClock";
import { getProfile, listRows } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = (await getProfile()) as any;
  const dbPrograms = [...(await listRows("programs"))].reverse() as any[];
  const dbNews = (await listRows("news")).slice(0, 3) as any[];
  const dbFacilities = (await listRows("facilities")).slice(0, 5) as any[];
  const dbAchievements = (await listRows("achievements")).slice(0, 3) as any[];
  const dbGallery = (await listRows("gallery")).slice(0, 6) as any[];
  const schoolInfo = profile || {};
  const programs = dbPrograms.map((x) => ({ ...x, short: String(x.name || "").split(/\s+/).map((w:string)=>w[0]).join("").slice(0,3).toUpperCase() }));
  const news = dbNews;
  const facilities = dbFacilities;
  const achievements = dbAchievements.map((x) => ({ ...x, level: x.year || "Prestasi" }));
  const galleryItems = dbGallery.map((x, i) => ({ ...x, category: "Dokumentasi", className: i === 0 ? "lg:col-span-2 lg:row-span-2" : "" }));
  const mapAddress = schoolInfo.address || "";
  return (
    <>
      <Navbar />
      <main id="beranda">
        <Hero schoolInfo={schoolInfo} />

        <section className="home-utility border-b border-slate-200 bg-white py-5 md:py-6">
          <div className="container-page grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-stretch">
            <AnnouncementTicker />
            <LiveClock />
          </div>
        </section>

        <section className="bg-surface py-6 md:py-8">
          <QuickInfo />
        </section>

        <section id="profil" className="section-padding bg-white">
          <div className="container-page">
            <div className="reveal overflow-hidden rounded-[34px] border border-slate-100 bg-slate-950 shadow-soft">
              {schoolInfo.profile_image_url ? (
                <img
                  src={schoolInfo.profile_image_url}
                  alt={`Foto profil ${schoolInfo.name || "sekolah"}`}
                  className="block h-[620px] w-full object-cover object-center md:h-[700px] lg:h-[760px]"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="grid h-[620px] place-items-center p-8 text-center md:h-[700px] lg:h-[760px]">
                  <div>
                    <p className="text-sm font-bold text-brand-400">Profil Sekolah</p>
                    <p className="mt-2 text-2xl font-black text-white">{schoolInfo.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Foto profil sekolah belum diunggah.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto mt-12 max-w-5xl">
              <span className="eyebrow">Profil Sekolah</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">Satu tempat untuk mengenal sekolah lebih dekat.</h2>
              <p className="mt-5 max-w-4xl leading-8 text-slate-600">Website ini dirancang sebagai media informasi terpadu untuk membantu masyarakat, orang tua atau wali, calon siswa, dan warga sekolah memperoleh informasi sekolah dengan lebih mudah.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-brand-50 p-6"><Building2 className="text-brand-700" /><p className="mt-4 font-bold text-brand-950">Profil Terstruktur</p><p className="mt-2 text-sm leading-6 text-slate-600">Identitas, sejarah, visi, misi, dan struktur sekolah dapat disajikan berdasarkan data resmi.</p></div>
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6"><CheckCircle2 className="text-brand-700" /><p className="mt-4 font-bold text-brand-950">Informasi Terpadu</p><p className="mt-2 text-sm leading-6 text-slate-600">Program, fasilitas, berita, prestasi, galeri, PPDB, kontak, dan lokasi berada dalam satu website.</p></div>
              </div>
              <a href="/profil" className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-800">Lihat Profil <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section id="guru" className="section-padding bg-surface">
          <div className="container-page">
            <SectionHeading eyebrow="Sekilas Data" title="Informasi Singkat Sekolah" description="Angka berikut mengikuti data profil sekolah dan perlu dikonfirmasi sebelum dipublikasikan sebagai data resmi." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [GraduationCap, schoolInfo.students || "Belum diisi", "Data siswa"],
                [Users, schoolInfo.teachers_count || "Belum diisi", "Guru & tenaga kependidikan"],
                [WalletCards, String(programs.length), "Program keahlian"],
                [MapPin, schoolInfo.location || "Belum diisi", "Lokasi sekolah"],
              ].map(([Icon, value, label]) => {
                const IconComp = Icon as typeof GraduationCap;
                return <div key={label as string} className="card-hover rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><IconComp className="text-brand-700" size={23} /><p className="mt-5 text-3xl font-black text-slate-900">{value as string}</p><p className="mt-1 text-sm font-semibold text-slate-500">{label as string}</p></div>;
              })}
            </div>
          </div>
        </section>

        <section id="program" className="section-padding bg-white">
          <div className="container-page"><SectionHeading eyebrow="Program Keahlian" title="Temukan bidang yang sesuai dengan minatmu" description="Informasi program keahlian ditampilkan berdasarkan data yang tersedia di website dan dapat diperbarui setelah validasi bersama pihak sekolah." /><div className="mt-10 grid gap-5 md:grid-cols-3">{programs.length ? programs.map((program) => <ProgramCard key={program.id} program={program} />) : <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-500 md:col-span-3">Belum ada program keahlian yang dipublikasikan.</div>}</div></div>
        </section>

        <section id="fasilitas" className="section-padding bg-surface">
          <div className="container-page"><SectionHeading eyebrow="Fasilitas" title="Ruang untuk belajar dan berkembang" description="Informasi fasilitas ditampilkan berdasarkan data yang dikelola melalui dashboard admin." /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{facilities.length ? facilities.map((facility) => <div key={facility.id} className="card-hover overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"><div className="facility-placeholder relative flex aspect-[4/3] items-center justify-center overflow-hidden text-4xl font-black text-brand-200">{(facility as any).image_url ? <img src={(facility as any).image_url} alt={facility.name} className="absolute inset-0 h-full w-full object-cover" /> : (facility as any).icon || "▦"}</div><div className="p-5"><h3 className="font-bold text-slate-900">{facility.name}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{(facility as any).description || ""}</p></div></div>) : <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 sm:col-span-2 lg:col-span-5">Belum ada fasilitas yang dipublikasikan.</div>}</div></div>
        </section>

        <section id="berita" className="section-padding bg-white"><div className="container-page"><SectionHeading eyebrow="Berita & Informasi" title="Tetap terhubung dengan kegiatan sekolah" description="Berita terbaru akan mengikuti data yang dikelola melalui dashboard admin." /><div className="mt-10 grid gap-6 md:grid-cols-3">{news.length ? news.map((item) => <NewsCard key={item.id} item={item} />) : <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-500 md:col-span-3">Belum ada berita yang dipublikasikan.</div>}</div></div></section>

        <section id="prestasi" className="section-padding bg-surface"><div className="container-page"><SectionHeading eyebrow="Prestasi" title="Ruang untuk setiap pencapaian" description="Prestasi sekolah dan siswa ditampilkan berdasarkan data yang dikelola melalui dashboard admin." /><div className="mt-10 grid gap-5 md:grid-cols-3">{achievements.length ? achievements.map((item) => <article key={item.id} className="card-hover rounded-3xl border border-slate-100 bg-white p-7 shadow-sm"><div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-yellow-100 text-yellow-700">{(item as any).image_url ? <img src={(item as any).image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" /> : <Award size={23} />}</div><p className="mt-6 text-sm font-bold text-brand-600">{item.level}</p><h3 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p></article>) : <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 md:col-span-3">Belum ada prestasi yang dipublikasikan.</div>}</div></div></section>

        <section id="galeri" className="section-padding bg-white"><div className="container-page"><SectionHeading eyebrow="Galeri" title="Dokumentasi kegiatan sekolah" description="Dokumentasi galeri ditampilkan berdasarkan data dan gambar yang dikelola melalui dashboard admin." /><div className="mt-10">{galleryItems.length ? <Gallery items={galleryItems} /> : <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-500">Belum ada dokumentasi galeri yang dipublikasikan.</div>}</div></div></section>

        <section id="ppdb" className="section-padding bg-surface"><div className="container-page"><div className="relative overflow-hidden rounded-[36px] bg-[#041d38] px-7 py-12 text-white shadow-soft md:px-12"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" /><div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><span className="text-sm font-black uppercase tracking-[.18em] text-yellow-300">PPDB</span><h2 className="mt-3 max-w-3xl text-3xl font-black md:text-5xl">Informasi penerimaan peserta didik dalam satu halaman.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-200">Jadwal, persyaratan, alur pendaftaran, dan informasi lainnya tersedia pada halaman PPDB.</p></div><a href="/ppdb" className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3.5 font-extrabold text-brand-950 transition hover:-translate-y-0.5 hover:bg-yellow-300">Buka PPDB <ArrowRight size={18} /></a></div></div></div></section>

        <section id="kontak" className="section-padding bg-white"><div className="container-page grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><div><span className="eyebrow">Kontak & Lokasi</span><h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Temukan lokasi sekolah</h2><p className="mt-4 leading-7 text-slate-600">Informasi kontak dan lokasi sekolah dapat diperbarui melalui Dashboard Admin setelah data dikonfirmasi bersama pihak sekolah.</p><div className="mt-8 space-y-4"><div className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-semibold text-brand-600">Alamat</p><p className="mt-1 font-bold leading-6 text-slate-900">{schoolInfo.address}</p></div><div className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-semibold text-brand-600">Telepon & Email</p><p className="mt-1 font-bold text-slate-900">{schoolInfo.phone || "Belum diisi"} · {schoolInfo.email || "Belum diisi"}</p></div></div></div><SchoolMap name={schoolInfo.name} address={mapAddress} compact /></div></section>

        
      </main>
      <Footer />
    </>
  );
}
