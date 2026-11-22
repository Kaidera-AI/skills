# The folder structure, explained for people

This page explains how a project's folder structure is designed, how it works day to day, and why it is built this way. It is written for a project owner, a new team member or a reviewer. The other files in this skill are written for AI Workers, the automated agents that do much of the project's work. The exact rules live in `references/structure.yaml`. This page explains them.

Seven terms are used on this page. Each one is defined here once.

| Term | Meaning |
|---|---|
| Vault | One of the two trees of a project: the code vault and the documents vault. Each is a separate mount. |
| Product | One thing the project builds or runs. Each product has its own folders in both vaults. |
| Rebuildable output | Files a tool can produce again from source, such as build output or caches. Its owner may remove it. |
| Record | Evidence of what was run or decided, such as logs, receipts and sealed evidence. A record is moved whole and never edited. |
| Holding place | A folder for content whose home has not been decided yet. Its contents wait there until the lead decides. |
| Manifest | A list of the files in a set, with a hash for each file, so that a copy can be checked. |
| Consumer | Anything that reads a path: a service, a script, a configuration file, a mirror list or a symbolic link. |

## 1. Why a fixed structure

- A person or a worker who opens the project for the first time can find any kind of file without asking, because every kind of file has one home.
- Many workers write into the same project at the same time. Without fixed homes, each one invents a place for its files, and the top level fills with folders that nobody can explain.
- Tools such as build scripts, services, publishing or mirroring jobs and backups read paths. When paths are predictable, the tools stay simple, and a move does not break them silently.
- Source code, temporary work and evidence have different lifetimes. Mixed together, temporary build output hides real work and takes disk space. One project found more than a hundred gigabytes of rebuildable output scattered through its code folder once it looked.
- Documents for readers and code have different audiences and different rules for backup and sharing. Keeping them in two vaults lets each one be shared, mirrored and backed up by its own rule.
- Credentials kept inside a folder that every tool searches get printed by accident. A fixed, separate home for secrets prevents that, and each credential is shared only with the one identity that uses it.
- The same structure in every project means that a worker, a skill or a tool can move between projects without learning where things are again.

## 2. The design in one picture

The code vault holds code and program data. The documents vault holds what people read. Both are shown below, with the level of each entry and what goes in it.

```
Code vault (development store)
<project>/
├── <product>/
│   ├── <repository>/          tracked source and project configuration only
│   └── _work/                 temporary worktrees, release run places, rebuildable output
└── _project/
    ├── tools/                 scripts used across the project's products
    ├── secrets/               credentials, each readable only by the identity that uses it
    ├── home/                  home folder of an operating-system account made for this project
    └── workers/<worker>/      one worker's session files, notes and state

Documents vault (documents store)
<project>/
├── README.md                  entry point that links to each product
├── _project/                  current documents and records shared across products
└── <product>/
    ├── README.md              one-screen entry point for the product
    ├── product.yaml           product identity: id, name, stage, lead, team, visibility
    ├── program/
    │   ├── management/        backlog, team, risks, decisions, generated roadmap
    │   ├── releases/<version>/  plan, progress, notes, checklist, reviews, evidence index
    │   └── progress.yaml      source data for progress; the progress page is generated
    └── docs/
        ├── user/              guides and references for users (customer-eligible)
        ├── admin/             install, upgrade, backup, restore, troubleshooting (customer-eligible)
        └── developer/         design and specs; developer/<topic>/ for one topic (internal)
```

In a project with exactly one product, the product folders sit directly at the project root in both vaults, and the project README also serves as the product README.

Two details matter for daily use. First, the two vaults are separate stores. If a required store is not mounted, the services that depend on it stop rather than write into an empty folder. Second, the secrets folder is readable only by the identity that uses each credential. The account that runs project code cannot read the whole secrets tree, so one compromised process does not expose every worker's token.

## 3. The ideas behind it

**Product first.** Every product has a matching folder in both vaults, and the product is the unit of ownership and access. What several products share lives in one project-level folder, `_project`, so that a fact has one home.

**Two vaults.** The code vault holds code and program data. The documents vault holds what people read. They are separate mounts, so each one can be shared, mirrored and backed up by its own rule.

**Clean source, separate work.** The repository holds only tracked source. Worktrees, test lanes and build output live under `_work`. The repository stays clean, and `_work` can be rebuilt or cleared without touching real work.

**Three audiences for documents.** User guides are for people who use the product. Administrator guides are for people who install, run and restore it. Developer material is for people who change it. Each documents area declares its audience, and generated views inherit that value.

**One definition per project.** A single reviewed file, `structure.yaml`, says which products exist and where the two vaults are. When two people disagree about where a file goes, that file decides. A change to it goes through an accepted plan.

**Settings, not hard-coded paths.** The roots of the vaults are installation settings. The same structure therefore works on another machine or on another mount, and no machine-specific path is written into the skill.

## 4. How it works day to day

When you have a new file, place it by asking these questions in order. The first question that matches gives the home.

1. Is it a secret or a credential? It goes to the project's approved secret store.
2. Is it a generated reader view that the definition names? It stays in its declared place in the documents vault. Only the named generator writes it, even though a program produces it.
3. Does a program read or produce it? Tracked source goes in the repository. Other program data and output go in the named temporary or output area.
4. Is it human-written material for a reader? It goes in the product's documents area, or in the project-level area if several products share it.
5. Which reader needs it? Management, release, user, administrator or developer material each has its own area.
6. If no route fits, stop and ask the project owner. Do not invent a folder.

The day-to-day rules follow from these questions:

- **Never create a new top-level folder** to hold something that has no home. Ask the lead, and let the definition be revised if the new kind of file is real.
- **Keep a worker's own notes in that worker's folder**, under `_project/workers/<worker>/`. Do not write into another worker's folder.
- **Keep build output and temporary checkouts under `_work`.** The repository holds only tracked source.
- **Keep credentials in the secrets folder only.** They never go into source, documents, examples or generated pages.
- **Revise a document in place.** Replace the current file. Do not keep a copy named `-v2`, `-final` or `-copy` beside it. An older version is archived to the approved place, under the approved rule.
- **Keep one fact in one file.** Link to the authoritative page instead of copying the fact into another page. A page that restates a fact with a home somewhere else is a review finding.
- **Add to the file that exists.** A new decision, finding or day becomes a dated heading in the file that already holds that kind of record. A new file is created only for an item that the definition names.
- **Leave generated pages to their generator.** Do not edit a generated page by hand, and do not keep a second copy of it.
- **Name the folder when you search.** Never search from a vault's root. A search from the root is slow on a shared machine and reaches folders that you should not read.
- **Read a duplicate report as a question, not an answer.** The structure check reports identical files, revision-like names and hand-written folders that have grown too full. The report is evidence for a person to decide. It does not choose which copy to keep, and it does not authorize a deletion.
- **Expect a periodic housekeeping report.** It lists stale temporary work, unfinished archive duties, holds and new structure findings, each with the owner who must act. It is report-only. An expired hold is reported as expired, and nobody clears it silently.

## 5. Adopting it in an existing project

Adoption changes files that people and tools already use, so it is done with care. The stages below describe the method in plain words. The full method is in `references/adoption.md` and `references/cleanup-method.md` of the same skill.

- **Pause the work.** Do not migrate while a release is being run. Start the migration only from an agreed starting point.
- **Write the project's definition.** The owner chooses the version of `structure.yaml` that will govern the work and records it as the project's accepted definition.
- **Map every existing folder.** A read-only inventory lists each folder, its size, its files, its owner and the consumers that refer to it. Nothing is changed during this step.
- **Record every unknown owner as ask.** If nobody can say who owns a path, that row is not guessed. It waits until the owner is found.
- **Decide the fate of each row.** The product's lead proposes one fate for each exact path. The fate is one of these: stays at a home, moves to a named destination, is rebuildable, is a record, is a secret, stays where a tool reads it, or goes to a holding place because nobody can judge it yet. An authorized person approves the table.
- **Remove rebuildable output first.** It has no unique content, and removing it makes the rest of the inventory easier to read. Each removal is recorded.
- **List every consumer.** Find everything that reads a path that will move: services, scripts, configuration, mirror lists, and symbolic links, both absolute and relative.
- **Move one product at a time.** Rename complete folders where possible. Repair git worktrees with git's own command, not by hand. Re-make the links, and change the consumers in the same batch as the move.
- **Move secrets as a separate, reviewed step.** Credentials never travel with ordinary files, and they are never copied into an inventory or a table.
- **Keep the source until the copy is proven.** The original stays in place until every copy check has passed.
- **Verify before removing anything.** Compare file counts and hashes at the destination. Keep the source intact until every copy check passes. A copy that cannot be verified stops the procedure.
- **Check the result with an independent reader.** A reviewer who did not do the move compares the result with the definition.
- **Record the outcome.** The lead's report names the approved table, the exact source and destination, the hashes and counts, the verification output and any path still marked as ask. A migration is not called passed while a required row is unverified or still waiting for approval.
- **Resume the work.** Enable the structure check for the product only after the removals and the final check are clean. Other products keep the check in report-only mode until their own turn.

## 6. What the structure does not do

- Installing the skill does not move any file. A move needs the owner's decision and the adoption method above.
- It does not delete anything. Only rebuildable output is removed, and only by its owner, after an approved plan.
- It does not replace version control, backups or access control. Each of those keeps its own rules.
- It does not replace the project's own approved rules. Git branch, review and push rules, and access rules, stay with the project's accepted policies.
- It does not check anything on its own. The rules are a contract that people and tools follow. Nothing in the skill enforces them automatically.
- It does not turn on automatic deletion. No age-based removal is active. Any future automation needs an owner's decision, a tested restore check and a recorded receipt first.
- It does not work the same way on every platform. Mount behavior, permission labels and executable-file behavior must be tested on each supported host. Until a project has run that test, the results on its platforms are not proven.

## 7. Common questions

**Where do I put a file that fits two products?**
In the project-level `_project` folder, in the same program or docs area that a product would use. Put the fact there once and link to it from both products.

**What if no home fits?**
Put the file in a holding place and ask the lead. The lead decides the home. If the new kind of file is real and will recur, the definition is revised through an accepted plan.

**Can a product add its own subfolders?**
Yes, inside the homes that the definition gives. No, not at the top level. A new top-level entry needs a reviewed change to the definition.

**Why may I not search the whole vault?**
A search from the root is slow on a shared machine. It also reaches folders that are not yours to read, such as credentials and other workers' private state. Name the folder you need.

**What is a record, and why is it not edited?**
A record is evidence of what was run or decided, such as logs, receipts and sealed evidence. Its value depends on it being unchanged. A record is moved whole, with its manifest, and it is never rewritten.

**Who decides?**
The product's lead decides for the product's folders. The project's owner decides on the definition, `structure.yaml`, and on any move or removal that the definition does not already settle.
