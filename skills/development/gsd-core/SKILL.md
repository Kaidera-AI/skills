---
name: gsd-core
description: "Plan, execute or resume a GSD Core project with persistent phase artifacts and bounded context. Use for GSD, Get Shit Done migration, interrupted phases or an explicitly chosen GSD workflow."
license: CC-BY-4.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter", "tool:web_search"]
  allowed_domains: ["github.com", "registry.npmjs.org"]
  updated: "2026-10-10"
  tags: ["gsd", "planning", "sdlc", "resume"]
  attribution_author: "OpenGSD"
  attribution_url: "https://github.com/open-gsd/gsd-core/tree/87e87d34b2d8519e30d1af7d910fc98f2af4bc8d"
  attribution_notes: "Original Kaidera adaptation and routing text informed by inspected pinned upstream sources. No upstream executable, installer, plugin or skill body is bundled."
  safety_constraints: ["Preserve Cortex ownership of generated harness files and the project SDLC gates.", "Native runtime migration requires accepted scope, preserved state and rollback.", "Use only the task-authorized tools, data and external actions.", "Source publication does not grant runtime trust, installation, release authority or provider spend."]
---

# GSD Core

Use GSD Core as a phase and context method inside the project's governing development lifecycle. For a Kaidera project, the existing SDLC owns plan acceptance, review and release authority.

## Choose the mode from current artifacts

| Request / state | Action |
|---|---|
| Resume or interrupted work | Read the active planning root, state, handoff and incomplete plans before editing. Follow the recovery rules below. |
| Existing codebase, no GSD artifacts | Map the relevant implementation and constraints; propose a bounded first phase. |
| New project | Capture the product, constraints and acceptance criteria; divide into independently demonstrable phases. |
| Discuss a phase | Record decisions, rejected alternatives and unresolved questions before the plan. |
| Plan a phase | Give each task its dependencies, owned files, observable acceptance criterion and verification method. Obtain the required plan acceptance. |
| Execute a phase | Implement the accepted plan in bounded context; record actual changes, deviations, evidence and unfinished work. |
| Verify or ship | Check requested acceptance criteria and the project's review/release gates; retain failures and limits. |

## Recover without inventing progress

Use the project's existing planning root; upstream's ordinary root is `.planning/`. Read `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md` and `STATE.md` where present. Check `HANDOFF.json`, `.continue-here*` and plans lacking summaries. Resolve the branch, working tree and actual artifacts before treating a recorded completion as fact.

A partial initialisation is different from a missing state file in an established project. Keep valid initial artifacts and finish the missing bootstrap documents. For an established project, reconstruct state from plans, summaries and source evidence, marking uncertain facts. Never rerun a completed migration or external action merely because a summary is missing.

Keep one authoritative set of project facts. Where an epic already has a canonical plan, link GSD phase documents to it rather than maintain a competing roadmap. Record the next exact action and blockers when pausing. A resume is complete when the active task, accepted scope, last evidenced result and next action are identified.

## Keep execution bounded

Load context for the active phase rather than every historical document. Respect the host's available tools and delegation authorization; use serial task execution when worker dispatch is unavailable. A task summary records what happened, not a claim that tests or deployment occurred.

For a native GSD runtime or legacy migration, read [runtime and migration](references/runtime-and-migration.md). This skill works as plain instructions without installing that runtime.
