"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert, Box, Button, Divider, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (register && data.get("password") !== data.get("confirmPassword")) {
      const confirmation = form.elements.namedItem("confirmPassword") as HTMLInputElement;
      confirmation.setCustomValidity("Konfirmasi password tidak cocok.");
      confirmation.reportValidity();
      return;
    }
    form.reset();
    setVisible(false);
    setMessage(register
      ? "Validasi form demo selesai. Akun belum dibuat; data tidak dikirim atau disimpan."
      : "Validasi form demo selesai. Kamu belum masuk; data tidak dikirim atau disimpan.");
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: { xs: 3, md: 6 }, bgcolor: "background.default" }}>
      <Box sx={{ width: "100%", maxWidth: 960 }}>
        <Button component={Link} href="/" sx={{ mb: 2 }}>← Kembali ke beranda</Button>
        <Paper variant="outlined" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" }, overflow: "hidden", borderRadius: 4 }}>
          <Box sx={{ bgcolor: "#0F2446", color: "white", p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 4 }}>
            <Typography component={Link} href="/" sx={{ color: "white", textDecoration: "none", fontSize: 24, fontWeight: 800 }}>TopUp<span style={{ color: "#FF9B52" }}>.</span></Typography>
            <Box>
              <Typography variant="overline" sx={{ color: "#AFCDF8" }}>Akun TopUp</Typography>
              <Typography component="h2" variant="h4" sx={{ fontWeight: 800, mt: 1 }}>Game pilihanmu.<br />Satu tempat.</Typography>
              <Typography sx={{ color: "#D4DFEF", mt: 2 }}>Siapkan akun untuk pengalaman top up yang lebih praktis.</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#D4DFEF" }}>Demo frontend · Belum terhubung layanan autentikasi.</Typography>
          </Box>
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, minWidth: 0 }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>{register ? "Buat akun" : "Selamat datang kembali"}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>{register ? "Isi data untuk mencoba form pendaftaran." : "Masuk dengan email atau akun Google."}</Typography>
            <Alert severity="info" sx={{ mb: 3 }}>Mode demo. Gunakan data contoh, bukan password asli. Tidak ada akun atau session yang dibuat.</Alert>
            <Button fullWidth variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={() => setMessage("Login Google belum terhubung. OAuth Client ID dan verifikasi token di backend diperlukan sebelum fitur ini bisa dipakai.")}>
              Lanjutkan dengan Google
            </Button>
            <Divider sx={{ my: 3 }}><Typography variant="body2" color="text.secondary">atau gunakan email</Typography></Divider>
            <Box component="form" onSubmit={submit} onChange={(event) => {
              setMessage("");
              const confirmation = event.currentTarget.elements.namedItem("confirmPassword") as HTMLInputElement | null;
              confirmation?.setCustomValidity("");
            }} sx={{ display: "grid", gap: 2 }}>
              {register && <TextField name="name" label="Nama lengkap" autoComplete="name" required fullWidth slotProps={{ htmlInput: { maxLength: 100, pattern: ".*\\S.*" } }} />}
              <TextField name="email" label="Email" type="email" autoComplete="email" required fullWidth slotProps={{ htmlInput: { maxLength: 254 } }} />
              <TextField
                name="password" label="Password" required fullWidth type={visible ? "text" : "password"} autoComplete={register ? "new-password" : "current-password"}
                helperText={register ? "Minimal 8 karakter untuk demo ini." : undefined}
                slotProps={{
                  htmlInput: { minLength: register ? 8 : 1, maxLength: 128 },
                  input: { endAdornment: <InputAdornment position="end"><IconButton type="button" aria-label={visible ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={visible} edge="end" onClick={() => setVisible(!visible)}><Box component={visible ? VisibilityOff : Visibility} /></IconButton></InputAdornment> },
                }}
              />
              {register && <TextField name="confirmPassword" label="Konfirmasi password" required fullWidth type={visible ? "text" : "password"} autoComplete="new-password" slotProps={{ htmlInput: { maxLength: 128 } }} onChange={(event) => event.target.setCustomValidity("")} />}
              {message && <Alert severity="info" role="status" sx={{ overflowWrap: "anywhere" }}>{message}</Alert>}
              <Button type="submit" size="large" variant="contained">{register ? "Daftar" : "Masuk"} (demo)</Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
              {register ? "Sudah punya akun? " : "Belum punya akun? "}
              <Box component={Link} href={register ? "/login" : "/register"} sx={{ color: "primary.dark", fontWeight: 700 }}>{register ? "Masuk" : "Daftar sekarang"}</Box>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
