---
name: ui-ux-review
description: "Critique interface usability, audit implemented web UI quality, or harden a scoped interface against data, network and interaction edge cases. Use for a requested UI/UX review or resilience pass."
license: Apache-2.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter"]
  allowed_domains: ["github.com", "apache.org"]
  updated: "2026-10-10"
  tags: ["design", "ui-ux", "review"]
  attribution_author: "Paul Bakaus"
  attribution_url: "https://github.com/pbakaus/impeccable/tree/d631a8827f99414d2b6daba4ef08b7f8701751d7"
  attribution_notes: "Plain-file adaptation at the pinned source; licence and modification notice bundled. No upstream CLI, hooks, installer or vendor permission grants."
  safety_constraints: ["Use only task-authorized tools and data.", "Critique and audit are read-only; editing requires an accepted task scope.", "Report observed behavior separately from untested assumptions.", "Source review does not grant runtime trust, installation, binding or release authority."]
---

# UI/UX review

Choose the requested mode: **critique** judges task flow and design; **audit** checks implemented web behavior; **harden** changes the accepted UI scope for realistic failure conditions. A review reports findings. A hardening request permits only its agreed edits.

Read the existing product brief, design system and target surface directly. Resolve user task, audience, supported devices, framework and current constraints. Missing context becomes a stated assumption or one focused question when it changes the result. Select the surface mode: Persuade (decision/action), Operate (task completion), Read (comprehension), or Experience (artifact presentation). Preserve the user's brief and incumbent identity during refinement.

Use the matching local reference:

- [Critique](references/critique.md): usability and information hierarchy.
- [Audit](references/audit.md): implementation evidence for accessibility, performance, theming and responsiveness. Native UI requires platform guidance and is outside this web audit checklist.
- [Harden](references/harden.md): edge cases, recovery and interrupted interactions.

Inspect the named files and available visual evidence before judging. With authorized browser access, observe the actual route and supported states. Label screenshots, source inspection, automated measurements and physical-device observations separately. If the app cannot run, review source or current captures and explicitly bound the conclusion. Screenshots cannot establish keyboard, screen-reader, network or touch behavior.

Return scope and evidence identity, useful strengths, prioritized findings, suggested remedies and untested states. Each finding names its location, user impact, supporting evidence and whether it is observed or inferred. Use P0 for task-blocking failures, P1 for major friction or verified accessibility failures, P2 for smaller problems with a workaround, P3 for polish. Group repeated causes; avoid a pile of cosmetic nits. Subjective scoring is optional and never a release or accessibility certificate.

For authorized edits, inspect before, make the bounded change, then inspect the affected states. Run checks only within the user's test authorization; otherwise provide reproduction steps and mark behavior unverified. Resolve the observed batch and confirm it in one focused pass; remaining material defects stay open rather than being renamed polish. The author cannot approve their own release.

This is a standalone method. It uses ordinary permitted file/browser tools and existing project evidence. No Impeccable launcher, detector, hooks, injected scripts, project initializer, shortcut registration or forced delegation is required. Source and modification details are in [provenance](references/provenance.md).
