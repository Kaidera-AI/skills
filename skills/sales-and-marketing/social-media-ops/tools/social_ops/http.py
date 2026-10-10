"""HTTP for social_ops: one request function over urllib, one seam for tests.

Every network call in the package goes through ``request``. Tests replace
``TRANSPORT`` with a function that takes a ``urllib.request.Request`` and a
timeout and returns a ``Response``, so no test ever touches the network.

Error bodies are kept (trimmed), because the platforms explain refusals there.
URLs are never echoed into an exception message: Meta's Graph API carries the
access token in the query string.
"""
from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass, field
from typing import Any, Callable

USER_AGENT = "social-ops/1.0 (official APIs; robots.txt respected)"
DEFAULT_TIMEOUT = 30


@dataclass
class Response:
    status: int
    body: bytes = b""
    headers: dict[str, str] = field(default_factory=dict)

    def json(self) -> Any:
        if not self.body:
            return {}
        try:
            return json.loads(self.body)
        except ValueError:
            return {"_raw": self.body[:500].decode("utf-8", "replace")}

    def text(self) -> str:
        return self.body.decode("utf-8", "replace")

    def header(self, name: str) -> str:
        wanted = name.lower()
        return next((v for k, v in self.headers.items() if k.lower() == wanted), "")

    @property
    def ok(self) -> bool:
        return 200 <= self.status < 300


def _context() -> ssl.SSLContext:
    ctx = ssl.create_default_context()
    for cafile in ("/etc/ssl/cert.pem", "/etc/pki/tls/certs/ca-bundle.crt"):
        try:
            ctx.load_verify_locations(cafile)
            break
        except Exception:
            continue
    return ctx


def _urllib_transport(req: urllib.request.Request, timeout: float) -> Response:
    try:
        with urllib.request.urlopen(req, context=_context(), timeout=timeout) as resp:
            return Response(resp.status, resp.read(), dict(resp.headers.items()))
    except urllib.error.HTTPError as exc:
        return Response(exc.code, exc.read() or b"", dict(exc.headers.items()) if exc.headers else {})


TRANSPORT: Callable[[urllib.request.Request, float], Response] = _urllib_transport


def request(method: str, url: str, *, headers: dict[str, str] | None = None,
            params: dict[str, Any] | None = None, json_body: Any = None,
            form: dict[str, Any] | None = None, data: bytes | None = None,
            timeout: float = DEFAULT_TIMEOUT) -> Response:
    """Send one request. Exactly one of json_body, form or data may carry a body."""
    hdrs = {"User-Agent": USER_AGENT, **(headers or {})}
    if params:
        clean = {k: v for k, v in params.items() if v is not None}
        url = f"{url}{'&' if '?' in url else '?'}{urllib.parse.urlencode(clean)}"
    if json_body is not None:
        data = json.dumps(json_body).encode()
        hdrs.setdefault("Content-Type", "application/json")
    elif form is not None:
        clean = {k: v for k, v in form.items() if v is not None}
        data = urllib.parse.urlencode(clean).encode()
        hdrs.setdefault("Content-Type", "application/x-www-form-urlencoded")
    req = urllib.request.Request(url, method=method.upper(), headers=hdrs, data=data)
    return TRANSPORT(req, timeout)


def multipart(fields: dict[str, str], files: dict[str, tuple[str, bytes, str]]) -> tuple[bytes, str]:
    """(body, content type) for multipart/form-data. files: name -> (filename, bytes, mime)."""
    boundary = f"----social-ops-{uuid.uuid4().hex}"
    out = bytearray()
    for name, value in fields.items():
        out += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n"
                f"{value}\r\n").encode()
    for name, (filename, blob, mime) in files.items():
        out += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"; "
                f"filename=\"{filename}\"\r\nContent-Type: {mime}\r\n\r\n").encode()
        out += blob + b"\r\n"
    out += f"--{boundary}--\r\n".encode()
    return bytes(out), f"multipart/form-data; boundary={boundary}"


def describe_failure(what: str, resp: Response) -> str:
    """One line for logs and exceptions: never the URL, at most 300 chars of the body."""
    return f"{what} refused: HTTP {resp.status} {resp.text()[:300]}".strip()
