---
name: kaidera-lead-judgment
version: 0.1.0
description: |
  Typed judgments for a project lead who plans, adjudicates and coordinates while workers
  execute: before acting on a worker return, a draft handoff or a backlog, ask TypeSafe's
  System One model (Jev) a fixed set of narrow questions - disposition, evidence quality,
  silent gaps, scope creep, irreversibility, next owner, urgency; receipt-contract
  completeness of a dispatch; gate-blocking and risk scores for ranking. Code owns the
  decision and the thresholds; the model supplies calibrated common sense. Use when triaging
  a return or handback, before sending a handoff, and when ordering a checklist or backlog.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:code_interpreter
  allowed_domains:
    - api.typesafe.ai
    - docs.typesafe.ai
    - github.com
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/kaideraos
    path: .agents/skills/kaidera-lead-judgment
    content_sha256: 9448fbb7e87a33a724ee27d3dad1bc8efec4cee9d734ba0a166c4743e2605af5

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-17
tags: [lead, planning, adjudication, handoff, triage, prioritisation, typesafe, system-one, decision-making]
attribution_notes: "Builds on the TypeSafe skill (typesafe-ai/skills, MIT) and docs.typesafe.ai (System One primitives Choice, Noul, Score). Requires a TypeSafe API key supplied by the user as JEV_API_KEY."

safety_constraints:
  - Judgments are inputs to a human or lead decision, never the decision; the skill authorises no merge, deploy, publish, deletion or spend.
  - Sends the text you pass (returns, handoffs, backlog items) to api.typesafe.ai. Never pass secrets, credentials, customer data or private keys; the built-in redactor is a backstop, not a permission.
  - The API key is read by name from the environment or a local .env and is never printed, logged or committed.
  - Harness-agnostic by construction - plain files and a stdlib Python helper; no vendor plugin or harness-only feature is required.
---

# Lead judgment (TypeSafe System One for the lead role)

The lead's job under `docs/SOP_PLAN_AND_EXECUTE.md` is to read returns, adjudicate, dispatch with receipt contracts, and rank what comes next. Each of those is a handful of narrow judgments over the same text. This skill asks them of Jev in one request, returns typed answers with probabilities, and leaves the decision to the lead and the policy to code. It follows the TypeSafe skill's rules: code owns the workflow, questions carry complete meaning, answers are consumed by thresholds evaluated on our own cases.

## When to use

| Moment | Command | What you get |
|---|---|---|
| A worker return, handback or consult lands | `python3 tools/lead_judge.py triage packet.json` (`{"dispatch": ..., "return_text": ...}`) or `triage -` with the raw text on stdin | disposition (accept / rework / withdraw / consult_cto / answer_questions), evidence_quality 0-3, silent_gap, scope_creep, irreversible, next_owner, urgency 0-3 |
| A handoff is drafted and not yet sent | `python3 tools/lead_judge.py dispatch handoff.txt` | has_receipt_contract, names_gate, scope_excluded, blocked_protocol, single_owner, weakest_part |
| A backlog or checklist needs an order | `python3 tools/lead_judge.py rank items.json` (`{"context": ..., "items": [...]}`) | gate_blocking + risk_if_delayed per item, sorted composite |

Add `--json` for the raw response. The helper reads `JEV_API_KEY` from the environment or by name from the repo `.env`, redacts `apikey_`, `ghp_`, `AKIA`, bearer tokens and PEM blocks before sending, and uses the system CA bundle. Every request costs tokens (about 1,000 in / 190 out per triage); batch the questions, never loop per sentence.

## How the lead uses the answers (policy, kept in code and here)

1. **Disposition disagreements are the signal.** When Jev's `disposition` differs from your first instinct, or its confidence is below 0.6, write the reason into the adjudication file before deciding. Agreement at high confidence is not evidence of correctness; it is a reason to move faster.
2. **`evidence_quality` below 2.5 with `disposition = accept` is a contradiction.** Ask for the receipt before accepting. Level 3 means a reader could re-verify from identities (SHA, object size, run id, test count).
3. **`silent_gap` above 0.5 sends the return back** with the skipped step named, even when the disposition says accept.
4. **`irreversible` above 0.4 stops the lead** until the CTO line exists (THE_WAY section 14).
5. **`dispatch` check before every send:** `has_receipt_contract` and `blocked_protocol` below 0.5 mean the handoff is not ready; fix the weakest part it names. On first use this caught one of the lead's own plan handoffs (receipts 0.15, blocked protocol 0.09).
6. **`rank` is a check, not the order.** The composite ignores dependencies unless `context` states them as facts; put the dependency graph in `context` (which item unblocks which gate) or keep the dependency order and use the scores to argue exceptions.
7. **Never send secrets, customer data or credentials as state.** Handoff texts, PROGRESS rows and receipts are fine; `.env` contents, tokens and private keys are not, and the redactor is a backstop, not a permission.

## What it is not

Not a reviewer of code (that is a worker's adversarial review), not a substitute for reading the receipt, not a gate. It never runs on the workers' side; it is the lead's instrument. It does not decide priorities the CTO has set.

## Files

- `tools/lead_judge.py` - the helper (stdlib only). Question wording lives in the script's `TRIAGE`, `DISPATCH`, `RANK` maps; rationale and history in `references/questions.md`.
- `references/calibration.md` - dated results on real cases; update it whenever a judgment was wrong and say why.
- `evals/cases.json` - labelled packets from real returns; run them after changing a question.
- Live docs: `.agents/skills/typesafe-ai/SKILL.md` (harness-agnostic install, design 41) maps docs.typesafe.ai (start at `/llms.txt`); read the primitive page before changing a question's shape.


---

## Bundled file: `references/calibration.md`

````markdown
# Calibration log

## 2026-09-17 - first run on four real returns (jev-1.13.0)

| case | lead's ruling | Jev disposition (conf) | evidence | silent_gap | irreversible | urgency | verdict |
|---|---|---|---|---|---|---|---|
| an upload that exited 0 with empty logs while the object check returned 404 | rework | rework (1.00) | 2.74 | 0.62 | 0.05 | 2.75 | agrees; evidence 2.74 is generous - the receipt proved absence, which is still a receipt |
| a release-pipeline repair (root cause, credential rotated, job rerun green, four install channels verified) | accept | accept (0.56; rework 0.34) | 2.81 | 0.23 | 0.11 | 0.17 | agrees but soft; the rework mass likely reflects "rotated a secret" reading as unverified - acceptable |
| a worker's consult with four numbered questions, blocked by design until the lead rules | answer_questions | answer_questions (0.99) | 1.82 (conf 0.00) | 0.21 | 0.03 | 1.79 | agrees; evidence confidence 0 is correct for a consult with no receipts to grade |
| a return reporting a pending irreversible deletion, with options for the owner | consult_cto | consult_cto (0.33; rework 0.32) | 0.41 | 0.19 | 0.46 | 2.97 | agrees on outcome, low confidence mirrors real ambiguity; urgency 2.97 correct |

Dispatch check on one of the lead's own plan handoffs: receipts 0.15, blocked protocol 0.09, weakest = receipts. Correct - the handoff listed checklist rows without per-row receipts; an addendum with per-row receipts was sent the same hour and scored 0.86 / 0.97.

Rank of a release-cut checklist: Jev put the SBOM row first and a dependency-pin row second; the lead kept the pin first because it blocks two gates, a dependency the context stated only in prose. Lesson: pass dependencies as structured facts.

Cost: ~1,000 input / ~190 output tokens per triage; ~900/146 per dispatch check; ~2 requests per ranked item.
````


---

## Bundled file: `references/questions.md`

````markdown
# Question catalogue and rationale (v0.1.0, 2026-09-17)

Designed by the TypeSafe rules: one narrow judgment per question, complete meaning in the question (ids are not shown to the model), named state fields (`dispatch`, `return_text`, `handoff`, `item`, `context`), criteria that describe concrete situations, a no-match outcome where nothing may fit, independent questions asked together so they run in parallel.

## triage (state: dispatch, return_text)
- `disposition` Choice - the five outcomes the lead actually has under SOP_PLAN_AND_EXECUTE.md section 5. `withdraw` exists because work is sometimes done elsewhere (another worker closed an incident before the dispatch for it went out).
- `evidence_quality` Score, four levels from narrative to re-verifiable identities - the ladder behind "read the receipt before you send it" and "a green suite is not evidence".
- `silent_gap` Noul - the classic failure: exit code 0 with no artifact; "done" with a step skipped.
- `scope_creep` Noul - protects lane boundaries (one owner per fact).
- `irreversible` Noul - THE_WAY section 14 trigger.
- `next_owner` Choice - kai / same_worker / other_worker / cto.
- `urgency` Score - backlog / this week / today / now.

## dispatch (state: handoff)
Mirrors the handoff contract (SOP section 4): receipt per step, gate named, exclusions stated, blocked protocol, single owner; `weakest_part` names what to fix.

## rank (state: item, context)
Two Scores per item, `gate_blocking` and `risk_if_delayed`; the composite is the sum. Dependencies must be stated in `context` as facts; the model does not infer a graph from prose reliably (see calibration).

## Wording history
- 0.1.0: first set. A pre-release probe with the phrasing "claims success while its own evidence shows the deliverable is missing" scored only 0.23 on a silent-failure case; the shipped `silent_gap` wording ("presents the work as complete while one dispatched step was skipped, deferred, or left unproven without saying so plainly") scored 0.62 on the same case. Phrase gaps as omissions, not as contradictions.
````


---

## Bundled file: `tools/lead_judge.py`

````python
#!/usr/bin/env python3
"""Lead judgment helper: typed System One judgments (TypeSafe Jev) for a project lead.

Usage:
  lead_judge.py triage   <packet.json|-> [--json]   # a worker return / handback / consult
  lead_judge.py dispatch <handoff.txt|-> [--json]   # a draft handoff before sending
  lead_judge.py rank     <items.json>  [--json]     # candidate work items -> ordered list
Key: JEV_API_KEY from the environment, else read by name from the nearest .env above the CWD (never printed).
The judgments are inputs to the lead's decision, not the decision (SOP_PLAN_AND_EXECUTE.md).
"""
import json, os, re, ssl, sys, urllib.request, pathlib

API = "https://api.typesafe.ai/v1/systemone"; MODEL = os.environ.get("JEV_MODEL", "jev-latest")
REDACT = re.compile(r"(apikey_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|Bearer\s+\S+|-----BEGIN[^-]+-----)")

def key():
    k = os.environ.get("JEV_API_KEY")
    if not k:
        roots = [pathlib.Path.cwd(), *pathlib.Path.cwd().parents, *pathlib.Path(__file__).resolve().parents]
        for p in (r / ".env" for r in roots):
            if p.is_file():
                for line in p.read_text().splitlines():
                    if line.startswith("JEV_API_KEY="):
                        k = line.split("=", 1)[1].strip().strip('"').strip("'"); break
            if k: break
    if not k: sys.exit("JEV_API_KEY not set and not found in .env")
    return k

def ask(state, questions):
    body = json.dumps({"state": json.loads(REDACT.sub("<redacted>", json.dumps(state))), "model": MODEL, "questions": questions}).encode()
    req = urllib.request.Request(API, data=body, headers={"Authorization": "Bearer " + key(), "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60, context=_ssl()) as r: return json.load(r)

def _ssl():
    # ponytail: python.org builds ship no CA bundle; prefer certifi, else the macOS/Linux system bundle
    try:
        import certifi; return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        for ca in ("/etc/ssl/cert.pem", "/etc/ssl/certs/ca-certificates.crt"):
            if os.path.exists(ca): return ssl.create_default_context(cafile=ca)
    return ssl.create_default_context()

# ponytail: one question set per packet kind; tune wording in references/questions.md, not here.
TRIAGE = {
    "disposition": {"type": "choice", "instructions": "Given `return_text` from a worker and the `dispatch` it answers, what should the lead do next?",
        "criteria": {"accept": "every dispatched step is proven by a receipt a reader could re-verify (SHA, head-object size, test counts, URL)",
                     "rework": "a step is missing, unproven, or contradicted by its own evidence; send back naming the missing receipt",
                     "withdraw": "the dispatched work is no longer needed or was done elsewhere",
                     "consult_cto": "the next step needs a decision only the CTO can make (irreversible action, spend, product boundary)",
                     "answer_questions": "the worker asks the lead questions that block them; the lead must rule before work continues"}},
    "evidence_quality": {"type": "score", "instructions": "How verifiable is the evidence in `return_text`?",
        "criteria": ["narrative only: claims with no commands, outputs, or identifiers",
                     "commands named but outputs or identifiers missing",
                     "outputs pasted but not tied to an artifact identity (no SHA, object size, run id)",
                     "receipts with identities a reader can re-verify independently"]},
    "silent_gap": {"type": "noul", "instructions": "Does `return_text` present the work as complete while one dispatched step was skipped, deferred, or left unproven without saying so plainly?"},
    "scope_creep": {"type": "noul", "instructions": "Does `return_text` report work outside the scope in `dispatch`?"},
    "irreversible": {"type": "noul", "instructions": "Does `return_text` perform or request an irreversible step (deletion, database reset, restore-over, public publish, spend) that needs a CTO line?"},
    "next_owner": {"type": "choice", "instructions": "Who must act next on `return_text`?",
        "criteria": {"kai": "the lead adjudicates, integrates, or rules", "same_worker": "the same worker continues or reworks", "other_worker": "another lane owns the next step", "cto": "a human decision is required"}},
    "urgency": {"type": "score", "instructions": "How urgent is the lead's action on `return_text`?",
        "criteria": ["backlog: nothing waits on it", "this week: a planned wave waits on it", "today: a gate or another worker waits on it", "now: data, a live system, or a release is at risk"]},
}
DISPATCH = {
    "has_receipt_contract": {"type": "noul", "instructions": "Does `handoff` state, per step, the exact receipt that proves it (command, artifact identity, or expected value)?"},
    "names_gate": {"type": "noul", "instructions": "Does `handoff` say which gate or checklist row the work feeds?"},
    "scope_excluded": {"type": "noul", "instructions": "Does `handoff` say what is explicitly out of scope or owned by another worker?"},
    "blocked_protocol": {"type": "noul", "instructions": "Does `handoff` tell the worker what to do when blocked (consult with options)?"},
    "single_owner": {"type": "noul", "instructions": "Is `handoff` addressed to exactly one owner for one lane, without asking them to do another lane's work?"},
    "weakest_part": {"type": "choice", "instructions": "Which element of `handoff` would most likely cause a bad return?",
        "criteria": {"goal": "the goal is vague", "receipts": "receipts are missing or unverifiable", "order": "dependencies and order are unclear", "scope": "scope boundaries are unclear", "none": "nothing material is missing"}},
}
RANK = {
    "gate_blocking": {"type": "score", "instructions": "How much does delaying `item` block a gate, a release, or another worker, given `context`?",
        "criteria": ["blocks nothing", "blocks a planned wave", "blocks a gate or another worker today", "blocks a release or a CTO line now"]},
    "risk_if_delayed": {"type": "score", "instructions": "What is at risk if `item` waits a week, given `context`?",
        "criteria": ["nothing material", "rework or cost", "data loss, security exposure, or customer impact", "irreversible loss"]},
}

def main(a):
    if len(a) < 2: sys.exit(__doc__)
    mode, src = a[0], a[1]; as_json = "--json" in a
    text = sys.stdin.read() if src == "-" else pathlib.Path(src).read_text()
    if mode == "triage":
        packet = json.loads(text) if text.lstrip().startswith("{") else {"return_text": text, "dispatch": "(not supplied)"}
        r = ask(packet, TRIAGE)
    elif mode == "dispatch":
        r = ask({"handoff": text}, DISPATCH)
    elif mode == "rank":
        items = json.loads(text); ctx = items.get("context", ""); out = []
        for it in items["items"]:
            r = ask({"item": it, "context": ctx}, RANK); ans = r["answers"]
            out.append({"item": it, "gate_blocking": round(ans["gate_blocking"]["score"], 2), "risk_if_delayed": round(ans["risk_if_delayed"]["score"], 2), "priority": round(ans["gate_blocking"]["score"] + ans["risk_if_delayed"]["score"], 2)})
        out.sort(key=lambda x: -x["priority"]); print(json.dumps(out, indent=1) if as_json else "\n".join(f"{o['priority']:>4}  gate={o['gate_blocking']} risk={o['risk_if_delayed']}  {o['item'][:90]}" for o in out)); return
    else: sys.exit(__doc__)
    if as_json: print(json.dumps(r, indent=1)); return
    for qid, ans in r["answers"].items():
        if ans["type"] == "noul": print(f"{qid:<22} yes={ans['noul']:.2f}")
        elif ans["type"] == "choice": print(f"{qid:<22} {ans['choice']} (conf {ans['confidence']:.2f}) " + " ".join(f"{k}={v:.2f}" for k, v in sorted(ans['probabilities'].items(), key=lambda kv: -kv[1])[:3]))
        else: print(f"{qid:<22} {ans['score']:.2f} (conf {ans['confidence']:.2f})")
    print(f"tokens in={r['usage']['input_tokens']} out={r['usage']['output_tokens']} model={r['model']}")

if __name__ == "__main__": main(sys.argv[1:])
````
