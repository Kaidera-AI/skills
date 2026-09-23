# AI+Human Code Review

Every code change receives both an independent AI review and an independent human
review before integration/release. For all other AI-created or materially changed
files, the human file-review record is still mandatory. QA tests behavior; it is not
another name for code review.

## Inputs and independence

The review packet is frozen to: task/spec/plan revision, change record, base and tip
or stable artifact hashes, complete changed-file inventory, relevant surrounding
context, acceptance criteria, tool/test evidence, risk and security notes, and known
limitations. If files, generated output, policy, or material configuration changes,
the relevant reviews and evidence must be repeated.

The author cannot issue the independent AI or human verdict. the independent code reviewer cannot review her
own generated work. The named human reviewer must authenticate and record their own
decision. For conflicts, route to another qualified reviewer. High-risk domain
changes may require a second domain approver; specify this at planning.

The development deployment selects one supplemental code-review application through
the independent reviewer's [once-per-project setup](../templates/review-tool.md). It is an additional advisory source, not a replacement for
the independent reviewer's exact-revision review or the human review gate. Human approval of repository
access, data processing, cost, and scope is required before connection. Disable
AI approvals that satisfy a human gate and source-content/branch/admin writes; allow
only separately approved comment/check reporting. Re-check vendor settings and
terms before enabling and whenever the integration materially changes.

## AI reviewer pass (the independent code reviewer or an independent equivalent)

1. Confirm scope and exact frozen revision; inspect the complete diff and relevant
   context, not only a summary or selected files.
2. Check correctness and design against the accepted requirements/contracts; look for
   regressions, edge/failure cases, compatibility, error handling, and complexity.
3. Assess authorization, data handling, injection, secrets, privacy, concurrency,
   resource limits, dependency/supply-chain, performance, accessibility, logging,
   and operability where relevant.
4. Check tests and verification evidence for the same revision. Identify untested
   paths and misleading or weak evidence.
5. Report actionable findings with file/location, condition to reproduce, consequence,
   evidence, severity, and a minimal suggested fix. Separate blocking defects from
   questions and non-blocking preferences.
6. Revisit all findings against any new revision; close only with evidence.

Prefer approving a change once it clearly improves the codebase and satisfies
requirements; avoid blocking on subjective style preferences. The accepted formatter,
linter, style guide, and design conventions govern deterministic style issues.

## Human file-review pass

The human reviewer independently checks the inventory and relevant contents of every
AI-created/materially changed file—not just the AI summary or the independent reviewer's conclusion.
Review confirms: correspondence to the accepted plan; no unrequested scope; factual
and design correctness; risks and findings understood; automated evidence is relevant
to the exact revision; generated files/configuration/docs are complete; sensitive data
is not exposed; and required approvals/QA are present. The reviewer may use AI
assistance, but must personally inspect and own the decision.

Allowed decisions are **APPROVE**, **REQUEST CHANGES**, or **REJECT**. Each has
reviewer identity, date, exact revision/hash, files covered, linked AI findings and
evidence, rationale, conditions, and outstanding risks. A human approval cannot be
pre-filled or inferred. The record template is
[`templates/human-review.md`](../templates/human-review.md).

## Finding treatment

Use the project's severity definitions. At minimum, unresolved security/privacy,
data loss/corruption, authorization bypass, serious functional defect, or broken
public compatibility blocks integration/release. Medium findings require a fix or an
explicit human disposition by the policy owner. Low-priority suggestions may be
non-blocking if recorded. The author fixes in a new revision; reviewers do not edit
the submission to make their own review pass. No bypass or silent finding deletion.

## Review completion contract

Review must state verdict, exact revision and base/range, files covered/excluded and
why, findings by severity, checks/evidence relied upon, policy version, reviewer
independence, unresolved risk, and the next action. “No findings” does not mean
“requirements met”; the reviewer must say what was examined. Human review, QA,
change authorization, and release remain separate outcomes.

## Industry practice reference

The procedure adapts [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)
for a dual AI+human workflow. The AI pass improves coverage; only the authenticated
human records the human review decision.
