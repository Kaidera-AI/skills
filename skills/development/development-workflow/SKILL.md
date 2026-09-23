---
name: development-workflow
description: Plan and deliver software with AI and human workers, using bounded tasks, independent code review, risk-based QA, and recorded human decisions. Use for development projects and their service operations; do not bind to non-development projects.
license: Apache-2.0
metadata:
  version: 1.0.0
  source: Kaidera-AI/skills
  posture: unvetted-source-candidate
---

# AI+Human Development Workflow

Use the same lifecycle as the existing kaidera-sdlc framework:
INTENT → GRILL → SPEC → PLAN → BUILD ↔ VERIFY → REVIEW → SHIP → MAINTAIN.
This is its portable development profile. Select one lifecycle owner per project;
do not load it alongside contradictory estate-specific lifecycle instructions.

This skill guides already authorized work. It grants no tools, credentials,
delegation, installation, publication, or runtime trust. Project and user decisions
set scope. Reuse existing authorization; do not ask again for an action already
authorized within the same scope.

## Applicability before tool use

Read the resolved project configuration, using
[the project record](templates/project-record.md). Only development projects load
this skill and [its lead rule](rules/development-workflow.md). A non-development
project returns NOT APPLICABLE without invoking this workflow.

Repository operations are a separate explicit capability. When off, do not run Git,
inspect remotes/worktrees, require branches/PRs/commits, or probe for a repository to
decide the mode. Use an ordinary isolated workspace and stable input/output hashes.
If the mode is unknown, resolve it from the project owner before repository commands.
An installer's development/repository defaults never override an explicit off.

## Roles and assignment

| Role | Responsibility | Boundary |
|---|---|---|
| Decision owner | Product direction, accepted policy, reserved actions, risk exceptions | Human; own authenticated decisions |
| Programme lead | Architecture, priorities, accepted plans, task contracts, exceptions | Plans and controls; no self-approval |
| Product lead | Product-local coordination, clean task acceptance, qualified integration | Human lead may direct an AI coordinator; escalate cross-product decisions |
| Implementer | One assigned frontend, backend, infrastructure or documentation outcome | Self-verifies; cannot independently review own output |
| Independent code reviewer | Frozen-change review, findings, closure on revised evidence | Does not edit, merge, or replace the human reviewer |
| QA owner | Behavioral evidence when required by frozen risk policy | Routine code does not automatically need a second QA pass |
| Operator/service owner | Authorized delivery, service objectives, recovery and support | Exact environment and action authority required |
| Records owner | Canonical records, source attribution, decisions and lessons | Cannot invent a decision or approval |
| Orchestrator (optional) | Dispatch and state transitions under policy | Does not choose business policy or gain authority from worker status |

One person may hold several roles when permitted, but author and independent
reviewer must remain separate for the same change. Names, model/provider/effort,
fallbacks, budgets, tools, repository host and permissions are project data.

## Route to the needed detail

- Starting or delivering a feature, fix or incident follow-up:
  [lifecycle](references/12-development-lifecycle.md).
- Architecture, interface decisions, discovery and task decomposition:
  [design and planning](references/13-architecture-design-planning.md).
- Assigning work, returning evidence, or handling a consult:
  [task contract](references/11-handoff-anatomy.md).
- Security, quality and proof:
  [DevSecOps](references/14-devsecops-quality.md).
- Reviewing files or closing review findings:
  [AI+human code review](references/15-ai-human-code-review.md) and
  [human review record](templates/human-review.md).
- Selecting the supplemental review application once per project:
  [review-tool decision](templates/review-tool.md).
- Operating a service, classifying a change, or handling an incident/problem:
  [service operations](references/16-itil-service-operations.md).

## Execution contract

1. Have an accepted plan before implementation. Scale its detail to uncertainty and
   impact; a clear authorized task can supply the small-work plan. Resolve material
   business/security choices without reopening decisions already settled.
2. Dispatch one named worker with a bounded task, exact inputs, allowed outputs,
   acceptance, tools, limits and the required review/QA policy. Human assignment
   must never silently launch an AI worker.
3. Produce observable evidence that can fail, tied to the actual revision/artifact.
   Do not weaken a regression test or label an unrun check PASS.
4. Accept clean handbacks under the established policy. Consults remain unfinished:
   record the question, evidence, decision owner and affected scope, pause dependent
   work, and resume only after an explicit answer or amended task. Timeouts and
   silence do not answer a consult.
5. Review code independently, and record human review of every AI-created or
   materially changed file. Batch the file review at the frozen change; it is not an
   extra approval of every routine worker handback. QA is additional only when the
   accepted risk/acceptance policy requires it.
6. Bind each reserved action to the human's existing scoped authorization and the
   candidate and target it covers. A new scope or target requires the applicable
   decision; AI review, CI, a task status and a merge do not supply it.

Return DONE / CONSULT / BLOCKED / FAILED with scope, output identity, findings,
evidence, remaining requirements and next owner. Source merge, install, deployment,
release/publication, human acceptance and runtime qualification are distinct results.

## Provenance and distribution

Original generic process text prepared by Kaidera-AI from its AI+human operating
model and the lifecycle used by kaidera-sdlc. External standards below are references,
not reproduced manuals or claims of certification. This skill does not copy the
legacy behavioural skills or their donor material.

The canonical source is this directory in Kaidera-AI/skills. The flat marketplace
manifest is generated by scripts/render-development-workflow.js. Downstream packs
carry a byte-identical directory with a source revision and digest outside it.
Change the canonical directory first, regenerate, review, then update the pin.

The directory declares Apache-2.0, following the development-framework convention.
The repository's root/per-skill licensing-precedence hold and runtime Gate 3/4 holds
still apply. Source merge does not lift those holds or make an entry trusted.
