import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/data/accounts.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { ACCOUNT_GAMES, ACCOUNT_OFFERS, selectAccountOffers: select } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
assert.equal(new Set(ACCOUNT_OFFERS.map((offer) => offer.id)).size, ACCOUNT_OFFERS.length);
assert.ok(ACCOUNT_OFFERS.every((offer) => ACCOUNT_GAMES.some((game) => game.slug === offer.game) && offer.price > 0));
assert.equal(select("genshin-impact", "", "", 0, Infinity, "price-asc").length, 3);
assert.equal(select("genshin-impact", " AR 45 ", "Asia", 0, Infinity, "price-asc")[0].id, "gi-explore-02");
assert.equal(select("genshin-impact", "", "Europe", 0, 500000, "price-asc").length, 0);
assert.equal(select("genshin-impact", "", "", 0, Infinity, "price-desc")[0].price, 800000);
assert.equal(select("unknown", "", "", 0, Infinity, "name").length, 0);
console.log("Account listing fixtures, game/server/query/price filters and sort checked.");

if (process.env.BASE_URL) {
  for (const route of ["/accounts", ...ACCOUNT_GAMES.map((game) => `/accounts/${game.slug}`), ...ACCOUNT_OFFERS.map((offer) => `/accounts/offers/${offer.id}`)]) {
    assert.equal((await fetch(`${process.env.BASE_URL}${route}`)).status, 200, route);
  }
  for (const route of ["/accounts/unknown", "/accounts/offers/unknown"]) assert.equal((await fetch(`${process.env.BASE_URL}${route}`)).status, 404, route);
  console.log("Account routes and unknown game/offer 404 checked.");
}
