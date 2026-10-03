---
name: dependency-audit
version: 1.0.2
description: |
  Read-only reference for dependency inventory, advisory verification,
  reachability, licence-owner review and bounded remediation proposals.

kaidera:
  category: security
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

# Dependency Audit

Use the project's actual package manager, lockfiles, runtime targets and
release policy. This reference does not install tools, query a registry,
update dependencies, execute package scripts or approve release.

## Inventory and evidence

Record direct and transitive package versions, lockfile/source revision,
artifact identities and supported runtimes. Use output from already trusted,
authorised scanners, with scanner version, advisory database time, command,
exit status and complete report. An unavailable or failed scanner is an
unverified check, not zero vulnerabilities. Keep an SBOM at the project's
owned path when its delivery contract requires one.

## Triage

For each advisory, verify the official affected and fixed version ranges and
whether the installed dependency falls inside them. Record exploit conditions,
reachable code paths, exposure, deployment and business impact. Severity is
an input to the project's response policy; a popularity threshold or recent
commit does not prove a package safe or unsafe. Maintainership, release
integrity, typosquatting, registry custody and dependency-confusion controls
need their own evidence.

## Remediation proposal

Propose the smallest compatible update, replacement, configuration change or
owned exception. State the affected lockfile, tests, re-scan and rollback.
Do not run unpinned `npx` helpers or install a scanner automatically. Tool
installation needs its existing project authorisation, pinned source and
script policy. A fix requires testing the actual update and rechecking the
advisory; suppressions require a named owner, evidence and expiry.

## Licences

Inventory exact licence declarations and notices, including transitive and
vendored material. Route compatibility and distribution rulings to the licence
owner with the intended use and distribution model. Do not infer that a named
licence universally prohibits commercial use or that the repository's licence
makes every dependency compatible. Preserve attribution and recorded holds.

Return a package-by-package ledger separating confirmed exposure, evidenced
non-applicability, missing information, proposed remediation and owner decisions.
