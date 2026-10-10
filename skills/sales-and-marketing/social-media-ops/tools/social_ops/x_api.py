"""X API v2 with an OAuth 2.0 user token: pictures, alt text, posts, read-back.

Routes (checked against docs.x.com, October 2026):
    POST /2/media/upload     multipart: media (bytes), media_category=tweet_image
    POST /2/media/metadata   {"id": <media id>, "metadata": {"alt_text": {"text": ...}}}
    POST /2/tweets           {"text", "media": {"media_ids": [...]}, "reply": {...}}
    GET  /2/tweets/:id       read-back, with the attached media keys

Both media routes need the ``media.write`` scope. A token granted before that
scope existed in the consent request (tweet.read tweet.write users.read
offline.access) cannot upload, so callers check ``has_scope`` first and post
text only rather than fail the whole post.

Pay-per-use price list (docs.x.com pricing page, October 2026): a post costs
$0.015, a post carrying a URL $0.200, media metadata (alt text) $0.005; media
upload carries no listed charge. Prices change, the developer console is
authoritative.
"""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any

from . import http

API = "https://api.x.com/2"
IMAGE_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024
MAX_ALT_TEXT = 1000


class XApiError(RuntimeError):
    pass


def has_scope(granted: str, scope: str = "media.write") -> bool:
    return scope in (granted or "").replace(",", " ").split()


def image_problem(path: Path) -> str:
    """Why this file cannot ride a post as a picture, or '' when it can."""
    if not path.is_file():
        return f"picture not found: {path.name}"
    if path.suffix.lower() not in IMAGE_TYPES:
        return f"not a still picture X takes as tweet_image: {path.suffix or 'no suffix'}"
    size = path.stat().st_size
    if size > MAX_IMAGE_BYTES:
        return f"picture is {size} bytes, over the 5 MB limit"
    return ""


def sha256_of(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def upload_image(token: str, path: Path) -> str:
    """Upload one still picture; return its media id."""
    problem = image_problem(path)
    if problem:
        raise XApiError(problem)
    body, ctype = http.multipart({"media_category": "tweet_image"},
                                 {"media": (path.name, path.read_bytes(), IMAGE_TYPES[path.suffix.lower()])})
    resp = http.request("POST", f"{API}/media/upload", headers={**_auth(token), "Content-Type": ctype},
                        data=body, timeout=120)
    data = resp.json().get("data") if isinstance(resp.json(), dict) else None
    if not resp.ok or not data or not data.get("id"):
        raise XApiError(http.describe_failure("X media upload", resp))
    state = (data.get("processing_info") or {}).get("state")
    if state == "failed":
        raise XApiError("X media upload: processing failed")
    return str(data["id"])


def set_alt_text(token: str, media_id: str, text: str) -> None:
    text = " ".join((text or "").split())[:MAX_ALT_TEXT]
    if not text:
        return
    resp = http.request("POST", f"{API}/media/metadata", headers=_auth(token),
                        json_body={"id": media_id, "metadata": {"alt_text": {"text": text}}})
    if not resp.ok:
        raise XApiError(http.describe_failure("X alt text", resp))


def create_post(token: str, text: str, *, media_ids: list[str] | None = None,
                reply_to: str | None = None, quote_id: str | None = None,
                api: str = API) -> dict[str, Any]:
    body: dict[str, Any] = {"text": text}
    if media_ids:
        body["media"] = {"media_ids": list(media_ids)}
    if reply_to:
        body["reply"] = {"in_reply_to_tweet_id": reply_to}
    if quote_id:
        body["quote_tweet_id"] = quote_id
    resp = http.request("POST", f"{api}/tweets", headers=_auth(token), json_body=body)
    data = resp.json().get("data") if isinstance(resp.json(), dict) else None
    if not resp.ok or not data or not data.get("id"):
        raise XApiError(http.describe_failure("X post", resp))
    return data


def get_post(token: str, post_id: str) -> dict[str, Any]:
    """Read a post back with its attachments; {} when it is not there."""
    resp = http.request("GET", f"{API}/tweets/{post_id}", headers=_auth(token),
                        params={"expansions": "attachments.media_keys", "media.fields": "type,alt_text"})
    if resp.status == 404:
        return {}
    if not resp.ok:
        raise XApiError(http.describe_failure("X read-back", resp))
    return resp.json()


def post_url(post_id: str, username: str = "") -> str:
    return f"https://x.com/{username}/status/{post_id}" if username else f"https://x.com/i/web/status/{post_id}"


def publish(token: str, text: str, *, image: Path | None = None, alt_text: str = "",
            reply_to: str | None = None, live: bool = False) -> dict[str, Any]:
    """Post text, with one picture when given. Dry run unless live=True.

    Returns {"live", "id", "url", "media_id", "read_back"}. A live post is read
    back and refused as unpublished when the read-back does not find it.
    """
    if image is not None and image_problem(image):
        raise XApiError(image_problem(image))
    if not live:
        return {"live": False, "id": None, "url": None, "media_id": None,
                "plan": {"text": text, "image": str(image) if image else None, "alt_text": alt_text}}
    media_id = None
    if image is not None:
        media_id = upload_image(token, image)
        if alt_text:
            set_alt_text(token, media_id, alt_text)
    data = create_post(token, text, media_ids=[media_id] if media_id else None, reply_to=reply_to)
    back = get_post(token, data["id"])
    if not back.get("data"):
        raise XApiError(f"X post {data['id']} was accepted but the read-back did not find it")
    return {"live": True, "id": data["id"], "url": post_url(data["id"]), "media_id": media_id,
            "read_back": bool(back.get("data"))}
