---
name: jev-option-decision
version: 0.1.0
description: "Examine one bounded implementation or architecture choice with named candidates, evidence and requirements; the human decides."
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
    path: .agents/skills/jev-option-decision
    content_sha256: 0f5a163c9d43f46bc3fa1c341bb5219737901ffdc1be63be4e8287936ce59b6e
author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-28
tags: ["jev", "options", "architecture", "decision-support"]
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
# Jev option decision

Use for one unresolved, bounded choice with 2–6 named alternatives and facts that could change the ruling. Do **not** use it to order a backlog (`jev-backlog-rank`), adjudicate a worker return (`jev-return-triage`) or check a draft handoff (`jev-handoff-check`). Do not repeat an unchanged choice to obtain a preferred score. The accountable person decides; Jev supplies advisory evidence only.

## Core presence, then one packet

From the project root, **before loading the packet**, run:

```sh
python3 .agents/skills/jev/tools/jev.py --version
```

If this fails or reports below `jev 0.1.0`, STOP and report that the jev core is missing or incompatible; never install, copy or fetch it during a task. Installation at project scope is an operator action through the project's approved skill-install process; a global core cannot find the project policy and abstains. Do not improvise another client, key lookup or policy. A `requires` declaration does not transitively install the core.

Use a sanitized JSON file (or `-` for stdin):

```json
{"decision":"Pick a synthetic design","evidence":"Sanitized process/receipt summary only","priorities":"Prefer verifiability","candidates":{"alpha":"Alternative A","beta":"Alternative B"},"requirements":{"receipt":"Produces a checkable receipt"}}
```

`decision`, `evidence` and `priorities` are nonempty summaries; `candidates` and `requirements` map stable ids to descriptions (2–6 candidates and up to 4 requirements, with text-length caps in `config/limits.json` counted as JSON-escaped characters). Optional `escape_hatches` defaults to true and offers `ask_user`, `investigate` and `none`; optional `categories` explicitly tags the five outbound fields (otherwise the core tags them as `process_receipt_summaries`, **never** as permission to send raw content). Run from the project root with the SDLC role you are actually acting in:

```sh
python3 .agents/skills/jev/tools/jev.py decide <request.json|-> --role <bound-role> --json
```

`--role` selects a project policy entry; it is **not authentication**. It cannot create a role grant. Do not pass a different role to bypass a hold; `developer` is eligible here for an implementer's option decision, not for the other three wrappers.
If several project transfer-policy files exist, the core abstains; append `--project <project-key>` from the trusted project context, never a guessed or hardcoded project. With one policy file the core auto-selects it. A missing file still means HOLD.

## Ruling and boundary

Read the raw `answers.recommendation` choice distribution and advisory `annotations.selected`, `probability`, `confidence`, `escaped`, `checks_table` and `warnings`. A selected candidate contradicted by a requirement at confidence >=0.5 is a **warning to inspect**; it neither rejects nor accepts anything. A high probability does not prove the facts, authorise spending, choose an implementation automatically or waive a human gate. If an escape hatch wins, ask the user or investigate instead of inventing consent. All thresholds are uncalibrated annotations.

Only categories granted to your role by `.agents/config/transfer-policy.<project>.json` may leave, such as project keys, agent-role names, repository-relative source paths, SHA-256 identities or minimum process/receipt/dependency/stop summaries where granted. Agent identities in the `<name>@<project>` form and role names may pass; email addresses may not. Absolute user and system paths abstain; use repository-relative paths. Never send code/diff text, credentials, customer/employee data, raw transcripts or confidential payloads. If decisive evidence cannot be summarized, **HOLD**. The core alone checks the project-owned policy and three sanitizer layers before transport. It reads only `TYPESAFE_API_KEY` from the process environment; if only `JEV_API_KEY` is present, relay its value-free rename message, never its value. Receipts are off unless explicitly opted in.
For one invocation, load `TYPESAFE_API_KEY` by name from the project's secret store in the same command as an environment assignment to `python3`; never pass its value as a visible argument, echo it or write it to a file.

| Core status | CLI exit | What this wrapper reports |
|---|---:|---|
| `ok` | 0 | Typed evidence for the human's own ruling; no automatic decision. |
| `abstained_no_key` | 2 | No judgment; arrange the value-free key rename/set step. |
| `abstained_no_policy_file`, `abstained_policy`, `abstained_deny_pattern` | 2 | HOLD the send and report the missing file/role/category or pattern class. |
| `fallback_heuristic` | 2 | Low-trust flag only, never a clearance (not a normal option-decision result). |
| `error_provider`, `error_validation` | 2 | No trusted answer; report the field/provider reason without caller values or extra retry. |

## Files

The installable directory form contains these exact files (SHA-256 of raw file bytes); the flat manifest does not embed runtime code. Install `jev` separately in the same project before using a wrapper. A project-owned transfer policy and opt-in `runs/` stay outside this distribution.

| Relative file | SHA-256 |
|---|---|
| `LICENSE` | `50e6751797c50dedd75ef1b8a0d9e42f5f8472e9fbce91f34718e9f97b0c780a` |
| `NOTICE` | `d6b54287e0480f1fb9bf2709515b971b5f353d7f34c11fa38cea03a3d0bd54f8` |
| `SKILL.md` | `71e53ee2ae8e903eaca9035fd8f1464184fe42fb617bce38da3921a62bc181cc` |
