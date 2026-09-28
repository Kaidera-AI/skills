"""Gavel: advisory lead triage, handoff dispatch and backlog ranking."""

import json

from ..client import JevResult, ask
from ..primitives import jev_screen
from ..sanitize import config

CATEGORY = "process_receipt_summaries"


def _questions(moment):
    return config("questions/lead.json")[moment]


def triage(text, *, role="lead", **kwargs):
    packet = json.loads(text) if text.lstrip().startswith("{") else {"return_text": text, "dispatch": "(not supplied)"}
    if not isinstance(packet, dict):
        return JevResult("error_validation", reason="Gavel triage packet must be an object")
    categories = {field: CATEGORY for field in packet if field in ("dispatch", "return_text")}
    return ask(packet, _questions("TRIAGE"), role=role, categories=categories, **kwargs)


def dispatch(text, *, role="lead", **kwargs):
    return ask({"handoff": text}, _questions("DISPATCH"), role=role, categories={"handoff": CATEGORY}, **kwargs)


def rank(text, *, role="lead", **kwargs):
    payload = json.loads(text)
    if not isinstance(payload, dict) or not isinstance(payload.get("items"), list) or not payload["items"] or not all(isinstance(item, str) and item.strip() for item in payload["items"]):
        return JevResult("error_validation", reason="Gavel rank requires nonempty items")
    context = payload.get("context", "")
    results = []
    usage = {"input_tokens": 0, "output_tokens": 0}
    for item in payload["items"]:
        result = ask({"item": item, "context": context}, _questions("RANK"), role=role, categories={"item": CATEGORY, "context": CATEGORY}, **kwargs)
        if result.status != "ok":
            return result
        answers = result.answers
        gate = round(answers["gate_blocking"]["score"], 2)
        risk = round(answers["risk_if_delayed"]["score"], 2)
        results.append({"item": item, "gate_blocking": gate, "risk_if_delayed": risk, "priority": round(answers["gate_blocking"]["score"] + answers["risk_if_delayed"]["score"], 2), "model": result.model})
        for counter in usage:
            usage[counter] += result.usage[counter]
    results.sort(key=lambda value: -value["priority"])
    return JevResult("ok", answers={"ranked": results}, usage=usage, model=results[-1]["model"])


def screen(content, *, role="lead", **kwargs):
    return jev_screen(content, role=role, **kwargs)
