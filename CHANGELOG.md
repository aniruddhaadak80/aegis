# Changelog

All notable changes to AEGIS are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] — 2026-10-11

### Added

- **README completely redesigned** — 940+ lines: table of contents, 7 route
  screenshots, 4 Mermaid diagrams (fault tree, layer ramp, architecture,
  dependency lineage), a per-layer atlas of all 59 methods, a verification
  section, and a common-misconceptions section
- **Social preview card** — a designed 1200×630 OpenGraph image at
  `src/app/opengraph-image.png`, auto-wired into `og:image` by Next.js
- **Branded icon** — hexagon shield mark at `src/app/icon.svg`
- **`scripts/verify-data.ts`** — 432 catalog-integrity checks: dangling
  dependency edges, dependency cycles, duplicate ids, per-layer counts,
  required provenance fields, efficacy-band coherence, enum validity
- **GitHub repository metadata** — description, homepage, and 11 topics
  (`ai-safety`, `superintelligence`, `alignment`, `probabilistic-risk-assessment`,
  `ai-control`, `interpretability`, `fault-tree`, `nextjs`, `typescript`,
  `tailwindcss`, `risk-assessment`)
- **`LICENSE`** — MIT, previously referenced by the README but never committed
- **`.github/CONTRIBUTING.md`** — the provenance-labelling rule and the
  two-stage PRA invariant

### Fixed

- **Two dangling dependency edges** — `rlhf` and `recursive-reward-modeling`
  both referenced `"reward-model-overoptimisation"`, a method that was never
  added. Produced two broken nodes in the atlas dependency graph
- **Six dependency cycles** — mutual `dependsOn` references between
  `constitutional-ai ↔ rlaif`, `rlhf ↔ constitutional-ai`,
  `scalable-oversight ↔ {ai-debate, iterated-amplification, weak-to-strong}`,
  `red-teaming ↔ adversarial-training`, `safety-cases ↔ third-party-audits`, and
  `corrigibility ↔ safe-interruptibility`. Two were also backwards in time
  (RLHF and Constitutional AI both predate RLAIF)
- **Broken lint in CI** — an empty interface extending `Omit<PAResult, …>` in
  `src/lib/pra.ts` tripped `@typescript-eslint/no-empty-object-type` and failed
  `bun run lint`; converted to a type alias
- **Unused props** — `pBase` and `beta` were declared but never used on
  `PRAAnalysis` and `FrontierPanel`
- **Stale counts** — the atlas search placeholder said "41 techniques" (there
  are 59); the OpenGraph description said "Forty techniques"
- **Wrong `metadataBase`** — pointed at `aegis-control-stack.vercel.app`, a
  domain that does not exist, which mis-resolved every relative OG URL
- **Missing author attribution** — `authors: [{ name: "AEGIS" }]`

### Changed

- `bun run test` now runs both suites (47 PRA assertions + 432 data checks) and
  CI runs them as separate steps
- README's Live Demo links point at the stable Vercel alias
  (`aegis-aniruddha-adaks-projects.vercel.app`) rather than a per-deploy hash
- `out.txt` and `*.tsbuildinfo` are gitignored

## [0.1.0] — 2026-10-10

### Added

- Initial release: seven-layer control taxonomy, 59-method atlas, two-stage
  probabilistic risk assessment engine, KaTeX formula library, governance
  timeline, and methodology/provenance page
- Static export (`output: 'export'`) deployed to Vercel
- CI workflow: lint, typecheck, build, and Vercel preview/production deploys

[Unreleased]: https://github.com/aniruddhaadak80/aegis/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/aniruddhaadak80/aegis/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/aniruddhaadak80/aegis/releases/tag/v0.1.0
