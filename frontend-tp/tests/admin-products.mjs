import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const compile = (path) => ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const url = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const source = compile("../src/lib/admin-products.ts").replace('"../data/catalog"', JSON.stringify(url(compile("../src/data/catalog.ts"))));
const { INITIAL_PRODUCTS: products, selectProducts, finalPrice } = await import(url(source));
assert.equal(products.length, 49);
for (const [category, count] of [["Games", 26], ["Voucher", 8], ["Pulsa", 7], ["E-Wallet", 8]]) {
  assert.equal(selectProducts(products, category, "", "", "name-asc").length, count);
}
assert.equal(selectProducts(products, "Games", "Free Fire", "", "name-asc").length, 4);
assert.equal(selectProducts(products, "Voucher", "Free Fire", "", "name-asc").length, 0);
assert.equal(selectProducts(products, "Games", "", "MLBB-86", "name-asc").length, 1);
assert.equal(selectProducts(products, "Games", "", "unknown", "name-asc").length, 0);
const changed = products.map((item, i) => i === 0 ? { ...item, discount: 50, active: false } : item);
assert.equal(finalPrice(changed[0]), 10000);
assert.equal(selectProducts(changed, "Semua", "", "", "discount-desc")[0].discount, 50);
assert.equal(selectProducts(changed, "Semua", "", "mlbb-86", "name-asc")[0].active, false);
const sorted = selectProducts(changed, "Semua", "", "", "price-asc");
assert.ok(sorted.every((item, i) => i === 0 || finalPrice(sorted[i - 1]) <= finalPrice(item)));
assert.equal(products[0].active, true);
console.log("Admin category counts, brand/search filters, sorting, discount and inactive packages checked.");
