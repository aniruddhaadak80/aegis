"use client";

import { useMemo, useState } from "react";

/**
 * The hazard curve.
 *
 * Three measured capability trends on a log axis, against the pace at which
 * the control stack can actually be iterated. The gap between an exponential
 * and a human-speed process is the entire argument of AI safety, rendered as
 * geometry rather than prose.
 *
 * Every solid line below is measured and sourced. The dashed line is
 * illustrative — it represents governance iteration, which is not a measured
 * quantity, and is drawn dashed for exactly that reason.
 */

interface Series {
  id: string;
  label: string;
  /** months per doubling */
  doublingMonths: number;
  color: string;
  measured: boolean;
  note: string;
}

const SERIES: Series[] = [
  {
    id: "compute",
    label: "Training compute",
    doublingMonths: 5.2,
    color: "#ff9d2e",
    measured: true,
    note: "Epoch AI · frontier language models since 2020",
  },
  {
    id: "horizon",
    label: "Agent task horizon",
    doublingMonths: 212 / 30.44,
    color: "#4cc9f0",
    measured: true,
    note: "METR · 50% time horizon, 2019–2025, 212-day doubling",
  },
  {
    id: "algo",
    label: "Algorithmic progress",
    doublingMonths: 9.5,
    color: "#3ddc97",
    measured: true,
    note: "Epoch AI · compute-equivalent, 5–14 month range; midpoint shown",
  },
  {
    id: "control",
    label: "Control-stack iteration",
    doublingMonths: 60,
    color: "#6d757f",
    measured: false,
    note: "Illustrative. Governance, audit cycles and evaluation cadence move at human speed — roughly one meaningful improvement per multi-year policy cycle, not per doubling.",
  },
];

const Y0 = 2020;
const Y1 = 2045;
const X1 = 46; // vertical range in doublings

const W = 920;
const H = 380;
const PAD = { t: 24, r: 18, b: 40, l: 46 };

export function HazardChart() {
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const sx = (year: number) =>
    PAD.l + ((year - Y0) / (Y1 - Y0)) * (W - PAD.l - PAD.r);

  const sy = (doublings: number) =>
    H - PAD.b - (doublings / X1) * (H - PAD.t - PAD.b);

  const paths = useMemo(
    () =>
      SERIES.map((s) => {
        const pts: string[] = [];
        for (let y = Y0; y <= Y1; y += 0.25) {
          const d = ((y - Y0) * 12) / s.doublingMonths;
          pts.push(`${sx(y).toFixed(1)},${sy(Math.min(d, X1)).toFixed(1)}`);
        }
        return { s, d: `M${pts.join("L")}` };
      }),
    [],
  );

  const years = [2020, 2025, 2030, 2035, 2040, 2045];

  const valueAt = (s: Series, year: number) =>
    ((year - Y0) * 12) / s.doublingMonths;

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Capability measures doubling on a logarithmic scale while control-stack iteration advances linearly"
          onMouseLeave={() => setHoverYear(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const rel = (e.clientX - rect.left) / rect.width;
            const year = Y0 + rel * (Y1 - Y0);
            if (year >= Y0 && year <= Y1) setHoverYear(year);
          }}
        >
          {/* horizontal gridlines at each doubling */}
          {Array.from({ length: X1 + 1 }, (_, i) => (
            <g key={i}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={sy(i)}
                y2={sy(i)}
                stroke="var(--color-rule)"
                strokeWidth={i % 5 === 0 ? 1 : 0.5}
                opacity={i % 5 === 0 ? 0.9 : 0.45}
              />
              {i % 5 === 0 ? (
                <text
                  x={PAD.l - 8}
                  y={sy(i) + 3}
                  textAnchor="end"
                  className="num"
                  fontSize={9}
                  fill="var(--color-fg-4)"
                >
                  {i}
                </text>
              ) : null}
            </g>
          ))}

          {/* year ticks */}
          {years.map((y) => (
            <g key={y}>
              <line
                x1={sx(y)}
                x2={sx(y)}
                y1={H - PAD.b}
                y2={H - PAD.b + 4}
                stroke="var(--color-rule-2)"
              />
              <text
                x={sx(y)}
                y={H - PAD.b + 18}
                textAnchor="middle"
                className="num"
                fontSize={9}
                fill="var(--color-fg-4)"
              >
                {y}
              </text>
            </g>
          ))}

          <text
            x={PAD.l - 8}
            y={PAD.t - 6}
            textAnchor="end"
            className="label"
            fontSize={9}
            fill="var(--color-fg-4)"
          >
            DOUBLINGS
          </text>

          {/* crosshair */}
          {hoverYear ? (
            <line
              x1={sx(hoverYear)}
              x2={sx(hoverYear)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="var(--color-fg-4)"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
          ) : null}

          {/* series */}
          {paths.map(({ s, d }) => (
            <g key={s.id}>
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={s.measured ? 1.75 : 1.25}
                strokeDasharray={s.measured ? undefined : "5 4"}
                opacity={s.measured ? 0.95 : 0.6}
                strokeLinecap="round"
              />
              {hoverYear ? (
                <circle
                  cx={sx(hoverYear)}
                  cy={sy(Math.min(valueAt(s, hoverYear), X1))}
                  r={2.75}
                  fill={s.color}
                />
              ) : null}
            </g>
          ))}
        </svg>
      </div>

      {/* legend + readout */}
      <div className="mt-4 grid gap-x-8 gap-y-2 border-t border-rule pt-4 sm:grid-cols-2">
        {SERIES.map((s) => (
          <div key={s.id} className="flex items-start gap-2.5">
            <span
              className="mt-1 h-0.5 w-5 shrink-0"
              style={{
                background: s.color,
                opacity: s.measured ? 1 : 0.55,
              }}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[0.8125rem] text-fg">{s.label}</span>
                {!s.measured ? (
                  <span className="num text-[0.625rem] text-fg-4 uppercase">
                    illustrative
                  </span>
                ) : null}
                <span className="num ml-auto text-[0.6875rem] text-fg-3">
                  {hoverYear && valueAt(s, hoverYear) <= X1
                    ? `${valueAt(s, hoverYear).toFixed(1)}×`
                    : `${s.doublingMonths.toFixed(1)} mo`}
                </span>
              </div>
              <p className="mt-0.5 text-[0.6875rem] leading-snug text-fg-4">
                {s.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.75rem] leading-relaxed text-fg-3">
        {hoverYear ? (
          <>
            <span className="num text-fg-2">
              {Math.round(hoverYear)}
            </span>{" "}
            — cumulative doublings since 2020. The vertical gap between the
            measured curves and the dashed line is the widening interval in
            which control must be built and demonstrated before the capability
            it is meant to govern arrives.
          </>
        ) : (
          <>
            All three measured trends are exponential. All of them are steepening
            or have steepened. Governance, audit cycles, and evaluation
            infrastructure iterate at human speed — which is to say,
            sub-exponentially by construction. Move across the chart to read the
            cumulative divergence.
          </>
        )}
      </p>
    </div>
  );
}