# Youth College Admin Dashboard

> Dashboard administrasi untuk manajemen peserta Youth Welcoming College 2025.

## Fitur Utama
- Manajemen peserta (CRUD)
- Autentikasi admin
- Export data peserta ke Excel & PDF (dengan format khusus)
- Responsive UI (mobile & desktop)
- Upload & tampilan gambar (folder public/images)

## Instalasi
1. Clone repository ini
2. Jalankan perintah berikut:
	```bash
	npm install
	```
3. Buat file `.env.local` dan atur variabel berikut:
	```env
	NEXT_PUBLIC_API_BASE_URL=http://[IP-backend]:8001
	```
	Ganti `[IP-backend]` dengan alamat backend API Anda.

## Menjalankan Project
```bash
npm run dev
```
Lalu akses di browser: `http://localhost:3000` atau `http://[IP-komputer]:3000` dari HP di jaringan yang sama.

## Struktur Folder Penting
- `src/components/` : Komponen React
- `src/app/`        : Routing & halaman Next.js
- `public/images/`  : Tempat upload gambar statis

## Export Data
- Excel: tombol export di halaman peserta, hasil file .xlsx
- PDF: tombol export di halaman peserta, hasil file .pdf dengan branding dan format tanggal Indonesia

## Kontribusi
Pull request & issue sangat diterima!

---
© 2025 Youth Multiply
