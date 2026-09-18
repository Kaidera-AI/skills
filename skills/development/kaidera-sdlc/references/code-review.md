# Code review: two reviewers, one report, bounded rounds

Read this when a change is handed back for review, when you are the reviewer, or when you set up
review in a project. It is the process behind the Review stage (`stages.md` section 5) and the
rounds in `templates/REVIEW.md`. Kaidera's plan and progress for it are `Program/ReviewService/`
in the Kaidera OS repository; this file is the portable process.

## 1. Shape

```
handback with base and tip
  A  deterministic candidates   scope receipt, type check, linters, affected tests, fitness gates,
                                secrets, dependencies, pattern rules            no model, minutes
  B1 semantic review            the reviewer agent runs open-code-review on the frozen range
  B2 second reviewer            a self-hosted review service on the same range, same rule pack
  M  merge                      one finding list: duplicates joined, severity calibrated, causality
                                marked, noise ordered last; typed judgments help, the reviewer verifies
  -> one combined report (contract-verified) -> rounds -> adjudication -> review gate record
```

The reviewer owns B1, B2 and M and is accountable for the combined report. Authors may run the
tools on their own change before handing back; that run is not the review.

## 2. The reviewer is a role, held by an agent whose only lane is review

Review that competes with delivery for the same worker stalls both. Where the roster allows, a
project names one reviewer agent whose only lane is review; who holds the role is an occupancy
record, never a line here (for Kaidera OS: CTO decision 2026-09-18, `Program/ReviewService/PLAN.md`
section 9). Otherwise the reviewer is a different agent than the author (`governance.md`,
"Separation of duties"). The reviewer never authors what they review, never merges, never passes
a gate, and never reviews their own tooling. The reviewer's model is configuration, chosen to differ in family from the author's whenever the roster allows; the
refuter pass on material findings uses the other family. Two reviewers on the same change, one of
them a different engine, is the point of B2.

## 3. Freeze, account, refute

These are the invariants of open-code-review 4.0.1 (the marketplace version, not yet in every
tree), in short.

Resolve `base` and `tip` once and review those bytes. Every changed path ends as reviewed,
metadata-reviewed, unreadable, or skipped with a reason. Linter, scanner and model output are
candidates until their execution path and impact are verified. Only what the change introduced or
activated can block it; adjacent findings need an activation path. Every critical and high finding
survives an independent refutation. No evidence, no claim: what could not be run is a limit in the
report. Read-only: the repository under review is never modified.

## 4. The merge stage and typed judgments

Both sources are normalised to one finding contract (id, file, line, severity, pass, causality,
evidence, source). Where the project enables a typed-judgment service (the one behind `gavel`), it answers, per
finding or pair: same defect as another finding; severity on the project's described levels;
introduced, adjacent or pre-existing; actionable as written; false-positive likelihood given the
quoted evidence; owning lane. Code applies the thresholds. The reviewer verifies every finding
reported as material; a finding is never dropped on a model's word alone, and disagreement between
the judgment and the reviewer is logged in the report's audit section. Only finding text,
`file:line` and short redacted excerpts leave the machine; a project may switch judgments off.

## 5. Readiness signal

The combined report may carry one calibrated readiness judgment over described levels: not
reviewable (limits too wide), findings open, ready pending adjudication, ready for the human gate.
It is a signal the lead reads next to the verdict, never the gate. The exit of the rounds stays
"no finding open or the cap reached"; the readiness level tells the lead how far from the gate the
change is, and the Software Factory practice of looping until the reviewer reports its top score is met by the
level, not by a number a model invented.

## 6. Rounds and the record

Rounds are bounded (`templates/REVIEW.md`, "Rounds"; default three, a dated decision). The author
proposes dispositions; only the reviewer closes a fix at a new `reviewed_sha`; the adjudicator
rules the rest; at the cap the open list goes up, not around. The review ends in a `review` gate
record bound to `reviewed_sha`, with the report's path and sha256 as its receipt, and the human
gate packet (`references/human-gates.md`) carries the verdict, the evidence pair and the record.

## 7. When the second reviewer is down

The reviewer completes B1, states in the report's limits that B2 did not run, and tells the lead. A
review never waits on the second opinion; the lead decides whether the gate does.

## 8. Measures (monthly, and weekly while the service is new)

Reviews run and median wall-clock; findings by source (ours only, second reviewer only, both);
share of material findings the refuter killed; share the adjudicator rejected (reviewer noise);
second-reviewer-only findings that were real; defects that escaped review and which pass should
have caught them; tokens by seat and service cost. The record is the project's metrics report;
a second reviewer whose "real, second-reviewer-only" count is zero across a full monthly report
is put to the lead for reconsideration.
