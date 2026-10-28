"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import PaymentIcon from "@mui/icons-material/Payment";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const STEPS = [
  { icon: <SearchIcon />, title: "1. Pilih Produk", desc: "Cari game, voucher, atau layanan yang ingin kamu isi." },
  { icon: <SportsEsportsIcon />, title: "2. Masukkan ID", desc: "Isi User ID / nomor tujuan lalu pilih nominal." },
  { icon: <PaymentIcon />, title: "3. Bayar & Selesai", desc: "Pilih metode pembayaran, saldo masuk instan." },
];

export default function HowItWorks() {
  return (
    <Box sx={{ bgcolor: "#fff", py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Typography variant="h5" align="center" sx={{ mb: 1 }}>
          Cara Top Up dalam 3 Langkah
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 5 }}>
          Tanpa registrasi ribet. Cukup pilih, masukkan ID, dan bayar.
        </Typography>
        <Grid container spacing={3}>
          {STEPS.map((step) => (
            <Grid key={step.title} size={{ xs: 12, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, height: "100%", textAlign: "center", borderRadius: 3 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "primary.main",
                    color: "#fff",
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
