# Kaidera Skills Glossary

Status: **human-facing index; the manifests and the catalogue remain authoritative**

Glossary date: **2026-10-07**

Published skills covered: **45**

Skill names, categories and postures are read from the manifests and the catalogue
markers in the same tree, never retyped; only the prose is authored here. The enclosing
commit is the receipt, so this file does not self-reference a SHA it cannot know.

One row per skill: what it does, and why you would reach for it. This is the fast
index. It carries no authority. For posture definitions, capability meanings,
licensing, attribution, routing rules and migration debt read the
[Kaidera Skills Catalogue and Operating Guide](KAIDERA-SKILLS-CATALOG.md). For the
machine-readable record read the [generated marketplace](../.claude-plugin/marketplace.json).

A glossary entry is a summary of a manifest. If this file and a manifest disagree,
the manifest wins and this file is stale — fix it in the same commit.

---

## Portfolio shape

| Category | Published |
|---|---:|
| `context/` | 8 |
| `development/` | 21 |
| `devops/` | 8 |
| `documentation/` | 1 |
| `research/` | 2 |
| `security/` | 5 |
| **Total** | **45** |

| Posture | Published |
|---|---:|
| Bounded candidate | 11 |
| Reference-only | 14 |
| Manual-only | 10 |
| Rework before use | 10 |

Legacy entries: **22** of 45. The catalogue marks them, but they are
not filed separately, so a legacy name still looks current at the path level.

In flight: **7 pull requests** carrying **8** candidate skills.

Consumed third-party, published by their owners elsewhere: **8**.

---

## Naming

Names describe the job. Lowercase, hyphenated, short, stable. Never name a skill after
an ordinal, a date, a version, a person, a personality or a superlative. A vendor prefix
is correct only when the skill is that vendor's own work, kept verbatim.

Two rules do most of the work:

1. **A name must not promise an authority the manifest does not grant.** A skill that
   designs a test is not a `*-test`; a checklist is not a `*-review`; a policy document
   is not a gate.
2. **One job, one name.** Where two skills compete for the same words, the router picks
   the shorter one, and the shorter one is usually the weaker skill.
3. **A family prefix must identify a real shared core.** `jev-*` qualifies: every wrapper
   calls one bundled helper. A prefix that only names a topic does not qualify. A
   projected skill inherits its family from its canonical source, not from this
   repository, so renaming one member of a family that lives elsewhere desynchronises it
   from its siblings and is overwritten at the next render.

Renames are not cosmetic, and renaming source does not rename a runtime. A rename in
this repository moves:

1. the manifest file, and any canonical directory of the same name;
2. the catalogue entry, its local links and its review fingerprint;
3. the static-routing fixtures that name the skill;
4. the generated marketplace, which CI reproduces and fails on drift;
5. the posture policy and legacy sets in `scripts/test-skills-catalog.js`.

A second, separately approved migration then moves every live consumer: agent
registrations, bindings, version and body pins, sibling dependencies, emitted boot
pointers, and project invocation records. Inventory consumers freeze their pins, test
the new route and its exact resources, update through the supported API, and regenerate
pointers. Do not hand-edit a generated pointer, and do not create a second live alias to
soften the cutover. Keep rollback to the old binding set until the migration is
accepted. Historical review records and protocol identifiers keep their original names.

### Rename register

| Current name | Proposed | Why | Status |
|---|---|---|---|
| `code-review-security` | `security-review-checklist` | Says “checklist” so no router mistakes it for a verdict engine, and drops the `code-review` stem that collides with the review family. | accepted, not yet applied |
| `prompt-injection-test` | `prompt-injection-test-design` | The skill designs a test harness and executes nothing; the bare name reads as a runnable test. | accepted, not yet applied |
| `cloud-agnostic-policy` | `cloud-portability-gate` | It is a gate, and every sibling control already ends in `-gate`. `-policy` reads as a document, so routers skip it at exactly the moment it matters. | accepted, not yet applied |
| `open-code-review` | `evidence-code-review` | Removes a live identity collision: Alibaba ships a different skill under this exact name, and agent trees have installed both. States the evidence contract the skill actually enforces. | carried by #23 |
| `ultrareview` | `codebase-audit` | A branded superlative says nothing about scope. The new name states whole-repository scope and separates it from bounded-change review. | carried by #23 |
| `unlazy` | `completion-evidence` | A personality label. The new name states the outcome the skill produces. | carried by #23 |
| `marketing-web-research` | `account-and-contact-research` | **Withdrawn.** This manifest is a projection: it carries `kaidera.source` and is regenerated from a canonical directory in another repository, so a rename applied here is overwritten at the next render and desynchronises the skill from the family it belongs to. A projected skill inherits its name from its source owner. | withdrawn |
| `code-review` | `retire, or fold into evidence-code-review` | Retirement declined by the owner on 2026-10-07. The name stays; the skill is now filed under `legacy/`, which is what stops a router from preferring it over the evidence-gated reviewer. | declined 2026-10-07 |
| `deploy-to-dev` | `retire with the legacy set` | Retirement declined by the owner on 2026-10-07. The name stays; the skill is now filed under `legacy/`. | declined 2026-10-07 |
| `linkedin-navigator` | `linkedin-follow-checklist` | “Navigator” does not say what it produces, and the name sits next to `social-channel-research`, which covers the same platform read-only. The split that matters is research versus account action. | advisory, unmerged candidate (#15) |
| `model-fitness` | `worker-model-selection` | “Fitness” is a metaphor; the job is choosing which model each worker runs. | advisory, unmerged candidate (#16) |
| `gated-deck-web-page` | `deck-landing-page` | “Gated” describes the form, not the artifact. A landing page is what it builds. | advisory, unmerged candidate (#20) |
| `adaptech-uiux-design` | `keep the name, move to the design category` | The product prefix is correct because the rulebook is product-specific, but `development` is the wrong category once `design/` exists. | advisory, unmerged candidate (#8) |

`applied in this tree` means the manifest, catalogue, marketplace and static fixtures here
already use the new name. `carried by #23` means another open pull request owns it.
`advisory` means the skill is still an unmerged candidate, so the name is not yet reserved
and the rename should be applied by that pull request's author. `withdrawn` and `declined`
are recorded so the same proposal is not raised twice without new evidence.

Retiring a skill is also a naming decision, because it frees the name. Two retirements were
proposed and declined; the `legacy/` category is the cheaper answer to the same problem, since
it removes the router ambiguity without destroying the identity.

---

## Glossary

Alphabetical across all published categories. `Posture` and `legacy` come from the
catalogue markers; both are portfolio judgements, separate from the manifest's
`trust_tier`, and every skill here is `unvetted`.

| Skill | Category | What it does | Why you reach for it | Posture |
|---|---|---|---|---|
| [`agent-platform-context`](../skills/context/agent-platform-context.SKILL.md) | `context` | EnGenAI agent-runtime internals: executor, mailbox messaging, lead/worker teams, Celery lifecycle. | Background reading for legacy platform code; it is not current Kaidera truth. | Reference-only, legacy |
| [`api-design`](../skills/development/api-design.SKILL.md) | `development` | Legacy FastAPI conventions for URLs, request/response schemas, auth, pagination, errors and OpenAPI. | Pattern reference in a repository that already matches; verify against current source first. | Reference-only, legacy |
| [`api-test`](../skills/development/api-test.SKILL.md) | `development` | Legacy FastAPI contract and integration test structure, AsyncClient use, auth fixtures, async DB mocks. | Test-shape ideas only; it runs nothing and never supports a coverage claim. | Reference-only, legacy |
| [`assert-fact-gate`](../skills/development/assert-fact-gate.SKILL.md) | `development` | Blocks any factual claim until a fresh source check in this turn backs it. | Cheapest honesty control in the portfolio: kills recalled SHAs, “tests pass” and “it’s deployed”. | Manual-only |
| [`assumption-validation`](../skills/development/assumption-validation.SKILL.md) | `development` | Separates “the code is correct” from “this costly, customer-visible assumption is supported”. | Run before ranking, pricing, quota, default or migration changes that tests cannot judge. | Bounded candidate |
| [`backend-context`](../skills/context/backend-context.SKILL.md) | `context` | Legacy FastAPI service-layer, async DB access, authentication, middleware and security conventions. | Orientation inside old backend code; resolve every fact against the owning repository. | Reference-only, legacy |
| [`cloud-agnostic-policy`](../skills/devops/cloud-agnostic-policy.SKILL.md) | `devops` | Reviews infrastructure choices for portability and blocks undeclared provider-specific managed primitives. | Apply before architecture locks in; enforces portable, upstream-OSS-only infrastructure. | Manual-only |
| [`code-review`](../skills/development/code-review.SKILL.md) | `development` | Legacy two-stage checklist: specification compliance, then code quality, ending in a verdict. | Historical reference only; its merge and log postconditions exceed its no-tool contract. | Rework before use, legacy |
| [`code-review-security`](../skills/security/code-review-security.SKILL.md) | `security` | Legacy product security checklist covering auth, secrets, tenant isolation and supply chain. | A supporting lens under an evidence-gated review; never a competing verdict. | Rework before use, legacy |
| [`container-build`](../skills/devops/container-build.SKILL.md) | `devops` | Legacy multi-stage image builds, non-root UID, hardening, CI build pipeline and registry push. | Hardening ideas; note it disagrees with `k8s-deploy` on region and service names. | Reference-only, legacy |
| [`database-migration`](../skills/development/database-migration.SKILL.md) | `development` | Legacy Alembic and PostgreSQL migration naming, safe practice, rollback, data migration and RLS patterns. | Pattern reference; its migration head disagrees with `backend-context`. | Rework before use, legacy |
| [`dependency-audit`](../skills/security/dependency-audit.SKILL.md) | `security` | Legacy CVE scanning, supply-chain verification, dependency pinning and remediation workflow. | Installs and runs scanners while declaring no tools; split into separate workflows before reuse. | Rework before use, legacy |
| [`deploy-gate`](../skills/devops/deploy-gate.SKILL.md) | `devops` | Gates push, pull request, merge, release and deploy on exact target, current authority, evidence and rollback. | The last deterministic stop before anything irreversible leaves the machine. | Manual-only |
| [`deploy-to-dev`](../skills/devops/deploy-to-dev.SKILL.md) | `devops` | Legacy GitOps runbook: sprint-branch push triggers CI, image build, gitops update and ArgoCD sync. | Names one EnGenAI environment and domain; do not generalise it. | Manual-only, legacy |
| [`development-workflow`](../skills/development/development-workflow.SKILL.md) | `development` | Portable AI-plus-human lifecycle: bounded tasks, independent review, risk-based QA, recorded decisions. | The generic SDLC profile for development projects; select exactly one lifecycle owner per project. | Bounded candidate |
| [`frontend-context`](../skills/context/frontend-context.SKILL.md) | `context` | Legacy Next.js 14 App Router, React Flow, Tailwind, Zustand and strict-TypeScript conventions. | Orientation inside old frontend code only. | Reference-only, legacy |
| [`gavel`](../skills/development/gavel.SKILL.md) | `development` | Typed, probabilistic judgments on a lead’s three decision moments: a return, a handoff, a backlog order. | A calibrated second opinion before you rule. Mutually exclusive with the Jev lead wrappers. | Bounded candidate |
| [`git-workflow`](../skills/development/git-workflow.SKILL.md) | `development` | Legacy conventional commits, branch strategy, sprint branching, pull-request process and merge rules. | Describes Git mutation under a no-tool manifest; rework before use. | Rework before use, legacy |
| [`human-voice`](../skills/documentation/human-voice.SKILL.md) | `documentation` | Drafts, rewrites or audits public prose so it carries checkable specifics and a named person’s voice. | Removes machine-generic copy from posts, articles, email, decks, newsletters and web pages. | Reference-only |
| [`incident-response`](../skills/security/incident-response.SKILL.md) | `security` | Legacy incident runbook: classification, blast-radius containment, kill switch, evidence, post-incident review. | Its containment-before-preservation ordering is unsafe; rebuild human-gated before any use. | Rework before use, legacy |
| [`infra-naming-gate`](../skills/devops/infra-naming-gate.SKILL.md) | `devops` | Validates infrastructure names against an organisation, project, environment, role, locality and ordinal grammar. | Prevents resources that cannot later be renamed and collisions across projects. | Manual-only |
| [`infrastructure-context`](../skills/context/infrastructure-context.SKILL.md) | `context` | Legacy GKE, ArgoCD GitOps, Terraform, Helm, CI/CD pipeline and hardening overview. | Orientation inside old infrastructure code only. | Reference-only, legacy |
| [`jev`](../skills/development/jev.SKILL.md) | `development` | Reference for the shared Jev core, project transfer policy, CLI, result statuses and the four wrappers. | Setup and troubleshooting. It is not an automatic decision-moment router; install wrappers separately. | Reference-only |
| [`jev-backlog-rank`](../skills/development/jev-backlog-rank.SKILL.md) | `development` | Checks an accountable lead’s backlog ordering against stated gate dependencies and delay risk. | Catches mis-sequenced dispatch waves early; the human keeps priority authority. | Bounded candidate |
| [`jev-handoff-check`](../skills/development/jev-handoff-check.SKILL.md) | `development` | Inspects a drafted worker handoff’s receipt contract, gate, exclusions and blocked protocol before sending. | Stops dispatches that no worker could ever prove completion against. | Bounded candidate |
| [`jev-option-decision`](../skills/development/jev-option-decision.SKILL.md) | `development` | Examines one bounded implementation or architecture choice with named candidates, evidence and requirements. | Structured option comparison for a decision that is genuinely open; the accountable person decides. | Bounded candidate |
| [`jev-return-triage`](../skills/development/jev-return-triage.SKILL.md) | `development` | Advisory receipt-based triage of an arrived worker return, handback or consult. | Separates acceptable work from rework before the lead rules on it. | Bounded candidate |
| [`k8s-deploy`](../skills/devops/k8s-deploy.SKILL.md) | `devops` | Legacy Kubernetes manifests, resource limits, health probes, ArgoCD workflow, Helm charts and GKE config. | Pattern reference; contradicts `container-build` on region and services. | Reference-only, legacy |
| [`kaidera-sdlc`](../skills/development/kaidera-sdlc.SKILL.md) | `development` | The Kaidera loop: intent, grill, spec, plan, build, verify, review, ship, maintain, re-enter from incidents. | The operating method every lead runs. Nothing is implemented without an accepted plan. | Bounded candidate |
| [`marketing-web-research`](../skills/research/marketing-web-research.SKILL.md) | `research` | Researches companies, current decision makers and professional profiles from public and authorised sessions. | Market mapping, leadership lists and follow reconciliation. Research never authorises contact. | Manual-only |
| [`open-code-review`](../skills/development/open-code-review.SKILL.md) | `development` | Diff-first, evidence-gated review of a bounded change: exact receipt, diagnostics, impact, challenge, coverage. | The portfolio’s change-review contract. Strictly read-only. Collides by name with Alibaba’s distinct skill. | Bounded candidate |
| [`performance-profiling`](../skills/development/performance-profiling.SKILL.md) | `development` | Legacy Python async, PostgreSQL, Kubernetes and Redis profiling for latency-regression diagnosis. | Runs live production diagnostics while declaring no tools; rework before use. | Rework before use, legacy |
| [`prompt-injection-test`](../skills/security/prompt-injection-test.SKILL.md) | `security` | Read-only design checklist for testing a skill-content injection boundary: threats, corpus, rejection criteria. | Designs a separately controlled harness; it embeds no payloads and executes nothing. | Reference-only |
| [`prompt-master`](../skills/development/prompt-master.SKILL.md) | `development` | Vendored verbatim from the donor: writes one optimised prompt for a named AI tool from a rough request. | Only on an explicit prompt-engineering request. Donor name, licence and attribution are preserved. | Reference-only |
| [`research-brief`](../skills/research/research-brief.SKILL.md) | `research` | Turns an ambiguous research request into a self-contained, decision-led brief with a source plan. | Drafts the mission. It performs no research, invokes no vendor, spends nothing, contacts nobody. | Bounded candidate |
| [`route-handoff-gate`](../skills/context/route-handoff-gate.SKILL.md) | `context` | Verifies project, lane, layer, role and dependency boundaries before work is created or rerouted. | Prevents cross-lane and wrong-project dispatch, the most common multi-agent failure. | Manual-only |
| [`scope-work-gate`](../skills/context/scope-work-gate.SKILL.md) | `context` | Confirms proposed work belongs to the current project, role, lane and approved objective. | Stops “while we’re here” scope creep before it starts, not after review. | Manual-only |
| [`security-context`](../skills/security/security-context.SKILL.md) | `security` | Legacy threat model, OWASP Top 10 checklist, forbidden patterns and required security controls. | Reference lens; its control claims are unverified against current source. | Reference-only, legacy |
| [`sprint-closing`](../skills/devops/sprint-closing.SKILL.md) | `devops` | Legacy six-phase sprint closure: documentation, commit, push and pull-request procedure. | Names one individual as approver and one product as scope; not portable. | Manual-only, legacy |
| [`sprint-context`](../skills/context/sprint-context.SKILL.md) | `context` | Legacy three-file sprint pattern, TASK_STATUS protocol, definition of done and quality gates. | Workflow assumptions no longer match Kaidera delivery; rework before use. | Rework before use, legacy |
| [`tdd-workflow`](../skills/development/tdd-workflow.SKILL.md) | `development` | Legacy red-green-refactor loop with a five-step verification requirement before “done”. | Describes test execution under a no-tool manifest; the discipline is sound, the contract is not. | Rework before use, legacy |
| [`terraform-module`](../skills/devops/terraform-module.SKILL.md) | `devops` | Legacy GCP Terraform module structure, state, workspaces, variables and safe-apply workflow. | Provider-specific and mutation-describing; held by the cloud-portability policy. | Manual-only, legacy |
| [`ultrareview`](../skills/development/ultrareview.SKILL.md) | `development` | Whole-codebase or module health audit across eight dimensions with adversarial verification of findings. | Repository-wide scope. Its opt-in fix mode exceeds its declared no-tool contract. | Rework before use |
| [`unlazy`](../skills/development/unlazy.SKILL.md) | `development` | Completion discipline: write acceptance gates first, decompose with a depth tree, re-measure every claim. | The counter to quiet incompleteness on long, multi-part, parallel or exhaustive work. | Bounded candidate |
| [`workspace-context`](../skills/context/workspace-context.SKILL.md) | `context` | Legacy workspace identity, tech stack, team structure, terminology and development principles. | Orientation only; it names a retired organisation and product. | Reference-only, legacy |

---

## In-flight candidates

Carried by an open pull request, not on the default branch, absent from the generated
marketplace, and not installable as a published identity. Nothing here is accepted, and
a candidate's name is not reserved until its pull request merges.

| Skill | PR | Category | What it does | Why you reach for it | Risk |
|---|---|---|---|---|---|
| `adaptech-uiux-design` | #8 | `development` | Governing UI/UX and design-system rulebook for the ASW Connect / AdapTech dark-aviation products. | Enforces one house style, computed WCAG 2.2 AA contrast and an elevation ladder for that product only. | medium |
| `folder-organisation` | #9 | `development` | One root, one home per kind of thing, one owner per fact — plus the loop that consolidates a scattered estate. | Placement gate before creating any document, diagram, plan, proof, pack or worktree, and before deleting a folder. | medium |
| `gated-deck-web-page` | #20 | `design` | Turns an approved deck into an unlisted static page that emails the PDF after a name, title and address. | Lead capture on a deck. It does not deploy the page, build the endpoint or send the email. | medium |
| `kaidera-deck-design` | #20 | `design` | Designs, builds and checks house-style investor and partner decks as a scripted PPTX with PDF export. | Repeatable deck quality with a recorded QA pass. Writes local files only; never sends or publishes. | medium |
| `lead-generation-outreach` | #22 | `research` | Finds, qualifies and verifies prospective customers, then contacts each one personally by email. | Drafts from cited evidence, queues each batch for owner approval, records every send, stops on any reply. | high |
| `linkedin-navigator` | #15 | `research` | Builds LinkedIn follow and connect target lists with no API, no login session and no paid scraper. | Turns a named account list into a click-through checklist; a human performs every account action. | medium |
| `model-fitness` | #16 | `development` | Reviews which model each project worker runs, gathers public and tester feedback, recommends best per task. | Use for roster audits, an underperforming worker, a new model release, or a fitness question. | medium |
| `social-channel-research` | #17 | `research` | Source-linked, read-only research on public LinkedIn, X and Instagram content through authorised host channels. | Stops when a platform needs an unavailable login or permission; never publishes or interacts with accounts. | high |

`design/` (PR 20) is not yet in the category enum in `scripts/validate-skill.js` or the
category labels in `scripts/test-skills-catalog.js`; that pull request adds both. The
`integrations/` category is in the enum and carries no skills.

---

## Projections

**9** published skills are generated rather than authored here: they carry
`kaidera.source` or a generation marker, and are re-rendered from a canonical source
instead of being edited in place.

One of them keeps its canonical directory inside this repository (`development-workflow`): the flat manifest is generated from
the directory of the same name, and `npm test` fails if the two drift.

The other 8 are projected from a canonical directory in `Kaidera-AI/kaideraos`: `gavel`, `jev`, `jev-backlog-rank`, `jev-handoff-check`, `jev-option-decision`, `jev-return-triage`, `kaidera-sdlc`, `marketing-web-research`.

Three consequences, and they are the reason the rename register above withdraws one
proposal:

1. **A projection is renamed at its source, not here.** Editing the name in this
   repository is overwritten at the next render and desynchronises the skill from the
   family it belongs to.
2. **A projection inherits its family prefix from its source.** A prefix that looks
   topical here may identify a real shared core upstream, which is exactly when the
   naming convention says to keep it.
3. **A `content_sha256` pin is only as good as the source it points at.** If the
   canonical directory is not resolvable by a reviewer, the pin is an assertion, not
   evidence. Provenance that cannot be checked is a release hold, not a guarantee.

---

## Consumed third-party skills

Installed into agent trees from their owners' repositories, not published here. Listed
so a reader can tell “Kaidera does not have a skill for this” apart from “Kaidera
consumes someone else's”. Every one of them must be pinned in the consuming project's
`skills-lock.json` with its source, ref and content hash; an unpinned third-party skill
is an unreproducible dependency.

| Skill | Owner | Licence | What it does |
|---|---|---|---|
| `ci-security-scanning-with-strix` | Strix (usestrix) | Apache-2.0 | Diff-scoped AI pentest as a CI/CD pre-merge gate, with SARIF to code scanning. |
| `fix-security-vulnerabilities-with-strix` | Strix (usestrix) | Apache-2.0 | Root-cause remediation of validated Strix findings, re-scanned to prove closure. |
| `managed-pentesting-with-strix` | Strix (usestrix) | Apache-2.0 | Pentest-as-a-service through the hosted API: schedules, webhooks, auditor-ready reports. |
| `penetration-testing-with-strix` | Strix (usestrix) | Apache-2.0 | Autonomous pentest that exploits and proves vulnerabilities instead of flagging them. |
| `pr` | Matt Pocock | MIT | Pull-request body writing. Pinned in the consuming project’s skills lockfile. |
| `retro` | Matt Pocock | MIT | Coding-session retrospective, on explicit request only. Pinned in the lockfile. |
| `typesafe-ai` | TypeSafe AI | MIT | Typed AI primitives (System One models) for routing, ranking, extraction and verification in product code. |
| `writing-for-agents` | Matt Pocock | MIT | Writing documents that agents consume: skills, AGENTS.md, CLAUDE.md. Pinned in the lockfile. |

---

## Maintaining this glossary

Update this file in the same commit as any change that makes a row wrong:

- a skill is added, removed, renamed, or moved between categories;
- a posture or legacy classification changes in the catalogue;
- an in-flight candidate merges, or its pull request is closed without merging;
- a first-party skill is published here, or a consumed third-party skill is dropped.

Version numbers are deliberately absent. They drift on every bump and the marketplace
already carries them. If a row needs a version to be understood, the row is describing
a release, not a skill.

Keep each `What it does` to one line and each `Why you reach for it` to one line. The
moment a row needs a paragraph, the content belongs in the catalogue entry, not here.

## Related documents

- [Kaidera Skills Catalogue and Operating Guide](KAIDERA-SKILLS-CATALOG.md) — authority, posture, routing, debt
- [Skill format and trust policy](../spec/SKILL_FORMAT.md) — the manifest schema
- [Static skill evaluations](static-skill-evaluations.md) — routing evidence for the evaluated skills
- [Generated marketplace](../.claude-plugin/marketplace.json) — machine-readable record
- [Contributing guide](../CONTRIBUTING.md) — submission and review process
