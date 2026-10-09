# The investor database

The investor database is the portable record of a raise: who was researched, why, what they were sent, what they said and what the team learned. It is rebuilt from the outreach records, so it can be thrown away and rebuilt at any time, loaded into any CRM, and carried into the next round or the next company.

Keep it in the instance's private storage. It holds names, addresses and notes about people, so it never goes into a public repository or a shared skill.

## Schema

SQLite works everywhere and needs no server. One row per fund, per person, per evidence item, per touch, per outcome and per meeting, plus the learning log:

```sql
CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);

CREATE TABLE funds (
  fund_id TEXT PRIMARY KEY,          -- the fund's website domain
  name TEXT NOT NULL,
  investor_type TEXT,                -- VC_FUND, CVC, ANGEL_NETWORK, ANGEL, FAMILY_OFFICE
  region TEXT,
  based_in TEXT,
  thesis TEXT,                       -- in the fund's own words
  stage_fit TEXT,
  min_cheque_amount REAL,            -- as published
  min_cheque_currency TEXT,
  min_cheque_base REAL,              -- converted to the instance base currency
  min_cheque_source TEXT,            -- the page it was read on
  min_cheque_note TEXT,
  conflict_note TEXT,                -- competitor backers and other holds
  pitch_route TEXT,                  -- form, email or network submission
  people INTEGER,
  people_contacted INTEGER,
  outcome TEXT,                      -- best status reached by anyone at the fund
  first_researched TEXT,
  last_touch TEXT
);

CREATE TABLE people (
  lead_id TEXT PRIMARY KEY,          -- fund domain + name slug
  fund_id TEXT REFERENCES funds(fund_id),
  name TEXT NOT NULL,
  role TEXT,
  profile_url TEXT,
  email TEXT,                        -- only a verified address
  email_status TEXT,
  email_domain_agrees INTEGER,
  batch_id TEXT,
  researched_at TEXT,
  priority INTEGER,
  qualification TEXT,
  opening_line TEXT,
  deck_figure TEXT,                  -- the round figure their deck carried
  test_arm TEXT,                     -- A/B half, if any
  released_by TEXT,
  released_at TEXT,
  hold_reason TEXT,
  status TEXT NOT NULL               -- see the status vocabulary
);

CREATE TABLE evidence (
  lead_id TEXT REFERENCES people(lead_id),
  claim TEXT,
  source_url TEXT,
  retrieved_at TEXT,
  label TEXT                         -- observed, provider-asserted or inferred
);

CREATE TABLE touches (
  lead_id TEXT REFERENCES people(lead_id),
  step INTEGER,                      -- 1 first email, 2 follow-up
  sent_at TEXT,
  to_address TEXT,
  message_ref TEXT,
  kept_copy TEXT                     -- path to the email as sent
);

CREATE TABLE outcomes (
  lead_id TEXT REFERENCES people(lead_id),
  at TEXT,
  kind TEXT,                         -- replied, colleague_replied, declined, opted_out, bounced, closed
  detail TEXT,
  message_ref TEXT
);

CREATE TABLE meetings (
  thread_ref TEXT,
  lead_id TEXT REFERENCES people(lead_id),
  state TEXT,                        -- booked, held, closed
  starts_at TEXT,
  detected_at TEXT,
  note TEXT
);

CREATE TABLE learnings (
  learning_id TEXT PRIMARY KEY,      -- L01, L02 ...
  learned_on TEXT,
  title TEXT,
  observed TEXT,
  rule TEXT,
  evidence TEXT,
  generic INTEGER                    -- 1 when the lesson is safe to publish without names
);
```

## Status vocabulary

A person's status is the furthest point their record proves, never an inference:

| Status | Proved by |
|---|---|
| `researched` | A record with evidence |
| `no_address` | Research done, no verified address |
| `held` | A hold reason on the record |
| `released` | The release owner's yes, by lead id |
| `contacted` | Email 1 sent and kept |
| `followed_up` | Email 2 sent and kept |
| `colleague_replied` | Someone else at the fund replied; this person was stopped |
| `replied` | This person, or the fund's team on their thread, wrote back by hand |
| `meeting` | A call with someone at the fund is on the calendar |
| `declined` | The fund said no |
| `opted_out` | The person or the fund asked not to be contacted |
| `closed` | The conversation ended for another recorded reason |

A fund's outcome is the furthest status any of its people reached, with `declined` and `opted_out` taking precedence over `replied`.

## Rebuilding

Rebuild from the outreach records (lead files, the sequence ledger, releases, meetings and kept copies) and, where available, the CRM's stages. A rebuild replaces the file; nothing is edited by hand. Write a small stats file next to it (funds, people, contacted, replied, declined, meetings, learnings) so a weekly report can quote it without opening the database.

## Using it in the next raise

Before researching a new round, load the last database: funds that declined and why, funds whose minimum sat above the round, funds that asked for a form, and people who opted out (who stay out). A fund that declined one round may fit the next; a person who opted out does not.
