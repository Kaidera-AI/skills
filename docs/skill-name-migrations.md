# Skill naming and migration

Names describe the job. Prefer a short, stable, lowercase hyphenated name;
use a family prefix only where it identifies a real shared core. Do not name
skills after ordinal IDs, dates, versions or arbitrary superlatives. Keep
existing descriptive names when the trigger and purpose still match.

| Previous catalogue name | Candidate canonical name | Reason |
|---|---|---|
| open-code-review | evidence-code-review | Removes the identity collision with Alibaba's distinct delegate and describes its evidence contract |
| ultrareview | codebase-audit | States the whole-repository scope and separates it from bounded-change review |
| unlazy | completion-evidence | States the outcome and avoids a personality label |
| proposed jev-find | proposed jev-repository-search | States the bounded repository-search job |
| proposed jev-ui-check | proposed jev-test-ui-check | Makes the TEST-only environment boundary explicit |

The first three are source-candidate renames. This repository's manifests,
local links, catalogue, static routing fixtures and generated marketplace use
the candidate names together. Historical review records retain their original
identifiers. The two Jev skills remain plan proposals awaiting their review.

Active Cortex identities, registration, version/body pins, dependencies,
bindings, emitted boot pointers and project-level invocation records require
one separately approved migration. Inventory consumers, freeze their current
pins, test the new route and exact resources, then update through the supported
API and regenerate pointers. Do not create a second live alias prompt or rename
generated files manually. Preserve rollback to the old binding set until
acceptance; source rename alone does not prove installation or runtime use.

For human-facing team receipts, resolve the current permanent project root and
show full absolute disk paths in both link label and target. Machine manifests
and portable package references keep their specified repository-relative paths.
Never transfer an absolute private disk path to Jev under a relative-path grant.

Every source candidate remains unvetted. Gate 3/4, independent acceptance and
licence precedence holds still apply; a catalogue rename grants no publication,
installation, invocation or deployment authority.
