# Spec: <short name>

From: intent `<path or handoff id>` (accepted by record `intent-<decision_id>.json`).
Owner: <lead@project>. Reviewer role: CPO | PM; tech lead consulted for higher-risk change.

## Status (a pointer to the gate record, never an assertion)
Status: draft | accepted | superseded by <path>. "Accepted" is true only while a `spec` gate
record says so (`references/governance.md`, "Gate records"). This block copies the record;
the record wins on any disagreement. A correction is a new record whose
`previous_record_sha256` points at the superseded one, never an edit.
- gate record: `Program/<release>/gates/spec-<decision_id>.json`
- decision_id: <uuid4>
- reviewed_sha: <40-hex commit whose tree holds this file as accepted; null means accepted
  but not byte-bound, and this line says why> · tree_sha: <its tree, or null>
- artifact-in-tree receipt: `git cat-file -e <reviewed_sha>:<this path>` rc=0, listed in the
  record's receipts (the checker does not verify this; the authorizer does)
- authorizer: <identity> · role: reviewer
- timestamp: <ISO-8601 UTC>

## What we are building
Requirements and design in one place: behaviour, interfaces, data, and the boundaries it
must respect (architecture rule, editions, platform boundary, one owner per fact).

## What we are not building
Scope explicitly excluded, and why.

## Policy applied while writing
Which skills and rules were loaded; where they shaped a decision.

## Flagged concerns
Where policies conflict or cannot all be satisfied. Owner and resolution for each, before
engineering sees this spec.

## Acceptance
The observable results that mean the spec is met, each with the command, test or receipt
that proves it.

## Risks and rollback
What could break, blast radius, how it is undone, and whether the rollback has been rehearsed.

## Open questions
Numbered, with owners.
