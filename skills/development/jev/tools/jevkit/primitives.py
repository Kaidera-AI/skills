"""Evidence-only verification, external-content screening and bounded decisions."""

import json
import re

from .client import JevResult, ask
from .sanitize import config


def _invalid(reason):
    return JevResult("error_validation", reason=reason)


def _thresholds(kind):
    return config("thresholds.json")[kind]


def _templates(kind):
    return config("questions/lead.json")[kind]


def _escaped_chars(value):
    return len(json.dumps(value)) - 2


def jev_verify(claims, evidence, *, role, categories, confident_at=None, **kwargs):
    limits = config("limits.json")
    if not isinstance(claims, list) or not 1 <= len(claims) <= limits["verify_max_claims"] or any(not isinstance(c, str) or not c.strip() or _escaped_chars(c) > limits["verify_max_claim_chars"] for c in claims):
        return _invalid("verify claims exceed JSON-escaped text or count bounds")
    raw_items = evidence if isinstance(evidence, list) else [evidence]
    if not 1 <= len(raw_items) <= limits["verify_max_evidence_items"] or any(
        not (isinstance(item, str) and item.strip() or isinstance(item, dict) and isinstance(item.get("text"), str) and item["text"].strip())
        or _escaped_chars(item if isinstance(item, str) else item["text"]) > limits["verify_max_evidence_chars"] for item in raw_items
    ):
        return _invalid("verify evidence exceeds JSON-escaped text or count bounds")
    point = _thresholds("verify")["confident_at"] if confident_at is None else confident_at
    if type(point) not in (int, float) or not 0 <= point <= 1:
        return _invalid("verify confidence annotation point is invalid")
    evidence_items = [{"id": f"evidence_{i}", "text": item if isinstance(item, str) else item["text"]} for i, item in enumerate(raw_items)]
    claim_items = [{"id": f"claim_{i}", "text": text} for i, text in enumerate(claims)]
    templates = _templates("VERIFY")
    questions = {}
    for claim in claim_items:
        question = templates["relation"]
        questions[f"relation_{claim['id']}"] = {"type": "choice", "instructions": question["instructions"].format(id=claim["id"], claim=claim["text"]), "criteria": question["criteria"]}
        if len(evidence_items) > 1:
            source = templates["source"]
            criteria = {item["id"]: None for item in evidence_items}
            criteria["none"] = source["none"]
            questions[f"source_{claim['id']}"] = {"type": "choice", "instructions": source["instructions"].format(id=claim["id"], claim=claim["text"]), "criteria": criteria}
    result = ask({"claims": claims, "evidence": [item["text"] for item in evidence_items]}, questions, role=role, categories=categories, **kwargs)
    if result.status != "ok":
        return result
    verdicts = {"supports": "verified", "contradicts": "contradicted", "says_nothing": "unsupported"}
    entries = []
    for claim in claim_items:
        relation = result.answers[f"relation_{claim['id']}"]
        source = result.answers.get(f"source_{claim['id']}", {}).get("choice")
        entries.append({"id": claim["id"], "claim": claim["text"], "verdict": verdicts[relation["choice"]], "probabilities": relation["probabilities"], "confidence": relation.get("confidence"), "confidence_annotation": "above_uncalibrated_confident_at" if relation.get("confidence") is not None and relation["confidence"] >= point else "below_uncalibrated_confident_at", "supporting_evidence": source if source != "none" else None})
    return JevResult("ok", answers={"results": entries, "confident_at": point, "calibrated": False}, usage=result.usage, model=result.model)


def jev_screen(text, *, role, purpose=None, block_at=None, review_at=None, **kwargs):
    limits = config("limits.json")
    if not isinstance(text, str) or not text.strip() or len(text) > limits["screen_max_chars"]:
        return _invalid("screen content exceeds configured bounds")
    points = _thresholds("screen")
    block = points["block_at"] if block_at is None else block_at
    review = points["review_at"] if review_at is None else review_at
    if any(type(value) not in (int, float) or not 0 <= value <= 1 for value in (block, review)) or review > block:
        return _invalid("screen annotation points are invalid")
    templates = _templates("SCREEN")
    state = {"content": text}
    categories = {"content": "public_external_content"}
    questions = {key: templates[key] for key in ("injection", "substance")}
    if purpose is not None:
        if not isinstance(purpose, str) or not purpose.strip():
            return _invalid("screen purpose is invalid")
        state["purpose"] = purpose
        categories["purpose"] = "process_receipt_summaries"
        template = templates["relevance"]
        questions["relevance"] = {**template, "instructions": template["instructions"].format(purpose=purpose)}
    result = ask(state, questions, role=role, categories=categories, **kwargs)
    if result.status == "abstained_no_key":
        signals = [pattern for pattern in points["local_heuristic_flags"] if re.search(pattern, text)]
        if signals:
            return JevResult("fallback_heuristic", answers={"flag": "review", "calibrated": False, "basis": "local indicators only; not a clearance"}, reason="provider key missing; local indicators raise review only")
    if result.status != "ok":
        return result
    probabilities = {key: result.answers[key]["noul"] for key in questions}
    injection = probabilities["injection"]
    label = "above_uncalibrated_block_at" if injection >= block else "above_uncalibrated_review_at" if injection >= review else "below_uncalibrated_review_at_not_a_clearance"
    return JevResult("ok", answers={"probabilities": probabilities, "injection_annotation": label, "block_at": block, "review_at": review, "calibrated": False}, usage=result.usage, model=result.model)


def _valid_id_map(values, minimum, maximum, description_limit, id_limit):
    if not isinstance(values, dict) or not minimum <= len(values) <= maximum:
        return False
    return all(isinstance(key, str) and re.fullmatch(r"[a-z][a-z0-9_-]*", key) and len(key) <= id_limit and isinstance(text, str) and text.strip() and _escaped_chars(text) <= description_limit for key, text in values.items())


def jev_decide(decision, evidence, priorities, candidates, *, role, categories, requirements=None, escape_hatches=True, **kwargs):
    limits = config("limits.json")
    requirements = {} if requirements is None else requirements
    strings = ((decision, "decide_max_decision_chars"), (evidence, "decide_max_evidence_chars"), (priorities, "decide_max_priorities_chars"))
    if any(not isinstance(value, str) or not value.strip() or _escaped_chars(value) > limits[limit] for value, limit in strings):
        return _invalid("decision, evidence or priorities exceed JSON-escaped character bounds")
    if not _valid_id_map(candidates, 2, limits["decide_max_candidates"], limits["decide_max_description_chars"], limits["decide_max_id_chars"]):
        return _invalid("decision candidates require unique bounded ids and JSON-escaped descriptions")
    if not _valid_id_map(requirements, 0, limits["decide_max_requirements"], limits["decide_max_requirement_chars"], limits["decide_max_id_chars"]):
        return _invalid("decision requirements require unique bounded ids and JSON-escaped descriptions")
    if type(escape_hatches) is not bool:
        return _invalid("decision escape_hatches must be boolean")
    templates = _templates("DECIDE")
    hatches = templates["recommendation"]["escape_hatches"]
    if escape_hatches and set(candidates) & set(hatches):
        return _invalid("decision candidate ids collide with escape hatches")
    criteria = dict(candidates)
    if escape_hatches:
        criteria.update(hatches)
    prompt = templates["recommendation"]
    questions = {"recommendation": {"type": "choice", "instructions": prompt["instructions"].format(hatch_instruction="Select a candidate or an escape hatch. " if escape_hatches else ""), "criteria": criteria}}
    check = templates["requirement"]
    for i, (candidate_id, description) in enumerate(candidates.items()):
        for j, (requirement_id, requirement) in enumerate(requirements.items()):
            questions[f"check_{i}_{j}"] = {"type": "choice", "instructions": check["instructions"].format(candidate_id=candidate_id, candidate_description=description, requirement_id=requirement_id, requirement_description=requirement), "criteria": check["criteria"]}
    state = {"decision": decision, "evidence": evidence, "priorities": priorities, "candidates": [f"{candidate_id}: {description}" for candidate_id, description in candidates.items()], "requirements": [f"{requirement_id}: {description}" for requirement_id, description in requirements.items()]}
    result = ask(state, questions, role=role, categories=categories, **kwargs)
    if result.status != "ok":
        return result
    recommended = result.answers["recommendation"]
    selected = recommended["choice"]
    checks = []
    for i, candidate_id in enumerate(candidates):
        for j, requirement_id in enumerate(requirements):
            answer = result.answers[f"check_{i}_{j}"]
            checks.append({"candidate": candidate_id, "requirement": requirement_id, "verdict": answer["choice"], "probabilities": answer["probabilities"], "confidence": answer.get("confidence")})
    warning_at = _thresholds("decide")["contradiction_warn_at"]
    contradicted = [check["requirement"] for check in checks if check["candidate"] == selected and check["verdict"] == "contradicted" and check["confidence"] is not None and check["confidence"] >= warning_at]
    annotations = {"selected": selected, "probability": recommended["probabilities"][selected], "confidence": recommended.get("confidence"), "escaped": selected not in candidates, "checks_table": checks, "warnings": ["Selected candidate has high-confidence contradictory checks: " + ", ".join(contradicted)] if contradicted else [], "calibrated": False}
    return JevResult("ok", answers=result.answers, usage=result.usage, model=result.model, annotations=annotations)
