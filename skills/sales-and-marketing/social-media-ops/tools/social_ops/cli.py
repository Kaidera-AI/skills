"""One command line over social_ops. Posting is a dry run unless --live is given.

    python3 -m social_ops.cli identity x|linkedin|instagram|threads|bluesky
    python3 -m social_ops.cli publish x --text-file post.txt --image card.jpg --alt "..." [--live]
    python3 -m social_ops.cli publish instagram --text-file caption.txt --image-url https://... [--live]
    python3 -m social_ops.cli visibility --config visibility.json --out reports/ [--live]
    python3 -m social_ops.cli hiring discover https://careers.example.com/
    python3 -m social_ops.cli hiring run --config hiring.json --out reports/
    python3 -m social_ops.cli vet path/to/cloned/repo [--json]
    python3 -m social_ops.cli selftest

Credentials come from the environment only, never from arguments:
    X_ACCESS_TOKEN, X_GRANTED_SCOPES          X user token (OAuth 2.0, PKCE)
    LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN, LINKEDIN_VERSION
    IG_ACCESS_TOKEN, IG_USER_ID               Instagram API with Instagram Login
    THREADS_ACCESS_TOKEN, THREADS_USER_ID
    BLUESKY_HANDLE, BLUESKY_APP_PASSWORD      an app password, never the account password
    OPENROUTER_API_KEY                        or AI_VISIBILITY_API_KEY with --base
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
from pathlib import Path
from typing import Any

from . import ai_visibility, bluesky, hiring, http, linkedin, meta, vetting, x_api

CHANNELS = ("x", "linkedin", "instagram", "threads", "bluesky")


def _env(name: str, required: bool = True) -> str:
    value = os.environ.get(name, "").strip()
    if required and not value:
        raise SystemExit(f"{name} is not set in the environment")
    return value


def _text(args: argparse.Namespace) -> str:
    if args.text_file:
        return Path(args.text_file).read_text(encoding="utf-8").strip()
    if args.text:
        return args.text
    raise SystemExit("give --text or --text-file")


def _print(obj: Any) -> None:
    print(json.dumps(obj, indent=2, ensure_ascii=False, default=str))


def cmd_identity(args: argparse.Namespace) -> int:
    ch = args.channel
    if ch == "x":
        resp = http.request("GET", f"{x_api.API}/users/me", headers={"Authorization": f"Bearer {_env('X_ACCESS_TOKEN')}"})
        _print({"status": resp.status, "user": resp.json().get("data"),
                "can_upload_pictures": x_api.has_scope(_env("X_GRANTED_SCOPES", False))})
    elif ch == "linkedin":
        resp = http.request("GET", "https://api.linkedin.com/v2/userinfo",
                            headers={"Authorization": f"Bearer {_env('LINKEDIN_ACCESS_TOKEN')}"})
        _print({"status": resp.status, "user": resp.json()})
    elif ch == "instagram":
        _print(meta.ig_identity(_env("IG_ACCESS_TOKEN")))
    elif ch == "threads":
        _print(meta.threads_identity(_env("THREADS_ACCESS_TOKEN")))
    elif ch == "bluesky":
        s = bluesky.create_session(_env("BLUESKY_HANDLE"), _env("BLUESKY_APP_PASSWORD"))
        _print({"did": s["did"], "handle": s["handle"]})
    return 0


def cmd_publish(args: argparse.Namespace) -> int:
    text, live = _text(args), bool(args.live)
    image = Path(args.image) if args.image else None
    ch = args.channel
    if ch == "x":
        token = _env("X_ACCESS_TOKEN", live)
        if image and live and not x_api.has_scope(_env("X_GRANTED_SCOPES", False)):
            raise SystemExit("this X token was not granted media.write: re-consent with that scope or post without --image")
        result = x_api.publish(token, text, image=image, alt_text=args.alt, live=live)
    elif ch == "linkedin":
        result = linkedin.publish(_env("LINKEDIN_ACCESS_TOKEN", live), _env("LINKEDIN_AUTHOR_URN", live) or "urn:li:person:?",
                                  text, image=image, alt_text=args.alt,
                                  version=os.environ.get("LINKEDIN_VERSION") or linkedin.DEFAULT_VERSION, live=live)
    elif ch == "instagram":
        if not args.image_url:
            raise SystemExit("Instagram needs --image-url: a public https URL of a JPEG")
        result = meta.ig_publish_image(_env("IG_ACCESS_TOKEN", live), _env("IG_USER_ID", live), args.image_url, text,
                                       alt_text=args.alt, live=live)
    elif ch == "threads":
        result = meta.threads_publish(_env("THREADS_ACCESS_TOKEN", live), _env("THREADS_USER_ID", live), text,
                                      image_url=args.image_url or "", alt_text=args.alt, live=live)
    else:
        session = bluesky.create_session(_env("BLUESKY_HANDLE"), _env("BLUESKY_APP_PASSWORD")) if live else None
        result = bluesky.publish(session, text, image=image, alt_text=args.alt, live=live)
    _print(result)
    if not live:
        print("DRY RUN: nothing was posted. Add --live once the copy and picture are approved.", file=sys.stderr)
    return 0


def _load_json(path: str | None) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8")) if path and Path(path).exists() else None


def cmd_visibility(args: argparse.Namespace) -> int:
    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    key = os.environ.get("AI_VISIBILITY_API_KEY") or os.environ.get("OPENROUTER_API_KEY", "")
    calls = len(cfg["questions"]) * len(cfg["models"])
    if not args.live:
        _print({"dry_run": True, "calls": calls, "models": cfg["models"], "questions": len(cfg["questions"])})
        return 0
    if not key:
        raise SystemExit("set OPENROUTER_API_KEY (or AI_VISIBILITY_API_KEY with --base)")
    if args.base == ai_visibility.OPENROUTER:
        room = ai_visibility.openrouter_headroom(key)
        if room["spendable"] is not None and room["spendable"] < args.min_headroom:
            _print({"abstained": True, "reason": f"spendable ${room['spendable']} is under ${args.min_headroom}",
                    "headroom": room})
            return 3
    rows = ai_visibility.run(key, cfg, base=args.base)
    day = dt.date.today().isoformat()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    previous = None
    if args.previous and Path(args.previous).exists():
        previous = [json.loads(l) for l in Path(args.previous).read_text(encoding="utf-8").splitlines() if l.strip()]
    summary = ai_visibility.summarise(rows, previous)
    (out / f"{day}.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows), encoding="utf-8")
    (out / f"{day}.md").write_text(ai_visibility.render_markdown(summary, rows, brand=cfg["brand"]["name"], run_date=day),
                                   encoding="utf-8")
    _print(summary)
    return 0


def cmd_hiring(args: argparse.Namespace) -> int:
    if args.action == "discover":
        _print([hiring.discover(u) for u in args.urls])
        return 0
    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    result = hiring.collect(cfg["accounts"], patterns=cfg.get("role_patterns") or None,
                            exclude=cfg.get("exclude") or hiring.DEFAULT_EXCLUDE)
    day = dt.date.today().isoformat()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    prev = _load_json(args.previous)
    changes = hiring.diff(result["postings"], prev["postings"]) if prev else None
    (out / f"{day}.json").write_text(json.dumps(result, indent=1, ensure_ascii=False), encoding="utf-8")
    (out / f"{day}.md").write_text(hiring.render_markdown(result, changes, title=cfg.get("title", "Hiring signals"),
                                                         run_date=day), encoding="utf-8")
    _print({"matched": len(result["postings"]), "new": len(changes["new"]) if changes else None,
            "sources": {s["account"]: s["status"] for s in result["sources"]}})
    return 0


def cmd_vet(args: argparse.Namespace) -> int:
    report = vetting.scan(Path(args.path))
    if args.json:
        _print(report)
    else:
        print("\n".join(vetting.summary_lines(report)))
    return 0


def cmd_selftest(_: argparse.Namespace) -> int:
    checks = {
        "linkedin escape keeps the tail": linkedin.escape_commentary("a (b) | c @d #e") == "a \\(b\\) \\| c \\@d #e",
        "bluesky link facet uses byte offsets": bluesky.link_facets("é https://a.example/x")[0]["index"] ==
        {"byteStart": 3, "byteEnd": 22},
        "threads counts emoji as bytes": meta.threads_length("ab\U0001F600") == 6,
        "role match is word bounded": hiring.labels_for("Transport planner", "", hiring.compile_patterns()) == [] and
        hiring.labels_for("Senior Data Engineer", "", hiring.compile_patterns()) == ["data"],
        "AI answer names and ranks": ai_visibility.analyse(
            "Try Acme or Brandly.", ["https://www.brandly.io/a"], {"name": "Brandly", "domains": ["brandly.io"]},
            [{"name": "Acme"}])["brand_rank"] == 2,
        "x scope check": x_api.has_scope("tweet.write media.write") and not x_api.has_scope("tweet.write"),
    }
    for name, ok in checks.items():
        print(f"{'ok  ' if ok else 'FAIL'} {name}")
    return 0 if all(checks.values()) else 1


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(prog="social_ops", description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("identity", help="who the configured token posts as")
    p.add_argument("channel", choices=CHANNELS)
    p.set_defaults(fn=cmd_identity)
    p = sub.add_parser("publish", help="post through the official API (dry run unless --live)")
    p.add_argument("channel", choices=CHANNELS)
    p.add_argument("--text")
    p.add_argument("--text-file")
    p.add_argument("--image", help="local picture (X, LinkedIn, Bluesky)")
    p.add_argument("--image-url", help="public https picture URL (Instagram, Threads)")
    p.add_argument("--alt", default="", help="alt text for the picture")
    p.add_argument("--live", action="store_true")
    p.set_defaults(fn=cmd_publish)
    p = sub.add_parser("visibility", help="ask AI answer engines the buyer questions")
    p.add_argument("--config", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--previous", help="last run's .jsonl, for the trend line")
    p.add_argument("--base", default=ai_visibility.OPENROUTER)
    p.add_argument("--min-headroom", type=float, default=1.0, help="abstain under this many dollars")
    p.add_argument("--live", action="store_true")
    p.set_defaults(fn=cmd_visibility)
    p = sub.add_parser("hiring", help="hiring signals from public job boards")
    p.add_argument("action", choices=("discover", "run"))
    p.add_argument("urls", nargs="*")
    p.add_argument("--config")
    p.add_argument("--out", default=".")
    p.add_argument("--previous", help="last run's .json, for the new-this-week list")
    p.set_defaults(fn=cmd_hiring)
    p = sub.add_parser("vet", help="red-flag scan of a cloned repository (never runs it)")
    p.add_argument("path")
    p.add_argument("--json", action="store_true")
    p.set_defaults(fn=cmd_vet)
    p = sub.add_parser("selftest", help="offline checks of the parts that bite")
    p.set_defaults(fn=cmd_selftest)
    return ap


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    sys.exit(main())
