---
name: kaidera-deck-design
version: 1.0.0
description: |
  Design, build and check presentation decks in the house style Adaptech AI Ltd
  uses for Kaidera and TAM investor teasers and partner decks: graphite and paper
  slides, Space Grotesk, rounded cards, one accent family, exact logo files, and a
  script-built PPTX with a PDF export and a recorded QA pass. Use when asked to
  create, rebuild, restyle or review such a deck. It writes local files only; it
  never sends, uploads or publishes a deck.

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
updated: 2026-09-25
tags: [design, presentation, deck, pptx, pdf, brand, space-grotesk, kaidera, tam]

parameters:
  brief:
    type: string
    required: true
    description: Audience, purpose, length, delivery format (PPTX, PDF or both) and deadline.
  copy_source:
    type: string
    required: false
    description: Path to the approved copy spec, claim ledger or source deck that owns every word, number and status.
  brand_package:
    type: string
    required: false
    description: Path to the brand package with tokens, logos, marks and fonts. Defaults to the package the workspace already uses.
  design_reference:
    type: string
    required: false
    description: Path to an approved or hand-edited deck whose as-built layout overrides the defaults in this skill.
  output_path:
    type: string
    required: false
    description: Folder for the PPTX, PDF, build script and asset manifest. Defaults to a new folder beside the copy source.

safety_constraints:
  - Write only inside the output folder the user names or approves. Never overwrite a deck that is open in a presentation application or that was edited by hand after the last build; port the hand edits into the build script first.
  - Use only the supplied brand files for logos, marks and fonts. Never generate, redraw, recolour, stretch or outline a logo or mark, or add effects to it.
  - Every figure, name, status and quote must trace to the approved copy source. Do not invent customers, endorsements, metrics or partner logos, and never upgrade a pipeline status.
  - Do not send, upload, share or publish the deck. Distribution is a separate, human-approved action.
  - Keep internal review directives, credentials and private file paths out of slides, speaker notes and document metadata.
---

# Kaidera Deck Design

This skill builds presentation decks in the house style of Adaptech AI Ltd and
its two platforms, Kaidera and TAM (Total Airport Management). It covers
investor teasers, partner introductions and programme decks. The style applies
the Kaidera Neomorphic Rounded brand system to slides.

A deck built with this skill is delivered as:

- a PPTX produced by a script;
- a PDF exported from that PPTX;
- the script and asset manifest that reproduce the deck;
- a short QA record.

## Authority order

When inputs disagree, apply this order and write the choice into the build
script:

1. The user's explicit instruction for this deck.
2. Hand edits the approver made to an earlier build or to the named design
   reference. They are the latest brief; never restore a value the approver
   changed.
3. The approved copy source, for every word, number, name and status.
4. The brand package: tokens, marks, fonts and exclusions.
5. The defaults in this skill.

If there is no approved copy source, build from the user's text. Then list every
figure and status you could not trace, and report the list instead of filling
the gaps.

## Brand foundation

- Use solid, opaque surfaces, rounded geometry and Space Grotesk only. The deck
  reads graphite and paper first, and one accent second.
- Never use gradients, glass or blur effects, glows, or translucent cards. The
  close-slide scrim is the only transparency.
- Also excluded: electric or dark teal, purple "AI" imagery, clip art, invented
  product screens and logo walls.
- Never show token names, hex values or measurements on a slide.

### Deck tokens

| Token | Hex | Role |
|---|---|---|
| Graphite | `#303234` | Dark slide ground; text on paper and on light cards |
| Raised | `#3D3D3D` | Cards on graphite (the brand's dark canvas) |
| Paper | `#F1F1ED` | Light slide ground; text on graphite |
| Card | `#FFFFFF` | Cards on paper |
| Steel deep | `#5A5F5D` | Secondary text, sources and footers on paper |
| Dim | `#C6C9C5` | Secondary text, sources, footers and dividers on graphite |
| Dark secondary | `#B5BBB7` | Body text on raised cards |
| Steel | `#858A88` | Rules, dividers and large text only |
| Border | `#C7C8C5` | Outlines of neutral pills and dividers on paper |
| Mint | `#B0E1CD` | Kaidera accent; human-approval steps |
| Mint ink | `#26352F` | Text on mint |
| TAM lime | `#A8D93A` | TAM and co-brand accent: eyebrows, markers, headline figures on graphite |

The brand's product canvases (`#EFEFEF` light, `#3D3D3D` dark) remain the
application surfaces. Slides use graphite and paper, the brand's text pair, as
their grounds.

### Contrast

Ratios below are WCAG contrast measured on the token values.

| Text on fill | Ratio | Use |
|---|---:|---|
| Graphite on paper, on card | 11.4, 12.9 | All text |
| Steel deep on paper, on card | 5.7, 6.5 | Small text |
| Paper on graphite | 11.4 | All text |
| Dim on graphite, on raised | 7.7, 6.5 | Small text |
| Dark secondary on raised | 5.6 | Body text on dark cards |
| Graphite on lime | 7.8 | Eyebrows and markers |
| Mint ink on mint | 8.9 | Approval steps and mint pills |
| Lime on graphite, mint on graphite | 7.8, 8.9 | Accent text on dark surfaces only |
| Steel on paper | 3.1 | Fails for small text: large text or rules only |
| Lime on paper, mint on paper | 1.5, 1.3 | Never |

Accent colours are text colours only on graphite or raised surfaces. On paper,
use them as fills (pills, markers, strips) carrying graphite or mint-ink text.
Small text needs at least 4.5:1; check any new pairing before using it.

### Accent discipline

- **One accent family per deck.**
  - Co-brand decks for Adaptech and TAM use TAM lime for eyebrows, markers and
    headline figures. Mint appears only where Kaidera or a human-approval step
    is the subject.
  - A Kaidera-only deck uses mint as its single accent.
- **Accents mark structure** and the one key figure on a slide. They are not
  highlighters for phrases.

## Canvas and grid

- **Canvas:** 16:9 at 33.867 × 19.05 cm, with 1.5 cm margins and a 30.867 cm
  content width.
- **Content-slide anchors:**
  - eyebrow pill top at 1.15 cm, 0.72 cm tall;
  - title top at 2.05 cm;
  - content from about 4.2 cm;
  - footer row at 18.15 cm.
- **Corner radius:** 0.45 cm on every card, strip and photo, whatever its size.
  Presentation shape presets express the radius as a share of the shorter side,
  so compute it for each shape:
  `adj = min(50000, round(0.45 / min(width_cm, height_cm) × 100000))`.
- **Spacing:** leave 0.55 to 0.6 cm between cards, and align card tops and
  bottoms across a row.

## Type

Space Grotesk, Regular and Bold. Install it before building and exporting, or
the PDF will substitute a fallback typeface.

| Role | Size | Weight and case | Line spacing |
|---|---|---|---|
| Cover and close title | 44 to 46 pt | Bold | 0.95 |
| Slide title | 32 pt | Bold, sentence case | 1.0 |
| Headline figure | 32 to 48 pt | Bold | 1.0 |
| Card heading | 13.5 to 15 pt | Bold | 1.05 |
| Body | 10.5 to 15 pt | Regular | 1.15 to 1.25 |
| Eyebrow and section labels | 9.5 to 11 pt | Bold, upper case, 1.2 pt letter spacing | 1.0 |
| Sources, footer, page number | 9 to 9.5 pt | Regular | 1.0 |

- **Title wording:** one idea, sentence case and no full stop. A closing
  invitation may be a full sentence.
- **Title fit:** every title line fits on one line at its size across the
  content width. Break a long title by hand into at most two lines; never let
  it wrap or shrink.
- **No autofit:** never use autofit or shrink-to-fit. Size every text box from
  font metrics (see the build procedure).

## Components

- **Eyebrow.** A fully rounded pill above every title, with an accent fill and
  graphite upper-case text: a short label such as "THE PROBLEM" or
  "THE MVP · BUILT TODAY".
- **Parent mark.** On content slides, an optional small parent-company mark in
  the top right, 0.62 cm high and aligned with the eyebrow. Use the white
  version on graphite and the dark version on paper.
- **Card.** A rounded rectangle at the deck radius: white on paper, raised
  `#3D3D3D` on graphite.
  - A presentation shape carries only one outer shadow, so use a single soft
    drop shadow instead of the product interface's paired highlight and shadow.
  - On paper, the shadow is `#303234` with 8 pt blur, 45° angle, 2 pt distance
    and 16% opacity.
  - On graphite, it is `#000000` with the same geometry at 40% opacity.
- **Hexagon marker.** A pointy-top hexagon echoing the TAM mark, numbered or
  plain: lime with graphite text, or mint with mint-ink text.
  - Typical flat-to-flat width is 0.62 cm in lists and 1.1 cm in card heads.
  - With a hexagon preset, set the width to 1.1547 × the flat width and the
    height to the flat width, then rotate it 90°.
  - Keep the label in a separate, unrotated text box centred on the marker.
- **Process arrows.** The first step is a home-plate pentagon; later steps are
  chevrons that overlap it by 0.3 cm.
  - Inset each label so it clears the notch.
  - The human-approval step is mint with mint-ink text. The other steps are
    graphite, raised or lime.
- **Stat card.** A headline figure at 48 pt bold, a caption of at most two lines
  at 12.5 pt, and a source line.
- **Graphite strip.** A full-width rounded graphite bar on a paper slide,
  carrying one scope statement or one plain status line.
- **Status pill.** A rounded pill carrying the status verb exactly as the copy
  source words it, such as "Proof of concept" or "Under discussion". The neutral
  pill is card-filled with a border outline; use an accent only when the status
  merits emphasis.
- **Photo panel.** A cover-cropped photo with its corners rounded to the deck
  radius. When a photo heads a card, round only its top corners.
- **Footer.** On the left, "<Company> · <document> · Confidential" (drop
  "Confidential" for public decks). On the right, a two-digit page number.

## Slide rhythm

1. **Cover, on graphite:**
   - the parent logo top left, and an audience or confidentiality line with the
     date top right;
   - the eyebrow, then a two-line title at 44 to 46 pt;
   - one hero render to the right, such as a product or aircraft render;
   - the platform lockups bottom left, separated by a thin dim divider.
2. **Content, on paper.** One idea per slide: eyebrow, title, then two or three
   columns of cards, or a column of cards beside a photo.
3. **Platform, architecture or vision, on graphite.** Use these to break up a
   run of paper slides.
4. **Close, on graphite over a photo:**
   - a full-bleed photo under a graphite scrim at 88% opacity;
   - the invitation as the title;
   - at most five numbered next steps and one contact;
   - the platform lockups top right.

Keep decks short: about 8 slides for a read-ahead teaser and 10 for a partner
introduction.

## Logos and imagery

- **Logo source and placement.** Logos and marks come only from the brand
  package. Trim each file to its visible bounds and record its pixel size in an
  asset manifest. Place it by height, taking the width from its aspect ratio, so
  picture height equals visible height.
- **Co-brand lockups.** Size them by a written rule; the default is equal visible
  mark height. If the approver resizes lockups by hand (for example to equal
  widths), their sizes become the rule. Record them in the build script.
- **Mark treatment.** Never recolour a mark beyond its supplied monochrome
  variants. Never stretch it, outline it or add effects to it.
- **Photos.** Photos set the scene; they are not evidence. Crop out event
  banners, signage and other brands that could imply endorsement. Use a photo of
  a person only with the approver's consent.
- **Other organisations.** Name former employers, partners and prospects in
  prose only. Show a customer or partner logo only when a signed agreement
  allows it.
- **Alt text.** Every picture has alt text.

## Copy and speaker notes

- **Style:** British English; no em dashes (use a comma, a colon or a new
  sentence); no contractions in titles.
- **Sources:** every figure has a source line on the slide or an entry in the
  copy source's ledger.
- **Status:** status verbs are quoted exactly and never upgraded; "in
  discussion" never becomes "signed". If nothing is contracted, the deck says so
  plainly.
- **Speaker notes:** a complete spoken narrative for each slide, so the deck
  also works as a read-ahead.
  - No internal markers: VERIFY, TODO, TBD, "do not name" or reviewer comments.
  - One contact address throughout.

## Build procedure

1. **Confirm inputs:** the brief, copy source, brand package, design reference
   and output folder.
2. **Plan.** Make a table of slides with ground, eyebrow, title lines,
   components and assets. Check that every title line fits before building.
3. **Prepare assets.**
   - Trim the logos.
   - Cover-crop photos at 200 to 220 dpi for their placed size, and round their
     corners to the deck radius. Composite transparent sources onto the card
     colour first.
   - Write the asset manifest.
4. **Build from a script,** never by hand in the file.
   - Write one function per slide, with shared helpers for text box, card,
     pill, eyebrow, hexagon, arrow, logo, footer and notes.
   - Keep all geometry in centimetres, using the constants above.
   - The script is the source for every later revision.
5. **Size text from metrics.**
   - Box height in centimetres = lines × point size × line spacing × 1.27 ÷
     28.35 + 0.04.
   - Count lines twice: by wrapping with the font's real advance widths plus 2%
     headroom, and with a flat average advance of 0.55 em (0.56 em for bold).
   - Reserve the larger count, but advance the layout by the measured height so
     gaps look even.
6. **Protect the target.**
   - Stop if the target file is open in a presentation application.
   - If the file changed after the last build, compare it with the build output
     (text, positions, sizes and pictures). Port every hand edit into the script
     before rebuilding.
7. **Build a fresh file:** close, delete, create, add slides, save, close. Then
   export the PDF from a real presentation application, so fonts, shapes and
   shadows render as readers will see them.
8. **Run the QA checklist.** Fix problems in the script and rebuild. Never patch
   the output by hand and leave the script behind.

## Tool notes: officecli

The house builders pipe one JSON command list per slide into `officecli batch`:

- **Slide:** an `add` of type `slide`, with layout `blank` and the ground colour
  as `background`.
- **Text boxes and shapes:** type `shape`, with `x`, `y`, `width` and `height`
  in centimetres, `font` set to Space Grotesk and `margin` 0.
  - Plain text boxes set fill and line to `none`.
  - `preset` is `roundRect`, `hexagon` (with `rotation` 90), `homePlate`,
    `chevron` or `rect`. `adj` takes `adj:val N` for the corner radius.
  - `shadow` takes `#RRGGBB-blur-angle-distance-opacity`, for example
    `#303234-8-45-2-16`.
  - `opacity` is 0.88 on the close scrim. `spacing` sets letter spacing in
    points, and `lineSpacing` takes values such as `0.95x`.
- **Pictures:** type `picture`, with `src`, size and `alt`.
- **Notes:** type `notes`, with the narrative.

Checks that work with officecli:

- `officecli validate <deck>` checks the file against the OpenXML schema.
- `officecli view <deck> screenshot --page 1-N --grid N -o <sheet>.png` writes a
  contact sheet for a quick layout pass. It uses officecli's HTML renderer, so
  do the final visual check on the PDF exported from the presentation
  application.
- Do not rely on `officecli view <deck> issues` for contrast. In testing with
  officecli 1.0.144 it flagged no text at all, even at 1.5:1. Check contrast
  against the table above instead.

Other toolkits can produce the same result, provided they keep these constants.

## QA checklist

Run every check on the built PPTX and the exported PDF. Deliver the results
with the files.

- [ ] Each page of the exported PDF rendered to an image and inspected at full
  size: no clipped, overflowing or overlapping text, and nothing outside the
  margins except full-bleed photos.
- [ ] Every title line on one line.
- [ ] Space Grotesk embedded in the PDF, with no fallback typeface.
- [ ] Only token colours are used, and small text is at least 4.5:1 on its fill:
  every text-and-fill pair is checked against the contrast table or computed.
- [ ] No gradients, glows or glass; the close scrim is the only transparency.
- [ ] Logos are the exact brand files: trimmed, undistorted (aspect ratio within
  1%) and sized to the recorded rule.
- [ ] A text search of slides and notes finds no em dash, internal marker,
  retired brand or company name, or stray contact address.
- [ ] Every figure, name and status matches the copy source exactly, with
  sources shown.
- [ ] Page numbers run in sequence.
- [ ] A confidential deck says so on the cover and in the footer.
- [ ] Every picture has alt text.
- [ ] The file passes an OpenXML schema check (`officecli validate`).
- [ ] The SHA-256 of each delivered PPTX and PDF is recorded, so later copies
  can be verified.

## Reviewing a deck

When asked to review a deck rather than build one:

- Check it against the QA checklist, the accent rules and the imagery rules.
- Report findings slide by slide, each with the rule broken and the fix.
- Do not edit the deck unless asked.
