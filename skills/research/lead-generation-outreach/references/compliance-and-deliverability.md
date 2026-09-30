# Compliance, approval and deliverability

This is operating guidance drawn from the sources listed in [sources.md](sources.md). It is not legal advice, and it covers only the rules those sources state. The owner's policy record decides the basis, region rules and retention. Where a region is not covered here, the run holds contact use for people in that region until the owner records the rule.

## What the owner approves

An approval names the concrete recipient set, channel, sender, message text and timing, or the exact CRM change. It expires with that payload. The run needs three approvals, and each is separate:

1. **The campaign brief** (once, then on change): offer, ideal customer, sender identity, human sales lead and their address, sequence and step texts as templates, caps, timezone, quiet period, stop rules, and the policy record for the regions involved. Approving the brief permits drafting and queueing. It does not permit sending.
2. **The day's batch** (each run): the exact messages in the review digest. Unedited items can be approved in one action. An edit changes the payload hash and is approved again. Follow-ups are drafted per person and go in the same digest.
3. **Any paid step** (per action): paid enrichment, verification credits, a new provider account.

A wider standing approval, for example letting pre-approved templates go out with observed CRM fields filled in and no daily review, is a change to the per-action send approval this skill assumes. That is an owner decision, made outside this skill. The skill does not assume it.

Forwarding a reply to the named sales lead needs no further approval. Replying to the prospect does.

## Lawful contact, by what the sources say

- **UK, business email.** Under PECR, the consent rule for marketing email does not apply to corporate subscribers (companies, LLPs, some government bodies), but the sender must not conceal identity and must give a valid address for opting out. Sole traders and some partnerships are individual subscribers and need consent or the soft opt-in. If it is unclear which a recipient is, treat them as an individual subscriber and do not cold email them (ICO business-to-business marketing guidance).
- **UK GDPR still applies** when the address identifies a person. Legitimate interests need a three-part test (an interest, necessity, a balance against the person's rights), and you must tell the person about the use of their data within a reasonable period and no later than one month after collecting it from a public source. The right to object to direct marketing is absolute. Keep objections on a suppression list rather than deleting the record. The ICO page notes its guidance is under review following the Data (Use and Access) Act.
- **Public is not permission.** The ICO says the fact that an address is public does not mean the person agrees to marketing. Professional networking profiles are often personal capacity, so messages to them are not B2B marketing.
- **US, commercial email.** CAN-SPAM (15 U.S.C. 7704) bans false header information and deceptive subject lines, and requires clear identification that the message is an advertisement or solicitation (unless there was prior consent), a working opt-out mechanism, a valid physical postal address, and honouring an opt-out within 10 business days. Address harvesting from a site that forbids it, and generating addresses by automated permutation of names and letters, are aggravated violations where the message is otherwise unlawful. That is a legal reason, beyond this skill's own rule, never to guess an address.
- **Other regions.** Not covered by these sources. Do not assume the UK or US position applies elsewhere.

Every message therefore carries: a truthful sender name and subject, who the sender is and why they are writing, a physical postal address where the region requires it, and a plain way to say no (a reply line such as "If this isn't relevant, tell me and I will not write again" works when a human reads replies, and is honoured as an opt-out). Add a `List-Unsubscribe` header if the connector allows it. Honour every opt-out at once, not at the legal deadline.

## Deliverability rules that affect one-to-one sending

From Google's sender guidelines (all Gmail recipients): authenticate with SPF or DKIM, keep valid forward and reverse DNS, use TLS, format to RFC 5322 with a valid Message-ID, keep the Postmaster spam rate under 0.3% (aim under 0.1%). Senders above 5,000 messages a day to Gmail must also use SPF, DKIM and DMARC with alignment and one-click unsubscribe (RFC 8058). One-to-one volumes sit far below that threshold, but authenticating all three is cheap and the volume rules then never surprise you.

Google also says:

- Do not start a subject with `Re:` or `Fwd:` unless the message is a real reply or forward. A follow-up sent inside the same thread as the first message is a real reply to your own message. A fresh first email with a fake `Re:` subject breaks this rule and CAN-SPAM's ban on deceptive subject lines.
- A display name must identify the sender. It must not contain the recipient's name or imply a threaded conversation.
- Do not buy address lists, and do not mail people who did not sign up to hear from you. The second item is a tension with cold outreach itself. It is why targeting, relevance and an easy no matter, and why the spam-rate ceiling is the metric to watch.

From Instantly's benchmark report (vendor data): warm up a new domain at 5 to 10 a day over 4 to 6 weeks, keep volume consistent, keep bounce under 2%, verify addresses first, treat catch-all domains and enterprise gateways (Proofpoint, Mimecast, Barracuda) with care, and use SPF, DKIM and DMARC. Common practice, not a Google rule: send from a dedicated sending subdomain with its own authentication, never from the hostname that serves an application, and set Reply-To to the mailbox a human reads.

## Tracking

Tracking pixels are off by default. The ICO notes that UK cookie rules apply to a pixel that stores or reads information on the recipient's device, and an open is a weak signal. Decisions rest on replies, bounces, opt-outs and bookings. Link tracking, if the owner wants it, carries the campaign identifier as a parameter so it joins to analytics, and appears in the approved payload.

## Suppression

Check the suppression list, the do-not-contact list, existing customers and open opportunities at three points: when enrolling, when drafting, and immediately before each individual delivery, together with a fresh read of the mailbox for replies and opt-outs. The last check is the one that matters when approval arrives hours after drafting. Missing access to the list holds contact use. Bounced and unsubscribed addresses are never re-imported, re-added or cleaned up.
