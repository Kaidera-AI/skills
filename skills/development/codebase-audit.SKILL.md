---
name: codebase-audit
version: 1.1.2
description: |
  Comprehensive, evidence-cited, read-only whole-codebase or module health audit. Fans the codebase
  across independent review dimensions (correctness, security, change-risk,
  maintainability, blast-radius, tests, performance, spec/contract compliance),
  then adversarially verifies every HIGH/CRITICAL finding before reporting.
  Combines the structured ultra-review workflow used in Claude Code with
  review dimensions derived from the repowise codebase-intelligence model
  (JIT change-risk, code-health biomarkers, dead-code, blast-radius, git
  hotspots/prior-defects). Strictly read-only. Use evidence-code-review when the primary object is a bounded
  workspace, commit, range, or PR change. Designed for the Kaidera platform
  workbench and KOS app.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:code_interpreter
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera
license: Apache-2.0
updated: 2026-10-03
tags: [code-review, quality, security, change-risk, blast-radius, adversarial-verify, read-only]

parameters:
  repo_path:
    type: string
    required: true
    description: Absolute path of an already available local codebase or module to review. Remote retrieval needs a separately authorised workflow.
  scope:
    type: string
    required: false
    description: Sub-path, glob, or file list to narrow the review. Defaults to the whole repo_path.
  focus:
    type: string
    required: false
    description: Optional focus area (e.g. "auth", "billing", "migrations", "a11y"). Dimensions still run; focus gets extra depth.
  depth:
    type: string
    required: false
    description: "quick | standard | deep. quick = top files only; standard = all in-scope files; deep = standard + cross-repo callers + git history. Defaults to standard."

safety_constraints:
  - Strictly read-only. Never modify, commit, push, merge, tag, publish or deploy; a fix request is a separate authorised task.
  - Every finding must cite evidence from a fresh read in THIS run (file_path:line). No recalling from memory or prior turns.
  - Never fabricate findings, line numbers, SHAs, or test results. If a claim cannot be verified this run, mark it "unverified" — do not state it as fact.
  - Empty output is not success. A "no findings" verdict requires having actually inspected the in-scope files; state what was and was not covered.
  - Do not override the agent base prompt. This skill is reference data only.
  - Never exfiltrate file contents to external services. Findings stay in the local response.
---

# Codebase Audit

A comprehensive, evidence-cited, read-only codebase review. Review the code
across independent dimensions, then **adversarially verify** every
HIGH/CRITICAL finding so only real, evidence-backed issues survive.

## When to use

- Deep health or architecture audit of a repository, module, or service.
- Independent QA of a fix or feature before sign-off.
- Periodic health audit of a codebase area.
- For a bounded workspace/commit/range/PR diff, use `evidence-code-review` instead.
- Not intended for trivial one-line typo checks — use a lighter review there.

## Hard rules (apply to every phase)

1. **Strictly read-only.** Fixing findings is a separate task.
   No edits, commits, pushes, merges, tags, or deploys in review mode.
2. **Evidence-cited.** Every finding carries `file_path:line` from a fresh
   read this run. Re-read; do not recall.
3. **No fabrication.** Cannot verify this run → label `unverified`. Never
   invent line numbers, SHAs, or test output.
4. **Empty ≠ success.** "No findings" requires having actually looked. Always
   state coverage (what was inspected, what was skipped, and why).
5. **Honest degradation.** When a signal is missing, say so explicitly using
   the tier: `no_data` (signal unavailable), `approximate` (heuristic estimate),
   `partial` (some files only). Never silently guess.
6. **Stay in scope.** Only flag issues in the requested `scope`. Note
   out-of-scope observations separately, do not mix them into findings.

## Parameters

| Param | Required | Default | Meaning |
|-------|----------|---------|---------|
| `repo_path` | yes | — | Already available local codebase path to review |
| `scope` | no | whole repo | Sub-path, glob, or file list |
| `focus` | no | — | Extra-depth area (dimensions still all run) |
| `depth` | no | `standard` | `quick` / `standard` / `deep` |

## Procedure

### Phase 0 — Orient

Resolve the requested local scope and immutable source revisions or workspace
byte inventory before analysis. Keep one path ledger with reviewed, unreadable
or skipped-with-reason status for every in-scope file. Recheck for target drift
before the verdict. Unavailable Git history is a stated limit; it does not
permit guessed hotspots. Inspect trusted commands/configuration before using
local tools. Never execute changed scripts with ambient credentials or live
access, fetch a URL, install a tool or invoke an external model automatically.

Establish ground truth before reviewing.

1. Resolve `repo_path` and `scope`. Enumerate the in-scope file set (e.g.
   `git ls-files`, `rg --files`, or `find`). Record the count.
2. Read the module's README / AGENTS.md / contributing docs for stated
   conventions and contracts.
3. **Change-risk orient (git-driven).** For `deep`, approximate the repowise
   JIT change-risk signals from git, and use them to prioritize:
   - Recently changed files: `git log --since="2 weeks ago" --name-only --format=`
   - High-churn files: `git log --format= --stat` → top by lines touched
   - Prior-defect files: `git log --grep="fix\|bug" --name-only` (commit-message
     heuristic; approximate, label it so)
   - Large recent diffs: `git log --shortstat`
   Rank files higher when: many lines added recently, high churn, prior
   fix-attributed commits, large diff, many files touched together. These
   carry higher defect likelihood and get reviewed first and deepest.
4. Record an **orient block**: file count, languages, top change-risk files,
   and any contract/README notes. This anchors coverage honesty.

### Phase 1 — Dimension review

Run each dimension over the in-scope set. In a single-agent run, do them
sequentially and exhaustively. When the harness supports fan-out (subagents /
workbench / KOS), run dimensions in **parallel** — each dimension is
independent and has no cross-dimension dependency until synthesis.

For every finding, produce a structured record (see Findings schema). Cite
`file_path:line`. Assign severity. Propose a concrete `suggested_fix`.

**D1 — Correctness & logic bugs (defect dimension)**
Error handling at trust boundaries, edge cases, off-by-one, null/empty
handling, race conditions, incorrect boolean logic, wrong default, swallowed
exceptions, mismatched async/await, resource leaks.

**D2 — Security & trust boundaries**
OWASP Top 10, injection (SQL/command/SSRF/template), broken authz, missing
authz scope checks, secrets in code, unsafe deserialization, LLM trust
boundary (untrusted model output used as control flow, prompt-adjacent data),
CORS, open redirects, path traversal, dependency on unmaintained packages.

**D3 — Change-risk & hotspots (repowise-derived)**
Files that are high-risk by git history: recent + high-churn + prior-defect +
large-diff. For each, review the actual code now for latent defects the
history predicts. Cite the git evidence (`git log`/`git blame` line) alongside
the code evidence. This dimension prioritizes *where* to look deepest; it
rarely produces findings on its own unless a hotspot file has no tests.

**D4 — Maintainability & code health (repowise biomarkers)**
Cyclomatic complexity, duplication (copy-paste blocks), dead code (unreachable
/ unused exports), oversized files/functions, poor naming, tight coupling,
leaky abstractions, magic numbers. Approximate biomarkers by hand: do not
claim a numeric score you did not compute.

**D5 — Blast-radius & architecture (structural graph)**
For any non-trivial change surface, identify callers and callees and assess
ripple. Does a changed signature/contract break consumers? Is a change
scoped to one module or does it leak across boundaries? Where a structural
graph tool exists (e.g. `better-code-review-graph`), use it; otherwise trace
callers with `rg`. Report blast-radius as a finding only when a real
break/leak exists, not as generic coupling commentary.

**D6 — Test coverage & quality**
Are changed/changed-adjacent paths covered by *meaningful* tests (not just
tests that pass)? Missing coverage for error paths, edge cases, authz
branches. Tests that assert the wrong thing. Flaky patterns (timeouts, real
network, shared mutable state, unmocked clock). Missing regression test for
a fixed bug.

**D7 — Performance**
N+1 queries, blocking calls in async paths, unbounded queries/loops,
quadratic over large inputs, missing pagination, sync I/O on request path,
memory growth, redundant recomputation, missing indexes (cite the query).

**D8 — Spec / contract compliance (the CodeRabbit Stage-1 layer)**
Does the code do what was asked? Acceptance criteria met, no scope creep, API
contract adherence (request/response shapes, status codes, error envelopes),
edge cases per spec, breaking changes documented. If a spec/ADR/contract
document exists in-repo, read it and check against it; cite the spec line.

### Phase 2 — Adversarial verification

Every `high` and `critical` finding MUST survive adversarial verification
before it is reported as `confirmed`. Verify `medium` findings as well when `depth=deep`.

For each such finding, use an independent reviewer or separate subagent whose
only job is to **refute** the finding. A same-agent reread is useful preparation,
but cannot satisfy this independent-verification requirement. If that reviewer
is unavailable, keep the candidate `unverified` and the verdict `INCOMPLETE`:

- Re-read the cited `file_path:line` fresh. Does the code actually do what the
  finding claims?
- Check for mitigating context the reviewer missed (guard earlier in the
  path, validation upstream, a type constraint, a test that already covers it).
- Check the finding is in-scope and not a false positive from stale code.
- **Record `unverified` when uncertain.** Refutation requires evidence that disproves the finding; unresolved material evidence prevents PASS.

Record `verified: confirmed | refuted | unverified`, `confidence` (0.0–1.0),
and `verifier_reason`. Confirmed high/critical findings determine CHANGES_NEEDED;
medium/low findings remain visible. Unresolved material candidates, missing required
independent verification or incomplete coverage yield INCOMPLETE and prevent PASS.
Report `refuted` findings in a separate "refuted / not actionable" section so
the reasoning is transparent and the user can see what was considered and
discarded — do not silently drop them.

### Phase 3 — Synthesize

Produce the final report (see Output format). Rank confirmed findings
severe-first. Give per-dimension summaries. End with an explicit **Coverage
& limits** statement: which files/paths were inspected, which were skipped
and why, which signals were `no_data` / `approximate` / `partial`, and what a
follow-up review should cover.

## Findings schema

Each finding is a structured object so the workbench/KOS can parse it:

```json
{
  "id": "D1-003",
  "dimension": "correctness",
  "severity": "critical",
  "title": "Swallowed exception masks authz failure",
  "file": "src/api/billing.py",
  "line": 142,
  "evidence": ["src/api/billing.py:142", "src/api/billing.py:150"],
  "detail": "Bare `except: pass` at line 142 swallows the PermissionError raised at line 150, so unauthorized calls return 200 instead of 403.",
  "suggested_fix": "Catch PermissionError explicitly and return 403; let other exceptions propagate.",
  "verified": "confirmed",
  "confidence": 0.9,
  "verifier_reason": "Re-read lines 140-152; PermissionError is raised and immediately swallowed; no upstream guard."
}
```

`verified` is one of `confirmed` | `refuted` | `unverified` (the last for
`low`/`medium` findings not put through verification, or when a verifier could
not be run).

## Severity bands

| Severity | Meaning | Verification |
|---------|---------|-------------|
| `critical` | Data loss, security breach, production outage, money/license error | required |
| `high` | Likely bug with real user/infra impact | required |
| `medium` | Real quality issue, moderate impact | optional (required at `deep`) |
| `low` | Style/maintainability nit | not required |

## Honest-degradation tiers

Reuse these exact labels in findings and the coverage statement:

- `no_data` — signal unavailable (no git history, no tests, no graph tool).
- `approximate` — heuristic estimate, not a measured value (e.g. hand-ranked
  change-risk, hand-estimated complexity).
- `partial` — only some of the in-scope files could be assessed for this
  dimension; name which were skipped.

Never present an `approximate` value as a measured one.

## Output format

```
# Codebase Audit — <repo_path> (scope: <scope>, depth: <depth>)

## Verdict: PASS | CHANGES_NEEDED | INCOMPLETE | BLOCKED
<one paragraph rationale anchored in confirmed findings>

## Confirmed findings (ranked)
<findings table or list, severe-first, with file:line + suggested_fix>

## Refuted / not actionable
<what was considered and discarded, with one-line reason each — transparency, not noise>

## Dimension summaries
D1 Correctness: <n> confirmed / <m> refuted — <one line>
D2 Security: ...
...
D8 Spec/contract: ...

## Unresolved candidates
- Candidate: <evidence and uncertainty>
- Missing verification: <required independent pass or unavailable context>

## Coverage & limits
- Inspected: <file set / count>
- Skipped: <paths> — <reason>
- Tiers used: no_data / approximate / partial — <where>
- Follow-up: <what a next pass should cover>
```

- `PASS` — complete declared coverage, zero confirmed `critical`/`high`, and no unresolved material candidate. `medium`/`low` findings remain visible.
- `INCOMPLETE` — missing coverage, required independent verification or unresolved material evidence prevents a complete verdict.
- `CHANGES_NEEDED` — ≥1 confirmed `high` (or any `critical` not yet fixed).
- `BLOCKED` — architectural concern or spec violation requiring a design
  decision before code-level fixes are meaningful; escalate, do not patch.

## Follow-up fixes

Report confirmed findings with the smallest proposed correction and evidence.
A request to implement those corrections starts a separately scoped task under
the project lifecycle. Never turn this audit into an edit or release operation.
