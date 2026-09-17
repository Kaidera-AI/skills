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
