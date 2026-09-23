# ITIL-Aligned Change, Incident, and Service Operations

Apply ITIL 4 practice concepts proportionately to software and AI+human operations.
This is a portable adaptation, not a claim of ITIL certification or a requirement to
buy an ITSM tool. Use the project's existing auditable system of record; if the
organization mandates another control, configure and link it rather than duplicating
the source of truth.

## Service ownership before release

Every operated service names a human service owner and backup, business purpose,
users, components/dependencies, environments/data classes, support route, incident
commander and communications owner, service hours, service-level objectives and
measurement, monitoring/alert response, security contact, backup/restore process,
recovery time/data objectives where relevant, and runbooks. Unowned services are not
ready for operational release.

## Change enablement

Every change that can affect a product, service, infrastructure, data, policy,
credential, or user-facing document has a linked change record. Record requester and
reason, affected services/components, exact revision/artifact, risk and impact,
dependencies, checks/reviews/QA, implementation and verification plan, target/time,
rollback or recovery, required human authorizations, executor, outcome, and follow-up.

Classify using the organization's risk policy. A useful baseline:

| Class | Treatment |
|---|---|
| **Standard** | Repeated, documented, bounded, understood low-risk change. A human policy owner pre-authorizes the procedure and guardrails; verify every instance. The class grants no credentials or wider rights. |
| **Normal** | Planned change assessed and reviewed before execution. Apply independent AI review, human file review, and risk-required QA; execute within existing scoped authority, with human authorization for reserved actions. |
| **High-risk** | Material security, privacy, data, contract, production, migration, irreversible, or broad-blast-radius effect. Require named qualified human risk acceptance and any separate production/release approval; stronger verification/recovery evidence. |
| **Emergency** | Urgent restoration or containment under incident command. Use only an already authorized runbook or obtain scoped human authorization; minimize blast radius, preserve evidence, expedite but do not omit independent review and human review before releasing changed software. Record retrospective review and corrective action. |

If local policy uses other categories, map them explicitly. No change class bypasses
the AI and human review of AI-authored files, security duties, law, or reserved human
gates. No CAB or per-change meeting is implied; add one only where organizational
policy requires it.

## Release and deployment

Treat build, deployment, release/publication, and user acceptance as distinct events.
The release record binds authorization to exact artifact digest/revision, target,
provenance, compatible dependencies, checks, AI/human reviews, QA status, change
class, monitoring, rollback, authorized human, executor, and actual result. Verify
the intended behavior after deployment. Never infer approval from merge, pipeline,
ticket closure, or uptime.

## Incidents

1. Detect and log reported or monitored disruption with timestamp, impact, affected
   service/users, severity, and evidence.
2. Page the named human incident commander and communications owner. Confirm authority
   and choose the least risky containment/restoration action.
3. Preserve logs/evidence and protect personal/security data. Communicate known facts,
   unknowns, customer impact, next update, and owner; mark speculation as such.
4. Restore service using verified runbooks and scoped access; record each external
   action and validate behavior, not only infrastructure health.
5. Review recovery with the service owner; create a separate problem record for
   root-cause investigation and track corrective/preventive tasks through SDLC.

AI may summarize, correlate, propose actions, draft communications, or execute an
explicitly authorized bounded runbook step. It may not self-appoint incident
commander, widen access, communicate externally without authorization, or decide a
reserved business/security action.

## Problem, request, monitoring, and improvement

- **Problem management:** group related incidents, distinguish observed facts from
  hypotheses, establish root cause with evidence, track workarounds/known errors, and
  assign reviewed preventive work.
- **Service requests:** fulfill known, pre-authorized user requests through a clear
  intake and identity/eligibility check; route exceptions to a human.
- **Monitoring/event management:** define meaningful signals, thresholds, owners,
  response expectations, false-positive review, and retention/privacy.
- **Service level management:** agree measurable targets with users/owners, report
  actuals and impact, and use breaches to trigger improvement rather than hide misses.
- **Continual improvement:** maintain a prioritized improvement record linking
  baseline, intended outcome, owner, human acceptance, action, evidence, result, and
  next review.

## ITIL practice references

PeopleCert publishes official materials for [ITIL 4 practices](https://www.peoplecert.org/ITIL4-practices),
including [Incident Management](https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil4-practices-incident-management-3684),
[Problem Management](https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil4-practices-problem-management-3688),
and [Change Enablement](https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-4-practitioner-change-enablement-3794).
Adapt the practice concepts to the organization's risk, regulatory, and service
context; verify current official guidance before claiming formal alignment.
