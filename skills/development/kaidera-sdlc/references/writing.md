# Writing for the people who read our work

Commit messages, pull-request text, handoffs, returns, records, docs, code comments and
replies are all read by someone deciding what to do next. Go over what you wrote or changed
before it leaves your hands; text you did not touch is not yours to restyle. The idea of a
"tells" checklist comes from the unslop skill (MIT); see `references/attribution.md`. The rules below are
Kaidera's, written for operational text.

## 1. Remove what carries no information

- Praise and promotion for the work itself: "robust", "seamless", "powerful", "comprehensive".
- Warm-up and hedging: "it is worth noting", "in order to", stacked maybes. Say the thing, or
  say exactly what is unknown.
- Inflated verbs where "is", "has" or "use" would do.
- Authority without a source: "best practice", "industry standard". Cite the rule, the
  document or the measurement, or drop it.
- Shape for its own sake: lists padded to three, a bold label repeating its own sentence,
  headings on a five-line note, emoji as decoration.
- Conversation left in a document: greetings, thanks, closing offers.
- Dash-joined clauses, colons in mid-sentence and arrows in prose. Write two sentences.

## 2. Say what happened

- Put the number where the adjective was: "p95 went from 2.1 s to 0.4 s", not "much faster".
- Name who did it: "the API validates the query", not "the query is validated". The reader of
  a return needs the actor, and the passive voice removes it.
- One idea to a sentence. One name for one thing, repeated.
- Outcome first. The opening line of a return or a commit says what changed or what was
  found; background follows.

## 3. Operational text is not an essay

Advice written for essays asks for opinion, rhythm and a little disorder. A receipt, a handoff
or a record wants the reverse: exact identifiers, literal output, and uncertainty stated as
"not verified: X, because Y". Add nothing for colour. Where a decision is being asked for, do
give a recommendation; options without one hand your work to the reader.

## 4. Commits and handoffs

- Commit subject: what changed, imperative mood. Body: why, and the proof.
- Handoff: `references/team.md` section 4 gives the order. Keep to the channel's limits and
  put long material in a committed file cited by path and SHA.
