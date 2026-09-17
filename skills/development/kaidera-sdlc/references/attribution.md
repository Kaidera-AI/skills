# Attribution

`kaidera-sdlc` is Apache-2.0. Version 1.2.0 (2026-09-18) adopted ideas from a third-party
skills pack, `michaelshimeles/skills` at commit 4b72f46 (2026-09-17). No text from that pack is
reproduced here. The first draft of 1.2.0 tracked several of its sentences too closely; it was
pushed to a private review branch, an independent review caught it, and the references were
rewritten and the branch replaced before anything was merged or published.

| Component in the pack | Author and licence | What Kaidera took |
|---|---|---|
| `AGENTS.md`, `new-feature`, `code-structure`, `evidence-driven-testing` | Michael Shimeles; no licence file (all rights reserved) | ideas only: look for other agents' in-flight work before starting; a worktree does not isolate shared resources; keep orchestration and operational mechanics apart; record the old behaviour before fixing |
| `unslop` | Lauren Tan, via `cursor/plugins` (pstack); MIT | the idea of a checklist of machine-writing tells; Kaidera's list and wording are its own |
| `greploop`, `greploop-apps` | Greptile; MIT | the idea that a review-and-fix loop has a cap and an exit report |
| `before-and-after` | James Clements, via vercel-labs; PolyForm Shield 1.0.0 | idea only: a change is presented with its before and after side by side. No code, CLI or text used |

Earlier sources are credited in `SKILL.md` metadata (`sources`).
