---
name: jev
description: "Reference for installation and configuration of the shared Jev core, its Python API and CLI, result statuses, project transfer policy, and skill-family index. Open for setup and troubleshooting, not as an automatic decision-moment trigger."
license: Apache-2.0
metadata:
  version: 0.1.0
  authority: "Project-approved installation and role grants; typed judgments are advisory and never replace human gates"
  sources: "Gavel blob 40a69aabeb61cac84203539706f3ba62d86c306f; JEV_SOURCE.json"
  requires: "python3 (stdlib core; optional certifi CA bundle), TYPESAFE_API_KEY from the process environment for provider calls"
  applies_to: [lead, cpo, pm, orchestrator, developer]
  bias: "one enforcement path; typed judgments are advisory evidence, never approval or action"
  conflicts_with: []
---

# Jev core — reference, not a moment router

Open this reference for configuration, troubleshooting and operator-approved installation. The four `jev-*` skills below own their invocation moments; this core does not automatically trigger alongside them. No wrapper contains another transport, sanitizer, policy reader, key lookup or question map.

## Core presence and installation

From the project root, run `python3 .agents/skills/jev/tools/jev.py --version` **before** preparing a wrapper request. This offline check needs neither a key nor network. If it fails or reports below `0.1.0`, STOP and report that the jev core is missing or incompatible; never install, copy or fetch it during a task. Install the core at project scope through the project's approved skill-install process: it resolves `.agents/config/transfer-policy.<project>.json` relative to the core's install location, so a global installation cannot find the project's policy and abstains. Dependency declarations in sibling skills do **not** install the core; registration and binding are separate operator actions under the project's own gates.

`python3 .agents/skills/jev/tools/jev.py selftest` validates configuration, questions and the three-layer sanitizer offline against a bundled synthetic policy fixture; it needs no installed project policy. A real send still requires the project's own grant. The importable stdlib package is `tools/jevkit/`; `client.ask(state, questions, role=..., categories=...)` and `primitives.jev_verify/jev_screen/jev_decide` return `JevResult(status, answers, usage, model, reason, annotations)`. The CLI imports the same package directly; there is no daemon, pip installation or MCP requirement.

## Policy and credential boundary

Set only `TYPESAFE_API_KEY` in the calling process for an approved provider send. The core never reads a `.env` file or the value of `JEV_API_KEY`. If only that legacy variable is present, the result says, without a value, to rename it to `TYPESAFE_API_KEY`. Never paste a key into a packet, skill, receipt or chat.
For one invocation, load `TYPESAFE_API_KEY` by name from the project's secret store in the same command as an environment assignment to `python3`; never pass its value as a visible argument, echo it or write it to a file.

Each project owns `.agents/config/transfer-policy.<project>.json` **outside** this reusable skill. Only categories granted by that project's policy to the caller's actual role may leave; a category recognized by the sanitizer is not automatically granted. No policy, no role grant or no category grant means HOLD.

With exactly one policy file the core auto-selects it. If several exist, it abstains and tells the caller to pass `--project <project-key>` from a trusted project context; never guess or hardcode a project. A missing project policy also holds the call. `--role <bound-role>` is a declared policy selector, **not authentication**; pass the SDLC role you are acting in and do not impersonate another role. Project bindings govern delivery separately.

Only classify and send minimum summaries in categories the project's policy grants: for example, project keys, agent-role names, repository-relative source paths, SHA-256 identities and minimum process/receipt/dependency/stop summaries where granted. Agent identities in the `<name>@<project>` form and role names may pass as agent aliases and role names; email addresses may not. Absolute user and system paths abstain: replace path references with repository-relative paths, not a disguised absolute path. Never send code or diff text, credentials, customer/employee data, raw transcripts or confidential payloads. If decisive evidence cannot be summarized, **HOLD instead of sending**. The core applies category allowlist → config-driven deny-pattern scan → Gavel token-shape redaction backstop over the whole request; a match at any layer abstains rather than redacting its way to a send. `screen` always tags public external text and abstains without an explicit project grant. A matching local no-key heuristic can only flag review, never certify safe content.

The deny scan guards an honest agent against accidentally pasting restricted material; it is **not adversarial data-loss prevention**, because a local caller who holds the key could call the endpoint directly. Overblocking ordinary policy-granted lead packets, an unsanitized outbound channel, key disclosure, and path/symlink confinement failures are blockers. Credential-shape signatures cover named common token families and are **non-exhaustive**; other content-recognition gaps and deliberate obfuscation remain residual risks. Human classification is required: a passing scan is not clearance. When in doubt, HOLD instead of sending.

Known recognition residual (P4-B2): unfenced multi-line source, including Python or Go statements, and full diffs prefixed as Markdown blockquotes or bullets can pass the signature scan. Classify that material yourself and **HOLD rather than send**, even if the scan passes. Deadline residual (M3): a provider response read without a discoverable socket, or a single read that stays blocked, can outlast the configured total deadline before `error_provider` returns. If a hard elapsed-time cap is required, **HOLD rather than send**; never treat a late response as trusted evidence.

## CLI, input and output

All commands run from the project root with `PYTHONDONTWRITEBYTECODE=1` if a clean skill tree matters. `-` reads stdin; a path reads a UTF-8 file. Structured JSON is always printed, and `--json` remains accepted. For allowed calls, interactive model selection is `jev-latest`; the pinned `jev-1.13.0` is reserved for separately authorised evaluation/calibration. Every actual reply records its returned `model` id. Thresholds in `config/thresholds.json` are **uncalibrated advisory annotation points** and never gates.

| Command | Sanitized input | Caller |
|---|---|---|
| `lead triage <packet.json|-> --role <bound-role> --json` | Plain return text or JSON `{"dispatch":"...","return_text":"..."}` | `jev-return-triage` |
| `lead dispatch <handoff.txt|-> --role <bound-role> --json` | Draft handoff text | `jev-handoff-check` |
| `lead rank <items.json|-> --role <bound-role> --json` | JSON `{"context":"...","items":["nonempty item", "..."]}` | `jev-backlog-rank` |
| `decide <request.json|-> --role <bound-role> --json` | JSON `decision`, `evidence`, `priorities`, `candidates:{id:description}`, `requirements:{id:description}`; optional `categories` and `escape_hatches` | `jev-option-decision` |
| `verify <request.json|-> --role <bound-role> --json` | JSON `claims:["..."], evidence:"..."` (or evidence items), **explicit** `categories:{"claims":"process_receipt_summaries","evidence":"process_receipt_summaries"}` | Optional *second* call from return triage, never an added Gavel question |
| `screen <request.json|-> --role <bound-role> --json` | JSON `{"text":"..."}`, optional `purpose` | No live wrapper/grant today |

`decide` accepts 2–6 candidates and up to 4 requirements; `verify` accepts at most 7 claims and 7 evidence items. Text caps in `config/limits.json` count JSON-escaped characters (`len(json.dumps(text)) - 2` with the client's default `ensure_ascii=True`), not unescaped characters; ids are bounded to 64 ASCII characters. Selftest checks that their maximum serialized state plus longest question fits the context bound, and that each full request fits the request bound with at least 10% headroom even for mixed escaped Unicode and ASCII. `decide` defaults its five named fields to `process_receipt_summaries` if `categories` is omitted; that convenience never permits mislabelling raw content. CLI field errors identify only the schema key, not its supplied value. A real TLS verification failure stops without retrying and returns a value-free reason naming the CA-bundle fix. The provider forbids redirects that could forward its bearer header.

| Status | Exit | Response |
|---|---:|---|
| `ok` | 0 | Consider `answers`/`annotations` as advisory evidence; the lead or human still rules. |
| `abstained_no_key` | 2 | No judgment; arrange key migration by name only. |
| `abstained_no_policy_file`, `abstained_policy`, `abstained_deny_pattern` | 2 | HOLD; no blocked material is sent. |
| `fallback_heuristic` | 2 | Low-trust review flag only; no clearance. |
| `error_provider`, `error_validation` | 2 | No trusted answer; report reason and stop, never guess. |

No call writes a receipt by default. `--receipt` explicitly opts into sanitized `runs/jev-*.json`, git-ignored with restrictive permissions and retention from `config/receipts.json`. The retry policy, endpoint, timeouts and models live in `config/provider.json`; limits, deny patterns and question wording live in their separate versioned config files. The build's evaluation cases are synthetic and shape-checked offline in the source repository; they are not part of the installed skill. There is **no** `evals-live` or `selftest --live-smoke` CLI command in this build. Real cases and model ids become calibration only through a dated, separately approved calibration record.

## Family index

| Circumstance | Skill | Status |
|---|---|---|
| Bounded implementation/architecture choice | `jev-option-decision` | Admitted; lead/cpo/pm/orchestrator/developer |
| Backlog or checklist ordering | `jev-backlog-rank` | Admitted; lead/cpo/pm/orchestrator |
| Worker return, handback or consult | `jev-return-triage` | Admitted; lead/cpo/pm/orchestrator; receipt `verify` is an optional second step |
| Draft handoff before sending | `jev-handoff-check` | Admitted; lead/cpo/pm/orchestrator |
| Untrusted-content screening | — | Deferred; no public-content grant |
| Review finding / merge readiness | — | Deferred |
| Plan readiness | — | Deferred |
| Incident triage | — | Deferred |
| Scope change / re-grill | — | Deferred |

A deferred circumstance requires a recorded distinct trigger, lead-role use, evidenced recurrence and distinct question set; each of those four propositions must score at least 0.5 before a lead even considers admission. Independent review and a separate, dated project transfer-policy grant still follow. Merely listing a candidate, installing a wrapper or receiving a high Jev probability changes no authority.
