"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Link from "next/link";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { CATALOG_NAV } from "@/lib/catalog-search";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 64, md: 72 }, maxWidth: 1200, width: "100%", mx: "auto" }}>
        <Box component={Link} href="/" aria-label="TopUp beranda" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "primary.main",
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
            TopUp
          </Typography>
        </Box>

        <Box
          component="form" role="search" aria-label="Pencarian header" action="/#catalog"
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1,
            flex: 1,
            maxWidth: 680,
            ml: "auto",
            px: 1.5,
            py: 0.75,
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <InputBase name="q" placeholder="Cari game atau voucher..." inputProps={{ "aria-label": "Cari katalog", maxLength: 100 }} sx={{ flex: 1, minWidth: 0, fontSize: 14 }} />
          <IconButton type="submit" aria-label="Cari produk"><SearchIcon fontSize="small" /></IconButton>
        </Box>

        <IconButton component={Link} href="/orders" sx={{ ml: { xs: "auto", sm: 0 } }} aria-label="Riwayat pembelian">
          <ReceiptLongOutlinedIcon />
        </IconButton>

        <Button
          component={Link}
          href="/login"
          variant="contained"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Masuk
        </Button>

        <IconButton
          sx={{ display: { xs: "inline-flex", md: "none" } }}
          onClick={() => setOpen(true)}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Box component="nav" aria-label="Navigasi katalog" sx={{ display: { xs: "none", md: "flex" }, maxWidth: 1200, width: "100%", mx: "auto", px: 2, pb: 1, gap: 1 }}>
        {CATALOG_NAV.map((item) => <Button component={Link} href={item.href} key={item.label} color="inherit" sx={{ color: "text.secondary", fontSize: 13, whiteSpace: "nowrap" }}>{item.label}</Button>)}
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto", alignSelf: "center" }}>Katalog digital · Mode demo</Typography>
      </Box>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <Box component="form" role="search" aria-label="Pencarian menu mobile" action="/#catalog" sx={{ display: "flex", mx: 2 }}>
            <InputBase name="q" placeholder="Cari produk..." inputProps={{ "aria-label": "Cari katalog mobile", maxLength: 100 }} sx={{ flex: 1, minWidth: 0 }} />
            <IconButton type="submit" aria-label="Cari produk mobile"><SearchIcon /></IconButton>
          </Box>
          <List>
            <ListItemButton component={Link} href="/orders" onClick={() => setOpen(false)}><ListItemText primary="Riwayat pembelian" /></ListItemButton>
            {CATALOG_NAV.map((item) => (
              <ListItemButton component={Link} href={item.href} key={item.label} onClick={() => setOpen(false)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ px: 2 }}>
            <Button component={Link} href="/login" onClick={() => setOpen(false)} fullWidth variant="contained">
              Masuk
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
