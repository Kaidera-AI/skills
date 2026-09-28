"""Read-only project transfer policy, deny scan and Gavel redaction backstop."""

import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import unicodedata

SKILL = Path(__file__).resolve().parents[2]
POLICIES = SKILL.parents[1] / "config"
REDACT = re.compile(r"(apikey_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|Bearer[ \t]+(?=[A-Za-z0-9._~+/-]*[0-9])[A-Za-z0-9._~+/-]{16,}={0,2}(?![A-Za-z0-9._~+/-=])|-----BEGIN[^-]+-----)")
EMAIL_DOTS = str.maketrans({"。": ".", "．": ".", "｡": "."})


def config(name, directory=None):
    return json.loads(((Path(directory) if directory else SKILL / "config") / name).read_text())


def policy_file(project=None, path=None):
    if POLICIES.is_symlink():
        raise ValueError("policy directory is a link")
    if project is None:
        choices = sorted(POLICIES.glob("transfer-policy.*.json"))
        if len(choices) != 1:
            return None, None
        project = choices[0].name.removeprefix("transfer-policy.").removesuffix(".json")
    if type(project) is not str or not re.fullmatch(r"[a-z0-9][a-z0-9_-]{0,63}", project):
        raise ValueError("invalid project key")
    root = POLICIES.absolute()
    candidate = Path(path).absolute() if path is not None else root / f"transfer-policy.{project}.json"
    if candidate.parent != root or candidate.name != f"transfer-policy.{project}.json" or candidate.is_symlink():
        raise ValueError("policy path escapes its directory")
    try:
        details = candidate.lstat()
    except FileNotFoundError:
        return candidate, project
    if not stat.S_ISREG(details.st_mode) or candidate.resolve().parent != root.resolve():
        raise ValueError("policy path is not a regular direct child")
    return candidate, project


def _load_policy(path):
    root_fd = os.open(POLICIES, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        fd = os.open(path.name, os.O_RDONLY | os.O_NOFOLLOW, dir_fd=root_fd)
        with os.fdopen(fd) as source:
            if not stat.S_ISREG(os.fstat(source.fileno()).st_mode):
                raise ValueError("policy file is not regular")
            return json.load(source)
    finally:
        os.close(root_fd)


def _forbidden_fields(value, names):
    if isinstance(value, dict):
        return any(key.casefold() in names or _forbidden_fields(child, names) for key, child in value.items())
    if isinstance(value, list):
        return any(_forbidden_fields(child, names) for child in value)
    return False

def _valid_value(value, category, limits):
    values = [value] if isinstance(value, str) else value if isinstance(value, list) else None
    if values is None or len(values) > limits["max_state_list_items"]:
        return False
    if not values:
        return category == "process_receipt_summaries"
    maximum = limits["category_max_chars"].get(category)
    if type(maximum) is not int or maximum <= 0:
        return False
    for text in values:
        if not isinstance(text, str) or not text.strip() or len(text) > maximum:
            return False
        normalized = unicodedata.normalize("NFKC", text)
        if category == "project_keys" and not re.fullmatch(r"[a-z0-9][a-z0-9_-]{0,63}", normalized):
            return False
        if category == "agent_role_names" and not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*(?:@[A-Za-z0-9_-]+)?", normalized):
            return False
        if category == "sha256_identities" and not re.fullmatch(r"[a-fA-F0-9]{64}", normalized):
            return False
        if category == "relative_source_paths":
            parts = normalized.split("/")
            if (PurePosixPath(normalized).is_absolute()
                    or normalized.startswith("~")
                    or "\\" in normalized
                    or re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", normalized)
                    or any(part in ("", "..") for part in parts)
                    or any(ord(char) < 32 for char in normalized)):
                return False
    return True


def _texts(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from _texts(key)
            yield from _texts(item)
    elif isinstance(value, list):
        for item in value:
            yield from _texts(item)

def _value_texts(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for child in value.values():
            yield from _value_texts(child)
    elif isinstance(value, list):
        for child in value:
            yield from _value_texts(child)


def _key_fragments(key, directory):
    if not key:
        return ()
    minimum = config("limits.json", directory)["min_key_fragment_chars"]
    if type(minimum) is not int or minimum < 1:
        raise ValueError("invalid key fragment bound")
    normalized = unicodedata.normalize("NFKC", key)
    width = min(minimum, len(normalized))
    return {normalized[i:i + width] for i in range(len(normalized) - width + 1)}




def inspect_content(value, *, key=None, config_dir=None, rules=None):
    try:
        rules = rules if rules is not None else config("deny_patterns.json", config_dir)
        fragments = _key_fragments(key, config_dir)
        serialized = json.dumps(value, ensure_ascii=False)
        texts = [serialized, *_texts(value)]
        for text in texts:
            normalized = unicodedata.normalize("NFKC", text)
            if key and (key in normalized or any(fragment in normalized for fragment in fragments)):
                return "abstained_deny_pattern", "outbound request contains credential value"
            for pattern_class, expressions in rules.items():
                inspected = normalized.translate(EMAIL_DOTS) if pattern_class == "email_address" else normalized
                if any(re.search(expression, inspected) for expression in expressions):
                    return "abstained_deny_pattern", f"outbound request matched {pattern_class}"
            if REDACT.search(normalized):
                return "abstained_deny_pattern", "outbound request matched redaction_backstop"
        if fragments:
            joined = unicodedata.normalize("NFKC", "".join(_value_texts(value)))
            if any(fragment in joined for fragment in fragments):
                return "abstained_deny_pattern", "outbound request contains credential value"
    except (TypeError, ValueError, AttributeError, re.error):
        return "abstained_policy", "deny-pattern configuration or outbound content is invalid"
    return None, None


def check(state, categories, *, role, project=None, policy_path=None, config_dir=None):
    """Return (status, reason, approved state); no send is possible on failure."""
    try:
        path, expected_project = policy_file(project, policy_path)
    except (OSError, ValueError):
        return "abstained_policy", "project key or policy path is invalid", None
    if path is None or not path.is_file():
        return "abstained_no_policy_file", "project transfer-policy file is missing or ambiguous; pass --project with your project key when several policy files exist", None
    try:
        policy = _load_policy(path)
        rules = config("deny_patterns.json", config_dir)
        limits = config("limits.json", config_dir)
        forbidden = set(limits["forbidden_state_fields"])
    except (OSError, ValueError, KeyError, TypeError):
        return "abstained_policy", "transfer-policy or sanitizer configuration is invalid", None
    if policy.get("project") != expected_project or policy.get("version") != 1:
        return "abstained_policy", "project transfer-policy identity is invalid", None
    roles = policy.get("roles")
    if not isinstance(roles, dict) or not isinstance(role, str) or role not in roles:
        return "abstained_policy", "role has no transfer-policy grant", None
    granted = roles[role]
    if not isinstance(granted, dict) or not isinstance(granted.get("allowed_categories"), list):
        return "abstained_policy", "role has no transfer-policy grant", None
    if not isinstance(state, dict) or not state or not isinstance(categories, dict):
        return "abstained_policy", "every outbound state field requires a category tag", None
    if any(not isinstance(field, str) for field in state):
        return "abstained_policy", "outbound state field name is invalid", None
    if _forbidden_fields(state, forbidden):
        return "abstained_policy", "raw source, diff, transcript or restricted payload field is not transferable", None
    for field, value in state.items():
        category = categories.get(field)
        known_categories = policy.get("categories")
        if not isinstance(category, str) or not isinstance(known_categories, list) or category not in granted["allowed_categories"] or category not in known_categories:
            named = category if isinstance(category, str) and isinstance(known_categories, list) and category in known_categories and category in limits["category_max_chars"] else None
            return "abstained_policy", f"category {named} is not granted" if named else "category is untagged or not granted", None
        if not _valid_value(value, category, limits):
            return "abstained_policy", "outbound state field has an invalid type or length for its category", None
    status, reason = inspect_content(state, rules=rules)
    if status:
        return status, reason, None
    return None, None, json.loads(json.dumps(state))
