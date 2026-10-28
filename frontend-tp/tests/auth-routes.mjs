import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
for (const route of ["login", "register"]) {
  const response = await fetch(`${baseUrl}/${route}`);
  const html = await response.text();
  assert.equal(response.status, 200, route);
  assert.match(html, /name="email"/, route);
  assert.match(html, /name="password"/, route);
  assert.match(html, /Lanjutkan dengan Google/, route);
  assert.match(html, /Mode demo/, route);
  assert.ok(html.includes(`href="/${route === "login" ? "register" : "login"}"`), route);
  assert.equal(html.includes('name="confirmPassword"'), route === "register");
}
const home = await fetch(baseUrl).then((response) => response.text());
assert.match(home, /href="\/login"/);
console.log("Auth routes, demo notices, fields, and navigation checked.");
