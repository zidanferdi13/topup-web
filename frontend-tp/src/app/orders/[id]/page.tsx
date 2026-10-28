import type { Metadata } from "next";
import DemoOrders from "@/components/DemoOrders";

export const metadata: Metadata = { title: "Detail Pesanan Demo | TopUp", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return <DemoOrders id={(await params).id} />;
}
