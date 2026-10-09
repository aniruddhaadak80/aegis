import Link from "next/link";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Section header — the recurring "instrument panel" masthead                */
/* -------------------------------------------------------------------------- */

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  accent = "var(--color-amber)",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  accent?: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="flex items-center gap-3">
        <span
          className="num text-[0.6875rem] font-medium tracking-widest"
          style={{ color: accent }}
        >
          {index}
        </span>
        <span className="h-px w-8" style={{ background: accent, opacity: 0.4 }} />
        <span className="label">{eyebrow}</span>
      </div>
      <h2 className="display mt-4 max-w-4xl text-[clamp(2rem,5.2vw,3.75rem)] text-fg">
        {title}
      </h2>
      {lede ? (
        <div className="prose mt-5 max-w-2xl text-[0.9375rem]">{lede}</div>
      ) : null}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stat readout                                                             */
/* -------------------------------------------------------------------------- */

export function Stat({
  value,
  unit,
  label,
  sub,
  accent = "var(--color-fg)",
  href,
}: {
  value: string;
  unit?: string;
  label: string;
  sub?: string;
  accent?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex items-baseline gap-1.5">
        <span
          className="num text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none font-medium"
          style={{ color: accent }}
        >
          {value}
        </span>
        {unit ? (
          <span className="num text-[0.75rem] text-fg-3">{unit}</span>
        ) : null}
      </div>
      <p className="mt-2 text-[0.8125rem] leading-snug text-fg-2">{label}</p>
      {sub ? <p className="mt-1 text-[0.75rem] text-fg-4">{sub}</p> : null}
    </>
  );

  const cls =
    "ticked block border-l border-rule pl-4 transition-colors hover:border-rule-2";

  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel                                                                     */
/* -------------------------------------------------------------------------- */

export function Panel({
  title,
  meta,
  children,
  className = "",
}: {
  title?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`frame ticked ${className}`}>
      {title ? (
        <div className="frame-hd">
          <h3 className="label !text-fg-2">{title}</h3>
          {meta ? <span className="num text-[0.6875rem] text-fg-4">{meta}</span> : null}
        </div>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Efficacy bar with confidence interval                                     */
/* -------------------------------------------------------------------------- */

export function EfficacyBar({
  value,
  low,
  high,
  accent,
  showCi = true,
}: {
  value: number;
  low: number;
  high: number;
  accent: string;
  showCi?: boolean;
}) {
  return (
    <div
      className="bar-track"
      role="img"
      aria-label={`Estimated efficacy ${value} percent, plausible range ${low} to ${high} percent`}
    >
      {showCi ? (
        <span
          className="bar-ci"
          style={{ left: `${low}%`, width: `${Math.max(0, high - low)}%` }}
        />
      ) : null}
      <span
        className="bar-fill"
        style={{ width: `${value}%`, background: accent }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TRL pips                                                                  */
/* -------------------------------------------------------------------------- */

export function TRLPips({ level, accent }: { level: number; accent: string }) {
  return (
    <span className="flex items-center gap-[3px]" aria-label={`TRL ${level} of 9`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className="h-2.5 w-[2px]"
          style={{
            background: i < level ? accent : "var(--color-rule-2)",
            opacity: i < level ? 0.85 : 1,
          }}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cost ticks                                                                */
/* -------------------------------------------------------------------------- */

export function CostTicks({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Relative cost ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rotate-45"
          style={{
            background: i < level ? "var(--color-fg-3)" : "var(--color-rule-2)",
          }}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Citation                                                                  */
/* -------------------------------------------------------------------------- */

export function Cite({
  source,
  url,
  date,
}: {
  source: string;
  url?: string;
  date?: string;
}) {
  const body = (
    <>
      <span>{source}</span>
      {date ? <span className="text-fg-4"> · {date}</span> : null}
    </>
  );
  return (
    <span className="num text-[0.6875rem] leading-relaxed text-fg-4">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-rule-2 underline-offset-2 transition-colors hover:text-fg-2 hover:decoration-fg-4"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Kind badge                                                                */
/* -------------------------------------------------------------------------- */

const KIND_STYLE: Record<string, { label: string; color: string }> = {
  measurement: { label: "Measured", color: "var(--color-mint)" },
  survey: { label: "Survey", color: "var(--color-cyan)" },
  forecast: { label: "Forecast", color: "var(--color-amber)" },
  estimate: { label: "Estimate", color: "var(--color-violet)" },
  author: { label: "Author", color: "var(--color-violet)" },
};

export function KindBadge({ kind }: { kind: string }) {
  const s = KIND_STYLE[kind] ?? KIND_STYLE.estimate;
  return (
    <span
      className="num inline-flex items-center gap-1.5 border px-1.5 py-0.5 text-[0.625rem] tracking-wide uppercase"
      style={{ borderColor: `${s.color}44`, color: s.color }}
    >
      <span
        className="h-1 w-1"
        style={{ background: s.color }}
        aria-hidden
      />
      {s.label}
    </span>
  );
}