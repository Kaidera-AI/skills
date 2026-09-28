# Changelog

## Unreleased — portable installation (2026-09-28)

- Made skill guidance project-owned rather than assuming a particular role grant; project-scoped installation is required for policy discovery.
- Kept optional receipts out of version control and made offline selftest and test suites work without an installed project policy.
- Allowed a full request timeout plus retry backoff within the total deadline; retries now include 529 and honor a numeric `Retry-After` up to 60 seconds and the remaining deadline.
- Sized the decide and verify input caps against the serialized request/context bounds, including escaped Unicode, and made selftest assert both maximum envelopes.
- Exercised each wrapper's documented input through its CLI command with a fake offline response, including the handoff text and optional receipt verification examples.
- Included the offline selftest policy fixture in the published core config while leaving real commands dependent on a project-installed transfer policy.
- Restored six-candidate decisions and seven-claim/evidence verification; JSON-escaped text caps now accept observed sanitized summaries (decision 1600, evidence 2800, priorities 1700, candidate description 400, requirement description 400, ids 64) while selftest requires at least 10% request/context headroom.
- Kept installed guidance and attribution clear of source-only evaluation, calibration and parity-fixture paths; the publication contract rejects dangling file references.

## Unreleased — W2.4 UPDATE false-positive fix (2026-09-27)

- Constrained `UPDATE` source recognition to structured assignments with a WHERE clause or final semicolon; ordinary lead metadata instructions remain transferable.

## Unreleased — W2.3 convergence rework (2026-09-27)

- Required SQL statement structure so imperative lead dispatch/triage prose passes while source statements still abstain.
- Added length-constrained modern credential shapes while preserving prefix-only prose, and documented non-exhaustive recognition.
- Documented unfenced/Markdown-quoted source and blocking-read deadlines as manual-HOLD residuals under the convergence rule.

## Unreleased — W2.2 review rework (2026-09-27)

- Kept repository-relative paths and Markdown handoffs transferable while holding absolute home/system paths, structural diffs, source signatures, JSON Patch and URLs presented as relative paths.
- Blocked contiguous credential fragments across adjacent outbound fields and opt-in receipts; recognized internationalized email separators without treating agent aliases as email addresses.
- Bounded HTTP response reads by chunks and remaining deadline; made CA fallback tests independent of the host's trust store and stated the honest-accidental-paste threat boundary.

## Unreleased — W2.1 review rework (2026-09-27)

- Enforced typed/bounded outbound state, NFKC-aware scanning of complete state and questions, internationalized dotted-domain email detection without rejecting `<name>@<project>` agent aliases, raw diff/code and additional absolute-path denial, and value-free error reasons.
- Confined policy reads to direct regular project files; confined opt-in receipts to no-follow, owned directory descriptors; rejected decoded provider extras and credential echoes before output or disk writes.
- Bounded provider response bytes and completion deadline; honoured explicit operator CA file/directory before interpreter defaults, certifi and system fallback without reusing stale SSL contexts.
- Clarified project-owned role authority, missing-core installation gates, multi-project `--project` selection and Gavel's mandatory silent-gap rule; expanded offline negative and family contract tests.

## Unreleased — W2 family (2026-09-27)

- Added the reference-only core skill and four hand-written circumstance skills sharing one Jev CLI/client, with synthetic offline family evals and contract tests.
- Carried Gavel question rationale and calibration rows with the pinned source blob; new primitive thresholds remain uncalibrated advisory annotation points.
- Used certifi when available or an existing macOS/Linux system CA bundle for TLS, without redirecting bearer credentials; TLS verification failure now stops without retry and names a value-free CA fix.
- CLI errors now name a missing or invalid packet field without echoing its value; the transfer-policy provenance is owned by the installing project.

## 0.1.0 — W1 core, pending integration (2026-09-27)

- Added the stdlib `jevkit` client, three-layer project transfer sanitizer, bounded retries, fail-closed answer validation, opt-in git-ignored receipts and advisory verify/screen/decide primitives.
- Preserved Gavel lead request bytes for five sanitizer-clean synthetic cases; the original Gavel source remains unchanged and bindings require the installing project's approval.
