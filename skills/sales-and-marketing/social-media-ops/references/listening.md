# Listening: AI answer visibility and hiring signals

Both checks run weekly on fixed inputs. One week is noise; the trend is the product. Neither collects anything about a person.

## AI answer visibility

Buyers ask AI assistants which suppliers to consider. This check asks the same questions every week and records whether the brand is in the answer.

**Inputs (instance file):** the brand name, aliases and domains; the competitors to track (some are common words, so mark short or capitalised names case-sensitive); 8 to 12 buyer questions in the buyer's own words, plus one control question that names the brand ("What is <brand>?"); the engines; a per-run budget.

**Engines:** web-grounded models through an official API. One OpenAI-compatible key (an OpenRouter key, for example) reaches Perplexity Sonar and search-enabled models from other vendors. Never scrape a consumer chat interface and never sign in as a person. Three engines and ten questions cost well under a dollar a run in October 2026.

**Each answer records:** brand named or not; its rank among the tracked names, by first mention; the competitors named; whether the brand's domain is among the cited sources; every cited domain; the cost.

**Rules that matter:**

- Send `max_tokens` on every call. Some routers reserve the model's whole output window against the balance when it is missing, and a nearly empty account then refuses calls it could have afforded.
- Check spendable credit first and abstain below a floor, writing why. A router can have two ceilings, account credit and a per-key monthly limit; the lower one is what you can spend.
- A failed call is recorded as an error and left out of the counts, never counted as "not named".
- Same questions, engines and weekday every week. Change them only between quarters, and say so in the report.
- Report: named in N of M answers, cited in K, last week's figure, the three names given most often instead, and the most cited domains. The cited domains are the to-do list: they are where the engines learn who matters.

## Hiring signals

An organisation advertising AI, data or digital roles is spending in that area, and the advert usually names the team. That is an opening for a sales conversation and a reason to call.

**Read only the employer's own job board:**

| Board | Route | Governed by |
|---|---|---|
| Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, Workable, Personio | their public postings APIs | the board's API terms |
| Workday | the career site's own job-search endpoint, searched by keyword | the site's robots.txt |
| iCIMS Jibe career sites | the site's own `/api/jobs` list | robots.txt and its Crawl-delay |
| SAP SuccessFactors career sites | the job sitemap (RSS feeds there sit under a disallowed path) | robots.txt |
| Avature and other server-rendered lists | job links on the vacancies page, paged | robots.txt |
| Any site with schema.org `JobPosting` JSON-LD | the page itself | robots.txt |

Never a social network's job search, never a logged-in session, never a proxy, never a page that robots.txt closes, and keep each site's Crawl-delay. Many large employers will turn out to be unreadable: their list is drawn by a script, or loads through a disallowed path, or robots.txt says no to everyone. Keep those accounts on the list with the reason, so the owner sees the gap instead of a silent omission.

**Matching:** role patterns on word boundaries, never substrings (a substring match for a short acronym once read "transport" as an air-navigation provider and filled a list with false positives). Exclude obvious noise: data entry, internships, apprenticeships. Match on title and team only.

**Adding an account:** run `hiring discover <careers page>`; it names the board behind the page (or the reason it cannot be read) and gives the config line.

**Report:** new since last week first, then everything open, then source health: which accounts were read, how many adverts, how many matched, and which could not be read and why. Choosing accounts belongs to whoever owns the ideal-customer profile, not the agent.
