import { GAMES } from "../data/catalog";

export const PRODUCT_CATEGORIES = ["Semua", "Games", "Voucher", "Pulsa", "E-Wallet"];
export const INITIAL_PRODUCTS = GAMES.flatMap((game) => game.packages.map((item) => ({ ...item, game: game.name, category: game.category, discount: 0, active: true })));
export type Product = typeof INITIAL_PRODUCTS[number];
export const finalPrice = (product: Product) => Math.round(product.price * (1 - product.discount / 100));

export function selectProducts(products: Product[], category: string, game: string, query: string, sort: string) {
  const needle = query.trim().toLowerCase();
  return products.filter((item) => (category === "Semua" || item.category === category) && (!game || item.game === game) && `${item.game} ${item.name} ${item.id}`.toLowerCase().includes(needle)).sort((a, b) => {
    switch (sort) {
      case "price-asc": return finalPrice(a) - finalPrice(b) || a.id.localeCompare(b.id);
      case "price-desc": return finalPrice(b) - finalPrice(a) || a.id.localeCompare(b.id);
      case "discount-desc": return b.discount - a.discount || a.id.localeCompare(b.id);
      case "name-desc": return `${b.game} ${b.name}`.localeCompare(`${a.game} ${a.name}`, "id", { numeric: true });
      default: return `${a.game} ${a.name}`.localeCompare(`${b.game} ${b.name}`, "id", { numeric: true });
    }
  });
}
