# Structure reference

## 1. The root and its top level

The root is the project's `repo_root` in the Cortex registry. Its top level is an allowlist,
enforced by `scripts/fitness/check-folder-structure.sh` on tracked paths:

| Entry | Holds |
|---|---|
| `docs/` | all documents: `design/` (numbered), `adr/` (numbered decisions, never deleted), `handoffs/` (dated runbooks and records), `research/`, `guides/`, `plans/`, `releases/`, `security/`, `archive/` (superseded, stamped); the ledgers at the top (current architecture, the way of development, the canonical index, the folder SOP) |
| `Program/` | programme management: the products dashboard, `<Product>/PROGRESS.md` per lane, `Release_<version>/` with its `evidence/`, `_inbound/`, `backlog/`, `PM/` |
| `products/` | full sources of sibling products in the programme; excluded from the project's own archives |
| `packs/` | turnkey packs (generic; never a customer instance) |
| `archive/` | in-place archives that must not ship and are not yet deletable; ignored; each listed in the inventory with size and restore point |
| `output/` | machine-produced evidence bound to a candidate; export-ignored; pruned at release |
| `.worktrees/` | temporary worktrees, `<persona>-<topic>-<yyyymmdd>`; ignored |
| product source folders | as the project SOP names them (for KOS: `appliance/`, `local-cortex/`, `native/`, `redistributable/`, `dist/`, `scripts/`, `services/`, `beat/`, `packaging/`) |
| `.agents/` | the Cortex-generated harness, skills, API, scripts and migrations (tracked); generated config untracked |
| top-level files | the README, install/update/uninstall scripts, the generated harness pointers, the release manifest, tool configs — the project SOP lists them |

## 2. Where a new thing goes

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
| secret | nowhere in the tree; ignored env or SOPS custody | — |

Naming: lower-kebab-case; dates as `YYYY-MM-DD`; no spaces; one topic per file.

## 3. Worktrees are temporary

- Create: `git worktree add .worktrees/<persona>-<topic>-<yyyymmdd> -b <persona>/<topic>-<yyyymmdd>`.
- Author documents there only if the root receives them the same day (fold by content, commit
  per concern on the canonical branch).
- Finish: merge or hand over, then `git worktree remove <path>`; `git worktree prune` weekly.
- A worktree older than 14 days without a merged branch is reported in the products dashboard
  with owner and age; it is not deleted silently — its owner decides.
- Never create a worktree as a sibling folder of the root.

## 4. Dot-folders

Exactly two kinds:

- **Tracked and documented** — listed in the SOP with an owner (`.agents/`, `.claude/rules`,
  ignore files).
- **Ignored and regenerable** — listed in `.gitignore` with the command that regenerates them
  (tool caches, `.build/`, `.worktrees/`, `.venv/`, local runtime state).

Anything else is a defect to fix in the same session: commit and document it, or ignore it and
name its regeneration.

## 5. Consolidation loop

Use when folders have already scattered (siblings of the root, duplicate checkouts, packs and
mirrors in their own repositories, documents in several places).

1. **Inventory** every candidate: path, size, what it is, git state (repository? branch, dirty
   count, unpushed commits, worktrees), last touch, who references it (registry `repo_root`,
   LaunchAgents, docs, memory).
2. **Disposition table** (`templates/disposition-table.md`): per folder one of `fold`, `pack`,
   `product`, `archive`, `delete`, with the evidence for the choice. The operator approves it.
3. **Preserve first**: `git bundle --all` for every repository into the backup folder; capture
   dirty trees; push or bundle every worktree branch; list unmerged branches by owner.
4. **Fold by content**: first read [sync custody](sync-custody.md) and record its dry-run
   outcomes before any file write. Then copy into the root under §1, one commit per source folder on the
   canonical branch; verify by content (diff, symbol-loss scan, the fitness suite); update every
   reference (registry through the API, LaunchAgents, docs, memory) and prove each update.
5. **Delete last**: only through a script the operator runs, one `rm -rf` per line, sizes before
   and free space after; never from an agent session (the auto-mode classifier blocks bulk
   deletion by design).
6. **Record**: a dated decision, the inventory document updated, the SOP amended if a new kind
   of thing appeared, the gate updated in the same commit.
