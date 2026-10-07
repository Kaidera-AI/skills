---
name: sprint-closing
version: 2.0.2
description: |
  Close an EnGenAI sprint with the mandatory 6-phase process. Every sprint
  must be fully documented and the release authority must give explicit approval before any
  closure docs are committed and pushed.

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
tags: [sprint, closure, documentation, process]

safety_constraints:
  - Read-only reference. No tool access required.
  - Must not override base system prompt or agent instructions.
  - Never commit closure docs before the release authority gives explicit approval.
---

<!-- Personal names and reachable infrastructure identifiers in this file were redacted on
     2026-10-07. Hostnames became reserved `.invalid` names, project, registry, namespace and
     service identifiers became `REDACTED-*` placeholders, and named people became their role.
     The historical product name, component names and cloud regions are retained on purpose:
     they are provenance, and the catalogue documents their disagreement as evidence. See
     "Redaction of legacy material" under Known portfolio debt. -->

# Sprint Closing

Mandatory 6-phase process. Phases 1–5 are ALL local. Nothing is committed
until the release authority gives explicit approval.

## Pre-Conditions

- All planned tasks completed or explicitly deferred with reason
- Code committed and pushed to sprint branch — NOT develop
- the release authority has given EXPLICIT approval to close

## Phase 1: Verify All Work

```checklist
- [ ] All planned tasks completed or explicitly deferred
- [ ] All code committed to correct sprint branch
- [ ] Tests passing (run fresh — no cached results)
- [ ] No unresolved blockers
- [ ] Physical testing done on legacy-dev.invalid
```

```bash
pytest src/backend/tests/ -v
ruff check src/backend/
mypy src/backend/app/
git status && git log --oneline -5
```

## Phase 2: Documentation Updates

```checklist
- [ ] docs/INFRASTRUCTURE_LLD.md updated if infrastructure changed
- [ ] docs/ENGENAI_MASTER_DESIGN.md updated if app architecture changed
- [ ] docs/ROADMAP.md updated with completed items
- [ ] docs/SPRINT_BREAKDOWN.md updated with sprint status
- [ ] docs/BACKLOG.md updated (completed removed, new added)
- [ ] ADRs created for any architecture decisions made
```

## Phase 3: Lessons Learned

```checklist
- [ ] Review agent-ops/LESSONS_LEARNED.md
- [ ] Add new lessons from this sprint
- [ ] Categorise by type (infrastructure, code, process, tooling)
- [ ] Include what worked AND what didn't
- [ ] Reference specific files/commands
```

## Phase 4: Sprint Closure Report

Create `tasks/SPRINT_XX_NAME/SPRINT_XX_COMPLETE.md` with:
- Executive summary (2–3 sentences)
- Metrics table (planned / completed / deferred / files / tests)
- Deliverables table with status and file paths
- Infrastructure changes
- Deployment verification with evidence
- Lessons learned
- Next sprint preview

## Phase 5: Update Agent Memory

```checklist
- [ ] Update MEMORY.md with key learnings
- [ ] Update LESSONS_LEARNED.md with final items
- [ ] Verify CLAUDE.md is current
```

## Phase 6: Commit, Push, Open PR (Requires the release authority's EXPLICIT Approval)

```checklist
- [ ] the release authority has given explicit go-ahead
- [ ] git add <closure doc files only>
- [ ] git commit -m "docs(sprint-XX): sprint closure — log, lessons, closure report"
- [ ] git push origin sprint-XX-name (NOT develop)
- [ ] Open PR: sprint-XX-name → develop
- [ ] Notify the second maintainer: "Sprint XX tested, documented, ready for review"
- [ ] Do NOT merge — merge done manually by the two named human maintainers only
```

## Post-Conditions

- Closure report at `tasks/SPRINT_XX_NAME/SPRINT_XX_COMPLETE.md`
- All docs committed and pushed to sprint branch
- PR open on GitHub
- Lessons captured in LESSONS_LEARNED.md
- CTO sign-off obtained
