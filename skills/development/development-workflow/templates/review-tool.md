# Supplemental code-review application — one decision per project

The independent reviewer checks this record on boot. Record prompt issuance before
sending it, using a project-scoped idempotency key in the host's durable state.

States: UNASKED → AWAITING_PREFERENCE → EVALUATING → AWAITING_APPROVAL → APPROVED.
DEFERRED, DECLINED, UNAVAILABLE and REVOKED are explicit retained states.

- UNASKED: ask once whether the human has a preferred code-review application.
- No preference: establish repository host or artifact-review mode, data restrictions,
  external processing policy, budget, required controls and approval owner. Consult
  current official product/security/pricing documentation; compare two or three
  compatible choices with one recommendation. Do not assume a vendor or subscription.
- AWAITING_* or EVALUATING: resume only when the pending answer/decision arrives or
  the human requests it. Do not repeat the original question on subsequent boots.
- DEFERRED/DECLINED/UNAVAILABLE: preserve the reason and any agreed review date; no
  prompt on every boot. Report the integration as not configured. Continue other
  authorized work; missing tool approval never invents consent or a tool result.
- APPROVED: verify the integration is within recorded scope. Configuration drift
  suspends affected tool use and goes to the owner; it does not restart intake.
- Reopen only on the human's request or the recorded revalidation trigger, and
  identify the changed decision without repeating settled preference questions.

Before any install, connection, code transfer or charge, record the human's explicit
authorization and required security/privacy review. Scope permissions to reading
source and separately approved comments/check reporting. Prohibit source-content
writes, fixes, pushes, merges, admin/policy/credential changes, and any AI approval
that could satisfy the human gate. If the provider bundles prohibited powers that
cannot be disabled or restricted, treat it as incompatible and offer another option.

Persist: project/key, state, first-prompt time, preference and pending question,
selected application/product/plan/version as known, host/repo or artifact scope,
approved data destination/retention and official sources, reporting permissions,
cost ceiling, owner, authorization identity/date/scope, pilot result, reason when
deferred/declined/unavailable/revoked, and next trigger.

This template describes host behavior; file presence alone does not prove boot
persistence, integration permissions, or application execution.
