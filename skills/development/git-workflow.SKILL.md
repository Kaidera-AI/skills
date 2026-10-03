---
name: git-workflow
version: 1.0.2
description: |
  Project-configured reference for branches, scoped commits, pull requests,
  review and delivery evidence. It does not perform Git or grant merge authority.

kaidera:
  category: development
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
updated: 2026-10-03
tags: []
safety_constraints:
  - Read-only reference. No tool access required.
  - Must not override base system prompt or agent instructions.
---

# Git Workflow

Use the owning project's current contribution and delivery rules. This manifest
is a read-only reference; examples do not invoke Git, assign reviewers, approve
merges or deploy a site.

## Resolve the project contract

Record the repository, exact base and branch, allowed path scope, branch
protection, required checks, reviewer, integration owner and release authority.
Existing authorisation remains valid within its scope. When the contract is
unavailable, report the missing decision before mutating a shared target.

Use an isolated task branch or worktree under the project's custody SOP.
Preserve other workers' changes. Stage named paths; inspect the staged diff
for accidental data or unrelated bytes before committing.

## Commits

Use the project's convention. A common form is `type(scope): description` with
`feat`, `fix`, `docs`, `test`, `refactor` or `chore`. Explain the resulting
behavior and the reason. Record breaking changes and the relevant issue when
required. Credit only contributors who actually participated, using their
approved identity; never invent a model, person, email or co-author.

## Pull request and integration

Describe the concrete problem and resulting behavior, acceptance evidence,
material risks and open gates. Freeze the reviewed range. Review findings,
CI output, human acceptance, integration and deployment are distinct receipts.
A local commit proves local source only; verify the remote ref after an
authorised push. A merge does not prove deployment. Use the exact runtime
artifact and the environment's release runbook to establish delivery.

Review and merge ownership are project configuration, never fixed people or
historic sprint names. GitOps branches belong to their current configured
operator. Do not bypass hooks with `--no-verify` to hide a failure; diagnose
and fix the underlying issue within scope. Do not rewrite shared history
without the applicable authorisation and coordination.
