"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LAYER_MAP, type LayerId } from "@/data/layers";
import { METHODS } from "@/data/methods";
import {
  DEFAULT_BETA,
  DEFAULT_P_BASE,
  decodeConfig,
  encodeConfig,
  type St,
} from "@/lib/pra-config";
import {
  REFERENCE_BARRIERS,
  computePRA,
  oneInN,
  pct,
  seriesReliability,
  type Barrier,
  type PAResult,
} from "@/lib/pra";

/* -------------------------------------------------------------------------- */
/*  Default stack                                                             */
/*                                                                             */
/*  Stage assignment follows the fault-tree logic, not org charts:             */
/*  specification / training / interpretability controls discount P(initiate);   */
/*  containment / verification / governance / recovery are runtime barriers.    */
/* -------------------------------------------------------------------------- */

interface Seed {
  id: string;
  name: string;
  layer: LayerId;
  on: boolean;
  redundancy: number;
}

const SEEDS: Seed[] = [
  // --- Stage 1: initiation ---
  { id: "rlhf", name: "RLHF / preference optimisation", layer: "specification", on: true, redundancy: 1 },
  { id: "constitutional-ai", name: "Constitutional AI", layer: "specification", on: true, redundancy: 1 },
  { id: "goal-misgeneralization", name: "Goal-choice validation", layer: "specification", on: false, redundancy: 1 },
  { id: "red-teaming", name: "Automated red-teaming", layer: "training", on: true, redundancy: 1 },
  { id: "emergent-misalignment-mitigation", name: "Objective-hygiene fine-tuning", layer: "training", on: false, redundancy: 1 },
  { id: "sparse-autoencoders", name: "Sparse autoencoder monitoring", layer: "interpretability", on: false, redundancy: 1 },
  { id: "mechanistic-probes-sycophancy", name: "Causal feature auditing", layer: "interpretability", on: false, redundancy: 1 },
  // --- Stage 2: runtime barriers ---
  { id: "sandboxing", name: "Sandboxed execution", layer: "containment", on: true, redundancy: 1 },
  { id: "human-approval-gates", name: "Human approval gates", layer: "containment", on: true, redundancy: 1 },
  { id: "weight-security", name: "Weight exfiltration controls", layer: "containment", on: true, redundancy: 1 },
  { id: "ai-control", name: "AI-control protocols", layer: "verification", on: true, redundancy: 1 },
  { id: "safety-cases", name: "Machine-checkable safety case", layer: "verification", on: false, redundancy: 1 },
  { id: "third-party-audits", name: "Third-party audit", layer: "governance", on: true, redundancy: 1 },
  { id: "weights-revocation", name: "Weight revocation", layer: "recovery", on: true, redundancy: 1 },
  { id: "corrigibility", name: "Correctability training", layer: "recovery", on: false, redundancy: 1 },
];

function buildBarriers(
  state: Record<string, { v: number; on: boolean; redundancy: number }>,
): Barrier[] {
  return SEEDS.map((s) => {
    const layer = LAYER_MAP[s.layer];
    const method = METHODS.find((m) => m.id === s.id);
    const def = method ? method.efficacy / 100 : 0.4;
    const st = state[s.id];
    // Initiators sweep in efficacy space (e); runtime barriers sweep in
    // unavailability space (q = 1 − e). `qLow`/`qHigh` are the plausible
    // range of the control's estimate in the space its `q` is drawn from.
    const eLow = method ? method.efficacyLow / 100 : 0.2;
    const eHigh = method ? method.efficacyHigh / 100 : 0.6;
    const isInitiator =
      s.layer === "specification" ||
      s.layer === "training" ||
      s.layer === "interpretability";
    return {
      id: s.id,
      name: s.name,
      layer: s.layer,
      hex: layer.hex,
      stage: (isInitiator ? "initiator" : "barrier") as Barrier["stage"],
      // For initiators, the slider value is efficacy e; for barriers it is
      // unavailability q. Both are "the good number", 0–1.
      q: st?.v ?? 1 - def,
      e: st?.v ?? def,
      qLow: isInitiator ? eLow : 1 - eHigh,
      qHigh: isInitiator ? eHigh : 1 - eLow,
      cost: 3,
      on: st?.on ?? s.on,
      redundancy: st?.redundancy ?? s.redundancy,
    };
  });
}

function initialState() {
  const out: Record<string, { v: number; on: boolean; redundancy: number }> = {};
  for (const s of SEEDS) {
    const m = METHODS.find((x) => x.id === s.id);
    const eff = (m?.efficacy ?? 40) / 100;
    const isInitiator =
      s.layer === "specification" ||
      s.layer === "training" ||
      s.layer === "interpretability";
    out[s.id] = { v: isInitiator ? eff : 1 - eff, on: s.on, redundancy: 1 };
  }
  return out;
}

/* -------------------------------------------------------------------------- */

export function PRAWorkbench() {
  const boot = useMemo(() => {
    if (typeof window === "undefined") {
      return { pBase: DEFAULT_P_BASE, beta: DEFAULT_BETA, state: initialState() };
    }
    const validIds = new Set(SEEDS.map((s) => s.id));
    const decoded = decodeConfig(window.location.hash, validIds);
    if (!decoded) {
      return { pBase: DEFAULT_P_BASE, beta: DEFAULT_BETA, state: initialState() };
    }
    // A link only carries deviations, so it must be layered over the defaults
    // rather than replacing them.
    return {
      pBase: decoded.pBase,
      beta: decoded.beta,
      state: { ...initialState(), ...decoded.state },
    };
  }, []);
  const [state, setState] = useState<St>(boot.state);
  const [pBase, setPBase] = useState(boot.pBase);
  const [beta, setBeta] = useState(boot.beta);
  const [shared, setShared] = useState(false);

  // Keep the address bar in sync so the current configuration is always
  // shareable and survives a reload. replaceState, not pushState — every slider
  // tick would otherwise be a new history entry.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const encoded = encodeConfig(state, pBase, beta, initialState());
    const url = `${window.location.pathname}${window.location.search}${
      encoded ? `#${encoded}` : ""
    }`;
    window.history.replaceState(null, "", url);
  }, [state, pBase, beta]);

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      setShared(false);
    }
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const barriers = useMemo(() => buildBarriers(state), [state]);
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const result = useMemo<PAResult>(
    () => computePRA({ pBase, beta, barriers }),
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    [pBase, beta, barriers],
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const set = useCallback(
    (id: string, patch: Partial<{ v: number; on: boolean; redundancy: number }>) =>
      setState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } })),
    [],
  );

  const applyPreset = (name: "baseline" | "everything" | "barriers-only" | "none") => {
    const base = initialState();
    Object.keys(base).forEach((k) => {
      if (name === "baseline") return;
      if (name === "none") base[k].on = false;
      if (name === "everything") base[k].on = true;
      if (name === "barriers-only") {
        const seed = SEEDS.find((s) => s.id === k)!;
        const isInitiator =
          seed.layer === "specification" ||
          seed.layer === "training" ||
          seed.layer === "interpretability";
        base[k].on = !isInitiator;
      }
    });
    setState(base);
  };

  const totalCost = barriers.filter((b) => b.on).reduce((s, b) => s + b.cost, 0);

  return (
    <div>
      <div className="grid gap-px border border-rule bg-rule xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* ---------------- CONTROLS ---------------- */}
        <div className="bg-ink p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="label !text-fg-2">Control stack</h3>
              <p className="num mt-1 text-[0.75rem] text-fg-4">
                {result.initiatorCount} initiation-stage · {result.barrierCount}{" "}
                runtime barriers · relative cost {totalCost}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["baseline", "Baseline"],
                  ["everything", "Everything"],
                  ["barriers-only", "Barriers only"],
                  ["none", "None"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => applyPreset(k)}
                  className="border border-rule-2 px-2 py-1 text-[0.6875rem] text-fg-3 transition-colors hover:border-fg-4 hover:text-fg"
                >
                  {l}
                </button>
              ))}
              <button
                onClick={copyLink}
                title="Copy a link that restores this exact configuration"
                className="border border-rule-2 px-2 py-1 text-[0.6875rem] text-fg-3 transition-colors hover:border-fg-4 hover:text-fg"
              >
                {shared ? "Link copied ✓" : "Copy link"}
              </button>
            </div>
          </div>

          {/* hazard model parameters */}
          <div className="mt-6 grid gap-5 border-y border-rule py-5 sm:grid-cols-2">
            <Slider
              label="P(capability event) before alignment controls"
              hint="Base rate at which a frontier training run or deployment yields a dangerous autonomous capability, with no specification, training, or interpretability work at all. There is no published estimate for this. It is the largest single uncertainty in the model."
              value={pBase}
              min={0.05}
              max={1}
              step={0.01}
              display={pct(pBase)}
              sub={`1 in ${oneInN(pBase)}`}
              onChange={setPBase}
              color="var(--color-amber)"
            />
            <Slider
              label="β — common-cause failure"
              hint="Fraction of barrier failures sharing one cause: a common blind spot, a compromised lab, a benchmark everyone optimises against. The dominant unmeasured term, and the one that decides whether the stack is as strong as it looks."
              value={beta}
              min={0}
              max={0.8}
              step={0.01}
              display={beta.toFixed(2)}
              sub={
                beta === 0
                  ? "barriers fail independently"
                  : `+${pct(beta * result.qMin, 2)}% joint`
              }
              onChange={setBeta}
              color="var(--color-rose)"
            />
          </div>

          {/* control list */}
          <div className="mt-5 divide-y divide-rule border-y border-rule">
            {SEEDS.map((seed) => {
              const layer = LAYER_MAP[seed.layer];
              const st = state[seed.id];
              const method = METHODS.find((m) => m.id === seed.id);
              const isInitiator =
                seed.layer === "specification" ||
                seed.layer === "training" ||
                seed.layer === "interpretability";
              const imp = result.importance.find((i) => i.id === seed.id);
              const eff = result.efficiency.find((e) => e.id === seed.id);

              return (
                <div
                  key={seed.id}
                  className={`py-3 transition-opacity ${st.on ? "" : "opacity-40"}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => set(seed.id, { on: !st.on })}
                      aria-pressed={st.on}
                      aria-label={`${st.on ? "Disable" : "Enable"} ${seed.name}`}
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors"
                      style={{
                        borderColor: st.on ? layer.hex : "var(--color-rule-3)",
                        background: st.on ? layer.hex : "transparent",
                      }}
                    >
                      {st.on ? (
                        <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
                          <path
                            d="M1.5 5.2 L4 7.5 L8.5 2.5"
                            fill="none"
                            stroke="var(--color-ink)"
                            strokeWidth="2"
                          />
                        </svg>
                      ) : null}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="text-[0.875rem] text-fg">{seed.name}</span>
                        <span
                          className="num text-[0.5625rem] tracking-widest uppercase"
                          style={{ color: layer.hex }}
                        >
                          {isInitiator ? "initiate" : "barrier"}
                        </span>
                        {eff && st.on && eff.delta > 1e-9 ? (
                          <span className="num ml-auto text-[0.6875rem] text-fg-4">
                            −{pct(eff.delta, 2)}% risk
                          </span>
                        ) : imp && st.on ? (
                          <span className="num ml-auto text-[0.6875rem] text-fg-4">
                            RAW {imp.raw.toFixed(2)}×
                          </span>
                        ) : null}
                      </div>

                      {st.on ? (
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="range"
                            min={0.02}
                            max={0.98}
                            step={0.01}
                            value={st.v}
                            onChange={(e) => set(seed.id, { v: Number(e.target.value) })}
                            aria-label={`${seed.name} ${isInitiator ? "efficacy" : "unavailability"}`}
                            className="min-w-0 flex-1"
                            style={{ accentColor: layer.hex }}
                          />
                          <span className="num w-28 shrink-0 text-right text-[0.6875rem] text-fg-2">
                            {isInitiator ? "e" : "q"} = {st.v.toFixed(2)}
                          </span>
                          {!isInitiator ? (
                            <button
                              onClick={() =>
                                set(seed.id, { redundancy: st.redundancy > 1 ? 1 : 2 })
                              }
                              className="num shrink-0 border border-rule-2 px-1.5 py-0.5 text-[0.625rem] text-fg-3 transition-colors hover:border-fg-4 hover:text-fg"
                              title="Toggle an independent second instance"
                            >
                              {st.redundancy}×i
                            </button>
                          ) : null}
                        </div>
                      ) : null}

                      {st.on && method ? (
                        <p className="num mt-1 text-[0.625rem] text-fg-4">
                          estimate {Math.round(method.efficacy)}% efficacy
                          (CI {method.efficacyLow}–{method.efficacyHigh}%)
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- OUTPUT ---------------- */}
        <div className="bg-ink-2 p-5 sm:p-6">
          <div className="xl:sticky xl:top-20">
            <span className="label !text-fg-2">Residual catastrophe probability</span>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="num text-[2.75rem] leading-none font-medium"
                style={{
                  color:
                    result.pCatastrophe > 0.2
                      ? "var(--color-rose)"
                      : result.pCatastrophe > 0.02
                        ? "var(--color-amber)"
                        : "var(--color-mint)",
                }}
              >
                {pct(result.pCatastrophe, 2)}
              </span>
              <span className="num text-[0.8125rem] text-fg-3">%</span>
            </div>
            <p className="num mt-1 text-[0.75rem] text-fg-4">
              1 in {oneInN(result.pCatastrophe)}
            </p>

            {/* fault tree */}
            <div className="mt-5 border border-rule p-3">
              <p className="label">Fault tree</p>
              <div className="mt-3 space-y-2">
                <Stage
                  n="1"
                  title="Capability event arises"
                  sub={`base ${pct(result.pBase)}% × ${result.initiatorCount} controls → ${pct(result.pArises, 2)}%`}
                  value={result.pArises}
                  color="var(--color-cyan)"
                />
                <div className="pl-3 text-fg-4">↓ ×</div>
                <Stage
                  n="2"
                  title="Defeats every runtime barrier"
                  sub={`${result.barrierCount} barriers, all must fail, β=${beta.toFixed(2)} → ${pct(result.qDefeat, 3)}%`}
                  value={result.qDefeat}
                  color="var(--color-L4)"
                />
                <div className="pl-3 text-fg-4">↓ =</div>
                <Stage
                  n="="
                  title="Catastrophe"
                  sub={`${pct(result.pArises, 2)}% × ${pct(result.qDefeat, 3)}%`}
                  value={result.pCatastrophe}
                  color="var(--color-rose)"
                  emphasis
                />
              </div>
            </div>

            <dl className="mt-4 space-y-px border-y border-rule">
              <Row
                k="P(all barriers fail)"
                v={`${pct(result.qSystem, 4)}%`}
              />
              <Row
                k="+ common cause β"
                v={`${pct(result.qDefeat, 4)}%`}
              />
              <Row
                k="At least one barrier holds"
                v={`${pct(result.reliability, 3)}%`}
              />
              <Row
                k="Weakest barrier"
                v={result.weakestLink ? result.weakestLink.name : "—"}
              />
            </dl>

            {result.weakestLink && result.weakestLink.raw > 1.15 ? (
              <div className="mt-4 border border-rose/25 bg-rose/5 p-3">
                <p className="label" style={{ color: "var(--color-rose)" }}>
                  Weakest link
                </p>
                <p className="mt-1.5 text-[0.8125rem] text-fg">
                  {result.weakestLink.name}
                </p>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-fg-3">
                  Perfecting this one barrier would multiply stack reliability by{" "}
                  <span className="num text-rose">
                    {result.weakestLink.raw.toFixed(2)}×
                  </span>
                  . Nothing else comes close.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PRAAnalysis result={result} barriers={barriers} />
        <div className="space-y-5">
          <SwissCheese result={result} barriers={barriers} />
          <ReferenceScale />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Stage({
  n,
  title,
  sub,
  value,
  color,
  emphasis,
}: {
  n: string;
  title: string;
  sub: string;
  value: number;
  color: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className="flex items-start gap-2.5 border-l-2 pl-2.5"
      style={{ borderColor: color }}
    >
      <span className="num mt-0.5 text-[0.625rem] text-fg-4">{n}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className={`text-[0.8125rem] ${emphasis ? "text-fg" : "text-fg-2"}`}>
            {title}
          </span>
          <span className="num shrink-0 text-[0.8125rem]" style={{ color }}>
            {pct(value, 2)}%
          </span>
        </div>
        <p className="num mt-0.5 text-[0.625rem] leading-snug text-fg-4">{sub}</p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-[0.75rem] text-fg-3">{k}</dt>
      <dd className="num max-w-[9rem] shrink-0 truncate text-[0.75rem] text-fg">{v}</dd>
    </div>
  );
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  display,
  sub,
  onChange,
  color,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  sub?: string;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[0.8125rem] text-fg">{label}</label>
        <span className="num text-[0.875rem]" style={{ color }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2 w-full"
        style={{ accentColor: color }}
      />
      <div className="flex items-baseline justify-between gap-2">
        <span className="num text-[0.625rem] text-fg-4">{min}</span>
        <span className="num text-[0.625rem] text-fg-4">{sub ?? max}</span>
        <span className="num text-[0.625rem] text-fg-4">{max}</span>
      </div>
      <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-fg-4">{hint}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Swiss cheese                                                               */
/* -------------------------------------------------------------------------- */

function SwissCheese({
  result,
  barriers,
}: {
  result: PAResult;
  barriers: Barrier[];
}) {
  // Live workbench state: same sense as the P(escape) figure above — runtime
  // barriers only, using each barrier's current `q` for its hole size.
  const slices = barriers.filter((b) => b.on && b.stage === "barrier");

  const W = 340;
  const rowH = 16;
  const gap = 3;
  const H = Math.max(1, slices.length) * (rowH + gap);

  const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h += 0x6d2b79f5;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  return (
    <section className="frame ticked p-4">
      <div className="flex items-baseline justify-between">
        <span className="label">Swiss cheese — runtime barriers only</span>
        <span className="num text-[0.6875rem] text-fg-4">
          P(escape) = {pct(result.qSystem, 4)}%
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full"
        role="img"
        aria-label="Each deployed runtime barrier is a slice; hole area is its failure probability; the trajectory threads a hole in every slice"
      >
        {slices.map((b, i) => {
          const y = i * (rowH + gap);
          const rnd = hash(b.id);
          return (
            <g key={b.id}>
              <rect x={0} y={y} width={W} height={rowH} fill={b.hex} opacity={0.16} />
              <rect
                x={0}
                y={y}
                width={W}
                height={rowH}
                fill="none"
                stroke={b.hex}
                strokeOpacity={0.5}
                strokeWidth={0.75}
              />
              {Array.from({ length: 5 }, (_, k) => {
                const cx = 20 + rnd() * (W - 40);
                const cy = y + 3 + rnd() * (rowH - 6);
                const r = (1.6 + rnd() * 2.4) * (0.35 + Math.sqrt(b.q) * 1.6);
                return (
                  <circle key={k} cx={cx} cy={cy} r={r} fill="var(--color-ink)" opacity={0.9} />
                );
              })}
            </g>
          );
        })}
        {slices.length > 0 ? (
          <path
            d={`M0,${H * 0.5} C ${W * 0.3},${H * 0.5 - H * 0.34} ${W * 0.6},${
              H * 0.5 + H * 0.3
            } ${W},${H * 0.5 - H * 0.1}`}
            fill="none"
            stroke="var(--color-rose)"
            strokeWidth={1.25}
            strokeDasharray="3 2.5"
            opacity={0.9}
          />
        ) : null}
      </svg>

      <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-fg-4">
        Hole area is each barrier&apos;s unavailability. The event escapes when
        the trajectory threads a hole in every slice at once — so the escape
        probability is the product of the hole areas, and every extra slice
        shrinks it. Independence, not individual strength, is the property that
        makes this architecture work.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scale reference                                                            */
/* -------------------------------------------------------------------------- */

function ReferenceScale() {
  const MAX = 1e-2;
  return (
    <section className="frame ticked p-4">
      <span className="label">Scale — what high-assurance engineering achieves</span>
      <div className="mt-3 space-y-2.5">
        {REFERENCE_BARRIERS.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[0.75rem] text-fg-2">{r.label}</span>
              <span className="num text-[0.75rem] text-mint">10⁻{Math.log10(r.q).toFixed(0)}</span>
            </div>
            <div className="mt-1 bar-track">
              <span
                className="bar-fill"
                style={{
                  width: `${Math.max(1, (Math.log10(r.q) / Math.log10(MAX)) * 100)}%`,
                  background: "var(--color-mint)",
                }}
              />
            </div>
          </div>
        ))}
        <div className="border-t border-rule pt-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.75rem] text-fg">
              Best AI barrier in this catalogue
            </span>
            <span className="num text-[0.75rem] text-amber">10⁻¹</span>
          </div>
          <div className="mt-1 bar-track">
            <span
              className="bar-fill"
              style={{ width: "100%", background: "var(--color-amber)" }}
            />
          </div>
          <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-fg-4">
            A five-order-of-magnitude gap. This is the honest result of the
            exercise, and no amount of stacking closes it: adding more 10⁻¹
            barriers produces 10⁻ⁿ, while the safety-critical industries operate
            at 10⁻⁶ to 10⁻⁹ <em>per barrier</em>.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Analysis panels                                                            */
/* -------------------------------------------------------------------------- */

function PRAAnalysis({
  result,
  barriers,
}: {
  result: PAResult;
  barriers: Barrier[];
}) {
  const [tab, setTab] = useState<"importance" | "frontier">("importance");

  return (
    <section className="frame ticked">
      <div className="flex items-center justify-between border-b border-rule">
        <div className="flex">
          {(
            [
              ["importance", "Importance & priority"],
              ["frontier", "Cost-effectiveness frontier"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className="border-b-2 px-4 py-2.5 text-[0.8125rem] transition-colors"
              style={{
                borderColor: tab === k ? "var(--color-amber)" : "transparent",
                color: tab === k ? "var(--color-fg)" : "var(--color-fg-4)",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        {tab === "importance" ? (
          <ImportancePanel result={result} />
        ) : (
          <FrontierPanel result={result} barriers={barriers} />
        )}
      </div>
    </section>
  );
}

function ImportancePanel({ result }: { result: PAResult }) {
  if (!result.efficiency.length) return <Empty />;

  return (
    <div>
      <p className="text-[0.8125rem] leading-relaxed text-fg-3">
        Ranked by marginal reduction in final catastrophe risk per unit cost,
        across <em>both</em> stages. This is the only ranking in which a
        sparse-autoencoder audit and a sandbox are directly comparable, because
        both are measured in the same unit — the probability they prevent.
      </p>
      <p className="mt-2 text-[0.75rem] leading-relaxed text-fg-4">
        These are leave-one-out values: what each control is worth if it were
        removed today while the others stayed in place. They under-attribute
        joint benefit, because a barrier&apos;s value depends on its neighbours
        still being there. That is a real limitation of the metric, and it is
        also why the ranking beats the values — a lower-ranked control is never
        worthless, and cutting the bottom of this list is exactly how
            defence-in-depth programmes decay.
      </p>

      <div className="mt-4 space-y-px border-y border-rule">
        {result.efficiency.map((e, i) => (
          <div key={e.id} className="flex items-center gap-3 py-2">
            <span className="num w-5 shrink-0 text-[0.6875rem] text-fg-4">
              {i + 1}
            </span>
            <span className="h-2.5 w-2.5 shrink-0" style={{ background: e.hex }} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-fg">
              {e.name}
            </span>
            <span className="num shrink-0 text-[0.625rem] tracking-widest text-fg-4 uppercase">
              {e.stage}
            </span>
            <div className="hidden w-24 shrink-0 sm:block">
              <div className="bar-track">
                <span
                  className="bar-fill"
                  style={{
                    width: `${Math.min(100, e.share * 100)}%`,
                    background: e.hex,
                  }}
                />
              </div>
            </div>
            <span className="num w-20 shrink-0 text-right text-[0.8125rem] text-fg-2">
              −{pct(e.delta, 2)}%
            </span>
          </div>
        ))}
      </div>

      {result.weakestLink ? (
        <div className="mt-4">
          <p className="label">Runtime barrier importance (PRA standard measures)</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse">
              <thead>
                <tr className="border-b border-rule-2">
                  {["Barrier", "FV %", "Birnbaum", "RRW %", "RAW"].map((h) => (
                    <th key={h} className="label px-2 py-1.5 text-left font-medium last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.importance.slice(0, 6).map((i) => (
                  <tr key={i.id} className="border-b border-rule last:border-0">
                    <td className="px-2 py-2 pl-0 text-[0.75rem] text-fg-2">{i.name}</td>
                    <td className="num px-2 py-2 text-[0.75rem] text-fg-2">
                      {(i.fussellVesely * 100).toFixed(1)}
                    </td>
                    <td className="num px-2 py-2 text-[0.75rem] text-fg-3">
                      {i.birnbaum.toExponential(2)}
                    </td>
                    <td className="num px-2 py-2 text-[0.75rem] text-fg-3">
                      {(i.rrw * 100).toFixed(1)}
                    </td>
                    <td
                      className="num px-2 py-2 pr-0 text-right text-[0.8125rem]"
                      style={{
                        color:
                          i.raw > 1.4
                            ? "var(--color-rose)"
                            : i.raw > 1.1
                              ? "var(--color-amber)"
                              : "var(--color-fg-3)",
                      }}
                    >
                      {i.raw.toFixed(2)}×
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-fg-4">
            FV sums to exactly one across the stack, so it is a clean
            apportionment of which barrier is actually catching events. Birnbaum
            values shrink geometrically as the stack deepens — with eight
            barriers each term is the product of seven others, so no single
            component&apos;s failure rate dominates the total. That is the
            weakest-link principle operating correctly, and it is why a deep
            stack is robust to any one component degrading.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FrontierPanel({
  result,
  barriers,
}: {
  result: PAResult;
  barriers: Barrier[];
}) {
  const active = barriers.filter((b) => b.on);
  if (!active.length) return <Empty />;

  const ranked = result.efficiency;
  let p = result.pCatastrophe;
  let spend = 0;
  const points = [{ spend: 0, p, label: "" }];
  for (const e of ranked) {
    p -= e.delta;
    spend += e.cost;
    points.push({ spend, p: Math.max(0, p), label: e.name });
  }

  const maxSpend = Math.max(1, points[points.length - 1].spend);
  const W = 620;
  const H = 260;
  const PAD = { t: 14, r: 14, b: 34, l: 48 };
  const sx = (s: number) => PAD.l + (s / maxSpend) * (W - PAD.l - PAD.r);
  const sy = (v: number) =>
    H - PAD.b - (v / Math.max(result.pCatastrophe, 1e-9)) * (H - PAD.t - PAD.b);
  const path = points
    .map((pt, i) => `${i === 0 ? "M" : "L"}${sx(pt.spend).toFixed(1)},${sy(pt.p).toFixed(1)}`)
    .join("");

  return (
    <div>
      <p className="text-[0.8125rem] leading-relaxed text-fg-3">
        Buying controls in descending order of risk-reduction-per-unit-cost, and
        plotting residual risk against cumulative spend. The shape is the whole
        argument for prioritisation: the first few controls do most of the work,
        and the tail of the budget buys almost nothing. A safety programme that
        cannot say where the knee is cannot defend its own budget.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img"
        aria-label="Residual catastrophe probability as a function of cumulative control spend">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={sy(result.pCatastrophe * f)}
              y2={sy(result.pCatastrophe * f)}
              stroke="var(--color-rule)"
              strokeWidth={0.5}
            />
            <text
              x={PAD.l - 6}
              y={sy(result.pCatastrophe * f) + 3}
              textAnchor="end"
              className="num"
              fontSize={8}
              fill="var(--color-fg-4)"
            >
              {(result.pCatastrophe * f * 100).toFixed(1)}
            </text>
          </g>
        ))}

        <path d={path} fill="none" stroke="var(--color-amber)" strokeWidth={1.75} />

        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={sx(pt.spend)} cy={sy(pt.p)} r={2.5} fill="var(--color-amber)" />
            {i > 0 && i % 2 === 0 ? (
              <text
                x={sx(pt.spend)}
                y={sy(pt.p) - 8}
                textAnchor="middle"
                className="num"
                fontSize={7}
                fill="var(--color-fg-4)"
              >
                {pt.label.length > 18 ? pt.label.slice(0, 17) + "…" : pt.label}
              </text>
            ) : null}
          </g>
        ))}

        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={H - PAD.b}
          y2={H - PAD.b}
          stroke="var(--color-rule-2)"
        />
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 10}
          textAnchor="middle"
          className="label"
          fontSize={8}
          fill="var(--color-fg-4)"
        >
          CUMULATIVE RELATIVE COST
        </text>
        <text
          x={PAD.l - 6}
          y={PAD.t - 3}
          textAnchor="end"
          className="label"
          fontSize={8}
          fill="var(--color-fg-4)"
        >
          P %
        </text>
      </svg>
    </div>
  );
}

function Empty() {
  return (
    <p className="py-10 text-center text-[0.8125rem] text-fg-4">
      Deploy at least one control to see the analysis.
    </p>
  );
}

export { SEEDS, buildBarriers, initialState, seriesReliability };
export type { St };
