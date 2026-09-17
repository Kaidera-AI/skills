---
name: gavel
version: 1.0.0
description: |
  Gavel - typed judgments for a project lead's decisions. Before you rule on a worker's
  return, send a handoff, or order a backlog, ask a fixed set of narrow questions and get
  typed answers with probabilities: disposition, evidence quality, silent gaps, scope creep,
  irreversibility, next owner, urgency; whether a draft handoff carries a receipt contract;
  how gate-blocking and risky each backlog item is. Powered by TypeSafe's System One model
  (Jev) through a bundled stdlib helper. Use when triaging a return, handback or consult;
  before sending any handoff; when prioritising a checklist. Works in any project, any
  harness, any model. Judgments are inputs, never the decision.

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
    path: .agents/skills/gavel
    content_sha256: 21a2228047ed7a0e8511e1e3474f7acec21b7ea2cc1fec85cdff8f5174712fef

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-17
tags: [gavel, lead, decision-making, adjudication, handoff, triage, prioritisation, typesafe, system-one]
attribution_notes: "Builds on the TypeSafe skill (typesafe-ai/skills, MIT) and docs.typesafe.ai (System One primitives Choice, Noul, Score). Requires a TypeSafe API key supplied by the user as JEV_API_KEY."

parameters:
  mode:
    type: string
    required: true
    description: One of triage, dispatch, rank, selftest.
  input:
    type: string
    required: false
    description: Path to the packet, handoff text or items JSON, or "-" for stdin (not used by selftest).

safety_constraints:
  - Judgments are inputs to a human or lead decision, never the decision; the skill authorises no merge, deploy, publish, deletion or spend.
  - Sends the text you pass (returns, handoffs, backlog items) to api.typesafe.ai. Never pass secrets, credentials, customer data or private keys; the built-in redactor is a backstop, not a permission.
  - The API key is read by name from the environment or a local .env and is never printed, logged or committed.
  - Harness-agnostic by construction - plain files and a stdlib Python helper; no vendor plugin or harness-only feature is required.
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
| a return reporting a pending irreversible deletion, with options for the owner | consult_owner | consult_owner (0.33; rework 0.32) | 0.41 | 0.19 | 0.46 | 2.97 | agrees on outcome, low confidence mirrors real ambiguity; urgency 2.97 correct |

Dispatch check on one of the lead's own plan handoffs: receipts 0.15, blocked protocol 0.09, weakest = receipts. Correct - the handoff listed checklist rows without per-row receipts; an addendum with per-row receipts was sent the same hour and scored 0.86 / 0.97.

Rank of a release-cut checklist: Jev put the SBOM row first and a dependency-pin row second; the lead kept the pin first because it blocks two gates, a dependency the context stated only in prose. Lesson: pass dependencies as structured facts.

Cost: ~1,000 input / ~190 output tokens per triage; ~900/146 per dispatch check; ~2 requests per ranked item.

## 2026-09-17 - gavel reviews its own release (1.0.0)

The author triaged the pull request that publishes this skill as if it were a worker's return. Verdict: `rework` (0.90), evidence 2.83, scope_creep 0.66, against the author's instinct to accept. Policy line 1 applied - the disagreement was written down and examined, and it was right twice: the return admitted an unfinished step (a stale registration under the old name), and the option names still carried one project's vocabulary (`consult_cto`, `kai`, `cto`). Both were fixed before merge: the stale registration was removed, the options became `consult_owner`, `lead`, `accountable_human`, and the four labelled evals were rerun (4/4 agree; the consult case's next owner moved from 1.00 to 0.90 `lead` after the wording change). The scope_creep signal was a false positive: the marketplace's own tests require the catalogue, policy and manifest updates. Lesson: state repository-mandated side work in the dispatch, or the model reads it as creep.
````


---

## Bundled file: `references/questions.md`

````markdown
# Question catalogue and rationale (gavel 1.0.0)

Designed by the TypeSafe rules: one narrow judgment per question, complete meaning in the question (ids are not shown to the model), named state fields (`dispatch`, `return_text`, `handoff`, `item`, `context`), criteria that describe concrete situations, a no-match outcome where nothing may fit, independent questions asked together so they run in parallel.

## triage (state: dispatch, return_text)
- `disposition` Choice - the five outcomes a lead actually has when a return lands. `withdraw` exists because work is sometimes done elsewhere (another worker closed an incident before the dispatch for it went out).
- `evidence_quality` Score, four levels from narrative to re-verifiable identities - the ladder behind "read the receipt before you send it" and "a green suite is not evidence".
- `silent_gap` Noul - the classic failure: exit code 0 with no artifact; "done" with a step skipped.
- `scope_creep` Noul - protects lane boundaries (one owner per fact).
- `irreversible` Noul - the destructive-operation trigger: stop for the accountable human.
- `next_owner` Choice - lead / same_worker / other_worker / accountable_human.
- `urgency` Score - backlog / this week / today / now.

## dispatch (state: handoff)
Mirrors a good handoff contract: receipt per step, gate named, exclusions stated, blocked protocol, single owner; `weakest_part` names what to fix.

## rank (state: item, context)
Two Scores per item, `gate_blocking` and `risk_if_delayed`; the composite is the sum. Dependencies must be stated in `context` as facts; the model does not infer a graph from prose reliably (see calibration).

## Wording history
- 0.1.0: first set. A pre-release probe with the phrasing "claims success while its own evidence shows the deliverable is missing" scored only 0.23 on a silent-failure case; the shipped `silent_gap` wording ("presents the work as complete while one dispatched step was skipped, deferred, or left unproven without saying so plainly") scored 0.62 on the same case. Phrase gaps as omissions, not as contradictions.
````


---

## Bundled file: `tools/gavel.py`

````python
#!/usr/bin/env python3
"""Gavel: typed System One judgments (TypeSafe Jev) for a project lead's decisions.

Usage:
  gavel.py triage   <packet.json|-> [--json]   # a worker return / handback / consult
  gavel.py dispatch <handoff.txt|-> [--json]   # a draft handoff before sending
  gavel.py rank     <items.json>  [--json]
  gavel.py selftest                        # offline: question maps + redactor, no tokens spent     # candidate work items -> ordered list
Key: JEV_API_KEY from the environment, else read by name from the nearest .env above the CWD (never printed).
The judgments are inputs to the lead's decision, never the decision.
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
                     "consult_owner": "the next step needs a decision only the accountable human can make (irreversible action, spend, product boundary)",
                     "answer_questions": "the worker asks the lead questions that block them; the lead must rule before work continues"}},
    "evidence_quality": {"type": "score", "instructions": "How verifiable is the evidence in `return_text`?",
        "criteria": ["narrative only: claims with no commands, outputs, or identifiers",
                     "commands named but outputs or identifiers missing",
                     "outputs pasted but not tied to an artifact identity (no SHA, object size, run id)",
                     "receipts with identities a reader can re-verify independently"]},
    "silent_gap": {"type": "noul", "instructions": "Does `return_text` present the work as complete while one dispatched step was skipped, deferred, or left unproven without saying so plainly?"},
    "scope_creep": {"type": "noul", "instructions": "Does `return_text` report work outside the scope in `dispatch`?"},
    "irreversible": {"type": "noul", "instructions": "Does `return_text` perform or request an irreversible step (deletion, database reset, restore-over, public publish, spend) that needs the accountable human to say yes first?"},
    "next_owner": {"type": "choice", "instructions": "Who must act next on `return_text`?",
        "criteria": {"lead": "the lead, who is reading this return, adjudicates, integrates, rules, or answers the questions the worker asked", "same_worker": "the same worker continues or reworks", "other_worker": "another lane owns the next step", "accountable_human": "a decision above the lead's authority is required from the accountable human (irreversible action, spend, product boundary)"}},
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
        "criteria": ["blocks nothing", "blocks a planned wave", "blocks a gate or another worker today", "blocks a release or a human decision now"]},
    "risk_if_delayed": {"type": "score", "instructions": "What is at risk if `item` waits a week, given `context`?",
        "criteria": ["nothing material", "rework or cost", "data loss, security exposure, or customer impact", "irreversible loss"]},
}

def selftest():
    # ponytail: one offline check; it fails if a question map or the redactor breaks
    for name, qs in (("TRIAGE", TRIAGE), ("DISPATCH", DISPATCH), ("RANK", RANK)):
        for qid, q in qs.items():
            assert q["type"] in ("choice", "noul", "score") and q["instructions"].strip(), (name, qid)
            if q["type"] == "choice": assert isinstance(q["criteria"], dict) and len(q["criteria"]) >= 2, (name, qid)
            if q["type"] == "score": assert isinstance(q["criteria"], list) and 2 <= len(q["criteria"]) <= 10, (name, qid)
    # token shapes are assembled at runtime so no credential-looking literal lives in the source
    sample = " ".join(["api" + "key_" + "abc123", "gh" + "p_" + "a" * 16, "AK" + "IA" + "A" * 16, "Bear" + "er " + "xyz.123"])
    red = REDACT.sub("<redacted>", sample)
    assert red.count("<redacted>") == 4 and "xyz.123" not in red, red
    print("selftest ok: %d triage, %d dispatch, %d rank questions; redactor masks 4 token shapes" % (len(TRIAGE), len(DISPATCH), len(RANK)))

def main(a):
    if a[:1] == ["selftest"]: return selftest()
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
