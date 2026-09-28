#!/usr/bin/env python3
"""Jev toolkit CLI: advisory judgments only; no installation or daemon."""

import argparse
import json
import math
from pathlib import Path
import re
import sys
import tempfile
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent))
from jevkit.client import JevResult
from jevkit import primitives, sanitize, validate
from jevkit.playbooks import lead
from jevkit.primitives import jev_verify, jev_screen, jev_decide


class Parser(argparse.ArgumentParser):
    def error(self, message):
        raise ValueError("CLI arguments are invalid; run --help")


def _parser():
    parser = Parser(description="Jev: typed advisory evidence (Gavel is the lead playbook). Fail-closed: only status ok exits 0.", epilog="Decide packet: {decision, evidence, priorities, candidates:{id:description}, requirements:{id:description}}. Supply only policy-granted sanitized summaries, never code or diffs; recommendations never gate.")
    version = json.loads((sanitize.SKILL / "JEV_SOURCE.json").read_text())["toolkit_version"]
    parser.add_argument("--version", action="version", version=f"jev {version}", help="Print the installed core version offline")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("selftest", help="Validate config, questions, redactor and sanitizer offline; no API calls")
    leader = commands.add_parser("lead", help="Gavel lead moments: triage, dispatch, rank")
    moments = leader.add_subparsers(dest="moment", required=True)
    for name in ("triage", "dispatch", "rank"):
        action = moments.add_parser(name, help=f"Gavel {name}: advisory evidence only")
        action.add_argument("source", help="UTF-8 input file or - for stdin")
        action.add_argument("--role", default="lead", help="Declared policy-role selector, not authentication or proof of caller identity")
        action.add_argument("--project", help="Project key for its project-owned transfer policy")
        action.add_argument("--receipt", action="store_true", help="Opt in to a git-ignored, retention-bounded local receipt")
        action.add_argument("--json", action="store_true", help="Structured result (the default; retained for Gavel compatibility)")
    for name in ("verify", "screen", "decide"):
        action = commands.add_parser(name, help=f"{name} typed advisory evidence from a JSON request")
        action.add_argument("source", help="UTF-8 JSON file or - for stdin")
        action.add_argument("--role", required=True, help="Required declared policy-role selector, not authentication or proof of caller identity")
        action.add_argument("--project", help="Project key for its project-owned transfer policy")
        action.add_argument("--receipt", action="store_true", help="Opt in to a git-ignored, retention-bounded local receipt")
        action.add_argument("--json", action="store_true", help="Structured result (the default)")
    return parser


def _check_max_envelopes(limits, provider):
    worst_char = "\U0001f600"
    escaped_width = len(json.dumps(worst_char)) - 2

    def bounded_text(cap):
        return worst_char * (cap // escaped_width) + "x" * (cap % escaped_width)
    sizes = {}

    def inspect(state, questions, **kwargs):
        assert validate.questions_valid(questions, limits)
        state_bytes = len(json.dumps(state).encode())
        longest_question = max(len(json.dumps(question).encode()) for question in questions.values())
        body = json.dumps({"state": state, "model": max((provider["model_default"], provider["model_pin"]), key=len), "questions": questions}).encode()
        assert (state_bytes + longest_question) * 10 <= limits["max_context_token_bound"] * 9
        assert len(body) * 10 <= limits["max_request_token_bound"] * 9
        sizes["decide" if "decision" in state else "verify"] = (state_bytes, longest_question, len(body))
        return JevResult("abstained_no_key")

    width = limits["decide_max_id_chars"]
    candidates = {chr(97 + i) + "x" * (width - 1): bounded_text(limits["decide_max_description_chars"]) for i in range(limits["decide_max_candidates"])}
    requirements = {chr(114 + i) + "x" * (width - 1): bounded_text(limits["decide_max_requirement_chars"]) for i in range(limits["decide_max_requirements"])}
    with patch.object(primitives, "ask", side_effect=inspect):
        primitives.jev_decide(bounded_text(limits["decide_max_decision_chars"]), bounded_text(limits["decide_max_evidence_chars"]), bounded_text(limits["decide_max_priorities_chars"]), candidates, role="lead", categories={}, requirements=requirements)
        primitives.jev_verify([bounded_text(limits["verify_max_claim_chars"])] * limits["verify_max_claims"], [bounded_text(limits["verify_max_evidence_chars"])] * limits["verify_max_evidence_items"], role="lead", categories={})
    assert set(sizes) == {"decide", "verify"}
    return sizes


def _selftest():
    provider = sanitize.config("provider.json")
    limits = sanitize.config("limits.json")
    points = sanitize.config("thresholds.json")
    patterns = sanitize.config("deny_patterns.json")
    receipts = sanitize.config("receipts.json")
    maps = sanitize.config("questions/lead.json")
    assert provider["credential_env"] == "TYPESAFE_API_KEY" and provider["legacy_credential_env"] == "JEV_API_KEY"
    assert provider["endpoint"].startswith("https://") and all(isinstance(provider[key], str) and provider[key] for key in ("model_default", "model_pin"))
    assert provider["request_timeout_s"] > 0 and provider["total_deadline_s"] > 0 and provider["max_retries"] >= 0
    assert provider["backoff_initial_s"] >= 0 and provider["backoff_max_s"] >= provider["backoff_initial_s"] and 0 <= provider["backoff_jitter"] <= 1
    assert provider["total_deadline_s"] >= provider["request_timeout_s"] + provider["backoff_initial_s"] * (1 + provider["backoff_jitter"])
    assert provider["retry_statuses"] and all(type(code) is int and 400 <= code <= 599 for code in provider["retry_statuses"])
    assert all(type(value) is int and value > 0 for key, value in limits.items() if key not in ("forbidden_state_fields", "category_max_chars"))
    assert isinstance(limits["forbidden_state_fields"], list) and limits["forbidden_state_fields"]
    assert set(limits["category_max_chars"]) == {"project_keys", "agent_role_names", "relative_source_paths", "sha256_identities", "process_receipt_summaries", "public_external_content"}
    assert all(type(bound) is int and bound > 0 for bound in limits["category_max_chars"].values())
    assert points["calibrated"] is False and 0 <= points["verify"]["confident_at"] <= 1
    assert 0 <= points["screen"]["review_at"] <= points["screen"]["block_at"] <= 1
    assert 0 <= points["decide"]["contradiction_warn_at"] <= 1
    assert points["verify"]["source"] and points["screen"]["source"] and points["decide"]["source"] and all(re.compile(pattern) for pattern in points["screen"]["local_heuristic_flags"])
    assert set(patterns) == {"absolute_user_path", "email_address", "credential_shape", "fenced_code_block", "raw_diff_or_patch", "raw_code", "json_patch"}
    assert all(isinstance(group, list) and group and all(re.compile(pattern) for pattern in group) for group in patterns.values())
    assert receipts["enabled_default"] is False and receipts["path"].startswith("runs/") and type(receipts["retention_days"]) is int and receipts["retention_days"] > 0
    assert all(name in maps for name in ("TRIAGE", "DISPATCH", "RANK", "VERIFY", "SCREEN", "DECIDE"))
    assert all(validate.questions_valid(maps[name], limits) for name in ("TRIAGE", "DISPATCH", "RANK"))
    assert validate.questions_valid({"relation": maps["VERIFY"]["relation"], "injection": maps["SCREEN"]["injection"], "requirement": maps["DECIDE"]["requirement"]}, limits)
    envelopes = _check_max_envelopes(limits, provider)
    tokens = " ".join(("api" + "key_" + "x123", "gh" + "p_" + "x" * 16, "AK" + "IA" + "A" * 16, "Bear" + "er " + "A" * 15 + "7"))
    assert sanitize.REDACT.sub("<redacted>", tokens).count("<redacted>") == 4
    category = {"summary": "process_receipt_summaries"}
    fixture = sanitize.SKILL / "config/selftest_fixture_policy.json"
    with tempfile.TemporaryDirectory() as directory:
        policy_dir = Path(directory)
        (policy_dir / "transfer-policy.fixture.json").write_bytes(fixture.read_bytes())
        with patch.object(sanitize, "POLICIES", policy_dir):
            status, _, approved = sanitize.check({"summary": "Synthetic process receipt"}, category, role="lead", project="fixture")
            assert status is None and approved == {"summary": "Synthetic process receipt"}
            status, _, _ = sanitize.check({"summary": "synthetic"}, {"summary": "public_external_content"}, role="lead", project="fixture")
            assert status == "abstained_policy"
            status, _, _ = sanitize.check({"summary": "/Users/example/private"}, category, role="lead", project="fixture")
            assert status == "abstained_deny_pattern"
    return f"selftest ok: {len(maps['TRIAGE'])} triage, {len(maps['DISPATCH'])} dispatch, {len(maps['RANK'])} rank questions; config, redactor and three-layer sanitizer validated offline; max envelopes (state + longest question = context, full request): decide {envelopes['decide']}, verify {envelopes['verify']}"

class PacketFieldError(ValueError):
    def __init__(self, field, problem):
        super().__init__(f"CLI input field `{field}` {problem}")


def _required(packet, field, valid):
    if field not in packet:
        raise PacketFieldError(field, "is missing")
    value = packet[field]
    if not valid(value):
        raise PacketFieldError(field, "is invalid")
    return value


def _text(value):
    return isinstance(value, str) and bool(value.strip())


def _categories(packet, fields, required):
    if not required and "categories" not in packet:
        return {field: "process_receipt_summaries" for field in fields}
    return _required(packet, "categories", lambda value: isinstance(value, dict) and all(_text(value.get(field)) for field in fields))


def _verify_request(packet, opts):
    claims = _required(packet, "claims", lambda value: isinstance(value, list) and bool(value) and all(_text(item) for item in value))
    evidence = _required(packet, "evidence", lambda value: isinstance(value, (str, list, dict)) and bool(value))
    categories = _categories(packet, ("claims", "evidence"), required=True)
    confident_at = packet.get("confident_at")
    if confident_at is not None and (type(confident_at) not in (int, float) or not math.isfinite(confident_at) or not 0 <= confident_at <= 1):
        raise PacketFieldError("confident_at", "is invalid")
    return jev_verify(claims, evidence, categories=categories, confident_at=confident_at, **opts)


def _screen_request(packet, opts):
    text = _required(packet, "text", _text)
    purpose = packet.get("purpose")
    if purpose is not None and not _text(purpose):
        raise PacketFieldError("purpose", "is invalid")
    points = sanitize.config("thresholds.json")["screen"]
    block = packet.get("block_at", points["block_at"])
    review = packet.get("review_at", points["review_at"])
    for field, value in (("block_at", block), ("review_at", review)):
        if type(value) not in (int, float) or not math.isfinite(value) or not 0 <= value <= 1:
            raise PacketFieldError(field, "is invalid")
    if review > block:
        raise PacketFieldError("review_at", "exceeds block_at")
    return jev_screen(text, purpose=purpose, block_at=block, review_at=review, **opts)


def _decide_request(packet, opts):
    decision = _required(packet, "decision", _text)
    evidence = _required(packet, "evidence", _text)
    priorities = _required(packet, "priorities", _text)
    candidates = _required(packet, "candidates", lambda value: isinstance(value, dict) and bool(value))
    requirements = _required(packet, "requirements", lambda value: isinstance(value, dict))
    fields = ("decision", "evidence", "priorities", "candidates", "requirements")
    categories = _categories(packet, fields, required=False)
    escape_hatches = packet.get("escape_hatches", True)
    if type(escape_hatches) is not bool:
        raise PacketFieldError("escape_hatches", "is invalid")
    return jev_decide(decision, evidence, priorities, candidates, categories=categories, requirements=requirements, escape_hatches=escape_hatches, **opts)



def _run(arguments, transport):
    if arguments.command == "selftest":
        print(_selftest())
        return 0
    text = sys.stdin.read() if arguments.source == "-" else Path(arguments.source).read_text()
    opts = {"role": arguments.role, "project": arguments.project, "receipt": arguments.receipt, "transport": transport}
    if arguments.command == "lead":
        result = getattr(lead, arguments.moment)(text, **opts)
    else:
        try:
            payload = json.loads(text)
        except json.JSONDecodeError:
            raise PacketFieldError("input", "is not valid JSON") from None
        if not isinstance(payload, dict):
            raise PacketFieldError("input", "must be a JSON object")
        if arguments.command == "verify":
            result = _verify_request(payload, opts)
        elif arguments.command == "screen":
            result = _screen_request(payload, opts)
        else:
            result = _decide_request(payload, opts)
    print(json.dumps(result.as_dict()))
    return 0 if result.status == "ok" else 2


def main(argv=None, *, transport=None):
    try:
        arguments = _parser().parse_args(argv)
        return _run(arguments, transport)
    except PacketFieldError as exc:
        print(json.dumps(JevResult("error_validation", reason=str(exc)).as_dict()))
        return 2
    except (ValueError, KeyError, OSError, TypeError, AssertionError, re.error):
        print(json.dumps(JevResult("error_validation", reason="CLI input or offline configuration is invalid").as_dict()))
        return 2


if __name__ == "__main__":
    sys.exit(main())
