# Operating the doorbell, and what its log lines mean

## What rings and when

- Every `poll_secs` (30 s) it lists each worker's `pending` and `claimed` rows from Cortex with the lead's token.
- A worker is rung when it has an open row created at or after `since_utc` that has not rung yet. A **new row rings at once**.
- An **unclaimed** row rings again every `rering_secs` (30 minutes). A **claimed** row never re-rings. A worker silences a row it is deferring by claiming it.
- A service restart rings once for each worker that has open rows.
- It types exactly one fixed line and Enter. The line names the number of open rows and the first id. It never contains row text.

## Pane naming

A pane belongs to a worker when **exactly one** worker name appears in its title as a whole word: `phoenix`, `vera | helix` (Codex), `Run cortex-boot mike | helix`, `Cortex-boot cox` (Claude Code), `π - quill - helix` (pi). Two panes naming the same worker, or one title naming two workers, are skipped. A title that names no worker can be mapped in `[aliases]`. The lead's own pane is never rung (leave the lead out of `workers`).

## Log lines (`<state_dir>/doorbell.log`)

| Line contains | Meaning | What to do |
|---|---|---|
| `WOULD RING` | dry run: this is what it would type | nothing; this is the proof you want before going live |
| `RING` / `rang` | it typed the line | nothing |
| `busy, not ringing` | Orca says the pane is mid-turn | nothing; it tries again next cycle. If it stays busy for hours, see attention.log |
| `no single terminal titled 'x'` | no pane, or two panes, name worker x | open or rename the tab so exactly one carries the name |
| `skip cycle (no typing): …` | Orca (or the Cortex call) was not reachable; nothing was typed | start the Orca runtime / check `orca status` |
| `lead token unreadable` | the lead's token file is missing, unreadable or rotated | fix the file; the doorbell cannot read any queue without it |
| `must hold` (human-typing guard) | a draft, a composer draft or recent output: it held instead of typing | nothing; a human may be typing |

## Attention log (`<state_dir>/attention.log`)

A line `STUCK? <worker>: <why>, N open row(s); not typing - lead to look` means the pane is busy (or waiting at an approval prompt) and the doorbell will not type into it. Two reasons appear:

- the pane title contains one of your `attention_titles` (Codex: `Action Required`): the worker is waiting at an **approval prompt** that only a human can answer;
- Orca says busy but there has been **no output for `stuck_secs`** (20 minutes by default): Orca's idle check can stay false on a plainly idle pane. **Read the pane before you decide** (`orca terminal read --terminal <handle>`): a pane that looks busy to Orca may be idle, waiting for another worker, or really stuck.

A lead's watcher can tail this file and print each new line.

## Common jobs

- **Is it alive?** `systemctl --user status doorbell` and the last lines of `doorbell.log` (a cycle every 30 s).
- **Stop typing now:** `touch <state_dir>/doorbell.off`. The file is read before every keystroke. Delete it to resume.
- **Add or remove a worker:** edit `workers`, then `systemctl --user restart doorbell` (a restart rings once for each worker with open rows).
- **Ring one worker by hand** (the doorbell missed it, or it is a one-off): read the pane, check it is writable and idle with an empty input box, then `orca terminal send --terminal <handle> --enter --text "<one direct order naming the row id and the first step>"`. Never type into a pane you have not read first, and never type the row's text.
- **A row that never reaches the worker:** check, in this order: the row's `to_agent` is the worker's name; the row is newer than `since_utc`; exactly one terminal names the worker; the worker's pane is not holding a draft in Orca's composer (a composer draft silences a pane: only a human can clear it).

## Two limits you should know

- It cannot ring a pane whose harness it cannot read (an unknown harness, or a changed layout). It reports that as a hold, never as a ring. Add the worker to `ring_unverified` only if you accept ringing on the other guards alone.
- A worker that finishes a task at an empty prompt can still miss its next row if its own queue watcher expired or its composer holds a draft. If a lane waits for another lane for longer than a few minutes, **read the other lane's pane**.
