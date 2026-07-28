---
name: deploy-gate
version: 1.0.0
description: |
  Gates pushes, pull requests, merges, releases, and deployments on exact target,
  current authorization, quality evidence, and rollback readiness.

engenai:
  category: devops
  trust_tier: official
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
updated: 2026-07-29
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
