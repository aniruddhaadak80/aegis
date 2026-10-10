"use client";

import { useMemo, useState } from "react";
import { LAYERS, LAYER_MAP, type LayerId } from "@/data/layers";
import { METHODS } from "@/data/methods";
import { Math } from "./math";

type SortKey = "efficacy" | "trascore" | "trldesc" | "year" | "cost" | "name";

export function AtlasBrowser() {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<LayerId | "all">("all");
  const [sort, setSort] = useState<SortKey>("efficacy");
  const [open, setOpen] = useState<string | null>("ai-control");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: METHODS.length };
    for (const l of LAYERS) c[l.id] = METHODS.filter((m) => m.layer === l.id).length;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = METHODS.filter((m) => {
      if (layer !== "all" && m.layer !== layer) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.mechanism.toLowerCase().includes(q) ||
        m.authors.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q) ||
        m.failureModes.some((f) => f.toLowerCase().includes(q))
      );
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case "efficacy":
          return b.efficacy - a.efficacy;
        case "trascore":
          return b.trl * b.efficacy - a.trl * a.efficacy;
        case "trldesc":
          return b.trl - a.trl || b.efficacy - a.efficacy;
        case "year":
          return b.year - a.year;
        case "cost":
          return a.cost - b.cost || b.efficacy - a.efficacy;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return { list: out, layerSpread: new Set(out.map((m) => m.layer)).size };
  }, [query, layer, sort]);

  return (
    <div>
      {/* controls */}
      <div className="sticky top-14 z-40 -mx-[var(--shell-pad)] border-y border-rule bg-ink/92 px-[var(--shell-pad)] py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 59 techniques, failure modes, authors…"
              aria-label="Search techniques"
              className="w-full border border-rule-2 bg-ink-2 px-3 py-2 text-[0.8125rem] text-fg placeholder:text-fg-4 focus:border-fg-4 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="label mr-1">Sort</span>
            {(
              [
                ["efficacy", "Efficacy"],
                ["trascore", "TRL × Efficacy"],
                ["trldesc", "Maturity"],
                ["year", "Newest"],
                ["cost", "Cost"],
                ["name", "A–Z"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className="num border px-2 py-1.5 text-[0.6875rem] transition-colors"
                style={{
                  borderColor: sort === k ? "var(--color-amber)" : "var(--color-rule-2)",
                  color: sort === k ? "var(--color-amber)" : "var(--color-fg-4)",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1">
          <LayerChip
            active={layer === "all"}
            onClick={() => setLayer("all")}
            hex="var(--color-fg-3)"
            label="All layers"
            count={counts.all}
          />
          {LAYERS.map((l) => (
            <LayerChip
              key={l.id}
              active={layer === l.id}
              onClick={() => setLayer(l.id)}
              hex={l.hex}
              label={l.name}
              count={counts[l.id]}
            />
          ))}
        </div>
      </div>

      {/* meta */}
      <div className="mt-6 flex items-baseline justify-between border-b border-rule pb-3">
        <p className="num text-[0.75rem] text-fg-3">
          {filtered.list.length} of {METHODS.length} techniques
          {query && (
            <span className="text-fg-4"> · matching “{query}”</span>
          )}
        </p>
        <p className="num text-[0.75rem] text-fg-4">
          across {filtered.layerSpread} of 7 layers ·{" "}
          {filtered.list.reduce((s, m) => s + m.efficacy, 0) / (filtered.list.length || 1) | 0}%
          mean efficacy
        </p>
      </div>

      {/* table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[62rem] border-collapse">
          <thead>
            <tr className="border-b border-rule-2">
              {[
                ["Technique", "text-left"],
                ["Layer", "text-left"],
                ["Efficacy", "text-left w-40"],
                ["CI", "text-left"],
                ["TRL", "text-left"],
                ["Cost", "text-left"],
                ["Verdict", "text-left"],
                ["Year", "text-right pr-0"],
              ].map(([h, cls]) => (
                <th key={h} className={`label px-2 py-2 font-medium ${cls}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.list.map((m) => {
              const l = LAYER_MAP[m.layer];
              const isOpen = open === m.id;
              return (
                <>
                  <tr
                    key={m.id}
                    onClick={() => setOpen(isOpen ? null : m.id)}
                    className="cursor-pointer border-b border-rule transition-colors hover:bg-ink-2"
                  >
                    <td className="px-2 py-2.5 pl-0">
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0"
                          style={{ background: l.hex }}
                          aria-hidden
                        />
                        <span>
                          <span className="block text-[0.875rem] text-fg">
                            {m.name}
                          </span>
                          <span className="num block text-[0.625rem] text-fg-4">
                            {m.authors.length > 52
                              ? `${m.authors.slice(0, 50)}…`
                              : m.authors}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className="num px-2 py-2.5 text-[0.6875rem]" style={{ color: l.hex }}>
                      L{l.index} {l.name}
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="bar-track flex-1">
                          <span
                            className="bar-fill"
                            style={{
                              width: `${m.efficacy}%`,
                              background: l.hex,
                            }}
                          />
                        </div>
                        <span className="num w-8 shrink-0 text-right text-[0.8125rem] text-fg-2">
                          {m.efficacy}
                        </span>
                      </div>
                    </td>
                    <td className="num px-2 py-2.5 text-[0.6875rem] text-fg-4">
                      {m.efficacyLow}–{m.efficacyHigh}
                    </td>
                    <td className="num px-2 py-2.5 text-[0.8125rem] text-fg-2">
                      {m.trl}
                    </td>
                    <td className="num px-2 py-2.5 text-[0.8125rem] text-fg-3">
                      {m.cost}
                    </td>
                    <td className="num px-2 py-2.5 text-[0.6875rem] text-fg-4">
                      {m.latency}
                    </td>
                    <td className="num px-2 py-2.5 pr-0 text-right text-[0.8125rem] text-fg-3">
                      {m.year}
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr key={`${m.id}-detail`} className="border-b border-rule">
                      <td colSpan={8} className="bg-ink-2 px-4 py-5">
                        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                          <div>
                            <p className="text-[0.875rem] leading-relaxed text-fg-2">
                              {m.summary}
                            </p>
                            <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-3">
                              {m.mechanism}
                            </p>

                            {m.latex ? (
                              <div className="mt-4 overflow-x-auto border border-rule bg-ink px-3">
                                <Math tex={m.latex} display />
                              </div>
                            ) : null}
                            <p className="mt-2 text-[0.75rem] leading-relaxed text-fg-4">
                              {m.formulaNote}
                            </p>

                            {m.evidence ? (
                              <div
                                className="mt-4 border-l-2 pl-3"
                                style={{ borderColor: l.hex }}
                              >
                                <p className="label" style={{ color: l.hex }}>
                                  Measured result
                                </p>
                                <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-2">
                                  {m.evidence}
                                </p>
                              </div>
                            ) : null}

                            <div className="mt-4">
                              <p className="label">Failure modes</p>
                              <ul className="mt-1.5 space-y-1">
                                {m.failureModes.map((f) => (
                                  <li
                                    key={f}
                                    className="flex gap-2 text-[0.75rem] leading-relaxed text-fg-3"
                                  >
                                    <span className="mt-[0.45rem] h-1 w-1 shrink-0 bg-rose/70" aria-hidden />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="label">Citation</p>
                              <p className="mt-1 text-[0.8125rem] text-fg-2">
                                {m.title}
                              </p>
                              <p className="num mt-1 text-[0.6875rem] leading-relaxed text-fg-4">
                                {m.authors}
                              </p>
                              <p className="num mt-1 text-[0.6875rem] text-fg-4">
                                {m.venue} · {m.year}
                                {!m.verified && (
                                  <span className="ml-1 text-amber">
                                    · citation unverified
                                  </span>
                                )}
                              </p>
                              {m.url ? (
                                <a
                                  href={m.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="num mt-1.5 inline-block text-[0.6875rem] text-amber underline decoration-amber/30 underline-offset-3 hover:decoration-amber"
                                >
                                  open source ↗
                                </a>
                              ) : null}
                            </div>

                            {m.dependsOn.length ? (
                              <div>
                                <p className="label">Depends on</p>
                                <ul className="mt-1 space-y-0.5">
                                  {m.dependsOn.map((d) => {
                                    const dep = METHODS.find((x) => x.id === d);
                                    return (
                                      <li
                                        key={d}
                                        className="text-[0.75rem] text-fg-3"
                                      >
                                        {dep?.name ?? d}
                                        {dep ? (
                                          <span
                                            className="num ml-1.5 text-[0.625rem]"
                                            style={{ color: LAYER_MAP[dep.layer].hex }}
                                          >
                                            L{LAYER_MAP[dep.layer].index}
                                          </span>
                                        ) : null}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : null}

                            <div>
                              <p className="label">Assessment basis</p>
                              <p className="num mt-1 text-[0.6875rem] leading-relaxed text-fg-4">
                                Efficacy {m.efficacy}% (CI {m.efficacyLow}–{m.efficacyHigh}%)
                                · confidence {m.confidence} · TRL {m.trl}/9 ·
                                relative cost {m.cost}/5 · verdict in{" "}
                                {m.latency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {!filtered.list.length ? (
        <p className="py-16 text-center text-[0.875rem] text-fg-4">
          Nothing matches. Try a broader term — “deception”, “formal”, “RLHF”,
          “audit”.
        </p>
      ) : null}
    </div>
  );
}

function LayerChip({
  active,
  onClick,
  hex,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  hex: string;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 border px-2 py-1 text-[0.6875rem] transition-colors"
      style={{
        borderColor: active ? hex : "var(--color-rule)",
        color: active ? hex : "var(--color-fg-4)",
        background: active ? `${hex}0f` : "transparent",
      }}
    >
      {label}
      <span className="num opacity-60">{count}</span>
    </button>
  );
}