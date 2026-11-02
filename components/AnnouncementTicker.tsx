import Link from "next/link";
import { listRows } from "@/lib/store";

export default async function AnnouncementTicker() {
  const announcements = (await listRows("announcements")).slice(0, 8) as any[];
  if (!announcements.length) return null;

  return (
    <section aria-label="Pengumuman terbaru" className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="ticker-window flex min-h-[84px] w-full items-center overflow-hidden bg-slate-50">
        <div className="ticker-track flex w-max shrink-0 items-center gap-12 px-6 py-3">
            {[...announcements, ...announcements].map((item, index) => (
              <Link key={`${item.id}-${index}`} href="/pengumuman" className="group inline-flex max-w-[620px] items-center gap-3 text-sm font-semibold text-slate-700 hover:text-brand-700">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                <span className="truncate">{item.title}</span>
                {item.date && <span className="shrink-0 text-xs font-medium text-slate-400">{item.date}</span>}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
