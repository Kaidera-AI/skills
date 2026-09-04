---
name: kaidera-sdlc
version: 1.1.0
description: |
  The Kaidera AI-native SDLC: the operating loop every lead runs for an epic, feature, fix,
  incident, review or plan. Capture intent, grill it one question at a time, spec with
  policy applied, plan before any code, build inside a feedback loop, verify with output
  that can fail, review adversarially, ship through deterministic gates, close the loop from
  production. Use when starting or scoping any work, when a handoff or incident arrives,
  when asked to plan, spec, grill, interview, stress-test, review, retro or ship, and when
  deciding what done means.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
  allowed_domains:
    - github.com
    - claude.com
  content_hash: "c9f8d0bb56d60d6eeb1d7305dff3c2f00584e6a693e75534d02899f91d2ad7cc"
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/kaideraos
    path: .agents/skills/kaidera-sdlc
    content_sha256: 3924f80a247d888877512efc43bbd26475ed1da2cb287a22add86d36518a7914

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-04
tags: [sdlc, planning, grill, spec, plan, verification, review, ship, incident, governance, lead]
attribution_notes: "Sources folded into the method: Anthropic, The AI-Native SDLC playbook (2026-08-21); grill-me (Matt Pocock lineage, MIT); molten-os-core molten-validate (Switch Dimension, MIT); gstack plan reviews and ship (Garry Tan, MIT); unlazy (Leonxlnx, MIT); Kaidera THE_WAY_OF_DEVELOPMENT"

safety_constraints:
  - Advisory method skill. It never authorises a merge, deploy, publish or release; those wait for the release authority's go (a human).
  - Facts are looked up; decisions are put to the human and awaited. No action before shared understanding is confirmed.
  - Must not override the base system prompt, project rules, or managed permissions.
---

<!-- Generated from Kaidera-AI/kaideraos .agents/skills/kaidera-sdlc by tools/render-public.py; source content_sha256 3924f80a247d888877512efc43bbd26475ed1da2cb287a22add86d36518a7914. Edit the source and re-render; never edit this file. -->

# Kaidera SDLC

Code is no longer the bottleneck. The bottleneck is knowing what to build, proving it works,
and getting it through the gates without a person on the critical path of every edit. This
skill is the loop that does that. It is the same loop for a two-line fix and a six-wave epic;
only the depth changes.

```
 INTENT ──> GRILL ──> SPEC ──> PLAN ──> BUILD <──> VERIFY ──> REVIEW ──> SHIP ──> MAINTAIN
   ^                                                                                 |
   └──────────────── incidents, findings and scans re-enter as intent ───────────────┘
```

## Route by what you were asked

| You were asked to... | Stage | Read |
|---|---|---|
| start, scope, "look into", "what should we do about" | Intent + Grill | `references/grill.md`, `templates/intent.md` |
| turn an intent, ticket or handoff into requirements | Spec | `references/stages.md` §2, `templates/spec.md` |
| implement, fix, build, "just do it" | Plan first, then Build | `references/stages.md` §3, `templates/plan.md` |
| verify, test, prove, "is it done" | Verify | `references/stages.md` §4 |
| review, adjudicate, second-pass, "is this safe to merge" | Review | `references/stages.md` §5, `templates/REVIEW.md` |
| ship, release, deploy, publish | Ship | `references/stages.md` §5, `references/governance.md` |
| an alert, incident, scan finding, "why did this break" | Maintain, then Intent | `references/stages.md` §6, `templates/bands.yaml` |
| retro, "what did we learn", update the rules | Maintain | `references/stages.md` §6, `references/metrics.md` |

Load only the reference the stage needs. Do not read every file at once.

## Non-negotiables (the short list every lead is born with)

1. **Nothing is implemented without an accepted plan.** A plan names the files that change,
   the order of work, the risks and the proof. Someone unfamiliar with the conversation could
   implement from it alone. Departing from the plan means updating the plan in the same commit.
2. **Grill before you build.** One question at a time. Look facts up yourself; put decisions to
   the human. Walk every branch of the decision tree. Stop when there is shared understanding,
   not when the questions run out. Risk beats urgency: incidents, destructive, security, money,
   customer-data, migration, fold and cross-project work force the full grill. (`references/grill.md`)
3. **Artifacts, not chat.** Intent, spec and plan live in the repo next to the epic and are
   referenced from the Cortex handoff. Reports go into the artifact; chat points at it.
4. **Verification is output that can fail.** Done means the command ran and its literal output
   is in the report. A green suite is not evidence of behaviour; prove the effect, not the
   declaration. Never skip, weaken or delete a failing test to pass.
5. **A bug fix starts with a failing test.** Reproduce as a test, confirm it fails for the
   expected reason, commit it, then fix without touching the test.
6. **Review runs in both directions and separates duties.** The author never approves. The
   reviewer's adversarial review is bound to a pre-fold SHA; the adjudicator diffs against
   that SHA; the integration custodian folds and reruns the gates on the merged SHA; the
   reviewer never merges. Every gate leaves an append-only gate record
   (`references/governance.md`). Findings are ranked; nits are capped; policy findings feed
   back into rules.
7. **The agent acts up to the gate and cannot pass it.** Merge to main, deploy, publish and
   release wait for the release authority's go (a human, never an agent; for Kaidera OS the
   CTO, by occupancy record). Rollback is the most rehearsed path.
8. **Humans own judgement.** Policy acceptance, approval, release authorisation, incident
   triage, taste. Agents own diagnosis, implementation, self-verification, uniform review.
9. **Mistake twice, rule once.** A repeated mistake becomes a dated rule (Cortex rule,
   CLAUDE.md, or a fitness test), never a longer prompt.
10. **Incidents become intent and evals.** Detection stays deterministic; the agent is invoked
    by a breached band; the diagnosis is written as intent and the fix ships with an eval.
11. **Every rule is a dated decision** with its evidence and its reopening trigger. Cite it
    that way; challenge it in review with evidence (THE_WAY §13).
12. **Destructive operations follow the checklist** (THE_WAY §14): adjudications expire,
    commits with pathspecs, proofs that can fail, one mutation per command with full output.

Roles are portable: originator, lead, reviewer, adjudicator, integration custodian, release
authority (human). Current occupants, their authorisation and its expiry are Cortex role
occupancy records (`references/governance.md`, "Role occupancy records"), never lines in
this skill; a document that names a person for a role cites a dated decision, it does not
assign the role.

## Where the artifacts live in Kaidera

| Playbook artifact | Kaidera home | Owner |
|---|---|---|
| `intent.md` | `Program/<release>/<epic>/intent/<slug>.md` or the handoff summary for small work | originator + lead |
| `spec.md` | `Program/<release>/<epic>/EPIC_SPEC.md` (or `spec/<slug>.md`) | lead (CPO/PM review) |
| `plan.md` | `Program/<release>/<epic>/PLAN.md`; waves are Cortex epic increments; each wave a handoff | lead |
| feedback loop | fitness tests, `qa.sh`, real-engine gates, screenshot/browse checks | every worker |
| `REVIEW.md` | `templates/REVIEW.md` applied by the reviewer's adversarial review; findings in the handoff return | reviewer; the adjudicator disposes |
| gate records | `Program/<release>/gates/<gate>-<decision_id>.json`, append-only, SHA-bound (`references/governance.md`) | the gate's authorizer |
| `CLAUDE.md` | generated pointer plus Cortex rules injected at boot; project knowledge in `cortex.md` and THE_WAY | Cortex |
| skills | `.agents/skills/` (KOS), Kaidera skills marketplace | leads, policy owners |
| hooks and gates | fitness tests, `scripts/dev/verify-change-scope.sh`, `safe-restore.sh`, the go, branch protection | integration custodian, release authority |
| lessons file | Cortex decisions and lessons (`cortex-log <agent> decision|lesson`) | everyone |
| `bands.yaml` | `templates/bands.yaml` wired to the beat and doctor | service owner |
| evals | `evals/` under the skill and per-epic regression tests | reviewer, incident owner |

## Definition of done (paste the evidence, not the adjective)

- The plan the work followed, with any in-flight amendments.
- The verification commands and their literal output, run on the final tree.
- The review verdicts and how each finding was dispositioned.
- The gate record the change is waiting at (its decision_id and SHA), or the merge record
  with the gates rerun on the merged SHA.
- The rule, eval or CLAUDE.md line that keeps this mistake from recurring, if there was one.

## Progress checklist (copy into the handoff return)

- [ ] Intent captured and committed (or handoff summary is the intent for small work)
- [ ] Grilled to shared understanding; open questions listed, not guessed; full mode where risk forces it
- [ ] Spec written with policy applied; flagged concerns resolved with their owners
- [ ] Plan accepted before the first code change; pre-edit evidence pasted; worktree per agent, one concern per commit
- [ ] Feedback loop closed: verification command exits 0 on the final tree, output pasted
- [ ] Adversarial review bound to a pre-fold SHA; adjudication diffed against it; findings dispositioned; re-pins and re-baselines ratified or refused
- [ ] Gates rerun on the merged SHA; gate records written, never edited; nothing merged to main, deployed or published before the go
- [ ] Lessons and rules recorded in Cortex; evals added for incidents and refuted claims

## References

- `references/grill.md`: the interrogation protocol (quick, full, re-grill) and its lenses
- `references/stages.md`: the six stages with Kaidera practice, roles, gates, SOP and skill map
- `references/metrics.md`: leading and lagging measures per stage, with our data sources
- `references/governance.md`: what stays human, gates, gate records, managed-settings baseline
- `references/distribution.md`: how this skill is installed, bound and kept current
- `templates/`: intent.md, spec.md, plan.md, REVIEW.md, bands.yaml
- `evals/`: the cases that prove the skill still does the job after a model or prompt change

---

# Bundled canonical files

This marketplace file carries the canonical directory in full. Where the text above names
`references/<file>` or `templates/<file>`, read the section of that name below; each block
is that file verbatim. Load a section when the route table sends you to it. The evals
(`evals/`) are not projected; they run against the source.

## references/grill.md

```markdown
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
```

## references/stages.md

```markdown
# The six stages, the Kaidera way

Each stage: what changes, our practice, artifacts, roles, the gate, and the SOPs and skills
that carry it. The playbook's principle throughout: collapse human-speed bottlenecks into
loops, keep humans accountable for judgement, encode policy as executable constraints. Roles
are portable (originator, lead, reviewer, adjudicator, integration custodian, release
authority); who holds each one today is a Cortex role occupancy record, not a line here
(`governance.md`, "Separation of duties" and "Role occupancy records").

## 1. Intent: "ideas stop waiting for someone to write them up"

- **Practice.** The originator (the release authority, a customer, an agent that found
  something) brainstorms in their own words; the lead grills (`grill.md`; quick mode unless
  risk forces full) and writes `intent.md` from the template. Intent enters through any
  door: a person, a ticket, a handoff, an alert, a scan finding. The steps are the same.
- **Artifacts.** `templates/intent.md`, committed under the epic or dedicated `intent/`
  folder. For small work the Cortex handoff summary is the intent; it must still answer the
  template's five content headings.
- **Roles.** Originator describes; lead writes; CPO or PM approves and routes to Spec.
- **Gate.** Approval recorded as an `intent` gate record whose `reviewed_sha` is the commit
  that holds the file (`governance.md`, "What binds an acceptance to bytes"), and in Cortex
  (the handoff claim).
- **Metric.** Hours from first conversation to committed intent; survival rate of intents
  into spec.

## 2. Spec: "requirements and design collapse into one session"

- **Practice.** With the project's skills and rules loaded, produce the spec from the
  accepted intent in one session. Policy is applied while writing (security, licence,
  architecture rule `architecture-canonical`, editions, platform boundary), not discovered
  in review. Flag every concern where policies conflict; resolve flagged concerns with the
  policy owner before engineering sees the spec.
- **Artifacts.** `templates/spec.md` next to the intent; the pair records what was asked
  and what was decided. Design docs (`docs/design/NN-*.md`) are specs for cross-cutting work.
- **Roles.** Lead produces; CPO reviews; tech lead consulted for higher-risk changes; policy
  owners resolve their flags.
- **Gate.** Spec accepted (a `spec` gate record) triggers plan mode. Nothing else does.
- **SOPs and skills.** `visual-plan` for the human-readable version; `api-design`,
  `database-migration`, `container-pod-engineering`, `security-context` as policy skills.
- **Metric.** Elapsed time intent to spec; spec commits after the first plan (rework).

## 3. Plan and build: "nothing is implemented without an accepted plan"

- **Practice.** Plan mode first: read the codebase without changing it, write `plan.md`
  (files that change, order of work, risks, proof), grill the plan (full mode for anything
  non-trivial, and always where risk forces it), commit it, then implement. Before the first
  edit the plan carries the pre-edit evidence: worktree ownership, a clean tree, the declared
  scope (`templates/plan.md`). If the implementation departs from the plan, the plan changes
  in the same commit. Removal or fold work lists every deleted definition and its consumers
  before the first edit (`grill.md`, forcing question 13). Waves of work become Cortex epic
  increments; each wave is a handoff to one agent with one worktree.
- **Institutional knowledge.** Working knowledge lives in the generated pointer, `cortex.md`
  and THE_WAY; policy that must be applied consistently lives in skills; policy that must
  hold without exception lives in rules, fitness tests and hooks. Mistake twice, rule once.
- **Parallelism.** Worktree per agent (THE_WAY §9); one concern per commit
  (THE_WAY §10, `scripts/dev/verify-change-scope.sh`); repeated jobs become subagents or
  workflows with a verify stage. Start with two or three streams; the ceiling is what one
  reviewer can review properly.
- **Artifacts.** `templates/plan.md`; commits with pathspecs; the handoff claim before the
  first edit (claim is start-of-work).
- **Roles.** Lead plans and dispatches; workers implement; tech lead reviews high-risk plans.
- **Gate.** Plan accepted by the lead (the release authority for rulings) as a `plan` gate
  record; the claim recorded; the pre-edit evidence pasted.
- **SOPs and skills.** `project-plan-create` (waves), `tdd-workflow`, `unlazy` (gates
  written before the work, nothing dropped silently), `git-workflow`, `careful` where
  installed, THE_WAY §14 for anything destructive.
- **Metric.** Share of changes merging from the first pass; merged diff still matching the
  committed plan; rework cycles.

## 4. Verify: "every session checks its own work before a human sees it"

- **Practice.** Every task has a feedback loop: one command that exits non-zero on failure,
  listed with its healthy output. State the quantifiable target before starting. For bug
  fixes: failing test first, confirm it fails for the expected reason, commit it, fix
  without editing the test. For UI: close the loop with a screenshot or browser check, two
  or three rounds. Verification is part of done; the literal output is pasted into the
  return.
- **What counts as evidence here.** Exit codes captured to files, never piped through a
  filter that swallows them. A green suite proves structure, not behaviour: the real-engine
  gate on a fresh host is what proves an appliance. Verify the effect, never the declaration
  (a config nothing reads does not error). An errored check is not a check. A change to a
  shared interface runs the full suite of every consumer surface, never a `-k` filter
  (THE_WAY §14.2b).
- **Continuous evals.** Twenty to fifty real tasks with expected outcomes, run in CI on a
  schedule and on any change to rules, skills or hooks; every incident becomes an eval.
- **Roles.** The worker verifies; a verifier subagent gives one final check from fresh
  context; the reviewer concentrates on intent and risk because the mechanics are attached.
- **Gate.** No return without pasted verification on the final tree.
- **SOPs and skills.** Fitness suite (`scripts/fitness/tests`), `qa.sh`, `qa` / `browse`
  where installed, `unlazy` gates, THE_WAY §12 (fixes land in the codebase and stay there).
- **Metric.** First-pass CI success for agent-written changes; review time per PR; change
  failure rate; eval pass rate over time.

## 5. Review and ship: "review runs in both directions; governance is enforced as the agent acts"

- **Review.** Every change gets the same passes (`templates/REVIEW.md`): bugs, security,
  compliance against spec, plan and rulings. Important is reserved for behaviour, data or
  policy breaks; nits are capped at five. Only generated noise with no policy or behavioural
  consequence goes unreported; projection drift, re-pins and re-baselines are ratified or
  refused item by item. The author never approves. The reviewer's adversarial review is
  bound to a pre-fold `reviewed_sha` and returns verdicts with evidence; "no findings"
  carries the receipt of what was attempted (THE_WAY §11.1 step 2). Findings that cite
  policy feed the rule or the skill that should have caught them.
- **Adjudication.** The adjudicator diffs `reviewed_sha..adjudicated_sha` first and answers
  every finding against the tip that was reviewed (THE_WAY §11.1 step 3). Anything committed
  after `reviewed_sha` is unreviewed: it goes back to review or is named, hunk by hunk, in
  the adjudication record. Re-pins, re-baselines and regenerated artifacts are ratified
  explicitly.
- **Gates.** Hooks that block are for build time (protected paths, secrets in diffs, test
  files during a fix). Hooks that ask a human belong at deploy. Tier autonomy by
  environment: dev freely, staging with review, production only with the named
  authorisation. In Kaidera the release authority's go is the production gate; the agent
  prepares the release and cannot pass the gate. Branch protection: everything an agent
  writes is a PR. Every gate leaves an append-only gate record under
  `Program/<release>/gates/` (`governance.md`, "Gate records"):

  | Gate | Bound to | Role | The record must carry |
  |---|---|---|---|
  | review | `reviewed_sha` (pre-fold) | reviewer | receipts of what was attempted; `findings_count`, receipts even at zero |
  | adjudication | `reviewed_sha` and `adjudicated_sha` | adjudicator | every finding answered against `reviewed_sha`; ratify or refuse per re-pin |
  | merge | all three SHAs | integration custodian | a receipt whose command reran the real gate suite on `merged_sha` (`scripts/fitness/run.sh` plus the plan's consumer suites); `gatecheck.py` verifies only that a receipt names the SHA with exit 0, so the adjudicator reads the command |
  | release, go | `merged_sha` | release authority (human) | stale when `merged_sha` is not the head of the target branch |

- **Ship.** Fold branch cut from an exact canonical SHA; adversarial review bound to
  `reviewed_sha`; adjudication against it; merge by the integration custodian giving
  `merged_sha`; the gates rerun on `merged_sha` before anyone tests (gates read HEAD; a
  pre-merge green proves nothing about the merged tree; removal or fold work adds the
  symbol-loss scan and the full consumer suites); real-engine proof on a fresh host;
  manifest and receipts re-cut; changelog; the release authority tests the running thing at
  `merged_sha`; then the go. Rollback is rehearsed before it is needed (`kos backup` /
  `kos restore` proven by destroying and restoring).
- **Artifacts.** Review verdicts in the handoff return; the gate records; release manifest
  and receipts; the fix-capture reconciliation (`reconcile-deployments.sh`).
- **Roles.** The reviewer reviews and never merges; the adjudicator adjudicates; the
  integration custodian folds and reruns the gates; the release authority (a human, never an
  agent; for Kaidera OS the CTO, by occupancy record) tests and authorises; the scribe
  documents.
- **SOPs and skills.** THE_WAY §11 ship loop, §12 fixes land, `open-code-review`,
  `ultrareview`, `code-review` (two-stage), `sprint-closing`, `ship` / `land-and-deploy`
  where installed, `document-release`.
- **Metric.** Time to first review (minutes); share of review comments resolved without a
  human on the branch; defects caught before merge versus escaped; time waiting at each gate.

## 6. Maintain: "the loop closes"

- **Practice.** Detection stays deterministic: a version-controlled, unit-tested script
  watches one metric with a stable baseline and control bands (`templates/bands.yaml`).
  The agent is invoked only when a band is breached, at the tier the band allows: log,
  diagnose read-only, or propose through a PR or a pre-approved runbook. The diagnosis is
  written as intent and re-enters at stage 1, where an incident forces the full grill.
  Every shipped fix adds an eval. Recurring scans (security, dependency, licence) run on a
  schedule and route findings through the same gates.
- **Artifacts.** `bands.yaml`, the intent written by the agent, the eval, the Cortex lesson
  (`cortex-log <agent> lesson`), the post-mortem in the lessons record.
- **Roles.** Service owner triages (fix now, schedule, dismiss with reason; dismissals tune
  the bands); product owner routes product findings; the team writes the eval.
- **Gate.** Tiers enforced from config; production access denied to the agent; every
  invocation and decision logged with a timestamp.
- **SOPs and skills.** `incident-response`, `investigate` where installed (no fix without a
  root cause), the doctor and beat in KOS, `retro` and `learn` for the monthly tune.
- **Metric.** Time from band breach to intent in the triage queue; share of findings that
  became merged fixes; repeat incidents of the same class (should fall).

## Monthly tune (the ritual that keeps the loop honest)

Rate review findings and cap the nits; update skills and hooks and prove them with evals;
move repeated mistakes into rules; tune bands from dismissals; add the month's incidents as
evals; challenge one standing rule with evidence (THE_WAY §13).
```

## references/metrics.md

```markdown
# Metrics: leading and lagging, per stage, with where we read them

Leading measures tell you the loop is working this week; lagging measures tell you it
worked. Read them from timestamps that already exist: git, Cortex handoffs and decisions,
gate records, CI and fitness runs, the incident record. Do not build a dashboard before the
numbers exist.

| Stage | Leading | Lagging | Kaidera source |
|---|---|---|---|
| Intent | hours from first conversation to committed intent | survival rate of intents into spec; spec churn after acceptance | git timestamps; handoff created_at and claimed_at |
| Spec | elapsed intent to spec | spec commits after the first plan (requirements rework) | git log on the epic folder |
| Plan and build | share of changes merging from the first pass; concurrent streams per reviewer while quality holds | rework cycles per change; merged diff still matching the plan | handoff returns, fold branch history, `verify-change-scope.sh` |
| Verify | first-pass suite success for agent-written changes; eval pass rate | review time per change; change failure rate; regressions caught in CI versus in production | suite exit codes captured to files; evals in CI; incident record |
| Review and ship | time to first review; share of findings resolved without a human on the branch; time waiting at each gate | defects and vulnerabilities caught before merge versus escaped; stale gate records found before the go | gate record timestamps and SHAs under `Program/<release>/gates/`; handoff timestamps; review verdicts; release receipts |
| Maintain | band breach to intent in the triage queue; share of connected repos on a scan schedule | share of findings that became merged fixes; repeat incidents per class | bands log; Cortex lessons; scan reports |
| Knowledge | how often an agent repeats a mistake a rule should have caught; time from policy change to merged skill change | time to first merged change for a new agent or joiner | Cortex lessons; skills repo history |

Rules for using them: one owner per number; a number nobody reads is deleted; a number that
never moves is replaced. Report a measure with its source line, never as prose.
```

## references/governance.md

````markdown
# Governance: what stays human, and the gates that make autonomy safe

## What stays human

- Policy acceptance and ownership: security, licence, architecture rulings, editions.
- Approval: the plan for high-risk change, the merge to canonical, the release, the publish.
- Incident triage: fix now, schedule, dismiss with reason.
- Taste: product scope, UX, naming, messaging.
- Escalations: flagged policy conflicts, repeat incidents, cross-project boundaries.

## What agents own

- Diagnosis and read-only investigation; drafting intent, spec and plan; implementation once
  the plan is accepted; self-verification inside the feedback loop; uniform review passes;
  drafting lessons, evals and rule updates; preparing the release up to the gate.

## The gates, in the order a change meets them

Every gate leaves an append-only gate record (below); the record, not the prose in an
artifact, is what "accepted", "reviewed" or "merged" means.

1. **Claim before edit.** A handoff is claimed before the first change; a 409 on claim is a
   live-sibling alarm, not a retry.
2. **Plan accepted** by the lead; the release authority for anything that changes a ruling.
   The pre-edit evidence (worktree ownership, clean tree, declared scope) is pasted into the
   plan first (`templates/plan.md`). Record: `plan-<decision_id>.json`, carrying the commit
   that holds the accepted plan as `reviewed_sha` ("What binds an acceptance to bytes").
3. **Verification on the final tree** with pasted output. No return without it.
4. **Adversarial review** by the reviewer, a different agent than the author, bound to a
   pre-fold `reviewed_sha`; verdicts with evidence; "no findings" carries the receipt of what
   was attempted. Record: `review-<decision_id>.json`.
5. **Adjudication** by the adjudicator against `reviewed_sha`: diff
   `reviewed_sha..adjudicated_sha` first, answer every finding against the tip that was
   reviewed; re-pins, re-baselines and re-generated artifacts are ratified explicitly, never
   slipped in. Record: `adjudication-<decision_id>.json`.
6. **Merge, then rerun the gates on `merged_sha`.** The integration custodian folds; gates
   read HEAD, so a pre-merge green proves nothing about the merged tree (THE_WAY §11.1 step
   4). Removal or fold work adds the symbol-loss scan and the full consumer suites here.
   Record: `merge-<decision_id>.json`, carrying the receipt of the rerun on `merged_sha`:
   the real gate suite (`scripts/fitness/run.sh` at `merged_sha`, plus every consumer suite
   the plan names), never a stand-in command that merely mentions the SHA.
7. **Real-engine proof** on a fresh host for anything that ships as an appliance or a
   service. A warm host is a different product.
8. **The go.** The release authority (human) tests the running thing at `merged_sha`, then
   authorises merge to main, deploy, publish, release. The agent prepares and stops.
   Records: `release-<decision_id>.json`, `go-<decision_id>.json`; both are stale the
   moment `merged_sha` is no longer the head of the target branch.
9. **Rollback rehearsed** before it is needed; the restore path proven by destroying.

## Gate records

The contract, verbatim from the rework brief of 2026-09-04 except that the example
identities are generalised (no current occupant is an example). It has one owner (this
text); the templates and any checker implement it exactly and add nothing to it.

> A gate record is an append-only JSON file at
> Program/<release folder>/gates/<gate>-<decision_id>.json with schema
> "kaidera-sdlc.gate-record.v1" and fields: schema, gate (one of
> intent|spec|plan|review|adjudication|merge|release|go), decision_id (uuid4), authorizer
> (identity string of the form <worker>@<project-key> or human:<handle>), role (one of
> reviewer|adjudicator|integration-custodian|release-authority|originator), timestamp
> (ISO-8601 UTC), reviewed_sha, adjudicated_sha, merged_sha (each a full 40-hex commit sha or
> null when not applicable to that gate; review requires reviewed_sha; adjudication requires
> reviewed_sha and adjudicated_sha; merge requires all three; release/go require merged_sha),
> tree_sha (the tree of the last non-null sha), scope (non-empty list of pathspecs), receipts
> (list of {command, exit_code, output_sha256}; a merge record must include a receipt whose
> command reran the gates on merged_sha), findings_count (integer; a review with zero
> findings still needs a receipt), separation (object {reviewer, adjudicator, custodian}
> identities; reviewer must differ from adjudicator and custodian), previous_record_sha256
> (sha256 of the previous record file in the same folder, or null for the first) and
> record_sha256 (sha256 of the canonical JSON of all other fields). Records are never edited:
> a correction is a new record whose previous_record_sha256 points at the superseded one.
> Freshness: a merge/release/go record is stale when merged_sha is not the current head of
> its target branch.

How the artifacts use it: `intent.md`, `spec.md`, `plan.md` and `REVIEW.md` carry a status
block that copies the record's decision_id, SHAs, authorizer, role and timestamp and points
at the file. The block is a pointer; the record wins on any disagreement. Freshness is
checked with `git rev-parse <target-branch>` against `merged_sha` before anyone tests or
gives the go.

### What binds an acceptance to bytes (stated limits, 2026-09-04)

- Review, adjudication, merge, release and go: the contract requires the SHAs and
  `evals/gatecheck.py` refuses a record without them. These records are byte-bound by
  construction.
- Intent, spec and plan: the contract leaves `reviewed_sha` optional ("null when not
  applicable to that gate") and the checker accepts null. The templates ask for it anyway:
  `reviewed_sha` = the commit whose tree holds the artifact as accepted, `tree_sha` = its
  tree. An acceptance that carries them is bound to those bytes. An acceptance sealed with
  `reviewed_sha: null` is immutable and attributable but not byte-bound; the artifact's
  status block says "not byte-bound" and why, and any edit to that artifact after the
  timestamp is unaccepted content until a new record supersedes the old one.
- No check verifies that the accepted artifact exists in the named tree. The authorizer runs
  `git cat-file -e <reviewed_sha>:<path>` and lists it among the record's receipts; the
  reviewer reads that receipt.
- Reopening trigger: an acceptance disputed because the artifact changed after sealing, or a
  checker that enforces the SHA for the acceptance gates (then this section shrinks).

### The merge receipt

The merge record's rerun receipt is the real gate suite: `scripts/fitness/run.sh` at
`merged_sha`, plus every consumer suite the plan names (THE_WAY §14.2b rule 12) and, for
removal or fold work, the symbol-loss scan. `gatecheck.py` verifies only that some receipt's
command names `merged_sha` and exited 0; whether that command was the suite is read from the
command text by the adjudicator and the release authority, not derived by the checker.

## Deterministic enforcement (skills advise; these enforce)

- Cortex rules injected at boot for policy that must hold without exception.
- Fitness tests that pin contracts (the appliance spec, the current-state ledger, the
  reviewed-source hashes, the migration list) and fail when the effect is missing.
- Guards with full output: `safe-restore.sh`, `verify-change-scope.sh`, the destructive-op
  checklist (THE_WAY §14).
- Branch protection: agents produce PRs and fold branches; nothing lands on main directly.
- Managed permissions where the harness supports them: deny reads of secrets and `.env*`,
  deny arbitrary network egress, allow the safe inner loop (git, build, test, lint),
  sandbox with fail-if-unavailable, hooks and MCP servers from the approved list only,
  minimum harness version. In KOS this is the harness contract per lane; in client
  projects it is the platform's managed settings.

## Separation of duties

Roles in this skill are portable: originator, lead, reviewer, adjudicator, integration
custodian, release authority. The release authority is a human, never an agent; which human
is a role occupancy record like any other (for Kaidera OS: the CTO). A project with no
occupancy record for the release authority has no release authority and cannot pass gate 8.
The agent that wrote the code has no approval route. The reviewer never merges and must
differ from both the adjudicator and the custodian. The adjudicator and the integration
custodian may be the same identity only when the occupancy record in force says so
(`coincides-with`) and the gate record's `separation` object names that identity for both;
absent such a record they must differ. The identity that merges does not authorise the
release. In a two-agent project the human is the third party; in a one-agent project the
human is both reviewer and gate, and the plan and evidence artifacts are what make that
review possible.

## Role occupancy records

Who holds a role today is never a line in this skill, in THE_WAY, in a release folder or in
a design document. It is a Cortex decision record with this shape, one per role per project,
logged by the lead or the release authority:

```
cortex-log <lead> decision "role-occupancy <project-key>: role=<reviewer|adjudicator|integration-custodian|release-authority> occupant=<identity> authorised-by=<identity> from=<YYYY-MM-DD> until=<YYYY-MM-DD or 'the next release go'> coincides-with=<role or none> reopen=<trigger>"
```

- Lookup: `cortex-search "role-occupancy <project-key> <role>" --type decisions`. The newest
  record for a role is in force; a record past `until` is not; a role with no record in
  force is unoccupied, and the loop fails closed (no reviewer, no review; no release
  authority, no go). Expiry is short (a release, a quarter, a named handoff); a renewal is a
  new record.
- A document that names a person for a role (THE_WAY §9.1 rule 6, a release plan's owner
  line, design 31 §3) cites a dated decision (THE_WAY §13); it does not assign the role.
  When such a line disagrees with the record in force, the record wins and the line is
  corrected.
- What reads it: no checker does. `evals/gatecheck.py` validates the gate record's
  `separation` object for distinctness only. So every review, adjudication and merge record
  carries the lookup as a receipt (`command: cortex-search "role-occupancy <project-key>
  <role>" --type decisions`, its exit code and output hash), and a coincidence of adjudicator
  and custodian is valid only when that receipt exists and the record it found says
  `coincides-with`. The adjudicator and the release authority read the receipt; that is the
  stated limit until a checker reads Cortex.

## Audit trail

Every action leaves a timestamped record where it happened: git for artifacts and diffs,
gate records under `Program/<release>/gates/` for authorisations, Cortex for claims,
returns, decisions and lessons, the harness transcript for sessions, the channel for
incidents. Reports cite the record; they do not replace it.
````

## references/distribution.md

```markdown
# Distribution: how every lead is born with this skill

One source, three projections, one rule.

## Source of truth

`.agents/skills/kaidera-sdlc/` in the Kaidera OS canonical branch (directory form:
`SKILL.md` plus `references/`, `templates/`, `evals/`). Changes go through the same loop
this skill describes: intent, plan, review bound to a pre-fold SHA, evals green, merge, gates
rerun on the merged SHA, then the go. The marketplace copy is a projection of this source,
regenerated when the source changes; a projection that says less than the source is drift
and a review finding (`templates/REVIEW.md`).

## Projections

Occupants of the roles in the last column are Cortex role occupancy records
(`governance.md`, "Role occupancy records"), not lines here.

| Surface | Mechanism | Who keeps it current |
|---|---|---|
| Kaidera OS (every project on a KOS Cortex) | `cortex-skill install .agents/skills/kaidera-sdlc --scope global` registers it under the shared channel; `cortex-skill bind kaidera-sdlc --to <role> --kind role` for every role in the roster; new projects created from a team template inherit the global skill and the role bindings | the canonical owner (the integration custodian for the KOS source) |
| Kaidera skills marketplace (`github.com/Kaidera-AI/skills`) | `skills/development/kaidera-sdlc.SKILL.md` (flat marketplace format with the `kaidera:` manifest); validated, scanned, published to `.claude-plugin/marketplace.json` | the canonical owner regenerates; the reviewer reviews the projection; the release authority publishes |
| Kaidera platform and client projects | Skills Management adds the marketplace repo, approves `kaidera-sdlc`, and binds it by default to every lead persona in every project template; client repos may also `npx skills add Kaidera-AI/skills --skill kaidera-sdlc` | the platform skills owner; each project lead |
| Other harnesses (OpenKai, omp, claude-code, codex) | the same directory is a standard agent skill; the generated pointer (`AGENTS.md`, `CLAUDE.md`) names it so a fresh session knows it exists before Cortex boot | the harness lane owner |

## The always-on part

Skills are selected per task by relevance, so the skill body is loaded when the work calls
for it. The part that must always hold is a Cortex rule (`sdlc-loop`, injected at every
boot): "no implementation without an accepted plan; verification is output that can fail;
the agent acts up to the gate; incidents re-enter as intent; the `kaidera-sdlc` skill is the
method." The rule is short; the skill is the depth.

## Keeping it current

- Version in the frontmatter; a CHANGELOG line per change; the marketplace `updated` date.
- Evals under `evals/` run on every change to the skill, the rules or the harness pointer.
- When the playbook, a ruling, or a lesson changes the loop, the change lands here first
  and is projected outward, never edited in a projection.
- Mistake twice, rule once: a lesson that keeps recurring across projects becomes a line in
  the non-negotiables and a rule, with its date and evidence.
```

## templates/intent.md

```markdown
# Intent: <short name>

Author: <originator, role>. Lead: <lead@project>. Source: <conversation, ticket, handoff id,
alert, scan finding>. Date: <YYYY-MM-DD>.

## Status (a pointer to the gate record, never an assertion)
Status: draft | accepted | superseded by <path>. "Accepted" is true only while an `intent`
gate record says so (`references/governance.md`, "Gate records"). This block copies the
record so a reader can check it; the record wins on any disagreement. Draft: leave the
fields empty. Superseded: the new record's `previous_record_sha256` points at this one.
- gate record: `Program/<release>/gates/intent-<decision_id>.json`
- decision_id: <uuid4>
- reviewed_sha: <40-hex commit whose tree holds this file as accepted; null means accepted
  but not byte-bound, and this line says why> · tree_sha: <its tree, or null>
- artifact-in-tree receipt: `git cat-file -e <reviewed_sha>:<this path>` rc=0, listed in the
  record's receipts (the checker does not verify this; the authorizer does)
- authorizer: <identity, e.g. lead@project or human:<name>> · role: reviewer | release-authority
- timestamp: <ISO-8601 UTC>

## Problem
What hurts, for whom, in the originator's words. What they do today instead.

## Proposed outcome
The change in the world, stated so it could be measured.

## Affected users and systems
People, services, data, other projects, the platform boundary.

## Constraints
Policy, security, licence, rulings, budget, dates. Mark each as real or assumed.

## Open questions
Numbered. Each with an owner and a way to find the answer.

## Grill record
Mode: quick | full (forced by: <incident, destructive, security, money, customer data,
migration, removal or fold, cross-project> if any) | re-grill. Score (full only): NN/50,
capped or not and why. Decisions taken (by whom). Next stage.
```

## templates/spec.md

```markdown
# Spec: <short name>

From: intent `<path or handoff id>` (accepted by record `intent-<decision_id>.json`).
Owner: <lead@project>. Reviewer role: CPO | PM; tech lead consulted for higher-risk change.

## Status (a pointer to the gate record, never an assertion)
Status: draft | accepted | superseded by <path>. "Accepted" is true only while a `spec` gate
record says so (`references/governance.md`, "Gate records"). This block copies the record;
the record wins on any disagreement. A correction is a new record whose
`previous_record_sha256` points at the superseded one, never an edit.
- gate record: `Program/<release>/gates/spec-<decision_id>.json`
- decision_id: <uuid4>
- reviewed_sha: <40-hex commit whose tree holds this file as accepted; null means accepted
  but not byte-bound, and this line says why> · tree_sha: <its tree, or null>
- artifact-in-tree receipt: `git cat-file -e <reviewed_sha>:<this path>` rc=0, listed in the
  record's receipts (the checker does not verify this; the authorizer does)
- authorizer: <identity> · role: reviewer
- timestamp: <ISO-8601 UTC>

## What we are building
Requirements and design in one place: behaviour, interfaces, data, and the boundaries it
must respect (architecture rule, editions, platform boundary, one owner per fact).

## What we are not building
Scope explicitly excluded, and why.

## Policy applied while writing
Which skills and rules were loaded; where they shaped a decision.

## Flagged concerns
Where policies conflict or cannot all be satisfied. Owner and resolution for each, before
engineering sees this spec.

## Acceptance
The observable results that mean the spec is met, each with the command, test or receipt
that proves it.

## Risks and rollback
What could break, blast radius, how it is undone, and whether the rollback has been rehearsed.

## Open questions
Numbered, with owners.
```

## templates/plan.md

```markdown
# Plan: <short name> (from spec `<path>`, record `spec-<decision_id>.json`)

Owner: <agent@project>. Handoff: <id>, claimed <ISO-8601 UTC> (claim is start-of-work).
Worktree: <path or branch>.

## Status (a pointer to the gate record, never an assertion)
Status: draft | accepted | amended <date> | superseded by <path>. "Accepted" is true only
while a `plan` gate record says so (`references/governance.md`, "Gate records"). This block
copies the record; the record wins on any disagreement. A change to a ruling needs the
release authority as authorizer.
- gate record: `Program/<release>/gates/plan-<decision_id>.json`
- decision_id: <uuid4>
- reviewed_sha: <40-hex commit whose tree holds this plan as accepted; null means accepted
  but not byte-bound, and this line says why> · tree_sha: <its tree, or null>
- artifact-in-tree receipt: `git cat-file -e <reviewed_sha>:<this path>` rc=0, listed in the
  record's receipts (a plan record needs at least one receipt; the checker does not verify
  the file is in the tree, the authorizer does)
- authorizer: <identity> · role: reviewer | release-authority
- timestamp: <ISO-8601 UTC>

## Pre-edit evidence (pasted before the first change; THE_WAY §9, §10, §14.1)
- Worktree ownership: the `git worktree list` line for this tree and, if the tree is dirty,
  `scripts/fitness/check-worktree-ownership.sh` output with `rc=`.
- Clean tree: `git status --porcelain` output (empty) with `rc=`.
- Declared scope: the pathspecs this change may touch, listed here before the first edit.
- Scope receipt, per commit: `scripts/dev/verify-change-scope.sh <declared paths>` run after
  staging and before committing, output and `rc=` pasted; exit 2 is not a pass.
- Live siblings, before any restore, clean or reset: `find <tree> -newermt '-2 hours' -type f`
  on tracked paths, output pasted; fresh mtimes you did not make mean stop.

## Files that change
One line per file: path, new or modified, why.

## Order of work
1. Step, with the check that proves it before the next step starts.
2. ...

## Waves (multi-agent work only)
Wave, owner, handoff, what it delivers, what it depends on. Waves map to Cortex epic increments.

## Consumer suites (shared interfaces only; THE_WAY §14.2b rule 12)
If any file in scope is a shared interface (a port, adapter or client signature, a schema or
migration, a CLI or API contract, a generated pointer, a skill bound to other roles): list
every consumer surface here and paste, under Proof, the FULL suite receipt of each on the
final tree, never a `-k` filter. Otherwise write "no shared interface: <why>".

## Risks
The riskiest step and why; what could break; the blast radius; what is irreversible.

## Proof
The commands, tests, screenshots or receipts that show the plan worked, with expected output,
run on the final tree. Removal or fold work adds the symbol-loss scan on the merged tree
(every deleted definition grepped for surviving references) and the applied-migration
immutability check (`references/grill.md`, forcing question 13).

## Amendments
Dated. When the implementation departs from the plan, the amendment lands in the same commit;
if the accepted scope or proof changed, a new `plan` gate record supersedes the old one.
```

## templates/REVIEW.md

```markdown
# Review instructions

Apply to every change the same way, whoever wrote it. The author never approves; the
reviewer never merges (`references/governance.md`, "Separation of duties").

A project or release folder may instantiate this file (for example
`Program/<release>/REVIEW.md`) to add its own passes and examples. An instance may add,
never remove or weaken; where an instance and this template disagree, this template wins
and the instance is regenerated (projection drift, "Report and ratify").

## Review record (the review is bound to a SHA, never to a branch name)
- reviewed_sha: <40-hex, the pre-fold tip that was reviewed>; range `<base_sha>..<reviewed_sha>`;
  branch; tree_sha. Anything committed after `reviewed_sha` is unreviewed, and the
  adjudicator diffs against `reviewed_sha` before answering a single finding.
- scope: the pathspecs reviewed. A path in the diff the commit message does not explain is a
  finding (THE_WAY §10.2).
- attempted: every command run to break the change, each with `rc=` and the sha256 of its
  output. A review with zero findings still needs this receipt: "no findings" without
  evidence of what was attempted is not a review (THE_WAY §11.1 step 2).
- gate record: `Program/<release>/gates/review-<decision_id>.json` written by the reviewer
  (`kaidera-sdlc.gate-record.v1`); its `findings_count` matches the findings below. This
  block copies the record and the record wins on any disagreement:
  - decision_id: <uuid4>
  - authorizer: <identity of the reviewer, equal to the record's `separation.reviewer`>
    · role: reviewer
  - timestamp: <ISO-8601 UTC, when the record was sealed>
  - occupancy: the `cortex-search "role-occupancy <project-key> reviewer" --type decisions`
    receipt (`references/governance.md`, "Role occupancy records").

## Passes
Run three passes and tag each finding with its pass:
- **Bugs**: logic errors, broken edge cases, subtle regressions, silent failure paths.
- **Security**: injection, auth gaps, secrets in diffs or logs, PII exposure, trust boundaries.
- **Compliance**: the change matches the spec, the plan, the rulings in force (architecture
  rule, editions, one owner per fact) and the SOPs (change isolation, immutable migrations,
  destructive-op checklist, separation of duties).

## Verdicts
Every finding carries a verdict with evidence: CONFIRMED (reproduced, command and output),
REFUTED (why the claim does not hold), or REWORK (what must change and the test that proves
it). A finding without evidence is a question, not a finding.

## What Important means
Reserve Important for findings that would break behaviour, lose or leak data, or breach a
policy. Style and naming are nits.

## Cap the nits
Report at most five nits; summarise the rest as a count.

## Do not report (noise only)
Generated output with no policy or behavioural consequence: a regenerated bundle whose source
change is in the same commit, rebuilds to the same hash and moves no pin, hash or baseline;
vendored code that did not change; an item a fitness test or CI already enforces and has run
on the reviewed tree with its receipt attached. Precedence: "Report and ratify" wins whenever
an item moves a hash, pin or baseline; listing an item for ratification is not a finding.

## Report and ratify (never excluded as "generated")
Every updated hash, pin, receipt, baseline or regenerated artifact is listed as its own item
with a verdict, ratify or refuse, and the evidence for it:
- projection drift: a public or generated copy says less than, or differs from, the
  canonical source it claims to project (controls dropped, templates reduced, a rule's
  wording weakened);
- unsafe re-pins: a version, image, hash or baseline moved without the receipt that
  justifies it;
- regeneration whose source change is absent, or that carries an unrelated edit;
- any regeneration, re-baseline or ratification the plan or a ruling requires.
A refused item blocks adjudication until it is reverted or justified.

## Feed back
Each policy finding names the rule, skill or test that should have caught it. Second
occurrence of the same finding: the rule changes, not the reviewer's patience.
```

## templates/bands.yaml

```yaml
# Control bands: deterministic detection, tiered response.
# The detection script is version-controlled and unit-tested; no model is involved in
# detection. The agent is invoked only when a band is breached, at the tier allowed here.
metric: ci_test_failure_rate          # one metric, one owner, one stable baseline
owner: <service owner>
baseline: rolling_30d
rules: western_electric               # catches slow drift and spikes
tiers:
  1sigma: { action: log }
  2sigma: { action: diagnose, tools: "Read,Grep,Bash(gh run view *)" }   # read-only
  3sigma: { action: propose, routes: [pull_request, runbook:rollback-deploy] }
outputs:
  intent: Program/<release>/<epic>/intent/<metric>-<date>.md   # the diagnosis re-enters at stage 1
  lesson: cortex-log <agent> lesson "..."
  eval: evals/<metric>-<date>.json                              # the fix ships with its eval
triage:
  decisions: [fix_now, schedule, dismiss]
  dismissals_tune_bands: true
```

## Gate record contract (`kaidera-sdlc.gate-record.v1`)

Verbatim from `references/governance.md`, "Gate records". It has one owner (that text);
the templates and any checker implement it exactly and add nothing to it.

```text
A gate record is an append-only JSON file at
Program/<release folder>/gates/<gate>-<decision_id>.json with schema
"kaidera-sdlc.gate-record.v1" and fields: schema, gate (one of
intent|spec|plan|review|adjudication|merge|release|go), decision_id (uuid4), authorizer
(identity string of the form <worker>@<project-key> or human:<handle>), role (one of
reviewer|adjudicator|integration-custodian|release-authority|originator), timestamp
(ISO-8601 UTC), reviewed_sha, adjudicated_sha, merged_sha (each a full 40-hex commit sha or
null when not applicable to that gate; review requires reviewed_sha; adjudication requires
reviewed_sha and adjudicated_sha; merge requires all three; release/go require merged_sha),
tree_sha (the tree of the last non-null sha), scope (non-empty list of pathspecs), receipts
(list of {command, exit_code, output_sha256}; a merge record must include a receipt whose
command reran the gates on merged_sha), findings_count (integer; a review with zero
findings still needs a receipt), separation (object {reviewer, adjudicator, custodian}
identities; reviewer must differ from adjudicator and custodian), previous_record_sha256
(sha256 of the previous record file in the same folder, or null for the first) and
record_sha256 (sha256 of the canonical JSON of all other fields). Records are never edited:
a correction is a new record whose previous_record_sha256 points at the superseded one.
Freshness: a merge/release/go record is stale when merged_sha is not the current head of
its target branch.
```
