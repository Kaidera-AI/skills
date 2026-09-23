# Task and Handoff Contract

A handoff is a work contract and return packet, not a greeting or broad mandate. It
must be complete enough that the assigned AI or human can work without guessing.

## Required before dispatch

| Field | Required content |
|---|---|
| Identity | Task id/revision, project, requester, accepted plan/policy revisions, assignee, independent AI reviewer, human reviewer, QA owner if required |
| Outcome | One observable outcome or bounded evidence question; user/value context; explicit non-goals |
| Scope | Permitted files/modules/artifacts, exact contract changes, prohibited surfaces |
| Inputs | Source revisions, data, predecessor artifacts and dependencies; freshness/authority |
| Workspace | Repository mode: repo/base revision/task workspace/integration destination; off: isolated workspace and stable input/output identity; allowed tools in either mode |
| Acceptance | Success and failure scenarios, expected results, compatibility/security/accessibility requirements, required evidence |
| Risk/change | Data, security, privacy, customer, operational, reversibility impact; change class; approvals and rollback/recovery |
| Execution | Selected role and operator-configured model/provider/tools, budget, time/retry/review-round limits, stop conditions |
| Review | Required AI review, human file review, risk-based QA, human gate owner, and record location |

If a required field is unknown, mark NOT READY and ask the named human. Do not fill
holes with a persona's implied authority or a guessed environment.

## Required handback

Return task/revision/attempt, actor, DONE/CONSULT/BLOCKED/FAILED, base and output
identity, changed-file inventory, acceptance results, commands and exit status or
equivalent observations, test/evidence references and hashes, review/QA status,
usage/limits when known, unmet requirements, residual risks, external effects, and
the next owner/action. Declare unverified items and why. Empty output is not evidence.

## Rework

Changes create a new attempt or revision. Findings remain open until the independent
reviewer records evidence-backed closure. Repeated rework past the configured cap is
a lead/human decision, not an autonomous loop. See
[review](./15-ai-human-code-review.md) and
[lifecycle](./12-development-lifecycle.md).
