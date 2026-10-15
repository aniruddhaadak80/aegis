# The data

A technical reference for the method catalog in
[`src/data/methods.ts`](../src/data/methods.ts), the taxonomy in
[`src/data/layers.ts`](../src/data/layers.ts) and the empirical anchors in
[`src/data/evidence.ts`](../src/data/evidence.ts).

Everything here is checked by [`scripts/verify-data.ts`](../scripts/verify-data.ts)
— 432 assertions that run in CI on every push.

## The schema

Each of the 59 methods carries exactly these fields:

```ts
interface Method {
  id: string;              // stable slug, used in URLs and dependency edges
  name: string;            // display name
  layer: LayerId;          // which of the 7 layers it belongs to
  title: string;           // the paper's actual title
  authors: string;
  year: number;
  venue: string;           // where it was published
  url?: string;               // canonical link
  trl: 1 | 2 | ... | 9;    // Technology Readiness Level
  efficacy: number;        // editorial point estimate, 0–100
  efficacyLow: number;     // lower bound of the plausible band
  efficacyHigh: number;    // upper bound
  confidence: "low" | "medium" | "high";
  cost: 1 | 2 | 3 | 4 | 5; // relative unit cost
  latency: string;         // time to deploy ("minutes", "days", "weeks")
  summary: string;         // one paragraph, what it is
  mechanism: string;       // one paragraph, how it works
  failureModes: string[];  // the specific ways it is known to fail
  dependsOn: string[];     // ids of methods this one builds on
  formulaNote: string;     // plain-language reading of the formula
  latex: string;           // KaTeX source, as a String.raw literal
  evidence?: string;       // the measured result behind the efficacy
  verified: boolean;       // is there a measurement at all?
}
```

## Invariants the suite enforces

| Invariant | Why it matters |
|:--|:--|
| 59 methods, no duplicate ids | A duplicate silently shadows one record |
| Every `layer` is one of the 7 known ids | An unknown layer breaks the explorer |
| Per-layer counts are 15/10/9/7/5/7/6 | Drift detection if a method is added to the wrong layer |
| Every `dependsOn` target exists | A dangling edge renders a node with no target |
| The dependency graph is acyclic | A cycle loops a graph renderer |
| Every field the app reads is present | The app must never render `undefined` |
| `low ≤ efficacy ≤ high`, all in 0–100 | An inverted band is a data error |
| `confidence`, `cost`, `trl` are valid enum values | Typos break filters |

## Provenance tiers

Every quantitative claim in the app carries one of four labels. The label is
shown on screen, next to the number, at all times.

| Tier | Meaning | Rendered |
|:--|:--|:--|
| **measured** | A number someone actually observed in an experiment | solid |
| **survey** | Aggregated expert opinion (ESPAI, AI Impacts) | solid |
| **forecast** | A prediction-market or forecasting-platform value | solid |
| **estimate** | Editorial judgement — **and it says so, on screen** | *italic* |

Editorial estimates are welcome. **Unlabelled editorial estimates are not.**
That is the one inviolable rule for contributing.

## Dependency edges and correlated failure

`dependsOn` is not decoration. Methods that require each other are *not
independent barriers*, no matter how many times they are counted — which is
precisely what the β common-cause term models.

The suite caught two classes of bug here that had shipped:

- **Dangling edges** — `rlhf` and `recursive-reward-modeling` both referenced
  `"reward-model-overoptimisation"`, a method that was never added.
- **Cycles** — six mutual dependencies, two of which were also backwards in
  time (RLHF and Constitutional AI both predate RLAIF).

A dangling edge does not throw; it renders a node with no target. That is
exactly the class of bug that survives visual review, which is why the suite
exists.

## Empirical anchors

[`evidence.ts`](../src/data/evidence.ts) holds the non-method data:

- `CAPABILITY_TRENDS` — METR task-horizon doubling, Epoch compute doubling,
  HLMI author-year, the AGI→superintelligence forecast
- `TIMELINE_FORECASTS` — Metaculus community medians
- `RISK_ESTIMATES` — P(doom) from several sources, with confidence
- `MEASURED_RESULTS` — the handful of experiments with actual numbers
- `TIMELINE` — the governance events shown on `/governance`
- `OPEN_QUESTIONS` — what the field still does not know

Each entry carries its own tier label and source.

## The open questions

The five entries in `OPEN_QUESTIONS` are the honest headline of the project:

1. **Why does narrow fine-tuning produce broad misalignment?** — Betley et al.
   established the phenomenon; the mechanism is not understood.
2. **Can a deception detector be built from features?** — nobody has shown a
   feature whose ablation removes deceptive intent while leaving aligned
   behaviour intact.
3. **How does evaluated safety transfer to deployed safety?** — nobody has made
   the transfer argument.
4. **Is any of this binding?** — every threshold-setting framework is authored
   by the party it constrains.
5. **What is the common-cause failure rate of AI safety practice?** — β is
   effectively unknown, and it is the term that dominates the answer.
