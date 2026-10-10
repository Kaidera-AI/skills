# Runtime and migration

Reviewed upstream: [GSD Core v1.16.0](https://github.com/open-gsd/gsd-core/tree/87e87d34b2d8519e30d1af7d910fc98f2af4bc8d), MIT. Its package is `@opengsd/gsd-core`; the reviewed engines require Node >=24 and npm >=10. Its `gsd-core` executable is an installer, while `gsd-tools` is the tools CLI. A similarly named executable is not proof of package identity.

Before using native commands, identify the installed version and runtime root from the project's actual package/lockfile and command help. Read the version-matching workflow. Upstream command names and harness paths differ; this adapter does not promise slash commands exist in the host.

For an old Get Shit Done installation:

1. Inventory the exact package, version, runtime paths, hooks and planning roots. Preserve the working tree and checkpoint artifacts.
2. Compare the approved GSD Core release's migration guidance and artifact grammar. Classify compatible artifacts separately from configuration, command or hook changes.
3. Propose the smallest migration, with rollback and a rehearsal in an isolated copy. Preserve task identity, requirements and prior evidence.
4. Apply the accepted migration; resolve stale pointers using the real installed paths. Record old/new versions and any unsupported state.

Cortex owns generated `AGENTS.md` and harness pointers. An upstream installer, updater or plugin may change those files, hooks or agent registries. Use the approved plain-file skill installation path; any native runtime integration requires its own compatibility review. Do not run upstream auto-update or treat its multi-agent defaults as dispatch authorization.

Source evidence: upstream `package.json`, `skills/gsd-resume-work/SKILL.md`, `gsd-core/workflows/resume-project.md`, `gsd-core/workflows/new-project.md` and phase workflows at the pinned revision. This is original Kaidera adaptation text; no upstream installer or code is bundled.
