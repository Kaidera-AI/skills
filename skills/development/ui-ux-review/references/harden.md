# Harden an accepted UI scope

Build a state matrix for the actual task and supported devices. Use synthetic fixtures and isolated authorized environments; preserve real data and external accounts. Select applicable cases rather than introducing features such as offline storage, service workers or a new i18n framework by default.

| Area | Cases / behavior |
|---|---|
| Content | Empty, one item, long unbroken labels, multiline text, large numbers, supported scripts/emoji and large lists. Keep controls reachable and essential content discoverable after truncation. |
| Locale | Supported translation expansion, RTL logical layout, date/number/currency/plural formatting, and text zoom. Choose samples from actual supported locales. |
| Request state | Initial load, refresh, slow response, offline/timeout, validation, authentication, permission, not-found, rate-limit and server failure. Preserve input and offer an appropriate retry or recovery; keep credentials/server detail out of user errors. |
| Concurrency | Repeated submit, stale responses, optimistic rollback and update conflicts. A retry of a state-changing request requires its existing idempotency contract; UI disabling alone does not establish it. |
| Gestures | Track the active pointer; handle cancellation, capture loss, outside release and focus loss; verify the next interaction works. Provide keyboard/tap alternatives where applicable. Distinguish synthetic input from physical-device evidence. |
| Accessibility | Focus continuity through errors/modals, meaningful names/states, announcements, high contrast and reduced motion. Preserve browser zoom and paste. |
| Lifecycle | Clean up listeners, timers, subscriptions and obsolete requests; expose failure without disabling unrelated working areas. |

Keep server validation and authorization as existing backend contracts; client validation is user feedback. Surface a missing backend contract to its owner instead of expanding a UI task into a security implementation.

For each edited behavior, retain before/after evidence or reproduction steps and identify unrun checks. Add or run regression tests only when authorized. A case matrix with untested rows stays incomplete; it is not production-readiness proof. Finish with the changed states, remaining gaps and review gate.
