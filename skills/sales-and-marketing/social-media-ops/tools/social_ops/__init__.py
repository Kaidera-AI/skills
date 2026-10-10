"""social_ops: publish, listen and vet through official routes only.

A small standard-library toolkit, written once and used two ways: the host's own
publisher and weekly checks import it from here, and the generic skill edition
ships a verbatim copy under tools/. Nothing in this package names a company,
person, account or credential; every caller passes its own.

Modules:
    http           request helper with one patchable transport, multipart encoder
    x_api          X API v2: picture upload, alt text, post, read-back
    linkedin       LinkedIn Posts API: little-text escape, picture upload, post, read-back
    meta           Instagram (Instagram Login) and Threads: container, publish, permalink
    bluesky        AT Protocol: session, picture blob, post with link facets, read-back
    robots         robots.txt verdicts for pages and undocumented endpoints
    hiring         public job-board readers and a role matcher for hiring signals
    ai_visibility  ask AI answer engines buyer questions, record who they name
    vetting        static red-flag scan of a third-party scraping or automation repo
    cli            one command line over all of the above

Rules every module keeps: official, documented routes; no login automation; no
proxy, user-agent rotation or block evasion; posting is dry-run unless the caller
passes live=True; every live post is read back before it counts as published.
"""

__version__ = "1.0.0"
