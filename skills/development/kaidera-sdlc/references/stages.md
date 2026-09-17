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
- **Structure.** Keep policy and plumbing apart and share code by the rule of three
  (`references/code-quality.md`).
- **Parallelism.** Look for other agents' in-flight work first (`references/team.md`
  section 2). Worktree per agent (THE_WAY §9); one concern per commit
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
- **Before and after.** Where behaviour changes, record it before the change and after it on
  the final tree, and name what was tested (`references/evidence.md`).
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
  compliance against spec, plan and rulings, and structure. Important is reserved for behaviour, data or
  policy breaks; nits are capped at five. Only generated noise with no policy or behavioural
  consequence goes unreported; projection drift, re-pins and re-baselines are ratified or
  refused item by item. The author never approves. The reviewer's adversarial review is
  bound to a pre-fold `reviewed_sha` and returns verdicts with evidence; "no findings"
  carries the receipt of what was attempted (THE_WAY §11.1 step 2). Findings that cite
  policy feed the rule or the skill that should have caught them. Review runs in rounds with a
  cap (`templates/REVIEW.md`, "Rounds"): each round is a new review record at a new
  `reviewed_sha`; the author proposes dispositions and the adjudicator rules on whatever the
  reviewer has not closed.
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
