# Architecture, Design, and Planning

Architecture and planning are collaborative AI+human work. AI can research, compare,
model, and draft; the accountable human accepts product boundaries, risk posture,
costly-to-reverse choices, and the plan before implementation starts.

## Design record

For a material capability, record:

- context/problem, users, constraints, requirements and exclusions;
- system boundary, actors, dependencies, data stores/flows, trust boundaries and
  external interfaces;
- relevant context/container/component diagrams (use a smaller view when enough);
- API/event/schema contracts, versioning and consumer compatibility;
- alternatives considered, trade-offs, selected option, rejected options, assumptions,
  consequences, owner, status, and reopening trigger;
- security/threat analysis, privacy/data classification/retention, accessibility,
  reliability, performance, observability, operability, portability and cost as
  applicable;
- migration, rollout, rollback/recovery, and support implications.

Use C4's context/container/component/code views as useful communication levels, not
as a requirement to draw every level. Keep decisions concise and link them to
requirements, work, tests, and change records. A diagram is not a substitute for
contracts or rationale.

## Planning contract

The accepted plan identifies scope, architecture dependencies, interfaces and owners,
delivery sequence, bounded tasks, parallelism constraints, people/profile capacity,
tool/model choice and budget, data/workspace boundaries, risks, verification matrix,
review/QA assignments, change classes, human gates, release strategy, operations and
rollback. Include acceptance measures, assumptions, decisions required, and what is
explicitly deferred.

Each task has one reviewable output or evidence question; exact inputs and permitted
surface; observable positive and negative acceptance; dependencies; required
verification; responsible author, independent AI reviewer and human reviewer; QA
owner if required; time/cost/retry limits; stop/consult conditions; handback contract.
Do not dispatch work that is too broad to review or that hides interface decisions.

## Review and approval

The AI author checks sources, evaluates at least one viable alternative where the
choice is material, identifies uncertainty, and cites supporting evidence. A
different AI profile can challenge consistency/risk, but its analysis is advisory.
The accountable human reviews the artifact and its linked evidence, records accepted
scope and decisions, and approves the plan. No implementation begins before this
record exists.

Material change to assumptions, architecture, interface, data, threat model, scope,
budget, or risk invalidates dependent plan/acceptance; update the record and return to
the right human gate. Do not smuggle architectural changes through implementation.

## Suggested decision fields

`id · title · status · context · constraints · decision · alternatives · consequences
· evidence · affected contracts · risk/security/privacy · owner · human decision maker
· date/revision · implementation tasks · validation · supersedes · revisit trigger`.

Reference: the [C4 model](https://c4model.com/) and its
[diagram guidance](https://c4model.com/diagrams). Use a decision-record format suited
to the project; no repository or specific notation is mandatory.
