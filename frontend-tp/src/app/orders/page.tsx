import type { Metadata } from "next";
import DemoOrders from "@/components/DemoOrders";

export const metadata: Metadata = { title: "Riwayat Pembelian Demo | TopUp", robots: { index: false } };

export default function OrdersPage() {
  return <DemoOrders />;
}
