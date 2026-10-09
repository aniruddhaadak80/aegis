import Link from "next/link";
import { NAV } from "./site-nav";

export function SiteFooter() {
  return (
    <footer className="relative z-1 mt-32 border-t border-rule bg-ink-2">
      <div className="mx-auto max-w-[100rem] px-[var(--shell-pad)] py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-md">
            <p className="display text-2xl text-fg">AEGIS</p>
            <p className="prose mt-3 text-[0.8125rem] leading-relaxed">
              An instrument for reasoning about superintelligence risk, assembled
              from the primary literature. Efficacy figures are calibrated
              editorial estimates, not measurements — they are labelled as such
              because the distinction is the whole point.
            </p>
          </div>

          <div>
            <p className="label">Sections</p>
            <ul className="mt-3 space-y-1.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-[0.8125rem] text-fg-3 transition-colors hover:text-fg"
                  >
                    {n.index} — {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/methodology"
                  className="text-[0.8125rem] text-fg-3 transition-colors hover:text-fg"
                >
                  — Methodology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label">Primary sources</p>
            <ul className="mt-3 space-y-1.5">
              {[
                ["AI Impacts — ESPAI", "https://arxiv.org/abs/2401.02843"],
                ["METR — task horizons", "https://arxiv.org/abs/2503.14499"],
                ["Epoch AI — trends", "https://epoch.ai/"],
                ["Sleeper Agents", "https://arxiv.org/abs/2401.05566"],
                ["AI Control (ICML 24)", "https://arxiv.org/abs/2312.06942"],
                ["Agentic Misalignment", "https://arxiv.org/abs/2510.05179"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[0.8125rem] text-fg-3 underline decoration-rule-2 underline-offset-3 transition-colors hover:text-fg hover:decoration-fg-3"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="num text-[0.6875rem] text-fg-4">
            Built for researchers, engineers, and people who need the number.
          </p>
          <p className="num text-[0.6875rem] text-fg-4">
            Not affiliated with any lab or government programme cited.
          </p>
        </div>
      </div>
    </footer>
  );
}