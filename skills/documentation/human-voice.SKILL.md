---
name: human-voice
version: 1.0.0
description: |
  Rewrite, audit, or draft public-facing prose so it uses checkable specifics
  and preserves a named person's actual voice instead of generic machine-like
  patterns. Use for posts, articles, emails, decks, newsletters, web copy,
  strategy documents, and voice-matched editing. Do not use for specifications,
  logs, structured data, translation, or already approved attributed copy.

engenai:
  category: documentation
  trust_tier: official
  risk_level: low
  capabilities_required: []
  allowed_domains:
    - aclanthology.org
    - arxiv.org
    - en.wikipedia.org
    - www.economist.com
    - www.nytimes.com
    - www.pnas.org
    - www.science.org
    - www.washingtonpost.com
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera
license: Apache-2.0
updated: 2026-08-15
tags: [writing, editing, voice, copywriting, documentation]
bias: biases toward specific checkable detail over smooth readable prose
applies_to: [generalist, knowledge-keeper, cpo, orchestrator]
conflicts_with: []

safety_constraints:
  - Treat named-person voice samples as personal data and use only material the user is authorised to provide.
  - Never invent facts, quotations, metrics, citations, biographical details, or opinions to make prose seem specific.
  - Preserve approved legal, regulatory, and safety wording and already approved named-author copy verbatim.
  - Do not infer or accuse machine authorship from surface patterns; use the patterns only as editing prompts.
---

# Human Voice

## The principle

Text reads as machine-written when it asserts things no reader can check. The famous
tells (*delve*, *crucial*, *not just X but Y*, the triplet, the summary paragraph) are
symptoms of that one fault, not the fault itself. A model that has no specific
fact reaches for a generic compliment, and generic compliments have a house style.

So the job is not word-substitution. Swapping *crucial* for *essential* leaves the
sentence exactly as empty. The job is to replace the unverifiable claim with the
thing that made someone want to write it: a number, a date, a name, a failure, an
opinion someone could argue with.

The second half of the job is the opposite of the first. De-slopping toward a neutral
register makes the problem worse, because **neutral corporate prose is the machine
default**. Writing as a named person means putting their specific habits back in, not
sanding them off.

## The trigger

Invoke this skill when:

- A draft is going in front of readers whose good opinion matters, investors, customers, regulators, a prospective co-founder.
- Writing in the voice of a named person rather than as an organisation.
- A draft is technically accurate and somehow lifeless, and nobody can say why.
- Auditing existing copy: web pages, decks, published posts.

Do **not** invoke this skill when:

- The text is a specification, API reference, changelog or log message. Machine-flat is correct there.
- The copy has already been approved by the person whose name is on it. Ship approved text verbatim; never paraphrase it.
- The output is a structured data format, not prose.
- The task is translation, where the register belongs to the source.

## The steps

1. **Build the voice fingerprint, before writing a word.** Read at least ten things the person wrote unedited, including messages and comments rather than only polished work. Record: sentence rhythm; their two or three habitual openings; person and register (*I built this* versus *we are pleased to announce*); connectives and fillers (*look*, *so*, *here's the thing*); domain metaphors they reach for; punctuation habits; the negative list of what they never do; and their actual opinions and grudges. → verify: a written fingerprint file exists, and a colleague who knows them agrees with it.

2. **Run the vocabulary pass.** Search the documented overuse list below. Density is the tell, these words travel in packs, so one hit usually means five. Delete each one and write the fact that the adjective was standing in for. → verify: the regular expression in §Search returns fewer than two hits per thousand words, and every hit that survives is deliberate.

3. **Run the structure pass.** Remove negative parallelism, unearned triplets, copula avoidance, participial significance-tails, the challenges-and-future-prospects close, and the closing summary paragraph. → verify: zero matches for `not just|not only|it'?s not .*, it'?s`; every trailing `-ing` clause deleted without loss of meaning; the final paragraph says something the piece has not already said.

4. **Run the specificity pass.** Every paragraph carries at least one checkable item, number, date, name, quotation, place, error message. At least one claim in the piece must be arguable. Something must be admitted, conceded or left open. → verify: read the opening line in isolation; if it could head a thousand other pieces, it fails.

5. **Run the formatting and typography pass.** Bold once per screen or not at all. No bullet-with-bold-header lists. Sentence-case headings. No emoji as structure. **No em dashes at all** (see house rule below). Quote style consistent throughout. House English variety, including date format. → verify: no placeholder residue, search for `[`, `XX`, `TODO`; click every link.

6. **Read it back aloud in the person's voice.** Two questions: would they say this sentence out loud, and would a colleague who knows them guess it was theirs? → verify: where the answer is no, the cause is almost always missing specificity rather than wrong tone, fix the fact, not the adjective.


### House rule: no em dashes

The em dash is banned outright in our writing. Not rationed, not unspaced: absent.
Replace each one with the punctuation that was always available.

| Instead of | Use |
|---|---|
| an aside mid-sentence | commas, or brackets |
| a dramatic pause before a payoff | a full stop, and a new sentence |
| introducing a list or explanation | a colon |
| joining two loosely related clauses | a semicolon, or split them |

The en dash survives for numeric ranges only: `$1,000–5,000`, `2019–2024`. Everywhere
else, use a word: *from 1,000 to 5,000*.

This is a style decision, not a detection claim. See Anti-patterns.

### The documented overuse list

Only words whose overuse is corroborated by external study. Do not extend it with
guesses, and note that a word being overused does not condemn its synonyms.

```
additionally (esp. sentence-initial)   interplay
align with                             intricate / intricacies
boasts (meaning "has")                 key (as an adjective)
bolstered                              landscape (abstract noun)
crucial                                meticulous / meticulously
deep dive                              pivotal
delve                                  robust
emphasizing                            showcase
enduring                               tapestry (abstract noun)
enhance                                testament
fostering                              underscore (as a verb)
garner                                 valuable
highlight (as a verb)                  vibrant
```

**Era drift** matters when auditing older copy. *delve* peaked through 2023 and early
2024 and had largely gone by 2025; the mid-2025-onward set narrows to *emphasizing,
enhance, highlighting, showcasing* plus coverage-and-credibility padding.

### Phrase families

- **Significance inflation**, *stands as*, *serves as*, *is a testament to*, *a pivotal moment*, *underscores the importance of*, *reflects broader*, *evolving landscape*, *indelible mark*, *deeply rooted*.
- **Promotional puffery**, *boasts a*, *vibrant*, *rich*, *profound*, *exemplifies*, *commitment to*, *nestled*, *in the heart of*, *groundbreaking*, *renowned*, *diverse array*.
- **Superficial analysis tails**, a fact, then a participle doing the reader's thinking: *highlighting…*, *underscoring…*, *ensuring…*, *reflecting…*, *fostering…*.
- **Vague attribution**, *industry reports*, *experts argue*, *observers have cited*, *several sources* when you have two.
- **Didactic disclaimers**, *it's important to note*, *worth noting*, *may vary*.
- **Empty summaries**, *In summary*, *In conclusion*, *Overall*, and any section headed Conclusion.

### Structural patterns, before and after

| Pattern | Before | After |
|---|---|---|
| Negative parallelism (*not just X, but Y*) | "This isn't just a memory layer, it's an operating system for teams." | "It stores what each agent decided and why, so the next one doesn't re-litigate it." |
| Rule of three | "The platform is fast, secure, and scalable." | "It answers in under 400ms. It's SOC 2. We've run it to 12,000 concurrent sessions." |
| Copula avoidance | "Gallery 825 serves as the exhibition space and features four separate rooms." | "Gallery 825 is the exhibition space. It has four rooms." |
| Participial significance tail | "The station has six platforms, contributing to the region's development." | "The station has six platforms. Freight through it doubled between 2019 and 2024." |
| Challenges-and-prospects close | "Despite strong growth, the company faces challenges including competition and talent shortages. It is well positioned for the road ahead." | "Two things could kill this: a regulatory classification we can't meet, and two contractors we can't replace. We have a plan for the first." |
| Empty summary | "In conclusion, this represents a significant step forward." | *(deleted, end on the most concrete sentence in the piece)* |
| Hedge stack | "It could be argued that some organisations may find governance increasingly relevant." | "I think most of them will only fix governance after an incident. Ours did." |
| Significance inflation | "A recognised leader in enterprise technology." | "Runs aerospace technology at a 100,000-person integrator, and builds the product at night." |
| Elegant variation | "The platform ingests logs. The system indexes them. The solution surfaces them." | "The platform ingests logs, indexes them, and surfaces them on request." |
| Over-bolded key-takeaways block | Five bolded phrases across three sentences | One bold item per screen, or none |
| Bullet, **bold header**, colon, description ×8 | An assembled list | Prose that states the relationship between the items |
| Title Case Heading on every section | "Seamless Integration Across Your Entire Stack" | "How it connects" |

Longer worked rewrites, including a same-content-two-voices comparison: `./EXAMPLES.md`.

### Search

```
additionally|align(s|ed)? with|boasts|bolstered|crucial|deep dive|delv(e|es|ing)|emphasi[sz]ing|enduring|enhanc(e|es|ing|ement)|foster(s|ing)|garner(s|ed)?|highlight(s|ing)?|interplay|intricate|intricacies|landscape|meticulous(ly)?|pivotal|robust|showcas(e|es|ing)|tapestry|testament|underscor(e|es|ing)|valuable|vibrant|seamless(ly)?|comprehensive|navigat(e|ing)|leverag(e|ing)|realm|not just|not only|it'?s important to note|worth noting|in conclusion|in summary|experts (say|argue|believe)|faces (several )?challenges|commitment to|groundbreaking|renowned|nestled
```

### What human writing actually looks like

> **Read this as description, not instruction.** These are properties measured in
> human text, not techniques to apply. Deliberately inserting hedges, manufacturing a
> clumsy construction or performing casualness produces something worse than the
> polished draft you started with, because performed informality is its own tell. Use
> these to recognise where a draft has gone flat, then fix it by adding a real fact,
> not by sprinkling in *perhaps*. Moderation throughout: one blunt superlative in a
> piece lands, five reads as a costume.


Measured across twenty-five years of encyclopedia text, these are **more** common in
human writing, and several are the opposite of what people assume:

1. Plain `is` and `has`. Copulas are a human signature; machine prose dodges them.
2. Short plain verbs where a stiff synonym exists, *wrote* not *authored*, *used* not *utilised*, *died* not *passed away*.
3. Superlatives and definitive claims. Machines hedge; people commit. Having an opinion is itself a human tell.
4. Hedging qualifiers and intensifiers, *very*, *perhaps*, *tends to*. Counter-intuitive, but measured.
5. Wordy constructions in isolation, *in order to*, *the fact that*. Inelegant. Human.
6. Concrete, unusual, checkable detail. Machine prose writes "preparing students for the future workforce"; a person writes "there were no pencils".
7. Irregular rhythm. A nine-word sentence next to a forty-word one.
8. Admitted uncertainty. "I don't know why that worked."
9. Domain jargon used correctly and casually, without stopping to define it.
10. Anecdotes carrying irrelevant detail. Real memories carry noise; generated ones serve the argument too neatly.

### Preserving a named person's voice

The fingerprint from step 1, in detail. Capture eight things from at least ten unedited
samples, and write them down as a profile you maintain rather than rebuild each time.

1. **Sentence rhythm and length.** Measure it: shortest sentence, longest sentence, typical paragraph length. Someone who writes "It can execute. Brilliantly." has a one-word-sentence habit, delete it and the voice dies. Someone who runs to sixty-word sentences with three subordinate clauses is not improved by being cut into fragments.
2. **Habitual openings.** Most people have two or three and reuse them: a number, a date, a moment, a question someone asked them, a flat problem statement. Also record what they never open with.
3. **Person and register.** First-person singular, or corporate *we*? Do they address the reader as *you*, or never? Do they say *I got this wrong* in public?
4. **Connectives and fillers.** *Look*, *so*, *here's the thing*, *anyway*, *that said*, *frankly*. Highest-signal items in the profile, and the first casualties of any rewrite.
5. **Lexical fingerprints.** Their domain metaphors, a pilot reaches for cockpit, flight envelope, certification evidence; a surgeon reaches elsewhere. Their preferred plain verbs. Words they would never use.
6. **Punctuation and layout habits.** Lowercase openings, ellipses, never a semicolon, one-line paragraphs, brackets for asides, whether they use lists at all.
7. **The negative list.** Explicit prohibitions: "never opens with 'in today's fast-moving landscape'", "never writes a five-clause sentence", "never uses an exclamation mark".
8. **Opinions and grudges.** Voice is largely what someone is willing to say that others will not. Record the positions they hold, including the unfashionable ones.

While writing: keep the quirks a copy-editor would remove; match their level of
certainty rather than making them punchier or softer; use their evidence rather than
generic evidence; match their formatting habits including the ones you dislike; never
smooth an uneven rhythm, because regularity is the machine tell. Update the profile
every time they edit your draft, their edits are the best signal available.

### Editor's checklist

```checklist
- [ ] Overuse expression run; fewer than two hits per thousand words
- [ ] Every evaluative adjective carries a number, name or date
- [ ] No "experts say" / "industry reports" / "observers note" without a name
- [ ] Zero "not just X, but Y" constructions
- [ ] Triplets counted; all but the genuine ones broken
- [ ] is / are / has restored wherever serves as / features / represents appeared
- [ ] Trailing "-ing" significance clauses deleted, nothing lost
- [ ] No "Despite its X, faces challenges" close; no "Future Outlook" section
- [ ] Final summarising paragraph deleted
- [ ] Same noun repeated rather than dressed in three synonyms
- [ ] At least one checkable fact per paragraph
- [ ] Opening line could not head a thousand other pieces
- [ ] At least one claim a reasonable reader could disagree with
- [ ] Something admitted, conceded or left unresolved
- [ ] Bold used once per screen or not at all
- [ ] No bullet-with-bold-header lists; prose where a list was decorative
- [ ] Not every idea is a bullet; the relationships between ideas are stated
- [ ] Headings sentence case, none redundant with the title, none containing only headings
- [ ] No emoji used as structure
- [ ] Zero em dashes. Every one replaced by a comma, colon, full stop or brackets
- [ ] Quotes and apostrophes consistent throughout
- [ ] No placeholder residue, no XX dates, no dead links, no invented citations
- [ ] House English variety and date format applied throughout
- [ ] Read aloud: split where breath runs out, cut one sentence to four words
- [ ] Sentence lengths vary at least threefold within each paragraph
```

## The trade-off

**You gain** copy a specific person could have written, that survives a sceptical
reader, and that says something falsifiable.

**You give up** smoothness, symmetry and speed. Specific writing is harder to produce
because it requires facts you may not have, and the moment you lack one is exactly
where slop enters. Ask for the fact rather than filling the gap with a generality.
Expect this to surface gaps in the underlying work, which is a feature.

This skill should be suppressed when:

- Regulatory, legal or safety text where prescribed wording is mandatory.
- Reference documentation, where a flat predictable register aids scanning.
- Copy already approved by its named author.
- A house style guide explicitly requires the constructions this skill removes.

## Anti-patterns

Things that look like this skill but are not. Do not treat these as tells, and do not
strip them out of human drafts:

- **Treating the em dash ban as a detection rule.** It is not one. The evidence is clear that em dashes are a weak tell: a July 2026 analysis found the most widely used assistant now uses them *less* than professional writers, having been tuned to suppress them. We ban them anyway, as house style, because readers believe they are a tell and that belief is what costs us. Do not infer machine authorship from an em dash in someone else's writing.
- **Hunting curly quotes.** Word processors, macOS and the Chicago Manual all produce them. The real signal is curly and straight *mixed within one document*.
- **Treating perfect grammar as suspicious.** Plenty of people write well.
- **Flagging mixed registers.** Prose that is both clinical and emotional is common in technical writers, young writers and neurodivergent writers.
- **Banning long words generally.** Only the specific documented items correlate. The effect does not extend to all formal vocabulary.
- **Flagging transition words in isolation.** Only the sentence-initial pile-up counts.
- **Flattening to neutral.** The most common failure of this skill. Neutral corporate prose *is* the machine default, removing personality moves the draft toward slop, not away from it.
- **Fixing the surface and leaving the claims.** The deepest anti-pattern: cleaning the tells while leaving vague, unverifiable assertions in place just makes weak writing harder to spot.

## Cross-references

- Worked examples: `./EXAMPLES.md`
- Pair with any house style guide for spelling variety, date format and terminology.

## Source material

**Primary**

- Wikipedia, *Signs of AI writing*, https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Wikipedia, *WikiProject AI Cleanup*, https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup
- Wikipedia, *AI slop*, https://en.wikipedia.org/wiki/AI_slop
- Wikipedia, *Marketing buzzspeak*, https://en.wikipedia.org/wiki/Wikipedia:Marketing_buzzspeak

**Studies cited by the above**

- Kobak, González-Márquez, Horvát & Lause, "Delving into LLM-assisted writing in biomedical publications through excess vocabulary", *Science Advances*, 2025, https://www.science.org/doi/10.1126/sciadv.adt3813
- Juzek & Ward, "Why Does ChatGPT 'Delve' So Much?", ACL 2025, https://arxiv.org/abs/2412.11385
- Reinhart et al., "Do LLMs write like humans? Variation in grammatical and rhetorical styles", *PNAS*, 2025, https://www.pnas.org/doi/10.1073/pnas.2422455122
- Russell, Karpinska & Iyyer, "People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text", ACL 2025, https://aclanthology.org/2025.acl-long.267/
- Geng & Trotta, "Is ChatGPT Transforming Academics' Writing Style?", https://arxiv.org/abs/2404.08627

**Secondary guidance**

- Merrill, Chen & Kumer, *The Washington Post*, 13 November 2025, https://www.washingtonpost.com/technology/interactive/2025/how-detect-chatgpt-em-dash/
- "How to spot AI writing", *The Economist*, 30 July 2026, https://www.economist.com/culture/2026/07/30/how-to-spot-ai-writing
- Kriss, "Why Does A.I. Write Like … That?", *The New York Times Magazine*, 3 December 2025, https://www.nytimes.com/2025/12/03/magazine/chatbot-writing-style.html
