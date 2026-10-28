# Dokumentasi Web To Up

Dokumentasi ringkas isi kode project.

| Bagian | Folder | Dokumen |
| --- | --- | --- |
| Backend (BE) | [`backend-tp`](../backend-tp) | [backend.md](./backend.md) |
| Frontend (FE) | [`frontend-tp`](../frontend-tp) | [frontend.md](./frontend.md) |
| Auth demo & rencana Google login | [`frontend-tp`](../frontend-tp) | [auth.md](./auth.md) |

Dashboard admin demo: [admin.md](./admin.md). Buka `/admin`; perubahan hanya state sementara, bukan pengaturan toko nyata.

Alur checkout, promo, detail, dan riwayat demo: [orders.md](./orders.md).

Katalog, listing, dan detail jual beli akun demo: [accounts.md](./accounts.md).

## Status Integrasi

FE belum memanggil API BE. Katalog, paket, dan metode pembayaran FE masih data demo di `src/data/catalog.ts`; checkout belum membuat transaksi.

Catatan port: BE dan FE sama-sama default `3000`. Jalankan BE dengan `PORT` lain (contoh `4000`) saat develop bersamaan. `CORS_ORIGIN` BE harus berisi origin FE (`http://localhost:3000`).
