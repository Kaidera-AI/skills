# Design skills adoption evidence

Source inventory dated 2026-10-18. Candidate instructions, not a runtime release.

| Source / exact revision | Decision | Reason / limits |
|---|---|---|
| Kaidera-AI/skills main 53a9afd094020d9a197b299f05e051c27355e62e | Reuse | Already has UI craft, UI/UX critique/hardening, pinned web guidelines and HyperFrames. Do not duplicate them. |
| Kaidera-AI/skills PR20, 34186d4f8fd2fcd8969bf417d6fd9cbd30d8027c | Adapt methods | Original presentation-design uses approved-copy, exact assets, editable/scripted output and full-slide QA. No brand palette, font, customer or house-style default copied; PR20 remains open and untouched. Its gated-deck web-page scope is deferred. |
| Marlow OS 1e46e173b5594355811875f04c0d66dfc24e17aa, roster/graphics.md and playbook/visuals.md | Distil | Brief→composition→real export→inspection→hash receipt; planned brand zone; approved asset freeze. No engine scripts or customer assets copied. |
| Marketing docs/agents/gem.md, observed 2026-10-18 | Distil role scope only | Motion/3D, deterministic craft and creative review are relevant. Historical harness/model/provider, cadence, customer paths and shopping list are not portable authority. |
| [Anthropic canvas-design](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/canvas-design) | Reviewed, not vendored | Per-skill Apache-2.0 file verified at this pin. Useful visual hierarchy/export-inspection example. Our body is original; no fonts or upstream body bundled. Its philosophy-first flow does not replace a specific approved edit. |
| [Emil skills](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d) | Existing adaptation retained | UI design engineering already covers this branch. Specialist links remain options, not installed skills. |
| [HyperFrames](https://github.com/heygen-com/hyperframes/tree/6f3f86a9c9824c8ad5b7bf760375e243466e5ee0) | Existing adaptation retained | Local deterministic video owner when selected; no competing default for an existing Remotion project. |
| [Remotion official skills](https://github.com/remotion-dev/skills/tree/1441a11e95db35443bd76bb318386c0d3ca00053) | Reference only, no import | README inspected. Root LICENSE absent at this revision; runtime terms and skill reuse need explicit confirmation before vendoring. Do not install based on popularity. |
| [Blender manual](https://docs.blender.org/manual/en/5.1/render/color_management/color_spaces.html) | Technical reference | Color-management and exported-image inspection matter. Installed project version owns APIs/settings; no manual body copied or renderer installed. |
| Helix docs/research/2026-10-10_ui-ux-design-skills-survey.md | Reuse prior survey | Sixteen-candidate survey already led to UI review additions. Broad UI suites add overlap; unlicensed/vendor-bound options remain excluded. |

## Ownership and release boundary

The four new skills use CC-BY-4.0, matching the repository root, with original Kaidera wording. Attribution/provenance remain in the manifests. This does not resolve the repository-wide root/per-skill licence precedence hold for other entries. No third-party executable, font, plugin, customer asset or upstream skill body is bundled.

The shared repo is the canonical owner of these generic skills. Turnkey owns its role requirements and onboarding compiler, and consumes an immutable source commit. Project brands, tool settings and task approvals stay in the project vault. All new manifests remain unvetted. Static checks and source publication do not clear Gate3 runtime sandbox or Gate4 signing/reviewer provenance. The Wren packet is staged source material awaiting those gates; no active binding is claimed.

## Maintenance loop

For each project: inventory used skills and gaps by role, propose the smallest reusable capability, verify source/licence at a pin, adapt into a universal plain-file skill, add representative task and failure cases, independently review, then release through the approved loader. Record installation/readback and actual task qualification separately. Upgrades compare the old lock and rerun affected qualification. Skills master owns the shared catalogue and gap queue; project leads own task fit, SOP acceptance, tools and runtime receipts. Do not track mutable main silently.

This slice covers Gem design and the all-role onboarding mechanism. Other marketing craft skills remain shipped in turnkey and are inventoried in onboarding requirements; their promotion to the shared repository is a subsequent review task, not a completed claim.
