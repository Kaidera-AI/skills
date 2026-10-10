"""robots.txt verdicts for every page or undocumented endpoint we read.

A site's robots.txt is its standing answer to "may an automated client read
this?". We obey it for HTML pages, feeds and endpoints a site's own front end
uses. Documented public APIs offered for programmatic use (a job board's
published postings API, say) are governed by their terms, not by robots.txt,
and the caller marks those ``official_api``.

The verdict follows urllib.robotparser: no robots.txt (404) allows everything;
401 or 403 on robots.txt disallows everything; an unreachable robots.txt is
reported as unknown and treated as a refusal, never as permission.
"""
from __future__ import annotations

import urllib.parse
import urllib.robotparser

from . import http

_CACHE: dict[str, tuple[str, urllib.robotparser.RobotFileParser | None]] = {}


def _parser_for(origin: str) -> tuple[str, urllib.robotparser.RobotFileParser | None]:
    if origin in _CACHE:
        return _CACHE[origin]
    rp = urllib.robotparser.RobotFileParser()
    try:
        resp = http.request("GET", f"{origin}/robots.txt", timeout=20)
    except Exception as exc:  # network failure: no verdict, so no permission
        result = (f"unknown ({type(exc).__name__})", None)
    else:
        if resp.status in (401, 403):
            rp.disallow_all = True
            result = ("disallow-all", rp)
        elif resp.status >= 400:
            rp.allow_all = True
            result = ("no robots.txt", rp)
        else:
            rp.parse(resp.text().splitlines())
            result = ("parsed", rp)
    _CACHE[origin] = result
    return result


def verdict(url: str, user_agent: str = http.USER_AGENT) -> tuple[bool, str]:
    """(allowed, reason) for one URL."""
    parts = urllib.parse.urlsplit(url)
    origin = f"{parts.scheme}://{parts.netloc}"
    state, rp = _parser_for(origin)
    if rp is None:
        return False, f"robots.txt {state}: not read, so not fetched"
    allowed = rp.can_fetch(user_agent.split("/")[0], url)
    return allowed, f"robots.txt {state}: {'allowed' if allowed else 'disallowed'}"


def crawl_delay(url: str, user_agent: str = http.USER_AGENT, default: float = 1.0) -> float:
    """Seconds to wait between requests to this site: its Crawl-delay, else default."""
    parts = urllib.parse.urlsplit(url)
    _, rp = _parser_for(f"{parts.scheme}://{parts.netloc}")
    delay = rp.crawl_delay(user_agent.split("/")[0]) if rp is not None else None
    return max(float(delay or 0), default)


def clear_cache() -> None:
    _CACHE.clear()
