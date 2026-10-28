# Alur transaksi frontend demo

Belum membutuhkan API vendor atau backend. Semua harga dan status merupakan simulasi.

## Alur

1. Pilih produk, isi ID contoh, paket, dan metode pembayaran.
2. Opsional: masukkan `HEMAT10`, lalu Terapkan promo. Diskon 10% harga paket, dibulatkan ke rupiah; biaya admin tidak didiskon. Kode lain ditolak. Edit kode membatalkan promo aktif sampai diterapkan lagi.
3. Konfirmasi pilihan, lalu Buat pesanan demo. Catatan tersimpan di `sessionStorage` dengan ID `DEMO-...`; browser membuka `/orders/[id]`.
4. Detail menampilkan snapshot harga, diskon, biaya admin, total, tujuan, dan metode pembayaran. Simulasikan pembayaran mengubah Menunggu pembayaran menjadi Diproses. Simulasikan top-up selesai atau gagal mengakhiri proses; pesanan menunggu juga dapat dibatalkan.
5. `/orders` menampilkan riwayat tab ini, pencarian, filter status, detail, dan hapus semua dengan konfirmasi. Ikon riwayat di header dan menu mobile membuka halaman ini.

Tidak ada QR/virtual account nyata, transfer, top-up, validasi ID, ataupun session user. Gunakan data contoh saja. Riwayat bukan milik akun login dan tidak terhubung history admin.

## Penyimpanan

Key `topup-demo-orders-v1`, maksimal 100 catatan. Bertahan saat refresh pada tab yang sama; biasanya hilang saat tab ditutup. Browser dapat memulihkan session atau menyalin sessionStorage saat menduplikasi tab. Data tidak aman untuk informasi sensitif dan bisa dimodifikasi pemilik browser.

Data tersimpan divalidasi sebelum dibaca/ditulis. Data rusak atau storage tidak tersedia menampilkan error; tidak menimpa data lama secara diam-diam. Hapus riwayat secara eksplisit untuk mereset data rusak. Simpan gagal tidak mengarahkan user ke detail sukses.

Harga dan promo dashboard admin tetap terpisah dari demo checkout. Sebelum produksi, backend wajib menghitung total/promo dan menetapkan status dari payment gateway/provider, bukan tombol browser. Ganti sessionStorage dengan API order berotorisasi per user.

## File dan pemeriksaan

- `src/lib/demo-orders.ts`: format data, promo, validasi storage.
- `src/components/TopUpForm.tsx`: checkout dan pembuatan catatan.
- `src/components/DemoOrders.tsx`: detail, history, simulasi status.
- `src/app/orders/page.tsx`, `src/app/orders/[id]/page.tsx`: route.

Dari folder `frontend-tp`: `node tests\demo-orders.mjs` menguji promo dan data storage valid/rusak tanpa framework tambahan.
