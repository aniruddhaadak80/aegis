import type { Metadata } from "next";
import { TIMELINE } from "@/data/evidence";
import { Panel, SectionHead, Stat, Cite } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Governance — The Record",
  description:
    "The safety-framework and policy timeline from Bletchley to 2026, plus an honest assessment of what each commitment is worth and who it binds.",
  alternates: { canonical: "/governance" },
};

const FRAMEWORKS = [
  {
    name: "Anthropic — Responsible Scaling Policy",
    since: "Sep 2023",
    current: "v3.4, July 2026",
    thresholds: "CBRN-3, CBRN-4, AI R&D-1…4",
    binds: "Voluntary — the issuer only",
    hex: "#fb923c",
    body: "AI Safety Levels modelled on biosafety. Crossing a capability threshold obligates a matching safeguards standard, attested by a safety-case document. Notable for iterating in public: RSP v3.0 changed ASL to refer to groups of safeguards rather than models, and decoupled Capability Thresholds from ASL levels because, as the policy puts it, thresholds do not naturally group that way.",
  },
  {
    name: "Google DeepMind — Frontier Safety Framework",
    since: "May 2024",
    current: "v3.1, April 2026",
    thresholds: "Misuse CCLs, Instrumental Reasoning, ML R&D automation",
    binds: "Voluntary — the issuer only",
    hex: "#4ade80",
    body: "Critical Capability Levels with early-warning evaluations run before each threshold, escalating deployment mitigations, and security levels expressed on the RAND scale. v3 added a harmful-manipulation CCL and explicit protocols for models interfering with operators' ability to direct or shut them down. v3.1 added Tracked Capability Levels for less extreme risks.",
  },
  {
    name: "OpenAI — Preparedness Framework",
    since: "Dec 2023",
    current: "v2, April 2025",
    thresholds: "Low/Medium/High/Critical per category",
    binds: "Voluntary; CEO may override",
    hex: "#4cc9f0",
    body: "Graded capability scores per risk category with a Safety Advisory Group empowered to recommend halting training. v2 defined Critical AI self-improvement operationally — a generational model improvement in one-fifth the wall-clock time of equivalent 2024 progress — which is a concrete, falsifiable, publicly stated bar.",
  },
  {
    name: "Frontier AI Safety Commitments",
    since: "May 2024",
    current: "Seoul → Paris",
    thresholds: "Each signatory defines its own",
    binds: "Voluntary coalition",
    hex: "#c084fc",
    body: "Frontier labs agreeing to publish safety frameworks with defined thresholds, publish safety-case reports on crossing, and accept external evaluation under secure conditions. The first attempt at common terms — and therefore the first place where frameworks can be compared, which is how the METR and affordance-analyses critiques became possible.",
  },
  {
    name: "EU AI Act",
    since: "Aug 2024",
    current: "GPAI obligations from Aug 2025",
    thresholds: "Compute-based, ~10²⁵ FLOP",
    binds: "Binding — statutory",
    hex: "#facc15",
    body: "The only instrument on this list with legal force. For frontier models it operates through the GPAI regime: technical documentation, downstream information, copyright policy, and evaluation including adversarial testing, above a compute threshold. The load-bearing weakness is that the threshold is on FLOP while capability is a function of FLOP and algorithmic efficiency.",
  },
  {
    name: "National AI Safety Institutes",
    since: "Nov 2023",
    current: "UK AISI, US CAISI + partners",
    thresholds: "Not threshold-setting — evaluation",
    binds: "Depends on voluntary access",
    hex: "#b48cff",
    body: "State-funded evaluators with pre-deployment weight access, created after Bletchley precisely because self-assessment had been judged insufficient. The binding constraint is throughput: institutes review what labs ship. Coverage requires evaluation throughput to exceed deployment throughput.",
  },
];

export default function GovernancePage() {
  const yearMin = Math.min(...TIMELINE.map((t) => t.year));
  const yearMax = Math.max(...TIMELINE.map((t) => t.year));

  return (
    <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-14 md:py-20">
      <SectionHead
        index="06"
        eyebrow="Governance"
        title={
          <>
            What has actually
            <br />
            <span className="italic text-fg-3">been committed to.</span>
          </>
        }
        lede={
          <>
            Six instruments, three years, and not one binding constraint on the
            party doing the constraining. This page records what exists, what it
            obliges, and — where the published assessments say so — how much it
            is worth.
          </>
        }
      />

      <div className="mb-14 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value="6" label="instruments in force" accent="var(--color-L6)" />
        <Stat
          value="0"
          label="binding on a frontier developer"
          sub="short of the EU AI Act's GPAI regime"
          accent="var(--color-rose)"
        />
        <Stat value="12" label="providers surveyed by METR" sub="Mar 2025" />
        <Stat
          value="<50%"
          label="typical framework score"
          sub="across METR's criteria"
          accent="var(--color-amber)"
        />
      </div>

      {/* frameworks */}
      <section>
        <SectionHead
          index="06.1"
          eyebrow="The instruments"
          title={
            <>
              Six frameworks,
              <br />
              <span className="italic text-fg-3">one real constraint.</span>
            </>
          }
        />

        <div className="grid gap-px border border-rule bg-rule lg:grid-cols-2">
          {FRAMEWORKS.map((f, i) => (
            <Reveal key={f.name} delay={(i % 2) * 60}>
              <article className="h-full bg-ink p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1rem] leading-snug text-fg">{f.name}</h3>
                  <span
                    className="num shrink-0 text-[0.6875rem]"
                    style={{ color: f.hex }}
                  >
                    {f.current}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-[6.5rem_1fr] gap-y-1.5">
                  <dt className="label">First issued</dt>
                  <dd className="num text-[0.75rem] text-fg-3">{f.since}</dd>
                  <dt className="label">Thresholds</dt>
                  <dd className="num text-[0.75rem] text-fg-3">{f.thresholds}</dd>
                  <dt className="label">Binds</dt>
                  <dd
                    className="num text-[0.75rem]"
                    style={{
                      color: f.binds.startsWith("Binding")
                        ? "var(--color-mint)"
                        : "var(--color-rose)",
                    }}
                  >
                    {f.binds}
                  </dd>
                </dl>

                <p className="mt-4 border-t border-rule pt-3.5 text-[0.8125rem] leading-relaxed text-fg-3">
                  {f.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* timeline */}
      <section className="mt-24">
        <SectionHead
          index="06.2"
          eyebrow="The record"
          title={
            <>
              {yearMax - yearMin} years,
              <br />
              <span className="italic text-fg-3">counted properly.</span>
            </>
          }
          lede="Research results and policy instruments interleaved, because they are not separate stories. The capability result that broke behavioural safety training shipped in the same month as the framework that was supposed to catch it."
        />

        <ol className="relative border-l border-rule pl-0">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year + t.title} delay={(i % 3) * 50} as="li">
              <div className="relative pb-8 pl-8 last:pb-0">
                <span
                  className="absolute top-1.5 -left-[5px] h-[9px] w-[9px]"
                  style={{
                    background:
                      t.kind === "policy"
                        ? "var(--color-L6)"
                        : t.kind === "framework"
                          ? "var(--color-L4)"
                          : "var(--color-L3)",
                  }}
                  aria-hidden
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="num text-[0.75rem] text-fg-3">{t.date}</span>
                  <span className="num text-[0.625rem] tracking-widest uppercase text-fg-4">
                    {t.kind}
                  </span>
                </div>
                <h3 className="mt-1 text-[1rem] leading-snug text-fg">{t.title}</h3>
                <p className="mt-1.5 max-w-3xl text-[0.8125rem] leading-relaxed text-fg-3">
                  {t.body}
                </p>
                {t.url ? (
                  <div className="mt-2">
                    <Cite source="source" url={t.url} />
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* critique */}
      <section className="mt-24">
        <Panel title="The published critiques — and why they matter">
          <div className="grid gap-6 lg:grid-cols-3">
            <Critique
              title="Framework quality is not high"
              body="METR surveyed twelve frontier AI safety policies in March 2025. Most providers scored below 50% across its criteria. DeepMind scored only 10% on quantifiability, for defining CCLs as levels of “heightened risk of severe harm” without defining those terms; only two providers scored above 0% on quantitative containment criteria, one of which references RAND security levels."
              cite="METR — Common Elements of Frontier AI Safety Policies, Mar 2025"
              accent="var(--color-amber)"
            />
            <Critique
              title="The override clause"
              body="An affordance-theory analysis of the Preparedness Framework found that it requests evaluation of only three of the twenty-four categories in the MIT AI Risk Repository; encourages deployment of systems with Medium capabilities for severe harm (defined by OpenAI as >1000 deaths or >$100B); and permits the CEO to deploy even more dangerous capabilities despite Safety Advisory Group recommendations."
              cite="Coggins et al., arXiv:2509.24394, Sep 2025"
              accent="var(--color-rose)"
            />
            <Critique
              title="Voluntary means defection is rational"
              body="Every threshold-setting framework in the field is authored by the party it constrains. A commitment binds only where all significant parties have committed — and a frontier lab facing a non-signatory competitor gains by defection. This is not a flaw in any individual framework; it is a collective-action problem that no individual framework can solve."
              cite="Structural assessment"
              accent="var(--color-violet)"
            />
          </div>

          <div className="mt-6 border-t border-rule pt-5">
            <p className="prose max-w-3xl">
              The honest summary: the governance layer is the most legible and
              the least load-bearing. It is doing real work — the RSP, FSF, and
              Preparedness frameworks are genuinely more rigorous than nothing,
              and the EU AI Act creates a statutory floor where none existed. But
              every threshold in the field is set by the party it governs, and no
              mechanism currently binds a developer whose competitors are not
              committed. Treating a published framework as a safety property
              rather than as a transparency object is the most common error in
              public discourse about frontier safety.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Critique({
  title,
  body,
  cite,
  accent,
}: {
  title: string;
  body: string;
  cite: string;
  accent: string;
}) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: accent }}>
      <h3 className="text-[0.9375rem] text-fg">{title}</h3>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-3">{body}</p>
      <p className="num mt-2.5 text-[0.6875rem] text-fg-4">{cite}</p>
    </div>
  );
}