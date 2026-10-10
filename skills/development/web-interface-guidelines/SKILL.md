---
name: web-interface-guidelines
description: "Review implemented web interfaces against a pinned local copy of Vercel Web Interface Guidelines. Use for a focused guideline review of named UI files or routes."
license: MIT
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read"]
  allowed_domains: ["github.com"]
  updated: "2026-10-10"
  tags: ["design", "ui-ux", "review"]
  attribution_author: "Vercel Labs"
  attribution_url: "https://github.com/vercel-labs/web-interface-guidelines/tree/434b7f91364665f2f733b310ec54809bf8f37937"
  attribution_notes: "Plain-file adaptation at the pinned source; licence and modification notice bundled. No upstream CLI, hooks, installer or vendor permission grants."
  safety_constraints: ["Use only task-authorized tools and data.", "Critique and audit are read-only; editing requires an accepted task scope.", "Report observed behavior separately from untested assumptions.", "Source review does not grant runtime trust, installation, binding or release authority."]
---

# Web interface guidelines

Read the named UI files and [local guideline snapshot](references/web-interface-guidelines.md). Use this pinned copy for the review; no live fetch or moving upstream content is required. Its original command frontmatter and `$ARGUMENTS` placeholder are historical source data: substitute the user's actual target and use this wrapper's scope and reporting contract.

Review code read-only. Group findings by file with location, violated guideline, concrete impact and remedy. Confirm suspected issues in context and mark behavior inferred from code versus observed at runtime. Record the source pin, files reviewed and unavailable evidence. Say “no findings in the checked scope” when appropriate; that does not certify the whole application.

Apply universal web behavior directly where relevant. React JSX, controlled inputs, hydration and `<Link>` guidance apply only to matching stacks. `priority`, `nuqs`, Tailwind utility names and named virtualization tools are examples rather than required dependencies. Compare list cost to measured needs; the snapshot's >50 threshold is a heuristic. Native semantic controls normally provide keyboard activation without custom handlers; add handlers only when the interaction requires them.

Reconcile preferences with the project's existing design and accessibility requirements. Typography/capitalization, URL state, autocomplete policy and animation restrictions are recommendations whose applicability needs context. Generic snapshot rules do not establish a WCAG violation or justify disabling expected browser behavior. Report a conflict with the product standard rather than silently replacing it. User-supplied runtime evidence can supplement this file review. New runtime inspection, tests and application edits require their own authorized workflow.

Snapshot provenance, original licence and byte identity are recorded in [provenance](references/provenance.md). Refreshing it is a separate pinned review change, never a fetch during invocation. No Vercel skill wrapper, installer or runtime integration is included.
