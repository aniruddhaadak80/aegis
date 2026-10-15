# The model

A technical reference for the mathematics in [`src/lib/pra.ts`](../src/lib/pra.ts).
This document is for readers who want to check the arithmetic rather than
trust it. Everything here is covered by assertions in
[`scripts/verify-pra.ts`](../scripts/verify-pra.ts).

## Why two stages

The single most important design decision in AEGIS is that the fault tree has
**two stages**, and that they are not interchangeable.

Modelling every control as one flat AND-stack is a common and serious error.
It makes a good specification control look like it *blocks* a dangerous event,
which it does not. It also means an empty stack trivially "passes" every gate.

**Stage 1 — Initiation.** Specification, training and interpretability
controls do not block an event. They change how likely it is that a dangerous
capability arises at all. They therefore *discount* the initiating probability
and compose multiplicatively in that role:

$$P_{\text{initiate}} = P_{\text{base}} \cdot \prod_{i}(1 - e_i)$$

**Stage 2 — Defeat.** Containment, verification, governance and recovery
controls are runtime barriers. The event is not contained unless *every one of
them* holds, so they compose as a series system:

$$Q_{\text{defeat}} = 1 - \prod_{j}(1 - q_j)$$

**Catastrophe** is the intersection:

$$P_{\text{catastrophe}} = P_{\text{initiate}} \times Q_{\text{defeat}}$$

### The consequence that matters

Adding any barrier with $q < 1$ multiplies the result by $q < 1$ and therefore
**reduces** catastrophic risk. That is the defining mathematical property of
defence in depth, and it falls out of the model rather than being asserted.

The test suite verifies it directly: risk falls strictly and monotonically as
the stack deepens from 1 to 12 barriers.

## The β-common-cause floor

Redundancy is powerless against a shared defect. The engine applies the
IEC 61508-6 **β-factor model**, where of the failures in a group of similar
elements, a fraction β is attributable to a common cause anchored to the most
reliable member:

$$q_{\text{ccf}} = \beta \cdot \min(q_i)$$

$$P_{\text{defeat}} = P(\text{all fail}) + q_{\text{ccf}} - P(\text{all fail}) \cdot q_{\text{ccf}}$$

At β = 0 this reduces exactly to the independent all-fail probability, as it
must. But for an AI safety stack this term is emphatically **not** zero: if
every barrier was designed by overlapping teams, evaluated against shared
benchmarks, and rests on the same untested assumption about model internals,
then one conceptual error propagates through the whole stack.

**With β = 0.4 and a best barrier of q = 0.3, no amount of additional
deployment removes 12% joint failure.**

The test suite asserts that β raises risk and never lowers it, at every value.

## Importance measures

The engine ranks barriers by four classical reliability measures. They answer
different questions and can disagree — which is why the app shows all four.

| Measure | Definition | Question it answers |
|:--|:--|:--|
| **Birnbaum** | $\partial P(\text{all fail})\,/\,\partial q_i = \prod_{j \neq i} q_j$ | How much does the escape probability move per unit change in this barrier's unavailability? |
| **Fussell–Vesely** | $P(\text{saved}_i)\,/\,\sum_j P(\text{saved}_j)$ | What share of the escapes did this barrier alone prevent? |
| **RAW** | $1\,/\,(1 - \prod_{j \neq i} q_j)$ | How many times worse is the deployment if this barrier *can* fail, versus if it were perfect? |
| **RRW** | $1 - q_i$ | What fraction of the escape probability does this barrier remove? |

A weak barrier carries little risk-reduction worth even though removing it is
catastrophic. **That asymmetry is exactly what makes a single weak slice in
the Swiss-cheese stack so damaging**, and it is why AEGIS surfaces all four.

The test suite verifies each against a hand-computed two-barrier worked
example, and asserts that Fussell–Vesely shares sum to exactly 1.

## Marginal value per unit cost

The ranking that answers *"what should we build next?"* runs the full fault
tree once per control — switching each off in turn and measuring the resulting
change in final catastrophe probability.

An initiation control and a runtime barrier are not comparable on $q$ or $e$,
but they are **directly comparable on catastrophe probability removed per unit
cost**. This is the reason the model has to be two-stage.

### Leave-one-out, not Shapley

The efficiency values are **leave-one-out (LOO)** marginal values, not Shapley
values. Removing one control while the others remain in place under-attributes
the joint benefit: with two identical barriers each is credited 0.21 rather
than 0.455, because each one's value depends on the other still being there.

LOO is what an engineering team can actually act on ("what if we dropped this
one?") and the ranking is what matters. The values do not sum to the total risk
removed, and asserting that they do would be asserting a Shapley decomposition
the model does not compute. The test suite asserts the inequality explicitly.

## The empty-stack invariant

An empty barrier set provides **no defence**: $Q_{\text{defeat}} = 1$.

This is the single most important line in the engine, because the naive
implementation of a product over an empty set returns 1 by convention, which
turns "we deployed no barriers" into "the event cannot happen." The test suite
asserts it directly.

## Reference barriers

For scale, not for merit:

| Domain | Unavailability $q$ | Standard |
|:--|--:|:--|
| Nuclear — safety-critical channel | $10^{-9}$ | 1 in a billion demands |
| Aviation — flight control | $10^{-7}$ | per flight hour |
| Nuclear — typical safety system | $10^{-6}$ | IEC 61508 SIL 4 |
| Medical device | $10^{-6}$ | ISO 14971 tolerable |

AI control barriers sit **orders of magnitude above** these values. That gap is
the honest headline of the whole project.

## What this model is not

**These are structural models, not predictions.** The $q$ values are calibrated
editorial estimates from the literature, not measurements of any real system.
The model exists to make the *structure* of the problem legible — to let you
see that a cheap 34%-efficacy control can outrank an expensive 60%-efficacy one
on risk removed per unit cost — not to forecast outcomes.

The one number with no published estimate at all is $P_{\text{base}}$, which is
why it is deliberately user-set and deliberately high.
