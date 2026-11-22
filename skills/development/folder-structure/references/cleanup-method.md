# Clean-up method

Use this method only after the project owner has accepted the structure definition and the authorized decision-maker has approved an exact disposition table. It guides inventory and review; it does not itself authorize a write, move, archive, or deletion.

## The four turns

Work on one product at a time. Keep the inventory read-only until every proposed row has a class, an owner, a destination or hold, and the required approval.

### Turn A — Rebuildable material

List each build output, cache, and dependency tree by exact path, measured size, age, and the build or run that produced it. A name or age alone does not prove that an item is disposable. The owner checks that no process uses the path and that it contains no evidence or untracked work. A lead approves each exact path before its owner removes it, without a force option. Record the command and result.

### Turn B — Exact duplicates

Compare SHA-256 values and list every exact path for each duplicate set. Identify the copy in the approved home. The product owner approves each disposition. Copy and verify before leaving a pointer at a human-facing old path; do not delete a duplicate under this turn.

### Turn C — Superseded versions

Name the exact successor of every candidate and the approved archive or version destination. Follow the project's retention rule. Do not infer an archive destination or deletion date from a filename, timestamp, or apparent age.

### Turn D — Old, unreferenced documents

For each exact path, check the absolute path, relative path, and filename in the relevant scripts, tools, configuration, recent handoffs, and product references. Open each match to decide whether it reads the path, name its owner, and have that owner accept a ready path correction before the move. The product owner decides whether the document is still needed.

## Holds and manifests

Keep an item at its current path when its owner, class, reader, or destination is unknown. Mark it `HOLD`; do not invent a home, create a holding folder, or archive it. The owner must name an approved holding location in the structure and confirm its audience and readers before a copy is made. If no approved location exists, it stays in place with a pointer or a note that names the unresolved owner and question.

For every approved copy or move, record a manifest row containing the exact source path, destination path, class, SHA-256, inventory date, owner, readers, approval reference, and reason. For a sealed evidence bundle, move the whole folder as one unit with its existing sums file; verify all sums after the copy. Do not split a sealed bundle into individual files.

## Consumers and batches

Before a move, search the bounded scope for the exact old absolute path, relative path, and filename. Include launchers, scripts, integration code, configuration, generated-page inputs, and current project references. A pointer does not keep a tool working. Update every path-reading consumer in the same approved batch, or keep the source held until the consumer change is ready. Move a registered Git worktree with Git's worktree command, by its owner; never use a plain filesystem move for it.

Keep each approved batch small enough to verify as one unit. Its manifest records `from`, `to`, class, owner, consumer changes, and SHA-256. After the batch, compare source and destination counts, verify hashes, check the old-path pointers, and run the named consumer checks. Report counts for judged, copied or moved, archived, removed as approved rebuildable material, and not judged. Do not start the next turn until the current batch has a durable receipt and the authorized reviewer has read it.
