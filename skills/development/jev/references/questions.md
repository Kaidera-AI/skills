# Jev question catalogue and rationale

The Gavel section below is carried verbatim from `.agents/skills/gavel/references/questions.md` at `origin/main` commit `9ccc6cc27e4448a551d533a938bfef962cf34a4f`. Its request-building helper is Git blob `40a69aabeb61cac84203539706f3ba62d86c306f` (`gavel.py` SHA-256 `b13177b3ad90fb67f445d6126861b66b79244cd5496ad496a06c0a51ffc06cc8`). `config/questions/lead.json` preserves TRIAGE/DISPATCH/RANK wording and key order; `tests/parity/` checks the actual request bytes. The original Gavel source is unchanged.

## Gavel catalogue (unchanged)

# Question catalogue and rationale (gavel 1.0.0)

Designed by the TypeSafe rules: one narrow judgment per question, complete meaning in the question (ids are not shown to the model), named state fields (`dispatch`, `return_text`, `handoff`, `item`, `context`), criteria that describe concrete situations, a no-match outcome where nothing may fit, independent questions asked together so they run in parallel.

## triage (state: dispatch, return_text)
- `disposition` Choice - the five outcomes a lead actually has when a return lands. `withdraw` exists because work is sometimes done elsewhere (another worker closed an incident before the dispatch for it went out).
- `evidence_quality` Score, four levels from narrative to re-verifiable identities - the ladder behind "read the receipt before you send it" and "a green suite is not evidence".
- `silent_gap` Noul - the classic failure: exit code 0 with no artifact; "done" with a step skipped.
- `scope_creep` Noul - protects lane boundaries (one owner per fact).
- `irreversible` Noul - the destructive-operation trigger: stop for the accountable human.
- `next_owner` Choice - lead / same_worker / other_worker / accountable_human.
- `urgency` Score - backlog / this week / today / now.

## dispatch (state: handoff)
Mirrors a good handoff contract: receipt per step, gate named, exclusions stated, blocked protocol, single owner; `weakest_part` names what to fix.

## rank (state: item, context)
Two Scores per item, `gate_blocking` and `risk_if_delayed`; the composite is the sum. Dependencies must be stated in `context` as facts; the model does not infer a graph from prose reliably (see calibration).

## Wording history
- 0.1.0: first set. A pre-release probe with the phrasing "claims success while its own evidence shows the deliverable is missing" scored only 0.23 on a silent-failure case; the shipped `silent_gap` wording ("presents the work as complete while one dispatched step was skipped, deferred, or left unproven without saying so plainly") scored 0.62 on the same case. Phrase gaps as omissions, not as contradictions.

## New core primitives (W1/W2; no calibration claims)

- `VERIFY` asks one Choice per claim: does the supplied evidence support, contradict or say nothing about it? With multiple evidence items, a separate source Choice identifies the cited item or `none`. This is an **optional second** call after Gavel triage if a receipt claim needs testing, never another TRIAGE question. The `confident_at` starting point (0.8) is informed by `jkudish/jev-mcp@108d61ec0442aef3d212dcc6a18a5f3cf3ce4fda` (`src/index.ts:153-158`, `jev_verify`). Its label does not accept a claim.
- `SCREEN` asks independent Noul questions about instructions aimed at an AI agent and readable substance, with task relevance only when a purpose is supplied. `block_at` 0.75 and `review_at` 0.25 are informed by that pinned `jev-mcp` source (`src/index.ts:273-274`, `jev_screen`). These are annotations only, never a filter action or a statement that text is safe. `public_external_content` requires an explicit project grant; the local no-key heuristic can only flag review.
- `DECIDE` asks one Choice over bounded candidate ids plus `ask_user`/`investigate`/`none`, and one separate supported/contradicted/unknown Choice for **each** candidate×requirement. The design is informed by that pinned `jev-mcp` source (`src/index.ts:698-740`, `jev_decide`). `contradiction_warn_at` 0.5 is an uncalibrated advisory warning point; a warning never vetoes an option or replaces the accountable person's ruling. Criteria and templates are versioned in `config/questions/lead.json`, not hardcoded into a wrapper.

`confident_at`, `block_at`, `review_at` and `contradiction_warn_at` are neutral names for **uncalibrated** annotation points (`config/thresholds.json`); no new primitive acquires a load-bearing threshold without a dated real project case and the returned model id in the project's calibration record.
