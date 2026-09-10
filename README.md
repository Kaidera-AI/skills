# Kaidera Skills Marketplace

**Open-source skill manifests for AI agents, validated locally and published as a deterministic catalogue.**

Kaidera Skills Marketplace is a repository of reusable skills for agents on the [Kaidera Platform](https://kaidera.ai) and for any harness that reads a `SKILL.md`. A skill is a Markdown instruction set with a security manifest. Every skill here is `trust_tier: unvetted` today: it has passed the repository's local checks and nothing more. [What is implemented, and what is not](#what-is-implemented-and-what-is-not) says exactly what those checks are.

---

**Start here:** [Kaidera Skills Catalogue and Operating Guide](docs/KAIDERA-SKILLS-CATALOG.md)

## What Is a Skill?

A **skill** is one Markdown file, `{skill-name}.SKILL.md`, with a YAML frontmatter manifest followed by the instructions an agent reads:

- **What** it does (`description`, `tags`)
- **Which tools** it needs (`kaidera.capabilities_required`) and **which domains** it may reference (`kaidera.allowed_domains`)
- **How risky** it is (`kaidera.risk_level`) and **how far it has been vetted** (`kaidera.trust_tier`)
- **Who** wrote it, under which licence, building on whose work (`author`, `license`, `attribution_*`)
- **What it must never do** (`safety_constraints`)

Skills are instructions, not programs: the format carries no executable code and this repository runs none. The full schema is in [SKILL_FORMAT.md](spec/SKILL_FORMAT.md).

## Skill Categories

| Category | Description | Count |
|----------|-------------|-------|
| `context/` | Project and workspace awareness | 8 |
| `development/` | Code writing, review, testing | 13 |
| `devops/` | Deployment, infrastructure, CI/CD | 8 |
| `documentation/` | Specs, docs, changelogs, writing voice | 1 |
| `research/` | Research briefs, company research and evidence | 2 |
| `security/` | Auditing, scanning, incident response | 5 |

## What is implemented, and what is not

[SKILL_FORMAT.md](spec/SKILL_FORMAT.md) names four vetting gates. This repository implements the first two in bounded form and holds the other two. Nothing in this table is planned behaviour; it is what runs today.

| Gate | Policy | State in this repository |
|------|--------|--------------------------|
| 1 Schema lint | YAML schema, required fields, forbidden patterns | **Implemented (subset).** `node scripts/validate-skill.js --strict` on every skill: strict YAML with duplicate-key rejection, required and unknown fields, name/filename and category/path agreement, real calendar dates, capability-to-risk minimums, the domain allowlist, 1 MiB and symlink limits. A formal JSON Schema is still future work. |
| 2 Security scan | Injection and credential scan | **Implemented (subset).** The bounded regex set in `spec/skill-security-patterns.json`, applied by the validator and by `python3 scripts/security-scan.py`. It is not an LLM Guard scan and not a complete secret scanner. |
| 3 Sandbox test | Execution in a capability sandbox | **HOLD.** No skill is executed anywhere. `skill-sandbox-test.yml` runs contract tests and a catalogue dry run only. |
| 4 Human review | Reviewer approval, signing, provenance | **HOLD.** No reviewer root, no Cosign signing, no SLSA provenance. `signed_by`, `last_reviewed` and `reviewer` must stay empty; `skill-publish.yml` only reproduces the catalogue and fails on drift. |

What follows from the holds:

- Validation accepts only `trust_tier: unvetted`. The trusted tiers (`official`, `verified_partner`, `community_vetted`) are rejected until a ratified Gate 4 verifier exists.
- `unvetted` skills are browsable and can be copied into any harness, but they cannot be bound to platform agents; a tier label or a catalogue row is not runtime evidence.
- Passing CI proves the named local checks. It is not sandbox acceptance, expert review, a signature, or publication approval.
- The Kaidera Platform's import queue, vetting reports and approval screens are not verified by this repository; see [CONTRIBUTING.md](CONTRIBUTING.md), "Target Kaidera Platform Submission".

Also implemented: deterministic catalogue generation (`npm run generate` writes `.claude-plugin/marketplace.json` from the skill files; CI regenerates it and fails on drift), static routing evaluation for three skills (`npm run eval:static`, claim `STATIC_CONTRACT_ONLY`), and the catalogue tests that pin each skill's reviewed fingerprint (`npm test`). A skill projected from a canonical directory in another repository carries `kaidera.source` (repository, path, content hash) and is regenerated from that source, never edited here.

## Using a skill

Copy the `.SKILL.md` file into the place your harness reads skills from. The body below the frontmatter is the instruction text; the frontmatter says what the skill needs and what it promises not to do. Read the [catalogue](docs/KAIDERA-SKILLS-CATALOG.md) entry first: it records each skill's operating posture (bounded candidate, reference-only, manual-only, rework before use).

## Skill Format

Every skill follows the [SKILL_FORMAT.md](spec/SKILL_FORMAT.md) specification. A minimal valid skill:

```yaml
---
name: git-commit
version: 1.0.0
description: |
  Guides writing conventional commit messages following the Kaidera format.

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: low
  capabilities_required: []
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: your-github-name
license: Apache-2.0
updated: 2026-09-04
tags: [git, commits, conventions]

safety_constraints:
  - Read-only reference. No tool access required.
---

# Git Commit

Write commit messages following: `type(scope): description`
```

Check it before opening a pull request:

```bash
node scripts/validate-skill.js --strict skills/development/git-commit.SKILL.md
python3 scripts/security-scan.py skills/development/git-commit.SKILL.md
npm test
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the submission steps and the review process (strict lint, static scan, maintainer review, source merge).

**Ways to contribute:**
- Submit new skills via pull request
- Improve existing skills (bug fixes, better prompts)
- Report issues with skills that don't work as expected
- Suggest new skill categories

The repository root is licensed CC-BY-4.0 and each skill declares its own licence in its frontmatter; the precedence rule between the two is not ratified yet (see [CONTRIBUTING.md](CONTRIBUTING.md), "Licensing"). You retain credit as the original author.

## Attribution

This project uses the **Creative Commons Attribution 4.0 International** license. When we pull skills from external repositories, we:

1. **Credit the original author** in the skill's `attribution_author` field
2. **Link back** to the source repository in `attribution_url`
3. **Preserve** any additional license notes in `attribution_notes`

If you see your work here without proper credit, please [open an issue](https://github.com/Kaidera-AI/skills/issues) and we'll fix it immediately.

## Security

Two checks run on every skill, locally and in CI:

1. **Schema lint (Gate 1 subset)** — `scripts/validate-skill.js`: manifest shape, capability and domain declarations, forbidden patterns.
2. **Static scan (Gate 2 subset)** — `scripts/security-scan.py` and the shared pattern list in `spec/skill-security-patterns.json`: selected prompt-injection signatures, invisible Unicode, Base64 payload candidates, selected credential formats.

Not in place: sandboxed execution (Gate 3), human expert review with signing and provenance (Gate 4), and the runtime `<skills_context>` envelope, which belongs to the platform and is not verified here. Report a security problem in a skill by [opening an issue](https://github.com/Kaidera-AI/skills/issues); do not include exploit payloads in the report.

See [SKILL_FORMAT.md](spec/SKILL_FORMAT.md), "Vetting Pipeline Target", for the full policy and its current status.

## License

This repository is licensed under [CC-BY-4.0](LICENSE) (Creative Commons Attribution 4.0 International).

You are free to:
- **Share** — copy and redistribute skills in any format
- **Adapt** — remix, transform, and build upon skills for any purpose

Under the following terms:
- **Attribution** — You must give appropriate credit to the original author

---

**Kaidera - The Machine That Builds Machines**

[kaidera.ai](https://kaidera.ai) | [Platform Repo](https://github.com/Kaidera-AI/platform)
