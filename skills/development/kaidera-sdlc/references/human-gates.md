# Human gates: what reaches a person, and what the person decides

Agents act up to a gate and cannot pass it (non-negotiable 7). This file says what a gate looks
like from the human side: which decisions are the human's, what arrives, in what form, and how
to answer. It applies to the release authority (for Kaidera OS, the CTO by occupancy record) and
to any human a project names for a gate. It restates `governance.md` ("The gates", "What stays
human") from the human's side and adds nothing to what an agent may do. Sources: governance.md,
`docs/SOP_PLAN_AND_EXECUTE.md`, and the Software Factory talk's practice of merging on proof
(`attribution.md`).

## 1. The decisions that are a human's

| Gate | The human decides | Who does the rest |
|---|---|---|
| Priority and product boundary | whether the work is wanted now, and where the product's edges are; routine intent is approved and routed by the CPO or PM role (`stages.md` section 1) | lead, CPO, PM |
| Plan, for risky work | whether the grilled plan is the plan: destructive, security, money, customer-data, migration, fold and cross-project work always come to a human | routine plans: the lead |
| Release, publish, promotion to main or production | the go, after testing the running thing at `merged_sha` and reading the packet (`governance.md` gate 8) | the merge into the integration branch and the gate rerun on `merged_sha` are the integration custodian's, inside the loop (gate 6) |
| Irreversible steps | deletion, database reset, restore-over, public publishing, spend | never an agent's |
| Exceptions | any rule exception, as a dated decision with a reopening trigger | never an agent's |

Diagnosis, implementation, self-verification, review, adjudication of findings and the ordering
of routine work are the agents' (non-negotiable 8).

## 2. What arrives: the gate packet

A gate request is one message, in this order, and the human should not have to ask for more:

1. **The ask in one sentence**, with the gate named: "Go to release X" / "Approve the plan for Y" /
   "Authorise deleting Z".
2. **The running thing**: where it is deployed at `merged_sha` and how to reach it, so the human
   can test it (`governance.md` gate 8; THE_WAY §11.1 step 5). For a plan or an irreversible-step
   gate this item states "no deployment; decision on the plan".
3. **The evidence pair**: the before and the after (capture, numbers or the failing-then-passing
   test), with the commit, host or deployment they were taken on (`references/evidence.md`).
4. **The review verdict**: the combined report's verdict line, counts by severity and by source,
   what the reviewer could not run, and the readiness signal if the project uses one
   (`references/code-review.md`). Findings the adjudicator overruled, with the reason.
5. **The record**: the gate record that will be written, with the SHAs it binds
   (`governance.md`, "Gate records"), as the gate requires: `reviewed_sha` and `adjudicated_sha`
   for a change, `merged_sha` for release and go, none for a plan or an irreversible step.
6. **The rollback**: what happens and how long it takes if the human says yes and it is wrong.
7. **What the human is not being asked**: the scope boundary, so a yes cannot be stretched.

A packet missing any of these goes back to the lead; the human does not fill the gaps.

## 3. How the human answers

- **Go**: a yes with the date. The lead files the gate record with the human as its authorizer
  (`governance.md`; the checker requires a human authorizer on release and go).
- **Go with conditions**: named conditions become receipts the lead must return before the
  next gate.
- **No, or not yet**: with the reason; the reason becomes a finding or a rule.
- **Question**: one question at a time, answered by the lead with evidence, not prose.
The answer is recorded as a dated decision. Silence is not a go, and an agent never infers one.

## 4. Expectations in both directions

- The team sends a packet only when it is complete, and batches gate requests so a human sees a
  short queue, not a stream. The lead states the turnaround the work needs; "urgent" carries the
  reason.
- The human answers within the stated turnaround or says when they will; an unanswered gate
  stalls a lane, and the lead lists stalled gates in the project's next gate summary (for Kaidera
  OS the weekly review-service report, CTO 2026-09-18; a team cadence is design 43 decision 5).
- The human decides on the running thing and the packet. Reading the code is the reviewer's job
  and the adjudicator's; a human who wants to read a diff may, and the loop does not depend on
  it (dated 2026-09-18, PLAN section 10 item 1; reopens if a gate is passed on a packet whose
  evidence later proves wrong). If the packet is not enough to decide, that is a defect in the
  packet, and the lead fixes the packet, not the human.
- A human may also be a worker in the same project: then they follow the worker rules
  (`references/team.md`) and never gate their own work.

## 5. The human gate at the review stage, precisely

When the reviewer's rounds end, the adjudicator rules on what the reviewer left open, the
custodian folds and reruns the gates on `merged_sha`, and the lead requests the human gate with
the packet above. The human tests the running thing at that commit and reads the verdict, the
evidence pair, the overruled findings and the record; then says go or not. In the Software
Factory talk the human enters when the reviewer reports its top score and merges on the proof;
here the same moment has a record around it and a running thing to test.
