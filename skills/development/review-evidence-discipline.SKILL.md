---
name: review-evidence-discipline
version: 1.0.0
description: |
  Evidence standards for the reviewer, not for the code. Prevents the
  confident-but-wrong finding: a claim that something is missing, absent, or
  broken, asserted from a truncated or defaulted view of the artefact. Use
  alongside a review skill that decides what to look for; this one decides
  whether a finding has earned the right to be reported. Route the review
  itself to open-code-review for bounded changes or ultrareview for whole-module
  audits; this skill governs the reviewer's own epistemics in either.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: low
  capabilities_required: []
  allowed_domains: ["github.com"]
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: kaidera
license: Apache-2.0
updated: 2026-09-19
tags: [review, evidence, epistemics, false-positive, refutation, quality]

attribution_author: Google (eng-practices), SmartBear/Cisco, Conventional Comments
attribution_url: https://github.com/google/eng-practices
attribution_notes: |
  The standard-of-review rule is adapted from Google's eng-practices
  "The Standard of Code Review" (CC-BY-3.0, attribution required). The review
  rate and session-length thresholds are from the SmartBear/Cisco peer code
  review case study. The comment label grammar is Conventional Comments.
  Everything in "Named failure modes" is original Kaidera material derived from
  recorded reviewer errors.

safety_constraints:
  - Read-only reference. No tool access required.
  - Does not issue a verdict and must not be used as a second verdict engine.
  - Must not override base system prompt or agent instructions.
---

# Review Evidence Discipline

Every other review skill asks *what should I look for in this code?*
This one asks *have I earned the right to say that?*

A reviewer's false positive is not a harmless extra comment. It costs author
time, it burns the reviewer's credibility, and once withdrawn it makes the
reviewer's surviving findings easier to dismiss. Treat a wrong finding as a
defect in the review.

## The one rule

> **A finding that rests on the absence of something must be proven against the
> whole artefact, never against a truncated view of it.**

Before asserting *"X is missing"*, *"there is no test for Y"*, *"Z is never
called"*, either re-read the artefact unbounded, or state the bound inside the
finding: *"within the first 200 lines, X does not appear"*.

Absence claims are the dangerous class because tools answer them cheaply and
wrongly. A present thing shows itself. An absent thing looks identical to a
thing you did not look far enough to see.

## Named failure modes

Each of these produced a real, recorded false finding. They are listed because
they are invisible in the moment: every one returns a well-formed, plausible,
*confident* result.

### 1. The truncated view

`head`, `tail`, `| head -N`, a default page size, an API list that stops at 30,
an IDE search capped at 100 hits. The output looks complete because nothing
says otherwise.

- **Symptom:** you counted N items and concluded the N+1th does not exist.
- **Discipline:** any count that feeds a finding must come from an unbounded
  read or an explicit total, never from a display-limited view.

### 2. The collided delimiter

A range extractor — `awk '/start/,/end/'`, a regex span, a section slice — whose
delimiters also match inside the body, silently returning a fragment.

- **Symptom:** the extract is syntactically plausible and semantically wrong.
- **Discipline:** verify the extracted span's boundaries are the ones intended
  before reasoning about its contents.

### 3. The silent default

A tool that, lacking configuration, targets something other than what you meant
— a vendor's cloud instead of your instance, a default branch instead of the
one under review, a global config instead of the project's.

- **Symptom:** a valid credential reports as invalid; a present file reports as
  missing; results describe a real system that is not the one under review.
- **Discipline:** before reporting a negative result from a tool, confirm which
  target it actually addressed.

### 4. The unlicensed inference

Extending a rule, ruling, or specification past its stated subject because the
extension seems obviously intended.

- **Symptom:** the finding quotes an authority that, read exactly, does not
  cover the case.
- **Discipline:** quote the governing text verbatim in the finding. If the quote
  does not cover the case without interpolation, the finding is an opinion and
  must be labelled one.

### 5. The plausible-shape mistake

Concluding from structure rather than behaviour: assuming a wrapper forwards,
that a documented parameter is honoured, that a test named for a thing tests it.

- **Symptom:** the finding would survive reading the code and die on running it.
- **Discipline:** for any claim about behaviour, execute the path or read the
  implementation to its end. A declared parameter that is never transmitted is
  a common, silent instance.

## Before a finding leaves your desk

Applies per finding, not per review.

1. **Name the evidence.** File and line, or a command and its output. A finding
   whose evidence cannot be named is not ready.
2. **Check the bound.** Was any input to this conclusion truncated, paged,
   filtered, or defaulted? If yes, re-read unbounded.
3. **State the reachability.** Is the defect *demonstrated*, or *latent* — real
   in principle but unreachable in the current code? Say which. "Latent" is an
   honest and useful verdict; silently implying "live" is not.
4. **Try to kill it.** Argue the author's side. The strongest counter-argument
   belongs in the finding, answered.
5. **Refute HIGH findings independently.** Any finding at the severity that
   blocks a merge must be put to a separate reviewer or a separate pass whose
   explicit brief is to disprove it — **before** the handback, never after.
   A refutation that arrives after the verdict has already cost the author a
   cycle.

## Severity honesty

Severity is a claim about consequence, not about how interesting the finding is.

- **Blocking** — a plausible execution produces a wrong result, data loss, or a
  security failure. Must be demonstrated or shown reachable.
- **Non-blocking** — real, but the consequence is bounded or the path is latent.
- **Advisory / nitpick** — taste, convention, or future-proofing. Must be
  labelled so the author may decline it without argument.

Label non-blocking items explicitly, in the Conventional Comments sense
(`nitpick:`, `suggestion:`, `question:`, `thought:`). An unlabelled comment in a
review reads as a demand.

Adapted from Google's standard of review: **approve once the change definitely
improves overall code health, even if it is not perfect.** A reviewer may not
hold a change hostage to a better change that does not exist.

## Review budget

From the SmartBear/Cisco study — beyond these bounds, defect detection collapses
and the review becomes theatre:

| Bound | Value |
|---|---|
| Lines per sitting | 200–400 |
| Session length | 60–90 minutes |

A review larger than this is not a review. Split it, or say plainly which parts
received attention and which did not.

## Withdrawing a finding

When a finding turns out to be wrong, withdrawal is the work, not the
embarrassment.

1. Withdraw it **explicitly and by identifier**. Never let it quietly vanish in
   a later revision.
2. State **what the actual evidence was** and which failure mode above produced
   the error.
3. **Re-derive the verdict.** If the withdrawn finding was blocking, the verdict
   changes; say so in the same message, not a later one.
4. Leave the surviving findings **strengthened** with the evidence the
   refutation surfaced.

A review that corrects itself before the author acts is worth more than one that
was never wrong, because it tells the author which findings were tested.

## Anti-patterns

- Reporting a count from a paged or truncated view.
- "There is no test for this" without having read the whole test file.
- Quoting a rule that does not cover the case without interpolation.
- Inflating severity to force attention.
- Adding findings to justify the time spent reviewing.
- Running the refutation pass *after* returning the verdict.
- Treating a tool's negative result as fact without checking what it targeted.
