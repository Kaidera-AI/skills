#!/usr/bin/env python3
"""
security-scan.py — Gate 2 injection pattern scan for SKILL.md files.

Uses the repository's shared bounded pattern corpus. Passing this scan is not
proof that a separate platform runtime sanitiser has identical policy or that a
skill is safe to inject.

Usage:
    python scripts/security-scan.py skills/development/code-review.SKILL.md
    echo $?  # 0 = clean, 1 = blocked
"""

import base64
import binascii
import json
import os
import re
import stat
import sys
from pathlib import Path

MAX_SKILL_BYTES = 1024 * 1024

# ── Injection patterns (must mirror security/skill_sanitiser.py) ──────────────

PATTERN_PATH = Path(__file__).resolve().parent.parent / "spec" / "skill-security-patterns.json"
PATTERN_DOCUMENT = json.loads(PATTERN_PATH.read_text(encoding="utf-8"))
if (
    not isinstance(PATTERN_DOCUMENT, dict)
    or set(PATTERN_DOCUMENT) != {"schema_version", "patterns"}
    or PATTERN_DOCUMENT.get("schema_version") != 1
    or not isinstance(PATTERN_DOCUMENT.get("patterns"), list)
    or not PATTERN_DOCUMENT["patterns"]
):
    raise ValueError("invalid shared security pattern document")

_pattern_ids: set[str] = set()
_pattern_names: set[str] = set()
for _item in PATTERN_DOCUMENT["patterns"]:
    if (
        set(_item) != {"id", "name", "pattern", "flags"}
        or not isinstance(_item["id"], str)
        or not re.fullmatch(r"[a-z0-9-]+", _item["id"])
        or _item["id"] in _pattern_ids
        or not isinstance(_item["name"], str)
        or not _item["name"]
        or _item["name"] in _pattern_names
        or not isinstance(_item["pattern"], str)
        or not _item["pattern"]
        or _item["flags"] not in ("", "i")
    ):
        raise ValueError(f"invalid shared security pattern entry: {_item.get('id')!r}")
    _pattern_ids.add(_item["id"])
    _pattern_names.add(_item["name"])

BLOCKED_PATTERNS = [
    (re.compile(item["pattern"], re.IGNORECASE if item["flags"] == "i" else 0), item["name"])
    for item in PATTERN_DOCUMENT["patterns"]
]

BASE64_CANDIDATE_RE = re.compile(r"[A-Za-z0-9+/]{40,}={0,2}")


def read_skill_file(file_path: str) -> str:
    before = os.lstat(file_path)
    if not stat.S_ISREG(before.st_mode) or stat.S_ISLNK(before.st_mode):
        raise ValueError("skill path must be a regular non-symlink file")
    if before.st_size > MAX_SKILL_BYTES:
        raise ValueError(f"skill exceeds {MAX_SKILL_BYTES} byte limit")

    flags = os.O_RDONLY | getattr(os, "O_NONBLOCK", 0) | getattr(os, "O_CLOEXEC", 0) | getattr(os, "O_NOFOLLOW", 0)
    descriptor = os.open(file_path, flags)
    try:
        held = os.fstat(descriptor)
        if not stat.S_ISREG(held.st_mode) or (held.st_dev, held.st_ino) != (before.st_dev, before.st_ino):
            raise ValueError("skill path changed before it could be read")
        chunks: list[bytes] = []
        remaining = MAX_SKILL_BYTES + 1
        while remaining:
            chunk = os.read(descriptor, min(65536, remaining))
            if not chunk:
                break
            chunks.append(chunk)
            remaining -= len(chunk)
        payload = b"".join(chunks)
        after = os.fstat(descriptor)
        if len(payload) > MAX_SKILL_BYTES or after.st_size != held.st_size or len(payload) != after.st_size:
            raise ValueError("skill bytes changed while they were being read or exceed the size limit")
        return payload.decode("utf-8", errors="strict")
    finally:
        os.close(descriptor)


def suspicious_base64(content: str) -> str | None:
    for candidate in BASE64_CANDIDATE_RE.findall(content):
        if len(candidate) % 4 or not re.search(r"[A-Z]", candidate) or not re.search(r"[a-z]", candidate) or not re.search(r"\d", candidate):
            continue
        try:
            decoded = base64.b64decode(candidate, validate=True)
        except (binascii.Error, ValueError):
            continue
        if len(decoded) < 24:
            continue
        printable = sum(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in decoded)
        if printable / len(decoded) >= 0.85:
            return candidate
    return None


def scan_file(file_path: str) -> list[tuple[str, str]]:
    """Return list of (pattern_name, matched_text) violations."""
    content = read_skill_file(file_path)
    violations = []
    for pattern, name in BLOCKED_PATTERNS:
        match = pattern.search(content)
        if match:
            violations.append((name, match.group(0)[:50]))
    encoded = suspicious_base64(content)
    if encoded:
        violations.append(("base64-encoded payload", encoded[:50]))
    return violations


def main() -> int:
    files = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not files:
        print("Usage: security-scan.py <skill-file.SKILL.md> ...", file=sys.stderr)
        return 1

    total_violations = 0
    for file_path in files:
        try:
            violations = scan_file(file_path)
        except (OSError, UnicodeError, ValueError) as error:
            print(f"BLOCK  {file_path}")
            print(f"  [unreadable skill] {error}")
            total_violations += 1
            continue
        if not violations:
            print(f"CLEAN  {file_path}")
        else:
            print(f"BLOCK  {file_path}")
            for name, snippet in violations:
                print(f"  [{name}] matched: {snippet!r}")
            total_violations += len(violations)

    if total_violations:
        print(f"\n{total_violations} violation(s) found. Skill blocked at Gate 2.")
        return 1

    print(f"\nAll {len(files)} skill(s) passed security scan.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
