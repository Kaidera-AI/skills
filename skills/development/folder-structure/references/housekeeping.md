# Report-only housekeeping routine

This routine keeps the adopted structure visible. It lists and routes work; it does not remove files. Run it only against roots and products authorized by the project owner. Constrain each inventory or housekeeping walk to one authorized filesystem, stop at mount boundaries, and never follow symbolic links outside the approved root. Where documents are mounted per project, run the check for each project mount; the plain documents parent is not a content device.

## Daily or event-driven report

For each product, collect from its registered roots only:

1. Free space in configured development and documents stores, with the source of each measurement.
2. Every temporary work entry with owner, age, branch or run state, and whether its work is merged or closed.
3. Obligations left by recent events: merged work whose temporary directory remains, ended runs whose logs lack an archive manifest, or replaced documents not handled under an approved archive policy.
4. Holds and their expiry dates; report an expired hold as expired, never silently clear it.
5. New structure-check findings, including identical contents, revision-like names, and overfull hand-written folders.
6. A line for each owner who needs to act, routed through the project's coordination system.
7. A separate list of candidate rebuildable material for the project lead and operator to review.

Use the template in `../templates/housekeeping.md`. Keep generated measurements separate from operational state and do not type them into a plan as a second source of truth.

## Archive and removal boundary

For anything a project has approved to keep: list it, copy it with a manifest, verify the copy by hash, record its destination, and only then consider removing the exact source path under the approved table.

When a new working-document version is made, the superseded version must leave the active vault for the project's approved cold-store location. The target retention is 14 days; 30 days is the maximum, after which the version is deleted. Each product must approve a table naming exact classes, destination, verification, and expiry before anyone acts on this rule. This report-only routine does not authorize deletion, and nothing is deleted on the strength of this candidate alone.

A proposed 400-day exception for reviewer-accepted or release-shipped evidence remains unconfirmed and is not an active retention rule. Until confirmed, accepted or shipped evidence follows the project's existing approved evidence policy and is never swept into a working-version expiry rule.

No automatic age-based deletion is active in this candidate. Before enabling automation, the project owner must approve exact classes and retention, the operator must review the storage implementation, and a restore or preservation check must pass. Every removal follows the approved per-product table, exact-path recheck, and a recorded receipt.

Temporary files, caches, build output, branches, and worktrees are not automatically safe to remove. A project may automate a narrowly named class only after an approved plan, tested predicate, exact-path recheck, and removal receipt exist. A worker does not remove another worker's active folder.
