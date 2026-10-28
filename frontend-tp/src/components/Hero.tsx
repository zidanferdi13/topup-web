"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "next/link";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";
import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";
import PhoneAndroidOutlined from "@mui/icons-material/PhoneAndroidOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
const CATEGORIES = [
  { label: "Games", description: "Diamond & game credits", icon: SportsEsportsOutlined },
  { label: "Voucher", description: "Hadiah digital pilihan", icon: ConfirmationNumberOutlined },
  { label: "Pulsa", description: "Pulsa & paket data", icon: PhoneAndroidOutlined },
  { label: "E-Wallet", description: "Isi saldo favoritmu", icon: AccountBalanceWalletOutlined },
];

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 2fr) minmax(0, 1fr)" }, gap: 2 }}>
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "var(--color-banner)", color: "var(--color-on-banner)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
          <Typography sx={{ mb: 2, color: "var(--color-banner-muted)", fontWeight: 600 }}>Pilihan digital, satu tujuan.</Typography>
          <Typography component="h1" sx={{ fontSize: { xs: 32, md: 44 }, lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.035em", mb: 2, maxWidth: 440 }}>
            Game favorit.<br />Paket yang pas.
          </Typography>
          <Typography sx={{ maxWidth: 430, color: "var(--color-banner-muted)", mb: 3 }}>Jelajahi top up game, voucher, pulsa, dan saldo digital. Pilih paketmu, coba alurnya.</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Button href="/#catalog" variant="contained" color="secondary" size="large">
              Top Up Sekarang
            </Button>
            <Button
              href="/#promo"
              variant="outlined"
              size="large"
              sx={{ color: "var(--color-on-banner)", borderColor: "var(--color-banner-muted)" }}
            >
              Lihat Promo
            </Button>
          </Box>
        </Box>
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: "var(--color-promo-paper)", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--color-promo-ink)" }}>PROMO DEMO</Typography>
          <Typography sx={{ fontSize: 64, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.05em", color: "var(--color-promo-ink)" }}>10%</Typography>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Lebih hemat untuk paketmu.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Gunakan HEMAT10 di checkout demo. Berlaku pada harga paket, bukan biaya admin.</Typography>
          <Button component={Link} href="/#promo" sx={{ p: 0 }}>Lihat detail promo →</Button>
        </Paper>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 1.5, mt: 3 }}>
          {CATEGORIES.map(({ label, description, icon: Icon }) => <Paper component={Link} href={`/?category=${encodeURIComponent(label)}#catalog`} key={label} variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 3, transition: "transform 150ms", "&:hover": { transform: "translateY(-2px)", borderColor: "primary.main" } }}>
            <Icon color="primary" sx={{ fontSize: 28 }} /><Box sx={{ minWidth: 0 }}><Typography sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{label}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>{description}</Typography></Box>
          </Paper>)}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>Eksplorasi demo · Harga contoh · Belum ada transaksi nyata</Typography>
      </Container>
    </Box>
  );
}
