---
name: jev-backlog-rank
version: 0.1.0
description: "Check an accountable lead's backlog ordering against explicit dependencies and delay risk; the human retains priority authority."
kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:code_interpreter
  allowed_domains:
    - api.typesafe.ai
    - github.com
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/kaideraos
    path: .agents/skills/jev-backlog-rank
    content_sha256: 0ceed9a8dfdf885baf0cb14c6876677180afa022408545becfc32448a61ea2a4
author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-28
tags: ["jev", "gavel", "backlog", "prioritisation"]
attribution_author: TypeSafe AI and Joey Kudish
attribution_url: https://github.com/jkudish/jev-mcp
attribution_notes: "Retain the core ATTRIBUTION.md MIT donor notices and this skill Apache-2.0 LICENSE; root CC-BY-4.0 precedence remains unratified."
parameters:
  input:
    type: string
    required: true
    description: Sanitized input path or stdin marker, when invoking the separately installed core.
safety_constraints:
  - "Model judgments are advisory evidence, never permission to accept, send, merge, deploy, publish, delete or spend."
  - "Use only a separately approved project transfer policy; never publish that policy, raw transcripts, customer data, code, credentials or receipt files."
  - "The process TYPESAFE_API_KEY is read by name, not printed, and never sourced from .env; lack of core, policy or grant stops the call."
  - "Install the compatible jev core in this same project separately; the skill installer does not install sibling dependencies."
---
# Jev backlog rank

Use when a lead, CPO, PM or orchestrator is ordering a backlog or checklist and wants a typed check of how each item's delay affects a gate or risk. Do **not** turn one bounded implementation choice into a backlog: use `jev-option-decision`. A worker return belongs to `jev-return-triage`; a draft handoff belongs to `jev-handoff-check`.

## Core presence before input

From the project root run `python3 .agents/skills/jev/tools/jev.py --version` **before** loading items. If it fails or reports below `jev 0.1.0`, STOP and report that the jev core is missing or incompatible; never install, copy or fetch it during a task. Installation at project scope is an operator action through the project's approved skill-install process; a global core cannot find the project policy and abstains. No second client, key reader or local policy may be invented; `requires` metadata does not install the core.

Put only sanitized summaries in a JSON file (or pass `-` for stdin). Name dependencies explicitly in `context`, preferably as facts, not an implied prose graph:

```json
{"context":"Synthetic item A blocks gate G; item B needs A first.","items":["A: collect a SHA-256 receipt","B: summarize the later check"]}
```

Then run from the project root, passing the SDLC role you are acting in:

```sh
python3 .agents/skills/jev/tools/jev.py lead rank <items.json|-> --role <bound-role> --json
```

The result has one model id per ranked item, two Score judgments (`gate_blocking`, `risk_if_delayed`) and their sum `priority`. **Gavel's ranking policy:** treat this as a check, not the order. It cannot infer dependencies reliably from prose; preserve the human's actual dependency order and explain any exception. Never let a score move a task past a human gate or decide an owner automatically. `--role` is a declared policy selector, not authentication; this wrapper admits lead/cpo/pm/orchestrator, not developer.
If several project transfer-policy files exist, the core abstains; append `--project <project-key>` from the trusted project context, never a guessed or hardcoded project. With one policy file the core auto-selects it. A missing file still means HOLD.

Only categories granted to your role by `.agents/config/transfer-policy.<project>.json` may leave, such as project keys, agent-role names, repository-relative source paths, SHA-256 identities or minimum process/receipt/dependency/stop summaries where granted. Agent identities in the `<name>@<project>` form and role names may pass; email addresses may not. Absolute user and system paths abstain; use repository-relative paths. Never send code/diff, credentials, customer or employee data, raw transcripts or confidential payloads; HOLD if an item cannot be safely summarized. The shared core alone enforces the project-owned transfer policy and three sanitizer layers. It reads only the process `TYPESAFE_API_KEY`; relay a value-free `JEV_API_KEY` rename message if needed. Receipts are opt-in, never assumed.
For one invocation, load `TYPESAFE_API_KEY` by name from the project's secret store in the same command as an environment assignment to `python3`; never pass its value as a visible argument, echo it or write it to a file.

| Core status | Exit | Response |
|---|---:|---|
| `ok` | 0 | Advisory scores and returned model ids; human retains the dependency order/ruling. |
| `abstained_no_key` | 2 | No ranking; report key migration by name only. |
| `abstained_no_policy_file`, `abstained_policy`, `abstained_deny_pattern` | 2 | HOLD, name the missing policy/role/category or matched class; send nothing. |
| `fallback_heuristic` | 2 | Review flag only, never a safe/approved ordering (not a normal rank result). |
| `error_provider`, `error_validation` | 2 | No trusted scores; relay the value-free reason, do not guess or retry outside the core. |

## Files

The installable directory form contains these exact files (SHA-256 of raw file bytes); the flat manifest does not embed runtime code. Install `jev` separately in the same project before using a wrapper. A project-owned transfer policy and opt-in `runs/` stay outside this distribution.

| Relative file | SHA-256 |
|---|---|
| `LICENSE` | `50e6751797c50dedd75ef1b8a0d9e42f5f8472e9fbce91f34718e9f97b0c780a` |
| `NOTICE` | `d6b54287e0480f1fb9bf2709515b971b5f353d7f34c11fa38cea03a3d0bd54f8` |
| `SKILL.md` | `278be41bae98b134fafd99ee083c7a35886c22512ab1129270760521211e8374` |
