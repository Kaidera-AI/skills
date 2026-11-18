# Adopting the starter structure

This procedure describes a project migration. It does not authorize one. The project lead must obtain an accepted plan naming the product, paths, owners, schedule, verification, and approver before any write. A product's exact disposition table and the authorized decision-maker's approval are required before moving or removing its files.

## Preconditions

- The product is not in a release run.
- The product owner has selected the versioned `structure.yaml` that will govern the work.
- A read-only inventory can identify every in-scope path, its size, file count, newest write, owner, repository state, and known references.
- The team has a destination for verified copies and a way to preserve the source if verification fails.
- Secrets are excluded from ordinary inventory output or redacted by an approved tool.

## Sequence

1. **Stop structural growth.** With the project lead's approval, create an empty target skeleton beside the current layout. From the agreed start point, route new files to their approved destination.
2. **Inventory read-only.** List each in-scope top-level folder and its contents without changing permissions, timestamps, or data. Record unknown owners as `ask`.
3. **Classify every exact path.** The product lead proposes one fate for each row: `keep`, `move` with a destination, `cold-store`, `remove` as regenerable or finished temporary material, or `ask`. Group identical files and likely revisions for human selection; similarity is not permission to discard either copy.
4. **Approve the table.** The authorized decision-maker approves the exact source and destination paths. Any changed row requires a new review. Do not infer approval from an inventory, check result, or a prior product's table.
5. **Preserve before moving.** Bundle repositories, preserve dirty work, hash and copy evidence according to the evidence policy, and archive logs with a manifest. Keep the source intact until all copy checks pass.
6. **Move one product at a time.** Move complete folders where practical. Compare source and destination file counts and hashes. Record each old-to-new path in one `MOVED.tsv` map so a reader can resolve old references.
7. **Review, then gate.** A reviewer checks the move evidence. The project lead enables the structure check for that product only after it is clean. Keep the check in report-only mode for all other products.
8. **Remove only approved rows.** If the table allows removal, an operator runs an inspected procedure that names each exact path. Recheck the path and its contents immediately before removal. A missing or changed path stops the procedure.

## Never

- Migrate during a release run.
- Move a sealed evidence folder file by file.
- Remove a source before the destination copy has been verified.
- Migrate two products at once.
- Delete by wildcard, filename pattern, or age alone.
- Treat identical-content reports as an automatic disposition.
- edit generated files directly or let a project map become a second source of truth.

## Receipt

The return to the project lead records the approved table reference, exact source and destination roots, inventory and move-evidence hashes, counts, verification output, any paths left as `ask`, and the structure-check state. It does not claim the migration passed if any required row is unverified or awaiting approval.
