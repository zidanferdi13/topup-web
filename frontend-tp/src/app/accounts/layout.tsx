import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountsLayout({ children }: { children: ReactNode }) {
  return <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}><Header /><Box component="main" sx={{ flex: 1, width: "100%", maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>{children}</Box><Footer /></Box>;
}
