# Disposition table — <estate> — <YYYY-MM-DD> — author <persona>

Approval: <operator> on <date> (row by row; a row without approval is not executed).
Backup folder: <path> (bundles, dirty-tree captures, inventories).

| # | Folder | What it is | Size | Git state (branch · dirty · unpushed · worktrees) | Referenced by | Disposition | Target in the root | Evidence the value is preserved | Approved |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `<path>` | | | | | fold / pack / product / archive / delete | `<root>/<path>` | bundle sha · commit on canonical · diff receipt | yes / no |

Dispositions:

- **fold** — content moves into the root under the structure table; the source folder is deleted after the fold commit is pushed and verified by content.
- **pack** — becomes `packs/<name>` (generic turnkey pack; instance data stays out).
- **product** — becomes `products/<name>` (full source of a sibling product; excluded from the project's archives).
- **archive** — moves under `archive/<name>` in place (ignored, `0700`), listed in the inventory with size and restore point; deletion is a later operator decision.
- **delete** — nothing of value beyond the bundle; executed only by the operator's one-path-per-line script.

Completion receipt (fill after execution):

- Folds committed: <commit list>
- References updated: registry `repo_root` (<api receipt>), LaunchAgents (<paths>), docs (<commits>), memory (<files>)
- Deleted by the operator: <script path>, `df -h` before/after
- Gate: `scripts/fitness/check-folder-structure.sh` → green at <sha>
