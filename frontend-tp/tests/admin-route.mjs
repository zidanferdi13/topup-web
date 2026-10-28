import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const response = await fetch(`${baseUrl}/admin`);
const html = await response.text();
assert.equal(response.status, 200);
assert.match(html, /Login admin demo/);
assert.match(html, /Buka dashboard demo/);
assert.match(html, /bukan login aman/);
assert.match(html, /name="email"/);
assert.match(html, /name="password"/);
assert.ok(!html.includes('aria-label="History pembelian contoh"'), "history must not render before demo entry");
console.log("Admin route and initial demo gate checked.");
