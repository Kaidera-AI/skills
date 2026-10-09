---
name: investor-lead-generation-and-outreach
description: Find investors for an early-stage round, write to each person one to one, follow up once, hand replies to the people who take the meetings, and keep a reusable investor database and learning log. Use for investor lead generation and cold investor outreach by any company or brand; customer prospecting belongs to a customer lead-generation skill.
license: Apache-2.0
metadata:
  version: 1.0.0
  updated: 2026-10-08
  source: Kaidera-AI/skills
  posture: unvetted-source-candidate
---

# Investor lead generation and outreach

Use this skill when a company raising a pre-seed or seed round wants an agent to find investors, write to them one by one, follow up once, pass every reply to the people who take the meetings, and learn from each answer. It is written for any company and any brand. Everything that belongs to one raise (the round, the deck, the owners, the sender, the figures, the exclusions) lives in an instance file built from [the instance template](references/instance-template.md), never in this skill.

The skill grants no authority. Sending email, writing to a CRM, paying for enrichment, submitting a pitch form and anything said in a founder's name each need the authority the instance file names. A researched, scored or approved batch is not permission to send a different batch.

## The loop

1. **Brief.** Read the instance file: round and deck, who releases names, who approves copy, who takes meetings, sender, copy rules, figure tiers, regions and exclusions. Ask only for what is missing.
2. **Research** ([research](references/research.md)). Funds first, then the decision makers at each fund from its own team page. Record the fund's own words on thesis, stage and minimum cheque, check its portfolio for competitors, find its pitch form, and write one plain opening line per person.
3. **Record** ([database](references/database.md)). Every fund, person, evidence row, release, touch, outcome and meeting goes into the investor database under a stable id. A CRM may be the system of record for stages; the database is the portable copy that outlives any one CRM and feeds the learning loop.
4. **Release.** One list per research turn to the release owner, naming every person to be written to with role, fund, figure, send day and the exact opening line they will read. Record the yes by lead id with the owner's message reference. A name the owner strikes stays out.
5. **Send** ([outreach strategy](references/outreach-strategy.md)). One email per person, in the investor's own morning, with the deck built for that investor attached. One follow-up, then stop.
6. **Replies.** Any reply from anyone at the fund stops every sequence there. Answer within the hour with the standard reply the owners approved, then hand the thread to them. Pitch forms, documents and terms are the owners' to decide.
7. **Learn** ([learnings](references/learnings.md), [weekly refresh](references/weekly-refresh.md)). Every reply, pass, bounce and owner correction becomes a dated learning with its evidence and the rule it changes. Once a week rebuild the database, update the learnings, ingest both into the team's memory store and republish the generic edition of this skill.

## Stop conditions

- A kill switch file or flag the instance names stops every send and follow-up. Set it before anything else when an owner gives a new rule, because a scheduled sender keeps firing while you work.
- Hold one lead, not the run, for a missing minimum, a missing release, an unverified address or any hold reason.
- Hold the ramp if hard bounces pass 3% or any spam complaint arrives.
- Stop and ask when a step would send as a founder, change a round figure above the instance ceiling, spend money or contact a private individual.

## What to report

Count by fund, because the fund is what answers: people and funds written to, funds that replied by hand, funds that declined or opted out, and funds with a meeting on the calendar. An automatic out-of-office notice is not a reply, a booking link sent is not a meeting, and a meeting is not an investment. Say when each figure was counted and from which record.

## What never leaves the instance

Investor names, addresses, notes, message references, round terms and the owners' words stay in the instance's own storage. The generic edition of this skill carries methods and anonymised lessons only; see the publishing check in [weekly refresh](references/weekly-refresh.md).
