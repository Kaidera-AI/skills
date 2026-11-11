# Safety rules and the two mistakes they come from

The doorbell types into other agents' terminals. A mistake is not a bug in a log: it is keystrokes in a live session. These rules are the result of two real mistakes (6 Nov 2026, during the Pi and Codex deployment on the helix project).

## Mistake 1: a guessed flag started a LIVE run

The author ran the built program with `--help`. It has no such flag. Its argument parser is three `args.iter().any(...)` lines, so **anything unknown is ignored** and the program started a live run with the default config, whose `state_dir` was the live state directory and whose token was the lead's. It ran 11 seconds and typed nothing, by luck (every pane was busy).

**Rules:**

1. **Never run a built program with a guessed flag next to live state.** Read the argument parser first.
2. **Always pass `--config` and, for any first run, `--dry-run --once`.**
3. **A dry run uses its OWN `state_dir`**, never the live one (it shares the kill switch and the log).
4. The same holds for any tool that can act: check how it parses its arguments before you run it.

## Mistake 2: a screen reader that did not prove the screen ENDS at the input box

After a terminal UI (pi, Claude Code) exits, its **last frame stays on the screen** with the shell prompt underneath, and Orca still reports the old identity from the title. The input-box reader saw "an empty box with at least two rows after the bottom rule" in that stale frame and the doorbell typed the ring into bash (a syntax error; nothing ran, again by luck).

**Rules:**

1. **An empty input box needs EXACTLY the harness's footer rows under it** (pi 2, Claude Code 2, Codex 2), not "at least". Anything else is a hold.
2. Write the test from the **real dead-pane shape** first (a stale frame with a shell prompt under it), then the happy case.
3. A dry run does not prove a pane that is busy in that cycle (the gate never reads it), so every deployment also needs a **read-only live report per pane**: read each pane once and say what the reader sees.

## The rule that governs a misfire

**If a ring misfires, stop the NEW binary first and say so.** Stop typing with the kill switch (`touch <state_dir>/doorbell.off`, and in every state directory a second instance uses), put the previous binary back, restart, then lift the switch. Write times with `date -u`, never from memory.

## Standing rules

- **Lead's token only.** The doorbell never reads a worker's token. Never copy a token between projects or agents.
- **No row text in the ring.** The job lives in the handoff. A ring that carries text is a way to smuggle instructions into another agent's session.
- **A pane it cannot read is never typed into.**
- **One doorbell per project.** Two doorbells ringing the same pane double the rings and confuse the re-ring bookkeeping.
- **Go live only on the project owner's word**, and note the time and the first ring.
- **Do not weaken a guard to make a ring happen.** If a worker is never rung, fix the naming, the harness support or the pane, not the guard.
