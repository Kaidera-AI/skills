# Intent: <short name>

Author: <originator, role>. Lead: <lead@project>. Source: <conversation, ticket, handoff id,
alert, scan finding>. Date: <YYYY-MM-DD>.

## Status (a pointer to the gate record, never an assertion)
Status: draft | accepted | superseded by <path>. "Accepted" is true only while an `intent`
gate record says so (`references/governance.md`, "Gate records"). This block copies the
record so a reader can check it; the record wins on any disagreement. Draft: leave the
fields empty. Superseded: the new record's `previous_record_sha256` points at this one.
- gate record: `Program/<release>/gates/intent-<decision_id>.json`
- decision_id: <uuid4>
- reviewed_sha: <40-hex commit whose tree holds this file as accepted; null means accepted
  but not byte-bound, and this line says why> · tree_sha: <its tree, or null>
- artifact-in-tree receipt: `git cat-file -e <reviewed_sha>:<this path>` rc=0, listed in the
  record's receipts (the checker does not verify this; the authorizer does)
- authorizer: <identity, e.g. lead@project or human:<name>> · role: reviewer | release-authority
- timestamp: <ISO-8601 UTC>

## Problem
What hurts, for whom, in the originator's words. What they do today instead.

## Proposed outcome
The change in the world, stated so it could be measured.

## Affected users and systems
People, services, data, other projects, the platform boundary.

## Constraints
Policy, security, licence, rulings, budget, dates. Mark each as real or assumed.

## Open questions
Numbered. Each with an owner and a way to find the answer.

## Grill record
Mode: quick | full (forced by: <incident, destructive, security, money, customer data,
migration, removal or fold, cross-project> if any) | re-grill. Score (full only): NN/50,
capped or not and why. Decisions taken (by whom). Next stage.
