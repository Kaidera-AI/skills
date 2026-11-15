---
name: home-repo-workflow
description: Plan or carry out coordinated work across multiple repositories from a shared home workspace. Use when setting up a home repository, mapping repositories and shared instructions, or executing a cross-repository change; do not treat a navigation pointer as permission to change another project.
license: CC-BY-4.0
metadata:
  version: "1.0.0"
  risk_level: "medium"
  capabilities_required: ["tool:file_read", "tool:file_write", "tool:code_interpreter"]
  allowed_domains: ["www.aihero.dev"]
  updated: "2026-11-15"
  tags: ["repositories", "worktrees", "coordination"]
  attribution_notes: "Original workflow informed by the home repo pattern; no transcript is included."
  safety_constraints: ["Keep credentials and private information out of shared or public material.", "Respect each repository's ownership and action-specific authorization.", "Preserve in-flight work and repository-specific instructions."]
  attribution_author: "Matt Pocock"
  attribution_url: "https://www.aihero.dev/the-home-repo-pattern"
---

# Work across repositories from a home

A home repository is the shared entry point for navigation, common instructions and shared skills. Each product repository retains its own code, history, issue tracker, instructions and build commands. A pointer helps find a repository; it does not confer access or authority to modify it.

## Discover before reorganising

1. Inventory candidate repositories by path, purpose, remote, visibility and ownership. Mark each in or out of the proposed home. Read each selected repository's applicable instructions before changing it. Never open secret or credential files during discovery.
2. Inventory instructions, skills and agent-facing documentation. Classify each as shared, duplicate, repository-specific or separately installed. Compare duplicate versions before proposing a canonical owner; keep repository-specific material in its repository and installed material under its existing management.
3. Propose a mapping of current location to destination, a pointer list, verification and recovery steps. Identify cross-project approvals, private/public boundaries and open ownership decisions. Do not move, delete or publish material before the responsible owner accepts the plan and any applicable gate. Preserve provenance and licences.

## Navigate and work

Keep pointers concise: repository name and purpose, local path, clone source if missing, and any essential instruction such as reading its own agent instructions first. Group pointers by area when the list becomes hard to navigate. Do not put secrets or private internal details in a public home.

Use one branch and, where the project uses them, an isolated worktree per worker and concern in each affected repository. Check for active work and preserve local changes. Follow the owning project's branch and release rules. Where the project explicitly uses worker branches, a `prod` integration branch and `main` for release, preserve that order; do not assume those branch names exist elsewhere. Coordinate cross-repository changes as separate reviewable changes with compatible ordering and tests at each boundary.

## Finish with receipts

Report the repositories and paths inspected, changes made, branch and tested revision per repository, verification results, dependencies and remaining gates. Record any excluded or unavailable repository and why. Commit, push, open pull requests, merge or publish only with the authority applicable to that action; a request to inventory or plan does not authorize them.

Method adapted in our own words from Matt Pocock, [The Home Repo Pattern](https://www.aihero.dev/the-home-repo-pattern).
