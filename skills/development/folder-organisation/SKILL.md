---
name: folder-organisation
description: "One root, one home per kind of thing, one owner per fact. Where every file of a KOS project goes, how temporary work is kept temporary, and the loop that consolidates an estate that has already scattered. Loads at every worker boot."
license: Apache-2.0
# policy skill: rides every worker boot regardless of ranking
always_load: true
metadata:
  version: "1.0.1"
  authority: "CTO standing order 2026-09-08 (root folder is the only home); THE_WAY sections 13-14; project instance docs/FOLDER_STRUCTURE_SOP.md"
  sources: "git worktree documentation (git-scm.com); Nx monorepo folder-structure guide; ADR conventions (docs/adr, numbered, never deleted); this programme's 2026-09-07 estate inventory"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter"]
  allowed_domains: ["github.com"]
  updated: "2026-10-10"
  tags: ["organisation", "custody", "files"]
  attribution_author: "Caliber AI"
  attribution_url: "https://github.com/caliber-ai-org/ai-setup/blob/f5dbc002022a8a10acad25c1cce23ddefdc19d0d/src/sync/reconcile.ts"
  attribution_notes: "Original Kaidera wording informed by the pinned MIT donor's classification method; no donor code, CLI or writer is copied."
  safety_constraints: ["Dry-run classification grants no write authority.", "Preserve foreign edits and resolve conflicts with the owner.", "Cortex owns generated files; use its approved writer.", "Source publication does not grant binding, trusted tier or destructive operations."]
  applies_to: [lead, cpo, pm, orchestrator, full-stack-developer, knowledge-keeper, reviewer]
  bias: "the structure lives in the system (a gate), not in memory; temporary means it has a removal date; nothing project-related is created outside the root"
  conflicts_with: []
---

# Folder organisation

A project has exactly one root: the registry's `repo_root`. Every document, diagram, plan,
proof, pack and piece of source the project produces lives under that root, in the one place
its kind belongs. Temporary work is created as temporary (a worktree under `.worktrees/`, a
scratch directory) and removed when it is done. A fitness gate enforces the top level; this
skill tells you where a thing goes before you create it.

## Route by what you were asked

| You are about to... | Do | Read |
|---|---|---|
| create a document, diagram, plan, record or proof | put it in the folder for its kind, named by the convention | `references/structure.md` §2 |
| start work on a branch | make a worktree under `<root>/.worktrees/<persona>-<topic>-<yyyymmdd>`; never a sibling folder | `references/structure.md` §3 |
| finish work | fold documents into the root the same day, merge, `git worktree remove` | `references/structure.md` §3 |
| add a top-level folder or a dot-folder | do not, unless the SOP table gains a row (decision + gate update in the same commit) | `references/structure.md` §1, §4 |
| copy or synchronise files during an authorised fold | classify the content and custody in a dry-run before writing | `references/sync-custody.md` |
| find things scattered across folders or checkouts | run the consolidation loop | `references/structure.md` §5, `templates/disposition-table.md` |
| delete a folder or a repository | never directly: inventory, bundle, fold, then a one-path-per-line script the operator runs | `references/structure.md` §5 |

## The five rules

1. **One root.** Nothing project-related is created outside the project's `repo_root`.
2. **One home per kind.** Documents in `docs/`, programme management in `Program/`, other
   products in `products/`, turnkey packs in `packs/`, machine evidence in `output/`, archives
   in `archive/`, temporary worktrees in `.worktrees/`. The project SOP names the exact table.
3. **Two kinds of dot-folder only.** Tracked and documented, or ignored and regenerable by a
   named command. A third kind is a defect.
4. **Temporary has a date.** Worktrees and scratch carry a creation date in their name and are
   removed when their branch merges; a weekly prune reports the rest with owner and age.
5. **Never delete without a bundle and a table.** Repositories are bundled, dirty trees are
   captured, the disposition table is approved, the fold is verified by content, and only then a
   script the operator runs deletes — one path per line, with sizes before and free space after.

## What "done" looks like

- `scripts/fitness/check-folder-structure.sh` green on the tip you hand over.
- No document authored in a worktree that the root does not carry.
- The inventory document lists every folder outside the root with its disposition and evidence.
