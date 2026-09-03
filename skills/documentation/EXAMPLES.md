# Human Voice, worked examples

Before/after rewrites for the `human-voice` skill. Each example gives the original, an annotated list of what is wrong with it, and a rewrite. The rewrites are deliberately shorter, because most of what gets removed was decoration rather than information.

Read these alongside `SKILL.md`. The steps there tell you what to do; these show what it looks like when it is done.

---

## 1. Company announcement post

### Before

> We're thrilled to announce the launch of our new memory layer, a groundbreaking capability that represents a pivotal moment in our journey.
>
> In today's rapidly evolving AI landscape, enterprises face a crucial challenge: agents that forget everything between sessions. Our new solution isn't just a database, it's a comprehensive architecture that seamlessly integrates with your existing stack, fostering collaboration and enhancing productivity across teams.
>
> **Key benefits:**
> - **Persistent memory**: Retains context across sessions
> - **Enterprise-ready**: Built for scale, security, and compliance
> - **Seamless integration**: Works with your existing tools
>
> Despite the challenges facing enterprise AI adoption, we believe this marks a significant step forward. We remain committed to empowering organisations to unlock the full potential of their AI investments.

### What is wrong

- Overuse vocabulary in nine places: *groundbreaking, pivotal, landscape, crucial, comprehensive, seamlessly, fostering, enhancing, significant*.
- *"isn't just a database, it's a comprehensive architecture"*, negative parallelism.
- *"scale, security, and compliance"*, rule of three, and none of the three is specified.
- *"represents a pivotal moment"*, copula avoidance plus significance inflation.
- Inline-header vertical list with bold-colon formatting, three items, all restating the headline.
- *"Despite the challenges… we remain committed"*, the canned close plus an empty summary.
- Nothing in the whole post is checkable. No number, no date, no name, no customer.
- *"In today's rapidly evolving AI landscape"* is an opening that could head a thousand other posts.

### After

> Agents forget everything between sessions. Ours don't, as of this morning.
>
> The problem was mundane and expensive. One customer's engineers re-explained the same service architecture 40 times a week, because every session started cold. Nobody logged it as a cost. It just showed up as slow.
>
> The memory layer stores what each agent decided and why, and hands it to the next one. It survives restarts. It's scoped per tenant, so one customer's context never reaches another's, that was the part that took four months, not the storage.
>
> It's live for existing customers today. Two known gaps: no cross-region replication yet, and the retention policy is still a single global setting rather than per-project. Both are on the list for Q4.

Word count fell by a third. Every paragraph now contains something a reader could challenge.

---

## 2. Cold outbound email

### Before

> Hi Sarah,
>
> I hope this message finds you well.
>
> I'm reaching out because I believe there's a valuable opportunity for us to explore how our platform could enhance your team's operations. In the current landscape, many organisations like yours are navigating the challenges of deploying AI at enterprise scale, and we've helped numerous leading companies unlock significant efficiencies.
>
> Our robust, end-to-end solution empowers teams to design, build, and deploy AI agents with confidence, not just faster, but with the governance and control that enterprise environments demand.
>
> Would you be open to a brief 15-minute conversation to delve into how we might support your objectives?

### What is wrong

- *"I hope this message finds you well"* is a phrasal template with no content.
- Overuse vocabulary: *valuable, enhance, landscape, navigating, robust, empowers, significant, delve*.
- *"numerous leading companies"*, vague attribution, no name.
- *"design, build, and deploy"*, rule of three.
- *"not just faster, but with the governance"*, negative parallelism.
- Every sentence is about the sender. Nothing is about Sarah.
- No specific fact about her company, so the email could go to anyone.

### After

> Hi Sarah,
>
> You said on the Infra Weekly panel in June that your team spent most of Q1 building an audit trail for your internal agents rather than shipping features. That's the exact problem we built for.
>
> We give you a per-tenant audit log and a memory layer out of the box, so agent decisions are traceable without your team writing the plumbing. A logistics firm of roughly your size cut that build from two quarters to three weeks.
>
> I don't know whether your constraint is the audit trail or the approval process behind it. If it's the second, we're probably not much help.
>
> Fifteen minutes next week?

The rewrite works because of one researched fact in the first line. Without a real observation about the recipient, no amount of editing saves a cold email, that is the gap step 2 of the skill warns about.

---

## 3. Executive bio

### Before

> Amad Malik is a visionary technology leader and recognised thought leader in enterprise AI. With a distinguished career spanning aerospace and digital transformation, he has consistently demonstrated a commitment to innovation and excellence.
>
> As a pivotal figure in the industry, Amad has been featured in numerous publications and maintains an active presence across the technology community, underscoring his influence in the evolving AI landscape.

### What is wrong

- *thought leader*, *visionary*, *distinguished*, *pivotal*, buzzspeak and puffery.
- *"featured in numerous publications"*, *"maintains an active presence"*, the credibility-padding family, almost word-for-word from the documented list.
- *"underscoring his influence"*, participial significance tail.
- The subject becomes less specific as the praise increases. There is no company, no role, no date, no artefact.

### After

> Amad Malik runs aerospace technology at Atos and is building Kaidera, an agent platform for enterprises. He is a pilot, which is why half his engineering analogies are about certification evidence and the other half about what happens when a checklist gets skipped.
>
> He started Kaidera after watching a client's AI programme stall for four months on a governance question nobody could answer.

Note the third human signal from step 10 in play: a definite claim ("runs aerospace technology at Atos") instead of a hedge, and a detail ("he is a pilot") that a machine would not have volunteered because it does not obviously serve the argument.

---

## 4. Investor update paragraph

### Before

> Q3 was a pivotal quarter that saw significant progress across multiple fronts. We continued to strengthen our position in the market, fostering deeper relationships with key stakeholders while enhancing our product capabilities.
>
> Despite facing several challenges related to hiring and market conditions, the team demonstrated remarkable resilience. Overall, we remain confident in our trajectory and are well positioned to capitalise on the opportunities ahead.

### What is wrong

- Overuse vocabulary throughout: *pivotal, significant, fostering, enhancing, key*.
- *"Despite facing several challenges… Overall, we remain confident"*, the canned close and the empty summary, back to back.
- Perfect balance: one challenge, one reassurance, nothing falsifiable.
- An investor cannot act on a single sentence of it. There is no number in 62 words.

### After

> Q3: revenue £312k, up from £198k. Two new logos, both mid-market logistics, both sourced from the same conference.
>
> We missed the hiring plan. We wanted three engineers and hired one, because we were slow to make offers and lost two candidates to counter-offers. That's on me, and it pushed the audit-trail feature from September to November.
>
> The thing I'm least sure about: whether logistics is a real wedge or two coincidences. I'll know by the end of Q4, when the next four deals close or don't.

Admitting the miss and naming the uncertainty are both human signals from step 10, and both make the confident parts more credible rather than less.

---

## 5. Website "how it works" section

### Before

> ### Seamless Integration Across Your Entire Stack
>
> Our platform serves as a **unified layer** that connects your existing tools, ensuring **frictionless data flow** and **enhanced visibility** across your organisation.
>
> Whether you're a **growing startup** or an **established enterprise**, our comprehensive solution adapts to your needs, delivering **measurable value** from day one.

### What is wrong

- Title-case heading.
- Bold applied to five separate phrases in three sentences, key-takeaways style.
- *serves as* instead of *is*; *ensuring* as a participial tail.
- *"Whether you're X or Y"*, a false-balance construction that means the copy has not decided who it is for.
- *"measurable value"* with nothing measured.

### After

> ### How it connects
>
> The platform sits between your tools and your agents. It reads from your existing systems over standard connectors, so nothing gets migrated.
>
> Setup takes about a day for a team already running an identity provider. Longer if you aren't, usually a week, mostly spent on access rules.

One bold-free block, sentence-case heading, and a specific claim about setup time that a prospect can hold you to.

---

## 6. Case-study paragraph

### Before

> The client, a leading player in the logistics sector, faced significant challenges in scaling their AI operations. Through our comprehensive engagement, we were able to deliver a robust solution that not only addressed their immediate needs but also positioned them for long-term success, underscoring the transformative potential of well-governed AI.

### What is wrong

- Every noun is generic: *leading player*, *significant challenges*, *comprehensive engagement*, *robust solution*, *immediate needs*, *long-term success*.
- *"not only addressed… but also positioned"*, negative parallelism.
- *"underscoring the transformative potential"*, participial tail plus overuse vocabulary.
- 52 words, zero facts. This is the regression-to-the-mean failure in its purest form.

### After

> A freight forwarder with 400 staff had eleven agent prototypes and none in production, because their risk committee would not sign off without a per-decision audit trail.
>
> We gave them one. Nine of the eleven prototypes went live over six weeks. The other two were quietly dropped, which the client says was the more useful outcome.

The dropped prototypes are the part a generated version would never include, and they are the part that makes the rest believable.

---

## 7. Newsletter opener

### Before

> Welcome to this week's edition! 🚀
>
> In today's fast-moving world of artificial intelligence, staying informed has never been more crucial. This week, we delve into three key developments that are reshaping the landscape:
>
> - 📊 **Market Movements**: What the latest funding rounds tell us
> - 🔧 **Tooling Updates**: New releases you should know about
> - 💡 **Insights**: Our take on where things are heading

### What is wrong

- Emoji as structure, in the heading and every bullet.
- Title-case bullet headers with bold and colons, the strongest formatting tell.
- *"In today's fast-moving world"*, *crucial*, *delve*, *key*, *landscape*, five documented tells in two sentences.
- Rule of three, with each item promising rather than delivering.

### After

> Three things this week.
>
> A Series B went out at 40x forward revenue and nobody blinked, which tells you more about the market than the round itself does. A widely used orchestration library shipped a breaking change with no migration path, and the maintainers are getting hammered for it. And I changed my mind about evaluation harnesses, details below, including why I was wrong the first time.

Prose instead of decorated bullets, and the last clause does the work that "Insights: our take" only gestured at.

---

## 8. Same content, two voices

The skill's step 11 is the part most often skipped. Here is the same factual content written in two different real voices, to show that de-slopping alone does not produce a voice, it only clears the ground for one.

**The facts:** the company shipped per-tenant memory isolation; it took four months; the delay was caused by a compliance review, not engineering; two customers were waiting.

### Neutral (de-slopped, but voiceless)

> Per-tenant memory isolation shipped this week. It took four months. Most of that was a compliance review rather than engineering work. Two customers were waiting for it.

Correct, clean, and could have been written by anyone. This is the trap: it passes every check in step 12 and still has nobody behind it.

### Voice A, builder thinking out loud

Fingerprint: first person, short punch then expansion, one-word sentences, aviation metaphors, admits errors, never uses *we* for corporate cover.

> Per-tenant memory isolation is live.
>
> Four months. For a feature I originally scoped at three weeks.
>
> The engineering was the easy part, the isolation model was done by week three. The rest was a compliance review, and I resented every day of it until I read their findings. They were right about two of the four objections. In aviation you don't get to argue with the certification body about whether the evidence is convenient.
>
> Two customers waited the whole time. Neither complained, which worries me more than if they had.

### Voice B, old-school relationship seller

Fingerprint: warm, second person, short paragraphs, names people, ends on an offer, avoids technical detail, uses *chap* and *frankly*.

> Good news, the per-tenant isolation work is finally finished.
>
> Frankly it took longer than any of us wanted. Four months, most of it with the compliance people rather than the engineers. Not glamorous, but it's the bit your risk team will ask about first.
>
> Marco and Priya have both been waiting patiently for this, and I owe them a call today. If you'd like the same walkthrough, say the word and I'll put half an hour in the diary this week.

Same four facts. Neither version contains a single item from the overuse list. The difference between them is entirely the fingerprint, rhythm, person, what each writer chooses to admit, and what each one thinks the reader cares about.

---

## Quick reference, the rewrite moves

| Pattern in the draft | Move |
|---|---|
| *crucial, pivotal, vital, key* | Name the consequence instead |
| *robust, comprehensive, seamless, powerful* | Give the specification or the number |
| *not just X, but Y* | State Y on its own |
| *serves as / stands as / represents* | Use *is* |
| *…, highlighting its importance* | Delete from the comma; add a fact instead |
| *experts say / industry reports* | Name the source or cut the claim |
| *Despite its X, faces challenges…* | Name the two real risks and which one you can't fix |
| *In conclusion / In summary* | Delete the paragraph |
| Three adjectives in a row | Keep one, or make three uneven sentences |
| Bullet, **bold header**, colon, description | Rewrite as prose |
| Title Case Heading | Sentence case |
| An emoji per bullet | Remove all of them |
| Three synonyms for one thing | Repeat the noun |
| Every advantage matched by a counterpoint | Pick a side, or admit you can't yet |
