# Unattended batch: what runs alone and where it stops

The aim is a full working day of prospecting that needs the owner once, at the review queue. Everything before the queue runs without asking; nothing after it happens without an approval.

## Runs without per-step confirmation

1. **Restate the brief** as a checkable ICP (offer, buyer role, geography, need signals, exclusions) and save it with the batch. The owner corrects the description, not individual verdicts; a corrected description changes later batches.
2. **Find** candidate companies and buyers within the batch cap from allowed sources only.
3. **Qualify** each with fit, need, role and timing, every one with a cited reason or an explicit unknown. Need signals are things a source shows, such as a relevant open role, a launch, a funding or expansion notice, or a published problem statement. Popularity of a tool or a large follower count is not evidence of need.
4. **Verify** any contact address that was actually found on a source. Record the checks run and their results; do not record a confidence number.
5. **Reconcile** against the CRM and earlier batches using stable lead IDs, and check suppression.
6. **Draft** one message per eligible prospect and keep it with its exact recipient, channel, sender and timing.
7. **Write the ledger** (below) and place the batch in the review queue.

## Stops the batch (hold and report, never work around)

- A source blocks, rate-limits or asks for a login the host has not authorized: record the field as missing and continue with other sources.
- Suppression, opt-out or existing-customer data is unavailable: research may continue; contact use stays on hold.
- A step needs a paid call, credits or a new provider account that has no recorded scope approval.
- Two records might be the same person and the evidence does not settle it.
- The next step would send, follow, invite, message, call or change a live CRM record.
- The jurisdiction, processing basis or retention decision is missing from the owner's policy record.

## Run ledger

Keep one durable entry per run in the customer workspace: brief reference, start and end time, sources queried with counts, paid calls made and their approval reference, per-stage counts, holds and the reason for each, and the review-queue location. Counts must reconcile with [lead-record.md](lead-record.md). Re-running the same brief must not create duplicate leads: stable IDs and the exclusion list make a repeat run add only new prospects.

## Owner feedback loop

Show the owner each prospect with its written reason. The owner marks keep, maybe or reject and may add a reason. Store the decision on the lead record. Rejected prospects and their companies are excluded from later batches unless the owner reverses the decision. Record outcomes the owner reports later, such as contacted on a date, replied, opted out or bounced, as dated manual entries. "Learning" here means saved preferences and exclusions applied to the next search; it is not model training and it never grants contact permission.

## What approval covers

An owner approval names the concrete recipient set, channel, sender, message text and timing, or the exact CRM change or paid call. It expires with that payload. A changed message, a new recipient or a wider scope needs a new approval. A connected account, another agent's review or a scored batch never substitutes for it.
