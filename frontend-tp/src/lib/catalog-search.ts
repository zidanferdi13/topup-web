import { GAMES } from "../data/catalog";

export const CATEGORIES = ["Semua", "Games", "Voucher", "Pulsa", "E-Wallet"];
export const CATALOG_NAV = [
  { label: "Home", href: "/" },
  ...CATEGORIES.slice(1).map((category) => ({ label: category === "Games" ? "Game" : category, href: `/?category=${encodeURIComponent(category)}#catalog` })),
  { label: "Jual Beli Akun", href: "/accounts" },
  { label: "Promo", href: "/#promo" },
];

export function filterCatalog(query: string, category: string) {
  const active = CATEGORIES.includes(category) ? category : "Semua";
  const words = query.trim().toLocaleLowerCase("id-ID").split(/\s+/).filter(Boolean);
  return GAMES.filter((game) => (active === "Semua" || game.category === active) && words.every((word) =>
    `${game.name} ${game.slug} ${game.category} ${game.packages.map((item) => `${item.name} ${item.id}`).join(" ")}`.toLocaleLowerCase("id-ID").includes(word)));
}
