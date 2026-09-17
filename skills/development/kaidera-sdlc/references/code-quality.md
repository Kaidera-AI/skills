# Code quality: keep policy and plumbing apart

Read this in the Build stage. It is about shape; linters own style. It applies THE_WAY's
architecture vocabulary (domain, ports, adapters, §2 and §3) to everyday code. Credits are in
`references/attribution.md`.

## 1. Policy and plumbing

- **Policy** is what a flow means to the product: the business rule, who may do it, which
  state follows which, how a failure is classified, what the person is told. It lives in the
  domain and in the routes, commands and handlers that drive it.
- **Plumbing** is how an operation is carried out dependably: talking to a provider or an SDK,
  running a command, waiting for readiness, parsing, reading and writing. It lives behind a
  port, in an adapter or a shared helper.

Policy calls plumbing. Plumbing never decides policy and never writes domain state on its own.
When a bug fix has to be made in three places, plumbing was copied instead of shared, or
policy leaked into it.

## 2. What good plumbing looks like

- Small functions that each do one operation, so a caller can combine them and choose how
  strict to be. Not one call that does the whole flow.
- Everything it needs comes in as arguments. It does not read global state, query the
  database for context, or discover configuration on its own. The one exception is looking up
  a credential by name at the adapter's edge (design 41).
- It returns a result the caller can branch on, with the facts in it (what is ready, where,
  which identifier), and it reports failure instead of absorbing it. The caller decides what
  the failure means.
- One convention for arguments and errors across a module.

## 3. When to share code

THE_WAY principle 5 governs: rule of three, and duplicate rather than adopt a wrong
abstraction. Share plumbing when a third caller appears, or sooner only when two copies have
already drifted and caused a defect. Declared ports are exempt from the "one implementation"
smell: a port exists where a swap is genuinely expected (THE_WAY §3).

When you do share: write the flow where it is used first; mark what is operational and free
of policy; move that one piece; switch a single call site and prove it; then switch the
others. Policy stays where it was. Finish with the type check, the linter and the tests of
every flow you touched.

## 4. Smells to name in review

| Smell | What goes wrong |
|---|---|
| Everything-function | the whole flow in one call; nothing can be reused and every caller inherits every side effect |
| Plumbing that writes policy state | a shared helper updates domain tables or status; a change for one flow breaks another |
| Every call its own dialect | argument order, naming and error reporting differ function to function; callers guess |
| Abstraction ahead of need | a helper or interface with a single user, outside the declared ports |
| Second implementation | one fact computed in two places; fix by deleting one (one owner per fact) |
| Baked value | a model id constant in an execution path: configuration decides, and when nothing is configured KOS passes no model so the provider's default applies (design 38). Hosts, paths, buckets and keys have no default at all: fail closed |
| Silent default | configuration that is declared but never read, losing to a constant; prove the effect, not the declaration |
| Swallowed failure | an exit code or exception dropped, so the next stage reports success with nothing delivered |

## 5. The smallest change that works

Use what exists before adding: the standard library, a platform feature, a dependency already
installed. No scaffolding for later. Logic with a branch, a loop or a parser leaves one
runnable check behind that fails when it breaks. None of this licenses dropping input
validation at a trust boundary, error handling that prevents data loss, a security measure, or
anything that was asked for.

## 6. Questions for the plan and for the structure pass in review

1. For each changed file: is it policy or plumbing, and does any call run from plumbing up
   into policy?
2. Is operational logic now present in more than one place? Is anything shared that has fewer
   than three users and is not a declared port?
3. Does each new piece of plumbing take its inputs as arguments and return a result a caller
   can branch on?
4. Is a model id baked, or does any host, path, bucket or key have a default?
5. Where does a failure surface, and which layer gives it meaning?
