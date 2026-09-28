---
name: gated-deck-web-page
version: 1.0.0
description: |
  Turn an approved presentation deck into an unlisted static web page in the same
  house style, with a form that has the site email the deck PDF after a visitor
  gives a name, job title and email address. Produces the site folder, the PDF
  kept outside it as an email attachment, checksums, and a handoff carrying the
  endpoint contract and acceptance checks. It does not deploy the page, build the
  live endpoint or send email.

kaidera:
  category: design
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
    - tool:code_interpreter
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: Kaidera-AI
license: Apache-2.0
updated: 2026-09-28
tags: [design, web, html, css, deck, pdf, form, lead-capture, static-site, kaidera]

parameters:
  deck:
    type: string
    required: true
    description: Path to the approved deck, or its copy source, whose content the page repeats.
  pdf:
    type: string
    required: true
    description: Path to the approved PDF that the endpoint will email.
  publish_path:
    type: string
    required: true
    description: Site path the page will live at, for example /finance/teaser/. Every asset URL is built under it.
  endpoint:
    type: string
    required: false
    description: Same-origin form endpoint, for example /api/teaser. Defaults to /api/ followed by the page slug.
  owner:
    type: string
    required: false
    description: Site owner who builds the endpoint and deploys the page, and the contact who receives request notifications.
  approved_uses:
    type: string
    required: false
    description: Uses of visitor details the data owner has approved. Defaults to sending the PDF and nothing else.

safety_constraints:
  - Produce a local package and a written handoff only. Do not deploy or publish, change hosting or DNS, build the live endpoint, or send email.
  - Never place the PDF in the publishable site folder or link to it; it exists only as an email attachment.
  - The page makes no third-party request. Self-host the font and images; add no analytics, trackers, embeds or remote scripts.
  - State only the approved uses of visitor details. Never pre-tick consent or imply follow-up the data owner has not approved.
  - Put on the page only content the owner accepts being readable by anyone with the link; an unlisted page is not private.
---

# Gated Deck Web Page

Publish the content of an approved deck as an unlisted web page in the same
house style (see `kaidera-deck-design`). Release the PDF only by email: the
visitor gives a name, job title and email address, and the site emails the PDF
to that address.

This skill produces the package and the handoff. The site owner builds the
endpoint, deploys the page and owns every email it sends.

## Use it when

- A deck is approved and needs a web version at an unlisted address.
- The PDF should reach only people who identify themselves.

Do not use it for pages meant to rank in search, or for material that must stay
private. An unlisted page can be read by anyone who has the link, so private
material needs access-controlled hosting instead.

## Confirm before building

- **Content:** the approved deck and its exported PDF. The page repeats the
  deck's words; it does not rewrite them.
- **Paths:** the publish path, such as `/finance/teaser/`, and the same-origin
  endpoint, such as `/api/teaser`.
- **Owner:** the site owner, and the contact who receives request
  notifications.
- **Data use:** the approved uses of visitor details. The default is sending
  the PDF and nothing else.
- **Exposure:** which slides may be readable by anyone with the link. Remove
  anything else from the page, generalise it or leave it to the PDF, for example
  named prospects, figures under NDA or commercial terms.

## Package layout

```text
<package>/
  site/                 publish these contents at the publish path
    index.html          the page
    sent/index.html     confirmation page for visitors without JavaScript
    assets/             self-hosted font, trimmed logos, WebP images
  email-attachment/     the approved PDF; never published, never linked
  <slug>-site.zip       the contents of site/
  SHA256SUMS            checksums for every file above
  HANDOFF-<owner>.md    endpoint contract, email text, publishing rules, acceptance checks
```

## Page design

The page follows the deck system:

- a graphite top bar, hero and close;
- paper sections, switching to graphite where the deck did;
- one accent family, Space Grotesk, rounded cards, pill eyebrows and hexagon
  markers;
- a close over a photo with an 88% graphite overlay.

Tokens as CSS custom properties:

```css
:root {
  --graphite: #303234; --raised: #3D3D3D; --paper: #F1F1ED; --card: #FFFFFF;
  --steel-deep: #5A5F5D; --dim: #C6C9C5; --dark-sec: #B5BBB7; --steel: #858A88; --border: #C7C8C5;
  --lime: #A8D93A; --mint: #B0E1CD; --mint-ink: #26352F;
  --radius: 16px; --gap: 20px;
  --shadow: 0 2px 10px rgba(48, 50, 52, .14);
  --shadow-dark: 0 3px 12px rgba(0, 0, 0, .38);
}
```

- **Structure, in order:**
  1. A sticky top bar: parent logo, a confidentiality label, and a "Get the PDF"
     button that jumps to the form.
  2. One section per slide, in deck order, with the slide's eyebrow, heading and
     claims.
  3. The close, the form section and a footer.
- **Type:**
  - Load the self-hosted Space Grotesk variable woff2 with an `@font-face` rule
    (weights 300 to 700, `font-display: swap`) and a `preload` link.
  - Body text is 17 px (16 px below 680 px) with line height 1.5.
  - Headings are bold and sized with `clamp()`: h1 about 2.5 to 3.9 rem, h2
    about 1.85 to 2.6 rem.
  - Use `text-wrap: balance` on headings and `pretty` on paragraphs.
- **Small text:** steel deep on light surfaces and dim on dark ones. Steel is for
  rules, borders and large text only, because it measures 3.1:1 on paper. Accent
  colours are text colours only on graphite.
- **Layout:**
  - Content width is `min(1200px, 100% - 48px)`, laid out with CSS grid.
  - Multi-column grids collapse at 980 px and again at 680 px.
  - No horizontal overflow at 390, 768, 1280 or 1536 px.
- **Hexagon markers:**
  `clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)`.
- **Images:**
  - Photos are WebP, cover-cropped to the displayed aspect ratio, at quality 74
    to 88. Logos are trimmed PNG or SVG.
  - Every image has alt text, or `alt=""` when decorative.
  - Every image reserves its space with width and height or an `aspect-ratio`.
- **Accessibility:**
  - `lang="en-GB"`, with `header`, `main` and `footer` landmarks and each
    `section` labelled by `aria-labelledby`.
  - A 3 px `:focus-visible` outline, and smooth scrolling off under
    `prefers-reduced-motion`.
  - A label for every input.
- **Paths:** every asset URL is root-relative under the publish path, so the page
  works only at that path. Say so in the handoff.

## Unlisted, not private

- Put `<meta name="robots" content="noindex, nofollow, noarchive">` on both
  pages, and ask the owner to send `X-Robots-Tag: noindex, nofollow` for the
  path.
- Link the page from no navigation, footer or sitemap.
- The page makes no third-party request: no analytics, embeds, remote fonts or
  scripts.

## The form

### Markup

- A `<form>` whose `action` is the endpoint, with `method="post"`.
- Three required fields:
  - `name`: text, `autocomplete="name"`, at most 120 characters.
  - `job_title`: text, `autocomplete="organization-title"`, at most 120
    characters.
  - `email`: type email, `autocomplete="email"`, at most 254 characters.
- A honeypot: a text input named `_hp` inside an off-screen wrapper that has
  `aria-hidden="true"`. The input itself has `tabindex="-1"` and
  `autocomplete="off"`.
- A submit button labelled with the action, such as "Email me the PDF".
- A status paragraph with `role="status"` and `aria-live="polite"`.
- The privacy line.

### Behaviour

- **Without JavaScript,** the browser posts
  `application/x-www-form-urlencoded`. The endpoint answers `303` to the `sent/`
  page, a short confirmation in the same style.
- **With JavaScript,** the page handles the submission:
  1. Run `reportValidity()`, then disable the button.
  2. Post `FormData` (multipart) with `Accept: application/json`.
  3. On a 2xx response, reset the form and show: "Thank you. The PDF is on its
     way to <email>. If it has not arrived within a few minutes, please check
     your spam folder."
  4. On any failure, show "Something went wrong. Please try again."
  5. Re-enable the button either way.

### Privacy line

One sentence naming the organisation and exactly the approved uses. The default
is "<Organisation> uses these details to send you the PDF."

Any further use, such as follow-up, needs both:

- a separate, optional, unticked consent checkbox;
- a link to a privacy notice that states the purpose and the retention period.

## Endpoint contract

The owner builds the endpoint. Put this contract in the handoff.

| Field | Rule |
|---|---|
| `name` | Required, at most 120 characters |
| `job_title` | Required, at most 120 characters |
| `email` | Required, a valid address, at most 254 characters |
| `_hp` | Honeypot: if non-empty, answer `200 {"ok": true}` and do nothing else |

On a valid request, the endpoint:

1. Emails the PDF as an attachment to the submitted address, through the site's
   configured sending service, from its verified domain, with Reply-To set to
   the owner's contact.
2. Notifies the owner with the name, job title, email and time in UTC.
3. Keeps a durable record of those four fields for the retention period in the
   privacy notice.
4. Answers `200 {"ok": true}` when the request accepts JSON; otherwise it
   answers `303` to the `sent/` page.

The endpoint also:

- accepts both urlencoded and multipart bodies;
- returns a non-2xx status for any validation or sending failure;
- rate-limits per IP address and per recipient address, because it emails an
  attachment to whatever address is typed in;
- reads the PDF from server-side storage, never from the public site.

The email to the requester is plain text with no tracking. It contains:

- a subject naming the document;
- a short thank-you and a note that the PDF is attached;
- the contact route;
- a one-line confidentiality notice when the document is confidential.

## Build and local checks

1. **Write a build script** that copies the pages, converts the images, copies
   the font and the PDF, zips `site/` and writes `SHA256SUMS`.
2. **Have the script assert that:**
   - no `.pdf` file exists under `site/`;
   - the attachment's SHA-256 equals the approved PDF's;
   - every asset the HTML references exists under `site/assets/`;
   - the HTML and CSS load nothing from another host: no script, stylesheet,
     font, image or frame URL off the site. Ordinary links to pages are allowed.
3. **Test against a local mock.** Serve `site/` at the publish path behind a
   mock endpoint that implements the contract, then check:
   - the JavaScript success and error states;
   - the native post landing on `sent/`;
   - the honeypot sending nothing;
   - a missing field being rejected;
   - the PDF being unreachable at any site URL.
4. **Check the rendering.** Screenshot the page at 1440 px and 390 px and inspect
   every section. Tab through the form to check the focus order.
5. **Clean up.** Stop the mock and delete temporary files.

## Handoff and acceptance

The handoff names:

- the publish path and the package;
- the endpoint contract and the email text;
- the publishing rules: keep the page unlisted, send the robots header, do not
  edit the copy, and release only this page and its endpoint.

The owner reports back these acceptance checks:

1. The page returns 200 at the publish path and renders with Space Grotesk and
   every image, on desktop and mobile.
2. The PDF is not reachable at any URL under the publish path.
3. A real test submission shows the success message, and the email arrives with
   the PDF attached. The attachment's SHA-256 matches the approved PDF.
4. The owner receives the notification, and the record is stored.
5. With JavaScript disabled, submitting the form lands on the `sent/` page.
6. A filled honeypot sends nothing, and a missing job title returns a non-2xx
   status.
7. The site's other pages and forms are unchanged.

Sharing the link, and any contact with requesters, stays with the owner under
the approved privacy terms.
