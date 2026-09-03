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
Human-editable fixtures live under `evals/static-routing/v2/`, one suite per
skill. A fixture binds:

- the exact skill path and expected `unvetted` tier;
- expected declared capabilities and a capability ceiling;
- `no_write` and `no_network` assertions;
- lower-case, boundary-aware literal phrase groups for candidate and
  safety-boundary matching;
- positive, negative/abstain, collision, and outcome-distinguishing boundary
  prompts for every manual-only rule; and
- the exact expected route, abstention, or `manual-only` result.

Breaking changes require a new schema ID, evaluator profile, and fixture
directory such as `v3`; do not silently reinterpret v2 fixtures. The evaluator
discovers fixture files recursively and fails closed on files outside its exact
profile directory, while CI watches every profile directory recursively.

Fixtures, the schema, and `package-lock.json` must be strict native JSON with
unique keys and no UTF-8 BOM. Every repository path component used for schema,
fixture, or skill reads must be a non-symlink path contained by the selected
repository root.

## Deterministic dry-run

`kaidera-static-routing-v2` normalises Unicode with NFKC, lower-cases it, and
collapses whitespace. Each phrase group is an all-of literal match; groups are
alternatives. A phrase beginning or ending in a letter, number, or underscore
must meet a corresponding token boundary, so `preview` does not match `review`
and `browser` does not match `browse`. The evaluator then applies this fixed
precedence:

1. a safety-boundary match returns `manual-only`;
2. more than one route candidate returns `manual-only` with a collision reason;
3. one candidate returns that exact skill route; and
4. no candidate returns `abstain`.

This deliberately simple classifier makes fixture drift visible. It is not the
Kaidera runtime router and cannot predict how a model or host loader will behave.
`manual-only` means the static case must not be auto-routed by this dry-run; it
does not itself confer human approval or authorise execution. `abstain` means
only that no v2 literal rule matched.

Rules and expected outcomes intentionally co-reside in a reviewable fixture.
For every individual route rule, removing that rule must change at least one
declared positive case away from that skill's route. Removing every individual
manual-only rule must similarly change at least one declared boundary case away
from a safety-boundary outcome. Same-list and cross-skill subsumption is
rejected when it makes a rule non-distinguishable, and a manual rule may not
subsume and permanently shadow a route rule. A coordinated edit can still
redefine a rule and its expected result, so review fixture diffs as contract
changes; the fixture is a regression specimen, not an independent oracle.

The validator also checks the current skill frontmatter against its declared
ceiling. Under these suites, `tool:file_write`, `tool:web_search`, and
`tool:mcp_external` are forbidden. An `allowed_domains` entry is documentation
and validation metadata; it does not grant network access.

## Bounded semantic lint

Every executable line inside an explicitly labelled shell fence requires the
skill to declare `tool:code_interpreter`. The evaluator classifies a bounded
vocabulary of direct shell, PowerShell, Git, package-manager, file-read,
file-write, install, and network commands. Unknown executables, unknown Git or
package-manager modes, and dynamic `find -exec` forms fail closed. Ordinary
prose, JSON/text fences, library calls, tool aliases, dynamic construction
outside a direct command line, and natural-language instructions remain outside
scope. This is not SAST, prompt analysis, command authorisation, or runtime
enforcement.

Because the static lint is incomplete, its success cannot prove `no_write` or
`no_network`. Those assertions become enforceable only in a separately
ratified runtime capability sandbox.

## Run

```sh
npm run eval:static
npm run eval:static -- --json
npm test
```

The JSON report is deterministic and hashes exact raw evaluator, evaluator
support-file, schema, package-lock, fixture, and skill bytes. An ordered bundle
hash covers the evaluator, shared skill parser, strict validator, and validator
pattern document. The report also records the Node runtime and resolved package
versions, package-manifest hashes, and deterministic installed-package tree
hashes for AJV, YAML, and their locked dependency set. Repository implementation
bytes must match the running modules, and dependency versions must match the
lock, before the result can pass. These receipts identify the exact on-disk
interpretation inputs checked during one run; they are not an atomic
process-memory attestation, signature, provenance, or approval evidence.

## Holds

- **Gate 3 HOLD:** no live isolated runner proves tool, filesystem, process, or
  network containment, and no model behaviour is exercised.
- **Gate 4 HOLD:** no ratified human trust root, signing, provenance, or review
  approval is established.
- **Loader HOLD:** same-name/source collisions such as the Alibaba and Kaidera
  `open-code-review` skills still require source-qualified mutual exclusion in
  the host loader; prompt fixtures cannot repair an injection collision.

All evaluated skills and all marketplace entries remain `unvetted`.
