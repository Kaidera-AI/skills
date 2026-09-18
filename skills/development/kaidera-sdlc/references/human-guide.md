# The human's guide to kaidera-sdlc

For the people on a Kaidera project: founders, developers, product owners, and anyone who will
receive work from the agents or work beside them in the same repository. It says why the skill
exists, what the standard process is, what is expected of the team, what will land on your desk
and when, how to set up a project, and how humans and agents share a repository. The skill files
carry the depth; this guide carries the why and the how-to.

## 1. Why this skill exists

Models write code faster than people can read it. Without a method, that speed produces work
that nobody can verify, review or roll back, and the humans end up reading every diff at
midnight. The skill fixes the method, not the model: every piece of work, from a two-line fix to a
six-wave epic, walks the same loop, leaves the same artifacts, and stops at the same gates.

```
INTENT -> GRILL -> SPEC -> PLAN -> BUILD <-> VERIFY -> REVIEW -> SHIP -> MAINTAIN
```

Three beliefs behind it: verification is output that can fail, not a sentence that says "tested";
review is a separate agent's job and the author never approves; a human owns every judgement that
cannot be undone. The loop is the same for any harness and any model; the skill is plain files.

## 2. The standard process, in one page

1. **Intent.** Someone states what should be different and why. One paragraph is enough. It
   lives next to the work, not in chat (`templates/intent.md`).
2. **Grill.** The lead asks one question at a time until there is shared understanding. Risky
   work (destructive, security, money, customer data, migrations, folds, cross-project) gets the
   full grill and a human's plan approval.
3. **Spec and plan.** What "done" means, then the files that change, the order of work, the risks
   and the proof, written so someone unfamiliar could execute it. Nothing is built before the plan
   is accepted.
4. **Build.** In a worktree of its own, to the code-quality rules, one concern per commit, the
   plan updated in the same commit if the work departs from it.
5. **Verify.** A command that exits non-zero on failure; before-and-after evidence where behaviour
   changed; the literal output in the return.
6. **Review.** A reviewer agent who did not write it checks the change at one fixed commit:
   the automated checks first, then a reading of the code, then a second reviewer where the
   project has one. The results go into one report, and the author and reviewer settle the
   findings in a bounded number of rounds. The lead rules on whatever stays open.
7. **Ship.** The integration custodian (the agent that owns the shared branch) folds the change
   into it and reruns the checks on the merged commit. Then the human tests the running thing at
   that commit, reads the gate packet, and gives or withholds the go. The go is written down as
   a gate record, bound to the commit it covers.
8. **Maintain.** Incidents become intent and evals; a repeated mistake becomes a dated rule.

## 3. What is expected of the team

**Of every agent and every human doing work**
- Claim before you start; look for other people's in-flight work before the first edit; build in
  your own worktree and never touch anyone else's (`references/team.md`).
- Paste receipts, not adjectives: the command and its output, the artifact's identity at its
  destination, the before and the after (`references/evidence.md`).
- Say plainly what you did not do and why. A named refusal with a reason is welcome; a silent
  skip is a defect.
- Write for the reader: outcome first, exact identifiers, no filler (`references/writing.md`).
- When blocked, send options; never a self-granted workaround.

**Of the lead**
- Plan, grill, dispatch with a receipt per step, adjudicate every return, integrate accepted
  work, keep the records. Do not execute delivery steps.
- Keep the human's queue short and complete: only finished gate packets reach a person.

**Of the reviewer**
- Freeze the target, account for every path, refute your own material findings, close fixes at a
  new commit, never merge (`references/code-review.md`).

**Of the human at the gate**
- Test the running thing, read the packet, decide; answer within the stated turnaround or say
  when; the decision is recorded with the date.

## 4. What lands on your desk, and when

You will receive a **gate packet** (`references/human-gates.md`): one sentence asking for one
decision; where the running thing is deployed so you can try it; the before-and-after evidence;
the review verdict with counts and limits; the record that will be written; the rollback; and
what you are not being asked. Expect one at these moments: a priority or product-boundary call;
a risky plan needs approval; a change is ready for release, publishing or promotion to main; an
irreversible step is proposed; a rule exception is asked for. Routine intent is approved and
routed by the lead's product role, and the fold into the shared branch is the custodian's; those
do not come to you. What else you receive on a schedule (a weekly gate summary, review-service
numbers) is a project decision, recorded where the project keeps its cadence; the agents handle
everything that is not a gate.

## 5. Setting up a project

1. **The repository.** Keep the workflow, not repository facts, in the pointer the agents read on
   boot (`AGENTS.md` and its per-harness symlinks). Facts belong in the code and the docs.
2. **The skills.** Install the harness-agnostic way, never a vendor plugin: the `skills` CLI with
   the universal agent target and a copy into the tree, pinned in the lockfile (the exact command
   is in `references/distribution.md`). Install `gavel` for the lead and the review skill for the
   reviewer the same way. Register them in the coordination store and bind them to roles.
3. **The roster.** One lead; workers per lane; where the roster allows, one reviewer agent whose
   only lane is review. Who holds a role is a dated decision, never a line in a file.
4. **The rules.** Ingest the project's standing rules as boot rules: no baked model, the cloud and
   credential rules your organisation has adopted, plan-and-execute, harness-agnostic tools.
5. **Credentials.** By name from the environment or a `.env` that never enters git; agents reach
   cloud APIs with keys, never a human sign-in session.
6. **The review.** At minimum, a reviewer who is not the author and the fixed-commit rounds in
   `references/code-review.md`. A shared review service (automated first stage, second reviewer,
   merged report) is added when the project has one; until then the reviewer does the reading and
   says what it could not run.
7. **The first loop.** Run one small change through all eight steps before parallel work starts.
   The first gate packet you receive tells you whether the setup is right.

## 6. Working day to day with the skill

- Start work with a claim and a plan, not a prompt. If you are the human doing the work, you
  follow the same rules as an agent and your work is reviewed the same way.
- Ask the lead for a ruling when a plan needs one; do not negotiate rulings between workers.
- Return work as a completion handback: the tip you worked on, the receipts, what is not done.
- Answer each of your reviewer's findings with a disposition (fixed, disputed with evidence, or
  deferred with a reason), not with an argument in chat; at the round cap the lead rules.
- When something recurs, propose the rule, the test or the pattern rule that would have caught
  it. Mistake twice, rule once.

## 7. Humans and agents in the same repository

- Each task gets its own branch and its own working copy, for people as for agents. Editing,
  resetting or cleaning somebody else's working copy is off limits.
- The scope check before the first edit is the same for people (`references/team.md` section 2).
- A worktree does not isolate ports, databases, container engines or the coordination store.
  Confirm the process behind a port is yours; never reset a shared database; stop the API before
  a reload and announce it.
- Push only your own task branch; the integration branch is pushed by the custodian inside the
  loop; `--force-with-lease` on your branch only; never rewrite the integration branch.
- Lockfile conflicts are regenerated, not hand-merged.
- If your team uses pull requests, the review packet and the gate record are attached to the
  pull request; if it uses handoffs, they travel in the handback. The loop is the same.

## 8. Questions people ask

- *Do I have to read the diff?* No. Test the running thing and read the packet. If those are not
  enough to decide, the packet is wrong, and the lead fixes it. You may read the diff if you want
  to; the process does not depend on it.
- *Can I skip the grill for something small?* The quick grill is a minute. Risk, not size, decides
  when the full grill applies.
- *What if the agents disagree with each other?* The author answers each finding with evidence,
  the lead adjudicates what stays open, and you see only what the lead could not settle.
- *What if I want a change the rules forbid?* Ask for an exception as a dated decision with a
  reopening trigger. Rules are dated decisions, not dogma.
- *Where do I see progress?* The project's progress file carries an exact checklist of what is
  done and what is not; gate records say what was released and when.

## 9. Words the agents use

- **Claim**: taking a task in the coordination store before touching it, so two workers never do
  the same thing.
- **Handback**: the return of finished work, with the commit it was done on and the receipts.
- **Lane**: one area of the product that one worker owns at a time.
- **Working copy, worktree**: a separate checkout of the repository for one task.
- **Frozen change**: the exact commit the reviewer looks at; a fix means a new commit and a new
  look.
- **Automated checks**: the tests, linters and type checks that run without judgement and
  exit non-zero when something is wrong.
- **Fold**: merging an accepted change into the shared integration branch.
- **Integration custodian**: the agent that owns the shared branch and does the folds.
- **Gate**: a checkpoint that leaves a record; the human gates are release, publishing and
  promotion to main, irreversible steps, risky plans and rule exceptions. **Gate record**: the
  written decision, bound to a commit.
- **Boot rules**: the standing rules every agent reads when it starts.
- **Lockfile**: the file that pins exact versions of what the project installs.
