---
name: hyperframes
description: "Create, edit or render HyperFrames HTML video compositions and motion graphics. Use for HTML-to-video deliverables or existing HyperFrames projects, with deterministic seekable animation and local rendering."
license: CC-BY-4.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter", "tool:web_search"]
  allowed_domains: ["github.com", "registry.npmjs.org"]
  updated: "2026-10-10"
  tags: ["design", "animation", "video"]
  attribution_author: "HeyGen"
  attribution_url: "https://github.com/heygen-com/hyperframes/tree/6f3f86a9c9824c8ad5b7bf760375e243466e5ee0"
  attribution_notes: "Original Kaidera adaptation and routing text informed by inspected pinned upstream sources. No upstream executable, installer, plugin or skill body is bundled."
  safety_constraints: ["Use local deterministic rendering and approved project pins; external services and publication require task authorization.", "Keep licensed media provenance and never include credentials in source or exported assets.", "Use only the task-authorized tools, data and external actions.", "Source publication does not grant runtime trust, installation, release authority or provider spend."]
---

# HyperFrames

HyperFrames turns timed HTML compositions into video. Use it when the deliverable is a rendered film or motion graphic, or the user has an existing HyperFrames project. Keep a chosen alternative framework when the task names one.

Resume from the project's `hyperframes.json`, brief, storyboard, media and version pin. For a specific edit, diagnosis or render, perform that operation without restarting intake. For new work, establish the subject, audience, format, duration, brand, required assets and desired output before designing scenes. Infer supplied information; ask only for consequential gaps.

Read [composition and rendering](references/composition-and-rendering.md) before writing HTML or diagnosing rendered frames. It contains the runtime invariants and local CLI loop.

## Match the workflow to the deliverable

| Deliverable | Load the relevant pinned upstream workflow |
|---|---|
| Product launch or UI demonstration | `product-launch-video` |
| Narrated explanation | `faceless-explainer` |
| Existing footage / captions | `talking-head-recut` / `embedded-captions` |
| Visual sequences or titles | `motion-graphics` |
| Music-led sequence | `music-to-video` |
| Existing Remotion source | `remotion-to-hyperframes` |
| Mixed or otherwise unmatched film | `general-video` |

For specialized mechanics, read only the corresponding domain: core timing, animation adapter, keyframes, audio or media use. Source references are links, not evidence that those upstream skills have been installed.

Use project-local, pinned CLI versions and local media for reproducible renders. Changes to that pin should be deliberate, with the old version and rendered differences recorded. Registry assets, fonts, music, stock footage and generated media need their own provenance and permitted use. Cloud rendering, TTS, avatar services or publishing are separate external actions whose credentials, data transfer and spend must be authorized for the task.

Deliver the editable source, dependency and asset record, requested export and actual validation result. Name uninspected frames, missing media or environment limits. A good storyboard alone is not evidence of a successful render.
