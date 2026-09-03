# Contributing to Kaidera Skills Marketplace

Thank you for your interest in contributing! This guide explains how to submit skills, what format to use, and how the review process works.

Read the [Kaidera Skills Catalogue and Operating Guide](docs/KAIDERA-SKILLS-CATALOG.md)
before adding or changing a skill. It defines portfolio role, routing,
operating posture, overlap handling, and current release holds.

## Ways to Contribute

### 1. Submit a New Skill (Pull Request)

1. Fork this repository
2. Select the appropriate category (`skills/development/`, `skills/devops/`, etc.)
3. Add one `your-skill-name.SKILL.md` file
4. Add its full functional entry, reviewed posture, and metadata row to the
   canonical skills catalogue
5. Run `npm test` and the strict/security catalogue checks
6. Open a pull request against `main`

### 2. Target Kaidera Platform Submission (not verified here)

The intended platform workflow is listed below. This repository does not prove
the live importer, vetting queue, or admin UI; verify those behaviours against
the exact platform source and runtime.

1. Go to **Skills Management** in the admin panel
2. Click **Add Skills**
3. Paste your GitHub repo URL or enter your skill content directly
4. The platform will parse, vet, and queue your skill for review

### 3. Improve Existing Skills

- Fix bugs in skill prompts or code
- Improve instructions for clarity
- Add missing test cases or examples
- Update dependencies or prerequisites

### 4. Report Issues

Found a skill that doesn't work? [Open an issue](https://github.com/Kaidera-AI/skills/issues) with:
- Which skill has the problem
- What you expected vs what happened
- Your agent/platform version

## Skill Format

Every skill must follow the [SKILL_FORMAT.md](spec/SKILL_FORMAT.md) specification.

### Minimum Required Fields

```yaml
---
name: your-skill-name          # Lowercase, hyphenated
version: 1.0.0                 # Semantic versioning
description: What the skill does
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
author: Your Name
license: Apache-2.0
updated: 2026-08-24
tags: [tag1, tag2]
safety_constraints:
  - State a concrete safety boundary.
---

## Instructions

Your skill content here...
```

Skills are Markdown instructions. Declare every required platform tool under
`kaidera.capabilities_required`; do not embed executable Python in the skill.

### File Naming

- Use lowercase with hyphens: `code-review.SKILL.md`
- Place in the correct category folder: `skills/development/code-review.SKILL.md`
- One skill per file

### Attribution Fields (Optional but Encouraged)

```yaml
attribution_author: Original Author Name
attribution_url: https://github.com/original-author/repo
attribution_notes: Based on the XYZ methodology by Author Name
```

## Review Process

```
Your PR ──→ Strict Lint ──→ Static Scan ──→ Maintainer Review ──→ Source Merge
                │                   │                    │
                ▼                   ▼                    ▼
          Format valid?      No dangerous       Quality check:
          Fields present?    patterns found?     - Clear instructions
          YAML parses?       No credential       - Tested examples
                             leaks?              - Proper attribution
```

### What We Check

1. **Format** — Valid YAML frontmatter, required fields present
2. **Security** — No selected prompt-injection or credential signatures; this
   bounded scan is not a complete sandbox or semantic security review
3. **Quality** — Clear description, useful instructions, working examples
4. **Attribution** — Original authors credited if building on existing work

Passing repository CI does not satisfy the held runtime-sandbox or
human-signing/provenance gates. A source-merged skill remains ineligible for
trusted runtime use until those independent approvals exist.

## Licensing

The repository root currently carries **CC-BY-4.0**, while skill frontmatter may
declare a per-skill licence. The repository does not yet define a ratified
precedence rule for disagreement between them. Maintainers must resolve that
licensing hold before externally redistributing a disputed entry.

For material governed by a licence that permits reuse, contributors retain
their required credit and downstream users must follow its attribution and
other terms. Kaidera policy holds external redistribution of this source
candidate until root/per-skill licence and donor-provenance precedence is
ratified; a source merge is not release approval.

## Code of Conduct

- Be respectful and constructive in reviews and discussions
- Give credit where credit is due
- Don't submit skills that could harm users or systems
- Report security issues responsibly

## Questions?

- [Open an issue](https://github.com/Kaidera-AI/skills/issues) for questions about the format or process
- Visit [kaidera.ai](https://kaidera.ai) to learn more about the platform

---

**Thank you for helping build the Kaidera Skills Marketplace!**
