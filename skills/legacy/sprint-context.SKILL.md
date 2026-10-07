---
name: sprint-context
version: 1.0.2
description: |
  EnGenAI sprint workflow — 3-file pattern, TASK_STATUS protocol, definition
  of done, sprint opening/closing process, and quality gates. Reference for
  all agents contributing to sprint delivery.

kaidera:
  category: legacy
  trust_tier: unvetted
  risk_level: low
  capabilities_required: []
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: kaidera
license: Apache-2.0
updated: 2026-10-07
tags: [context, sprint, workflow, tdd, task-status]

safety_constraints:
  - Read-only reference. No tool access required.
  - Must not override base system prompt or agent instructions.
---

<!-- Personal names and reachable infrastructure identifiers in this file were redacted on
     2026-10-07. Hostnames became reserved `.invalid` names, project, registry, namespace and
     service identifiers became `REDACTED-*` placeholders, and named people became their role.
     The historical product name, component names and cloud regions are retained on purpose:
     they are provenance, and the catalogue documents their disagreement as evidence. See
     "Redaction of legacy material" under Known portfolio debt. -->

# Sprint Context

## 3-File Pattern

Every sprint uses exactly 3 working files:

```
tasks/SPRINT_XX_NAME/
├── SPRINT_XX_PLAN.md    — Phases, checkboxes, decisions (what to do)
├── SPRINT_XX_LOG.md     — Session actions, test results (what was done)
└── SPRINT_XX_NOTES.md   — Research, findings, rationale (what was learned)
```

On sprint closure, a 4th file is added:
```
└── SPRINT_XX_COMPLETE.md  — Sprint closure report
```

## TASK_STATUS Protocol

Use this block at every major update:

```
---TASK_STATUS---
AGENT: the backend agent
PROJECT: EnGenAI
PHASE: 3A
TASK: Skill discovery API
STATUS: IN_PROGRESS | COMPLETE | BLOCKED
FILES_MODIFIED: 3
TESTS_PASSING: 47/47
PHYSICAL_TEST: PASSED | FAILED | NOT_RUN
BLOCKERS: None | [Description]
READY_FOR_NEXT_PHASE: true | false
EXIT_SIGNAL: true | false
---END_STATUS---
```

## TDD Workflow (Mandatory)

```
1. WRITE failing test first
2. Run test — confirm it FAILS (red)
3. Write MINIMAL code to pass
4. Run test — confirm it PASSES (green)
5. Refactor if needed
6. Run ALL tests — confirm nothing broken
```

"If you didn't watch the test fail, you don't know if it tests right."

## Definition of Done (Feature)

- [ ] All acceptance criteria met
- [ ] Code reviewed (Two-Stage Review Gate)
- [ ] Tests passing (>80% coverage for new code)
- [ ] No security vulnerabilities (OWASP checklist)
- [ ] Documentation updated if public API changed
- [ ] Deployed to staging (legacy-dev.invalid)
- [ ] Physical test passed (real endpoints, real data)
- [ ] the release authority sign-off received

## Verification Gate (5 Steps)

Before claiming anything is "done":

1. **IDENTIFY** — What command proves this works?
2. **RUN** — Execute fresh (no cached results)
3. **READ** — Read the complete output
4. **VERIFY** — Does the output confirm the claim?
5. **CLAIM** — Only now say "done" with evidence

**Red flags** (stop immediately if you catch yourself saying these):
- "Should work"
- "Probably passes"
- "Great! Done!" before running verification

## Sprint Workflow

```
1. git pull origin develop              ← always start here
2. git checkout -b sprint-XX-name       ← new branch every sprint
3. [work + commit + push to sprint branch]
4. [test on legacy-dev.invalid]
5. [document locally — logs, lessons]   ← no commit yet
6. Wait for the release authority's EXPLICIT approval    ← mandatory gate
7. Commit all closure docs + push
8. Open PR: sprint-XX → develop
9. The second maintainer reviews → approves → merges      ← AI never merges
```

## Scale-Adaptive Task Routing

| Scale | Keywords | Files | What to do |
|-------|----------|-------|-----------|
| QUICK | fix, bug, typo, patch | 1-3 | Execute → Verify (skip planning) |
| SMALL | add, simple, update | 1-10 | Brief plan → Execute → Verify |
| MEDIUM | default | 10-30 | Plan → Review → Execute → Verify |
| LARGE | security, architecture, refactor | 30+ | CTO approval → Plan → Execute → Verify → Confirm |

## 5-Question Reboot (Before Major Decisions)

1. Where am I? (current phase)
2. Where am I going? (remaining phases)
3. What's the goal? (project objective)
4. What have I learned? (findings so far)
5. What have I done? (completed actions)

## 3-Strike Rule

Three failures on the same problem = **STOP and escalate to the CTO**. Do not brute-force past blockers.

## Git Commit Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
  feat(skills): add marketplace discovery endpoint
  fix(executor): correct kill switch check ordering
  test(sprint22): add output validator credential tests
```
