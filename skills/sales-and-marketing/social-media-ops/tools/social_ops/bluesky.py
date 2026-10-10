"""Bluesky over the AT Protocol: app-password session, picture blob, post, read-back.

    POST /xrpc/com.atproto.server.createSession   identifier + app password (never the
                                                  account password; make an app password
                                                  in Settings > Privacy and security)
    POST /xrpc/com.atproto.repo.uploadBlob        picture bytes, at most 1,000,000 bytes
    POST /xrpc/com.atproto.repo.createRecord      app.bsky.feed.post record
    GET  /xrpc/app.bsky.feed.getPosts?uris=...    read-back

A post is at most 300 graphemes. Links only become clickable through facets with
UTF-8 BYTE offsets, which ``link_facets`` computes. No review or paid tier.
"""
from __future__ import annotations

import datetime as dt
import re
from pathlib import Path
from typing import Any

from . import http

PDS = "https://bsky.social"
MAX_TEXT = 300
MAX_BLOB = 1_000_000
IMAGE_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
URL_RE = re.compile(r"https?://[^\s<>\"]+[^\s<>\".,;:!?)\]]")


class BlueskyError(RuntimeError):
    pass


def create_session(identifier: str, app_password: str, *, pds: str = PDS) -> dict[str, Any]:
    resp = http.request("POST", f"{pds}/xrpc/com.atproto.server.createSession",
                        json_body={"identifier": identifier, "password": app_password})
    data = resp.json()
    if not resp.ok or not data.get("accessJwt"):
        raise BlueskyError(http.describe_failure("Bluesky session", resp))
    return {"accessJwt": data["accessJwt"], "did": data["did"], "handle": data.get("handle", ""), "pds": pds}


def link_facets(text: str) -> list[dict[str, Any]]:
    facets = []
    for m in URL_RE.finditer(text):
        start = len(text[:m.start()].encode("utf-8"))
        end = start + len(m.group(0).encode("utf-8"))
        facets.append({"index": {"byteStart": start, "byteEnd": end},
                       "features": [{"$type": "app.bsky.richtext.facet#link", "uri": m.group(0)}]})
    return facets


def upload_image(session: dict[str, Any], path: Path) -> dict[str, Any]:
    if path.suffix.lower() not in IMAGE_TYPES or not path.is_file():
        raise BlueskyError(f"not an uploadable picture: {path.name}")
    blob = path.read_bytes()
    if len(blob) > MAX_BLOB:
        raise BlueskyError(f"picture is {len(blob)} bytes, Bluesky takes at most {MAX_BLOB}")
    resp = http.request("POST", f"{session['pds']}/xrpc/com.atproto.repo.uploadBlob", data=blob,
                        headers={"Authorization": f"Bearer {session['accessJwt']}",
                                 "Content-Type": IMAGE_TYPES[path.suffix.lower()]}, timeout=120)
    if not resp.ok or not resp.json().get("blob"):
        raise BlueskyError(http.describe_failure("Bluesky picture upload", resp))
    return resp.json()["blob"]


def post_url(handle: str, uri: str) -> str:
    return f"https://bsky.app/profile/{handle}/post/{uri.rsplit('/', 1)[-1]}"


def publish(session: dict[str, Any] | None, text: str, *, image: Path | None = None, alt_text: str = "",
            langs: tuple[str, ...] = ("en",), live: bool = False) -> dict[str, Any]:
    if len(text) > MAX_TEXT:
        raise BlueskyError(f"text is {len(text)} characters, Bluesky allows {MAX_TEXT}")
    record: dict[str, Any] = {"$type": "app.bsky.feed.post", "text": text, "langs": list(langs),
                              "createdAt": dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")}
    facets = link_facets(text)
    if facets:
        record["facets"] = facets
    if not live:
        return {"live": False, "plan": {**record, "image": str(image) if image else None, "alt_text": alt_text}}
    if not session:
        raise BlueskyError("a live post needs a session")
    if image is not None:
        blob = upload_image(session, image)
        record["embed"] = {"$type": "app.bsky.embed.images", "images": [{"image": blob, "alt": alt_text or ""}]}
    auth = {"Authorization": f"Bearer {session['accessJwt']}"}
    resp = http.request("POST", f"{session['pds']}/xrpc/com.atproto.repo.createRecord", headers=auth,
                        json_body={"repo": session["did"], "collection": "app.bsky.feed.post", "record": record})
    if not resp.ok or not resp.json().get("uri"):
        raise BlueskyError(http.describe_failure("Bluesky post", resp))
    uri = resp.json()["uri"]
    back = http.request("GET", f"{session['pds']}/xrpc/app.bsky.feed.getPosts", headers=auth, params={"uris": uri})
    if not back.ok or not back.json().get("posts"):
        raise BlueskyError(f"Bluesky post {uri} was accepted but the read-back did not find it")
    return {"live": True, "uri": uri, "url": post_url(session.get("handle") or session["did"], uri)}
