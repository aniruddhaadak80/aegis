# Architecture

How AEGIS is built, and the reasoning behind the choices.

## The one constraint that shapes everything

**`output: 'export'`.** The site is a plain static directory. There is no
server, no edge function, and no database. Every consequence below follows
from that.

| Decision | Consequence |
|:--|:--|
| Static export | The whole app can be hosted on any static host — Vercel, Netlify, GitHub Pages, S3, nginx |
| No server | The PRA engine runs entirely in the browser |
| No client-side math library | KaTeX is pre-rendered at build time into the HTML |
| Static export requires `dynamic = "force-static"` | Metadata routes (`sitemap`, `robots`, `manifest`) must opt in explicitly, or the build fails |

## Layer map

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # fonts, SEO/OG metadata, JSON-LD graph
│   ├── page.tsx            # / briefing
│   ├── atlas/              # /atlas   59 methods, filter + sort
│   ├── stack/              # /stack   seven-layer explorer
│   ├── risk/               # /risk    the PRA workbench
│   ├── math/               # /math    formula library (KaTeX)
│   ├── methodology/        # /methodology
│   ├── governance/         # /governance
│   ├── sitemap.ts          # metadata route
│   ├── robots.ts           # metadata route
│   ├── manifest.ts         # web app manifest
│   ├── opengraph-image.png # auto-wired social card
│   ├── icon.svg            # wired into <link rel="icon">
│   └── globals.css         # the design system (@theme tokens)
│
├── components/
│   ├── pra-engine.tsx      # the interactive workbench
│   ├── atlas-browser.tsx   # the filterable catalog
│   ├── hazard-chart.tsx    # the capability-vs-governance curve
│   ├── math.tsx            # KaTeX rendering
│   ├── reveal.tsx          # scroll-triggered reveal
│   ├── site-nav.tsx
│   ├── site-footer.tsx
│   └── ui.tsx              # Slider, Empty, shared primitives
│
├── data/
│   ├── methods.ts          # 59 methods — the catalog
│   ├── layers.ts           # 7-layer taxonomy + colour ramps
│   └── evidence.ts         # measured / survey / forecast anchors
│
├── lib/
│   ├── pra.ts              # the two-stage fault tree
│   └── pra-config.ts       # the shareable-URL codec
│
└── scripts/
    ├── verify-pra.ts       # 72 numerical assertions
    └── verify-data.ts      # 432 catalog integrity checks
```

## The design system

Defined once in `globals.css` as Tailwind v4 `@theme` tokens:

- **Substrate** — near-black `#07080a` with layered elevation and a fine
  engineering grid
- **Type** — Instrument Serif for display, Geist Sans for prose, Geist Mono
  for numerics, with `font-variant-numeric: tabular-nums` so columns of
  probabilities align on the decimal point
- **Layer ramp** — one hue per taxonomy layer, cyan → rose, used consistently
  across every page
- **Hairlines** — 1px rules at low white opacity instead of shadows
- **Motion** — the `reveal` component only, and only on scroll; disabled under
  `prefers-reduced-motion`

## Why the tests are split in two

`verify-pra.ts` and `verify-data.ts` test different kinds of thing and fail
differently:

- **`verify-pra.ts`** checks the *mathematics* against hand-computed values.
  These are exact: `4 × 0.6 = 0.1296`, `8 × 0.5 = 1/256`. A regression here
  is a wrong number in the product.
- **`verify-data.ts`** checks the *catalog* for structural integrity. These are
  relational: does every dependency edge resolve, is the graph acyclic, is every
  field present. A regression here is a silently broken page.

Both run in CI. Neither is optional.

## Performance

The honest numbers, measured on the production build:

| Asset | Raw | Gzipped |
|:--|--:|--:|
| `/` briefing | 180 KB | **32 KB** |
| `/atlas` | 126 KB | **16 KB** |
| `/risk` | 231 KB | **28 KB** |
| `/math` | 968 KB | **62 KB** |
| `/stack` | 1394 KB | **119 KB** |

Raw HTML is inflated by the inlined RSC payload, which is why gzipped is the
honest metric. `/stack` is the outlier because it renders all 59 full method
records inline; `/atlas` stays at 16 KB by lazy-loading detail.

`vercel.json` sets `immutable` one-year caching on `/_next/static` and all
images, so repeat visits are free.

## Security

The deployed site sends a CSP that denies framing (`frame-ancestors 'none'`),
restricts `base-uri` and `form-action`, and sets `default-src 'self'`, while
allowing the inline script and style the framework requires. See
[SECURITY.md](../SECURITY.md) for the full posture.
