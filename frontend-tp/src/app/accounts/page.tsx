import type { Metadata } from "next";
import { Alert, Box, Button, Card, CardActionArea, Typography } from "@mui/material";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";
import { ACCOUNT_GAMES, ACCOUNT_OFFERS } from "@/data/accounts";

export const metadata: Metadata = { title: "Jual Beli Akun Game Demo | TopUp" };

export default function AccountsPage() {
  return <>
    <Button href="/">← Beranda</Button>
    <Box sx={{ bgcolor: "var(--color-banner)", color: "var(--color-on-banner)", borderRadius: 4, p: { xs: 3, md: 5 }, my: 3 }}>
      <Typography component="h1" variant="h3" sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 800 }}>Jelajahi akun game pilihan</Typography>
      <Typography sx={{ mt: 2, maxWidth: 600, color: "var(--color-banner-muted)" }}>Pilih game, bandingkan spesifikasi, dan lihat detail penawaran. Katalog jual beli ini masih demonstrasi frontend.</Typography>
    </Box>
    <Alert severity="warning" sx={{ mb: 4 }}>Semua penawaran fiktif. Belum ada pembelian, penjualan, verifikasi penjual, atau jaminan transaksi. Jual beli akun dapat dibatasi ketentuan publisher; jangan bagikan password, OTP, atau kode pemulihan.</Alert>
    <Typography component="h2" variant="h5" sx={{ mb: 2 }}>Pilih game</Typography>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
      {ACCOUNT_GAMES.map((game) => <Card key={game.slug} variant="outlined"><CardActionArea href={`/accounts/${game.slug}`} sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
        <Box aria-hidden sx={{ bgcolor: "var(--color-card-art)", color: "primary.main", minHeight: 120, borderRadius: 2, display: "grid", placeItems: "center", mb: 2 }}><SportsEsportsOutlined sx={{ fontSize: 40 }} /><Typography sx={{ fontWeight: 800 }}>{game.initials}</Typography></Box>
        <Typography sx={{ fontWeight: 700 }}>{game.name}</Typography><Typography variant="body2" color="text.secondary">{ACCOUNT_OFFERS.filter((offer) => offer.game === game.slug).length} penawaran demo</Typography>
      </CardActionArea></Card>)}
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>Fitur pasang iklan dan pembayaran akun belum tersedia. Tidak ada data yang perlu disimpan di browser pada tahap ini.</Typography>
  </>;
}
