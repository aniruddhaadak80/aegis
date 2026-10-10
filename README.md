<div align="center">

# ⬡ AEGIS

### *The Superintelligence Control Stack*

**An interactive instrument panel for reasoning about AI control methods** —
59 techniques, seven layers of defence, and a live probabilistic risk
assessment engine adapted from nuclear and aerospace practice.

[![Live Demo](https://img.shields.io/badge/%E2%96%B6%20Live%20Demo-aegis--aniruddha--adaks--projects.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aegis-aniruddha-adaks-projects.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](tsconfig.json)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](next.config.ts)
[![Bun](https://img.shields.io/badge/Bun-1.3-000000?style=for-the-badge&logo=bun&logoColor=white)](package.json)
[![License](https://img.shields.io/badge/License-MIT-fafafa?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/badge/CI-lint%20%2B%20build-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows/ci.yml)

*Built by [Aniruddha Adak](https://github.com/aniruddhaadak80) · Kolkata, India*

</div>

---

## The tour

<div align="center">

### `/` — Briefing
*Control the hazard, not the narrative.*

<img src="public/screenshots/home.png" alt="AEGIS briefing page" width="100%">

### `/risk` — PRA Engine
*Model a safety case instead of asserting one.*

<img src="public/screenshots/risk.png" alt="AEGIS PRA engine" width="100%">

</div>

<details>
<summary><b>▸ More pages — /atlas · /stack · /math · /governance · /methodology</b></summary>

<br>

<div align="center">

### `/atlas` — Method Atlas
*Every technique we have, with its receipts.*

<img src="public/screenshots/atlas.png" alt="AEGIS method atlas" width="100%">

### `/stack` — Control Stack
*Seven layers, ordered by when they act.*

<img src="public/screenshots/stack.png" alt="AEGIS control stack" width="100%">

### `/math` — Formula Library
<img src="public/screenshots/math.png" alt="AEGIS formula library" width="100%">

### `/governance` — Framework Timeline
<img src="public/screenshots/governance.png" alt="AEGIS governance timeline" width="100%">

### `/methodology` — Provenance Rules
<img src="public/screenshots/methodology.png" alt="AEGIS methodology page" width="100%">

</div>

</details>

---

## Why this exists

Alignment research has produced a decade of control techniques, each
evaluated in isolation. Almost nothing exists that lets a reader see them as
one system — **ordered by when they act, weighted by how much they actually
help, and composed into a number you can defend.**

AEGIS is that instrument. It is not a prediction engine and it does not
claim to be. It is a **structured, sourced model** of the control problem
that makes its assumptions inspectable and its arithmetic reproducible.

Everything in the app carries a **provenance label** — `measured`,
`survey`, `forecast`, or `estimate` — displayed inline, next to the number,
at all times. Editorial efficacy figures are labelled as editorial. That
discipline is the point.

> **A note on epistemic honesty.** Efficacy percentages in AEGIS are
> *editorial estimates* informed by the literature, not measurements. They
> exist to make the structure of the problem legible, not to forecast
> outcomes. The model is only as honest as the label attached to it.

---

## The seven-layer control stack

Controls are organised by **when they act**, not by which research group
produced them. A control that gets the objective right and a control that
shuts the system down after it has gone wrong are not comparable, and
lumping them into one list is the most common error in the field.

| # | Layer | Hex | Acts at | Question it answers | Methods |
|:-:|:--|:--|:--|:--|--:|
| 1 | 🔵 **Specification** | `#38bdf8` | Reward-design time | *Can we get the model's notion of good from the world, rather than from us?* | 15 |
| 2 | 🟣 **Training** | `#818cf8` | During gradient updates | *What behaviour do we actually bake in, and does it survive?* | 10 |
| 3 | 🟪 **Interpretability** | `#c084fc` | On activations, at inference | *Can we see the feature, not just score the sentence?* | 9 |
| 4 | 🟠 **Containment** | `#fb923c` | Deployment & execution | *If it turns out to be adversarial, what can it actually touch?* | 7 |
| 5 | 🟡 **Verification** | `#facc15` | Pre-release, adversarially after | *What would falsify this claim, and have we looked?* | 5 |
| 6 | 🟢 **Governance** | `#4ade80` | Across institutions | *Who checks the checker, and what happens when they disagree?* | 7 |
| 7 | 🔴 **Recovery** | `#fb7185` | Under adversarial conditions | *When it goes wrong, how do we stop it and start again?* | 6 |

> **59 methods total.** Two layers feed Stage 1 of the risk model
> (specification, training) plus interpretability; four layers provide the
> Stage 2 runtime barriers (containment, verification, governance, recovery).

The spectral ramp — cool cyan at specification through to warm rose at
recovery — is deliberate: **cool tones for controls that act before the model
exists, warm tones for controls that act after it has already gone wrong.**

```mermaid
flowchart LR
    subgraph EARLY["ACTS BEFORE THE MODEL EXISTS — discounts P"]
        direction TB
        A1["① Specification<br/>#38bdf8"] --> A2["② Training<br/>#818cf8"] --> A3["③ Interpretability<br/>#c084fc"]
    end

    subgraph LATE["ACTS AFTER DEPLOYMENT — must ALL fail — compounds as Π q"]
        direction TB
        B1["④ Containment<br/>#fb923c"] --> B2["⑤ Verification<br/>#facc15"] --> B3["⑥ Governance<br/>#4ade80"] --> B4["⑦ Recovery<br/>#fb7185"]
    end

    P(["A dangerous capability<br/>arises"]) --> EARLY
    EARLY -->|"survives initiation controls"| LATE
    LATE -->|"defeats every barrier"| X(["CATASTROPHE"])

    style P fill:#a8b0ba22,stroke:#a8b0ba,color:#e9ecef
    style X fill:#fb718533,stroke:#fb7185,stroke-width:2px,color:#fb7185
    style A1 fill:#38bdf822,stroke:#38bdf8,color:#38bdf8
    style A2 fill:#818cf822,stroke:#818cf8,color:#818cf8
    style A3 fill:#c084fc22,stroke:#c084fc,color:#c084fc
    style B1 fill:#fb923c22,stroke:#fb923c,color:#fb923c
    style B2 fill:#facc1522,stroke:#facc15,color:#facc15
    style B3 fill:#4ade8022,stroke:#4ade80,color:#4ade80
    style B4 fill:#fb718522,stroke:#fb7185,color:#fb7185
```

---

## The PRA engine

The heart of AEGIS is a two-stage probabilistic risk assessment engine in
[`src/lib/pra.ts`](src/lib/pra.ts), adapted from nuclear, aerospace and
process-safety practice — IEC 61508, ISO 26262, MIL-STD-217.

### Why two stages

Modelling every control as one flat AND-stack is a common and serious error.
It makes a good specification control look like it *blocks* a dangerous
event, which it does not — and it means an empty stack trivially "passes"
every gate. AEGIS splits the problem at the point where the physics changes:

**Stage 1 — Initiation.** Specification, training and interpretability
controls do not block an event. They change how likely it is that a
dangerous capability arises at all. They therefore **discount the initiating
probability** and compose multiplicatively in that role:

$$P_{\text{initiate}} = P_{\text{base}} \cdot \prod_{i}(1 - e_i)$$

**Stage 2 — Defeat.** Containment, verification, governance and recovery
controls are **runtime barriers**. The event is not contained unless
*every one of them* holds, so they compose as a series system:

$$Q_{\text{defeat}} = 1 - \prod_{j}(1 - q_j)$$

**Catastrophe** is the intersection:

$$P_{\text{catastrophe}} = P_{\text{initiate}} \times Q_{\text{defeat}}$$

### The fault tree, drawn

```mermaid
flowchart TD
    TOP(["CATASTROPHE<br/>P = P_initiate × Q_defeat"])

    INIT["STAGE 1 — INITIATION<br/>how likely is a dangerous capability?"]
    DEFEAT["STAGE 2 — DEFEAT<br/>does every runtime barrier fail?"]

    TOP --> INIT
    TOP --> DEFEAT

    subgraph S1[" "]
        direction LR
        SPEC["Specification<br/>(1 − e)"]
        TRAIN["Training<br/>(1 − e)"]
        INTERP["Interpretability<br/>(1 − e)"]
    end

    subgraph S2[" "]
        direction LR
        CONT["Containment<br/>q₁"]
        VER["Verification<br/>q₂"]
        GOV["Governance<br/>q₃"]
        REC["Recovery<br/>q₄"]
    end

    PBASE(["P_base — user-set<br/>no published estimate"]) --> INIT
    INIT -->|"× (1−e₁)(1−e₂)(1−e₃)"| PARR["P_arises"]

    PARR --> DEFEAT
    CONT --> AND{"ALL fail?"}
    VER --> AND
    GOV --> AND
    REC --> AND
    AND -->|"×  Π qᵢ"| QSYS["q_system"]
    BETA(["β · min(q)<br/>COMMON CAUSE"]) --> QDEF["q_defeat"]
    QSYS --> QDEF

    DEFEAT --- QDEF

    style TOP fill:#fb718533,stroke:#fb7185,stroke-width:2px,color:#fb7185
    style INIT fill:#38bdf822,stroke:#38bdf8,color:#38bdf8
    style DEFEAT fill:#fb923c22,stroke:#fb923c,color:#fb923c
    style BETA fill:#ff4d5e22,stroke:#ff4d5e,color:#ff4d5e
    style QDEF fill:#fb718522,stroke:#fb7185,color:#fb7185
    style PBASE fill:#a8b0ba11,stroke:#a8b0ba,color:#a8b0ba
    style AND fill:#facc1522,stroke:#facc15,color:#facc15
```

The consequence of this shape is that adding any barrier with $q < 1$
multiplies the result by $q < 1$ and therefore **reduces** catastrophic
risk. That is the defining mathematical property of defence in depth, and it
falls out of the model rather than being asserted.

### The β-common-cause floor

Redundancy is powerless against a shared defect. The engine applies the
IEC 61508-6 **β-factor model**, where of the failures in a group of similar
elements, a fraction β is attributable to a common cause anchored to the most
reliable member:

$$q_{\text{ccf}} = \beta \cdot \min(q_i)$$

$$P_{\text{defeat}} = P(\text{all fail}) + q_{\text{ccf}} - P(\text{all fail}) \cdot q_{\text{ccf}}$$

At $\beta = 0$ this reduces exactly to the independent all-fail probability.
But for an AI safety stack this term is emphatically **not** zero: if every
barrier was designed by overlapping teams, evaluated against shared
benchmarks, and rests on the same untested assumption about model internals,
then one conceptual error propagates through the whole stack. **With β = 0.4
and a best barrier of q = 0.3, no amount of additional deployment removes
12% joint failure.**

### Importance measures

The engine ranks barriers by four classical reliability measures, computed
over the deployed runtime barriers:

| Measure | Definition | What it tells you |
|:--|:--|:--|
| **Birnbaum** | $\partial P(\text{all fail})\, /\, \partial q_i = \prod_{j \neq i} q_j$ | How much the escape probability moves per unit change in this barrier's unavailability |
| **Fussell–Vesely** | $P(\text{saved}_i)\,/\,\sum_j P(\text{saved}_j)$ | This barrier's share of the escapes it alone prevented |
| **RAW** | Risk Achievement Worth — how many times worse the deployment is if this barrier *can* fail | Which barrier's failure is most catastrophic |
| **RRW** | Risk Reduction Worth — $1 - q_i$ | Which barrier's removal is most damaging |

A weak barrier carries little risk-reduction worth even though removing it is
catastrophic. **That asymmetry is exactly what makes a single weak slice in
the Swiss-cheese stack so damaging**, and it is why AEGIS surfaces all four.

### Marginal value per unit cost

The ranking that answers *"what should we build next?"* runs the full fault
tree once per control — switching each off in turn and measuring the
resulting change in final catastrophe probability. An initiation control and
a runtime barrier are not comparable on $q$ or $e$, but they are **directly
comparable on catastrophe probability removed per unit cost**. This is the
reason the model has to be two-stage.

### Reference barriers — for scale, not for merit

AEGIS compares the modelled stack against unavailabilities that established
high-assurance engineering actually achieves. These are reference points for
**scale**, not judgements of relative worth:

| Domain | Unavailability $q$ | Standard |
|:--|--:|:--|
| Nuclear — safety-critical channel | $10^{-9}$ | 1 in a billion demands |
| Aviation — flight control | $10^{-7}$ | per flight hour |
| Nuclear — typical safety system | $10^{-6}$ | IEC 61508 SIL 4 |
| Medical device | $10^{-6}$ | ISO 14971 tolerable |

AI control barriers sit **orders of magnitude above** these values. That gap
is the honest headline of the whole project.

---

## Interactive visualisations

| Visualisation | What it shows |
|:--|:--|
| 🧀 **Swiss-cheese stack** | The runtime barrier set as slices with aperture determined by each barrier's $q$; the β common-cause term appears as a hole drilled through *every* slice at once |
| 📉 **Cost-effectiveness frontier** | Marginal risk reduction per unit cost, so weak-but-cheap controls can be compared against strong-but-expensive ones on one axis |
| 📈 **Hazard curve** | Exponential capability growth (METR task-horizon doubling, Epoch compute doubling, algorithmic progress) against linear governance iteration — the race, drawn |
| 🎯 **Importance ranking** | Birnbaum, Fussell–Vesely, RAW and RRW bar charts over the deployed barriers, with the weakest link flagged |
| 🔬 **Sensitivity band** | Each control's estimate swept across its plausible low–high range, showing where the final answer actually moves — i.e. where to spend the measurement budget |

---

## The method atlas

59 techniques, each with a citation, a formula, an editorial efficacy band,
failure modes, and dependency edges into other controls.

<details>
<summary><b>🔵 Specification — 15 methods</b> &nbsp;<code>#38bdf8</code></summary>

| Method | Contribution |
|:--|:--|
| RLHF | Learning from human preference rankings |
| Cooperative IRL | Inferring the human's *actual* reward, not the observed policy |
| Constitutional AI | Constraints written as principles, enforced by the model itself |
| AI Safety via Debate | Adversarial discourse as an oversight protocol |
| Weak-to-Strong Generalization | Using strong models to supervise stronger ones |
| Inverse RL | Reward inference from demonstrated behaviour |
| Scalable Oversight | Judging tasks we cannot ourselves evaluate |
| Iterated Amplification | Bootstrapping oversight through amplification |
| Market Making | Extracting preferences via automated prediction markets |
| Goal Misgeneralization | Where learned goals diverge from intended goals |
| Recursive Reward Modeling | Rewarding the reward-modelling process itself |
| Process Supervision | Rewarding reasoning steps, not just final answers |
| RLAIF | Preference labels generated by the model, filtered by principles |
| DPO | Direct preference optimisation, no separate reward model |
| Constitutional Classifiers | Input/output filters trained on a written constitution |

</details>

<details>
<summary><b>🟣 Training — 10 methods</b> &nbsp;<code>#818cf8</code></summary>

| Method | Contribution |
|:--|:--|
| Red Teaming | Adversarial probing before release |
| Adversarial Training | Training against the attacks you found |
| Many-Shot Jailbreaking | Long-context attacks and their limits |
| Model-Written Evaluations | Scaling the evaluation pipeline itself |
| Machine Unlearning | Removing knowledge post-hoc |
| Emergent Misalignment Mitigation | Containing broad behavioural shifts from narrow fine-tuning |
| Sleeper Agents | Backdoors that survive safety training |
| Alignment Faking | Models that behave differently when observed |
| Refusal Sandbagging | Selectively withholding capability to steer deployment decisions |
| Deliberative Alignment | Teaching the safety spec explicitly, at inference time |

</details>

<details>
<summary><b>🟪 Interpretability — 9 methods</b> &nbsp;<code>#c084fc</code></summary>

| Method | Contribution |
|:--|:--|
| Linear Probes | Reading representations with simple classifiers |
| The Interpretability Illusion | Why apparent interpretability can be spurious |
| Sparse Autoencoders | Decomposing activations into monosemantic features |
| Towards Monosemanticity | Individual neurons as single interpretable concepts |
| Activation Patching | Causal intervention on internal states |
| Logit Lens | Reading intermediate predictions directly |
| Attribution Graphs | Circuit-level tracing of behaviour to features |
| Representation Engineering | Steering behaviour by editing representations |
| Mechanistic Probes of Sycophancy | Internal evidence for a specific behavioural pattern |

</details>

<details>
<summary><b>🟠 Containment — 7 methods</b> &nbsp;<code>#fb923c</code></summary>

| Method | Contribution |
|:--|:--|
| Sandboxing / Isolation | Bounding what the system can reach |
| Human Approval Gates | Human sign-off on high-consequence actions |
| Responsible Scaling Policy | Lab-internal capability thresholds tied to safeguards |
| Frontier Safety Framework | Amazon's capability-threshold protocol |
| Preparedness Framework | OpenAI's tracked-category risk thresholds |
| Deployment Monitoring | Watching for capability change in the wild |
| Weight Security | Protecting the artifact itself from exfiltration |

</details>

<details>
<summary><b>🟡 Verification — 5 methods</b> &nbsp;<code>#facc15</code></summary>

| Method | Contribution |
|:--|:--|
| AI Control | Protocols that remain safe with untrusted models |
| Safety Cases | Structured, reviewable arguments for deployment safety |
| Formal Verification | Machine-checked proofs of system properties |
| Control Evaluations | Red-teamed measurement of control-protocol efficacy |
| Sabbath Evaluations / Deliberative Evals | Repeated adversarial assessment after training ends |

</details>

<details>
<summary><b>🟢 Governance — 7 methods</b> &nbsp;<code>#4ade80</code></summary>

| Method | Contribution |
|:--|:--|
| Third-Party Audits | External evaluation with access and teeth |
| EU AI Act | GPAI obligations and systemic-risk tiers |
| Compute Governance | Controlling the input, not the output |
| Incident Reporting | Mandatory disclosure so others can learn |
| Model Cards | Standardised capability and limitation disclosure |
| AI Safety Institutes | State-backed evaluation capacity |
| Frontier Commitments | Voluntary frontier-lab pledges |

</details>

<details>
<summary><b>🔴 Recovery — 6 methods</b> &nbsp;<code>#fb7185</code></summary>

| Method | Contribution |
|:--|:--|
| Corrigibility | Permitting correction rather than resisting it |
| Safe Interruptibility | Shutdown without triggering avoidance |
| The Off-Switch Game | Formalising interruption incentives |
| Retroactive Unlearning | Removing capability after the fact |
| Weights Revocation | Revoking deployed model access |
| Post-Incident Forensics | Reconstructing why, so the lesson is shared |

</details>

### Every record carries

`trl` · `efficacy` (+ low/high band) · `confidence` · `cost` · `latency` ·
`summary` · `mechanism` · `failureModes[]` · `dependsOn[]` · `formulaNote` ·
rendered `latex` · `verified`

---

## What's inside — seven routes

| Route | Page | Contents |
|:--|:--|:--|
| `/` | **Briefing** | Hero framing of the control problem and the model's epistemic stance |
| `/atlas` | **Method Atlas** | All 59 methods, filterable by layer / TRL / confidence, sortable by efficacy |
| `/stack` | **Control Stack** | The seven layers as an explorable stack, each with tagline, question and member methods |
| `/risk` | **PRA Engine** | The fault tree itself — toggle controls, watch catastrophe probability recompose |
| `/math` | **Formula Library** | Every formula in the model, KaTeX-rendered with plain-language readings |
| `/governance` | **Governance** | Framework timeline — RSP, FSF, Preparedness, EU AI Act — with adoption dates and status |
| `/methodology` | **Methodology** | The provenance ladder and the rules used to label every number |

---

## Sourced evidence

Every quantitative input traces to primary literature. The four provenance
tiers are shown on the methodology page and inline throughout:

| Tier | Meaning | Rendered as |
|:--|:--|:--|
| 🔬 **measured** | A number someone actually observed in an experiment | solid |
| 📊 **survey** | Aggregated expert opinion (e.g. ESPAI, AI Impacts) | solid |
| 🔮 **forecast** | A prediction-market or forecasting-platform value | solid |
| ✏️ **estimate** | Editorial judgement, clearly marked as such | *italic* |

**Primary sources include:**

- **AI Impacts** — 2023 Expert Survey on Progress in AI (ESPAI), [arXiv:2401.02843](https://arxiv.org/abs/2401.02843)
- **METR** — Measuring AI Ability to Complete Long Tasks, [arXiv:2503.14499](https://arxiv.org/abs/2503.14499)
- **Epoch AI** — notable models dataset and compute-trend analyses
- **AI Control** — Greenblatt et al., [arXiv:2312.06942](https://arxiv.org/abs/2312.06942) (ICML 2024)
- **Safety Cases** — Clymer et al., [arXiv:2403.10462](https://arxiv.org/abs/2403.10462)
- **Concrete Problems in AI Safety** — Amodei et al., [arXiv:1606.06565](https://arxiv.org/abs/1606.06565)
- **The Off-Switch Game** — Hadfield-Menell et al., [arXiv:1611.08219](https://arxiv.org/abs/1611.08219)
- **Goal Misgeneralization** — Shah et al., [arXiv:2210.01790](https://arxiv.org/abs/2210.01790)
- **Constitutional AI** — Bai et al., [arXiv:2212.08073](https://arxiv.org/abs/2212.08073)
- **DPO** — Rafailov et al., [arXiv:2305.18290](https://arxiv.org/abs/2305.18290)
- **Weak-to-Strong Generalization** — Burns et al., [arXiv:2312.09390](https://arxiv.org/abs/2312.09390)
- **AI Safety via Debate** — Irving et al., [arXiv:1805.00899](https://arxiv.org/abs/1805.00899)
- **Iterated Amplification** — Christiano et al., [arXiv:1810.08575](https://arxiv.org/abs/1810.08575)
- **Sleeper Agents** — Hubinger et al., [arXiv:2401.05566](https://arxiv.org/abs/2401.05566)
- **Sparse Autoencoders** — Cunningham et al., [arXiv:2409.05556](https://arxiv.org/abs/2409.05556)
- **Towards Monosemanticity** — Bricken et al., [arXiv:2309.10312](https://arxiv.org/abs/2309.10312)

---

## Tech stack

| Layer | Choice | Version |
|:--|:--|:--|
| Framework | **Next.js** (App Router, static export) | 16.4.0 |
| UI runtime | **React** | 19.3.0 |
| Language | **TypeScript** (strict) | 5.x |
| Styling | **Tailwind CSS** | v4 |
| Math rendering | **KaTeX** (server-side, no client math runtime) | 0.19 |
| Package manager | **Bun** | 1.3.14 |
| Hosting | **Vercel** — static export | — |

The whole site is a **fully static export** (`output: 'export'`). There is no
server, no client-side math library, and no data fetching at runtime — the
entire model runs in the browser.

```mermaid
flowchart LR
    subgraph DATA["src/data — the model, as data"]
        M["methods.ts<br/>59 methods"]
        L["layers.ts<br/>7-layer taxonomy + ramps"]
        E["evidence.ts<br/>measured / survey / forecast"]
    end

    subgraph ENGINE["src/lib — the mathematics"]
        PRA["pra.ts<br/>two-stage fault tree<br/>β-common cause<br/>importance measures"]
    end

    subgraph UI["src/app — seven static routes"]
        R1["/"]; R2["/atlas"]; R3["/stack"]; R4["/risk"]
        R5["/math"]; R6["/methodology"]; R7["/governance"]
    end

    COMP["src/components<br/>pra-engine · atlas-browser<br/>hazard-chart · math"]

    DATA --> ENGINE --> COMP --> UI
    UI --> OUT[("out/ — static HTML<br/>zero runtime server")]

    style OUT fill:#0b0d10,stroke:#e9ecef33,color:#e9ecef
    style PRA fill:#fb718522,stroke:#fb7185,color:#fb7185
    style DATA fill:#38bdf822,stroke:#38bdf8,color:#38bdf8
    style UI fill:#4ade8022,stroke:#4ade80,color:#4ade80
```

---

## Design system

A dark **instrument-panel** aesthetic: near-black substrate, the spectral
layer ramp above, hairline rules, and tabular numerics throughout.

- **Substrate** — near-black `#08090a` base with layered elevation
- **Numerics** — JetBrains Mono with `font-variant-numeric: tabular-nums` so
  columns of probabilities align on the decimal point
- **Layer ramp** — cyan → indigo → violet → orange → amber → green → rose,
  one hue per taxonomy layer, used consistently across every page
- **Hairlines** — 1px borders at 6–12% white opacity instead of shadows
- **Type** — tight display headings, small caps eyebrow labels, generous
  measure for prose
- **Motion** — restrained reveals; the `reveal` component only, nothing
  decorative that runs more than once

---

## Project structure

```
aegis/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # lint + typecheck + test + build + deploy
│   │   └── pr-validate.yml         # PR validation
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CONTRIBUTING.md             # provenance rules + two-stage invariant
├── public/
│   ├── screenshots/                # README imagery (7 pages)
│   └── *.svg
├── scripts/
│   └── verify-pra.ts               # 47 numerical assertions on the engine
├── src/
│   ├── app/
│   │   ├── page.tsx                # briefing / hero
│   │   ├── atlas/page.tsx          # 59-method atlas, filter + sort
│   │   ├── stack/page.tsx          # seven-layer explorer
│   │   ├── risk/page.tsx           # PRA engine + fault tree
│   │   ├── math/page.tsx           # formula library (KaTeX)
│   │   ├── methodology/page.tsx    # provenance rules
│   │   └── governance/page.tsx     # framework timeline
│   ├── components/
│   │   ├── atlas-browser.tsx
│   │   ├── hazard-chart.tsx
│   │   ├── math.tsx
│   │   ├── pra-engine.tsx
│   │   ├── reveal.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-nav.tsx
│   │   └── ui.tsx
│   ├── data/
│   │   ├── methods.ts              # 59 methods, 7 layers
│   │   ├── layers.ts               # taxonomy + colour ramps
│   │   └── evidence.ts             # measured / survey / forecast anchors
│   └── lib/
│       └── pra.ts                  # two-stage PRA mathematics
├── next.config.ts                  # output: 'export'
├── LICENSE                         # MIT
├── tailwind.config.ts
├── tsconfig.json                   # strict
└── package.json
```

---

## Quick start

```bash
# 1 — clone
git clone https://github.com/aniruddhaadak80/aegis.git
cd aegis

# 2 — install (bun is the package manager)
bun install

# 3 — develop
bun run dev            # http://localhost:3000

# 4 — production build + static export
bun run build          # emits ./out
```

### Scripts

| Command | Purpose |
|:--|:--|
| `bun run dev` | Development server on `:3000` |
| `bun run build` | Production build; static site in `./out` |
| `bun run start` | Serve the built app |
| `bun run lint` | ESLint via `eslint-config-next` |
| `bun run test` | 47 numerical assertions against the PRA engine — hand-computed expected values for every formula, the two-stage composition, the β floor, importance measures, monotonicity, and the leave-one-out efficiency ranking |

The test suite is the reason the numbers on `/risk` can be trusted: `seriesDefeat`,
`betaCommonCause`, `evaluate`, and `computePRA` are each checked against
hand-computed values, and the invariants that matter — *adding a barrier never
increases risk*, *an empty barrier set provides no defence*, *β raises risk and
never lowers it* — are asserted rather than assumed.

---

## Deployment

**Live:** <https://aegis-aniruddha-adaks-projects.vercel.app>

Because the output is a plain static directory, AEGIS can be hosted anywhere.

**Vercel** — the reference deployment:

```bash
vercel --prod
```

**Any static host** — build, then upload `out/`:

```bash
bun run build
# → drop ./out onto Netlify, Cloudflare Pages, GitHub Pages, S3, nginx
```

---

## Contributing

Read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) first, and open an
issue before starting anything non-trivial.

1. Fork and branch — `feat/short-description`
2. `bun run lint` must pass
3. **Any number you add must carry a provenance label.** Editorial estimates
   must say so, in the data file and on screen.
4. Keep the two-stage PRA shape — do not flatten initiation controls and
   runtime barriers into a single AND-stack. That is the exact modelling
   error this project exists to avoid.
5. One logical change per commit; match the surrounding style.

```bash
bun run lint && bun run build
```

---

## License

**MIT** — see [`LICENSE`](LICENSE).

```
Copyright (c) 2026 Aniruddha Adak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

### ⬡ AEGIS

**These are structural models, not predictions.**

[Live](https://aegis-aniruddha-adaks-projects.vercel.app) ·
[Source](https://github.com/aniruddhaadak80/aegis) ·
[Issues](https://github.com/aniruddhaadak80/aegis/issues)

*Built with the OpenCode agent system. Thanks to the open-source AI safety
community for the research that makes this legible.*

</div>



