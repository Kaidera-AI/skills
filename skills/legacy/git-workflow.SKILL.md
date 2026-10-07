---
name: git-workflow
version: 1.0.2
description: |
  Git workflow conventions for EnGenAI: conventional commits, branch strategy,
  sprint branching model, PR process, and merge rules.

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
tags: []
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

# Git Workflow

## Branch Strategy

```
develop         ← North star — clean, tested, reviewed code only (PR merges only)
sprint-XX-name  ← Active sprint work (one branch per sprint)
gitops/dev      ← CI/CD state — managed by pipeline only, never touch manually
gitops/marketing← Marketing CI/CD state — managed by pipeline only
```

### Rules — No Exceptions

- NEVER push directly to `develop` or `main`
- NEVER push to `gitops/*` branches (CI/CD does this automatically)
- NEVER merge any PR — merges are done manually by the two named human maintainers ONLY
- ALL work goes to a sprint branch → test → approval → PR

### Sprint Naming

| Situation | Branch Name |
|-----------|-------------|
| New sprint | `sprint-16-coding-assistants` |
| Revisiting sprint (first time) | `sprint-11b-licensing-review` |
| Revisiting sprint (again) | `sprint-11c-licensing-followup` |
| Never | Reusing an old sprint branch |

## Conventional Commits

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scope: infra, canvas, nodes, connections, api, auth, skills, agents

Examples:
  feat(skills): add marketplace adapter replacing clawhub
  fix(api): correct org_id null check in provider router
  test(skills): add content hash verification tests
  chore(sprint-22): update sprint plan with Phase C skills
```

### Rules
- Description in lowercase imperative mood ("add" not "added" or "adds")
- No trailing period
- Reference ticket/issue in body if applicable
- Breaking changes: add `!` after type/scope and `BREAKING CHANGE:` footer

## Sprint Workflow

```
1. git pull origin develop          ← always start here
2. git checkout -b sprint-XX-desc   ← new branch every sprint
3. [work + commit + push sprint]    ← CI/CD auto-deploys to legacy-dev.invalid
4. [test on legacy-dev.invalid]        ← iterate until satisfied
5. [document locally]               ← logs, lessons, closure docs (NO commit yet)
6. Wait for the release authority's EXPLICIT approval to close
7. Commit closure docs + push sprint branch
8. Open PR: sprint-XX → develop     ← notify the second maintainer
9. The second maintainer reviews → approves → merges  ← AI does NOT merge
10. git pull origin develop         ← sync before next sprint
```

## Commit Message Format (HEREDOC for multi-line)

```bash
git commit -m "$(cat <<'EOF'
feat(scope): description

Body explaining the why, not the what.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

## PR Template

```markdown
## Summary
- Bullet-point list of what changed and why

## Test Plan
- [ ] Unit tests pass
- [ ] Physical test on legacy-dev.invalid
- [ ] No regressions in existing tests

## Impact
- Files changed: N
- Test count: before → after
```

## Common Mistakes to Avoid

- Amending published commits — creates divergence in CI/CD
- Skipping `--no-verify` — fix the hook instead
- `git add -A` — always stage specific files to avoid committing secrets
- Direct pushes to develop — even "hotfixes" must go through a branch and PR
