---
name: kaidera-sdlc
description: "The Kaidera AI-native SDLC: the operating loop every lead runs for an epic, feature, fix, incident, review or plan. Capture intent, grill it one question at a time, spec with policy applied, plan before any code, build inside a feedback loop, verify with output that can fail, review adversarially, ship through deterministic gates, close the loop from production. Use when starting or scoping any work, when a handoff or incident arrives, when asked to plan, spec, grill, interview, stress-test, review, retro or ship, and when deciding what done means."
license: Apache-2.0
# policy skill (K2 R1, 2026-09-04): rides every worker boot regardless of ranking
always_load: true
metadata:
  version: 1.3.0
  authority: "CTO standing order 2026-09-03; design docs/design/31-ai-native-sdlc-skill.md; THE_WAY sections 9-14; rework after adversarial review 2026-09-04 (gate records, portable roles, risk beats urgency)"
  sources: "Anthropic, The AI-Native SDLC playbook (2026-08-21); grill-me (Matt Pocock lineage, MIT); molten-os-core molten-validate (Switch Dimension, MIT); gstack plan reviews and ship (Garry Tan, MIT); unlazy (Leonxlnx, MIT); Kaidera THE_WAY_OF_DEVELOPMENT; 1.2.0 ideas from michaelshimeles/skills, unslop (L. Tan, MIT), greploop (Greptile, MIT), before-and-after (vercel-labs): see references/attribution.md"
  applies_to: [lead, cpo, pm, orchestrator, full-stack-developer, knowledge-keeper]
  bias: "artifacts before action; one question at a time; evidence over reports; humans own judgement; gates are deterministic; every rule is a dated decision; roles are portable, occupants are records"
  conflicts_with: []
---

# Kaidera SDLC

Code is no longer the bottleneck. The bottleneck is knowing what to build, proving it works,
and getting it through the gates without a person on the critical path of every edit. This
skill is the loop that does that. It is the same loop for a two-line fix and a six-wave epic;
only the depth changes.

```
 INTENT ──> GRILL ──> SPEC ──> PLAN ──> BUILD <──> VERIFY ──> REVIEW ──> SHIP ──> MAINTAIN
   ^                                                                                 |
   └──────────────── incidents, findings and scans re-enter as intent ───────────────┘
```

## Route by what you were asked

| You were asked to... | Stage | Read |
|---|---|---|
| start, scope, "look into", "what should we do about" | Intent + Grill | `references/grill.md`, `templates/intent.md` |
| turn an intent, ticket or handoff into requirements | Spec | `references/stages.md` §2, `templates/spec.md` |
| implement, fix, build, "just do it" | Plan first, then Build | `references/stages.md` §3, `templates/plan.md` |
| verify, test, prove, "is it done" | Verify | `references/stages.md` §4 |
| review, adjudicate, second-pass, "is this safe to merge" | Review | `references/stages.md` §5, `templates/REVIEW.md` |
| ship, release, deploy, publish | Ship | `references/stages.md` §5, `references/governance.md` |
| an alert, incident, scan finding, "why did this break" | Maintain, then Intent | `references/stages.md` §6, `templates/bands.yaml` |
| retro, "what did we learn", update the rules | Maintain | `references/stages.md` §6, `references/metrics.md` |
| work alongside other agents; dispatch or return a handoff | Plan and build | `references/team.md` |
| write or restructure code | Plan and build | `references/code-quality.md` |
| prove a change; write evidence into a return | Verify | `references/evidence.md` |
| write anything a person will read | all stages | `references/writing.md` |
| review a change, set up review, act as the reviewer | Review | `references/code-review.md` |
| a human must decide: plan approval, merge to main, deploy, publish, release, an irreversible step | Ship | `references/human-gates.md` |
| explain the method to a person, set up a project, expectations of the team | all stages | `references/human-guide.md` |

Load only the reference the stage needs. Do not read every file at once.

## Non-negotiables (the short list every lead is born with)

1. **Nothing is implemented without an accepted plan.** A plan names the files that change,
   the order of work, the risks and the proof. Someone unfamiliar with the conversation could
   implement from it alone. Departing from the plan means updating the plan in the same commit.
2. **Grill before you build.** One question at a time. Look facts up yourself; put decisions to
   the human. Walk every branch of the decision tree. Stop when there is shared understanding,
   not when the questions run out. Risk beats urgency: incidents, destructive, security, money,
   customer-data, migration, fold and cross-project work force the full grill. (`references/grill.md`)
3. **Artifacts, not chat.** Intent, spec and plan live in the repo next to the epic and are
   referenced from the Cortex handoff. Reports go into the artifact; chat points at it.
4. **Verification is output that can fail.** Done means the command ran and its literal output
   is in the report. A green suite is not evidence of behaviour; prove the effect, not the
   declaration. Never skip, weaken or delete a failing test to pass. Where existing behaviour
   changes, show it before and after, and name the commit or host tested
   (`references/evidence.md`).
5. **A bug fix starts with a failing test.** Reproduce as a test, confirm it fails for the
   expected reason, commit it, then fix without touching the test.
6. **Review runs in both directions and separates duties.** The author never approves. The
   reviewer's adversarial review is bound to a pre-fold SHA; the adjudicator diffs against
   that SHA; the integration custodian folds and reruns the gates on the merged SHA; the
   reviewer never merges. Every gate leaves an append-only gate record
   (`references/governance.md`). Findings are ranked; nits are capped; policy findings feed
   back into rules. Review runs in bounded rounds: the author proposes a disposition for each
   finding, only the reviewer closes a fix (at a new `reviewed_sha`), everything else stays
   open until the adjudicator rules, and at the cap the open list goes to the adjudicator
   (`templates/REVIEW.md`, "Rounds").
7. **The agent acts up to the gate and cannot pass it.** Merge to main, deploy, publish and
   release wait for the release authority's go (a human, never an agent; for Kaidera OS the
   CTO, by occupancy record). Rollback is the most rehearsed path. The human tests the running
   thing at `merged_sha` and decides on the gate packet (evidence pair, review verdict, record);
   reading the diff is the reviewer's and the adjudicator's job (2026-09-18; `references/human-gates.md`).
8. **Humans own judgement.** Policy acceptance, approval, release authorisation, incident
   triage, taste. Agents own diagnosis, implementation, self-verification, uniform review.
9. **Mistake twice, rule once.** A repeated mistake becomes a dated rule (Cortex rule,
   CLAUDE.md, or a fitness test), never a longer prompt.
10. **Incidents become intent and evals.** Detection stays deterministic; the agent is invoked
    by a breached band; the diagnosis is written as intent and the fix ships with an eval.
11. **Every rule is a dated decision** with its evidence and its reopening trigger. Cite it
    that way; challenge it in review with evidence (THE_WAY §13).
12. **Destructive operations follow the checklist** (THE_WAY §14): adjudications expire,
    commits with pathspecs, proofs that can fail, one mutation per command with full output.
13. **The team does not collide** (2026-09-18; scar: handoffs written during a database repair
    window were lost, `Program/KAI_ADJUDICATION_2026-09-18.md` section 4; reopens if a project
    runs a single agent). Look for
    other agents' in-flight work before the first edit; never touch a tree you do not own; a
    worktree does not isolate ports, databases or the coordination store
    (`references/team.md`).

Roles are portable: originator, lead, reviewer, adjudicator, integration custodian, release
authority (human). Current occupants, their authorisation and its expiry are Cortex role
occupancy records (`references/governance.md`, "Role occupancy records"), never lines in
this skill; a document that names a person for a role cites a dated decision, it does not
assign the role.

## Where the artifacts live in Kaidera

| Playbook artifact | Kaidera home | Owner |
|---|---|---|
| `intent.md` | `Program/<release>/<epic>/intent/<slug>.md` or the handoff summary for small work | originator + lead |
| `spec.md` | `Program/<release>/<epic>/EPIC_SPEC.md` (or `spec/<slug>.md`) | lead (CPO/PM review) |
| `plan.md` | `Program/<release>/<epic>/PLAN.md`; waves are Cortex epic increments; each wave a handoff | lead |
| feedback loop | fitness tests, `qa.sh`, real-engine gates, screenshot/browse checks | every worker |
| `REVIEW.md` | `templates/REVIEW.md` applied by the reviewer's adversarial review; findings in the handoff return | reviewer; the adjudicator disposes |
| gate records | `Program/<release>/gates/<gate>-<decision_id>.json`, append-only, SHA-bound (`references/governance.md`) | the gate's authorizer |
| `CLAUDE.md` | generated pointer plus Cortex rules injected at boot; project knowledge in `cortex.md` and THE_WAY | Cortex |
| skills | `.agents/skills/` (KOS), Kaidera skills marketplace | leads, policy owners |
| hooks and gates | fitness tests, `scripts/dev/verify-change-scope.sh`, `safe-restore.sh`, the go, branch protection | integration custodian, release authority |
| lessons file | Cortex decisions and lessons (`cortex-log <agent> decision|lesson`) | everyone |
| `bands.yaml` | `templates/bands.yaml` wired to the beat and doctor | service owner |
| evals | `evals/` under the skill and per-epic regression tests | reviewer, incident owner |

## Definition of done (paste the evidence, not the adjective)

- The plan the work followed, with any in-flight amendments.
- The verification commands and their literal output, run on the final tree.
- The review verdicts and how each finding was dispositioned.
- The gate record the change is waiting at (its decision_id and SHA), or the merge record
  with the gates rerun on the merged SHA.
- The rule, eval or CLAUDE.md line that keeps this mistake from recurring, if there was one.

## Progress checklist (copy into the handoff return)

- [ ] Intent captured and committed (or handoff summary is the intent for small work)
- [ ] Grilled to shared understanding; open questions listed, not guessed; full mode where risk forces it
- [ ] Spec written with policy applied; flagged concerns resolved with their owners
- [ ] Plan accepted before the first code change; pre-edit evidence pasted, scope check included; worktree per agent, one concern per commit
- [ ] Feedback loop closed: verification command exits 0 on the final tree, output pasted; before and after shown where behaviour changed, tested commit or host named
- [ ] Review rounds within the cap; adversarial review bound to a pre-fold SHA; adjudication diffed against it; findings dispositioned; re-pins and re-baselines ratified or refused
- [ ] Gates rerun on the merged SHA; gate records written, never edited; nothing merged to main, deployed or published before the go
- [ ] Lessons and rules recorded in Cortex; evals added for incidents and refuted claims

## References

- `references/team.md`, `code-quality.md`, `evidence.md`, `writing.md`: working together, structure, proof, plain writing (1.2.0; credits in `references/attribution.md`)
- `references/code-review.md`, `human-gates.md`, `human-guide.md`: two reviewers and one report; what a human decides and what reaches them; the guide for the people on the project (1.3.0)
- `references/grill.md`: the interrogation protocol (quick, full, re-grill) and its lenses
- `references/stages.md`: the six stages with Kaidera practice, roles, gates, SOP and skill map
- `references/metrics.md`: leading and lagging measures per stage, with our data sources
- `references/governance.md`: what stays human, gates, gate records, managed-settings baseline
- `references/distribution.md`: how this skill is installed, bound and kept current
- `templates/`: intent.md, spec.md, plan.md, REVIEW.md, bands.yaml
- `evals/`: the cases that prove the skill still does the job after a model or prompt change
