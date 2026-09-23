# AI+Human Development Lifecycle

This is the default lifecycle for a development team using AI and human workers. A
project may tailor sequencing and evidence to risk, but it may not remove the
specified human gates or claim a gate passed without its record.

`INTENT → GRILL → SPEC → PLAN → BUILD ↔ VERIFY → REVIEW → SHIP → MAINTAIN`

The accountable human may pause or reject at every gate. AI workers may prepare
recommendations and artifacts; only the named human accepts requirements/plans and
makes human-reserved approvals. Every AI-generated or materially changed artifact
receives an explicit human file review recorded in the review manifest.

## 1. INTENT — capture the outcome

**Lead:** programme lead or designated human product lead. **Output:** intent record.

Capture problem/opportunity, affected users, desired outcome, reason now, constraints,
known measures, in-scope and out-of-scope surfaces, stakeholders, and accountable
human. Separate requested solution from user need. Mark unknowns and evidence source.

**Exit:** the human sponsor confirms the problem framing is worth exploring. This is
not permission to implement.

## 2. GRILL — challenge assumptions before commitment

List assumptions, contradictions, alternative interpretations, affected parties,
failure and misuse scenarios, data/security/privacy concerns, operational burden,
dependencies, accessibility needs, and costly-to-reverse choices. Ask focused
questions; use current evidence for claims; show viable options and trade-offs. Do
not bury unanswered material questions in implementation tasks.

**Exit:** the human resolves or explicitly accepts each material uncertainty, assigns
follow-up discovery where needed, and confirms a bounded direction. Unresolved safety,
authority, or business-critical ambiguity means STOP.

## 3. SPEC — make behavior testable

Create a versioned specification with users and journeys, functional behavior,
contracts and compatibility, data lifecycle, failure/edge cases, non-functional
requirements, security/privacy/accessibility needs, observability, support, acceptance
scenarios, rollout/rollback expectations, and exclusions. Each criterion must be
observable and have planned evidence. Record assumptions separately from requirements.

**Human gate:** the authorized product owner accepts the spec and change/risk policy.
Requirements cannot be weakened by an author, reviewer, or executor during delivery.

## 4. PLAN — design the work and controls

Create architecture/design records and decisions for material boundaries; identify
interfaces, dependencies, data migrations, threat mitigations, build/test/release
approach, support ownership, and recovery. Decompose into bounded tasks with permitted
paths/artifacts, inputs/revisions, one outcome, dependencies, acceptance, verification,
AI reviewer, human reviewer, QA owner when needed, model/provider/tools selected by
the operator, budget, deadlines, stop conditions, and handback form.

**Human gate:** accept architecture where required and the delivery plan, owners,
budgets, risk classification, evidence plan, and release path. A missing field or
unowned duty means NOT READY. See
[architecture and planning](./13-architecture-design-planning.md) and
[handoff contract](./11-handoff-anatomy.md).

## 5. BUILD ↔ VERIFY — bounded creation and evidence

An assigned AI or human contributor works in the declared isolated workspace. For AI
work, produce the requested artifact; do not silently expand scope or change accepted
requirements. Self-review the full change and run the assigned checks. Verification
must be capable of failing and report command/tool, version/configuration, exact
input/output revision, expected versus observed result, and failure details.

Use proportionate tests: unit, contract, integration, system/end-to-end, security,
accessibility, performance, resilience, migration/recovery, or manual observation as
the risk requires. Do not create a fake PASS for a not-required check; record NOT
REQUIRED and its authorized policy basis. Preserve failures and residual risk.

**Exit:** exact output exists; task acceptance is demonstrable; evidence is attached;
changed artifacts are inventoried; self-verification and security checks are
reported. A build/test success alone does not accept the work.

## 6. REVIEW — independent AI analysis plus human file review

Freeze the output revision. the independent code reviewer or another non-author AI reviewer inspects code
changes and records actionable findings. A separate named human reviews every
AI-created/materially changed file and its evidence, then records a decision. For
human-authored files, the project still assigns an independent reviewer according to
its review policy. the QA owner performs behavioral QA as required by risk/acceptance policy;
QA and code review remain separate.

**Exit:** required AI review, human review, and QA are complete on the exact revision;
blocking findings are fixed or an authorized human records disposition. Revised bytes
require re-review and any affected verification to be repeated. See
[AI+human code review](./15-ai-human-code-review.md).

## 7. SHIP — authorize, release, and prove

Prepare a readiness packet: accepted scope/spec, exact source and artifact identity,
provenance, automated checks, AI review, human review, QA (or authorized not-required
basis), compatibility, change record, target, monitoring, recovery/rollback, operator,
and open risks. The named human decides each reserved authorization. A separately
authorized executor performs the action and records the actual outcome.

Distinguish merge/integration, install, deployment, release, publication, and user
acceptance. Verify behavior in the target environment against the exact candidate.
Do not infer permission from approval of a different target or artifact.

## 8. MAINTAIN — operate, learn, and improve

Maintain a service owner, support route, service objectives, dependencies, monitoring,
runbooks, backup/restore, recovery targets, and lifecycle/security maintenance. Log
incidents, restore service safely, analyze underlying problems, authorize corrective
changes, review the outcome, and update canonical documentation. Feed verified
learning into the next plan without copying sensitive local incident details into the
generic pack. See [service operations](./16-itil-service-operations.md).

## State and evidence rule

Keep these outcomes distinct: **task done → task accepted → AI review → human file
review → QA (if required) → integrated → change authorized → deployed/installed →
released/published → user accepted → maintained**. Every transition has actor, time,
exact artifact/revision, decision, evidence, and next owner. Missing evidence is
BLOCKED or CANNOT VERIFY, never green by inference.

## External practice references

- NIST [Secure Software Development Framework (SSDF)](https://csrc.nist.gov/projects/ssdf)
- Google [Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)
- PeopleCert [ITIL 4 Practices](https://www.peoplecert.org/ITIL4-practices)
- C4 model [diagrams](https://c4model.com/diagrams)

Use these as practice references and tailor proportionately; the pack does not claim
certification or formal conformance.
