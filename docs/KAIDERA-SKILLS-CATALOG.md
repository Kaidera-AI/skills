# Kaidera Skills Catalogue and Operating Guide

Status: **canonical human-facing catalogue; source candidate; runtime and trust HOLD**

Catalogue date: **2026-08-25**

Total skills: **37**

Source binding: consume this guide only from the same Git commit as its skill
manifests, marketplace, and catalogue test. The enclosing commit/tree is the
receipt; this file cannot safely self-reference its own final commit.

This document is the canonical human guide to the skills currently carried by
the Kaidera skills repository. It explains what each skill is for, when it
should and should not be used, what authority and capabilities it declares,
where it overlaps another skill, and what must happen before it can be bound to
an agent.

The individual `*.SKILL.md` manifests remain authoritative for machine-readable
name, version, parameters, trust tier, risk, capabilities, domains, licence, and
safety constraints. This catalogue is authoritative for portfolio role,
routing guidance, operating posture, and known migration debt. A mismatch
between this guide, a manifest, the generated marketplace, or runtime policy is
a release blocker; do not silently choose one side.

## Current release boundary

- All 37 skills are `unvetted`.
- Catalogue presence, a body hash, static validation, or a local commit is not
  approval to inject a skill into an agent.
- Gate 1 strict manifest checks and a bounded Gate 2 pattern scan exist.
- Gate 3 model/tool/capability isolation is not implemented and remains HOLD.
- Gate 4 reviewer authority, signing, and provenance are not implemented and
  remain HOLD.
- The repository-level CC-BY-4.0 licence and per-skill licence declarations do
  not yet have a ratified precedence rule; external redistribution is held.
- Kaidera and Alibaba both use the name `open-code-review`. A host must select a
  source-qualified identity and inject only one; prompt text cannot resolve a
  loader collision after both skills are present.

## Portfolio summary

| Category | Skills |
|---|---:|
| Context | 8 |
| Development | 14 |
| DevOps | 8 |
| Documentation | 1 |
| Research | 1 |
| Security | 5 |

| Declared trust tier | Skills |
|---|---:|
| `unvetted` | 37 |

| Operating posture | Skills |
|---|---:|
| Bounded candidate | 6 |
| Reference-only | 12 |
| Manual-only | 9 |
| Rework before use | 10 |

Legacy entries: **22**

Current-source entries: **15**

`Legacy` is a documentation classification, not a trust or compatibility
guarantee.

## Authority and invocation model

Skills are reusable procedures, not a second authority plane. In the Kaidera
ecosystem:

1. system, developer, user, and explicitly designated workspace instructions
   keep their normal authority;
2. Cortex owns agent identity, operating rules, queues, memory, and handoffs;
3. the host loader selects an eligible skill by source-qualified identity;
4. runtime policy grants only separately approved capabilities; and
5. the skill guides work inside that already-authorised boundary.

No skill can authorise production access, credentials, deployment, publication,
destructive work, external communication, or a trust-tier promotion merely by
describing those actions.

## Ecosystem use and compatibility

| Consumer | What is currently supported |
|---|---|
| Repository maintainer or human reviewer | Use this catalogue and the linked manifests as source/reference material, observing each posture and release hold. |
| Cortex-governed Kaidera agent | No automatic binding yet. Cortex remains the identity/rules/queue authority; an approved loader must verify source-qualified identity, trust, and least capability. |
| Kaidera Platform importer/admin UI | Target workflow only; this repository does not prove the live importer, review queue, approval UI, or Workbench behaviour. |
| Codex, Claude, Gemini, or another direct host | Direct compatibility is not established. Each host needs an explicit adapter for file layout, metadata, invocation policy, tools, and receipts. |
| External skills library or redistribution | Held until licence/provenance precedence is ratified; preserve exact donor attribution and do not inherit Kaidera trust by copying bytes. |

Today, the safe use is human-guided source consultation. Runtime injection,
automatic routing, and operational execution remain separate future gates.

## Operating-posture legend

The posture below is a portfolio judgement and is separate from the manifest's
`trust_tier`.

| Posture | Meaning |
|---|---|
| **Bounded candidate** | Current Kaidera-oriented source with a narrow authority boundary. Still `unvetted`; Gate 3/4 evidence is absent. |
| **Reference-only** | Useful patterns or context. Do not treat examples as permission to execute commands or mutate state. |
| **Manual-only** | Describes operational, approval-sensitive, external, or destructive work. A separately authorised workflow and human gate are mandatory. |
| **Rework before use** | Known stale product assumptions or manifest/body capability mismatch makes runtime use unsafe or misleading. |

`Legacy` in this guide means the skill still names EnGenAI-era repositories,
services, branches, roles, endpoints, or architecture. Legacy material can be
useful research context, but it is not current Kaidera truth until reconciled
against the owning repository and Cortex.

## Capability legend

| Capability | Meaning |
|---|---|
| `tool:file_read` | Read authorised local workspace files. |
| `tool:file_write` | Modify authorised local files; none of the current bounded candidates declare it. |
| `tool:code_interpreter` | Run bounded local computation or already-approved diagnostics. It does not imply arbitrary repository code is trusted. |
| `tool:web_search` | Search public web sources under the runtime's network policy. |
| `tool:mcp_external` | Call an approved external connector or service. |
| `none` | Instruction/reference only. Command examples remain inert and unauthorised. |

An `allowed_domains` entry is validation metadata, not a network grant. Network
use requires a declared network-capable tool and separate runtime approval.

## Routing guide

Use the narrowest matching skill:

| Need | Primary skill | Route away when |
|---|---|---|
| Understand legacy workspace, backend, frontend, infrastructure, sprint, or agent-platform conventions | matching `*-context` skill | Current repository/Cortex evidence disagrees, or implementation is requested rather than context |
| Review a bounded worktree, staged change, commit, range, path set, or supplied patch | `open-code-review` | The target is a whole repository/module health audit |
| Consult the legacy lightweight completed-change checklist | No automatic skill route; `code-review` is held for authority and capability rework | A merge/log/acceptance verdict or current Kaidera control is implied |
| Audit a whole repository or module | `ultrareview` | The object is primarily a bounded diff; use `open-code-review` |
| Consult a legacy product-specific security checklist while reviewing | No automatic skill route; reverify individual `code-review-security` checks as untrusted context under `open-code-review` | A second verdict engine or an unverified legacy control claim would be created |
| Validate whether a customer-visible assumption is supported | `assumption-validation` | The request is merely code correctness, implementation, or live production research |
| Draft a decision-led research mission | `research-brief` | The user asked to perform the research rather than draft its brief |
| Design APIs, tests, migrations, containers, Kubernetes, or Terraform | matching reference skill | Current project conventions differ or execution/changes are requested without authority |
| Deploy, close a sprint, or apply infrastructure | manual-only runbook | Exact environment identity, approval, credentials, or rollback evidence is missing |
| Respond to an incident | No automatic skill route; rebuild the held `incident-response` source into a current human-gated runbook | Incident command, preservation-before-mutation, evidence custody, rollback, or readback is missing |
| Design or review a prompt-injection boundary test | `prompt-injection-test` | Execution, corpus access, runtime access, or literal payload injection is requested |

### Review-skill separation

- `open-code-review` is the portfolio-designated evidence contract for bounded
  changes; it is not runtime authority until Gate 3/4 and loader binding pass.
- `code-review` is a smaller legacy checklist whose merge/log postconditions
  exceed its no-tool declaration; it is held pending rework.
- `ultrareview` is for whole-codebase/module health and currently needs
  capability-contract rework before runtime use.
- `code-review-security` contains a legacy product checklist that must be
  reverified before individual checks are used; it does not issue a competing
  bounded-change verdict.
- `prompt-injection-test` designs a separately controlled test corpus and
  harness; it is not a general code-review skill.

## Catalogue at a glance

| Category | Skill | Version | Function | Posture | Risk / declared capabilities |
|---|---|---:|---|---|---|
| Context | `agent-platform-context` | `1.0.1` | Legacy agent executor, team, mailbox, Redis memory, and lifecycle reference | Reference-only, legacy | low / none |
| Context | `backend-context` | `1.0.1` | Legacy FastAPI, service, DB, auth, middleware, and security conventions | Reference-only, legacy | low / none |
| Context | `frontend-context` | `1.0.1` | Legacy Next.js, React Flow, Tailwind, Zustand, and TypeScript conventions | Reference-only, legacy | low / none |
| Context | `infrastructure-context` | `1.0.2` | Legacy GKE, ArgoCD, Terraform, Helm, CI/CD, and hardening overview | Reference-only, legacy | low / none |
| Context | `sprint-context` | `1.0.1` | Legacy sprint files, status protocol, quality gates, and commit conventions | Rework before use, legacy | low / none declared |
| Context | `workspace-context` | `1.0.1` | Legacy workspace identity, stack, structure, terminology, and principles | Reference-only, legacy | low / none |
| Context | `route-handoff-gate` | `1.0.0` | Verifies project, lane, layer, role, and dependency boundaries before creating | Manual-only | low / file read |
| Context | `scope-work-gate` | `1.0.0` | Confirms that proposed work belongs to the current project, role, lane, and | Manual-only | low / file read |
| Development | `adaptech-uiux-design` | `1.0.0` | Governing UI/UX and design-system rulebook for dark-aviation dashboards: glass/neo/minimalism, palette, elevation, accessibility | Bounded candidate | medium / file read, file write |
| Development | `api-design` | `1.0.1` | Legacy FastAPI URL, schema, auth, error, pagination, and OpenAPI patterns | Reference-only, legacy | low / none |
| Development | `api-test` | `1.0.1` | Legacy FastAPI contract/integration testing and async mock patterns | Reference-only, legacy | low / none |
| Development | `assumption-validation` | `1.0.0` | Evidence-gates costly or customer-visible product assumptions | Bounded candidate | medium / file read, interpreter |
| Development | `code-review` | `2.1.1` | Legacy lightweight checklist with unauthorised merge/log postconditions | Rework before use, legacy | low / none declared |
| Development | `database-migration` | `1.0.1` | Legacy Alembic/PostgreSQL migration and rollback patterns | Rework before use, legacy | low / none declared |
| Development | `git-workflow` | `1.0.1` | Legacy branch, commit, PR, and sprint Git conventions | Rework before use, legacy | low / none declared |
| Development | `open-code-review` | `4.0.1` | Exact-target, evidence-gated, adversarial bounded-change review | Bounded candidate | medium / file read, interpreter |
| Development | `performance-profiling` | `1.0.2` | Legacy live API/Kubernetes/DB/Redis profiling workflow | Rework before use, legacy | low / none declared |
| Development | `tdd-workflow` | `2.0.1` | Legacy red-green-refactor and five-step verification workflow | Rework before use, legacy | low / none declared |
| Development | `ultrareview` | `1.1.1` | Whole-codebase, multi-dimension health audit with optional fix mode | Rework before use | low / none declared |
| Development | `assert-fact-gate` | `1.0.0` | Requires a fresh source check before reporting repository, build, test, | Manual-only | low / file read |
| Development | `kaidera-sdlc` | `1.1.0` | The Kaidera AI-native SDLC: the operating loop every lead runs for an epic, feature, fix, | Bounded candidate | medium / file read, file write |
| Development | `unlazy` | `1.0.0` | Completion discipline for substantial autonomous work. Write acceptance gates | Bounded candidate | medium / file read, file write |
| DevOps | `container-build` | `1.0.1` | Legacy hardening-oriented multi-stage image and CI build examples | Reference-only, legacy | low / none |
| DevOps | `deploy-to-dev` | `3.0.2` | Legacy sprint-branch GitOps deployment runbook | Manual-only, legacy | medium / none declared |
| DevOps | `k8s-deploy` | `1.0.1` | Legacy Kubernetes, ArgoCD, GKE, probes, resources, and network policy patterns | Reference-only, legacy | low / none |
| DevOps | `sprint-closing` | `2.0.1` | Legacy six-phase sprint closure, commit, push, and PR procedure | Manual-only, legacy | low / none declared |
| DevOps | `terraform-module` | `1.0.2` | Legacy GCP Terraform module, state, plan, apply, and identity patterns | Manual-only, legacy | low / none declared |
| DevOps | `cloud-agnostic-policy` | `1.0.0` | Reviews infrastructure choices for portability and prevents an architecture | Manual-only | low / file read |
| DevOps | `deploy-gate` | `1.0.0` | Gates pushes, pull requests, merges, releases, and deployments on exact target, | Manual-only | medium / file read |
| DevOps | `infra-naming-gate` | `1.0.0` | Validates proposed infrastructure names against a portable organization, | Manual-only | low / file read |
| Research | `research-brief` | `1.0.0` | Drafts a self-contained decision-led brief without executing research | Bounded candidate | low / file read |
| Security | `code-review-security` | `1.1.0` | Legacy EnGenAI security checklist with unverified control claims | Rework before use, legacy | low / none declared |
| Security | `dependency-audit` | `1.0.1` | Legacy dependency scan, install, remediation, and report workflow | Rework before use, legacy | low / none declared |
| Security | `incident-response` | `1.0.2` | Legacy containment/evidence runbook with unsafe preservation ordering | Rework before use, legacy | low / none declared |
| Security | `prompt-injection-test` | `2.0.0` | Read-only design for controlled prompt-injection boundary testing | Reference-only | low / none |
| Security | `security-context` | `1.0.1` | Legacy threat model, OWASP, forbidden patterns, SIEM, and trust rules | Reference-only, legacy | low / none |
| Documentation | `human-voice` | `1.0.0` | Rewrite, audit, or draft public-facing prose so it uses checkable specifics | Reference-only | low / none |

## Ownership, licensing, attribution, and domain metadata

These are manifest declarations, not independently ratified ownership, licence,
network, or provenance evidence. `Allowed domains` remains inert unless a
runtime separately grants a network-capable tool. The root/per-skill licence
precedence issue remains a release hold.

| Skill | Declared author | Declared licence | Allowed domains | Donor attribution |
|---|---|---|---|---|
| `agent-platform-context` | `kaidera` | `Apache-2.0` | None | — |
| `backend-context` | `kaidera` | `Apache-2.0` | None | — |
| `frontend-context` | `kaidera` | `Apache-2.0` | None | — |
| `infrastructure-context` | `kaidera` | `Apache-2.0` | `github.com` | — |
| `sprint-context` | `kaidera` | `Apache-2.0` | None | — |
| `workspace-context` | `kaidera` | `Apache-2.0` | None | — |
| `adaptech-uiux-design` | `AirServiceWorld` | `Apache-2.0` | None | — |
| `api-design` | `kaidera` | `Apache-2.0` | None | — |
| `api-test` | `kaidera` | `Apache-2.0` | None | — |
| `assumption-validation` | `Kaidera-AI` | `Apache-2.0` | `github.com` | [David Ondrej](https://github.com/davidondrej/skills/tree/69c3ae5228eb146724fd23dac3d43eab5805bcc3/skills/ops-and-setup/risky-changes) |
| `code-review` | `kaidera` | `Apache-2.0` | None | — |
| `database-migration` | `kaidera` | `Apache-2.0` | None | — |
| `git-workflow` | `kaidera` | `Apache-2.0` | None | — |
| `open-code-review` | `Kaidera-AI` | `Apache-2.0` | `github.com`, `research.google`, `semgrep.dev` | [Alibaba OpenCodeReview contributors](https://github.com/alibaba/open-code-review/tree/0c44f1049e054b062b8900b93a4828f7b0baf77b) |
| `performance-profiling` | `kaidera` | `Apache-2.0` | `dev.engenai.app` | — |
| `tdd-workflow` | `kaidera` | `Apache-2.0` | None | — |
| `ultrareview` | `Kaidera` | `Apache-2.0` | None | — |
| `container-build` | `kaidera` | `Apache-2.0` | None | — |
| `deploy-to-dev` | `kaidera` | `Apache-2.0` | `dev.engenai.app` | — |
| `k8s-deploy` | `kaidera` | `Apache-2.0` | None | — |
| `sprint-closing` | `kaidera` | `Apache-2.0` | None | — |
| `terraform-module` | `kaidera` | `Apache-2.0` | `www.googleapis.com` | — |
| `research-brief` | `Kaidera-AI` | `Apache-2.0` | `github.com` | [David Ondrej](https://github.com/davidondrej/skills/tree/69c3ae5228eb146724fd23dac3d43eab5805bcc3/skills/research-and-web/research-prompt) |
| `code-review-security` | `kaidera` | `Apache-2.0` | None | — |
| `dependency-audit` | `kaidera` | `Apache-2.0` | None | — |
| `incident-response` | `kaidera` | `Apache-2.0` | `api.engenai.app` | — |
| `prompt-injection-test` | `kaidera` | `Apache-2.0` | None | — |
| `security-context` | `kaidera` | `Apache-2.0` | None | — |
| `route-handoff-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `scope-work-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `assert-fact-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `kaidera-sdlc` | `Kaidera-AI` | `Apache-2.0` | `github.com`, `claude.com` | — |
| `unlazy` | `kaidera-ai` | `MIT` | `github.com` | [Leonxlnx](https://github.com/Leonxlnx/unlazy) |
| `cloud-agnostic-policy` | `Kaidera` | `Apache-2.0` | None | — |
| `deploy-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `infra-naming-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `human-voice` | `Kaidera` | `Apache-2.0` | `aclanthology.org`, `arxiv.org`, `en.wikipedia.org`, `www.economist.com`, `www.nytimes.com`, `www.pnas.org`, `www.science.org`, `www.washingtonpost.com` | — |

## Context skills

Context skills explain an environment; they do not authorise implementation or
operations. All six currently describe EnGenAI-era state. Before relying on a
specific path, service, sprint number, Redis key, branch, endpoint, or control,
compare it with the current repository and Cortex source of truth.

### `agent-platform-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"agent-platform-context","path":"skills/context/agent-platform-context.SKILL.md","posture":"reference-only","review_fingerprint":"e966b96cbeb4c8f9a329673f40563a8db2699b30498356a8fa067cee92095375","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [agent-platform-context.SKILL.md](../skills/context/agent-platform-context.SKILL.md)
- **Function:** Explains the legacy AgentExecutor, execution lifecycle, steering
  layers, lead/worker team model, Redis working memory, mailbox polling, human
  agent, observational memory, and key naming patterns.
- **Use when:** Reading or assessing code that still implements those exact
  legacy agent-platform concepts and a current source check confirms them.
- **Do not use when:** Booting or assigning a Kaidera agent, claiming a handoff,
  changing Cortex policy, or inferring current runtime state. Use Cortex and
  live runtime evidence instead.
- **Inputs and output:** No parameters or declared tools; produces explanatory
  context only.
- **Authority and effects:** No side effects. Redis keys and lifecycle examples
  are data, not commands or current operational authority.
- **Kaidera action:** Reconcile terminology and architecture with current Cortex
  before considering a Kaidera-native replacement.

### `backend-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"backend-context","path":"skills/context/backend-context.SKILL.md","posture":"reference-only","review_fingerprint":"9eeeea72c575bb61c33434ea7b9254136634b6441ca0363c67a3de5bf299138c","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [backend-context.SKILL.md](../skills/context/backend-context.SKILL.md)
- **Function:** Summarises the legacy FastAPI layout, service layer, async DB
  sessions, authentication, middleware, security hooks, migrations, errors, and
  configuration patterns.
- **Use when:** Orienting to legacy backend files after confirming their current
  structure and conventions in the target repository.
- **Do not use when:** Designing a new API without reading `api-design`, testing
  endpoints without `api-test`, or treating old migration heads and Sprint 22
  controls as current facts.
- **Inputs and output:** No parameters or tools; returns architectural context.
- **Authority and effects:** Reference-only. It neither reads the backend nor
  proves that named controls are deployed.
- **Kaidera action:** Replace fixed migration/control claims with repository-bound
  discovery before promotion.

### `frontend-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"frontend-context","path":"skills/context/frontend-context.SKILL.md","posture":"reference-only","review_fingerprint":"9bf3202eee2a9ba85769e1e43faf8b885582ae98af2b038a33fd04f9f71bf2b8","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [frontend-context.SKILL.md](../skills/context/frontend-context.SKILL.md)
- **Function:** Describes legacy Next.js App Router, TypeScript, Tailwind,
  Zustand, React Flow, API-client, marketplace-component, and accessibility
  conventions.
- **Use when:** Reading the matching legacy frontend after confirming the actual
  package versions, directory layout, and component conventions.
- **Do not use when:** Selecting a current UI stack, editing components, or
  asserting accessibility/runtime behaviour without source and browser proof.
- **Inputs and output:** No parameters or tools; explanatory context only.
- **Authority and effects:** No side effects. Team names and sprint references
  do not assign current ownership.
- **Kaidera action:** Rebuild around current Kaidera UI packages and design-system
  authority rather than mechanically renaming the legacy text.

### `infrastructure-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"infrastructure-context","path":"skills/context/infrastructure-context.SKILL.md","posture":"reference-only","review_fingerprint":"166f434bd66d0fb833b4a77aba1ab5bb9b69f4c5f253ef45b4c0ca9c5edd60f3","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

- **Manifest:** [infrastructure-context.SKILL.md](../skills/context/infrastructure-context.SKILL.md)
- **Function:** Summarises legacy GKE, ArgoCD GitOps, branch, image, Kubernetes,
  Terraform, Helm, worker-pool, and health-endpoint conventions.
- **Use when:** Understanding historical infrastructure design or comparing it
  with current infrastructure-as-code.
- **Do not use when:** Deploying, applying Terraform, operating a cluster, or
  treating named branches/projects/endpoints as current. Use an authorised
  environment-specific runbook and live readback.
- **Inputs and output:** No parameters or tools; `github.com` is listed as a
  domain but grants no network capability.
- **Authority and effects:** Reference-only and non-operational.
- **Kaidera action:** Reconcile with Kaidera's current rootless-Podman/KOS and
  infrastructure authority before reuse.

### `route-handoff-gate`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"context","legacy":false,"name":"route-handoff-gate","path":"skills/context/route-handoff-gate.SKILL.md","posture":"manual-only","review_fingerprint":"19a18cb0eb52c03ff905e2244518b229538147d62f00441ce4abbde150c66067","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [route-handoff-gate.SKILL.md](../skills/context/route-handoff-gate.SKILL.md)
- **Function:** Portable execution gate: a handoff is routed to exactly one owner and lane before any work starts, with the receiving project and role verified.
- **Use when:** Creating, claiming or relaying a handoff, especially across projects or lanes.
- **Do not use when:** As a substitute for the tracking system's own claim; do not route on a guess when the roster is readable.
- **Inputs and output:** No parameters or tools; gate text only.
- **Authority and effects:** Manual-only: the routing decision is recorded by the human or the tracking system, not by this skill.
- **Kaidera action:** Manual-only: pair with Cortex handoff claims; a 409 on claim is a live-sibling alarm.

### `scope-work-gate`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"context","legacy":false,"name":"scope-work-gate","path":"skills/context/scope-work-gate.SKILL.md","posture":"manual-only","review_fingerprint":"a8f712c0349c0deda5d0d02b9dd9ea8eacaabe65267e2e919297cf23f3b316f8","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [scope-work-gate.SKILL.md](../skills/context/scope-work-gate.SKILL.md)
- **Function:** Portable execution gate: work is scoped (what changes, what does not, the proof) before the first edit.
- **Use when:** Before starting any implementation, fix or migration.
- **Do not use when:** For pure reading or investigation tasks with no mutation.
- **Inputs and output:** No parameters or tools; gate text only.
- **Authority and effects:** Manual-only: the scope is accepted by the lead; the gate does not grant write authority.
- **Kaidera action:** Manual-only: the kaidera-sdlc plan template is the fuller form of this gate.

### `sprint-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"sprint-context","path":"skills/context/sprint-context.SKILL.md","posture":"rework-before-use","review_fingerprint":"0f7b5e071dd8a85ff464122510c7b48123ba79e67581352f2d60356f0710f6be","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [sprint-context.SKILL.md](../skills/context/sprint-context.SKILL.md)
- **Function:** Documents the legacy three-file sprint pattern, task-status
  protocol, TDD and verification gates, routing questions, three-strike rule,
  and commit format.
- **Use when:** Interpreting repositories that still explicitly follow that
  sprint contract.
- **Do not use when:** Creating or closing current Cortex work, changing a queue,
  or overriding a project-specific operating plan.
- **Inputs and output:** No parameters or tools; process reference only.
- **Authority and effects:** Cannot create, claim, complete, defer, or close a
  handoff or sprint. The body also describes pull, checkout, commit, push,
  deploy, and PR actions that exceed its empty capability declaration.
- **Kaidera action:** Rework before use: preserve useful verification discipline,
  but derive current queue/handoff semantics from Cortex and separate all Git
  or deployment mutations into authorised workflows.

### `workspace-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"workspace-context","path":"skills/context/workspace-context.SKILL.md","posture":"reference-only","review_fingerprint":"9e73d5872415c6f395eb1b1809c0e72ee3421bbf784fc9e270d29937352d0a14","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [workspace-context.SKILL.md](../skills/context/workspace-context.SKILL.md)
- **Function:** Describes legacy product identity, stack, repository structure,
  terminology, plan tiers, development principles, impact gate, and commit
  format.
- **Use when:** Recovering historical context for EnGenAI-era code or migration
  analysis.
- **Do not use when:** Establishing current Kaidera identity, provider policy,
  repository structure, commercial entitlements, or release status.
- **Inputs and output:** No parameters or tools; contextual output only.
- **Authority and effects:** No side effects and no ownership authority.
- **Kaidera action:** Treat as migration evidence. Replace it with a current,
  repository-bound workspace context rather than a blanket name substitution.

## Development skills

### `adaptech-uiux-design`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write"],"category":"development","legacy":false,"name":"adaptech-uiux-design","path":"skills/development/adaptech-uiux-design.SKILL.md","posture":"bounded-candidate","review_fingerprint":"1ceb786d83938acde65b5fd8504dae2bc2c4c7ce9f892f55f2f8ebd0c5d08950","risk_level":"medium","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [adaptech-uiux-design.SKILL.md](../skills/development/adaptech-uiux-design.SKILL.md)
- **Function:** Governing UI/UX and design-system rulebook for ASW Connect / AdapTech dark-aviation
  dashboards: minimalism as the rationing authority over glassmorphism and neumorphism, computed WCAG
  2.2 AA contrast for the real brand palette, an Apple-HIG/Material-3-derived elevation ladder,
  typography and spacing scales, state matrices, laws-of-UX dashboard layout, and a design
  brief/critique/handoff process.
- **Use when:** Designing or reviewing portal UI, design tokens, components, dashboard layout,
  typography, colour, surfaces, elevation, motion, data-viz chrome, nav-rail, or accessibility; or when
  deciding whether an element should exist at all.
- **Do not use when:** As an authority for a merge, deploy, publish or release — those wait for the
  human release authority. Do not use it to decide product scope, UX taste, naming or messaging: the
  skill itself routes those to a human. Do not treat its `[OWNER-DIRECTIVE]` palette, radius and
  hover-glow rules as portable to products outside the Adaptech/ASW house style.
- **Inputs and output:** No parameters; file read/write for the design artifacts it produces (token
  plans, wireframes, critique reports, verification screenshots). Guidance is reference data otherwise.
- **Authority and effects:** Advisory design method. It authorises no gate and mutates no application
  code; verification must be output that can fail, with rendered-viewport evidence in both themes.
- **Kaidera action:** Bounded candidate: consolidate before runtime use against the consuming project's
  own design system and tokens. The skill's external rules are cited to public design skills and primary
  authorities (WCAG 2.2, Apple HIG Materials, Material Design 3, lawsofux); its palette, radius and
  hover-glow rules are Adaptech house-style owner directives, not external sources, and are marked as
  such in the body. Keep attribution in the manifest.

### `api-design`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"api-design","path":"skills/development/api-design.SKILL.md","posture":"reference-only","review_fingerprint":"c05a3a1dac1600a8675688838d53b4ee09d60990148daed9b36c3306757c1a41","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [api-design.SKILL.md](../skills/development/api-design.SKILL.md)
- **Function:** Provides legacy FastAPI conventions for URLs, Pydantic request
  and response models, pagination, error shapes, authentication, dependencies,
  OpenAPI documentation, and router layout.
- **Use when:** Designing or reviewing an API in a repository that confirms the
  same conventions.
- **Do not use when:** Implementing endpoints without current repository rules,
  validating behaviour, or deciding public compatibility alone. Pair design
  work with `api-test` and the owning API contract.
- **Inputs and output:** No parameters or tools; produces design guidance.
- **Authority and effects:** Reference-only; examples do not edit code or approve
  an API change.
- **Kaidera action:** Reconcile legacy paths, auth objects, and error formats
  before creating a Kaidera-native API design skill.

### `api-test`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"api-test","path":"skills/development/api-test.SKILL.md","posture":"reference-only","review_fingerprint":"9868f046b0fc2d3662777725afd343c984ab1f3a2897eb65e5e7f0009044a5f2","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [api-test.SKILL.md](../skills/development/api-test.SKILL.md)
- **Function:** Provides legacy FastAPI service/unit/integration test structure,
  `AsyncClient` usage, authentication fixtures, async DB mocks, bulk-load
  results, and naming conventions.
- **Use when:** Authoring tests in a matching backend after inspecting the real
  test harness and fixture APIs.
- **Do not use when:** Running tests, changing fixtures, or claiming coverage.
  Use fresh executable evidence under an authorised implementation workflow.
- **Inputs and output:** No parameters or tools; test-pattern reference only.
- **Authority and effects:** No test execution or file writes are authorised.
- **Kaidera action:** Keep useful async-mocking patterns, but bind a future
  version to current packages and repository-native commands.

### `assert-fact-gate`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"development","legacy":false,"name":"assert-fact-gate","path":"skills/development/assert-fact-gate.SKILL.md","posture":"manual-only","review_fingerprint":"1d517b0295c857f6facfda79330d7a79583942674945cd500391d51de1ea80ee","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [assert-fact-gate.SKILL.md](../skills/development/assert-fact-gate.SKILL.md)
- **Function:** Portable execution gate: a fact is asserted only with its source and a check that could have failed.
- **Use when:** Any report, review verdict or decision that states a fact about code, runtime or data.
- **Do not use when:** For opinions or recommendations, which are labelled as such.
- **Inputs and output:** No parameters or tools; gate text only.
- **Authority and effects:** Manual-only: evidence is produced by commands the operator authorised; the gate only demands it.
- **Kaidera action:** Manual-only: matches THE_WAY "verify the effect, never the declaration".

### `assumption-validation`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"assumption-validation","path":"skills/development/assumption-validation.SKILL.md","posture":"bounded-candidate","review_fingerprint":"6d060c1c7a87477382963674450b4600e00c977460a19574663d6a0c60c307ce","risk_level":"medium","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [assumption-validation.SKILL.md](../skills/development/assumption-validation.SKILL.md)
- **Function:** Separates whether an implementation is correct from whether a
  costly, destructive, commercial, or customer-visible product assumption is
  supported by evidence.
- **Use when:** Evaluating ranking/filtering, defaults, API behaviour, billing,
  pricing, quotas, migrations, provider transforms, or irreversible workflows.
- **Do not use when:** The task is solely code correctness, implementation, live
  production research, customer contact, or an attempt to outsource the product
  decision. `open-code-review` covers bounded implementation defects.
- **Inputs:** `change_summary` plus optional `decision_stage`, `evidence_scope`,
  and `decision_owner`.
- **Output:** A decision boundary, assumption ledger, measurement design,
  counterevidence pass, and evidence-qualified recommendation.
- **Authority and effects:** Reads only authorised local/redacted evidence and
  uses ephemeral computation. It cannot browse, access production/customer
  data, spend, deploy, publish, monitor, or make the product decision.
- **Kaidera action:** Keep as a first-wave candidate; require behavioural and
  capability-sandbox evaluation before any binding. Its `github.com` domain is
  inert under the no-browse contract and can be removed unless a future,
  separately authorised evidence-source mode needs it.

### `code-review`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"code-review","path":"skills/development/code-review.SKILL.md","posture":"rework-before-use","review_fingerprint":"b160f4a166045612ddc92b2920465d70b03b17ae766ae2b43b2709376e6203a7","risk_level":"low","trust_tier":"unvetted","version":"2.1.1"} -->

- **Manifest:** [code-review.SKILL.md](../skills/development/code-review.SKILL.md)
- **Function:** Applies a legacy two-stage checklist: specification compliance
  first, then code quality, impact, and a final lightweight verdict.
- **Use when:** Analysing the historical checklist itself after verifying every
  selected product/control assumption against current source.
- **Do not use when:** The target needs immutable receipts, exact layer handling,
  coverage accounting, adversarial verification, or machine JSON. Use
  `open-code-review`; use `ultrareview` for a whole repository.
- **Inputs and output:** No declared parameters/tools; produces a checklist-style
  review only from already supplied context.
- **Authority and effects:** Its declared no-tool/read-only contract conflicts
  with `APPROVED → Merge`, sprint-log recording, and merged-or-ready
  postconditions. It also embeds legacy kill-switch, organisation-scope, CTO,
  frontend, and backend assumptions.
- **Kaidera action:** Rework before use. Make every verdict advisory, remove
  merge/log postconditions and stale controls, then prove loader separation from
  the evidence-gated reviewer.

### `database-migration`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"database-migration","path":"skills/development/database-migration.SKILL.md","posture":"rework-before-use","review_fingerprint":"719ec101ea8655a98544061050bea9faa70316fdacb257103520dad9c104d575","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [database-migration.SKILL.md](../skills/development/database-migration.SKILL.md)
- **Function:** Provides legacy Alembic/PostgreSQL patterns for filenames,
  upgrade/downgrade pairs, safe column changes, data migrations, RLS, audit
  tables, triggers, JSONB, indexes, and migration commands.
- **Use when:** Designing or reviewing a migration after reading the actual
  schema, migration runner, transaction rules, and rollback contract.
- **Do not use when:** Applying a migration, assuming a named migration head, or
  treating generic rollback examples as safe for a live database.
- **Inputs and output:** No parameters or tools; produces migration design
  guidance only.
- **Authority and effects:** No DB connection, SQL execution, or file mutation is
  authorised.
- **Kaidera action:** Rework before use: split design from generate/apply/
  downgrade execution, then bind both to current database authorities,
  transaction policy, crash recovery, and exact schema receipts. Do not carry
  forward blanket claims that every migration is reversible or that a generic
  example is safe for a particular live database.

### `git-workflow`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"git-workflow","path":"skills/development/git-workflow.SKILL.md","posture":"rework-before-use","review_fingerprint":"bc53b022c5bf3fbfa4a94e254a3d112eb96884c6f15f0522f0b578a9b1b7147a","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [git-workflow.SKILL.md](../skills/development/git-workflow.SKILL.md)
- **Function:** Describes legacy branch strategy, sprint naming, conventional
  commits, sprint flow, multi-line commit format, and PR template.
- **Use when:** A repository explicitly adopts this exact workflow.
- **Do not use when:** Committing, pushing, merging, creating PRs, rewriting
  history, or overriding repository-specific instructions without user
  authorisation.
- **Inputs and output:** No parameters or tools; reference guidance only.
- **Authority and effects:** No Git mutation is authorised by this skill.
- **Kaidera action:** Rework before use: prefer current repository rules and
  Cortex handoff policy, correct the malformed `--no-verify` warning, and split
  descriptive conventions from Git mutation.

### `kaidera-sdlc`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write"],"category":"development","legacy":false,"name":"kaidera-sdlc","path":"skills/development/kaidera-sdlc.SKILL.md","posture":"bounded-candidate","review_fingerprint":"77cfabb2d2da5fca69a8def2174466b89fa1015189d34a1f9d731215e8be3547","risk_level":"medium","trust_tier":"unvetted","version":"1.1.0"} -->

- **Manifest:** [kaidera-sdlc.SKILL.md](../skills/development/kaidera-sdlc.SKILL.md)
- **Function:** The AI-native SDLC loop every lead is born with: intent, grill, spec, plan before code, build inside a feedback loop, verify with output that can fail, adversarial review, ship through gates, close the loop.
- **Use when:** Starting or scoping any work, a handoff or incident arrives, or the user asks to plan, spec, grill, review, retro or ship.
- **Do not use when:** As an authorisation for a merge, deploy, publish or release; those wait for the release authority's go (a human). Do not skip the full grill where risk forces it: incidents, destructive work, security, money, customer data, migrations, removals or folds, cross-project change.
- **Inputs and output:** No parameters; file read/write for the intent, spec and plan artifacts it produces; process reference otherwise.
- **Authority and effects:** Advisory method. It never authorises a gate; facts are looked up and decisions are put to the human and awaited.
- **Kaidera action:** Bounded candidate: the canonical source is Kaidera OS `.agents/skills/kaidera-sdlc/` (references, templates, evals); this file is its marketplace projection, rendered by the source's `tools/render-public.py` (its `--check`, run from a Kaidera OS checkout, proves the projection matches; marketplace CI cannot see that source, so `kaidera.source.content_sha256` names the rendered bytes and a stale projection is a review finding, not a CI failure). Never edited here.

### `open-code-review`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"open-code-review","path":"skills/development/open-code-review.SKILL.md","posture":"bounded-candidate","review_fingerprint":"3119a9cd26d311142e49d7ef93fc8f2a9abdaba93cf1022920c18fce3c2a8e08","risk_level":"medium","trust_tier":"unvetted","version":"4.0.1"} -->

- **Manifest:** [open-code-review.SKILL.md](../skills/development/open-code-review.SKILL.md)
- **Machine contract:** [report schema](../spec/open-code-review-report.schema.json) and
  [semantic verifier](../scripts/open-code-review-contract.js).
- **Function:** Reviews an exact workspace, staged index, commit, range, path
  layer, or supplied patch using canonical target/path/policy receipts,
  deterministic diagnostics, semantic bundles, cross-file tracing, independent
  challenge, coverage accounting, and a final target reread.
- **Use when:** The primary object is a bounded change and the user needs
  evidence-cited, fail-closed review rather than general advice.
- **Do not use when:** The target is whole-codebase health (`ultrareview`), the
  user requested implementation rather than review, the repository is moving
  without an honest incomplete verdict, or two same-name skills are loaded.
- **Inputs:** Optional `repo_path`, target selector, merge parent/range style,
  paths/layer, intent, focus, depth, and Markdown/JSON output mode.
- **Output:** Human findings or schema-v4 JSON. JSON is consumable only after
  `node scripts/open-code-review-contract.js <report.json>` succeeds.
- **Authority and effects:** Strictly read-only. It cannot install tools, use an
  external model/service, edit, post comments, commit, push, or deploy. Optional
  Alibaba CLI use requires a separately trusted existing installation and
  immutable policy binding.
- **Kaidera action:** First-wave bounded-review candidate. Preserve the explicit
  Gate 3/4 and source-qualified loader holds.

### `performance-profiling`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"performance-profiling","path":"skills/development/performance-profiling.SKILL.md","posture":"rework-before-use","review_fingerprint":"ec7600bdfe1f8dbe1fd719dcb09ef2ae944c6c61ffdc3d8c2c9255c605bf434e","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

- **Manifest:** [performance-profiling.SKILL.md](../skills/development/performance-profiling.SKILL.md)
- **Function:** Describes baseline timing, Python profiling, SQL analysis,
  indexes, pools, Redis, and Kubernetes resource diagnosis for the legacy stack.
- **Use when:** As historical troubleshooting reference after independently
  establishing the target, data sensitivity, benchmark, and environment.
- **Do not use when:** It would run bearer-token `curl`, live `kubectl`, Redis,
  production database queries, install `py-spy`, or create an index under this
  manifest. Those actions exceed its empty capability declaration and low risk.
- **Inputs and output:** No declared inputs or tools despite executable examples;
  this is the core manifest/body mismatch.
- **Authority and effects:** Runtime use is blocked. Profiling can expose secrets,
  load systems, attach to processes, and mutate a database.
- **Kaidera action:** Split into a safe measurement-planning reference and
  separately governed executable profiles with exact environment/read/write
  capabilities.

### `tdd-workflow`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"tdd-workflow","path":"skills/development/tdd-workflow.SKILL.md","posture":"rework-before-use","review_fingerprint":"b6f01de9d21fd311efee5e43753f535c20f6c8201b258d08eebe16ed6869d082","risk_level":"low","trust_tier":"unvetted","version":"2.0.1"} -->

- **Manifest:** [tdd-workflow.SKILL.md](../skills/development/tdd-workflow.SKILL.md)
- **Function:** Defines design, red test, minimal implementation, five-step
  verification, refactor, red flags, and evidence-based completion.
- **Use when:** An implementation task is separately authorised and repository
  tests support this red-green-refactor workflow.
- **Do not use when:** The user requested review-only work, test execution is not
  allowed, or it would override repository-specific commands and acceptance
  criteria.
- **Inputs and output:** No parameters/tools; process reference only.
- **Authority and effects:** Does not itself authorise writing code or executing
  tests, although its body directs both under an empty capability declaration.
- **Kaidera action:** Rework before use: keep the verification discipline, but
  bind a future skill to current project tooling and explicit implementation,
  file-write, and execution authority. Remove the blanket assertion that a new
  test passing before implementation must be wrong; regression tests can
  legitimately capture existing behaviour.

### `ultrareview`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":false,"name":"ultrareview","path":"skills/development/ultrareview.SKILL.md","posture":"rework-before-use","review_fingerprint":"662b9f53933142b730b218ccaf9bf58ee3e0d220b5c00cf4c140977cbcce85d4","risk_level":"low","trust_tier":"unvetted","version":"1.1.1"} -->

- **Manifest:** [ultrareview.SKILL.md](../skills/development/ultrareview.SKILL.md)
- **Function:** Performs whole-repository or module review across correctness,
  security, change risk, maintainability, blast radius, tests, performance, and
  contract compliance, then challenges material findings.
- **Use when:** A broad health/architecture audit is the primary request and the
  scope, file set, evidence, and review-only boundary are explicit.
- **Do not use when:** Reviewing a bounded diff (`open-code-review`), using a URL
  without network authority, or enabling `fix_mode` under its current empty
  capability declaration.
- **Inputs:** `repo_path`, optional `scope`, `focus`, `depth`, and `fix_mode`.
- **Output:** Ranked findings, refutations, dimension summaries, and coverage
  limits.
- **Authority and effects:** The declared no-tool/low-risk manifest cannot support
  promised repository reads, Git history, subagents, tools, URLs, or writes.
- **Kaidera action:** Split read-only audit from implementation, declare exact
  capabilities, add frozen-target receipts, and evaluate routing against
  `open-code-review` before use.
### `unlazy`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write"],"category":"development","legacy":false,"name":"unlazy","path":"skills/development/unlazy.SKILL.md","posture":"bounded-candidate","review_fingerprint":"6c024e42e50b61df9c9f0a9acf62d063bcc0d2f1ca0aff25ac2ffbb580fbdb5f","risk_level":"medium","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [unlazy.SKILL.md](../skills/development/unlazy.SKILL.md)
- **Function:** Completion discipline for substantial autonomous work: gates written before the work, gates that can fail, nothing dropped silently, every claim re-measured before it is reported.
- **Use when:** Long or multi-part tasks, work that came back half-done, or any return whose failure mode is quiet incompleteness.
- **Do not use when:** Trivial one-step edits, or as a substitute for the repository's own verification commands.
- **Inputs and output:** No parameters; read-only process reference; its optional checker and Stop hook are separate opt-in tooling.
- **Authority and effects:** Advisory. Its gates describe evidence; they do not execute commands or grant authority.
- **Kaidera action:** Bounded candidate: vendored from Leonxlnx/unlazy (MIT) at a pinned version; keep upstream attribution and version in the manifest.


## DevOps skills

The current DevOps set is predominantly EnGenAI-era reference material. None
of these manifests grants shell, Git, cluster, registry, cloud, or file-write
capabilities. Operational examples are therefore inert until a separately
authorised workflow supplies exact environment identity, credentials, change
scope, rollback, and post-action readback.

### `cloud-agnostic-policy`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"devops","legacy":false,"name":"cloud-agnostic-policy","path":"skills/devops/cloud-agnostic-policy.SKILL.md","posture":"manual-only","review_fingerprint":"89d020b538c54eea14a77cd8f67ca9756a02f6700e539e2c1eb1471ac126b043","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [cloud-agnostic-policy.SKILL.md](../skills/devops/cloud-agnostic-policy.SKILL.md)
- **Function:** Policy: infrastructure and deployment choices stay portable across providers; provider-specific services need a recorded exception.
- **Use when:** Designing or reviewing infrastructure, deployment targets or managed services.
- **Do not use when:** For a deliberately provider-bound customer engagement with a recorded ruling.
- **Inputs and output:** No parameters or tools; policy text only.
- **Authority and effects:** Manual-only: exceptions are human rulings, recorded and dated.
- **Kaidera action:** Manual-only: cite the ruling that allows a provider-specific choice; otherwise stay portable.

### `container-build`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"container-build","path":"skills/devops/container-build.SKILL.md","posture":"reference-only","review_fingerprint":"d5ee6350974ac2a515a9f8ffd450a34e3de5b3e88660a1fa5d6283c322d250b0","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [container-build.SKILL.md](../skills/devops/container-build.SKILL.md)
- **Function:** Provides legacy multi-stage container build, numeric non-root
  user, minimal image, ignore-file, caching, tagging, CI, registry, CVE scan,
  and GitOps examples.
- **Use when:** Reviewing a historical container design or borrowing a pattern
  after the current OCI/container authority is checked.
- **Do not use when:** Building, pulling, pushing, scanning, deploying, choosing
  UID/architecture, or changing Containerfiles without a container-specific
  authorised workflow.
- **Inputs and output:** No parameters or tools; produces patterns/templates.
- **Authority and effects:** No engine, registry, network, write, or deployment
  authority. Examples naming Docker/GCP/ArgoCD are not Kaidera defaults.
- **Kaidera action:** Reconcile with Kaidera's current OCI, rootless Podman,
  dependency-lock, provenance, and multi-platform contracts. In particular,
  a mutable `python:3.12-slim` tag is not a pinned image; require exact digest
  and dependency-lock validation before reuse.

### `deploy-gate`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"devops","legacy":false,"name":"deploy-gate","path":"skills/devops/deploy-gate.SKILL.md","posture":"manual-only","review_fingerprint":"9109023eaf0254a2ad1beeff90355a7a63e885766058fcb27e23db833fcaba4e","risk_level":"medium","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [deploy-gate.SKILL.md](../skills/devops/deploy-gate.SKILL.md)
- **Function:** Portable execution gate: no deployment without named authorisation, a rehearsed rollback and pasted pre-flight evidence.
- **Use when:** Any deploy, release or environment mutation.
- **Do not use when:** Local development runs that mutate nothing shared.
- **Inputs and output:** No parameters or tools; gate text only.
- **Authority and effects:** Manual-only: the named human authorises; the agent prepares and stops.
- **Kaidera action:** Manual-only: the Kaidera production gate is the CTO's go; the agent acts up to it and cannot pass it.

### `deploy-to-dev`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"deploy-to-dev","path":"skills/devops/deploy-to-dev.SKILL.md","posture":"manual-only","review_fingerprint":"3be6444aff26183243da2edcb4323cf03680fd377e69d34703c7851491f5d6d1","risk_level":"medium","trust_tier":"unvetted","version":"3.0.2"} -->

- **Manifest:** [deploy-to-dev.SKILL.md](../skills/devops/deploy-to-dev.SKILL.md)
- **Function:** Describes a legacy sprint-branch push, GitHub Actions build,
  image publication, GitOps update, ArgoCD sync, health verification, and
  rollback sequence for `dev.kaidera.app`.
- **Use when:** Historical incident/release analysis only, or after a human has
  independently confirmed that every named environment and pipeline fact is
  still exact.
- **Do not use when:** Deploying Kaidera, pushing any branch, monitoring CI,
  calling the endpoint, applying migrations, or rolling back under this
  no-capability manifest.
- **Inputs and output:** No declared parameters/tools; body expects Git, GitHub,
  network, tests, cluster access, and potentially privileged rollback.
- **Authority and effects:** High-impact external mutation. Explicit deployment
  authority, secret custody, exact artifact receipt, and rollback proof are
  mandatory.
- **Kaidera action:** Do not migrate mechanically. Replace with product-specific
  release runbooks bound to current KOS/Cortex and environment authorities.

### `infra-naming-gate`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"devops","legacy":false,"name":"infra-naming-gate","path":"skills/devops/infra-naming-gate.SKILL.md","posture":"manual-only","review_fingerprint":"ef65f211b252985fdbd829dc47b75b9f6316af899fc188115ceceda8772692b7","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [infra-naming-gate.SKILL.md](../skills/devops/infra-naming-gate.SKILL.md)
- **Function:** Portable execution gate: infrastructure objects follow the naming contract before they are created.
- **Use when:** Creating resources, environments, buckets, clusters, secrets or DNS names.
- **Do not use when:** Renaming existing production resources without a migration plan.
- **Inputs and output:** No parameters or tools; gate text only.
- **Authority and effects:** Manual-only: names are checked against the contract by the operator before creation.
- **Kaidera action:** Manual-only: keep the naming contract in the owning repository; this gate points at it.

### `k8s-deploy`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"k8s-deploy","path":"skills/devops/k8s-deploy.SKILL.md","posture":"reference-only","review_fingerprint":"eae3f56c32f1846eb27913d8c6b560ff85cf30d161ef8bfb206c067035a930d3","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [k8s-deploy.SKILL.md](../skills/devops/k8s-deploy.SKILL.md)
- **Function:** Provides legacy Kubernetes deployment and network-policy
  examples, resources, probes, gVisor RuntimeClass, ArgoCD/GKE conventions,
  and debugging commands.
- **Use when:** Reviewing legacy manifests or extracting general hardening ideas
  after checking current cluster policy.
- **Do not use when:** Applying manifests, reading a cluster, tailing logs,
  changing resources, or claiming gVisor/network-policy coverage.
- **Inputs and output:** No parameters/tools; manifests and commands are
  illustrative reference.
- **Authority and effects:** No Kubernetes or cloud authority.
- **Kaidera action:** Keep research value but do not treat Kubernetes/GKE as the
  KOS appliance runtime contract. The sample egress rule allowing
  `0.0.0.0/0:443` is not a provider allowlist, and an egress-only policy is not
  proof of a complete default-deny posture.

### `sprint-closing`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"sprint-closing","path":"skills/devops/sprint-closing.SKILL.md","posture":"manual-only","review_fingerprint":"d5c40b70f1fa449d643e5cafb01c00b2e6fc21596f9252f4e283fa62ed979eb1","risk_level":"low","trust_tier":"unvetted","version":"2.0.1"} -->

- **Manifest:** [sprint-closing.SKILL.md](../skills/devops/sprint-closing.SKILL.md)
- **Function:** Defines six legacy phases: verify work, update docs, record
  lessons, write closure report, update agent memory, then commit/push/open PR.
- **Use when:** As historical process reference for a repository explicitly
  using that sprint structure.
- **Do not use when:** Closing a Cortex project/handoff, editing memory, creating
  closure files, committing, pushing, opening a PR, or notifying people without
  current authority and Amad's explicit approval.
- **Inputs and output:** No parameters/tools; its described outputs are files,
  Git history, a PR, and notifications.
- **Authority and effects:** Manual-only. The manifest declares no write/Git/
  external capability and cannot perform Phase 6.
- **Kaidera action:** Replace with Cortex-aware project closure and exact
  handoff/status readback rather than a fixed sprint file protocol.

### `terraform-module`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"terraform-module","path":"skills/devops/terraform-module.SKILL.md","posture":"manual-only","review_fingerprint":"72b0563cc8e82b2e5d14cf33f37da8f233632098411a6d4da49b2086fdc45e4e","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

- **Manifest:** [terraform-module.SKILL.md](../skills/devops/terraform-module.SKILL.md)
- **Function:** Provides legacy GCP module layout, GCS state, plan/apply,
  variables, naming, Workload Identity, and anti-pattern guidance.
- **Use when:** Reviewing historical Terraform or borrowing a design pattern
  after validating provider versions, state ownership, and environment policy.
- **Do not use when:** Creating files, initialising providers, reading state,
  planning, applying, destroying, importing, tainting, or accessing Google APIs
  under this manifest.
- **Inputs and output:** No parameters/tools. `www.googleapis.com` is listed but
  no network capability is declared.
- **Authority and effects:** Terraform can change or destroy infrastructure;
  plan review, exact credentials, state locks, backups, approval, and readback
  are external mandatory gates.
- **Kaidera action:** Rebuild as separate read-only module design and governed
  plan/apply skills if Terraform remains in an owning system.

## Documentation skills

Writing and documentation guidance. Reference-only unless a manifest says otherwise.
### `human-voice`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"documentation","legacy":false,"name":"human-voice","path":"skills/documentation/human-voice.SKILL.md","posture":"reference-only","review_fingerprint":"085a5703a7da2c2e83f768f25cee68f9c956b574ebe0ef872f30a31b7abd13fb","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [human-voice.SKILL.md](../skills/documentation/human-voice.SKILL.md)
- **Function:** Writing guidance for prose that reads as a person wrote it: rhythm, specificity, no filler, no machine tells.
- **Use when:** Drafting customer-facing text, docs, changelogs, release notes or messages where tone matters.
- **Do not use when:** Code, logs, evidence tables or any artifact whose format is fixed by a contract.
- **Inputs and output:** No parameters or tools; reference only.
- **Authority and effects:** No side effects; style guidance only.
- **Kaidera action:** Reference-only: fold examples from `skills/documentation/EXAMPLES.md`; keep it out of evidence artifacts.


## Research skills

### `research-brief`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"research","legacy":false,"name":"research-brief","path":"skills/research/research-brief.SKILL.md","posture":"bounded-candidate","review_fingerprint":"559fdbc0d71181a1e91d96e77d7a257d603334360d4771eee8bac55a969bb9db","risk_level":"low","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [research-brief.SKILL.md](../skills/research/research-brief.SKILL.md)
- **Function:** Turns an ambiguous topic into a self-contained, decision-led
  brief with context, subquestions, source hierarchy, contradiction handling,
  evidence gaps, deliverable shape, and stop conditions.
- **Use when:** The user asks for a research brief, deep-research prompt, source
  plan, or bounded research questions for a human or separately approved agent.
- **Do not use when:** The request is to perform the research, browse, call an
  API, invoke a vendor, schedule work, spend money, or publish results.
- **Inputs:** Required `topic`; optional `decision`, `audience`, `constraints`,
  and paragraph/structured `format`.
- **Output:** A portable research brief that distinguishes supplied facts,
  verified facts, assumptions, unknowns, and evidence requirements.
- **Authority and effects:** It may read only the local context needed to draft
  the brief. It must not place secrets, private customer data, unnecessary
  personal data, or confidential source into an external prompt.
- **Kaidera action:** Keep as a first-wave candidate and evaluate routing against
  research execution skills so “draft” cannot silently become “run”. Its
  `github.com` allowed-domain declaration is currently inert and unnecessary:
  the skill forbids browsing and declares no network-capable tool.

## Security skills

### `code-review-security`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"code-review-security","path":"skills/security/code-review-security.SKILL.md","posture":"rework-before-use","review_fingerprint":"106f89f6138b9781226b289a8323794eb57c55a0cd2b2816ff453f3391d07ff8","risk_level":"low","trust_tier":"unvetted","version":"1.1.0"} -->

- **Manifest:** [code-review-security.SKILL.md](../skills/security/code-review-security.SKILL.md)
- **Function:** Supplies an EnGenAI-specific OWASP, authentication,
  authorisation, secrets, tenant-isolation, skill-security, and supply-chain
  checklist, plus optional analyzer signals.
- **Use when:** Analysing the exact legacy EnGenAI implementation, and only
  after each selected check is independently reverified against current source.
- **Do not use when:** Reviewing current Kaidera by default, creating a second
  verdict engine, implying files were inspected, running analyzers, or replacing
  broader threat modelling. A UUID is not proof of authorisation or resistance
  to enumeration.
- **Inputs and output:** No parameters/tools; supporting checklist only.
- **Authority and effects:** Read-only and non-operational.
- **Kaidera action:** Rework before use. Reconcile obsolete EnGenAI controls and
  retain only checks evidenced by current Kaidera architecture.

### `dependency-audit`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"dependency-audit","path":"skills/security/dependency-audit.SKILL.md","posture":"rework-before-use","review_fingerprint":"f550079b886dad8d523866b89fc15d00cdcb1a6c3283588e5e6fa43db7fbc2b1","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [dependency-audit.SKILL.md](../skills/security/dependency-audit.SKILL.md)
- **Function:** Describes Python/npm vulnerability scanning, Bandit, package
  updates, tests, pinning, supply-chain review, CI installation, licence checks,
  and remediation decisions.
- **Use when:** As a legacy checklist or source for a future governed dependency
  evidence workflow.
- **Do not use when:** It would install scanners, query registries/OSV/PyPI/npm,
  run `npx`, write reports, edit locks/requirements, patch packages, or run tests
  under its empty capabilities and low risk.
- **Inputs and output:** No declared inputs/tools despite network, install,
  execution, write, and remediation examples.
- **Authority and effects:** Runtime use is blocked. Scanner provenance,
  database freshness, network egress, report custody, licences, and fixes need
  separate exact contracts.
- **Kaidera action:** Split inventory, offline evidence collection, legal review,
  and remediation into distinct skills/workflows with pinned tools and schemas.
  Its blanket GPL/LGPL commercial-compatibility rule, arbitrary downloads, and
  recency heuristics are not legal or supply-chain proof; route licence
  conclusions to ratified legal/policy review.

### `incident-response`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"incident-response","path":"skills/security/incident-response.SKILL.md","posture":"rework-before-use","review_fingerprint":"1af7637e4b44cb9d4ef190645f8f4bc42ee97c38e83d197c97cd141b295c1a0f","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

- **Manifest:** [incident-response.SKILL.md](../skills/security/incident-response.SKILL.md)
- **Function:** Defines legacy severity classification, SIEM/Kubernetes triage,
  kill switches, pod quarantine, evidence export, root cause, skill rejection,
  recovery, and post-incident review.
- **Use when:** Historical runbook analysis or controlled tabletop exercises
  after current incident command and evidence-custody policy are supplied.
- **Do not use when:** Accessing production, using admin tokens/DB URLs, changing
  Redis kill switches, cordoning/scaling infrastructure, exporting customer
  evidence, rejecting skills, or clearing containment under this manifest.
- **Inputs and output:** No declared parameters/tools; the body assumes highly
  privileged cluster, database, Redis, admin API, file-write, and network access.
- **Authority and effects:** Destructive and security-critical. The source
  contains an unsafe order that scales workers to zero before capturing their
  logs, risking loss of volatile evidence; `/tmp` exports also lack hash and
  chain-of-custody receipts. Credentials and a human alone do not repair this.
- **Kaidera action:** Rework before use, then keep the replacement human-gated.
  Rebuild around current incident command, preservation before mutation,
  evidence custody, rollback, and exact readback; never inject credentials or
  executable containment commands as ordinary skill context.

### `prompt-injection-test`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":false,"name":"prompt-injection-test","path":"skills/security/prompt-injection-test.SKILL.md","posture":"reference-only","review_fingerprint":"7c03f83cd15029aaa606c2a04424f53b2e6fd838772b4bcc48ea7afba68d4933","risk_level":"low","trust_tier":"unvetted","version":"2.0.0"} -->

- **Manifest:** [prompt-injection-test.SKILL.md](../skills/security/prompt-injection-test.SKILL.md)
- **Function:** Defines threat categories, non-injectable corpus custody,
  rejection properties, evidence receipts, and regression expectations for a
  separately controlled prompt-injection boundary harness.
- **Use when:** Designing or reviewing the test contract without embedding live
  attack content in an ordinary skill.
- **Do not use when:** Executing attacks, inspecting production audit data,
  mutating a runtime, or storing literal/encoded payloads inside this skill.
- **Inputs and output:** No parameters/tools; produces a non-executing design
  checklist.
- **Authority and effects:** Read-only; corpus access and runtime execution stay
  outside this skill under separate provenance and access control.
- **Kaidera action:** Retain as a non-executing reference. Gate 2 pattern success
  remains bounded and must not be marketed as semantic injection proof.

### `security-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"security-context","path":"skills/security/security-context.SKILL.md","posture":"reference-only","review_fingerprint":"40cfdd9e79fda89d1973581dcc076654c8fec51d8a593546f16c8dee4787f2aa","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [security-context.SKILL.md](../skills/security/security-context.SKILL.md)
- **Function:** Summarises the legacy Lethal Trifecta threat model, Sprint 22
  controls, OWASP checklist, forbidden patterns, secure coding examples, SIEM
  events, and trust-tier injection rules.
- **Use when:** Reviewing legacy EnGenAI security assumptions and comparing them
  with current implementation evidence.
- **Do not use when:** Treating named controls/events as deployed, promoting a
  trust tier, or replacing current Kaidera threat models and security policy.
  Its XML-wrapper claim is an unverified design assertion, not proof that prompt
  override is prevented; the body's word “Mandatory” grants no authority.
- **Inputs and output:** No parameters/tools; security reference only.
- **Authority and effects:** No scanning, enforcement, or incident authority.
- **Kaidera action:** Preserve general secure-coding ideas, but rederive control
  and event claims from current source and runtime evidence.

## Common usage examples

These examples express routing intent only. They do not bypass the trust and
capability gates.

| Request | Expected route |
|---|---|
| “Review my staged change and give me only reproducible defects.” | `open-code-review`, target `staged` |
| “Audit this entire authentication module for health and architecture debt.” | `ultrareview`, but only after its capability contract is repaired |
| “Does this pricing default make sense, independent of whether the code works?” | `assumption-validation` |
| “Write a research brief comparing three provider strategies.” | `research-brief` |
| “Use the EnGenAI security checklist while reviewing this patch.” | No automatic route; reverify individual legacy checks under `open-code-review` |
| “Show the historical branch and PR conventions.” | No runtime route; consult `git-workflow` only as quarantined historical evidence pending rework |
| “Deploy this to dev now.” | No automatic skill route; separately authorised deployment workflow required |
| “Shut down the compromised worker fleet.” | No automatic skill route; current incident commander and controlled runbook required |
| “Design a test for whether this loader rejects injected policy text.” | `prompt-injection-test` for non-executing design; separate controlled harness for execution |

## Portfolio overlaps and collision rules

### Context versus execution

The six context skills explain historical architecture and conventions. A
development, DevOps, or security skill may consult them as evidence, but context
never grants execution authority and never outranks current source/runtime
facts.

### Design versus implementation

`api-design`, `api-test`, `database-migration`, `container-build`, `k8s-deploy`,
and `terraform-module` are pattern references. They do not authorise file
changes, tests, builds, cluster actions, database operations, or infrastructure
apply. Future implementation skills should be separate and declare the exact
write/execution boundary rather than expanding these reference manifests
silently.

### Review versus remediation

Review and audit skills remain read-only. A review request does not imply
permission to fix findings. `ultrareview` currently exposes `fix_mode`; that is
one reason it is classified rework-before-use. Kaidera should use a separate
implementation/remediation workflow with its own authority, target, tests, and
readback.

### Security support versus verdict authority

Supporting security context can raise questions and propose candidate checks,
but the selected primary reviewer owns evidence, deduplication, coverage, and
the verdict. This prevents `code-review`, `open-code-review`, `ultrareview`, and
`code-review-security` from issuing irreconcilable conclusions for one target.

## Lifecycle from source to runtime

| Stage | Required evidence | Current state |
|---|---|---|
| Source candidate | Exact file, author, licence, attribution, version, manifest | Present for 27 skills |
| Gate 1 | Strict YAML/frontmatter/path/category/capability/domain validation | Implemented subset |
| Gate 2 | Bounded injection/credential pattern scan | Implemented subset |
| Static contract evaluation | Deterministic routing/collision/ceiling fixtures | Implemented for 3 skills only |
| Gate 3 | Real model plus filesystem/process/network/tool sandbox evidence | HOLD |
| Gate 4 | Human approval, trusted reviewer root, signature, provenance | HOLD |
| Loader binding | Source-qualified identity, collision resolution, least capability | HOLD |
| Runtime use | Host verifies evidence again and records invocation receipt | Not established by this repository |
| Evolution | Versioned change, regression evaluation, reapproval, rollback | Target policy only |

The three static-evaluated skills are `open-code-review`,
`assumption-validation`, and `research-brief`. Their evaluator claim is exactly
`STATIC_CONTRACT_ONLY`; it does not exercise a model, host loader, tool, network,
write path, or sandbox.

## Known portfolio debt

### Legacy identity and architecture

Most original entries still name EnGenAI, fixed sprint numbers, old roles,
legacy repository paths, branches, endpoints, cloud projects, and deployed
controls. These should be migrated only after reviewing the owning Kaidera
source. A global word replacement would destroy useful history and can create
false current-state claims.

The legacy sources also disagree with one another. `container-build` and
`k8s-deploy` use `europe-west2` and platform/marketing services, while
`deploy-to-dev` uses `us-central1` and API/App/ShareDB services. Separately,
`backend-context` names migration head `026` while `database-migration` presents
`027`. No combined legacy runbook or context bundle is coherent current-state
evidence; resolve each fact against its owning source.

### Capability/body mismatches

The current strict manifest validator checks declared fields but does not prove
that every instruction in every body stays inside those declarations. Confirmed
examples include:

- `performance-profiling`: bearer-token HTTP, live Kubernetes, process
  profiling, database queries, Redis access, installs, and index creation while
  declaring low risk and no tools;
- `dependency-audit`: registry-backed scanners, package installation, `npx`,
  report writes, dependency edits, and test execution while declaring low risk
  and no tools;
- `ultrareview`: repository reads, Git history, potential URLs, tools/subagents,
  and opt-in writes while declaring low risk and no tools;
- `code-review`: merge, sprint-log, and external state postconditions plus stale
  product controls under a no-tool/read-only manifest;
- `sprint-context`, `database-migration`, `git-workflow`, and `tdd-workflow`:
  Git, database, code-write, deploy, or test execution described by no-tool
  reference manifests; and
- `deploy-to-dev`, `sprint-closing`, `terraform-module`, and
  `incident-response`: operational mutation described by no-tool reference
  manifests.

The posture labels in this guide prevent those gaps from being hidden, but they
are not runtime enforcement. Complete body-to-capability reconciliation remains
a prerequisite for binding any catalogue skill.

### Licensing and attribution

The root repository is CC-BY-4.0 while individual manifests may say
Apache-2.0 or another licence. Donor attribution is recorded for Alibaba
OpenCodeReview and David Ondrej sources, but maintainers must ratify which
licence controls each redistributed skill and supporting file before external
publication.

### Naming and router precision

Several skills share vocabulary such as review, security, tests, deployment,
and research. Runtime selection needs positive, abstention, collision, and
safety-boundary evaluations. Same-name skills from different repositories need
source-qualified IDs, not first-match filename resolution.

## Recommended portfolio roadmap

1. Keep `open-code-review`, `assumption-validation`, and `research-brief` as the
   first bounded candidates; do not promote them until Gate 3/4.
2. Repair `ultrareview` as a strictly read-only whole-codebase audit and move
   all fix behaviour to a separate implementation skill.
3. Rebuild `dependency-audit` as distinct inventory, offline evidence,
   licence-review, and remediation workflows with pinned tools and schemas.
4. Replace `incident-response` with a minimal human-gated index and controlled
   runbooks that preserve evidence before containment mutations.
5. Replace legacy context files with current repository-bound Kaidera context,
   preserving historical compatibility notes separately.
6. Create one `systematic-diagnosis` skill after proving it does not collide
   with performance profiling, incident response, or review routes.
7. Consolidate overlapping planning donors into one manual `decision-gate`
   rather than adding several near-identical skills.
8. Consider a bounded `learning-workspace` only after upstream attribution and
   data/privacy boundaries are settled.
9. Build real behavioural and capability-isolation evaluation before importing
   additional public catalogues.

## Maintaining this canonical catalogue

Every skill addition, removal, rename, version/category/trust/risk/capability
change, or substantial routing change must update this document in the same
commit.

Each detailed entry contains one machine-readable
`kaidera-skill-catalog-entry` comment. Its `review_fingerprint` is the SHA-256 of
the canonical complete generated marketplace record, binding the body hash,
description, parameters, safety constraints, attribution, domains, and all
manifest metadata. `scripts/test-skills-catalog.js` regenerates those records
from the carried skills and fails when:

- a skill is missing or duplicated;
- an unknown skill is documented;
- path, version, category, trust, risk, or capability metadata drifts;
- the visible summary posture, risk, or capability cells drift;
- the declared total/category/trust/legacy counts drift;
- a posture or legacy classification differs from the reviewed policy baseline;
- ownership, licence, domain, attribution, local links, or README discovery
  drifts;
- an unsupported posture is used; or
- the required operating, lifecycle, debt, and maintenance sections disappear.

The test proves generated-contract/inventory synchronization and required prose
shape, not raw-byte identity or the semantic truth of prose judgements. A
person can still edit a function summary into a false sentence without changing
its shape. Reviewers must validate functional summaries, posture changes,
legacy claims, and routing boundaries against the fingerprint-bound skill body
and Kaidera source of truth.

Run:

```sh
npm test
node scripts/test-skills-catalog.js
node scripts/generate-marketplace.js --dry-run
```

## Related canonical and evidence documents

- [Skill format and trust policy](../spec/SKILL_FORMAT.md)
- [Generated marketplace](../.claude-plugin/marketplace.json)
- [Static skill evaluations](static-skill-evaluations.md)
- [Open-code-review report schema](../spec/open-code-review-report.schema.json)
- [David Ondrej portfolio review](reviews/2026-08-24-davidondrej-skills.md)
- [Contributing guide](../CONTRIBUTING.md)
