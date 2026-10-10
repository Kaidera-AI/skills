# Emil specialist selection

Source: [Emil Kowalski's skills](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d), MIT. The following 14 upstream entries were inventoried at this revision. They are available selections for a future reviewed import; this adapter does not bundle or install them. Read the exact selected upstream body and its references before relying on specialized APIs.

| Upstream skill | Select for | Effect / boundary |
|---|---|---|
| `emil-design-eng` | Overall UI craft | This published adapter covers its general purpose with contextual guidance. |
| `animate` | Implement web motion | Writes motion; choose existing tokens and the smallest suitable mechanism. |
| `review-animations` | Review a bounded motion change | Review only; findings are not release approval. Upstream marks explicit invocation. |
| `improve-animations` | Audit motion across a codebase | Read-only improvement plans; implementation is separate. |
| `find-animation-opportunities` | Find worthwhile missing motion | Proposals only; reject motion with no functional purpose. |
| `animation-vocabulary` | Name a described effect | Terminology, no implementation. |
| `apple-design` | Physical, gesture-driven web UI | Translate principles to the product; avoid imitating an entire platform. |
| `mobile-native` | Mobile web / PWA platform behavior | CSS, viewport, touch and safe-area guidance; confirm on real hardware. |
| `animate-expo` | React Native / Expo gestures and motion | Requires the native stack, not a web implementation. |
| `write-swift` | Swift implementation or concurrency review | Check the project's toolchain and deployment target first. |
| `pick-ui-library` | Requested frontend library selection | Upstream explicit-only; verify current package APIs, license and project compatibility. |
| `prototype` | Requested alternative UI prototypes | Upstream explicit-only; temporary variations, user selects the production design. |
| `break-ui` | Requested worst-case content stress | Deliberate demo data and scoped fixes; no unsolicited stress-test harness. |
| `ask-sonner` | Sonner-specific React toast work | Use only in an existing or explicitly chosen Sonner stack. |

Review choices: retain purpose-first motion, input feedback, interruption, reduced motion and device-specific honesty. Adapt donor absolutes to evidence: moving with a keyboard is not universally forbidden; properties alone do not guarantee GPU execution; timing depends on content and context. Remove donor readiness-only responses so a concrete user task starts immediately. Do not import auto-routing that installs libraries or overrides project controls.

This is original Kaidera text based on inspected upstream skill descriptions and core design, animation, review and mobile guidance. Upstream implementation/reference files remain under their original MIT license at the source link.
