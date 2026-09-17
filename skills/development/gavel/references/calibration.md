# Calibration log

## 2026-09-17 - first run on four real returns (jev-1.13.0)

| case | lead's ruling | Jev disposition (conf) | evidence | silent_gap | irreversible | urgency | verdict |
|---|---|---|---|---|---|---|---|
| an upload that exited 0 with empty logs while the object check returned 404 | rework | rework (1.00) | 2.74 | 0.62 | 0.05 | 2.75 | agrees; evidence 2.74 is generous - the receipt proved absence, which is still a receipt |
| a release-pipeline repair (root cause, credential rotated, job rerun green, four install channels verified) | accept | accept (0.56; rework 0.34) | 2.81 | 0.23 | 0.11 | 0.17 | agrees but soft; the rework mass likely reflects "rotated a secret" reading as unverified - acceptable |
| a worker's consult with four numbered questions, blocked by design until the lead rules | answer_questions | answer_questions (0.99) | 1.82 (conf 0.00) | 0.21 | 0.03 | 1.79 | agrees; evidence confidence 0 is correct for a consult with no receipts to grade |
| a return reporting a pending irreversible deletion, with options for the owner | consult_owner | consult_owner (0.33; rework 0.32) | 0.41 | 0.19 | 0.46 | 2.97 | agrees on outcome, low confidence mirrors real ambiguity; urgency 2.97 correct |

Dispatch check on one of the lead's own plan handoffs: receipts 0.15, blocked protocol 0.09, weakest = receipts. Correct - the handoff listed checklist rows without per-row receipts; an addendum with per-row receipts was sent the same hour and scored 0.86 / 0.97.

Rank of a release-cut checklist: Jev put the SBOM row first and a dependency-pin row second; the lead kept the pin first because it blocks two gates, a dependency the context stated only in prose. Lesson: pass dependencies as structured facts.

Cost: ~1,000 input / ~190 output tokens per triage; ~900/146 per dispatch check; ~2 requests per ranked item.

## 2026-09-17 - gavel reviews its own release (1.0.0)

The author triaged the pull request that publishes this skill as if it were a worker's return. Verdict: `rework` (0.90), evidence 2.83, scope_creep 0.66, against the author's instinct to accept. Policy line 1 applied - the disagreement was written down and examined, and it was right twice: the return admitted an unfinished step (a stale registration under the old name), and the option names still carried one project's vocabulary (`consult_cto`, `kai`, `cto`). Both were fixed before merge: the stale registration was removed, the options became `consult_owner`, `lead`, `accountable_human`, and the four labelled evals were rerun (4/4 agree; the consult case's next owner moved from 1.00 to 0.90 `lead` after the wording change). The scope_creep signal was a false positive: the marketplace's own tests require the catalogue, policy and manifest updates. Lesson: state repository-mandated side work in the dispatch, or the model reads it as creep.
