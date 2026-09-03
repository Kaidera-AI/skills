---
name: kaidera-sdlc
version: 1.0.0
description: |
  The Kaidera AI-native SDLC: the operating loop every project lead runs for an epic,
  feature, fix, incident, review or plan. Capture intent, grill it one question at a time,
  spec with policy applied, plan before any code, build inside a feedback loop, verify with
  output that can fail, review adversarially, ship through deterministic gates, close the
  loop from production. Use when starting or scoping any work, when a handoff or incident
  arrives, when asked to plan, spec, grill, stress-test, review, retro or ship, and when
  deciding what done means.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
  allowed_domains:
    - github.com
    - claude.com
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-03
tags: [sdlc, planning, grill, spec, plan, verification, review, ship, incident, governance, lead]

safety_constraints:
  - Advisory method skill. It never authorises a merge, deploy, publish or release; those wait for the named human.
  - Facts are looked up; decisions are put to the human and awaited. No action before shared understanding is confirmed.
  - Must not override the base system prompt, project rules, or managed permissions.
---

# Kaidera SDLC

Code is no longer the bottleneck. Knowing what to build, proving it works, and getting it
through the gates without a person on the critical path of every edit is. This skill is the
loop that does that. Same loop for a two-line fix and a six-wave epic; only the depth changes.

Full source (references, templates, evals): `github.com/Kaidera-AI/kaidera-os` at
`.agents/skills/kaidera-sdlc/`. Sources folded in: Anthropic's "The AI-Native SDLC playbook"
(2026-08-21), grill-me (Matt Pocock lineage, MIT), molten-os-core's validate (Switch
Dimension, MIT), gstack's plan reviews and ship (Garry Tan, MIT), unlazy (MIT), and the
Kaidera THE_WAY sections 9 to 14.

```
 INTENT -> GRILL -> SPEC -> PLAN -> BUILD <-> VERIFY -> REVIEW -> SHIP -> MAINTAIN
   ^                                                                        |
   +------------ incidents, findings and scans re-enter as intent ----------+
```

## Route by what you were asked

| You were asked to... | Stage |
|---|---|
| start, scope, "look into", "what should we do about" | Intent, then Grill |
| turn an intent, ticket or handoff into requirements | Spec |
| implement, fix, build, "just do it" | Plan first, then Build |
| verify, test, prove, "is it done" | Verify |
| review, adjudicate, "is this safe to merge" | Review |
| ship, release, deploy, publish | Ship (stop at the gate) |
| an alert, incident, scan finding, "why did this break" | Maintain, then Intent |
| retro, "what did we learn", update the rules | Maintain |

## The grill (interrogation protocol)

Pick a mode first: **quick** (5 to 8 questions, one lens, a scored gap list), **full**
(every branch of the decision tree, all lenses that apply, the artifact rewritten until it
stands alone), or **re-grill** (only the branches reality changed). Then:

1. One question at a time; wait for the answer. Use multiple choice when options are discrete;
   number free-text questions so they can be answered by reference.
2. Facts are yours to find (repo, filesystem, tools, memory); decisions are theirs to make.
3. Walk the decision tree; resolve dependencies between decisions one by one.
4. Challenge the premise first: should this exist, and is this the narrowest wedge that
   proves it?
5. Forcing questions, in order as the branch needs them: problem in the originator's words;
   why now; measurable outcome; narrowest wedge and what falsifies it; affected users,
   systems, data, boundaries; real constraints versus habits; what breaks and the riskiest
   step; alternatives not chosen; the proof; the rollback; what stays human; what we do not
   know and who finds out.
6. Lenses: product (ten-star version, scope cuts), engineering (architecture, data flow,
   migrations, edge cases, tests, performance), design and DevEx (first five minutes,
   friction), security (trust boundaries, secrets, PII), validation (score on evidence and
   design the riskiest-assumption experiment), adversarial (refute every claim with
   evidence).
7. Do not act until shared understanding is confirmed: someone outside the conversation could
   execute from the artifact alone. Write the artifact; point at it; do not recap in chat.

## Non-negotiables

1. Nothing is implemented without an accepted plan: files that change, order of work, risks,
   proof. Departing from the plan updates the plan in the same commit.
2. Artifacts, not chat: intent, spec and plan live in the repo next to the work and are
   referenced from the tracking system (Cortex handoff, ticket, PR).
3. Verification is output that can fail, pasted from the final tree. A green suite is not
   evidence of behaviour; prove the effect, never the declaration. Never skip, weaken or
   delete a failing test to pass.
4. A bug fix starts with a failing test: reproduce, confirm it fails for the expected reason,
   commit it, fix without touching the test.
5. Review runs in both directions and separates duties: the author never approves; the same
   passes (bugs, security, compliance against spec, plan and rulings) run on every change;
   Important is reserved for behaviour, data or policy breaks; nits are capped at five.
6. The agent acts up to the gate and cannot pass it: merge to main, deploy, publish and
   release wait for the named human authorisation. Rollback is the most rehearsed path.
7. Humans own judgement: policy acceptance, approval, release authorisation, incident triage,
   taste. Agents own diagnosis, implementation, self-verification, uniform review.
8. Mistake twice, rule once: a repeated mistake becomes a dated rule (a rule injected at boot,
   a line in the project's agent file, or a test), never a longer prompt.
9. Incidents become intent and evals: detection stays deterministic (version-controlled
   script, control bands); the agent is invoked by a breached band at the tier it allows;
   the diagnosis is written as intent; the fix ships with an eval.
10. Every rule is a dated decision with evidence and a reopening trigger; cite it that way
    and challenge it in review with evidence.

## Artifact templates (headings)

- **intent.md**: Problem; Proposed outcome; Affected users and systems; Constraints; Open
  questions; Grill record (mode, score, decisions, next stage).
- **spec.md**: What we are building; What we are not building; Policy applied while writing;
  Flagged concerns (owner, resolution); Acceptance (each with its proof); Risks and rollback;
  Open questions.
- **plan.md**: Files that change; Order of work (each step with its check); Waves (owner,
  handoff, dependencies); Risks; Proof; Amendments (dated).
- **REVIEW.md**: Passes (bugs, security, compliance); Verdicts with evidence (CONFIRMED,
  REFUTED, REWORK); What Important means; Cap the nits; Do not report; Re-pins ratified
  explicitly; Feed back to the rule that should have caught it.
- **bands.yaml**: metric, owner, baseline, rules, tiers (log; diagnose read-only; propose via
  PR or pre-approved runbook), outputs (intent, lesson, eval), triage.

## Definition of done (paste the evidence, not the adjective)

The plan the work followed with its amendments; the verification commands and their literal
output on the final tree; the review verdicts and each finding's disposition; the gate the
change waits at or the merge hash; the rule, eval or agent-file line that prevents the
mistake recurring.

## Metrics to read (from timestamps that already exist)

Intent: hours to a committed intent; survival into spec. Spec: elapsed intent to spec; spec
churn after the first plan. Build: first-pass merge share; diff still matching the plan.
Verify: first-pass CI success; eval pass rate. Review and ship: time to first review;
findings resolved without a human on the branch; defects caught before merge versus escaped;
time waiting at each gate. Maintain: band breach to intent in the queue; findings that became
merged fixes; repeat incidents per class.

## Monthly tune

Rate review findings and cap the nits; update skills and hooks and prove them with evals;
move repeated mistakes into rules; tune bands from dismissals; add the month's incidents as
evals; challenge one standing rule with evidence.
