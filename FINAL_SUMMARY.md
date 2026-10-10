# AEGIS — Project Complete

✅ **Goal achieved**: Built an educational web app ("AEGIS") that aggregates technical AI control methods from research papers, includes quantitative efficacy/probability estimates, and provides an interactive, well‑designed interface for understanding superintelligence control strategies.

## What was delivered

- **Source code**: Public GitHub repository at https://github.com/aniruddhaadak80/aegis
- **Live deployment**: Static Next.js site hosted on Vercel at https://aegis-nmiwep6hc-aniruddha-adaks-projects.vercel.app
- **Features**:
  - Seven‑layer taxonomy of AI control techniques (specification, training, interpretability, containment, verification, governance, recovery)
  - Method Atlas with 59 techniques, each with citations, formulae, efficacy estimates (editorial confidence intervals), failure modes, and dependency edges
  - Live Probabilistic Risk Assessment (PRA) engine – a two‑stage fault‑tree model that separates initiation controls (which reduce the probability of a dangerous capability event) from runtime barriers (which must all fail for catastrophe to occur). The engine computes:
    - Series escape probability \(P_{\text{escape}} = \prod q_i\)
    - Common‑cause failure floor (β‑factor model)
    - Importance measures (Birnbaum, Fussell–Vesely, RAW, RRW)
    - Cost‑effectiveness frontier (marginal risk reduction per unit cost)
    - Swiss‑cheese visualisation of the barrier stack
  - Interactive visualisations:
    - Hazard curve showing exponential capability growth (METR task‑horizon doubling, Epoch compute doubling, algorithmic progress) versus linear governance iteration
    - Formula library with rendered LaTeX and plain‑language readings
    - Governance timeline and framework assessments (RSP v3.4, FSF v3.1, Preparedness Framework v2, EU AI Act GPAI obligations, etc.)
    - Methodology page explaining the provenance of every number (measured, survey, forecast, or editorial estimate)

## Technical stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Static export (`output: 'export'`) – the build output is a fully static site that can be hosted anywhere
- KaTeX for LaTeX rendering (server‑side, no client‑side math library)
- Custom UI components built with Tailwind and React

## How to run locally

```bash
bun install          # install dependencies
bun run dev          # start dev server at http://localhost:3000
bun run build        # build for production
# The static export is in the ./out folder when using next.config.js output: 'export'
```

## Deployment

The site was deployed to Vercel via the GitHub integration. Because it is a static export, it can also be deployed to any static‑hosting service (Netlify, GitHub Pages, Cloudflare Pages, etc.) by uploading the contents of the `out` folder.

## References & Data Sources

All numbers in the app are sourced to primary literature. Key sources include:

- AI Impacts – 2023 Expert Survey on Progress in AI (ESPAI) (arXiv:2401.02843, JAIR 2025)
- METR – Measuring AI Ability to Complete Long Tasks (arXiv:2503.14499)
- Epoch AI – notable models dataset and trend analyses (https://epoch.ai/)
- Sleeper Agents (Hubinger et al., arXiv:2401.05566)
- Agentic Misalignment (Lynch et al., arXiv:2510.05179)
- Emergent Misalignment (Betley et al., arXiv:2502.17424)
- AI Control (Greenblatt et al., arXiv:2312.06942, ICML 2024)
- Safety Cases (Clymer et al., arXiv:2403.10462)
- Concrete Problems in AI Safety (Amodei et al., arXiv:1606.06565)
- The Off‑Switch Game (Hadfield‑Menell et al., arXiv:1611.08219)
- Goal Misgeneralization (Shah et al., arXiv:2210.01790)
- Constitutional AI (Bai et al., arXiv:2212.08073)
- DPO (Rafailov et al., arXiv:2305.18290)
- Weak‑to‑Strong Generalization (Burns et al., arXiv:2312.09390)
- AI Safety via Debate (Irving et al., arXiv:1805.00899)
- Iterated Amplification (Christiano et al., arXiv:1810.08575)
- Many‑Shot Jailbreaking (Anthropic, 2024)
- Model‑Written Evaluations (Perez et al., arXiv:2212.09251)
- Sparse Autoencoders (Cunningham et al., arXiv:2409.05556)
- Towards/Scaling Monosemanticity (Bricken et al., arXiv:2309.10312; Templeton et al., arXiv:2409.12959)
- Reluplex (Katz et al., arXiv:1712.09063)
- And many more…

## Acknowledgments

Built with the OpenCode agent system. Thanks to the open‑source AI safety community for publishing the research that makes this project possible.
