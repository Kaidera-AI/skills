---
name: cairn
version: 1.0.1
description: |
  How a project shows up on Cairn, the Kaidera project map, and stays current. Covers the files
  the project keeps, the one worker who updates them (the documentarian), enrolment, the update
  loop, the checks to run, and what must never go into a synced folder. Use it when a project
  enrols on Cairn, when its progress, modules, decisions or documents change, or when Cairn shows
  something wrong. Do not use it to change Cairn's own pages, sign-in or people; those belong to
  the Cairn maintainer and the owner.

kaidera:
  category: documentation
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
    - tool:code_interpreter
  allowed_domains:
    - cairn.kaidera.ai
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera
license: Apache-2.0
updated: 2026-11-15
tags:
  - cairn
  - documentation
  - progress
  - modules
  - project-map
safety_constraints:
  - Only the project's documentarian writes Cairn-facing files; every other worker hands material to the documentarian and never edits those files.
  - Never type a percentage, a count or a date into Cairn; Cairn computes them from the files and from the code.
  - Never put source code, credentials, keys, environment files or personal data in a Cairn-synced folder.
  - Never edit Cairn's generated pages, layout or menus; change their input files instead.
  - Enrolment, people and access are changed only by the Cairn maintainer and the owner.
---

## Instructions

### 1. What Cairn is

Cairn (`cairn.kaidera.ai`) is the project map. People sign in with GitHub or Microsoft, and Cairn shows each person only the projects they were invited to. **AI Workers have no Cairn account and cannot open its pages;** they work with the files and ask the Cairn maintainer for a read-back (section 5). Cairn shows:

- the **dashboard and architecture views**: each product, its modules and their sub-modules;
- **progress**, **roadmap** and **decisions**;
- the **documentation**: every document of the project, rendered;
- the project's **diagrams and wireframes**.

**Nothing on Cairn is typed into Cairn.** Everything comes from the development machine:

- documents and contract files from the project's documents folder;
- module and line-of-code facts from the project's code checkout, read at a named branch.

A sync agent copies changed documents within about a minute, sends everything again every 15 minutes, and rebuilds the generated pages at most every 30 minutes. If Cairn is wrong, a file on the machine is wrong or missing. Fix the file, never the page.

### 2. Roles: one writer

| Role | What they do | What they never do |
|---|---|---|
| **Documentarian** (one per workspace) | The **only** worker who writes Cairn-facing files. These are the contract files, the front matter, and the documents in `docs/`. Runs the checks in section 6. Asks the Cairn maintainer to enrol a project. | Edit code, Cairn's pages or Cairn's settings. |
| **Project lead** | Owns the facts: what is done, what is next, which modules exist. Sends the documentarian each change with its evidence. Reviews what the documentarian wrote. | Edit Cairn-facing files directly. |
| **Other workers** (developers, reviewers) | Report changes to their lead. Read Cairn. | Edit Cairn-facing files directly. |
| **Cairn maintainer** | Runs the Cairn app and the sync. Enrols a project in Cairn's registry. Checks that the first sync sends documents only. Reads a project's page back for workers on request. | Write a project's content. |
| **Owner** | Approves enrolment, invites people and sets their access. | |

A change reaches the documentarian as a **handoff**. In Kaidera workspaces that is a Cortex row addressed to the documentarian. It names three things:

- what changed;
- the evidence: a commit, a merged change, a test run or a decision record;
- the file it affects, such as `progress/progress.yaml` slice `p3`.

The documentarian answers with the files changed and the result of the checks.

### 3. The files a project keeps (the contract)

All paths are relative to the project's **documents root**. That is the folder Cairn copies; it is not the code repository.

```
.kaidera/board.yaml        required: who and what this project is
progress/progress.yaml     required: slices and their status (Cairn computes the percentages)
modules.yaml               required when the project has code: the designed modules
docs/design/<topic>/       intent, specification, design, open questions, diagrams
docs/decisions/            one file per decision, or one DECISIONS.md ledger
docs/guides/               operator and developer guides
docs/wireframes/           each scene as .excalidraw with its .png beside it
docs/diagrams/             the same rule as wireframes
docs/research/             research and assessments
plans/<plan-id>/PLAN.md    plans
roadmap/                   the release order, if the project keeps one
README.md                  what the project is, in a few paragraphs
```

`.kaidera/board.yaml`:

```yaml
schema: kaidera.board/v1
project_id: portals            # stable id, lower case, never the display name
project_name: Portals
product: portals
repo_kind: docs                # docs | code; a code project also keeps modules.yaml
lead: <lead worker id>
team: [<worker id>, <worker id>]
reviewers: [<worker id>]
visibility: internal           # internal | customer
```

`progress/progress.yaml` holds status only. Never write a percentage.

```yaml
schema: kaidera.progress/v1
release: first-release
slices:
  - id: p1
    title: Workspace, CI and cluster
    status: planned            # planned | in_progress | in_review | done | blocked
    owner: <worker id>
    plan: plans/p1/PLAN.md
    modules: [edge-api]
    started: 2026-11-12
    done: null                 # a date exactly when status is done, otherwise null
    evidence: []               # links to commits, merged changes, test runs, gate records
```

`modules.yaml` lists the **designed** modules. Cairn measures the real ones from the code and shows both.

```yaml
schema: kaidera.modules/v1
modules:
  - id: edge-api
    purpose: the licence API and the payment webhook inbox
    owner: <worker id>
    paths: [apps/edge-api]
    interfaces: [https:api.example/api/v1]
    depends_on: [licensing, billing]
    designs: [docs/design/portals/DETAILED-DESIGN.md]
    status: planned            # planned | in_progress | in_review | done | blocked (the same words as slices)
```

Every design, plan and decision file starts with front matter:

```yaml
---
id: portals-detailed-design     # stable
title: Portals detailed design
kind: design                    # intent | spec | design | plan | decision | research | guide
status: draft                   # draft | review | accepted | superseded
owner: <worker id>
updated: 2026-11-14
links: { modules: [edge-api], decisions: [D-0007], supersedes: null }
---
```

### 4. Enrolment (once per project)

1. **Lead → documentarian:** the lead asks for enrolment and gives the project name, the lead, the team, the stage, the documents root and the code checkout with its branch.
2. **Documentarian builds the folder:** lays out the documents root as in section 3, writes the three contract files, and runs the checks in section 6 until they pass.
3. **Documentarian → Cairn maintainer:** sends the enrolment request with the documents root, the code checkout and branch, and the lint result.
4. **Cairn maintainer enrols:** adds the project to Cairn's registry and watches the first sync. It must send documents only: no code, no `.git`, no build output, no secrets. Then the maintainer opens the project's tile and checks:
   - the progress bar and its source;
   - the designed modules and the measured ones;
   - the architecture diagram;
   - the documents.
5. **Owner sets access:** the owner decides who may see the project. Cairn is by invitation.

The documents root and the code checkout are always two different places. Cairn copies the documents and only *measures* the code; it never copies the code.

### 5. The update loop (every change)

1. A worker finishes something: a slice moves, a module is added, a decision is taken, a document is written.
2. The worker's lead sends the documentarian a handoff (section 2).
3. The documentarian updates only the files that change:
   - **slice status:** `progress/progress.yaml` (status, `started`, `done`, `evidence`);
   - **module added or renamed:** `modules.yaml`, plus the design that names it;
   - **decision:** a new file in `docs/decisions/`, or a new line in the ledger;
   - **document:** the file, and `updated:` in its front matter;
   - **diagram:** the `.excalidraw` scene and its `.png` together.
4. The documentarian runs the checks in section 6.
5. After the next sync (within 15 minutes), the documentarian confirms the change shows on Cairn. An AI Worker cannot sign in to Cairn, so it asks the Cairn maintainer by handoff for a read-back of the project page, naming what should now show. A documentarian who is a person with a Cairn account may open the page directly. The documentarian then answers the lead's handoff with the files changed, the check results and the read-back.

**Who moves a slice to `done`:** only the documentarian, and only with evidence in hand. A slice is done when its work is merged and its gate has passed, not when someone says it is nearly done.

### 6. Checks before saying "done"

- `cairn lint <documents root>` exits 0 (`--json` for a machine-readable report). It checks the contract files and the front matter.
- Every path in `progress.yaml`, `modules.yaml` and front matter `links` exists.
- No percentage, line count or computed date was typed by hand.
- The folder holds nothing from section 7.
- After the next sync, the read-back (section 5, step 5) shows the new status and the document opens. If a percentage or a source looks wrong, read the source line Cairn prints under it.

### 7. What never goes into a synced folder

- **Source code and build output:** no `src/`, `target/`, `node_modules/`, `.git/` or compiled files. Code stays in the code checkout.
- **Secrets:** keys, certificates, `.env` files, tokens or anything credential-like. The sync drops common forms, but never rely on that.
- **Personal data:** private e-mail addresses, phone numbers, account details. Use worker ids and role addresses.
- **Bulk machine output:** test logs, proof runs, mutation reports, receipts. Keep them under `evidence/`, `gates/` or `receipts/`, which Cairn does not copy, and link to them from the document.
- **Read-only directories:** seal *files* (0444/0440) and keep directories writable by their owner (0750). One read-only directory stops the sync for every project.
- **Copies:** a second copy of a document in another folder. Keep one home per fact and link to it.

### 8. When Cairn looks wrong

| You see | Cause | Fix (documentarian) |
|---|---|---|
| "No progress file yet" | `progress/progress.yaml` missing, or at another path than the enrolment says | add it at that path, or ask the maintainer to point the enrolment at it |
| "could not be read as kaidera.progress/v1" | YAML or schema error | fix the file; `cairn lint` names the line |
| A module is missing from the architecture view | not in `modules.yaml`, or its code is not a workspace member yet | add it to `modules.yaml`; measured modules appear when the code exists |
| Old copies of documents still show | the documents moved inside the root | tell the maintainer; Cairn keeps replaced copies aside and does not delete on its own |
| Nothing changes for an hour | the sync is stopped, or a read-only directory blocks it | tell the maintainer, with the time you changed the file |

Never fix Cairn by editing a generated page, a menu or the registry yourself. Hand those to the Cairn maintainer.
