// Live-deployment smoke test for AEGIS.
//
// Usage:
//   bun run check:live [base-url]
//   bun run check:live https://aegis-aniruddha-adaks-projects.vercel.app
//
// Checks every route returns 200 with the right content type, the sitemap
// lists every route, the JSON-LD graph and manifest link are present, the
// binary assets serve with image content types, and the security headers
// from vercel.json are actually applied. Anything missing fails loudly —
// a deploy that serves a login wall or drops headers is a broken deploy.
const BASE =
  process.argv[2] ?? "https://aegis-aniruddha-adaks-projects.vercel.app";

let pass = 0;
let fail = 0;
const problems: string[] = [];

function ok(name: string, cond: boolean, detail = "") {
  if (cond) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    problems.push(detail ? `${name} — ${detail}` : name);
    console.log(`  FAIL ${detail ? `${name} — ${detail}` : name}`);
  }
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const buf = new Uint8Array(await res.arrayBuffer());
  const text = new TextDecoder().decode(buf);
  return { res, text, bytes: buf.length };
}

console.log(`\n== live smoke: ${BASE} ==`);

const ROUTES = [
  "/",
  "/atlas",
  "/stack",
  "/risk",
  "/math",
  "/methodology",
  "/governance",
  "/glossary",
];

const home = await get("/");
ok("home returns 200", home.res.status === 200, `got ${home.res.status}`);
ok(
  "home is the app, not a login wall",
  home.text.includes("AEGIS") && !/<title>Login/.test(home.text),
  "title check",
);

for (const r of ROUTES.slice(1)) {
  const g = await get(r);
  ok(
    `${r} returns 200`,
    g.res.status === 200,
    `got ${g.res.status}`,
  );
}

console.log("\n== metadata routes ==");
const sm = await get("/sitemap.xml");
ok("sitemap returns 200", sm.res.status === 200);
for (const r of [...ROUTES, "/glossary"]) {
  ok(`sitemap lists ${r}`, sm.text.includes(`${BASE}${r}`), "missing loc");
}
const robots = await get("/robots.txt");
ok("robots returns 200", robots.res.status === 200);
ok("robots points at the sitemap", robots.text.includes("/sitemap.xml"));
const manifest = await get("/manifest.webmanifest");
ok("manifest returns 200", manifest.res.status === 200);
ok("manifest names AEGIS", manifest.text.includes("AEGIS"));

console.log("\n== head content ==");
ok(
  "JSON-LD graph is present",
  home.text.includes("application/ld+json"),
);
for (const t of ["WebSite", "SoftwareSourceCode", "Organization"]) {
  ok(`JSON-LD includes ${t}`, home.text.includes(`"@type":"${t}"`), "missing type");
}
ok("manifest is linked", home.text.includes('rel="manifest"'));
ok("canonical is present", home.text.includes('rel="canonical"'));
ok("og:image is present", home.text.includes("og:image"));

console.log("\n== binary assets ==");
for (const [p, ct] of [
  ["/opengraph-image.png", "image/png"],
  ["/apple-icon.png", "image/png"],
  ["/icon-512.png", "image/png"],
  ["/icon.svg", "image/svg+xml"],
] as const) {
  const g = await get(p);
  const got = g.res.headers.get("content-type") ?? "";
  ok(
    `${p} serves as ${ct}`,
    g.res.status === 200 && got.startsWith(ct) && g.bytes > 1000,
    `${g.res.status} ${got} ${g.bytes}b`,
  );
}

console.log("\n== security headers ==");
const h = home.res.headers;
const want: [string, RegExp][] = [
  ["content-security-policy", /frame-ancestors 'none'/],
  ["x-frame-options", /^DENY$/i],
  ["x-content-type-options", /^nosniff$/i],
  ["referrer-policy", /strict-origin/i],
  ["strict-transport-security", /max-age=63072000/],
];
for (const [k, re] of want) {
  const v = h.get(k) ?? "";
  ok(`${k} is set correctly`, re.test(v), v || "(absent)");
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.log("\nfailing checks:");
  for (const p of problems) console.log(`  · ${p}`);
}
process.exit(fail > 0 ? 1 : 0);

// Make this file a module so top-level await is allowed.
export {};
