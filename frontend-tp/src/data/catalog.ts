export type Package = { id: string; name: string; price: number };

export type Game = {
  slug: string;
  name: string;
  category: "Games" | "Voucher" | "Pulsa" | "E-Wallet";
  tag?: string;
  color: string;
  idLabel: string;
  zoneLabel?: string;
  packages: Package[];
};

const pkgs = (prefix: string, unit: string, items: [number, number][]): Package[] =>
  items.map(([amount, price]) => ({
    id: `${prefix}-${amount}`,
    name: `${amount.toLocaleString("id-ID")} ${unit}`,
    price,
  }));

const NOMINALS: [number, number][] = [
  [10000, 11500],
  [25000, 26500],
  [50000, 51500],
  [100000, 101500],
];

// ponytail: demo data lokal; ganti dengan GET /api/products saat integrasi backend.
export const GAMES: Game[] = [
  { slug: "mobile-legends", name: "Mobile Legends", category: "Games", tag: "Populer", color: "#2A5BFF", idLabel: "User ID", zoneLabel: "Zone ID", packages: pkgs("mlbb", "Diamonds", [[86, 20000], [172, 40000], [257, 60000], [344, 80000], [706, 160000], [2195, 480000]]) },
  { slug: "free-fire", name: "Free Fire", category: "Games", tag: "Populer", color: "#FF6B2C", idLabel: "Player ID", packages: pkgs("ff", "Diamonds", [[70, 10000], [140, 20000], [355, 50000], [720, 100000]]) },
  { slug: "pubg-mobile", name: "PUBG Mobile", category: "Games", color: "#F2A600", idLabel: "Player ID", packages: pkgs("pubgm", "UC", [[60, 15000], [325, 75000], [660, 150000], [1800, 375000]]) },
  { slug: "genshin-impact", name: "Genshin Impact", category: "Games", color: "#3F8ECD", idLabel: "UID", zoneLabel: "Server", packages: pkgs("gi", "Genesis Crystals", [[60, 16000], [330, 79000], [1090, 249000], [2240, 479000]]) },
  { slug: "valorant", name: "Valorant", category: "Games", tag: "Baru", color: "#E8455A", idLabel: "Riot ID", packages: pkgs("val", "Points", [[475, 56000], [1000, 112000], [2050, 224000], [3650, 392000]]) },
  { slug: "roblox", name: "Roblox", category: "Games", color: "#B44BE0", idLabel: "Username", packages: pkgs("rbx", "Robux", [[80, 16000], [400, 79000], [800, 159000], [1700, 319000]]) },
  { slug: "steam-wallet", name: "Steam Wallet", category: "Voucher", color: "#1B2838", idLabel: "Email penerima", packages: pkgs("steam", "IDR", [[12000, 13500], [45000, 47000], [60000, 62000], [120000, 123000]]) },
  { slug: "google-play", name: "Google Play", category: "Voucher", color: "#34A853", idLabel: "Email penerima", packages: pkgs("gplay", "IDR", [[20000, 21500], [50000, 51500], [100000, 101500], [150000, 151500]]) },
  { slug: "pulsa", name: "Pulsa All Operator", category: "Pulsa", color: "#00A9E0", idLabel: "Nomor HP", packages: pkgs("pulsa", "Pulsa", NOMINALS) },
  { slug: "paket-data", name: "Paket Data", category: "Pulsa", color: "#7C4DFF", idLabel: "Nomor HP", packages: [{ id: "data-5", name: "5 GB / 30 hari", price: 30000 }, { id: "data-12", name: "12 GB / 30 hari", price: 60000 }, { id: "data-25", name: "25 GB / 30 hari", price: 100000 }] },
  { slug: "gopay", name: "GoPay", category: "E-Wallet", color: "#00AA13", idLabel: "Nomor HP", packages: pkgs("gopay", "Saldo", NOMINALS) },
  { slug: "ovo", name: "OVO", category: "E-Wallet", tag: "Populer", color: "#4C2A86", idLabel: "Nomor HP", packages: pkgs("ovo", "Saldo", NOMINALS) },
];

export const PAYMENT_METHODS = [
  { id: "qris", name: "QRIS", group: "QRIS", fee: 0 },
  { id: "dana", name: "DANA", group: "E-Wallet", fee: 0 },
  { id: "ovo", name: "OVO", group: "E-Wallet", fee: 0 },
  { id: "gopay", name: "GoPay", group: "E-Wallet", fee: 0 },
  { id: "bca", name: "BCA Virtual Account", group: "Virtual Account", fee: 4000 },
  { id: "mandiri", name: "Mandiri Virtual Account", group: "Virtual Account", fee: 4000 },
  { id: "bni", name: "BNI Virtual Account", group: "Virtual Account", fee: 4000 },
  { id: "alfamart", name: "Alfamart", group: "Retail", fee: 2500 },
  { id: "indomaret", name: "Indomaret", group: "Retail", fee: 2500 },
];

export const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export const getGame = (slug: string) => GAMES.find((game) => game.slug === slug);
