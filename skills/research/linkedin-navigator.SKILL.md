---
name: linkedin-navigator
version: "0.1.0"
description: |
  Navigate, search and build target lists on LinkedIn without the LinkedIn
  API, without a login session, and without any paid scraping subscription.
  Use when asked who to follow or connect with at a set of companies, to
  audit which target organisations the owner already has a route into, or
  to turn a named account list into a click-through follow/connect
  checklist.

kaidera:
  category: research
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
  allowed_domains:
    - linkedin.com
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
  source:
    repo: Kaidera-AI/turnkey-projects
    path: projects/marketing-os/source/skills/linkedin-navigator
    content_sha256: fb9de06c437ca98f466c08cde16c00547eb4938bb2bf1ef63befd40b82156af1

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-19
tags: [research, marketing, sales, linkedin, lead-generation]
attribution_notes: Independently authored Kaidera Marketing OS workflow, genericized from Marlow-Platform's own linkedin-navigator skill during the E023 harvest (f07dfdc7 item 3). No LinkedIn API access, login session, or scraper code is used or bundled - deep links and local-data matching only.

safety_constraints:
  - Never scrape LinkedIn or authenticate as any account. Only deterministic search/company deep links are constructed; the owner clicks them manually.
  - Never fabricate a profile URL. A profile URL is only ever copied verbatim from the owner's own connections export or an actual search result - never hand-built from a name.
  - Never claim to have followed a page, sent a connection request, or read the follow graph - none of the three is possible without a granted read scope, and connection requests/DMs stay manual by design.
  - The owner's connections export is their own exported data; treat it as sensitive and do not include raw export contents in any output beyond what the deliverable requires.
---

# LinkedIn navigator — reach without the API

Three things are true at once, and this skill exists because of the gap between them:

1. LinkedIn app tokens are **publish-only** — `w_member_social` and
   `w_organization_social`, plus `email openid profile`. There is no granted
   read scope.
2. Even with more scope, LinkedIn exposes **no API** for the things people ask
   for here: no endpoint returns who a member follows, none follows a company
   on a member's behalf, and no public API sends a connection request.
3. Every off-the-shelf scraper closes the gap by logging in as the member —
   which risks the one account the whole outreach programme runs on.

So this skill does not scrape and does not authenticate. It builds **deterministic
LinkedIn deep links** the human clicks, and it mines **data already held
lawfully** to make that click-list short and correctly ordered.

## The three lawful inputs

| Input | What it gives | Where |
|---|---|---|
| The owner's own connections export | real profile URLs, employers, titles | `data/Connections.csv` |
| Public leadership pages | current C-suite names, verbatim | `leadership_url` column in the target-list CSVs |
| Deterministic search URLs | a resolving link for anyone not yet named | constructed, see below |

The connections export is the owner's own data, downloaded from *Settings →
Data privacy → Get a copy of your data → Connections*. It is the single
highest-value asset here: it answers "do I already know someone at X" without
a single request to LinkedIn.

## Never fabricate a profile URL

LinkedIn vanity slugs carry unguessable suffixes — `/in/jane-smith-a1b2c3d4`.
A hand-built `/in/firstname-lastname` is a **fabrication**, not a shortcut, and
it will 404 in front of the person you are trying to impress.

Rules:

- A profile URL is only ever **copied verbatim** — from the connections export,
  or from a search result that actually surfaced it.
- Everyone else gets a **people-search deep link**. It always resolves, and it
  survives the person changing their vanity URL.
- Company pages: use the direct `/company/<slug>/` where the slug is known,
  otherwise a company-search link. Both resolve in one click.

## URL grammar

```
Company page          https://www.linkedin.com/company/<slug>/
Company search        https://www.linkedin.com/search/results/companies/?keywords=<enc>
Person by name+org    https://www.linkedin.com/search/results/people/?keywords=<name>+<org>
Role at an org        https://www.linkedin.com/search/results/people/?keywords=<org>+<role terms>
Posts by keyword      https://www.linkedin.com/search/results/content/?keywords=<enc>
```

Boolean `OR` works inside `keywords`, which is how one link covers a whole role
family: `?keywords=<org>+network+planning+OR+route+development`.

Note the `currentCompany` facet takes a **numeric company id**, not a slug, so
it is not constructible from a name — keyword search is the reliable route.

## Running it

```bash
python3 scripts/linkedin_targets.py            # writes docs/sales/linkedin-targets-<date>.md
python3 scripts/linkedin_targets.py --out /tmp/x.md
```

Universe files, both editable by hand:

- `data/linkedin-targets/organisations.csv` — org, category, region, slug, leadership URL
- `data/linkedin-targets/people-verified.csv` — names, each with source + verified date + confidence

The report gives, per organisation: a follow link, the senior people the owner
**already** has there, the names verified this pass, and role-search links for
the gaps.

## A trap this pattern has already hit: loose company matching invents relationships

Matching on tokens after stripping a generic industry suffix (e.g. "airlines",
"bank", "group") leaves only the distinctive brand word, and short or common
brand words then collide with unrelated companies that happen to share it.
Matching is therefore an **anchored prefix** against a full alias, never a bare
substring. Keep negative controls in place when editing an `ALIASES` table —
assert the known false-positive collisions resolve to `None` after any change.

**Credential suffixes break surname matching.** A name like `Jane Smith, C.M.`
has last token `M.`; strip a credential set before taking the last token, and
only resolve a nickname to a connection when the surname is **unique within
that org** — so a nickname finds the full name without ever merging two
different people.

## What to hand back, and what to never claim

Deliver: a follow checklist, a connect list, and an honest coverage count.

Never claim the skill followed a page, sent a connection request, or read the
follow graph — none of the three is possible without a granted read scope.
Connection requests and DMs stay **manual by design**: drafts and lists only,
the owner clicks.

## Refreshing

The export goes stale from the day it is downloaded — anyone connected after
that date reads as a gap when they are not. Re-export before any pass where
that matters, and state the export date in the deliverable.
