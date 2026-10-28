import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";
import { ACCOUNT_GAMES, ACCOUNT_OFFERS } from "@/data/accounts";
import { formatIDR } from "@/data/catalog";

type Props = { params: Promise<{ id: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return ACCOUNT_OFFERS.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `${ACCOUNT_OFFERS.find((offer) => offer.id === id)?.title ?? "Penawaran tidak ditemukan"} | TopUp Demo` };
}
export default async function AccountOfferPage({ params }: Props) {
  const { id } = await params;
  const offer = ACCOUNT_OFFERS.find((item) => item.id === id);
  if (!offer) notFound();
  const game = ACCOUNT_GAMES.find((item) => item.slug === offer.game)!;
  return <>
    <Button href={`/accounts/${game.slug}`}>← Akun {game.name}</Button>
    <Alert severity="warning" sx={{ my: 3 }}>Penawaran fiktif. Tidak ada akun nyata, verifikasi penjual, escrow, atau jaminan. Jangan transfer uang atau bagikan credential. Periksa ketentuan publisher terkait pemindahan akun.</Alert>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.4fr) minmax(0, 1fr)" }, gap: 3, alignItems: "start" }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box aria-hidden sx={{ bgcolor: "var(--color-card-art)", color: "primary.main", height: 240, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, borderRadius: 2 }}><SportsEsportsOutlined sx={{ fontSize: 64 }} /><Typography variant="h3">{game.initials}</Typography></Box>
        <Typography variant="caption" color="text.secondary">Ilustrasi demo, bukan tangkapan layar akun.</Typography>
        <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>Tentang penawaran</Typography><Typography color="text.secondary">{offer.description}</Typography>
        <Box component="ul" sx={{ pl: 3, mt: 2 }}>{offer.features.map((feature) => <li key={feature}>{feature}</li>)}</Box>
      </Paper>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Chip label="Listing demo" size="small" sx={{ mb: 2 }} /><Typography component="h1" variant="h4" sx={{ fontSize: 28, fontWeight: 800 }}>{offer.title}</Typography>
        <Typography color="primary.dark" sx={{ fontSize: 30, fontWeight: 800, my: 2 }}>{formatIDR(offer.price)}</Typography>
        <Box component="dl" sx={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 1.5, mb: 3, "& dt": { color: "text.secondary" }, "& dd": { m: 0, overflowWrap: "anywhere" } }}><dt>Game</dt><dd>{game.name}</dd><dt>Server</dt><dd>{offer.server}</dd><dt>Level / rank</dt><dd>{offer.level}</dd><dt>Penjual contoh</dt><dd>{offer.seller}</dd><dt>Verifikasi</dt><dd>Belum diverifikasi</dd></Box>
        <Alert severity="info" sx={{ mb: 2 }}>Pembelian, chat penjual, dan pasang iklan belum tersedia. Katalog ini hanya untuk mencoba UI jual beli akun.</Alert>
        <Button href={`/accounts/${game.slug}`} fullWidth variant="contained">Bandingkan penawaran</Button>
      </Paper>
    </Box>
  </>;
}
