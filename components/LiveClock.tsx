"use client";
import { useEffect, useState } from "react";

function formatNow(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now)
    : "--:--:--";

  return (
    <section aria-label="Waktu saat ini" className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-full items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
          <span className="live-dot" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="mt-1 text-2xl font-black tracking-tight text-slate-900 tabular-nums" aria-live="polite">{time} WIB</div>
          <div className="text-xs font-semibold capitalize text-slate-500">{now ? formatNow(now) : "Memuat waktu..."}</div>
        </div>
      </div>
    </section>
  );
}
