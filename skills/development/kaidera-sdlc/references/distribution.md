# Distribution: how every lead is born with this skill

One source, three projections, one rule.

## Source of truth

`.agents/skills/kaidera-sdlc/` in the Kaidera OS canonical branch (directory form:
`SKILL.md` plus `references/`, `templates/`, `evals/`). Changes go through the same loop
this skill describes: intent, plan, review bound to a pre-fold SHA, evals green, merge, gates
rerun on the merged SHA, then the go. The marketplace copy is a projection of this source,
regenerated when the source changes; a projection that says less than the source is drift
and a review finding (`templates/REVIEW.md`).

## Projections

Occupants of the roles in the last column are Cortex role occupancy records
(`governance.md`, "Role occupancy records"), not lines here.

| Surface | Mechanism | Who keeps it current |
|---|---|---|
| Kaidera OS (every project on a KOS Cortex) | `cortex-skill install .agents/skills/kaidera-sdlc --scope global` registers it under the shared channel; `cortex-skill bind kaidera-sdlc --to <role> --kind role` for every role in the roster; new projects created from a team template inherit the global skill and the role bindings | the canonical owner (the integration custodian for the KOS source) |
| Kaidera skills marketplace (`github.com/Kaidera-AI/skills`) | `skills/development/kaidera-sdlc.SKILL.md` (flat marketplace format with the `kaidera:` manifest); validated, scanned, published to `.claude-plugin/marketplace.json` | the canonical owner regenerates; the reviewer reviews the projection; the release authority publishes |
| Kaidera platform and client projects | Skills Management adds the marketplace repo, approves `kaidera-sdlc`, and binds it by default to every lead persona in every project template; client repos may also `npx skills add Kaidera-AI/skills --skill kaidera-sdlc` | the platform skills owner; each project lead |
| Other harnesses (OpenKai, omp, claude-code, codex) | the same directory is a standard agent skill; the generated pointer (`AGENTS.md`, `CLAUDE.md`) names it so a fresh session knows it exists before Cortex boot | the harness lane owner |

## The always-on part

Skills are selected per task by relevance, so the skill body is loaded when the work calls
for it. The part that must always hold is a Cortex rule (`sdlc-loop`, injected at every
boot): "no implementation without an accepted plan; verification is output that can fail;
the agent acts up to the gate; incidents re-enter as intent; the `kaidera-sdlc` skill is the
method." The rule is short; the skill is the depth.

## Keeping it current

- Version in the frontmatter; a CHANGELOG line per change; the marketplace `updated` date.
- Evals under `evals/` run on every change to the skill, the rules or the harness pointer.
- When the playbook, a ruling, or a lesson changes the loop, the change lands here first
  and is projected outward, never edited in a projection.
- Mistake twice, rule once: a lesson that keeps recurring across projects becomes a line in
  the non-negotiables and a rule, with its date and evidence.
