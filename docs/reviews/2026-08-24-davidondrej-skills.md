# David Ondrej Skills Review and Kaidera Adaptation Plan

Status: source review complete; two local adaptations are unvetted and remain
subject to the repository's held Gate 3 and Gate 4 controls.

## Evidence boundary

- Donor repository: `davidondrej/skills`
- Reviewed commit: `69c3ae5228eb146724fd23dac3d43eab5805bcc3`
- Reviewed tree: `f3aa173e74e530dc089d6b409802ece10932df2a`
- Checkout state: clean; commit unsigned
- Donor licence: MIT, Copyright 2026 David Ondrej
- Inventory: 53 skills; all frontmatter names parsed and matched their paths
- Codex sidecars: 20 parsed; all 17 manual-only skills declared
  `policy.allow_implicit_invocation: false`
- Missing donor evidence: no CI workflows or routing/execution evaluation suite;
  the private-source and mirror fingerprints in the repository are self-claims
  rather than independently verifiable provenance.

This was a read-only source review. No donor hook, vendor API, production
system, credential, scheduled task, or installer was executed.

## Verdict

Do not bulk-import this repository. Use it as a research donor:

| Disposition | Count | Meaning |
|---|---:|---|
| Direct adopt | 0 | No skill meets Kaidera's authority, portability, test, and provenance bar unchanged. |
| Rebuild or selectively adapt | 12 | Useful concept, but the execution and safety contract must be rewritten. |
| Reject from this library | 41 | Duplicates Cortex, widens authority/access, binds a vendor, or is incomplete/personal. |

## First-wave adaptations

### 1. `assumption-validation`

Donor: `risky-changes`.

Preserved ideas:

- distinguish implementation correctness from evidence that a product choice is
  valid;
- state assumptions explicitly and make them falsifiable;
- compare real evidence with thresholds declared before the result; and
- retain human ownership for customer-visible, pricing, billing, and policy
  decisions.

Removed or replaced:

- mandatory DeepAPI use and credential handling;
- automatic paid calls and fixed research spend;
- universal 10–20 case counts;
- implicit production-data access; and
- automatic post-deployment surveillance.

The Kaidera version is instruction-only, has no network/write capability, and
cannot authorise production access, implementation, release, or monitoring.

### 2. `research-brief`

Donor: `research-prompt`.

Preserved ideas:

- lead with the decision rather than a broad topic;
- give a researcher enough context to work without conversation history;
- prefer primary sources and expose contradictions and evidence gaps; and
- run a final counterexample and coverage pass.

Removed or replaced:

- DeepAPI execution and vendor dependency;
- the hard single-paragraph requirement; and
- any implication that drafting the brief authorises external research,
  spending, scheduling, or publication.

## Second-wave donors, not imports

- Fold the routing, progressive-disclosure, evaluation, and lifecycle-security
  lessons from `effective-agent-skills` into Kaidera's existing skill-creator and
  repository QA. Do not add a competing skill-creator.
- Combine `ask-then-build`, `before-building`, `brain-to-docs`, `decisions`, and
  `next-decision` into one later manual `decision-gate`. Five overlapping skills
  would create ambiguous routing.
- Revisit `teach` plus `level-up` only as a bounded `learning-workspace` design.
  Use Matt Pocock's original MIT source as the primary donor and preserve both
  provenance trails.
- Rebuild any command guard or Safe Browsing workflow from current official
  platform documentation. David's hook is useful defence-in-depth, not an
  enforceable security boundary.

## Complete donor classification

Rebuild or selectively adapt (12):

- `global-agent-guardrails`
- `google-safe-browsing`
- `risky-changes`
- `research-prompt`
- `effective-agent-skills`
- `ask-then-build`
- `before-building`
- `brain-to-docs`
- `decisions`
- `level-up`
- `next-decision`
- `teach`

Reject from this library (41):

- Orchestration/runtime duplication: `agent-self-scheduling`, `bb-plugins`,
  `bb-subagents`, `cmux`, `codex-subagent`, `corral-launch-agents`,
  `git-worktree`, `goal-loop`, `handoff`, `herdr`, `launch-subagent`,
  `render-images-in-cursor`.
- Review duplication or external routing: `fable-review`, `gpt-review`,
  `total-review`.
- Unsafe or access-dependent: `fable-safe-prompt`, `run-deep-swe`,
  `agentic-productivity-setup`, `anti-sleep`, `create-readonly-db-role`,
  `github-outside-sandbox`, `macbook-metrics-setup`, `nuke-cursor-app`,
  `pi-custom-model`.
- Vendor, credential, or data-egress dependent: `browser-harness`,
  `deep-research`, `deepapi`, `fireflies-transcript`, `online-shopping`,
  `pi-web-search`, `twitter-alpha`, `youtube-transcript`.
- Global mutation or Cortex conflict: `distribute-skill-to-all-agents`,
  `folder-specific-claude-and-agents-md`, `push-skill-to-github`.
- Personal, draft, or redundant: `setup-help`, `prompt-me`, `read-all-adrs`,
  `remind`, `short`, `stop-overthinking`.

## Material donor risks

- The command hook fails open when `jq`, input, or its pattern file is missing.
  Its tests deliberately allow direct-main pushes, force-with-lease, pull-request
  merges, secret writes, and Docker pruning. Treat hooks as guardrails, not
  authorisation. The underlying Codex mechanisms are real—official documentation
  describes [`~/.codex/hooks.json` and `PreToolUse`](https://developers.openai.com/codex/hooks)
  plus [`agents/openai.yaml` invocation policy](https://developers.openai.com/codex/build-skills)—but
  that does not make David's particular denylist a security boundary.
- `deepapi` can send feedback and install a daily updater.
- `create-readonly-db-role` makes future tables readable and suggests
  `BYPASSRLS`; neither is a generally safe read-only contract.
- `git-worktree` copies `.env` and secret files.
- `folder-specific-claude-and-agents-md` creates an `AGENTS.md` symlink and
  conflicts with Kaidera's Cortex-generated authority pointer.
- The portfolio is heavily environment-bound: 22 skills contain home-relative
  paths, 12 are Mac-specific, 14 reference DeepAPI, and 26 name particular
  clients or models.

## Comparable libraries and projects

| Source | Useful role for Kaidera | Constraint |
|---|---|---|
| [OpenAI `plugins` at `11c74d6`](https://github.com/openai/plugins/tree/11c74d6ba24d3a6d48f54a194cd00ef3beea18f9) | Current Codex plugin/skill packaging, hooks, manifests, and sidecars | Inspect licence and trust per plugin; this supersedes the deprecated examples repository. |
| [OpenAI `skills` at `49f948f`](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431) | Historical examples and per-skill references | Repository is deprecated; licences differ by skill. |
| [Anthropic `skills` at `3b3fad9`](https://github.com/anthropics/skills/tree/3b3fad96af16a10759d930941b4520ba0c40edae) | Format and production workflow patterns | Mixed Apache-2.0 and source-available content; inspect each folder. |
| [Obra `superpowers` at `b36e082`](https://github.com/obra/superpowers/tree/b36e0829c6d0140e93cfef2ca599b1b07d4a7797) | TDD, debugging, planning, verification, and review methodology | MIT, but much overlaps Kaidera; adapt only measured gaps. |
| [Trail of Bits `skills` at `311a784`](https://github.com/trailofbits/skills/tree/311a784a100db18b6f78c9960d594a95dcc3eef5) | Differential, specification, false-positive, and coverage-backed security review donors | CC-BY-SA-4.0; keep research-only or distribute separately unless share-alike obligations are resolved. |
| [Matt Pocock `skills` at `6654f6b`](https://github.com/mattpocock/skills/tree/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76) | Small composable engineering, research, learning, and decision workflows | MIT; prefer original upstream over derivatives. |
| [Agentic Awesome Skills at `50a74ca`](https://github.com/sickn33/agentic-awesome-skills/tree/50a74ca3ddea4a91a45bdc625f0e354b6e54f1b4) | Discovery and inventory only | Mixed licences and offensive capabilities; never bulk-import. |

Additional public catalogues such as `ellmos-ai/skills`,
`whobat/AI-Agent-skills`, `CODE-SAURABH/OpenSkills`, and
`carlkibler/agent-skills` are useful for discovery and taxonomy comparison, not
an import queue. None was accepted by this review; each candidate still needs
an exact-commit, per-skill licence, capability, routing, dependency, and
adversarial execution review.

## Recommended acquisition sequence

1. Keep `assumption-validation` and `research-brief` as the only first-wave
   source candidates. Their bounded, no-network/no-write contracts close useful
   gaps without importing a second orchestration plane.
2. Add deterministic routing, collision, abstention, and capability-ceiling
   fixtures as repository QA. Label that output `STATIC_CONTRACT_ONLY`; literal
   fixture success is not model behaviour, runtime isolation, or trust proof.
3. Rebuild one later `systematic-diagnosis` skill from the common MIT ideas in
   Matt Pocock and Obra only after the first-wave routing results are reviewed.
   Keep it focused on evidence-first debugging and do not duplicate the
   whole-codebase audit or code-review routes.
4. Keep Trail of Bits' requirement-to-implementation ledgers, variant analysis,
   and property-testing patterns as research donors until the CC-BY-SA-4.0
   distribution and derivative-work boundary is explicitly resolved.
5. Do not add another skill creator, agent scheduler, handoff framework, or
   command denylist. Fold useful lifecycle and evaluation lessons into the
   existing repository gates and Cortex authority instead.

## Existing catalogue capability backlog

The acquisition gate cannot be limited to the two new files. Existing
catalogue entries still demonstrate that manifest capabilities are not an
enforced description of their bodies:

- `performance-profiling` declares `risk_level: low` and no capabilities while
  showing bearer-token `curl`, live `kubectl` operations, interactive exec, and
  production-style profiling commands.
- `dependency-audit` declares `risk_level: low` and no capabilities while
  invoking registry-backed scanners, package-manager installs, `npx`, and
  report-file writes.

Those are examples, not a complete audit. Before any catalogue-wide runtime
binding, Kai should require a full body-to-capability reconciliation, split
instruction-only references from executable skills, and either narrow or
remove commands that exceed each declared boundary. The static fixture layer
can detect selected explicit examples, but only a separately qualified runtime
sandbox can enforce filesystem, process, credential, and network limits.

For code-review capability specifically, keep Alibaba OpenCodeReview as an
architectural donor and compare it with PR-Agent, reviewdog, Danger JS, Google
Tricorder, Semgrep, and Vercel OpenReview. The Kaidera skill's differentiator is
not another comment bot: it is an exact-target, read-only review protocol with
canonical receipts, evidence-layer coverage, adversarial candidate validation,
and machine-verifiable verdict semantics.

## Why selective acquisition is mandatory

Recent ecosystem studies support a narrow source-by-source policy rather than
reputation or catalogue-size trust:

- [*What Keeps Agent Skills from Being Reusable?*](https://arxiv.org/abs/2608.08453) analysed 138,133 public
  `SKILL.md` files and reported that 91.8% contained at least one detected
  defect, led by routing, portability, packaging, and safety problems.
- [*Agent Skill Security: Threat Models, Attacks, Defenses, and Evaluation*](https://arxiv.org/abs/2607.13987)
  models risks across admission, retrieval, planner selection, execution, and
  evolution, rather than treating prompt-injection regexes as complete.
- [*GitSkills*](https://arxiv.org/abs/2608.10906) records 3,797,117 discovered files from 282,200 repositories,
  illustrating that copying and duplication are normal and provenance cannot be
  inferred from popularity.
- [*Agent Skills Can Be Harmful*](https://arxiv.org/abs/2608.11888) reports that apparently relevant skills can
  degrade task performance through excessive or mismatched procedure.

Kaidera should therefore score the exact candidate, not the repository brand:
router precision, one clear authority boundary, minimum capabilities, portable
paths and dependencies, exact provenance/licence, forward and negative evals,
and fail-closed runtime behaviour where tools are involved.

## Handback and acceptance gates

The two first-wave skills may be proposed to Kai only as `unvetted` source
candidates. Before runtime use or marketplace trust promotion, require:

1. exact-source review of the final commit and donor attribution;
2. routing and execution evaluations on positive and negative prompts;
3. Gate 3 capability-sandbox evidence, which this repository does not yet
   implement;
4. Gate 4 human approval, signing, and trusted provenance;
5. resolution of the repository-level CC-BY-4.0 versus per-skill licence
   precedence; and
6. explicit Kai approval for the catalogue-wide trust migration before cutover.

No source candidate, generated marketplace row, content hash, passing local
test, or local commit is publication, merge, runtime approval, or deployment
evidence.
