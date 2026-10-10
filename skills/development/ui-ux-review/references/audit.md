# Web implementation audit

Inspect these dimensions for the requested target. Report what was checked and what lacks runtime evidence.

| Dimension | Evidence to collect |
|---|---|
| Accessibility | Semantic controls and names; keyboard order and escape; focus visibility and restoration; measured contrast in relevant states; errors and status announcements; text zoom/reflow; reduced-motion behavior. Source inspection alone cannot prove assistive-technology behavior or WCAG conformance. |
| Performance | Layout reads/writes, unnecessary dependencies, asset dimensions/loading, expensive effects, retained listeners and avoidable render work. Use actual profiling or measurements for performance claims. |
| Theming | Existing tokens, theme switching, contrast and native-control behavior in supported themes. A literal color can be intentional; verify context. |
| Responsive interaction | Overflow, content extremes, zoom, reachability, input modalities, hit targets and gesture alternatives. Measure against the project's accessibility standard; a design target is not automatically a standards violation. |
| Integrity | Consistent component patterns, truthful content, working actions, coherent product-specific hierarchy, and declared state behavior. Verify suspected shortcuts in their context. |

Separate deterministic failures from design judgment. Each issue needs a route/component/file location, reproduction or source evidence, user impact, severity and bounded fix. Cite a standard criterion only when checked against that criterion; generic 4.5:1 or 44px heuristics do not cover all exceptions or WCAG versions. An automated scan passing does not certify accessibility. Do not claim a detector was run; this adaptation bundles none.

Return checked dimensions, evidence/limitations, grouped findings and next actions. Optional dimension ratings use the same evidence and N/A rules as [critique](critique.md); a score is a prioritization aid.
