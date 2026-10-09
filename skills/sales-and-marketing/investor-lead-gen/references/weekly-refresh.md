# Weekly refresh: keep the database, the learnings and this skill current

Run once a week, on a fixed day, as one task with one owner. It takes under an hour when the daily records are kept.

## 1. Rebuild the database

Rebuild the investor database from the outreach records and the CRM (see [database](database.md)). Write its stats file. Compare with last week: new funds, new people, first emails, follow-ups, replies, declines, meetings.

## 2. Read the week

Read every reply, decline, bounce, opt-out and owner instruction from the week, and the daily status reports. For each, ask: did it change, or should it change, how we research, write, time, follow up or count? A pass with no reason teaches nothing on its own; a fund's published guide, a reason given in a reply or an owner's correction usually does.

## 3. Write the learnings

Add each lesson to the instance log with the next number, the date it was learned, what was observed, the rule it produced, the evidence (message references, record ids) and whether it is safe to publish without names. A lesson becomes a rule only when the rule is also in the instance's procedure and, where it can be, in the send code. Retire a lesson that a later one replaced, and say which.

## 4. Feed the memory store

Ingest the refreshed instance skill, the learning log and the week's reports into the team's memory store, then prove retrieval: search for two of this week's lessons by phrase and by meaning, and check that the store's graph links them to the funds and rules they mention. If vector or graph search returns nothing new, the store is not learning. Report it to the owner with the evidence rather than assuming it worked.

## 5. Publish the generic edition

1. Copy every lesson marked safe to publish into the generic learnings, rewritten without names, figures that identify the raise, message references, addresses or dates that point at a person.
2. Run the publishing check: search the generic files for the instance's investor names, fund domains, people, email addresses, internal paths, message references and round figures. Any hit blocks publication.
3. Bump the skill version (patch for new lessons, minor for a changed procedure), render the single-file edition, run the repository's validation, security scan and tests, and open or update one pull request. Merging is the repository maintainer's decision.

## 6. Report

One short note to the owners: the week's numbers by fund, the new lessons in a sentence each, whether the memory store took them, and the pull request. Nothing is sent to investors as part of this task.
