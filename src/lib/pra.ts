/**
 * AEGIS — Probabilistic Risk Assessment.
 *
 * The mathematics here is adapted from nuclear, aerospace and process-safety
 * practice (IEC 61508, ISO 26262, MIL-STD-217) and applied to a defence-in-depth
 * stack of AI controls.
 *
 * THE FAULT TREE HAS TWO STAGES, and getting this shape right matters:
 *
 *   Stage 1 — INITIATION.
 *   Specification-, training- and interpretability-layer controls do not block
 *   a dangerous event. They change how likely it is that a dangerous capability
 *   arises at all. They therefore discount the initiating probability, and they
 *   compose multiplicatively in that role:
 *
 *       P_initiate = P_base · Π (1 − e_i)
 *
 *   Stage 2 — DEFEAT.
 *   Containment-, verification-, governance- and recovery-layer controls are
 *   runtime barriers. The event is not contained unless EVERY one of them
 *   holds, so they compose as a series system:
 *
 *       Q_defeat = 1 − Π (1 − q_j)
 *
 *   CATASTROPHE = P_initiate × Q_defeat
 *
 * Modelling all controls as a single flat AND-stack is a common and serious
 * error: it makes adding a good specification control look like it blocks the
 * event, which it does not. It also means the empty stack trivially "passes"
 * every gate — so we treat an empty barrier set as providing no defence.
 *
 * IMPORTANT: these are structural models, not predictions.
 */

export interface Barrier {
  id: string;
  name: string;
  layer: string;
  hex: string;
  /** Does this control act at initiation (discounts P) or at runtime (blocks)? */
  stage: "initiator" | "barrier";
  /** For a barrier: unavailability q (probability it fails to stop the event). */
  q: number;
  /** For an initiator: efficacy e (probability it prevents the event arising). */
  e: number;
  qLow: number;
  qHigh: number;
  cost: number;
  on: boolean;
  redundancy: number;
}

export interface PRAInput {
  /**
   * P(capability event) in the absence of any specification/training control —
   * i.e. the base rate at which a frontier training run or deployment produces
   * a dangerous autonomous capability. Deliberately user-set and deliberately
   * high; there is no published estimate for it.
   */
  pBase: number;
  /** β: shared-cause failure fraction across the runtime barrier stack. */
  beta: number;
  barriers: Barrier[];
}

export interface BarrierImportance {
  id: string;
  name: string;
  hex: string;
  layer: string;
  cost: number;
  q: number;
  birnbaum: number;
  fussellVesely: number;
  raw: number;
  rrw: number;
}

export interface EfficiencyEntry {
  id: string;
  name: string;
  hex: string;
  stage: "initiator" | "barrier";
  cost: number;
  /** reduction in final catastrophe probability if this control were perfect */
  delta: number;
  perCost: number;
  share: number;
}

export interface PAResult {
  pCatastrophe: number;
  /** after initiation-stage discounting */
  pInitiate: number;
  pBase: number;
  /** probability the capability event arises at all */
  pArises: number;
  /** probability it arises AND defeats every deployed runtime barrier */
  pEvent: number;
  /** P(all deployed runtime barriers fail), ignoring common cause */
  qSystem: number;
  /** P(all fail) including the β common-cause floor */
  qDefeat: number;
  /** reliability of the runtime barrier stack */
  reliability: number;
  pShared: number;
  qMin: number;
  barrierCount: number;
  initiatorCount: number;
  importance: BarrierImportance[];
  efficiency: EfficiencyEntry[];
  weakestLink: BarrierImportance | null;
}

/* -------------------------------------------------------------------------- */
/*  Core series system                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Probability that EVERY deployed barrier fails to stop the event.
 *
 * This is the product of the unavailabilities: for the catastrophic outcome to
 * occur, all independent barriers must be simultaneously defeated, so
 *
 *   P(all fail) = Π q_i
 *
 * (If instead you need every barrier to WORK for success — a reliability
 * calculation — that is Π (1 − q_i), the complement of this.) The two coincide
 * only at q = 0.5, which is precisely why the distinction is easy to get
 * wrong and important when it is.
 *
 * Adding a barrier with q < 1 multiplies the result by q < 1 and therefore
 * *reduces* catastrophic risk — the defining property of defence in depth.
 */
export function seriesDefeat(qs: number[]): number {
  return qs.reduce((acc, q) => acc * clamp01(q), 1);
}

/** P(at least one barrier succeeds) = 1 − Π q_i. */
export function seriesReliability(qs: number[]): number {
  return 1 - seriesDefeat(qs);
}

/**
 * IEC 61508-6 beta-factor model for systematic (common-cause) failure.
 *
 * β applies *per channel*: of failures in a group of similar elements, a
 * fraction β is attributable to a shared cause. The group common-cause
 * probability scales with the most reliable member (the smallest q), because a
 * shared defect anchors to whatever channel it is carried by. The common-cause
 * event then composes with the independent all-fail probability as a union:
 *
 *   q_ccf    = β · min(q_i)
 *   P_defeat = P(all fail) + q_ccf − P(all fail) · q_ccf
 *
 * At β = 0 this reduces exactly to the independent all-fail probability, as it
 * must. Note the floor it imposes: with β = 0.4 and a best barrier of q = 0.3,
 * no amount of additional deployment removes 12% joint failure.
 *
 * For an AI safety stack this term is emphatically not zero. If every barrier
 * was designed by overlapping teams, evaluated against shared benchmarks, and
 * rests on the same untested assumption about model internals, then one
 * conceptual error propagates through the whole stack and redundancy is
 * powerless against it.
 */
export function betaCommonCause(
  qIndependent: number,
  beta: number,
  qMin: number,
): number {
  const qCcf = clamp01(beta) * clamp01(qMin);
  return 1 - (1 - clamp01(qIndependent)) * (1 - qCcf);
}

/* -------------------------------------------------------------------------- */
/*  Full PRA computation                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Fault-tree evaluation only — no marginal-value analysis. Expressed as a
 * type alias rather than an empty interface extending its supertype, which
 * ESLint flags as a no-op.
 */
type CoreResult = Omit<PAResult, "efficiency" | "weakestLink">;

/**
 * Fault-tree evaluation only — no marginal-value analysis.
 *
 * The efficiency ranking is defined as the risk removed by perfecting each
 * control, which requires re-evaluating the tree once per control. Keeping
 * that out of this function is what makes the recursion terminate: `evaluate`
 * never calls `computePRA`.
 */
export function evaluate(input: PRAInput): CoreResult {
  const { pBase, beta, barriers } = input;

  const barriersOn = barriers.filter((b) => b.stage === "barrier" && b.on);
  const initiatorsOn = barriers.filter((b) => b.stage === "initiator" && b.on);

  // ---- Stage 1: initiation -------------------------------------------------
  // Each deployed initiator discounts the base rate by (1 − e). Controls with
  // low efficacy barely move it, which is the correct behaviour: they are
  // weak, and pretending otherwise is exactly the mistake this model avoids.
  const initiationFactor = initiatorsOn.reduce(
    (acc, b) => acc * (1 - clamp01(b.e)),
    1,
  );
  const pArises = clamp01(pBase) * initiationFactor;

  // ---- Stage 2: defeat -----------------------------------------------------
  // q^n for n independent instances: a redundant barrier must fail in every
  // instance for the stack to be defeated.
  const qs = barriersOn.map((b) =>
    Math.pow(clamp01(b.q), Math.max(1, b.redundancy)),
  );

  // ---- Stage 2: defeat -----------------------------------------------------
  // Catastrophe requires ALL deployed runtime barriers to fail simultaneously.
  // P(all fail) = Π q_i, which FALLS as barriers are added. That is the whole
  // point of defence in depth, and the reason the model uses the product of
  // unavailabilities rather than the product of availabilities.
  const pAllFail = seriesDefeat(qs);
  const reliability = 1 - pAllFail;
  const qMin = qs.length ? Math.min(...qs) : 0;

  // An empty barrier set provides NO defence: P(all fail) over an empty set is
  // vacuously 1 (no barrier is available to stop the event).
  const pDefeatRaw = barriersOn.length ? pAllFail : 1;
  const qDefeat = betaCommonCause(pDefeatRaw, beta, qMin);

  const pEvent = qDefeat;
  const pCatastrophe = pArises * pEvent;

  // ---- Importance measures (runtime barriers only) -------------------------
  const importance: BarrierImportance[] = barriersOn.map((b, idx) => {
    // Probability that every OTHER barrier fails (this one is held aside).
    const allOthersFail = seriesDefeat(qs.filter((_, j) => j !== idx));

    // Birnbaum: ∂P(all fail)/∂q_i = Π_{j≠i} q_j
    const birnbaum = allOthersFail;

    // Probability that all others fail while THIS one holds (i.e. this barrier
    // is the single one that saved the deployment).
    const saved = (1 - qs[idx]) * allOthersFail;

    // P(all fail) if this barrier were perfect (q_i = 0) = 0 for n ≥ 1.
    // Risk without barrier i: all remaining barriers fail.
    const qNoI = allOthersFail;

    // Fussell–Vesely: share of the "escape" probability for which this barrier
    // was the sole reason the deployment survived. Normalised by P(saved by
    // some barrier) = Σ_j (1−q_j)Π_{k≠j} q_k.
    const totalSaved = qs.reduce(
      (acc, _, j) => acc + (1 - qs[j]) * seriesDefeat(qs.filter((_, k) => k !== j)),
      0,
    );
    const fv = totalSaved > 0 ? saved / totalSaved : 0;

    // Risk Achievement Worth: how many times worse the deployment is if this
    // barrier can fail at all versus if it were perfect (risk → 0).
    const raw = pDefeatRaw > 0 ? 1 / Math.max(1 - qNoI, 1e-15) : 1;

    // Risk Reduction Worth: the fraction of the escape probability that this
    // barrier removes.
    //   risk with barrier    = Π q_j
    //   risk without barrier = Π_{j≠i} q_j
    //   (with − without)/without = 1 − q_i
    // A weak barrier therefore carries little risk-reduction worth even though
    // removing it is catastrophic — which is exactly the asymmetry that makes
    // a single weak slice so damaging.
    const rrw = 1 - qs[idx];

    return {
      id: b.id,
      name: b.name,
      hex: b.hex,
      layer: b.layer,
      cost: b.cost,
      q: b.q,
      birnbaum,
      fussellVesely: clamp01(fv),
      raw: Number.isFinite(raw) ? raw : 1e6,
      rrw: clamp01(rrw),
    };
  });

  return {
    pCatastrophe,
    pInitiate: pArises,
    pBase: clamp01(pBase),
    pArises,
    pEvent,
    /** P(all deployed runtime barriers fail), ignoring common cause */
    qSystem: pDefeatRaw,
    qDefeat,
    reliability,
    pShared: clamp01(beta),
    qMin,
    barrierCount: barriersOn.length,
    initiatorCount: initiatorsOn.length,
    importance: importance.sort((a, b2) => b2.raw - a.raw),
  };
}

/* -------------------------------------------------------------------------- */
/*  Full PRA: fault tree + marginal-value ranking                              */
/* -------------------------------------------------------------------------- */

export function computePRA(input: PRAInput): PAResult {
  const { pBase, beta, barriers } = input;
  const core = evaluate(input);
  const pCatastrophe = core.pCatastrophe;

  // ---- Marginal value per unit cost, over BOTH stages ----------------------
  // This is the ranking that actually answers "what should we build next", and
  // it is the reason the model is two-stage: an initiator control and a runtime
  // barrier are not comparable on q or e, but they are directly comparable on
  // the thing that matters — final catastrophe probability removed.
  const efficiency: EfficiencyEntry[] = [];

  for (const b of barriers.filter((x) => x.on)) {
    const without = evaluate({
      pBase,
      beta,
      barriers: barriers.map((x) =>
        x.id === b.id ? { ...x, on: false } : x,
      ),
    });
    // How much risk this control currently removes: the risk the system would
    // carry without it, minus the risk it carries with it. Positive for any
    // deployed control that is doing any work at all.
    const delta = without.pCatastrophe - pCatastrophe;
    efficiency.push({
      id: b.id,
      name: b.name,
      hex: b.hex,
      stage: b.stage,
      cost: b.cost,
      delta: Math.max(0, delta),
      perCost: b.cost > 0 ? Math.max(0, delta) / b.cost : 0,
      share: 0,
    });
  }

  efficiency.sort((a, b2) => b2.perCost - a.perCost);
  const totalDelta = efficiency.reduce((s, e) => s + e.delta, 0);
  efficiency.forEach((e) => {
    e.share = totalDelta > 0 ? e.delta / totalDelta : 0;
  });

  const weakestLink = core.importance.length
    ? core.importance.reduce((a, b2) => (b2.raw > a.raw ? b2 : a))
    : null;

  return { ...core, efficiency, weakestLink };
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/** Probability → "1 in N". Often more legible than a percentage. */
export function oneInN(p: number): string {
  if (p <= 0) return "∞";
  if (p >= 1) return "1";
  const n = 1 / p;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 100) return Math.round(n).toLocaleString();
  return n.toFixed(1);
}

/** Percentage with precision that degrades sensibly with magnitude. */
export function pct(p: number, digits = 1): string {
  const v = p * 100;
  if (v === 0) return "0";
  if (v < 0.0001) return "<0.0001";
  if (v < 1) return v.toFixed(digits + 2);
  if (v < 10) return v.toFixed(digits);
  return v.toFixed(Math.max(0, digits - 1));
}

/**
 * Sensitivity: how much the final answer moves as one control's estimate
 * moves across its plausible range. A control with a wide swing is where you
 * should spend your measurement budget.
 */
export function sensitivity(
  barriers: Barrier[],
  id: string,
  pBase: number,
  beta: number,
): { low: number; base: number; high: number } {
  const target = barriers.find((b) => b.id === id);
  if (!target) return { low: 0, base: 0, high: 0 };

  const run = (v: number) =>
    computePRA({
      pBase,
      beta,
      barriers: barriers.map((b) => (b.id === id ? { ...b, q: v, e: v } : b)),
    }).pCatastrophe;

  return { low: run(target.qLow), base: run(target.q), high: run(target.qHigh) };
}

/**
 * Reference point: what unavailability does established high-assurance
 * engineering actually achieve? Used for scale, not for comparison of merit.
 */
export const REFERENCE_BARRIERS = [
  { label: "Nuclear — typical safety system", q: 1e-6, note: "IEC 61508 SIL 4" },
  { label: "Nuclear — safety-critical channel", q: 1e-9, note: "1 in a billion demands" },
  { label: "Aviation — flight control", q: 1e-7, note: "per flight hour" },
  { label: "Medical device", q: 1e-6, note: "ISO 14971 tolerable" },
];