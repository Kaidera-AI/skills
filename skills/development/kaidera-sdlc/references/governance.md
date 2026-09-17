# Governance: what stays human, and the gates that make autonomy safe

## What stays human

- Policy acceptance and ownership: security, licence, architecture rulings, editions.
- Approval: the plan for high-risk change, the merge to canonical, the release, the publish.
- Incident triage: fix now, schedule, dismiss with reason.
- Taste: product scope, UX, naming, messaging.
- Escalations: flagged policy conflicts, repeat incidents, cross-project boundaries.

## What agents own

- Diagnosis and read-only investigation; drafting intent, spec and plan; implementation once
  the plan is accepted; self-verification inside the feedback loop; uniform review passes;
  drafting lessons, evals and rule updates; preparing the release up to the gate.

## The gates, in the order a change meets them

Every gate leaves an append-only gate record (below); the record, not the prose in an
artifact, is what "accepted", "reviewed" or "merged" means.

1. **Claim before edit.** A handoff is claimed before the first change; a 409 on claim is a
   live-sibling alarm, not a retry.
2. **Plan accepted** by the lead; the release authority for anything that changes a ruling.
   The pre-edit evidence (worktree ownership, clean tree, declared scope) is pasted into the
   plan first (`templates/plan.md`). Record: `plan-<decision_id>.json`, carrying the commit
   that holds the accepted plan as `reviewed_sha` ("What binds an acceptance to bytes").
3. **Verification on the final tree** with pasted output. No return without it.
4. **Adversarial review** by the reviewer, a different agent than the author, bound to a
   pre-fold `reviewed_sha`; verdicts with evidence; "no findings" carries the receipt of what
   was attempted. Record: `review-<decision_id>.json`.
5. **Adjudication** by the adjudicator against `reviewed_sha`: diff
   `reviewed_sha..adjudicated_sha` first, answer every finding against the tip that was
   reviewed; re-pins, re-baselines and re-generated artifacts are ratified explicitly, never
   slipped in. Record: `adjudication-<decision_id>.json`.
6. **Merge, then rerun the gates on `merged_sha`.** The integration custodian folds; gates
   read HEAD, so a pre-merge green proves nothing about the merged tree (THE_WAY §11.1 step
   4). Removal or fold work adds the symbol-loss scan and the full consumer suites here.
   Record: `merge-<decision_id>.json`, carrying the receipt of the rerun on `merged_sha`:
   the real gate suite (`scripts/fitness/run.sh` at `merged_sha`, plus every consumer suite
   the plan names), never a stand-in command that merely mentions the SHA.
7. **Real-engine proof** on a fresh host for anything that ships as an appliance or a
   service. A warm host is a different product.
8. **The go.** The release authority (human) tests the running thing at `merged_sha`, then
   authorises merge to main, deploy, publish, release. The agent prepares and stops.
   Records: `release-<decision_id>.json`, `go-<decision_id>.json`; both are stale the
   moment `merged_sha` is no longer the head of the target branch.
9. **Rollback rehearsed** before it is needed; the restore path proven by destroying.

## Gate records

The contract, verbatim from the rework brief of 2026-09-04 except that the example
identities are generalised (no current occupant is an example). It has one owner (this
text); the templates and any checker implement it exactly and add nothing to it.

> A gate record is an append-only JSON file at
> Program/<release folder>/gates/<gate>-<decision_id>.json with schema
> "kaidera-sdlc.gate-record.v1" and fields: schema, gate (one of
> intent|spec|plan|review|adjudication|merge|release|go), decision_id (uuid4), authorizer
> (identity string of the form <worker>@<project-key> or human:<handle>), role (one of
> reviewer|adjudicator|integration-custodian|release-authority|originator), timestamp
> (ISO-8601 UTC), reviewed_sha, adjudicated_sha, merged_sha (each a full 40-hex commit sha or
> null when not applicable to that gate; review requires reviewed_sha; adjudication requires
> reviewed_sha and adjudicated_sha; merge requires all three; release/go require merged_sha),
> tree_sha (the tree of the last non-null sha), scope (non-empty list of pathspecs), receipts
> (list of {command, exit_code, output_sha256}; a merge record must include a receipt whose
> command reran the gates on merged_sha), findings_count (integer; a review with zero
> findings still needs a receipt), separation (object {reviewer, adjudicator, custodian}
> identities; reviewer must differ from adjudicator and custodian), previous_record_sha256
> (sha256 of the previous record file in the same folder, or null for the first) and
> record_sha256 (sha256 of the canonical JSON of all other fields). Records are never edited:
> a correction is a new record whose previous_record_sha256 points at the superseded one.
> Freshness: a merge/release/go record is stale when merged_sha is not the current head of
> its target branch.

How the artifacts use it: `intent.md`, `spec.md`, `plan.md` and `REVIEW.md` carry a status
block that copies the record's decision_id, SHAs, authorizer, role and timestamp and points
at the file. The block is a pointer; the record wins on any disagreement. Freshness is
checked with `git rev-parse <target-branch>` against `merged_sha` before anyone tests or
gives the go.

### What binds an acceptance to bytes (stated limits, 2026-09-04)

- Review, adjudication, merge, release and go: the contract requires the SHAs and
  `evals/gatecheck.py` refuses a record without them. These records are byte-bound by
  construction.
- Intent, spec and plan: the contract leaves `reviewed_sha` optional ("null when not
  applicable to that gate") and the checker accepts null. The templates ask for it anyway:
  `reviewed_sha` = the commit whose tree holds the artifact as accepted, `tree_sha` = its
  tree. An acceptance that carries them is bound to those bytes. An acceptance sealed with
  `reviewed_sha: null` is immutable and attributable but not byte-bound; the artifact's
  status block says "not byte-bound" and why, and any edit to that artifact after the
  timestamp is unaccepted content until a new record supersedes the old one.
- No check verifies that the accepted artifact exists in the named tree. The authorizer runs
  `git cat-file -e <reviewed_sha>:<path>` and lists it among the record's receipts; the
  reviewer reads that receipt.
- Reopening trigger: an acceptance disputed because the artifact changed after sealing, or a
  checker that enforces the SHA for the acceptance gates (then this section shrinks).

### The merge receipt

The merge record's rerun receipt is the real gate suite: `scripts/fitness/run.sh` at
`merged_sha`, plus every consumer suite the plan names (THE_WAY §14.2b rule 12) and, for
removal or fold work, the symbol-loss scan. `gatecheck.py` verifies only that some receipt's
command names `merged_sha` and exited 0; whether that command was the suite is read from the
command text by the adjudicator and the release authority, not derived by the checker.

## Deterministic enforcement (skills advise; these enforce)

- Cortex rules injected at boot for policy that must hold without exception.
- Fitness tests that pin contracts (the appliance spec, the current-state ledger, the
  reviewed-source hashes, the migration list) and fail when the effect is missing.
- Guards with full output: `safe-restore.sh`, `verify-change-scope.sh`, the destructive-op
  checklist (THE_WAY §14).
- Branch protection: agents produce PRs and fold branches; nothing lands on main directly.
- Managed permissions where the harness supports them: deny reads of secrets and `.env*`,
  deny arbitrary network egress, allow the safe inner loop (git, build, test, lint),
  sandbox with fail-if-unavailable, hooks and MCP servers from the approved list only,
  minimum harness version. In KOS this is the harness contract per lane; in client
  projects it is the platform's managed settings.

## Separation of duties

Roles in this skill are portable: originator, lead, reviewer, adjudicator, integration
custodian, release authority. The release authority is a human, never an agent; which human
is a role occupancy record like any other (for Kaidera OS: the CTO). A project with no
occupancy record for the release authority has no release authority and cannot pass gate 8.
The agent that wrote the code has no approval route. The reviewer never merges and must
differ from both the adjudicator and the custodian. The adjudicator and the integration
custodian may be the same identity only when the occupancy record in force says so
(`coincides-with`) and the gate record's `separation` object names that identity for both;
absent such a record they must differ. The identity that merges does not authorise the
release. In a two-agent project the human is the third party; in a one-agent project the
human is both reviewer and gate, and the plan and evidence artifacts are what make that
review possible.

## Role occupancy records

Who holds a role today is never a line in this skill, in THE_WAY, in a release folder or in
a design document. It is a Cortex decision record with this shape, one per role per project,
logged by the lead or the release authority:

```
cortex-log <lead> decision "role-occupancy <project-key>: role=<reviewer|adjudicator|integration-custodian|release-authority> occupant=<identity> authorised-by=<identity> from=<YYYY-MM-DD> until=<YYYY-MM-DD or 'the next release go'> coincides-with=<role or none> reopen=<trigger>"
```

- Lookup: `cortex-search "role-occupancy <project-key> <role>" --type decisions`. The newest
  record for a role is in force; a record past `until` is not; a role with no record in
  force is unoccupied, and the loop fails closed (no reviewer, no review; no release
  authority, no go). Expiry is short (a release, a quarter, a named handoff); a renewal is a
  new record.
- A document that names a person for a role (THE_WAY §9.1 rule 6, a release plan's owner
  line, design 31 §3) cites a dated decision (THE_WAY §13); it does not assign the role.
  When such a line disagrees with the record in force, the record wins and the line is
  corrected.
- What reads it: no checker does. `evals/gatecheck.py` validates the gate record's
  `separation` object for distinctness only. So every review, adjudication and merge record
  carries the lookup as a receipt (`command: cortex-search "role-occupancy <project-key>
  <role>" --type decisions`, its exit code and output hash), and a coincidence of adjudicator
  and custodian is valid only when that receipt exists and the record it found says
  `coincides-with`. The adjudicator and the release authority read the receipt; that is the
  stated limit until a checker reads Cortex.

## Audit trail

Every action leaves a timestamped record where it happened: git for artifacts and diffs,
gate records under `Program/<release>/gates/` for authorisations, Cortex for claims,
returns, decisions and lessons, the harness transcript for sessions, the channel for
incidents. Reports cite the record; they do not replace it.
