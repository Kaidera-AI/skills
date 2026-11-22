---
name: deploy-gate
version: 1.1.0
description: |
  Gates pushes, pull requests, merges, releases, and deployments on exact target,
  current authorization, quality evidence, and rollback readiness.

kaidera:
  category: devops
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera
license: Apache-2.0
updated: 2026-11-22
tags: [deployment, release, git, authorization, rollback]

parameters:
  action:
    type: string
    required: true
    description: The proposed push, pull request, merge, release, or deployment.

safety_constraints:
  - Never mutate a protected or production target without current explicit authorization.
  - Never treat old authorization as proof that present target state is safe.
  - Never expose credentials in commands, logs, or evidence.
---

# Deploy Gate

Run this gate immediately before any push, pull request, merge, release, or
deployment.

## Required checks

1. Resolve the exact repository, branch, environment, account, and region or
   cluster where relevant.
2. Confirm the action is inside the operator's role and approved scope.
3. Read the current authorization and verify that it covers this action and target.
4. Re-check present safety: source revision, target baseline, dependencies,
   credentials, maintenance window, capacity, and conflicting changes.
5. Verify the required quality gates from fresh output.
6. Confirm rollback, recovery, and post-change verification.
7. When relying on a dry run or rehearsal to prove an apply is safe, reproduce the
   relevant target-object history in a disposable environment, then run the same
   operation in the same order with the same flags; the only difference is the
   explicit non-mutating mode. A check that begins only from the desired end state,
   or differs in a flag that can affect ownership or merge behavior, does not prove
   the real apply. A warning or conflict in this check blocks the gate: correct the
   operation and repeat the same-history rehearsal. Do not bypass a conflict by
   forcing ownership or editing live managed fields without separate explicit
   authorization.

Authorization proves permission, not current safety. Stop when authorization is
stale, target state changed, or rollback is no longer credible.

## Output

Return:

- `PASS` or `BLOCKED`
- exact action and target
- source revision or artifact digest
- authorization reference
- quality evidence
- rollback and verification plan
- residual risk or the smallest decision needed to proceed

After an authorized deployment, verify configuration, workload health, external
reachability, and the relevant user journey separately.
