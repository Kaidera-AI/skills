---
name: model-fitness
version: "0.1.0"
description: |
  Review which model each project worker runs, gather public and tester
  feedback on those models, and recommend the best model per task. Use when
  auditing the roster, a worker underperforms, a new model ships, or asked
  whether a model suits a job.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:web_search
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/turnkey-projects
    path: projects/marketing-os/source/skills/model-fitness
    content_sha256: ca0ae712a2943a117e4472f06048255284585252a2523fca4c46b78ebf03ef27

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-19
tags: [development, model-selection, benchmarking, audit, fleet-supervision]
attribution_notes: Independently authored Kaidera Marketing OS workflow, genericized from Marlow-Platform's own model-fitness skill during the E023 harvest (f07dfdc7 item 3). Platform-agnostic methodology - the platform-specific audit tooling it was originally developed against is explicitly not carried with this skill.

safety_constraints:
  - Read-only against live platform state. Recommend; do not re-bind a worker's model or harness - that assignment is the owner's call, report and offer to apply, never silently overwrite config.
  - Registering or reactivating an agent needs the owner's express, recorded approval.
  - If the admin surface referenced by a host is access-gated, read live state only through its own approved read path; never write its database directly.
  - Date every public/tester-feedback claim used in a recommendation - model behaviour drifts under a stable name, and an undated claim is not actionable evidence.
---

# Model fitness — pick the right model for each worker's actual job

Two halves, in this order. **Never skip half one.** A worker that looks
badly-modelled is usually mis-bound, pinned in code, or not running at all —
no amount of model research fixes that.

1. **What is actually bound and running** — live platform state
2. **What the public and testers say about those models** — web research
3. **Recommend per task** — evidence mapped to the job, with confidence

## Half one — establish live truth

Read-only. Establish, per worker: the effective harness/model/reasoning
level, whether it ever actually spawns, and the traps below.
Origin note: this methodology was developed against a specific platform's own
audit scripts, tightly coupled to that platform's internals and not carried
with this skill — check whether an equivalent read-only report already
exists for the current engine before writing one by hand.

### Multiple surfaces can claim to name the model. Not all are live

A pack's own runtime/config declaration is frequently a **standalone
fallback**, not the routing authority — the platform's own live agent
registry or config-override store is what actually routes a call, and a
config save does not always propagate to every surface that displays it.
Establish which surface is authoritative for **this** deployment before
trusting any single file or table, and prefer live introspection over a
static file.

### Traps to check for — each one silently swallows config

- **REASONING-CLAMP** — a runtime lane may accept a reasoning level it does
  not actually support, storing and displaying it, then silently clamping it
  at call time. To genuinely get a higher level, move the worker to a lane
  that has one — do not just relabel the same lane.
- **PINNED-IN-CODE** — the entrypoint hardcodes a model and ignores the
  platform's config entirely (e.g. shelling out to a CLI with a fixed
  `--model`). Retune the script, not the config. Detecting this needs markers
  for **CLI shell-outs**, not just SDK imports: grepping an SDK package name
  returns a clean zero on a script that shells out instead, which reads
  exactly like "deterministic" and is not.
- **INERT-MODEL** — pure-code entrypoint, no LLM call at all. Belongs on a
  `deterministic` designation, not an LLM lane.
- **NEVER-DISPATCHED** — registered, auto-dispatch on, nothing ever spawns
  it. An empty run history means UNKNOWN, not zero.
- **MODEL-NOT-IN-CATALOG** — the configured model id fails at call time.

### Before blaming the model, clear the gate

A dirty tree, stale lock, or disabled autonomy switch can make a platform
refuse to spawn **every** autonomous worker fleet-wide — indistinguishable
from broken workers. Check dispatch preconditions (tree cleanliness,
autonomy/auto-dispatch/autostart switches) before blaming any one model.

## Half two — public and tester feedback

Research the models half one proved are live. Weigh sources in this order:

1. **Independent measured benchmarks** — cross-provider quality/speed/price,
   coding benchmarks (e.g. Aider polyglot, SWE-bench), creative/EQ benchmarks
   for copy. Numbers beat vibes.
2. **Crowd preference** — arena-style head-to-head leaderboards; weaker for a
   specific task, prefer style-controlled ranks over raw votes.
3. **Practitioner reports** — forums, engineering blogs, release threads —
   the only place to learn long-run instability, refusal behaviour,
   tool-calling reliability, context degradation.
4. **Provider claims** — model cards, release notes; treat capability claims
   as marketing.

Rules: date every claim (behaviour drifts under a stable name); never rely on
one benchmark; a `:preview`/`-preview` tag is a stability risk for any
unattended worker; a recommendation is only actionable if the model is in
that harness's live catalog for this deployment.

## Half three — map evidence to the job

Score each worker on what its task actually demands, not a leaderboard rank:

| Task shape | What matters | Roster examples |
|---|---|---|
| Long-horizon judgement, writing, tool orchestration | Reasoning depth, instruction adherence, long context | an orchestrator/lead role |
| Creative direction, brand + design QA | Voice control, aesthetic judgement, refusal to hype | a brand-QA worker |
| Fleet supervision, drift detection, escalation | Consistency over cleverness; avoid preview builds | an auditor worker |
| Brand-voice gate before publishing | Precision, low false-negative rate — blocks public posts | a pre-publish verifier |
| Research sweep and summarisation | Breadth, recency handling, source fidelity | a research/scout worker |
| Structured classification | Cheap and consistent; a small model is correct here | a data-curation/ingest worker |
| Graphics and motion orchestration | Tool-calling; check the render path | a design/motion worker |

Two common failure asymmetries: is the highest-consequence step (publish
gate, dispatch routing) running the smallest model, and is a premium tier
attached to a worker that never dispatches?

## Output

A table of: worker · task · model now · recommendation · evidence (dated,
2+ sources) · confidence · what changes if adopted. Then the flagged
misconfigurations from half one — usually the real wins.

## Guardrails

- **Recommend; do not re-bind.** Model/harness assignment is the owner's
  call. Report and offer to apply — never silently overwrite their config.
- Registering or reactivating an agent needs the owner's express, recorded
  approval.
- If the admin surface is access-gated here, read live state through its own
  approved read path; never write its database directly.
