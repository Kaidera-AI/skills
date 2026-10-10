# Sync custody

Before an authorised copy or fold, make a read-only plan from the approved source and observed destination bytes. Identify the canonical owner explicitly; file counts, timestamps and a populated directory cannot choose authority.

| Observed destination | Dry-run outcome | Action within existing authority |
|---|---|---|
| Absent in the approved path scope | Create candidate | Preserve the absence precondition until the approved writer acts. |
| Byte-identical to proposed source | Unchanged | Leave it as-is; identity alone does not establish ownership. |
| Different from proposed source, but identical to the trusted writer's last recorded bytes | Replace candidate | Apply only an already-authorised update; record prior and proposed hashes. |
| Different from the trusted last-write hash, no trusted custody record, unreadable, or an unexpected link/type | Conflict | Preserve destination bytes and consult their owner. |

Record path, canonical source identity, observed destination hash or absence, trusted prior receipt, proposed hash, outcome and intended writer. A dry run changes neither files nor ownership manifests and labels candidate actions as planned, not completed.

Immediately before an approved write, revalidate those preconditions through the writer's existing mechanism. On drift, preserve and re-plan. A hash preflight is not an atomicity or race-safety guarantee; a concurrent writer needs an explicit, reviewed write protocol. Cortex remains the sole owner of its generated pointers and mirrors: use its supported writer, never a second sync tool.

After the write, verify resulting content and record action, hash and any backup identity. A hash or manifest proves byte custody, not correctness, permission or tested restoration. Keep foreign edits; an override requires a separate reviewed path-specific decision. Destructive steps retain the existing operator/bundle/disposition gates.

Method attribution: Caliber AI, MIT, [pinned reconciliation source](https://github.com/caliber-ai-org/ai-setup/blob/f5dbc002022a8a10acad25c1cce23ddefdc19d0d/src/sync/reconcile.ts). This is original Kaidera wording; no donor code, CLI, force option or runtime is copied.
