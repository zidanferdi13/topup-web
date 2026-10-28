# Login dan registrasi

## Status saat ini

- `/login`: email, password, tampil/sembunyikan password.
- `/register`: nama lengkap, email, password minimal 8 karakter, konfirmasi password.
- Tombol Masuk pada header desktop dan menu mobile membuka `/login`.
- Kedua halaman memakai `src/components/AuthForm.tsx`, tema MUI yang sama dengan katalog, dan navigasi silang.
- Browser memvalidasi field wajib, email, dan panjang password registrasi. Password konfirmasi harus cocok.
- Submit hanya menampilkan hasil validasi demo dan mengosongkan form. Tidak memanggil API, membuat akun, membuat session, menyimpan data, atau menganggap pengguna sudah login.
- Tombol Google menampilkan informasi integrasi belum tersedia. Tidak membuka popup Google atau mengirim data.
- Gunakan data contoh, bukan password asli. Belum ada reset password atau verifikasi email.

## Menghubungkan Google nanti

Rencana berikut belum diimplementasikan. Cocok untuk FE Next.js dan BE Express yang ada; gunakan Google Identity Services, bukan SDK Google Sign-In lama.

1. Buat project Google Cloud dan konfigurasi Google Auth Platform: branding/consent screen, audience, dan test users jika aplikasi masih testing.
2. Buat OAuth Client ID bertipe **Web application**. Daftarkan Authorized JavaScript origins yang benar, misalnya `http://localhost:3000` dan domain HTTPS production. Jika memilih redirect flow, daftarkan redirect URI yang persis cocok dengan callback backend.
3. Pasang Google Identity Services di FE. Client ID boleh ada di `NEXT_PUBLIC_GOOGLE_CLIENT_ID`; Client Secret tidak boleh di variabel `NEXT_PUBLIC_*`, bundle frontend, repository, atau chat. Credential server hanya di environment backend yang tidak dikomit.
4. Tombol Google asli menerima credential berupa ID token. Kirim lewat HTTPS ke endpoint backend yang nanti dibuat, misalnya `POST /api/auth/google`. Terapkan proteksi CSRF, nonce sesuai flow, dan pembatasan request; jangan memakai payload token hasil decode frontend sebagai bukti login.
5. Backend memverifikasi signature, issuer, audience terhadap Client ID, expiry, nonce bila dipakai, serta `email_verified` menggunakan library resmi Google. Gunakan `sub` sebagai identitas Google yang stabil; jangan otomatis menggabungkan akun hanya karena email sama tanpa bukti kepemilikan akun yang sudah ada.
6. Backend membuat/mencari user, lalu membuat session server. Kirim cookie session `HttpOnly`, `Secure` saat production, dan `SameSite` sesuai deployment. Simpan token/session sensitif di backend, bukan `localStorage`. Rotasi session saat login dan hapus saat logout.
7. Tambahkan endpoint session/logout dan state auth FE. Jika FE dan BE beda origin, konfigurasi CORS dengan allowlist origin dan credentials, gunakan `credentials: "include"`, serta proteksi CSRF untuk request yang mengubah data. Tentukan domain deployment dahulu karena cookie lintas situs punya batasan browser.
8. Uji login berhasil, akun batal memilih Google, token palsu/kedaluwarsa, audience salah, replay, session kedaluwarsa, logout, serta konflik akun sebelum mengaktifkan produksi.

ID token Google bukan access token API aplikasi. Backend tetap menentukan hak akses pengguna. Google login tidak memerlukan password Google dan tidak perlu meminta scope tambahan jika hanya butuh identitas dasar.

Login email/password nyata juga memerlukan backend: hashing password dengan algoritme yang sesuai (misalnya Argon2id), unique constraint email yang dinormalisasi, validasi server, rate limit, pesan error tidak membocorkan keberadaan akun, verifikasi email, dan mekanisme pemulihan password yang aman.

Referensi resmi:
- [Google Identity Services untuk web](https://developers.google.com/identity/gsi/web/guides/overview)
- [Verifikasi ID token di server](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)

## Pemeriksaan

Dengan server FE berjalan, dari folder `frontend-tp`:

```powershell
$env:BASE_URL="http://localhost:3000"; node tests\auth-routes.mjs
```

Cek interaksi browser: email tidak valid ditolak, password registrasi pendek ditolak, konfirmasi berbeda ditolak, edit password utama setelah error bisa divalidasi ulang, submit valid menampilkan pesan demo, tombol Google tidak mengautentikasi, dan layout mobile tidak overflow.
