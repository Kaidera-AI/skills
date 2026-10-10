"""LinkedIn Posts API: escape, picture upload, post, read-back.

Routes (LinkedIn Marketing API, versioned):
    POST /rest/images?action=initializeUpload  -> uploadUrl + urn:li:image:...
    PUT  <uploadUrl>                           raw picture bytes
    POST /rest/posts                           the post; its URN comes back in the
                                               x-restli-id response HEADER, the body is empty
    GET  /rest/posts/{encoded urn}             read-back (200 live, 404/410 gone)

Every call sends ``LinkedIn-Version: YYYYMM`` and ``X-Restli-Protocol-Version:
2.0.0``. LinkedIn retires a version about a year after release and then answers
426 NONEXISTENT_VERSION, so keep the version a setting and move it forward.

Scopes: ``w_member_social`` posts as the signed-in member; ``w_organization_social``
posts as a company page the member administers (author urn:li:organization:<id>).

The one trap that costs most: the commentary is LinkedIn "little text". An
unescaped reserved character does not fail the call; LinkedIn answers 201 and
silently drops everything after it. Always run commentary through
``escape_commentary``.
"""
from __future__ import annotations

import re
import urllib.parse
from pathlib import Path
from typing import Any

from . import http

API = "https://api.linkedin.com/rest"
DEFAULT_VERSION = "202609"
IMAGE_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif"}
MAX_COMMENTARY = 3000


class LinkedInError(RuntimeError):
    pass


def escape_commentary(text: str) -> str:
    """Escape little-text reserved characters: ( ) [ ] < > _ * ~ | { } and backslash,
    plus a plain-text @ before a letter. # stays bare so hashtags still link."""
    text = text.replace("\\", "\\\\")
    for ch in "()[]<>_*~|{}":
        text = text.replace(ch, f"\\{ch}")
    return re.sub(r"@(?=[A-Za-z])", r"\\@", text)


def _headers(token: str, version: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}", "LinkedIn-Version": version,
            "X-Restli-Protocol-Version": "2.0.0"}


def upload_image(token: str, owner_urn: str, path: Path, *, version: str = DEFAULT_VERSION) -> str:
    if path.suffix.lower() not in IMAGE_TYPES or not path.is_file():
        raise LinkedInError(f"not an uploadable picture: {path.name}")
    resp = http.request("POST", f"{API}/images", params={"action": "initializeUpload"},
                        headers=_headers(token, version),
                        json_body={"initializeUploadRequest": {"owner": owner_urn}})
    value = (resp.json() or {}).get("value") or {}
    if not resp.ok or not value.get("uploadUrl") or not value.get("image"):
        raise LinkedInError(http.describe_failure("LinkedIn initializeUpload", resp))
    put = http.request("PUT", value["uploadUrl"], headers={"Authorization": f"Bearer {token}",
                       "Content-Type": IMAGE_TYPES[path.suffix.lower()]}, data=path.read_bytes(), timeout=120)
    if not put.ok:
        raise LinkedInError(http.describe_failure("LinkedIn picture upload", put))
    return value["image"]


def create_post(token: str, author_urn: str, text: str, *, image_urn: str = "", alt_text: str = "",
                version: str = DEFAULT_VERSION) -> str:
    if len(text) > MAX_COMMENTARY:
        raise LinkedInError(f"commentary is {len(text)} characters, over {MAX_COMMENTARY}")
    body: dict[str, Any] = {
        "author": author_urn,
        "commentary": escape_commentary(text),
        "visibility": "PUBLIC",
        "distribution": {"feedDistribution": "MAIN_FEED", "targetEntities": [],
                         "thirdPartyDistributionChannels": []},
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }
    if image_urn:
        media: dict[str, Any] = {"id": image_urn}
        if alt_text:
            media["altText"] = " ".join(alt_text.split())[:4086]
        body["content"] = {"media": media}
    resp = http.request("POST", f"{API}/posts", headers=_headers(token, version), json_body=body)
    urn = resp.header("x-restli-id") or resp.header("x-linkedin-id") or (resp.json() or {}).get("id", "")
    if not resp.ok or not urn:
        raise LinkedInError(http.describe_failure("LinkedIn post", resp))
    return urn


def get_post(token: str, post_urn: str, *, version: str = DEFAULT_VERSION) -> dict[str, Any]:
    resp = http.request("GET", f"{API}/posts/{urllib.parse.quote(post_urn, safe='')}",
                        headers=_headers(token, version))
    if resp.status in (404, 410):
        return {}
    if not resp.ok:
        raise LinkedInError(http.describe_failure("LinkedIn read-back", resp))
    return resp.json()


def post_url(post_urn: str) -> str:
    return f"https://www.linkedin.com/feed/update/{post_urn}/" if post_urn else ""


def publish(token: str, author_urn: str, text: str, *, image: Path | None = None, alt_text: str = "",
            version: str = DEFAULT_VERSION, live: bool = False) -> dict[str, Any]:
    """Post as author_urn. Dry run unless live=True; a live post must read back,
    and the read-back commentary must still end the way the sent text ends."""
    if not live:
        return {"live": False, "urn": None, "url": None,
                "plan": {"author": author_urn, "commentary": escape_commentary(text),
                         "image": str(image) if image else None, "alt_text": alt_text}}
    image_urn = upload_image(token, author_urn, image, version=version) if image else ""
    urn = create_post(token, author_urn, text, image_urn=image_urn, alt_text=alt_text, version=version)
    back = get_post(token, urn, version=version)
    if not back:
        raise LinkedInError(f"LinkedIn post {urn} was accepted but the read-back did not find it")
    tail = text.strip()[-40:]
    live_text = (back.get("commentary") or "").replace("\\", "")
    truncated = bool(tail) and tail.replace("\\", "") not in live_text
    return {"live": True, "urn": urn, "url": post_url(urn), "image_urn": image_urn or None,
            "read_back": True, "truncated": truncated}
