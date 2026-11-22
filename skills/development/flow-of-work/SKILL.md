---
name: flow-of-work
description: "Use whenever a worker or lead must choose the next task, hand off work, or handle a blocker. Pull from one ordered list by priority and dependency; do not schedule ordinary tasks by time."
license: Apache-2.0
metadata:
  version: 0.5.0
  status: candidate
  updated: "2026-11-22"
  author: Kaidera-AI
  applies_to: [lead, project-manager, orchestrator, developer, devops, reviewer, security-reviewer, documentarian]
  authority: "The project's accepted work policy and lead-owned priority order."
  bias: "Dependencies and priority before dates; pull ready work; keep gates with their owners."
  risk_level: medium
  capabilities_required: [tool:file_read, tool:file_write]
  allowed_domains: []
  tags: [planning, priority, operations, coordination]
  attribution_author: Kaidera-AI
  attribution_notes: "Adapted from Kaidera's internal Flow of Work operating method; project-specific policy and incident records are excluded."
  safety_constraints:
    - "A task claim never grants authority for a public write, security-sensitive read, destructive action, or live-system change."
    - "Keep secrets and personal network addresses out of task records and memory entries."
    - "Do not send a message or modify a record outside the project's approved coordination system."
---


# Flow of work

A team of AI Workers is slow for one reason: people wait. They wait for a grant, a read, a ring, an answer, a machine, or for a time someone wrote in a message. This skill removes the waiting. It does not remove any gate: a public write, a security read, a spend or a signature keeps its own rule.

The project's operating guide holds its names and paths. This skill holds the portable method.

## The one list

Each product has **one ordered work list**, kept by its lead **with the helper** (the orchestrator). The lead owns the order: what comes first is the lead's decision. The helper keeps the list true: they confirm that each stated dependency is real and that no real one is missing, record what moved, and when the facts change propose a new order for the lead to confirm. The order is the priority: the top is the most important thing that can be done. Every item says:

- what is done when it is done (its receipt);
- who may take it: a **role** (builder, reviewer, security, documents, operations), and a name only when it truly must be one person;
- what it **needs**: the items that must be done first. Nothing else is a dependency.

An item carries **no time and no date**. A release has a date, and the planner keeps it. A task has a place in the order.

## The rule for every worker

1. **Pull.** When you are free, take the topmost item that is for your role, has every need done, and is not taken. Claim it, so that nobody else takes it. Start in the same turn. You do not wait for a ring, a grant or a go, unless the item itself is a gated action.
2. **One thing in hand.** You build one item at a time.
3. **Close only with durable proof and a project memory record, then wake the next.** A task is done only when both exist: (a) its evidence—the receipt, output or file—in the project's approved document home or sealed run folder, with the full path and SHA-256 named in the return; and (b) a memory entry in the project's approved work log or decision record describing what was done, what worked, what failed and why, and where the evidence lives. The memory records what the next worker needs, not a status diary. Never put a secret, key, or personal network address in it. The return names both the evidence and memory record (including its ID when available). If a task is blocked before both exist, return it as blocked and name the missing proof and who can unblock it; it is not done. After closing it, if another item becomes ready, alert that worker (or a free worker of the same role) in the same turn, then pull again.
4. **If you are blocked, you move.** Record what blocks the item and who can unblock it, notify that person once through the project's task tracker, and pull the next ready item at once. When the block clears, the higher item comes first again.
5. **Never idle, never silent.** If nothing on the list is ready for you, tell the lead through the project's task tracker. The lead must fix the ordering or provide ready work.
6. **Two items parked is the limit.** A third block means the list is cut badly. Stop starting, and tell the lead.

## Work that is ready ahead of its turn

A worker who is ahead does not slow down and does not wait. An item that is finished and read **before the things it must merge after** is put **on the shelf**: its pin, its base and its receipt are written on the list, with the one thing it waits for. The worker pulls their next item. The helper tracks the shelf and, when the awaited item lands, puts "merge it" at the top for whoever merges. If the base moved in the meantime, "re-check on the new base" is a small item before the merge. Nothing ready is lost, and nothing ready blocks its builder.

## Your queue is work

An open task that asks you to act is work in hand. While it is open and can be done, you are not idle and your turn is not over.

- **Work the queue through.** In one pass, reconcile stale records using the project's approved process, then take every actionable task in list order (or highest priority first where no ordered list exists), complete it, record the result, and take the next. Do not stop after one task to wait for another alert.
- **Every task ends in one of three ways:** done, with its receipt; **overtaken**, with one line naming what replaced it; or **parked**, with the blocker and who can unblock it. A task is never left open because it is old or awkward.
- **You stop only when** nothing that asks you to act is left open and doable. Tell your lead through the task tracker, then read ahead.

## Questions and consults: the route

When you have a question, or need a second opinion, and cannot answer it yourself from the files:

1. **Ask your team lead** through the project's task tracker and alert them so the question is seen. Do not ask the person at your terminal or a worker from another team.
2. **The lead answers**, or, if he cannot, **asks the program's lead** the same way.
3. **The program's lead answers**, or, if it is one of the things only the owner can decide (money, a signature, a credential, a public act, a change of what the product is), **takes it to the owner** and brings the answer back down the same route.

A question about a review goes to the reviewers' lead first. The route is the same for a consult, a doubt and a block.

- **Never put the question to your own screen.** A dialog that waits for a human at your terminal stops you, and nobody else may answer it. Record the question in the task tracker and take your next item.
- **A question is an item.** It sits on the list at the place of what it blocks, so the person who must answer sees it first.
- **Do not skip a step and do not stop at one.** A lead who cannot answer passes it up in the same turn; he does not hold it.
- **The answer returns through the task tracker** to the person who asked and is recorded where the next person will look (the list, plan, or decision record), so the same question is not asked twice.

## The rule for whatever blocks someone

**An item that blocks a higher item takes that item's place in the order.** A read that a top item waits for is the reader's first job. A question that a top item waits for is the lead's first job. This is how the top of the list keeps moving. Nobody unblocks low things while a high thing waits.

## The rule for reviewers and readers

Reads are items on the same list, pulled the same way, in the same order. One frozen pin per item. Findings come in one batch. A rework goes back to the top of the builder's order, because finishing comes before starting. A reader with nothing to read reads the design or the plan of the items now in work, so the next pin is built to what will be checked.

When accepting completed work, the reviewer names the project memory record read. If the accepted work establishes a procedure, the acceptance also names the file or path where that procedure was established.

## The rule for leads

1. **Cut for parallel work.** Split work where the dependencies are fewest. An interface or contract is its own item, frozen first, so that both sides build at once against it. Controls and tests are items that another worker can write while the product is written. A small item finishes in one sitting.
2. **Order, do not schedule.** Put the items in order. Do not write "by 20:00" on a task. If a time matters, it is a release date, and it is yours and the planner's.
3. **Keep three ahead.** Every worker must be able to see his next three items. An idle worker with nothing ready is a miss of the lead.
4. **Decide in advance.** Where a choice can be undone, name the default in the item and let the worker go on. Where it cannot be undone (a public write, a security matter, a spend, a deletion, a signature), the decision is its own item, at its place in the order, for whoever must decide.
5. **Decisions are items too.** A question to you sits on the list at the place of what it blocks. Answer in that order.

## The rule for shared things

A machine, a test lane or a build runner is a **queue, not a favour**. A worker's own run in his own folder enters by the admission tool, side by side with others up to the tool's limit. A run that uses a **shared tree** (one that another run's proof depends on) is taken one at a time by a lock inside the run's own command, in list order. Neither needs a person to grant each turn. The only stop is a declared quiet window, with a start and an end. While you wait for a turn, you work on the next item. This is about ordinary runs only: gated actions keep their gates (see the end).

## The rule for the orchestrator

The orchestrator looks at people and the list, never at a clock on a task. On each pass it finds:

- a free worker and a ready item for his role: it rings him with that item;
- an item parked on a person: it rings that person, top of the order first;
- a worker with nothing ready: it rings the lead;
- a done item not yet returned: it rings the worker to close it.

It also keeps the list true with the lead: it confirms dependencies, tracks the shelf, and proposes a new order when something changes (a block, a finding, a piece that came early). It reinforces the method: it names a worker who waits, a task left open, or a time written on a task to the worker and the lead. It never sets a priority itself: the lead confirms an order, and a decision stays with whoever owns it.

It reports the flow, not lateness: items closed, items in hand, items on the shelf, items parked and why, and who was idle.

## What does not change

Gates stay gates. Public writes, security-sensitive reads, destructive actions, and changes to live systems are never authorized by claiming a task; each follows the project's written approval policy. The task tracker is the record. Share each task only with the people who must act, the named reviewer, and the coordinator. A worker does not review their own work, type into another person's session, or answer a prompt meant for a human.

## Common failure patterns

- A worker finishes a check and waits for someone to hand over the next ready task. Pull the next eligible item as soon as the current one closes.
- Several workers depend on one person to grant ordinary access or machine turns. Put those resources behind an ordered queue and keep their separate approval gates.
- A worker waits for a read while the reader waits for a finished pin. The blocker takes the higher task's place; each worker continues with independent work.
- Two reviewers receive the same work, or a queue holds actionable tasks that are processed one alert at a time. Claim before starting and work the actionable queue through.
- Tasks carry deadlines that do not govern the release. Keep task order in the work list and dates in the release plan.
- A question dialog blocks the only person who can answer it. Route questions to the accountable lead through the project tracker, then continue with the next ready item.
- The work list becomes stale after a branch, finding, or worker turn changes. Refresh dependencies and notify the worker whose next item is now ready.
