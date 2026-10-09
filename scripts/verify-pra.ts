// Numerical verification of the PRA engine against hand-computed values.
import {
  seriesDefeat,
  seriesReliability,
  computePRA,
  evaluate,
  betaCommonCause,
  type Barrier,
} from "../src/lib/pra";

let pass = 0;
let fail = 0;
const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol;
function check(name: string, got: number, want: number, tol = 1e-9) {
  if (near(got, want, tol)) {
    pass++;
    console.log(`  ok   ${name} = ${got.toPrecision(6)}`);
  } else {
    fail++;
    console.log(`  FAIL ${name} = ${got}, expected ${want}`);
  }
}
function assert(name: string, cond: boolean) {
  if (cond) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}`);
  }
}

const bar = (
  id: string,
  q: number,
  stage: Barrier["stage"] = "barrier",
  on = true,
  redundancy = 1,
): Barrier => ({
  id,
  name: id,
  layer: stage,
  hex: "#fff",
  stage,
  q,
  e: 1 - q,
  qLow: 0,
  qHigh: 1,
  cost: 1,
  on,
  redundancy,
});

console.log("\n== seriesDefeat: catastrophe requires ALL barriers to fail ==");
// P(all fail) = Π q
check("4x q=0.6", seriesDefeat([0.6, 0.6, 0.6, 0.6]), 0.1296, 1e-12);
check("4x q=0.3", seriesDefeat([0.3, 0.3, 0.3, 0.3]), 0.0081, 1e-12);
// P(at least one succeeds) = 1 − Π q
check("4x q=0.6 reliability", seriesReliability([0.6, 0.6, 0.6, 0.6]), 1 - 0.1296, 1e-12);
// A perfect barrier makes the defeat probability zero.
check("q=0 blocks everything", seriesDefeat([0.4, 0]), 0, 1e-12);
check("q=0 blocks reliability", seriesReliability([0.4, 0]), 1, 1e-12);
// Adding barriers must strictly reduce the escape probability.
check("8x q=0.5", seriesDefeat(Array(8).fill(0.5)), 1 / 256, 1e-12);
check("16x q=0.5", seriesDefeat(Array(16).fill(0.5)), 1 / 65536, 1e-12);

console.log("\n== betaCommonCause (IEC 61508-6) ==");
check("beta=0 identity", betaCommonCause(0.52, 0, 0.2), 0.52, 1e-12);
check("beta=0.1", betaCommonCause(0.52, 0.1, 0.2), 1 - 0.48 * (1 - 0.02), 1e-12);
check("beta=1, qMin=0.2", betaCommonCause(0.52, 1, 0.2), 1 - 0.48 * 0.8, 1e-12);

console.log("\n== importance measures ==");
// Two runtime barriers: q_a = 0.4, q_b = 0.2. Catastrophe requires both to
// fail: P = 0.4 * 0.2 = 0.08.
//
// Birnbaum_i = Π_{j≠i} q_j
//   BI_a = q_b = 0.2
//   BI_b = q_a = 0.4
//
// RAW_i = 1 / (1 − Π_{j≠i} q_j) — how many times worse if this barrier can
// fail at all, vs. if it were perfect (which makes P = 0).
//   RAW_a = 1 / (1 − 0.2) = 1.25
//   RAW_b = 1 / (1 − 0.4) = 1.667
//
// Fussell–Vesely: sole-rescuer attribution.
//   saved_a = (1 − q_a) * q_b = 0.6 * 0.2 = 0.12
//   saved_b = (1 − q_b) * q_a = 0.8 * 0.4 = 0.32
//   total   = 0.44
//   FV_a = 0.12/0.44, FV_b = 0.32/0.44  (sums to 1)
const bars = [bar("a", 0.4), bar("b", 0.2)];
const r = computePRA({ pBase: 1, beta: 0, barriers: bars });
check("P(all fail)", r.qSystem, 0.08, 1e-12);
const ia = r.importance.find((i) => i.id === "a")!;
const ib = r.importance.find((i) => i.id === "b")!;
check("BI_a", ia.birnbaum, 0.2, 1e-12);
check("BI_b", ib.birnbaum, 0.4, 1e-12);
check("RAW_a", ia.raw, 1 / 0.8, 1e-9);
check("RAW_b", ib.raw, 1 / 0.6, 1e-9);
check("FV_a", ia.fussellVesely, 0.12 / 0.44, 1e-9);
check("FV_b", ib.fussellVesely, 0.32 / 0.44, 1e-9);
check("FV sums to 1", ia.fussellVesely + ib.fussellVesely, 1, 1e-9);
// RRW_i = 1 − q_i : the fraction of the escape probability this barrier removes.
check("RRW_a", ia.rrw, 0.6, 1e-9);
check("RRW_b", ib.rrw, 0.8, 1e-9);

console.log("\n== two-stage: initiation discounting ==");
// pBase = 0.8; initiators with e = 0.5 and e = 0.25; one runtime barrier q = 0.2
// P_arises = 0.8 × (1 − 0.5) × (1 − 0.25) = 0.30
// P_defeat = 0.2   (single barrier: catastrophe requires it to fail)
// P_cat    = 0.30 × 0.2 = 0.06
//
// NOTE: bar() derives e from q, so bar(id, 0.5) has e = 0.5.
const two = computePRA({
  pBase: 0.8,
  beta: 0,
  barriers: [
    bar("i1", 0.5, "initiator"),
    bar("i2", 0.75, "initiator"),
    bar("b1", 0.2, "barrier"),
  ],
});
// Initiator controls discount the base rate multiplicatively in (1 − e).
// bar(id, q) derives e = 1 − q, so bar("i", 0.5) has e = 0.5 → factor 0.5,
// and bar("i2", 0.75) has e = 0.25 → factor 0.75.
check("one initiator halves", evaluate({
  pBase: 0.8, beta: 0,
  barriers: [bar("i", 0.5, "initiator")],
}).pArises, 0.8 * 0.5, 1e-12);
check("two initiators compound", two.pArises, 0.8 * 0.5 * 0.75, 1e-12);
check("P_defeat", two.qDefeat, 0.2, 1e-12);
check("pCatastrophe", two.pCatastrophe, 0.06, 1e-12);

console.log("\n== no runtime barriers = no defence ==");
// The critical regression: an empty barrier set must NOT trivially "pass".
const none = computePRA({
  pBase: 0.5,
  beta: 0,
  barriers: [bar("i1", 0.5, "initiator")],
});
check("empty barrier P_defeat", none.qDefeat, 1, 1e-12);
check("empty barrier pCatastrophe", none.pCatastrophe, 0.5 * 0.5, 1e-12);

const trulyNone = computePRA({ pBase: 0.5, beta: 0, barriers: [] });
check("no controls at all", trulyNone.pCatastrophe, 0.5, 1e-12);

console.log("\n== beta raises risk, never lowers it ==");
const kb = [bar("a", 0.3), bar("b", 0.3)];
const noBeta = computePRA({ pBase: 1, beta: 0, barriers: kb });
// P(all fail) = 0.09, qMin = 0.3, q_ccf = 0.4*0.3 = 0.12
// Q = 0.09 + 0.12 - 0.09*0.12
const withBeta = computePRA({ pBase: 1, beta: 0.4, barriers: kb });
assert("beta increases risk", withBeta.pCatastrophe > noBeta.pCatastrophe);
check("P(all fail) independent", noBeta.qSystem, 0.09, 1e-12);
check("P_defeat with beta=0.4", withBeta.qDefeat, 0.09 + 0.12 - 0.09 * 0.12, 1e-12);

console.log("\n== redundancy ==");
// Two independent instances at q=0.5; BOTH must fail: 0.25
check("q=0.5 x2", computePRA({ pBase: 1, beta: 0, barriers: [bar("a", 0.5, "barrier", true, 2)] }).qSystem, 0.25, 1e-12);

console.log("\n== monotonicity ==");
const mk = (qas: number[]) =>
  computePRA({ pBase: 1, beta: 0, barriers: qas.map((q, i) => bar(String(i), q)) });
const two_b = mk([0.3, 0.3]);
assert("stronger barrier lowers risk", mk([0.1, 0.3]).pCatastrophe < two_b.pCatastrophe);
assert("weaker barrier raises risk", mk([0.5, 0.3]).pCatastrophe > two_b.pCatastrophe);
// THE defining property of defence in depth: adding a barrier never hurts.
assert(
  "adding a barrier never increases risk",
  mk([0.3, 0.3, 0.2]).pCatastrophe < two_b.pCatastrophe,
);
// And the deeper the stack, the lower the risk — strictly, monotonically.
let prev = 1;
let monotonic = true;
for (let n = 1; n <= 12; n++) {
  const p = mk(Array(n).fill(0.5)).pCatastrophe;
  if (p >= prev) monotonic = false;
  prev = p;
}
assert("risk falls monotonically with stack depth", monotonic);

console.log("\n== efficiency ==");
const stack23 = [bar("a", 0.3), bar("b", 0.3)];
const twoCtl = computePRA({ pBase: 1, beta: 0, barriers: stack23 });
check("one entry per deployed control", twoCtl.efficiency.length, 2);
check(
  "equal controls are equally valued",
  twoCtl.efficiency[0].delta,
  twoCtl.efficiency[1].delta,
  1e-12,
);
// P(no controls) = 1 (base rate 1, no barriers) and P(current) = 0.3*0.3 = 0.09,
// so the two deployed barriers together must be credited with 0.91.
const noCtl = computePRA({ pBase: 1, beta: 0, barriers: [] });
check("P with no controls", noCtl.pCatastrophe, 1, 1e-12);
check("P with two barriers", twoCtl.pCatastrophe, 0.09, 1e-12);
// NOTE: these are leave-one-out (LOO) marginal values, not Shapley values.
// Removing one control while the others remain in place under-attributes the
// joint benefit — with two identical barriers each is credited 0.21 rather
// than 0.455, because each one's value depends on the other still being there.
// LOO is what an engineering team can actually act on ("what if we dropped
// this one?") and the ranking is what matters; the values do not sum to the
// total risk removed, and asserting that they do would be asserting a
// Shapley decomposition the model does not compute.
const sumDelta = twoCtl.efficiency.reduce((s, e) => s + e.delta, 0);
const totalRemovable = noCtl.pCatastrophe - twoCtl.pCatastrophe;
assert("sum(delta) is positive", sumDelta > 0);
assert(
  "sum(delta) <= total removable risk",
  sumDelta <= totalRemovable + 1e-12,
);
assert(
  "sum(delta) under-attributes joint benefit (not Shapley)",
  sumDelta < totalRemovable - 1e-9,
);
// A lone barrier has no joint effect, so LOO is exact there.
const loneChk = computePRA({ pBase: 1, beta: 0, barriers: [bar("solo", 0.3)] });
const soloRemovable =
  computePRA({ pBase: 1, beta: 0, barriers: [] }).pCatastrophe -
  loneChk.pCatastrophe;
check(
  "LOO is exact for a single control",
  loneChk.efficiency.reduce((s, e) => s + e.delta, 0),
  soloRemovable,
  1e-9,
);
check(
  "share sums to 1",
  twoCtl.efficiency.reduce((s, e) => s + e.share, 0),
  1,
  1e-9,
);
assert(
  "perCost positive for a deployed control",
  twoCtl.efficiency[0].perCost > 0,
);
// Removing the only barrier must be maximally valuable.
const lone = computePRA({ pBase: 1, beta: 0, barriers: [bar("only", 0.3)] });
check(
  "lone barrier delta = 1 − q",
  lone.efficiency[0].delta,
  1 - 0.3,
  1e-9,
);
// Cheaper control with identical risk removal must rank higher per unit cost.
const cheap = computePRA({
  pBase: 1, beta: 0,
  barriers: [{ ...bar("cheap", 0.3), cost: 1 }],
});
const dear = computePRA({
  pBase: 1, beta: 0,
  barriers: [{ ...bar("dear", 0.3), cost: 5 }],
});
assert(
  "identical risk, lower cost ranks higher",
  cheap.efficiency[0].perCost > dear.efficiency[0].perCost,
);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
