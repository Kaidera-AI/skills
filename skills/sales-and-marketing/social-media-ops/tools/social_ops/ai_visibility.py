"""AI answer visibility: do answer engines name us when a buyer asks?

Buyers now ask AI assistants for suppliers. Each week we ask the same fixed set
of buyer questions to web-grounded answer engines through their official API
(any OpenAI-compatible chat completions endpoint; an OpenRouter key reaches
Perplexity Sonar and search-enabled models with ``:online``), then record:

    whether the brand is named, and in which position among the names given
    which competitors are named instead
    whether the brand's own domain is among the cited sources, and which domains are

Same questions, same models, same week day: the trend is the product, a single
week is noise. Never scrape a consumer chat UI; never log in as a person.

Every call sends ``max_tokens``. Without it an OpenRouter call reserves the
model's whole output window against the balance, and a nearly empty account
refuses calls it could have afforded.
"""
from __future__ import annotations

import re
import time
import urllib.parse
from typing import Any, Callable

from . import http

OPENROUTER = "https://openrouter.ai/api/v1"
DEFAULT_MAX_TOKENS = 900
SYSTEM = ("You are helping a buyer shortlist suppliers. Answer the question directly. Name specific companies "
          "and products where you can, and cite your sources.")


class VisibilityError(RuntimeError):
    pass


# ------------------------------------------------------------------ credit

def openrouter_headroom(api_key: str, base: str = OPENROUTER) -> dict[str, Any]:
    """Spendable dollars: the lower of account credit left and this key's limit left."""
    auth = {"Authorization": f"Bearer {api_key}"}
    credits = http.request("GET", f"{base}/credits", headers=auth)
    key = http.request("GET", f"{base}/key", headers=auth)
    out: dict[str, Any] = {"account_left": None, "key_left": None}
    if credits.ok:
        d = credits.json().get("data") or {}
        out["account_left"] = round(float(d.get("total_credits", 0)) - float(d.get("total_usage", 0)), 4)
    if key.ok:
        d = key.json().get("data") or {}
        if d.get("limit_remaining") is not None:
            out["key_left"] = round(float(d["limit_remaining"]), 4)
    known = [v for v in (out["account_left"], out["key_left"]) if v is not None]
    out["spendable"] = min(known) if known else None
    return out


# ------------------------------------------------------------------ asking

def ask(api_key: str, model: str, question: str, *, base: str = OPENROUTER,
        max_tokens: int = DEFAULT_MAX_TOKENS, system: str = SYSTEM) -> dict[str, Any]:
    resp = http.request("POST", f"{base}/chat/completions", headers={"Authorization": f"Bearer {api_key}"},
                        json_body={"model": model, "max_tokens": max_tokens, "temperature": 0,
                                   "messages": [{"role": "system", "content": system},
                                                {"role": "user", "content": question}]},
                        timeout=120)
    data = resp.json()
    if not resp.ok or not data.get("choices"):
        raise VisibilityError(http.describe_failure(f"{model}", resp))
    msg = data["choices"][0].get("message") or {}
    urls: list[str] = []
    for ann in msg.get("annotations") or []:
        u = (ann.get("url_citation") or {}).get("url")
        if u:
            urls.append(u)
    urls += [c if isinstance(c, str) else c.get("url", "") for c in data.get("citations") or []]
    urls += [s.get("url", "") for s in data.get("search_results") or [] if isinstance(s, dict)]
    seen: list[str] = []
    for u in urls:
        if u and u not in seen:
            seen.append(u)
    usage = data.get("usage") or {}
    return {"answer": msg.get("content") or "", "citations": seen, "model_used": data.get("model", model),
            "cost": usage.get("cost"), "tokens": usage.get("total_tokens")}


# ------------------------------------------------------------------ reading an answer

def _alias_rx(alias: str, case_sensitive: bool) -> re.Pattern:
    return re.compile(rf"(?<![\w-]){re.escape(alias)}(?![\w-])", 0 if case_sensitive else re.I)


def first_mention(text: str, entity: dict[str, Any]) -> int:
    """Character offset of the entity's first mention, or -1."""
    hits = []
    for alias in [entity["name"], *entity.get("aliases", [])]:
        m = _alias_rx(alias, bool(entity.get("case_sensitive"))).search(text)
        if m:
            hits.append(m.start())
    return min(hits) if hits else -1


def host_of(url: str) -> str:
    host = urllib.parse.urlsplit(url).netloc.lower()
    return host[4:] if host.startswith("www.") else host


def analyse(answer: str, citations: list[str], brand: dict[str, Any],
            competitors: list[dict[str, Any]]) -> dict[str, Any]:
    entities = [{"kind": "brand", **brand}] + [{"kind": "competitor", **c} for c in competitors]
    named = sorted(((first_mention(answer, e), e["name"], e["kind"]) for e in entities), key=lambda t: t[0])
    named = [(pos, name, kind) for pos, name, kind in named if pos >= 0]
    order = [name for _, name, _ in named]
    brand_pos = next((pos for pos, _, kind in named if kind == "brand"), -1)
    domains = [host_of(u) for u in citations]
    brand_domains = [d.lower() for d in brand.get("domains", [])]
    excerpt = ""
    if brand_pos >= 0:
        excerpt = " ".join(answer[max(0, brand_pos - 120): brand_pos + 180].split())
    return {
        "brand_named": brand_pos >= 0,
        "brand_rank": order.index(brand["name"]) + 1 if brand["name"] in order else None,
        "named": order,
        "competitors_named": [n for _, n, k in named if k == "competitor"],
        "brand_cited": any(d == bd or d.endswith("." + bd) for d in domains for bd in brand_domains),
        "cited_domains": sorted(set(domains)),
        "excerpt": excerpt,
    }


# ------------------------------------------------------------------ a run

def run(api_key: str, config: dict[str, Any], *, base: str = OPENROUTER, pause: float = 1.0,
        sleep: Callable[[float], None] = time.sleep, asker: Callable[..., dict[str, Any]] | None = None
        ) -> list[dict[str, Any]]:
    """Ask every question of every model once. One failed call is recorded, never fatal."""
    asker = asker or ask
    rows = []
    for q in config["questions"]:
        question = q["text"] if isinstance(q, dict) else q
        qid = q.get("id") if isinstance(q, dict) else None
        for model in config["models"]:
            row: dict[str, Any] = {"question_id": qid, "question": question, "model": model}
            try:
                got = asker(api_key, model, question, base=base,
                            max_tokens=int(config.get("max_tokens", DEFAULT_MAX_TOKENS)))
            except Exception as exc:
                row.update({"error": str(exc)[:300]})
            else:
                row.update(got)
                row.update(analyse(got["answer"], got["citations"], config["brand"], config.get("competitors", [])))
            rows.append(row)
            sleep(pause)
    return rows


def summarise(rows: list[dict[str, Any]], previous: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    def share(rs: list[dict[str, Any]]) -> tuple[int, int]:
        answered = [r for r in rs if "error" not in r]
        return sum(1 for r in answered if r.get("brand_named")), len(answered)

    named, answered = share(rows)
    out: dict[str, Any] = {"named": named, "answered": answered, "errors": sum(1 for r in rows if "error" in r),
                           "cited": sum(1 for r in rows if r.get("brand_cited")), "by_model": {}, "competitors": {},
                           "domains": {}}
    for model in sorted({r["model"] for r in rows}):
        n, a = share([r for r in rows if r["model"] == model])
        out["by_model"][model] = {"named": n, "answered": a}
    for r in rows:
        for c in r.get("competitors_named", []):
            out["competitors"][c] = out["competitors"].get(c, 0) + 1
        for d in r.get("cited_domains", []):
            out["domains"][d] = out["domains"].get(d, 0) + 1
    out["competitors"] = dict(sorted(out["competitors"].items(), key=lambda kv: -kv[1]))
    out["domains"] = dict(sorted(out["domains"].items(), key=lambda kv: -kv[1])[:15])
    if previous is not None:
        pn, pa = share(previous)
        out["previous"] = {"named": pn, "answered": pa}
    return out


def render_markdown(summary: dict[str, Any], rows: list[dict[str, Any]], *, brand: str, run_date: str) -> str:
    named, answered = summary["named"], summary["answered"]
    trend = ""
    if summary.get("previous"):
        p = summary["previous"]
        trend = f" Last run: {p['named']} of {p['answered']}."
    out = [f"# AI answer visibility, {run_date}", "",
           f"{brand} was named in {named} of {answered} answers and cited as a source in {summary['cited']}.{trend}",
           ""]
    if summary["errors"]:
        out += [f"{summary['errors']} calls failed and are not counted.", ""]
    out += ["## By engine", "", "| Engine | Named | Answers |", "|---|---|---|"]
    out += [f"| {m} | {v['named']} | {v['answered']} |" for m, v in summary["by_model"].items()]
    out += ["", "## Named instead (how many answers)", ""]
    out += [f"- {name}: {n}" for name, n in summary["competitors"].items()] or ["- none of the tracked names"]
    out += ["", "## Most cited sources", ""]
    out += [f"- {d}: {n}" for d, n in summary["domains"].items()] or ["- none"]
    out += ["", "## Per question", "", "| Question | Engine | Named | Rank | Cited | Others named |",
            "|---|---|---|---|---|---|"]
    for r in rows:
        if "error" in r:
            out.append(f"| {r['question']} | {r['model']} | error | | | {r['error'][:80]} |")
            continue
        out.append(f"| {r['question']} | {r['model']} | {'yes' if r['brand_named'] else 'no'} | "
                   f"{r.get('brand_rank') or ''} | {'yes' if r['brand_cited'] else 'no'} | "
                   f"{', '.join(r['competitors_named'][:5])} |")
    return "\n".join(out) + "\n"
