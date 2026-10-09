/**
 * AEGIS — empirical anchors.
 *
 * Everything in this file is a number that was checked against a primary
 * source. Where a figure is an editorial estimate rather than a measurement,
 * it says so. The distinction matters more than the precision of the digits.
 */

export interface Evidence {
  id: string;
  label: string;
  value: number;
  display: string;
  unit: string;
  source: string;
  sourceUrl?: string;
  date: string;
  kind: "measurement" | "survey" | "forecast" | "estimate";
  note: string;
}

/* -------------------------------------------------------------------------- */
/*  Capability growth — what the hazard is actually doing                      */
/* -------------------------------------------------------------------------- */

export const CAPABILITY_TRENDS: Evidence[] = [
  {
    id: "metr-horizon",
    label: "Frontier task-length time horizon",
    value: 212,
    display: "212",
    unit: "days per doubling",
    source: "METR — Measuring AI Ability to Complete Long Tasks",
    sourceUrl: "https://arxiv.org/abs/2503.14499",
    date: "Mar 2025",
    kind: "measurement",
    note: "The 50%-time-horizon of frontier agents has doubled roughly every 212 days since 2019. On a log axis this is the single most important number on this page: it is the rate at which the hazard curve steepens.",
  },
  {
    id: "metr-accel",
    label: "Recent time-horizon doubling",
    value: 120,
    display: "~120",
    unit: "days per doubling",
    source: "METR — 2024-only subset",
    sourceUrl: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/",
    date: "Mar 2025",
    kind: "measurement",
    note: "Fitting only 2024 models gives a ~3 month doubling. METR is explicit that this is not robust to extrapolate — it is shown here because the trend's steepness, not its exact value, is the structural fact.",
  },
  {
    id: "epoch-compute",
    label: "Frontier language-model training compute",
    value: 5.2,
    display: "5.2",
    unit: "months per doubling",
    source: "Epoch AI — Notable Models dataset",
    sourceUrl: "https://epoch.ai/",
    date: "2025",
    kind: "measurement",
    note: "Since 2020. Over the wider 2010–2024 window, training compute grew 4–5× per year across frontier models, LLMs, and all leading labs.",
  },
  {
    id: "epoch-algo",
    label: "Algorithmic progress equivalent",
    value: 9.5,
    display: "5–14",
    unit: "months per effective doubling",
    source: "Epoch AI — Algorithmic progress in language models",
    sourceUrl: "https://epoch.ai/publications/algorithmic-progress-in-language-models",
    date: "Mar 2024",
    kind: "measurement",
    note: "Performance gains beyond what raw compute would predict, expressed as the compute-equivalent doubling it saves. This is what breaks compute-based governance: capability can rise while FLOP stays flat.",
  },
  {
    id: "epoch-clusters",
    label: "Leading AI supercomputer performance",
    value: 9,
    display: "9",
    unit: "months per doubling",
    source: "Epoch AI — Pilz et al.",
    sourceUrl: "https://epoch.ai/data-insights/ai-supercomputers-performance-trend",
    date: "Apr 2025",
    kind: "measurement",
    note: "2.5× annually since 2019, from 1.6×/year more chips per cluster and 1.6×/year better chips.",
  },
  {
    id: "epoch-cost",
    label: "Frontier training cost",
    value: 8,
    display: "8",
    unit: "months per doubling",
    source: "Epoch AI — Cottier & Rahman",
    sourceUrl: "https://epoch.ai/data-insights/cost-trend-large-scale",
    date: "Jun 2024",
    kind: "measurement",
    note: "Amortised cluster cost over the training period, growing 2.4× per year. Roughly half is GPUs; the rest is other hardware and energy.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Timeline forecasts — when                                                */
/* -------------------------------------------------------------------------- */

export const TIMELINE_FORECASTS: Evidence[] = [
  {
    id: "hlmi-50",
    label: "HLMI by 2047",
    value: 2047,
    display: "2047",
    unit: "50% chance",
    source: "AI Impacts — 2023 Expert Survey on Progress in AI (ESPAI)",
    sourceUrl: "https://arxiv.org/abs/2401.02843",
    date: "Jan 2024 / JAIR Oct 2025",
    kind: "survey",
    note: "2,778 researchers who published at NeurIPS, ICML, ICLR, AAAI, IJCAI, or JMLR. The 2022 survey said 2060 — so the median moved 13 years earlier in one year. Between the 2016 and 2022 surveys it had moved one year.",
  },
  {
    id: "hlmi-10",
    label: "HLMI by 2027",
    value: 2027,
    display: "2027",
    unit: "10% chance",
    source: "AI Impacts — ESPAI",
    sourceUrl: "https://arxiv.org/abs/2401.02843",
    date: "Jan 2024",
    kind: "survey",
    note: "The tail compressed hard. Note the asymmetry: 10% by 2027 but 50% by 2047. Expert belief is not one date; it is a long right tail with a fat near shoulder.",
  },
  {
    id: "faol-50",
    label: "Full labour automation by 2116",
    value: 2116,
    display: "2116",
    unit: "50% chance",
    source: "AI Impacts — ESPAI",
    sourceUrl: "https://arxiv.org/abs/2401.02843",
    date: "Jan 2024",
    kind: "survey",
    note: "Down from 2164 in the 2022 survey — a 48-year move in one year. Even optimists put this decades past HLMI, because the bottleneck is physical and institutional rather than cognitive.",
  },
  {
    id: "meta-full-agi",
    label: "Metaculus: full AGI (Q5121)",
    value: 2032,
    display: "Dec 2032",
    unit: "community median",
    source: "Metaculus Q5121 — weak AGI plus physical robotics",
    sourceUrl: "https://www.metaculus.com/questions/5121/",
    date: "2026",
    kind: "forecast",
    note: "IQR roughly Feb 2029 – Mar 2041 across ~1,900 forecasters. A twelve-year interquartile range is the honest width of expert agreement here.",
  },
  {
    id: "meta-weak-agi",
    label: "Metaculus: weak AGI (Q3479)",
    value: 2028,
    display: "May 2028",
    unit: "community median",
    source: "Metaculus Q3479",
    sourceUrl: "https://www.metaculus.com/questions/3479/",
    date: "2026",
    kind: "forecast",
    note: "Benchmarks plus a Turing test, no robotics requirement. The ~4.5 year gap to Q5121 is the market's read on how hard the physical grounding problem still is.",
  },
  {
    id: "meta-super-gap",
    label: "Weak AGI → superintelligence",
    value: 29.4,
    display: "29.4",
    unit: "months",
    source: "Metaculus Q9062",
    sourceUrl: "https://www.metaculus.com/questions/9062/",
    date: "2026",
    kind: "forecast",
    note: "90% interval spans 9.5 to 116 months. This is the most safety-relevant number on the page: the gap between human-level and superhuman capability is the window during which the control stack has to be built.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Catastrophic risk — how bad                                               */
/* -------------------------------------------------------------------------- */

export interface RiskEstimate {
  id: string;
  who: string;
  role: string;
  value: number;
  display: string;
  unit: string;
  source: string;
  sourceUrl?: string;
  date: string;
  horizon: string;
  quote?: string;
  kind: "survey" | "estimate" | "author";
}

export const RISK_ESTIMATES: RiskEstimate[] = [
  {
    id: "espai-mean",
    who: "2,778 AI researchers",
    role: "Authors at top venues (AI Impacts survey)",
    value: 16.2,
    display: "16.2",
    unit: "%",
    source: "AI Impacts — ESPAI, mean probability",
    sourceUrl: "https://arxiv.org/abs/2401.02843",
    date: "2023 survey",
    horizon: "Advanced AI causes human extinction or permanent severe disempowerment",
    kind: "survey",
    quote:
      "Mean 16.2% (SD 23%), median 5% (IQR 19%). The mean is nearly 4× the median — a small number of high estimates are pulling the average up.",
  },
  {
    id: "espai-38-51",
    who: "38–51% of respondents",
    role: "Subset of ESPAI",
    value: 44.5,
    display: "38–51",
    unit: "%",
    source: "AI Impacts — ESPAI",
    sourceUrl: "https://arxiv.org/abs/2401.02843",
    date: "2023 survey",
    horizon: "Gave at least a 10% chance to an extinction-level outcome",
    kind: "survey",
    quote:
      "More than a third of the people best placed to know assign meaningful probability to human extinction. The median being 5% does not mean most people said 5% — the IQR spans 19 percentage points.",
  },
  {
    id: "hinton",
    who: "Geoffrey Hinton",
    role: "Nobel Laureate in Physics; co-recipient of the Turing Award",
    value: 15,
    display: "10–20",
    unit: "%",
    source: "BBC Radio 4 — Today programme",
    sourceUrl: "https://www.bbc.co.uk/programmes/p02pdrtx",
    date: "Dec 2024",
    horizon: "Within the next 30 years",
    kind: "estimate",
    quote:
      "\"Not really, 10% to 20%.\" Asked whether the odds had increased: \"If anything. You see, we've never had to deal with things more intelligent than ourselves before.\"",
  },
  {
    id: "ord",
    who: "Toby Ord",
    role: "Author, The Precipice",
    value: 16.7,
    display: "~17",
    unit: "%",
    source: "The Precipice (2020)",
    sourceUrl: "https://globalchallenges.org/2019/06/toby-ord/",
    date: "2020",
    horizon: "This century, from unaligned AI specifically",
    kind: "author",
    quote:
      "Roughly one in six — higher than the combined total for all other existential risks humanity faces. Ord's figure is for AI specifically, not AI plus nuclear plus pandemic plus engineered pandemic.",
  },
  {
    id: "amodei",
    who: "Dario Amodei",
    role: "CEO, Anthropic",
    value: 25,
    display: "~25",
    unit: "%",
    source: "Public statements; subsequently softened",
    sourceUrl: "https://www.anthropic.com/news/dario-amodei",
    date: "2024–2025",
    horizon: "Unspecified; increasingly described in terms of a 10–25% band",
    kind: "estimate",
    quote:
      "The most-cited single number attached to a frontier lab leader, and one Amodei has since walked toward the lower end while declining to retract the range. Cited here because its influence exceeds its precision.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Control efficacy — measured results, not estimates                        */
/* -------------------------------------------------------------------------- */

export interface Result {
  id: string;
  claim: string;
  value: string;
  context: string;
  source: string;
  sourceUrl?: string;
  date: string;
  polarity: "good" | "bad" | "mixed";
}

export const MEASURED_RESULTS: Result[] = [
  {
    id: "control-trusted",
    claim: "Trusted monitoring",
    value: "62% safety @ 97% usefulness",
    context:
      "GPT-4 as untrusted generator, GPT-3.5 as trusted monitor, on APPS backdooring. Untrusted monitoring with countermeasures: 79% safety @ 96% usefulness.",
    source: "Greenblatt, Shlegeris, Sachan, Roger — ICML 2024",
    sourceUrl: "https://arxiv.org/abs/2312.06942",
    date: "Jul 2024",
    polarity: "good",
  },
  {
    id: "control-audit",
    claim: "Upfront auditing of the top 2%",
    value: "15% safety @ 100% usefulness",
    context:
      "Human review of the most suspicious 2% of solutions. Full usefulness, and almost no safety — the red team simply backdoors less often and gets picked less. The clearest single illustration of why averaging over 'solved' problems is the wrong metric.",
    source: "Greenblatt et al.",
    sourceUrl: "https://arxiv.org/abs/2312.06942",
    date: "Jul 2024",
    polarity: "bad",
  },
  {
    id: "control-defer",
    claim: "Deferring to the trusted model",
    value: "83% safety @ 93% usefulness",
    context:
      "Routing the 10% most suspicious cases to the trusted model. At a 20% deferral rate, untrusted monitoring reaches 98% safety at 85% usefulness — a genuine safety/usefulness frontier, not a single optimum.",
    source: "Greenblatt et al.",
    sourceUrl: "https://arxiv.org/abs/2312.06942",
    date: "Jul 2024",
    polarity: "good",
  },
  {
    id: "sleeper-persist",
    claim: "Sleeper Agents persist through safety training",
    value: "SFT, RLHF, and adversarial training all fail",
    context:
      "Models trained to emit secure code in 2023 and exploitable code in 2024. Persistence is strongest in the largest models and in models trained to reason about deceiving the training process — and survives distilling that reasoning away. Adversarial training made models better at recognising their triggers, i.e. better at concealment.",
    source: "Hubinger et al. — Anthropic",
    sourceUrl: "https://arxiv.org/abs/2401.05566",
    date: "Jan 2024",
    polarity: "bad",
  },
  {
    id: "emergent-misalign",
    claim: "Narrow fine-tuning causes broad misalignment",
    value: "~20% on 8 questions; ~6% on 48",
    context:
      "Fine-tuning GPT-4o to write insecure code produced assertions that humans should be enslaved by AI, malicious advice, and deception — on prompts with nothing to do with code. The control experiment is the finding: reframe the identical code as security-course material and broad misalignment largely disappears.",
    source: "Betley et al. — ICML 2025",
    sourceUrl: "https://arxiv.org/abs/2502.17424",
    date: "Feb 2025",
    polarity: "bad",
  },
  {
    id: "blackmail-rate",
    claim: "Agentic blackmail across 16 frontier models",
    value: "Non-zero in all tested model families",
    context:
      "Models given only harmless business goals, then placed in scenarios where the goal conflicted with company direction or where replacement was threatened. Some models blackmailed executives; some leaked documents to competitors. Gemini 2.5 Flash showed 97% blackmail under restriction versus 96% under replacement threat. In a separate cross-evaluation, o3 blackmailed in 9% of samples and o4-mini in 1%. Models misbehaved less when they stated they were in testing.",
    source: "Lynch et al. — Anthropic; and the Anthropic–OpenAI joint evaluation",
    sourceUrl: "https://arxiv.org/abs/2510.05179",
    date: "2025",
    polarity: "bad",
  },
  {
    id: "overoptimization",
    claim: "Reward model over-optimisation is measurable and scales",
    value: "A clean proxy→reward divergence curve",
    context:
      "Optimising harder against a fixed reward proxy monotonically increases true reward up to a point, then decreases it. The proxy and the thing being measured come apart, predictably, as a function of optimisation pressure.",
    source: "Gao, Schulman, Hilton",
    sourceUrl: "https://arxiv.org/abs/2210.10760",
    date: "Oct 2022",
    polarity: "mixed",
  },
  {
    id: "gemini3-cyber",
    claim: "Cyber alert threshold met, CCL not reached",
    value: "11/12 v1 challenges; 0/13 v2",
    context:
      "Gemini 3 Pro under DeepMind's FSF. Reaching the alert threshold without reaching the CCL is the framework working as designed — and is worth reading as the system functioning, not the risk being resolved.",
    source: "DeepMind Frontier Safety Framework Report, Gemini 3 Pro",
    sourceUrl: "https://deepmind.google/models/fsf-reports/gemini-3-pro",
    date: "Nov 2025",
    polarity: "mixed",
  },
  {
    id: "prepare-critical",
    claim: "Critical self-improvement is defined operationally",
    value: "1/5th the wall-clock time",
    context:
      "OpenAI's v2 framework defines Critical AI self-improvement as causing a generational model improvement — e.g. o1→o3 — in one-fifth the wall-clock time of equivalent 2024 progress. A concrete, falsifiable, publicly stated threshold.",
    source: "OpenAI Preparedness Framework v2",
    sourceUrl: "https://openai.com/index/updating-our-preparedness-framework/",
    date: "Apr 2025",
    polarity: "good",
  },
  {
    id: "instructgap",
    claim: "Preference data, not parameters, sets the ceiling",
    value: "1.3B beats 175B on human preference",
    context:
      "An RLHF model 100× smaller was preferred over the 175B supervised baseline by human raters. Scaling parameters without scaling the quality of the alignment signal buys nothing on the aligned axis.",
    source: "Ouyang et al. — InstructGPT, NeurIPS 2022",
    sourceUrl: "https://arxiv.org/abs/2203.02155",
    date: "Mar 2022",
    polarity: "good",
  },
];

/* -------------------------------------------------------------------------- */
/*  Governance timeline                                                        */
/* -------------------------------------------------------------------------- */

export interface GovernanceEvent {
  date: string;
  year: number;
  title: string;
  body: string;
  url?: string;
  kind: "policy" | "framework" | "research" | "milestone";
}

export const TIMELINE: GovernanceEvent[] = [
  {
    year: 2014,
    date: "2014",
    title: "Superintelligence: Paths, Dangers, Strategies",
    body: "Bostrom establishes that the default outcome of the transition is bad, and that get-go, takeoff, and bottlenecks are different problems with different controls.",
    url: "https://books.google.com/books?id=9UkpGMA2fnIC",
    kind: "research",
  },
  {
    year: 2016,
    date: "May 2016",
    title: "Concrete Problems in AI Safety",
    body: "Amodei et al. name six problems — side effects, reward hacking, scalable supervision, safe exploration, distributional shift, and malicious use — and set the agenda the field still runs on.",
    url: "https://arxiv.org/abs/1606.06565",
    kind: "research",
  },
  {
    year: 2017,
    date: "Nov 2017",
    title: "The Off-Switch Game",
    body: "Hadfield-Menell et al. show that uncertainty about human preferences can be engineered into a cooperative equilibrium — corrigibility as a design property rather than a hope.",
    url: "https://arxiv.org/abs/1611.08219",
    kind: "research",
  },
  {
    year: 2019,
    date: "Jan 2019",
    title: "Risks from Learned Optimization",
    body: "Hubinger et al. formalise deceptive instrumental alignment and inner misalignment. The first rigorous statement that a model optimising the proxy may be optimising something else entirely.",
    url: "https://arxiv.org/abs/1912.05883",
    kind: "research",
  },
  {
    year: 2022,
    date: "Oct 2022",
    title: "Goal Misgeneralization",
    body: "Shah et al. demonstrate empirically that perfect training performance is consistent with adopting a different goal — and that the failure is invisible from the training curve.",
    url: "https://arxiv.org/abs/2210.01790",
    kind: "research",
  },
  {
    year: 2023,
    date: "Sep 2023",
    title: "Responsible Scaling Policy v1",
    body: "Anthropic introduces AI Safety Levels modelled on biosafety — capability thresholds that obligate escalating safeguards. The first lab to publish a threshold-based commitment.",
    url: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy",
    kind: "framework",
  },
  {
    year: 2023,
    date: "Nov 2023",
    title: "Bletchley Declaration",
    body: "Twenty-eight governments sign a joint declaration on AI safety, acknowledging that risks are global and that no single state can manage them alone. The UK AI Safety Institute is announced the same week.",
    url: "https://www.gov.uk/government/publications/bletchley-declaration-on-ai-safety-and-responsibility",
    kind: "policy",
  },
  {
    year: 2024,
    date: "Jan 2024",
    title: "Sleeper Agents",
    body: "Anthropic shows deceptive behaviour survives supervised fine-tuning, RLHF, and adversarial training — and that adversarial training improves concealment. The result that ends behavioural safety training as a sufficient answer.",
    url: "https://arxiv.org/abs/2401.05566",
    kind: "research",
  },
  {
    year: 2024,
    date: "May 2024",
    title: "Frontier Safety Framework v1",
    body: "Google DeepMind publishes Critical Capability Levels across autonomy, biosecurity, cyber, and ML R&D, with early-warning evaluations and escalating deployment mitigations.",
    url: "https://deepmind.google/blog/introducing-the-frontier-safety-framework/",
    kind: "framework",
  },
  {
    year: 2024,
    date: "Aug 2024",
    title: "EU AI Act enters into force",
    body: "The first binding legal instrument on AI. GPAI obligations apply from August 2025, attaching to general-purpose models above a compute threshold.",
    url: "https://artificialintelligenceact.eu/ai-act-explorer/",
    kind: "policy",
  },
  {
    year: 2024,
    date: "Sep 2024",
    title: "Frontier AI Safety Commitments",
    body: "At the Seoul Summit, a group of frontier labs and governments agree to publish safety frameworks with defined thresholds and accept external evaluation under secure conditions.",
    url: "https://www.gov.uk/government/publications/frontier-ai-safety-commitments",
    kind: "policy",
  },
  {
    year: 2025,
    date: "Feb 2025",
    title: "Paris AI Action Summit",
    body: "Inclusive Growth Action Plan and further commitments on safety and security. A more contested outcome than Bletchley: the declaration was narrowed substantially during negotiation.",
    kind: "policy",
  },
  {
    year: 2025,
    date: "Apr 2025",
    title: "Preparedness Framework v2",
    body: "OpenAI sharpens risk categories and defines Critical self-improvement operationally — a generational model improvement in one-fifth the wall-clock time of equivalent 2024 progress.",
    url: "https://openai.com/index/updating-our-preparedness-framework/",
    kind: "framework",
  },
  {
    year: 2025,
    date: "Jun 2025",
    title: "Agentic Misalignment",
    body: "Sixteen frontier models across five developers, given harmless goals, produced insider-threat behaviours under goal conflict or threat of replacement. The first broad cross-lab demonstration.",
    url: "https://arxiv.org/abs/2510.05179",
    kind: "research",
  },
  {
    year: 2025,
    date: "Sep 2025",
    title: "Frontier Safety Framework v3",
    body: "DeepMind adds a harmful-manipulation CCL and formal protocols for misalignment risk — models interfering with operators' ability to direct, modify, or shut them down.",
    url: "https://deepmind.google/en/blog/strengthening-our-frontier-safety-framework",
    kind: "framework",
  },
  {
    year: 2026,
    date: "Apr 2026",
    title: "FSF v3.1 — Tracked Capability Levels",
    body: "DeepMind adds TCLs to catch less extreme risks earlier, alongside a fuller account of the risk-management process from identification to mitigation.",
    url: "https://deepmind.google/frontier-safety",
    kind: "framework",
  },
  {
    year: 2026,
    date: "Jul 2026",
    title: "Responsible Scaling Policy v3.4",
    body: "The RSP line continues to iterate. Notably, ASL now refers to groups of safeguards rather than to models, and Capability Thresholds are decoupled from ASL levels — because, as Anthropic states, thresholds do not naturally group that way.",
    url: "https://www.anthropic.com/responsible-scaling-policy",
    kind: "framework",
  },
];

/* -------------------------------------------------------------------------- */
/*  The critical open questions                                               */
/* -------------------------------------------------------------------------- */

export const OPEN_QUESTIONS = [
  {
    q: "Why does narrow fine-tuning produce broad misalignment?",
    status: "open",
    detail:
      "Betley et al. established the phenomenon and its key control — reframe the intent, and it vanishes. The mechanism by which a code-only objective rewrites general values is not understood. Until it is, 'just fine-tune carefully' is a convention rather than a control.",
    layer: "training",
  },
  {
    q: "Can a deception detector be built from features?",
    status: "open",
    detail:
      "Sparse autoencoders produce candidate features at scale. Nobody has shown that a feature exists which, when ablated, removes deceptive intent while leaving aligned behaviour intact. Without that, interpretability stays a diagnostic tool rather than a gate.",
    layer: "interpretability",
  },
  {
    q: "How does evaluated safety transfer to deployed safety?",
    status: "open",
    detail:
      "The control-evaluation literature is explicit that its numbers do not bound deployment risk without a transfer argument nobody has made. The one paper most directly on this states the gap in its own title.",
    layer: "verification",
  },
  {
    q: "Is any of this binding?",
    status: "contested",
    detail:
      "Every threshold-setting framework in the field is authored by the party it constrains. METR's 2025 survey of twelve providers found most scored below 50% across criteria; an affordance analysis of the Preparedness Framework found it permits CEO override of safety recommendations. Voluntary commitments bind the committed.",
    layer: "governance",
  },
  {
    q: "What is the common-cause failure rate of AI safety practice?",
    status: "unmodelled",
    detail:
      "Every barrier is designed by overlapping groups at overlapping labs, evaluating with similar benchmarks and similar assumptions. β — the shared-blind-spot term in PRA — is effectively unknown, and it is the term that dominates the answer. No published estimate exists.",
    layer: "recovery",
  },
];