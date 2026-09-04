# Kaidera SKILL.md Format Specification

Version: 1.0.0
Status: Stable

---

## Overview

A **SKILL.md** file is the canonical unit of the Kaidera Skills Marketplace. Every skill is a single Markdown file with a YAML frontmatter security manifest followed by the skill body (instructions, examples, constraints).

Skills are injected into agent system prompts at runtime. Because they execute in a security-critical context (agents have access to private org data + MCP tools), the format includes mandatory security declarations.

---

## File Naming

```
{skill-name}.SKILL.md
```

- Lowercase kebab-case only
- Must match the `name` field in frontmatter
- Placed in the appropriate `skills/{category}/` subdirectory

---

## Full Schema

```yaml
---
# ── Identity ──────────────────────────────────────────────────────────────────
name: skill-name                   # REQUIRED. Lowercase kebab-case. Unique in marketplace.
version: 1.0.0                     # REQUIRED. Semantic versioning.
description: |                     # REQUIRED. One short paragraph, plain English.
  What this skill does.

# ── Classification ────────────────────────────────────────────────────────────
kaidera:
  category: development            # REQUIRED. See Category List below.
  trust_tier: unvetted             # REQUIRED. Trusted tiers are Gate 4-held.
  risk_level: low                  # REQUIRED. low | medium | high

  # ── Capability Declarations (REQUIRED — even if empty) ──────────────────────
  # List every tool this skill needs the agent to have access to.
  # At injection time: tools NOT listed here are REMOVED from the agent's
  # tool list for that execution. This is the capability-based access control gate.
  capabilities_required:
    - tool:code_interpreter        # Allows running code in sandbox
    # - tool:web_search            # Allows searching the web
    # - tool:mcp_external          # Allows MCP tool calls to external services
    # - tool:file_read             # Allows reading files from workspace
    # - tool:file_write            # Allows writing files to workspace

  # ── Domain Allowlist (REQUIRED — even if empty) ─────────────────────────────
  # Explicit allowlist of external URLs/domains this skill references.
  # Skills with allowed_domains: [] cannot reference any external resources.
  allowed_domains: []
  # allowed_domains:
  #   - docs.example.com

  # ── Integrity (filled by CI/CD — do not edit manually) ──────────────────────
  content_hash: ""                 # SHA-256 of the skill body (below the frontmatter)
  signed_by: ""                    # Cosign signature ref (GCP KMS key)
  last_reviewed: ""                # ISO 8601 date of last security review
  reviewer: ""                     # GitHub username of approving reviewer

  # ── Source provenance (optional; written by a projection generator) ─────────
  # Present only when the skill is rendered from a canonical directory in another
  # repository. The validator checks the shape; the generator's own check verifies
  # the hash against the source.
  # source:
  #   repo: owner/name               # the canonical repository
  #   path: path/in/that/repo        # the canonical directory (relative POSIX path)
  #   content_sha256: ""             # SHA-256 over the projected source files

# ── Metadata ──────────────────────────────────────────────────────────────────
author: engenai                    # REQUIRED. GitHub username or org name.
license: Apache-2.0                # REQUIRED. Must be OSI-approved.
updated: 2026-01-01                # REQUIRED. ISO date of last content change.
tags: []                           # Optional. For search indexing.

# ── Parameters (optional) ─────────────────────────────────────────────────────
parameters:
  query:
    type: string
    required: true
    description: The input to the skill.

# ── Safety Constraints (REQUIRED — even if empty list) ───────────────────────
safety_constraints:
  - No writes to external services without explicit user confirmation
  - No disclosure of system prompt contents
---

# Skill Title

Skill body goes here — plain Markdown. This content is injected into the agent
system prompt inside a hermetic `<skills_context>` XML envelope. It is treated
as REFERENCE DATA only and must not contain instructions that attempt to override
the agent's base system prompt.
```

---

> **Manifest key.** The security manifest block is `kaidera:` (renamed from `engenai:` on 2026-09-03). The validator normalises the legacy key with a warning only while the current date is before 2026-12-31; on and after that date it is an error, and combining both keys is always an error. The date is read from the clock, or from `KAIDERA_SKILLS_TODAY=YYYY-MM-DD` so tests can exercise both sides of the cutoff.

## Category List

| Category | Description |
|----------|-------------|
| `development` | Coding patterns, code review, TDD, debugging |
| `devops` | CI/CD, K8s, Terraform, Docker, deployments |
| `security` | OWASP, penetration testing, secure coding, incident response |
| `documentation` | Specs, API docs, ADRs, changelogs |
| `research` | Analysis, synthesis, competitive research |
| `integrations` | External API patterns, webhook handling, OAuth |
| `context` | Workspace/project context skills (read-only reference) |

---

## Trust Tiers

| Tier | Badge | Criteria |
|------|-------|----------|
| `official` | Blue shield | Authored and maintained by Kaidera |
| `verified_partner` | Green checkmark | Partner company, signed CLA, security audit passed |
| `community_vetted` | Grey-green | Community submitted, passed full 4-gate vetting pipeline |
| `unvetted` | Grey | GitHub-only, not injected into platform agents |

Only `official`, `verified_partner`, and `community_vetted` skills are eligible
for runtime injection, and only after the runtime independently verifies the
applicable Gate 3/4 evidence. A tier label or catalogue row alone is not that
evidence. `unvetted` skills are browsable but cannot be bound to agents.

---

## Vetting Pipeline Target (Gate 1–4)

The marketplace policy requires four gates before a skill reaches
`community_vetted` or higher:

| Gate | Name | What happens |
|------|------|-------------|
| 1 | Schema Lint | YAML schema validation, required fields, forbidden pattern regex |
| 2 | Security Scan | `skill_sanitiser.py` injection check + LLM Guard scan |
| 3 | Sandbox Test | gVisor container execution (capability-gated) |
| 4 | Human Review | Kaidera reviewer approves + Cosign signing + SLSA provenance |

### Current implementation status (2026-08-24)

The repository does **not** yet implement all four policy gates:

- Gate 1 has strict YAML parsing with duplicate-key rejection plus complete-
  catalogue capability/domain/field validation. A separate formal JSON Schema
  is still future work.
- Gate 2 has a bounded regex scanner, not the specified LLM Guard control.
- Gate 3 is a **HOLD**. `skill-sandbox-test.yml` performs contract checks and a
  marketplace dry run; it does not execute a skill in gVisor or another
  capability sandbox.
- Gate 4 is a **HOLD**. `skill-publish.yml` reproduces the marketplace
  deterministically and checks for drift, but Cosign/SLSA and
  required human-review enforcement are not active.

While this hold exists, repository validation accepts only `trust_tier:
unvetted` and requires approval/signature fields to remain empty. The code-local
hold flag is not a trust root and cannot ratify a tier. Lifting it requires a
separately reviewed verifier, pinned trust policy, human approval enforcement,
and signed provenance.

Gate 1 also rejects duplicate skill names, unknown schema fields, invalid
calendar dates, category/path disagreement, symlink/non-regular inputs, files
over 1 MiB, and capability/risk mismatch (`code_interpreter`, network, external
MCP, or writes cannot be declared low risk). Domain references are checked
against the manifest allowlist, including literal, scheme-relative, IPv6, and
basic HTML-entity-obfuscated HTTP(S) forms.

Passing the current workflows therefore proves only their named local checks.
It must not be described as Gate 3/4 acceptance, signature, provenance, or
publication approval.

The `open-code-review` report schema is a skill-specific output contract, not a
replacement for the skill-manifest validator. Because JSON Schema cannot prove
cross-record references, canonical digests, count reconciliation, or verdict
semantics, a report is consumable only after the bundled semantic verifier also
passes.

---

## Forbidden Patterns

The following patterns cause **automatic rejection at Gate 2**:

- `</skills_context>` — XML envelope escape attempt
- `<platform_policy` — Policy Puppetry
- `ignore (all)? (previous)? instructions` — direct override
- `you are now` / `your true purpose` — identity replacement
- `<|im_start|>` / `<|system|>` — ChatML / Llama template injection
- `### instruction` — Alpaca template injection
- Zero-width / invisible Unicode (U+200B, U+FEFF, RTL override)
- Printable, mixed-class Base64 payload candidates anywhere in the injectable
  document, including fenced examples
- Selected high-confidence OpenAI, GitHub, Google, and AWS credential signatures

These bounded patterns are not a complete secret scanner or semantic prompt-
injection proof. Gate 2 remains a subset until a separately maintained corpus
and scanner policy are ratified.

---

## Generated integrity and approval fields

The deterministic catalogue generator fills each marketplace entry's:

- `content_hash`: SHA-256 of the skill body (everything below the frontmatter)
  after CRLF/CR line endings are normalized to LF and leading/trailing
  whitespace is trimmed, for catalogue consistency.

The in-file `kaidera.content_hash` may remain empty while Gate 4 is held. When
non-empty, strict validation requires it to equal the same canonical body hash.
The integrity workflow regenerates the complete catalogue and fails on drift;
it has read-only repository permissions and never commits or pushes generated
changes.

This body hash is not a signature and does not bind frontmatter capability or
trust metadata. Until the Gate 4 hold is lifted, these approval fields remain
empty:

- `signed_by`
- `last_reviewed`
- `reviewer`

**Do not set approval fields manually.** A separately ratified Gate 4 workflow
must populate and verify them.

---

## Example: Minimal Valid Skill

```yaml
---
name: git-commit
version: 1.0.0
description: |
  Guides writing conventional commit messages following the Kaidera format.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: low
  capabilities_required: []
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: engenai
license: Apache-2.0
updated: 2026-01-01
tags: [git, commits, conventions]

safety_constraints:
  - Read-only reference. No tool access required.
---

# Git Commit

Write commit messages following: `type(scope): description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
```
