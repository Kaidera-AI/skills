---
name: design-selection
description: "Select a design skill for interface polish, animation review, native interaction, prototypes or rendered video. Use when choosing design capabilities or deciding which design workflow owns a requested deliverable."
license: CC-BY-4.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:web_search"]
  allowed_domains: ["github.com", "registry.npmjs.org"]
  updated: "2026-10-10"
  tags: ["design", "routing"]
  attribution_author: "Emil Kowalski and HeyGen"
  attribution_url: "https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d"
  attribution_notes: "Original Kaidera adaptation and routing text informed by inspected pinned upstream sources. No upstream executable, installer, plugin or skill body is bundled."
  safety_constraints: ["Route by requested output and preserve the user-selected technology.", "Source-linked specialist options are not proof of installation or permission to install.", "Use only the task-authorized tools, data and external actions.", "Source publication does not grant runtime trust, installation, release authority or provider spend."]
---

# Design selection

Route by the requested deliverable and action, then load one owning skill plus necessary technical references. Mentioning animation does not determine whether the user wants interface motion or an exported film.

| Request | Owning selection | Boundary |
|---|---|---|
| UI component craft, visual polish, responsive interaction | `emil-design-eng` | Preserve the existing design system and framework. |
| Web motion implementation / review / codebase audit | Emil `animate` / `review-animations` / `improve-animations` | Keep implementation and read-only review distinct. |
| Mobile web / PWA interaction | Emil `mobile-native` | Real-device evidence differs from desktop emulation. |
| React Native / Expo motion | Emil `animate-expo` | Native runtime, not HTML video. |
| Swift code or concurrency | Emil `write-swift` | Actual Swift target and toolchain control APIs. |
| Multiple UI variants / worst-case UI data / library choice | Emil `prototype` / `break-ui` / `pick-ui-library` | Select when the user requests that activity. |
| Exported promo, explainer, titles or HTML video composition | `hyperframes` | Deterministic video, local render, retained media provenance. |
| Named existing framework or library | Its matching workflow | Keep the user's chosen stack. |

The available Kaidera source candidates in this selection are `emil-design-eng` and `hyperframes`; specialist Emil entries are source-linked options, not installed dependencies. Their respective references identify the exact upstream pins and specialist paths. Check availability before invoking a name; missing selection calls for reading the pinned source or proposing its reviewed plain-file import.

Return the chosen owner, reason, required inputs and relevant source pin. Skill selection grants no tooling or runtime trust. For a Cortex project, installation uses the approved universal plain-file path and the registry/binding process; generated harness files stay Cortex-owned.

Design engineering concerns the user's interaction. GSD Core concerns phase execution and continuity, and the project's SDLC concerns lifecycle authority. Use these methods together only where each has a distinct responsibility.
