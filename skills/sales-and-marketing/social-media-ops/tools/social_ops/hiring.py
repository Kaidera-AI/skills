"""Hiring signals: read prospects' public job boards and keep the roles that matter.

An organisation advertising AI, data or digital roles is spending in that area,
and the advert names the team. We read those adverts only where the employer
publishes them: its own job board's public API, or its careers site within
robots.txt. Never a social network's job search, never a logged-in session,
never a proxy. Postings are about organisations, not people, so nothing here
collects personal data; a recruiter's name in an advert body is never stored.

Sources (``kind`` in an account's config):
    greenhouse      boards-api.greenhouse.io/v1/boards/{board}/jobs            official API
    lever           api.lever.co/v0/postings/{board}?mode=json  (EU: api.eu.)   official API
    ashby           api.ashbyhq.com/posting-api/job-board/{board}              official API
    smartrecruiters api.smartrecruiters.com/v1/companies/{board}/postings      official API
    recruitee       {board}.recruitee.com/api/offers/                          official API
    workable        apply.workable.com/api/v1/widget/accounts/{board}          official API
    personio        {board}.jobs.personio.de/xml                               official feed
    workday         {host}/wday/cxs/{tenant}/{site}/jobs, searched by keyword  robots.txt
    jibe            {base}/api/jobs (iCIMS Jibe career sites' own list)       robots.txt
    rss             any RSS 2.0 or Atom feed of postings                      robots.txt
    jsonld          a careers page carrying schema.org JobPosting JSON-LD     robots.txt
    sitemap         job URLs from the site's sitemap; titles from the URL,    robots.txt
                    or from each page's JobPosting JSON-LD (bounded)
    listing         a server-rendered vacancies page: job links and their      robots.txt
                    anchor text, following ?page=N while new jobs appear

Every robots.txt source also keeps the site's Crawl-delay between requests.

``discover`` reads one careers page (within robots.txt) and names the job board
behind it, so a new account becomes one config line.
"""
from __future__ import annotations

import datetime as dt
import html
import json
import re
import time
import urllib.parse
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass, field
from typing import Any, Callable, Iterable

from . import http, robots

OFFICIAL_API = {"greenhouse", "lever", "ashby", "smartrecruiters", "recruitee", "workable", "personio"}
KINDS = OFFICIAL_API | {"workday", "jibe", "rss", "jsonld", "sitemap", "listing"}

# Word-bounded on purpose: a bare substring match once read "ansp" inside
# "transport" and filled a list with false positives.
DEFAULT_ROLE_PATTERNS: dict[str, str] = {
    "ai": r"\b(ai|a\.i\.|artificial intelligence|machine learning|ml|mlops|deep learning|genai|"
          r"generative|llms?|nlp|computer vision|data scientists?|ai engineer)\b",
    "data": r"\b(data (engineer|engineering|architect|platform|governance|product|strategy|lead|manager|"
            r"analyst|analytics)|analytics (engineer|lead|manager)|business intelligence|bi (developer|analyst)|"
            r"chief data officer|head of data)\b",
    "digital": r"\b(digital (transformation|product|innovation|lead|manager|director|operations)|"
               r"automation|rpa|enterprise architect|solutions? architect|integration architect|"
               r"innovation (lead|manager|director)|chief digital officer|head of digital)\b",
}
DEFAULT_EXCLUDE = r"\b(data entry|data centre technician|intern(ship)?|apprentice(ship)?)\b"
WORKDAY_SEARCHES = ("AI", "machine learning", "data", "digital", "automation", "analytics")


@dataclass
class Posting:
    account: str
    source: str
    title: str
    url: str
    location: str = ""
    team: str = ""
    posted: str = ""
    labels: list[str] = field(default_factory=list)

    def key(self) -> str:
        return f"{self.account}|{self.url or self.title}".lower()


class SourceError(RuntimeError):
    pass


# ------------------------------------------------------------------ matching

def compile_patterns(patterns: dict[str, str] | None = None) -> dict[str, re.Pattern]:
    return {k: re.compile(v, re.I) for k, v in (patterns or DEFAULT_ROLE_PATTERNS).items()}


def labels_for(title: str, team: str, patterns: dict[str, re.Pattern],
               exclude: re.Pattern | None = None) -> list[str]:
    text = f"{title} {team}"
    if exclude is not None and exclude.search(text):
        return []
    return [label for label, rx in patterns.items() if rx.search(text)]


# ------------------------------------------------------------------ readers

def _get_json(url: str, **kw: Any) -> Any:
    resp = http.request("GET", url, **kw)
    if not resp.ok:
        raise SourceError(f"HTTP {resp.status}")
    return resp.json()


def _ms_to_date(ms: Any) -> str:
    try:
        return dt.datetime.fromtimestamp(int(ms) / 1000, dt.timezone.utc).date().isoformat()
    except (TypeError, ValueError):
        return ""


def read_greenhouse(account: str, board: str, **_: Any) -> list[Posting]:
    data = _get_json(f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs")
    return [Posting(account, "greenhouse", j.get("title", ""), j.get("absolute_url", ""),
                    (j.get("location") or {}).get("name", ""), "",
                    (j.get("first_published") or j.get("updated_at") or "")[:10])
            for j in data.get("jobs", [])]


def read_lever(account: str, board: str, region: str = "", **_: Any) -> list[Posting]:
    host = "api.eu.lever.co" if region == "eu" else "api.lever.co"
    data = _get_json(f"https://{host}/v0/postings/{board}", params={"mode": "json"})
    return [Posting(account, "lever", j.get("text", ""), j.get("hostedUrl", ""),
                    (j.get("categories") or {}).get("location", ""),
                    (j.get("categories") or {}).get("team", ""), _ms_to_date(j.get("createdAt")))
            for j in (data if isinstance(data, list) else [])]


def read_ashby(account: str, board: str, **_: Any) -> list[Posting]:
    data = _get_json(f"https://api.ashbyhq.com/posting-api/job-board/{board}")
    return [Posting(account, "ashby", j.get("title", ""), j.get("jobUrl", ""), j.get("location", ""),
                    j.get("department") or j.get("team") or "", (j.get("publishedAt") or "")[:10])
            for j in data.get("jobs", []) if j.get("isListed", True)]


def read_smartrecruiters(account: str, board: str, max_pages: int = 10, **_: Any) -> list[Posting]:
    out: list[Posting] = []
    for page in range(max_pages):
        data = _get_json(f"https://api.smartrecruiters.com/v1/companies/{board}/postings",
                         params={"limit": 100, "offset": page * 100})
        for j in data.get("content", []):
            loc = j.get("location") or {}
            out.append(Posting(account, "smartrecruiters", j.get("name", ""),
                               f"https://jobs.smartrecruiters.com/{board}/{j.get('id', '')}",
                               ", ".join(x for x in (loc.get("city"), loc.get("country")) if x),
                               (j.get("department") or {}).get("label", ""), (j.get("releasedDate") or "")[:10]))
        if (page + 1) * 100 >= int(data.get("totalFound") or 0):
            break
    return out


def read_recruitee(account: str, board: str, **_: Any) -> list[Posting]:
    data = _get_json(f"https://{board}.recruitee.com/api/offers/")
    return [Posting(account, "recruitee", j.get("title", ""), j.get("careers_url", ""), j.get("location", ""),
                    j.get("department") or "", (j.get("published_at") or "")[:10])
            for j in data.get("offers", [])]


def read_workable(account: str, board: str, **_: Any) -> list[Posting]:
    data = _get_json(f"https://apply.workable.com/api/v1/widget/accounts/{board}")
    return [Posting(account, "workable", j.get("title", ""), j.get("url") or j.get("shortlink", ""),
                    ", ".join(x for x in (j.get("city"), j.get("country")) if x), j.get("department", ""),
                    (j.get("published_on") or j.get("created_at") or "")[:10])
            for j in data.get("jobs", [])]


def read_personio(account: str, board: str, **_: Any) -> list[Posting]:
    resp = http.request("GET", f"https://{board}.jobs.personio.de/xml")
    if not resp.ok:
        raise SourceError(f"HTTP {resp.status}")
    out = []
    for pos in ET.fromstring(resp.body).iter("position"):
        pid = pos.findtext("id") or ""
        out.append(Posting(account, "personio", pos.findtext("name") or "",
                           f"https://{board}.jobs.personio.de/job/{pid}", pos.findtext("office") or "",
                           pos.findtext("department") or "", (pos.findtext("createdAt") or "")[:10]))
    return out


def _robots_or_raise(url: str) -> None:
    allowed, reason = robots.verdict(url)
    if not allowed:
        raise SourceError(reason)


def read_workday(account: str, host: str, tenant: str, site: str, searches: Iterable[str] = WORKDAY_SEARCHES,
                 per_search: int = 60, pause: float = 1.0, sleep: Callable[[float], None] = time.sleep,
                 **_: Any) -> list[Posting]:
    url = f"https://{host}/wday/cxs/{tenant}/{site}/jobs"
    _robots_or_raise(url)
    seen: dict[str, Posting] = {}
    for term in searches:
        for offset in range(0, per_search, 20):
            resp = http.request("POST", url, json_body={"appliedFacets": {}, "limit": 20, "offset": offset,
                                                        "searchText": term})
            if not resp.ok:
                raise SourceError(f"HTTP {resp.status}")
            rows = resp.json().get("jobPostings", [])
            for j in rows:
                path = j.get("externalPath", "")
                seen.setdefault(path, Posting(account, "workday", j.get("title", ""), f"https://{host}/{site}{path}",
                                              j.get("locationsText", ""), "", j.get("postedOn", "")))
            if len(rows) < 20:
                break
            sleep(pause)
        sleep(pause)
    return list(seen.values())


def read_jibe(account: str, base: str, max_pages: int = 10, sleep: Callable[[float], None] = time.sleep,
              **_: Any) -> list[Posting]:
    base = base.rstrip("/")
    url = f"{base}/api/jobs"
    _robots_or_raise(url)
    delay = robots.crawl_delay(url)
    out: list[Posting] = []
    for page in range(1, max_pages + 1):
        data = _get_json(url, params={"page": page, "limit": 100})
        rows = data.get("jobs", [])
        for row in rows:
            j = row.get("data") or {}
            where = ", ".join(x for x in (j.get("city"), j.get("country")) if x) or j.get("location_name", "")
            team = j.get("category")
            out.append(Posting(account, "jibe", j.get("title", ""), f"{base}/jobs/{j.get('slug') or j.get('req_id')}",
                               where, ", ".join(t.strip() for t in team) if isinstance(team, list) else (team or "").strip(),
                               (j.get("posted_date") or j.get("create_date") or "")[:10]))
        if len(out) >= int(data.get("totalCount") or data.get("count") or 0) or not rows:
            break
        sleep(delay)
    return out


def read_rss(account: str, url: str, **_: Any) -> list[Posting]:
    _robots_or_raise(url)
    resp = http.request("GET", url)
    if not resp.ok:
        raise SourceError(f"HTTP {resp.status}")
    root = ET.fromstring(resp.body)
    out = []
    for item in root.iter("item"):
        out.append(Posting(account, "rss", (item.findtext("title") or "").strip(), (item.findtext("link") or "").strip(),
                           posted=(item.findtext("pubDate") or "")[:16]))
    atom = "{http://www.w3.org/2005/Atom}"
    for entry in root.iter(f"{atom}entry"):
        link = entry.find(f"{atom}link")
        out.append(Posting(account, "rss", (entry.findtext(f"{atom}title") or "").strip(),
                           link.get("href", "") if link is not None else "",
                           posted=(entry.findtext(f"{atom}updated") or "")[:10]))
    return out


_LDJSON = re.compile(r"<script[^>]+application/ld\+json[^>]*>(.*?)</script>", re.S | re.I)


def _job_postings(node: Any) -> Iterable[dict]:
    if isinstance(node, list):
        for x in node:
            yield from _job_postings(x)
    elif isinstance(node, dict):
        kind = node.get("@type")
        if kind == "JobPosting" or (isinstance(kind, list) and "JobPosting" in kind):
            yield node
        for key in ("@graph", "itemListElement", "item"):
            if key in node:
                yield from _job_postings(node[key])


def read_jsonld(account: str, url: str, **_: Any) -> list[Posting]:
    _robots_or_raise(url)
    resp = http.request("GET", url)
    if not resp.ok:
        raise SourceError(f"HTTP {resp.status}")
    out = []
    for block in _LDJSON.findall(resp.text()):
        try:
            data = json.loads(html.unescape(block.strip()))
        except ValueError:
            continue
        for j in _job_postings(data):
            loc = j.get("jobLocation") or {}
            loc = loc[0] if isinstance(loc, list) and loc else loc
            addr = (loc.get("address") or {}) if isinstance(loc, dict) else {}
            out.append(Posting(account, "jsonld", j.get("title", ""), j.get("url") or url,
                               ", ".join(x for x in (addr.get("addressLocality"), addr.get("addressCountry"))
                                         if isinstance(x, str) and x),
                               posted=(j.get("datePosted") or "")[:10]))
    return out


def _local(tag: str) -> str:
    """An XML tag without its namespace: sitemaps use sitemaps.org or Google's old one."""
    return tag.rsplit("}", 1)[-1]


def _child_text(node: ET.Element, name: str) -> str:
    return next(((c.text or "").strip() for c in node if _local(c.tag) == name), "")
JOB_PATH = r"/(jobs?|vacanc\w*|positions?|openings?|requisitions?|jobdetail|job-detail|careers?/[\w-]+/\d)"


def _title_from_path(path: str) -> str:
    """A readable title from a job URL's slug, or '' when the slug is only an id."""
    parts = [urllib.parse.unquote(p) for p in path.strip("/").split("/") if p]
    best = max(parts, key=lambda p: sum(ch.isalpha() for ch in p), default="")
    words = re.sub(r"[_+-]+", " ", re.sub(r"\.\w+$", "", best))
    words = re.sub(r"\b(r|jr|req|job)?\d{3,}\b", " ", words, flags=re.I)
    words = " ".join(words.split())
    return words if sum(ch.isalpha() for ch in words) >= 6 else ""


def read_sitemap(account: str, url: str, path_pattern: str = JOB_PATH, max_urls: int = 2000,
                 max_pages: int = 60, sleep: Callable[[float], None] = time.sleep, **_: Any) -> list[Posting]:
    """Job URLs from a sitemap (or sitemap index). Titles come from the URL slug;
    an id-only slug costs one page read for its JSON-LD title, at most max_pages."""
    _robots_or_raise(url)
    delay = robots.crawl_delay(url)
    rx = re.compile(path_pattern, re.I)
    queue, seen_maps, entries = [url], set(), []
    while queue and len(seen_maps) < 20 and len(entries) < max_urls:
        sm = queue.pop(0)
        if sm in seen_maps:
            continue
        seen_maps.add(sm)
        resp = http.request("GET", sm)
        if not resp.ok:
            raise SourceError(f"sitemap HTTP {resp.status}")
        root = ET.fromstring(resp.body)
        for node in root.iter():
            tag = _local(node.tag)
            if tag not in ("sitemap", "url"):
                continue
            loc = _child_text(node, "loc")
            if tag == "sitemap" and loc:
                queue.append(loc)
            elif loc and rx.search(urllib.parse.urlsplit(loc).path):
                entries.append((loc, _child_text(node, "lastmod")[:10]))
        if queue:
            sleep(delay)
    out, pages = [], 0
    for loc, lastmod in entries[:max_urls]:
        title = _title_from_path(urllib.parse.urlsplit(loc).path)
        if not title and pages < max_pages:
            pages += 1
            sleep(delay)
            try:
                found = read_jsonld(account, url=loc)
            except SourceError:
                found = []
            title = found[0].title if found else ""
        if title:
            out.append(Posting(account, "sitemap", title, loc, posted=lastmod))
    return out


_ANCHOR = re.compile(r"<a\b[^>]*href=[\"']([^\"'#]+)[\"'][^>]*>(.*?)</a>", re.S | re.I)


def read_listing(account: str, url: str, path_pattern: str = JOB_PATH, page_param: str = "page",
                 offset_step: int = 0, max_pages: int = 10, sleep: Callable[[float], None] = time.sleep,
                 **_: Any) -> list[Posting]:
    """Job links on a vacancies page, titled by their anchor text. Pages follow
    ?page=N, or ?<page_param>=<offset> when offset_step is set (Avature: jobOffset)."""
    _robots_or_raise(url)
    delay = robots.crawl_delay(url)
    rx = re.compile(path_pattern, re.I)
    found: dict[str, Posting] = {}
    for page in range(1, max_pages + 1):
        value = (page - 1) * offset_step if offset_step else page
        page_url = url if page == 1 else f"{url}{'&' if '?' in url else '?'}{page_param}={value}"
        if page > 1:
            _robots_or_raise(page_url)
            sleep(delay)
        resp = http.request("GET", page_url)
        if not resp.ok:
            if page == 1:
                raise SourceError(f"HTTP {resp.status}")
            break
        before = len(found)
        for href, inner in _ANCHOR.findall(resp.text()):
            link = urllib.parse.urljoin(page_url, html.unescape(href))
            title = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", inner)).split())
            if rx.search(urllib.parse.urlsplit(link).path) and 6 <= len(title) <= 160 and link not in found:
                found[link] = Posting(account, "listing", title, link)
        if len(found) == before:
            break
    return list(found.values())


READERS: dict[str, Callable[..., list[Posting]]] = {
    "greenhouse": read_greenhouse, "lever": read_lever, "ashby": read_ashby,
    "smartrecruiters": read_smartrecruiters, "recruitee": read_recruitee, "workable": read_workable,
    "personio": read_personio, "workday": read_workday, "jibe": read_jibe, "rss": read_rss,
    "jsonld": read_jsonld, "sitemap": read_sitemap, "listing": read_listing,
}


# ------------------------------------------------------------------ discovery

SIGNATURES: list[tuple[str, re.Pattern]] = [
    ("greenhouse", re.compile(r"(?:boards|job-boards)(?:\.eu)?\.greenhouse\.io/(?:embed/job_board\?for=)?([\w-]+)", re.I)),
    ("lever", re.compile(r"jobs\.(?:eu\.)?lever\.co/([\w.-]+)", re.I)),
    ("ashby", re.compile(r"jobs\.ashbyhq\.com/([\w.-]+)", re.I)),
    ("smartrecruiters", re.compile(r"(?:jobs|careers)\.smartrecruiters\.com/(?!my-applications|oneclick|sign-in)([\w-]+)",
                                   re.I)),
    ("workable", re.compile(r"apply\.workable\.com/([\w-]+)", re.I)),
    ("recruitee", re.compile(r"([\w-]+)\.recruitee\.com", re.I)),
    ("personio", re.compile(r"([\w-]+)\.jobs\.personio\.(?:de|com)", re.I)),
    ("workday", re.compile(r"([\w-]+)\.(wd\d+)\.myworkdayjobs\.com/(?:[a-z]{2}-[A-Z]{2}/)?([\w-]+)", re.I)),
]
NO_READER = {"successfactors": r"successfactors\.(?:com|eu)|sapsf\.(?:com|eu)|jobs\.sap\.com",
             "taleo": r"taleo\.net", "icims": r"icims\.com", "oracle recruiting": r"oraclecloud\.com/hcmUI",
             "avature": r"avature\.net", "eightfold": r"eightfold\.ai", "phenom": r"phenompeople\.com|phenom\.com",
             "teamtailor": r"teamtailor\.com", "pinpoint": r"pinpointhq\.com"}


def _job_sitemap(careers_url: str) -> str:
    """The site's sitemap URL when robots.txt allows it and it lists job pages; else ''."""
    parts = urllib.parse.urlsplit(careers_url)
    url = f"{parts.scheme}://{parts.netloc}/sitemap.xml"
    if not robots.verdict(url)[0]:
        return ""
    resp = http.request("GET", url)
    return url if resp.ok and re.search(r"<loc>[^<]*" + JOB_PATH, resp.text(), re.I) else ""


def discover(careers_url: str) -> dict[str, Any]:
    """Name the job board behind one careers page, within robots.txt."""
    allowed, reason = robots.verdict(careers_url)
    if not allowed:
        return {"url": careers_url, "kind": None, "reason": reason}
    resp = http.request("GET", careers_url)
    if not resp.ok:
        return {"url": careers_url, "kind": None, "reason": f"HTTP {resp.status}"}
    page = resp.text()
    for kind, rx in SIGNATURES:
        m = rx.search(page) or rx.search(careers_url)
        if m:
            if kind == "workday":
                tenant, wd, site = m.groups()
                return {"url": careers_url, "kind": "workday", "host": f"{tenant}.{wd}.myworkdayjobs.com",
                        "tenant": tenant, "site": site, "reason": reason}
            return {"url": careers_url, "kind": kind, "board": m.group(1), "reason": reason}
    if "jibe" in page.lower() or "/api/jobs" in page:
        parts = urllib.parse.urlsplit(careers_url)
        return {"url": careers_url, "kind": "jibe", "base": f"{parts.scheme}://{parts.netloc}", "reason": reason}
    if '"JobPosting"' in page:
        return {"url": careers_url, "kind": "jsonld", "reason": reason}
    for name, rx in NO_READER.items():
        if re.search(rx, page, re.I) or re.search(rx, careers_url, re.I):
            found = _job_sitemap(careers_url)
            if found:
                return {"url": careers_url, "kind": "sitemap", "platform": name, "sitemap": found,
                        "reason": f"{name} careers site: no postings API, but its job sitemap is allowed"}
            return {"url": careers_url, "kind": None, "platform": name,
                    "reason": f"{name} careers site: no public postings API, look for an RSS feed or JSON-LD"}
    return {"url": careers_url, "kind": None, "reason": "no known job board found on the page"}


# ------------------------------------------------------------------ run

def collect(accounts: list[dict[str, Any]], *, patterns: dict[str, str] | None = None,
            exclude: str | None = DEFAULT_EXCLUDE, pause: float = 1.0,
            sleep: Callable[[float], None] = time.sleep) -> dict[str, Any]:
    """Read every account's source; keep matching roles. Never raises for one source."""
    compiled = compile_patterns(patterns)
    exclude_rx = re.compile(exclude, re.I) if exclude else None
    matched: list[Posting] = []
    sources: list[dict[str, Any]] = []
    for acct in accounts:
        name, src = acct["name"], dict(acct.get("source") or {})
        kind = src.pop("kind", None)
        if kind not in READERS:
            sources.append({"account": name, "kind": kind, "status": "no-source",
                            "note": acct.get("note", "no readable job board recorded")})
            continue
        try:
            rows = READERS[kind](name, **src)
        except (SourceError, ValueError, ET.ParseError) as exc:
            sources.append({"account": name, "kind": kind, "status": "error", "note": str(exc)[:200]})
            continue
        except Exception as exc:  # one bad source never stops the run
            sources.append({"account": name, "kind": kind, "status": "error",
                            "note": f"{type(exc).__name__}: {str(exc)[:160]}"})
            continue
        hits = 0
        for p in rows:
            p.labels = labels_for(p.title, p.team, compiled, exclude_rx)
            if p.labels:
                matched.append(p)
                hits += 1
        sources.append({"account": name, "kind": kind, "status": "ok", "postings": len(rows), "matched": hits})
        sleep(pause)
    return {"postings": [asdict(p) for p in matched], "sources": sources}


def diff(current: list[dict[str, Any]], previous: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    def key(p: dict[str, Any]) -> str:
        return f"{p['account']}|{p.get('url') or p['title']}".lower()
    before = {key(p) for p in previous}
    now = {key(p) for p in current}
    return {"new": [p for p in current if key(p) not in before],
            "gone": [p for p in previous if key(p) not in now]}


def render_markdown(result: dict[str, Any], changes: dict[str, list[dict[str, Any]]] | None, *, title: str,
                    run_date: str) -> str:
    """A short weekly page: new roles first, then everything still open, then source health."""
    posts = result["postings"]
    new_keys = {f"{p['account']}|{p.get('url') or p['title']}".lower() for p in (changes or {}).get("new", [])}

    def line(p: dict[str, Any]) -> str:
        where = f", {p['location']}" if p.get("location") else ""
        when = f", posted {p['posted']}" if p.get("posted") else ""
        return f"- **{p['account']}**: [{p['title']}]({p['url']}){where}{when} ({', '.join(p['labels'])})"

    out = [f"# {title}", "", f"Run {run_date}. Roles matching AI, data or digital, read from each organisation's own "
           "job board. Organisations only; no person is named or stored.", ""]
    fresh = [p for p in posts if f"{p['account']}|{p.get('url') or p['title']}".lower() in new_keys]
    if changes is not None:
        out += [f"## New since the last run ({len(fresh)})", ""]
        out += [line(p) for p in fresh] or ["- none"]
        out.append("")
    out += [f"## All open matching roles ({len(posts)})", ""]
    for account in sorted({p["account"] for p in posts}):
        rows = [p for p in posts if p["account"] == account]
        out += [line(p) for p in rows]
    if not posts:
        out.append("- none")
    out += ["", "## Sources", "", "| Account | Board | State | Postings read | Matched |", "|---|---|---|---|---|"]
    for s in result["sources"]:
        state = s["status"] if s["status"] == "ok" else f"{s['status']}: {s.get('note', '')}"
        out.append(f"| {s['account']} | {s.get('kind') or 'none'} | {state} | {s.get('postings', '')} | "
                   f"{s.get('matched', '')} |")
    return "\n".join(out) + "\n"
