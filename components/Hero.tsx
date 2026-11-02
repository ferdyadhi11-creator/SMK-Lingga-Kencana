import { ArrowRight, BookOpen, MapPin, Sparkles } from "lucide-react";
type HeroProps = { schoolInfo: { name?: string; location?: string; hero_url?: string; logo_url?: string; hero_badge?: string; hero_title?: string; hero_description?: string; hero_programs?: string } };

export default function Hero({ schoolInfo }: HeroProps) {
  return (
    <section className="home-hero relative isolate overflow-hidden bg-slate-950 text-white">
      {schoolInfo.hero_url ? (
        <img src={schoolInfo.hero_url} alt={`Foto utama ${schoolInfo.name || "sekolah"}`} className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" decoding="async" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-800 to-slate-900" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,20,38,.9)_0%,rgba(2,20,38,.68)_42%,rgba(2,20,38,.25)_78%,rgba(2,20,38,.4)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" aria-hidden="true" />
      <div className="container-page relative flex min-h-[620px] items-end py-16 md:min-h-[700px] md:py-20 lg:min-h-[760px]">
        <div className="max-w-4xl reveal">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-white backdrop-blur-md">
            <Sparkles size={14} className="text-yellow-300" aria-hidden="true" />
            {schoolInfo.hero_badge || "Website Profil Sekolah"}
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-white drop-shadow-md md:text-6xl lg:text-7xl">
            {schoolInfo.hero_title || schoolInfo.name || "SMK Lingga Kencana Depok"}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/90 drop-shadow md:text-lg">
            {schoolInfo.hero_description || `Informasi profil, program keahlian, fasilitas, kegiatan, prestasi, dan PPDB ${schoolInfo.name || "sekolah"} dalam satu media yang mudah diakses.`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#profil" className="btn-primary">Kenali Sekolah <ArrowRight size={18} aria-hidden="true" /></a>
            <a href="#program" className="btn-glass"><BookOpen size={18} aria-hidden="true" /> Program Keahlian</a>
            <a href="/ppdb" className="btn-glass">Informasi PPDB <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
            {schoolInfo.location && <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-yellow-300" aria-hidden="true" /> {schoolInfo.location}</span>}
            {schoolInfo.hero_programs && <span>{schoolInfo.hero_programs}</span>}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 hidden rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-xs font-semibold text-white/80 backdrop-blur-md lg:block">Informasi resmi sekolah</div>
    </section>
  );
}
