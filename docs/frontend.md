# Frontend (`frontend-tp`)

Landing page website top-up. Next.js 16 App Router, React 19, TypeScript, MUI 9 + Emotion.

## Menjalankan

```bash
cd frontend-tp
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
npm run lint
```

## Struktur

| File | Tugas |
| --- | --- |
| `src/app/layout.tsx` | Root layout, metadata, font Geist, `lang="id"`, cache MUI (`AppRouterCacheProvider`) |
| `src/app/providers.tsx` | `ThemeProvider` + `CssBaseline` |
| `src/app/page.tsx` | Susun halaman utama |
| `src/app/games/[slug]/page.tsx` | Halaman top-up per produk, metadata, 404 untuk slug tidak dikenal |
| `src/app/globals.css` | Style global |
| `src/data/catalog.ts` | Data demo katalog, paket, metode pembayaran, format rupiah |
| `src/theme.ts` | Tema MUI: primary `#1A73E8`, secondary `#FF6B00`, background `#F5F7FB` |
| `src/components/Header.tsx` | Navigasi (`Home`, `Game`, `Voucher`, `Pulsa`, `E-Wallet`, `Promo`), menu mobile |
| `src/components/Hero.tsx` | Banner utama dan keunggulan layanan |
| `src/components/PaymentBar.tsx` | Daftar channel pembayaran (QRIS, bank, e-wallet, retail) |
| `src/components/GameExplorer.tsx` | Grid produk dengan tab kategori; tiap kartu link ke halaman top-up |
| `src/components/TopUpForm.tsx` | Form ID akun, paket, metode pembayaran, ringkasan, konfirmasi demo |
| `tests/game-routes.mjs` | Smoke check semua route game dan 404 |
| `src/components/PromoSection.tsx` | Kartu promo |
| `src/components/HowItWorks.tsx` | Langkah cara top-up |
| `src/components/Footer.tsx` | Link footer |
| `public/` | Aset SVG bawaan |

Urutan halaman: `Header`, `Hero`, `PaymentBar`, `GameExplorer`, `PromoSection`, `HowItWorks`, `Footer`.

## Pencarian dan navigasi katalog

- Header desktop dan drawer mobile memiliki form pencarian; katalog juga memiliki form yang mempertahankan kategori aktif.
- Query URL `q` (maksimal 100 karakter) dan `category` menjadi sumber filter; URL dapat dibagikan/di-refresh dan navigasi mendukung Back/Forward.
- Pencarian tidak membedakan kapital, memangkas spasi, dan mencocokkan semua kata pada nama produk, slug, kategori, nama paket, atau SKU demo. Hasil berupa kartu produk, bukan daftar paket terpisah.
- Tab kategori mempertahankan query. Menu kategori header memulai kategori baru tanpa query sebelumnya. Kategori tidak dikenal kembali ke Semua; parameter berulang diabaikan untuk query/kategori terkait.
- Jumlah hasil, hasil kosong, dan reset pencarian/kategori tersedia. Form memakai GET dan tombol Cari/Enter; belum ada autocomplete atau live search.
- Home membuka `/`; Game/Voucher/Pulsa/E-Wallet membuka filter `#catalog`; Promo dan CTA Lihat Promo membuka `#promo`; Top Up Sekarang membuka `#catalog`.
- Logika: `src/lib/catalog-search.ts`. Test: `node tests\catalog-search.mjs` dari folder `frontend-tp`.

## Jual beli akun demo

Katalog `/accounts`, listing `/accounts/[game]`, dan detail `/accounts/offers/[id]` tersedia dengan data fiktif untuk empat game. Menu Jual Beli Akun ditambahkan di header desktop/mobile. Listing memiliki pencarian, filter server/harga, urutan, reset, dan empty state. Tidak ada form jual, chat, checkout akun, atau penyimpanan pengguna. Detail dan catatan validasi: [accounts.md](./accounts.md).

## Login dan registrasi

Halaman `/login` dan `/register` memakai `src/components/AuthForm.tsx`: validasi form, tampil/sembunyikan password, konfirmasi password registrasi, serta tombol Google demo. Header desktop dan mobile membuka halaman login. Belum ada akun atau session nyata; data tidak dikirim/disimpan. Detail dan rencana integrasi Google: [auth.md](./auth.md).

## Admin demo

Route `/admin` menyediakan gerbang login demo dan dashboard harga, diskon, promo, serta history pembelian fiktif. Semua perubahan hanya React state dan hilang saat refresh/keluar/meninggalkan halaman. Tidak memengaruhi checkout. Detail: [admin.md](./admin.md).

## Data & Integrasi

- Katalog dan paket demo berada di `src/data/catalog.ts`; promo dan konten lain masih statis di komponen.
- Visual kartu memakai ikon kategori dan inisial buatan sendiri; belum ada artwork game berlisensi. Kartu menampilkan jumlah paket dan harga demo mulai.
- Klik kartu membuka `/games/[slug]` untuk input ID, pilih paket, dan metode pembayaran.
- `src/components/TopUpForm.tsx` menampilkan ringkasan, biaya admin contoh, total, validasi wajib, dan dialog konfirmasi demo. Mobile Legends memakai Zone ID; Genshin memakai pilihan server. Voucher memakai email; pulsa dan e-wallet memakai nomor HP.
- Slug tidak dikenal mengembalikan 404. Semua 12 produk katalog punya halaman demo.
- Checkout mendukung promo demo `HEMAT10` dan membuat catatan pesanan di sessionStorage. Detail `/orders/[id]` dan riwayat `/orders` mendukung simulasi status; belum ada `fetch` BE, verifikasi akun, order server, atau pembayaran nyata. Detail: [orders.md](./orders.md).
- Link footer masih `href="#"`.

## Tahap berikutnya (belum diimplementasikan)

Fokus masih persiapan FE dengan data demo lokal; API vendor belum tersedia. Rencana gabungan FE/BE dan kesenjangan kontrak data: [progress.md](./progress.md).

1. Lengkapi alur akun: profil, lupa password, dan reset password sebagai demo berlabel jelas, tanpa menyimpan password atau mengaku mengirim email.
2. Siapkan halaman bantuan/FAQ dan tautan status pesanan. Isi kontak serta kebijakan produksi menunggu informasi pemilik, bukan dibuat-buat.
3. Rapikan state loading/error/empty dan aksesibilitas seluruh alur. Perluas cek browser untuk keyboard, layar kecil, dan kegagalan penyimpanan.

Saat kontrak API siap, ganti sumber katalog dengan `GET /api/products` BE (lihat [backend.md](./backend.md)). Harga final, promo, autentikasi, dan status pembayaran tetap harus divalidasi BE.

## Refresh UI marketplace — 17 Oktober 2026

Referensi visual: screenshot Itemku yang disediakan di folder `refrensi`. URL publik menolak pembacaan dengan HTTP 403; inspirasi diambil dari pola marketplace, bukan salinan aset, logo, atau konten.

- Header mengutamakan form pencarian lebar; navigasi kategori desktop dipindah ke baris kedua. Logo mengarah ke beranda; drawer mobile tetap tersedia.
- Hero menjadi banner ringkas dengan promo pendamping HEMAT10 dan empat pintasan kategori.
- Kartu katalog lebih padat, memakai ikon/initial, jumlah paket, serta harga demo terendah. Search, kategori, reset, dan route produk tetap dipertahankan.
- Promo lama yang mengklaim cashback/penawaran belum tersedia diganti copy demo sesuai HEMAT10. Kartu promo kini memiliki tujuan navigasi nyata.
- Warna banner/promo/artwork didefinisikan sebagai token CSS; Geist dan tema biru–oranye tetap. Gerakan hover ringan mengikuti reduced motion; fokus keyboard terlihat.
- Admin, autentikasi, dan logika transaksi tidak diubah; header bersama ikut berubah pada halaman user.
- Validasi: type-check, lint terarah, build, test filter, smoke route katalog/auth/admin lolos. Halaman beranda berhasil dirender browser. Uji interaksi dan ukuran layar via browser belum tuntas karena tab berulang kali hilang dari tool; jangan dianggap lulus QA visual seluruh breakpoint.

## Catatan pembaruan — 17 Oktober 2026

- Katalog 12 produk dan halaman top-up per slug tersedia dengan data lokal.
- Update pencarian: filter query/kategori berbasis URL, form header desktop/mobile dan katalog, jumlah hasil, empty state, reset filter, serta navigasi kategori dan CTA hero telah difungsikan. Footer lain masih placeholder.
- Validasi update pencarian: test filter, type-check, lint terarah, build, regression route katalog/auth lolos. Browser memverifikasi pencarian desktop/mobile, gabungan kategori/query, hasil kosong, reset, refresh URL, dan mobile tanpa overflow.
- Login/registrasi dan tombol Google masih demo; rencana integrasi tercatat di [auth.md](./auth.md).
- Listing admin produk kini memiliki kategori Games/Voucher/Pulsa/E-Wallet, filter game/brand, jumlah paket, urutan nama/harga akhir/diskon, dan aktif/nonaktif paket sementara.
- Admin demo menyediakan pengaturan harga/diskon/promo dan history fiktif. Sidebar desktop mengecil 88px, melebar 256px saat hover/fokus; mobile memakai drawer. Detail: [admin.md](./admin.md).
- Checkout memakai promo demo `HEMAT10`; catatan pesanan disimpan di sessionStorage, bukan database.
- Detail `/orders/[id]` dan riwayat `/orders` tersedia dengan simulasi status, filter, pencarian, serta konfirmasi hapus. Detail: [orders.md](./orders.md).
- Validasi terakhir alur transaksi: test logika promo/storage, type-check, lint terarah, build, smoke check katalog/auth/admin, serta browser checkout hingga history dan penanganan storage rusak lolos. Bukan verifikasi API atau transaksi nyata.

## Pemeriksaan

Cek route demo dengan server berjalan:

```powershell
$env:BASE_URL="http://localhost:3000"; node tests\game-routes.mjs
```

## Catatan

Next.js versi ini punya perubahan API. Baca panduan di `frontend-tp/node_modules/next/dist/docs/` sebelum ubah kode (lihat `frontend-tp/AGENTS.md`).
