# AEGIS — The Superintelligence Control Stack

An interactive web app for reasoning about AI control methods and probabilistic risk assessment.

## Features

- Seven-layer taxonomy of AI control techniques (Specification, Training, Interpretability, Containment, Verification, Governance, Recovery)
- Method Atlas with 40+ techniques, including citations, formulae, efficacy estimates, failure modes, and dependency edges
- Live Probabilistic Risk Assessment (PRA) engine that models defence-in-depth as a two-stage fault tree:
  - Initiation controls (spec/training/interp) reduce the probability of a dangerous capability event
  - Runtime barriers (containment/verification/governance/recovery) compose as a series system where catastrophe requires all barriers to fail
- Interactive visualisations:
  - Swiss-cheese model of the barrier stack
  - Cost-effectiveness frontier (marginal risk reduction per unit cost)
  - Hazard curve showing exponential capability growth vs. linear governance iteration
- Formula library with rendered LaTeX and plain‑language interpretations
- Governance timeline and framework assessments (RSP, FSF, Preparedness Framework, EU AI Act, etc.)
- Methodology page explaining how every number was produced (measured, survey, forecast, or editorial estimate)

## Live Demo

https://aegis-nmiwep6hc-aniruddha-adaks-projects.vercel.app

## Source Code

https://github.com/aniruddhaadak80/aegis

## Deployment

The site is exported as a static Next.js application (`output: 'export'`). It can be hosted on any static‑hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Export static site
bun run export   # or `next export` if using next.config.js output: 'export'
```

## Credits

Built by Aniruddha Adak using the OpenCode agent system.
