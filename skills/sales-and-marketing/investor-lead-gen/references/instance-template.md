# Instance template

Copy this into the company's own workspace and fill it in. The skill reads it before every turn. Nothing here goes back into the shared skill.

```yaml
company:
  legal_entity: ""            # name, number, registered office for the footer
  based_in: ""                # the line email 1 states, for example "a London-based company"
  products: []                # full names; never only an acronym
round:
  instrument: ""              # pre-seed, seed
  range: ""                   # the published range
  ceiling: ""                 # a figure above this needs the founder
  figure_tiers: []            # for example [250000, 750000, 2000000]
  base_currency: ""
  currency_by_region: {}      # for example {Europe: EUR, default: USD}
  fx_reference: ""            # named reference rate used on research dates
deck:
  teaser: ""                  # path to the pinned short deck and its hash
  full: ""                    # path to the fuller deck for forms and first calls
owners:
  release: []                 # who releases names (by address)
  copy: []                    # who approves copy versions
  meetings: []                # who takes calls; copied on every email
  founder_only: []            # actions only the founder can approve (spend, terms, sending as them)
  never_copied: []            # people who must not receive this lane's mail
sender:
  from: ""
  signature: []
  cc: []
  disclosure_test: false      # A/B test of a one-line AI disclosure
cadence:
  daily_new_cap: 10
  local_window: "07:30-11:30"
  follow_up_business_days: 7
  meeting_reminder_business_days: 7
  people_per_fund_max: 5
records:
  crm: ""                     # system of record for stages
  database: ""                # path to the investor database
  kept_copies: ""             # where each email is kept as sent
  kill_switch: ""             # file or flag that stops every send
exclusions:
  competitors: []             # companies whose backers are held for the owners
  customer_lists: []          # lists whose organisations are excluded
compliance:
  footer_lines: []
  processing_basis: ""
  retention: ""
  individuals_cleared: false  # financial promotion check done for private individuals
memory:
  store: ""                   # the team's memory store for learnings (vectors and graph)
  ingest_command: ""
```
