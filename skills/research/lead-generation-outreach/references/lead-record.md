# Lead batch contract

Use JSON or an equivalent structured work-product in the customer workspace. These fields describe evidence and workflow state; this document is not a live API schema or an authorization engine. Do not upload private lead records to template source or public research reports.

Record `schema_version: 1`, `project_key`, `batch_id`, `lead_id`, `acquired_at` (UTC) and `campaign_brief_ref`. The owner chooses retention through an applicable policy decision. Keep only information needed for the approved purpose.

`lead_id` is stable across batches: reuse the CRM or provider ID when one exists; otherwise derive it from the normalized company domain plus the person's profile URL or exact name and role, and keep the derivation with the record. A new batch that meets a known `lead_id` updates that lead and never creates a second one.

For each lead include:

- Identity: company, domain, person name, role, profile URL and stable CRM/provider IDs when known. Preserve unresolved identity conflicts.
- Evidence: source URL or provider record, retrieval timestamp, observed fact and whether it is observed, provider-asserted or inferred. Do not copy entire profiles unnecessarily. Record what a tool observed; do not attach a model-generated confidence number to any fact.
- Contact methods: type, value, the source where the value was found, and a verification block: checks run (syntax, domain mail records, disposable or role flag, provider or mailbox check), each result, time, and any caveat such as a catch-all domain or an unreachable mail port. Missing values are null, never generated guesses. A value not found on a source is not recorded.
- Qualification: fit, need, role and timing, each with evidence or an explicit unknown; overall qualified/review/excluded plus a written reason. Do not derive protected or sensitive traits. A numeric score, if used, only orders review.
- Processing: authorization status (`pending_policy` by default), actual policy decision reference, jurisdiction, purpose and retention deadline. Unknown policy fields block contact use; agents cannot manufacture approval by changing these fields.
- Contactability: allowed channels from trusted evidence, suppression status and check time, suppression record reference, opt-out/bounce/existing-relationship flags. Unknown is a hold.
- Reconciliation: exact match/possible match/new, duplicate-of ID, preserved source IDs and proposed blank-field CRM changes. No silent merges.
- Owner feedback: keep, maybe or reject; the owner's reason; decision time. Later reported outcomes (contacted, replied, opted out, bounced) as dated manual entries, kept apart from any provider execution receipt.
- Next action: research/draft/review/hold/appointment, owner and reason; draft artifact and approval references where applicable. Keep provider execution receipt separately.

Counts must reconcile: examined = unique + duplicates; unique = qualified + review + excluded. Contact-use holds can overlap these qualification categories and must be labelled separately. A qualified account can lack a usable contact method.

Example disposition: an on-target account with a cited hiring signal but no verified buyer or suppression lookup is `review`, with contact-use `hold`. Return the sourced company research and the missing checks. Do not create an address from the person's name or treat a full-looking record as outreach approval.
