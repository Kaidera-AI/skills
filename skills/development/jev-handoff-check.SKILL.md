---
name: jev-handoff-check
version: 0.1.0
description: "Check a drafted worker handoff's receipt contract and blocked protocol before the accountable lead sends it."
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
    path: .agents/skills/jev-handoff-check
    content_sha256: 5046dc320a4fd56520af745bc7cb3d040291a4680ef62690ea84d3cf756aefbe
author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-28
tags: ["jev", "gavel", "handoff", "receipts"]
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
# Jev handoff check

Use on a **draft** handoff immediately before its accountable lead sends it. Do not grade a worker's arrived return here (`jev-return-triage`), sort a backlog (`jev-backlog-rank`) or settle an implementation choice (`jev-option-decision`). A typed check is evidence for the lead, not permission to dispatch.

## Core presence before handoff text

From the project root run `python3 .agents/skills/jev/tools/jev.py --version` **before** loading the draft. If it fails or reports below `jev 0.1.0`, STOP and report that the jev core is missing or incompatible; never install, copy or fetch it during a task. Installation at project scope is an operator action through the project's approved skill-install process; a global core cannot find the project policy and abstains. Do not invent a second client, credential lookup, sanitizer or policy. `requires` metadata is not a transitive install.

Put only a classified, minimum sanitized handoff summary in a UTF-8 text file (or `-` for stdin). It should name one owner, each step's verifiable receipt, the gate/checklist row, exclusions and what to do if blocked (consult with options). For example:

```text
Owner: worker@fixture. Step 1: inspect the process receipt at docs/sample.txt; return its SHA-256 identity. Gate: lead checks the receipt before dispatch. Out of scope: publication and unrelated changes. If blocked, consult the lead with two options.
```

Run from the project root with the SDLC role you are actually acting in:

```sh
python3 .agents/skills/jev/tools/jev.py lead dispatch <handoff.txt|-> --role <bound-role> --json
```

**Gavel dispatch policy:** `has_receipt_contract` or `blocked_protocol` below 0.5 means the draft is not ready; have the lead fix `weakest_part` and re-check before the human decides whether to send. Read `names_gate`, `scope_excluded` and `single_owner` alongside them, rather than reducing the check to one number. No score dispatches the handoff or overrides the named human gate. A high score is not proof a receipt exists; inspect it independently.

Only categories granted to your role by `.agents/config/transfer-policy.<project>.json` may leave, such as project keys, agent-role names, repository-relative source paths, SHA-256 identities or minimum process/receipt/dependency/stop summaries where granted. Agent identities in the `<name>@<project>` form and role names may pass; email addresses may not. Absolute user and system paths abstain; use repository-relative paths. Never send code/diff text, keys, customer/employee data, raw transcripts or confidential payloads. If decisive evidence cannot be summarized, HOLD instead of sending. The core alone checks the project-owned transfer policy and three sanitizer layers. Pass `--role` as your actual lead/cpo/pm/orchestrator role; it is a declared policy selector, not authentication or a way to widen a grant. The client reads only the process `TYPESAFE_API_KEY`; relay a value-free legacy `JEV_API_KEY` rename message, never a value. Receipts are opt-in.
For one invocation, load `TYPESAFE_API_KEY` by name from the project's secret store in the same command as an environment assignment to `python3`; never pass its value as a visible argument, echo it or write it to a file.
If several project transfer-policy files exist, the core abstains; append `--project <project-key>` from the trusted project context, never a guessed or hardcoded project. With one policy file the core auto-selects it. A missing file still means HOLD.

| Core status | Exit | Response |
|---|---:|---|
| `ok` | 0 | Advisory handoff-quality judgments for the lead's own pre-send ruling. |
| `abstained_no_key` | 2 | No check; report credential migration by name only. |
| `abstained_no_policy_file`, `abstained_policy`, `abstained_deny_pattern` | 2 | HOLD the send, name missing policy/role/category or matched class. |
| `fallback_heuristic` | 2 | Low-trust review flag only, never a ready-to-send label (not a normal dispatch result). |
| `error_provider`, `error_validation` | 2 | No trusted check; report value-free reason, do not silently send or retry outside the core. |

## Files

The installable directory form contains these exact files (SHA-256 of raw file bytes); the flat manifest does not embed runtime code. Install `jev` separately in the same project before using a wrapper. A project-owned transfer policy and opt-in `runs/` stay outside this distribution.

| Relative file | SHA-256 |
|---|---|
| `LICENSE` | `50e6751797c50dedd75ef1b8a0d9e42f5f8472e9fbce91f34718e9f97b0c780a` |
| `NOTICE` | `d6b54287e0480f1fb9bf2709515b971b5f353d7f34c11fa38cea03a3d0bd54f8` |
| `SKILL.md` | `ab73fc9564e57d97cf650733af7ee17f592651bab801e99bad8b702e491190c9` |
