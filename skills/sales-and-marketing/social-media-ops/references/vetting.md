# Vetting a scraper, extension or automation tool

Owners and colleagues send repositories that promise reach: "post everywhere from one box", "scrape any profile", "auto-apply to jobs". Review each one before anyone installs or runs it. Clone it into an empty directory, never run its code or install its dependencies, and run the scan:

```
python3 tools/social-ops.py vet path/to/clone
```

The scan reads the code and reports red flags with file and line, plus the licence and last commit. It is triage, not a verdict. Read the flagged lines, then answer four questions:

1. **Does it get past a site's blocks?** Stealth or fingerprint plugins, proxy pools or paid unblockers, user-agent rotation, CAPTCHA solving, robots.txt switched off. If yes, it is out, whatever it costs and however good the data is. Its value is the evasion.
2. **Does it drive a real account?** A stored account password, a login form filled by script, saved session cookies, a web composer filled and submitted. If yes, the account is what is at risk, and for a founder that is their personal profile.
3. **Does it collect personal data?** Profile pages, people searches, recruiter lists. If yes, data-protection notice duties follow every row, and there is usually a lawful route already: the member's own connections export, or an enrichment provider with its own basis.
4. **Does it leak or phone home?** A committed API key, a local server with open CORS and no authentication, a background poll to the vendor's server that can trigger actions in the user's logged-in browser, or a closed module in the store build that is not in the repository.

Then check the **licence**: no licence file means all rights reserved and no reuse; a network-copyleft licence (AGPL, OSL family) can oblige you to publish your own source if the code runs in your product. And check **upkeep**: a two-commit repository generated in one afternoon will not follow the next UI change.

## Keep the idea, not the code

Almost every rejected tool points at a real need. Write down the idea and build it on an official route:

| What the tool did | The idea | The official route |
|---|---|---|
| Typed posts into each network's web composer | One approved post, many channels | The platform APIs in [publishing](publishing.md), with read-back |
| Scraped AI chatbots' answers | Do AI assistants name us? | The AI answer visibility check in [listening](listening.md) |
| Scraped a network's job search, or auto-applied to jobs | Who is hiring for what | Hiring signals from employers' own boards, in [listening](listening.md) |
| Scraped people's profiles | Who should we talk to | The member's connections export and a lawful enrichment provider |

## Write it up

Give the owner a verdict in the first line, then what the tool is, why it fails (by question), the ideas worth keeping, and what you need from them. Record the review with the commit you read, so nobody reviews the same repository from scratch again; next time check only the commit date and whether the failing points changed.
