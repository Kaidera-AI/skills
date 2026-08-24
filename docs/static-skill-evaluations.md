# Static skill evaluations

The repository carries a small, deterministic fixture layer for three bounded
skill contracts:

- `open-code-review`;
- `assumption-validation`; and
- `research-brief`.

This is **Gate 1/2-style static evidence only**. It does not invoke a model,
inject a skill into a runner, execute a tool, use a network service, install a
dependency, access a credential, write to a target repository, or enter a
capability sandbox. A passing result is not behavioural routing proof and does
not change any skill from `unvetted`.

## Files and versioning

The machine contract is
[`spec/static-skill-eval.schema.json`](../spec/static-skill-eval.schema.json).
Human-editable fixtures live under `evals/static-routing/v1/`, one suite per
skill. A fixture binds:

- the exact skill path and expected `unvetted` tier;
- expected declared capabilities and a capability ceiling;
- `no_write` and `no_network` assertions;
- lower-case literal phrase groups for candidate and safety-boundary matching;
- positive, negative/abstain, collision, and optional boundary prompts; and
- the exact expected route, abstention, or `manual-only` result.

Breaking changes require a new schema ID, evaluator profile, and fixture
directory such as `v2`; do not silently reinterpret v1 fixtures.

## Deterministic dry-run

`kaidera-static-routing-v1` normalises Unicode with NFKC, lower-cases it, and
collapses whitespace. Each phrase group is an all-of literal match; groups are
alternatives. The evaluator then applies this fixed precedence:

1. a safety-boundary match returns `manual-only`;
2. more than one route candidate returns `manual-only` with a collision reason;
3. one candidate returns that exact skill route; and
4. no candidate returns `abstain`.

This deliberately simple classifier makes fixture drift visible. It is not the
Kaidera runtime router and cannot predict how a model or host loader will behave.
`manual-only` means the static case must not be auto-routed by this dry-run; it
does not itself confer human approval or authorise execution. `abstain` means
only that no v1 literal rule matched.

Rules and expected outcomes intentionally co-reside in a reviewable fixture.
The validator requires every rule to be exercised, but a coordinated edit can
still redefine both the rule and its expected result. Review fixture diffs as
contract changes; the fixture is a regression specimen, not an independent
oracle.

The validator also checks the current skill frontmatter against its declared
ceiling. Under these suites, `tool:file_write`, `tool:web_search`, and
`tool:mcp_external` are forbidden. An `allowed_domains` entry is documentation
and validation metadata; it does not grant network access.

## Bounded semantic lint

The evaluator fails on high-confidence read, write, install, or network commands
inside explicitly labelled shell fences when they contradict a fixture's
capability contract. It intentionally ignores ordinary prose, JSON/text fences,
dynamic shell construction, library calls, tool aliases, and natural-language
instructions. This keeps the check deterministic and limits obvious false
positives, but it also leaves false negatives. It is not SAST, prompt analysis,
command authorisation, or runtime enforcement.

Because the static lint is incomplete, its success cannot prove `no_write` or
`no_network`. Those assertions become enforceable only in a separately
ratified runtime capability sandbox.

## Run

```sh
npm run eval:static
npm run eval:static -- --json
npm test
```

The JSON report is deterministic and contains fixture/skill SHA-256 receipts,
but those hashes are not signatures, provenance, or approval evidence.

## Holds

- **Gate 3 HOLD:** no live isolated runner proves tool, filesystem, process, or
  network containment, and no model behaviour is exercised.
- **Gate 4 HOLD:** no ratified human trust root, signing, provenance, or review
  approval is established.
- **Loader HOLD:** same-name/source collisions such as the Alibaba and Kaidera
  `open-code-review` skills still require source-qualified mutual exclusion in
  the host loader; prompt fixtures cannot repair an injection collision.

All evaluated skills and all marketplace entries remain `unvetted`.
