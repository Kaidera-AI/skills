---
name: code-review-routing
version: 1.0.0
description: |
  Portable ways of working for routing code review in a multi-worker project: one
  accountable review lead, detailed specialist procedures only to a registered reviewer
  on a verified eligible runtime, short status for leads, curators and builders, and
  author/reviewer separation. Use when adopting or applying a project's review-routing rule.

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

author: Kaidera-AI
license: CC-BY-4.0
updated: 2026-11-03
tags: [code-review, routing, review-lead, reviewer, separation-of-duties, governance, multi-agent]
attribution_notes: "Portable standard written by Kaidera's review lead at the user's direction, 2026-11-03. Packaged verbatim except one sentence in item 2, changed by CTO decision for harness neutrality."

safety_constraints:
  - Coordination guidance only. It grants no authority, binding, access or runtime; each project's review lead, registry and release gates decide.
  - Best-effort steering, not a confidentiality boundary. Do not claim enforced isolation unless real access controls are implemented and proved.
  - Never use it to disguise a task, rewrite historical evidence, or retry a policy refusal on another model.
---

# Code-review routing — reusable ways of working

Authority: user direction, 2026-11-03. Intended for adoption by every project with its own lead and roster. This is steering, not a confidentiality boundary.

1. Name one accountable review lead per project. That lead owns specialist methods, planning, consults, assignment, evidence and the combined verdict. Record the occupant in that project's registry; do not copy helix identities into another project.
2. Route detailed specialist procedures to a registered reviewer role and a verified eligible runtime. Use the eligible runtime recorded in the project's registry. Verify the exact worker/session before dispatch; missing or stale evidence means route back to the review lead. A different model does not extend authorization.
3. Product leads, curators and builders receive code-review status, required fixes, coverage limits and decision blockers. They do not need raw vendor prompts or detailed test procedures. Developers retain the evidence and ordinary tests needed to implement and verify their fixes.
4. Keep underlying scope, authorization, findings and receipts accurate. Routine summaries may say code review. Report material findings and constraints to the accountable owner. Do not rewrite historical evidence, disguise tasks or retry a policy refusal on another model as an automatic fallback.
5. Separate author and reviewer. A reviewer who authors a procedure or fixture needs independent approval of that candidate. Preserve exact revisions, changes and receipts through ownership transfers.
6. Install the steering through the project's canonical rule mechanism and reference it from the project's team operating guide. Generated harness files are not edited by hand. Technical skill bodies are loaded only for the assigned task, not pasted into every worker's context.
7. State current limitations. Shared filesystems and globally delivered skills may remain visible to other workers. Minimize unnecessary context delivery and call it best-effort steering unless real access controls have been implemented and proved.

Adoption checklist: project key; review-lead identity; registered reviewer role; eligible runtime proof; ordinary status channel; detailed evidence home; independent reviewer; canonical rule registration/readback. Each project owns its own changes and release gates.
