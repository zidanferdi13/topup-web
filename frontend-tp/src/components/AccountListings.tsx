"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, Card, CardActionArea, Chip, Paper, TextField, Typography } from "@mui/material";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";
import { ACCOUNT_OFFERS, selectAccountOffers } from "@/data/accounts";
import { formatIDR } from "@/data/catalog";

export default function AccountListings({ game }: { game: { slug: string; name: string; initials: string } }) {
  const [query, setQuery] = useState("");
  const [server, setServer] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("price-asc");
  const minimum = min === "" ? 0 : Number(min);
  const maximum = max === "" ? Infinity : Number(max);
  const invalid = !Number.isSafeInteger(minimum) || minimum < 0 || (max !== "" && !Number.isSafeInteger(maximum)) || maximum < minimum || maximum > 999999999 && max !== "";
  const offers = invalid ? [] : selectAccountOffers(game.slug, query, server, minimum, maximum, sort);
  const servers = [...new Set(ACCOUNT_OFFERS.filter((offer) => offer.game === game.slug).map((offer) => offer.server))];

  return <>
    <Button component={Link} href="/accounts">← Semua game</Button>
    <Typography component="h1" variant="h4" sx={{ fontWeight: 800, my: 2 }}>Akun {game.name}</Typography>
    <Alert severity="info" sx={{ mb: 3 }}>Listing dan penjual fiktif. Tidak ada checkout atau transfer akun. Periksa ketentuan publisher sebelum transaksi akun nyata.</Alert>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "260px minmax(0, 1fr)" }, gap: 3, alignItems: "start" }}>
      <Paper component="section" aria-labelledby="account-filter-heading" variant="outlined" sx={{ p: 2.5, display: "grid", gap: 2 }}>
        <Typography id="account-filter-heading" component="h2" variant="h6">Filter penawaran</Typography>
        <TextField label="Cari judul, rank, atau toko" value={query} onChange={(event) => setQuery(event.target.value)} size="small" slotProps={{ htmlInput: { maxLength: 100 } }} />
        <TextField select label="Server / region" value={server} onChange={(event) => setServer(event.target.value)} slotProps={{ select: { native: true } }} size="small"><option value="">Semua server</option>{servers.map((value) => <option key={value} value={value}>{value}</option>)}</TextField>
        <TextField label="Harga minimum (Rp)" type="number" value={min} onChange={(event) => setMin(event.target.value)} size="small" slotProps={{ htmlInput: { min: 0, max: 999999999, step: 1 } }} />
        <TextField label="Harga maksimum (Rp)" type="number" value={max} onChange={(event) => setMax(event.target.value)} size="small" slotProps={{ htmlInput: { min: 0, max: 999999999, step: 1 } }} />
        {invalid && <Alert severity="error">Gunakan harga bulat 0–999.999.999. Maksimum tidak boleh lebih kecil dari minimum.</Alert>}
        <Button onClick={() => { setQuery(""); setServer(""); setMin(""); setMax(""); setSort("price-asc"); }}>Reset filter</Button>
      </Paper>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", mb: 2 }}>
          <Typography role="status">{offers.length} penawaran demo</Typography>
          <TextField select label="Urutkan" value={sort} onChange={(event) => setSort(event.target.value)} slotProps={{ select: { native: true } }} size="small">{[["price-asc", "Harga terendah"], ["price-desc", "Harga tertinggi"], ["name", "Nama A–Z"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</TextField>
        </Box>
        {!invalid && !offers.length && <Alert severity="info">Penawaran tidak ditemukan. Ubah pencarian atau reset filter.</Alert>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
          {offers.map((offer) => <Card variant="outlined" key={offer.id}><CardActionArea component={Link} href={`/accounts/offers/${offer.id}`} sx={{ height: "100%" }}>
            <Box aria-hidden sx={{ bgcolor: "var(--color-card-art)", color: "primary.main", height: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}><SportsEsportsOutlined sx={{ fontSize: 40 }} /><Typography sx={{ fontWeight: 800, fontSize: 28 }}>{game.initials}</Typography></Box>
            <Box sx={{ p: 2 }}><Chip label={offer.server} size="small" variant="outlined" sx={{ mb: 1 }} /><Typography sx={{ fontWeight: 700, minHeight: 48 }}>{offer.title}</Typography><Typography color="primary.dark" sx={{ fontSize: 20, fontWeight: 800, my: 1 }}>{formatIDR(offer.price)}</Typography><Typography variant="body2" color="text.secondary">{offer.seller} · Belum diverifikasi</Typography><Typography variant="caption" color="text.secondary">Ilustrasi demo, bukan foto akun</Typography></Box>
          </CardActionArea></Card>)}
        </Box>
      </Box>
    </Box>
  </>;
}
