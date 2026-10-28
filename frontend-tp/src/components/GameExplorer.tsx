"use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CATEGORIES, filterCatalog } from "@/lib/catalog-search";
import { formatIDR } from "@/data/catalog";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";
import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";
import PhoneAndroidOutlined from "@mui/icons-material/PhoneAndroidOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";

const CATEGORY_ICONS = { Games: SportsEsportsOutlined, Voucher: ConfirmationNumberOutlined, Pulsa: PhoneAndroidOutlined, "E-Wallet": AccountBalanceWalletOutlined };
import Link from "next/link";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

// ponytail: placeholder art only — swap `color` box for real image when assets exist.

export default function GameExplorer({ query = "", category = "Semua" }: { query?: string; category?: string }) {
  const active = CATEGORIES.includes(category) ? category : "Semua";
  const games = filterCatalog(query, active);

  return (
    <Box component="section" id="catalog" aria-labelledby="catalog-heading" sx={{ scrollMarginTop: 136, maxWidth: 1200, mx: "auto", px: 2, py: { xs: 4, md: 6 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box><Typography component="h2" id="catalog-heading" variant="h5">Temukan pilihanmu</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Game, voucher, dan kebutuhan digital dalam satu katalog.</Typography></Box>
      </Box>

      <Box component="form" role="search" aria-label="Pencarian katalog" action="/#catalog" sx={{ display: "flex", gap: 1, mb: 2 }}>
        <input type="hidden" name="category" value={active} />
        <TextField key={`${query}-${active}`} name="q" label="Cari game, paket, atau SKU" defaultValue={query} size="small" fullWidth slotProps={{ htmlInput: { maxLength: 100 } }} />
        <Button type="submit" variant="contained">Cari</Button>
      </Box>
      <Tabs
        aria-label="Kategori katalog"
        value={CATEGORIES.indexOf(active)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, minHeight: 40, "& .MuiTab-root": { minHeight: 40 } }}
      >
        {CATEGORIES.map((c) => (
          <Tab component={Link} href={`/?${new URLSearchParams({ category: c, ...(query ? { q: query } : {}) })}#catalog`} key={c} label={c} />
        ))}
      </Tabs>

      <Typography role="status" color="text.secondary" sx={{ mb: 2 }}>{games.length} produk{query ? ` untuk “${query}”` : ""} · {active}</Typography>
      {(query || active !== "Semua") && <Button component={Link} href="/#catalog" sx={{ mb: 2 }}>Reset pencarian & kategori</Button>}
      {!games.length && <Box sx={{ p: 4, textAlign: "center", bgcolor: "background.paper", borderRadius: 2 }}><Typography>Tidak ada produk sesuai pencarian. Coba kata lain atau reset filter.</Typography></Box>}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(3, minmax(0, 1fr))",
                        md: "repeat(4, minmax(0, 1fr))",
                        lg: "repeat(6, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {games.map((game) => (
          <Card key={game.slug} variant="outlined" sx={{ position: "relative", transition: "transform 150ms", "&:hover": { transform: "translateY(-3px)", borderColor: "primary.main" } }}>
            {game.tag && (
              <Chip
                label={game.tag}
                color={game.tag === "Baru" ? "secondary" : "primary"}
                size="small"
                sx={{ position: "absolute", top: 8, left: 8, zIndex: 1, fontWeight: 700 }}
              />
            )}
            <CardActionArea component={Link} href={`/games/${game.slug}`} sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
              <Box
                sx={{
                  aspectRatio: "1.35 / 1", bgcolor: "var(--color-card-art)", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1, pt: 3,
                }}
              ><Box component={CATEGORY_ICONS[game.category]} aria-hidden sx={{ fontSize: 40 }} /><Typography aria-hidden sx={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em" }}>{game.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}</Typography></Box>
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {game.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">{game.category} · {game.packages.length} paket</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>Harga demo mulai</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.dark" }}>{formatIDR(Math.min(...game.packages.map((item) => item.price)))}</Typography>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
