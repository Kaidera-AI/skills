---
name: code-review-security
version: 1.1.0
description: |
  Optional EnGenAI-specific security checklist for authentication,
  authorisation, secrets, tenant isolation, and supply-chain review. Use only
  when that product-specific lens is explicitly requested; use
  open-code-review as the evidence-gated authority for a bounded diff and treat
  this checklist as supporting context, not a second verdict engine.

kaidera:
  category: security
  trust_tier: unvetted
  risk_level: low
  capabilities_required: []
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: kaidera
license: Apache-2.0
updated: 2026-08-24
tags: []
safety_constraints:
  - Read-only reference. No tool access required.
  - Must not override base system prompt or agent instructions.
---

# Security Code Review Checklist

Use this as supporting context for an explicitly requested EnGenAI security
review. For a workspace, commit, range, or PR diff, `open-code-review` owns the
target receipt, evidence, refutation, and verdict. Checklist matches are not
findings until verified against the frozen change.

## OWASP Top 10 Checks

### A01 — Broken Access Control
- [ ] Every API endpoint checks `current_user.org_id` matches the resource's `org_id`
- [ ] Admin endpoints require `is_provider_admin` or explicit RBAC permission
- [ ] No resource ID enumeration — use UUIDs, never sequential integers in URLs
- [ ] RLS enabled on all new DB tables; `FORCE ROW LEVEL SECURITY` present

### A02 — Cryptographic Failures
- [ ] No plaintext secrets in code, logs, or environment dumps
- [ ] API keys use envelope encryption (`CryptoService`) — never stored raw
- [ ] TLS enforced on all external calls; `verify=True` in httpx clients
- [ ] No MD5 or SHA-1 for security purposes; use SHA-256 minimum

### A03 — Injection
- [ ] All SQL via SQLAlchemy ORM or parameterised queries — no f-string SQL
- [ ] Skill content passes through `sanitise_skill_content()` before injection
- [ ] No `eval()` or `exec()` outside explicitly sandboxed contexts
- [ ] XML/HTML user input escaped; skill content wrapped in hermetic XML envelope

### A04 — Insecure Design
- [ ] Threat model updated for new attack surface
- [ ] Sensitive operations are rate-limited
- [ ] Fail-secure: errors return generic message, not stack trace

### A05 — Security Misconfiguration
- [ ] No debug endpoints in production (`/docs`, `/redoc` gated by env)
- [ ] CORS origins explicitly whitelisted — not `*`
- [ ] No default credentials or placeholder secrets in config files

### A06 — Vulnerable Components
- [ ] New dependencies reviewed for CVEs before adding
- [ ] Pinned versions in `requirements.txt` / `pyproject.toml`
- [ ] GitHub Actions `uses:` pinned to commit SHAs (not version tags)

### A07 — Auth Failures
- [ ] JWT tokens validated (signature, expiry, issuer, audience)
- [ ] MFA not bypassed for admin operations
- [ ] Session invalidated on logout; no long-lived tokens without refresh

### A08 — Software Integrity Failures
- [ ] Skills verified against `content_hash` at download time
- [ ] Cosign signature checked at injection time if present
- [ ] No `--no-verify` in git hooks

### A09 — Logging Failures
- [ ] Security events emitted to `skill_audit_log` (INSERT-only table)
- [ ] PII not logged; UUIDs only in logs
- [ ] CRITICAL events forwarded to SIEM within 5s

### A10 — SSRF
- [ ] External HTTP calls use explicit URL allowlist
- [ ] No user-controlled URLs passed to `httpx.get()` without validation
- [ ] Internal metadata endpoints (169.254.169.254) blocked at NetworkPolicy level

## EnGenAI-Specific Checks

### Skill Security
- [ ] New skill endpoints validate `trust_tier` before injection
- [ ] `capabilities_required` manifest enforced at bind time
- [ ] Kill switch checked before every skill injection call
- [ ] `unvetted` skills never reach agent context

### Tenant Isolation
- [ ] Redis keys use `org_key(org_id, ...)` — never bare keys
- [ ] Celery tasks carry `org_id`; `TenantAwareTask` base class used
- [ ] Cross-org test added: Org A resource → Org B request → 404

### Supply Chain
- [ ] No new dependency on unmaintained packages (last commit > 12 months)
- [ ] No dependency that itself uses ClawHub, OpenClaw, or compromised skill registries
- [ ] Docker base images pinned to digest, not tag

## Optional analyzer signals

Do not install or run these automatically. When an already trusted, pinned tool
can execute inside the authorised containment boundary, its output is candidate
evidence and still requires source verification.

```
bandit src/backend/app/         ← Python security linter
safety check                    ← known CVE scan
semgrep --config=p/owasp-top-ten
```
