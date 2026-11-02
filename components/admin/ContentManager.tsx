"use client";
import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";

type Field = { key: string; label: string; placeholder?: string; textarea?: boolean; image?: boolean; required?: boolean; type?: string; maxLength?: number };
type Item = { id: number; [key: string]: string | number | null };

type Props = {
  title: string;
  description: string;
  collection: string;
  fields: Field[];
  initialItems?: Item[];
};

export default function ContentManager({ title, description, collection, fields, initialItems = [] }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function emptyForm() {
    const x: Record<string, string> = {};
    fields.forEach(f => x[f.key] = "");
    return x;
  }

  function reset() {
    setForm(emptyForm());
    setEditing(null);
  }

  async function load() {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/content/${collection}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data.");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengambil data.");
    } finally { setLoading(false); }
  }

  useEffect(() => { reset(); load(); }, [collection]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const missing = fields.filter(f => f.required !== false && !String(form[f.key] || "").trim());
    if (missing.length) {
      setError(`Lengkapi field wajib: ${missing.map(f => f.label).join(", ")}.`); return;
    }
    setSaving(true); setError("");
    try {
      const payload = editing === null ? form : { ...form, id: editing };
      const res = await fetch(`/api/content/${collection}`, {
        method: editing === null ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");
      await load();
      setNotice(editing === null ? `${title} berhasil ditambahkan ke penyimpanan data.` : `${title} berhasil diperbarui di penyimpanan data.`);
      reset();
      setTimeout(() => setNotice(""), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan data.");
    } finally { setSaving(false); }
  }

  function edit(item: Item) {
    setEditing(item.id);
    const f: Record<string, string> = {};
    fields.forEach(k => f[k.key] = String(item[k.key] ?? ""));
    setForm(f);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number) {
    if (!confirm(`Hapus data ${title.toLowerCase()} ini?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/content/${collection}?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");
      await load();
      setNotice("Data berhasil dihapus dari penyimpanan data.");
      setTimeout(() => setNotice(""), 3000);
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal menghapus data."); }
  }

  return <div className="space-y-6">
    {notice && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">{notice}</div>}
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">{error}</div>}
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-black">{editing !== null ? `Edit ${title}` : `Tambah ${title}`}</h2><p className="mt-1 text-sm text-slate-500">Data disimpan melalui API ke penyimpanan data.</p></div>{editing !== null && <button type="button" onClick={reset} className="rounded-xl p-2 hover:bg-slate-100"><X size={20}/></button>}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{fields.map(f => <label key={f.key} className={`block ${f.textarea || f.image ? "md:col-span-2" : ""}`}><span className="text-sm font-bold">{f.label}</span>{f.image ? <div className="mt-2 space-y-3"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={async e=>{const file=e.target.files?.[0]; if(!file)return; setUploading(true); setError(""); try{const fd=new FormData(); fd.append("file",file); const res=await fetch("/api/upload",{method:"POST",body:fd}); const data=await res.json(); if(!res.ok) throw new Error(data.error||"Upload gagal"); setForm({...form,[f.key]:data.url}); setNotice("Gambar berhasil diunggah.");}catch(err){setError(err instanceof Error?err.message:"Upload gagal.")}finally{setUploading(false)}}} className="w-full rounded-xl border border-slate-200 px-4 py-3"/><input required={f.required !== false} value={form[f.key] || ""} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder || "/uploads/nama-file.jpg"} className="w-full rounded-xl border border-slate-200 px-4 py-3"/>{form[f.key] && <img src={form[f.key]} alt="Pratinjau" className="h-40 w-full rounded-2xl bg-slate-50 object-contain"/>}</div> : f.textarea ? <textarea required={f.required !== false} maxLength={f.maxLength} rows={4} value={form[f.key] || ""} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/> : <input required={f.required !== false} maxLength={f.maxLength} type={f.type || "text"} value={form[f.key] || ""} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"/>}</label>)}</div>
      <button disabled={saving || uploading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800 disabled:opacity-60">{editing !== null ? <Pencil size={17}/> : <Plus size={17}/>} {uploading ? "Mengunggah gambar..." : saving ? "Menyimpan..." : editing !== null ? "Simpan Perubahan" : "Tambah Data"}</button>
    </form>
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">Daftar {title}</h2><p className="mt-1 text-sm text-slate-500">{items.length} data tersimpan di penyimpanan data.</p></div><button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50"><RefreshCw size={16}/> Refresh</button></div>
      {loading ? <p className="mt-6 text-sm text-slate-500">Memuat data...</p> : items.length === 0 ? <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Belum ada data.</p> : <div className="mt-5 grid gap-3">{items.map(x=><article key={x.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center"><div className="min-w-0 flex-1"><h3 className="font-black">{String(x[fields[0].key] ?? "")}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{String(x[fields[1]?.key] ?? "")}</p></div><div className="flex gap-2"><button type="button" onClick={()=>edit(x)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><Pencil size={17}/></button><button type="button" onClick={()=>remove(x.id)} className="rounded-xl border border-red-100 p-2.5 text-red-600 hover:bg-red-50"><Trash2 size={17}/></button></div></article>)}</div>}
    </div>
  </div>;
}
