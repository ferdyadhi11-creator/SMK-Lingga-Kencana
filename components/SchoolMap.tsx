import { ExternalLink, MapPin } from "lucide-react";

type Props = { name?: string; address?: string; compact?: boolean };

export default function SchoolMap({ name = "Website Profil Sekolah", address = "", compact = false }: Props) {
  const query = encodeURIComponent(address);
  const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return (
    <div className={`overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-sm ${compact ? "" : "h-full"}`}>
      <div className="relative overflow-hidden bg-slate-100">
        {address ? <iframe
          title={`Peta lokasi ${name}`}
          src={embedUrl}
          className={`block w-full border-0 ${compact ? "h-[330px]" : "h-[470px]"}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        /> : <div className={`grid place-items-center p-8 text-center ${compact ? "h-[330px]" : "h-[470px]"}`}><div><MapPin className="mx-auto text-slate-300" size={38}/><p className="mt-3 font-black text-slate-700">Lokasi belum diisi</p><p className="mt-1 text-sm text-slate-500">Peta akan tampil setelah alamat resmi dikonfirmasi.</p></div></div>}
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><MapPin size={18} /></span>
          <div>
            <p className="font-black text-slate-900">{name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{address}</p>
          </div>
        </div>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-800">
          Buka Google Maps <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
