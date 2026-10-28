export const ORDER_STATUSES = ["Menunggu pembayaran", "Diproses", "Selesai", "Gagal", "Dibatalkan"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
export type DemoOrder = {
  id: string; createdAt: string; game: string; packageName: string; playerId: string; zone: string;
  payment: string; price: number; fee: number; discount: number; promo: string; total: number; status: OrderStatus;
};

export function promoDiscount(code: string, price: number) {
  return code.trim().toUpperCase() === "HEMAT10" ? Math.round(price * 0.1) : 0;
}

export function parseOrders(raw: string): DemoOrder[] {
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || value.length > 100) throw new Error("Data pesanan demo tidak valid.");
  const ids = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object" ||
      !["id", "createdAt", "game", "packageName", "playerId", "zone", "payment", "promo"].every((key) => typeof item[key] === "string" && item[key].length <= 200) ||
      !/^DEMO-[0-9a-f-]{36}$/i.test(item.id) || !Number.isFinite(Date.parse(item.createdAt)) || ids.has(item.id) ||
      !["price", "fee", "discount", "total"].every((key) => Number.isSafeInteger(item[key]) && item[key] >= 0) ||
      item.discount > item.price || item.total !== item.price + item.fee - item.discount || !ORDER_STATUSES.includes(item.status)) {
      throw new Error("Data pesanan demo tidak valid.");
    }
    ids.add(item.id);
  }
  return value as DemoOrder[];
}

const KEY = "topup-demo-orders-v1";
const EVENT = "topup-demo-orders-change";
export function getOrdersSnapshot() {
  try { return sessionStorage.getItem(KEY) ?? "[]"; }
  catch { return "storage-unavailable"; }
}
export function subscribeOrders(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", callback); };
}
export function saveOrders(orders: DemoOrder[]) {
  parseOrders(JSON.stringify(orders));
  sessionStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(EVENT));
}
export function clearOrders() {
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}
