# Kaidera Skills Marketplace

**Open-source skills for AI agents — build, share, and collaborate.**

Kaidera Skills Marketplace is a community-driven catalogue of reusable skills for the [Kaidera Platform](https://kaidera.ai). Skills are modular instruction sets that teach agents new abilities—from code review to infrastructure deployment. Catalogue presence is not vetting approval; inspect each skill's trust and gate status.

---

## What Is a Skill?

A **skill** in this repository is one `*.SKILL.md` instruction document with
strict YAML frontmatter. It defines:

- **What** the agent can do (description, capabilities)
- **How** it does it (instructions and declared tool bindings)
- **When** it activates (workflow phases, triggers)
- **Who** created it (attribution, license)

Skills do not embed executable Python. A skill may request a declared platform
capability such as file reading or sandboxed code execution, but the runtime—not
the Markdown—owns and constrains that tool.

## Skill Categories

| Category | Description | Count |
|----------|-------------|-------|
| `context/` | Project and workspace awareness | 6 |
| `development/` | Code writing, review, testing | 10 |
| `devops/` | Deployment, infrastructure, CI/CD | 5 |
| `security/` | Auditing, scanning, incident response | 5 |
| `research/` | Research briefs and evidence planning | 1 |

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    SKILLS LIFECYCLE                           │
│                                                              │
│  1. CONTRIBUTE  ──  Author writes a *.SKILL.md               │
│  2. SUBMIT      ──  PR to this repo (or sync via platform)   │
│  3. CHECK       ──  Schema + bounded static security checks   │
│  4. REVIEW      ──  Platform admin reviews in Pending tab     │
│  5. APPROVE     ──  Only after the external sandbox/signing   │
│                     gates and human policy are satisfied      │
│  6. ATTRIBUTE   ──  Original author + declared licence kept   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### For Platform Users

1. Open the **Skills Management** page in the Kaidera admin panel
2. Click **Add Skills** and enter this repo URL (or any public GitHub repo with skills)
3. Skills are synced to the **Pending** tab for review
4. Review vetting reports, edit if needed, then **Approve** or **Reject**
5. Approved skills appear in the **Workbench** for agents to use

### For External Repos

You can sync skills from **any public GitHub repository** — not just this one. For example:

```
https://github.com/coreyhaines31/marketingskills
```

The repository catalogue discovers `*.SKILL.md` files. Any platform importer
that also supports other formats has a separate contract. **The original author
must be credited** via the attribution fields.

## Skill Format

Every skill follows the [SKILL_FORMAT.md](spec/SKILL_FORMAT.md) specification. Here's a minimal example:

```yaml
---
name: code-review
version: 1.0.0
description: Reviews a bounded change for concrete defects.
engenai:
  category: development
  trust_tier: unvetted
  risk_level: low
  capabilities_required:
    - tool:file_read
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""
author: Kaidera Team
license: Apache-2.0
updated: 2026-08-24
tags: [code-review, quality, security]
safety_constraints:
  - Read-only; do not edit or publish review comments.
---

## Instructions

When asked to review code, follow these steps:
1. Check for security vulnerabilities (OWASP Top 10)
2. Identify logic errors and edge cases
3. Suggest improvements for readability and performance
4. Verify test coverage for changed code
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- Submit new skills via pull request
- Improve existing skills (bug fixes, better prompts)
- Report issues with skills that don't work as expected
- Suggest new skill categories

The repository root currently carries CC-BY-4.0 while skill frontmatter can
declare a per-skill licence. The repository does not yet define a ratified
precedence rule for disagreement between those declarations. Treat that as a
licensing hold for external redistribution until the maintainers resolve it.

## Attribution

This project uses the **Creative Commons Attribution 4.0 International** license. When we pull skills from external repositories, we:

1. **Credit the original author** in the skill's `attribution_author` field
2. **Link back** to the source repository in `attribution_url`
3. **Preserve** any additional license notes in `attribution_notes`

If you see your work here without proper credit, please [open an issue](https://github.com/Kaidera-AI/skills/issues) and we'll fix it immediately.

## Security

The target security policy is a multi-gate pipeline. The repository currently implements only prerequisites:

1. **Strict catalogue validation** — YAML, capability, domain, integrity-shape, and schema checks
2. **Bounded static scan** — Pattern matching for selected prompt-injection and credential signatures
3. **Sandbox gate — HOLD** — no gVisor/capability execution proof is implemented in this repository
4. **Human signing/provenance gate — HOLD** — Cosign/SLSA and enforced reviewer trust roots are not active

No generated body hash or marketplace entry is sandbox/signing approval. See [SKILL_FORMAT.md](spec/SKILL_FORMAT.md) for the target policy and exact current status.
All current catalogue entries are therefore marked `unvetted`. Applying that
trust correction to an existing deployment can deactivate bindings; Kai must
approve the migration or provide preserved Gate 4 evidence before merge/cutover.

`open-code-review` additionally ships a versioned JSON report schema and a
canonical digest/semantic verifier. Structural schema success alone is not a
valid review verdict; machine reports must also pass
`node scripts/open-code-review-contract.js <report.json>`.

Three skills also have [versioned static routing fixtures](docs/static-skill-evaluations.md)
for exact positive, abstain, collision, capability-ceiling, no-write, and
no-network contracts. These deterministic dry-runs do not execute a model or
enforce a sandbox, do not prove behavioural routing, and do not promote trust.

## License

The repository root is licensed under [CC-BY-4.0](LICENSE) (Creative Commons
Attribution 4.0 International). Some skill manifests declare another licence;
see the unresolved precedence note above before external redistribution.

You are free to:
- **Share** — copy and redistribute skills in any format
- **Adapt** — remix, transform, and build upon skills for any purpose

Under the following terms:
- **Attribution** — You must give appropriate credit to the original author

---

**Kaidera - The Machine That Builds Machines**

[kaidera.ai](https://kaidera.ai) | [Platform Repo](https://github.com/Kaidera-AI/platform)
