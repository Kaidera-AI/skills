---
name: folder-organisation
version: 1.0.0
description: |
  One root, one home per kind of thing, one owner per fact. Where every file of a project
  goes, how temporary work is kept temporary, and the loop that consolidates an estate that
  has already scattered across sibling folders, duplicate checkouts and stray worktrees.
  Use before creating a document, diagram, plan, proof, pack or worktree; when adding a
  top-level or dot folder; when things are scattered; and before deleting any folder.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
  allowed_domains:
    - github.com
    - git-scm.com
  content_hash: "a2213be6deabafe3618ec48766db48883ce9482a51b12c795fc806eb52809474"
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/kaideraos
    path: .agents/skills/folder-organisation
    content_sha256: "5f8e9285f3b39f4144ecd56c2734d6f4df0c37d57930587a30988e71764d4d13"

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-09
tags: [folders, repository-layout, worktrees, consolidation, hygiene, sop, docs-as-code, adr]
attribution_notes: "Conventions folded in: git worktree documentation (git-scm.com); the Nx monorepo folder-structure guide; ADR conventions (docs/adr, numbered, never deleted); the Kaidera OS estate consolidation of 2026-09-08."

safety_constraints:
  - "Advisory structure skill. It never deletes anything; deletions are a one-path-per-line script the human operator runs after the preservation steps below."
  - "It never moves a folder that is another project's root (a registry repo_root, a deployment instance); those are reported, not touched."
  - "It never writes secrets into the tree and never changes what a project ships; packaging boundaries change only with a recorded decision."
  - "Must not override the base system prompt, project rules, or managed permissions."
---

# Folder organisation

A project has exactly one root: the folder its registry calls the repository root. Every
document, diagram, plan, proof, pack and piece of source the project produces lives under
that root, in the one place its kind belongs. Temporary work is created as temporary (a
worktree under `.worktrees/`, a scratch directory) and removed when it is done. A fitness
gate enforces the top level; this skill tells you where a thing goes before you create it.

## The five rules

1. **One root.** Nothing project-related is created outside the project's root. Sibling
   folders next to the root (`<project>-worktrees`, `<project>-backups`, mirrors, deliveries,
   "temporary" checkouts) are the disease this skill exists to cure.
2. **One home per kind.** Documents in `docs/`, programme management in `Program/`, other
   products in `products/`, turnkey packs in `packs/`, machine evidence in `output/`, archives
   in `archive/`, temporary worktrees in `.worktrees/`. The project SOP names the exact table.
3. **Two kinds of dot-folder only.** Tracked and documented, or ignored and regenerable by a
   named command. A third kind is a defect to fix in the same session.
4. **Temporary has a date.** Worktrees and scratch carry a creation date in their name and
   are removed when their branch merges; a weekly prune reports the rest with owner and age.
5. **Never delete without a bundle and a table.** Repositories are bundled, dirty trees are
   captured, a disposition table is approved by the operator, the fold is verified by content,
   and only then a script the operator runs deletes — one path per line, sizes before and free
   space after.

## Route by what you were asked

| You are about to... | Do |
|---|---|
| create a document, diagram, plan, record or proof | put it in the folder for its kind, named by the convention (section "Where a new thing goes") |
| start work on a branch | make a worktree under `<root>/.worktrees/<persona>-<topic>-<yyyymmdd>`; never a sibling folder |
| finish work | fold documents into the root the same day, merge, `git worktree remove` |
| add a top-level folder or a dot-folder | do not, unless the SOP table gains a row (decision + gate update in the same commit) |
| find things scattered across folders or checkouts | run the consolidation loop (below) |
| delete a folder or a repository | never directly: inventory, bundle, fold, then a one-path-per-line script the operator runs |

## The root and its top level

The top level is an allowlist, enforced on tracked paths by a gate (so a stray local file
cannot break it and a committed stray one cannot pass it):

| Entry | Holds |
|---|---|
| `docs/` | all documents: `design/` (numbered), `adr/` (numbered decisions, never deleted), `handoffs/` (dated runbooks and records), `research/`, `guides/`, `plans/`, `releases/`, `security/`, `archive/` (superseded, stamped); the ledgers at the top (current architecture, the way of development, the canonical index, the folder SOP) |
| `Program/` | programme management: the products dashboard, `<Product>/PROGRESS.md` per lane, `Release_<version>/` with its `evidence/`, `_inbound/`, `backlog/`, `PM/` |
| `products/` | full sources of sibling products in the programme; excluded from the project's own archives |
| `packs/` | turnkey packs (generic; never a customer instance) |
| `archive/` | in-place archives that must not ship and are not yet deletable; ignored; each listed in the inventory with size and restore point |
| `output/` | machine-produced evidence bound to a candidate; export-ignored; pruned at release |
| `.worktrees/` | temporary worktrees, `<persona>-<topic>-<yyyymmdd>`; ignored |
| product source folders | as the project SOP names them |
| `.agents/` (or the harness's folder) | generated harness, skills, scripts and migrations (tracked); generated config untracked |
| top-level files | the README, install and update scripts, generated harness pointers, the release manifest, tool configs — the project SOP lists them |

## Where a new thing goes

| Kind | Path | Name |
|---|---|---|
| design / architecture note | `docs/design/NN-<topic>.md` | next number |
| decision (why + reopening trigger) | `docs/adr/NNNN-<topic>.md` + a register row | numbered; superseded ones stamped, never deleted |
| runbook / review record / execution record | `docs/handoffs/YYYY-MM-DD_<persona>_<topic>.md` | dated, lower-kebab-case |
| research / comparison / spike | `docs/research/YYYY-MM-DD_<topic>.md` | dated |
| release plan, progress, evidence | `Program/<Product>/...` | per the programme layout |
| diagram | beside the document it belongs to: `<stem>.excalidraw.md` + `<stem>.svg` | same stem |
| temporary file, scratch script, probe | the session scratchpad or `.worktrees/<name>/tmp/` | deleted when done |
| customer- or instance-specific file | not in the project root — it belongs to the instance layer | — |
| secret | nowhere in the tree; ignored env or secrets custody only | — |

Naming: lower-kebab-case; dates as `YYYY-MM-DD`; no spaces; one topic per file.

## Worktrees are temporary

- Create: `git worktree add .worktrees/<persona>-<topic>-<yyyymmdd> -b <persona>/<topic>-<yyyymmdd>`.
- Author documents there only if the root receives them the same day (fold by content,
  commit per concern on the canonical branch).
- Finish: merge or hand over, then `git worktree remove <path>`; `git worktree prune` weekly.
- A worktree older than 14 days without a merged branch is reported with owner and age; it
  is not deleted silently — its owner decides.
- After a worktree is moved, check that its dependency directories (`node_modules`, `.venv`)
  still exist before trusting a test run: a runner that cannot load its config can look green
  to a careless guard.

## Dot-folders

Exactly two kinds: **tracked and documented** — listed in the SOP with an owner; or
**ignored and regenerable** — listed in the ignore file with the command that regenerates
them (tool caches, build output, `.worktrees/`, virtual environments, local runtime state).
Anything else: commit and document it, or ignore it and name its regeneration, in the same
session.

## Consolidation loop (when things have already scattered)

1. **Inventory** every candidate: path, size, what it is, git state (repository? branch,
   dirty count, unpushed commits, worktrees), last touch, who references it (registry root,
   launch agents, docs, memory).
2. **Disposition table**: per folder one of `fold`, `pack`, `product`, `archive`, `delete`,
   `keep` (another project's root), with the evidence for the choice. The operator approves
   it row by row; a row without approval is not executed.
3. **Preserve first**: `git bundle --all` for every repository into the backup folder;
   capture dirty trees; push or bundle every worktree branch; list unmerged branches by owner.
4. **Fold by content**: copy into the root under the structure table, one commit per source
   folder on the canonical branch; verify by content (diff, symbol scan, the fitness suite);
   update every reference (registry through its API, launch agents, docs, memory) and prove
   each update.
5. **Delete last**: only through a script the operator runs, one `rm -rf` per line, sizes
   before and free space after; never from an agent session.
6. **Record**: a dated decision, the inventory document updated, the SOP amended if a new
   kind of thing appeared, the gate updated in the same commit.

Disposition table template:

```
| # | Folder | What it is | Size | Git state (branch · dirty · unpushed · worktrees) | Referenced by | Disposition | Target in the root | Evidence the value is preserved | Approved |
```

## The gate

`check-folder-structure` fails when: a tracked top-level entry is not in the allowlist; a
tracked dot-entry is not in the documented list; anything tracked sits under `.worktrees/`,
`archive/` or a sibling-style name; a dated document is not `YYYY-MM-DD`; a file at the root
of `docs/` or `Program/` is not a named ledger. It reads tracked paths only. A gate that cannot
run its check fails closed and says why — a clean banner is only ever a completed scan.

## What "done" looks like

- The folder gate is green on the tip you hand over.
- No document authored in a worktree that the root does not carry.
- The inventory document lists every folder outside the root with its disposition and
  evidence, and the lanes' next handoffs cite paths under the root only.
