---
name: jev-option-decision
description: "Use for a bounded, named implementation or architecture choice whose explicit evidence, priorities and requirements could change an accountable person's ruling."
license: Apache-2.0
metadata:
  version: 0.1.0
  requires: "jev core at .agents/skills/jev version >=0.1.0; python3"
  applies_to: [lead, cpo, pm, orchestrator, developer]
  authority: "Project-approved installation and role grants; decisions remain with the accountable human"
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
