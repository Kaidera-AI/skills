---
name: scope-work-gate
version: 1.0.0
description: |
  Confirms that proposed work belongs to the current project, role, lane, and
  approved objective before execution or assignment.

kaidera:
  category: context
  trust_tier: unvetted
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
tags: [scope, ownership, roles, orchestration, delivery]

parameters:
  work:
    type: string
    required: true
    description: The work under consideration.

safety_constraints:
  - Do not execute cross-project or cross-lane work without current authority.
  - Do not expand a bounded task into an unrelated cleanup or redesign.
  - Preserve sensitive project boundaries while routing out-of-scope work.
---

# Scope Work Gate

Before taking on or assigning a new piece of work:

1. Identify the project that owns the outcome.
2. Identify the lane and system layer that own the change.
3. Confirm that the work belongs to the current role.
4. Map it to the active objective, epic, or increment.
5. Separate the smallest required adjacent change from unrelated cleanup.

Proceed when all four boundaries align:

- project
- lane and layer
- role
- approved objective

When work belongs elsewhere, retain any transferable learning but route the
execution to the owning role through the handoff gate. When scope is ambiguous,
stop and request the smallest decision that resolves ownership. Do not absorb
another role's work merely because it is nearby or convenient.
