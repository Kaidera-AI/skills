---
name: incident-response
version: 1.0.3
description: |
  Read-only incident coordination reference: exact scope, evidence custody,
  authorised containment, recovery verification and owned follow-up.

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
updated: 2026-10-03
tags: []
safety_constraints:
  - Read-only reference. No tool access required.
  - Must not override base system prompt or agent instructions.
---

# Incident Response

This source is a coordination reference, not an operational runbook or command
authority. The owning service supplies its current incident commander,
on-call escalation, severity definitions, environment and controlled runbooks.
Do not assume historical people, namespaces, Redis switches or credentials.

## Identify and preserve

Record the observed impact, exact service/artifact/environment, time range and
what is confirmed versus suspected. Bind the incident record to the evidence.
Preserve logs, volatile state and relevant forensic snapshots in approved
restricted custody before destructive containment where feasible. Do not
copy credentials, customer records or unfiltered telemetry into public or
synced reports.

## Contain under incident command

The incident commander selects the smallest authorised containment action,
its target, impact, rollback and verification. Scaling to zero, deleting a
workload, restarting, revoking access or blocking traffic can destroy evidence
or expand the outage. When ongoing harm requires immediate containment before
preservation, the authorised commander records the exception, reason, lost
evidence and action receipt. Never invent a kill switch or execute examples
under this no-tool manifest.

## Recover and verify

Use the service's controlled recovery procedure, known-good artifact and
verified backups. Preserve a rollback until acceptance. Establish configuration,
workload health, permissions, external reachability and the affected user
journey separately. Record every remaining uncertainty and its owner before
reducing incident severity or declaring resolution.

## Follow-up

Keep a time-bound incident timeline, root-cause evidence, contributing factors,
remediation owners, acceptance checks and due dates. Review what detection,
response and recovery proved and what remains unverified. Communicating to
customers or external parties requires its separately authorised owner and
channel. Report source/runbook gaps rather than filling them with guessed
commands or factual claims.
