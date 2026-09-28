---
name: jev
version: 0.1.0
description: "Reference for the shared Jev core, project-owned transfer policy, CLI, result statuses and four separate decision-moment wrappers; not an automatic moment router."
kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:code_interpreter
    - tool:file_write
  allowed_domains:
    - api.typesafe.ai
    - docs.typesafe.ai
    - github.com
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/kaideraos
    path: .agents/skills/jev
    content_sha256: 980e7b73bf6b48728a646fe41b40c430729e223c6a058d50ff56297379ec4335
author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-28
tags: ["jev", "typesafe", "system-one", "decision-support"]
attribution_author: TypeSafe AI and Joey Kudish
attribution_url: https://github.com/jkudish/jev-mcp
attribution_notes: "Retain the core ATTRIBUTION.md MIT donor notices and this skill Apache-2.0 LICENSE; root CC-BY-4.0 precedence remains unratified."
parameters:
  input:
    type: string
    required: false
    description: Sanitized input path or stdin marker, when invoking the separately installed core.
safety_constraints:
  - "Model judgments are advisory evidence, never permission to accept, send, merge, deploy, publish, delete or spend."
  - "Use only a separately approved project transfer policy; never publish that policy, raw transcripts, customer data, code, credentials or receipt files."
  - "The process TYPESAFE_API_KEY is read by name, not printed, and never sourced from .env; lack of core, policy or grant stops the call."
  - "Receipts are off by default; --receipt explicitly writes to a private git-ignored runs directory."
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

## Files

The installable directory form contains these exact files (SHA-256 of raw file bytes); the flat manifest does not embed runtime code. Install `jev` separately in the same project before using a wrapper. A project-owned transfer policy and opt-in `runs/` stay outside this distribution.

| Relative file | SHA-256 |
|---|---|
| `.gitignore` | `247681cefffa8448d973f21147c92b38b63f492a98a50aca3b3c490bc97499e1` |
| `ATTRIBUTION.md` | `6225b66d0e26b3b5aa4c820b7b68b09db382a1068071c85f970c83e5d02c4020` |
| `CHANGELOG.md` | `66c0b04208b765373188151289966156492590c0598bbf4a2f79bf512c958f2b` |
| `JEV_SOURCE.json` | `0d144f420ddfa9968cb8e65a9ebd2c2d1464c8ef1312276f7d6b4463d6a5fe69` |
| `LICENSE` | `50e6751797c50dedd75ef1b8a0d9e42f5f8472e9fbce91f34718e9f97b0c780a` |
| `SKILL.md` | `2482c6624e9fd1ce4536aca07101e8e3c967dcd2a2855a862405d680d35ed08c` |
| `config/deny_patterns.json` | `6f150c6b303a282cdb0a5a529a6a51f12bc871d3d285322da02241ffdf41a1a0` |
| `config/limits.json` | `8cbfa82b417a74a23646f26662eab4c420661529a728b5e8f38738073f7bb9dd` |
| `config/provider.json` | `b80d3e586fa2ba4f9d9ca796bd4b0f4157a7a2642aeb998bcb90c360bbf0cb3c` |
| `config/questions/lead.json` | `5523f4d23a4f08be85104306cdf7966ded9d54d18ade6b8447eca093a1552a4c` |
| `config/receipts.json` | `d8a1b572d18c7c9bcd600a0aca66c1e717d65f867ed2f68d970a42936461bf56` |
| `config/selftest_fixture_policy.json` | `98b073f2541035faefe70b3da694bcc36eb378ffd67f96ed96e0f62969e55bff` |
| `config/thresholds.json` | `69b11558e3b8c384540c66a2685dfce8233728a57d473a77891b823b200322e4` |
| `references/questions.md` | `1cb5165871d0b3eb83b261eedd73810591e80e24a96009ca0629662d217f2789` |
| `tools/jev.py` | `bade68c17e2764f94762042d97edfd768210e09f9a75c6052a1bb79352b00f43` |
| `tools/jevkit/__init__.py` | `6e1f4dbaa1c2daff43b7db69104be436dcef876f4ab4cb1f9078c374cedd8aec` |
| `tools/jevkit/client.py` | `886450f4ce121502d2f4980a9e7a64ce3a456d1229a78f05d977ae60a9f03e8f` |
| `tools/jevkit/playbooks/lead.py` | `0fc091393dc7069bbf3f7a65290d0591bde77577151289d890c89c1fc36b9aef` |
| `tools/jevkit/primitives.py` | `d9fd1dcbe264844c64d4a466ae8399c943d788af90ed4c8123363e294e3c6968` |
| `tools/jevkit/sanitize.py` | `b36f8d228419de128e4358e1dbd107b5b8c16df5ee98409e96b6eefcec8538e5` |
| `tools/jevkit/validate.py` | `3d928b712f95c5c469f15da304ec5fc39c1edb1a3cb2532ede560fc5aa193495` |
