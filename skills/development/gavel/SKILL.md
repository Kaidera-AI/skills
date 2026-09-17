---
name: gavel
description: "Gavel - typed judgments for a project lead's decisions. Before you rule on a worker's return, send a handoff, or order a backlog, ask a fixed set of narrow questions and get typed answers with probabilities: disposition (accept / rework / withdraw / consult owner / answer questions), evidence quality, silent gaps, scope creep, irreversibility, next owner, urgency; whether a draft handoff carries a receipt contract; how gate-blocking and risky each backlog item is. Powered by TypeSafe's System One model (Jev) through a bundled stdlib helper. Use when triaging a return, handback or consult; before sending any handoff; when prioritising a checklist; whenever a lead decision should be checked against calibrated common sense. Works in any project, any harness, any model."
license: Apache-2.0
metadata:
  version: 1.0.1
  authority: "CTO 2026-09-17: a reusable decision instrument for every project lead in KOS; docs/SOP_PLAN_AND_EXECUTE.md (the lead plans and adjudicates, workers execute); design 41 (harness-agnostic tools only)"
  sources: "typesafe-ai/skills (MIT) and docs.typesafe.ai - System One primitives Choice, Noul, Score; confidence; HTTP API v1"
  applies_to: [lead, cpo, pm, orchestrator]
  requires: "python3 (stdlib only) and a TypeSafe API key in JEV_API_KEY (environment, or a .env file at or above the working directory; read by name, never printed)"
  bias: "judgments are inputs, never the decision; one narrow question per dimension; thresholds live in code and in this file, not in prompts; nothing secret leaves the machine"
  conflicts_with: []
---

# Gavel - typed judgments for the lead

## What it is

A lead's day is rulings: is this return acceptable, is this handoff ready to send, what comes first. Each ruling is a handful of narrow judgments over a piece of text. Gavel asks those judgments of a small, fast, calibrated model (TypeSafe's System One model, Jev) in one request and returns **typed answers with probabilities** - a choice with its distribution, a yes/no probability, a position on a described scale. It does not write prose, does not reason out loud, and does not decide. The lead decides; Gavel makes the decision inspectable and catches the miss.

It is project-agnostic: nothing in it names a project, a worker or a repository. Any lead in any project uses the same three commands.

## Setup (once per machine or project)

1. Get a TypeSafe API key and put it where the helper can read it **by name**: `export JEV_API_KEY=...` or a line `JEV_API_KEY=...` in a `.env` at or above your working directory. Never paste it into chat, handoffs, logs or git.
2. Check the install without spending tokens: `python3 tools/gavel.py selftest`.
3. One live check: `echo "Done. All tests pass." | python3 tools/gavel.py triage -` - expect `evidence_quality` near 0 and `disposition` away from `accept`.

## The three commands

| Moment | Command | Input | You get |
|---|---|---|---|
| A return, handback or consult lands | `python3 tools/gavel.py triage <file or ->` | JSON `{"dispatch": "...", "return_text": "..."}` or just the return text | `disposition`, `evidence_quality` 0-3, `silent_gap`, `scope_creep`, `irreversible`, `next_owner`, `urgency` 0-3 |
| A handoff is drafted, not yet sent | `python3 tools/gavel.py dispatch <file or ->` | the handoff text | `has_receipt_contract`, `names_gate`, `scope_excluded`, `blocked_protocol`, `single_owner`, `weakest_part` |
| A backlog or checklist needs an order | `python3 tools/gavel.py rank <items.json>` | `{"context": "...", "items": ["...", "..."]}` | `gate_blocking` + `risk_if_delayed` per item, sorted by the sum |

Add `--json` for the raw response. About 1,000 input and 190 output tokens per triage; one request per ranked item.

## Reading the answers

- **Choice** (`disposition`, `next_owner`, `weakest_part`): the winning option, its confidence, and the distribution. Confidence is how concentrated the distribution is, not how right the answer is. A 0.46 on "consult the owner" with 0.32 on "rework" is the model telling you the case is genuinely ambiguous - say so in your ruling.
- **Noul** (`silent_gap`, `scope_creep`, `irreversible`, the dispatch checks): probability of yes. 0.5 means "could be either", not "medium".
- **Score** (`evidence_quality`, `urgency`, the rank scores): a position on the described levels, possibly between two. `evidence_quality` 3 means a reader could re-verify from identities (commit SHA, object size, run id, test count); 0 means narrative only.

## The lead's policy (what to do with the answers)

1. **Disagreement is the signal.** If `disposition` differs from your instinct, or its confidence is under 0.6, write your reason into the adjudication record before ruling. Agreement at high confidence is a reason to move faster, not proof.
2. **`accept` with `evidence_quality` under 2.5 is a contradiction.** Ask for the receipt first.
3. **`silent_gap` over 0.5 sends the return back** with the skipped step named, whatever the disposition says.
4. **`irreversible` over 0.4 stops you** until the accountable human has said yes (deletion, reset, restore-over, public publish, spend).
5. **Dispatch-check every handoff before sending.** `has_receipt_contract` or `blocked_protocol` under 0.5 means it is not ready; fix the `weakest_part` and check again. On first use this caught one of the author's own plan handoffs (receipts 0.15, blocked protocol 0.09); the corrected text scored 0.86 and 0.97.
6. **`rank` is a check, not the order.** It does not infer dependencies from prose. State them as facts in `context` ("A blocks gate G; B needs A") or keep your dependency order and use the scores to argue exceptions.
7. **Never pass secrets, credentials, customer data or private keys.** Returns, handoff texts, checklist rows and receipts are fine. The helper redacts common token shapes as a backstop; it is not a permission.

## Worked example

```
$ cat packet.json
{"dispatch": "Upload the archive; receipt = object size equals the local byte count.",
 "return_text": "Upload exit code 0, logs empty. Object check: 404 Not Found."}
$ python3 tools/gavel.py triage packet.json
disposition            rework (conf 1.00) rework=1.00 accept=0.00 withdraw=0.00
evidence_quality       2.74 (conf 0.74)
silent_gap             yes=0.62
irreversible           yes=0.05
next_owner             same_worker (conf 0.67) ...
urgency                2.75 (conf 0.75)
```
Ruling: rework - the exit code said success, the receipt said absent; `silent_gap` over 0.5 confirms the return must name the missing object. That is policy lines 1 and 3 applied.

## What it is not

Not a code reviewer, not a gate, not a replacement for reading the receipt, and never run on the workers' side to grade themselves. It does not override priorities the accountable human has set.

## Make it available to a lead

- **Any harness, any model:** the skill is plain files. Install with the agnostic CLI (`npx skills add <repo> --skill gavel -a universal -y --copy`) or copy the `gavel/` directory into `.agents/skills/`.
- **KOS / Cortex projects:** `cortex-skill install .agents/skills/gavel --scope global` once per Cortex, then in each project `cortex-skill bind gavel --to lead --kind role`. The generated pointer (`AGENTS.md`) names it so a fresh session knows it exists.

## Files

- `tools/gavel.py` - the helper (stdlib only): `triage`, `dispatch`, `rank`, `selftest`. Question wording lives in its `TRIAGE`, `DISPATCH`, `RANK` maps.
- `references/questions.md` - why each question exists and how the wording evolved.
- `references/calibration.md` - dated results on real cases; add a row whenever a judgment was wrong and say why.
- `evals/cases.json` - labelled packets; run them after changing a question (`evals/README.md`).
- `CHANGELOG.md` - one line per change.
- Live docs for the model and primitives: docs.typesafe.ai (start at `/llms.txt`); read the primitive's page before changing a question's shape.
