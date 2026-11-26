# Storage: the three stores, and what each one must do

Owner: the project lead. Applies to every project and every machine this skill is installed on. This page states a requirement, never a product: the customer, or the operator, chooses the service at their own provider, private cloud or local share.

## The rule in one line

Keep **three stores** -- code, documents, archive -- and never let the loss of one device lose all three.

## What each store holds, and what it needs

| Store | Holds | What it needs | Backup |
|---|---|---|---|
| **Code** | Tracked source, tests, migrations and the files that ship | A fast local working copy. No sharing requirement: each machine that works keeps its own checkout | The repository and its remote are the backup. A working copy is not a backup |
| **Documents** | Human-reader documents, plans, programs, evidence and generated pages | Shared storage several machines can mount, online, at ordinary speed | Snapshot and restore, with the restore rehearsed. A share without a restored test is not a store |
| **Archive** | Superseded versions, cold records and sealed evidence that must be kept but is rarely read | A **separate cold store**, low cost, **no daily backup**, on the cool tier rather than hot | None daily. The weekly snapshot is **create and list only**; restoring from it is a separate, rehearsed operation that needs an owner's explicit approval |

## What the archive is not

- It is **not** a backup of the documents store. A copy in the same failure domain as its source is a second copy, not a backup.
- It is **not** a place to delete from on a schedule. A removal is an owner decision with a receipt, never a retention rule nobody read.
- **Share soft delete protects the SHARE, not the files in it.** It retains a deleted share for the
  retention period and restores everything in it, snapshots included, when undeleted. Recovering an
  individually deleted **file** needs a retained snapshot or another backup - soft delete is not a
  14-day safety net for files.
- **A snapshot deleted individually is not covered by share-level soft delete either**, so deleting one is
  an owner decision with a receipt like any other removal.
- It is **not** on the same device as the other two stores.

## Naming and keeping a superseded document

When a document is revised, the older version goes to the archive in this shape:

```
<cold-store-root>/<project>/<product>/docs-prev/<yyyy-mm-dd>/<the file's own path below the product's documents folder>
```

- **Name unchanged** - the archive repeats the path, it does not invent a new one.
- **Copied with timestamps preserved**, never moved out of the live tree by the writer.
- **One `MANIFEST.sha256` in that day's folder**, one line per file: the hash of the **old** bytes and the path.
- **Permissions as the share gives them** - the archive is one account's mount, and changing owners is not the writer's job.
- **Nothing is deleted from the archive by the writer.** The retention window is counted by the owner later, and
  deleting a snapshot is never a cleanup step.
- **A second revision to the same path on the same day collides, on purpose.** Both revisions resolve to the
  same archive path and the same manifest key. If that path is already occupied with **different bytes**, the
  copy is **refused**: the writer does not overwrite it, does not merge the manifest, and leaves the previous
  file and its manifest untouched until the owner approves how the collision is handled. Two different old
  versions under one name is exactly the state a later reader cannot untangle.

## The mount rules

- **The same path on every machine of the project.** A store reached at a different path on two machines is two stores with one name.
- **A credentials file that root reads, and it never lives in the tree.** The mount uses it; the documents store does not hold it.
- **A required store that is not mounted stops what depends on it.** A store that silently disappears from the path is worse than one that fails loudly, because the writer keeps writing into a local directory that looks right.

## What a project definition records, and what it must not

Record in the project's own definition: which three stores exist, the mount or access path each one is reached by, who owns it, the restore test and its date, and the archive's cold-store root.

Record in the project's **storage deployment record** (beside the definition, not in it): the service and account in use, the per-host mount path, the mount and cross-host proofs with their dates, and the retention settings including any snapshot schedule. The definition says what must be true; the deployment record says what is.

**Custody references, never credentials.** The deployment record names *where* a credential lives and *who* reads it - "this host's root-only credentials file", that file's path, its mode and owner - and it holds nothing more. **Key and token values live outside both records, in approved secret custody**, and are read by name at the moment of use. A deployment record carrying a value is not a record of custody; it is a copy of the secret.

Never record in a project definition: a provider name, an account name, a bucket name, a key, a token or a person's machine. Those belong to the deployment, not to the definition, and they change without the structure changing. **Never record a key or token value in the deployment record either** - that record carries the custody reference, and the value stays in approved secret custody.

## What the operator must prove

1. **Mount**: each store is reached at its recorded path on a fresh session, and the check fails loudly when it is absent.
2. **Separation**: the three stores are not one device. Name the device for each.
3. **Restore**: a file is restored from the documents snapshot into a scratch path and compared by digest. The result is recorded with its date.
4. **Archive**: a superseded file is written to the archive, listed back, and read back once. The weekly snapshot lists its contents; it is not restored as part of routine work.
5. **Absence**: with the archive unreachable, ordinary work continues and says the archive is unavailable -- it does not silently write elsewhere.

## For the customer's own deployment

The product's deployment and configuration guide carries this chapter for the customer's provider: which three stores to create, the tier for each, the restore test to run, and what to record as proof. The guide is written so a person who has never done it can follow it once, and so our own teams can follow it in detail -- and it never assumes a particular vendor.