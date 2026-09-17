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
