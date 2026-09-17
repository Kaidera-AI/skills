# Review instructions

Apply to every change the same way, whoever wrote it. The author never approves; the
reviewer never merges (`references/governance.md`, "Separation of duties").

A project or release folder may instantiate this file (for example
`Program/<release>/REVIEW.md`) to add its own passes and examples. An instance may add,
never remove or weaken; where an instance and this template disagree, this template wins
and the instance is regenerated (projection drift, "Report and ratify").

## Review record (the review is bound to a SHA, never to a branch name)
- reviewed_sha: <40-hex, the pre-fold tip that was reviewed>; range `<base_sha>..<reviewed_sha>`;
  branch; tree_sha. Anything committed after `reviewed_sha` is unreviewed, and the
  adjudicator diffs against `reviewed_sha` before answering a single finding.
- scope: the pathspecs reviewed. A path in the diff the commit message does not explain is a
  finding (THE_WAY §10.2).
- attempted: every command run to break the change, each with `rc=` and the sha256 of its
  output. A review with zero findings still needs this receipt: "no findings" without
  evidence of what was attempted is not a review (THE_WAY §11.1 step 2).
- gate record: `Program/<release>/gates/review-<decision_id>.json` written by the reviewer
  (`kaidera-sdlc.gate-record.v1`); its `findings_count` matches the findings below. This
  block copies the record and the record wins on any disagreement:
  - decision_id: <uuid4>
  - authorizer: <identity of the reviewer, equal to the record's `separation.reviewer`>
    · role: reviewer
  - timestamp: <ISO-8601 UTC, when the record was sealed>
  - occupancy: the `cortex-search "role-occupancy <project-key> reviewer" --type decisions`
    receipt (`references/governance.md`, "Role occupancy records").

## Passes
Run four passes and tag each finding with its pass:
- **Bugs**: logic errors, broken edge cases, subtle regressions, silent failure paths.
- **Security**: injection, auth gaps, secrets in diffs or logs, PII exposure, trust boundaries.
- **Compliance**: the change matches the spec, the plan, the rulings in force (architecture
  rule, editions, one owner per fact) and the SOPs (change isolation, immutable migrations,
  destructive-op checklist, separation of duties).
- **Structure**: policy reached from plumbing, operational logic duplicated, sharing ahead of
  the rule of three, a baked model id or a defaulted host, path or key, a failure dropped
  (`references/code-quality.md` section 6).

## Rounds
A review is a loop with a cap, not an open conversation. The cap is a dated decision recorded in
the plan (default three rounds, 2026-09-18; the adjudicator may set another number for a change
and says why). Rules:
- Each round is a new review record bound to the new `reviewed_sha` (`references/governance.md`,
  "Gate records": a correction is a new record pointing at the one it supersedes). Commits
  made after a `reviewed_sha` are unreviewed until the next round covers them.
- For every finding the author **proposes** a disposition: fixed, disputed (with the reason),
  informational, or deferral proposed (with an owner). A proposal closes nothing.
- Only the reviewer closes a finding as fixed, by re-reviewing at the new SHA. Disputed,
  informational and deferred findings stay open until the adjudicator rules at gate 5.
- At the cap the author stops pushing fixes. The open findings go to the adjudicator as a list
  with `file:line`; fixes made in the final round are named hunk by hunk in the adjudication.
- The closing report is one table: rounds run, findings closed by the reviewer, findings ruled
  by the adjudicator (accepted, reworked, withdrawn), findings still open.
The reviewer's verdict words (CONFIRMED, REFUTED, REWORK) and the adjudicator's are unchanged;
rounds change the tempo of review, not who decides.

## Verdicts
Every finding carries a verdict with evidence: CONFIRMED (reproduced, command and output),
REFUTED (why the claim does not hold), or REWORK (what must change and the test that proves
it). A finding without evidence is a question, not a finding.

## What Important means
Reserve Important for findings that would break behaviour, lose or leak data, or breach a
policy. Style and naming are nits.

## Cap the nits
Report at most five nits; summarise the rest as a count.

## Do not report (noise only)
Generated output with no policy or behavioural consequence: a regenerated bundle whose source
change is in the same commit, rebuilds to the same hash and moves no pin, hash or baseline;
vendored code that did not change; an item a fitness test or CI already enforces and has run
on the reviewed tree with its receipt attached. Precedence: "Report and ratify" wins whenever
an item moves a hash, pin or baseline; listing an item for ratification is not a finding.

## Report and ratify (never excluded as "generated")
Every updated hash, pin, receipt, baseline or regenerated artifact is listed as its own item
with a verdict, ratify or refuse, and the evidence for it:
- projection drift: a public or generated copy says less than, or differs from, the
  canonical source it claims to project (controls dropped, templates reduced, a rule's
  wording weakened);
- unsafe re-pins: a version, image, hash or baseline moved without the receipt that
  justifies it;
- regeneration whose source change is absent, or that carries an unrelated edit;
- any regeneration, re-baseline or ratification the plan or a ruling requires.
A refused item blocks adjudication until it is reverted or justified.

## Feed back
Each policy finding names the rule, skill or test that should have caught it. Second
occurrence of the same finding: the rule changes, not the reviewer's patience.
