import type { Metadata } from "next";
import { PRAWorkbench } from "@/components/pra-engine";
import { Math } from "@/components/math";
import { Panel, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "PRA Engine — Defence in Depth, Quantified",
  description:
    "A live probabilistic risk assessment for an AI safety case. Model barrier unavailability, common-cause failure, redundancy, and marginal risk reduction per unit cost using the mathematics of IEC 61508 and nuclear PRA.",
  alternates: { canonical: "/risk" },
};

/*
 * A NOTE ON THE FAULT-TREE SHAPE, because getting it wrong is the single
 * easiest way to produce a plausible, meaningless number:
 *
 * Controls do NOT all play the same role, and modelling them as one flat
 * AND-stack is a category error:
 *
 *   • Specification, training and interpretability controls change how likely
 *     a dangerous capability is to arise at all. They discount the initiating
 *     probability: P_arise = P_base · Π(1 − e_i).
 *
 *   • Containment, verification, governance and recovery are runtime barriers.
 *     The event is not contained unless every one of them holds, so they
 *     compose as a series system: P_escape = Π q_i.
 *
 *   CATASTROPHE = P_arise × P_escape
 *
 * This distinction is what lets the engine rank a sparse-autoencoder audit
 * against a sandbox on the same axis — they are not comparable on q or on e,
 * but they are directly comparable on final catastrophe probability removed.
 */

const FORMULAE = [
  {
    id: "series",
    name: "Defence in depth: P(all barriers fail)",
    latex: String.raw`P_{\text{escape}} = \prod_{i=1}^{n} q_i, \qquad R = 1 - \prod_{i=1}^{n} q_i`,
    caption:
      "The defining result. The catastrophic event requires every barrier to fail simultaneously, so the escape probability is the PRODUCT of the unavailabilities — and it falls as barriers are added.",
    consequence:
      "Four barriers at q = 0.60 give P(escape) = 0.6⁴ = 13%. Eight give 1.7%. Sixteen give 0.03%. Note the trap: computing Π(1 − q_i) instead gives 2.6% for the four-barrier case, which is P(all barriers WORK) — a reliability figure, not a risk figure. The two coincide only at q = 0.5, which is exactly why the error is so easy to make.",
    source: "IEC 61508 / ISO 26262; Reason, 1990",
  },
  {
    id: "beta",
    name: "Beta-factor common-cause failure",
    latex: String.raw`q_{\text{ccf}} = \beta \cdot \min_i(q_i), \qquad P_{\text{escape}} = P_{\text{indep}} + q_{\text{ccf}} - P_{\text{indep}}\, q_{\text{ccf}}`,
    caption:
      "Redundancy only defeats independent failures. β is the fraction of failures caused by one shared cause, and it sets a floor that no number of additional barriers touches.",
    consequence:
      "With β = 0.4 and a best barrier at q = 0.3, every configuration carries at least 12% joint failure no matter how deep the stack gets. In AI safety β is dominated by shared blind spots — overlapping teams, shared benchmarks, correlated assumptions about model internals. No published estimate exists.",
    source: "IEC 61508-6 Annex D, 2010",
  },
  {
    id: "birnbaum",
    name: "Birnbaum importance",
    latex: String.raw`BI_i = \frac{\partial P_{\text{escape}}}{\partial q_i} = \prod_{j \neq i} q_j`,
    caption:
      "Sensitivity: the rate at which escape probability responds to this barrier's failure probability. It is the probability that everything ELSE fails.",
    consequence:
      "The weakest barrier always has the highest Birnbaum importance, because when you remove its q from the product you are left with the smallest term. This is the formal statement of the weakest-link principle, and it is why hardening a redundant barrier buys less than hardening the weak one.",
    source: "Birnbaum, 1969",
  },
  {
    id: "fv",
    name: "Fussell–Vesely importance",
    latex: String.raw`FV_i = \frac{(1-q_i)\prod_{j\neq i} q_j}{\sum_j (1-q_j)\prod_{k\neq j} q_k}`,
    caption:
      "Sole-rescuer attribution: of all the cases where the deployment was saved by at least one barrier, the fraction saved by this one alone.",
    consequence:
      "These sum to exactly one, which makes FV a clean apportionment — and the denominator is total rescue probability. A barrier with high FV and a barrier with high Birnbaum are both important, for different reasons: FV says 'this one often carries the stack', Birnbaum says 'the stack is fragile because of this one'.",
    source: "Fussell & Vesely, 1972",
  },
  {
    id: "raw",
    name: "Risk Achievement Worth",
    latex: String.raw`RAW_i = \frac{1}{1 - \prod_{j \neq i} q_j}`,
    caption:
      "How many times more likely the escape is if this barrier can fail at all, versus if it were perfect. Making any single barrier perfect drives P(escape) to zero, so RAW is expressed against the best-case alternative.",
    consequence:
      "RAW grows sharply as a stack gets deep, because the product of the others becomes small. With eight strong barriers every one of them scores highly — which is the correct and important result: in a mature defence-in-depth stack, no individual component is expendable.",
    source: "Standard PRA practice",
  },
  {
    id: "rrw",
    name: "Risk Reduction Worth",
    latex: String.raw`RRW_i = 1 - q_i`,
    caption:
      "The fraction of the escape probability attributable to this barrier. Removing it multiplies the total risk by 1/(1 − RRW).",
    consequence:
      "Read RRW as 'this barrier is doing a q-fraction of the blocking work.' The practical implication is uncomfortable: in a deep stack the marginal value of any single component falls toward zero, which is precisely the moment when a safety organisation becomes tempted to cut it.",
    source: "Standard PRA practice",
  },
  {
    id: "redundancy",
    name: "Redundancy and voting",
    latex: String.raw`q_{\text{eff}} = q^{\,n}, \qquad PFD_{1oo2} = 3q^2 - 2q^3`,
    caption:
      "n identical independent barriers all failing gives qⁿ. The 1oo2 voted system — one of two must work — is the standard safety-integrity primitive.",
    consequence:
      "Doubling the sandbox from q = 0.53 to q = 0.28 buys a lot. Quadrupling it is not worth the compute. Redundancy is the cheapest risk reduction available until qⁿ stops falling fast, and then it stops abruptly.",
    source: "IEC 61508-6; NASA PRA guides",
  },
  {
    id: "poisson",
    name: "Poisson unavailability over a mission time",
    latex: String.raw`Q(t) = 1 - e^{-t/\tau}`,
    caption:
      "When failures arrive at a constant rate rather than per-demand, unavailability over a mission duration t grows exponentially with an effective mean time to failure τ.",
    consequence:
      "The right model for a continuously-running deployment rather than a per-request system. A model that is fine for ten thousand queries can be a different risk story across a million.",
    source: "General reliability theory",
  },
  {
    id: "bayes",
    name: "Bayesian updating of a barrier estimate",
    latex: String.raw`p(H \mid E) = \frac{p(E \mid H)\, p(H)}{p(E \mid H)\, p(H) + p(E \mid \neg H)\, p(\neg H)}`,
    caption:
      "How a barrier's estimated failure rate should move as evaluation evidence accumulates. The likelihood ratio is the part worth arguing about.",
    consequence:
      "This is the correct way to update the q values in the engine once you have real control-evaluation data. Right now they are editorial priors, and the engine is honest about that.",
    source: "Standard inference",
  },
  {
    id: "dempster",
    name: "Dempster–Shafer belief and plausibility",
    latex: String.raw`m(A) + m(A^c) = 1, \qquad \underline{\text{Bel}}(A) \le P(A) \le \overline{\text{Plau}}(A)`,
    caption:
      "When you cannot put a defensible number on a barrier's failure rate, you can at least bound it. Bel is the probability committed to the set; Plau is the probability that could be.",
    consequence:
      "The correct epistemic tool for the β term. Nobody has a defensible probability for the common-cause failure rate of AI safety practice — but bounds are constructible, and bounds are better than nothing.",
    source: "Dempster, 1967; Shafer, 1976",
  },
  {
    id: "expected",
    name: "Expected loss",
    latex: String.raw`\mathbb{E}[L] = \sum_i p_i\, L_i`,
    caption:
      "The decision-theoretic bottom line. Convert everything to a common currency and the engineering arguments collapse into a single ordering.",
    consequence:
      "Whether a barrier is worth deploying reduces to comparing marginal risk reduction against marginal cost. That comparison is the entire discipline, and it is why PRA was invented for nuclear plants rather than for software.",
    source: "Standard decision theory",
  },
];

export default function RiskPage() {
  return (
    <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-14 md:py-20">
      <SectionHead
        index="04"
        eyebrow="PRA engine"
        title={
          <>
            Model a safety case
            <br />
            <span className="italic text-fg-3">instead of asserting one.</span>
          </>
        }
        lede={
          <>
            Nuclear, aerospace and process-safety industries do not argue about
            whether their defences are adequate. They build a fault model, compute
            system unavailability, rank barriers by importance, and allocate budget
            against the ranking. That machinery has never been applied to AI
            safety. This is that machinery, adapted.
          </>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Note
          k="What this is"
          v="A structural model of a defence-in-depth stack. Adjust the barriers and watch which one dominates."
        />
        <Note
          k="What it is not"
          v="A prediction. The q values are calibrated editorial estimates from the literature, not measurements of your system."
        />
        <Note
          k="The hard part"
          v="β — the shared-failure term. It sets the floor. Nobody has measured it for AI safety, and it is likely to be larger than anyone would like."
        />
      </div>

      <PRAWorkbench />

      {/* ---------------- THE MATHEMATICS ---------------- */}
      <section className="mt-24">
        <SectionHead
          index="04.1"
          eyebrow="The mathematics"
          title={
            <>
              Ten formulas, and
              <br />
              <span className="italic text-fg-3">what they cost you.</span>
            </>
          }
          lede="Every formula below is standard PRA practice. What changes is the reading: these were written for components that fail randomly, not for a system that may be trying to defeat them."
        />

        <div className="grid gap-px border border-rule bg-rule lg:grid-cols-2">
          {FORMULAE.map((f, i) => (
            <Reveal key={f.id} delay={(i % 2) * 60}>
              <article className="h-full bg-ink p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[0.9375rem] text-fg">{f.name}</h3>
                  <span className="num text-[0.625rem] text-fg-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="my-4 overflow-x-auto border-y border-rule bg-ink-2 px-3 py-1">
                  <Math tex={f.latex} display />
                </div>

                <p className="text-[0.8125rem] leading-relaxed text-fg-2">
                  {f.caption}
                </p>

                <div className="mt-3.5 border-l-2 border-amber/40 pl-3">
                  <p className="label" style={{ color: "var(--color-amber)" }}>
                    Consequence
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-3">
                    {f.consequence}
                  </p>
                </div>

                <p className="num mt-3.5 text-[0.6875rem] text-fg-4">
                  {f.source}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- THE RESULT ---------------- */}
      <section className="mt-24">
        <Panel title="What the arithmetic actually says">
          <div className="prose max-w-3xl space-y-4">
            <p>
              Deploy every control in the catalogue at its published efficacy
              estimate and read the number off the top of the panel. Then look at
              the scale reference beside it: a nuclear safety-critical channel
              operates around 10⁻⁹, a medical device around 10⁻⁶, aviation flight
              control around 10⁻⁷. The best AI barrier anyone can currently
              justify sits near 10⁻¹.
            </p>
            <p>
              That is a gap of five to eight orders of magnitude, and it is the
              honest summary of the field&apos;s position. Defence in depth works
              exactly as advertised — the product form means each additional
              barrier multiplies residual risk down, and the monotonicity test in
              this engine&apos;s test suite asserts exactly that. What it does not
              do is reach safety. Multiplying 10⁻¹ by itself forty times still
              leaves you at 10⁻⁴, which sounds impressive and is three orders of
              magnitude worse than a reactor.
            </p>
            <p>
              Now raise β, which is the only slider here modelling something
              nobody has measured. If every barrier in your stack was designed by
              overlapping teams, evaluated against shared benchmarks, and rests on
              the same untested assumption about what a language
              model&apos;s internals mean, then a single conceptual error
              propagates through all of them at once — and deployment depth is
              worthless against it. The floor is set by the best barrier in the
              group, which means it is precisely the barrier you have the least
              measurement data for.
            </p>
            <p>
              This is the strongest available argument for interpretive diversity
              over interpretive depth. A stack built from genuinely independent
              assumptions fails more independently than fourteen variations of the
              same assumption. The field has spent a decade adding methods; it
              has spent almost no effort measuring whether they fail together, and
              β — the single term that decides whether the stack is real — has no
              published estimate at all.
            </p>
            <p>
              The final structural point is about what defence in depth is for.
              It does not deliver safety. It delivers{" "}
              <em>independent failure</em>, and independent failure is what makes
              a catastrophic event survivable, investigable, and recoverable.
              That is a lower bar than &ldquo;safe&rdquo; and a far more achievable
              one, which is why it is the right target for the next decade.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Note({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-l border-rule-2 pl-3.5">
      <p className="label">{k}</p>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-3">{v}</p>
    </div>
  );
}