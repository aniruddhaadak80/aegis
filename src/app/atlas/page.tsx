import type { Metadata } from "next";
import { AtlasBrowser } from "@/components/atlas-browser";
import { SectionHead, Stat } from "@/components/ui";
import { METHODS } from "@/data/methods";
import { LAYERS } from "@/data/layers";

export const metadata: Metadata = {
  title: "Atlas — Every Control Technique",
  description:
    "Forty-one AI control techniques across seven layers, with citations, formulae, measured results, failure modes, maturity, cost, and dependency edges. Filterable and sortable.",
  alternates: { canonical: "/atlas" },
};

export default function AtlasPage() {
  const meanEfficacy = Math.round(
    METHODS.reduce((s, m) => s + m.efficacy, 0) / METHODS.length,
  );
  const meanTrl = (
    METHODS.reduce((s, m) => s + m.trl, 0) / METHODS.length
  ).toFixed(1);
  const verified = METHODS.filter((m) => m.verified).length;
  const totalDeps = METHODS.reduce((s, m) => s + m.dependsOn.length, 0);

  return (
    <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-14 md:py-20">
      <SectionHead
        index="03"
        eyebrow="The atlas"
        title={
          <>
            Every technique we have,
            <br />
            <span className="italic text-fg-3">with its receipts.</span>
          </>
        }
        lede={
          <>
            {METHODS.length} techniques spanning specification, training,
            interpretability, containment, verification, governance, and
            recovery. Click any row for the mechanism, the governing formula,
            the measured result where one exists, and the specific ways it is
            known to fail.
          </>
        }
      />

      <div className="mb-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={String(METHODS.length)} label="techniques catalogued" />
        <Stat
          value={`${meanEfficacy}%`}
          label="mean single-barrier efficacy"
          sub="editorial estimate, not measurement"
          accent="var(--color-amber)"
        />
        <Stat value={meanTrl} unit="/ 9" label="mean technology readiness" />
        <Stat
          value={`${verified}/${METHODS.length}`}
          label="citations independently verified"
          accent="var(--color-mint)"
        />
      </div>

      <AtlasBrowser />

      <section className="mt-20 border-t border-rule pt-10">
        <p className="label">Reading the efficacy column</p>
        <div className="mt-3 grid gap-4 text-[0.8125rem] leading-relaxed text-fg-3 md:grid-cols-3">
          <p>
            <span className="text-fg-2">What it is.</span> The estimated
            probability that this method, deployed as a{" "}
            <em>single independent barrier</em> against one specified
            catastrophic misalignment event, actually stops it.
          </p>
          <p>
            <span className="text-fg-2">What it is not.</span> Not a measured
            quantity, and not additive. Two barriers at 40% each do not give 80%
            — they give 64%, and the confidence intervals compound.
          </p>
          <p>
            <span className="text-fg-2">Why it is here anyway.</span> Because
            the field currently has no quantitative basis for prioritisation at
            all. A transparent, contestable estimate is more useful than a
            confident shrug, and the CI column exists so you can disagree with
            it precisely.
          </p>
        </div>

        <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((l) => {
            const c = METHODS.filter((m) => m.layer === l.id).length;
            const e = Math.round(
              METHODS.filter((m) => m.layer === l.id).reduce(
                (s, m) => s + m.efficacy,
                0,
              ) / c,
            );
            const t = (
              METHODS.filter((m) => m.layer === l.id).reduce((s, m) => s + m.trl, 0) / c
            ).toFixed(1);
            return (
              <div key={l.id} className="bg-ink p-4">
                <p
                  className="num text-[0.625rem] tracking-widest uppercase"
                  style={{ color: l.hex }}
                >
                  L{l.index} {l.name}
                </p>
                <div className="mt-2.5 flex items-baseline gap-4">
                  <span className="num text-[0.875rem] text-fg-2">{c} methods</span>
                  <span className="num text-[0.875rem] text-fg-3">{e}% eff.</span>
                  <span className="num text-[0.875rem] text-fg-4">TRL {t}</span>
                </div>
              </div>
            );
          })}
          <div className="hidden bg-ink p-4 lg:block" />
          <div className="bg-ink p-4">
            <p className="label">Dependency edges</p>
            <p className="num mt-2 text-[1.25rem] text-fg-2">{totalDeps}</p>
          </div>
        </div>
      </section>
    </div>
  );
}