import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/lib/demo-orders.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { promoDiscount, parseOrders } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
assert.equal(promoDiscount(" hemat10 ", 20000), 2000);
assert.equal(promoDiscount("NOPE", 20000), 0);
const order = { id: "DEMO-12345678-1234-1234-1234-123456789abc", createdAt: "2026-10-17T00:00:00Z", game: "Demo", packageName: "86 Diamonds", playerId: "123456", zone: "1234", payment: "BCA", price: 20000, fee: 4000, discount: 2000, promo: "HEMAT10", total: 22000, status: "Menunggu pembayaran" };
assert.deepEqual(parseOrders(JSON.stringify([order])), [order]);
for (const invalid of [{ ...order, total: -1 }, { ...order, total: 1 }, { ...order, status: "Paid" }, { ...order, discount: 30000 }, { ...order, id: "bad" }]) {
  assert.throws(() => parseOrders(JSON.stringify([invalid])));
}
assert.throws(() => parseOrders(JSON.stringify([order, order])));
assert.throws(() => parseOrders("null"));
assert.throws(() => parseOrders("broken"));
console.log("Promo calculation and stored order validation checked.");
