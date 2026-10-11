// Data-integrity checks for the AEGIS method catalog.
//
// The atlas renders a dependency graph from `dependsOn` edges. A dangling
// reference does not throw — it silently produces a node with no target, which
// is the class of bug that survives visual review. These checks fail loudly.
import { METHODS, METHOD_MAP, METHODS_BY_LAYER } from "../src/data/methods";
import { LAYERS, LAYER_MAP } from "../src/data/layers";

let pass = 0;
let fail = 0;
const problems: string[] = [];

function ok(name: string, cond: boolean, detail = "") {
  if (cond) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    const msg = detail ? `${name} — ${detail}` : name;
    problems.push(msg);
    console.log(`  FAIL ${msg}`);
  }
}

console.log("\n== catalog shape ==");
ok("method count is 59", METHODS.length === 59, `found ${METHODS.length}`);
ok("METHOD_MAP has 59 entries", Object.keys(METHOD_MAP).length === 59);

const ids = METHODS.map((m) => m.id);
ok("no duplicate ids", new Set(ids).size === ids.length,
  `duplicates: ${ids.filter((v, i) => ids.indexOf(v) !== i).join(", ")}`);

console.log("\n== layer assignments ==");
const layerIds = new Set(LAYERS.map((l) => l.id));
for (const m of METHODS) {
  ok(`${m.id} → known layer`, layerIds.has(m.layer), `layer "${m.layer}"`);
}

const expectedPerLayer: Record<string, number> = {
  specification: 15,
  training: 10,
  interpretability: 9,
  containment: 7,
  verification: 5,
  governance: 7,
  recovery: 6,
};
for (const l of LAYERS) {
  const n = (METHODS_BY_LAYER[l.id] ?? []).length;
  ok(`${l.id} has ${expectedPerLayer[l.id]} methods`, n === expectedPerLayer[l.id],
    `found ${n}`);
}
ok("every layer has a hex colour", LAYERS.every((l) => /^#[0-9a-f]{6}$/i.test(l.hex)));

console.log("\n== dependency edges resolve ==");
let dangling = 0;
for (const m of METHODS) {
  for (const dep of m.dependsOn) {
    if (!METHOD_MAP[dep]) {
      dangling++;
      ok(`${m.id} dependsOn "${dep}"`, false, "target does not exist");
    }
  }
}
if (dangling === 0) {
  ok(`all ${METHODS.reduce((s, m) => s + m.dependsOn.length, 0)} dependency edges resolve`,
    true);
}
ok("no self-dependency", METHODS.every((m) => !m.dependsOn.includes(m.id)),
  METHODS.filter((m) => m.dependsOn.includes(m.id)).map((m) => m.id).join(", "));

console.log("\n== no dependency cycles ==");
const WHITE = 0, GREY = 1, BLACK = 2;
const colour = new Map<string, number>(METHODS.map((m) => [m.id, WHITE]));
const cyclePath: string[] = [];
function visit(id: string): boolean {
  colour.set(id, GREY);
  cyclePath.push(id);
  for (const dep of METHOD_MAP[id]?.dependsOn ?? []) {
    if (!METHOD_MAP[dep]) continue;
    const c = colour.get(dep);
    if (c === GREY) {
      problems.push(`cycle: ${cyclePath.join(" → ")} → ${dep}`);
      return false;
    }
    if (c === WHITE && !visit(dep)) return false;
  }
  cyclePath.pop();
  colour.set(id, BLACK);
  return true;
}
let acyclic = true;
for (const m of METHODS) {
  if (colour.get(m.id) === WHITE && !visit(m.id)) {
    acyclic = false;
    break;
  }
}
ok("dependency graph is acyclic", acyclic,
  acyclic ? "" : problems[problems.length - 1]);

console.log("\n== provenance fields ==");
// A method must carry a full provenance record for the app to render it.
const REQUIRED: (keyof (typeof METHODS)[number])[] = [
  "id", "name", "layer", "title", "authors", "year", "venue",
  "efficacy", "efficacyLow", "efficacyHigh", "confidence", "cost",
  "latency", "summary", "mechanism", "formulaNote", "latex",
];
for (const m of METHODS) {
  const missing = REQUIRED.filter((k) => {
    const v = m[k];
    return v === undefined || v === null || v === "";
  });
  ok(`${m.id} has all required fields`, missing.length === 0,
    missing.length ? `missing: ${missing.join(", ")}` : "");
}
ok("every method has >=1 failure mode",
  METHODS.every((m) => (m.failureModes?.length ?? 0) > 0));
ok("every method carries a formula",
  METHODS.every((m) => typeof m.latex === "string" && m.latex.length > 0));
ok("every method has a summary of reasonable length",
  METHODS.every((m) => m.summary.length >= 40),
  METHODS.filter((m) => m.summary.length < 40).map((m) => m.id).join(", "));
ok("every method has a mechanism",
  METHODS.every((m) => (m.mechanism?.length ?? 0) >= 40));
ok("every method cites an author or venue",
  METHODS.every((m) => (m.authors?.length ?? 0) > 0 && (m.venue?.length ?? 0) > 0));

console.log("\n== efficacy bands are coherent ==");
for (const m of METHODS) {
  ok(`${m.id} band: low <= efficacy <= high`,
    m.efficacyLow <= m.efficacy && m.efficacy <= m.efficacyHigh,
    `low=${m.efficacyLow} eff=${m.efficacy} high=${m.efficacyHigh}`);
  ok(`${m.id} efficacy within 0..100`,
    m.efficacy >= 0 && m.efficacy <= 100 && m.efficacyLow >= 0 && m.efficacyHigh <= 100);
  ok(`${m.id} confidence is a known tier`,
    ["low", "medium", "high"].includes(m.confidence), `got "${m.confidence}"`);
  ok(`${m.id} cost is 1..5`, m.cost >= 1 && m.cost <= 5, `got ${m.cost}`);
  ok(`${m.id} trl is 1..9`, m.trl >= 1 && m.trl <= 9, `got ${m.trl}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.log("\nfailing checks:");
  for (const p of problems) console.log(`  · ${p}`);
}
process.exit(fail > 0 ? 1 : 0);
