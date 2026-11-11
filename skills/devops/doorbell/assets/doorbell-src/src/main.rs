//! doorbell: every `poll_secs`, for each worker with an open Cortex handoff created after `since_utc`,
//! if that worker's Orca terminal (exact title, our workspace) is idle, type ONE fixed line and Enter.
//! Never types row text (no prompt injection from row content). Kill switch: `<state_dir>/doorbell.off`.
use serde::Deserialize;
use std::collections::{HashMap, HashSet};
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use std::time::{Duration, Instant, SystemTime};

#[derive(Deserialize, Clone)]
struct Config {
    api_url: String,
    project: String,
    lead: String,
    lead_token_file: PathBuf,
    workspace_path: String,
    since_utc: String,
    poll_secs: u64,
    rering_secs: u64,
    state_dir: PathBuf,
    workers: Vec<String>,
    /// Exact pane titles that name no worker (e.g. pi's "π - helix") mapped to a worker.
    #[serde(default)]
    aliases: HashMap<String, String>,
    /// A pane Orca reports busy, with open rows and no output for this long, is reported to the lead
    /// (log + `<state_dir>/attention.log`), never typed into: it may sit at an approval prompt.
    #[serde(default = "default_stuck_secs")]
    stuck_secs: u64,
    /// Pane-title fragments a harness shows while it waits for a human (Codex: "Action Required").
    /// A busy pane whose title contains one is reported to the lead at once; it is never typed into.
    #[serde(default)]
    attention_titles: Vec<String>,
    /// A pane is never typed into while a human may be typing: its output must have been quiet for this long
    /// (a backstop to the input-box check; an idle agent pane does not repaint, a human's keystrokes do).
    #[serde(default = "default_quiet_secs")]
    quiet_secs: u64,
    /// Workers whose input box cannot be read (unknown harness) but who may still be rung on the other guards.
    /// Empty by default: a pane we cannot verify is never typed into.
    #[serde(default)]
    ring_unverified: Vec<String>,
}

fn default_quiet_secs() -> u64 {
    20
}

fn default_stuck_secs() -> u64 {
    1200
}

#[derive(Deserialize)]
struct Row {
    id: String,
    #[serde(default, deserialize_with = "null_as_empty")]
    status: String,
    #[serde(default, deserialize_with = "null_as_empty")]
    to_agent: String,
    #[serde(default, deserialize_with = "null_as_empty")]
    created_at: String,
}

/// Kit patch 1 (9 Nov 2026): Cortex returns an explicit `null` for a field a row does not have (for example `to_agent` on a
/// row addressed only by role). `#[serde(default)]` covers a MISSING field but not a `null`, so one such row used to fail the
/// whole queue ("row shape: invalid type: null, expected a string") and the worker was never rung. A null reads as an empty
/// string: the row is then not addressed to the worker and is not eligible, exactly as before for every other row.
fn null_as_empty<'de, D: serde::Deserializer<'de>>(d: D) -> Result<String, D::Error> {
    Ok(Option::<String>::deserialize(d)?.unwrap_or_default())
}

#[derive(Default)]
struct WorkerState {
    rung: HashSet<String>,
    last_ring: Option<Instant>,
    last_stuck: Option<Instant>,
    last_hold: Option<Instant>,
}

/// A stuck report repeats at most once per `every` (the re-ring interval), so the lead is told, not flooded.
/// Orca's idle check can stay false for a pane that is plainly idle (mira, 1-2 Nov 2026), and a pane at an
/// approval prompt is busy too (mike, 2 Nov 2026); neither may be typed into, so the lead is told instead.
fn report_due(last_report: Option<Instant>, every: Duration, now: Instant) -> bool {
    last_report.is_none_or(|t| now.duration_since(t) >= every)
}

/// True when the pane title shows the harness is waiting for a human (case-insensitive).
fn waiting_title(title: &str, markers: &[String]) -> bool {
    let t = title.to_lowercase();
    markers
        .iter()
        .any(|m| !m.is_empty() && t.contains(&m.to_lowercase()))
}

/// Milliseconds since the pane last produced output, from `orca terminal show` (None if unknown).
fn silent_ms(handle: &str) -> Option<u64> {
    let v = orca_json(&["terminal", "show", "--terminal", handle]).ok()?;
    let r = &v["result"];
    let t = if r.get("terminal").is_some() {
        &r["terminal"]
    } else {
        r
    };
    let last = t["lastOutputAt"].as_u64()?;
    let now = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .ok()?
        .as_millis() as u64;
    Some(now.saturating_sub(last))
}

fn attention(cfg: &Config, msg: &str) {
    log(cfg, msg);
    let line = format!(
        "{} {}\n",
        humantime::format_rfc3339_seconds(SystemTime::now()),
        msg
    );
    if let Ok(mut f) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(cfg.state_dir.join("attention.log"))
    {
        let _ = f.write_all(line.as_bytes());
    }
}

/// A row is eligible if it is addressed to this worker and was created at or after `since`.
/// Timestamps from the API look like "2026-11-01 09:44:42.119525+00" (UTC); the first 19 chars compare as text.
fn eligible(row: &Row, worker: &str, project: &str, since: &str) -> bool {
    let to_me = row.to_agent == worker || row.to_agent == format!("{worker}@{project}");
    let created = row.created_at.get(..19).unwrap_or("");
    to_me && created.len() == 19 && created >= since
}

/// Ring when there is an open row we never rang for, or the re-ring interval has passed.
/// Ring at once for a row never rung before; re-ring (after `rering`) only while some row is still
/// unclaimed. A claimed row belongs to the worker already, so it never causes a re-ring (cox, 2026-11-02).
fn should_ring(open: &[(String, bool)], st: &WorkerState, rering: Duration, now: Instant) -> bool {
    if open.is_empty() {
        return false;
    }
    let new_row = open.iter().any(|(id, _)| !st.rung.contains(id));
    let any_unclaimed = open.iter().any(|(_, pending)| *pending);
    let due = st.last_ring.is_none_or(|t| now.duration_since(t) >= rering);
    new_row || (any_unclaimed && due)
}

/// The worker a pane title names. Harnesses retitle panes freely ("cox", "vera | helix",
/// "Run cortex-boot mike | helix", "π - quill - helix"), so a title names a worker when exactly one
/// known name appears in it as a whole word (case-insensitive). Exact aliases win; two names = no match.
fn title_worker(
    title: &str,
    aliases: &HashMap<String, String>,
    names: &[String],
) -> Option<String> {
    if let Some(w) = aliases.get(title) {
        return Some(w.to_lowercase());
    }
    let lower = title.to_lowercase();
    let words: Vec<&str> = lower
        .split(|c: char| !(c.is_ascii_alphanumeric() || c == '-' || c == '_'))
        .filter(|w| !w.is_empty())
        .collect();
    let mut found: Vec<&String> = names
        .iter()
        .filter(|n| {
            words
                .iter()
                .any(|w| *w == n.as_str() || w.strip_prefix("cortex-boot-") == Some(n.as_str()))
        })
        .collect();
    found.dedup();
    if found.len() == 1 {
        Some(found[0].clone())
    } else {
        None
    }
}

/// Exactly one live terminal whose title names `worker` in our workspace, or None (missing or ambiguous).
fn pick_terminal(
    terminals: &[(String, String)],
    worker: &str,
    aliases: &HashMap<String, String>,
    names: &[String],
) -> Option<String> {
    let mut hits = terminals
        .iter()
        .filter(|(title, _)| title_worker(title, aliases, names).as_deref() == Some(worker));
    let first = hits.next()?;
    if hits.next().is_some() {
        None
    } else {
        Some(first.1.clone())
    }
}

/// "term_xxxxxxxx 'title'": a pane as the log names it (handle prefix and title, nothing from its screen).
fn pane_note(handle: &str, title: &str) -> String {
    let short: String = handle.chars().take(13).collect();
    format!("{short} '{title}'")
}

/// Every pane whose title names `worker`, as `pane_note`s. `pick_terminal` skips a worker with two of them; the log
/// says which two (6 Nov 2026: a misfire could not be explained because the log did not).
fn matching_titles(
    terminals: &[(String, String)],
    worker: &str,
    aliases: &HashMap<String, String>,
    names: &[String],
) -> Vec<String> {
    terminals
        .iter()
        .filter(|(title, _)| title_worker(title, aliases, names).as_deref() == Some(worker))
        .map(|(title, handle)| pane_note(handle, title))
        .collect()
}

/// The kill switch is read immediately before every keystroke (vera DB-002): creating
/// `<state_dir>/doorbell.off` at any moment stops typing on the next send, not the next cycle.
fn off_switch(state_dir: &std::path::Path) -> bool {
    state_dir.join("doorbell.off").exists()
}

fn log(cfg: &Config, msg: &str) {
    let line = format!(
        "{} {}\n",
        humantime::format_rfc3339_seconds(SystemTime::now()),
        msg
    );
    eprint!("{line}");
    let _ = fs::create_dir_all(&cfg.state_dir);
    if let Ok(mut f) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(cfg.state_dir.join("doorbell.log"))
    {
        let _ = f.write_all(line.as_bytes());
    }
}

fn open_rows(cfg: &Config, token: &str, worker: &str) -> Result<Vec<Row>, String> {
    let mut rows = Vec::new();
    for status in ["pending", "claimed"] {
        let url = format!(
            "{}/handoffs?agent={}&status={}",
            cfg.api_url.trim_end_matches('/'),
            worker,
            status
        );
        let resp = ureq::get(&url)
            .set("Authorization", &format!("Bearer {token}"))
            .set("X-Project", &cfg.project)
            .set("X-Agent-Name", &cfg.lead)
            .timeout(Duration::from_secs(15))
            .call()
            .map_err(|e| format!("cortex query {worker}/{status}: {e}"))?;
        let v: serde_json::Value = resp.into_json().map_err(|e| format!("cortex json: {e}"))?;
        let list = v
            .get("handoffs")
            .cloned()
            .unwrap_or(serde_json::Value::Array(vec![]));
        rows.extend(
            serde_json::from_value::<Vec<Row>>(list).map_err(|e| format!("row shape: {e}"))?,
        );
    }
    Ok(rows)
}

fn orca_json(args: &[&str]) -> Result<serde_json::Value, String> {
    orca_json_with("orca", args)
}

fn orca_json_with(orca: &str, args: &[&str]) -> Result<serde_json::Value, String> {
    let out = Command::new(orca)
        .args(args)
        .arg("--json")
        .output()
        .map_err(|e| format!("orca: {e}"))?;
    if !out.status.success() {
        return Err(format!("orca {:?} exit {}", args, out.status));
    }
    serde_json::from_slice(&out.stdout).map_err(|e| format!("orca json: {e}"))
}

/// (title, handle) for connected, writable AI Worker terminals in our workspace.
fn terminals(cfg: &Config) -> Result<Vec<(String, String)>, String> {
    let v = orca_json(&["terminal", "list"])?;
    let list = v["result"]["terminals"]
        .as_array()
        .cloned()
        .unwrap_or_default();
    Ok(list
        .iter()
        // Harness-agnostic: match on title + workspace only (Claude Code, Codex, omp, pi, DeepSeek...). Orca's
        // `agentIdentity` is not set for every harness, so it is not required; idle detection still gates typing.
        .filter(|t| {
            t["worktreePath"] == cfg.workspace_path.as_str()
                && t["connected"] == true
                && t["writable"] == true
        })
        .filter_map(|t| {
            Some((
                t["title"].as_str()?.to_string(),
                t["handle"].as_str()?.to_string(),
            ))
        })
        .collect())
}

fn is_idle(handle: &str) -> bool {
    orca_json(&[
        "terminal",
        "wait",
        "--terminal",
        handle,
        "--for",
        "tui-idle",
        "--timeout-ms",
        "1500",
    ])
    .map(|v| v["result"]["wait"]["satisfied"] == true)
    .unwrap_or(false)
}

/// What a pane's input box holds, read from the rendered screen.
#[derive(Debug, PartialEq, Clone, Copy)]
enum Prompt {
    Empty,
    Draft,
    CannotTell,
}

/// A full-width rule row of a TUI box (Claude Code draws one above and one below its input box).
fn is_rule(row: &str) -> bool {
    let t = row.trim();
    t.starts_with("──") && t.chars().filter(|c| *c == '─').count() >= 20
}

/// Claude Code: the input box is the LAST pair of rule rows with rows between them, and its first row starts with
/// the prompt mark. Only a bare prompt is empty; any other text, or a second row, is a draft. A `❯ ...` row in the
/// conversation history is not the box: with no box on screen (a picker, a dialog) we cannot tell.
/// The one-row layout idle Claude Code panes show after a turn (seen on cox, nemo and finn, 6 Nov): the input box is
/// collapsed to `❯ <summary> · done H:MM AM` (optionally with a right-aligned status), with no rule rows. Text typed into the pane replaces it, so a row that
/// ends exactly like this is not a draft. Why Claude collapses the box is not known; the shape is what was observed.
fn is_recap_row(row: &str) -> bool {
    let Some(rest) = row.trim_end().strip_prefix('❯') else {
        return false;
    };
    let Some((_, tail)) = rest.rsplit_once(" · done ") else {
        return false;
    };
    // `H:MM`, a space, `AM` or `PM`; then nothing, or a right-aligned status after a run of at least three spaces
    // (Claude Code shows e.g. `1% until auto-compact` there).
    let Some((clock, after)) = tail.split_once(' ') else {
        return false;
    };
    let clock_ok = clock.split_once(':').is_some_and(|(h, m)| {
        (1..=2).contains(&h.len())
            && m.len() == 2
            && h.chars().all(|c| c.is_ascii_digit())
            && m.chars().all(|c| c.is_ascii_digit())
    });
    let Some(status) = after
        .strip_prefix("AM")
        .or_else(|| after.strip_prefix("PM"))
    else {
        return false;
    };
    clock_ok && (status.is_empty() || status.starts_with("   "))
}

fn claude_box(rows: &[String]) -> Prompt {
    if rows
        .iter()
        .rev()
        .find(|r| !r.trim().is_empty())
        .is_some_and(|last| is_recap_row(last))
    {
        return Prompt::Empty;
    }
    let rules: Vec<usize> = rows
        .iter()
        .enumerate()
        .filter(|(_, r)| is_rule(r))
        .map(|(i, _)| i)
        .collect();
    let n = rules.len();
    if n < 2 {
        return Prompt::CannotTell;
    }
    let (top, bottom) = (rules[n - 2], rules[n - 1]);
    if bottom <= top + 1 || !rows[top + 1].trim_start().starts_with('❯') {
        return Prompt::CannotTell;
    }
    if bottom == top + 2 && rows[top + 1].trim() == "❯" {
        // An empty box has exactly two non-blank rows under it (status line, mode row; 13 of 13 live panes on
        // 6 Nov 2026). More means the screen goes on below the frame: after Claude Code exits its last frame
        // stays on screen with the shell under it, and that is not a live box.
        let footer = rows[bottom + 1..]
            .iter()
            .filter(|r| !r.trim().is_empty())
            .count();
        if footer == 2 {
            Prompt::Empty
        } else {
            Prompt::CannotTell
        }
    } else {
        Prompt::Draft
    }
}

/// Codex: the composer is the prompt-mark row (`›`) followed by exactly the two footer rows (the model line,
/// then the hint row), as seen on every Codex pane on 6 Nov 2026. A `›` row anywhere else is history: an old
/// submitted message followed by the answer, with the composer off the captured screen (kai row fc1798dd,
/// mike's pane, held from 12:23Z to 13:03Z as a false "human draft"), so it is `CannotTell`. A draft that wraps
/// onto a second row puts three rows after the mark and is also `CannotTell` (held either way). The placeholder
/// means empty; a numbered option (an update or approval menu) is not an input box; anything else is a draft.
fn codex_box(rows: &[String]) -> Prompt {
    let non_blank: Vec<&str> = rows
        .iter()
        .map(|r| r.trim())
        .filter(|r| !r.is_empty())
        .collect();
    let Some(row) = non_blank
        .len()
        .checked_sub(3)
        .map(|i| non_blank[i])
        .filter(|r| r.starts_with('›'))
    else {
        return Prompt::CannotTell;
    };
    let text = row.trim_start_matches('›').trim();
    let numbered = text
        .split_once('.')
        .is_some_and(|(n, _)| !n.is_empty() && n.chars().all(|c| c.is_ascii_digit()));
    if numbered {
        Prompt::CannotTell
    } else if text.is_empty() || text == "Ask Codex to do anything" {
        Prompt::Empty
    } else {
        Prompt::Draft
    }
}

/// pi (quill's harness, observed on pi 1.5.0): the input box is the LAST pair of pure rule rows. Rows between
/// them are the box: nothing but blank rows means empty (Orca's `read --screen` drops the blank row, a plain
/// terminal keeps it), any text is a draft (a long draft wraps onto more rows). After the bottom rule come an
/// optional command menu, then the cwd row and the status row, so at least two non-blank rows must follow the
/// bottom rule, or these rules are not the box. An EMPTY box needs exactly those two rows and nothing below
/// them: after pi exits its last frame stays on the screen with a shell prompt under it, and that must not read
/// as an empty box. While pi works, the top rule carries a spinner and is no pure
/// rule, so the last pair is then an older one with text between it and the bottom rule: a draft, hence a hold.
/// Known limit: a box holding only spaces cannot be told from an empty one (both read as blank rows).
fn pi_box(rows: &[String]) -> Prompt {
    let rules: Vec<usize> = rows
        .iter()
        .enumerate()
        .filter(|(_, r)| is_rule(r))
        .map(|(i, _)| i)
        .collect();
    let n = rules.len();
    if n < 2 {
        return Prompt::CannotTell;
    }
    let (top, bottom) = (rules[n - 2], rules[n - 1]);
    let footer = rows[bottom + 1..]
        .iter()
        .filter(|r| !r.trim().is_empty())
        .count();
    if footer < 2 {
        return Prompt::CannotTell;
    }
    if rows[top + 1..bottom].iter().all(|r| r.trim().is_empty()) {
        // An EMPTY box has nothing below it but the cwd row and the status row. More rows mean the screen goes
        // on below the frame: after pi exits, its last frame stays on screen with a shell prompt under it
        // (6 Nov 13:48Z, a ring typed into bash), so that is not a live box.
        if footer == 2 {
            Prompt::Empty
        } else {
            Prompt::CannotTell
        }
    } else {
        Prompt::Draft
    }
}

/// What the input box of a pane holds, chosen by Orca's `agentIdentity`. A harness whose box we have not
/// captured (anything new) is `CannotTell`: never guessed.
fn prompt_state(identity: &str, rows: &[String]) -> Prompt {
    match identity {
        "claude" => claude_box(rows),
        "codex" => codex_box(rows),
        "pi" => pi_box(rows),
        _ => Prompt::CannotTell,
    }
}

/// Everything the gate needs to know about one pane, read right before a send.
struct PaneView {
    identity: String,
    rows: Vec<String>,
    draft: Option<String>,
    silent_ms: Option<u64>,
}

#[derive(Debug, PartialEq)]
enum Gate {
    Clear,
    Hold(String),
}

/// May the doorbell type into this pane? Only when a human is not (or cannot be) typing. Every doubt is a Hold.
/// The reason never contains the pane's text: a human's half-written message is not logged.
fn human_gate(v: &PaneView, quiet_secs: u64, unverified_ok: bool) -> Gate {
    if v.draft.as_deref().is_some_and(|d| !d.trim().is_empty()) {
        return Gate::Hold("text waiting in Orca's composer for this pane".into());
    }
    match v.silent_ms {
        None => return Gate::Hold("cannot tell when the pane last produced output".into()),
        Some(ms) if ms < quiet_secs * 1000 => {
            return Gate::Hold(format!(
                "pane output {} s ago (a keystroke echoes)",
                ms / 1000
            ));
        }
        Some(_) => {}
    }
    match prompt_state(&v.identity, &v.rows) {
        Prompt::Empty => Gate::Clear,
        Prompt::Draft => Gate::Hold("text in the input box".into()),
        Prompt::CannotTell if unverified_ok => Gate::Clear,
        Prompt::CannotTell => Gate::Hold(format!(
            "cannot verify the input box (harness '{}')",
            v.identity
        )),
    }
}

/// Read one pane right before a send: who it is and when it last wrote (`show`), and what its screen shows (`read`).
fn pane_view(orca: &str, handle: &str) -> Result<PaneView, String> {
    let show = orca_json_with(orca, &["terminal", "show", "--terminal", handle])?;
    let t = show["result"].get("terminal").unwrap_or(&show["result"]);
    let identity = t["agentIdentity"].as_str().unwrap_or("").to_string();
    let now = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0);
    let silent_ms = t["lastOutputAt"]
        .as_u64()
        .map(|last| now.saturating_sub(last));
    let read = orca_json_with(
        orca,
        &["terminal", "read", "--terminal", handle, "--screen"],
    )?;
    let r = read["result"].get("terminal").unwrap_or(&read["result"]);
    // Only a rendered screen is a screen; accumulated output (`stream`) is not what the human sees.
    let rows = if r["source"] == "screen" {
        r["tail"]
            .as_array()
            .map(|a| {
                a.iter()
                    .filter_map(|x| x.as_str().map(String::from))
                    .collect()
            })
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    let draft = r["draft"].as_str().map(String::from);
    Ok(PaneView {
        identity,
        rows,
        draft,
        silent_ms,
    })
}

#[derive(Debug, PartialEq)]
enum Sent {
    Yes,
    Failed,
    Held(String),
}

/// Look at the pane, and type the ring line only if the gate is clear. Returns `Held` (nothing typed) on any doubt.
fn guarded_send(
    orca: &str,
    handle: &str,
    line: &str,
    quiet_secs: u64,
    unverified_ok: bool,
) -> Sent {
    let view = match pane_view(orca, handle) {
        Ok(v) => v,
        Err(e) => return Sent::Held(format!("cannot read the pane ({e})")),
    };
    if let Gate::Hold(why) = human_gate(&view, quiet_secs, unverified_ok) {
        return Sent::Held(why);
    }
    let ok = Command::new(orca)
        .args([
            "terminal",
            "send",
            "--terminal",
            handle,
            "--text",
            line,
            "--enter",
        ])
        .status()
        .map(|s| s.success())
        .unwrap_or(false);
    if ok { Sent::Yes } else { Sent::Failed }
}

/// A hold is logged every cycle (like "busy, not ringing") and reported to the lead at most once per interval.
fn note_hold(
    cfg: &Config,
    st: &mut WorkerState,
    w: &str,
    why: &str,
    open: usize,
    every: Duration,
    now: Instant,
) {
    log(
        cfg,
        &format!("{w}: human may be typing - {why}; not ringing"),
    );
    if report_due(st.last_hold, every, now) {
        attention(
            cfg,
            &format!("HELD {w}: {why}; {open} open row(s) waiting - not typing"),
        );
        st.last_hold = Some(now);
    }
}

fn ring_line(cfg: &Config, worker: &str, first: &str, n: usize) -> String {
    format!(
        "Doorbell ({lead}@{p}): you have {n} open Cortex handoff(s), first {first}. Check your queue: CORTEX_AGENT={w} CORTEX_AUTH_TOKEN_FILE=$HOME/.kaidera-os/cortex-auth/KOS-Cortex/{p}/{w}.token cortex-handoff --mine {w}",
        lead = cfg.lead,
        p = cfg.project,
        w = worker
    )
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let dry_run = args.iter().any(|a| a == "--dry-run");
    let once = args.iter().any(|a| a == "--once");
    let cfg_path = args
        .windows(2)
        .find(|w| w[0] == "--config")
        .map(|w| PathBuf::from(&w[1]))
        .unwrap_or_else(|| {
            PathBuf::from("/home/azureuser/DevVault/helix/ops/doorbell/doorbell.toml")
        });
    let cfg: Config = match fs::read_to_string(&cfg_path)
        .map_err(|e| e.to_string())
        .and_then(|s| toml::from_str(&s).map_err(|e| e.to_string()))
    {
        Ok(c) => c,
        Err(e) => {
            eprintln!("doorbell: config {}: {e}", cfg_path.display());
            std::process::exit(2);
        }
    };
    let mut states: HashMap<String, WorkerState> = HashMap::new();
    // Every known name (workers + the lead) is used to disambiguate pane titles.
    let mut names: Vec<String> = cfg.workers.iter().map(|w| w.to_lowercase()).collect();
    names.push(cfg.lead.to_lowercase());
    log(
        &cfg,
        &format!(
            "start dry_run={dry_run} once={once} workers={}",
            cfg.workers.join(",")
        ),
    );
    loop {
        // Token read every cycle (it rotates); never logged, never on a command line.
        match fs::read_to_string(&cfg.lead_token_file).map(|t| t.trim().to_string()) {
            Err(e) => log(&cfg, &format!("lead token unreadable: {e}")),
            Ok(token) => match terminals(&cfg) {
                Err(e) => log(&cfg, &format!("skip cycle (no typing): {e}")),
                Ok(terms) => {
                    for w in &cfg.workers {
                        let rows = match open_rows(&cfg, &token, w) {
                            Ok(r) => r,
                            Err(e) => {
                                log(&cfg, &e);
                                continue;
                            }
                        };
                        let open: Vec<(String, bool)> = rows
                            .iter()
                            .filter(|r| eligible(r, w, &cfg.project, &cfg.since_utc))
                            .map(|r| (r.id.clone(), r.status == "pending"))
                            .collect();
                        if open.is_empty() {
                            continue;
                        }
                        let st = states.entry(w.clone()).or_default();
                        let now = Instant::now();
                        let every = Duration::from_secs(cfg.rering_secs);
                        let ring = should_ring(&open, st, every, now);
                        let Some(handle) = pick_terminal(&terms, w, &cfg.aliases, &names) else {
                            if ring {
                                log(
                                    &cfg,
                                    &format!(
                                        "{w}: {} open row(s), no single pane named '{w}' (title or alias)",
                                        open.len()
                                    ),
                                );
                                let m = matching_titles(&terms, w, &cfg.aliases, &names);
                                if m.len() > 1 {
                                    log(
                                        &cfg,
                                        &format!(
                                            "{w}: {} panes name '{w}': {}",
                                            m.len(),
                                            m.join(" | ")
                                        ),
                                    );
                                }
                            }
                            continue;
                        };
                        if !is_idle(&handle) {
                            if ring {
                                log(&cfg, &format!("{w}: busy, not ringing"));
                            }
                            let title = terms
                                .iter()
                                .find(|(_, h)| *h == handle)
                                .map(|(t, _)| t.as_str())
                                .unwrap_or("");
                            let reason = if waiting_title(title, &cfg.attention_titles) {
                                Some(format!("pane title says it waits for a human ('{title}')"))
                            } else {
                                silent_ms(&handle)
                                    .filter(|ms| *ms >= cfg.stuck_secs * 1000)
                                    .map(|ms| {
                                        format!(
                                            "Orca says busy but no output for {} min",
                                            ms / 60_000
                                        )
                                    })
                            };
                            if let Some(why) = reason
                                && report_due(st.last_stuck, every, now)
                            {
                                attention(
                                    &cfg,
                                    &format!(
                                        "STUCK? {w}: {why}, {} open row(s); not typing - lead to look",
                                        open.len()
                                    ),
                                );
                                st.last_stuck = Some(now);
                            }
                            continue;
                        }
                        if !ring {
                            continue;
                        }
                        let first = open
                            .iter()
                            .find(|(id, _)| !st.rung.contains(id))
                            .or_else(|| open.iter().find(|(_, pending)| *pending))
                            .unwrap_or(&open[0])
                            .0
                            .clone();
                        let line = ring_line(&cfg, w, &first, open.len());
                        let off = off_switch(&cfg.state_dir); // re-read right before the keystroke (DB-002)
                        let unverified_ok = cfg
                            .ring_unverified
                            .iter()
                            .any(|u| u.eq_ignore_ascii_case(w));
                        if dry_run || off {
                            // Read-only: show the real decision, including the human-typing guard.
                            let gate = match pane_view("orca", &handle) {
                                Ok(v) => human_gate(&v, cfg.quiet_secs, unverified_ok),
                                Err(e) => Gate::Hold(format!("cannot read the pane ({e})")),
                            };
                            if let Gate::Hold(why) = gate {
                                note_hold(&cfg, st, w, &why, open.len(), every, now);
                                continue;
                            }
                            log(
                                &cfg,
                                &format!(
                                    "{w}: WOULD RING ({}) {}",
                                    if off { "off switch" } else { "dry run" },
                                    first
                                ),
                            );
                        } else {
                            match guarded_send(
                                "orca",
                                &handle,
                                &line,
                                cfg.quiet_secs,
                                unverified_ok,
                            ) {
                                Sent::Held(why) => {
                                    note_hold(&cfg, st, w, &why, open.len(), every, now);
                                    continue;
                                }
                                Sent::Failed => {
                                    log(&cfg, &format!("{w}: rang {first} (SEND FAILED)"));
                                    continue;
                                }
                                Sent::Yes => {
                                    log(&cfg, &format!("{w}: rang {first} (sent)"));
                                    // a separate line, so nothing that reads the line above changes
                                    let title = terms
                                        .iter()
                                        .find(|(_, h)| *h == handle)
                                        .map(|(t, _)| t.as_str())
                                        .unwrap_or("");
                                    log(
                                        &cfg,
                                        &format!("{w}: sent to pane {}", pane_note(&handle, title)),
                                    );
                                }
                            }
                        }
                        st.rung.extend(open.iter().map(|(id, _)| id.clone()));
                        st.last_ring = Some(now);
                    }
                }
            },
        }
        if once {
            break;
        }
        std::thread::sleep(Duration::from_secs(cfg.poll_secs));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn row(id: &str, to: &str, at: &str) -> Row {
        Row {
            id: id.into(),
            status: "pending".into(),
            to_agent: to.into(),
            created_at: at.into(),
        }
    }
    const SINCE: &str = "2026-11-01 00:00:00";

    #[test]
    fn a_null_field_in_a_row_does_not_fail_the_queue_and_the_row_is_not_eligible() {
        // Kit patch 1 (9 Nov 2026): Cortex sends an explicit null for a field a role-addressed row does not have.
        let rows: Vec<Row> = serde_json::from_str(
            r#"[{"id":"a","status":"pending","to_agent":null,"created_at":"2026-11-09 08:00:00.1+00"},
                {"id":"b","status":"pending","to_agent":"sophia@tam","created_at":"2026-11-09 08:00:00.1+00"}]"#,
        )
        .expect("a null field must parse");
        assert_eq!(rows.len(), 2);
        assert!(!eligible(&rows[0], "sophia", "tam", SINCE), "to_agent null is not addressed to the worker");
        assert!(eligible(&rows[1], "sophia", "tam", SINCE));
    }

    #[test]
    fn waiting_title_matches_codex_approval_title_only() {
        let m = vec!["Action Required".to_string()];
        assert!(waiting_title("[ ! ] Action Required | mike | helix", &m));
        assert!(waiting_title("[ ! ] action required | mike", &m));
        assert!(!waiting_title("mike | helix", &m));
        assert!(!waiting_title("[ ! ] Action Required | mike", &[]));
        assert!(!waiting_title("anything", &[String::new()]));
    }

    #[test]
    fn stuck_report_repeats_at_most_once_per_interval() {
        let now = Instant::now();
        let every = Duration::from_secs(1800);
        assert!(report_due(None, every, now), "never reported");
        assert!(
            !report_due(Some(now), every, now + Duration::from_secs(60)),
            "a minute ago"
        );
        assert!(report_due(Some(now), every, now + every), "interval passed");
    }

    #[test]
    fn old_rows_never_eligible() {
        assert!(!eligible(
            &row("a", "cox@helix", "2026-09-27 11:23:12.36+00"),
            "cox",
            "helix",
            SINCE
        ));
        assert!(eligible(
            &row("b", "cox@helix", "2026-11-01 08:28:44.06+00"),
            "cox",
            "helix",
            SINCE
        ));
    }
    #[test]
    fn other_workers_rows_not_eligible() {
        assert!(!eligible(
            &row("c", "mira@helix", "2026-11-01 09:00:00.0+00"),
            "cox",
            "helix",
            SINCE
        ));
        assert!(!eligible(
            &row("d", "cox@kos-infra", "2026-11-01 09:00:00.0+00"),
            "cox",
            "helix",
            SINCE
        ));
    }
    #[test]
    fn malformed_time_not_eligible() {
        assert!(!eligible(&row("e", "cox@helix", ""), "cox", "helix", SINCE));
    }
    #[test]
    fn rings_new_row_then_waits_for_rering() {
        let mut st = WorkerState::default();
        let t0 = Instant::now();
        let open = vec![("r1".to_string(), true)];
        assert!(should_ring(&open, &st, Duration::from_secs(600), t0));
        st.rung.insert("r1".into());
        st.last_ring = Some(t0);
        assert!(!should_ring(
            &open,
            &st,
            Duration::from_secs(600),
            t0 + Duration::from_secs(60)
        ));
        assert!(should_ring(
            &open,
            &st,
            Duration::from_secs(600),
            t0 + Duration::from_secs(601)
        ));
        let open2 = vec![("r1".to_string(), true), ("r2".to_string(), true)];
        assert!(should_ring(
            &open2,
            &st,
            Duration::from_secs(600),
            t0 + Duration::from_secs(60)
        ));
        assert!(!should_ring(
            &[],
            &st,
            Duration::from_secs(600),
            t0 + Duration::from_secs(9999)
        ));
    }
    fn names() -> Vec<String> {
        [
            "cox", "nemo", "finn", "mike", "vera", "mira", "quill", "kai",
        ]
        .iter()
        .map(|s| s.to_string())
        .collect()
    }
    #[test]
    fn terminal_must_be_unique() {
        let none = HashMap::new();
        let n = names();
        let t = vec![
            ("cox".to_string(), "h1".to_string()),
            ("mira".to_string(), "h2".to_string()),
        ];
        assert_eq!(pick_terminal(&t, "cox", &none, &n), Some("h1".into()));
        assert_eq!(pick_terminal(&t, "nemo", &none, &n), None);
        let dup = vec![
            ("cox".to_string(), "h1".to_string()),
            ("Cortex-boot cox".to_string(), "h3".to_string()),
        ];
        assert_eq!(pick_terminal(&dup, "cox", &none, &n), None);
    }
    /// 6 Nov 2026, kai row 7b92b68f C1: a worker with two panes whose titles both name it is skipped, and the log
    /// must say WHICH panes did that (the 13:48Z misfire could not be explained because it did not).
    #[test]
    fn matching_titles_name_every_pane_that_makes_a_worker_ambiguous() {
        let mut al = HashMap::new();
        al.insert("π - helix".to_string(), "quill".to_string());
        let n = vec!["quill".to_string(), "cox".to_string(), "mike".to_string()];
        let panes = vec![
            (
                "π - quill - helix".to_string(),
                "term_b91e2bdc-0c0d".to_string(),
            ),
            ("Pi - quill".to_string(), "term_0fc35e7a-9999".to_string()),
            ("cox".to_string(), "term_c0c0c0c0-1111".to_string()),
        ];
        // both titles name quill, so pick_terminal skips the worker...
        assert_eq!(pick_terminal(&panes, "quill", &al, &n), None);
        // ...and the diagnostic names both panes, handle prefix and title
        let m = matching_titles(&panes, "quill", &al, &n);
        assert_eq!(m.len(), 2, "{m:?}");
        assert!(m[0].contains("term_b91e2bdc") && m[0].contains("π - quill - helix"));
        assert!(m[1].contains("term_0fc35e7a") && m[1].contains("Pi - quill"));
        // a worker with one pane: one entry; none: empty
        assert_eq!(matching_titles(&panes, "cox", &al, &n).len(), 1);
        assert!(matching_titles(&panes, "mike", &al, &n).is_empty());
        // the exact alias "π - helix" and a spinner-prefixed pi title (the titlebar-spinner extension) both name quill
        let two = vec![
            ("π - helix".to_string(), "term_aaaaaaaa-0".to_string()),
            (
                "⠙ π - quill - helix".to_string(),
                "term_bbbbbbbb-0".to_string(),
            ),
        ];
        assert_eq!(matching_titles(&two, "quill", &al, &n).len(), 2);
        // a title that is only a spinner and the folder names nobody
        let nobody = vec![("⠙ π - helix".to_string(), "term_cccccccc-0".to_string())];
        assert!(matching_titles(&nobody, "quill", &al, &n).is_empty());
    }
    #[test]
    fn titles_from_every_harness() {
        let mut al = HashMap::new();
        let n = names();
        al.insert("π - helix".to_string(), "quill".to_string());
        assert_eq!(
            title_worker("vera | helix", &al, &n).as_deref(),
            Some("vera")
        );
        assert_eq!(
            title_worker("Run cortex-boot mike | helix", &al, &n).as_deref(),
            Some("mike")
        );
        assert_eq!(
            title_worker("Cortex-boot cox", &al, &n).as_deref(),
            Some("cox")
        );
        assert_eq!(
            title_worker("π - quill - helix", &al, &n).as_deref(),
            Some("quill")
        );
        assert_eq!(title_worker("π - helix", &al, &n).as_deref(), Some("quill"));
        assert_eq!(title_worker("finn", &al, &n).as_deref(), Some("finn"));
        assert_eq!(title_worker("kai", &al, &n).as_deref(), Some("kai"));
        assert_eq!(title_worker("review cox plan for kai", &al, &n), None);
        assert_eq!(
            title_worker("azureuser@am-dev-01:~/DevVault/helix", &al, &n),
            None
        );
        assert_eq!(title_worker("coxswain notes", &al, &n), None);
    }
    #[test]
    fn off_switch_is_read_at_call_time() {
        let dir = std::env::temp_dir().join(format!("doorbell-test-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let _ = std::fs::remove_file(dir.join("doorbell.off"));
        assert!(!off_switch(&dir));
        std::fs::write(dir.join("doorbell.off"), b"").unwrap();
        assert!(
            off_switch(&dir),
            "switch created mid-cycle must be seen before the next send"
        );
        std::fs::remove_dir_all(&dir).unwrap();
    }
    #[test]
    fn claimed_rows_never_re_ring() {
        let mut st = WorkerState::default();
        let t0 = Instant::now();
        let claimed = vec![("p1".to_string(), false)];
        assert!(
            should_ring(&claimed, &st, Duration::from_secs(1800), t0),
            "a new claimed row still rings once"
        );
        st.rung.insert("p1".into());
        st.last_ring = Some(t0);
        assert!(
            !should_ring(
                &claimed,
                &st,
                Duration::from_secs(1800),
                t0 + Duration::from_secs(99_999)
            ),
            "held rows never re-ring"
        );
    }
    #[test]
    fn ring_line_has_no_row_text_and_no_secret() {
        let cfg = Config {
            api_url: "x".into(),
            project: "helix".into(),
            lead: "kai".into(),
            lead_token_file: "/t".into(),
            workspace_path: "/w".into(),
            since_utc: SINCE.into(),
            poll_secs: 30,
            rering_secs: 600,
            state_dir: "/s".into(),
            workers: vec![],
            aliases: HashMap::new(),
            stuck_secs: 1200,
            attention_titles: vec![],
            quiet_secs: 20,
            ring_unverified: vec![],
        };
        let l = ring_line(&cfg, "cox", "3cb8f6b6", 2);
        assert!(l.contains("cortex-handoff --mine cox") && l.contains("3cb8f6b6"));
        assert!(!l.contains("ctx1_"));
    }

    // ---- human-typing guard (kai row 60fe972a): never type where a human may be typing ----

    const RULE: &str = "─────────────────────────────────────────────────────────────────────────────────────────────";
    fn v(rows: &[&str]) -> Vec<String> {
        rows.iter().map(|x| x.to_string()).collect()
    }
    /// A Claude Code screen: some history, the input box between two rules, then two status rows.
    fn claude_screen(box_rows: &[&str]) -> Vec<String> {
        let mut out = v(&[
            "  ⎿  Tip: Double-tap esc to rewind the code and/or conversation to a previous point in time",
            "❯ Doorbell (kai@helix): you have 1 open Cortex handoff(s), first 11111111. Check your queue",
            "● Done.",
        ]);
        out.push(format!("{RULE} nix ─"));
        out.extend(v(box_rows));
        out.push(RULE.to_string());
        out.extend(v(&[
            "  [azureuser@am-dev-01 helix]",
            "  ⏵⏵ auto mode on (shift+tab to cycle)",
        ]));
        out
    }

    #[test]
    fn claude_box_empty_draft_and_multiline_draft() {
        assert_eq!(
            prompt_state("claude", &claude_screen(&["❯"])),
            Prompt::Empty
        );
        assert_eq!(
            prompt_state("claude", &claude_screen(&["❯ "])),
            Prompt::Empty
        );
        assert_eq!(
            prompt_state("claude", &claude_screen(&["❯ half a message"])),
            Prompt::Draft
        );
        assert_eq!(
            prompt_state("claude", &claude_screen(&["❯ line one", "  line two"])),
            Prompt::Draft
        );
    }

    #[test]
    fn claude_history_line_is_not_the_box() {
        // A screen with a "❯ ..." line in the history but no input box (a picker or dialog on screen).
        let no_box = v(&[
            "❯ Doorbell (kai@helix): you have 1 open Cortex handoff(s)",
            "● Pick one:",
            "  1. first",
            "  2. second",
        ]);
        assert_eq!(prompt_state("claude", &no_box), Prompt::CannotTell);
        assert_eq!(prompt_state("claude", &[]), Prompt::CannotTell);
    }

    #[test]
    fn claude_exited_under_a_stale_frame_is_never_an_empty_box() {
        // Same hazard as pi's (6 Nov 13:48Z): after Claude Code exits, its last frame stays on the screen with the
        // shell under it. Every live Claude pane has exactly two non-blank rows under its box (status line, mode
        // row; 13 of 13 read on 6 Nov), so an empty box needs exactly two.
        let mut exited = claude_screen(&["❯"]);
        exited.extend(v(&[
            "Resume this conversation with: claude --resume 11111111-aaaa",
            "[azureuser@am-dev-01 helix]$",
        ]));
        assert_eq!(prompt_state("claude", &exited), Prompt::CannotTell);
        let mut one = claude_screen(&["❯"]);
        one.push("[azureuser@am-dev-01 helix]$".into());
        assert_eq!(prompt_state("claude", &one), Prompt::CannotTell);
        // a draft under a stale frame is held either way
        let mut draft = claude_screen(&["❯ half"]);
        draft.push("[azureuser@am-dev-01 helix]$".into());
        assert_ne!(prompt_state("claude", &draft), Prompt::Empty);
        // the live shape stays empty
        assert_eq!(
            prompt_state("claude", &claude_screen(&["❯"])),
            Prompt::Empty
        );
    }

    /// The two footer rows under a Codex composer, as observed on 6 Nov 2026 on four Codex panes (vera, scribe,
    /// sam; kai row fc1798dd): the model line, then the hint row.
    const CODEX_FOOTER: [&str; 2] = [
        "  GPT-6.1-Sol high · ~/DevVault/helix",
        "  ← for agents · ctrl+t transcript",
    ];
    fn codex_screen(history: &[&str], composer: &[&str]) -> Vec<String> {
        let mut out = v(history);
        out.extend(v(composer));
        out.extend(v(&CODEX_FOOTER));
        out
    }

    #[test]
    fn codex_placeholder_draft_and_modal() {
        let empty = codex_screen(&["• Done.", ""], &["› Ask Codex to do anything", ""]);
        assert_eq!(prompt_state("codex", &empty), Prompt::Empty);
        let draft = codex_screen(&["• Done.", ""], &["› please also check the", ""]);
        assert_eq!(prompt_state("codex", &draft), Prompt::Draft);
        // trailing blank rows below the footer change nothing
        let mut padded = empty.clone();
        padded.extend(v(&["", ""]));
        assert_eq!(prompt_state("codex", &padded), Prompt::Empty);
        let modal = v(&[
            "  Update available",
            "› 1. Update now (runs `sh -c 'x'`)",
            "  2. Skip",
        ]);
        assert_eq!(prompt_state("codex", &modal), Prompt::CannotTell);
    }

    #[test]
    fn codex_old_prompt_mark_in_the_history_is_not_the_box() {
        // kai row fc1798dd, mike's pane: the composer is NOT on the captured screen, its last row is
        // "Worked for ...". The last row that starts with the prompt mark is an OLD submitted doorbell message,
        // followed by mike's answer. That is history, not a draft: the box cannot be told.
        let mike = v(&[
            "› Doorbell (kai@helix): you have 1 open Cortex handoff(s), first 11111111. Check your queue",
            "",
            "• Ran CORTEX_AGENT=mike cortex-handoff --show 11111111",
            "  └ Completion report: {}",
            "",
            "• Ran sha256sum review.md",
            "",
            "─ Worked for 15s • 11:45 AM ─────────────────────────────",
        ]);
        assert_eq!(prompt_state("codex", &mike), Prompt::CannotTell);
        // even when the answer after the old message is exactly two non-blank rows long, an OLD message is
        // never an empty box (never rung over it); it may only read as a draft or as unknown
        let two = v(&[
            "› an old submitted message",
            "• answer row one",
            "  answer row two",
        ]);
        assert_ne!(prompt_state("codex", &two), Prompt::Empty);
    }

    #[test]
    fn codex_composer_must_be_followed_only_by_the_footer() {
        // a draft that wraps onto a second row: three non-blank rows follow the prompt mark, so it is not
        // told (held either way; it is never rung unless the worker is in ring_unverified)
        let wrapped = codex_screen(
            &["• Done.", ""],
            &["› a long draft that wraps", "  onto a second row"],
        );
        assert_eq!(prompt_state("codex", &wrapped), Prompt::CannotTell);
        // a prompt mark with no footer after it at all
        assert_eq!(
            prompt_state("codex", &v(&["• Done.", "› Ask Codex to do anything"])),
            Prompt::CannotTell
        );
        // one footer row only
        assert_eq!(
            prompt_state(
                "codex",
                &v(&["• Done.", "› Ask Codex to do anything", "  gpt-5 high"])
            ),
            Prompt::CannotTell
        );
    }

    #[test]
    fn codex_exited_under_a_stale_frame_is_never_an_empty_box() {
        // Kai row 7b92b68f: one EXITED-harness test per harness (pi and Claude Code have theirs). After Codex
        // exits, its last frame stays on screen with its resume hint and the shell prompt under it. This test
        // is already satisfied by the exactly-two-footer-rows rule of fc1798dd; it pins that rule for exits.
        let mut exited = codex_screen(&["• Done.", ""], &["› Ask Codex to do anything", ""]);
        exited.extend(v(&[
            "To continue this session, run codex resume 11111111-aaaa",
            "[azureuser@am-dev-01 helix]$",
        ]));
        assert_eq!(prompt_state("codex", &exited), Prompt::CannotTell);
        let mut one = codex_screen(&["• Done."], &["› Ask Codex to do anything"]);
        one.push("[azureuser@am-dev-01 helix]$".into());
        assert_eq!(prompt_state("codex", &one), Prompt::CannotTell);
        // a draft under a stale frame is held either way
        let mut draft = codex_screen(&["• Done."], &["› half a thought"]);
        draft.push("[azureuser@am-dev-01 helix]$".into());
        assert_ne!(prompt_state("codex", &draft), Prompt::Empty);
        // the live shape stays empty
        assert_eq!(
            prompt_state(
                "codex",
                &codex_screen(&["• Done."], &["› Ask Codex to do anything"])
            ),
            Prompt::Empty
        );
    }

    #[test]
    fn codex_pane_without_a_composer_is_held_as_unreadable_not_as_a_human_draft() {
        let mike = v(&[
            "› an old submitted message",
            "• answer",
            "  more answer",
            "  even more",
            "─ Worked for 15s ─────",
        ]);
        let g = human_gate(&view("codex", mike, None, Some(300_000)), 20, false);
        match g {
            Gate::Hold(r) => assert!(r.contains("cannot verify"), "{r}"),
            Gate::Clear => panic!("must hold"),
        }
        // the same pane with an empty composer on screen is Clear
        let ok = codex_screen(&["• Done."], &["› Ask Codex to do anything"]);
        assert_eq!(
            human_gate(&view("codex", ok, None, Some(300_000)), 20, false),
            Gate::Clear
        );
    }

    /// A pi 1.5.0 screen as observed on 6 Nov 2026 (kai row 89e2265a; my own throwaway pi under a pty, and quill's
    /// idle pane read through Orca): history, the top rule, the box rows, the bottom rule, an optional command
    /// menu, then the cwd row and the status row. Orca's `read --screen` drops the blank row of an empty box
    /// (rule directly followed by rule); a plain terminal keeps it (rule, blank row, rule).
    fn pi_screen(box_rows: &[&str], menu: &[&str]) -> Vec<String> {
        let mut out = v(&[" Session compacted 1 time", " Session name set: quill"]);
        out.push(RULE.to_string());
        out.extend(v(box_rows));
        out.push(RULE.to_string());
        out.extend(v(menu));
        out.extend(v(&[
            "~/DevVault/helix • quill",
            "↑1M ↓2k R3M CH99.9% $1.00                                  0.0%/1.0M (auto)",
        ]));
        out
    }

    #[test]
    fn pi_box_empty_in_both_renderings() {
        // as Orca returns it: the two rules are adjacent
        assert_eq!(prompt_state("pi", &pi_screen(&[], &[])), Prompt::Empty);
        // as a terminal draws it: one blank row between the rules (or more)
        assert_eq!(prompt_state("pi", &pi_screen(&[""], &[])), Prompt::Empty);
        assert_eq!(
            prompt_state("pi", &pi_screen(&["", ""], &[])),
            Prompt::Empty
        );
        assert_eq!(prompt_state("pi", &pi_screen(&["   "], &[])), Prompt::Empty);
    }

    #[test]
    fn pi_box_draft_wrapped_draft_and_command_menu() {
        assert_eq!(
            prompt_state("pi", &pi_screen(&["half a message"], &[])),
            Prompt::Draft
        );
        // a long draft wraps onto several rows
        assert_eq!(
            prompt_state("pi", &pi_screen(&["xxxxxxxxxxxxxxxxxxxx", "xxxxx"], &[])),
            Prompt::Draft
        );
        // a draft that is only "/" opens a command menu BELOW the bottom rule: still a draft
        let menu = [
            "→ settings                      Open settings menu",
            "  model                         Select model",
            "  tree                          Navigate session tree",
            "  (1/32)",
        ];
        assert_eq!(prompt_state("pi", &pi_screen(&["/"], &menu)), Prompt::Draft);
    }

    #[test]
    fn pi_box_busy_or_missing_is_never_empty() {
        // while pi works the top rule carries the spinner, so only ONE pure rule row is on screen
        let mut busy = v(&[
            "● did something",
            "⠹ Working ─────────────────────────────────",
        ]);
        busy.push(String::new());
        busy.push(RULE.to_string());
        busy.extend(v(&["~/DevVault/helix • quill", "↑1M ↓2k R3M"]));
        assert_eq!(prompt_state("pi", &busy), Prompt::CannotTell);
        // an older pure rule in the history must not be taken for the box's top edge
        let mut older = v(&["note", RULE, "text of the history"]);
        older.extend(busy.clone());
        assert_ne!(prompt_state("pi", &older), Prompt::Empty);
        // nothing at all, history only, a single rule
        assert_eq!(prompt_state("pi", &[]), Prompt::CannotTell);
        assert_eq!(prompt_state("pi", &v(&["a", "b", "c"])), Prompt::CannotTell);
        assert_eq!(
            prompt_state("pi", &v(&["a", RULE, "b", "c"])),
            Prompt::CannotTell
        );
    }

    #[test]
    fn pi_box_rules_must_be_followed_by_the_footer() {
        // two rules at the very end, or with one row after them, are not pi's box (cwd row + status row follow)
        let mut a = v(&["history"]);
        a.extend(v(&[RULE, RULE]));
        assert_eq!(prompt_state("pi", &a), Prompt::CannotTell);
        let mut b = a.clone();
        b.push("~/DevVault/helix • quill".into());
        assert_eq!(prompt_state("pi", &b), Prompt::CannotTell);
        b.push("status row".into());
        assert_eq!(prompt_state("pi", &b), Prompt::Empty);
        // ...and EXACTLY those two: a third row means the screen goes on below the frame
        b.push("a shell prompt".into());
        assert_eq!(prompt_state("pi", &b), Prompt::CannotTell);
    }

    /// 6 Nov 2026 13:48Z, the misfire of the first pi build: pi had EXITED in the pane and a bash prompt was
    /// showing, but the last frame of pi (rule, rule, cwd row, status row) was still on the screen above it, and
    /// Orca still said "pi". The ring line went to bash ("syntax error near unexpected token"). Shapes only.
    fn pi_exited_screen(after_frame: &[&str]) -> Vec<String> {
        let mut out = v(&[" Operation aborted"]);
        out.push(RULE.to_string());
        out.push(RULE.to_string());
        out.extend(v(&[
            "~/DevVault/helix • quill",
            "↑12M ↓776k R515M $7.430 22.0%/1.0M (auto)",
        ]));
        out.extend(v(after_frame));
        out
    }

    #[test]
    fn pi_exited_under_a_stale_frame_is_never_an_empty_box() {
        // pi has just exited: its resume hint and the shell prompt follow the old frame
        let just_exited = pi_exited_screen(&[
            "To resume this session: pi --session 11111111-aaaa",
            "[azureuser@am-dev-01 helix]$",
        ]);
        assert_eq!(prompt_state("pi", &just_exited), Prompt::CannotTell);
        // after somebody (or a ring) typed a line at that prompt and bash answered
        let after_ring = pi_exited_screen(&[
            "To resume this session: pi --session 11111111-aaaa",
            "[azureuser@am-dev-01 helix]$ Doorbell (kai@helix): you have 1 open Cortex handoff(s)",
            "bash: syntax error near unexpected token `('",
            "[azureuser@am-dev-01 helix]$",
        ]);
        assert_eq!(prompt_state("pi", &after_ring), Prompt::CannotTell);
        // a single shell row under the frame is also more than the footer
        let one_row = pi_exited_screen(&["[azureuser@am-dev-01 helix]$"]);
        assert_eq!(prompt_state("pi", &one_row), Prompt::CannotTell);
        // and the live idle box with the same frame and nothing under it is still empty
        assert_eq!(prompt_state("pi", &pi_exited_screen(&[])), Prompt::Empty);
    }

    #[test]
    fn unverifiable_harnesses_cannot_be_told() {
        // a pi-looking screen with no box on it must not be guessed
        let pi = v(&["── ⠸ working ──", "──", "~/helix • main"]);
        assert_eq!(prompt_state("pi", &pi), Prompt::CannotTell);
        assert_eq!(prompt_state("", &claude_screen(&["❯"])), Prompt::CannotTell);
        assert_eq!(
            prompt_state("some-new-harness", &claude_screen(&["❯"])),
            Prompt::CannotTell
        );
    }

    fn view(
        identity: &str,
        rows: Vec<String>,
        draft: Option<&str>,
        silent_ms: Option<u64>,
    ) -> PaneView {
        PaneView {
            identity: identity.into(),
            rows,
            draft: draft.map(|d| d.to_string()),
            silent_ms,
        }
    }

    #[test]
    fn gate_has_exactly_one_clear_row() {
        let ok = || view("claude", claude_screen(&["❯"]), None, Some(60_000));
        assert_eq!(human_gate(&ok(), 20, false), Gate::Clear);
        // an empty composer draft is no draft
        let empty_draft = view("claude", claude_screen(&["❯"]), Some(""), Some(60_000));
        assert_eq!(human_gate(&empty_draft, 20, false), Gate::Clear);
        // exactly quiet_secs of silence is enough
        let edge = view("claude", claude_screen(&["❯"]), None, Some(20_000));
        assert_eq!(human_gate(&edge, 20, false), Gate::Clear);
        let held = |g: Gate| matches!(g, Gate::Hold(_));
        // Orca composer draft
        let d = view(
            "claude",
            claude_screen(&["❯"]),
            Some("half a thought"),
            Some(60_000),
        );
        assert!(held(human_gate(&d, 20, false)));
        // text in the input box
        let b = view(
            "claude",
            claude_screen(&["❯ half a thought"]),
            None,
            Some(60_000),
        );
        assert!(held(human_gate(&b, 20, false)));
        // output 5 s ago
        let q = view("claude", claude_screen(&["❯"]), None, Some(5_000));
        assert!(held(human_gate(&q, 20, false)));
        // output time unknown
        let u = view("claude", claude_screen(&["❯"]), None, None);
        assert!(held(human_gate(&u, 20, false)));
        // box cannot be read
        let c = view(
            "some-new-harness",
            claude_screen(&["❯"]),
            None,
            Some(60_000),
        );
        assert!(held(human_gate(&c, 20, false)));
    }

    #[test]
    fn unverified_list_relaxes_only_the_unreadable_box() {
        let c = || view("pi", v(&["no", "box"]), None, Some(60_000));
        assert_eq!(human_gate(&c(), 20, true), Gate::Clear);
        // ...but never a draft, a recent keystroke echo, or a text we CAN read in the box
        let d = view("pi", v(&["no", "box"]), Some("x"), Some(60_000));
        assert!(matches!(human_gate(&d, 20, true), Gate::Hold(_)));
        let q = view("pi", v(&["no", "box"]), None, Some(1_000));
        assert!(matches!(human_gate(&q, 20, true), Gate::Hold(_)));
        let b = view("claude", claude_screen(&["❯ text"]), None, Some(60_000));
        assert!(matches!(human_gate(&b, 20, true), Gate::Hold(_)));
    }

    #[test]
    fn hold_reason_never_contains_the_humans_text() {
        let secret = "my private half written sentence";
        let d = view("claude", claude_screen(&["❯"]), Some(secret), Some(60_000));
        let b = view(
            "claude",
            claude_screen(&[&format!("❯ {secret}")]),
            None,
            Some(60_000),
        );
        for g in [human_gate(&d, 20, false), human_gate(&b, 20, false)] {
            match g {
                Gate::Hold(r) => assert!(!r.contains("private") && !r.contains("sentence"), "{r}"),
                Gate::Clear => panic!("must hold"),
            }
        }
    }

    // ---- send path with a fake `orca`: how many times is `send` called? ----

    struct Shim {
        bin: PathBuf,
        calls: PathBuf,
        dir: PathBuf,
    }
    impl Shim {
        fn new(
            tag: &str,
            identity: &str,
            rows: &[String],
            draft: Option<&str>,
            silent_ms: u64,
            read_fails: bool,
        ) -> Shim {
            let dir =
                std::env::temp_dir().join(format!("doorbell-shim-{}-{}", std::process::id(), tag));
            let _ = std::fs::remove_dir_all(&dir);
            std::fs::create_dir_all(&dir).unwrap();
            let now = SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64;
            let show = serde_json::json!({"ok": true, "result": {"terminal": {
                "handle": "h1", "agentIdentity": identity, "lastOutputAt": now - silent_ms}}});
            let mut term = serde_json::json!({"handle": "h1", "status": "running", "source": "screen", "tail": rows});
            if let Some(d) = draft {
                term["draft"] = serde_json::Value::String(d.to_string());
            }
            let read = serde_json::json!({"ok": true, "result": {"terminal": term}});
            std::fs::write(dir.join("show.json"), show.to_string()).unwrap();
            std::fs::write(dir.join("read.json"), read.to_string()).unwrap();
            if read_fails {
                std::fs::write(dir.join("readfail"), b"").unwrap();
            }
            let bin = dir.join("orca");
            let script = format!(
                "#!/bin/sh\necho \"$*\" >> '{d}/calls'\ncase \"$2\" in\n show) cat '{d}/show.json' ;;\n read) [ -f '{d}/readfail' ] && exit 1; cat '{d}/read.json' ;;\n send) echo '{{\"ok\":true}}' ;;\n *) exit 1 ;;\nesac\n",
                d = dir.display()
            );
            std::fs::write(&bin, script).unwrap();
            let mut perm = std::fs::metadata(&bin).unwrap().permissions();
            std::os::unix::fs::PermissionsExt::set_mode(&mut perm, 0o755);
            std::fs::set_permissions(&bin, perm).unwrap();
            Shim {
                calls: dir.join("calls"),
                bin,
                dir,
            }
        }
        fn sends(&self) -> usize {
            std::fs::read_to_string(&self.calls)
                .unwrap_or_default()
                .lines()
                .filter(|l| l.starts_with("terminal send"))
                .count()
        }
        fn run(&self) -> Sent {
            guarded_send(self.bin.to_str().unwrap(), "h1", "ring line", 20, false)
        }
    }
    impl Drop for Shim {
        fn drop(&mut self) {
            let _ = std::fs::remove_dir_all(&self.dir);
        }
    }

    #[test]
    fn send_is_called_zero_times_whenever_a_human_may_be_typing() {
        let clear = claude_screen(&["❯"]);
        let cases: Vec<(&str, Shim)> = vec![
            (
                "composer draft",
                Shim::new("a", "claude", &clear, Some("half a thought"), 60_000, false),
            ),
            (
                "text in the box",
                Shim::new(
                    "b",
                    "claude",
                    &claude_screen(&["❯ half a thought"]),
                    None,
                    60_000,
                    false,
                ),
            ),
            (
                "output 5 s ago",
                Shim::new("c", "claude", &clear, None, 5_000, false),
            ),
            (
                "screen unreadable",
                Shim::new("d", "claude", &clear, None, 60_000, true),
            ),
            (
                "pi, no box on screen",
                Shim::new("e", "pi", &v(&["● text", "no box"]), None, 60_000, false),
            ),
            (
                "pi, text in the box",
                Shim::new(
                    "e2",
                    "pi",
                    &pi_screen(&["half a thought"], &[]),
                    None,
                    60_000,
                    false,
                ),
            ),
            (
                "pi, empty box but output 5 s ago",
                Shim::new("e3", "pi", &pi_screen(&[], &[]), None, 5_000, false),
            ),
            (
                "pi, empty box but a composer draft",
                Shim::new("e4", "pi", &pi_screen(&[], &[]), Some("x"), 60_000, false),
            ),
            (
                "pi exited, stale frame above a shell prompt",
                Shim::new(
                    "e5",
                    "pi",
                    &pi_exited_screen(&[
                        "To resume this session: pi --session 11111111-aaaa",
                        "[azureuser@am-dev-01 helix]$",
                    ]),
                    None,
                    60_000,
                    false,
                ),
            ),
            (
                "claude exited, stale frame above a shell prompt",
                Shim::new(
                    "e6",
                    "claude",
                    &{
                        let mut s = claude_screen(&["❯"]);
                        s.extend(v(&[
                            "Resume this conversation with: claude --resume 11111111-aaaa",
                            "[azureuser@am-dev-01 helix]$",
                        ]));
                        s
                    },
                    None,
                    60_000,
                    false,
                ),
            ),
            (
                "no box on screen",
                Shim::new("f", "claude", &v(&["❯ old", "● text"]), None, 60_000, false),
            ),
        ];
        for (why, shim) in &cases {
            let out = shim.run();
            assert!(
                matches!(out, Sent::Held(_)),
                "{why}: expected Held, got {out:?}"
            );
            assert_eq!(shim.sends(), 0, "{why}: send was called");
        }
    }

    #[test]
    fn send_is_called_once_for_an_idle_pi_pane_with_an_empty_box() {
        for (name, screen) in [("p1", pi_screen(&[], &[])), ("p2", pi_screen(&[""], &[]))] {
            let shim = Shim::new(name, "pi", &screen, None, 60_000, false);
            assert_eq!(shim.run(), Sent::Yes, "{name}");
            assert_eq!(shim.sends(), 1, "{name}");
        }
    }

    #[test]
    fn pi_gate_has_one_clear_row() {
        let ok = || view("pi", pi_screen(&[], &[]), None, Some(60_000));
        assert_eq!(human_gate(&ok(), 20, false), Gate::Clear);
        let held = |g: Gate| matches!(g, Gate::Hold(_));
        assert!(held(human_gate(
            &view("pi", pi_screen(&["x"], &[]), None, Some(60_000)),
            20,
            false
        )));
        assert!(held(human_gate(
            &view("pi", pi_screen(&[], &[]), None, Some(1_000)),
            20,
            false
        )));
        assert!(held(human_gate(
            &view("pi", pi_screen(&[], &[]), Some("x"), Some(60_000)),
            20,
            false
        )));
        assert!(held(human_gate(
            &view("pi", pi_screen(&[], &[]), None, None),
            20,
            false
        )));
    }

    #[test]
    fn send_is_called_once_when_everything_is_clear() {
        let shim = Shim::new("g", "claude", &claude_screen(&["❯"]), None, 60_000, false);
        assert_eq!(shim.run(), Sent::Yes);
        assert_eq!(shim.sends(), 1);
        let calls = std::fs::read_to_string(&shim.calls).unwrap();
        let send = calls
            .lines()
            .find(|l| l.starts_with("terminal send"))
            .unwrap();
        assert!(
            send.contains("--text ring line") && send.contains("--enter"),
            "{send}"
        );
        // the checks come first: show and read were called before the send
        let first_send = calls
            .lines()
            .position(|l| l.starts_with("terminal send"))
            .unwrap();
        assert!(
            calls
                .lines()
                .take(first_send)
                .any(|l| l.starts_with("terminal read"))
        );
    }

    #[test]
    fn accumulated_output_is_not_a_screen() {
        let shim = Shim::new("h", "claude", &claude_screen(&["❯"]), None, 60_000, false);
        let read = std::fs::read_to_string(shim.dir.join("read.json"))
            .unwrap()
            .replace("\"screen\"", "\"stream\"");
        std::fs::write(shim.dir.join("read.json"), read).unwrap();
        assert!(matches!(shim.run(), Sent::Held(_)));
        assert_eq!(shim.sends(), 0);
    }

    /// Read-only report on the REAL panes, with no Cortex token and no typing:
    ///   DOORBELL_LIVE_CONFIG=<doorbell.toml> cargo test live_gate_report -- --ignored --nocapture
    #[test]
    #[ignore]
    fn live_gate_report() {
        let path = std::env::var("DOORBELL_LIVE_CONFIG").expect("set DOORBELL_LIVE_CONFIG");
        let cfg: Config = toml::from_str(&std::fs::read_to_string(path).unwrap()).unwrap();
        let mut names: Vec<String> = cfg.workers.iter().map(|w| w.to_lowercase()).collect();
        names.push(cfg.lead.to_lowercase());
        let terms = terminals(&cfg).unwrap();
        for w in &cfg.workers {
            let Some(h) = pick_terminal(&terms, w, &cfg.aliases, &names) else {
                println!("{w:8} no single pane");
                continue;
            };
            let unverified_ok = cfg
                .ring_unverified
                .iter()
                .any(|u| u.eq_ignore_ascii_case(w));
            match pane_view("orca", &h) {
                Err(e) => println!("{w:8} cannot read: {e}"),
                Ok(v) => println!(
                    "{w:8} harness={:8} box={:?} composer_draft_chars={} silent_s={:?} -> {:?}",
                    v.identity,
                    prompt_state(&v.identity, &v.rows),
                    v.draft.as_deref().map(str::len).unwrap_or(0),
                    v.silent_ms.map(|m| m / 1000),
                    human_gate(&v, cfg.quiet_secs, unverified_ok)
                ),
            }
        }
    }

    #[test]
    fn claude_recap_row_is_an_empty_prompt_but_a_draft_never_is() {
        // Real last rows of idle Claude panes (cox, nemo, finn on 6 Nov 09:3xZ): the box is collapsed to one
        // recap row; nothing is typed in it.
        for last in [
            "❯\u{a0}Baked for 19s · done 9:24 AM",
            "❯\u{a0}Sautéed for 17s · done 9:23 AM",
            "❯\u{a0}Check your queue · done 9:24 AM",
            // cox, 6 Nov 09:3xZ: Claude Code adds a right-aligned status to the same row
            "❯\u{a0}Baked for 19s · done 9:24 AM                                                                1% until auto-compact",
        ] {
            let mut rows = v(&["● Done.", "  - Open rows: only 765cf544"]);
            rows.push(last.to_string());
            assert_eq!(prompt_state("claude", &rows), Prompt::Empty, "{last}");
        }
        // A draft typed in such a pane replaces the recap, so none of these may read as empty.
        for last in [
            "❯ half a message",
            "❯\u{a0}half a message",
            "❯\u{a0}Baked for 19s · done 9:2",
            "❯\u{a0}Baked for 19s · done 9:24 AM and then some",
            "❯\u{a0}hello · done 9:24 AM  and more",
            "Baked for 19s · done 9:24 AM",
        ] {
            let mut rows = v(&["● Done."]);
            rows.push(last.to_string());
            assert_eq!(prompt_state("claude", &rows), Prompt::CannotTell, "{last}");
        }
        // the recap row followed by a real box: the box decides
        let mut rows = v(&["❯\u{a0}Check your queue · done 9:24 AM"]);
        rows.push(format!("{RULE} nix ─"));
        rows.push("❯ typing now".to_string());
        rows.push(RULE.to_string());
        assert_eq!(prompt_state("claude", &rows), Prompt::Draft);
    }
}
