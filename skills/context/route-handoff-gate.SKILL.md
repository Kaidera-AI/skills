---
name: route-handoff-gate
version: 1.0.0
description: |
  Verifies project, lane, layer, role, and dependency boundaries before creating
  or rerouting work to another agent or team.

engenai:
  category: context
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
tags: [handoff, routing, orchestration, ownership, multi-agent]

parameters:
  work:
    type: string
    required: true
    description: The work to route and its intended outcome.

safety_constraints:
  - Do not create or reroute work until project and role ownership are verified.
  - Do not cross project or data boundaries without explicit authority.
  - Never place secrets or sensitive payloads in a handoff summary.
---

# Route Handoff Gate

Before assigning or routing work, answer:

1. Which project owns the outcome and its data?
2. Which lane and system layer own the change?
3. Which registered role has authority and capability to execute it?
4. Is the proposed dependency necessary, or does it create avoidable cross-lane
   waiting?
5. What acceptance evidence and return owner make the handoff complete?

Verify the destination from the current project roster or registry. Do not infer
ownership from a tool name, a broad label such as "platform," or a remembered
team shape.

Create a bounded handoff with:

- project and intended role
- concise outcome
- files or systems in scope
- acceptance checks
- evidence and artifact requirements
- retry and escalation boundary
- return or review owner

After creation, read the queue or API record back and confirm that the handoff
landed on the intended project and role. If project, role, or authority remains
ambiguous, stop and ask for the smallest clarification needed.
