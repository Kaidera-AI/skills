---
name: folder-structure
description: "Define one project file layout, route new work to its home, and migrate existing files through an approved, verified table."
license: CC-BY-4.0
metadata:
  version: "0.9.1"
  authority: "A project's accepted structure definition and explicit migration approvals; this candidate grants no authority by itself."
  sources: "Project structure, custody, migration, and housekeeping practices authored for this candidate."
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter"]
  allowed_domains: []
  updated: "2026-11-22"
  tags: ["files", "structure", "custody", "migration"]
  safety_constraints:
    - "A layout or dry-run classification does not authorise file creation, movement, publication, or deletion."
    - "Use the project's accepted definition and exact approved path table; do not infer paths or approvals."
    - "Never delete by pattern or age without a separately approved and tested lifecycle policy."
    - "Preserve foreign edits and ask the owning person when custody is uncertain."
    - "Generated files are written only by their named generator."
    - "Source publication does not authorize installation, binding, trust promotion, or destructive work."
  applies_to: ["lead", "project-manager", "developer", "documentarian", "reviewer"]
  bias: "One definition owns locations; one file owns each fact; uncertain custody stops the move."
  conflicts_with: ["folder-organisation"]
---

# Folder structure

This skill gives a project a single, readable definition of where its work belongs. It helps a worker classify a new file and gives a project lead a safe process for adopting the layout. It is a portable candidate: it does not replace the project's own approved rules, grant file access, or perform a migration.

For a plain-language explanation for people, read the [human guide](references/human-guide.md); the rules in this skill still govern.

## Start with the project's authority

Before creating or moving a project file, read the project's current `structure.yaml`, the accepted plan for the change, the project root and product catalogue registered by its owner, and the selected project shape. The bundled `references/structure.yaml` is a starter definition, not proof that a project adopted it. A project may use it only after its owner approves the layout and records the effective definition in the project's normal source of truth. Select `single_product` only when exactly one product is registered; otherwise use `multi_product`. For ordinary placement in an adopted layout, check that product identities match across the registered catalogue and both vaults. During migration, record missing or mismatched legacy product paths as inventory findings; do not require the old tree to match the target before inventory. Require exact identity parity in the final check before enabling the product gate. In single-product mode, the product layout sits directly at the project root in both vaults, and the one README serves as both project and product entry point.

If the project has no accepted target definition, a target path cannot be resolved, or two sources of authority disagree, stop and ask the project lead. A missing or differently named legacy path during migration is an inventory finding to classify under the approved table; it does not block the read-only inventory itself. Do not choose the most convenient target path. Keep product, repository, account, storage, and audience names in the project's definition and settings; never copy machine-specific values from this candidate.

## The placement rules

1. **Secrets and credentials** belong in the project's approved secret store. The account that runs project code cannot read the project secrets tree, and each credential is readable only by the identity that uses it. Never put secrets in source, documents, examples, generated pages, or a migration table.
2. **Named generated reader views** stay in their declared DocsVault locations even though a program writes them. Examples include the product progress page, roadmap, area README pages, module catalogue or high-level module table, and release evidence index. Only each named generator writes its view.
3. **Code and other program data** belong in the configured development store. Tracked source belongs in its repository; temporary work, logs, evidence, caches, and other program output belong in their named temporary or output locations.
4. **Human-authored material for readers** belongs in the configured documents store. Select its product and reader using the project's structure definition.
5. **Cross-product material** belongs in the project-level area named by the definition. A fact has one authoritative home; other pages link to it or are generated from it.
6. **Logs, receipts, and evidence** follow the project's retention and evidence policy. They are not documentation merely because a person may read them.
7. When a kind of file has no destination in the accepted definition, stop and ask the owner. Do not create a new top-level folder to make the problem disappear.

The starter routes in `references/structure.yaml` distinguish management, release records, user guidance, administration guidance, and developer material. Its project-shape rule selects either `<project>/<product>` roots or the project root itself for a single product. The path table there is the only source for folder names and each location's “goes in” and “stays out” rules. Change that definition through an accepted plan before changing consumers or creating a new structural name.

This candidate does not bundle an inventory tool, structure validator, mount doctor, generator, housekeeping service, or copy/delete command. The YAML describes the intended contract; it is not executable enforcement. Git branch, review, and push rules remain in the project's accepted Git policy. This skill only locates clean repository checkouts and temporary work inside the configured development store.

## Keep storage, access, and walks bounded

- **Documents mounts:** when the documents store is one share, check its configured root as a mount separate from the development store and OS root. When each project has its own mount, the documents-store root is a plain parent folder; check each registered project mount separately. Never treat the plain parent as the content device. Run the configured checks at install and service start.
- **Single-disk test hosts:** a root-owned marker created only by test provisioning identifies a test host. The installer never creates it and has no install-time switch to mark a production host as a test host. On a marked test host, the device doctor puts a `WARNING` in its first output line; otherwise the development store sharing the OS device is a failure.
- **Project secrets:** the project-code account cannot read the secrets tree. Grant each credential only to the identity that uses it; a compromised project process must not gain access to every worker's token.
- **Service state:** keep each service's state in its configured service-state location with a service-specific owner and owner-only access. Treat it as secret-bearing data. Never include it in a support bundle or copy it to the cold store except through that service's own approved backup design.
- **Filesystem walks:** inventory, check, move, and housekeeping walks stay within one authorized filesystem, stop at mount boundaries, and never follow symbolic links outside the approved root. A copy between stores names its source and destination explicitly.

## Keep one fact in one place

Update the authoritative home once. Other human-authored pages link to it; named generated views may project it without becoming a second source. Use the exact locations in the project's accepted `structure.yaml` when they differ from these common homes:

| Fact | Canonical home | Other pages |
|---|---|---|
| Project file and folder destinations | Owner-accepted `structure.yaml` | Link to the definition or use its generated views; do not restate its path rules by hand. |
| Current work and release progress | The progress source named by the owner-approved `structure.yaml` | Generated progress and roadmap views may display it; other pages link to the source data. |
| A release's content, state, and date | That release's `plan.md` front matter as defined by the owner-approved `structure.yaml` | Link to the plan or use a generated release view. |
| A decision and its rationale | The decision ledger | Link to the ledger entry. |
| Product identity, name, stage, team, and visibility | The product's `product.yaml` | Link or use an approved generated team view. |
| Audience for each documents area | That area's `audience` in the owner-approved `structure.yaml` | Generated views inherit the area's declared value. |
| A module's purpose and ownership | Its module page | Link or use the generated module catalogue. |

- **One fact, one file.** A page that manually restates a fact with a canonical home is a review finding. Point to the authoritative file; do not create a second copy.
- **Add to the file that exists.** Add a dated heading for a new decision, finding, or day. Create a new file only for a new item named by the structure definition.
- **One current version.** Replace the current file. Keep no side-by-side `-r2`, `.prev`, `-copy`, or `-final` file. Preserve a prior version only through the approved archive process below.
- **A message is not a document.** Use the project's coordination system for handoffs, status notes, and replies.
- **Output is not a document.** Keep generated output, logs, receipts, and evidence in their approved data or evidence locations; keep an index where readers need one.
- **A generated page is written by its generator only.** Do not hand-edit a generated page or maintain a second copy.

The check described by the definition may report identical files, revision-like names, and overfull hand-written folders. A report is evidence for a human decision; it never chooses which file to keep or authorizes deletion.

## Adopt the layout safely

Use `references/adoption.md` for the full adoption sequence and `references/cleanup-method.md` for the four report-and-disposition turns. In brief: do not migrate during a release; inventory read-only; make one disposition row per exact existing path; have the product owner propose and the authorized decision-maker approve the table; preserve repositories, logs, and evidence; move one product at a time; compare counts and hashes; review the move evidence; remove only approved exact paths; then enable a gate for that product after the removals and final check are clean. If a copy cannot be verified, stop before removing the source.

The skill does not run the inventory, write to a storage service, change permissions, update a project map, or remove a path. Those actions need their own approved plan, owner, tools, and checks.

For a network-attached storage (NAS) documents store, confirm its snapshot coverage explicitly. If the product backup does not cover it, the operator guide must require the NAS's own snapshots until a tested backup design closes the gap. Do not infer that a NAS is covered by a cloud provider's snapshots.

## Keep the tree healthy

Use `references/housekeeping.md` for a report-only routine. List stale temporary work, unfinished archive obligations, holds, and new structure breaches with an owner. Keep the report separate from operational state and hand each item to its owner.

**Superseded working-document versions:** when a new version is made, the prior version must leave the active vault for the project's approved cold-store location. Retain it for 14 days (the target); 30 days is the maximum, after which it is deleted. Each product must record the exact class, destination, verification, and expiry in its approved lifecycle table before anyone acts on that rule. This skill does not authorize a deletion, and no file is deleted on the strength of this candidate alone.

**Accepted or shipped evidence:** a proposed 400-day exception for reviewer-accepted or release-shipped evidence remains unconfirmed and is not an active retention rule. Until that decision is confirmed, follow the project's existing approved evidence policy and never sweep evidence into a working-version expiry rule.

No automatic age-based deletion is active in this candidate. A project must review its storage implementation and prove preservation or restore behavior before enabling automation. Any removal must follow the approved per-product table, exact-path recheck, and a recorded receipt.

## Templates and generated views

The bundled templates are starting shapes, not mandatory project facts. Their destination is selected by `structure.yaml`. Named generated reader views stay in DocsVault at their declared locations; other program output stays in DevVault. Keep progress, roadmap, index, and area pages under their named generators. Keep diagrams beside the page they explain, with the source and rendered image together. The wireframes entry in the starter definition names one editable drawing, its same-basename rendered image, and an `index.md` for each screen area. Use the module and product names from the same module catalogue everywhere.

The standard structure names each documents area's audience as `customer-eligible` or `internal`; generated views inherit that value. A release's `released` date is measured from its observed version tag or public release, never typed into the plan. Do not publish or synchronise a folder until the project owner confirms its audience contract and the receiving system's exact read-back behavior.

## Candidate status

Version `0.9.1` is awaiting a real-project test. The starter layout, names, storage assumptions, and templates have not been proven on a customer's machine or on every supported operating system. The macOS path is untested. In particular, mount behavior, filesystem labels, backup coverage, and automatic retention are platform- and project-specific. Keep such items marked **not tested** until the named project test produces evidence and its owner accepts the result. Version `1.0.0` requires the approved test to pass and the project's readers to accept the exact content hash.

Publishing this source does not install or bind it, grant access to any repository or storage, approve a move, activate a lifecycle rule, or promote its trust tier.
