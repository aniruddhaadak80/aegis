import type { Metadata } from "next";
import { LAYERS } from "@/data/layers";
import { METHODS } from "@/data/methods";
import { Math } from "@/components/math";
import { Cite, EfficacyBar, Panel, SectionHead, TRLPips } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "The Stack — Seven Layers of Control",
  description:
    "Specification, training, interpretability, containment, verification, governance, and recovery. Every control technique in the literature, placed by where in the lifecycle it acts.",
};

export default function StackPage() {
  return (
    <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-14 md:py-20">
      <SectionHead
        index="02"
        eyebrow="The control stack"
        title={
          <>
            Seven layers, ordered
            <br />
            <span className="italic text-fg-3">by when they act.</span>
          </>
        }
        lede={
          <>
            A control that acts before the weights exist is cheap and fragile. A
            control that acts after deployment is expensive and unconditional.
            Ordering the layers this way exposes the central engineering trade-off
            in AI safety: cheap controls are early and easy to evade; durable
            controls are late and cap what the system can do.
          </>
        }
      />

      {/* layer index */}
      <nav className="mb-16 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {LAYERS.map((l) => {
          const count = METHODS.filter((m) => m.layer === l.id).length;
          return (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="group flex items-baseline gap-3 bg-ink px-4 py-3 transition-colors hover:bg-ink-3"
            >
              <span
                className="num text-[0.6875rem] tracking-widest"
                style={{ color: l.hex }}
              >
                L{l.index}
              </span>
              <span className="text-[0.8125rem] text-fg-2 group-hover:text-fg">
                {l.name}
              </span>
              <span className="num ml-auto text-[0.6875rem] text-fg-4">{count}</span>
            </a>
          );
        })}
      </nav>

      <div className="space-y-24 md:space-y-32">
        {LAYERS.map((layer) => {
          const methods = METHODS.filter((m) => m.layer === layer.id);
          return (
            <section key={layer.id} id={layer.id} className="scroll-mt-20">
              <header className="grid gap-6 border-b-2 pb-6 lg:grid-cols-[1fr_1fr] lg:gap-12"
                style={{ borderColor: layer.hex }}>
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="num text-[0.75rem] tracking-[0.2em]"
                      style={{ color: layer.hex }}
                    >
                      LAYER {layer.index}
                    </span>
                    <span className="num text-[0.6875rem] text-fg-4">
                      {methods.length} methods
                    </span>
                  </div>
                  <h2 className="display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] text-fg">
                    {layer.name}
                  </h2>
                  <p className="mt-1 text-[0.875rem]" style={{ color: layer.hex }}>
                    {layer.tagline}
                  </p>
                  <p className="num mt-4 max-w-md text-[0.75rem] leading-relaxed text-fg-4">
                    <span className="text-fg-3">Acts:</span> {layer.acts}
                    <br />
                    <span className="text-fg-3">Question:</span> {layer.question}
                  </p>
                </div>
                <p className="prose lg:pt-8">{layer.blurb}</p>
              </header>

              {/* dependency graph */}
              <DependencyGraph layer={layer.id} hex={layer.hex} />

              <div className="mt-10 grid gap-px border border-rule bg-rule lg:grid-cols-2">
                {methods.map((m, i) => (
                  <Reveal key={m.id} delay={(i % 2) * 60}>
                    <MethodCard method={m} hex={layer.hex} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-28">
        <Panel title="Why the ordering matters">
          <div className="prose max-w-3xl space-y-4">
            <p>
              Notice where the strong, mature controls sit. Sandboxing is TRL 9
              and near-free. Formal verification is TRL 4 and enormously expensive.
              RLHF is TRL 8 with a 34% estimated single-barrier efficacy.
              Interpretability, the layer that could in principle give the others
              actual evidence about internals, sits at TRL 4–6 with the lowest
              validated numbers in the field.
            </p>
            <p>
              The mature layers constrain <em>reach</em>. The immature layers
              constrain <em>intent</em>. Everything we can currently do reliably is
              about keeping the system from touching things; almost nothing we can
              do reliably is about establishing what it wants. That asymmetry is
              the defining structural weakness of the field as of now, and no
              amount of deployment discipline closes it.
            </p>
            <p>
              It also explains the governance fight. Every lab prefers early,
              cheap controls — specification and training — precisely because
              those are the layers it owns. The layers that bind hardest —
              verification, governance, recovery — are the ones it does not.
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function DependencyGraph({ layer, hex }: { layer: string; hex: string }) {
  const methods = METHODS.filter((m) => m.layer === layer);
  const withDeps = methods.filter((m) =>
    m.dependsOn.some((d) =>
      METHODS.some(
        (other) => other.id === d && METHODS.find((x) => x.id === other.id)?.layer === layer,
      ),
    ),
  );

  if (!withDeps.length) {
    return (
      <div className="mt-5 flex items-center gap-3 border border-dashed border-rule-2 px-4 py-3">
        <span
          className="h-1.5 w-1.5 shrink-0"
          style={{ background: hex, opacity: 0.5 }}
          aria-hidden
        />
        <p className="text-[0.75rem] text-fg-4">
          No intra-layer dependencies — this layer&apos;s techniques stand
          independently of each other, which is a genuine asset when you are
          trying to get independent failure modes.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 border border-rule p-4">
      <p className="label">Intra-layer dependency edges</p>
      <ul className="mt-3 space-y-1.5">
        {withDeps.map((m) => {
          const deps = m.dependsOn.filter((d) =>
            METHODS.some(
              (o) => o.id === d && METHODS.find((x) => x.id === o.id)?.layer === layer,
            ),
          );
          return (
            <li key={m.id} className="flex flex-wrap items-baseline gap-2 text-[0.75rem]">
              <span className="text-fg-2">{m.name}</span>
              <span className="num text-fg-4">requires</span>
              {deps.map((d) => (
                <span key={d} className="text-fg-3">
                  {METHODS.find((x) => x.id === d)?.name ?? d}
                </span>
              ))}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 border-t border-rule pt-2.5 text-[0.6875rem] leading-relaxed text-fg-4">
        Dependencies inside a layer are correlated-failure risk. Methods that
        require each other are not independent barriers, no matter how they are
        counted.
      </p>
    </div>
  );
}

function MethodCard({ method, hex }: { method: (typeof METHODS)[number]; hex: string }) {
  return (
    <article className="flex h-full flex-col bg-ink p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.0625rem] leading-snug text-fg">{method.name}</h3>
        <span className="num shrink-0 text-[0.6875rem] text-fg-4">
          {method.year}
        </span>
      </div>

      <p className="mt-1 text-[0.75rem] text-fg-4">
        {method.authors.length > 70
          ? `${method.authors.slice(0, 68)}…`
          : method.authors}
      </p>

      <p className="mt-3.5 text-[0.875rem] leading-relaxed text-fg-2">
        {method.summary}
      </p>

      {/* efficacy */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="label">Single-barrier efficacy</span>
          <span className="num text-[0.9375rem]" style={{ color: hex }}>
            {method.efficacy}%
          </span>
        </div>
        <div className="mt-2">
          <EfficacyBar
            value={method.efficacy}
            low={method.efficacyLow}
            high={method.efficacyHigh}
            accent={hex}
          />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="num text-[0.625rem] text-fg-4">
            plausible range {method.efficacyLow}–{method.efficacyHigh}%
          </span>
          <span className="num text-[0.625rem] text-fg-4">
            confidence: {method.confidence}
          </span>
        </div>
      </div>

      {/* mechanism + formula */}
      <div className="mt-4 space-y-3">
        <div>
          <p className="label">Mechanism</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-3">
            {method.mechanism}
          </p>
        </div>

        {method.latex ? (
          <div className="overflow-x-auto border border-rule bg-ink-2 px-3">
            <Math tex={method.latex} display />
          </div>
        ) : null}

        <p className="text-[0.75rem] leading-relaxed text-fg-4">
          {method.formulaNote}
        </p>
      </div>

      {/* evidence */}
      {method.evidence ? (
        <div
          className="mt-4 border-l-2 pl-3"
          style={{ borderColor: `${hex}66` }}
        >
          <p className="label" style={{ color: hex }}>
            Measured
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-2">
            {method.evidence}
          </p>
        </div>
      ) : null}

      {/* failure modes */}
      <div className="mt-4">
        <p className="label">Known failure modes</p>
        <ul className="mt-1.5 space-y-1">
          {method.failureModes.slice(0, 4).map((f) => (
            <li
              key={f}
              className="flex gap-2 text-[0.75rem] leading-relaxed text-fg-3"
            >
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 bg-rose/70" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* meta */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-3.5">
        <span className="flex items-center gap-2">
          <span className="label">TRL</span>
          <TRLPips level={method.trl} accent={hex} />
        </span>
        <span className="num text-[0.6875rem] text-fg-4">
          cost {method.cost}/5
        </span>
        <span className="num text-[0.6875rem] text-fg-4">
          verdict: {method.latency}
        </span>
        <span className="ml-auto">
          <Cite
            source={method.venue}
            url={method.url}
            date={method.verified ? undefined : "citation unverified"}
          />
        </span>
      </div>
    </article>
  );
}