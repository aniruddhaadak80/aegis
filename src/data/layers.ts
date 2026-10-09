/**
 * AEGIS — the control stack taxonomy.
 *
 * Seven layers, ordered by where a control sits relative to the model's
 * weights. This mirrors the standard alignment-taxonomy split (specification /
 * training-time / interpretability vs. containment / verification /
 * governance / recovery) but is organised around *when a barrier acts*
 * rather than around research groups.
 */

export const LAYERS = [
  {
    id: "specification",
    index: 1,
    name: "Specification",
    color: "var(--color-L1)",
    hex: "#38bdf8",
    tagline: "Getting the objective right",
    blurb:
      "Every downstream control inherits the flaws of the objective it is enforcing. Specification work asks: what does “good” mean here, who defines it, and can we learn it without encoding the provider's guesses as ground truth?",
    acts: "At reward-design time — long before deployment.",
    question:
      "Can we get the model's notion of good from the world, rather than from us?",
    layersOfDefense: 2,
  },
  {
    id: "training",
    index: 2,
    name: "Training",
    color: "var(--color-L2)",
    hex: "#818cf8",
    tagline: "Shaping behaviour into the weights",
    blurb:
      "Preference optimisation, adversarial pressure, erasure and reward-model correction. These controls change what the model is, which is far cheaper than changing what it does — and far harder to audit after the fact.",
    acts: "During gradient updates.",
    question: "What behaviour do we actually bake in, and does it survive?",
    layersOfDefense: 3,
  },
  {
    id: "interpretability",
    index: 3,
    name: "Interpretability",
    color: "var(--color-L3)",
    hex: "#c084fc",
    tagline: "Reading the mechanism, not the output",
    blurb:
      "Probing, sparse feature extraction, activation patching and attribution graphs. Interpretability is the only family of controls that can produce evidence about internals — which makes it both the most informative layer and the least mature.",
    acts: "On activations, at inference time.",
    question: "Can we see the feature, not just score the sentence?",
    layersOfDefense: 2,
  },
  {
    id: "containment",
    index: 4,
    name: "Containment",
    color: "var(--color-L4)",
    hex: "#fb923c",
    tagline: "Bounding what it can reach",
    blurb:
      "Sandboxes, weight protection, staged rollout and runtime monitoring. Containment does not require the model to be good — only confined. It is the layer that remains available when every other layer has failed.",
    acts: "At deployment and execution time.",
    question: "If it turns out to be adversarial, what can it actually touch?",
    layersOfDefense: 4,
  },
  {
    id: "verification",
    index: 5,
    name: "Verification",
    color: "var(--color-L5)",
    hex: "#facc15",
    tagline: "Proof instead of plausibility",
    blurb:
      "Formal verification, control evaluations under red-teaming, and machine-checkable safety cases. Verification is the only layer that can convert “we tested it and it seemed fine” into a claim a sceptic has to refute.",
    acts: "Before release, and adversarially thereafter.",
    question: "What would falsify this claim, and have we looked?",
    layersOfDefense: 2,
  },
  {
    id: "governance",
    index: 6,
    name: "Governance",
    color: "var(--color-L6)",
    hex: "#4ade80",
    tagline: "Rules that outlive any single lab",
    blurb:
      "Capability thresholds, external audit, compute controls, incident reporting. Governance is the only layer that binds parties who will not share your incentives — and therefore the only defence against a race you do not control.",
    acts: "Across institutions and jurisdictions.",
    question: "Who checks the checker, and what happens when they disagree?",
    layersOfDefense: 3,
  },
  {
    id: "recovery",
    index: 7,
    name: "Recovery",
    color: "var(--color-L7)",
    hex: "#fb7185",
    tagline: "Surviving the failure you did not prevent",
    blurb:
      "Interruptibility, shutdown, rollback, revocation and post-incident forensics. Recovery assumes defeat. Every serious safety programme is judged by how it behaves on the day the model is better than the plan.",
    acts: "Under adversarial conditions.",
    question: "When it goes wrong, how do we stop it and start again?",
    layersOfDefense: 3,
  },
] as const;

export type LayerId = (typeof LAYERS)[number]["id"];

export const LAYER_MAP = Object.fromEntries(LAYERS.map((l) => [l.id, l])) as Record<
  LayerId,
  (typeof LAYERS)[number]
>;