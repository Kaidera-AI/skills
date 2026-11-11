# doorbell.toml: every setting

The doorbell reads one TOML file, given with `--config <path>`. Nothing else configures it. Copy `assets/doorbell.toml.template` and fill it in.

## Required

| Setting | Meaning |
|---|---|
| `api_url` | the Cortex API the doorbell asks, for example `http://localhost:8501` (the API answers `401` without a token: that means it is up) |
| `project` | the Cortex project key, for example `helix` or `tam`. It is also printed in the ring line and used in the token path shown to workers |
| `lead` | the lead's name, for example `kai` or `keith`. It is printed in the ring line. **The lead's own terminal is never rung** (a human types there): do not list the lead in `workers` |
| `lead_token_file` | the lead's Cortex token **file** (the doorbell reads every queue with it and never reads a worker's token). Mode 0600. Never put the token itself in the config |
| `workspace_path` | the Orca workspace (worktree path) whose terminals may be rung. Terminals of other workspaces are ignored |
| `since_utc` | `YYYY-MM-DD HH:MM:SS` UTC. **Rows created before this time are history and never ring.** Set it to the day you install: a restored or imported project can hold hundreds of old open rows |
| `poll_secs` | how often it asks Cortex, in seconds (30 is right) |
| `rering_secs` | an UNCLAIMED row rings again after this many seconds (1800 = 30 minutes). A CLAIMED row never re-rings |
| `state_dir` | where it writes `doorbell.log`, `attention.log` and where it looks for the kill switch `doorbell.off`. **A dry run must use its OWN `state_dir`** |
| `workers` | the worker names to ring, for example `["phoenix", "marvin", "sophia"]` |

## Optional

| Setting | Default | Meaning |
|---|---|---|
| `aliases` | none | a table mapping an exact pane title to a worker, for terminals whose harness sets a title with no worker name, for example `"π - helix" = "quill"` |
| `stuck_secs` | 1200 | a pane Orca calls busy, with open rows and no output for this long, is reported in `attention.log` (never typed into) |
| `attention_titles` | none | title fragments a harness shows while it waits for a human, for example `["Action Required"]` (Codex shows `[ ! ] Action Required` at an approval prompt). A busy pane with such a title is reported at once |
| `quiet_secs` | 20 | a pane is never typed into unless its output has been quiet for this long (a human's keystrokes repaint the pane, an idle agent does not) |
| `ring_unverified` | none | workers whose harness the input-box reader does not know. Empty by default: **a pane it cannot read is never typed into**. A listed worker is still held for a draft, a composer draft or recent output |

## Command line

```
doorbell --config <path> [--dry-run] [--once]
```

- `--dry-run`: log `WOULD RING …` and type nothing.
- `--once`: run one cycle and exit.
- **No other flag exists.** An unknown flag (`--help`, `-h`, a typo) is silently ignored and the program **starts a live run**. Without `--config` it uses the path baked into the source (the helix project's). Always pass `--config`, and for any first run pass `--dry-run --once`.

## What it checks before it types (all must pass)

1. The kill switch file `<state_dir>/doorbell.off` does not exist (checked again right before every keystroke).
2. The worker has an open row created at or after `since_utc` that has not already rung (or whose `rering_secs` passed while still unclaimed).
3. **Exactly one** terminal in `workspace_path` names the worker (whole word in the title, or an `aliases` entry). Two terminals, or a title that names two workers: skipped.
4. Orca says the terminal is idle, and the screen it reads shows the harness's input box **empty** with exactly the harness's footer rows under it (Claude Code, Codex and pi are known), and Orca's composer holds no draft, and the output was quiet for `quiet_secs`.
5. Anything it cannot tell is a hold, never a ring.
