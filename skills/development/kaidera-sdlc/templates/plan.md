# Plan: <short name> (from spec `<path>`, record `spec-<decision_id>.json`)

Owner: <agent@project>. Handoff: <id>, claimed <ISO-8601 UTC> (claim is start-of-work).
Worktree: <path or branch>.

## Status (a pointer to the gate record, never an assertion)
Status: draft | accepted | amended <date> | superseded by <path>. "Accepted" is true only
while a `plan` gate record says so (`references/governance.md`, "Gate records"). This block
copies the record; the record wins on any disagreement. A change to a ruling needs the
release authority as authorizer.
- gate record: `Program/<release>/gates/plan-<decision_id>.json`
- decision_id: <uuid4>
- reviewed_sha: <40-hex commit whose tree holds this plan as accepted; null means accepted
  but not byte-bound, and this line says why> · tree_sha: <its tree, or null>
- artifact-in-tree receipt: `git cat-file -e <reviewed_sha>:<this path>` rc=0, listed in the
  record's receipts (a plan record needs at least one receipt; the checker does not verify
  the file is in the tree, the authorizer does)
- authorizer: <identity> · role: reviewer | release-authority
- timestamp: <ISO-8601 UTC>

## Pre-edit evidence (pasted before the first change; THE_WAY §9, §10, §14.1)
- Worktree ownership: the `git worktree list` line for this tree and, if the tree is dirty,
  `scripts/fitness/check-worktree-ownership.sh` output with `rc=`.
- Clean tree: `git status --porcelain` output (empty) with `rc=`.
- Declared scope: the pathspecs this change may touch, listed here before the first edit.
- Scope check: the commands of `references/team.md` section 2, in full (worktree list, the
  counted and untruncated list of recent refs, the per-branch `git diff --name-only` loop over
  your declared paths, status of shared checkouts), output and `rc=` pasted; an overlap means
  stop and consult the lead.
- Scope receipt, per commit: `scripts/dev/verify-change-scope.sh <declared paths>` run after
  staging and before committing, output and `rc=` pasted; exit 2 is not a pass.
- Live siblings, before any restore, clean or reset: `find <tree> -newermt '-2 hours' -type f`
  on tracked paths, output pasted; fresh mtimes you did not make mean stop.

## Files that change
One line per file: path, new or modified, why.

## Order of work
1. Step, with the check that proves it before the next step starts.
2. ...

## Daily release slices (release work; `references/stages.md`, "Release system")

Recorded local timezone: <timezone>. Daily cut: 18:00. Active/paused product decisions:
<product, status, dated authority>. Each slice can ship within one day; split larger work
before BUILD. Dependencies name an owner and gate, not an assumed availability time.

| Cut date / product / releasing version | Daily slice and owner | Dependency gate | Acceptance receipt | State / blocker / next owner |
|---|---|---|---|---|
| <date / product / version> | <small deliverable / owner> | <gate or none> | <command/output identity> | <state with receipt> |

## Platform matrix (release work)

Shared source commit: <one full SHA>. Product version: <one version>.
Shared signed manifest: <path and final SHA-256 when available; pending signing gate otherwise>.

| Host platform | Artifact / CI build route | Thin adapter / test surface | Prerequisites / image platform | Native full Gate target / receipts | Signing / final-byte inventory |
|---|---|---|---|---|---|
| Linux x86_64 | <artifact and route> | <systemd / paths / native rootless> | <accepted dependencies / linux/amd64> | <fresh Rocky target / run> | <manifest identity> |
| macOS arm64 | <artifact and route> | <launchd / paths / Podman machine> | <accepted dependencies / linux/arm64> | <approved Mac target / run> | <Apple sign/notarize/staple, then manifest identity> |

Named CTO exception, if any: <decision/product/version/missing platform/reason/recovery date,
or none>. Next day's FIRST slice closes that gap. A missing row/receipt is pending, not green.
Cortex image releases record both linux/amd64 and linux/arm64 digests from the same source.

Gate RED collection/diagnostic dependencies: <receipt location and safe continuation boundaries>.
Fix class: <docs/host byte-preservation proof or PRODUCT impact + pre-rebuild CTO decision>.
Signing turn: <gate and owner; command shown only when CTO is up>.
Quick-glance update: <PRODUCTS_PROGRESS.md units/denominator, version and evidence links>.

## Waves (multi-agent work only)
Wave, owner, handoff, what it delivers, what it depends on. Waves map to Cortex epic increments.

## Consumer suites (shared interfaces only; THE_WAY §14.2b rule 12)
If any file in scope is a shared interface (a port, adapter or client signature, a schema or
migration, a CLI or API contract, a generated pointer, a skill bound to other roles): list
every consumer surface here and paste, under Proof, the FULL suite receipt of each on the
final tree, never a `-k` filter. Otherwise write "no shared interface: <why>".

## Risks
The riskiest step and why; what could break; the blast radius; what is irreversible.

## Proof
The commands, tests, screenshots or receipts that show the plan worked, with expected output,
run on the final tree. Removal or fold work adds the symbol-loss scan on the merged tree
(every deleted definition grepped for surviving references) and the applied-migration
immutability check (`references/grill.md`, forcing question 13).

## Amendments
Dated. When the implementation departs from the plan, the amendment lands in the same commit;
if the accepted scope or proof changed, a new `plan` gate record supersedes the old one.
