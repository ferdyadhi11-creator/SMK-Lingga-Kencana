import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/data/home";
type ProgramWithImage = Program & { image_url?: string | null };

export default function ProgramCard({ program }: { program: ProgramWithImage }) {
  return (
    <article className="card-hover group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="photo-placeholder relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl p-4">
        {program.image_url && <img src={program.image_url} alt={program.name} className="absolute inset-0 h-full w-full object-contain bg-slate-50" />}
        <span className="relative rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-brand-900 shadow">
          {program.short || String(program.name || "Program").split(/\s+/).map((x) => x[0]).slice(0,3).join("").toUpperCase()}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-extrabold text-slate-900">
        {program.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {program.description}
      </p>
      <a
        href={`/program-keahlian/${program.id}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold text-brand-600"
      >
        Lihat Program <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
    </article>
  );
}