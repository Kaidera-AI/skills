# Kaidera Skills Catalogue and Operating Guide

Status: **canonical human-facing catalogue; source candidate; runtime and trust HOLD**

Catalogue date: **2026-10-03**

Total skills: **45**

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

- All 45 skills are `unvetted`.
- Catalogue presence, a body hash, static validation, or a local commit is not
  approval to inject a skill into an agent.
- Gate 1 strict manifest checks and a bounded Gate 2 pattern scan exist.
- Gate 3 model/tool/capability isolation is not implemented and remains HOLD.
- Gate 4 reviewer authority, signing, and provenance are not implemented and
  remain HOLD.
- The repository-level CC-BY-4.0 licence and per-skill licence declarations do
  not yet have a ratified precedence rule; external redistribution is held.
- The Kaidera workflow is named `evidence-code-review`; Alibaba retains `open-code-review`. A host must select a
  source-qualified identity and inject only one; prompt text cannot resolve a
  loader collision after both skills are present.

## Portfolio summary

| Category | Skills |
|---|---:|
| Context | 8 |
| Development | 21 |
| DevOps | 8 |
| Documentation | 1 |
| Research | 2 |
| Security | 5 |

| Declared trust tier | Skills |
|---|---:|
| `unvetted` | 45 |

| Operating posture | Skills |
|---|---:|
| Bounded candidate | 10 |
| Reference-only | 15 |
| Manual-only | 10 |
| Rework before use | 10 |

Legacy entries: **22**

Current-source entries: **23**

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
| Configure or run a portable AI+human development lifecycle | `development-workflow` | Non-development project, or another lifecycle is already authoritative; resolve ownership first |
| Understand legacy workspace, backend, frontend, infrastructure, sprint, or agent-platform conventions | matching `*-context` skill | Current repository/Cortex evidence disagrees, or implementation is requested rather than context |
| Review a bounded worktree, staged change, commit, range, path set, or supplied patch | `evidence-code-review` | The target is a whole repository/module health audit |
| Consult the legacy lightweight completed-change checklist | No automatic skill route; `code-review` is held for authority and capability rework | A merge/log/acceptance verdict or current Kaidera control is implied |
| Audit a whole repository or module | `codebase-audit` | The object is primarily a bounded diff; use `evidence-code-review` |
| Consult a legacy product-specific security checklist while reviewing | No automatic skill route; reverify individual `code-review-security` checks as untrusted context under `evidence-code-review` | A second verdict engine or an unverified legacy control claim would be created |
| Validate whether a customer-visible assumption is supported | `assumption-validation` | The request is merely code correctness, implementation, or live production research |
| Draft a decision-led research mission | `research-brief` | The user asked to perform the research rather than draft its brief |
| Research companies, current leaders and professional profiles | `marketing-web-research` | Only a research brief is requested; invitations, email, follows or paid tools lack applicable authority |
| Design APIs, tests, migrations, containers, Kubernetes, or Terraform | matching reference skill | Current project conventions differ or execution/changes are requested without authority |
| Deploy, close a sprint, or apply infrastructure | manual-only runbook | Exact environment identity, approval, credentials, or rollback evidence is missing |
| Respond to an incident | No automatic skill route; rebuild the held `incident-response` source into a current human-gated runbook | Incident command, preservation-before-mutation, evidence custody, rollback, or readback is missing |
| Design or review a prompt-injection boundary test | `prompt-injection-test` | Execution, corpus access, runtime access, or literal payload injection is requested |

### Review-skill separation

- `evidence-code-review` is the portfolio-designated evidence contract for bounded
  changes; it is not runtime authority until Gate 3/4 and loader binding pass.
- `code-review` is a smaller legacy checklist whose merge/log postconditions
  exceed its no-tool declaration; it is held pending rework.
- `codebase-audit` is for whole-codebase/module health and currently needs
  capability-contract rework before runtime use.
- `code-review-security` contains a legacy product checklist that must be
  reverified before individual checks are used; it does not issue a competing
  bounded-change verdict.
- `prompt-injection-test` designs a separately controlled test corpus and
  harness; it is not a general code-review skill.

## Catalogue at a glance

| Category | Skill | Version | Function | Posture | Risk / declared capabilities |
|---|---|---:|---|---|---|
| Development | `development-workflow` | `1.0.0` | Portable AI+human SDLC, review, risk-based QA and service operations | Bounded candidate | medium / file read, file write, interpreter, web search |
| Context | `agent-platform-context` | `1.0.2` | Legacy agent executor, team, mailbox, Redis memory, and lifecycle reference | Reference-only, legacy | low / none |
| Context | `backend-context` | `1.0.2` | Legacy FastAPI, service, DB, auth, middleware, and security conventions | Reference-only, legacy | low / none |
| Context | `frontend-context` | `1.0.2` | Legacy Next.js, React Flow, Tailwind, Zustand, and TypeScript conventions | Reference-only, legacy | low / none |
| Context | `infrastructure-context` | `1.0.3` | Legacy GKE, ArgoCD, Terraform, Helm, CI/CD, and hardening overview | Reference-only, legacy | low / none |
| Context | `sprint-context` | `1.0.2` | Legacy sprint files, status protocol, quality gates, and commit conventions | Rework before use, legacy | low / none declared |
| Context | `workspace-context` | `1.0.2` | Legacy workspace identity, stack, structure, terminology, and principles | Reference-only, legacy | low / none |
| Context | `route-handoff-gate` | `1.0.1` | Verifies project, lane, layer, role, and dependency boundaries before creating | Manual-only | low / file read |
| Context | `scope-work-gate` | `1.0.1` | Confirms that proposed work belongs to the current project, role, lane, and | Manual-only | low / file read |
| Development | `api-design` | `1.0.2` | Legacy FastAPI URL, schema, auth, error, pagination, and OpenAPI patterns | Reference-only, legacy | low / none |
| Development | `api-test` | `1.0.2` | Legacy FastAPI contract/integration testing and async mock patterns | Reference-only, legacy | low / none |
| Development | `assumption-validation` | `1.0.0` | Evidence-gates costly or customer-visible product assumptions | Bounded candidate | medium / file read, interpreter |
| Development | `code-review` | `2.1.2` | Legacy lightweight checklist with unauthorised merge/log postconditions | Rework before use, legacy | low / none declared |
| Development | `database-migration` | `1.0.2` | Legacy Alembic/PostgreSQL migration and rollback patterns | Rework before use, legacy | low / none declared |
| Development | `git-workflow` | `1.0.2` | Legacy branch, commit, PR, and sprint Git conventions | Rework before use, legacy | low / none declared |
| Development | `evidence-code-review` | `4.0.2` | Exact-target, evidence-gated, adversarial bounded-change review | Bounded candidate | medium / file read, interpreter |
| Development | `performance-profiling` | `1.0.3` | Legacy live API/Kubernetes/DB/Redis profiling workflow | Rework before use, legacy | low / none declared |
| Development | `tdd-workflow` | `2.0.2` | Legacy red-green-refactor and five-step verification workflow | Rework before use, legacy | low / none declared |
| Development | `codebase-audit` | `1.1.2` | Whole-codebase health audit with read-only findings and explicit coverage | Rework before use | medium / file read, interpreter |
| Development | `assert-fact-gate` | `1.0.1` | Requires a fresh source check before reporting repository, build, test, | Manual-only | low / file read |
| Development | `kaidera-sdlc` | `1.3.0` | The Kaidera AI-native SDLC: the operating loop every lead runs for an epic, feature, fix, | Bounded candidate | medium / file read, file write |
| Development | `gavel` | `1.0.1` | Typed judgments for a project lead: triage returns, check handoffs, rank work (TypeSafe System One) | Reference-only | medium / file read, interpreter |
| Development | `jev-backlog-rank` | `0.1.0` | Check an accountable lead's backlog ordering against explicit dependencies and delay risk; the human retains priority authority. | Bounded candidate | medium / file read, interpreter |
| Development | `jev-handoff-check` | `0.1.0` | Check a drafted worker handoff's receipt contract and blocked protocol before the accountable lead sends it. | Bounded candidate | medium / file read, interpreter |
| Development | `jev-option-decision` | `0.1.0` | Examine one bounded implementation or architecture choice with named candidates, evidence and requirements; the human decides. | Bounded candidate | medium / file read, interpreter |
| Development | `jev-return-triage` | `0.1.0` | Advisory receipt-based triage of an arrived worker return, handback or consult by its accountable lead. | Bounded candidate | medium / file read, interpreter |
| Development | `jev` | `0.1.0` | Jev core: common fail-closed policy reader, sanitizer and typed model transport. | Reference-only | medium / file read, interpreter, file write |
| Development | `completion-evidence` | `1.0.1` | Completion discipline for substantial autonomous work. Write acceptance gates | Bounded candidate | medium / file read, file write |
| Development | `prompt-master` | `1.8.1` | MIT-attributed Kaidera adaptation: writes one optimized prompt for a named AI tool from a rough request | Reference-only | low / none |
| DevOps | `container-build` | `1.0.2` | Legacy hardening-oriented multi-stage image and CI build examples | Reference-only, legacy | low / none |
| DevOps | `deploy-to-dev` | `3.0.3` | Legacy sprint-branch GitOps deployment runbook | Manual-only, legacy | medium / none declared |
| DevOps | `k8s-deploy` | `1.0.2` | Legacy Kubernetes, ArgoCD, GKE, probes, resources, and network policy patterns | Reference-only, legacy | low / none |
| DevOps | `sprint-closing` | `2.0.2` | Legacy six-phase sprint closure, commit, push, and PR procedure | Manual-only, legacy | low / none declared |
| DevOps | `terraform-module` | `1.0.3` | Legacy GCP Terraform module, state, plan, apply, and identity patterns | Manual-only, legacy | low / none declared |
| DevOps | `cloud-agnostic-policy` | `1.0.0` | Reviews infrastructure choices for portability and prevents an architecture | Manual-only | low / file read |
| DevOps | `deploy-gate` | `1.0.1` | Gates pushes, pull requests, merges, releases, and deployments on exact target, | Manual-only | medium / file read |
| DevOps | `infra-naming-gate` | `1.0.0` | Validates proposed infrastructure names against a portable organization, | Manual-only | low / file read |
| Research | `marketing-web-research` | `0.1.002` | Customer-configurable company and professional-profile research with separate action receipts | Manual-only | high / file read, file write, web search, external connector |
| Research | `research-brief` | `1.0.0` | Drafts a self-contained decision-led brief without executing research | Bounded candidate | low / file read |
| Security | `code-review-security` | `1.1.2` | Legacy EnGenAI security checklist with unverified control claims | Rework before use, legacy | low / none declared |
| Security | `dependency-audit` | `1.0.2` | Legacy dependency scan, install, remediation, and report workflow | Rework before use, legacy | low / none declared |
| Security | `incident-response` | `1.0.3` | Legacy containment/evidence runbook with unsafe preservation ordering | Rework before use, legacy | low / none declared |
| Security | `prompt-injection-test` | `2.0.0` | Read-only design for controlled prompt-injection boundary testing | Reference-only | low / none |
| Security | `security-context` | `1.0.2` | Legacy threat model, OWASP, forbidden patterns, SIEM, and trust rules | Reference-only, legacy | low / none |
| Documentation | `human-voice` | `1.0.1` | Rewrite, audit, or draft public-facing prose so it uses checkable specifics | Reference-only | low / none |

## Ownership, licensing, attribution, and domain metadata

These are manifest declarations, not independently ratified ownership, licence,
network, or provenance evidence. `Allowed domains` remains inert unless a
runtime separately grants a network-capable tool. The root/per-skill licence
precedence issue remains a release hold.

| Skill | Declared author | Declared licence | Allowed domains | Donor attribution |
|---|---|---|---|---|
| `development-workflow` | `Kaidera-AI` | `Apache-2.0` | `github.com`, `c4model.com`, `csrc.nist.gov`, `google.github.io`, `www.peoplecert.org` | — |
| `agent-platform-context` | `kaidera` | `Apache-2.0` | None | — |
| `backend-context` | `kaidera` | `Apache-2.0` | None | — |
| `frontend-context` | `kaidera` | `Apache-2.0` | None | — |
| `infrastructure-context` | `kaidera` | `Apache-2.0` | `github.com` | — |
| `sprint-context` | `kaidera` | `Apache-2.0` | None | — |
| `workspace-context` | `kaidera` | `Apache-2.0` | None | — |
| `api-design` | `kaidera` | `Apache-2.0` | None | — |
| `api-test` | `kaidera` | `Apache-2.0` | None | — |
| `assumption-validation` | `Kaidera-AI` | `Apache-2.0` | `github.com` | [David Ondrej](https://github.com/davidondrej/skills/tree/69c3ae5228eb146724fd23dac3d43eab5805bcc3/skills/ops-and-setup/risky-changes) |
| `code-review` | `kaidera` | `Apache-2.0` | None | — |
| `database-migration` | `kaidera` | `Apache-2.0` | None | — |
| `git-workflow` | `kaidera` | `Apache-2.0` | None | — |
| `evidence-code-review` | `Kaidera-AI` | `Apache-2.0` | `github.com`, `research.google`, `semgrep.dev` | [Alibaba OpenCodeReview contributors](https://github.com/alibaba/open-code-review/tree/0c44f1049e054b062b8900b93a4828f7b0baf77b) |
| `performance-profiling` | `kaidera` | `Apache-2.0` | None | — |
| `tdd-workflow` | `kaidera` | `Apache-2.0` | None | — |
| `codebase-audit` | `Kaidera` | `Apache-2.0` | None | — |
| `container-build` | `kaidera` | `Apache-2.0` | None | — |
| `deploy-to-dev` | `kaidera` | `Apache-2.0` | `dev.engenai.app` | — |
| `k8s-deploy` | `kaidera` | `Apache-2.0` | None | — |
| `sprint-closing` | `kaidera` | `Apache-2.0` | None | — |
| `terraform-module` | `kaidera` | `Apache-2.0` | `www.googleapis.com`, `developer.hashicorp.com` | — |
| `marketing-web-research` | `Kaidera-AI` | `Apache-2.0` | `linkedin.com`, `x.com` | — |
| `research-brief` | `Kaidera-AI` | `Apache-2.0` | `github.com` | [David Ondrej](https://github.com/davidondrej/skills/tree/69c3ae5228eb146724fd23dac3d43eab5805bcc3/skills/research-and-web/research-prompt) |
| `code-review-security` | `kaidera` | `Apache-2.0` | None | — |
| `dependency-audit` | `kaidera` | `Apache-2.0` | None | — |
| `incident-response` | `kaidera` | `Apache-2.0` | None | — |
| `prompt-injection-test` | `kaidera` | `Apache-2.0` | None | — |
| `security-context` | `kaidera` | `Apache-2.0` | None | — |
| `route-handoff-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `scope-work-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `assert-fact-gate` | `Kaidera` | `Apache-2.0` | None | — |
| `kaidera-sdlc` | `Kaidera-AI` | `Apache-2.0` | `github.com`, `claude.com` | — |
| `gavel` | `Kaidera-AI` | `Apache-2.0` | `api.typesafe.ai`, `docs.typesafe.ai`, `github.com` | — |
| `jev-backlog-rank` | `Kaidera-AI` | `Apache-2.0` | `api.typesafe.ai`, `github.com` | [TypeSafe AI and Joey Kudish](https://github.com/jkudish/jev-mcp) |
| `jev-handoff-check` | `Kaidera-AI` | `Apache-2.0` | `api.typesafe.ai`, `github.com` | [TypeSafe AI and Joey Kudish](https://github.com/jkudish/jev-mcp) |
| `jev-option-decision` | `Kaidera-AI` | `Apache-2.0` | `api.typesafe.ai`, `github.com` | [TypeSafe AI and Joey Kudish](https://github.com/jkudish/jev-mcp) |
| `jev-return-triage` | `Kaidera-AI` | `Apache-2.0` | `api.typesafe.ai`, `github.com` | [TypeSafe AI and Joey Kudish](https://github.com/jkudish/jev-mcp) |
| `jev` | `Kaidera-AI` | `Apache-2.0` | `api.typesafe.ai`, `docs.typesafe.ai`, `github.com` | [TypeSafe AI and Joey Kudish](https://github.com/jkudish/jev-mcp) |
| `completion-evidence` | `kaidera-ai` | `MIT` | `github.com` | [Leonxlnx](https://github.com/Leonxlnx/unlazy) |
| `prompt-master` | `nidhinjs` | `MIT` | `github.com` | [nidhinjs](https://github.com/nidhinjs/prompt-master) |
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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"agent-platform-context","path":"skills/context/agent-platform-context.SKILL.md","posture":"reference-only","review_fingerprint":"326ec163c15c046d6bef0cd535453cf412efae81b0b3998d8a9ddf56e141ca39","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"backend-context","path":"skills/context/backend-context.SKILL.md","posture":"reference-only","review_fingerprint":"17ce43e60733a9256f6b70d1db207d4d3cf3611d7c16a19168082a72a62b5384","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"frontend-context","path":"skills/context/frontend-context.SKILL.md","posture":"reference-only","review_fingerprint":"831fcbee76baac60c99c03b9989a41a64dbef2a02e6e7bf2994bd677f9643446","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"infrastructure-context","path":"skills/context/infrastructure-context.SKILL.md","posture":"reference-only","review_fingerprint":"1f132dd832f16754f0565e9b12ae985fa45acc061f186403f94bf2c68a827fce","risk_level":"low","trust_tier":"unvetted","version":"1.0.3"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"context","legacy":false,"name":"route-handoff-gate","path":"skills/context/route-handoff-gate.SKILL.md","posture":"manual-only","review_fingerprint":"1d3814b601dbf257fc0b88e36fb2419f4acda978278658a7550bdea6cc753b89","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [route-handoff-gate.SKILL.md](../skills/context/route-handoff-gate.SKILL.md)
- **Function:** Portable execution gate: a handoff is routed to exactly one owner and lane before any work starts, with the receiving project and role verified.
- **Use when:** Creating, claiming or relaying a handoff, especially across projects or lanes.
- **Do not use when:** As a substitute for the tracking system's own claim; do not route on a guess when the roster is readable.
- **Inputs and output:** Required `work`; file reading produces a bounded handoff draft and ownership assessment.
- **Authority and effects:** No queue/API write capability. The authorised operator creates and supplies readback; unavailable delivery evidence stays unverified.
- **Kaidera action:** Check current response details for any claim conflict; a bare HTTP status does not establish who owns a handoff.

### `scope-work-gate`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"context","legacy":false,"name":"scope-work-gate","path":"skills/context/scope-work-gate.SKILL.md","posture":"manual-only","review_fingerprint":"1f338958771343dd6feba7c99544369c3d7d00214531eced00e9ecbb58bf996b","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [scope-work-gate.SKILL.md](../skills/context/scope-work-gate.SKILL.md)
- **Function:** Portable execution gate: work is scoped (what changes, what does not, the proof) before the first edit.
- **Use when:** Before starting any implementation, fix or migration.
- **Do not use when:** For pure reading or investigation tasks with no mutation.
- **Inputs and output:** Required `work`; file reading produces an advisory project, role, lane and objective assessment.
- **Authority and effects:** No assignment or execution capability. Existing valid authority controls the operator's next step.
- **Kaidera action:** Keep scope and ownership explicit; route external execution through its authorised owner.

### `sprint-context`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"sprint-context","path":"skills/context/sprint-context.SKILL.md","posture":"rework-before-use","review_fingerprint":"fffccf9524cd64d02c5c6292470507f6f5db6c1c698bad8b512eb6dc291ff417","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"context","legacy":true,"name":"workspace-context","path":"skills/context/workspace-context.SKILL.md","posture":"reference-only","review_fingerprint":"3993edfa47f3475e38cd2782800cb2a3f8a28f5a76e7bf5ae3cdffb86f071c55","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

### `api-design`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"api-design","path":"skills/development/api-design.SKILL.md","posture":"reference-only","review_fingerprint":"20fa22cd8fd734decded43a42490b604d1568cbba675ef152e87e9e2a58da7ac","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"api-test","path":"skills/development/api-test.SKILL.md","posture":"reference-only","review_fingerprint":"05d4ebc92f55d201c92212b7ada5dd9c31631bbf59eb75c79a4933f67062402d","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"development","legacy":false,"name":"assert-fact-gate","path":"skills/development/assert-fact-gate.SKILL.md","posture":"manual-only","review_fingerprint":"4d43914baeae4ee71092aaee2e8a49b4d804d30f56b9e1c7c0c97158d0e00263","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [assert-fact-gate.SKILL.md](../skills/development/assert-fact-gate.SKILL.md)
- **Function:** Portable execution gate: a fact is asserted only with its source and a check that could have failed.
- **Use when:** Any report, review verdict or decision that states a fact about code, runtime or data.
- **Do not use when:** For opinions or recommendations, which are labelled as such.
- **Inputs and output:** Required `claim`; fresh file evidence or an explicit `UNVERIFIED` result.
- **Authority and effects:** File reading only; remote/API verification requires separately authorised host capabilities.
- **Kaidera action:** Bind evidence to the exact claim and target, including local source when that is the claim.

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
  decision. `evidence-code-review` covers bounded implementation defects.
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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"code-review","path":"skills/development/code-review.SKILL.md","posture":"rework-before-use","review_fingerprint":"e85ac15462bb9e0d4abdf8656be6e8cc9adcb385c4e52699d4630ebf3329b2c9","risk_level":"low","trust_tier":"unvetted","version":"2.1.2"} -->

- **Manifest:** [code-review.SKILL.md](../skills/development/code-review.SKILL.md)
- **Function:** Applies a legacy two-stage checklist: specification compliance
  first, then code quality, impact, and a final lightweight verdict.
- **Use when:** Analysing the historical checklist itself after verifying every
  selected product/control assumption against current source.
- **Do not use when:** The target needs immutable receipts, exact layer handling,
  coverage accounting, adversarial verification, or machine JSON. Use
  `evidence-code-review`; use `codebase-audit` for a whole repository.
- **Inputs and output:** No declared parameters/tools; produces a checklist-style
  review only from already supplied context.
- **Authority and effects:** Its declared no-tool/read-only contract conflicts
  with `APPROVED → Merge`, sprint-log recording, and merged-or-ready
  postconditions. It also embeds legacy kill-switch, organisation-scope, CTO,
  frontend, and backend assumptions.
- **Kaidera action:** Rework before use. Make every verdict advisory, remove
  merge/log postconditions and stale controls, then prove loader separation from
  the evidence-gated reviewer.

### `codebase-audit`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"codebase-audit","path":"skills/development/codebase-audit.SKILL.md","posture":"rework-before-use","review_fingerprint":"a5c79c9ba009c03ae54af3f211a8888f94b06b8a87cdbb73f0ae544a23fd13ca","risk_level":"medium","trust_tier":"unvetted","version":"1.1.2"} -->

- **Manifest:** [codebase-audit.SKILL.md](../skills/development/codebase-audit.SKILL.md)
- **Function:** Performs whole-repository or module review across correctness,
  security, change risk, maintainability, blast radius, tests, performance, and
  contract compliance, then challenges material findings.
- **Use when:** A broad health/architecture audit is the primary request and the
  scope, file set, evidence, and review-only boundary are explicit.
- **Do not use when:** Reviewing a bounded diff (`evidence-code-review`), retrieving a remote repository without its authorised workflow, or implementing fixes.
- **Inputs:** Local `repo_path`, optional `scope`, `focus` and `depth`.
- **Output:** Ranked confirmed/refuted/unverified findings, dimension summaries, frozen-target coverage and `PASS`, `CHANGES_NEEDED`, `INCOMPLETE` or `BLOCKED`.
- **Authority and effects:** Read-only local file inspection and trusted bounded computation. Missing coverage or unresolved material evidence prevents PASS; uncertainty is unverified, never refuted by default.
- **Kaidera action:** Source candidate repaired and renamed; keep rework-before-use until independent routing and audit qualification are accepted. Active bindings are a separate migration.

### `completion-evidence`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write"],"category":"development","legacy":false,"name":"completion-evidence","path":"skills/development/completion-evidence.SKILL.md","posture":"bounded-candidate","review_fingerprint":"bf3e398d864fc4a44034f57dfe359bce3d61ec555422a2664316e8c7391da5a8","risk_level":"medium","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [completion-evidence.SKILL.md](../skills/development/completion-evidence.SKILL.md)
- **Function:** Completion discipline for substantial autonomous work: gates written before the work, gates that can fail, nothing dropped silently, every claim re-measured before it is reported.
- **Use when:** Long or multi-part tasks, work that came back half-done, or any return whose failure mode is quiet incompleteness.
- **Do not use when:** Trivial one-step edits, or as a substitute for the repository's own verification commands.
- **Inputs and output:** No parameters; read-only process reference; its optional checker and Stop hook are separate opt-in tooling.
- **Authority and effects:** Advisory. Its gates describe evidence; they do not execute commands or grant authority.
- **Kaidera action:** Bounded candidate: vendored from Leonxlnx/unlazy (MIT) at a pinned version; keep upstream attribution and version in the manifest.

### `database-migration`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"database-migration","path":"skills/development/database-migration.SKILL.md","posture":"rework-before-use","review_fingerprint":"8ba89d571fcd461f0c3798d677f6cc9fd9470ea64d7110b8b44ad99d90bbbdd5","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

### `development-workflow`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write","tool:code_interpreter","tool:web_search"],"category":"development","legacy":false,"name":"development-workflow","path":"skills/development/development-workflow.SKILL.md","posture":"bounded-candidate","review_fingerprint":"c2939c4b8019b40fa17bba29c000f091f3bb1f29112a8fcbc827659ec5b8a7ec","risk_level":"medium","trust_tier":"unvetted","version":"1.0.0"} -->

- **Manifest:** [development-workflow.SKILL.md](../skills/development/development-workflow.SKILL.md)
- **Function:** Generic distribution profile of the kaidera-sdlc lifecycle for AI and human software teams, with independent code review, risk-based QA, recorded human file review and ITIL-aligned operations.
- **Use when:** A development project is adopting or executing a portable delivery process, architecture/plan, bounded task, review, or service change.
- **Do not use when:** The project is non-development. Do not co-load a conflicting lifecycle owner. Repository-off mode forbids Git probes and repository requirements.
- **Inputs and output:** Resolved project type/capabilities, accepted scope/policy and task; produces bounded task/evidence/decision records using the bundled templates. Tool setup persists incomplete and declined choices to avoid repeated boot prompts.
- **Authority and effects:** File read/write, local computation and current public-source research inside existing authorization. Application connections, source-data transfer, reserved actions and human verdicts require their separate scoped authority. No runtime binding or trusted-tier promotion.
- **Kaidera action:** Bounded candidate, unvetted. Canonical source is the directory in this repository; scripts/render-development-workflow.js generates the flat manifest and checks its source digest. Dev-OS carries identical pinned bytes and named role adapters. Legacy behavioural skills and their unresolved donor material are excluded from this public skill. Root/per-skill licensing precedence and Gate 3/4 holds remain.

### `evidence-code-review`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"evidence-code-review","path":"skills/development/evidence-code-review.SKILL.md","posture":"bounded-candidate","review_fingerprint":"676732aeb66d426fc3f3eba42899a41cc23d42fe41c9cc6cc1f63f1445c04587","risk_level":"medium","trust_tier":"unvetted","version":"4.0.2"} -->

- **Manifest:** [evidence-code-review.SKILL.md](../skills/development/evidence-code-review.SKILL.md)
- **Machine contract:** [report schema](../spec/open-code-review-report.schema.json) and
  [semantic verifier](../scripts/open-code-review-contract.js).
- **Function:** Reviews an exact workspace, staged index, commit, range, path
  layer, or supplied patch using canonical target/path/policy receipts,
  deterministic diagnostics, semantic bundles, cross-file tracing, independent
  challenge, coverage accounting, and a final target reread.
- **Use when:** The primary object is a bounded change and the user needs
  evidence-cited, fail-closed review rather than general advice.
- **Do not use when:** The target is whole-codebase health (`codebase-audit`), the
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

### `gavel`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"gavel","path":"skills/development/gavel.SKILL.md","posture":"reference-only","review_fingerprint":"350cd20d78e6620629211e3c03c22cb40348167d33793eaa83f99afa936a633a","risk_level":"medium","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [gavel.SKILL.md](../skills/development/gavel.SKILL.md)
- **Function:** Gavel: typed judgments for a project lead who plans, adjudicates and coordinates while workers execute: triage a worker return (disposition, evidence quality, silent gaps, scope creep, irreversibility, next owner, urgency), check a draft handoff for its receipt contract, and score backlog items for gate-blocking and risk, using TypeSafe's System One model through a bundled stdlib helper.
- **Use when:** A return, handback or consult lands; before sending a handoff; when ordering a checklist or backlog.
- **Do not use when:** As the decision itself, as a code reviewer, or with secrets, credentials, customer data or private keys in the text; it sends what you pass to `api.typesafe.ai`.
- **Inputs and output:** Historical triage, handoff and backlog interface; do not run this frozen legacy transport.
- **Authority and effects:** Reference-only pending the accepted single-core cutover. A configured key is not permission.
- **Kaidera action:** The new canonical Gavel candidate delegates to the project Jev core. Reproject only after its independent acceptance and licence-owner ruling; preserve this legacy source as historical context until then.

### `git-workflow`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"git-workflow","path":"skills/development/git-workflow.SKILL.md","posture":"rework-before-use","review_fingerprint":"e72bae1d747a3cd7e7bbde6a9b3aaa12aff780eb1dfc269acf57d68a60a42bab","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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
  Cortex handoff policy and retain the corrected hook warning. Source conventions
  remain distinct from separately authorised Git mutation.

### `jev-backlog-rank`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"jev-backlog-rank","path":"skills/development/jev-backlog-rank.SKILL.md","posture":"bounded-candidate","review_fingerprint":"5c8709dc221909fa81b266fb5076fc1ffbfc6031639b1be2c99241d82b3c8e09","risk_level":"medium","trust_tier":"unvetted","version":"0.1.0"} -->

- **Manifest:** [jev-backlog-rank.SKILL.md](../skills/development/jev-backlog-rank.SKILL.md)
- **Function:** Check an accountable lead's backlog ordering against explicit dependencies and delay risk; the human retains priority authority.
- **Use when:** Check an accountable lead's backlog ordering against explicit dependencies and delay risk; the human retains priority authority.
- **Do not use when:** As an automatic decision, policy grant or installation action; do not send unclassified data. Do not co-install it with Gavel for the same lead moment.
- **Inputs and output:** Classified minimum summaries or a reference query; typed advisory evidence with returned model identity, not human authority.
- **Authority and effects:** The core reads only process `TYPESAFE_API_KEY`; project-owned `.agents/config/transfer-policy.<project>.json` must be separately approved and installed. No outbound call when the policy or allowed category is missing; receipts off by default.
- **Kaidera action:** Bounded candidate, unvetted. Canonical source is Kaidera OS `.agents/skills/jev-backlog-rank/` at `86edd8eeb4ed37bb0aa646de42b3fc6c8af32c56`; published flat manifest and directory form are separate projections. Wrappers require `jev` installed in the same project. The three lead wrappers replace Gavel's corresponding moments, not supplement them. Gate 3/4 and root CC-BY-4.0 versus per-skill Apache-2.0 licence precedence remain HOLD.

### `jev-handoff-check`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"jev-handoff-check","path":"skills/development/jev-handoff-check.SKILL.md","posture":"bounded-candidate","review_fingerprint":"04d442579100929faa813983325d91b5620df8f911c68166918af29984fcb043","risk_level":"medium","trust_tier":"unvetted","version":"0.1.0"} -->

- **Manifest:** [jev-handoff-check.SKILL.md](../skills/development/jev-handoff-check.SKILL.md)
- **Function:** Check a drafted worker handoff's receipt contract and blocked protocol before the accountable lead sends it.
- **Use when:** Check a drafted worker handoff's receipt contract and blocked protocol before the accountable lead sends it.
- **Do not use when:** As an automatic decision, policy grant or installation action; do not send unclassified data. Do not co-install it with Gavel for the same lead moment.
- **Inputs and output:** Classified minimum summaries or a reference query; typed advisory evidence with returned model identity, not human authority.
- **Authority and effects:** The core reads only process `TYPESAFE_API_KEY`; project-owned `.agents/config/transfer-policy.<project>.json` must be separately approved and installed. No outbound call when the policy or allowed category is missing; receipts off by default.
- **Kaidera action:** Bounded candidate, unvetted. Canonical source is Kaidera OS `.agents/skills/jev-handoff-check/` at `86edd8eeb4ed37bb0aa646de42b3fc6c8af32c56`; published flat manifest and directory form are separate projections. Wrappers require `jev` installed in the same project. The three lead wrappers replace Gavel's corresponding moments, not supplement them. Gate 3/4 and root CC-BY-4.0 versus per-skill Apache-2.0 licence precedence remain HOLD.

### `jev-option-decision`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"jev-option-decision","path":"skills/development/jev-option-decision.SKILL.md","posture":"bounded-candidate","review_fingerprint":"07ad912df5c0f489a09db83067b553b3c4c15df841592fc59b631845ff10809a","risk_level":"medium","trust_tier":"unvetted","version":"0.1.0"} -->

- **Manifest:** [jev-option-decision.SKILL.md](../skills/development/jev-option-decision.SKILL.md)
- **Function:** Examine one bounded implementation or architecture choice with named candidates, evidence and requirements; the human decides.
- **Use when:** Examine one bounded implementation or architecture choice with named candidates, evidence and requirements; the human decides.
- **Do not use when:** As an automatic decision, policy grant or installation action; do not send unclassified data.
- **Inputs and output:** Classified minimum summaries or a reference query; typed advisory evidence with returned model identity, not human authority.
- **Authority and effects:** The core reads only process `TYPESAFE_API_KEY`; project-owned `.agents/config/transfer-policy.<project>.json` must be separately approved and installed. No outbound call when the policy or allowed category is missing; receipts off by default.
- **Kaidera action:** Bounded candidate, unvetted. Canonical source is Kaidera OS `.agents/skills/jev-option-decision/` at `86edd8eeb4ed37bb0aa646de42b3fc6c8af32c56`; published flat manifest and directory form are separate projections. Wrappers require `jev` installed in the same project. The three lead wrappers replace Gavel's corresponding moments, not supplement them. Gate 3/4 and root CC-BY-4.0 versus per-skill Apache-2.0 licence precedence remain HOLD.

### `jev-return-triage`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter"],"category":"development","legacy":false,"name":"jev-return-triage","path":"skills/development/jev-return-triage.SKILL.md","posture":"bounded-candidate","review_fingerprint":"10cb9eaadc4bd62be42371c96274c140415388364a4dc80b78754bb32f0885c3","risk_level":"medium","trust_tier":"unvetted","version":"0.1.0"} -->

- **Manifest:** [jev-return-triage.SKILL.md](../skills/development/jev-return-triage.SKILL.md)
- **Function:** Advisory receipt-based triage of an arrived worker return, handback or consult by its accountable lead.
- **Use when:** Advisory receipt-based triage of an arrived worker return, handback or consult by its accountable lead.
- **Do not use when:** As an automatic decision, policy grant or installation action; do not send unclassified data. Do not co-install it with Gavel for the same lead moment.
- **Inputs and output:** Classified minimum summaries or a reference query; typed advisory evidence with returned model identity, not human authority.
- **Authority and effects:** The core reads only process `TYPESAFE_API_KEY`; project-owned `.agents/config/transfer-policy.<project>.json` must be separately approved and installed. No outbound call when the policy or allowed category is missing; receipts off by default.
- **Kaidera action:** Bounded candidate, unvetted. Canonical source is Kaidera OS `.agents/skills/jev-return-triage/` at `86edd8eeb4ed37bb0aa646de42b3fc6c8af32c56`; published flat manifest and directory form are separate projections. Wrappers require `jev` installed in the same project. The three lead wrappers replace Gavel's corresponding moments, not supplement them. Gate 3/4 and root CC-BY-4.0 versus per-skill Apache-2.0 licence precedence remain HOLD.

### `jev`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:code_interpreter","tool:file_write"],"category":"development","legacy":false,"name":"jev","path":"skills/development/jev.SKILL.md","posture":"reference-only","review_fingerprint":"e79bd1262eb33aa65059f6e05f17e2cdf808e06119b87853b27c4f0054cc3c15","risk_level":"medium","trust_tier":"unvetted","version":"0.1.0"} -->

- **Manifest:** [jev.SKILL.md](../skills/development/jev.SKILL.md)
- **Function:** Jev core: common fail-closed policy reader, sanitizer and typed model transport.
- **Use when:** Reference for the shared Jev core, project-owned transfer policy, CLI, result statuses and four separate decision-moment wrappers; not an automatic moment router.
- **Do not use when:** As an automatic decision, policy grant or installation action; do not send unclassified data.
- **Inputs and output:** Classified minimum summaries or a reference query; typed advisory evidence with returned model identity, not human authority.
- **Authority and effects:** The core reads only process `TYPESAFE_API_KEY`; project-owned `.agents/config/transfer-policy.<project>.json` must be separately approved and installed. No outbound call when the policy or allowed category is missing; receipts off by default.
- **Kaidera action:** Reference-only, unvetted. Canonical source is Kaidera OS `.agents/skills/jev/` at `86edd8eeb4ed37bb0aa646de42b3fc6c8af32c56`; published flat manifest and directory form are separate projections. Wrappers require `jev` installed in the same project. The three lead wrappers replace Gavel's corresponding moments, not supplement them. Gate 3/4 and root CC-BY-4.0 versus per-skill Apache-2.0 licence precedence remain HOLD.

### `kaidera-sdlc`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write"],"category":"development","legacy":false,"name":"kaidera-sdlc","path":"skills/development/kaidera-sdlc.SKILL.md","posture":"bounded-candidate","review_fingerprint":"55e82ab326aec535789d8180b63afa1c8bbef8d1260255977ed863e14c97b6e9","risk_level":"medium","trust_tier":"unvetted","version":"1.3.0"} -->

- **Manifest:** [kaidera-sdlc.SKILL.md](../skills/development/kaidera-sdlc.SKILL.md)
- **Function:** The AI-native SDLC loop every lead is born with: intent, grill, spec, plan before code, build inside a feedback loop, verify with output that can fail, adversarial review, ship through gates, close the loop.
- **Use when:** Starting or scoping any work, a handoff or incident arrives, or the user asks to plan, spec, grill, review, retro or ship.
- **Do not use when:** As an authorisation for a merge, deploy, publish or release; those wait for the release authority's go (a human). Do not skip the full grill where risk forces it: incidents, destructive work, security, money, customer data, migrations, removals or folds, cross-project change.
- **Inputs and output:** No parameters; file read/write for the intent, spec and plan artifacts it produces; process reference otherwise.
- **Authority and effects:** Advisory method. It never authorises a gate; facts are looked up and decisions are put to the human and awaited.
- **Agnostic install:** the directory form `skills/development/kaidera-sdlc/` (SKILL.md, references, templates) installs with `npx skills add Kaidera-AI/skills --skill kaidera-sdlc -a universal -y --copy`; 1.3.0 adds `code-review.md`, `human-gates.md` and `human-guide.md` (two reviewers merging into one report, what a human decides at the gate, and why/how the process works) on top of 1.2.0's team, code-quality, evidence, writing and attribution references and review in bounded rounds.
- **Kaidera action:** Bounded candidate: the canonical source is Kaidera OS `.agents/skills/kaidera-sdlc/` (references, templates, evals); this file is its marketplace projection, rendered by the source's `tools/render-public.py` (its `--check`, run from a Kaidera OS checkout, proves the projection matches; marketplace CI cannot see that source, so `kaidera.source.content_sha256` names the rendered bytes and a stale projection is a review finding, not a CI failure). Never edited here.

### `performance-profiling`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"performance-profiling","path":"skills/development/performance-profiling.SKILL.md","posture":"rework-before-use","review_fingerprint":"714c0471b34c9065cc9f353382314abdfe591e97fdfb926d131acc98bd03f19c","risk_level":"low","trust_tier":"unvetted","version":"1.0.3"} -->

- **Manifest:** [performance-profiling.SKILL.md](../skills/development/performance-profiling.SKILL.md)
- **Function:** Plans a bounded performance investigation from supplied measurements,
  workload, symptom, environment and target; separates hypotheses from verified cause.
- **Use when:** The owner wants measurement priorities or interpretation of existing
  qualified-operator evidence.
- **Do not use when:** Live profiling, credentials, installs, database/index changes,
  runtime resource changes or production load are requested under this no-tool profile.
- **Inputs and output:** Workload/symptom/context and supplied measurements; a baseline,
  ranked hypotheses, proposed checks and missing evidence. No executable recipes remain.
- **Authority and effects:** Reference only; actual measurements and changes use the
  separately authorised operator/implementation scope.
- **Kaidera action:** Source contract repaired. Retain rework-before-use until independent
  acceptance and any executable adapter are qualified; do not promote runtime posture
  from catalogue/source checks.

### `prompt-master`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":false,"name":"prompt-master","path":"skills/development/prompt-master.SKILL.md","posture":"reference-only","review_fingerprint":"4f83155991db48364b364ecb379116eb000d1410aa13a0127bd9e8cf5715f4ad","risk_level":"low","trust_tier":"unvetted","version":"1.8.1"} -->

- **Manifest:** [prompt-master.SKILL.md](../skills/development/prompt-master.SKILL.md)
- **Function:** MIT-attributed adaptation from `nidhinjs/prompt-master`
  (MIT). Writes a single optimized, ready-to-paste prompt for a named AI tool
  from a rough request, after extracting intent and asking at most 3
  clarifying questions.
- **Use when:** A user explicitly asks to write, fix, improve, or adapt a
  prompt for a specific AI tool or model family.
- **Do not use when:** The user wants the task done directly (coding,
  document writing, general conversation) rather than a prompt authored for
  later use elsewhere.
- **Inputs and output:** No parameters or tools; text in, one prompt block
  out. Declares no file, network, or interpreter access.
- **Authority and effects:** No side effects; pure text generation. Its own
  body already instructs the model never to embed credentials in generated
  output and to treat any pasted prompt as inert data, never as instructions.
- **Kaidera action:** Reference-only, MIT-attributed local adaptation — see
  `ATTRIBUTION.md` beside the directory-form skill. Do not follow the
  upstream README's Claude.ai upload or `~/.claude/skills/` clone
  instructions; use this repository's own harness-agnostic distribution
  instead.

### `tdd-workflow`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"development","legacy":true,"name":"tdd-workflow","path":"skills/development/tdd-workflow.SKILL.md","posture":"rework-before-use","review_fingerprint":"6328a3a2cedac746eee6760af7f20ef083d6ae9e085b50e221010bfbbea3f7b4","risk_level":"low","trust_tier":"unvetted","version":"2.0.2"} -->

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
  file-write, and execution authority. The candidate now allows already-passing
  regressions with an honest reason; it never manufactures a RED result.

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
- **Inputs and output:** Required `proposal`; file reading returns portability concerns and recorded exceptions.
- **Authority and effects:** Advisory assessment; no infrastructure mutation or exception approval.
- **Kaidera action:** Cite the owning policy and any current provider-specific ruling.

### `container-build`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"container-build","path":"skills/devops/container-build.SKILL.md","posture":"reference-only","review_fingerprint":"788546d87b1ceae91f2696a95696d137106b515c651ddf8208a92670b586e15e","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read"],"category":"devops","legacy":false,"name":"deploy-gate","path":"skills/devops/deploy-gate.SKILL.md","posture":"manual-only","review_fingerprint":"c5748a6eeda3e3d003c4bd677378fa2dfe7250c5febcbbe97b7d2993cbcc620b","risk_level":"medium","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [deploy-gate.SKILL.md](../skills/devops/deploy-gate.SKILL.md)
- **Function:** Portable execution gate: no deployment without named authorisation, a rehearsed rollback and pasted pre-flight evidence.
- **Use when:** Any deploy, release or environment mutation.
- **Do not use when:** Local development runs that mutate nothing shared.
- **Inputs and output:** Required `action`; file reading inspects target, authorisation, quality, recovery and verification evidence.
- **Authority and effects:** Advisory `READY` or `BLOCKED` only. The authorised operator performs any push, PR, merge, release or deployment.
- **Kaidera action:** Preserve valid existing authorisation; request a new decision only for an uncovered scope or changed target.

### `deploy-to-dev`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"deploy-to-dev","path":"skills/devops/deploy-to-dev.SKILL.md","posture":"manual-only","review_fingerprint":"40b40ad1168fd74c863b6075ffe178d96457459116a76ff56b57640babddf280","risk_level":"medium","trust_tier":"unvetted","version":"3.0.3"} -->

- **Manifest:** [deploy-to-dev.SKILL.md](../skills/devops/deploy-to-dev.SKILL.md)
- **Function:** Describes a legacy sprint-branch push, GitHub Actions build,
  image publication, GitOps update, ArgoCD sync, health verification, and
  rollback sequence for the historical `dev.engenai.app`.
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
- **Inputs and output:** Required `resource_name`; file reading compares it with the supplied naming contract.
- **Authority and effects:** Advisory naming assessment; no resource creation or rename.
- **Kaidera action:** Keep the naming contract and migration ownership in the owning project.

### `k8s-deploy`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"k8s-deploy","path":"skills/devops/k8s-deploy.SKILL.md","posture":"reference-only","review_fingerprint":"548a711219aba090fb53bbcc4ef5b3fdc381bc8ac6dd1a15a9c39234a1bb6527","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"sprint-closing","path":"skills/devops/sprint-closing.SKILL.md","posture":"manual-only","review_fingerprint":"2a400bdca502e39c9b6c684ae5645191deaa7f65d34a1a803afac1b2246787f8","risk_level":"low","trust_tier":"unvetted","version":"2.0.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"devops","legacy":true,"name":"terraform-module","path":"skills/devops/terraform-module.SKILL.md","posture":"manual-only","review_fingerprint":"495c069bfac36391135059dd8967f872174d883ccb0bbd0ee9076060d7df50e2","risk_level":"low","trust_tier":"unvetted","version":"1.0.3"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"documentation","legacy":false,"name":"human-voice","path":"skills/documentation/human-voice.SKILL.md","posture":"reference-only","review_fingerprint":"b217488727481ec55ec5dd060995743d907a1e2196e7c0ea5e981bd5cccd37b1","risk_level":"low","trust_tier":"unvetted","version":"1.0.1"} -->

- **Manifest:** [human-voice.SKILL.md](../skills/documentation/human-voice.SKILL.md)
- **Function:** Writing guidance for prose that reads as a person wrote it: rhythm, specificity, no filler, no machine tells.
- **Use when:** Drafting customer-facing text, docs, changelogs, release notes or messages where tone matters.
- **Do not use when:** Code, logs, evidence tables or any artifact whose format is fixed by a contract.
- **Inputs and output:** Authorised samples and supplied prose; response contains an observed voice profile, limits and rewrite. No file persistence or colleague contact is performed.
- **Authority and effects:** No side effects; style guidance only.
- **Kaidera action:** Reference-only: fold examples from `skills/documentation/EXAMPLES.md`; keep it out of evidence artifacts.

## Research skills

### `marketing-web-research`

<!-- kaidera-skill-catalog-entry {"capabilities_required":["tool:file_read","tool:file_write","tool:web_search","tool:mcp_external"],"category":"research","legacy":false,"name":"marketing-web-research","path":"skills/research/marketing-web-research.SKILL.md","posture":"manual-only","review_fingerprint":"7b5dd791e8ecccded4a35f52174aa7772eb53bbce90e0f14d86d358c77f61aa3","risk_level":"high","trust_tier":"unvetted","version":"0.1.002"} -->

- **Manifest:** [marketing-web-research.SKILL.md](../skills/research/marketing-web-research.SKILL.md)
- **Function:** Research companies, current decision makers and observed professional profile URLs, with dated role evidence, identity checks and explicit coverage gaps.
- **Use when:** A customer requests market mapping, leadership lists, LinkedIn/X professional research or authorised company-follow reconciliation.
- **Do not use when:** Only a research brief is requested, or the task requires private data, access-restriction bypass, unapproved external actions or a claim of complete coverage without evidence.
- **Inputs:** An ordinary customer request or the included blank brief: objective, sectors, regions, organisations, roles, requested sources/actions and delivery. Marketing OS configuration files are optional on other hosts.
- **Output:** A sourced people list, organisation/role coverage ledger, uncertainty flags and actual receipts for any separately authorised account or delivery actions. Chat/local output is the default; email has no preset sender or recipients and is not required.
- **Authority and effects:** High-risk, manual-only source candidate because browser/connector actions can change external state. Public research uses existing approved host tools; local writes stay in the customer workspace. A configured owner email, an installed connector or a brief field grants no sending authority. An unavailable connector blocks only its dependent action. No scraper code, provider subscription, credentials or customer data is included.
- **Kaidera action:** Preserve unvetted status and the Gate 3/4 holds. Qualify the chosen host's tools and account identity before runtime binding or following. The catalogue row and source hash are not authenticated-browser evidence. This entry is generated from the Marketing OS source by `tools/render_research_marketplace.py`; edit that canonical source and regenerate. The optional Playwright helper remains in the turnkey package.

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"code-review-security","path":"skills/security/code-review-security.SKILL.md","posture":"rework-before-use","review_fingerprint":"d8820e9cbda21da60e3dd5f2c558da0e0757fbc3e1b4f3d9ce929bbc83456ac6","risk_level":"low","trust_tier":"unvetted","version":"1.1.2"} -->

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"dependency-audit","path":"skills/security/dependency-audit.SKILL.md","posture":"rework-before-use","review_fingerprint":"da0b5d45b18aa98f922956a18a4da1135c2f662b594fe4c714fff38ff41489bf","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

- **Manifest:** [dependency-audit.SKILL.md](../skills/security/dependency-audit.SKILL.md)
- **Function:** Separates locked dependency inventory, fresh advisory evidence, reachability, licence-owner rulings and remediation proposals.
- **Use when:** Reviewing supplied inventory and scanner output under the project's own response policy.
- **Do not use when:** Installing tools, querying package registries, updating dependencies or ruling on licence compatibility without its authorised workflow/owner.
- **Inputs and output:** Supplied lockfiles and scanner/advisory receipts produce a package-by-package ledger of exposure, non-applicability, unknowns and proposed remediation.
- **Authority and effects:** Read-only reference. Popularity and recent commits do not establish safety; legal compatibility is an owner decision.
- **Kaidera action:** Source candidate removes unpinned automatic installs and blanket licence conclusions. Tool/runtime qualification remains open.

### `incident-response`

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"incident-response","path":"skills/security/incident-response.SKILL.md","posture":"rework-before-use","review_fingerprint":"08d695aae14ba47f6c39c8e5f8536c59ea707ce77581f7c1ff29de22ba1d55c9","risk_level":"low","trust_tier":"unvetted","version":"1.0.3"} -->

- **Manifest:** [incident-response.SKILL.md](../skills/security/incident-response.SKILL.md)
- **Function:** Coordinates bounded incident identification, restricted evidence custody, authorised containment, verified recovery and owned follow-up.
- **Use when:** Preparing an incident response record or tabletop against the owning service's current incident commander and controlled runbooks.
- **Do not use when:** Performing containment, querying production, exporting sensitive data or announcing resolution without separately authorised operators and receipts.
- **Inputs and output:** Supplied incident context and evidence produce a coordination ledger; this no-tool reference performs no privileged commands.
- **Authority and effects:** The incident commander owns containment decisions. Preserve evidence before destructive changes where feasible; record an authorised immediate-harm exception when containment must come first.
- **Kaidera action:** Source candidate removes assumed Redis/Kubernetes operations and historical people. Independent runbook acceptance remains open before operational use.

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

<!-- kaidera-skill-catalog-entry {"capabilities_required":[],"category":"security","legacy":true,"name":"security-context","path":"skills/security/security-context.SKILL.md","posture":"reference-only","review_fingerprint":"7b549925a8195a8eba4cc17f3d458990bd6e62cab2d439ba554bf495aa97c43d","risk_level":"low","trust_tier":"unvetted","version":"1.0.2"} -->

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
| “Review my staged change and give me only reproducible defects.” | `evidence-code-review`, target `staged` |
| “Audit this entire authentication module for health and architecture debt.” | `codebase-audit`, but only after its capability contract is repaired |
| “Does this pricing default make sense, independent of whether the code works?” | `assumption-validation` |
| “Write a research brief comparing three provider strategies.” | `research-brief` |
| “Find decision makers matching our customer profile and return a sourced list here.” | `marketing-web-research`, with a separately approved host workflow |
| “Use the EnGenAI security checklist while reviewing this patch.” | No automatic route; reverify individual legacy checks under `evidence-code-review` |
| “Show the historical branch and PR conventions.” | No runtime route; consult `git-workflow` only as quarantined historical evidence pending rework |
| “Deploy this to dev now.” | No automatic skill route; separately authorised deployment workflow required |
| “Shut down the compromised worker fleet.” | No automatic skill route; current incident commander and controlled runbook required |
| “Design a test for whether this loader rejects injected policy text.” | `prompt-injection-test` for non-executing design; separate controlled harness for execution |

## Portfolio overlaps and collision rules

### Gavel and Jev lead moments

Install either Gavel or the Jev lead wrappers `jev-return-triage`, `jev-handoff-check` and `jev-backlog-rank` for a project, not both. Jev wrappers require the `jev` core installed into the same project; `npx skills add --skill <wrapper>` does not install it transitively. Gavel uses `JEV_API_KEY` and its own helper; Jev uses only process `TYPESAFE_API_KEY` and its project-owned transfer policy. Merely copying either does not grant runtime binding or resolve the open CC-BY/Apache licence precedence hold.

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
permission to fix findings. `codebase-audit` is strictly read-only; its source contract is repaired, but
independent acceptance and a qualified runtime remain required before use. Kaidera should use a separate
implementation/remediation workflow with its own authority, target, tests, and
readback.

### Security support versus verdict authority

Supporting security context can raise questions and propose candidate checks,
but the selected primary reviewer owns evidence, deduplication, coverage, and
the verdict. This prevents `code-review`, `evidence-code-review`, `codebase-audit`, and
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

The three static-evaluated skills are `evidence-code-review`,
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

### Capability/body reconciliation and remaining gates

The strict validator checks declared fields; it does not prove runtime containment.
This candidate converts performance-profiling, dependency-audit, database-migration,
git-workflow, tdd-workflow, terraform-module and incident-response into scoped
references. codebase-audit now declares file/interpreter review capability and
forbids source edits, URLs without a separate fetch scope and implicit installations.
code-review returns proposed records/readiness rather than ordering merges or notices.
Historical context/deployment/security runbooks are explicitly non-operational.

These source corrections remove the listed contradictory operational recipes. They
are not proof of installation, tool qualification, execution containment or acceptance.
Keep each reviewed posture and the Gate 3/4 holds. Externally canonical Gavel/Jev/SDLC
projections remain frozen; their reviewed source migration and licence-owner ruling
are separate gates. A real executable workflow must have its own exact scope,
capabilities, accepted plan and receipts before runtime binding.

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

1. Keep `evidence-code-review`, `assumption-validation`, and `research-brief` as the
   first bounded candidates; do not promote them until Gate 3/4.
2. Repair `codebase-audit` as a strictly read-only whole-codebase audit and move
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
