---
name: emil-design-eng
description: "Build or polish interface components using Emil Kowalski-inspired design engineering: purposeful motion, responsive feedback, gesture continuity and mobile platform details. Use for UI craft, interaction quality or a bounded design review."
license: CC-BY-4.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter", "tool:web_search"]
  allowed_domains: ["github.com", "registry.npmjs.org"]
  updated: "2026-10-10"
  tags: ["design", "ui", "motion", "accessibility"]
  attribution_author: "Emil Kowalski"
  attribution_url: "https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d"
  attribution_notes: "Original Kaidera adaptation and routing text informed by inspected pinned upstream sources. No upstream executable, installer, plugin or skill body is bundled."
  safety_constraints: ["Read-only reviews remain read-only until implementation is in the accepted task scope.", "Preserve accessibility, existing design tokens and user intent; describe unobserved device behavior as unverified.", "Use only the task-authorized tools, data and external actions.", "Source publication does not grant runtime trust, installation, release authority or provider spend."]
---

# Design engineering

Work from the actual component, its users and the requested change. Preserve the product's visual language, tokens, accessibility and interaction contract. For a review request, return findings and proposals; editing follows implementation scope.

## Make the interface respond

Give actionable controls clear hover, focus, press, loading, disabled and error behavior. Press feedback should acknowledge input immediately; successful completion must not be implied before it occurs. Keep focus, keyboard navigation, readable contrast and assistive semantics part of the component contract.

Resolve awkward geometry before adding decoration: alignment, text wrapping, density, touch targets, trigger-relative overlays and stable dimensions during loading. Prefer existing accessible component primitives over rebuilding menus, focus traps or toast machinery.

## Give motion a job

Identify the state change motion explains and how often a user encounters it. Repeated keyboard and navigation operations need immediate response; rare explanatory or celebratory moments can tolerate more motion. Keep an explicitly requested effect when it serves the product; explain the usability tradeoff when appropriate.

Choose the simplest mechanism that handles the interaction. CSS transitions suit fixed state changes; programmatic animation or springs suit gestures, interruption and momentum. Preserve continuity when reversing or retargeting a moving element. Prefer transforms/opacity for common motion, use trigger-relative origins for anchored overlays, and scope transitions to changed properties. A compositor-friendly property is not proof that the entire effect runs off the main thread.

Use existing duration/easing tokens. Assess perceived responsiveness, readability and interruption rather than treating a donor's timing numbers as universal laws. Reduced-motion users need an effective alternative that preserves state changes; gate hover effects by input capability.

## Mobile details depend on context

Use viewport units appropriate to browser chrome and keyboard behavior; pad fixed controls for safe areas. Preserve user zoom, selectable content and native scrolling where useful. Scope selection or touch suppression to the control that needs it. Avoid applying app-shell overscroll rules to a scrolling document. Device emulation cannot establish real touch behavior: state when a proposed fix still needs hardware evidence.

For motion review, cite the component/path, visible symptom, mechanism and smallest remedy. When interaction cannot be observed, distinguish source findings from visual judgments. For implementation, explain the changed behavior and remaining evidence needed.

Read [specialist selection](references/specialist-selection.md) when the request needs motion auditing, mobile/Expo/Swift, prototyping, stress data or a library decision.
