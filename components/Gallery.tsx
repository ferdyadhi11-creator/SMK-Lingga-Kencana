type GalleryItem = {
  id: number;
  title: string;
  category: string;
  className: string;
  image_url?: string | null;
};

export default function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid auto-rows-[180px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`photo-placeholder group relative overflow-hidden rounded-3xl ${item.className}`}
        >
          {item.image_url && <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-900/80 via-transparent to-transparent p-5 opacity-0 transition group-hover:opacity-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                {item.category}
              </p>
              <p className="mt-1 font-extrabold text-white">{item.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}