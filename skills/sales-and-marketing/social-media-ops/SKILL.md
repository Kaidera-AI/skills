---
name: social-media-ops
description: Publish to LinkedIn, X, Instagram, Threads and Bluesky through each platform's official API and read every post back, measure whether AI answer engines name the brand, read prospects' own job boards for hiring signals, and vet scraping or automation tools before anyone runs them. Use for any company's or brand's social channels and market listening; never for scraping a social network or driving a logged-in browser.
license: Apache-2.0
metadata:
  version: 1.0.1
  updated: 2026-10-10
  source: Kaidera-AI/skills
  posture: unvetted-source-candidate
---

# Social media publishing, listening and tool vetting

Use this skill when an agent runs a brand's social channels or listens to its market: posting approved copy to LinkedIn, X, Instagram, Threads or Bluesky; checking whether AI answer engines name the brand when a buyer asks; watching prospects' job adverts for buying signals; or judging a scraper, browser extension or "auto-poster" someone has sent. It is written for any company and any brand. Everything that belongs to one brand (accounts, owners, approval gates, sender, questions, competitors, prospect accounts) lives in an instance file built from [the instance template](references/instance-template.md), never in this skill.

The skill grants no authority. Posting, spending API credit, sending a report and adding an account to a watch list each need the authority the instance file names. A drafted, scheduled or dry-run post is not a published post, and an approval covers only the copy and picture the approver was shown.

## One rule above the others

Use each platform's official, documented route, or do not do the task. No login automation, no stored account passwords, no proxies or user-agent rotation, no CAPTCHA solving, no reading a page that robots.txt closes. When a route is closed, report it as closed and say what would open it (an app review, a scope, an account). This is not caution for its own sake: the brand's posting apps and the founders' personal profiles are the assets a workaround puts at risk, and every repository reviewed while building this skill failed on exactly this point ([vetting](references/vetting.md)).

## Three lanes

1. **Publish** ([publishing](references/publishing.md)). Approved copy goes out through the platform API with the approved picture and its alt text, the post is read back, and only a read-back counts as published. Mirrors carry the same words; a picture rides a mirror only when the approval request showed it there.
2. **Listen** ([listening](references/listening.md)). Weekly, same inputs every week so the trend means something: fixed buyer questions to web-grounded AI answer engines through their API (who is named, in what order, which sources are cited), and AI, data and digital job adverts read from each prospect's own job board.
3. **Vet** ([vetting](references/vetting.md)). Before anyone installs or runs a third-party scraper, extension or automation repository: clone it, scan it without running it, answer four questions, and keep the idea rather than the code.

## The bundled tools

`tools/social-ops.py` runs everything above from one command line, Python 3.10 or later, standard library only. Credentials come from environment variables, never arguments. Every `publish` is a dry run unless `--live` is passed.

```
python3 tools/social-ops.py selftest
python3 tools/social-ops.py identity x
python3 tools/social-ops.py publish linkedin --text-file post.txt --image card.jpg --alt "..."     # dry run
python3 tools/social-ops.py publish x --text-file post.txt --image card.jpg --alt "..." --live
python3 tools/social-ops.py visibility --config visibility.json --out reports/ --live
python3 tools/social-ops.py hiring discover <careers page URL>
python3 tools/social-ops.py hiring run --config hiring.json --out reports/ --previous reports/<last>.json
python3 tools/social-ops.py vet path/to/cloned/repo
```

The tools are outside the repository's static gates (they scan Markdown manifests only), like other bundled tooling here. Read them before running them; they are short.

## Stop conditions

- A post whose read-back fails is unpublished. Say so; never report it live.
- A platform refusal (401, 403, a missing scope, an expired token, a 402 for credit) stops that channel and is reported with the platform's own words. Never retry a refusal in a loop.
- Hold the whole lane, not one item, when an owner gives a new rule, and set the instance's hold file before anything else: a scheduled job keeps firing while you work.
- Stop and ask when a step would post as a person without their word for that account, spend above the instance ceiling, or read a source that robots.txt or the platform's terms close.

## What to report

Per channel: posted, read back, URL. Per listening run: questions asked, answers counted, how many named the brand and cited its domain, who was named instead, which accounts could not be read and why. Say when each figure was counted and from which record. A dry run, a queued post or a container awaiting publish is never a published post.

## What never leaves the instance

Account ids, tokens, owners' words, approval records, competitor lists, prospect lists and every result file stay in the instance's own storage. The generic edition of this skill carries methods, tools and anonymised lessons only.
