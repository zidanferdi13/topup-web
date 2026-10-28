"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { formatIDR } from "@/data/catalog";
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES, finalPrice, selectProducts, type Product } from "@/lib/admin-products";

const ADMIN_MENU = [
  { label: "Produk & diskon", icon: Inventory2Outlined },
  { label: "Promo", icon: LocalOfferOutlined },
  { label: "History pembelian", icon: ReceiptLongOutlined },
];

type Promo = { id: string; code: string; title: string; discount: number; active: boolean };
const INITIAL_PROMOS: Promo[] = [{ id: "promo-1", code: "HEMAT10", title: "Diskon top up demo", discount: 10, active: true }];
const HISTORY = [
  { id: "DEMO-001", date: "2026-10-17", user: "andi@example.test", product: "Mobile Legends · 86 Diamonds", amount: 20000, payment: "QRIS", status: "Selesai" },
  { id: "DEMO-002", date: "2026-10-17", user: "budi@example.test", product: "Free Fire · 140 Diamonds", amount: 20000, payment: "DANA", status: "Menunggu" },
  { id: "DEMO-003", date: "2026-10-16", user: "citra@example.test", product: "PUBG Mobile · 60 UC", amount: 15000, payment: "BCA Virtual Account", status: "Gagal" },
  { id: "DEMO-004", date: "2026-10-15", user: "andi@example.test", product: "Google Play · 20.000 IDR", amount: 21500, payment: "GoPay", status: "Selesai" },
];
const panel = { p: { xs: 2, md: 3 }, borderRadius: 3 };

export default function AdminDashboard() {
  // ponytail: gerbang demo dalam memori, bukan autentikasi; ganti dengan session dan role backend sebelum produksi.
  const [entered, setEntered] = useState(false);
  const [tab, setTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [category, setCategory] = useState("Semua");
  const [gameFilter, setGameFilter] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [editing, setEditing] = useState<Product | null>(null);
  const [promo, setPromo] = useState<Promo | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function logout() {
    setEntered(false);
    setProducts(INITIAL_PRODUCTS);
    setCategory("Semua");
    setGameFilter("");
    setSort("name-asc");
    setPromos(INITIAL_PROMOS);
    setTab(0);
    setMenuOpen(false);
    setQuery("");
    setStatus("Semua");
    setMessage("");
    setError("");
    setEditing(null);
    setPromo(null);
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const price = Number(data.get("price"));
    const discount = Number(data.get("discount"));
    if (!Number.isSafeInteger(price) || price < 0 || price > 999999999 || !Number.isFinite(discount) || discount < 0 || discount > 100) {
      setError("Harga harus bilangan bulat 0–999.999.999; diskon 0–100%.");
      return;
    }
    setProducts(products.map((item) => item.id === editing.id ? { ...item, price, discount } : item));
    setEditing(null);
    setMessage("Harga dan diskon demo disimpan sementara. Checkout publik tidak berubah.");
  }

  function savePromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!promo) return;
    const data = new FormData(event.currentTarget);
    const code = String(data.get("code") ?? "").trim().toUpperCase();
    const title = String(data.get("title") ?? "").trim();
    const discount = Number(data.get("discount"));
    if (!/^[A-Z0-9_-]{3,30}$/.test(code) || !title || title.length > 100 || !Number.isFinite(discount) || discount <= 0 || discount > 100) {
      setError("Isi kode 3–30 huruf/angka, judul, dan diskon lebih dari 0 hingga 100%.");
      return;
    }
    if (promos.some((item) => item.id !== promo.id && item.code === code)) {
      setError("Kode promo sudah dipakai.");
      return;
    }
    const next = { ...promo, code, title, discount };
    setPromos(promos.some((item) => item.id === promo.id) ? promos.map((item) => item.id === promo.id ? next : item) : [...promos, next]);
    setPromo(null);
    setMessage("Promo demo disimpan sementara. Belum diterapkan ke checkout.");
  }

  if (!entered) return (
    <Box component="main" sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default", px: 2, py: 4 }}>
      <Paper variant="outlined" sx={{ ...panel, width: "100%", maxWidth: 440 }}>
        <Typography variant="overline" color="primary">TopUp · Admin</Typography>
        <Typography component="h1" variant="h4" sx={{ mt: 1, mb: 2 }}>Login admin demo</Typography>
        <Alert severity="warning" sx={{ mb: 3 }}>Simulasi frontend, bukan login aman. Gunakan data contoh. Tidak ada validasi akun, session, atau hak akses admin.</Alert>
        <Box component="form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); setEntered(true); }} sx={{ display: "grid", gap: 2 }}>
          <TextField required label="Email admin demo" name="email" type="email" autoComplete="off" slotProps={{ htmlInput: { maxLength: 254 } }} />
          <TextField required label="Password contoh" name="password" type="password" autoComplete="off" slotProps={{ htmlInput: { minLength: 8, maxLength: 128 } }} helperText="Sembarang password contoh, minimal 8 karakter. Jangan gunakan password asli." />
          <Button type="submit" variant="contained" size="large">Buka dashboard demo</Button>
          <Button component={Link} href="/">Kembali ke beranda</Button>
        </Box>
      </Paper>
    </Box>
  );

  const needle = query.trim().toLowerCase();
  const filteredProducts = selectProducts(products, category, gameFilter, query, sort);
  const brands = [...new Set(products.filter((item) => category === "Semua" || item.category === category).map((item) => item.game))];
  const orders = HISTORY.filter((order) => `${order.id} ${order.user} ${order.product}`.toLowerCase().includes(needle) && (status === "Semua" || status === order.status));

  const navigation = (
    <Box component="nav" aria-label="Menu admin" sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, px: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}><Typography aria-hidden sx={{ fontWeight: 800, fontSize: 24, width: 24 }}>T.</Typography><Box data-sidebar-label><Typography sx={{ fontWeight: 800, fontSize: 24 }}>TopUp.</Typography><Typography variant="caption" sx={{ color: "#B6C8E2" }}>ADMIN DEMO</Typography></Box></Box>
        <IconButton onClick={() => setMenuOpen(false)} aria-label="Tutup menu admin" sx={{ display: { md: "none" }, color: "inherit" }}><CloseIcon /></IconButton>
      </Box>
      <Typography data-sidebar-label variant="overline" sx={{ px: 1, color: "#B6C8E2" }}>Kelola toko</Typography>
      <List>
        {ADMIN_MENU.map(({ label, icon: Icon }, index) => (
          <ListItemButton key={label} aria-label={label} selected={tab === index} aria-current={tab === index ? "page" : undefined} onClick={() => { setTab(index); setQuery(""); setMessage(""); setMenuOpen(false); }} sx={{ borderRadius: 2, mb: 1, minHeight: 48, "&.Mui-selected": { bgcolor: "#224775" }, "&.Mui-selected:hover": { bgcolor: "#2B5689" }, "&:hover": { bgcolor: "#19365C" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}><Icon /></ListItemIcon>
            <ListItemText data-sidebar-label primary={label} />
          </ListItemButton>
        ))}
      </List>
      <Typography data-sidebar-label variant="caption" sx={{ display: "block", px: 1, mt: 3, color: "#B6C8E2", whiteSpace: "normal", width: 208 }}>Perubahan hanya berlaku selama halaman terbuka.</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box component="aside" sx={{
        display: { xs: "none", md: "block" }, width: 88, position: "fixed", inset: "0 auto 0 0", zIndex: 1200,
        overflowX: "hidden", overflowY: "auto", bgcolor: "#0F2446", color: "white", whiteSpace: "nowrap",
        transition: "width 180ms ease",
        "& nav": { width: 256, boxSizing: "border-box" },
        "& [data-sidebar-label]": { opacity: 0, visibility: "hidden", transition: "opacity 180ms ease" },
        "&:hover, &:focus-within": { width: 256, boxShadow: 6, "& [data-sidebar-label]": { opacity: 1, visibility: "visible" } },
        "@media (prefers-reduced-motion: reduce)": { transition: "none", "& [data-sidebar-label]": { transition: "none" } },
      }}>{navigation}</Box>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: 280, maxWidth: "90vw", bgcolor: "#0F2446", color: "white" } }}>{navigation}</Drawer>
      <Box sx={{ ml: { md: "88px" }, minWidth: 0 }}>
      <Box component="header" sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", px: 2, py: 2 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <IconButton aria-label="Buka menu admin" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} sx={{ display: { md: "none" } }}><MenuIcon /></IconButton>
          <Typography sx={{ fontWeight: 800, flex: 1 }}>Admin demo</Typography>
          <Button component={Link} href="/" color="inherit">Lihat toko</Button>
          <Button onClick={logout} color="inherit" variant="outlined">Keluar demo</Button>
        </Box>
      </Box>
      <Box component="main" sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
        <Typography variant="overline" color="text.secondary">Dashboard admin</Typography>
        <Typography id="admin-section-heading" component="h1" variant="h4" sx={{ fontWeight: 800 }}>{ADMIN_MENU[tab].label}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Kelola katalog dan promo, pantau pembelian contoh.</Typography>
        <Alert severity="warning" sx={{ mb: 3 }}>Demo saja. Semua perubahan hilang saat refresh, keluar demo, atau meninggalkan halaman. Harga publik tidak berubah. History berisi data fiktif; bukan transaksi user nyata.</Alert>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
          {[["Paket produk", String(products.length)], ["Promo aktif", String(promos.filter((item) => item.active).length)], ["Penjualan selesai (contoh)", formatIDR(HISTORY.filter((order) => order.status === "Selesai").reduce((sum, order) => sum + order.amount, 0))]].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={panel}><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h5" sx={{ mt: 1 }}>{value}</Typography></Paper>
          ))}
        </Box>
        {message && <Alert severity="success" role="status" sx={{ mb: 2 }}>{message}</Alert>}
        <Paper component="section" aria-labelledby="admin-section-heading" variant="outlined" sx={{ ...panel, minWidth: 0 }}>
          {tab === 0 && <Box>
            <Box role="group" aria-label="Kategori produk admin" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              {PRODUCT_CATEGORIES.map((value) => <Button key={value} variant={category === value ? "contained" : "outlined"} aria-pressed={category === value} onClick={() => { setCategory(value); setGameFilter(""); }}>{value} ({products.filter((item) => value === "Semua" || item.category === value).length})</Button>)}
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
              <TextField select label="Game / brand" value={gameFilter} onChange={(event) => setGameFilter(event.target.value)} slotProps={{ select: { native: true } }}><option value="">Semua game / brand</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</TextField>
              <TextField select label="Urutkan paket" value={sort} onChange={(event) => setSort(event.target.value)} slotProps={{ select: { native: true } }}>{[["name-asc", "Nama A–Z"], ["name-desc", "Nama Z–A"], ["price-asc", "Harga akhir terendah"], ["price-desc", "Harga akhir tertinggi"], ["discount-desc", "Diskon terbesar"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</TextField>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", mb: 2 }}><Typography role="status" variant="body2">{filteredProducts.length} paket ditampilkan · {filteredProducts.filter((item) => item.active).length} aktif</Typography><Button onClick={() => { setCategory("Semua"); setGameFilter(""); setSort("name-asc"); setQuery(""); }}>Reset filter</Button></Box>
          </Box>}
          {tab !== 1 && <TextField label={tab === 0 ? "Cari game, paket, atau SKU" : "Cari pesanan, email, atau produk"} value={query} onChange={(event) => setQuery(event.target.value)} fullWidth sx={{ mb: 2 }} />}
          {tab === 0 && <TableContainer><Table size="small" aria-label="Produk dan diskon"><TableHead><TableRow>{["Produk / SKU demo", "Kategori", "Harga dasar", "Diskon", "Harga akhir", "Status", "Aksi"].map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead><TableBody>
            {filteredProducts.map((item) => <TableRow key={item.id}><TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>{item.game} · {item.name}</Typography><Typography variant="caption" color="text.secondary">{item.id}</Typography></TableCell><TableCell>{item.category}</TableCell><TableCell sx={{ whiteSpace: "nowrap" }}>{formatIDR(item.price)}</TableCell><TableCell>{item.discount}%</TableCell><TableCell sx={{ whiteSpace: "nowrap" }}>{formatIDR(finalPrice(item))}</TableCell><TableCell><Chip size="small" label={item.active ? "Aktif" : "Nonaktif"} color={item.active ? "success" : "default"} /></TableCell><TableCell><Button aria-label={`${item.active ? "Nonaktifkan" : "Aktifkan"} paket ${item.id}`} onClick={() => { setProducts((current) => current.map((entry) => entry.id === item.id ? { ...entry, active: !entry.active } : entry)); setMessage("Status paket demo diperbarui. Checkout publik tidak berubah."); }}>{item.active ? "Nonaktifkan" : "Aktifkan"}</Button><Button aria-label={`Edit ${item.game} ${item.name}`} onClick={() => { setEditing(item); setError(""); }}>Edit</Button></TableCell></TableRow>)}
            {!filteredProducts.length && <TableRow><TableCell colSpan={7}>Produk tidak ditemukan. Coba kata lain atau reset filter.</TableCell></TableRow>}
          </TableBody></Table></TableContainer>}
          {tab === 1 && <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2 }}><Typography component="h2" variant="h6">Kode promo</Typography><Button variant="contained" onClick={() => { setError(""); setPromo({ id: crypto.randomUUID(), code: "", title: "", discount: 10, active: true }); }}>Tambah promo</Button></Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Persentase demo tanpa jadwal atau kuota. Promo belum digabung dengan diskon produk.</Typography>
            {promos.map((item) => <Box key={item.id} sx={{ borderTop: "1px solid", borderColor: "divider", py: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
              <Box sx={{ flex: 1, minWidth: 160, overflowWrap: "anywhere" }}><Typography sx={{ fontWeight: 700 }}>{item.code} · {item.discount}%</Typography><Typography variant="body2">{item.title}</Typography></Box>
              <Chip label={item.active ? "Aktif" : "Nonaktif"} color={item.active ? "success" : "default"} size="small" />
              <Button aria-label={`Edit promo ${item.code}`} onClick={() => { setPromo(item); setError(""); }}>Edit</Button>
              <Button aria-label={`${item.active ? "Nonaktifkan" : "Aktifkan"} ${item.code}`} onClick={() => { setPromos(promos.map((entry) => entry.id === item.id ? { ...entry, active: !entry.active } : entry)); setMessage("Status promo demo diperbarui."); }}>{item.active ? "Nonaktifkan" : "Aktifkan"}</Button>
            </Box>)}
          </Box>}
          {tab === 2 && <Box>
            <TextField select label="Status pembelian" value={status} onChange={(event) => setStatus(event.target.value)} slotProps={{ select: { native: true } }} sx={{ mb: 2, minWidth: 200 }}>{["Semua", "Selesai", "Menunggu", "Gagal"].map((value) => <option key={value}>{value}</option>)}</TextField>
            <TableContainer><Table size="small" aria-label="History pembelian contoh"><TableHead><TableRow>{["Pesanan / tanggal", "User", "Produk", "Total / pembayaran", "Status"].map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead><TableBody>
              {orders.map((order) => <TableRow key={order.id}><TableCell sx={{ whiteSpace: "nowrap" }}>{order.id}<Typography variant="caption" sx={{ display: "block" }}>{order.date}</Typography></TableCell><TableCell>{order.user}</TableCell><TableCell>{order.product}</TableCell><TableCell sx={{ whiteSpace: "nowrap" }}>{formatIDR(order.amount)}<Typography variant="caption" sx={{ display: "block" }}>{order.payment}</Typography></TableCell><TableCell><Chip size="small" label={order.status} color={order.status === "Selesai" ? "success" : order.status === "Gagal" ? "error" : "warning"} /></TableCell></TableRow>)}
              {!orders.length && <TableRow><TableCell colSpan={5}>Pembelian tidak ditemukan.</TableCell></TableRow>}
            </TableBody></Table></TableContainer>
          </Box>}
        </Paper>
      </Box>
      </Box>
      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="xs" aria-labelledby="product-dialog-title">
        <Box component="form" onSubmit={saveProduct} key={editing?.id}>
          <DialogTitle id="product-dialog-title">Edit harga & diskon</DialogTitle><DialogContent sx={{ display: "grid", gap: 2 }}>
            <Typography>{editing?.game} · {editing?.name}</Typography>
            <TextField required label="Harga dasar (Rp)" name="price" type="number" defaultValue={editing?.price} slotProps={{ htmlInput: { min: 0, max: 999999999, step: 1 } }} />
            <TextField required label="Diskon (%)" name="discount" type="number" defaultValue={editing?.discount} slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }} />
            {error && <Alert severity="error">{error}</Alert>}
          </DialogContent><DialogActions><Button onClick={() => setEditing(null)}>Batal</Button><Button type="submit" variant="contained">Simpan demo</Button></DialogActions>
        </Box>
      </Dialog>
      <Dialog open={!!promo} onClose={() => setPromo(null)} fullWidth maxWidth="xs" aria-labelledby="promo-dialog-title">
        <Box component="form" onSubmit={savePromo} key={promo?.id}>
          <DialogTitle id="promo-dialog-title">Atur promo demo</DialogTitle><DialogContent sx={{ display: "grid", gap: 2, pt: "12px !important" }}>
            <TextField required label="Kode promo" name="code" defaultValue={promo?.code} slotProps={{ htmlInput: { minLength: 3, maxLength: 30, pattern: "[A-Za-z0-9_\\-]{3,30}" } }} helperText="3–30 huruf, angka, tanda hubung, atau garis bawah." />
            <TextField required label="Judul promo" name="title" defaultValue={promo?.title} slotProps={{ htmlInput: { maxLength: 100, pattern: ".*\\S.*" } }} />
            <TextField required label="Diskon promo (%)" name="discount" type="number" defaultValue={promo?.discount} slotProps={{ htmlInput: { min: 0.01, max: 100, step: 0.01 } }} />
            {error && <Alert severity="error">{error}</Alert>}
          </DialogContent><DialogActions><Button onClick={() => setPromo(null)}>Batal</Button><Button type="submit" variant="contained">Simpan promo</Button></DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
