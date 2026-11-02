"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { NewsItem } from "@/data/home";

type FormState = Omit<NewsItem, "id" | "content" | "image_url"> & { content: string; image_url: string };
const emptyForm: FormState = {
  category: "Kegiatan",
  date: "",
  title: "",
  excerpt: "",
  content: "",
  image_url: "",
};

type ApiNewsItem = NewsItem & {
  image_url?: string | null;
  content?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function NewsManager() {
  const [items, setItems] = useState<ApiNewsItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadNews() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/content/news", { cache: "no-store" });
      if (!response.ok) throw new Error("Gagal mengambil data berita.");
      const data = (await response.json()) as ApiNewsItem[];
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data berita.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNews();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim()) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...(editing !== null ? { id: editing } : {}),
        category: form.category,
        date: form.date,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        image_url: form.image_url || null,
      };

      const response = await fetch("/api/content/news", {
        method: editing !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Gagal menyimpan berita.");
      }

      setNotice(editing !== null ? "Berita berhasil diperbarui di database." : "Berita berhasil ditambahkan ke database.");
      setForm(emptyForm);
      setEditing(null);
      await loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  }

  function edit(item: ApiNewsItem) {
    setEditing(item.id);
    setForm({
      category: item.category,
      date: item.date ?? "",
      title: item.title,
      excerpt: item.excerpt,
      content: item.content ?? "",
      image_url: item.image_url ?? "",
    });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number) {
    if (!window.confirm("Hapus berita ini dari database?")) return;

    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/content/news?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Gagal menghapus berita.");

      setNotice("Berita berhasil dihapus dari database.");
      if (editing === id) {
        setEditing(null);
        setForm(emptyForm);
      }
      await loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus berita.");
    }
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setNotice("");
    setError("");
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">{editing !== null ? "Edit Berita" : "Tambah Berita"}</h2>
            <p className="mt-1 text-sm text-slate-500">Data berita disimpan ke penyimpanan data melalui API.</p>
          </div>
          {editing !== null && (
            <button type="button" onClick={cancelEdit} className="rounded-xl p-2 hover:bg-slate-100" title="Batal edit">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold">Kategori</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Kegiatan</option>
              <option>Pengumuman</option>
              <option>PPDB</option>
              <option>Prestasi</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold">Tanggal</span>
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="3 Oktober 2026" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold">Judul</span>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Judul berita" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold">Ringkasan</span>
            <textarea required rows={4} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Ringkasan berita..." />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold">Isi Berita</span>
            <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Isi lengkap berita..." />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-bold">Foto Berita</span>
          <div className="mt-2 space-y-3">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              setSaving(true); setError("");
              try {
                const fd = new FormData(); fd.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const data = await res.json(); if (!res.ok) throw new Error(data.error || "Upload gagal.");
                setForm((prev) => ({ ...prev, image_url: data.url })); setNotice("Foto berita berhasil diunggah.");
              } catch (err) { setError(err instanceof Error ? err.message : "Upload gagal."); }
              finally { setSaving(false); }
            }} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/uploads/foto-berita.jpg atau URL gambar" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            {form.image_url && <img src={form.image_url} alt="Pratinjau foto berita" className="h-40 w-full rounded-2xl bg-slate-50 object-contain" />}
          </div>
        </label>

        <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
          {editing !== null ? <Pencil size={17} /> : <Plus size={17} />}
          {saving ? "Menyimpan..." : editing !== null ? "Simpan Perubahan" : "Tambah Berita"}
        </button>
      </form>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black">Daftar Berita</h2>
            <p className="mt-1 text-sm text-slate-500">{items.length} berita tersimpan.</p>
          </div>
          <button type="button" onClick={() => void loadNews()} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50">
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Memuat berita...</p>
        ) : items.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Belum ada berita di database. Silakan tambah berita pertama.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{item.category}</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="mt-2 font-black">{item.title}</h3>
                  <p className="admin-excerpt mt-1 text-sm leading-6 text-slate-500">{item.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => edit(item)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" title="Edit">
                    <Pencil size={17} />
                  </button>
                  <button type="button" onClick={() => void remove(item.id)} className="rounded-xl border border-red-100 p-2.5 text-red-600 hover:bg-red-50" title="Hapus">
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
