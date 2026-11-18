# Adopting the starter structure

This procedure describes a project migration. It does not authorize one. The project lead must obtain an accepted plan naming the product, paths, owners, schedule, verification, and approver before any write. A product's exact disposition table and the authorized decision-maker's approval are required before moving or removing its files.

## Preconditions

- The product is not in a release run.
- The product owner has selected the versioned `structure.yaml` that will govern the work.
- A read-only inventory can identify every in-scope path, its size, file count, newest write, owner, repository state, and known references.
- The owner-registered product catalogue and intended target shape are known; select the direct project-root product layout only for exactly one registered product. The current legacy tree does not need to match the target before inventory: missing, extra, or differently named product paths are findings to classify.
- Inventory, check, move, and housekeeping walks are constrained to one authorized filesystem, stop at mount boundaries, and never follow symbolic links outside the approved root. Inventory each per-project documents mount separately; do not treat its plain parent folder as a content device.
- The team has a destination for verified copies and a way to preserve the source if verification fails.
- Secrets are excluded from ordinary inventory output or redacted by an approved tool. The project-code account cannot read the project secrets tree, and each credential is readable only by its using identity.

## Sequence

1. **Stop structural growth.** With the project lead's approval, create an empty target skeleton beside the current layout. From the agreed start point, route new files to their approved destination.
2. **Inventory read-only.** List each in-scope top-level folder and its contents without changing permissions, timestamps, or data. Compare the registered product catalogue with the existing product roots in both vaults; record missing, extra, or differently named paths as findings for the disposition table, without requiring parity before this inventory. If documents use per-project mounts, inventory each project mount separately and check each mount's device; do not check the plain documents parent as a content device. Keep each walk on its authorized filesystem, stop at mount boundaries, and do not follow symbolic links outside the root. Record unknown owners as `ask`.
3. **Classify every exact path.** The product lead proposes one fate for each row: `keep`, `move` with a destination, `cold-store`, `remove` as regenerable or finished temporary material, or `ask`. Group identical files and likely revisions for human selection; similarity is not permission to discard either copy.
4. **Approve the table.** The authorized decision-maker approves the exact source and destination paths. Any changed row requires a new review. Do not infer approval from an inventory, check result, or a prior product's table.
5. **Preserve before moving.** Bundle repositories, preserve dirty work, hash and copy evidence according to the evidence policy, and archive logs with a manifest. Keep the source intact until all copy checks pass.
6. **Move one product at a time.** Move complete folders where practical. Compare source and destination file counts and hashes. Record each old-to-new path in one `MOVED.tsv` map so a reader can resolve old references. Keep enumeration on the authorized source filesystem and do not traverse mount points or external symbolic links.
7. **Review the move.** A reviewer checks the move evidence before any approved legacy path is removed. An unverified copy stops the procedure.
8. **Remove only approved rows.** If the table allows removal, an operator runs an inspected procedure that names each exact path. Recheck the path and its contents immediately before removal. A missing or changed path stops the procedure. Record a removal receipt for each completed row.
9. **Check, then gate.** Recheck the product layout and identity parity after approved removals. The project lead enables the structure check for that product only when removals are complete, receipts are reviewed, and the final check is clean. Keep the check in report-only mode for all other products.

## Never

- Migrate during a release run.
- Move a sealed evidence folder file by file.
- Remove a source before the destination copy has been verified.
- Migrate two products at once.
- Delete by wildcard, filename pattern, or age alone.
- Treat identical-content reports as an automatic disposition.
- Let an inventory, check, move, or housekeeping walk cross a mount boundary or follow a symbolic link outside the approved root.
- edit generated files directly or let a project map become a second source of truth.

## Receipt

The return to the project lead records the approved table reference, exact source and destination roots, inventory and move-evidence hashes, counts, verification output, any paths left as `ask`, and the structure-check state. It does not claim the migration passed if any required row is unverified or awaiting approval.
