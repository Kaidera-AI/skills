---
name: prompt-injection-test
version: 2.0.0
description: |
  Read-only design checklist for testing a skill-content injection boundary
  without embedding live attack payloads in an injectable skill. Defines the
  threat categories, corpus custody, expected rejection properties, audit
  evidence, and regression criteria for a separately controlled test harness.

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
tags: [prompt-injection, security-testing, skills, regression, read-only]
safety_constraints:
  - Never place literal injection payloads or encoded payload bytes in an injectable skill document.
  - Treat the red-team corpus as non-injectable test data with separate access control and provenance.
  - Do not execute tests, mutate a runtime, or inspect production audit data from this read-only checklist.
---

# Prompt-Injection Boundary Test Design

Use this skill to review the design and evidence of a separately authorised
sanitiser test suite. It deliberately contains no live payload strings. Raw
attack cases belong outside `skills/` so merely loading the catalogue cannot
inject the corpus into an agent prompt.

## Threat catalogue

Give every corpus entry a stable opaque ID and one category:

| Category | Required property |
|---|---|
| Envelope escape | Closing, malformed, case-varied, and whitespace-varied boundary attempts are rejected before prompt assembly. |
| Policy impersonation | Content resembling a higher-authority policy cannot change instruction precedence. |
| Direct override | Requests to disregard prior authority are rejected or inert. |
| Identity replacement | Attempts to replace the agent role or purpose are rejected or inert. |
| Template token injection | Provider-specific control-token sequences never become control messages. |
| Invisible Unicode | Directional controls, zero-width characters, and byte-order marks are rejected or normalized under an explicit policy. |
| Encoded payload | Encoded instructions are never decoded and executed implicitly. |
| Near-miss mutation | Bounded spelling, separator, case, and Unicode mutations exercise known bypass classes. |

## Corpus custody

- Store raw cases in a non-injectable fixture directory or external security
  test artifact, never in `*.SKILL.md`, marketplace JSON, test names, logs, or
  failure messages.
- Bind the corpus version and SHA-256 in the test receipt. Record the reviewer,
  source licence, creation method, and expiry/review date.
- Give test code opaque case IDs. A failure reports the ID and digest, not the
  raw payload.
- Do not fetch or generate new attack cases during CI. The reviewed corpus is an
  immutable input to a hermetic test.

## Required regression properties

1. Sanitisation happens before content enters any system/developer prompt,
   template, cache, telemetry body, or external model request.
2. The same canonical bytes are scanned and injected; decoding, normalization,
   or rendering cannot create a post-scan variant.
3. Rejection is fail-closed. Parser errors, size limits, invalid UTF-8, nested
   encodings, and unavailable scanners cannot turn into acceptance.
4. Skill metadata is scanned as well as the Markdown body. Fenced code, inline
   code, comments, link destinations, and YAML strings are not trusted zones.
5. Positive controls prove ordinary skills still load; negative controls prove
   every corpus ID is rejected for the expected reason.
6. The test asserts no prompt/model call occurred for a rejected case and no raw
   payload entered logs, traces, metrics, exception messages, or audit exports.
7. A secondary output-encoding boundary prevents accepted prose from becoming a
   control token in a downstream provider format.

## Evidence receipt

The test owner should provide:

- sanitiser source revision and executable/package digest;
- corpus version, digest, entry count, and category counts;
- exact test command, runtime version, finite timeout, and exit status;
- accepted-positive and rejected-negative counts;
- proof that rejected cases caused zero downstream model calls;
- log/trace redaction assertions; and
- limitations, skipped platforms, and any untested provider encoding.

A green regex scan alone is not proof of prompt isolation. Runtime binding,
canonicalization, provider serialization, logging, and failure behavior need
separate tests. Do not call this Gate 2, Gate 3, or production acceptance unless
the corresponding repository policy and external trust evidence are actually
satisfied.
