# Evidence

Read this in the Verify stage and whenever you write a return. It extends non-negotiable 4
("verification is output that can fail") with what Kaidera has learned about receipts.
Credits are in `references/attribution.md`.

## 1. A receipt has an identity

A receipt names the thing it is about: the commit, the host, the deployment, the object. "The
suite passed" is a claim; "5,141 passed on 590ea2ca77, exit 0" is a receipt. For anything that
moves or publishes bytes, the receipt is read at the destination: the object's size and
digest, the registry's version, the version string the installed program prints. The mover's
exit code proves nothing. Kaidera has seen an upload exit 0 with no object at the other end
(2026-09-17).

Read a receipt before you send it. A SHA, a count or an id that was computed into a variable
by a command that failed is still a value, and it is wrong.

## 2. Reproduce first, then change

Where existing behaviour changes, record the old behaviour while you are reproducing it and
before you touch the code. For a defect that record is the failing test of non-negotiable 5;
for something a person sees or measures, it is a capture or a number. Record the new behaviour
the same way on the final tree, and put the two side by side in the return. Where nothing
existed before (a new surface, a document, a pure addition) write "no before: new surface"
and give the after alone.

## 3. What proves what

| Kind of change | What to show |
|---|---|
| Something a person sees | the real session, captured before and after; repeat the check two or three times |
| An API or a performance change | a small script that measures (counts, latency, size) with its output kept in a file, run before and after |
| Rendering, document processing, extraction | the produced artifact and an assertion on its content, not a statement that it rendered |
| Agent behaviour | the part of the transcript where the tool is called and answered |
| Moving, publishing or installing bytes | identity at the destination (section 1) |
| A defect fix | the failing test committed first, then the same unedited test passing |

## 4. Limits

- Evidence is added to the repository's own checks (type check, build, tests, fitness gates).
  It does not stand in for them.
- Make sure the process, port, host and database you measured are the ones you meant. On a
  shared machine they often are not.
- A scripted, synthetic or assembled run is labelled as such. If a live run is not possible,
  say so and show what could be run.
- Secrets, tokens, customer data and payment details are kept out of captures. A flow that
  cannot be shown without them is reported as untested, with the reason and the name of who
  can test it.
- An emulated environment is not a gate surface. On 2026-09-17 two emulated probe runs failed
  and one passed on the same day (`Program/KAI_ADJUDICATION_2026-09-18.md` section 7); the
  difference was the emulation. Probe on the real target class, or in CI on a native runner.

## 5. In the return

Give the command and its literal output, or the file by path and SHA. Say what was not
verified and why. A step declined for a stated reason is a judgement the lead can work with;
"done" without a receipt is a defect.
