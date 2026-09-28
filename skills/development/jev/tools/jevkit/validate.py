"""Validate Jev question/answer contracts before trusting any result."""

import math
import re


def _record(value):
    return isinstance(value, dict) and all(isinstance(key, str) for key in value)


def _number(value):
    return type(value) in (int, float) and math.isfinite(value)

def _bounded_text(value, maximum=None):
    return isinstance(value, str) and bool(value.strip()) and (maximum is None or len(value) <= maximum)


def questions_valid(questions, limits=None):
    if not _record(questions) or not questions:
        return False
    text_max = limits["max_question_chars"] if limits else None
    criterion_max = limits["max_criterion_chars"] if limits else None
    id_max = limits["max_question_id_chars"] if limits else None
    for question_id, question in questions.items():
        if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]*", question_id) or id_max is not None and len(question_id) > id_max:
            return False
        if not _record(question) or question.get("type") not in ("choice", "noul", "score") or set(question) - {"type", "instructions", "criteria"}:
            return False
        if not _bounded_text(question.get("instructions"), text_max):
            return False
        criteria = question.get("criteria")
        if question["type"] == "choice":
            if not _record(criteria) or not 2 <= len(criteria) <= (limits["max_choice_options"] if limits else 255):
                return False
            if any(not re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", key) or id_max is not None and len(key) > id_max or text is not None and not _bounded_text(text, criterion_max) for key, text in criteria.items()):
                return False
        elif question["type"] == "score":
            if not isinstance(criteria, list) or not 2 <= len(criteria) <= min(10, limits["max_score_levels"] if limits else 10):
                return False
            if any(not _bounded_text(text, criterion_max) for text in criteria):
                return False
        elif criteria is not None and (not _record(criteria) or set(criteria) != {"true", "false"} or any(not _bounded_text(text, criterion_max) for text in criteria.values())):
            return False
    return True


def _distribution(probabilities, expected):
    if not _record(probabilities) or set(probabilities) != set(expected):
        raise ValueError("probability keys differ from question criteria")
    values = list(probabilities.values())
    if any(not _number(value) or not 0 <= value <= 1 for value in values):
        raise ValueError("probabilities must be finite in [0,1]")
    nonzero = sum(value > 0 for value in values)
    tolerance = min(0.05, max(0.01, 0.005 * nonzero)) + 1e-9
    if abs(sum(values) - 1) > tolerance:
        raise ValueError("probability distribution does not sum to one")


def validate(reply, questions):
    if not questions_valid(questions) or not _record(reply) or set(reply) != {"answers", "usage", "model"} or not _record(reply.get("answers")):
        raise ValueError("invalid questions or answer envelope")
    answers = reply["answers"]
    if set(answers) != set(questions):
        raise ValueError("answer question ids differ from requested ids")
    for question_id, question in questions.items():
        answer = answers[question_id]
        if not _record(answer) or answer.get("type") != question["type"]:
            raise ValueError("answer type differs from question type")
        allowed = {"type", "noul"} if question["type"] == "noul" else {"type", "choice", "probabilities", "confidence"} if question["type"] == "choice" else {"type", "score", "probabilities", "confidence", "legend"}
        if set(answer) - allowed:
            raise ValueError("answer contains unexpected fields")
        if question["type"] == "noul":
            if not _number(answer.get("noul")) or not 0 <= answer["noul"] <= 1:
                raise ValueError("noul probability is invalid")
            continue
        keys = list(question["criteria"]) if question["type"] == "choice" else [str(i) for i in range(len(question["criteria"]))]
        if question["type"] == "score" and "legend" in answer and answer["legend"] != dict(zip(keys, question["criteria"])):
            raise ValueError("score legend differs from criteria")
        _distribution(answer.get("probabilities"), keys)
        confidence = answer.get("confidence")
        if confidence is not None and (not _number(confidence) or not 0 <= confidence <= 1):
            raise ValueError("answer confidence is invalid")
        if question["type"] == "choice":
            selected = answer.get("choice")
            if selected not in keys or answer["probabilities"][selected] + 0.001 < max(answer["probabilities"].values()):
                raise ValueError("choice differs from distribution maximum")
        elif not _number(answer.get("score")) or not 0 <= answer["score"] <= len(keys) - 1:
            raise ValueError("score lies outside its criteria levels")
    usage = reply.get("usage")
    if not _record(usage) or set(usage) != {"input_tokens", "output_tokens"} or any(type(usage.get(key)) is not int or not 0 <= usage[key] <= 2**53 - 1 for key in ("input_tokens", "output_tokens")):
        raise ValueError("usage counters are invalid")
    model = reply.get("model")
    if not isinstance(model, str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,127}", model):
        raise ValueError("returned model id is invalid")
    return answers, usage, model
