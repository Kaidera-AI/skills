# DevSecOps and Verification

Security, privacy, quality, and operability are planned and evidenced across the
lifecycle—not left to a final scan. Tailor controls to data, exposure, threat, and
impact. This guide adapts the NIST SSDF; it does not claim formal compliance.

## Before implementation

- Classify information and identify trust boundaries, abuse cases, assets,
  identities, external services, and security/privacy requirements.
- Name security ownership, approved tools/data destinations, access and secret
  custodians, vulnerability response route, and risk-acceptance authority.
- Define test strategy and evidence at spec/plan time; include misuse, authorization,
  tenant/isolation, invalid input, failure, recovery, and compatibility paths where
  relevant.
- Select dependencies and services with maintenance, licensing, provenance,
  vulnerability, and operational support in view.

## During build

- Use least privilege, safe defaults, input validation, explicit authorization,
  privacy minimization, secure session/secret handling, and safe error behavior.
- Keep secrets out of source, prompts, logs, screenshots, and test fixtures. If
  exposed, contain and rotate via the authorized process; preserve a sanitized record.
- Pin or constrain dependencies where practical; record source/version/license and
  review vulnerability alerts. Do not suppress a scanner finding without an
  evidenced disposition by the authorized human.
- Run the configured static analysis, secret/dependency/license checks, unit and
  contract tests, and additional dynamic/security checks appropriate to exposure.
- Build reproducibly where practical; link source revision to build, artifact digest,
  provenance/attestation, and deployment target. Protect signing and release keys.

## Verification and risk disposition

For each check record tool/version/configuration, input revision, command or method,
expected and actual result, logs/artifact link, and failure disposition. A skipped,
unsupported, flaky, or not-applicable check is labeled with rationale and owner; it is
not silently counted as a pass. Quarantine failures, fix the cause, and add regression
coverage when a defect could recur.

Risk levels and required controls are project policy. At minimum, elevate changes to
authentication/authorization, sensitive data, cryptography, public contracts,
multi-tenant boundaries, migrations/deletion, supply chain, deployment/secret paths,
or safety-critical behavior. High-impact findings require explicit human disposition;
AI cannot accept risk. Risk-based the QA owner QA supplements, but does not replace, automated
checks, the independent reviewer's independent code review, or human file review.

## Pipeline and production boundary

CI/CD may automatically run authorized checks and prepare immutable artifacts. It
must not gain wider authority merely because a prompt requests speed. Restrict
credentials, targets, and environments; separate build, review, approval, and release
identities where supported. Verify the deployed artifact and user-visible behavior in
the target environment; retain rollback/recovery evidence. A green pipeline is not
proof of security or release acceptance.

## Reference

Use the [NIST Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf)
and [SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) as a risk-based
reference. Record chosen controls and justified omissions in project policy.
