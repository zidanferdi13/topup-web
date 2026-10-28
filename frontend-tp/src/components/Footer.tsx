"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

const LINKS: { title: string; items: string[] }[] = [
  { title: "Produk", items: ["Games", "Voucher", "Pulsa", "E-Wallet", "Paket Data"] },
  { title: "Bantuan", items: ["Cara Top Up", "Status Pesanan", "Hubungi CS", "FAQ"] },
  { title: "Perusahaan", items: ["Tentang Kami", "Karier", "Blog", "Kebijakan Privasi"] },
  { title: "Kerja Sama", items: ["Jadi Mitra", "Penerbit Game", "Afiliasi", "Iklan"] },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#0B1220", color: "#C6CDD8" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: { xs: 5, md: 7 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1A73E8,#FF6B00)",
                }}
              />
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
                TopUp
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 320, mb: 2 }}>
              Platform top up game, voucher, dan pulsa terpercaya dengan proses instan dan harga bersaing.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" sx={{ color: "#C6CDD8" }} aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "#C6CDD8" }} aria-label="Instagram">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "#C6CDD8" }} aria-label="Twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "#C6CDD8" }} aria-label="YouTube">
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {LINKS.map((group) => (
            <Grid key={group.title} size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, mb: 1.5 }}>
                {group.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 1 }}>
                {group.items.map((item) => (
                  <Box component="li" key={item}>
                    <Link href="#" underline="hover" sx={{ color: "#9AA6B6", fontSize: 14 }}>
                      {item}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,.1)" }} />

        <Typography variant="body2" sx={{ color: "#8B97A8" }}>
          © {new Date().getFullYear()} TopUp. Semua hak dilindungi.
        </Typography>
      </Box>
    </Box>
  );
}
