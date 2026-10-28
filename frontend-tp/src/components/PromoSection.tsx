"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";

const PROMOS = [
  { title: "Paket game, hemat 10%", desc: "Pakai HEMAT10 di checkout. Diskon harga paket demo, tidak termasuk biaya admin.", label: "HEMAT10", href: "/?category=Games#catalog" },
  { title: "Voucher untuk pilihanmu", desc: "Coba HEMAT10 untuk paket voucher digital. Harga dan penawaran masih simulasi.", label: "VOUCHER", href: "/?category=Voucher#catalog" },
  { title: "Coba dulu, tanpa transfer", desc: "Jelajahi checkout dan pantau status pesanan demo. Tidak ada pembayaran nyata.", label: "DEMO", href: "/orders" },
];

export default function PromoSection() {
  return (
    <Box id="promo" sx={{ scrollMarginTop: 96, maxWidth: 1200, mx: "auto", px: 2, py: { xs: 4, md: 6 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Promo Spesial</Typography>
        <Chip label="Penawaran demo" size="small" variant="outlined" />
      </Box>
      <Grid container spacing={3}>
        {PROMOS.map((promo) => (
          <Grid key={promo.title} size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardActionArea component={Link} href={promo.href} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    height: 88,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "var(--color-promo-paper)",
                    color: "var(--color-promo-ink)",
                    fontSize: 28,
                    fontWeight: 800,
                  }}
                >
                  {promo.label}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {promo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {promo.desc}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
