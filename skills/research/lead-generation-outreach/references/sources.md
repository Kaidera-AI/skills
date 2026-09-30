# Sources and evidence strength

All pages below were fetched on 2026-09-30 unless stated. This skill bundles no third-party code or text beyond short attributed figures. Evidence strength, weakest to strongest: **practitioner** (one expert's method or claim), **vendor** (a tool company's own data on its own users, not independently audited), **study** (a published analysis with a stated method), **primary** (a law, standard, regulator or platform rule).

Re-read the current source before relying on a figure. Figures date quickly.

## Timing, cadence and length

| Source | Strength | What this skill uses | Caveat |
|---|---|---|---|
| [Instantly, Cold Email Benchmark Report 2026](https://instantly.ai/cold-email-benchmark-report-2026) (updated 2026-01-12) | vendor | Average reply rate 3.43% and 10%+ for the top tier; 58% of replies come from step 1 and 42% from follow-ups; 4 to 7 touches, 3 to 4 days apart; each follow-up adds a new angle; step 2 written as a reply outperforms formal follow-ups by about 30%; first-touch emails under 80 words; one ask; problem-first; warm up at 5 to 10 a day over 4 to 6 weeks; bounce under 2%; weekday pattern | Vendor data. The page says "billions" of interactions. Summaries elsewhere cite different sample sizes and a different optimum number of touches, so do not quote those |
| [Boomerang, 7 tips for more responses, with data](https://blog.boomerangapp.com/2016/02/7-tips-for-getting-more-responses-to-your-emails-with-data/) (2016) | study | Reading level (third grade best: about 53% against 39% at college level), length (50 to 125 words above 50% response), subject length (3 to 4 words), 1 to 3 questions, slightly positive or negative tone, opinion | Over 40 million emails from users who asked to be reminded about replies. General email, not cold outreach. Response means a reply of any kind. Readers in the comments questioned what was measured |
| [Gong Labs, cold email CTA study](https://www.gong.io/blog/this-surprising-cold-email-cta-will-help-you-book-a-lot-more-meetings) (2020-05-27) | study | 304,174 emails; success = a meeting booked within 10 days; interest ask best in cold email; specific-time ask best in a deal | Chart values are images. Only the figures stated in the text and chart descriptions are used. Vendor data |

## Writing method

| Source | Strength | Use |
|---|---|---|
| [Samantha McKenna, The 7 Elements of a Perfect Cold Email, Apollo Magazine](https://www.apollo.io/magazine/the-7-elements-of-a-perfect-cold-email) (updated 2025-08-13); [#samsales resource page](https://www.samsalesconsulting.com/resource/7elementsofperfectcoldemail/) | practitioner | The seven elements; subject only that person would understand; drop throat-clearing openers; challenge before value; name the hidden objection; ask, never a specific time, no calendar link in the first email; loss aversion. Her quoted open and reply rates (43% and 20%) are her own figures and are not used as benchmarks |
| [Josh Braun, Cold Email CTAs](https://joshbraun.com/cold-email-ctas/) (2021) | practitioner | Do not ask a stranger for time; ask a question that makes them reconsider their current approach |

## Sequences in practice

| Source | Strength | Use |
|---|---|---|
| [HubSpot, Unenroll contacts from a sequence](https://knowledge.hubspot.com/sequences/unenroll-from-sequence) (2026-08-26) | primary (a product's documented behaviour) | The exit list: a reply to any sequence email, a reply from a different or alias address, optionally a colleague at the same company, a booking, an unsubscribe, a bounce; unenrolling does not undo sent mail and only stops scheduled steps; out-of-office detection depends on server responses and fails for some client pairs |
| [Twenty documentation: workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions), [triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers), [send emails from workflows](https://docs.twenty.com/user-guide/workflows/capabilities/send-emails-from-workflows) | primary (a product's documented behaviour) | Twenty's own Send Email action is described as not suited to automated email sequences, sends only from mailboxes synced to the acting user's own account, takes one recipient, and cannot add HTML signatures; scheduled triggers run in UTC; a Delay action exists; Search Records returns at most 200. So the CRM holds records and history; the daily run holds sequence logic |

## Compliance and standards

| Source | Strength | Use |
|---|---|---|
| [ICO, Business-to-business marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/) (page dated 2025-05-22; under review after the Data (Use and Access) Act) | primary | Corporate and individual subscribers under PECR; identity and opt-out address; UK GDPR for named contacts; privacy information within a month; absolute right to object; public data is not permission; professional networking profiles; suppression lists; tracking-pixel cookie rules |
| [15 U.S.C. 7704 (CAN-SPAM)](https://www.law.cornell.edu/uscode/text/15/7704) | primary | False header and deceptive subject bans, identification as an advertisement, working opt-out for 30 days, 10 business days to honour it, valid postal address, address harvesting and generated addresses as aggravated violations. The FTC's plain-language guide could not be fetched (HTTP 403) and is not used |
| [Google, Email sender guidelines](https://support.google.com/mail/answer/81126?hl=en) | primary | Authentication, spam rate, the 5,000 a day bulk threshold and one-click unsubscribe, `Re:` and `Fwd:` rule, display-name rule, do not buy lists, increase volume slowly |
| [RFC 3834](https://www.rfc-editor.org/rfc/rfc3834), [RFC 3463](https://www.rfc-editor.org/rfc/rfc3463.html), [RFC 3464](https://www.rfc-editor.org/rfc/rfc3464.html), [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058.html) | primary | The `Auto-Submitted` header for automatic replies (RFC 3834); status code classes 2, 4 and 5 meaning success, transient error and permanent error (RFC 3463); the delivery status notification format (RFC 3464, known here from RFC 3834 and search excerpts, not read in full); one-click unsubscribe signalling (RFC 8058) |

Not researched and not asserted: rules outside the UK and US, Microsoft and Yahoo sender requirements, and any legal test that depends on a specific member state's law.

## The operator's own earlier notes

Unpublished, not bundled, and second-hand in places. Their figures are targets, estimates or community claims, not measured results, and are labelled that way wherever this skill uses one: the signal tiers and scoring, the lists of subject lines and hooks, the objection scripts, the reply-time target, the four-touch and seven-touch patterns, the unattributed CTA test, the value-equation framing, and one recorded failure (emailing a client and its supplier in one message). Nothing in those notes derives from Apollo Magazine or Academy content; the McKenna method above was read from the published article.

## Lead-side sources and reference projects

Reviewed 2026-09-08. These are integration choices, not installed services. Refresh provider documentation before configuring a host. Prefer a customer's working stack over adding another subscription.

| Need | Starting point | Material constraint |
|---|---|---|
| Existing demand | Authorized forms, CRM and correspondence | Verify project/account scope and contact permission |
| Company and buyer discovery | Official company sources; supported search; [Apollo People Search](https://docs.apollo.io/reference/people-api-search) | Apollo search finds prospects but does not return email/phone; enrichment is separate |
| Contact enrichment | [Apollo enrichment](https://docs.apollo.io/reference/people-enrichment) | May consume credits; paid scope must be approved. Provider match confidence is not channel permission |
| Rich account research | [Clay account research agents](https://university.clay.com/docs/account-research-agents) | An optional managed research service; validate cited evidence and customer data-sharing scope |
| Workflow orchestration | [n8n](https://github.com/n8n-io/n8n) on an operator-managed installation | Community templates can send immediately. Review side-effect nodes and leave activation off until approved; do not bundle n8n into a commercial product without resolving its [license](https://github.com/n8n-io/n8n/blob/master/LICENSE.md) |

### How to use the earlier Scout reference

[kiryano/Scout](https://github.com/kiryano/Scout/tree/183868d4fe4b9800d649d814ad8685750cc5637d), MIT, reviewed at `183868d4fe4b9800d649d814ad8685750cc5637d`. That is also the upstream main revision observed on the review date. This skill includes no upstream code.

Scout accepts known usernames and extracts profile/contact information. Use its normalized, provenanced record idea. Its profile acquisition is not company discovery, a complete CRM enrichment contract or appointment setting. Even its GitHub adapter imports proxy/user-agent helpers, so importing a seemingly benign module is not an approved shortcut.

Use official APIs through the host's supported clients, such as the [GitHub REST API](https://docs.github.com/en/rest), where the target audience makes that source relevant. No bulk harvesting just to reach a count. Do not run Scout's interactive launcher, updater, personal-session-cookie scraping, stealth/proxy rotation or SMTP email guessing. Restricted social-platform acquisition remains unavailable until a supported method and source-specific authorization have been established. Do not use a public-link catalog as an executable tool allowlist.

An external page may link to internal or unrelated addresses. Follow links only through the host's managed fetcher with its destination checks; do not invent a fetch bypass. A blocked or rate-limited source becomes an explicit missing field, never a reason to evade restrictions.

### Optional n8n implementation

Use the existing host coordination service if it already handles events. If n8n is chosen, translate the skill into reviewed steps: intake → bounded research → normalize → CRM match/suppression → qualification → review queue → approved delivery → reply routing. Keep credentials in that host's secret settings and the CRM as record authority.

Require authenticated intake, stable event IDs, durable duplicate-event checks, a persisted action ledger and bounded retries. An uncertain write stops for reconciliation. The model proposes the next action; deterministic checks enforce permission, scope, suppression and duplicate prevention immediately before a write. Disable imported schedules and send/call nodes until verified. Community templates demonstrate patterns and provide no proof of this customer's installation.

### Reference projects reviewed 2026-09-28

Method references only. This skill includes no upstream code, and none of these installers or launchers is part of it. Each row is pinned to the commit reviewed. Read the current licence file before relying on any of them.

| Project | Reviewed commit | Licence | Method worth reusing | Constraint |
|---|---|---|---|---|
| [Kappaemme-git/codex-first-customer-finder-skill](https://github.com/Kappaemme-git/codex-first-customer-finder-skill/tree/d3f6964bd989745ac183edbd545c588a68451146) | `d3f6964` | MIT | Evidence-first prospects; a verified public route or an explicit missing-route warning; keep, maybe and reject feedback; stable prospect IDs; a local history of contact outcomes | Its installer targets one harness's skills folder; do not run it. Public-route inspection is not recipient consent |
| [eracle/OpenOutreach](https://github.com/eracle/OpenOutreach/tree/2d6b8a063af6ecc68ecb47120be8aaf1390ba464) | `2d6b8a0` | GPL-3.0 | The ICP written as a sentence; a verdict per person with the reason written out | Ideas only, no text or code copied. Its contact path buys addresses from a licensed provider, so it needs the same paid-scope approval as any enrichment |
| [trycompai/crm](https://github.com/trycompai/crm/tree/6d4793dd6d7aeea91aa6a034e00b17d7408a2d08) | `6d4793d` | MIT | The CRM as the agent's notes; tools report observations, never a self-graded confidence | A reference design, not a required CRM |
| [twentyhq/twenty](https://github.com/twentyhq/twenty/tree/42bb2bd8f964aa8a75e956300fac51befe21ff99) | `42bb2bd` | Not asserted on GitHub | A CRM with an object model defined as code | Read its `LICENSE` before depending on it commercially |
| [AfterShip/email-verifier](https://github.com/AfterShip/email-verifier/tree/a97c75ff8da09ebfcd30011197cacc78b1c5458e) | `a97c75f` | MIT | Default verification of a found address: syntax, domain mail records, disposable and role flags, mailbox check with catch-all detection | Verifies an observed address only; a pass is not consent |
| [reacherhq/check-if-email-exists](https://github.com/reacherhq/check-if-email-exists/tree/81da93e8a419f601c05e1bcf4a197d25eb0e349d) | `81da93e` | Dual: AGPL-3.0, or a paid commercial licence (per its `LICENSE.md`) | Same job, as an HTTP service | Do not link it into a closed deployment without the licence that applies; needs outbound port 25, which many networks block |
| [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper/tree/d0b51bcf3cd56d9a3f71e049cb6e226554e24162) | `d0b51bc` | MIT | Business listings for local-business campaigns | Suits only businesses with a public map listing; check the source's terms and the host's authorization first; its agent-skill installer is not used |

Every reference above shares the boundary of the Scout paragraph: no personal-session scraping, no address guessing, no bulk harvesting to reach a count. A comparison with Apollo, Clay or n8n above does not change which choices need approval.

The design in the lead-side half of this skill (an unattended batch that stops at one review queue, stable IDs with owner feedback, observed-only records, verifying only found addresses) shares its method with the Kaidera Marketing OS lead generation skill. The First Customer Finder pattern (per-prospect evidence, keep, maybe and reject feedback, never sends) informs the owner feedback loop in the daily run.
