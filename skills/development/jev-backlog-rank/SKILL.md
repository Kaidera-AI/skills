---
name: jev-backlog-rank
description: "Use when a lead must inspect the ordering of a nonempty backlog or checklist against stated gate dependencies and delay risk."
license: Apache-2.0
metadata:
  version: 0.1.0
  requires: "jev core at .agents/skills/jev version >=0.1.0; python3"
  applies_to: [lead, cpo, pm, orchestrator]
  authority: "Project-approved installation and role grants; rankings remain advisory to the accountable human"
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
