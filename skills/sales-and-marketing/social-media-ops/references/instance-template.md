# Instance template

Copy this into the host project (never into the skill) and fill it in. An ordinary owner request can supply any value; ask only for what is missing. Keep the filled file, its config and all results in the host's own storage.

## Owners and authority

- Who approves posts, per channel and per account (one person, or either of two):
- Who may say "post now" outside the schedule:
- Who chooses prospect accounts for hiring signals (usually the ideal-customer-profile owner):
- Who reads the weekly listening results, and in which existing report they appear (prefer an existing report to a new mail):
- Spend ceiling per week for paid APIs (X credits, answer-engine calls):
- The hold file or flag that stops every scheduled post and check:

## Channels

For each channel: account, role (primary, mirror, repost only), cadence, credential names in the host's secret store, scopes granted, and status (live, built and waiting on an account or review, or off).

| Channel | Account | Role | Scopes | Status |
|---|---|---|---|---|
| LinkedIn page | | | `w_organization_social` | |
| LinkedIn member | | | `w_member_social` | |
| X | | | `tweet.read tweet.write users.read offline.access media.write` | |
| Instagram | | | `instagram_business_basic instagram_business_content_publish` | |
| Threads | | | `threads_basic threads_content_publish` | |
| Bluesky | | | app password | |

- Where approved pictures are hosted publicly for Instagram and Threads (the platforms fetch them by URL):
- Picture rules: which units may carry a picture on each mirror, and how a credit travels:
- Link rule for X (link in a reply, or inline):

## Approval request

- What the request shows for each channel (words as they will post, picture or not, tags):
- Where the request records what it showed (for example the hash of the picture drawn for each mirror), so the publisher attaches only that:

## AI answer visibility

- Brand name, aliases, domains:
- Competitors to track (mark case-sensitive names):
- 8 to 12 buyer questions in the buyer's words, plus one control question naming the brand:
- Engines (model ids) and the API key's name:
- Weekday and time:
- Minimum spendable credit below which the run abstains:

## Hiring signals

- Accounts, each with its job board source from `hiring discover`, or the reason it cannot be read:
- Role patterns if the defaults (AI, data, digital) do not fit the market:
- Weekday, recipient, and the rule for when a mail goes (first edition always; afterwards only with something new):

## Compliance

- Data-protection basis for any personal data the host processes elsewhere (this skill stores none):
- Platform developer terms accepted for each app, and their review status:
