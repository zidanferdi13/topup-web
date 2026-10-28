"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatIDR } from "@/data/catalog";
import { clearOrders, getOrdersSnapshot, ORDER_STATUSES, parseOrders, saveOrders, subscribeOrders, type DemoOrder, type OrderStatus } from "@/lib/demo-orders";

export default function DemoOrders({ id }: { id?: string }) {
  const raw = useSyncExternalStore(subscribeOrders, getOrdersSnapshot, () => null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);
  let orders: DemoOrder[] = [];
  let storageError = "";
  if (raw !== null) {
    try { orders = parseOrders(raw); }
    catch { storageError = "Riwayat demo tidak bisa dibaca. Data mungkin rusak atau sessionStorage tidak tersedia. Data lama tidak ditimpa."; }
  }
  const order = orders.find((item) => item.id === id);
  const filtered = orders.filter((item) => `${item.id} ${item.game} ${item.packageName}`.toLowerCase().includes(query.trim().toLowerCase()) && (filter === "Semua" || item.status === filter));

  function changeStatus(status: OrderStatus) {
    if (!order) return;
    try {
      const latest = parseOrders(getOrdersSnapshot());
      saveOrders(latest.map((item) => item.id === order.id ? { ...item, status } : item));
      setError("");
    } catch { setError("Status demo gagal disimpan. Riwayat lama tidak dihapus."); }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Header />
      <Box component="main" sx={{ width: "100%", boxSizing: "border-box", maxWidth: 1100, mx: "auto", px: 2, py: 4, flex: 1 }}>
        <Button component={Link} href={id ? "/orders" : "/"}>{id ? "← Riwayat pembelian" : "← Katalog produk"}</Button>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mt: 2, mb: 3 }}>{id ? "Detail pesanan demo" : "Riwayat pembelian demo"}</Typography>
        <Alert severity="info" sx={{ mb: 3 }}>Data hanya untuk tab ini, bukan akun user. Bertahan setelah refresh; biasanya hilang saat tab ditutup. Semua status, pembayaran, dan pengiriman produk adalah simulasi. Jangan transfer uang.</Alert>
        {(storageError || error) && <Alert severity="error" sx={{ mb: 2 }}>{storageError || error}</Alert>}
        {raw === null ? <Typography role="status">Memuat riwayat demo…</Typography> : id ? order ? (
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
            <Chip label={order.status} color={order.status === "Selesai" ? "success" : order.status === "Gagal" ? "error" : "default"} />
            <Box component="dl" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, gap: 1.5, overflowWrap: "anywhere", "& dt": { color: "text.secondary" }, "& dd": { m: 0, fontWeight: 600 } }}>
              <dt>ID pesanan</dt><dd>{order.id}</dd><dt>Dibuat</dt><dd>{new Date(order.createdAt).toLocaleString("id-ID")}</dd>
              <dt>Produk</dt><dd>{order.game} · {order.packageName}</dd><dt>Tujuan demo</dt><dd>{order.playerId}{order.zone ? ` / ${order.zone}` : ""}</dd>
              <dt>Pembayaran</dt><dd>{order.payment}</dd><dt>Harga paket</dt><dd>{formatIDR(order.price)}</dd><dt>Biaya admin</dt><dd>{formatIDR(order.fee)}</dd>
              <dt>Diskon {order.promo}</dt><dd>−{formatIDR(order.discount)}</dd><dt>Total demo</dt><dd>{formatIDR(order.total)}</dd>
            </Box>
            <Alert severity="warning" sx={{ my: 2 }}>Tidak ada QR pembayaran, nomor virtual account, atau pembayaran nyata. Tombol berikut hanya mengubah status demo.</Alert>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {order.status === "Menunggu pembayaran" && <><Button variant="contained" onClick={() => changeStatus("Diproses")}>Simulasikan pembayaran</Button><Button color="error" onClick={() => changeStatus("Dibatalkan")}>Batalkan demo</Button></>}
              {order.status === "Diproses" && <><Button variant="contained" onClick={() => changeStatus("Selesai")}>Simulasikan top-up selesai</Button><Button color="error" onClick={() => changeStatus("Gagal")}>Simulasikan gagal</Button></>}
              {["Selesai", "Gagal", "Dibatalkan"].includes(order.status) && <Typography role="status">Simulasi berakhir. Buat pesanan demo baru untuk mencoba alur lain.</Typography>}
            </Box>
          </Paper>
        ) : !storageError && <Alert severity="warning">Pesanan demo tidak ditemukan di tab ini. Buka riwayat atau buat pesanan dari katalog.</Alert> : (
          <Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <TextField label="Cari pesanan atau produk" value={query} onChange={(event) => setQuery(event.target.value)} sx={{ flex: 1, minWidth: 200 }} />
              <TextField select label="Status" value={filter} onChange={(event) => setFilter(event.target.value)} slotProps={{ select: { native: true } }} sx={{ minWidth: 200 }}>{["Semua", ...ORDER_STATUSES].map((status) => <option key={status}>{status}</option>)}</TextField>
              <Button color="error" onClick={() => setClearing(true)} disabled={!orders.length && !storageError}>Hapus riwayat demo</Button>
            </Box>
            {!storageError && !filtered.length && <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}><Typography sx={{ mb: 2 }}>{orders.length ? "Tidak ada pesanan sesuai filter." : "Belum ada pesanan demo. Pilih produk untuk mulai."}</Typography><Button component={Link} href="/" variant="contained">Pilih produk</Button></Paper>}
            <Box sx={{ display: "grid", gap: 2 }}>
              {filtered.map((item) => <Paper key={item.id} variant="outlined" sx={{ p: 3, borderRadius: 3, overflowWrap: "anywhere" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 1 }}><Typography sx={{ fontWeight: 700 }}>{item.game} · {item.packageName}</Typography><Chip size="small" label={item.status} /></Box>
                <Typography variant="caption" color="text.secondary">{item.id} · {new Date(item.createdAt).toLocaleString("id-ID")}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mt: 2 }}><Typography sx={{ fontWeight: 800 }}>{formatIDR(item.total)}</Typography><Button component={Link} href={`/orders/${item.id}`}>Detail pesanan</Button></Box>
              </Paper>)}
            </Box>
          </Box>
        )}
      </Box>
      <Footer />
      <Dialog open={clearing} onClose={() => setClearing(false)} aria-labelledby="clear-orders-title"><DialogTitle id="clear-orders-title">Hapus semua riwayat demo?</DialogTitle><DialogContent>Catatan demo di tab ini akan dihapus. Tindakan ini tidak dapat dibatalkan.</DialogContent><DialogActions><Button onClick={() => setClearing(false)}>Batal</Button><Button color="error" onClick={() => { try { clearOrders(); setError(""); setClearing(false); } catch { setError("Riwayat tidak bisa dihapus; penyimpanan browser tidak tersedia."); setClearing(false); } }}>Hapus semua</Button></DialogActions></Dialog>
    </Box>
  );
}
