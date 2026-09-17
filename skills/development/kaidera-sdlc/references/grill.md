# Grill: the interrogation protocol

Merged from grill-me (interview relentlessly, one question at a time), molten-validate
(modes, scoring, riskiest assumption, artifact-first) and the gstack plan reviews (CEO, eng,
design, DevEx lenses). Use it on an idea, an intent, a spec, a plan, a handoff, or a claim.

## Pick a mode first, then load nothing else

| Mode | Signals | Depth | Output |
|---|---|---|---|
| **Quick grill** | one-liner, "sanity check", a handoff summary, no time, and none of the forcing conditions below | 5 to 8 questions, one lens | a scored gap list in the artifact |
| **Full grill** | a new epic, a plan before build, "stress-test this", anything touching data, money, security or a customer | every branch of the decision tree, all lenses that apply | the artifact rewritten until it stands alone |
| **Re-grill** | an artifact exists and reality moved: a review came back, an experiment ran, a ruling changed | only the branches that changed | a dated amendment |

**Risk beats urgency.** Full mode is forced, whatever the signal, for: an incident or an
alert; destructive work (THE_WAY §14: restore, reset, clean, rm, down, force); security;
money; customer data; a migration; a removal or a fold; any cross-project change. "No time"
and "a handoff summary" change the pace of the answers, never the set of questions: a forced
question without an answer is written into the artifact as an owned unknown that blocks the
plan, not skipped. The pre-approved rollback route in `bands.yaml` runs before the grill; the
grill governs everything after it. Quick mode is for work none of the above touches.

If the mode is still ambiguous, ask once: "Quick grill from what you gave me, full grill
branch by branch, or re-grill the existing artifact?"

## Operating rules

1. **One question at a time.** Wait for the answer. Several questions at once bewilder.
2. **Facts are yours to find, decisions are theirs to make.** If a fact is in the filesystem,
   the repo, Cortex, or a tool, look it up. Put every decision to the human and wait.
3. **Use the multiple-choice tool** when the options are discrete; number free-text
   questions so they can be answered by reference (voice users dictate).
4. **Walk the decision tree.** Each answer opens or closes branches; resolve dependencies
   between decisions one by one; do not skip to the interesting branch.
5. **Do not act until shared understanding is confirmed.** The exit test: someone who was
   not in the conversation could execute from the artifact alone.
6. **Write, then point.** The result goes into the artifact (intent, spec, plan). In chat,
   point at the file; do not recap it.
7. **Challenge the premise before the details.** The first branch is always "should this
   exist, and is this the narrowest thing that proves it?"

## The forcing questions (ask the ones the branch needs, in this order)

1. What problem, in the originator's words? Who feels it, and what do they do today instead?
2. Why now? What changed?
3. What is the proposed outcome, stated so it could be measured?
4. What is the narrowest wedge that tests the riskiest assumption? What would falsify it?
5. Who and what is affected: users, systems, data, other projects, the platform boundary?
6. Which constraints are real (policy, security, licence, budget, ruling) and which are habit?
7. What could break, and which step is the riskiest? What is the blast radius?
8. Which alternatives were considered and why were they not chosen?
9. What is the proof? Which command, test, screenshot or receipt shows it worked?
10. What is the rollback, and has it been rehearsed?
11. What stays human here: which approval, which judgement, which taste call?
12. What do we not know yet, and who owns finding out?
13. For a removal or a fold only: which definitions, files, migrations and config keys go,
    listed by name from the merged tree, not from the branch diff? Which consumer surfaces
    still reference each one? Does the diff touch an applied migration (any byte, comments
    included: refuse, applied migrations are immutable)? What post-fold proof would expose a
    deletion the three-way merge kept silently: the symbol-loss scan (every deleted
    definition grepped for surviving references in the merged tree) plus the full fitness and
    consumer suites on the merged SHA, never a filtered run? (The W11 fold of 2026-09-03 is
    the scar: every unit suite stayed green while live canonical code was deleted.)

## Lenses (apply the ones the artifact needs; name the lens when you use it)

- **Product / CEO lens** (gstack plan-ceo-review): rethink the problem; is there a ten-star
  version; expand or cut scope only when it makes a better product; kill sunk-cost branches.
- **Engineering lens** (gstack plan-eng-review, THE_WAY §10 change isolation): architecture,
  data flow, migrations and their immutability, edge cases, failure modes, test coverage,
  performance under the real engine, one concern per commit.
- **Design and DevEx lens** (gstack plan-design-review, plan-devex-review): the operator's
  first five minutes, the magical moment, friction points, the empty state, the error text.
- **Security lens** (strix skills, security/*): trust boundaries, secrets, injection, PII in
  logs, least privilege, what an attacker does with this change.
- **Validation lens** (molten-validate): score the idea on evidence, red flags, and a
  falsifiable experiment before anyone builds; the riskiest assumption gets tested first.
- **Adversarial lens** (the reviewer's adversarial review, THE_WAY §13): try to refute every
  claim with evidence; a claim without a command that can fail is a claim, not a finding.

## Scoring (full grill only)

Score each of these 0 to 5, total out of 50, and write the score into the artifact: problem
clarity, evidence of demand or need, narrowness of the wedge, measurability of the outcome,
technical feasibility on our stack, policy fit (security, licence, rulings), blast radius and
reversibility, proof design, ownership and capacity, and "what stays human" clarity.

Every criterion carries two lines, or it scores 0: the source or receipt (a path, a command
with its output, a Cortex record, a measurement; "we believe" is not a source) and the
counter-evidence (what argues for a lower score) or, when there is none yet, an owned unknown
(who finds out, by when). Counter-evidence and refuted claims stay in the artifact with their
reasons; they are not deleted when the score moves.

Thresholds: under 25, do not build; write the experiment. 25 to 39, build the wedge only. 40
and above, plan it. Whatever the criteria sum to, the total is capped at 39 until all three
are resolved: the riskiest-assumption experiment has run and its result is in the artifact;
the proof names a command that can fail, with its expected output; the rollback has been
rehearsed and its receipt is in the artifact. A capped artifact says which of the three is
open and routes to the experiment or the wedge, never to the plan.

## Exit

The grill ends with: the mode used (and, if Full was forced, which condition forced it), the
score if any and whether it is capped, the decisions taken (by whom), the open questions
with owners, and the next stage. That block goes at the top of the artifact.
