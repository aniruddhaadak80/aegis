# Contributing to AEGIS

Thanks for your interest in AEGIS. This project has one rule that outranks
every other, and it is about epistemology rather than syntax.

## The one inviolable rule

> **Every number carries a provenance label.**

AEGIS exists because the AI-safety literature is full of quantitative claims
whose provenance is unstated. Do not add to that pile. Every figure you add
must be marked as exactly one of:

| Tier | Use it when |
|:--|:--|
| `measured` | Someone observed it in a real experiment |
| `survey` | It is aggregated expert opinion (ESPAI, AI Impacts) |
| `forecast` | It is a prediction-market or forecasting-platform value |
| `estimate` | It is editorial judgement — **and must say so, on screen** |

Editorial estimates are welcome. Unlabelled editorial estimates are not.

## The second rule

> **Do not flatten the two-stage PRA model.**

Initiation controls (specification, training, interpretability) discount the
probability that a dangerous capability event arises. Runtime barriers
(containment, verification, governance, recovery) must *all* fail for
catastrophe. Modelling them as one flat AND-stack is the precise error this
project was built to avoid. If you change `src/lib/pra.ts`, preserve that
distinction.

## Getting set up

```bash
git clone https://github.com/aniruddhaadak80/aegis.git
cd aegis
bun install
bun run dev        # http://localhost:3000
```

## Before you open a PR

```bash
bun run lint       # must pass
bun run build      # must succeed — this also validates the static export
```

Adding a method? Make sure the record includes every field:

`id`, `name`, `layer`, `title`, `authors`, `year`, `venue`, `trl`,
`efficacy`, `efficacyLow`, `efficacyHigh`, `confidence`, `cost`, `latency`,
`summary`, `mechanism`, `failureModes[]`, `dependsOn[]`, `formulaNote`,
`latex`, `verified`

- `dependsOn[]` must reference real method IDs — this is what makes the
  dependency graph honest.
- `latex` must be a `String.raw` template literal so it survives escaping.
- If you are unsure of an efficacy figure, widen the `efficacyLow` /
  `efficacyHigh` band rather than inventing a precise-looking point estimate.

## Style

- TypeScript strict mode; no `any` without a comment saying why.
- Match the surrounding file. If the data files are declarative and comment-
  sparse in one region and comment-dense in another, follow the local pattern.
- Keep changes focused: one logical change per commit.

## What makes a good first contribution

- Correcting a citation or an author list.
- Fixing a `dependsOn` edge that is missing or wrong.
- Widening an efficacy band that looks false-precision.
- Improving the plain-language reading of a formula on `/math`.

## Repository assets

| File | Purpose |
|:--|:--|
| `public/screenshots/*.png` | The 7 screenshots embedded in `README.md`, captured from the static export at 1600×1200 |
| `public/social-preview.png` | 1280×640 social card for the GitHub repo — upload it at **Settings → Options → Social preview → Edit** (the upload API is not public) |
| `src/app/opengraph-image.png` | 1200×630 OpenGraph card, auto-wired by Next.js into `og:image` |
| `src/app/icon.svg` | Inline SVG icon, wired into `<link rel="icon">` |
| `src/app/apple-icon.png` | 180×180 Apple touch icon |
| `public/icon-512.png` | 512×512 maskable icon for the web manifest |

If you change the brand colours in `globals.css` (`@theme`), re-render the OG
card, the icon, and the social preview so they stay in sync.

## Code of conduct

Be decent. Assume good faith, critique the model rather than the person, and
label your uncertainty.
