import type { Metadata } from "next";
import Link from "next/link";
import { Panel, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Methodology — How These Numbers Were Made",
  description:
    "The provenance rules behind every figure in AEGIS: what is measured, what is surveyed, what is forecast, and what is an editorial estimate — and exactly how the estimates were produced.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-[var(--shell-pad)] py-14 md:py-20">
      <SectionHead
        index="07"
        eyebrow="Methodology"
        title={
          <>
            How these numbers
            <br />
            <span className="italic text-fg-3">were made.</span>
          </>
        }
        lede={
          <>
            Most pages about AI risk blur measured quantities with asserted ones.
            This page is the rulebook that prevents that here — including an
            honest description of the least rigorous thing on the site.
          </>
        }
      />

      <div className="prose space-y-4">
        <p>
          Every quantitative claim in AEGIS carries one of four provenance
          labels, and the label is displayed next to the number rather than in a
          footnote.
        </p>
      </div>

      <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2">
        <Provenance
          label="Measured"
          color="var(--color-mint)"
          body="A quantity computed from experimental data by the cited authors and published. Capability doubling times, control-evaluation safety rates, misalignment rates on a stated evaluation battery."
          rule="The number must be reproducible from the cited paper. Where a result depends on a particular evaluation set, the dependence is stated."
        />
        <Provenance
          label="Survey"
          color="var(--color-cyan)"
          body="A distribution reported by a population of self-selected experts. AI Impacts ESPAI is the largest such instrument: 2,778 authors at six top venues."
          rule="Both mean and median are reported, because they differ by a factor of three here and reporting only one would misrepresent the distribution."
        />
        <Provenance
          label="Forecast"
          color="var(--color-amber)"
          body="A prediction-market or forecasting-platform aggregate. Metaculus questions are continuously updated by forecasters and carry resolution criteria."
          rule="The interquartile range is reported alongside the median. A single median from a twelve-year IQR is not a useful number on its own."
        />
        <Provenance
          label="Estimate"
          color="var(--color-violet)"
          body="An attributed judgement by a named individual. Hinton's 10–20%, Ord's ~1/6, Amodei's ~25%."
          rule="Attributed to a person and a date, with the horizon stated. An existential-risk figure without a time horizon is not a claim."
        />
      </div>

      <section className="mt-16">
        <SectionHead
          index="07.1"
          eyebrow="The least rigorous thing here"
          title={
            <>
              Efficacy numbers are
              <br />
              <span className="italic text-fg-3">editorial judgement.</span>
            </>
          }
          lede={
            <>
              This is the part most likely to be quoted out of context, so here
              is exactly how it was produced.
            </>
          }
        />

        <div className="prose space-y-4">
          <p>
            The per-technique efficacy figures — the percentage bars in the
            atlas, the q values in the PRA engine — are{" "}
            <strong className="text-fg">not measurements</strong>. There is no
            published dataset measuring &ldquo;probability that RLHF, deployed
            as a single barrier, prevents a specified catastrophic
            misalignment event&rdquo;. That quantity does not exist. It cannot be
            measured without defining the event precisely enough to count it,
            which nobody has done.
          </p>
          <p>
            What the number means instead: for a specified reference event — a
            model with the capability to cause severe autonomous harm, operating
            without the sustained human oversight its developers intend — the
            probability that this technique, deployed alone as the only barrier,
            stops that outcome. That is a well-posed question, and the answer is
            a judgement, not a measurement.
          </p>
          <p>
            The procedure was: read the primary literature on each technique,
            take any reported empirical failure rate at face value, note the
            capability level at which the result was obtained, and discount for
            the gap between that level and frontier capability. Where a technique
            has a published result — AI-control protocols, Sleeper Agents,
            emergent misalignment rates — the resulting number is anchored to it
            directly. Where nothing exists — corrigibility, formal verification
            at scale, safety cases — the estimate is much lower and its
            confidence label is &ldquo;low&rdquo;.
          </p>
          <p>
            The confidence intervals are wide on purpose. They are not derived
            from a statistical model of my uncertainty; they are a statement that
            the underlying evidence genuinely supports a range this broad. Any
            number here that falls outside its own interval should be treated as
            a bug in the source data, not as an insight.
          </p>
        </div>

        <div className="mt-6 border-l-2 border-amber/40 bg-amber/5 p-4">
          <p className="label" style={{ color: "var(--color-amber)" }}>
            The most important caveat
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-2">
            Efficacy figures are not additive and are not independent. Four
            techniques at 40% each do not yield a 160% barrier — they yield
            1 − 0.6⁴ ≈ 87% stack reliability under an independence assumption
            that almost certainly does not hold. The PRA engine on the{" "}
            <Link href="/risk" className="text-amber underline decoration-amber/30 underline-offset-3">
              engine page
            </Link>{" "}
            exists precisely to make that correction visible rather than to hide
            it.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          index="07.2"
          eyebrow="Citation discipline"
          title={
            <>
              What I checked,
              <br />
              <span className="italic text-fg-3">and what I did not.</span>
            </>
          }
        />

        <div className="prose space-y-4">
          <p>
            Citations in the atlas were checked against arXiv abstracts, PMLR,
            and the publishing organisation&apos;s own pages. Where a paper could
            not be verified, the entry is flagged{" "}
            <span className="num text-amber">citation unverified</span> — which
            currently applies to two entries: market making and post-incident
            forensics, where the underlying programme is real but the specific
            venue is not one I could confirm.
          </p>
          <p>
            Numbers quoted from papers are quoted with the caveat the authors
            themselves attach. METR&apos;s ~3-month doubling time on 2024-only
            data is reported with METR&apos;s own statement that it is not robust
            to extrapolation. The AI Control safety figures are reported from the
            ICML paper&apos;s own tables, including the unflattering 15%-safety
            result for upfront auditing, because the unflattering results are
            the informative ones.
          </p>
          <p>
            Live forecast values — Metaculus medians in particular — change
            continuously. The values shown were read on the dates stated. Treat
            them as a snapshot with a timestamp, which is the only honest form
            for a continuously-updated number.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <Panel title="The structural claims, and their basis">
          <div className="prose space-y-4">
            <p>
              A few claims here are structural rather than empirical — they are
              about how mathematics behaves, not about how the world behaves.
              They are listed separately because they carry different
              epistemology.
            </p>
          </div>

          <div className="mt-5 divide-y divide-rule border-y border-rule">
            <Structural
              claim="Imperfect independent barriers compose multiplicatively, not additively."
              basis="Follows from the product rule for independent events. This is the defining property of a series system and is the reason defence in depth works at all."
            />
            <Structural
              claim="In any defence-in-depth stack, one barrier dominates the risk."
              basis="Follows from the series-reliability formula: the barrier with the highest q contributes the largest term to the product. Never a tie."
            />
            <Structural
              claim="Redundancy cannot defeat common-cause failure."
              basis="Definition. If the failure cause is shared, independent instances fail together. The β-factor model exists to make the size of that effect explicit."
            />
            <Structural
              claim="Marginal returns to additional barriers diminish sharply."
              basis="Follows from the product form. The second barrier is worth much more than the tenth, and the fortieth is worth rounding error."
            />
            <Structural
              claim="Compute thresholds decouple from capability as algorithmic efficiency improves."
              basis="Jensen's inequality. The regulation constrains FLOP; capability is a function of FLOP and efficiency. The gap only ever widens."
            />
          </div>
        </Panel>
      </section>

      <section className="mt-16">
        <SectionHead
          index="07.3"
          eyebrow="Corrections"
          title={
            <>
              Found something
              <br />
              <span className="italic text-fg-3">wrong?</span>
            </>
          }
        />
        <div className="prose">
          <p>
            Every figure here has a source you can check, and some of them will
            be wrong — either because I misread a paper, or because a
            continuously-updated forecast moved after I read it. Corrections are
            welcome and will be attributed. The{" "}
            <a
              href="https://arxiv.org/abs/2401.02843"
              target="_blank"
              rel="noreferrer noopener"
              className="text-amber underline decoration-amber/30 underline-offset-3"
            >
              primary sources
            </a>{" "}
            are linked from every number on this site for exactly that reason.
          </p>
        </div>

        <div className="mt-8 border-t border-rule pt-6">
          <p className="label">Core sources used throughout</p>
          <ul className="mt-3 grid gap-1.5 text-[0.75rem] text-fg-4 sm:grid-cols-2">
            {[
              ["AI Impacts — Thousands of AI Authors (arXiv:2401.02843)", "https://arxiv.org/abs/2401.02843"],
              ["METR — Measuring AI Ability to Complete Long Tasks (arXiv:2503.14499)", "https://arxiv.org/abs/2503.14499"],
              ["Epoch AI — notable models dataset and trend analyses", "https://epoch.ai/"],
              ["Hubinger et al. — Sleeper Agents (arXiv:2401.05566)", "https://arxiv.org/abs/2401.05566"],
              ["Lynch et al. — Agentic Misalignment (arXiv:2510.05179)", "https://arxiv.org/abs/2510.05179"],
              ["Greenblatt et al. — AI Control, ICML 2024 (arXiv:2312.06942)", "https://arxiv.org/abs/2312.06942"],
              ["Betley et al. — Emergent Misalignment, ICML 2025 (arXiv:2502.17424)", "https://arxiv.org/abs/2502.17424"],
              ["Amodei et al. — Concrete Problems in AI Safety (arXiv:1606.06565)", "https://arxiv.org/abs/1606.06565"],
              ["Hadfield-Menell et al. — The Off-Switch Game (arXiv:1611.08219)", "https://arxiv.org/abs/1611.08219"],
              ["Shah et al. — Goal Misgeneralization, ICML 2022 (arXiv:2210.01790)", "https://arxiv.org/abs/2210.01790"],
              ["Clymer et al. — Safety Cases (arXiv:2403.10462)", "https://arxiv.org/abs/2403.10462"],
              ["METR — Common Elements of Frontier AI Safety Policies", "https://metr.org/assets/common-elements-mar-2025.pdf"],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline decoration-rule-2 underline-offset-2 transition-colors hover:text-fg-2"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Provenance({
  label,
  color,
  body,
  rule,
}: {
  label: string;
  color: string;
  body: string;
  rule: string;
}) {
  return (
    <article className="bg-ink p-5">
      <span
        className="num inline-flex items-center gap-1.5 border px-1.5 py-0.5 text-[0.625rem] tracking-wide uppercase"
        style={{ borderColor: `${color}44`, color }}
      >
        <span className="h-1 w-1" style={{ background: color }} aria-hidden />
        {label}
      </span>
      <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-2">{body}</p>
      <p className="mt-3 border-t border-rule pt-2.5 text-[0.75rem] leading-relaxed text-fg-4">
        <span className="text-fg-3">Rule:</span> {rule}
      </p>
    </article>
  );
}

function Structural({
  claim,
  basis,
}: {
  claim: string;
  basis: string;
}) {
  return (
    <div className="py-3.5">
      <p className="text-[0.875rem] text-fg">{claim}</p>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-3">{basis}</p>
    </div>
  );
}