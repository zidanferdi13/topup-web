export const ACCOUNT_GAMES = [
  { slug: "genshin-impact", name: "Genshin Impact", initials: "GI" },
  { slug: "mobile-legends", name: "Mobile Legends", initials: "ML" },
  { slug: "valorant", name: "Valorant", initials: "VA" },
  { slug: "roblox", name: "Roblox", initials: "RB" },
];

export type AccountOffer = { id: string; game: string; title: string; price: number; server: string; level: string; seller: string; description: string; features: string[] };

// ponytail: penawaran fiktif tanpa credential; ganti API listing setelah aturan publisher dan moderasi siap.
export const ACCOUNT_OFFERS: AccountOffer[] = [
  { id: "gi-starter-01", game: "genshin-impact", title: "Starter AR 10 · Fokus eksplorasi", price: 75000, server: "Asia", level: "AR 10", seller: "Toko Demo A", description: "Contoh listing starter untuk membandingkan harga dan atribut akun. Tidak mewakili akun yang benar-benar dijual.", features: ["Adventure Rank 10", "Progres awal", "Detail karakter belum diverifikasi"] },
  { id: "gi-explore-02", game: "genshin-impact", title: "AR 45 · Progres petualangan", price: 350000, server: "Asia", level: "AR 45", seller: "Toko Demo B", description: "Penawaran fiktif dengan progres menengah. Seluruh spesifikasi hanya contoh UI, bukan jaminan kondisi akun.", features: ["Adventure Rank 45", "Progres menengah", "Inventaris contoh"] },
  { id: "gi-europe-03", game: "genshin-impact", title: "AR 55 · Koleksi petualang", price: 800000, server: "Europe", level: "AR 55", seller: "Toko Demo A", description: "Contoh penawaran server Europe. Tidak ada akses akun atau pemindahan kepemilikan pada demo ini.", features: ["Adventure Rank 55", "Server Europe", "Listing demonstrasi"] },
  { id: "ml-epic-01", game: "mobile-legends", title: "Epic · Koleksi hero pilihan", price: 200000, server: "Indonesia", level: "Epic", seller: "Toko Demo C", description: "Contoh listing Mobile Legends untuk memperlihatkan atribut rank dan harga. Bukan stok nyata.", features: ["Rank Epic", "Koleksi hero contoh", "Belum diverifikasi"] },
  { id: "ml-legend-02", game: "mobile-legends", title: "Legend · Koleksi skin", price: 500000, server: "Indonesia", level: "Legend", seller: "Toko Demo A", description: "Listing fiktif rank Legend. Jumlah hero dan skin perlu verifikasi saat sistem penjual tersedia.", features: ["Rank Legend", "Koleksi skin contoh", "Tanpa credential"] },
  { id: "va-silver-01", game: "valorant", title: "Silver · Profil kompetitif", price: 180000, server: "Asia Pacific", level: "Silver", seller: "Toko Demo B", description: "Contoh profil kompetitif Valorant. Tidak ada jaminan rank atau transaksi nyata.", features: ["Rank Silver", "Region Asia Pacific", "Data fiktif"] },
  { id: "va-gold-02", game: "valorant", title: "Gold · Koleksi kosmetik", price: 650000, server: "Asia Pacific", level: "Gold", seller: "Toko Demo C", description: "Contoh penawaran dengan atribut koleksi kosmetik. Gunakan hanya untuk mencoba navigasi marketplace.", features: ["Rank Gold", "Koleksi kosmetik contoh", "Belum diverifikasi"] },
  { id: "rb-profile-01", game: "roblox", title: "Profil Roblox · Koleksi avatar", price: 120000, server: "Global", level: "Profil", seller: "Toko Demo A", description: "Contoh listing profil Roblox. Aset avatar pada akun nyata wajib diperiksa dan mengikuti aturan publisher.", features: ["Profil contoh", "Region Global", "Tidak ada akun nyata"] },
];

export function selectAccountOffers(game: string, query: string, server: string, min: number, max: number, sort: string) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return ACCOUNT_OFFERS.filter((offer) => offer.game === game && (!server || offer.server === server) && offer.price >= min && offer.price <= max && words.every((word) => `${offer.title} ${offer.level} ${offer.seller}`.toLowerCase().includes(word))).sort((a, b) => sort === "price-desc" ? b.price - a.price : sort === "name" ? a.title.localeCompare(b.title, "id") : a.price - b.price);
}
