"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrdersSnapshot, parseOrders, promoDiscount, saveOrders } from "@/lib/demo-orders";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, TextField, Typography } from "@mui/material";
import { formatIDR, PAYMENT_METHODS, type Game } from "@/data/catalog";

const sectionStyle = { p: { xs: 2.5, md: 3 }, borderRadius: 3 };
const choiceStyle = {
  display: "flex", alignItems: "center", gap: 1.5, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, cursor: "pointer",
  "&:has(input:checked)": { borderColor: "primary.main", bgcolor: "#EFF6FF" },
  "&:focus-within": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
  "& input": { accentColor: "#1A73E8", width: 18, height: 18, flexShrink: 0 },
};

export default function TopUpForm({ game }: { game: Game }) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const [creating, setCreating] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [zone, setZone] = useState("");
  const [packageId, setPackageId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const selectedPackage = game.packages.find((item) => item.id === packageId);
  const payment = PAYMENT_METHODS.find((item) => item.id === paymentId);
  const discount = promoDiscount(appliedPromo, selectedPackage?.price ?? 0);
  const total = (selectedPackage?.price ?? 0) + (payment?.fee ?? 0) - discount;

  function createOrder() {
    if (creating || !selectedPackage || !payment) return;
    setCreating(true);
    try {
      const orders = parseOrders(getOrdersSnapshot());
      if (orders.length >= 100) throw new Error("Riwayat demo penuh (100 pesanan). Hapus riwayat dahulu.");
      const id = `DEMO-${crypto.randomUUID()}`;
      saveOrders([{ id, createdAt: new Date().toISOString(), game: game.name, packageName: selectedPackage.name, playerId: playerId.trim(), zone: zone.trim(), payment: payment.name, price: selectedPackage.price, fee: payment.fee, discount, promo: appliedPromo, total, status: "Menunggu pembayaran" }, ...orders]);
      router.push(`/orders/${id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Penyimpanan demo gagal.");
      setCreating(false);
    }
  }
  const numericId = ["User ID", "Player ID", "UID", "Nomor HP"].includes(game.idLabel);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!playerId.trim() || (game.zoneLabel && !zone.trim()) || !selectedPackage || !payment) {
      setError("Lengkapi data akun, paket, dan metode pembayaran.");
      return;
    }
    setError("");
    setConfirmed(true);
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: { xs: 3, md: 5 } }}>
      <Button component={Link} href="/" sx={{ mb: 2 }}>← Kembali ke katalog</Button>
      <Paper variant="outlined" sx={{ ...sectionStyle, display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
        <Box aria-hidden sx={{ width: { xs: 64, md: 88 }, height: { xs: 64, md: 88 }, borderRadius: 3, bgcolor: game.color, color: "white", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
          {game.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}
        </Box>
        <Box>
          <Typography variant="overline" color="primary">Top up · {game.category}</Typography>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800, fontSize: { xs: 24, md: 32 } }}>{game.name}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Isi data akun, pilih paket, lalu metode pembayaran.</Typography>
        </Box>
      </Paper>
      <Alert severity="info" sx={{ mb: 3 }}>Mode demo. Harga, paket, dan biaya hanya contoh. Tidak ada transaksi atau pembayaran nyata; ID akun belum diverifikasi.</Alert>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 340px" }, gap: 3, alignItems: "start" }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <Paper component="section" aria-labelledby="account-heading" variant="outlined" sx={sectionStyle}>
            <Typography id="account-heading" component="h2" variant="h6" sx={{ mb: 1 }}>1. Masukkan data akun</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Periksa kembali tujuan top up. Jangan masukkan password akun.</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: game.zoneLabel ? "2fr 1fr" : "1fr" }, gap: 2 }}>
              <TextField
                required fullWidth label={game.idLabel} value={playerId}
                type={game.idLabel === "Email penerima" ? "email" : "text"}
                onChange={(event) => setPlayerId(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 100, inputMode: numericId ? "numeric" : undefined, pattern: numericId ? (game.idLabel === "Nomor HP" ? "[0-9+]{8,16}" : "[0-9]{3,20}") : ".*\\S.*" } }}
                helperText={game.idLabel === "Riot ID" ? "Format: Nama#Tag" : numericId ? "Gunakan ID atau nomor tujuan yang benar." : "Sesuai akun tujuan top up."}
              />
              {game.zoneLabel === "Server" ? (
                <TextField select required label="Server" value={zone} onChange={(event) => setZone(event.target.value)} slotProps={{ select: { native: true } }}>
                  <option value="" />
                  {["Asia", "America", "Europe", "TW, HK, MO"].map((server) => <option key={server} value={server}>{server}</option>)}
                </TextField>
              ) : game.zoneLabel ? (
                <TextField required label={game.zoneLabel} value={zone} onChange={(event) => setZone(event.target.value)} slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]{1,10}", maxLength: 10 } }} helperText="Angka dalam tanda kurung." />
              ) : null}
            </Box>
          </Paper>

          <Paper component="fieldset" sx={{ ...sectionStyle, m: 0, minWidth: 0, border: "1px solid", borderColor: "divider" }}>
            <Typography component="legend" variant="h6" sx={{ px: 0.5 }}>2. Pilih paket</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
              {game.packages.map((item) => (
                <Box component="label" key={item.id} sx={choiceStyle}>
                  <input type="radio" name="package" required value={item.id} checked={packageId === item.id} onChange={() => setPackageId(item.id)} />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    <Typography variant="body2" color="primary">{formatIDR(item.price)}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper component="fieldset" sx={{ ...sectionStyle, m: 0, minWidth: 0, border: "1px solid", borderColor: "divider" }}>
            <Typography component="legend" variant="h6" sx={{ px: 0.5 }}>3. Pilih pembayaran</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
              {PAYMENT_METHODS.map((method) => (
                <Box component="label" key={method.id} sx={choiceStyle}>
                  <input type="radio" name="payment" required value={method.id} checked={paymentId === method.id} onChange={() => setPaymentId(method.id)} />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{method.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{method.group} · {method.fee ? `Biaya ${formatIDR(method.fee)}` : "Tanpa biaya"}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <Paper component="aside" variant="outlined" aria-labelledby="summary-heading" sx={{ ...sectionStyle, position: { md: "sticky" }, top: 96 }}>
          <Chip label="Simulasi pesanan" size="small" color="primary" variant="outlined" sx={{ mb: 2 }} />
          <Typography id="summary-heading" component="h2" variant="h6">Ringkasan pilihan</Typography>
          <Box component="dl" sx={{ m: 0, py: 2, display: "grid", gap: 1, overflowWrap: "anywhere", "& dt": { color: "text.secondary", fontSize: 13 }, "& dd": { m: 0, fontWeight: 600 } }}>
            <dt>Produk</dt><dd>{game.name}</dd>
            <dt>{game.idLabel}{game.zoneLabel ? ` / ${game.zoneLabel}` : ""}</dt><dd>{playerId.trim() || "Belum diisi"}{zone.trim() ? ` / ${zone.trim()}` : ""}</dd>
            <dt>Paket</dt><dd>{selectedPackage?.name ?? "Belum dipilih"}</dd>
            <dt>Pembayaran</dt><dd>{payment?.name ?? "Belum dipilih"}</dd>
          </Box>
          <Divider />
          <Box sx={{ my: 2 }}>
            <TextField label="Kode promo demo" value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setAppliedPromo(""); setPromoError(""); }} fullWidth size="small" helperText={promoError || (appliedPromo ? "HEMAT10 aktif: diskon 10% harga paket." : "Coba HEMAT10. Biaya admin tidak didiskon.")} error={!!promoError} slotProps={{ htmlInput: { maxLength: 30 } }} />
            <Button type="button" onClick={() => { const code = promoCode.trim().toUpperCase(); if (code !== "HEMAT10") { setAppliedPromo(""); setPromoError("Kode promo demo tidak tersedia."); } else { setAppliedPromo(code); setPromoError(""); } }}>Terapkan promo</Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}><Typography variant="body2">Harga paket</Typography><Typography variant="body2">{selectedPackage ? formatIDR(selectedPackage.price) : "—"}</Typography></Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}><Typography variant="body2">Biaya admin</Typography><Typography variant="body2">{payment ? formatIDR(payment.fee) : "—"}</Typography></Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}><Typography variant="body2">Diskon promo</Typography><Typography variant="body2">−{formatIDR(discount)}</Typography></Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }} aria-live="polite"><Typography sx={{ fontWeight: 700 }}>Total demo</Typography><Typography color="primary" sx={{ fontWeight: 800 }}>{selectedPackage && payment ? formatIDR(total) : "—"}</Typography></Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" fullWidth size="large">Konfirmasi pilihan</Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>Demo frontend saja. Konfirmasi berikutnya membuat catatan demo di tab ini, bukan transaksi nyata.</Typography>
        </Paper>
      </Box>
      <Dialog open={confirmed} onClose={() => setConfirmed(false)} fullWidth maxWidth="xs" aria-labelledby="confirmation-heading">
        <DialogTitle id="confirmation-heading">Pilihan demo dikonfirmasi</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Hanya catatan demo disimpan di sessionStorage tab ini. Gunakan ID contoh; tidak ada pembayaran atau top-up nyata.</Alert>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography sx={{ fontWeight: 700 }}>{game.name} · {selectedPackage?.name}</Typography>
          <Typography sx={{ overflowWrap: "anywhere", mt: 1 }}>{game.idLabel}: {playerId.trim()}{zone.trim() ? ` / ${zone.trim()}` : ""}</Typography>
          <Typography sx={{ mt: 1 }}>{payment?.name} · {formatIDR(total)}</Typography>
        </DialogContent>
        <DialogActions><Button disabled={creating} onClick={() => setConfirmed(false)}>Ubah pilihan</Button><Button disabled={creating} onClick={createOrder} variant="contained">{creating ? "Menyimpan…" : "Buat pesanan demo"}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
