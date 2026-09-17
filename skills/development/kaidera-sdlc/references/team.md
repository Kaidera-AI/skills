# Working as a team

`SKILL.md` describes what happens to one piece of work. This file describes how several agents
work at once without damaging each other's work. The project's own operating procedure owns
the exact contract (for Kaidera OS: `docs/SOP_PLAN_AND_EXECUTE.md`, which wins wherever this
summary differs); the rules below are the portable part. Credits are in `references/attribution.md`.

## 1. Roles come from the occupancy record

Originator, lead, worker, reviewer, adjudicator, integration custodian and release authority
are roles, and who holds each is a Cortex role occupancy record, never a line in this file
(`governance.md`, "Separation of duties"). Where the record in force says the lead also holds
adjudication and custody (Kaidera OS today, THE_WAY §16), the lead plans, rules on returns and
folds accepted work; where it does not, those are three identities. In every case:

- the lead plans and dispatches and does not execute delivery steps;
- workers execute inside their roster lane and hand back receipts; they do not fold their own
  work, rule on it, or pass a gate;
- gates are requested by agents and passed by the release authority, a human.

## 2. Before the first edit: find out who else is there

Run this and paste the output, with each exit code, into the plan's pre-edit evidence
(`templates/plan.md`). `SINCE` is the date of the integration commit you branched from, or
fourteen days ago, whichever is earlier. Never shorten the listing: count it, then read all of it
(THE_WAY §14.2b).

```
set -o pipefail
SCRATCH=$(mktemp -d)          # outside the repository
git worktree list
git for-each-ref --format='%(committerdate:short) %(refname:short)' refs/heads refs/remotes \
  | awk -v since="$SINCE" '$1 >= since' | sort -r > "$SCRATCH/refs.txt"; echo "rc=$?"
wc -l < "$SCRATCH/refs.txt"
while read -r _ ref; do
  out=$(git diff --name-only "<integration-branch>...$ref" -- <your declared pathspecs> 2>&1) \
    || { echo "UNCHECKED: $ref ($out)"; continue; }
  [ -n "$out" ] && echo "$out" | sed "s|^|$ref: |"
done < "$SCRATCH/refs.txt"
git -C <shared checkout> status --porcelain; echo "rc=$?"
```

The loop prints every recently touched branch that changes a path you declared, and marks as
`UNCHECKED` any ref git could not compare (no merge base, for example); an unchecked ref is
looked at by hand. Local and remote copies of one branch both appear, which is expected. In the
plan, paste the worktree list, the count, and the loop output; cite `refs.txt` by its sha256
instead of pasting a long list. The last line is run for any
checkout more than one agent can write to. A forge listing (`gh pr list`, `glab mr list`) is an
optional extra where the project uses one. Pending handoffs in other lanes are invisible to a
worker, so the lead checks those at dispatch. If someone else's in-flight work touches your declared paths,
stop and send the lead a consult that names the overlap. Do not negotiate it between workers.

## 3. Keeping out of each other's way

1. **A tree has one owner** (THE_WAY §9). Do not edit, clean, reset, restore or commit in a
   tree you do not own. File times you did not cause mean someone else is there: stop.
2. **A worktree separates files and nothing else.** Listening ports, databases, the container
   engine, the coordination store and package caches are shared by every tree on the machine.
   Before believing what a port serves, find the process behind it and read its command line.
   Reloading or resetting a shared database is its owner's job alone, with the API stopped, a
   backup taken first and a human line (SOP section 7). Kaidera OS learned this on 2026-09-17:
   handoffs written during the repair window were lost
   (`Program/KAI_ADJUDICATION_2026-09-18.md` section 4).
3. **Build the environment inside the tree.** Virtualenvs and `node_modules` are per tree.
   Record the runtime version you ran with in the pre-edit evidence.
4. **One mutation per command, output shown** (non-negotiable 12, THE_WAY §14.2). Stage by
   pathspec, run `scripts/dev/verify-change-scope.sh`, commit with pathspecs, each as its own
   command with its exit code. Never hide a git command's errors.
5. **Pushing follows the register** (THE_WAY §11, §13.2). A worker pushes only their own task
   branch, and only where the project allows workers to push. The integration branch is pushed
   by the custodian inside the ship loop and its history is never rewritten. Rewriting your own
   pushed task branch uses `--force-with-lease`; a bare `--force` is never used.
6. **Conflicting lockfiles** are rebuilt by the package manager, not edited by hand.
7. **After the fold**, delete the task branch with `git branch -d`. Use `-D` only after showing
   that the tip is an ancestor of, or tree-equal to, the integration tip.

## 4. Dispatches and returns (portable summary; the project's SOP owns the contract)

A dispatch states, in this order: the goal in one sentence and the gate it feeds; the receipt
that proves each step; the order and what it waits on; what is not in scope; what to do when
blocked. It obeys the channel's form limits (for Cortex: ASCII, 4,000 code points, long
material in a committed file cited by path and SHA). One open dispatch per worker per lane.

Rulings and new work travel separately. A note that carries rulings asks for nothing; a work
dispatch carries a receipt per step. The measurement behind this is recorded in
`.agents/skills/gavel/references/calibration.md` (entry of 2026-09-18).

A return is a completion handback naming the tip that was worked on, with each receipt pasted
or cited by path and SHA, and a plain statement of what was not done and why. A step a worker
declines for a stated reason belongs in that statement, inside a completion that still carries
receipts for the steps that were done. If nothing could be done, the return is a consult with
options. An empty completion is a defect signal (THE_WAY §14.2b).

## 5. Instruments

Where the `gavel` skill is installed and a key is configured, the lead runs its dispatch check
before sending and its triage before ruling, and writes any disagreement, or any confidence
under 0.6, into the adjudication record. It sends the text it is given to a third-party
service, so nothing secret or customer-owned goes into it. Workers do not grade themselves
with it. Without it, the same checks are done by reading section 4 against the draft.

## 6. When the coordination channel is down

SOP section 7 owns this. In short: dispatches are written to files and filed when the channel
is healthy again; the person who must repair the channel gets their instructions through the
release authority; nobody repairs another lane's system to be helpful; writes made during a
repair window are checked by id before anyone relies on them.

## 7. Review in rounds

`templates/REVIEW.md`, "Rounds", owns the rule. For a team the point is tempo: a review that
never ends blocks a lane as surely as no review. Each round re-binds to a new SHA; the author
proposes dispositions and closes nothing; the reviewer closes fixes; the adjudicator rules on
the rest; at the cap the open list goes up instead of around again.
