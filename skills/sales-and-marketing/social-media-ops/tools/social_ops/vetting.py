"""Vet a third-party scraping, posting or automation repository before anyone runs it.

Owners send repositories that promise reach: browser extensions that post for
you, scrapers for social networks, "auto-apply" bots. Most fail on the same few
points, so this scan reads the code (it never installs or runs anything) and
returns the red flags with file and line, plus the facts a verdict needs:
licence, last commit, size. The verdict itself stays a human reading of the
flags against four questions:

    1. Does it get past a site's blocks (stealth, proxies, CAPTCHA solving,
       ignoring robots.txt)?  Then it is out, whatever it costs.
    2. Does it drive a real account through the web UI or with a stored
       password?  Then the account is the thing at risk.
    3. Does it collect people's personal data?  Then data-protection notice
       duties follow every row.
    4. Does it leak or phone home (committed keys, open servers, a remote
       relay that can trigger actions)?

What is left after that is usually an idea, not code: take the idea and build
it on an official route.
"""
from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

CODE_SUFFIXES = {".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".cfg", ".ini", ".toml",
                 ".yaml", ".yml", ".env", ".example", ".sh", ".rb", ".go", ".java", ".php", ".html"}
SKIP_DIRS = {".git", "node_modules", "dist", "build", "vendor", "__pycache__", ".venv", "venv"}
SKIP_FILES = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock", "Pipfile.lock"}
MAX_FILE_BYTES = 1_000_000

# (flag, question it answers, pattern). Patterns are deliberately specific: a
# flag must point at code that does the thing, not at a README that mentions it.
FLAGS: list[tuple[str, int, re.Pattern]] = [
    ("stealth or fingerprint evasion", 1, re.compile(
        r"puppeteer-extra-plugin-stealth|StealthPlugin|undetected[_-]chromedriver|playwright[_-]stealth|"
        r"anonymize-ua|AnonymizeUA|defineProperty\(navigator,\s*['\"]webdriver", re.I)),
    ("proxy rotation or paid unblocker", 1, re.compile(
        r"residential|proxy_pool|PROXY_LIST|rotat\w*[_ ]prox|--proxy-server|scrapeops|scrapfly|brightdata|"
        r"zyte|smartproxy|oxylabs|asp\s*=\s*True|unblocker|proxy[-_]agent", re.I)),
    ("CAPTCHA solving", 1, re.compile(r"2captcha|anti-?captcha|capsolver|deathbycaptcha|recaptcha.*solv", re.I)),
    ("robots.txt ignored", 1, re.compile(r"ROBOTSTXT_OBEY\s*=\s*False|ignore[_-]?robots", re.I)),
    ("user-agent rotation", 1, re.compile(r"user[-_]agents['\"]|random[_-]?user[_-]?agent|fake[_-]useragent|"
                                          r"new UserAgent\(", re.I)),
    ("stored account password", 2, re.compile(
        r"(LINKEDIN|TWITTER|X|INSTAGRAM|FACEBOOK|THREADS|TIKTOK)_(PASSWORD|PASS|PWD)\b", re.I)),
    ("login form automation", 2, re.compile(r"(goto|navigate\w*)\(\s*['\"`][^'\"`]*/login|#username|#password|"
                                            r"type\(\s*['\"]#?password", re.I)),
    ("UI posting or auto-submit", 2, re.compile(
        r"isAutoPublish|PUBLISH_NOW|auto[_-]?apply|easy[_-]?apply|share-box|\.click\(\s*['\"][^'\"]*(post|submit|"
        r"publish|apply)", re.I)),
    ("session cookie reuse", 2, re.compile(r"cookies\.json|li_at\b|auth_token\b|saveCookies|setCookie\(", re.I)),
    ("people-profile collection", 3, re.compile(
        r"linkedin\.com/in/|people_profile|/search/results/people|recruiters?\b.*(scrap|extract|save)|"
        r"profile_list|scrape_profile", re.I)),
    ("committed credential", 4, re.compile(
        r"(api[_-]?key|secret|token|password)\s*[:=]\s*['\"](?!your|xxx|<|\$\{|YOUR|changeme)[A-Za-z0-9_\-]{16,}['\"]",
        re.I)),
    ("open local server", 4, re.compile(r"app\.use\(\s*cors\(\s*\)\s*\)|0\.0\.0\.0|Access-Control-Allow-Origin['\"]?\s*[:,]\s*['\"]\*",
                                        re.I)),
    ("remote command relay", 4, re.compile(r"setInterval\(\s*(ping|poll\w*|heartbeat|fetchTasks?|checkTasks?)\b|"
                                           r"fetch\(\s*[`'\"]\$\{\w+\}/api/[\w/-]*(ping|poll|tasks?)\b|"
                                           r"chrome\.alarms\.create", re.I)),
]
QUESTIONS = {1: "gets past a site's blocks", 2: "drives a real account", 3: "collects personal data",
             4: "leaks or phones home"}


@dataclass
class Finding:
    flag: str
    question: int
    file: str
    line: int
    text: str


def _files(root: Path) -> list[Path]:
    out = []
    for p in root.rglob("*"):
        if any(part in SKIP_DIRS for part in p.relative_to(root).parts):
            continue
        if p.name in SKIP_FILES:
            continue
        if p.is_file() and not p.is_symlink() and (p.suffix.lower() in CODE_SUFFIXES or p.name.startswith(".env")):
            if p.stat().st_size <= MAX_FILE_BYTES:
                out.append(p)
    return sorted(out)


def _licence(root: Path) -> str:
    for name in ("LICENSE", "LICENSE.md", "LICENSE.txt", "LICENCE", "COPYING"):
        f = root / name
        if f.is_file():
            head = f.read_text(errors="replace")[:400]
            for spdx in ("Non-Profit Open Software", "Open Software", "GNU AFFERO", "GNU GENERAL PUBLIC",
                         "GNU LESSER", "Apache", "Mozilla", "BSD", "Unlicense", "ISC", "MIT"):
                if spdx.lower() in head.lower():
                    return f"{name}: {spdx}"
            return f"{name}: present, type not recognised"
    pkg = root / "package.json"
    if pkg.is_file():
        try:
            declared = json.loads(pkg.read_text()).get("license")
        except ValueError:
            declared = None
        if declared:
            return f"no licence file; package.json declares {declared} (not a grant on its own)"
    return "no licence file: all rights reserved, the code may not be reused"


def _git_facts(root: Path) -> dict[str, Any]:
    def git(*args: str) -> str:
        try:
            return subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True,
                                  timeout=30).stdout.strip()
        except Exception:
            return ""
    return {"head": git("rev-parse", "--short", "HEAD"), "last_commit": git("log", "-1", "--format=%cs"),
            "commits_seen": git("rev-list", "--count", "HEAD")}


def scan(root: Path) -> dict[str, Any]:
    root = root.resolve()
    findings: list[Finding] = []
    files = _files(root)
    for f in files:
        rel = str(f.relative_to(root))
        for n, line in enumerate(f.read_text(errors="replace").splitlines(), 1):
            if len(line) > 2000:
                continue
            for flag, q, rx in FLAGS:
                if rx.search(line):
                    findings.append(Finding(flag, q, rel, n, line.strip()[:160]))
    by_q: dict[int, list[str]] = {}
    for f in findings:
        if f.flag not in by_q.setdefault(f.question, []):
            by_q[f.question].append(f.flag)
    return {
        "root": root.name, "scanned_at": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "files_scanned": len(files), "licence": _licence(root), **_git_facts(root),
        "questions": {QUESTIONS[q]: flags for q, flags in sorted(by_q.items())},
        "findings": [asdict(f) for f in findings],
    }


def summary_lines(report: dict[str, Any], max_per_flag: int = 2) -> list[str]:
    lines = [f"{report['root']}: {report['files_scanned']} files, last commit {report.get('last_commit') or '?'}, "
             f"{report['licence']}"]
    if not report["questions"]:
        lines.append("No red flags matched. Read the code anyway: a clean scan is not a clean bill.")
    for question, flags in report["questions"].items():
        lines.append(f"- {question}: {', '.join(flags)}")
    shown: dict[str, int] = {}
    for f in report["findings"]:
        if shown.get(f["flag"], 0) < max_per_flag:
            shown[f["flag"]] = shown.get(f["flag"], 0) + 1
            lines.append(f"    {f['file']}:{f['line']}  [{f['flag']}]  {f['text']}")
    return lines
