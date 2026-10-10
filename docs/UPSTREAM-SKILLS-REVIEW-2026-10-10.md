# GSD Core and design skill review — 2026-10-10

Owner: ren-tk. Scope: portable source publication requested by the user. Runtime trust, Cortex registration, bindings, native installers, provider spend and deployment are separate decisions.

## Published selection

| Source candidate | Use | Packaging |
|---|---|---|
| [gsd-core](../skills/development/gsd-core/SKILL.md) | Phase planning, interrupted-work recovery and legacy GSD migration | Original adapter plus runtime/migration reference |
| [ui-design-engineering](../skills/development/ui-design-engineering/SKILL.md) | Interface craft and interaction quality | Original adapter plus a source-linked selection of 14 specialist skills |
| [hyperframes](../skills/development/hyperframes/SKILL.md) | Deterministic HTML video composition and local rendering | Original adapter plus runtime/rendering reference |
| [design-selection](../skills/development/design-selection/SKILL.md) | Select by interface, native interaction or exported-video deliverable | Read-only router; upstream specialist options are not bundled dependencies |
| [unlazy](../skills/development/unlazy.SKILL.md), 1.0.1 | Completion ledgers and evidence discipline | Existing method-only skill; corrected negative check and optional-checker execution guidance |

The four new directories are canonical universal plain-file skills. `scripts/render-upstream-adapters.js` deterministically projects them and their references into the flat platform manifests. `--check` rejects projection drift; CI observes canonical source changes. Marketplace generation retains unvetted, unsigned status. The existing catalogue's Gate 3 runtime sandbox and Gate 4 trust-root holds remain applicable.

No upstream skill body or executable was copied into the four new adapters. They contain original Kaidera instructions with pinned provenance. The root CC-BY-4.0 license applies to those authored adapters. The existing MIT unlazy adaptation retains its MIT declaration and attribution. Installing native runtimes or upstream specialist bodies requires a separate review of their licenses, dependencies and execution behavior.

## Source identities

Versions below distinguish a published release from a package declaration on inspected source. An inspected source pin is not a runtime deployment receipt.

| Repository | Inspected revision | Version / status | Source license |
|---|---|---|---|
| [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core/tree/87e87d34b2d8519e30d1af7d910fc98f2af4bc8d) | `87e87d34b2d8519e30d1af7d910fc98f2af4bc8d` | Published v1.16.0; Node >=24 | MIT |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes/tree/6f3f86a9c9824c8ad5b7bf760375e243466e5ee0) | `6f3f86a9c9824c8ad5b7bf760375e243466e5ee0` | Source CLI 0.8.144; Node >=22 | Apache-2.0 |
| [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d) | `e8a175de22ae1e49370fc144c1f3bb9aeedf988d` | 14 specialist directories; source selection | MIT |
| [Leonxlnx/unlazy](https://github.com/Leonxlnx/unlazy/tree/16671491f6679ad9378f52604d3bc2415b4120c7) | `16671491f6679ad9378f52604d3bc2415b4120c7` | Source targets 2.1.0; not identified as a tagged release | MIT |

## Decisions from the review

### GSD Core

GSD Core provides a useful persistent phase structure and resume method. It fits inside the Kaidera SDLC: it does not own plan acceptance or release authority. The adapter preserves one canonical epic plan, distinguishes partial bootstrap from recovery of an established project's missing state, and resumes from evidenced artifacts rather than assuming a recorded success occurred.

The inspected package distinguishes the `gsd-core` installer from `gsd-tools` workflow utilities. Native installation, updates and harness hooks can change agent configuration. Cortex owns generated harness files; the adapter therefore does not run those actions implicitly. No standalone GSD Core entry was present in the inspected skills catalogue before this addition; this is a new portable adapter, not proof of an estate-wide migration.

### Emil design skills

The interface adapter captures feedback, geometry, responsive behavior, purposeful motion and accessibility. Its reference selects specialist tasks rather than injecting all 14 bodies. Native Swift and Expo workflows retain their own runtime requirements. Library choice and prototype generation are used when requested. Context-sensitive rules replace donor absolutes: reduced motion, input device, browser behavior and interruption matter more than a universal animation ban or a guaranteed GPU outcome.

### HyperFrames

The video adapter uses project-local pins and deterministic seekable animation. Its reference requires reading the pinned minimal composition and data-attribute contract before HTML authoring, including composition IDs, dimensions, clip timing and media audio policy. Browser layout, font readiness, finite duration and asynchronous timeline registration must be considered before a successful render is claimed.

The upstream `slideshow` workflow produces an interactive deck and is not a general film workflow. It was removed from the rendered-video selection during independent review. Sample CDN assets do not establish reproducible local rendering or licensed-media provenance. Cloud rendering, TTS and publishing need their own task authorization.

### Unlazy update

Keep the acceptance inventory, coherent decomposition, disjoint ownership, independent parent verification and explicit incomplete outcomes. Depth is not permission to multiply budgets indefinitely; ownership claims coordinate workers and are not isolation. Task/model tiers remain subject to the host's available controls.

The former example `rg -c ... || true` did not emit the expected zero on no matches and masked search errors. Version 1.0.1 now uses an explicit no-match success token while failing for matches and search errors. Ledger examples use the upstream gate shape. An HTTP-status example now claims only what it measures.

The upstream checker is optional and is not bundled. `--status` is the non-executing mode; normal mode can execute once exact approval exists. Definition-bound hashes detect drift, not malicious ledger tampering. Reverification after integration still requires execution. No Stop hook or vendor plugin was installed.

## Review and limits

An independent reviewer inspected the four canonical adapters, bundled references, flat projections and generator. Two HyperFrames findings were corrected: interactive-deck misrouting and incomplete pre-authoring runtime attributes. A subsequent packaging review found detached Markdown table rows and a person-based adapter name inconsistent with repository naming policy. The tables were made contiguous and the adapter was renamed `ui-design-engineering`, retaining Emil in source attribution. Source review and manifest validation do not establish rendered-video quality, GSD runtime compatibility, capability sandbox enforcement or production readiness.

The broader big-AGI, Caliber, LangWatch and Switchyard investigation is kept in the internal Helix research packet. It contains project-specific authority and architecture context and is not copied into this public catalogue.
