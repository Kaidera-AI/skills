# Metrics: leading and lagging, per stage, with where we read them

Leading measures tell you the loop is working this week; lagging measures tell you it
worked. Read them from timestamps that already exist: git, Cortex handoffs and decisions,
gate records, CI and fitness runs, the incident record. Do not build a dashboard before the
numbers exist.

| Stage | Leading | Lagging | Kaidera source |
|---|---|---|---|
| Intent | hours from first conversation to committed intent | survival rate of intents into spec; spec churn after acceptance | git timestamps; handoff created_at and claimed_at |
| Spec | elapsed intent to spec | spec commits after the first plan (requirements rework) | git log on the epic folder |
| Plan and build | share of changes merging from the first pass; concurrent streams per reviewer while quality holds | rework cycles per change; merged diff still matching the plan | handoff returns, fold branch history, `verify-change-scope.sh` |
| Verify | first-pass suite success for agent-written changes; eval pass rate | review time per change; change failure rate; regressions caught in CI versus in production | suite exit codes captured to files; evals in CI; incident record |
| Review and ship | time to first review; share of findings resolved without a human on the branch; time waiting at each gate | defects and vulnerabilities caught before merge versus escaped; stale gate records found before the go | gate record timestamps and SHAs under `Program/<release>/gates/`; handoff timestamps; review verdicts; release receipts |
| Maintain | band breach to intent in the triage queue; share of connected repos on a scan schedule | share of findings that became merged fixes; repeat incidents per class | bands log; Cortex lessons; scan reports |
| Knowledge | how often an agent repeats a mistake a rule should have caught; time from policy change to merged skill change | time to first merged change for a new agent or joiner | Cortex lessons; skills repo history |

Rules for using them: one owner per number; a number nobody reads is deleted; a number that
never moves is replaced. Report a measure with its source line, never as prose.
