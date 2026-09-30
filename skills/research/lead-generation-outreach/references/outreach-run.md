# Daily run, sequence and schedule

The unit of work is one enrolment: one person, in one sequence, for one approved campaign. Everything below is a default the owner can change in the campaign brief. A default is not an approval.

## Enrolment states

| State | Meaning | Leaves the state when |
|---|---|---|
| `enrolled` | Qualified lead accepted into the campaign, no touch drafted yet | A step 1 draft is queued |
| `active` | At least one touch delivered, a later touch is scheduled | A stop condition fires, or the last touch is delivered |
| `paused` | Out-of-office return date known, owner pause, or a missing check | The date passes or the owner resumes; the next touch is rescheduled, never sent late in a burst |
| `replied` | First real reply arrived | Terminal. A human owns the conversation |
| `meeting_booked` | A confirmed booking exists (appointment-setting readback) | Terminal for this sequence |
| `bounced` | Hard bounce, or repeated soft bounce | Terminal. The address goes to the suppression list |
| `opted_out` | Any opt-out, objection or unsubscribe | Terminal. Suppression list, no exceptions |
| `completed` | Final touch delivered, no reply | Terminal. Quiet period below |
| `removed` | The owner or the campaign lead withdrew the lead (wrong role, left company, conflict) | Terminal |

Exactly one active enrolment per person, and one contact per company at a time unless the owner approves a multi-contact plan. Two people at the same company receiving near-identical mail in the same week is the failure to avoid: they compare notes. When a colleague replies, treat it as a stop for that company's other enrolments until a human decides.

## Default sequence

Owner-approved per campaign. Business days only. If a step lands on a weekend, it moves to the next business day, and follow-ups avoid Friday. Every touch after step 1 adds something new. "Just checking in" is never a touch.

| Step | When | Thread | Job | Length | Ask |
|---|---|---|---|---|---|
| 1 | Day 0, Tuesday to Thursday | New thread | First contact: one observed fact about them, one problem you think they have, why you are the person writing | 50 to 80 words | An interest question |
| 2 | Day 3 | Same thread | A different angle: one relevant proof point or one sharper question | 60 words or fewer | Interest question |
| 3 | Day 8 | Same thread | Something useful with no ask attached beyond a light question: a data point, a short checklist, a link to something they can use | 80 words or fewer | Light question |
| 4 | Day 15 | Same thread | Close the file: say this is the last note, offer to route to the right person | 40 words or fewer | Permission to close |

After step 4, a quiet period of 90 days. A lead re-enters only through a new evidenced trigger (a hiring signal, a launch, a change of role) and a fresh owner approval. Optional steps 5 and 6 (about Day 30 and Day 45) are for named high-value accounts, and each must carry new value.

Why these defaults, and where they conflict:

- The Instantly 2026 benchmark report says 58% of replies come from step 1 and 42% from follow-ups, recommends 4 to 7 touches, and spaces them 3 to 4 days apart. Summaries of the same report elsewhere claim reply rate peaks at the second follow-up and then falls. Both cannot be read as settled. Start at 4 touches and measure your own step-by-step reply share before adding more.
- Instantly's weekday data (launch Monday, follow-ups Wednesday, Friday brings an out-of-office surge) is vendor data. Use it as a starting schedule and test it.
- HubSpot's sequences default to business days only and to a send window. The same defaults are used here.

## The daily run

One scheduled run per business day, in the owner's timezone (a scheduler that runs in UTC must be converted). The run follows a fixed order, and it never skips step 2 or the per-send check in step 8.

1. **Preflight.** Confirm the campaign brief is approved and in date, the policy record covers the recipients' region, suppression data is readable, the sending mailbox is authenticated and healthy, and today is a business day with no owner pause. A failed check stops sending and the run continues as prepare-only with the reason recorded.
2. **Read the mailbox first.** Ingest replies, bounces, out-of-office and unsubscribe messages since the last cursor. Match each to an enrolment by thread ID, `In-Reply-To` and `References`, then by exact sender address. Update states and forward first real replies (see [reply-handling.md](reply-handling.md)) before any new send is drafted. Sending a follow-up to someone who replied an hour ago is the mistake this order prevents.
3. **Build the due list.** An enrolment is due when its state is `active` or `enrolled`, its next-touch time has passed, it is not on the suppression list, and no stop condition holds. Follow-ups take priority over new step 1 sends. The remaining capacity goes to new step 1 sends in the owner's ranking.
4. **Apply the caps.** Per-mailbox daily cap, per-company limit, per-campaign limit, and the ramp below. The cap is a ceiling, never a target: an empty due list sends nothing.
5. **Draft.** Write each message from the enrolment's evidence and the step's job, following [email-craft.md](email-craft.md). Record the evidence used.
6. **Check.** Duplicate check against the ledger, suppression check again, address verification status, length against the step's cap and reading level, no fabricated fact, sender identity, postal address and opt-out line present, and a payload hash.
7. **Queue for approval.** One review digest for the day: each item shows recipient, sender, subject, body, step, evidence, and proposed send window. The owner approves, edits or rejects each item. An edit creates a new payload hash. See [compliance-and-deliverability.md](compliance-and-deliverability.md) for what an approval must name.
8. **Reconcile, then deliver approved bytes.** Approval can arrive hours after the mailbox was read, and the world moves in between. Immediately before each individual send, and not once per batch, the sender re-checks that one enrolment against live state:
   - the sending mailbox for anything from that recipient or company newer than the run's cursor (a reply, a bounce, an out-of-office, an unsubscribe or a message from a colleague);
   - the suppression and do-not-contact lists, and whether the address has since been marked bounced or opted out;
   - the enrolment state, an owner pause, and any booking, open opportunity or customer flag in the CRM;
   - whether the approved window is still open and the daily cap still has room.

   Any change holds that item. Nothing is sent, the ledger records `held` with reason `state_changed` and what changed, and the item returns to the next review digest with the new evidence. A new reply or opt-out goes through [reply-handling.md](reply-handling.md) first and the enrolment's remaining touches are cancelled. A held item is not a revoked approval, but the owner decides again when the content or the context changed. An item whose approved window has passed is held, never sent late.

   Only when the check is clean does the sender send, at a steady pace, one idempotency key per enrolment and step, then read the sent message back and record the provider IDs. A timeout is `delivery_unknown`; reconcile before any retry.
9. **Write the ledger** ([send-ledger.md](send-ledger.md)) and update the CRM.
10. **Report.** Counts, replies forwarded, holds and the reason for each, next day's due count, and any threshold breached.

## Volume ramp and pause thresholds

Defaults for a new mailbox or domain; an established, healthy mailbox uses the owner's approved cap.

- Week 1: 5 to 10 sends a day. Increase gradually over 4 to 6 weeks (Instantly's warm-up guidance). Keep daily volume steady; a gap followed by a burst looks like abuse.
- Pause and diagnose if the 7-day bounce rate reaches 2% (Instantly's discipline figure), on any spam complaint, or if Google Postmaster spam rate reaches 0.1% (Google says keep it below 0.1% and never let it reach 0.3%).
- Verify every observed address before step 1, treat catch-all domains and large enterprise mail gateways as higher risk, and never build an address from a name pattern.
