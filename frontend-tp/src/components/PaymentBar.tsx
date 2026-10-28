"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CHANNELS = ["QRIS", "BCA", "Mandiri", "BNI", "DANA", "OVO", "GoPay", "Alfamart", "Indomaret"];

export default function PaymentBar() {
  return (
    <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E7EBF0" }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 3,
          overflowX: "auto",
        }}
      >
        <Typography variant="caption" sx={{ whiteSpace: "nowrap", color: "text.secondary", fontWeight: 600 }}>
          Metode pembayaran
        </Typography>
        {CHANNELS.map((c) => (
          <Box
            key={c}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: "#F1F4F9",
              whiteSpace: "nowrap",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
              {c}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
