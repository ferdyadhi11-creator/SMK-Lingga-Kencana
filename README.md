# SMK Lingga Kencana — Website Profil Sekolah + Admin Backend v20

## Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS
- Netlify Blobs (produksi) / file JSON lokal (`npm run dev`)
- Session authentication dengan HTTP-only cookie

## Jalankan
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

## Admin
Buka `http://localhost:3000/admin/login`.

Akun prototype lokal:
- Username: `admin`
- Password: nilai `ADMIN_PASSWORD` dari file `.env.local`

Untuk server produksi, set environment variable:
```env
ADMIN_PASSWORD=password-kuat
```

## Modul SQLite
- Profil Sekolah
- Berita
- Pengumuman
- PPDB
- Program Keahlian
- Guru & Tendik
- Fasilitas
- Prestasi
- Galeri
- Ekstrakurikuler
- FAQ
- Pencarian informasi
- Halaman calon siswa

## Keamanan tahap v4
- Login menggunakan endpoint backend.
- Session disimpan sebagai hash token di SQLite.
- Cookie session bersifat HTTP-only.
- POST/PUT/DELETE konten membutuhkan session admin.
- GET konten tetap terbuka agar halaman publik dapat membaca data.
- Password awal hanya untuk prototype lokal dan wajib diganti sebelum deployment.

## Catatan
Data resmi sekolah tetap harus divalidasi dengan pihak SMK Lingga Kencana sebelum dipublikasikan.


## v8
- Halaman detail berita `/berita/[id]`.
- Pencarian dan filter kategori berita.
- Kartu berita menuju detail masing-masing.
- Beranda memakai data SQLite untuk konten utama.

## Konfigurasi awal admin
1. Salin `.env.example` menjadi `.env.local`.
2. Isi `ADMIN_PASSWORD` dengan password pribadi yang kuat.
3. Jalankan `npm install` lalu `npm run dev`.
4. Login menggunakan username `admin` dan password dari `ADMIN_PASSWORD`.
5. Setelah masuk, ganti password melalui menu **Pengaturan**.

Password bootstrap tidak ditanam sebagai kredensial default di source code.

## v20 — Audit & Pengembangan Terpadu
- Menambah data detail program keahlian dan halaman detail per program.
- Menambah modul Ekstrakurikuler dan FAQ pada publik serta dashboard admin.
- Memperluas PPDB: jalur, dokumen, biaya, FAQ, tautan pendaftaran, dan kontak.
- Menambah data identitas: sambutan kepala sekolah, akreditasi, legalitas/status, WhatsApp, media sosial, dan jam pelayanan.
- Menambah pencarian lintas konten dan filter kategori galeri.
- Menambah sitemap, robots, Open Graph metadata, dan URL sitemap berbasis environment.
- Berita kini mendukung isi berita lengkap.
- Memperbaiki fallback lokasi/konten agar tidak menampilkan data contoh yang tidak perlu.
- Memperbaiki login agar kesalahan konfigurasi `ADMIN_PASSWORD` tampil jelas.
- Menjaga database dan upload lama melalui migrasi ringan; tidak menghapus data existing.

## Catatan Validasi
Konten resmi seperti akreditasi, legalitas, data guru, prestasi, jadwal/biaya PPDB, kontak, dan media sosial harus diisi atau dikonfirmasi oleh pihak sekolah sebelum dipublikasikan.


## v25 — Siap Deploy ke Netlify
Penyimpanan SQLite diganti Netlify Blobs agar berjalan di hosting serverless.

1. Upload isi folder ini ke GitHub (atau drag & drop zip pada Netlify).
2. Di Netlify: **Site configuration → Environment variables**, tambahkan:
   - `ADMIN_PASSWORD` — password awal admin
   - `SESSION_SECRET` — teks acak panjang
   - `NEXT_PUBLIC_SITE_URL` — URL situs Anda
3. Deploy. Build command `npm run build` (sudah di `netlify.toml`).
4. Buka `/admin/login`, username `admin`.

Catatan: gambar baru yang diunggah lewat admin disimpan di Netlify Blobs (maks. 4 MB per gambar).
