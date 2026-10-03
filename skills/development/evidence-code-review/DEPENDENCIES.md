# Portable contract resources

This directory ships the exact report schema and semantic verifier pinned in
SKILL.md. It preserves the existing v4 report format and helper filenames.
The dependencies are pinned in package.json and package-lock.json; the helper
requires Node 20 or newer and those already trusted dependencies. The universal
skills CLI copies resources; it does not install Node dependencies. Dependency
installation belongs to the project operator's approved process. Do not fetch,
install or run a helper automatically during a review. When the verifier or its
trusted dependencies are unavailable, report that limit and use the documented
Markdown degradation; JSON acceptance is unavailable.

Catalogue name migration does not change active Cortex bindings or the report
schema contract. Source, independent review, installation and runtime approval
remain separate gates. Root/per-skill licence precedence remains held.
