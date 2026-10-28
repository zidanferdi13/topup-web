import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const home = await fetch(baseUrl).then((response) => response.text());
const slugs = [...home.matchAll(/href="\/games\/([^"]+)"/g)].map((match) => match[1]);

assert.equal(new Set(slugs).size, 12, "catalog must link 12 unique products");

for (const slug of slugs) {
  const response = await fetch(`${baseUrl}/games/${slug}`);
  const html = await response.text();
  assert.equal(response.status, 200, slug);
  assert.match(html, /1\. Masukkan data akun/, slug);
  assert.match(html, /2\. Pilih paket/, slug);
  assert.match(html, /3\. Pilih pembayaran/, slug);
}

assert.equal((await fetch(`${baseUrl}/games/unknown-game`)).status, 404);
console.log(`Checked ${slugs.length} game pages and 404 route.`);
