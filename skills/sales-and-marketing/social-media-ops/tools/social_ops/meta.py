"""Instagram (Instagram API with Instagram Login) and Threads: two-step publishing.

Both platforms publish in two steps: create a media container, wait until it is
ready, then publish it. Neither takes picture bytes: Meta fetches the picture
from a public HTTPS URL at container time, so the host must put the approved
file somewhere public first and pass that URL.

Instagram, host graph.instagram.com (no Facebook Page needed):
    GET  /me?fields=user_id,username                    identity
    POST /{ig-user-id}/media  image_url, caption, alt_text   -> container id
    GET  /{container}?fields=status_code                FINISHED | IN_PROGRESS | ERROR | EXPIRED
    POST /{ig-user-id}/media_publish  creation_id        -> media id
    GET  /{media}?fields=permalink,timestamp            read-back
    GET  /{ig-user-id}/content_publishing_limit         quota (100 API posts per 24 h)
    Scopes: instagram_business_basic, instagram_business_content_publish.
    Account: a professional (Business or Creator) Instagram account. JPEG only.
    Caption: 2,200 characters, at most 30 hashtags and 20 @-mentions.

Threads, host graph.threads.net:
    GET  /me?fields=id,username
    POST /{threads-user-id}/threads  media_type=TEXT|IMAGE, text, image_url, alt_text
    GET  /{container}?fields=status,error_message
    POST /{threads-user-id}/threads_publish  creation_id
    GET  /{media}?fields=permalink,timestamp
    Scopes: threads_basic, threads_content_publish. Text: 500 characters, and an
    emoji counts as its UTF-8 byte length. Meta suggests waiting about 30 s
    between creating and publishing a container.

Both apps need Meta App Review for the publishing permission before they can post
for anyone other than the app's own testers.
"""
from __future__ import annotations

import time
import unicodedata
from typing import Any, Callable

from . import http

IG_API = "https://graph.instagram.com/v23.0"
THREADS_API = "https://graph.threads.net/v1.0"
IG_CAPTION_MAX = 2200
IG_MAX_HASHTAGS = 30
IG_MAX_MENTIONS = 20
THREADS_TEXT_MAX = 500


class MetaError(RuntimeError):
    pass


def _get(url: str, token: str, fields: str) -> http.Response:
    return http.request("GET", url, params={"fields": fields, "access_token": token})


def _post(url: str, token: str, form: dict[str, Any]) -> http.Response:
    return http.request("POST", url, form={**form, "access_token": token})


def _id_or_raise(what: str, resp: http.Response) -> str:
    data = resp.json() if isinstance(resp.json(), dict) else {}
    if not resp.ok or not data.get("id"):
        raise MetaError(http.describe_failure(what, resp))
    return str(data["id"])


# ------------------------------------------------------------------ limits

def threads_length(text: str) -> int:
    """Length as Threads counts it: one per character, an emoji its UTF-8 bytes."""
    return sum(len(ch.encode("utf-8")) if unicodedata.category(ch) == "So" or ord(ch) > 0xFFFF else 1
               for ch in text)


def caption_problems(text: str, channel: str) -> list[str]:
    problems = []
    if channel == "instagram":
        if len(text) > IG_CAPTION_MAX:
            problems.append(f"caption is {len(text)} characters, Instagram allows {IG_CAPTION_MAX}")
        tags = sum(1 for w in text.split() if w.startswith("#") and len(w) > 1)
        if tags > IG_MAX_HASHTAGS:
            problems.append(f"{tags} hashtags, Instagram allows {IG_MAX_HASHTAGS}")
        mentions = sum(1 for w in text.split() if w.startswith("@") and len(w) > 1)
        if mentions > IG_MAX_MENTIONS:
            problems.append(f"{mentions} mentions, Instagram allows {IG_MAX_MENTIONS}")
    elif channel == "threads":
        n = threads_length(text)
        if n > THREADS_TEXT_MAX:
            problems.append(f"text counts {n}, Threads allows {THREADS_TEXT_MAX}")
    return problems


def _wait(check: Callable[[], str], *, ready: str, failed: set[str], max_wait: float,
          every: float, sleep: Callable[[float], None]) -> str:
    waited = 0.0
    while True:
        state = check()
        if state == ready or state in failed:
            return state
        if waited >= max_wait:
            return state or "TIMEOUT"
        sleep(every)
        waited += every


# ------------------------------------------------------------------ Instagram

def ig_identity(token: str, *, api: str = IG_API) -> dict[str, Any]:
    resp = _get(f"{api}/me", token, "user_id,username")
    if not resp.ok:
        raise MetaError(http.describe_failure("Instagram identity", resp))
    return resp.json()


def ig_quota(token: str, ig_user_id: str, *, api: str = IG_API) -> dict[str, Any]:
    resp = _get(f"{api}/{ig_user_id}/content_publishing_limit", token, "quota_usage,config")
    if not resp.ok:
        raise MetaError(http.describe_failure("Instagram publishing limit", resp))
    return resp.json()


def ig_publish_image(token: str, ig_user_id: str, image_url: str, caption: str, *, alt_text: str = "",
                     live: bool = False, api: str = IG_API, max_wait: float = 300, every: float = 10,
                     sleep: Callable[[float], None] = time.sleep) -> dict[str, Any]:
    problems = caption_problems(caption, "instagram")
    if not image_url.lower().startswith("https://"):
        problems.append("Instagram fetches the picture itself, so image_url must be a public https URL")
    if problems:
        raise MetaError("; ".join(problems))
    if not live:
        return {"live": False, "plan": {"image_url": image_url, "caption": caption, "alt_text": alt_text}}
    container = _id_or_raise("Instagram container", _post(f"{api}/{ig_user_id}/media", token, {
        "image_url": image_url, "caption": caption, "alt_text": alt_text or None}))
    state = _wait(lambda: (_get(f"{api}/{container}", token, "status_code").json() or {}).get("status_code", ""),
                  ready="FINISHED", failed={"ERROR", "EXPIRED"}, max_wait=max_wait, every=every, sleep=sleep)
    if state != "FINISHED":
        raise MetaError(f"Instagram container {container} ended {state}, not FINISHED")
    media_id = _id_or_raise("Instagram publish", _post(f"{api}/{ig_user_id}/media_publish", token,
                                                       {"creation_id": container}))
    back = _get(f"{api}/{media_id}", token, "permalink,timestamp")
    permalink = (back.json() or {}).get("permalink") if back.ok else None
    if not permalink:
        raise MetaError(f"Instagram media {media_id} published but the read-back found no permalink")
    return {"live": True, "id": media_id, "url": permalink, "container": container}


# ------------------------------------------------------------------ Threads

def threads_identity(token: str, *, api: str = THREADS_API) -> dict[str, Any]:
    resp = _get(f"{api}/me", token, "id,username")
    if not resp.ok:
        raise MetaError(http.describe_failure("Threads identity", resp))
    return resp.json()


def threads_publish(token: str, user_id: str, text: str, *, image_url: str = "", alt_text: str = "",
                    reply_to: str = "", live: bool = False, api: str = THREADS_API,
                    settle: float = 30, max_wait: float = 300, every: float = 10,
                    sleep: Callable[[float], None] = time.sleep) -> dict[str, Any]:
    problems = caption_problems(text, "threads")
    if image_url and not image_url.lower().startswith("https://"):
        problems.append("Threads fetches the picture itself, so image_url must be a public https URL")
    if problems:
        raise MetaError("; ".join(problems))
    form: dict[str, Any] = {"media_type": "IMAGE" if image_url else "TEXT", "text": text,
                            "image_url": image_url or None, "alt_text": (alt_text or None) if image_url else None,
                            "reply_to_id": reply_to or None}
    if not live:
        return {"live": False, "plan": {k: v for k, v in form.items() if v}}
    container = _id_or_raise("Threads container", _post(f"{api}/{user_id}/threads", token, form))
    sleep(settle)
    state = _wait(lambda: (_get(f"{api}/{container}", token, "status,error_message").json() or {}).get("status", ""),
                  ready="FINISHED", failed={"ERROR", "EXPIRED"}, max_wait=max_wait, every=every, sleep=sleep)
    if state != "FINISHED":
        raise MetaError(f"Threads container {container} ended {state}, not FINISHED")
    media_id = _id_or_raise("Threads publish", _post(f"{api}/{user_id}/threads_publish", token,
                                                     {"creation_id": container}))
    back = _get(f"{api}/{media_id}", token, "permalink,timestamp")
    permalink = (back.json() or {}).get("permalink") if back.ok else None
    if not permalink:
        raise MetaError(f"Threads post {media_id} published but the read-back found no permalink")
    return {"live": True, "id": media_id, "url": permalink, "container": container}
