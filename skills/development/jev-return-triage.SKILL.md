---
name: jev-return-triage
version: 0.1.0
description: "Advisory receipt-based triage of an arrived worker return, handback or consult by its accountable lead."
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
    path: .agents/skills/jev-return-triage
    content_sha256: af6743415be02b0f1fa7020b5e5dcfce65bc9eb1b7039bd388fcae715cb504d5
author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-28
tags: ["jev", "gavel", "return", "triage"]
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
# Jev return triage

Use for an arrived return, handback or worker consult, after reading its dispatched scope and receipts. Do **not** use it to draft a new handoff (`jev-handoff-check`), order tasks (`jev-backlog-rank`) or choose between implementation alternatives (`jev-option-decision`). It is never a worker self-grade or automatic acceptance.

## Check the one core first

From the project root, **before** opening return text, run `python3 .agents/skills/jev/tools/jev.py --version`. If missing, failing or below `jev 0.1.0`, STOP and report that the jev core is missing or incompatible; never install, copy or fetch it during a task. Installation at project scope is an operator action through the project's approved skill-install process; a global core cannot find the project policy and abstains. Do not invent a second client, sanitizer, credential lookup or transfer policy. The wrapper's `requires` metadata does not install it.

Supply a sanitized return as plain text, or JSON `{"dispatch":"Dispatched receipt contract","return_text":"Synthetic worker receipt summary"}`. Use a file or `-` for stdin. From the project root, pass the SDLC role you are acting in:

```sh
python3 .agents/skills/jev/tools/jev.py lead triage <return.txt|-> --role <bound-role> --json
```

The Gavel `TRIAGE` map remains byte-identical to its pinned source on sanitizer-clean inputs. Read Choice/Noul/Score answers as **advisory inputs**; the human lead performs every ruling and action. Apply Gavel's lead policy with its original force: (1) if `disposition` differs from your instinct or its confidence is under 0.6, write your reason in the adjudication record before ruling; (2) `accept` with `evidence_quality` under 2.5 is a contradiction—ask for the receipt first; (3) `silent_gap` over 0.5 sends the return back with the skipped step named, **whatever the disposition says**; (4) `irreversible` over 0.4 stops you until the accountable human has said yes to deletion, reset, restore-over, public publish or spend. The lead, not the model, sends the return back or stops the work.

### Optional second receipt check (D14v2)

Only if a particular claim/receipt needs independent support testing, make **one separate** `verify` call after triage. Do not insert a question into TRIAGE or invent a receipt. Its JSON requires an **explicit** categories map tagging both outbound fields:

```json
{"claims":["The synthetic job produced a checkable SHA-256 receipt"],"evidence":"Synthetic process receipt summary: an object size and SHA-256 identity were recorded.","categories":{"claims":"process_receipt_summaries","evidence":"process_receipt_summaries"}}
```

```sh
python3 .agents/skills/jev/tools/jev.py verify <receipt-claims.json|-> --role <bound-role> --json
```

A supported/contradicted/unsupported result is advisory evidence about the supplied summary, never proof of unprovided facts. `verify` without `categories` fails closed and names that field. Any second call independently passes the same policy and sanitizer; it does not reuse a triage clearance.

Only categories granted to your role by `.agents/config/transfer-policy.<project>.json` may leave, such as project keys, agent-role names, repository-relative source paths, SHA-256 identities or minimum process/receipt/dependency/stop summaries where granted. Agent identities in the `<name>@<project>` form and role names may pass; email addresses may not. Gavel policy line 7 still applies: never pass secrets, credentials, customer data or private keys; the token backstop is not permission. Absolute user and system paths abstain; use repository-relative paths. Never send raw worker transcripts, code/diffs, employee information or confidential payloads. HOLD if decisive evidence cannot be summarized. `--role` selects a grant but is not authentication; use only your actual lead/cpo/pm/orchestrator role. The shared core alone reads the project-owned policy, performs the three sanitizer layers and reads `TYPESAFE_API_KEY` from the process. If only legacy `JEV_API_KEY` is present, relay the value-free rename reason, never a value. Local receipts require explicit opt-in.
For one invocation, load `TYPESAFE_API_KEY` by name from the project's secret store in the same command as an environment assignment to `python3`; never pass its value as a visible argument, echo it or write it to a file.
If several project transfer-policy files exist, the core abstains; append `--project <project-key>` from the trusted project context, never a guessed or hardcoded project. With one policy file the core auto-selects it. A missing file still means HOLD. The optional second `verify` call uses that same explicit project selection independently.

| Core status | Exit | Response |
|---|---:|---|
| `ok` | 0 | Advisory triage or independent claim evidence for the human's own ruling. |
| `abstained_no_key` | 2 | No judgment; report key migration by name only. |
| `abstained_no_policy_file`, `abstained_policy`, `abstained_deny_pattern` | 2 | HOLD and name missing policy/role/category or matched class; no blocked send. |
| `fallback_heuristic` | 2 | Low-trust review flag only; no safe/accepted return (not a normal triage result). |
| `error_provider`, `error_validation` | 2 | No trusted answer; report the value-free reason and re-check the actual receipts without guessing. |

## Files

The installable directory form contains these exact files (SHA-256 of raw file bytes); the flat manifest does not embed runtime code. Install `jev` separately in the same project before using a wrapper. A project-owned transfer policy and opt-in `runs/` stay outside this distribution.

| Relative file | SHA-256 |
|---|---|
| `LICENSE` | `50e6751797c50dedd75ef1b8a0d9e42f5f8472e9fbce91f34718e9f97b0c780a` |
| `NOTICE` | `d6b54287e0480f1fb9bf2709515b971b5f353d7f34c11fa38cea03a3d0bd54f8` |
| `SKILL.md` | `424cb21d789c2f54febbfa9532133c03eb0b39da829cf5d1d9ddb7f50acb43f8` |
