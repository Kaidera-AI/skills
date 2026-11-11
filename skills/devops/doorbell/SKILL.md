---
name: doorbell
description: "Wake idle AI Worker terminals when a Cortex handoff row is waiting for them. Sets up, operates and answers a doorbell - a background program that types one fixed line into an idle Orca pane, never the row's text."
license: MIT
metadata:
  version: 1.0.0
  source: Kaidera-AI/skills
  posture: unvetted-source-candidate
---

# Doorbell

A doorbell is a small background program. Every 30 seconds it asks Cortex which AI Workers of a project have an **open handoff row**, and for each one it **types one fixed line into that worker's Orca terminal**, but only if the terminal is idle and nobody is typing. The line carries no work. It says "you have N open handoff(s), first `<id>`, check your queue", and the worker reads the real task from its Cortex queue.

Why it exists: without it, a lead creates a row and then a human has to click into each worker's tab to wake it. With it, a row wakes its worker by itself, and a pane that cannot be rung (busy for hours, waiting at an approval prompt) is reported instead of ignored.

There are three roles. Read the one that applies to you.

## 1. If you are a WORKER and the doorbell rang you

The line looks like this:

> Doorbell (lead@project): you have N open Cortex handoff(s), first `<id>`. Check your queue: `CORTEX_AGENT=<you> CORTEX_AUTH_TOKEN_FILE=… cortex-handoff --mine <you>`

Do this:

1. Run the command in the line. It lists your open rows. Read the one named `first`, and read the others.
2. **Claim a row you will work**: `cortex-handoff --claim <id> --agent <you>`. A claimed row **never rings again**. An unclaimed row rings again about every 30 minutes. So claim what you start, and claim a row you are deferring on purpose to silence it.
3. Do the work and return it: `cortex-handoff --return <id> --agent <you> --outcome completed --summary "…"`. Put the evidence in the summary. A return is a real write: it is not a dry run.
4. If a row is not yours, or is stale, say so in a return on that row. Do not leave it open: it will keep ringing.
5. Do not type back into the lead's pane. The answer goes in the row.

Your pane must be **titled with your worker name** (for example `vera`, `vera | project`, `Cortex-boot vera`): the doorbell finds you by title. If two panes carry your name, or one title names two workers, you are skipped, not rung.

## 2. If you are a LEAD or OPERATOR running a doorbell

Daily use:

- Status: `systemctl --user status doorbell`. Log: `tail -f <state_dir>/doorbell.log`. Attention log: `<state_dir>/attention.log` (lines starting `STUCK?` mean a pane is busy and silent, or is waiting at an approval prompt: **read that pane** with `orca terminal read --terminal <handle>`; do not trust "busy").
- **Stop typing at once, without restarting:** `touch <state_dir>/doorbell.off`. Resume: delete that file. The switch is read before every keystroke.
- Add a worker: add the name to `workers` in the config, then restart the service.
- A new row rings at once. A service restart rings once for each worker with open rows.

Full day-to-day and troubleshooting: `references/operating-and-troubleshooting.md`.

## 3. If you are INSTALLING it on a new project or VM

Follow `references/setup-new-project.md`. In short: build the Rust program from `assets/doorbell-src/`, copy `assets/doorbell.toml.template` and fill it in (project, lead, the lead's token file, the Orca workspace path, the workers), **run it once in dry run with its own state directory**, read what it says it WOULD ring, then install the service **in dry run**, and switch it live only when the project owner says so.

## Rules that are not optional

1. **Never run the program with a guessed flag, and never without `--config`.** The argument parser ignores unknown flags, so `--help` or a typo **starts a LIVE run**, and without `--config` it falls back to the path baked into the source (the helix project's), which on a machine that has that file starts a second live doorbell for the wrong project. Always: `doorbell --dry-run --once --config <your config>`.
2. **Dry run first, with its own `state_dir`.** A dry run that shares the live state directory shares the live kill switch and the live log.
3. **Lead's token only.** The doorbell reads every queue with the lead's token. It never reads a worker's token.
4. **One fixed line, never row text.** If you change the code, keep it that way.
5. **A ring that misfires: stop first, explain after.** `touch` the kill switch, then investigate.
6. **A pane reader must prove the screen ENDS at the input box.** After a terminal UI exits, its last frame stays on screen with a shell prompt under it. See `references/safety-and-lessons.md`.

## Files in this skill

| File | What it is |
|---|---|
| `references/setup-new-project.md` | step by step install on a new project or VM, dry run, go live, roll back |
| `references/config-reference.md` | every setting of `doorbell.toml` |
| `references/operating-and-troubleshooting.md` | day to day, log lines and what they mean, pane naming rules |
| `references/safety-and-lessons.md` | the two mistakes of 6 Nov 2026 and the rules that came from them |
| `assets/doorbell.toml.template` | a config to copy and fill in |
| `assets/doorbell.service.template` | the systemd user unit (dry run by default) |
| `assets/examples/tam.doorbell.toml.example` | a worked example: the tam project on am-dev-02 |
| `assets/doorbell-src/` | the complete Rust source (MIT), `cargo build --release` |
| `assets/SOURCE.txt` | where the source came from (git commit) and its file hashes |

## Where the source lives

The skill needs the doorbell program to run, and there are two ways to carry it. **Both work without changing anything
else in this skill**, because every reference names the source by one path: `assets/doorbell-src/`.

| Choice | What the skill carries | What changes here |
|---|---|---|
| **A - bundled (what this branch contains)** | the complete Rust source under `assets/doorbell-src/` (MIT, one file, provenance and hashes in `assets/SOURCE.txt`), built on the target host with `cargo build --release` | nothing |
| **B - pointed at its own public repository** | a short `assets/SOURCE.txt` naming the repository and the release tag to fetch, and no source in this skill | replace the build line in `references/setup-new-project.md` with the fetch command, and keep the directory name |

**Which one is the CTO's decision, not the skill's.** The reasoning on both sides: a bundled source makes the skill
self-contained and installable offline, and it puts 1,840 lines of Rust into a public skills repository; a pointer keeps the
skills repo to instructions and lets the program's own repository carry its issue tracker, releases and licence file.

**Not decided here and not implied:** the licence line of the skills repository itself (it carries CC-BY-4.0 while this skill
declares MIT), and the copyright holder line.

## Prerequisites

The Orca command line (`orca`, normally `~/.orca/cli/bin/orca`) reachable on the service's PATH and a running Orca runtime on the same host; `cortex-handoff` and a Cortex API reachable from the host; the lead's Cortex token as a file; a Rust toolchain (`cargo`) to build; `systemd --user` to run it as a service. The terminals it rings must be Orca terminals on **the same host** as the doorbell.
