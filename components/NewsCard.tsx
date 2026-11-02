import type { NewsItem } from "@/data/home";

export default function NewsCard({ item }: { item: NewsItem & { image_url?: string | null } }) {
  return (
    <article className="card-hover overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="aspect-[16/10] w-full object-cover" />
      ) : (
        <div className="photo-placeholder aspect-[16/10]" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
            {item.category}
          </span>
          <time className="text-xs text-slate-400">{item.date}</time>
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-slate-900">
          {item.title}
        </h3>
        <p className="news-excerpt mt-2 text-sm leading-6 text-slate-500">
          {item.excerpt}
        </p>
        <a
          href={`/berita/${item.id}`}
          className="mt-5 inline-block text-sm font-extrabold text-brand-600"
        >
          Baca selengkapnya →
        </a>
      </div>
    </article>
  );
}