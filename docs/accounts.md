# Katalog jual beli akun demo

## Cakupan

Referensi: dua screenshot kategori akun dan listing Genshin yang disediakan di folder `refrensi`. Pola pilih game, sidebar filter, grid penawaran, dan rincian diadaptasi; tidak menyalin gambar, logo, atau listing sumber.

- `/accounts`: katalog pilihan Genshin Impact, Mobile Legends, Valorant, Roblox.
- `/accounts/[game]`: listing per game, pencarian judul/rank/toko, filter server/region dan rentang harga, urutan harga/nama, jumlah hasil, reset, empty state.
- `/accounts/offers/[id]`: detail penawaran, ilustrasi orisinal, harga, spesifikasi, penjual contoh, status belum diverifikasi, dan link membandingkan penawaran.
- Header desktop dan drawer mobile memiliki menu Jual Beli Akun.
- Slug game dan ID penawaran tidak dikenal menghasilkan 404.

Semua delapan penawaran dan nama penjual fiktif. Tidak ada klaim penjual terverifikasi, escrow, garansi, rating, atau stok nyata. Semua ilustrasi berupa ikon/initial, bukan foto akun.

## Batas demo

Tidak ada form jual, pasang iklan, chat penjual, checkout akun, transfer, pengiriman credential, atau integrasi backend. sessionStorage belum dipakai karena cakupan yang dipilih hanya katalog/listing/detail; tidak ada data pengguna atau iklan baru yang perlu disimpan. Filter hanya state lokal dan kembali awal saat refresh/meninggalkan listing.

Jual beli/pemindahan akun dapat dilarang ketentuan publisher. Sebelum produksi, tentukan kebijakan game yang diizinkan, kepemilikan sah, moderasi, verifikasi penjual, sengketa, serta perlindungan pembeli. Jangan meminta atau menampilkan password, OTP, recovery code, maupun credential akun di listing publik.

## Implementasi dan validasi

- `src/data/accounts.ts`: data demo dan filter listing.
- `src/components/AccountListings.tsx`: listing interaktif.
- `src/app/accounts/`: katalog, layout, listing per game, detail penawaran.

Dari folder `frontend-tp`:

```powershell
node tests\accounts.mjs
# Tambahkan cek HTTP jika server berjalan:
$env:BASE_URL="http://localhost:3000"; node tests\accounts.mjs
```

Test fixtures/filter, type-check, lint terarah, build, route semua game/penawaran dan 404 lolos. Regression katalog top-up lolos. Browser memeriksa filter server/harga, invalid range, reset, urutan dan navigasi detail; listing diuji tanpa overflow pada lebar 320/375/414/768/1440px.
