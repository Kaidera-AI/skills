---
name: cloud-agnostic-policy
version: 1.0.0
description: |
  Reviews infrastructure choices for portability and prevents an architecture
  from depending on an undeclared provider-specific managed primitive.

engenai:
  category: devops
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
tags: [cloud, portability, open-source, architecture, infrastructure]

parameters:
  proposal:
    type: string
    required: true
    description: The infrastructure primitive or architecture under review.

safety_constraints:
  - Review only; do not provision, deploy, or mutate infrastructure.
  - Do not claim portability without identifying state, identity, network, and recovery dependencies.
  - Provider-specific exceptions require an explicit owner, rationale, exit plan, and approval.
---

# Cloud-Agnostic Policy

Run this review before selecting an infrastructure primitive or managed service.

## Decision test

1. Name the capability the system needs, independent of products.
2. Determine whether an upstream open-source implementation can satisfy it on
   vanilla compute.
3. Trace portability across compute, orchestration, network, identity, secrets,
   storage, observability, backup, and recovery.
4. Identify provider-specific APIs, data formats, control planes, IAM bindings,
   and operational procedures.
5. Choose the upstream-portable design unless an approved exception is required.

## Accept

- upstream software with portable configuration and data
- standardized compute or hardware capabilities
- provider adapters behind a stable, tested interface
- documented export, restore, and recovery procedures

## Reject or redesign

- a core runtime or data path coupled directly to one provider API
- a managed service whose state cannot be exported and restored elsewhere
- provider identity or networking assumptions leaking into application contracts
- a portability claim that covers deployment manifests but not data and recovery

## Exception record

An exception must state scope, owner, rationale, cost and risk, affected data,
rollback, exit path, and the approval that allows it. Keep the exception narrow;
it does not authorize unrelated provider coupling.
