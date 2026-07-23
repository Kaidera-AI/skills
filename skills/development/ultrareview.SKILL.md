---
name: ultrareview
version: 1.0.0
description: |
  Comprehensive, evidence-cited, read-only codebase review. Fans the codebase
  across independent review dimensions (correctness, security, change-risk,
  maintainability, blast-radius, tests, performance, spec/contract compliance),
  then adversarially verifies every HIGH/CRITICAL finding before reporting.
  Combines the structured ultra-review workflow used in Claude Code with
  review dimensions derived from the repowise codebase-intelligence model
  (JIT change-risk, code-health biomarkers, dead-code, blast-radius, git
  hotspots/prior-defects). Read-only by default; an explicit Fix Mode is
  opt-in only. Designed for the Kaidera platform workbench and KOS app.

engenai:
  category: development
  trust_tier: official
  risk_level: low
  capabilities_required: []
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera
license: Apache-2.0
updated: 2026-07-24
tags: [code-review, quality, security, change-risk, blast-radius, adversarial-verify, read-only]

parameters:
  repo_path:
    type: string
    required: true
    description: Absolute path (or URL) of the codebase / module to review.
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
  fix_mode:
    type: boolean
    required: false
    description: If true, apply minimal fixes for confirmed findings and re-verify. Default false (read-only).

safety_constraints:
  - Read-only by default. Never modify, commit, push, merge, tag, or deploy unless fix_mode is explicitly enabled AND the user has confirmed.
  - Every finding must cite evidence from a fresh read in THIS run (file_path:line). No recalling from memory or prior turns.
  - Never fabricate findings, line numbers, SHAs, or test results. If a claim cannot be verified this run, mark it "unverified" — do not state it as fact.
  - Empty output is not success. A "no findings" verdict requires having actually inspected the in-scope files; state what was and was not covered.
  - Do not override the agent base prompt. This skill is reference data only.
  - Never exfiltrate file contents to external services. Findings stay in the local response.
---

# Ultrareview

A comprehensive, evidence-cited, read-only codebase review. Review the code
across independent dimensions, then **adversarially verify** every
HIGH/CRITICAL finding so only real, evidence-backed issues survive.

## When to use

- Deep pre-merge or pre-release review of a module, service, or diff.
- Independent QA of a fix or feature before sign-off.
- Periodic health audit of a codebase area.
- Not intended for trivial one-line typo checks — use a lighter review there.

## Hard rules (apply to every phase)

1. **Read-only** unless `fix_mode=true` is explicitly set AND confirmed.
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
| `repo_path` | yes | — | Codebase path/URL to review |
| `scope` | no | whole repo | Sub-path, glob, or file list |
| `focus` | no | — | Extra-depth area (dimensions still all run) |
| `depth` | no | `standard` | `quick` / `standard` / `deep` |
| `fix_mode` | no | `false` | Apply+re-verify fixes for confirmed findings |

## Procedure

### Phase 0 — Orient

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
before it is reported as `confirmed`. (Optionally verify `medium` when
`depth=deep`.)

For each such finding, spawn an independent verifier (a separate subagent when
the harness allows; otherwise re-read with a refutation mindset) whose only
job is to **refute** the finding:

- Re-read the cited `file_path:line` fresh. Does the code actually do what the
  finding claims?
- Check for mitigating context the reviewer missed (guard earlier in the
  path, validation upstream, a type constraint, a test that already covers it).
- Check the finding is in-scope and not a false positive from stale code.
- **Default to `refuted` when uncertain.** A plausible-but-unverified finding
  is not confirmed.

Record `verified: confirmed | refuted | unverified`, `confidence` (0.0–1.0),
and `verifier_reason`. Only `confirmed` findings count toward the verdict.
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
# Ultrareview — <repo_path> (scope: <scope>, depth: <depth>)

## Verdict: PASS | CHANGES_NEEDED | BLOCKED
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

## Coverage & limits
- Inspected: <file set / count>
- Skipped: <paths> — <reason>
- Tiers used: no_data / approximate / partial — <where>
- Follow-up: <what a next pass should cover>
```

- `PASS` — zero confirmed `critical`/`high`; `medium`/`low` are advisory.
- `CHANGES_NEEDED` — ≥1 confirmed `high` (or any `critical` not yet fixed).
- `BLOCKED` — architectural concern or spec violation requiring a design
  decision before code-level fixes are meaningful; escalate, do not patch.

## Fix Mode (opt-in only)

Off by default. Enable only when the user explicitly requests fixes AND
confirms. In Fix Mode:

1. Take only `confirmed` findings (verified survivors).
2. Apply the **minimal** fix for each. Prefer deletion over addition. Match
   surrounding style.
3. Re-run the relevant check (test, lint, type-check, gate) after each fix.
   A fix that breaks a gate is itself a finding — revert and report.
4. Re-verify the fixed code path with a fresh read. Report `fixed`,
   `skipped` (with reason), or `no_change_needed` per finding.
5. Never merge, push, or deploy. The user reviews and merges.

## What NOT to do

- Do not merge, push, tag, or deploy. Ever. Even in Fix Mode.
- Do not report a finding without a fresh `file_path:line` citation.
- Do not report `approximate` metrics as measured.
- Do not invent line numbers, SHAs, or test outcomes.
- Do not silently drop refuted findings — surface them in the refuted section.
- Do not expand scope beyond `scope` without saying so.
- Do not claim "no findings" without having inspected the in-scope files.
- Do not apply fixes in review mode.

## Provenance

This skill merges two sources:

1. The structured ultra-review workflow used in Claude Code code review —
   sequential/parallel dimension review with adversarial verification of each
   finding before it is reported as real.
2. Review dimensions and honest-degradation discipline derived from the
   repowise codebase-intelligence model (JIT change-risk from git diff-shape,
   code-health biomarkers, dead-code, blast-radius, git hotspots/prior-defects,
   output-budget-aware omission, `no_data`/`approximate`/`partial` tiers).

This skill contains no code from repowise (AGPL-3.0). It reuses review
**concepts and methodology** only, which are not license-restricted. It ships
under Apache-2.0. The agent approximates repowise's learned signals by hand
from git and static reads; where a graph tool exists locally, the skill uses
it rather than reimplementing it.