# The six stages, the Kaidera way

Each stage: what changes, our practice, artifacts, roles, the gate, and the SOPs and skills
that carry it. The playbook's principle throughout: collapse human-speed bottlenecks into
loops, keep humans accountable for judgement, encode policy as executable constraints. Roles
are portable (originator, lead, reviewer, adjudicator, integration custodian, release
authority); who holds each one today is a Cortex role occupancy record, not a line here
(`governance.md`, "Separation of duties" and "Role occupancy records").

## Release system

**Authority:** CTO 2026-10-09, H-D426–H-D431 in
`docs/design/helix-transformation/decisions.md`. Permanent for every lead and worker;
the lead directs and the CTO reviews outcomes. This section owns the release policy;
templates collect its receipts and the boot rule points back to it.

### Daily train and platform matrix

Cut at **18:00 in the project's recorded local timezone**. Ship the eligible work the reviewer
has accepted by the cut; each active product delivers at least one release every 24 h,
with additional releases allowed. Do not wait to assemble unrelated chunks into a bundle.
Paused products follow their named pause decision. The deadline never waives a required
Gate, review, platform receipt, signature or human go. If no candidate is eligible, record the
miss, the first blocking gate and the smallest recovery slice; consult the lead immediately.
Do not manufacture a release, mark a RED green or invent an exception to satisfy the clock.

Each release targets **Linux x86_64 and macOS arm64 together**, with **one source commit,
one product version and one signed manifest naming both sets of final artifact bytes**.
Versions belong to each product; this does not force different products into one version
or a shared bundle. H-D428 explicitly excepts the current Linux-only launch; it does not
establish a permanent single-platform route. Any future one-platform release needs a
named CTO exception bound to product, version, missing platform, reason and recovery date.
The missing platform is the next day's first item. An exception is not a passing receipt.

| Stage | Required release work and receipt |
|---|---|
| **PLAN** | Split work into independently releasable daily slices before BUILD. Each slice names product/version, owner, dependencies, acceptance output and cut date. Carry a platform matrix: shared source, artifact/build route, adapter, prerequisites, native Gate target, signing route and evidence for each platform. List any named exception and next-day recovery first. |
| **BUILD** | Build both host platforms through a CI matrix from the same commit/version; keep host-specific behaviour in a thin tested adapter (paths, launchd/systemd, Podman machine/native rootless). Cortex images are multi-arch linux/amd64 and linux/arm64, with platform digests recorded; macOS consumes arm64 in its Podman VM. Automate Apple signing/notarization with the CTO's once-approved credential route; agents do not acquire or expose keys. |
| **VERIFY** | Run the full required Gate on both a fresh Rocky Linux target and the approved arm64 Mac target, from the candidate bytes. Preserve source, platform, artifact/image identities, dependency and install/restart/health receipts. A personal Mac remains lived-in: product-owned changes only. Collect every RED and diagnostic result as below. Unit or cross-build success does not stand in for either native Gate. |
| **REVIEW** | Review both platforms, the shared commit/version, adapters, multi-arch image inventory, prerequisite compatibility, signing plan and eventual final-byte manifest. Bind verdicts to the candidate; disclose REDs, blocked checks and exceptions. The author cannot approve. |
| **SHIP** | Require both platform Gates/reviews and platform trust receipts, then one signed manifest covering their final bytes; publish both together only on the human go. Record actual publication/install outcomes per platform. A one-platform ship requires the named CTO exception above. |
| **MAINTAIN** | Carry missed cuts, observed failures and any missing platform into the next day's first releasable slice. Update progress from receipts; preserve the gate history and rollback path. |

### Gate runs: auto-collect and keep going

On **any RED**, automatically preserve the command, exit/signal, attached output or log-driver
output, available service logs, engine inspect data, OCI configuration, live mount information,
and relevant kernel/audit/coredump observations. Bind the receipt index to the run, host,
platform, source and payload/manifest identities. Preserve unavailable evidence as an explicit
missing/refused observation. Redact before storage: environment names only, no credential
values, tokens, DSNs or private user payloads in the receipt pack.

**Keep going in diagnostic mode** wherever later checks are safe and their prerequisites
still hold. Preserve each later exit/result; mark dependent checks BLOCKED with the failed
dependency instead of pretending they ran. Stop steps that would violate ownership, privacy,
authorization or safety; retain the reason. Do not repair the host/product, retry with weaker
settings, or create extra infrastructure inside the diagnostic continuation.

The run stays **RED** if any required check fails, is blocked or is missing. Later green
observations never erase the first failure. Diagnosis does not pass acceptance. After an
admitted fix, a new byte-bound full Gate run supplies the acceptance evidence.

### Fix class and CTO signing turn

Classify the proven fix against the **actual signed artifact inventory**, not its filename:

| Class | Boundary | Required next action |
|---|---|---|
| **docs/host** | Guide, run-sheet or host prerequisite change leaves every signed payload, image, manifest and signature byte unchanged. A doc packaged inside signed bytes is not in this class. | Record byte-preservation evidence; review/admit the delta and rerun the required Gate. The existing signature stands, while acceptance of the changed procedure still needs proof. |
| **PRODUCT** | Source, image, packaged config, entrypoint, payload or manifest changes signed bytes. Unproven impact is not clearance for docs/host. | Consult the CTO **before any rebuild**, with cause, exact affected bytes and smallest scope. On the named approval, fix with required RED-first proof, rebuild only affected artifacts, regenerate the final inventory/manifest, review and rerun the required Gates; obtain a **new CTO signature**. Retain and mark the superseded packet; do not publish it. |

Prepare **one CTO signing command per release** using the approved signing procedure, bound
to the reviewed candidate and final-byte inventory. Apple signing, notarization and stapling
finish before final PKG digests enter the shared manifest. Keep the command in the gated
signing packet; **show it only when it is the CTO's turn**, after its prerequisite work is
accepted. Earlier updates name the pending signing gate, not a command to run. Only the CTO
executes/authorizes that signing turn; agents neither substitute TEST signatures nor borrow
signing credentials. After signing, verify the signature and final artifact digests before SHIP.

### Quick-glance progress and naming

Keep the **top of `PRODUCTS_PROGRESS.md`** as the project's quick glance (Helix overall plus
one bar per product, each with its releasing version). Update on verified evidence: completed
units against a stated denominator, gate/run/commit receipt, last observation time, blocker,
next owner and next cut. Review acceptance, signing and publication are separate states;
scheduled work does not fill a completed segment. Carry paused/excepted status explicitly.
The lead owns the consolidated view; workers supply receipts, not competing progress facts.

Every release remains installable through its documented deployment route. Use **no
"manual" qualifier in new public release names, versions or notes**. Preserve historical
signed internal identifiers and prerequisite bindings; renaming them is an artifact change,
not editorial cleanup. Migration of a signed identity follows the PRODUCT gate above.

**Reopening trigger:** a newer CTO decision changes cadence, supported platforms, exception
scope, signing authority or a gate boundary; cite that decision and review the policy delta.

### Cortex boot rule draft

Proposed slug: `release-system`. Binding scope: every lead and worker, alongside `sdlc-loop`.
This is source text for review; Kai binds it after Vera's acceptance. Do not edit generated
harness pointers or mutate live Cortex rules while drafting. Rule body: exactly six lines.

```text
Apply kaidera-sdlc's Release system (CTO 2026-10-09, H-D426–H-D431); keep every acceptance/go gate.
PLAN daily slices: 18:00 local cut, at least one release per active product per 24 h; report a missed cut.
BUILD/VERIFY/REVIEW/SHIP Linux x86_64 + macOS arm64 from one commit/version/signed manifest; CTO exception only, gap first next day.
On Gate RED auto-collect safe evidence and keep going diagnostically; failed/blocked required checks keep the run RED.
Classify docs/host vs PRODUCT by signed bytes; consult CTO before rebuild, then new signature; show one signing command only on CTO's turn.
Update PRODUCTS_PROGRESS.md quick glance on evidence; no new public "manual" names/versions/notes; preserve signed historical identities.
```

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
  reviewer has not closed. The whole process with two reviewers and one report is
  `references/code-review.md`; the human's part of the gate is `references/human-gates.md`: the
  human tests the running thing at `merged_sha` and decides on the gate packet; the diff is the
  reviewer's and the adjudicator's.
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
