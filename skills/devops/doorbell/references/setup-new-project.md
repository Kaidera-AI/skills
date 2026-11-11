# Setting the doorbell up for a new project (or a new VM)

Do these in order. Do not skip the dry run.

## 0. What you need

- An Orca runtime on the host, and the `orca` command line (normally `~/.orca/cli/bin/orca`). Check: `~/.orca/cli/bin/orca terminal list --json` lists your terminals.
- The terminals you want to ring are **Orca terminals on this same host**, in one workspace, each **titled with the worker's name**.
- `cortex-handoff` and a Cortex API reachable from this host (`curl -s -o /dev/null -w '%{http_code}' http://localhost:8501/health` gives `401` or `200`).
- The lead's Cortex token as a file (never printed, mode 0600). For a project `P` and a lead `L` the Kaidera convention is `~/.kaidera-os/cortex-auth/KOS-Cortex/P/L.token`.
- `cargo` (Rust) to build, `systemctl --user` to run as a service.

## 1. Put the source in the project

```
mkdir -p ~/DevVault/<project>/ops
cp -r <this skill>/assets/doorbell-src ~/DevVault/<project>/ops/doorbell
cd ~/DevVault/<project>/ops/doorbell
cargo build --release            # about a minute; the binary is target/release/doorbell
```

Optional: `cargo test` (the source carries its own tests; they use fake panes and never type into anything).

Keep the git commit and file hashes in `assets/SOURCE.txt` with the copy, so the next person knows which version this is.

## 2. Write the config

```
cp <this skill>/assets/doorbell.toml.template ~/DevVault/<project>/ops/doorbell/doorbell.toml
```

Fill in `project`, `lead`, `lead_token_file`, `workspace_path`, `since_utc` (**today**), `state_dir` and `workers`. Every setting is explained in `config-reference.md`. For a worked example see `assets/examples/tam.doorbell.toml.example`.

Name the terminals: open or rename each worker's terminal so that its title names exactly one worker (`phoenix`, `marvin | tam`, `Cortex-boot sophia` all work).

## 3. Dry run, ONCE, with its own state directory

```
mkdir -p ~/DevVault/<project>/ops/doorbell/state-dryrun
sed 's#^state_dir = .*#state_dir = "/home/azureuser/DevVault/<project>/ops/doorbell/state-dryrun"#' doorbell.toml > doorbell.dryrun.toml
PATH=$HOME/.orca/cli/bin:$PATH ./target/release/doorbell --dry-run --once --config ./doorbell.dryrun.toml
cat state-dryrun/doorbell.log
```

Read the log. You want, for each worker that has an open row, a `WOULD RING` line, and for the others a reason (`busy, not ringing`, `no single terminal titled 'x'`). **If it says `lead token unreadable` or `skip cycle (no typing)`, fix that first.** A dry run types nothing.

## 4. Install the service, in dry run

```
mkdir -p ~/.config/systemd/user
sed -e 's#@PROJECT@#<project>#g' -e 's#@LEAD@#<lead>#g' -e 's#@DIR@#/home/azureuser/DevVault/<project>/ops/doorbell#g' \
  <this skill>/assets/doorbell.service.template > ~/.config/systemd/user/doorbell.service
systemctl --user daemon-reload
systemctl --user enable --now doorbell
systemctl --user status doorbell
```

The unit starts with `--dry-run`. Watch `state/doorbell.log` for a few cycles.

## 5. Go live (only on the project owner's word)

```
systemctl --user edit doorbell
```
add, exactly:
```
[Service]
ExecStart=
ExecStart=/home/azureuser/DevVault/<project>/ops/doorbell/target/release/doorbell --config /home/azureuser/DevVault/<project>/ops/doorbell/doorbell.toml
```
then `systemctl --user restart doorbell`. The first ring comes within one cycle. Note the time and the first worker rung in the log.

## 6. Roll back, stop, or pause

- **Pause typing instantly:** `touch <state_dir>/doorbell.off` (delete it to resume).
- **Back to dry run:** delete the override (`~/.config/systemd/user/doorbell.service.d/*.conf`), `systemctl --user daemon-reload`, `systemctl --user restart doorbell`.
- **Stop completely:** `systemctl --user stop doorbell`.

## 7. Tell the workers

Give each worker the skill (the worker section of `SKILL.md`): when the doorbell line appears, run its command, **claim** the row you start, return it with evidence. Name their terminals exactly.
