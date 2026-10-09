import Link from "next/link";
import { LAYERS } from "@/data/layers";
import { METHODS } from "@/data/methods";
import {
  CAPABILITY_TRENDS,
  MEASURED_RESULTS,
  RISK_ESTIMATES,
  OPEN_QUESTIONS,
} from "@/data/evidence";
import { HazardChart } from "@/components/hazard-chart";
import { Reveal } from "@/components/reveal";
import { Cite, KindBadge, Panel, SectionHead } from "@/components/ui";

export default function Home() {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        <div
          className="scanline pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.035]"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--color-amber), transparent)",
          }}
          aria-hidden
        />

        <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="hazard h-2.5 w-10" aria-hidden />
                <span className="label !text-amber">
                  Mission briefing · control the hazard, not the narrative
                </span>
              </div>

              <h1 className="display mt-7 text-[clamp(2.75rem,8.2vw,6.5rem)] text-fg">
                The only question
                <br />
                that matters is
                <br />
                <span className="text-amber">
                  how we keep control
                </span>
                <br />
                <span className="italic text-fg-3">of what we are building.</span>
              </h1>

              <div className="prose mt-8 max-w-xl">
                <p className="text-[1.0625rem] leading-relaxed text-fg-2">
                  Superintelligence is not a thing that happens on a date. It is
                  a capability curve that is currently rising faster than the
                  institutions built to govern it. AEGIS is an instrument for
                  reasoning about that gap: a seven-layer taxonomy of control
                  techniques, what each one has actually been measured to do, and
                  the mathematics of putting several imperfect barriers between a
                  system and a catastrophe.
                </p>
                <p className="mt-4">
                  Nothing here is prediction. Every capability figure is
                  measured; every governance figure is sourced; every efficacy
                  figure is an editorial estimate and says so on its face. The
                  engine is a fault-tree model adapted from nuclear and process
                  safety, not a forecast — and its test suite asserts the
                  properties that make such a model trustworthy, including that
                  adding a barrier must never increase risk.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/risk"
                  className="group relative inline-flex items-center gap-2.5 bg-amber px-5 py-3 text-[0.8125rem] font-medium text-ink transition-all hover:bg-[#ffb055]"
                >
                  Open the PRA engine
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/stack"
                  className="inline-flex items-center gap-2.5 border border-rule-2 px-5 py-3 text-[0.8125rem] text-fg-2 transition-colors hover:border-fg-4 hover:text-fg"
                >
                  Walk the seven layers
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 px-1 py-3 text-[0.8125rem] text-fg-3 underline decoration-rule-2 underline-offset-4 transition-colors hover:text-fg"
                >
                  How these numbers were made
                </Link>
              </div>
            </div>

            {/* telemetry */}
            <div className="lg:pt-3">
              <div className="frame ticked sticky top-20">
                <div className="frame-hd">
                  <span className="label !text-fg-2">Live telemetry</span>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
                    </span>
                    <span className="num text-[0.625rem] text-fg-4">MONITORING</span>
                  </span>
                </div>

                <div className="divide-y divide-rule">
                  <TelemetryRow
                    k="Capability doubling"
                    v="7.0"
                    u="months"
                    sub="METR 50% task horizon, 2019–2025"
                    accent="var(--color-cyan)"
                  />
                  <TelemetryRow
                    k="Frontier compute doubling"
                    v="5.2"
                    u="months"
                    sub="Epoch AI, language models since 2020"
                    accent="var(--color-amber)"
                  />
                  <TelemetryRow
                    k="HLMI 50% median"
                    v="2047"
                    u="year"
                    sub="2,778 authors; 13 yrs earlier than 2022"
                    accent="var(--color-mint)"
                  />
                  <TelemetryRow
                    k="AGI → superintelligence"
                    v="29.4"
                    u="months"
                    sub="Metaculus Q9062 median; 90% CI 9.5–116"
                    accent="var(--color-violet)"
                  />
                  <TelemetryRow
                    k="Best measured control eval"
                    v="83"
                    u="% safety"
                    sub="Trusted monitoring + 10% deferral, ICML 2024"
                    accent="var(--color-rose)"
                  />
                  <TelemetryRow
                    k="Best barrier vs. nuclear"
                    v="5"
                    u="orders of mag."
                    sub="10⁻¹ today vs 10⁻⁶ nuclear safety-critical"
                    accent="var(--color-rose)"
                  />
                </div>

                <div className="border-t border-rule p-4">
                  <p className="text-[0.75rem] leading-relaxed text-fg-3">
                    The last row is the uncomfortable one. Defence in depth works
                    exactly as the mathematics promises — every barrier added
                    multiplies residual risk down. It just does not reach safety.
                    The best barrier anyone can currently justify sits near 10⁻¹;
                    high-assurance engineering operates at 10⁻⁶ to 10⁻⁹{" "}
                    <em>per barrier</em>.
                  </p>
                  <Link
                    href="/risk"
                    className="mt-3 inline-flex items-center gap-1.5 text-[0.75rem] text-amber underline decoration-amber/30 underline-offset-4 hover:decoration-amber"
                  >
                    See the arithmetic
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE SHAPE OF THE PROBLEM ==================== */}
      <section className="border-y border-rule bg-ink-2">
        <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-20 md:py-28">
          <SectionHead
            index="01"
            eyebrow="The shape of the problem"
            title={
              <>
                Exponential capability.
                <br />
                <span className="italic text-fg-3">
                  Institutional velocity.
                </span>
              </>
            }
            lede={
              <>
                Three independent teams have measured how fast the underlying
                capability is moving. All three report the same shape: exponential
                growth, with the slope steepening. The control stack does not grow
                that way, because it is made of people, audits, and legislation.
              </>
            }
          />

          <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr]">
            <Panel title="Capability trajectory vs. control iteration">
              <HazardChart />
            </Panel>

            <div className="space-y-px">
              {CAPABILITY_TRENDS.slice(0, 4).map((t, i) => (
                <Reveal key={t.id} delay={i * 60}>
                  <div className="border-l border-rule py-3 pl-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[0.8125rem] text-fg">
                        {t.label}
                      </span>
                      <span className="num shrink-0 text-[0.8125rem] text-fg-2">
                        {t.display}
                        <span className="ml-1 text-fg-4">{t.unit}</span>
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.75rem] leading-relaxed text-fg-3">
                      {t.note}
                    </p>
                    <div className="mt-2">
                      <Cite source={t.source} url={t.sourceUrl} date={t.date} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE STACK ==================== */}
      <section className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-20 md:py-28">
        <SectionHead
          index="02"
          eyebrow="The control stack"
          title={
            <>
              Seven layers. No single
              <br />
              <span className="italic text-fg-3">one of them is sufficient.</span>
            </>
          }
          lede={
            <>
              Every control in the literature does something real and none of
              them is enough. The engineering question is not which technique
              wins — it is which combination of imperfect barriers is worth
              building, and where the residual risk concentrates once you have
              assembled them.
            </>
          }
        />

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((layer, i) => {
            const count = METHODS.filter((m) => m.layer === layer.id).length;
            const mean = (
              METHODS.filter((m) => m.layer === layer.id).reduce(
                (s, m) => s + m.efficacy,
                0,
              ) / count
            ).toFixed(0);

            return (
              <Reveal key={layer.id} delay={i * 55}>
                <Link
                  href={`/stack#${layer.id}`}
                  className="group relative flex h-full flex-col bg-ink p-5 transition-colors hover:bg-ink-3"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: layer.hex, opacity: 0.55 }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="num text-[0.6875rem] tracking-widest"
                      style={{ color: layer.hex }}
                    >
                      L{layer.index}
                    </span>
                    <span className="num text-[0.625rem] text-fg-4">
                      {count} methods
                    </span>
                  </div>

                  <h3 className="display mt-3 text-[1.375rem] leading-tight text-fg">
                    {layer.name}
                  </h3>
                  <p className="mt-1 text-[0.75rem] text-fg-4">
                    {layer.tagline}
                  </p>

                  <p className="mt-3.5 flex-1 text-[0.8125rem] leading-relaxed text-fg-3">
                    {layer.blurb}
                  </p>

                  <div className="mt-5 border-t border-rule pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="label">Mean efficacy</span>
                      <span
                        className="num text-[0.9375rem]"
                        style={{ color: layer.hex }}
                      >
                        {mean}%
                      </span>
                    </div>
                    <div className="mt-2 bar-track">
                      <span
                        className="bar-fill"
                        style={{ width: `${mean}%`, background: layer.hex }}
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}

          <Reveal delay={LAYERS.length * 55}>
            <Link
              href="/atlas"
              className="group flex h-full flex-col justify-between bg-ink p-5 transition-colors hover:bg-ink-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="num text-[0.6875rem] tracking-widest text-fg-4">
                  —
                </span>
                <span className="num text-[0.625rem] text-fg-4">
                  {METHODS.length} total
                </span>
              </div>
              <div className="my-5">
                <h3 className="display text-[1.375rem] leading-tight text-fg group-hover:text-amber">
                  Full atlas
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-3">
                  Every method with citations, formulae, failure modes, maturity,
                  and dependency edges.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-amber">
                Browse all {METHODS.length}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ==================== WHAT WE ACTUALLY KNOW ==================== */}
      <section className="border-y border-rule bg-ink-2">
        <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-20 md:py-28">
          <SectionHead
            index="03"
            eyebrow="Measured, not asserted"
            title={
              <>
                What the field has
                <br />
                <span className="italic text-fg-3">actually demonstrated</span>
              </>
            }
            lede={
              <>
                Most of what is written about AI safety is argument. These are
                the results — the ones with numbers attached, published, and
                reproducible. Read the negative results first; they are the ones
                that constrain the design.
              </>
            }
          />

          <div className="grid gap-px border border-rule bg-rule lg:grid-cols-2">
            {MEASURED_RESULTS.map((r, i) => {
              const accent =
                r.polarity === "good"
                  ? "var(--color-mint)"
                  : r.polarity === "bad"
                    ? "var(--color-rose)"
                    : "var(--color-amber)";
              return (
                <Reveal key={r.id} delay={(i % 4) * 50}>
                  <article className="h-full bg-ink p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-[0.9375rem] leading-snug text-fg">
                          {r.claim}
                        </h3>
                        <p className="num mt-1.5 text-[0.8125rem]" style={{ color: accent }}>
                          {r.value}
                        </p>
                      </div>
                      <span
                        className="num mt-1 shrink-0 text-[0.625rem] tracking-widest uppercase"
                        style={{ color: accent }}
                      >
                        {r.polarity === "good"
                          ? "Works"
                          : r.polarity === "bad"
                            ? "Fails"
                            : "Mixed"}
                      </span>
                    </div>

                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-3">
                      {r.context}
                    </p>

                    <div className="mt-4 border-t border-rule pt-3">
                      <Cite source={r.source} url={r.sourceUrl} date={r.date} />
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== RISK ==================== */}
      <section className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-20 md:py-28">
        <SectionHead
          index="04"
          eyebrow="How much risk, honestly"
          title={
            <>
              Nobody agrees.
              <br />
              <span className="italic text-fg-3">
                That disagreement is data.
              </span>
            </>
          }
          lede={
            <>
              Published catastrophic-risk estimates from advanced-AI range from
              about 3% to about 25%. Treating that spread as ignorance misses the
              useful part: the shape of the distribution, who is moving it, and in
              which direction as evidence accumulates.
            </>
          }
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
          {/* distribution */}
          <Panel title="Published estimates — probability of an extinction-level outcome">
            <RiskDistribution />
          </Panel>

          {/* the estimates */}
          <div className="space-y-px">
            {RISK_ESTIMATES.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <article className="border-l border-rule py-4 pl-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div>
                      <h3 className="text-[0.9375rem] text-fg">{r.who}</h3>
                      <p className="mt-0.5 text-[0.75rem] text-fg-4">{r.role}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <KindBadge kind={r.kind} />
                      <span className="num text-[1.25rem] leading-none text-amber">
                        {r.display}
                        <span className="ml-0.5 text-[0.8125rem] text-fg-3">
                          {r.unit}
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="num mt-2 text-[0.6875rem] text-fg-4">
                    {r.horizon} · {r.date}
                  </p>

                  {r.quote ? (
                    <p className="mt-2.5 border-l border-rule-2 pl-3 text-[0.8125rem] leading-relaxed text-fg-2 italic">
                      {r.quote}
                    </p>
                  ) : null}

                  <div className="mt-2.5">
                    <Cite source={r.source} url={r.sourceUrl} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OPEN QUESTIONS ==================== */}
      <section className="border-y border-rule bg-ink-2">
        <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-20 md:py-28">
          <SectionHead
            index="05"
            eyebrow="What nobody has solved"
            title={
              <>
                The honest
                <br />
                <span className="italic text-fg-3">open questions</span>
              </>
            }
            lede={
              <>
                A map of the field is only useful if it marks where the ground
                is missing. These five are, in my assessment, the load-bearing
                unknowns — and four of the five are unknown for structural
                rather than accidental reasons.
              </>
            }
          />

          <ol className="grid gap-px border border-rule bg-rule lg:grid-cols-2">
            {OPEN_QUESTIONS.map((oq, i) => (
              <Reveal key={oq.q} delay={(i % 2) * 60} as="li">
                <article className="h-full bg-ink p-5">
                  <div className="flex items-start gap-4">
                    <span className="num shrink-0 pt-0.5 text-[1.5rem] leading-none text-rule-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-[0.9375rem] leading-snug text-fg">
                          {oq.q}
                        </h3>
                        <span
                          className="num shrink-0 border px-1.5 py-0.5 text-[0.5625rem] tracking-widest uppercase"
                          style={{
                            borderColor:
                              oq.status === "open"
                                ? "#facc1544"
                                : oq.status === "contested"
                                  ? "#fb923c44"
                                  : "#b48cff44",
                            color:
                              oq.status === "open"
                                ? "#facc15"
                                : oq.status === "contested"
                                  ? "#fb923c"
                                  : "#b48cff",
                          }}
                        >
                          {oq.status}
                        </span>
                      </div>
                      <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-fg-3">
                        {oq.detail}
                      </p>
                      <Link
                        href={`/stack#${oq.layer}`}
                        className="num mt-3 inline-block text-[0.6875rem] text-fg-4 underline decoration-rule-2 underline-offset-3 hover:text-fg-2"
                      >
                        LAYER {oq.layer.toUpperCase()} →
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================== CLOSING ==================== */}
      <section className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="display text-[clamp(1.75rem,4.5vw,3rem)] leading-tight text-fg">
            A defence-in-depth stack is not a solution.
            <span className="italic text-fg-3">
              {" "}
              It is the only structure that survives being wrong.
            </span>
          </p>
          <p className="prose mx-auto mt-6 max-w-xl text-[0.9375rem]">
            No barrier here stops a determined superintelligence on its own. The
            argument for building all seven layers is not that any one of them
            works. It is that they fail independently — and that independence is
            the only property in this entire domain that is genuinely worth
            engineering for.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/risk"
              className="bg-amber px-5 py-3 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-[#ffb055]"
            >
              Model a safety case
            </Link>
            <Link
              href="/governance"
              className="border border-rule-2 px-5 py-3 text-[0.8125rem] text-fg-2 transition-colors hover:border-fg-4 hover:text-fg"
            >
              The governance record
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function TelemetryRow({
  k,
  v,
  u,
  sub,
  accent,
}: {
  k: string;
  v: string;
  u: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-2.5">
      <div className="min-w-0">
        <p className="label">{k}</p>
        <p className="mt-0.5 truncate text-[0.6875rem] text-fg-4">{sub}</p>
      </div>
      <div className="flex shrink-0 items-baseline gap-1">
        <span className="num text-[1.0625rem] leading-none" style={{ color: accent }}>
          {v}
        </span>
        <span className="num text-[0.625rem] text-fg-4">{u}</span>
      </div>
    </div>
  );
}

function RiskDistribution() {
  const items = [
    { label: "ESPAI median (n=1,321)", value: 5, color: "var(--color-cyan)" },
    { label: "Toby Ord, The Precipice", value: 16.7, color: "var(--color-violet)" },
    { label: "ESPAI mean (n=1,321)", value: 16.2, color: "var(--color-cyan)" },
    { label: "Geoffrey Hinton, 2024", value: 15, color: "var(--color-amber)" },
    { label: "Dario Amodei, 2024", value: 25, color: "var(--color-amber)" },
  ];
  const MAX = 30;

  return (
    <div>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[0.8125rem] text-fg-2">{it.label}</span>
              <span className="num text-[0.8125rem]" style={{ color: it.color }}>
                {it.value}%
              </span>
            </div>
            <div className="mt-1.5 bar-track">
              <span
                className="bar-fill"
                style={{ width: `${(it.value / MAX) * 100}%`, background: it.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-rule pt-4">
        <p className="text-[0.8125rem] leading-relaxed text-fg-3">
          The 2023 AI Impacts survey of 2,778 authors produced a{" "}
          <span className="num text-fg">median of 5%</span> and a{" "}
          <span className="num text-fg">mean of 16.2%</span> for advanced AI
          causing human extinction or permanent severe disempowerment. The
          22-point gap between them is the whole story: a minority carrying very
          high estimates, and a median that materially understates the tail.
        </p>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-3">
          Note also that 38–51% of the same respondents assigned{" "}
          <span className="num text-fg">at least 10%</span>. A median of 5% with
          40% of experts above 10% is not reassurance. It is a distribution with
          a heavy shoulder.
        </p>
      </div>
    </div>
  );
}