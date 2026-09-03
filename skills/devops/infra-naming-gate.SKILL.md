---
name: infra-naming-gate
version: 1.0.0
description: |
  Validates proposed infrastructure names against a portable organization,
  project, environment, role, locality, and ordinal grammar before creation.

kaidera:
  category: devops
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
tags: [infrastructure, naming, governance, cloud, operations]

parameters:
  resource_name:
    type: string
    required: true
    description: The proposed infrastructure resource name.

safety_constraints:
  - Review only; do not create, rename, or delete infrastructure.
  - Existing live names remain exact until an approved migration verifies all consumers.
  - Never infer a target project's naming exception without evidence.
---

# Infrastructure Naming Gate

Collect the resource type, owning organization and project, environment,
functional role, singleton or fleet shape, locality needs, and target naming
policy before deciding.

## Portable grammar

Use lowercase ASCII tokens separated by hyphens. Select the smallest form that is
unique in the target inventory:

- `{org}-{project}-{env}-{role}`
- `{org}-{project}-{env}-{role}-{n}`
- `{org}-{project}-{env}-{role}-{region}-{zone}`
- `{org}-{project}-{env}-{role}-{region}-{zone}-{n}`

The target project's canonical policy may omit a redundant token or define a
documented exception. That policy must be read before approval.

## Reject

- vague or transient roles such as `box`, `new`, `temp`, or `final`
- a person's name as a functional role
- uppercase, spaces, underscores, or punctuation beyond hyphens
- a managed product, hardware feature, or implementation detail encoded as the role
- locality before ownership, environment, and role
- an ordinal on a singleton without a documented reason
- an asserted exception with no owner or approval evidence

## Required output

```text
Result: PASS or FAIL
Name: proposed-name
Reason: one sentence
Canonical form: singleton, fleet, locality-bound, or exception
Required fix: none or corrected-name
Evidence needed before creation: policy source, inventory read, or approved exception
```

Naming approval is not provisioning approval. Run the relevant deployment and
change gates separately.
