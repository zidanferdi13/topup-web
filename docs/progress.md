# Progress & rencana

Audit kode: 31 Oktober 2026, commit `2e8fece`. Dokumen ini menggabungkan status yang sebelumnya tersebar di [frontend.md](./frontend.md) ("Tahap berikutnya"), [backend.md](./backend.md) ("Belum Ada"), dan roadmap `backend-tp/README.md`.

## Yang sedang dikembangkan

Website top-up digital (game, voucher, pulsa, e-wallet) bergaya marketplace, ditambah katalog jual beli akun game. Referensi visual: screenshot Itemku di `refrensi/`.

- `frontend-tp`: Next.js 16 App Router, React 19, MUI 9. Hampir semua alur pengguna dan admin sudah ada sebagai **prototipe dengan data demo lokal**.
- `backend-tp`: Express 4 + MySQL tanpa ORM. Fondasi (config, middleware, error handler, rate limit) dan **modul products** sudah jadi; modul lain masih 501.
- Fase saat ini: prototipe FE hampir lengkap, BE baru katalog, **FE dan BE belum terhubung**. API vendor (payment gateway, provider top-up) belum tersedia.

## Status per fitur

| Fitur | Frontend | Backend | Catatan |
| --- | --- | --- | --- |
| Katalog & pencarian | ✅ Demo, 12 produk / 49 paket di `src/data/catalog.ts`, filter URL `q`/`category` | 🟡 `GET /api/products`, `GET /api/products/:sku`; seed 4 game / 9 SKU | Belum ada `GET /api/games`; data FE dan seed BE berbeda (lihat Temuan) |
| Halaman top-up per produk | ✅ `/games/[slug]`: ID akun, zone/server, paket, pembayaran, ringkasan | — | Validasi ID hanya pola input |
| Promo checkout | 🟡 Hanya `HEMAT10` hardcoded di `src/lib/demo-orders.ts` | — | Promo admin tidak terhubung |
| Pesanan & riwayat | 🟡 `sessionStorage` (`/orders`, `/orders/[id]`), status disimulasikan tombol | ⛔ `/api/orders` 501 | Harus dihitung & disimpan BE |
| Pembayaran | 🟡 Daftar metode + biaya contoh | ⛔ `/api/payments`, `/api/webhooks` 501; `providers/payment` kosong | Menunggu vendor |
| Pengiriman top-up | — | ⛔ `/api/topup` 501; `providers/topup` kosong | Menunggu vendor |
| Cek ID pemain | — | ⛔ `/api/player` 501 | Menunggu vendor |
| Login / registrasi / Google | 🟡 UI + validasi form, tidak mengirim data | ⛔ Belum ada | Rencana di [auth.md](./auth.md) |
| Admin | 🟡 `/admin`: produk & diskon, promo, history fiktif; React state saja | ⛔ Belum ada | Gerbang login bukan proteksi |
| Jual beli akun | 🟡 `/accounts`, listing per game, detail; 8 penawaran fiktif | ⛔ Belum ada | Perlu keputusan kebijakan publisher dulu |
| Halaman bantuan / FAQ / footer | ⛔ Link footer masih `href="#"` | — | Isi menunggu informasi pemilik |
| Test otomatis | 🟡 4 unit test logika + 3 smoke HTTP (script `node`) | 🟡 `npm test` (`node:test`): validator + route tanpa DB; belum ada test dengan MySQL dan lint | |

✅ selesai untuk fase demo · 🟡 sebagian / simulasi · ⛔ belum ada

## Hasil verifikasi audit

| Pemeriksaan | Hasil |
| --- | --- |
| FE unit test (`catalog-search`, `admin-products`, `demo-orders`, `accounts`) | Lolos semua |
| FE `eslint src tests` | Bersih |
| FE `tsc --noEmit` | Lolos setelah tipe route Next (`LayoutProps`) digenerate oleh `next build`/`next dev` |
| FE `next build` | Lolos dengan `--webpack`, 33 halaman. Turbopack gagal di worktree audit karena `node_modules` berupa junction, bukan masalah kode |
| FE smoke HTTP (`game-routes`, `auth-routes`, `admin-route`, `accounts`) terhadap `next start` | Lolos semua: 12 halaman produk, auth, gerbang admin, route akun, dan 404 |
| BE tanpa database (app di-load langsung) | `/api/health` 200, 404 handler benar; 3 bug di bawah terkonfirmasi, lalu diperbaiki; `npm test` 7/7 lolos |
| BE dengan MySQL | Tidak dijalankan, tidak ada database di audit ini |

## Temuan

### Bug backend (terkonfirmasi, sudah diperbaiki)

Ketiganya diperbaiki setelah audit dan dijaga oleh `backend-tp/tests/`. Param berulang kini ditolak 400 untuk semua param list, termasuk `game`, `search`, dan `sort_by`.

1. **Query param tidak valid diam-diam memakai default.** `src/validators/product.validator.js`: `parseInteger()` mengembalikan `null` untuk nilai salah, tetapi `?? 1` / `?? 10` mengubah `null` menjadi default. `?page=abc&limit=xyz` menghasilkan 200 dengan page 1 / limit 10, bukan 400 seperti yang didokumentasikan.
2. **Parameter berulang membuat 500.** `?sort_dir=asc&sort_dir=desc` membuat `query.sort_dir` berupa array, lalu `.toLowerCase()` melempar `TypeError` → 500 (pesan error mentah ikut terkirim di non-production). `game`, `search`, dan `sort_by` juga belum menolak array.
3. **Placeholder 501 mengirim `success: true`.** `src/routes/index.js` memakai `successResponse` untuk status 501, bertentangan dengan format respons `{ success: false }` untuk kegagalan.

### Catatan backend lain

- Pencarian `LIKE` tidak meng-escape `%` dan `_`; `search=%` cocok dengan semua produk.
- Produk dari game dengan `games.is_active = 0` tetap tampil di list.
- `trust proxy` belum diatur: di belakang reverse proxy, rate limit akan menghitung IP proxy.
- `CORS_ORIGIN` default `*` di kode bila variabel kosong.
- `productRepository.findById` belum dipakai.
- BE dan FE sama-sama default port `3000`.

### Kesenjangan kontrak FE ↔ BE (penghalang integrasi)

- **Belum ada endpoint game.** FE butuh daftar produk induk (slug, nama, kategori, label ID, label zone, tag, warna), BE hanya menyediakan paket.
- **Arti `category` berbeda.** FE: `Games | Voucher | Pulsa | E-Wallet`. BE `games.category`: genre (`MOBA`, `Battle Royale`).
- **Field FE belum ada di DB:** `idLabel`, `zoneLabel`/pilihan server, `tag`, `color`.
- **Cakupan data berbeda.** FE 12 produk (termasuk Valorant, Roblox, Steam, Google Play, pulsa, data, GoPay, OVO); seed BE 4 game.
- **Format SKU berbeda.** FE `mlbb-86`, BE `MLBB-86`; pencarian SKU di admin/katalog FE akan berubah perilaku.
- **Harga berbeda.** Contoh MLBB 172: FE Rp40.000, BE Rp39.000; Genshin FE `gi-330`, BE `GI-300` ("300 + 30").
- **Metode pembayaran & biaya admin** hanya ada di FE.

### Catatan frontend

- Tombol di `src/app/accounts/offers/[id]/page.tsx` memakai `Button href` tanpa `next/link`, jadi navigasinya reload penuh.
- Metadata root (`src/app/layout.tsx`) masih berisi klaim "terpercaya, harga termurah, CS 24 jam" padahal seluruh situs berlabel demo.
- Sumber kode promo terduplikasi: `HEMAT10` di `demo-orders.ts`, `TopUpForm.tsx`, dan `AdminDashboard.tsx`.

## Rencana berikutnya

Urutan disarankan. Fase 1–3 tidak bergantung vendor sehingga bisa dikerjakan sekarang.

1. **Rapikan fondasi BE.** ~~Perbaiki 3 bug di atas, tambah `npm test`~~ (selesai). Sisa: escape `LIKE`, filter `games.is_active`, atur `trust proxy`, test repository dengan database MySQL test.
2. **Selaraskan kontrak data.** Migration baru: kolom tipe produk (`Games/Voucher/Pulsa/E-Wallet`), label ID, label/pilihan zone, tag, warna. Seed 12 produk dan 49 paket sesuai FE, sepakati satu format SKU. Tambahkan `GET /api/games` dan `GET /api/games/:slug` (berisi paket). Pertimbangkan tabel `payment_methods`.
3. **Integrasikan katalog FE.** Ganti `src/data/catalog.ts` dengan fetch ke BE di server component (env base URL API, state error/loading/empty). Ganti port BE default ke `4000`. Perbarui test FE yang membaca file data lokal.
4. **Auth BE.** Tabel users/sessions, registrasi/login email (Argon2id), cookie session `HttpOnly`, Google ID token sesuai [auth.md](./auth.md), CSRF. Hubungkan `AuthForm` dan header.
5. **Order BE.** `POST /api/orders` menghitung harga, promo, biaya admin di server dan menyimpan snapshot harga; `GET /api/orders` per user. Ganti `sessionStorage` di `DemoOrders`/`TopUpForm`. Tabel promo menggantikan `HEMAT10` hardcoded.
6. **Admin API.** Endpoint produk/diskon/promo/history dengan role admin, audit log; hubungkan `AdminDashboard`.
7. **Vendor (menunggu API).** Provider payment gateway dan top-up di `src/providers/*`, cek ID pemain, webhook idempotent, status order dari vendor.
8. **Jual beli akun.** Tetap demo sampai kebijakan game yang diizinkan, verifikasi penjual, escrow/sengketa ditetapkan.

Pekerjaan FE paralel yang masih terbuka (dari [frontend.md](./frontend.md)): demo profil/lupa/reset password, halaman bantuan/FAQ dan isi footer, rapikan loading/error/empty serta aksesibilitas, perluas cek browser keyboard/layar kecil.
