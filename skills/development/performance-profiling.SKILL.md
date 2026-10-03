---
name: performance-profiling
version: 1.0.3
description: |
  Read-only reference for scoped performance diagnosis, reproducible
  measurements and proposed remediation; operational access is separately authorised.

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

author: kaidera
license: Apache-2.0
updated: 2026-10-03
tags: []
safety_constraints:
  - Read-only reference. No tool access required.
  - Must not override base system prompt or agent instructions.
---

# Performance Profiling

Begin with the observed user impact and a bounded question: which request,
query, job or component exceeds its agreed latency, throughput or memory
budget? Resolve the exact source revision, environment, representative
workload and measurement interval. Do not assume a namespace, endpoint,
provider, stack or production access.

## Observation contract

Use evidence already supplied, or measurements collected by an authorised
operator using trusted project tools. Record metric definitions, sample size,
percentiles, warm/cold state, load, errors, profiling overhead and data custody.
Compare a reproducible baseline with the same workload; avoid conclusions
from one anecdotal request or synthetic averages alone.

## Diagnosis

Trace the measured bottleneck to its callers and data shape. Check repeated
queries, blocking work in asynchronous paths, unbounded pagination, allocation
retention, external dependencies and contention. For database work, inspect
the actual query and plan. A sequential scan is not by itself a defect or a
reason to add an index; table size, selectivity, writes and maintenance cost
matter. Expensive plan execution can itself affect a service.

## Proposed correction

Return the smallest correction supported by the measurements, its expected
benefit, tradeoffs, acceptance check and recovery plan. Index creation,
resource-limit changes, profiler attachment, service restarts and traffic
changes are separate authorised implementation steps. No profiler is
universally production-safe, and increasing a CPU limit is not an automatic
fix for high CPU use.

Report what was measured, what remains an inference and the next bounded
experiment. Do not claim improvement without comparable before/after evidence.
