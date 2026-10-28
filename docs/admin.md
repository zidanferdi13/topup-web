# Admin demo

Buka `/admin` untuk login demo, kemudian dashboard. Gunakan email contoh valid dan password contoh minimal 8 karakter. Sembarang kombinasi yang memenuhi form diterima: ini bukan autentikasi, session, atau kontrol akses nyata. Jangan gunakan credential asli.

## Navigasi

Sidebar desktop otomatis mengecil menjadi rail ikon selebar 88px. Saat kursor berada di sidebar atau menu mendapat fokus keyboard, sidebar melebar menjadi 256px di atas konten tanpa menggeser layout. Saat kursor dan fokus keluar, sidebar mengecil kembali. Animasi mengikuti preferensi reduced motion.

Menu: Produk & diskon, Promo, History pembelian. Menu aktif diberi penanda dan judul konten mengikuti pilihan. Pada mobile, tombol Buka menu admin tetap menampilkan drawer penuh yang menutup setelah menu dipilih atau Escape ditekan.

Perpindahan menu tetap dalam `/admin`, bukan route terpisah, supaya perubahan state demo tidak hilang saat pindah menu. Tambahkan menu melalui `ADMIN_MENU` dan konten terkait di `AdminDashboard.tsx`; belum dibuat abstraksi route untuk kebutuhan yang belum ada.

## Fitur

- Produk & diskon: kategori Semua, Games (26 paket), Voucher (8), Pulsa (7), E-Wallet (8); total 49 paket. Jumlah kategori mencakup semua paket, termasuk nonaktif, tanpa dipengaruhi pencarian.
- Filter game/brand mengikuti kategori; berpindah kategori mereset game/brand agar tidak menyisakan pilihan tersembunyi. Pencarian game/paket/SKU digabung dengan filter kategori dan brand.
- Urutan nama A–Z/Z–A, harga akhir terendah/tertinggi, diskon terbesar. Harga akhir memperhitungkan diskon produk dan dibulatkan ke rupiah terdekat. Edit harga atau diskon langsung memperbarui urutan yang aktif.
- Jumlah hasil dan paket aktif, reset filter, empty state, kolom kategori/status, serta aktif/nonaktif paket demo tersedia. Paket nonaktif tetap tampil untuk pengelolaan; status ini tidak memengaruhi katalog/checkout publik.
- Edit harga dasar rupiah dan diskon 0–100% tetap tersedia. Filter, urutan, perubahan harga, dan status paket hanya state sementara; keluar/refresh mengembalikan kondisi awal. Pagination dan tambah paket manual belum dibuat sesuai cakupan pilihan.
- Promo: tambah atau edit kode, judul, persentase, aktif/nonaktif. Kode dinormalisasi uppercase dan harus unik. Belum ada jadwal, kuota, atau gabungan dengan diskon produk.
- History: empat transaksi fiktif, pencarian pesanan/email/produk, filter status Selesai/Menunggu/Gagal. Total penjualan hanya menjumlah transaksi selesai contoh.
- Keluar demo menghapus perubahan dan kembali ke form login.

Semua data berada dalam React state, bukan localStorage atau database. Refresh, keluar demo, atau meninggalkan halaman menghapus perubahan. Harga, promo, dan history dashboard tidak terhubung checkout publik.

Implementasi: `frontend-tp/src/app/admin/page.tsx` dan `frontend-tp/src/components/AdminDashboard.tsx`. Tidak ada API admin yang ditambahkan.

## Sebelum produksi

Backend harus memverifikasi session dan role admin pada setiap endpoint. Jangan menggunakan gerbang React ini sebagai proteksi. Tambahkan autentikasi nyata, MFA admin, validasi server, audit log perubahan harga/promo, proteksi CSRF, dan database. Backend harus menghitung harga/diskon saat membuat order dan menyimpan snapshot harga transaksi agar history tidak berubah saat katalog diedit.

## Pembaruan 17 Oktober 2026

Listing produk dipisah per kategori, ditambah filter game/brand, jumlah paket, pengurutan, dan aktif/nonaktif demo. Logika listing berada di `frontend-tp/src/lib/admin-products.ts`. Test tanpa framework: dari `frontend-tp`, jalankan `node tests\admin-products.mjs`.

Validasi update: test logika kategori/brand/pencarian/urutan, type-check, lint terarah, build, smoke route admin lolos. Browser memverifikasi jumlah kategori, reset brand saat pindah kategori, edit diskon dan urutan harga akhir, aktif/nonaktif, hasil kosong/reset, serta mobile tanpa overflow.

## Pemeriksaan

Dengan FE berjalan, dari folder `frontend-tp`:

```powershell
$env:BASE_URL="http://localhost:3000"; node tests\admin-route.mjs
```

Cek browser: buka gerbang demo, edit harga/diskon, tambah/edit/nonaktifkan promo, tolak kode duplikat, filter history, keluar demo, dan refresh mengembalikan login.
