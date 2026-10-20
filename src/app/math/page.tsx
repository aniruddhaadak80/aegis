import type { Metadata } from "next";
import { Math } from "@/components/math";
import { Panel, SectionHead } from "@/components/ui";
import { METHODS } from "@/data/methods";

export const metadata: Metadata = {
  title: "The Mathematics",
  description:
    "The complete formula library of AEGIS — probability, PRA, and alignment research — with rendered LaTeX, plain-language readings, and the consequence of each.",
  alternates: { canonical: "/math" },
};

const CORE = [
  {
    group: "Probability of escaping the barrier stack",
    items: [
      {
        name: "Defence in depth",
        latex: String.raw`P_{\text{escape}} = \prod_{i=1}^{n} q_i`,
        read: "The event requires every barrier to fail, so multiply the failures.",
        why: "The most consequential formula on this site. Adding a barrier multiplies risk DOWN — which is the whole point, and the reason a flat AND-stack of weak barriers is still a good architecture.",
      },
      {
        name: "Barrier reliability",
        latex: String.raw`R = 1 - \prod_{i=1}^{n} q_i`,
        read: "The complement — the chance at least one barrier holds.",
        why: "The classic trap: Π(1 − q_i) is P(all barriers WORK), a reliability figure, not a risk figure. It equals the true escape probability only at q = 0.5, which is why the error survives review.",
      },
      {
        name: "Common-cause (β-factor)",
        latex: String.raw`q_{\text{ccf}} = \beta \min_i(q_i), \quad P = P_{\text{indep}} + q_{\text{ccf}} - P_{\text{indep}}\,q_{\text{ccf}}`,
        read: "Some failures are not independent; β is the shared fraction.",
        why: "Sets a hard floor on achievable risk — deployment depth cannot reduce it. Unmeasured for AI safety, and probably the dominant term.",
      },
      {
        name: "Redundancy",
        latex: String.raw`q_{\text{eff}} = q^{n} \qquad PFD_{1oo2} = 3q^{2} - 2q^{3}`,
        read: "n independent copies must all fail; a 1-out-of-2 vote fails on a specific cubic.",
        why: "Cheapest available risk reduction, until qⁿ stops falling quickly — then it stops almost abruptly.",
      },
      {
        name: "Poisson mission unavailability",
        latex: String.raw`Q(t) = 1 - e^{-t/\tau}`,
        read: "Constant failure rate over duration t.",
        why: "The right model for a continuously-running deployment rather than a per-request system.",
      },
    ],
  },
  {
    group: "Importance and prioritisation",
    items: [
      {
        name: "Birnbaum importance",
        latex: String.raw`BI_i = \frac{\partial P_{\text{escape}}}{\partial q_i} = \prod_{j\neq i} q_j`,
        read: "The probability everything else fails — the rate at which escape responds to this barrier's q.",
        why: "The weakest link always scores highest, which is the weakest-link principle stated formally. A sensitivity measure, so blind to whether the barrier is actually exercised.",
      },
      {
        name: "Fussell–Vesely importance",
        latex: String.raw`FV_i = \frac{(1-q_i)\prod_{j\neq i} q_j}{\sum_j (1-q_j)\prod_{k\neq j} q_k}`,
        read: "Of all deployments saved by at least one barrier, the share saved by this one alone.",
        why: "Sums to exactly one, so it is a clean apportionment of 'who actually caught it'. High FV means this barrier routinely carries the stack.",
      },
      {
        name: "Risk Achievement Worth",
        latex: String.raw`RAW_i = \frac{1}{1 - \prod_{j \neq i} q_j}`,
        read: "How many times likelier the escape is if this barrier can fail at all.",
        why: "RAW climbs as a stack deepens, because the product of the others shrinks. In a mature stack no component is expendable — the useful and unwelcome result.",
      },
      {
        name: "Risk Reduction Worth",
        latex: String.raw`RRW_i = 1 - q_i`,
        read: "The fraction of escape probability attributable to this barrier.",
        why: "Read it as 'this barrier does a q-fraction of the blocking work'. It falls toward zero as a stack deepens, which is exactly when safety programmes get tempted to cut a component.",
      },
      {
        name: "Cost-effectiveness",
        latex: String.raw`\eta_i = \frac{P_{\text{escape}}(-i) - P_{\text{escape}}}{\text{cost}_i}`,
        read: "Risk removed per unit of deployment cost.",
        why: "Turning safety engineering into an ordinary budget allocation problem, which is how it gets funded.",
      },
    ],
  },
  {
    group: "Inference and uncertainty",
    items: [
      {
        name: "Bayes' theorem",
        latex: String.raw`p(H\mid E) = \frac{p(E\mid H)\,p(H)}{\sum_{H'} p(E\mid H')\,p(H')}`,
        read: "Posterior from prior and likelihood ratio.",
        why: "The correct update rule for a barrier's estimated failure rate once real evaluation data exists.",
      },
      {
        name: "Log-odds form",
        latex: String.raw`\log\frac{p(H\mid E)}{p(\neg H\mid E)} = \log\frac{p(H)}{p(\neg H)} + \log\frac{p(E\mid H)}{p(E\mid \neg H)}`,
        read: "Evidence updates odds additively.",
        why: "The form that makes Bayesian updating tractable, and the form in which the contested quantity — the likelihood ratio — is isolated.",
      },
      {
        name: "Dempster–Shafer belief & plausibility",
        latex: String.raw`\underline{\text{Bel}}(A)=\sum_{B\subseteq A}m(B), \qquad \overline{\text{Plau}}(A)=\sum_{B\cap A\neq\emptyset}m(B)`,
        read: "Bounds rather than a number when you cannot supply one.",
        why: "The correct tool for the β term. Nobody can probability-judge AI safety's common-cause failure rate; bounds are constructible where a number is not.",
      },
      {
        name: "Expected loss",
        latex: String.raw`\mathbb{E}[L] = \sum_i p_i\,L_i`,
        read: "Probability-weighted sum of outcomes.",
        why: "Collapses every safety argument into a single ordering once consequences are expressed in common units.",
      },
    ],
  },
];

export default function MathPage() {
  const methodFormulae = METHODS.filter((m) => m.latex);

  return (
    <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-14 md:py-20">
      <SectionHead
        index="05"
        eyebrow="Formula library"
        title={
          <>
            The mathematics,
            <br />
            <span className="italic text-fg-3">and what it costs you.</span>
          </>
        }
        lede={
          <>
            Twenty-two formulas across probability, probabilistic risk
            assessment, and the alignment literature. Each is rendered, read in
            plain language, and — more importantly — annotated with what it
            actually implies for building a safety case. A formula without a
            consequence is decoration.
          </>
        }
      />

      <div className="space-y-16">
        {CORE.map((group, gi) => (
          <section key={group.group}>
            <div className="mb-6 flex items-center gap-3">
              <span className="num text-[0.6875rem] tracking-widest text-amber">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-amber/40" aria-hidden />
              <h2 className="text-[1.125rem] text-fg">{group.group}</h2>
            </div>

            <div className="grid gap-px border border-rule bg-rule lg:grid-cols-2">
              {group.items.map((f) => (
                <article key={f.name} className="bg-ink p-5 sm:p-6">
                  <h3 className="text-[0.9375rem] text-fg">{f.name}</h3>
                  <div className="my-4 overflow-x-auto border-y border-rule bg-ink-2 px-3 py-1">
                    <Math tex={f.latex} display />
                  </div>
                  <p className="text-[0.8125rem] leading-relaxed text-fg-2">
                    {f.read}
                  </p>
                  <div className="mt-3.5 border-l-2 border-amber/40 pl-3">
                    <p className="label" style={{ color: "var(--color-amber)" }}>
                      Consequence
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-3">
                      {f.why}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* alignment research formulae */}
      <section className="mt-20">
        <SectionHead
          index="05.4"
          eyebrow="From the alignment literature"
          title={
            <>
              The research
              <br />
              <span className="italic text-fg-3">objectives themselves.</span>
              </>
            }
          lede={
            <>
              The governing objective for each technique, taken from the paper
              that introduced it. These are the things people are actually trying
              to optimise — and reading them together makes the shared weakness
              visible: nearly all of them are proxies, and every one of them can
              in principle be gamed.
            </>
          }
        />

        <div className="grid gap-px border border-rule bg-rule xl:grid-cols-2">
          {methodFormulae.map((m) => (
            <article key={m.id} className="bg-ink p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[0.875rem] text-fg">{m.name}</h3>
                <span className="num shrink-0 text-[0.6875rem] text-fg-4">
                  {m.venue.split(" ")[0]} {m.year}
                </span>
              </div>
              <div className="my-3 overflow-x-auto border border-rule bg-ink-2 px-3">
                <Math tex={m.latex} display />
              </div>
              <p className="text-[0.75rem] leading-relaxed text-fg-3">
                {m.formulaNote}
              </p>
              {m.url ? (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="num mt-2.5 inline-block text-[0.6875rem] text-amber underline decoration-amber/30 underline-offset-3 hover:decoration-amber"
                >
                  source ↗
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <Panel title="The shared structural weakness">
          <div className="prose max-w-3xl space-y-4">
            <p>
              Read the alignment objectives together and a pattern emerges that
              is worth stating plainly, because it is the honest summary of two
              decades of work on the specification layer.
            </p>
            <p>
              Nearly every one is a proxy. RLHF optimises a learned reward model.
              Constitutional AI optimises adherence to a written constitution.
              CIRL optimises an inferred human reward function. Debate optimises
              a judge&apos;s discrimination. Scalable oversight optimises a
              recursive approximation to something humans would have said.
              Every one of them stands between the training objective and the
              thing we actually want.
            </p>
            <p>
              This is not an argument that the work failed — Gao, Schulman and
              Hilton measured exactly this divergence in 2022 and found it
              behaves like a regular, predictable phenomenon rather than a bug.
              It is an argument about where the remaining leverage is. The
              specification layer has been optimised hard for a decade and its
              failures are now well-characterised. The layers that could remove
              the proxy relationship entirely — causal interpretability,
              verification, independent governance — have had a fraction of the
              attention.
            </p>
            <p>
              That is the real argument for defence in depth, and it is stronger
              than the version usually given. Not &ldquo;many layers are safer
              than one&rdquo; — which is true but banal — but{" "}
              <em>
                every layer reduces reliance on a single proxy being correct
              </em>
              . No single mathematical object stands between the training signal
              and the thing we care about. Several unrelated, differently-wrong
              ones do.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}