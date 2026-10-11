---
name: adaptive-routing
description: "Plan or inspect OpenKai Shift, Fusion and native Run Profiles using catalogue-supported settings and actual effect evidence. Use for routing, cost/quality tuning, cast selection or a requested profile; ordinary development work does not activate it."
license: Apache-2.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter"]
  allowed_domains: ["github.com"]
  updated: "2026-10-11"
  tags: ["openkai", "routing", "shift", "fusion", "run-profile"]
  attribution_author: "Kaidera-AI"
  attribution_url: "https://github.com/Kaidera-AI/OpenKai"
  attribution_notes: "Original customer guidance for native OpenKai capabilities. No runtime, provider catalogue or external decision service is bundled."
  safety_constraints: ["Read-only planning is the default; use the customer's existing authorization, purpose and budget for changes or runs.", "Read supported identities and capabilities from the native versioned catalogue; missing contracts remain WAIT.", "Actual effect and expiry require correlated native receipts; declarations and source publication are not activation proof."]
---

# Adaptive routing in OpenKai

Work in the customer's standalone OpenKai environment. Resolve paths from its installed configuration and the active workspace; KOS and Cortex are not prerequisites. Select a mode from the requested outcome and load only its reference.

## Discovery

Inspect the installed version, the native versioned catalogue reader and its compatibility receipt before selecting settings. Use that one provider/model authority for provider-qualified identities, availability and supported controls. Preserve the customer's constraints on cost, quota, input and task quality.

If the catalogue is unavailable, return WAIT and select no model.

Unknown versions, missing capability metadata or missing native controls remain explicit WAIT/refusal. Source code or a model name does not establish installed capability. This skill ships guidance, not a replacement catalogue, reader, configuration writer, timer or decision engine.

## Choose the mode

- **Shift:** read [Shift](references/shift.md) for postures, supported lanes, pins and bounded fallback.
- **Fusion:** read [Fusion](references/fusion.md) for explicit cast selection and the extra work/cost.
- **Run Profile or effect investigation:** read [Run Profiles](references/run-profile.md) for native schema, refusal, attribution, effect and expiry.

A request to plan is complete with supported choices or named WAIT inputs. It does not authorize changing configuration or starting a model run. For authorized action, use the installed product's supported mutation surface and keep unrelated settings intact. An unfamiliar setting name is not permission to try a guessed flag.

## Current dependency boundary

Runnable catalogue/native examples require the versioned catalogue reader, installed-version compatibility, configuration controls and native profile/effect contracts from the product. Until those receipts exist, produce a conceptual plan and the exact missing prerequisite. No runnable catalogue/profile template is included here. A same-named skill in a marketplace or a successful static check proves neither those native features nor account access.

## Return evidence

Report the mode, constraints, catalogue/native versions and supported selection or refusal. Separate configured, requested, resolved/fallback and served settings. State actual changes and their scope; attach the bounded native effect/expiry receipts where available. Missing proof remains UNVERIFIED. Recovery uses current native state and preserves concurrent changes.
