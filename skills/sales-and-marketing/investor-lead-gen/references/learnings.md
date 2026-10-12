# Learnings

Anonymised lessons from running this skill on a real pre-seed raise. Each one names what happened, the rule it produced and how to check the rule holds. The instance keeps the full log with names, dates and message references; only lessons that read true without them are copied here. Add new ones at the end with the next number.

**First-week benchmark (one raise, October 2026):** 42 people at 33 funds written to over three sending days; 3 funds replied by hand (about 9% of funds), 2 of them on the day of the email and 1 the next day; 2 of the 3 replies sent the company to a pitch form; 1 meeting booked; 0 hard bounces; 0 opt-outs. Treat this as one data point, not a norm.

**At the first pause (same raise, four sending days):** 62 people at 50 funds written to; 5 funds replied by hand (10% of funds), 3 of them sending the company to a pitch form; 2 passed (one on stage, one at its form screen); 1 meeting booked; 0 hard bounces; 0 opt-outs; no follow-up sent yet.

### L01 · 2026-10-05 · Match the deck's round figure to each fund's minimum
- **Observed:** A deck stating a raise below a fund's published minimum cheque tells the fund the round is not for them before they read on.
- **Rule:** The deck carries the lowest of a few round tiers that covers the fund's minimum, in the fund's currency. The email body never states a figure.
- **Check:** Open the attached PDF of a sample of sent emails and compare the figure with each fund's recorded minimum.

### L02 · 2026-10-07 · Read the minimum on the fund's own site before the first email
- **Observed:** A press figure understated one fund's minimum, and another fund's own manifesto overturned a tracker figure. Both had already been written to.
- **Rule:** No first email until the minimum, or its absence, is read on the fund's own site. A press figure needs an owner's named exception.
- **Check:** Every first email's lead record has a minimum source on the fund's own domain or a recorded exception.

### L03 · 2026-10-05 · Many funds want their pitch form, not email
- **Observed:** Two of the first three human replies came within a day and redirected the company to the fund's pitch form.
- **Rule:** Find the form during research. Form funds go on the release list as form submissions, drafted for an owner to submit.
- **Check:** The fund record has a pitch route before release.

### L04 · 2026-10-05 · Replies come from team addresses
- **Observed:** A fund replied from a shared team address with the partner copied, not from the partner written to.
- **Rule:** Any address at the fund's domain counts as a reply and stops every sequence at that fund.
- **Check:** The reply watcher matches on domain, and colleagues show as stopped after a reply.

### L05 · 2026-10-07 · Check each portfolio for competitors before release
- **Observed:** Four funds in early batches backed direct competitors. One of them later declined after a form submission.
- **Rule:** Keep a competitor and backer list; a match holds the lead for the owners before release.
- **Check:** Every batch's release list states that the competitor check ran.

### L06 · 2026-10-08 · Say where the company is based
- **Observed:** A Europe-only fund passed on geography after reading the company as based in another region; the email named customers abroad and only the footer gave the registered office.
- **Rule:** Email 1 says where the company is based in its first sentence about the company.
- **Check:** The copy version carries the location line in every variant of email 1.

### L07 · 2026-10-07 · Write like a person and retire repeated openers
- **Observed:** Two sentence patterns opened about four in ten researched lines in the first 74, and the founder asked for plainer, more human wording.
- **Rule:** One plain fact, said as a person would, then stop. Count patterns per batch and retire any that recurs.
- **Check:** A per-batch count of repeated opening constructions.

### L08 · 2026-10-08 · The founder comes first
- **Observed:** A fund's published guide says early-stage investors weigh the founders first and read the deck, the website and the founder's professional profile together; the founder was on the second-to-last slide and titles differed between deck, email and profile.
- **Rule:** Founder on slide two; one title used everywhere and matching the founder's public profile; nothing on a slide that the profile contradicts.
- **Check:** Compare deck, email signature, website and profile titles before a deck version is pinned.

### L09 · 2026-10-08 · People may not realise an agent wrote to them
- **Observed:** The founder noticed that investors replying seemed unaware they were writing to an AI agent.
- **Rule:** Decide disclosure deliberately. Test a one-line disclosure against none, fund by fund, and report replies and meetings per half. Always answer honestly when asked.
- **Check:** Each fund's record carries its test half from its first email onwards.

### L10 · 2026-10-04 · Verification providers score mailboxes, not employers
- **Observed:** Several partners came back with valid addresses at portfolio companies or universities. The second named partner at the same fund resolved every case.
- **Rule:** Require the address domain to agree with the fund; list the fund's alias domains before any paid reveal; on a wrong employer, move to the next partner.
- **Check:** No sent email went to a domain outside the fund's recorded domains.

### L11 · 2026-10-07 · Count from the ledger, not the mailbox
- **Observed:** A reply sat in the mailbox trash and was invisible to search.
- **Rule:** Count replies and meetings from the sequence ledger and the calendar; use mailbox search only as a cross-check, including trash.
- **Check:** The daily status figures reconcile with the ledger.

### L12 · 2026-10-07 · CRM rate limits drop writes silently
- **Observed:** A CRM's rate limit dropped the first activity on one record mid-batch; the re-run updated the record and never added the activity.
- **Rule:** Pace CRM writes below the limit, then read back every record and its first activity.
- **Check:** After each batch, every record has its research activity.

### L13 · 2026-10-05 · Stop the sender before changing a rule
- **Observed:** An owner's new rule arrived 51 seconds after a scheduled send went out under the old one.
- **Rule:** Set the kill switch first, change code and config, dry-run on one real lead, then lift it.
- **Check:** The kill switch history shows a set and a lift around every rule change.

### L14 · 2026-10-07 · One follow-up is enough
- **Observed:** The owners' advisers capped reminders at one, one to two weeks after the first email.
- **Rule:** One follow-up seven business days after email 1, then stop.
- **Check:** No lead has more than two steps sent.

### L15 · 2026-10-08 · Use round figures in the investor's currency
- **Observed:** A minimum converted between currencies produced a figure with two decimals, which an owner read as a mistake.
- **Rule:** Use the tier figures only, in the currency the instance sets for the fund's region; never two decimals.
- **Check:** The PDF builder refuses a figure with two decimals.

### L16 · 2026-10-05 · Attach the deck built for the investor
- **Observed:** A hosted deck link showed one fixed figure to every fund.
- **Rule:** Attach the per-investor PDF; no hosted link with a fixed figure; keep each email as sent.
- **Check:** Every kept copy has the PDF attached and no hosted link.

### L17 · 2026-10-05 · Spell product names in full
- **Observed:** A product abbreviation collided with a term every investor uses for market size.
- **Rule:** Spell product names in full in every investor email and deck.
- **Check:** A copy check refuses the bare abbreviation.

### L18 · 2026-10-07 · One release list per turn, every name listed
- **Observed:** The owners wanted one or two approval emails a day, each naming every person to be contacted.
- **Rule:** One release list per research turn to one named release owner, with each person's role, fund, figure, send day and opening line.
- **Check:** Every sent lead maps to a release with the owner's message reference.

### L19 · 2026-10-08 · A small round can look below a fund's usual cheque
- **Observed:** A fund with a low published minimum wrote an average cheque about seven times larger and preferred to lead.
- **Rule:** Record the average cheque and lead preference; let the owners decide whether to match the average for funds that lead.
- **Check:** Fund records carry the average cheque where published.

### L20 · 2026-10-08 · Declines can land outside your thread
- **Observed:** A fund's form system sent its decline to the founder's own address, not the outreach thread.
- **Rule:** When an owner forwards a decline, close the fund by hand everywhere: CRM, register, meeting reminders.
- **Check:** No reminder is scheduled for a fund marked declined.

### L21 · 2026-10-05 · No codes in subject lines
- **Observed:** An internal programme code in a subject line read as machine-made.
- **Rule:** Subjects in plain words, no codes or batch labels.
- **Check:** A copy check refuses known internal codes in subjects.

### L22 · 2026-10-08 · A new copy version needs a rule for funds already written to
- **Observed:** Switching to a new copy version mid-campaign would have sent a new colleague at an already-contacted fund different wording from the rest of the fund's thread. A no-send preview of the next real send caught it.
- **Rule:** Before switching a copy version or a test on, preview the next real send for each kind of lead: a new fund, a new colleague at a contacted fund, and a follow-up.
- **Check:** The switch-on record lists one previewed email per kind of lead.

### L23 · 2026-10-09 · Funds researched before a rule changed still hold one person
- **Observed:** Two funds researched before the rule to find three to five people per fund each held one person. The only person at one of them had opted out at the enrichment provider, so that fund was never written to.
- **Rule:** Each research turn, check the region's funds from earlier batches for colleagues to add. A colleague at a fund already written to gets that fund's existing email version, framing and pinned figure. Allow the fund's domain by name; never switch the earlier-batch check off.
- **Check:** Every researched fund holds the number of people the current rule asks for, or a recorded reason why not.

### L24 · 2026-10-09 · A search summary can upgrade "ties" to "backed by"
- **Observed:** A search summary said a fund was backed by a large consultancy and named a board member. The article itself said only that the fund had ties to the consultancy, and cut off before any name. A draft release note had repeated the summary.
- **Rule:** Any fact about a fund that is not on its own site is read in the source itself, with its date, before it goes in a release note. A search summary is a lead to a source, never the source.
- **Check:** Every outside fact in a release note has a link and a date, and the source says it in those words.

### L25 · 2026-10-09 · Size the turn against the day it will send on
- **Observed:** A research turn had eight ready names, but its send day held only nine first emails against a daily cap of 20. Adding a third partner at a fund already researched took the day to ten.
- **Rule:** Run the release simulation before writing the list. If the send day sits well under the cap, add people at funds already researched before reaching for new funds.
- **Check:** Each release list states the send day's planned count against the cap.

### L26 · 2026-10-10 · A fund can reply from a second domain
- **Observed:** A partner answered from a second company domain, through an email assistant, the morning after the first email. The reply watcher searched only the domain written to, so the follow-up stayed due until it was stopped by hand.
- **Rule:** Record every domain a fund's people mail from. Also match replies on your own Message-ID in the reply's References or In-Reply-To headers, whatever the sender's domain.
- **Check:** In a test, a reply from an unlisted domain that references your message stops the sequence.

### L27 · 2026-10-09 · A seed fund reads pre-seed as too early; keep it for the next round
- **Observed:** A fund that invests at seed, after launch and revenue, passed because pre-seed was too early. Of the first five funds to answer, three sent the company to a pitch form, one passed on stage and one misread its location; none spoke about the wording.
- **Rule:** Write only where the fund's own site says it invests at the stage being raised. A pass on stage closes the fund for this round and keeps it for the next, with its stated bar on the record.
- **Check:** Every first email's fund record carries a stage, in the fund's own words, that includes the round being raised.

### L28 · 2026-10-09 · An adviser on the round is not the team
- **Observed:** A proposed deck put a team panel beside the founder, and the standard reply introduced the round's independent adviser with an in-house title. The adviser asked never to be shown as part of the team in external communication.
- **Rule:** Externally, name an adviser as an independent adviser on the round, never on a team slide or with a company title.
- **Check:** The deck and reply builders refuse an adviser's name on a team slide or beside a company title.

### L29 · 2026-10-09 · Hold one copy version long enough to read it
- **Observed:** Nine copy versions went out in four sending days, none to more than 20 people, and no follow-up had gone. When the owners paused to ask what had worked, no wording change could be read.
- **Rule:** Hold one version for a set number of sends (about 40) and read it after the follow-up window before changing the wording. A correction of fact is not a wording change.
- **Check:** The send log shows each copy version's send count and its first and last send dates.
