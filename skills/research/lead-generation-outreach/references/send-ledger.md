# Send ledger

Every touch leaves a durable record before and after delivery. Use JSON Lines (or an equivalent append-only structured store) in the customer workspace, and mirror the contact history into the configured CRM as activities or notes. The CRM is the readable history for the sales lead. The ledger is the evidence of what was approved, sent and verified. When they disagree, the ledger wins and the CRM row is corrected through the curator's normal read-before-write.

Never store credentials, full mailbox exports or unrelated private content. Keep message bodies only as long as the owner's retention decision allows. Records are for the approved purpose only.

## Per touch (append-only)

| Field | Notes |
|---|---|
| `schema_version`, `project_key`, `campaign_id`, `sequence_id` | Stable identifiers |
| `enrolment_id`, `lead_id`, `step` | `lead_id` comes from the lead record ([lead-record.md](lead-record.md)) |
| `idempotency_key` | `enrolment_id` + `step` + payload revision. A verified success is never resent on a later day |
| `template_id`, `template_version`, `angle` | Which step template and which angle (see the craft reference) |
| `evidence_refs` | Source URLs or provider records behind every personal claim in the message |
| `payload_hash` | Hash of recipient, sender, subject, body, headers and planned window as approved |
| `approval_ref` | The owner's trusted approval record and time. A status string is not one |
| `sender`, `recipient`, `subject`, `planned_window` | As approved |
| `state` | `drafted`, `awaiting_approval`, `approved`, `sending`, `sent_verified`, `delivery_unknown`, `held`, `rejected`, `failed` |
| `attempted_at`, `provider_message_id`, `rfc822_message_id`, `thread_id` | From the connector's readback. `rfc822_message_id` is what later replies reference |
| `readback` | Whether the sent message was read back and matched the payload hash |
| `presend_check` | Time of the per-send re-check, the mailbox cursor it read, and the result. A send with no passing `presend_check` is a defect |
| `hold_reason` | The named missing check, or `state_changed` with what changed (reply, bounce, opt-out, suppression, booking, pause, window closed, cap reached) |

## Per enrolment (current state, derived and reconciled)

`enrolment_id`, `lead_id`, `campaign_id`, `state` (see [outreach-run.md](outreach-run.md)), `touches_delivered`, `last_touch_at`, `next_touch_at`, `exit_reason`, `exit_at`, `reply_class`, `forwarded_to`, `forward_receipt`, `owner_decision`, `notes_ref`.

## Per reply or system message

`inbound_message_id`, `thread_id`, `matched_enrolment_id`, `match_method` (thread, headers, sender), `class` (see [reply-handling.md](reply-handling.md)), `received_at`, `classified_by` (rule or human), `action_taken`, `forward_message_id`.

## Per mailbox per day

`mailbox`, `date`, `cap`, `sent`, `bounced`, `complaints_reported`, `replies`, `holds`. Used for the ramp and the pause thresholds.

## Rules

1. Write `awaiting_approval` before asking, `approved` after the owner acts, and `sending` only after the per-send re-check passes and immediately before the connector call, then the outcome after readback. A failed re-check writes `held`, never `sending`. A crash between `sending` and the outcome resolves as `delivery_unknown` and is reconciled against the provider before anything is retried.
2. The suppression list is separate from the ledger and is never edited by the outreach run except to add an entry (opt-out, hard bounce, complaint). Removal is a human decision with a recorded reason.
3. Counts must reconcile: sent = sent_verified + delivery_unknown + failed. Replies, bounces and opt-outs are counted from inbound records, never estimated from silence.
4. Report unavailable data as `null` with a reason. Never turn a connector error into zero, and never carry an old value forward as if newly measured.
5. Opens are not recorded by default. Tracking pixels bring UK cookie rules with them (see [compliance-and-deliverability.md](compliance-and-deliverability.md)). Replies, bounces, opt-outs and bookings are the outcomes.

## Example touch (placeholders only)

```json
{
  "schema_version": 1,
  "project_key": "<project>",
  "campaign_id": "<campaign>",
  "enrolment_id": "<lead_id>:<campaign>",
  "lead_id": "<lead_id>",
  "step": 2,
  "idempotency_key": "<enrolment_id>:2:r1",
  "template_id": "follow-up-new-angle",
  "template_version": "1",
  "angle": "proof-point",
  "evidence_refs": ["<source url or provider record id>"],
  "payload_hash": "<sha256>",
  "approval_ref": "<trusted approval record id>",
  "state": "sent_verified",
  "attempted_at": "<UTC timestamp>",
  "rfc822_message_id": "<message-id from readback>",
  "thread_id": "<connector thread id>",
  "readback": "matched"
}
```
