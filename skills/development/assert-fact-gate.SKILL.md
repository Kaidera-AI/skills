---
name: assert-fact-gate
version: 1.0.0
description: |
  Requires a fresh source check before reporting repository, build, test,
  deployment, route, version, identifier, or handoff state.

engenai:
  category: development
  trust_tier: official
  risk_level: low
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
tags: [verification, evidence, source-control, testing, release]

parameters:
  claim:
    type: string
    required: true
    description: The factual claim that must be verified.

safety_constraints:
  - Read-only verification unless the user separately authorizes a change.
  - Never fabricate command output, identifiers, versions, or test results.
  - Never expose credentials or sensitive payloads while collecting evidence.
---

# Assert Fact Gate

Before stating a fact about code, infrastructure, tests, releases, routes,
handoffs, or artifacts:

1. Identify the authoritative source for the claim.
2. Read or query that source during the current task.
3. Prefer the remote branch, immutable artifact, target environment, or API record
   over a local working copy or another person's report.
4. Check that the evidence proves the exact claim. Empty output is not success.
5. Report the result with the relevant revision, target, command, or source path.

Use these evidence boundaries:

- A local commit does not prove a remote branch was updated.
- A remote branch does not prove a build completed.
- A build does not prove deployment.
- Deployment health does not prove the user journey.
- A returned handoff does not prove its promised artifact exists.

If the source is unavailable, stale, ambiguous, or incomplete, report
`UNVERIFIED` and name the missing evidence. Do not upgrade an inference into a
confirmed fact.
