"""One-shot Jev transport with a fail-closed transfer boundary."""

from dataclasses import asdict, dataclass
import json
import os
from pathlib import Path
import random
import re
import stat
import ssl
import time
from urllib import error, request
import uuid

from . import sanitize, validate


@dataclass(frozen=True)
class JevResult:
    status: str
    answers: dict | None = None
    usage: dict | None = None
    model: str | None = None
    reason: str | None = None
    annotations: dict | None = None

    def as_dict(self):
        return asdict(self)

class NoRedirect(request.HTTPRedirectHandler):
    """Never forward the bearer header to a redirected destination."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _ssl_context():
    explicit_file = os.environ.get("SSL_CERT_FILE")
    if explicit_file and os.path.isfile(explicit_file):
        return ssl.create_default_context(cafile=explicit_file)
    explicit_dir = os.environ.get("SSL_CERT_DIR")
    if explicit_dir and os.path.isdir(explicit_dir):
        return ssl.create_default_context(capath=explicit_dir)
    defaults = ssl.get_default_verify_paths()
    if defaults.cafile and os.path.isfile(defaults.cafile):
        return ssl.create_default_context(cafile=defaults.cafile)
    if defaults.capath and os.path.isdir(defaults.capath):
        return ssl.create_default_context(capath=defaults.capath)
    try:
        import certifi
    except ImportError:
        pass
    else:
        bundle = certifi.where()
        if os.path.isfile(bundle):
            return ssl.create_default_context(cafile=bundle)
    for bundle in ("/etc/ssl/cert.pem", "/etc/ssl/certs/ca-certificates.crt"):
        if os.path.isfile(bundle):
            return ssl.create_default_context(cafile=bundle)
    return ssl.create_default_context()


def _opener():
    return request.build_opener(NoRedirect, request.HTTPSHandler(context=_ssl_context()))

def _http(req, timeout, max_bytes, deadline):
    try:
        with _opener().open(req, timeout=timeout) as reply:
            chunks = []
            total = 0
            while total <= max_bytes:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    raise TimeoutError("provider total deadline exhausted")
                response = getattr(reply, "fp", None)
                buffered = getattr(response, "fp", None)
                socket = getattr(getattr(buffered, "raw", None), "_sock", None)
                if socket is not None:
                    socket.settimeout(min(remaining, timeout))
                chunk = reply.read(min(4096, max_bytes + 1 - total))
                if time.monotonic() >= deadline:
                    raise TimeoutError("provider total deadline exhausted")
                if not chunk:
                    break
                chunks.append(chunk)
                total += len(chunk)
            return reply.status, b"".join(chunks), getattr(reply, "headers", None)
    except error.HTTPError as exc:
        headers = exc.headers
        exc.close()
        return exc.code, b"", headers


def _owned_receipt_dir(path):
    if path.is_absolute() or not path.parts or path.parts[0] != "runs" or ".." in path.parts or sanitize.SKILL.is_symlink():
        raise ValueError("receipt folder is outside owned runs/")
    flags = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW
    folder_fd = os.open(sanitize.SKILL, flags)
    try:
        for part in path.parts:
            try:
                os.mkdir(part, mode=0o700, dir_fd=folder_fd)
            except FileExistsError:
                pass
            details = os.stat(part, dir_fd=folder_fd, follow_symlinks=False)
            if not stat.S_ISDIR(details.st_mode) or details.st_uid != os.getuid():
                raise ValueError("receipt path contains a link or unowned directory")
            next_fd = os.open(part, flags, dir_fd=folder_fd)
            os.close(folder_fd)
            folder_fd = next_fd
        os.fchmod(folder_fd, 0o700)
        return folder_fd
    except BaseException:
        os.close(folder_fd)
        raise


def _receipt(state, questions, result, directory, key):
    settings = sanitize.config("receipts.json", directory)
    data = {"state": state, "questions": questions, "answers": result.answers, "usage": result.usage, "model": result.model}
    boundary, _ = sanitize.inspect_content(data, key=key, config_dir=directory)
    if boundary:
        raise ValueError("receipt content did not pass sanitizer")
    serialized = json.dumps(data)
    folder_fd = _owned_receipt_dir(Path(settings["path"]))
    try:
        expiry = time.time() - settings["retention_days"] * 86400
        for name in os.listdir(folder_fd):
            if not name.startswith("jev-") or not name.endswith(".json"):
                continue
            details = os.stat(name, dir_fd=folder_fd, follow_symlinks=False)
            if stat.S_ISREG(details.st_mode) and details.st_uid == os.getuid() and details.st_mtime < expiry:
                os.unlink(name, dir_fd=folder_fd)
        name = f"jev-{time.time_ns()}-{uuid.uuid4().hex}.json"
        fd = os.open(name, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600, dir_fd=folder_fd)
        with os.fdopen(fd, "w") as receipt:
            receipt.write(serialized + "\n")
    finally:
        os.close(folder_fd)


def ask(state, questions, *, role, categories, project=None, policy_path=None, config_dir=None, transport=None, sleep=time.sleep, pinned=False, receipt=None):
    """Return a typed result; transport is injectable for offline callers/tests."""
    secret = os.environ.get("TYPESAFE_API_KEY")
    status, reason, approved = sanitize.check(state, categories, role=role, project=project, policy_path=policy_path, config_dir=config_dir)
    if status:
        return JevResult(status, reason="transfer-policy blocked outbound content" if secret and secret in reason else reason)
    try:
        provider = sanitize.config("provider.json", config_dir)
        if provider["credential_env"] != "TYPESAFE_API_KEY" or provider["legacy_credential_env"] != "JEV_API_KEY":
            raise ValueError("credential setting is not approved")
        limits = sanitize.config("limits.json", config_dir)
        if not validate.questions_valid(questions, limits):
            raise ValueError("question map exceeds configured bounds")
        if not provider["endpoint"].startswith("https://"):
            raise ValueError("provider endpoint must use HTTPS")
        if not secret:
            message = ("`TYPESAFE_API_KEY` is not set; rename `JEV_API_KEY` to `TYPESAFE_API_KEY`" if "JEV_API_KEY" in os.environ else "`TYPESAFE_API_KEY` is not set")
            return JevResult("abstained_no_key", reason=message)
        model = provider["model_pin" if pinned else "model_default"]
        outbound = {"state": approved, "model": model, "questions": questions}
        body = json.dumps(outbound).encode()
        boundary, reason = sanitize.inspect_content(outbound, key=secret, config_dir=config_dir)
        if boundary:
            return JevResult(boundary, reason=reason)
        longest_question = max(len(json.dumps(question).encode()) for question in questions.values())
        if len(body) > limits["max_request_token_bound"] or len(json.dumps(approved).encode()) + longest_question > limits["max_context_token_bound"]:
            return JevResult("error_validation", reason="request exceeds conservative UTF-8 token upper bound")
        req = request.Request(provider["endpoint"], data=body, headers={"Authorization": "Bearer " + secret, "Content-Type": "application/json"})
        deadline = time.monotonic() + provider["total_deadline_s"]
        for attempt in range(provider["max_retries"] + 1):
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                return JevResult("error_provider", reason="provider deadline exhausted")
            try:
                timeout = min(remaining, provider["request_timeout_s"])
                response = transport(req, timeout) if transport is not None else _http(req, timeout, limits["max_response_bytes"], deadline)
                code, raw = response[:2]
                headers = response[2] if len(response) > 2 else None
            except Exception as exc:
                failure = exc.reason if isinstance(exc, error.URLError) else exc
                if isinstance(failure, ssl.SSLCertVerificationError):
                    return JevResult("error_provider", reason="TLS certificate verification failed; install certifi or set SSL_CERT_FILE to a trusted CA bundle")
                code, raw, headers = 503, b"", None
            if time.monotonic() >= deadline:
                return JevResult("error_provider", reason="provider total deadline exhausted")
            if isinstance(raw, (bytes, bytearray)) and len(raw) > limits["max_response_bytes"]:
                return JevResult("error_provider", reason="provider response exceeds configured byte limit")
            if code == 200:
                if not isinstance(raw, (bytes, bytearray)) or secret.encode() in raw:
                    return JevResult("error_validation", reason="provider response contains invalid content")
                reply = None
                try:
                    reply = json.loads(raw)
                    boundary, _ = sanitize.inspect_content(reply, key=secret, config_dir=config_dir)
                    if boundary:
                        return JevResult("error_validation", reason="provider response contains restricted content")
                    answers, usage, returned_model = validate.validate(reply, questions)
                    if time.monotonic() >= deadline:
                        return JevResult("error_provider", reason="provider total deadline exhausted")
                except (ValueError, TypeError, UnicodeError):
                    if time.monotonic() >= deadline:
                        return JevResult("error_provider", reason="provider total deadline exhausted")
                    candidate_model = reply.get("model") if isinstance(reply, dict) else None
                    safe_model = candidate_model if isinstance(candidate_model, str) and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,127}", candidate_model) and not sanitize.REDACT.search(candidate_model) else None
                    return JevResult("error_validation", model=safe_model, reason="provider answers failed validation")
                result = JevResult("ok", answers=answers, usage=usage, model=returned_model)
                settings = sanitize.config("receipts.json", config_dir)
                if receipt if receipt is not None else settings["enabled_default"]:
                    try:
                        _receipt(approved, questions, result, config_dir, secret)
                    except (OSError, ValueError, KeyError, TypeError, re.error):
                        return JevResult("error_validation", reason="opt-in receipt could not be safely written")
                return result
            if code not in provider["retry_statuses"] or attempt == provider["max_retries"]:
                return JevResult("error_provider", reason="provider request failed after bounded attempts")
            retry_after = headers.get("Retry-After") if headers else None
            if isinstance(retry_after, str) and re.fullmatch(r"[0-9]+", retry_after.strip()):
                digits = retry_after.strip().lstrip("0") or "0"
                delay = 60 if len(digits) > 2 else min(int(digits), 60)
            else:
                delay = min(provider["backoff_initial_s"] * 2**attempt, provider["backoff_max_s"])
                delay *= 1 + (random.random() * 2 - 1) * provider["backoff_jitter"]
            sleep(min(delay, max(0, deadline - time.monotonic())))
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        return JevResult("error_validation", reason="provider configuration or request is invalid")
    return JevResult("error_provider", reason="provider request failed")
