# Learnings

Dated lessons from running a brand's social channels and listening with an AI marketing agent and human owners. Anonymised: no account, person, message or customer is named. Each has what was observed, the rule it produced, and how to check it.

### L01 · 2026-05-10 and 2026-10-03 · LinkedIn drops text after an unescaped character

- **Observed:** a page post was cut at a bracket. LinkedIn answered success; everything after the `(` was gone. A second time, in a later month, a `|` before a link removed the link, the question and the hashtags from every page post for weeks.
- **Rule:** escape every reserved little-text character before posting, and read back the live text to check it still ends the way the sent text ends.
- **Check:** post a test containing `( ) | { } _ *` and compare the read-back commentary.

### L02 · 2026-09-15 · An API version lapses on a date

- **Observed:** every LinkedIn call started failing with 426 `NONEXISTENT_VERSION` the day the pinned monthly version was retired.
- **Rule:** keep the version a setting, note its retirement date, and move it forward a month ahead.
- **Check:** a daily identity call with the pinned version header.

### L03 · by 2026-08-06 · A link in an X post costs thirteen times more

- **Observed:** under pay-per-use pricing a post carrying a URL cost $0.200 against $0.015 without.
- **Rule:** put the link in a reply to the post.
- **Check:** the developer console's usage by request type.

### L04 · by 2026-08-06 · An OAuth sign-in captures whoever is logged in

- **Observed:** a consent run saved tokens for a different account than the one the app was meant for, because the browser had that account open.
- **Rule:** after every token exchange, ask the platform who the token is, and refuse to save it when it is not the expected account.
- **Check:** the identity call before any write.

### L05 · 2026-09-25 · A mirror that carries no picture makes picture rules moot, until it does

- **Observed:** the X mirror was text only, so worries about a news photograph's credit on X were unfounded. Switching pictures on reverses that: every credited picture then needs a plan.
- **Rule:** keep credited pictures off any mirror that cannot carry the credit, and keep units approved as text only on a mirror text only there.
- **Check:** the approval request records which picture it drew on each mirror; the publisher attaches only that hash.

### L06 · 2026-10-10 · Four "reach" repositories, one failure

- **Observed:** a browser-extension cross-poster, a paid-unblocker scraper collection, a logged-in browser bot that scraped jobs and auto-applied, and a social-network spider that ignored robots.txt with a key committed in its settings. Each promised reach; each depended on driving accounts through the UI or getting past blocks.
- **Rule:** run the four-question vetting before anyone installs anything, and keep the idea rather than the code.
- **Check:** `vet` flags all four on their own code.

### L07 · 2026-10-10 · Most large employers' job boards are not machine-readable within the rules

- **Observed:** of nineteen aviation employers, seven could be read: two through public postings APIs, two through their career sites' own job lists, three through job sitemaps. The rest drew their lists with scripts, loaded them through paths robots.txt disallows, or disallowed all automated reading.
- **Rule:** keep unreadable accounts on the list with the reason; the gap is information for the owner.
- **Check:** the source health table in each report.

### L08 · 2026-10-10 · A router can refuse a call it could afford

- **Observed:** with a few cents left, answer-engine calls failed because no `max_tokens` was sent and the router reserved the model's whole output window.
- **Rule:** send `max_tokens` on every call, check the spendable credit (the lower of account credit and the key's own monthly limit) first, and abstain with a note below a floor.
- **Check:** the run writes an abstention file instead of errors.
