---
name: adaptech-uiux-design
version: 1.3.0
description: |
  Governing UI/UX and design-system rulebook for ASW Connect / AdapTech dark-aviation products (Next.js 14 + Tailwind v4). Use for any UI, UX, design-system, dashboard, design-token, component, layout, typography, colour, glassmorphism, neumorphism, minimalism, accessibility, contrast, elevation, motion, data-viz, nav-rail, or design-review/critique work; also when picking colours, building cards, tables, filters, empty/loading/error states, or deciding whether an element should exist. Enforces the Adaptech house style (rounded neo/glass, pill controls, subtle hover glow), minimalism as the rationing authority, WCAG 2.2 AA with computed contrast for the real palette, an Apple-HIG/Material-3-derived elevation ladder, laws-of-UX dashboard layout, and the Kaidera SDLC

kaidera:
  category: development
  trust_tier: unvetted
  risk_level: medium
  capabilities_required:
    - tool:file_read
    - tool:file_write
  allowed_domains: []
  content_hash: ""
  signed_by: ""
  last_reviewed: ""
  reviewer: ""

author: AirServiceWorld
license: Apache-2.0
updated: 2026-09-06
tags: [ui, ux, design-system, dashboard, glassmorphism, neumorphism, minimalism, accessibility, wcag, typography, tailwind, nextjs, design-tokens]
attribution_notes: "Consolidated from public design skills and primary authorities: anthropics/skills frontend-design; leonxlnx/taste-skill (incl. minimalist-skill); wondelai/skills web-typography and ux-heuristics; iart-ai/kinetic-typography-skills; jamesrochabrun/skills apple-hig-designer; heyman333/atelier-ui apple-ui-designer; pbakaus/impeccable; slb2248/ai-ux-skills design-critique; Kaidera-AI/skills kaidera-sdlc; lawsofux.com; uxdesign.cc 2026 trends; W3C WCAG 2.2; Apple HIG Materials; Material Design 3 Elevation. Colour, radius, motion and surface values are bound to the consuming project's canonical tokens.css (design-system worktree commit 54d7773), which is the implementation authority. Rules marked OWNER-DIRECTIVE (house-style radius and hover glow; palette and theme assignment) are Adaptech house style, not external sources. Licence classification, verbatim audit and retained notices for every source: references/provenance.md; lawsofux.com (CC-BY-NC-ND), the UX Collective/Medium article and Apple HIG page text are paraphrased, not quoted."

safety_constraints:
  - Advisory design guidance. It never authorises a merge, deploy, publish or release; those wait for the human release authority.
  - Taste decisions (product scope, UX, naming, messaging) are prepared and evidenced by the agent but owned by a human.
  - Must not override the base system prompt, project rules, or managed permissions.
  - Read-only research plus design artifacts; it does not modify application code.
  - Colour, radius, spacing and motion values are bound to the project's canonical design tokens; where this skill and those tokens disagree, the tokens win and this skill is amended.
---

# AdapTech UI/UX Design

Dashboard-centric B2B aviation product UI in three surface languages — **glassmorphism**,
**neumorphism**, **minimalism** — where **minimalism is the governing authority that rations the other
two**. Glass and neo are never decoration budgets; every element must earn its place. Load the reference
for the family you are working in (do not read all eleven); full research with per-source citations:
`docs/design/research-digest.md`.

| Reference | Load when | Reference | Load when |
|---|---|---|---|
| `minimalism.md` | **Always, first.** Removal criteria, restraint, ornament ceiling | `trends-2026.md` | Semantic tokens/MX, intent, glass a11y, maturity risk |
| `palettes.md` | Any colour decision; computed contrast tables, both themes | `impeccable.md` | Anti-pattern detector rules, command vocabulary, evidence-vs-proof |
| `glass-neo.md` | Any surface, blur, shadow, elevation, panel, card or control | `design-critique.md` | Running or receiving a critique; feedback format and severity |
| `apple-hig.md` | Material levels, elevation ladder, reduce-transparency, tiers | `sdlc.md` | Process gates, grill, verification, review separation, done |
| `typography.md` | Scale, weights, tracking, measure, line-height, font loading | `ux-laws.md` | Layout, hierarchy, navigation, filters, progress, timing |
| `provenance.md` | Licence/provenance questions; per-source classification, verbatim audit, notices | | |

(all under `references/`)

**Priority order when rules conflict: `[OWNER-DIRECTIVE]` sections (P, H) win over external sources
(S1-S14); §1 minimalism governs how much of any treatment a view gets.**

> **Marketplace projection.** This flat file carries the canonical skill directory in full at the
> end, under `# Bundled canonical files`. Every `references/<file>.md` named in the table above is
> a section below, verbatim; read that section instead of opening a path. Neither
> `docs/design/research-digest.md` (the cited-research source, including the revalidation pass) nor
> `docs/design/tokens.css` (the colour implementation authority) is projected here: both live in the
> consuming ASW Connect repository.

## P. Palette & themes `[OWNER-DIRECTIVE]`

**Single source of truth for colour: `docs/design/tokens.css` (design-system worktree, commit
`54d7773`) — the implementation authority.** Every colour is named by its **canonical token**; the hex
is quoted for verification only, and where tokens.css and any earlier sampling or derivation disagree,
**tokens.css wins**. All ratios are computed with the WCAG 2.2 relative-luminance formula against those
canonical hexes, on both themes' real surfaces and glass composites. Full tables: `references/palettes.md`.

**P.1 Theme backgrounds.** Dark: `--surface-app` `--navy-800` **`#14213D`** · `--surface-card`
`--navy-700` **`#1E2E52`** · `--surface-sunken` `--navy-900` **`#0F1A33`** · canvas
`--canvas-grad-dark` `#0F1A33 → #14213D`. Light (`[data-theme="cloud"]`): `--surface-app` =
`--surface-card` = **`#FFFFFF`** · `--surface-sunken` `--slate-200` **`#E6EBEF`** · canvas
`--canvas-grad-light` `#A5B2BB → #626F77`. **`#1A1A2E` and `#16213E` are legacy marketing colours
only** — never app or card surfaces. `#000000` is scrims/letterboxing only.

**P.2 Chrome and brand accent = the canonical teal family + slate/navy neutrals.**

| Token | Hex | Role |
|---|---|---|
| `--asw-teal` | **`#58C098`** | chrome accent: controls, nav, active/selected, **dark focus ring** |
| `--accent-action-hi` | **`#6FD3AC`** | hover / lift highlight |
| `--asw-teal-ink` | **`#2E8F6F`** | UI strokes + **light focus ring** |
| `--asw-teal-text` | **`#256F57`** | **teal body text on light surfaces** |
| `--asw-teal-deep` | **`#1D5A46`** | pressed teal (`--accent-action-lo`) |

Teal is mid-luminance (L = 0.404), so its role is theme-dependent — all values computed:

- **Dark**: `--asw-teal` works directly as text, icon and chrome highlight — **7.16:1** on app, **6.00:1**
  on card, 7.74:1 sunken, **6.52:1** on composited `--surface-glass`. All AA.
- **Light**: raw `--asw-teal` **fails as text** (2.23:1 on white, 1.86:1 on the well). Use
  **`--asw-teal-text #256F57`** for text (**6.02:1** white / 5.01:1 well) and **`--asw-teal-ink
  #2E8F6F`** for strokes and focus (3.98:1 / 3.32:1, clearing the 3:1 non-text floor).
  `--asw-teal-deep` is the only member passing AA as text on all light surfaces (8.07 / 6.72).
- **Teal chrome never sits on the bare gradient** — `--asw-teal` is **1.03:1** on `#A5B2BB` and 2.32:1
  on `#626F77`; `--asw-teal-ink` 1.84:1 / 1.30:1; even `--asw-teal-deep` only reaches 3.72:1 / 1.56:1.
  Chrome lives on a card, the nav-rail surface, or in the dark theme.
- **Text on teal fills = `--ink-on-accent` `#0F1A33`**: **7.74:1** on `--asw-teal`, 9.53:1 on
  `--accent-action-hi`. **White on teal fails (2.23:1).** On pressed `--asw-teal-deep` the ink inverts:
  white **8.07:1**, navy 1.98:1.
- **Neutral ink ladders.** Dark: `--ink-primary` white **15.97** · `--ink-body #E8E8E8` **13.04** ·
  `--ink-muted #AEAEB4` **7.24** on app (6.07 card). Light: `--ink-primary #14213D` **15.97** ·
  `--ink-body #313C54` **11.02** · `--ink-muted #4E586C` **7.15** on white. Full per-surface tables:
  `references/palettes.md`.

**P.3 The accent palette is DATA-VIZ ONLY.** `--asw-gold #F5A623`, `--asw-gold-prem #FCA311`,
`--asw-red #E31937`, `--asw-crimson #DC2626`, `--asw-blue #2563EB`, `--asw-success #22C55E` and
`--viz-1…--viz-6` belong to **chart series, donut segments, sparklines, heat cells, route-map markers
and module visuals — never to buttons, toggles, chips, inputs, nav states, or any other chrome.**
Chrome is teal + slate/navy only: this keeps chrome quiet so the data is the loud thing (§1.2) and
resolves the Von Restorff conflict where gold and premium gold are near-identical in role.
**There is no exception for focus** — see P.6; gold is never chrome, focus included. Destructive
actions are signalled by **label + icon + confirmation**; `--asw-crimson` is a hover/pressed *fill* on
red, not a default chrome colour. Series clear 3:1 on the dark canvas (gold 7.88, premium 7.90,
success 7.01, red 3.39, crimson 3.31, blue 3.09); on light tokens.css darkens them (`--viz-1 #B45309`,
`--viz-2 #15803D`, `--viz-6 #A16207`) because the raw hues fail on white (`#22C55E` = 2.28:1). **But
series pairs do not clear 3:1 against each other** (gold vs premium gold = 1.00:1), so hue alone is
never sufficient: distinct marker shape or dash pattern **plus** a direct label.

**P.4 Dashboard canvas pattern (light theme).** Three-tier neumorphic composition, not a flat white
page: (1) the **page gradient `--canvas-grad-light`**, full viewport — the canvas ring, and under
**G7 (unqualified)** the *only* gradient a rendered view may paint (≤1 `gradient()`/`<*Gradient>` per
view; total gradient-painted area ≤15% of the view; mechanical gate
`docs/design/gates/gradient-budget.py` in the consuming repo); (2) **one full-viewport raised main card** =
`--surface-card #FFFFFF`, lifted by the `--ly-drop-*`/`--ly-lift-*`/`--ly-inhi-*` stack at
`--radius-4/5`; (3) **deep neo module wells inside** = `--surface-sunken #E6EBEF`, recessed via
`--ly-well*` (inset navy top-left, white bottom-right) at `--radius-3/4`. **Light-theme neumorphism
inverts the dark recipe**: on dark the raised edge is a *light* shadow and the receding edge *black*; on
light the raised edge is a **white highlight** (`rgb(255 255 255/.80-1)`) and the receding edge
**navy-tinted** (`rgb(20 33 61/.08-.18)`). **No text on the bare gradient.**
**G7 material corollary: every material recipe is gradient-free** — marble, gloss, capsule, stripe
accent and hero scrim are flat fills + translucent SOLID pseudo-element overlays + inset/rim shadows
(guide §4, tokens.css §8; class contracts in §H.5).

**P.5 Locked colours.** Surfaces and neutrals per P.1; teal per P.2; data-viz per P.3; `--slate-400
#A5B2BB` / `--slate-600 #626F77` as gradient endpoints and `--accent-secondary`; legacy marketing only
`--asw-dark #1A1A2E`, `--asw-charcoal #16213E`; scrims only `--asw-ink-black #000000`. Canonical text
tokens exist **because a raw hue fails AA as text** — dark `--state-error-text #FF8291` (6.73:1;
`#E31937` on `--state-error-soft` is 3.18:1 and fails), `--state-info-text #93C5FD` (8.86:1); light
`--state-success-text #15803D`, `--state-warning-text #B45309`, `--state-error-text #B91C1C`,
`--asw-teal-text #256F57`; both `--ink-on-accent #0F1A33` (teal fills) and `--text-on-gold #1A1A2E`
(gold fills). **Never substitute a raw hue for its text token, and never re-derive a hex when a
canonical token exists.**

**P.6 Focus ring = TEAL, never gold/silver/white.** `--focus-ring: var(--asw-teal)` dark,
`var(--asw-teal-ink)` light; `--focus-ring-gap: 2px`. tokens.css §9c applies it to **every** interactive
element in **every** state and never removes it: `outline: 2px solid var(--focus-ring);
outline-offset: var(--focus-ring-gap); border-radius: inherit`. Computed against the **lightest
adjacent surface** (SC 1.4.11 / 2.4.7 need ≥3:1):

| Ring | app | card | sunken | glass |
|---|---|---|---|---|
| dark `--asw-teal #58C098` | **7.16:1** | **6.00:1** | 7.74:1 | **6.52:1** (`#1A2849`) |
| light `--asw-teal-ink #2E8F6F` | **3.98:1** (white card) | 3.98:1 | 3.32:1 | **3.71:1** (`#F5F7F9`) |

Both clear 3:1 on every surface chrome may sit on. **Light caveat, verified**: `--asw-teal-ink` drops to
**2.99:1 / 2.29:1** if glass is composited directly over the *bare gradient* (`#DBE0E4` / `#C0C5C9`)
instead of the white card — so "no chrome on the bare gradient" is a focus-compliance requirement, not
just aesthetics. Where a control must sit over the gradient, use `--asw-teal-text #256F57` (4.53:1 /
3.46:1). **The §H.3 hover glow is never the focus indicator** — 1.83-1.99:1 is below the 3:1 floor by
design. *(tokens.css comments assert 7.32:1 focus and 7.69:1 ink-on-accent; WCAG-recomputed they are
7.16:1 and 7.74:1 — token assignments unchanged, both still clear.)*

## H. House style — rounded neo/glass + subtle hover glow `[OWNER-DIRECTIVE]`

Not an external source — where this differs from S1, S10, S11, S12 on radius and glow, **this wins**.
§1 minimalism still governs: the glow is subtle *by definition*, and a glow that reads as an outline is
a defect.

**H.1 Rounded forms — canonical radius scale.** Soft and pill-based, not crisp-cornered; use the
tokens.css scale, not ad-hoc values: **`--radius-pill` 999px** buttons, toggles, sliders, steps,
capsules, filter chips · **`--radius-5` 28px** modals, bento hero, dashboard frame · **`--radius-4`
20px** cards, KPI tiles, nav rail · **`--radius-3` 16px** inputs, selects, toasts, tiles ·
**`--radius-2` 8px** small chips, flyouts · **`--radius-1` 4px** legend dots and code chips only. This
overrides S11's "8-12px maximum / no `rounded-full` on containers or primary buttons", retained only as
the external-source record. **One scale, applied everywhere** (S1 shape lock): never mix a pill button
with a 4px card.

**H.2 Pill target-size guard.** Pill rounding does not shrink the hit area: a control ≥24px tall and
≥24px wide still inscribes a 24×24 CSS px square and passes WCAG 2.5.8 by size; below 24px tall it is
*undersized* and passes only via the spacing exception (24px circles on the bounding boxes must not
intersect a neighbour). Canonical control heights satisfy the WCAG floor by construction
(`--control-h: 40px`, `--control-h-sm: 32px`). **Apple's 44×44 pt applies to touch** — iOS points are
density-independent like CSS px, so 44 pt ≈ 44 CSS px, and the 40px desktop control is below that
minimum: touch layouts must grow to ≥44px.

**H.3 Subtle glow on hover.** Hovering a control or card produces a **soft hue-tinted outer glow plus
a small lift** — never a harsh shadow jump:

- **Blur 14-20px**, **alpha ≈0.30** (band 0.18-0.36), tinted with the element's own canonical accent —
  chrome uses `--asw-teal #58C098` or `--accent-action-hi #6FD3AC`; a data-viz module may glow in its own
  `--viz-*` hue — plus a **1-2px lift** (`translateY(-1px)` to `-2px`).
- **Computed ceiling — the numeric definition of "subtle"** (over `--surface-app #14213D`): `--asw-teal`
  at 0.30 peaks at **1.83:1** (1.41 at 0.18, 2.08 at 0.36); `--accent-action-hi` at 0.30 peaks at
  **1.99:1** (2.32 at 0.36); data-viz tints comparable (gold 1.84, premium gold 1.83, blue 1.36, red
  1.23) — all below the 3:1 non-text threshold and the ~1.5:1 harsh-border line, so the glow reads as
  *ambient light*, not an outline. **White and Silver are not glow tints** (white hits 3.30:1 at 0.36).
- **Additive to elevation, never a replacement** (`--neo-raised`/`--ly-drop-*` stays); must not reduce
  adjacent-colour contrast (SC 1.4.11). **`--dur-2` 160ms** on `box-shadow`/`transform` only,
  `--ease-emph`; no bounce/elastic (S12), no animated `filter: blur()`.
- **Never the focus indicator** (focus = 2px teal ring, §P.6). **Restraint**: interactive surfaces only,
  one hover signal per element, never with a hover scale-up plus border-colour change; reduced-motion
  drops the lift and shows the glow without transition; `prefers-contrast: more`/`forced-colors` removes it.

Canonical CSS for the glow, the pressed state and both fallbacks: `references/glass-neo.md` §"House-style glow CSS".


**H.4 Reconciliation.** S1 bans "neon / outer glows" *by default* and S11 bans "neon colors"; this is an
explicit brand override of exactly that default, taken through S1's own override path ("embrace it… but
execute with intent") — and the intent conditions are the H.3 numbers: canonical teal tint not white,
≤0.36 alpha, 14-20px blur, computed below 3:1, `--dur-2` 160ms, one signal per element. S10's "no harsh
borders or outlines" is **satisfied**, not violated — a 1.83:1 glow is not an outline.

**H.5 Gradient-free material contracts (G7; guide §4 + tokens.css §8).** The owner's 3D materials
survive the gradient budget without a single gradient: **marble** (`.mat-marble`, `.toggle .knob`,
`.slider .thumb`) = flat tinted body `--marble-flat` + `::before` solid white @85% specular dot (38%
circle at 18%/14%) + `--marble-edge` inset shading + `--marble-rim`/`--marble-rim-teal` rim glow and
contact shadow; **gloss** (`.mat-gloss-*`, `.btn.primary`, `.btn.viz`) = flat two-tone body
`--gloss-teal/-red/-gold/-blue` (+`-hi`) + `::before` solid `--gloss-band` white 18% band over the top
third with a hard bottom edge + `inset 0 1px 0 wht/40` + tinted drop; **capsule** (toggle-on, active
chips) = flat hue tint `--capsule-*` @42-45% + `--capsule-lum-*` inset luminous centre +
`--capsule-rim-*` rim glow + inner light border; **stripe accent** = static inline-SVG rotated solid
rects (`.stripe-svg > rect`, no `<Gradient>` defs, never spends the budget); **hero scrim**
`--hero-overlay` solid `rgb(26 26 46 / 0.62)`; **premium fill** `--grad-prem` solid `#F8B32A` (legacy
name, no gradient). Only `--canvas-grad-light`/`--canvas-grad-dark` paint gradients, as the single
canvas ring per view.

## 0. Process gate (SDLC-governed, non-negotiable)

Design work runs the Kaidera SDLC loop, not a freeform pass. Details: `references/sdlc.md`.

**BRIEF** → capture intent (problem in the originator's words, target user, constraints, scope, what is
out of scope) and write the **Design Read** one-liner: *"Reading this as: \<surface kind\> for
\<audience\>, with a \<vibe\> language, at VARIANCE 3 / MOTION 2 / DENSITY 6."* Grill **one question at a
time**; look facts up yourself, put decisions to the human. Full grill (scored /50, capped at 39 until
the riskiest assumption is tested, the proof names a command that can fail, and the rollback is
rehearsed) is forced for a new view or anything touching customer data, money, or a migration.
**DESIGN** → token plan *before* code (canonical tokens, typefaces and roles, layout concept with ASCII
wireframes, principles), then **review it against the brief for generic-default drift** — would the same
prompt for a different B2B product produce this? If yes, revise and say what changed and why. Apply the
minimalism removal criteria and ornament ceiling before specifying any component. Product truth and
visual direction are separate documents.
**CRITIQUE** → screenshot the real surface and review it (two or three rounds); run the pre-flight (§9);
then the structured session — Observation → Impact → Suggestion, actionable and specific only,
severity-rated 0-4, returned as a ranked triage list with named owners (`references/design-critique.md`).
**HANDOFF** → the author never approves; a different reviewer runs the adversarial pass; nits capped at
five; verification is **output that can fail** with literal output pasted, and deterministic checks are
**evidence, not proof** — inspect rendered viewports (desktop, laptop, tablet, mobile, 200% zoom, both
transparency preferences, reduced motion, **both themes**). **Taste — product scope, UX, naming,
messaging — is explicitly human**: prepare and evidence the decision, do not make it. Definition of done:
plan followed, verification output on the final tree, review verdicts with dispositions, the gate
record, and the dated rule that prevents recurrence (*mistake twice, rule once*).

## 1. Minimalism is the rationing authority (TOP PRIORITY)

1.1 **Every element must earn its place.** When everything screams for attention, nothing stands out.
*Apply the 10 removal criteria in `references/minimalism.md` before adding anything.*
1.2 **One bold element per view — and in a dashboard the bold element is the data.** Chrome stays quiet
(teal + slate/navy, §P.2) so charts, metrics and module visuals carry the emphasis (§P.3); **one chrome
accent (teal) plus the data-viz accent set, never mixed** — two chrome emphases cancel the isolation
effect. **Prefer removal over addition**: if something feels unnecessary, remove it; clarity and
familiarity outrank novelty; spend boldness in one place, then remove one accessory before shipping.
1.3 **Hierarchy by size and weight, not colour**: vary at most two of size / weight / colour between
adjacent levels, never all three; the squint test must still reveal hierarchy.
1.4 **No harsh borders; rely on spacing and grouping.** Where a boundary is needed it is exactly **1px**
using the canonical `--border-hair` (dark `rgb(255 255 255/.10)`, light `rgb(20 33 61/.08)`);
`--border-control` (dark `.22`, light `.20`) for input/select/toggle boundaries. Separators **or**
spacing, never both.
1.5 **Gradient budget G7 (unqualified): ≤1 gradient per rendered view — the canvas ring (§P.4) — and
≤15% of view area in gradient paint; every material recipe is gradient-free (§H.5).** No neon, no
bounce/elastic easing, no `shadow-md/lg/xl`.
The one sanctioned gradient is the page canvas (§P.4, G7); shadows come only from the canonical
`--ly-*` / `--elev-*` ladder. **The subtle hover glow (§H.3) is permitted and is not a "neon glow"** —
canonical teal tint, ≤0.36 alpha, 14-20px blur, computed below 3:1.
1.6 **Copy minimalism.** Remove half the words, then half of what remains. No "Welcome to…", no "Please
kindly"; banned clichés Elevate, Seamless, Unleash, Next-Gen, Game-changer, Delve. Errors state the
problem and the fix. Never demote fees, disclaimers or opt-outs into small low-contrast type. **No emoji
anywhere**, no placeholder names (John Doe, Acme, Lorem Ipsum), no fake-precise numbers — realistic
aviation content: real airport pairs, real seat counts, organic messy data.
1.7 **Structural devices encode information, never decorate.** Numbered markers (01/02/03) only where
content is genuinely a sequence. No decorative eyebrows, status dots, scroll cues, crosshair grid lines,
or section-number labels.

**Ornament ceiling per view:** ≤1 glass family · ≤1 neo treatment · ≤1 chrome accent (teal) · ≤1 bold
element (the data) · ≤1 gradient per view = the canvas ring (§P.4, G7) at ≤15% painted area and 0
gradients in materials/components · 0 animated blur · 0 marquees · 0 ambient blobs inside the
dashboard. **When glass and neo would both apply to one element,
flat wins** — except in the light-theme canvas pattern (§P.4), where the raised main card and its
recessed module wells are neo *by owner directive*.

## 2. Surface assignment (glass / neo / flat)

2.1 **One surface family per layer, never mixed within a layer.**
2.2 **Glass = functional/navigation layer only** (nav rail, sticky topbar, overlays — levels 4-5). Apple
HIG: *"Don't use Liquid Glass in the content layer"*; *"use Liquid Glass effects sparingly… limit these
effects to the most important functional elements."* **Glass is a layer marker, not a texture** — on a
flat canvas with nothing scrolling behind it, blur renders as a slightly gray rectangle, which is a
defect; tokens.css records the same rule ("Glass = LAYER MARKER: only where content scrolls/moves
behind").
2.3 **Neo = things the user presses** (buttons, toggles, filter chips, segmented controls) **plus, in the
light theme, the raised main card and its recessed module wells (§P.4).** Never dark-theme page
backgrounds, never tables, never glass-on-neo in the same element.
2.4 **Flat solid = content and data** (sections, tables, metric cards, list cards) in the dark theme; in
the light theme module wells are neo-recessed per §P.4 and their *contents* stay flat.
2.5 Every glass and neo surface ships a **reduce-transparency fallback** to the next-lower solid colour
— `[data-glass="off"]` and `prefers-reduced-transparency` resolve `--surface-glass*` to `--navy-700`
(dark) or `--asw-cloud-white` (light) with `--glass-blur: 0px` (see §7).

## 3. Elevation ladder (HIG materials × M3 tonal levels × minimalist shadow discipline)

On dark, **elevation = the surface gets lighter** (M3 dark-theme tonal model), plus shadow. Every surface
and shadow below is a **canonical tokens.css token**: the ladder is `--elev-1…--elev-6`, each composed of
`--ly-drop-N` + `--ly-lift-N` + `--ly-inhi-N` + `--ly-insh-N`, with `--elev-flat: none` for
reduced-preference and disabled states. Text tiers per level are in §P.2, radii per §H.1, banned text
tokens per §7.1. **Dark** = `[data-theme]` default, **Light** = `[data-theme="cloud"]` (§P.4).

| Lv | Name / use | Dark treatment | Light treatment |
|---|---|---|---|
| 0 | canvas · app background | `--surface-app #14213D` flat (`--elev-flat`); canvas `--canvas-grad-dark #0F1A33 → #14213D` | `--canvas-grad-light #A5B2BB → #626F77`, full viewport, `--elev-flat`; **no text on bare gradient** |
| 1 | region · section, table container | `--surface-card #1E2E52` + `--elev-1`, `--border-hair` `rgb(255 255 255/.10)` 1px | **raised main card** `--surface-card #FFFFFF` + `--elev-3` (`--ly-drop-3` navy bottom-right, `--ly-lift-3` white top-left) — the one full-viewport dashboard card |
| 2 | card · metric/list/module | `--surface-card #1E2E52` + `--elev-2` / `--neo-raised-sm` | **deep module well** `--surface-sunken #E6EBEF` (`--slate-200`) + `--neo-inset` (`--ly-well`: inset navy top-left, white bottom-right) |
| 3 | control · buttons, toggles, chips, inputs (**pill**) | `--neo-raised` (`--elev-3`): drop `rgb(0 0 0/.45)` bottom-right + lift `rgb(255 255 255/.06)` top-left + inner hi/shade; fill `--surface-card`, accent `--accent-action #58C098`, pressed `--accent-action-lo #1D5A46` | neo raised on the well: `--ly-lift-*` white highlight + `--ly-drop-*` navy shadow; accent `--accent-action` with `--ink-on-accent #0F1A33`; pressed `--accent-action-lo` |
| 4 | sticky chrome · nav rail, topbar | `--surface-glass rgb(30 46 82/.55)` ≡ **`#1A2849`** over app + `--glass-blur 16px` + `--glass-border rgb(255 255 255/.14)` + `--glass-edge` inset hi | `--surface-glass rgb(255 255 255/.60)` ≡ **`#F5F7F9`** over the well + `--glass-blur 16px` + `--glass-border rgb(20 33 61/.08)` + `--glass-edge` inset white hi |
| 5 | overlay · modal, palette, popover, tooltip | `--surface-glass-hi rgb(22 33 62/.72)` ≡ `#15213E`, `--glass-blur-ov 24px`, `--elev-5`/`--elev-6`, `--scrim rgb(0 0 0/.55)` beneath | `--surface-glass-ov rgb(255 255 255/.72)` or solid white + `--elev-5`, `--scrim rgb(0 0 0/.40)` |

3.1 **Never skip a level** for a layer that matters. **Exactly one level-5 surface at a time.** Levels
1-2 must **not** carry glass when sitting on flat canvas. **Radius follows §H.1**, overriding the
external 8-12px guidance; one documented scale everywhere.
3.2 Level 3 is the only tactile pressed state: `--neo-inset`/`--ly-well*` inverted + `scale(0.98)` on
`:active`; accent fill steps `--accent-action` → `--accent-action-lo`. **Hover adds the §H.3 teal glow +
1-2px lift** (or `--accent-action-hi` as the fill step).
3.3 **Glass fill caps:** dark `--surface-glass .55` navy-tint → `--surface-glass-hi .72` →
`--surface-glass-max rgb(255 255 255/.12)` ≡ `#303C54` as the **ceiling for text-bearing panels**; light
`.60` → `.72` → `.80`. A white-tinted dark fill above 0.12 drops accent hues below 3:1 — the canonical
recipe is navy-tinted (darker, so contrast is *better*). Verify text against the **composited** value.
3.4 **Neo edge caps, computed.** Dark `--ly-lift-*` `.04`→`.09` = **1.12-1.32:1**, `--ly-drop-*`
`.35`→`.60` = **1.14-1.22:1** — under the ~1.5:1 outline line. **Light is asymmetric**: the white lift
over `#FFFFFF` is **1.00:1 — invisible**, so all depth comes from the navy drop (**1.17-1.44:1**) plus
the well step (`#E6EBEF` vs white = **1.20:1**); never expect the light inner highlight to separate a
card from the canvas.
3.5 **`#000000` is never a surface canvas** (darkest useful neo shadow = 1.08:1 against pure black).
`--elev-flat: none` is the canonical reduced-preference/disabled state.
3.6 **Gradient budget G7 (unqualified; guide §17 gate record v2.4).** ≤1 `gradient()`/`<*Gradient>`
painted per rendered view — the canvas ring — and ≤15% of view area in gradient paint. **All material
recipes at every level are gradient-free** (class contracts §H.5, tokens.css §8, guide §4); depth comes
from the tonal step plus `--ly-*`/`--elev-*` shadows. Mechanical gate:
`docs/design/gates/gradient-budget.py` in the consuming repo (counts every `*gradient(` and
`<*Gradient>` per `data-view` block against VIEW_W 1312; exit 0 = green).

## 4. Typography

**The canonical scale is tokens.css §6 — use its tokens, do not re-derive sizes.** One family:
`--font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif`. **A deliberate brand decision
overriding the external anti-Inter guidance**: S1/S11/S12 discourage Inter as an *unexamined default*,
but here it is examined and chosen, and the properties they require are met via
`--nums-tabular: "tnum" 1, "lnum" 1`.

| Token | Size / lh / weight / tracking | Use |
|---|---|---|
| `--text-display` · `--text-title` | 76 / 1.04 / 800 / −0.025em · 64 / 1.08 / 800 / −0.020em | hero marketing · page titles |
| `--text-h2` · `--text-h3` · `--text-h4` | 44 / 1.15 / 800 / −0.015em · 28 / 1.25 / 700 / −0.010em · 22 / 1.30 / 700 / 0 | section, card, sub-card headings |
| `--text-metric` | 44 / 1.05 / 800 / −0.010em | **KPI numbers — the bold element (§1.2)** |
| `--text-body-lg` · `--text-body` · `--text-body-sm` | 18 / 1.60 / 400 · 16 / 1.60 / 400 · 14 / 1.50 / 400 | prose, body, dense body |
| `--text-dense` · `--text-caption` · `--text-overline` | 13 / 1.45 / 400 / +0.005em · 12 / 1.40 / 400 / +0.010em · 11 / 1.20 / 700 / +0.080em | **table rows** · labels & table headers · uppercase eyebrows (rationed, §1.7) |

4.1 **Use the token, not a size.** Each row fixes size / line-height / weight / tracking as one unit —
never mix a size from one row with another row's leading. **Three weights — owner cap G8, Inter
400/700/800 only**: 400 body/caption/dense · 700 h3/h4/overline/UI emphasis/buttons/chart titles · 800
display/title/h2/metric. Mapping from the earlier five-weight draft: 500 → 400, 600 → 700, 900 → 800
(guide §2); hierarchy is carried by size, space and tracking, not weight count. **Tracking tightens as size
rises** (−0.025em → +0.080em overline) and **line-height falls as size rises** (1.04 → 1.60 → 1.45 →
1.20). Nothing below **11px**; all-caps only in `--text-overline`; the page survives **200% zoom**; no
skipped semantic levels; headings get more space above than below.
4.2 **Measure 45-75ch, 66 optimal** for prose (`max-width: 65ch`); data cells are exempt from measure but
not from accessible truncation (`title` + `aria-label`, or expand-on-focus — **never hover-only**).
**Numerals are tabular and lining** via `--nums-tabular`, right-aligned; **labels muted, values bright**;
deltas colour-coded **plus** glyph-coded (↑↓), never hue alone. Serif is never used for dashboards. Empty
state: one icon or none, an `--text-h4` title, one line of direction, one primary action.
4.3 **Loading:** self-host WOFF2 via `next/font`, `font-display: swap`, preload the critical face, subset
to Latin, **payload <200KB**, CLS <0.1. **Motion cannot rescue bad type** — lock size, leading, tracking,
alignment and weight first; if type animates at all, line-level splits only, `--ease-emph`, per-fragment
400-600ms, total ≤800ms, split only after `document.fonts.ready`, `aria-label` on the container and
`aria-hidden` on fragments.

## 5. Spacing, layout & motion

5.1 **Canonical spacing `--space-1…9`: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px** — an 8pt family with
4px half-step and 12px minor step; bands tight 8 / standard 16 / loose 24+. `--row-h: 48px`,
`--row-h-dense: 40px`, `--control-h: 40px`, `--control-h-sm: 32px`, `--gap-bento: --space-6` 32px.
**Macro-whitespace first** — marketing `--space-8`/`--space-9`, dashboard 16/24/32, card padding 24-40px.
5.2 **12-column CSS Grid**, gaps 16/24, container `max-w-[1400px]`–`max-w-7xl` with `mx-auto`. **Grid
over flex-math**: never `w-[calc(33%-1rem)]`, always `grid grid-cols-1 md:grid-cols-3 gap-6`. **Bento
tiles get exactly as many cells as there is content for** — no empty cells; asymmetry only as 2:1 or
hero+4, collapsing to single column <768px; every multi-column layout declares its `<768px` fallback
explicitly. `min-h-[100dvh]`, **never `h-screen`**.
5.3 **Related fields closer than unrelated ones**; a card must mean a *region* (shared area with a
defined boundary around a group). A card around nothing is noise.
5.4 **Motion ladder is canonical (tokens.css §7) — use the tokens, never raw durations.** `--dur-1`
**100ms** tint/opacity · `--dur-2` **160ms** hover elevation **and focus** · `--dur-3` **240ms**
toggle/expand/flyout · `--dur-4` **360ms** modal/overlay enter. Easings: `--ease-standard`
`cubic-bezier(0.2,0,0,1)` state changes, `--ease-emph` `cubic-bezier(0.16,1,0.3,1)` entrances and the
hover glow, `--ease-linear` loaders/spinners **only**. This resolves the R16 conflict in favour of the
canonical ladder (every step inside Apple's "under 0.3s" except the sanctioned `--dur-4` overlay
entrance). **No bounce, no elastic** (S12); never linear easing on an interactive state. **Motion must
be motivated in one sentence** — hierarchy, storytelling, feedback, state transition; "it looked cool"
is not a reason (S1). MOTION dial = **2**: hover/`active` states, one orchestrated entry, no scattered
per-card reveals (S2). **Hover glow + lift is the house interaction signature** (§H.3).
5.5 **Animate only `transform` and `opacity`** (and `box-shadow` for the glow); never `top`/`left`/
`width`/`height`. **No `window.addEventListener('scroll')`** — IntersectionObserver or CSS scroll-driven
animation. **No animated `filter: blur()`** in a dashboard (S5). Grain only on `fixed
pointer-events:none`; `will-change` sparingly; stagger lists `calc(var(--index) * 80ms)`. **All motion
collapses under `prefers-reduced-motion`** (tokens.css §9b; see §7).
6.1 **Shell = left nav rail + top bar + content region** — users arrive with the mental model from every
other dashboard, and deviating costs them relearning. **Nav rail: 3-5 top-level destinations max**,
one-word labels, **labels always visible** or rail+tooltip *with* a persistent "you are here" indicator;
**icons without labels are a defect; never hide or disable destinations**; active/selected = teal
(§P.2); the rail is level-4 glass, the one sanctioned glass surface. **Top bar: max 2-3 actions on the
right**, height ≤80px desktop (default 64-72px), **single line**.
6.2 **Card hierarchy — three tiers only:** *metric card* (level 2: one `--text-metric` number + label +
delta), *data card* (level 1-2: title, table or chart, one row of actions), *action card* (level 3, rare:
an empty-state invitation). **A card containing another card is a defect** — except the sanctioned §P.4
main-card → module-well composition (one region containing modules, not a nested duplicate). Where
elevation doesn't communicate real hierarchy, group with `border-t`, `divide-y` or negative space; at
cockpit density use **no card boxes at all** — 1px lines separate data, numerals tabular.
6.3 **Data-viz is where the accent palette lives** (§P.3). Chart-box shadows stripped, no gradient fills,
no legend when a direct label works. Grid lines `rgb(255 255 255/.06)` (dark) / `rgb(20 33 61/.08)`
(light). Series use `--viz-1…--viz-6`; each needs **3:1 against the surface** but **hue alone is never
sufficient** (gold vs premium gold = 1.00:1), so every series carries a distinct marker or dash pattern
**plus** a direct label. **No hover-only information.**
6.4 **Filters obey Hick:** defaults + one recommended preset, advanced behind disclosure, ≤7 visible
choices per decision point, recommended highlighted — without simplifying to the point of abstraction
(keep the expert path). **Row actions live in the row** (Fitts), ≥24×24 CSS px and 44×44 on touch;
`--row-h: 48px` / `--row-h-dense: 40px`.
6.5 **Feedback under 400ms** (Doherty): optimistic filter application, skeleton within 400ms, progress
for long queries; skeletons match the final layout's shape. **Design the peak and the end** (Peak-End):
export/report completion and the worst-case large-query wait are deliberate moments. **Progress is
legitimate** (Zeigarnik): completeness meters, "+12 routes" signifiers rather than silent truncation.
**One primary CTA per view**; **ship a temporary "classic view" toggle** for a revamp.
6.6 **Semantic tokens name roles, not values** — consume the canonical set rather than inventing names:
`--surface-app/-card/-sunken/-glass*`, `--ink-primary/-body/-muted`, `--accent-action/-hi/-lo`,
`--state-*-soft/-text`, `--border-hair/-control/-strong`, `--row-hover/-active`. Semantic HTML, clean heading hierarchy, no skipped levels.

## 7. Contrast & accessibility (computed, WCAG 2.2 AA floor)

Thresholds (primary, WCAG 2.2): text **≥4.5:1**; large text (≥24px regular or ≥18.5px bold) **≥3:1**;
UI components, states and meaningful graphics **≥3:1**; targets **≥24×24 CSS px** or spaced so 24px
circles don't intersect; Apple touch minimum **44×44 pt**. Ratios are not rounded (4.499:1 fails).
**Token ladders and every computed pair live in §P.2/§P.6 and `references/palettes.md` — never re-derive
a hex here.**

7.1 **Banned as text tokens** (computed; full list in `references/palettes.md`): `#8B8B9E` (5.10 on
canvas but **3.54 on glass**), `#6B7280` (3.53), `#7E7E93` (4.30), `--slate-500 #84929C` (3.20 white,
**2.66 well**), `#77848C` (3.84/3.20), `--slate-600 #626F77` (5.17 white but **2.97 on glass over
gradient**) — the slate ramp is a *surface and gradient* ramp, not a text ramp. `--ink-disabled #83838C`
is exempt as an inactive component but must still be labelled. **Accent hues are never chrome text**
(§P.3): use `--state-error-text #FF8291` (6.73:1) and `--state-info-text #93C5FD` (8.86:1) on dark, the
darkened light series on light, and `--text-on-gold #1A1A2E` (8.42:1) on gold fills. **Focus ring is teal
per §P.6**; the §H.3 glow is never the focus indicator. **Always verify against the composited surface,
not the base hex.**
7.2 **Control boundaries**: subtle borders are fine only when contrasting text or an icon already
identifies the control. **Computed caveat — `--border-control` does NOT reach 3:1**: `rgb(255 255 255/.22)`
composites to **2.00:1** against `--surface-card #1E2E52` (2.04:1 vs app) despite tokens.css claiming
3.03:1; light `rgb(20 33 61/.20)` is 1.50:1 on white. Where the boundary *is* the only identifier (empty
inputs, unchecked checkboxes, slider tracks) use `--asw-teal` (6.00:1 on card) or `--asw-teal-ink`
(3.98:1 on white), or raise the border to ≥0.35 alpha (2.99:1) / ≥0.40 (3.47:1) — **never rely on
`--border-control` or `--border-hair` (1.42:1) alone, and never on the bare gradient.** **Never encode
state by hue alone**: colour + glyph (↑ ↓ ●) + text label or `aria-label`. On `#000000` scrims use
`#FF8291`, never `#E31937`/`#DC2626` (red-on-black protanopia advisory). **7:1 is an internal target for
critical numeric data only**; AA 4.5:1 is the floor and 7:1 is reachable (white 15.97, teal 7.16 dark;
`#14213D` 15.97, `#313C54` 11.02 light). **The house-style glow is compliant by construction** (§H.3).

**Reduced-preference fallbacks (mandatory; tokens.css §9a-9c already implements them).**
`prefers-reduced-transparency: reduce` → `--surface-glass*` solid (`--navy-700` dark,
`--asw-cloud-white` light), `--glass-blur: 0px`, borders kept, `backdrop-filter: none !important`;
**`[data-glass="off"]` is the in-product "Reduce glass" setting** — the reliable path, since the media
query is **experimental with uneven support**. `prefers-reduced-motion: reduce` → `--dur-2/3/4: 0ms`,
transitions to opacity ≤100ms, §H.3 lift dropped. `prefers-contrast: more` / `forced-colors` →
`--elev-flat: none`, drop glass, neo and the glow for 1px system borders. Keyboard reachability with the
visible teal focus ring everywhere; labels above inputs, **never placeholder-as-label**; errors below
inputs; no text below 11px.

## 8. State matrices

8.1 **Every component ships the full cycle**: default · hover · focus-visible · active/pressed ·
selected · loading · disabled · error. Static-success-only is a defect.
8.2 **Loading:** skeleton matching the final layout's shape, feedback under 400ms, progress for long
queries. **Empty:** one icon or none, an `--text-h4` title, one line of direction, one primary action —
an empty screen is an invitation to act. **Error:** what happened, why, and the fix — plain language,
specific ("Password must be 8+ characters", never "Invalid input"), never blaming the user, **preserving
input**; inline for forms, toasts only for transient events.
8.3 **Hover `[OWNER-DIRECTIVE §H.3]`:** canonical-teal outer glow + 1-2px lift over `--dur-2` 160ms —
additive to `--elev-*`, never a replacement, one hover signal per element, interactive surfaces only,
**never the focus indicator (§7.5)**. **Selected** = `--accent-tertiary` teal + `--row-active`.
**Pressed (neo level 3):** `--neo-inset` / `--ly-well*` inverted + `scale(0.98)`, accent fill steps
`--accent-action` → `--accent-action-lo #1D5A46`; **no bounce**.
8.4 **Disabled:** exempt from contrast requirements, but still legible and still labelled; never disable
a nav destination — hide or remove the path instead. **Undo beats "Are you sure?"** for reversible
actions; confirmation only for irreversible/destructive ones.
8.5 **One action keeps one name through the whole flow**: "Publish" produces a toast saying "Published";
a CTA says exactly what happens ("Save changes", not "Submit"); no two CTAs with the same intent in one
view. **Name things by user understanding** ("notifications", not "webhook config"); one term per concept.

## 9. Pre-flight check (mechanical; failing any box means not done)

- [ ] Design Read + dial values declared (VARIANCE 3 / MOTION 2 / DENSITY 6) and reasoned
- [ ] **Theme canvases: dark `--surface-app #14213D` (`--canvas-grad-dark #0F1A33→#14213D`); light `--surface-app #FFFFFF` over `--canvas-grad-light #A5B2BB→#626F77`, raised card `#FFFFFF`, recessed well `--surface-sunken #E6EBEF`, no text on the bare gradient**
- [ ] **Accent hues (`--asw-gold`/`-prem`/`--asw-red`/`--asw-crimson`/`--asw-blue`/`--asw-success`/`--viz-*`) only in data-viz — never on buttons, toggles, chips, inputs, nav states or the focus ring; chrome = `--asw-teal #58C098` (dark) / `--asw-teal-text #256F57` + `--asw-teal-ink #2E8F6F` (light) + slate/navy neutrals, never on the bare gradient; text on teal fills is `--ink-on-accent #0F1A33`, never white**
- [ ] **House style: canonical radius scale (`--radius-pill` controls at `--control-h` 40px / `-sm` 32px, `--radius-4` 20px cards, `--radius-5` 28px overlays, `--radius-3` 16px inputs) everywhere; hover glow = canonical teal tint (`--asw-teal`/`--accent-action-hi` or the module's `--viz-*`), 14-20px, ~0.30 alpha (≤0.36), 1-2px lift, `--dur-2` 160ms, not white/silver, one signal per element, removed under reduced-motion and forced-colors**
- [ ] Minimalism removal criteria applied; ornament ceiling respected (≤1 glass family, ≤1 neo treatment, ≤1 chrome accent, ≤1 bold element = the data, ≤1 gradient = the canvas ring at ≤15% area and 0 in materials, 0 animated blur); one surface family per layer; glass only on the functional layer; neo on pressed controls plus the light-theme main-card/module-well pair (§P.4); elevation from `--elev-1…6`, never skipped, exactly one level-5 surface; glass fill within the canonical ladder (dark navy-tint `.55`→`.72`, `--surface-glass-max .12` ceiling for text-bearing panels; light `.60`→`.80`); neo edges within `--ly-*` caps; no `#000000` canvas
- [ ] Every text token ≥4.5:1 against the **composited** surface; accent hues not chrome text; banned greys absent (`#8B8B9E`, `#6B7280`, `#7E7E93`, `#84929C`, `#77848C`, `#626F77` as text); focus ring TEAL — `--asw-teal` dark / `--asw-teal-ink` light, 2px at 2px offset, `border-radius: inherit`, ≥3:1 vs the lightest adjacent surface, never gold/silver/white, and the hover glow is not the focus indicator
- [ ] Control boundaries that *are* the identifier reach 3:1; no state by hue alone; every chart series has a distinct marker/dash plus a direct label; targets ≥24×24 CSS px (≥44px on touch) with the spacing exception only where circles don't intersect; full state cycle present; skeleton/empty/error authored, not omitted; no hover-only information and every tooltip value accessible; `prefers-reduced-motion`, `prefers-reduced-transparency` (+ in-product "Reduce glass"), and `prefers-contrast`/`forced-colors` fallbacks all implemented
- [ ] Type: canonical `--text-*` tokens only, ≥11px (`--text-overline` floor), three weights 400/700/800 (G8), no skipped heading levels, measure capped on prose, `--nums-tabular` on data, payload <200KB, no FOIT/CLS
- [ ] **G7 gradient budget: ≤1 `gradient()`/`<*Gradient>` per rendered view (the canvas ring) and ≤15% gradient-painted area; materials gradient-free — `.mat-marble`/`.mat-gloss-*`/capsule/`.stripe-svg`/`--hero-overlay` per §H.5; `docs/design/gates/gradient-budget.py` exits 0 in the consuming repo**
- [ ] Nav rail 3-5 labelled destinations, teal active state, "you are here" indicator, nothing hidden or disabled; top bar ≤3 right-side actions, single line, ≤80px; one primary CTA per view, no duplicate CTA intent, labels don't wrap at desktop; canonical `--space-*` grid not flex-math; bento cell count = content count; explicit <768px collapse; `min-h-[100dvh]`; feedback <400ms; animation only on `transform`/`opacity`; no `window.addEventListener('scroll')`; grain only on `fixed pointer-events-none`
- [ ] Named tells absent (SaaS-card kit, cards in cards, tracked ALL-CAPS eyebrow on every heading, `A · B · C` meta, tinted near-black, `→` on button text, purple gradients, gray text on coloured backgrounds — Inter itself is the deliberate canonical `--font-sans`, not a tell); copy audited: no clichés, emoji, placeholder names, fake-precise numbers or broken strings; rendered viewports inspected in **both themes** (desktop/laptop/tablet/mobile/200% zoom/reduced-motion/reduced-transparency); screenshots committed as evidence, not described; verification output pasted; author did not approve own work; nits ≤5; dated rule recorded for any repeated defect

## 10. Do / Don't

| Do | Don't |
|---|---|
| Remove first, add second | Add ornament because the surface feels empty |
| Chrome in `--asw-teal` + slate/navy; data in the `--viz-*` palette — one bold element per view is the data | Gold/Red/Blue buttons, toggles, nav states, or a gold focus ring |
| Dark `--surface-app #14213D`; light `#FFFFFF` over `--canvas-grad-light` | `#1A1A2E`/`#16213E` as app surfaces (legacy marketing only); text on the bare gradient |
| Canonical radius scale: pill controls, `--radius-4` 20px cards, `--radius-5` 28px overlays; subtle canonical-teal hover glow + 1-2px lift at `--dur-2` 160ms; focus ring = teal | Crisp 4-6px corners on controls; mixed radii; harsh shadow jumps; white/silver glows; gold, silver or white focus rings |
| `--asw-teal-text #256F57` for teal text on light; `--ink-on-accent #0F1A33` on teal fills; `--text-on-gold #1A1A2E` on gold | Raw `--asw-teal` as light text (2.23:1); white text on teal, gold or amber |
| Flat surfaces for content and data; neo on pressed controls + light-theme cards | Glass on tables or backgrounds; neo on dark-theme page backgrounds |
| Elevation from `--elev-1…6` = lighter surface + shadow; `--state-*-text` tokens; verify against the composited panel | Stacking glass + inner highlight + outer shadow + glow; raw hues as text; verify against the base hex and ship |
| Labels + icons in the nav rail, teal active state; conventional dashboard placement; accessible equivalent for every tooltip; skeletons matching final layout; undo for reversible actions; 1px separators **or** spacing | Icon-only mystery-meat navigation; novel navigation to look distinctive; hover-only information; circular spinners everywhere; "Are you sure?" for everything; both separators and spacing plus a card wrapper |
| Canonical `--space-*` grid, 16/24/32 dashboard spacing; `--nums-tabular` numerals; canonical semantic role tokens from tokens.css; screenshot the rendered surface in both themes | Arbitrary padding, flex math, proportional figures in data columns; literal colour tokens (`blue-500`), invented token names, re-derived hexes; trusting a clean detector run as proof |
| Realistic aviation content; prepare the taste decision with evidence; record a dated rule after a repeated defect | John Doe, Acme, `99.99%`; deciding product scope, UX, naming or messaging; repeating the defect and writing a longer prompt |

## 11. Licence & provenance

Apache-2.0 per the repo's per-skill convention; the root is CC-BY-4.0 and the precedence hold is
unresolved (CONTRIBUTING.md) — treat CC-BY-4.0 attribution as binding until ratified. Classification of
all 14 sources, the verbatim audit and the retained notices: `references/provenance.md` — keep its
notices with any copy. lawsofux.com (CC-BY-NC-ND), the Medium article and Apple HIG text are paraphrase-only; MIT/Apache/CC-BY sources may be quoted with their notices.

# Bundled canonical files

This marketplace file carries the canonical skill directory in full. Where the text above names
`references/<file>`, read the section of that name below; each block is that file verbatim. Load a
section when the reference table sends you to it.

## references/minimalism.md

```markdown
# Minimalism — the rationing authority

Sources: S11 leonxlnx/taste-skill `minimalist-skill` (top priority) · S10 heyman333
`apple-ui-designer` · S6 wondel `ux-heuristics` (Nielsen #8) · S2 anthropics `frontend-design` ·
S12 pbakaus `impeccable`. Full digest: `docs/design/research-digest.md`.

Minimalism here is **not a visual style**. It is the authority that decides how much glass and how
much neumorphism a view is allowed. "Every element must earn its place — when everything screams for
attention, nothing stands out" (Nielsen, via S6). "If something feels unnecessary, remove it…
prefer removal over addition" (S10). "Spend your boldness in one place… before leaving the house,
take a look in the mirror and remove one accessory" (S2).

## Restraint rules

1. **One bold element per view.** On ASW that is the primary metric or the route-map visualization.
   Everything around it stays quiet and disciplined (S2).
2. **One accent in use per view.** Red, Gold, Blue, Amber are a *system*, not a simultaneous
   palette. Two warm accents at 8.42:1 and 8.44:1 are near-identical in role and cancel the
   isolation effect (S7 Von Restorff + S1 colour-consistency lock).
3. **Hierarchy by size and weight, not colour** (S10, S4). Vary at most two of size / weight /
   colour between adjacent levels, never all three. Squint test must still reveal hierarchy (S4).
4. **No harsh borders; rely on spacing and grouping** (S10). Where a boundary is needed it is
   exactly **1px** at `rgba(255,255,255,0.08-0.16)` — the dark inversion of S11's
   `1px solid #EAEAEA`. Separators **or** spacing, never both (S10 list rule).
5. **Shadow opacity discipline.** S11: shadows "practically non-existent or heavily customized to
   be ultra-diffuse and low opacity (< 0.05)"; Tailwind's `shadow-md/lg/xl` are banned outright.
   On dark the equivalent is the computed neo ladder with a light edge ≤10%.
6. **One documented radius scale** (S1 shape-consistency lock + S11): cards 8-12px, controls
   8-12px, CTAs 4-6px, pills only for small badges. Never `rounded-full` on containers or primary
   buttons. Mixed systems allowed only with a written rule that is followed everywhere.
7. **Macro-whitespace first** (S11 §8): establish section spacing before components. Marketing
   surfaces `py-24`/`py-32`; dashboard density 16/24/32 on the 8pt grid (S9). Card internal padding
   24-40px (S11). Content constrained to `max-w-4xl`/`max-w-5xl` for prose surfaces.
8. **Copy minimalism** (S6 Krug law 3): remove half the words on each page, then half of what's
   left. Cut "Welcome to our website!", "Please kindly", instructions nobody reads. Error:
   "Password too short (min 8 chars)". Empty: "No results. Try a different search." **Brevity must
   not omit critical disclosures** — pricing, terms and data usage are a user right.
9. **Banned copy clichés** (S11): Elevate, Seamless, Unleash, Next-Gen, Game-changer, Delve.
   Write plain, specific language. Active voice; a CTA says exactly what happens ("Save changes",
   not "Submit") (S2).
10. **No emoji anywhere** — code, markup, text content, headings, alt text (S11). Replace with
    proper icons or clean SVG primitives.
11. **No placeholder names** (John Doe, Acme Corp, Lorem Ipsum) and **no fake-precise numbers**
    (`99.99%`, `92%`, `4.1×`) unless they come from real data or are explicitly marked mock
    (S11, S1 §4.9/§9.D). Use realistic aviation content and organic messy data.
12. **Structural devices encode information, never decorate** (S2). Numbered markers (01/02/03)
    only where the content is genuinely a sequence — a stepped process or a timeline.
13. **No decorative chrome** (S1 §9.F): no tracked ALL-CAPS eyebrow above every heading (rationed
    to ≤1 per 3 sections), no `A · B · C` middle-dot meta strings (max 1 per line), no spaced em
    dashes as a design element, no decorative coloured status dots, no scroll cues, no
    section-number eyebrows, no crosshair/hairline grid lines drawn "to feel designed", no tinted
    near-black standing in for black, no `→` appended to button text, no monospace for every small
    data label (S2 tell list).
14. **Ethical boundary** (S4): never demote fees, disclaimers or opt-outs into small or
    low-contrast type. Hierarchy that hides material information weaponises typography.

## Removal criteria — apply in order, stop at "keep"

1. **Does it answer a Trunk Test question** — what site is this, what page, what are the major
   sections, what are my options here, where am I in the hierarchy, where is search? If no →
   removal candidate (S6 Krug law 4).
2. **Does it change a decision the user makes?** A metric that never alters an action is
   decoration. Judge generative/dense surfaces by whether users move forward, stay engaged and
   accomplish what they came for (S8 designing-for-intent).
3. **Is the information recoverable one click away?** Then demote it to a drill-down rather than
   showing it (S6 Nielsen #7 progressive disclosure; S7 Hick).
4. **Is it a second emphasis competing with the first?** Remove it — "use restraint when placing
   emphasis on visual elements to avoid them competing with one another" (S7 Von Restorff).
5. **Is it a container around nothing?** Common Region requires a *shared area with a clearly
   defined boundary* around a **group**; a card around one ungrouped element is noise (S7 Gestalt).
6. **Is it a card inside a card, or everything in cards?** Remove the wrapper (S12 anti-pattern
   "don't wrap everything in cards or nest cards inside cards"; S2 "the SaaS-card kit" tell).
7. **Is it a default rather than a choice** — default shadow, default radius, gradient wash as
   decoration? Replace with the documented token or remove (S11 §2, S1 §4.4, S2 tell #4).
8. **Would the design still read at a squint?** If removing it doesn't change the squint
   hierarchy, remove it (S4 §6 squint test).
9. **Is the motion motivated in one sentence** — hierarchy, storytelling, feedback, or state
   transition? "It looked cool" is an invalid answer → drop the animation (S1 §5 MOTION MUST BE
   MOTIVATED; S2 "use non-user-triggered motion sparingly").
10. **Remove one accessory** (S2, Chanel). Then **re-run the contrast and target-size checks**,
    because removal changes adjacency (WCAG SC 1.4.11 measures against *adjacent* colours;
    SC 2.5.8 spacing depends on neighbours).

## Ornament ceiling per view

| Budget | Cap |
|---|---|
| Glass families | ≤1 (nav rail + topbar + overlays, all one treatment) |
| Neo treatments | ≤1 (pressed controls) |
| Accents in use | ≤1 |
| Bold elements | ≤1 |
| Decorative gradients | 0 |
| Animated `filter: blur()` | 0 |
| Marquees | 0 |
| Ambient blobs / radial light spots | 0 inside the dashboard (marketing surfaces only) |
| Cards containing cards | 0 |

**Tie-break: when glass and neo would both apply to one element, flat wins.** The element gets a
1px border and a level-2 fill.

## Sections must not feel empty and flat

S11 §6 is the *only* license for ambient depth, and it is scoped to marketing/editorial surfaces:
subtle full-width background imagery at very low opacity, soft radial light spots
(`radial-gradient`, warm tones, **opacity 0.03**), or minimal geometric line patterns — "depth
without breaking the clean aesthetic". S11 §7 permits a single slow ambient blob
(**20s+ duration, opacity 0.02-0.04**) on a `position: fixed; pointer-events: none` layer, never a
scrolling container. **Neither belongs in a dashboard view**: for ASW the depth budget is spent on
the elevation ladder instead (see `glass-neo.md`).

## Banned outright (S11 §2 negative constraints, adapted for dark)

Inter / Roboto / Open Sans as unexamined defaults · generic thin-line icon sets (Lucide, Feather,
Heroicons) · Tailwind `shadow-md/lg/xl` · primary-coloured backgrounds for large elements or
sections · gradients, neon colours, 3D glassmorphism beyond subtle navbar blur · `rounded-full`
pills on large containers, cards or primary buttons · emoji · placeholder names · AI copy clichés.
S12 adds: pure black/gray (always tint) · gray text on coloured backgrounds · bounce/elastic
easing (feels dated). S1 adds: hand-rolled SVG icons · div-based fake screenshots · custom mouse
cursors · neon outer glows · oversaturated accents · gradient text on large headers.

**Iconography** (S11 §6): Phosphor (Bold or Fill) or Radix Icons for a slightly thicker-stroke,
technical aesthetic; **standardise stroke width across all icons**. One family per project (S1).
```

## references/palettes.md

```markdown
# Palettes & computed contrast (both themes)

All ratios computed with the WCAG 2.2 relative-luminance formula against the real ASW hexes — not
quoted from a tool or a source. "N%" = `rgba(255,255,255,N)` composited over the named base.
Thresholds are primary (W3C WCAG 2.2 Understanding SC 1.4.3, 1.4.11, 2.5.8). Digest:
`docs/design/research-digest.md`.

> ## `[OWNER-DIRECTIVE]` — canonical palette and theme assignment (overrides the source-derived roles below)
>
> Canonical statement: `SKILL.md` §P. **Colour authority is `docs/design/tokens.css` in the design-system
> worktree (commit `54d7773`)** — cite token names, not sampled hexes; the hex is quoted only for
> verification. Every ratio below is computed with the WCAG 2.2 relative-luminance formula against those
> canonical hexes. **This block supersedes an earlier draft of this file that used a sampled teal
> `#52B795` and derived light surfaces `#CED5DA` / `#C3CBD0`; those values are void.**
>
> **1. The accent palette is DATA-VIZ ONLY.** `--asw-gold #F5A623`, `--asw-gold-prem #FCA311`,
> `--asw-red #E31937`, `--asw-crimson #DC2626`, `--asw-blue #2563EB`, `--asw-success #22C55E` and the
> per-theme `--viz-1…--viz-6` belong to **chart series, donut segments, sparklines, heat cells, route-map
> markers and module visuals — never to buttons, toggles, chips, inputs, nav states, or any other
> chrome.** Rationale: chrome stays quiet so the data is the loud thing (minimalism's "one bold element
> per view"), and it resolves the Von Restorff conflict where gold and premium gold are near-identical in
> role. **There is no exception for focus** — the focus ring is teal (rule 3), so gold is never chrome.
> Destructive actions are signalled by **label + icon + confirmation**; `--asw-crimson` is a hover/pressed
> *fill* on red, not a default chrome colour.
>
> **2. Theme backgrounds (canonical surfaces).** **Dark**: `--surface-app` = `--navy-800` **`#14213D`**,
> `--surface-card` = `--navy-700` **`#1E2E52`**, `--surface-sunken` = `--navy-900` **`#0F1A33`**, canvas
> `--canvas-grad-dark` `#0F1A33 → #14213D`. **Light** (`[data-theme="cloud"]`): `--surface-app` =
> `--surface-card` = **`#FFFFFF`**, `--surface-sunken` = `--slate-200` **`#E6EBEF`**, canvas
> `--canvas-grad-light` `#A5B2BB → #626F77`. **`#1A1A2E` and `#16213E` are legacy marketing colours
> only** (tokens.css says so explicitly) — never app or card surfaces. `#000000` is scrims/letterboxing
> only. Glass composites: dark `--surface-glass rgb(30 46 82/.55)` ≡ `#1A2849`, `-hi rgb(22 33 62/.72)` ≡
> `#15213E`; light `rgb(255 255 255/.60)` ≡ `#F5F7F9` over the sunken well.
>
> **3. Chrome and brand accent = the canonical Adaptech teal family + slate/navy neutrals.**
>
> | Token | Hex | Canonical role |
> |---|---|---|
> | `--asw-teal` | **`#58C098`** | chrome accent: controls, nav, active/selected states, **dark focus ring** |
> | `--accent-action-hi` | **`#6FD3AC`** | hover / lift highlight (no literal `--asw-teal-hi` token exists at `54d7773`) |
> | `--asw-teal-ink` | **`#2E8F6F`** | UI strokes and **light focus ring** |
> | `--asw-teal-text` | **`#256F57`** | **teal body text on light surfaces** |
> | `--asw-teal-deep` | **`#1D5A46`** | pressed teal (`--accent-action-lo`) |
>
> **Dark theme** (teal is mid-luminance, L = 0.404, so it is text-capable here):
>
> | Token | app `#14213D` | card `#1E2E52` | sunken `#0F1A33` | glass `#1A2849` | glass-hi `#15213E` |
> |---|---|---|---|---|---|
> | `--asw-teal` `#58C098` | **7.16 AA** | **6.00 AA** | 7.74 AA | **6.52 AA** | 7.13 AA |
> | `--accent-action-hi` `#6FD3AC` | 8.82 AA | 7.39 AA | 9.53 AA | 8.03 AA | 8.79 AA |
> | `--asw-teal-ink` `#2E8F6F` | 4.01 3:1 | 3.36 3:1 | 4.34 3:1 | 3.65 3:1 | 4.00 3:1 |
> | `--asw-teal-text` `#256F57` | 2.65 FAIL | 2.23 FAIL | 2.87 FAIL | 2.42 FAIL | 2.65 FAIL |
> | `--asw-teal-deep` `#1D5A46` | 1.98 FAIL | 1.66 FAIL | 2.14 FAIL | 1.80 FAIL | 1.97 FAIL |
>
> **Light theme** (raw teal fails as text; use the ink/text members):
>
> | Token | card `#FFFFFF` | sunken `#E6EBEF` | glass `#F5F7F9` | grad-hi `#A5B2BB` | grad-lo `#626F77` |
> |---|---|---|---|---|---|
> | `--asw-teal` `#58C098` | 2.23 FAIL | 1.86 FAIL | 2.08 FAIL | **1.03 FAIL** | 2.32 FAIL |
> | `--accent-action-hi` `#6FD3AC` | 1.81 FAIL | 1.51 FAIL | 1.69 FAIL | 1.20 FAIL | 2.85 FAIL |
> | `--asw-teal-ink` `#2E8F6F` | **3.98 3:1** | **3.32 3:1** | **3.71 3:1** | 1.84 FAIL | 1.30 FAIL |
> | `--asw-teal-text` `#256F57` | **6.02 AA** | **5.01 AA** | **5.60 AA** | 2.78 FAIL | 1.16 FAIL |
> | `--asw-teal-deep` `#1D5A46` | **8.07 AA** | **6.72 AA** | 7.51 AA | 3.72 3:1 | 1.56 FAIL |
>
> Placement rules that follow: **teal chrome never sits on the bare gradient** (`--asw-teal` 1.03:1 on
> `#A5B2BB` / 2.32:1 on `#626F77`; even `--asw-teal-deep` only reaches 3.72 / 1.56) — chrome lives on a
> card, the nav-rail surface, or in the dark theme. **Text on teal fills = `--ink-on-accent` `--navy-900`
> `#0F1A33`**: **7.74:1** on `--asw-teal`, 9.53:1 on `--accent-action-hi`, 4.34:1 on `--asw-teal-ink`;
> **white on teal fails (2.23:1)**. On pressed `--asw-teal-deep` the ink **inverts** — white 8.07:1, navy
> 2.14:1.
>
> **4. Focus ring = TEAL, never gold/silver/white.** `--focus-ring: var(--asw-teal)` dark /
> `var(--asw-teal-ink)` light, 2px at `--focus-ring-gap: 2px`, `border-radius: inherit`, applied by
> tokens.css §9c to every interactive element in every state and never removed. Computed against the
> lightest adjacent surface: dark **7.16 / 6.00 / 6.52** (app / card / glass); light **3.98 / 3.32 /
> 3.71** (card / well / glass). **Verified caveat**: `--asw-teal-ink` drops to **2.99:1 / 2.29:1** if
> glass is composited directly over the *bare gradient* (`#DBE0E4` / `#C0C5C9`) instead of the white
> card — so "no chrome on the bare gradient" is a **focus-compliance requirement**, not merely aesthetic;
> use `--asw-teal-text #256F57` (4.53 / 3.46) if a control must sit over the gradient. The §H.3 hover
> glow is **never** the focus indicator.
>
> **Canonical ink ladders (computed).** Dark, on app / card / glass / sunken:
>
> | Token | app `#14213D` | card `#1E2E52` | glass `#1A2849` | sunken `#0F1A33` |
> |---|---|---|---|---|
> | `--ink-primary` `#FFFFFF` | **15.97** | **13.39** | **14.55** | **17.27** |
> | `--ink-body` `#E8E8E8` | **13.04** | **10.93** | **11.87** | **14.10** |
> | `--ink-muted` `#AEAEB4` | **7.24** | **6.07** | **6.59** | **7.82** |
> | `--state-info-text` `#93C5FD` | **8.86** | **7.43** | **8.07** | **9.58** |
> | `--state-error-text` `#FF8291` | **6.73** | **5.65** | **6.13** | **7.28** |
> | `--asw-gold` `#F5A623` (data-viz) | **7.88** | **6.61** | **7.18** | **8.52** |
>
> Light, on card / sunken / glass:
>
> | Token | card `#FFFFFF` | sunken `#E6EBEF` | glass `#F5F7F9` |
> |---|---|---|---|
> | `--ink-primary` `#14213D` | **15.97** | **13.31** | **14.87** |
> | `--ink-body` `#313C54` | **11.02** | **9.18** | **10.27** |
> | `--ink-muted` `#4E586C` | **7.15** | **5.96** | **6.66** |
> | `--slate-700` `#4A555D` | **7.64** | **6.36** | **7.11** |
> | `--slate-600` `#626F77` | **5.17** | **4.31** | **4.82** |
> | `--slate-500` `#84929C` | 3.20 3:1 | **2.66 FAIL** | **2.98 FAIL** |
>
> The **slate ramp is a surface-and-gradient ramp, not a text ramp**: `--slate-500` fails AA on the well
> and on glass, and `--slate-600` — though 5.17:1 on white — falls to **2.97:1 on glass composited over
> the bare gradient**. Use the `--ink-*` ladder for text and reserve slate for surfaces, gradients and
> `--accent-secondary`.
>
> **Two stale assertions found in tokens.css comments** (token assignments are correct; the numbers are
> not): `--focus-ring` claims "7.32:1 vs #14213D" but computes to **7.16:1**; `--ink-on-accent` claims
> "7.69:1" but computes to **7.74:1**; `--border-control` claims "3.03:1 vs card" but
> `rgb(255 255 255/.22)` composites to **2.00:1** against `#1E2E52` (2.04:1 vs app) — 3.03:1 is not
> reachable at that alpha on any canonical dark surface (0.35 alpha gives 2.99:1, 0.40 gives 3.47:1).
> **Consequence:** `--border-control` cannot alone satisfy SC 1.4.11's 3:1, so where a boundary *is* the
> only identifier use `--asw-teal` (6.00:1 on card) / `--asw-teal-ink` (3.98:1 on white), or raise the
> border alpha to ≥0.40. All three still clear their intended AA/3:1 roles otherwise.
>
> **5. Dashboard canvas pattern (light theme).** Page gradient `--canvas-grad-light` `#A5B2BB → #626F77`
> full viewport → **one full-viewport raised main card `--surface-card #FFFFFF`** lifted by `--elev-3`
> (`--ly-drop-3` navy `rgb(20 33 61/.12)` bottom-right + `--ly-lift-3` white `rgb(255 255 255/.90)`
> top-left), radius 20-28px → **deep neo module wells `--surface-sunken #E6EBEF`** recessed via
> `--neo-inset` / `--ly-well*`, radius 16-20px. Light-theme neumorphism **inverts** the dark recipe, and
> the inversion is asymmetric: the white lift over a white card computes at exactly **1.00:1 — invisible**
> — so on light **all** depth comes from the navy drop (`rgb(20 33 61/.08)`→`.18` = **1.17-1.44:1**) plus
> the recessed well step (`#E6EBEF` vs white card = **1.20:1**). Gradient luminances: `#A5B2BB` L =
> 0.4343, `#626F77` L = 0.1530. **No text on the bare gradient.**
>
> **6. House-style hover glow, computed over `--surface-app #14213D`** (see `glass-neo.md`): `--asw-teal`
> peaks at **1.83:1** at 0.30 alpha (1.41 at 0.18, 2.08 at 0.36); `--accent-action-hi` peaks at
> **1.99:1** (2.32 at 0.36). Data-viz tints are comparable — gold 1.84:1, premium gold 1.83:1, blue
> 1.36:1, red 1.23:1 — and **white reaches 2.72:1 at 0.30 and 3.30:1 at 0.36**, which is why white and
> silver are excluded as glow tints. Every sanctioned tint therefore sits below the 3:1 non-text
> threshold and reads as ambient light rather than an outline.
>
> **7. Data-viz series colours.** On the dark canvas `#14213D` all pass 3:1 individually: gold 7.88 ·
> premium gold 7.90 · success `#22C55E` 7.01 · red 3.39 · crimson 3.31 · blue 3.09 · teal 7.16. On light
> the raw hues **fail on white** (`#22C55E` = 2.28:1), so tokens.css darkens the series: `--viz-1
> #B45309`, `--viz-2 #15803D`, `--viz-6 #A16207`, `--state-success-text #15803D`, `--state-warning-text
> #B45309`, `--state-error-text #B91C1C`. **But series pairs do not clear 3:1 against each other** — gold
> vs premium gold = **1.00:1** — so hue alone is never sufficient: every series needs a distinct marker
> shape or dash pattern **plus** a direct label (SC 1.4.1 + 1.4.11).

The tables that follow are the external-source record for the locked brand palette and its behaviour on
dark surfaces and composited glass — still authoritative for those pairings, except where the directive
above reassigns a colour's *role*.

## Normative thresholds

- **SC 1.4.3 Contrast (Minimum), AA**: text and images of text **≥4.5:1**; large-scale text
  **≥3:1**, where large = **18pt (≈24px) regular or 14pt (≈18.5px) bold** (`1pt = 1.333px`).
  Exceptions: inactive components, pure decoration, text invisible to everyone, logotypes.
  "Computed values should not be rounded (4.499:1 would not meet the 4.5:1 threshold)."
  Placeholder text, hover text and focus-state text are all in scope.
- **SC 1.4.11 Non-text Contrast, AA**: **≥3:1** for visual information required to identify UI
  components and their states, and for graphical objects needed to understand content. A boundary is
  **not** required when contrasting text or an icon already identifies the control. Focus indicators
  must contrast with adjacent colours (with SC 2.4.7). "2.999:1 would not meet the 3:1 threshold."
- **SC 1.4.6 Contrast (Enhanced), AAA**: 7:1 normal / 4.5:1 large.
- **SC 2.5.8 Target Size (Minimum), AA (new in 2.2)**: **≥24×24 CSS px**, or undersized targets
  spaced so that 24px-diameter circles centred on their bounding boxes do not intersect. Exceptions:
  spacing, equivalent, inline, user-agent control, **essential** — and dense interactive data
  visualizations are named as an essential case.
- **Apple cross-platform minimum**: 44×44 pt hit targets (Apple *Design Tips* / HIG *Layout*).

## Brand palette (locked inputs)

**Roles below are the research baseline; the `[OWNER-DIRECTIVE]` block above reassigns them.** Note in
particular: `#1A1A2E` / `#16213E` are **legacy marketing only** (not level-0/1 surfaces — use
`--navy-800` / `--navy-700`), and **no accent hue is the focus ring** (focus is teal, directive 4).

| Token | Hex | Baseline role | Canonical role |
|---|---|---|---|
| ASW Dark | `#1A1A2E` | level-0 canvas | **legacy marketing only** |
| Charcoal | `#16213E` | level-1 region | **legacy marketing only** |
| Navy | `#14213D` | alternate region / dark text on gold | **`--surface-app` (dark canvas), `--ink-primary` (light text), `--ink-on-accent` as `--navy-900`** |
| Black | `#000000` | scrims and letterboxing **only**, never a surface | unchanged |
| White | `#FFFFFF` | primary text | **`--ink-primary` (dark) and `--surface-card` (light)** |
| Silver | `#E5E5E5` | high-emphasis text, overlay text | `--asw-cloud-mist`; dark `--ink-body` is `#E8E8E8` |
| Red | `#E31937` | brand action fill, icons ≥3:1, ≥24px display numerals | **data-viz only** (`--viz-3`); text role is `--state-error-text` |
| Crimson | `#DC2626` | destructive fill **only** | **data-viz only** (`--viz-4`); hover/pressed fill on red |
| Gold | `#F5A623` | brand highlight / premium, ~~focus ring~~ | **data-viz only** (`--viz-1`); warning text role is `--state-warning-text`; **never the focus ring** |
| Amber | `#FCA311` | warning semantics (never in the same view as Gold) | **data-viz only** (`--asw-gold-prem`, `--viz-6`); restricted use |
| Blue | `#2563EB` | informational fill, chart series | **data-viz only** (`--viz-5`); text role is `--state-info-text #93C5FD` |

## Derived tokens required by contrast

| Token | Hex | Why it exists |
|---|---|---|
| `--text-danger` | `#FF7A8C` | brand Red is 3.62:1 on canvas (large-text only) and 2.90:1 on white/8% glass — a fail. This tint is **6.83:1** on `#1A1A2E` and **4.74:1** on the worst panel (white/10% over Charcoal) |
| `--text-info`, `--link` | `#93C5FD` | brand Blue is 3.30:1 on canvas, 2.64:1 on white/8% glass. This tint is **9.46:1** / **6.55:1**. Alternate `#60A5FA` = 6.71:1 / 4.65:1 for a stronger blue |
| `--text-secondary` | `#A3A3B5` | `#8B8B9E` passes on canvas (5.10:1) but fails on glass panels (3.54:1). `#A3A3B5` is **6.87:1** / **4.76:1**. Alternate `#9CA3AF` = 6.72:1 / 4.66:1 |
| `--text-on-gold` | `#1A1A2E` | Gold and Amber are high-luminance fills; white text on them is not an AA pair. ASW Dark on Gold = **8.42:1**, on Amber = **8.44:1** (Black = 10.36 / 10.39) |

**Never substitute a brand hue for its text token.**

## Computed contrast — flat surfaces

| Foreground | `#1A1A2E` | `#16213E` | `#14213D` | `#000000` |
|---|---|---|---|---|
| White `#FFFFFF` | **17.06** AA | **15.89** AA | **15.97** AA | **21.00** AA |
| Silver `#E5E5E5` | **13.54** AA | **12.62** AA | **12.68** AA | **16.67** AA |
| Gold `#F5A623` | **8.42** AA | **7.84** AA | **7.88** AA | **10.36** AA |
| Amber `#FCA311` | **8.44** AA | **7.86** AA | **7.90** AA | **10.39** AA |
| `#A3A3B5` (secondary) | **6.87** AA | **6.41** AA | **6.44** AA | **8.46** AA |
| `#93C5FD` (info/link) | **9.46** AA | **8.81** AA | **8.86** AA | — |
| `#FF7A8C` (danger) | **6.83** AA | **6.37** AA | **6.40** AA | — |
| Red `#E31937` | 3.62 L | 3.38 L | 3.39 L | 4.46 L |
| Crimson `#DC2626` | 3.53 L | 3.29 L | 3.31 L | 4.35 L |
| Blue `#2563EB` | 3.30 L | 3.08 L | 3.09 L | 4.06 L |
| `#8B8B9E` | 5.10 AA | 4.76 AA | 4.78 AA | 6.28 AA |
| `#7E7E93` | 4.30 fail | 4.01 fail | — | 5.29 AA |
| `#6B7280` | 3.53 fail | 3.29 fail | — | 4.34 fail |

L = passes 3:1 large-text only. `#7E7E93` and `#6B7280` are **banned as text tokens**.

## Computed contrast — composited glass panels

| Foreground | 4%/ASW | 6%/ASW | 8%/ASW | 10%/ASW | 12%/ASW | 8%/Char | 10%/Char |
|---|---|---|---|---|---|---|---|
| White | 15.38 | 14.41 | 13.64 | 12.72 | 11.99 | 12.54 | 11.82 |
| Silver `#E5E5E5` | 12.21 | 11.44 | 10.83 | 10.10 | 9.52 | 9.95 | 9.38 |
| Gold `#F5A623` | 7.59 | 7.11 | 6.73 | 6.28 | 5.92 | 6.19 | 5.83 |
| Amber `#FCA311` | 7.61 | 7.13 | 6.75 | 6.29 | 5.93 | 6.20 | 5.85 |
| `#A3A3B5` | — | — | — | — | — | — | **4.76** |
| `#FF7A8C` | — | — | — | — | — | — | **4.74** |
| `#93C5FD` | — | — | — | — | — | — | **6.55** |
| Red `#E31937` | 3.27 L | 3.06 L | **2.90 F** | **2.70 F** | **2.55 F** | **2.66 F** | **2.51 F** |
| Crimson `#DC2626` | 3.19 L | **2.98 F** | **2.83 F** | **2.63 F** | **2.48 F** | **2.78 F** | **2.60 F** |
| Blue `#2563EB` | **2.98 F** | **2.79 F** | **2.64 F** | **2.46 F** | **2.32 F** | **2.43 F** | **2.29 F** |
| `#8B8B9E` | — | — | 4.08 F | — | — | — | **3.54 F** |

F = fails even the 3:1 large-text threshold. Composited panel hexes for reference: white/4% over
`#1A1A2E` = `#232336` (L=0.0183) · 6% = `#28283B` · 8% = `#2C2C3F` · 10% = `#313143` · 12% =
`#353547`; over `#16213E`: 8% = `#29334D`, 10% = `#2D3751`.

## Borders and focus rings

Baseline computation against the legacy dark surfaces — retained as the derivation record; the canonical
tokens and the **teal** focus ring are in the directive block above.

| Candidate | vs `#1A1A2E` | vs `#16213E` | Verdict |
|---|---|---|---|
| white/8% ≈ `#2C2C3F` | 1.25:1 | 1.16:1 | Decorative only. Permitted because contrasting text/icon identifies the control (WCAG waives the boundary then) |
| white/12% ≈ `#353547` | 1.42:1 | 1.33:1 | Decorative only |
| white/16% ≈ `#3F3F52` | 1.66:1 | 1.55:1 | Decorative only |
| white/20% ≈ `#494959` | 1.93:1 | 1.80:1 | Decorative only |
| silver/30% ≈ `#5C5C6B` | 2.60:1 | 2.42:1 | Still below 3:1 — not a control boundary |
| `--asw-teal #58C098` | 7.64:1 | 7.12:1 | **Canonical dark focus ring**; control boundaries, slider tracks (on the canonical surfaces: 7.16 app / 6.00 card / 6.52 glass) |
| `--asw-teal-ink #2E8F6F` | 4.28:1 | 3.99:1 | **Canonical light focus ring** and UI strokes (3.98:1 on white card; 3.32:1 on the sunken well) |

**Focus ring is TEAL** (`--focus-ring`), 2px at `--focus-ring-gap: 2px`, `border-radius: inherit`,
verified against the **lightest adjacent surface**. **Gold, silver and white are not focus-ring
colours** — gold is data-viz only (directive 1), and silver/white focus rings were an earlier draft's
error. Brand Blue is also disqualified (3.30:1 on canvas but 2.46-2.98:1 on lighter glass).
**`--border-control` does not reach 3:1** (computes 2.00:1 vs `--surface-card`, despite tokens.css
claiming 3.03:1), so it cannot alone identify a control — use teal, or raise the border alpha to ≥0.40
(3.47:1).

## Failing combos → fixes

| # | Failing combo (computed) | Fix |
|---|---|---|
| F1 | Red `#E31937` as body text on `#1A1A2E` — 3.62:1 | `--text-danger #FF7A8C` (6.83:1); Red becomes fill/icon/≥24px display only |
| F2 | Crimson `#DC2626` as text anywhere — 3.29-3.53:1 | Crimson is **fill-only** (destructive button bg) |
| F3 | Blue `#2563EB` as text or link on dark — 3.08-3.30:1 | `--text-info`/`--link #93C5FD` (9.46:1) or `#60A5FA` (6.71:1); links also need a non-colour affordance (underline) per SC 1.4.1 |
| F4 | Any brand hue as text on ≥8% white glass | Cap text-bearing glass fill at **0.06**; on levels 4-5 use only White, Silver, Gold, Amber or the lightened variants |
| F5 | White text on Gold/Amber fills | `--text-on-gold #1A1A2E` (8.42:1 / 8.44:1) |
| F6 | `#8B8B9E` as secondary text — fails on panels at 3.54:1 | `--text-secondary #A3A3B5`; ban `#6B7280`, `#7E7E93` |
| F7 | white/8-20% borders as the *only* control identifier | `--asw-teal` (6.00:1 on card) / `--asw-teal-ink` (3.98:1 on white), or border alpha ≥0.40 (3.47:1). `--border-control` at 2.00:1 is insufficient alone |
| F8 | Any accent hue as focus ring — brand Blue 2.46-2.98:1 on glass; gold violates data-viz-only | **Teal** focus ring: `--asw-teal` dark (7.16/6.00/6.52), `--asw-teal-ink` light (3.98/3.32/3.71) |
| F9 | Red on black (protanopia advisory in SC 1.4.3) | On `#000000` scrims use `#FF7A8C`; always pair red with an icon/shape |
| F10 | Hue-only status encoding | Colour **+** glyph (↑ ↓ ●) **+** text label or `aria-label`; chart series colour **+** dash/marker |

## Conformance floor

**WCAG 2.2 AA everywhere** (4.5:1 normal text, 3:1 large text and non-text, 24×24 CSS px targets,
visible focus, survives 200% zoom, no hover-only information, no text below 11px, labels above
inputs and never placeholder-as-label). **7:1 is an internal target for critical numeric data only**
— primary KPI values, fare and seat figures, safety-relevant flags. S9 recommends 7:1 for critical
text but 7:1 is WCAG AAA (SC 1.4.6), so AA stays the compliance floor. Headroom exists: White on
ASW Dark = 17.06:1 and Gold = 8.42:1, so 7:1 is reachable for primary values without inventing
tokens.

## Semantic token naming

Tokens name **roles, not values** (`--surface-card-raised`, `--text-secondary`,
`--action-primary-bg`, `--border-control`) rather than `blue-500` — three independent sources
converge on this (S8 MX/semantic design systems per Figma's guidance; S9 Apple's four-level semantic
ladders; S12 `DESIGN.md` recording the visual system separately from product truth). Each accent
ships as a **pair** (soft fill + legible foreground), mirroring S11's pastel+text pairs
(`#FDEBEC`+`#9F2F2D` etc.) — never a bare hex.
```

## references/glass-neo.md

```markdown
# Glass + Neumorphism (both themes)

Sources: S1 taste-skill §5 + Appendix C (Liquid-Glass web approximation) · S8 2026 trends (return of
glassmorphism + its accessibility failures) · S9/S10 Apple HIG-derived skills · S11 minimalist-skill
shadow/depth discipline · computed WCAG contrast. Digest: `docs/design/research-digest.md`.

> **`[OWNER-DIRECTIVE]` — read this first; it overrides the external sources below on radius, glow and
> theme canvases.** Canonical statement: `SKILL.md` §P and §H. Colour authority: `docs/design/tokens.css`
> in the design-system worktree (commit `54d7773`) — **cite token names, not sampled hexes.**
>
> 1. **House forms are ROUNDED neumorphic + glassmorphic**, using the canonical radius scale:
>    `--radius-pill` 999px for buttons/toggles/sliders/steps/capsules/filter chips · `--radius-5` 28px
>    for modals, bento hero and the dashboard frame · `--radius-4` 20px for cards, KPI tiles and the nav
>    rail · `--radius-3` 16px for inputs, selects, toasts and tiles · `--radius-2` 8px for small chips
>    and flyouts · `--radius-1` 4px for legend dots and code chips only. This overrides S11's "8-12px
>    maximum, no `rounded-full` on containers or primary buttons" and S1's crisp CTA radii, which are
>    kept below only as the external-source record. One documented scale still applies everywhere
>    (S1 shape lock).
> 2. **SUBTLE GLOW ON HOVER** is the house interaction signature: a soft hue-tinted outer glow,
>    **14-20px blur at ~0.30 alpha** (band 0.18-0.36), plus a **1-2px lift**, over `--dur-2` (160ms) with
>    `--ease-emph` — never a harsh shadow jump. **Computed over `--surface-app #14213D`**: `--asw-teal
>    #58C098` at 0.30 peaks at **1.83:1** (1.41 at 0.18, 2.08 at 0.36); `--accent-action-hi #6FD3AC` at
>    0.30 peaks at **1.99:1** (2.32 at 0.36); data-viz tints are comparable (gold 1.84, premium gold
>    1.83, blue 1.36, red 1.23). All sit **below the 3:1 non-text threshold** and around the ~1.5:1
>    harsh-border line, so the glow reads as *ambient light*, not an outline. **White and Silver are not
>    glow tints** (white reaches 2.72:1 at 0.30 and **3.30:1** at 0.36). The glow is **additive to
>    elevation, never a replacement** (`--neo-raised` / `--ly-drop-*` stays), and is **not** the focus
>    indicator. One hover signal per element. This is a deliberate, numerically bounded override of S1's
>    "no neon / outer glows by default" and S11's "no neon colors", taken through S1's own override path
>    ("embrace it… but execute with intent"). S10's "no harsh borders or outlines" is satisfied, not
>    violated.
> 3. **Two theme canvases, both canonical.** **Dark**: `--surface-app` `--navy-800` **`#14213D`**,
>    `--surface-card` `--navy-700` **`#1E2E52`**, `--surface-sunken` `--navy-900` **`#0F1A33`**, canvas
>    `--canvas-grad-dark` `#0F1A33 → #14213D` (**not** `#1A1A2E`/`#16213E`, which tokens.css marks
>    legacy marketing only). **Light** (`[data-theme="cloud"]`): `--surface-app` = `--surface-card` =
>    **`#FFFFFF`**, `--surface-sunken` = `--slate-200` **`#E6EBEF`**, canvas `--canvas-grad-light`
>    `#A5B2BB → #626F77` — the only sanctioned decorative gradient, and it is the canvas, not a
>    component ornament. The light dashboard is a **three-tier neo composition**: page gradient →
>    **one full-viewport raised main card `#FFFFFF`** lifted by `--elev-3` (`--ly-drop-3` navy
>    bottom-right + `--ly-lift-3` white top-left), radius 20-28px → **deep neo module wells inside
>    `#E6EBEF`**, recessed via `--neo-inset` / `--ly-well*` (inset navy top-left, white bottom-right),
>    radius 16-20px.
> 4. **Glass is a LAYER MARKER, only where content scrolls/moves behind** (tokens.css records this rule
>    verbatim). Canonical fills: dark `--surface-glass rgb(30 46 82/.55)` ≡ **`#1A2849`** over app,
>    `--surface-glass-hi rgb(22 33 62/.72)` ≡ `#15213E`, `--surface-glass-ov rgb(255 255 255/.10)`,
>    `--surface-glass-max rgb(255 255 255/.12)` ≡ `#303C54` as the **ceiling for text-bearing panels**;
>    light `rgb(255 255 255/.60)` ≡ **`#F5F7F9`** → `.72` → `.80`. Blur `--glass-blur: 16px` for
>    persistent chrome, `--glass-blur-ov: 24px` for overlays. Note the dark ladder is **navy-tinted, not
>    white-tinted** — darker, so contrast is *better*; a white tint above 0.12 drops accent hues below
>    3:1.
> 5. **Light-theme neumorphism inverts the dark recipe**: on dark the raised edge is a *light* shadow and
>    the receding edge is *black*; on light the raised edge is a **white highlight** (`--ly-lift-*`,
>    `rgb(255 255 255/.80-1)`) and the receding edge is **navy-tinted** (`--ly-drop-*`,
>    `rgb(20 33 61/.08-.18)`). **Computed asymmetry**: the white lift over `--surface-card #FFFFFF` is
>    exactly **1.00:1 — invisible** — so on light **all** depth comes from the navy drop
>    (**1.17-1.44:1**) plus the recessed well step (`#E6EBEF` vs white = **1.20:1**). On dark
>    `--ly-lift-*` runs `.04`→`.09` = **1.12-1.32:1** and `--ly-drop-*` runs `.35`→`.60` =
>    **1.14-1.22:1**, both under the ~1.5:1 outline line.
> 6. **Neo's scope widens in the light theme only**: besides pressed controls, the raised main card and
>    its recessed module wells are neo *by owner directive*. In the dark theme, neo stays on pressed
>    controls and content/data stay flat.
> 7. **Pill target-size guard**: pill rounding does not shrink the hit area — a control ≥24px tall and
>    ≥24px wide still inscribes a 24×24 CSS px square (WCAG 2.5.8). Below 24px tall it is *undersized*
>    and passes only via the spacing exception. Canonical control heights satisfy the WCAG floor
>    (`--control-h: 40px`, `--control-h-sm: 32px`); **Apple's 44×44 pt applies to touch**, and since iOS
>    points are density-independent like CSS px (44 pt ≈ 44 px), touch layouts must grow to ≥44px.
> 8. **Accent hues are DATA-VIZ ONLY** (see `palettes.md`): gold, premium gold, red, crimson, blue,
>    success and `--viz-1…6` never appear on buttons, toggles, chips, inputs or nav states — **and never
>    as the focus ring**. Chrome is the canonical teal family: `--asw-teal #58C098` (dark),
>    `--asw-teal-text #256F57` + `--asw-teal-ink #2E8F6F` (light), pressed `--asw-teal-deep #1D5A46`,
>    hover `--accent-action-hi #6FD3AC`. The glow tint therefore comes from teal or from the data-viz hue
>    of the element being hovered (a module card whose visual is gold-tinted may glow gold) — never from
>    an accent used as chrome.
> 9. **Focus ring is TEAL**: `--focus-ring: var(--asw-teal)` dark (7.16:1 app / 6.00:1 card / 6.52:1
>    glass), `var(--asw-teal-ink)` light (3.98:1 white card / 3.32:1 well / 3.71:1 glass), 2px at
>    `--focus-ring-gap: 2px`, `border-radius: inherit`, never removed (tokens.css §9c). Verified caveat:
>    `--asw-teal-ink` drops to **2.99:1 / 2.29:1** if glass is composited directly over the *bare
>    gradient* (`#DBE0E4` / `#C0C5C9`), so "no chrome on the bare gradient" is a focus-compliance
>    requirement, not merely aesthetic — use `--asw-teal-text #256F57` (4.53 / 3.46) if unavoidable.

## House-style glow CSS

```css
/* HOUSE STYLE [OWNER-DIRECTIVE] — subtle hue-tinted hover glow + lift.
   Tint is canonical --asw-teal / --accent-action-hi, never white or silver. */
.asw-card, .asw-control { transition: box-shadow var(--dur-2) var(--ease-emph), transform var(--dur-2) var(--ease-emph); }
.asw-card:hover, .asw-control:hover {
  transform: translateY(-2px);                 /* 1-2px lift */
  box-shadow: 0 0 18px rgb(88 192 152 / .30),  /* --asw-teal #58C098 @ ~30% = 1.83:1 peak */
              0 10px 24px rgb(0 0 0 / .32);    /* elevation retained, not replaced */
}
@media (prefers-reduced-motion: reduce) { .asw-card:hover, .asw-control:hover { transform: none; transition: none; } }
@media (prefers-contrast: more), (forced-colors: active) { .asw-card:hover, .asw-control:hover { box-shadow: none; } }
```

`--neo-inset` / `--ly-well*` gives the pressed state; `--elev-flat: none` is the canonical
reduced-preference and disabled state.

## G7 gradient budget (unqualified) — gradient-free material contracts

**≤1 `gradient()`/`<*Gradient>` painted per rendered view — the canvas ring (`--canvas-grad-light` /
`--canvas-grad-dark`, §P.4) — and ≤15% of view area in gradient paint.** Every material recipe below is
gradient-free (guide §4 + §17 gate record v2.4, tokens.css §8; mechanical gate
`docs/design/gates/gradient-budget.py` in the consuming repo):

| Material | Class contract | Gradient-free recipe |
|---|---|---|
| Marble knob/thumb | `.mat-marble`, `.toggle .knob`, `.slider .thumb` | flat tinted body `--marble-flat` + `::before` solid white @85% specular dot (38% circle at 18%/14%) + `--marble-edge` inset shading + `--marble-rim`/`--marble-rim-teal` rim glow + contact shadow |
| Gloss button | `.mat-gloss-*`, `.btn.primary`, `.btn.viz` | flat two-tone body `--gloss-teal/-red/-gold/-blue` (+`-hi`) + `::before` solid `--gloss-band` white 18% band over the top third, hard bottom edge + `inset 0 1px 0 wht/40` + tinted drop |
| Capsule (toggle-on, active chip) | capsule classes | flat hue tint `--capsule-*` @42-45% + `--capsule-lum-*` inset luminous centre + `--capsule-rim-*` saturated rim glow + inner light border |
| Stripe accent | `.stripe-svg > rect` | static inline-SVG rotated solid rects, no `<Gradient>` defs — never spends the budget |
| Hero scrim / premium fill | `--hero-overlay`, `--grad-prem` | solid `rgb(26 26 46 / 0.62)` / solid `#F8B32A` (legacy name, no gradient) |

The glass skeleton below therefore carries **no gradient sheen**: the old `linear-gradient` top-light
pass is replaced by a flat fill plus the solid inner-edge highlight.

## Assignment rule

**One surface family per layer, never mixed within a layer.**

| Layer | Family | Why |
|---|---|---|
| Functional / navigation (nav rail, sticky topbar, overlays) | **Glass** | Apple HIG *Materials* positions Liquid Glass as the layer above content, for controls and navigation — naming tab bars and sidebars; **"Don't use Liquid Glass in the content layer"** |
| Tactile controls the user presses (buttons, toggles, chips, segmented) | **Neo** | S10: motion and material "explain hierarchy, not decorate"; S11 permits depth only where it is a real affordance |
| Content and data (sections, tables, metric cards, list cards) | **Flat solid** | S9 Deference: "UI never competes with content"; S11 §1 rejects 3D glassmorphism beyond subtle navbar blurs |

Glass is a **layer marker, not a texture**. On a flat dark canvas with nothing scrolling behind it,
blur renders as a slightly gray rectangle — that is a defect, not a style.

## Concrete ranges (computed against the real ASW palette)

| Property | Research baseline (external sources) | Basis |
|---|---|---|
| Glass fill | **[SUPERSEDED]** baseline was white-tint `rgba(255,255,255,0.04)`→`0.09`, never above 0.12, 0.06 max with body text. **Canonical (directive 4) is navy-tinted**: dark `--surface-glass rgb(30 46 82/.55)` → `-hi .72` → `-max rgb(255 255 255/.12)`; light `.60` → `.72` → `.80`. The baseline's *ceiling logic* still holds — text-bearing panels cap at `--surface-glass-max`. | computed luminance ladder; S8 §1 "controlling opacity, background blur radius, and elevation" |
| Glass blur — persistent chrome | `backdrop-filter: blur(16px) saturate(160%)` | S1 Appendix C uses 24px/180%/1.05; reduced for always-on surfaces |
| Glass blur — overlays | `backdrop-filter: blur(24px) saturate(180%) contrast(1.05)` | S1 Appendix C skeleton verbatim |
| Glass edge | `border: 1px solid rgba(255,255,255,0.10-0.16)` + `box-shadow: inset 0 1px 0 rgba(255,255,255,0.10-0.22)` | S1 §5: "add a 1px inner border (`border-white/10`) and a subtle inner shadow… for physical edge refraction" |
| Glass shadow — overlays | `0 18px 60px rgba(0,0,0,0.42)` | S1 Appendix C dark block |
| Glass shadow — cards | `0 2px 8px rgba(0,0,0,0.24)` | S11 hover spec scaled for dark; opacity discipline |
| Neo raised — light edge | **[SUPERSEDED]** baseline `rgba(255,255,255,0.06-0.10)` top-left. **Canonical is the `--ly-lift-N` ladder**: dark `rgb(255 255 255/.04)`→`.09` (= **1.12-1.32:1**), light `rgb(255 255 255/.80)`→`1` — and on light the white lift over a white card computes at exactly **1.00:1, invisible** (directive 5). | computed against `--surface-app` / `--surface-card` |
| Neo raised — dark edge | **[SUPERSEDED]** baseline `rgba(0,0,0,0.35-0.55)`. **Canonical is `--ly-drop-N`**: dark `rgb(0 0 0/.35)`→`.60` (= **1.14-1.22:1**), light **navy-tinted** `rgb(20 33 61/.08)`→`.18` (= **1.17-1.44:1**) — on light the navy drop, not the highlight, carries all the depth. | computed |
| Neo inset (pressed) | `--neo-inset` / `--ly-well*` (dark: `inset 3px 3px 8px rgb(0 0 0/.55)` + `inset -2px -2px 6px rgb(255 255 255/.06)`; light: navy `.12` + white `.90`), plus `scale(0.98)` on `:active`; accent fill steps `--accent-action` → `--accent-action-lo` | S11 §5/§7 tactile feedback; canonical tokens |
| Neo radius | **[SUPERSEDED]** baseline was 12px max controls / 8-12px cards / never `rounded-full` (S11 §2/§5). **Canonical is the house-style scale** (directive 1): `--radius-pill` controls, `--radius-4` 20px cards, `--radius-5` 28px overlays/modals, `--radius-3` 16px inputs, `--radius-2` 8px small chips, `--radius-1` 4px legend dots. | S11 §2/§5, overridden by directive 1 |
| Ambient depth (marketing only) | radial light spots `opacity 0.02-0.04`, 20s+ drift, `fixed pointer-events-none` | S11 §6/§7 |

### Web approximation skeleton (S1 Appendix C, adapted to ASW dark)

```css
/* Web glassmorphism approximation of Apple Liquid Glass — NOT an Apple-issued package.
   Label it as an approximation in comments (S1 §2.B). */
.asw-glass-overlay {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / .14);
  background: rgb(22 33 62 / .42);              /* Charcoal base, flat — G7: no gradient sheen */
  /* top-light pass as a SOLID pseudo-element, not a gradient (G7 material contract): */
  /* .asw-glass-overlay::before { inset: 0; background: rgb(255 255 255 / .06); } */
  backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .22),
    inset 0 -1px 0 rgb(255 255 255 / .08),
    0 18px 60px rgb(0 0 0 / .42);
}

.asw-glass-chrome {                            /* nav rail / topbar: level 4 */
  background: rgb(255 255 255 / .08);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .14);
  border-bottom: 1px solid rgb(255 255 255 / .10);
}

.asw-neo-control {                             /* level 3, raised */
  background: #1A1A2E;
  border-radius: 12px;
  box-shadow:
    -8px -8px 20px rgb(255 255 255 / .08),     /* light edge ≤10% */
     8px  8px 20px rgb(0 0 0 / .45);           /* dark edge carries the depth */
}
.asw-neo-control:active {
  transform: scale(0.98);
  box-shadow:
    inset -4px -4px 10px rgb(255 255 255 / .06),
    inset  4px  4px 10px rgb(0 0 0 / .45);
}

@media (prefers-reduced-transparency: reduce) {
  .asw-glass-overlay, .asw-glass-chrome {
    background: rgb(22 33 62 / .96);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: rgb(255 255 255 / .20);
  }
}
```

`prefers-reduced-transparency` is **experimental with uneven browser support** (MDN; S1 Appendix C
says the same). The media query alone will not reach most users, so an **in-product "Reduce glass"
setting is also mandatory** — S8 §2 explicitly recommends "an opacity slider or transparency options
in your product so it's easy to reduce or disable glass effects based on user preferences."

## Failure modes on dark, each with its fix

1. **Blur is invisible on an already-flat dark canvas.** Glass reads as a slightly gray rectangle
   with nothing behind it. → Glass only where content actually scrolls underneath (nav rail, sticky
   topbar, overlays), per Apple's functional-layer rule; flat solid everywhere else.
2. **Text contrast collapses as fill rises.** Computed: white holds 17.06:1 on `#1A1A2E` but 12.0:1
   at white/12% and 10.3:1 at 16% — white text survives; *muted* text does not (`#8B8B9E` falls
   5.10 → 3.59:1 across the same ladder). → Cap text-bearing fill at 0.09 and **recompute muted
   tokens against the composited panel colour, not the base**.
3. **Accents fail earlier than expected.** Computed: brand Red `#E31937` = 3.62:1 on base
   (large-text only) and **2.90:1 at white/8% — failing even large text**; Crimson 2.83:1 at 8%;
   Blue `#2563EB` = 3.30:1 base, 2.64:1 at 8%. → Never set brand Red/Crimson/Blue as *text* on
   glass; use `--text-danger #FF7A8C` / `--text-info #93C5FD`, or use the brand hues as fills only.
4. **Neo is impossible on a pure-black canvas.** Computed: the darkest useful neo shadow (black 55%
   over base = `#0C0C15`) sits at **1.08:1 against `#000000`**, so the receding edge vanishes.
   → `#000000` is reserved for scrims/letterboxing, never a neo surface canvas. S9 agrees: "don't
   use pure `#000000` — use `systemBackground`".
5. **Neo reads as a border, not as depth.** Above ~14% white edge the soft pillow becomes a 1.53:1
   outline — the harsh border S10 bans. → Keep the light edge ≤10% (≤1.34:1) and let the *dark*
   edge do the depth work.
6. **Stacked blur costs frames.** `backdrop-filter` over a large scrolling region + animated blur
   (S5) + a grain layer (S1 §6.E) is the classic dark-glass jank. → One blurred layer per viewport
   region; grain only on `fixed pointer-events-none`; animate only `transform`/`opacity`; **no
   animated `filter: blur()` in a dashboard** (S5 also notes blur-in reveals are costlier than
   mask reveals).
7. **Two warm accents cancel the isolation effect.** `--asw-gold #F5A623` and `--asw-gold-prem #FCA311`
   are 7.88:1 and 7.90:1 on the dark canvas and near-identical in role (S7 Von Restorff). → **[CORRECTED
   by the data-viz-only directive]** the earlier fix ("Gold = brand highlight/premium, Amber =
   warning") is **void**: both are data-viz hues and neither is chrome. The isolation effect is now
   earned by **teal chrome staying quiet so the data is the loud thing** — one bold element per view,
   which is the data itself. Within a chart, gold vs premium gold is **1.00:1**, so they must never be
   adjacent series without distinct markers or dash patterns.
8. **Glass over photography or route maps washes out** — S8 §2 names exactly this: "inconsistent
   readability, where text becomes too light, too dark, or completely washed out. And if your
   background image is busy it will only make it worse." → Scrim `rgba(0,0,0,0.45-0.6)` between
   imagery and glass; **test against real backgrounds, in motion, across light and dark modes**
   (S8's own recommendation).
9. **No reduced-transparency fallback.** → Ship both the media query *and* the in-product setting
   (see skeleton above).
10. **Ornament inflation.** Every card gets glass + inner highlight + outer shadow + hover lift →
    the SaaS-card-kit tell (S2) and cards-nested-in-cards (S12). → Apply the minimalism removal
    criteria; cards get a 1px border **or** elevation, never both plus glass (S10: separators *or*
    spacing, not both).

## Verification

Deterministic checks are **evidence, not proof**: "a clean detector run… does not replace inspecting
the rendered experience across relevant viewports" (S12). For glass and neo specifically, inspect:
the surface over **real** scrolling content (not an empty canvas), in motion, at 200% zoom, with
reduced transparency on, with increased contrast on, and in both colour modes. Screenshot and commit
the evidence (S14: for UI, close the loop with a screenshot or browser check, two or three rounds).
```

## references/apple-hig.md

```markdown
# Apple HIG / vibrancy → elevation ladder

Sources (primary): Apple HIG *Materials* (developer.apple.com/design/human-interface-guidelines/materials,
"Updated guidance for Liquid Glass", alert-date 2025-09-09) · Apple *Design Tips* / HIG *Layout* ·
Material Design 3 *Elevation* (m3.material.io/styles/elevation) · S9 jamesrochabrun
`apple-hig-designer` · S10 heyman333 `apple-ui-designer`. Digest: `docs/design/research-digest.md`.

## Apple's three principles (S9)

- **Clarity** — text legible at every size, icons precise, adornments subtle, functionality drives
  the design.
- **Deference** — "UI helps people understand and interact with content, but never competes with
  it"; a light visual treatment keeps focus on content and gives it room to breathe.
- **Depth** — "distinct visual layers and realistic motion impart vitality and facilitate
  understanding"; blur/material is used *for* hierarchy.

## Material levels (HIG *Materials*, paraphrased; Apple page text is all-rights-reserved, so only short quotes are kept)

- iOS/iPadOS provide **four standard materials — ultra-thin, thin, regular (default), and thick —
  plus Liquid Glass.**
- Materials exist to separate foreground (text, controls) from background: colour passes through
  from background to foreground, and that translucency is what establishes visual hierarchy and
  keeps people oriented while content moves behind a surface.
- Liquid Glass is positioned as **the functional layer**: it forms a distinct layer for controls
  and navigation — the HIG names tab bars and sidebars — floating above the content layer, so
  functional elements and content stay visually separate.
- **"Don't use Liquid Glass in the content layer."** There it adds complexity and confuses the
  hierarchy; content-layer elements such as app backgrounds take standard materials. Exception:
  transient interactive controls (sliders, toggles) may take a Liquid Glass appearance while
  activated, to emphasise interactivity.
- **"Use Liquid Glass effects sparingly."** Reserve them for the most important functional
  elements; overuse on custom controls pulls attention away from content.
- Two variants: **regular** and **clear**. *Regular* blurs the background and adjusts its luminosity
  to keep foreground text legible; scroll-edge effects add further blur and reduce background
  opacity. Most system components use regular, and the HIG directs it wherever background content
  could hurt legibility or the component carries a lot of text (alerts, sidebars, popovers).
  **Clear is only for components over visually rich backgrounds**, and the HIG asks designers to
  decide whether a dimming layer is needed behind clear Liquid Glass to protect contrast.
- **Choose materials by semantic meaning and recommended usage, not by the colour they happen to
  impart** — system settings change a material's appearance, so colour-based selection is unstable.
- **Legibility on materials comes from vibrant foreground colours.** The HIG's failing example is a
  non-vibrant `systemGray3` label on a material: gray labels lose contrast there.
- Opacity trades against context: thicker (more opaque) materials give text and fine features
  better contrast; thinner (more translucent) ones keep a visible reminder of the background
  content, preserving context.

## Vibrancy text tiers (HIG *Materials*, visionOS section)

visionOS "defines three vibrancy values that help you communicate a hierarchy of text, symbols, and
fills": `label` for standard text · `secondaryLabel` for descriptive text like footnotes and
subtitles · `tertiaryLabel` for inactive elements, "and only when text doesn't need high
legibility." S9's semantic colour ladder extends this to four levels per family: labels
(`label→secondaryLabel→tertiaryLabel→quaternaryLabel`), backgrounds
(`systemBackground→secondary→tertiary`), fills (`systemFill→secondary→tertiary→quaternary`), plus
`separator` and `opaqueSeparator`. **The model to copy is the role-based ladder, not the hexes.**

## Reduce-transparency / increase-contrast behaviour (HIG *Materials*, primary)

Liquid Glass variants are not fixed: their appearance can change with system settings — a
user-chosen Liquid Glass look, or the accessibility settings that **reduce transparency** or
**increase contrast**. S9 operationalises this: test with **Increase Contrast** and **Reduce
Transparency**; map `colorSchemeContrast == .increased` to stronger text colours; respect
`accessibilityReduceMotion` by collapsing animation to `.none`.

**Web translation (adopted):**
- `@media (prefers-reduced-transparency: reduce)` → glass becomes solid `rgba(22,33,62,0.96)` with
  `backdrop-filter: none`. MDN marks this query **experimental** with uneven support, so an
  in-product "Reduce glass" setting is also mandatory (S8 §2 recommends a user-facing control).
- `@media (prefers-contrast: more)` and `forced-colors` → drop glass and neo entirely; use 1px
  system borders and full-opacity surfaces; text tiers collapse to two (primary, secondary).
- `@media (prefers-reduced-motion: reduce)` → all motion static/instant.

## Material 3 elevation corroboration (m3.material.io, primary)

Six levels: **level0 0dp · level1 1dp · level2 3dp · level3 6dp · level4 8dp · level5 12dp**. In
dark themes depth is conveyed by **tonal surface difference — lighter surfaces at higher elevation —
plus shadow**, with scrims where extra contrast is needed. This is the mechanism ASW copies: on dark,
**elevation = the surface gets lighter**, which is exactly the computed glass-fill ladder (white/0.04
→ 0.06 → 0.08 → 0.12 as level rises 1 → 2 → 4 → 5). The web has no dp, so levels are expressed as
tonal lightening + shadow, not absolute elevation values.

## ASW elevation ladder (merged)

| Level | Name | Surface treatment (dark) | Text tiers | Use |
|---|---|---|---|---|
| 0 | canvas | `#1A1A2E` flat, no shadow | `#FFFFFF` / `#A3A3B5` | app background |
| 1 | region | `#16213E` flat **or** white/0.04 glass, `border 1px rgba(255,255,255,0.08)` | same | dashboard section, table container |
| 2 | card | white/0.06 fill, `0 2px 8px rgba(0,0,0,0.24)`, radius 12px | same | metric card, list card |
| 3 | control | neo raised (light edge white 6-10% top-left, dark edge black 35-55% bottom-right, blur 12-24px, offset 6-12px), radius 8-12px | per state | buttons, toggles, filter chips |
| 4 | sticky chrome | white/0.08 glass + `blur(16px) saturate(160%)` + `inset 0 1px 0 rgba(255,255,255,0.10-0.22)` | `#FFFFFF` / `#A3A3B5` | nav rail, topbar |
| 5 | overlay | white/0.09-0.12 glass + `blur(24px) saturate(180%) contrast(1.05)` + `0 18px 60px rgba(0,0,0,0.42)`, scrim beneath | `#FFFFFF` / `#E5E5E5` | modal, command palette, popover, tooltip |

Rules: **never skip a level** for a layer that matters (S4's "don't skip levels" applied to
elevation) · **exactly one level-5 surface at a time** · level 3 is the only level with a tactile
pressed state · levels 1-2 must not carry glass when sitting on flat canvas · every level has a
reduce-transparency fallback to the next-lower solid colour · map to M3 tonal levels
0→level0, 1-2→level1/2, 3→level3, 4→level4, 5→level5.

## Sizing, spacing, navigation, motion (S9)

- **8-point grid for all spacing** (8/16/24/32/40/48); bands: tight 8, standard 16, loose 24.
- **Minimum touch target 44×44 pt** (Apple *Design Tips*/*Layout*, primary); WCAG 2.2 SC 2.5.8
  floor is 24×24 CSS px with a spacing exception. Adopted: 44×44 pt on touch surfaces, 24×24 CSS px
  minimum on pointer-dense dashboards.
- **Navigation**: large titles for top-level views, inline for details; **max 2-3 toolbar items**;
  **3-5 tabs maximum**, one-word labels, **never hide or disable tabs**; don't combine tab bar and
  toolbar in one view; hierarchical nav for drill-down, flat for peer destinations.
- **Button hierarchy**: prominent = **one primary action per screen**, bordered = secondary, plain =
  tertiary/links. Verbs for labels. Destructive actions require confirmation.
- **Typography**: Dynamic Type scale largeTitle 34 / title 28 / title2 22 / title3 20 / headline 17
  semibold / body 17 / callout 16 / subheadline 15 / footnote 13 / caption 12 / caption2 11 pt.
  Don'ts: too many sizes, text below 11pt, all caps for long text, disabling Dynamic Type. Line
  spacing 120-145% of font size.
- **Contrast guidance**: normal 4.5:1, large (24pt+) 3:1, UI components 3:1; **"aim for 7:1 for
  critical text"** (contested — 7:1 is WCAG AAA, SC 1.4.6; adopted as an internal target for
  critical numeric data only, AA 4.5:1 remains the floor).
- **Dark mode**: use semantic colours; **don't use pure `#000000` — use `systemBackground`**; don't
  invert colours automatically; don't assume user preference; test both modes.
- **Motion**: keep under ~0.3s; springs for interactive elements; respect Reduce Motion; visual
  feedback for all interactions. S10 adds: motion "explains hierarchy, not decorates"; **no bounce
  unless system-like**; fade, slide and subtle scale only.
- **Colour-blindness**: never rely on colour alone — pair with shape/icon.
- **Empty/error states**: title + explanation + one primary action.

## S10 decision rules (adopted verbatim in spirit)

Do NOT over-design · if something feels unnecessary, remove it · clarity and familiarity are the
highest priorities · when in doubt follow system defaults · **prefer removal over addition**.
Absolute avoid list: over-designed custom components, trendy UI gimmicks or effects, heavy gradients
or neon colours, harsh borders or outlines, dense cluttered information layouts, non-standard
navigation patterns. Per-screen output requirement: state design intent, describe layout structure,
specify typography usage, explain interaction/motion behaviour, justify with platform reasoning —
this is the ASW handoff format.
```

## references/typography.md

```markdown
# Typography for dense B2B dashboards

Sources: S4 wondel `web-typography` v1.5.0 (Jason Santa Maria, *On Web Typography*) · S5 iart-ai
`kinetic-typography` · S11 minimalist-skill §3 · S9 apple-hig-designer typography · S2 anthropics
frontend-design · S1 taste-skill §4.1 · S3-p mcpmarket typography-designer (partial). Digest:
`docs/design/research-digest.md`.

## Core principle

**The "clear goblet"**: "typography should be like a crystal-clear wine glass, keeping focus on the
wine (content), not the glass (type)" (S4). Typography is the voice of the content, decided once and
then shaping every page forever. **The best typography is invisible.**

Two contexts govern every decision (S4): **type for a moment** (headlines, buttons, nav, logos —
personality and impact) versus **type to live with** (body, articles, docs — readability, comfort,
endurance). A dashboard is mostly the second, with a handful of the first (display metrics).

## Scale

**Canonical steps: tokens.css §6 / guide §2** — overline 11 · caption 12 · dense 13 · body 16 ·
body-lg 18 · h4 22 · h3 28 · metric/h2 44 · title 64 · display 76. The research baseline below
(12/13/14/16/20/24/32 on a 16px base, ratio ≈1.2 at the dense end) is the *derivation*; consume the
tokens, never re-derive sizes.

- Modular ratio **1.2-1.5** between levels creates hierarchy without extremes; arbitrary sizes
  create noise (S4 §5-6). Dense dashboards use the low end so more levels fit without shouting.
- **Don't skip levels** — H1→H3 "breaks the reader's mental model" (S4); skipped headings are also
  one of Impeccable's 61 deterministic detector rules (S12).
- **Never below 11px** (S9: "don't make text smaller than 11pt"; caption2 = 11pt is Apple's floor).
- The page must **survive 200% zoom** without overflow or truncation (S4 Quick Diagnostic).
- HIG reference ladder for proportion sanity: largeTitle 34 / title 28 / title2 22 / title3 20 /
  headline 17 semibold / body 17 / callout 16 / subheadline 15 / footnote 13 / caption 12 /
  caption2 11 pt (S9). ASW shifts down one step because **dashboard body is 14px, not 17px**.
- S4's **16px body minimum is scoped to reading-heavy body text**; 14px for dashboard rows and
  labels is a deliberate density decision. **Help, prose, empty-state and onboarding surfaces stay
  ≥16px** (18px where reading-heavy). Mobile body never drops below desktop body.

## Weights — three, by owner cap (G8)

| Weight | Role |
|---|---|
| 400 | body, body-sm, dense table cells, caption |
| 700 | h3, h4, overline, UI emphasis, button labels, chart titles |
| 800 | display, title, h2, metric values |

Inter ships **400/700/800 only** (guide §2, tokens.css): three faces, smaller payload, and hierarchy
carried by size, space and tracking rather than weight count. Mapping from the earlier four-weight
draft: 500 → 400, 600 → 700, 900 → 800.

**Three levers — size, weight, colour: vary one or two between adjacent levels, never all three**
(S4 §6). Hierarchy comes from weight and colour, not raw scale — "no oversized H1s that just
scream" (S1 §9.B). The explicit dashboard pattern from S4: **bold bright values, regular muted
labels** (its light-mode example is bold `#111` values with regular `#666` labels; inverted for ASW
dark as bold `#FFFFFF` values with regular `#A3A3B5` labels).

## Tracking

- **Display tightens −0.02em to −0.04em** at line-height 1.1 (S11 §3). S5 states the same as
  "tighten display by −1% to −3%, e.g. `letter-spacing: -0.02em`".
- **Body and data stay at 0.**
- **Small uppercase labels widen to +0.05em** at `text-xs` (S11 §5 tags/badges spec).
- **All caps banned for long text** (S9) and as a default tell (S2 names "using all caps for
  labels" among the commonest tells of a generated page). Tracked ALL-CAPS eyebrows are rationed to
  ≤1 per 3 sections (S1 §4.7).
- **Italic descender clearance** (S1 §4.1): italic display type containing `y g j p q` clips at
  `leading-none` — use `leading-[1.1]` minimum plus `pb-1` reserve.
- Emphasis inside a headline uses **italic or bold of the same family**, never a mixed-family word
  (S1 emphasis rule); accenting a single word in a different colour or style is a named AI tell (S2).

## Line-height by context (S4 §3/§5, S11 §2)

| Context | Line-height |
|---|---|
| Display / hero | 1.1-1.25 (S11 uses 1.1) |
| Data cells, table rows, dense labels | **1.45** (guide §2 `dense` step; S4: tighter leading for dense data) |
| UI text | 1.35-1.4 |
| Prose, help, descriptions | 1.5-1.7 (S11 mandates **1.6** for body) |

The apparent 1.6-vs-1.45 conflict is resolved **by context, not by picking one**: prose 1.6, data
1.45. Headings get **more space above than below** (`margin: 1.5em 0 0.5em`) — but excess space above
a heading breaks its association with the content it introduces (S4 Common Mistakes).

## Measure

**45-75 characters, 66 optimal** (S4 §2/§5); S2 independently sets a floor of **<80 characters**,
with serif body allowed slightly longer lines. Enforce with `ch` units or `max-width` —
`max-width: 65ch` on prose containers. Beyond 75ch "the eye loses the return sweep".

Dashboard data cells are **exempt from measure** but not from accessible truncation: truncate with
an accessible full value (`title` + `aria-label`, or expand-on-focus) — **never hover-only**, since
hover excludes keyboard and touch users (S6 named mistake).

Saccade mechanics behind the numbers (S4 §1): eyes jump in 7-9 character bursts; dense or poorly
spaced text slows fixations; experienced readers recognize word shapes (bouma), not letters.
**Legibility** (can characters be distinguished — a typeface concern) differs from **readability**
(can text be read comfortably for extended periods — a typography concern of size, spacing, line
length): "a legible typeface can still be set unreadably."

## Families

**Two maximum, clearly distinct** (S2, S4 §4). Pairings need **structural contrast** — serif+sans,
light+bold, humanist+geometric, condensed+normal — not similarity; "faces that are too similar
create tension without purpose."

- **One sans for all UI and data**, chosen for properties, not name: **tabular figures** (mandatory
  for data columns), **open counters and apertures** (`a e c`), **distinct `Il1` and `O0` and
  `rn` vs `m`**, **generous x-height** (better screen readability), even colour across text blocks,
  consistent stroke weights, good kerning pairs (AV, To, Ty), complete character set, and the
  weights you actually need (S4 §2 technical/structural criteria). S4 names Inter and IBM Plex Sans
  for data-rich UIs — but S1, S11 and S12 all discourage Inter as an *unexamined default*, so **the
  requirement is the property; the family is a brand decision owned by a human** (S14: taste is
  explicitly human).
- **One monospace** for numerals at cockpit density (S1 §7: "Mandatory: `font-mono` for all
  numbers"), `<kbd>` keystrokes rendered as physical keys, IDs, coordinates and metadata (S11 §3).
- **Serif is never for dashboards** (S1 §4.1 "serif discipline"; §9.B "Serif for editorial/luxury/
  publication. Not for dashboards"). Permitted only where the brand brief literally names a serif, or
  on editorial/marketing surfaces with a stated reason. `Fraunces` and `Instrument Serif` are
  specifically banned as defaults.
- **Verify the web licence before shipping** — desktop/print licences rarely cover web embedding
  (S4 ethical boundary). Test with **real content**, never lorem ipsum: dummy text hides character
  frequency, word length and paragraph rhythm problems (S4, S11).

## Loading & performance

- **Total font payload <200KB**; prefer WOFF2; the owner cap ships exactly three static weights
  (400/700/800), so a variable font is unnecessary here and would only add payload (S4 §7). Subset per
  language, but **don't optimize users out** — never drop characters non-English
  readers need or the italic/bold weights needed for emphasis.
- `font-display: swap` shows fallback text immediately (no FOIT); **preload the critical face**;
  **system fallbacks in every `font-family`** (S4 Quick Diagnostic).
- Self-host via `next/font` — **never link Google Fonts via `<link>` in production** (S1 §3.A).
- Fluid sizing with `clamp(min, preferred, max)` eliminates breakpoint jumps (S4 §7).
- **CLS <0.1**: reserve space for text blocks; **split or animate only after
  `document.fonts.ready`** or line breaks are computed wrong (S5 §8).

## Dashboard specifics

| Element | Spec |
|---|---|
| Table header | 12px/400 caption (+0.010em) **or** 11px/700 overline uppercase — pick one, apply everywhere |
| Table row text | 13px/400 dense, line-height 1.45 (guide §2) |
| Numerals | tabular figures, right-aligned; monospace at cockpit density |
| Deltas | colour-coded **plus** glyph-coded (↑ ↓), never hue alone |
| Card title | `--text-h4` 22px/700 max inside bento cards (h3 28px reserved for hero tiles/panel headers) |
| Section title | `--text-h3` 28px/700 |
| Display metric | `--text-metric` 800; 32px cap inside tiles ≤1/3 width, 44px only in hero tiles, tracking −0.010em |
| Labels | muted (`#A3A3B5`), values bright (`#FFFFFF`) |
| Empty state | one icon or none, a 20px title, one line of direction, one primary action |
| Link | distinct by colour **and** underline (SC 1.4.1); never blue-500-as-text on dark — use `#93C5FD` |

**Scoring rubric** (S4): 10-point Quick Diagnostic. 9-10 = body 16px+ (prose surfaces), measure
under 75ch, line-height 1.4+, clear level contrast, payload under 200KB, fallbacks set, survives
200% zoom. ≤3 = sub-16px body, no measure cap, FOIT, or unreadable hierarchy. Always state the
current score and the specific failing rows.

## Motion on type (S5) — dashboards use almost none of this

**"Motion cannot rescue bad type."** Lock size, leading, tracking, alignment and weight **first**.

- Split granularity carries tone: **by line = calmest, most premium**; by word = energetic; by
  character = playful, reserved for short strings. **For a B2B dashboard: line-level at most, on one
  moment only.**
- Timing canon: enter ease-out `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutExpo); per-fragment
  **400-600ms**; stagger lines 60-100ms, words 40-70ms, chars 20-40ms; **cap total reveal ~800ms**.
  Dashboard override (see REVALIDATION R16): state transitions and feedback ≤200-300ms; the 600ms
  cinematic entry is reserved for marketing surfaces and first load.
- **Mask/clip reveal is the robust default** (`overflow:hidden` + `translateY(110%)→0`): no blur
  artifacts, GPU-cheap. **Blur-in is costlier** — and blur is already the most expensive effect in a
  glass-heavy dark UI, so **never stack animated `filter: blur()` on `backdrop-filter`**.
- **Accessibility of split text**: per-character spans destroy screen-reader text and copy-paste →
  `aria-label` on the container with the full string, `aria-hidden="true"` on the fragments.
- Animate **`font-variation-settings`**, not `font-weight`, to interpolate smoothly and reach
  non-standard axis values; **confirm the loaded face is actually variable and the axis range
  exists**, or values clamp silently.
- Verify by **freezing frames** (`?t=N` harness), screenshot start/mid/end, and check clipped
  glyphs and descenders, masks that don't fully hide the baseline, FOUC, wrong line breaks before
  fonts load, blur fringing. `prefers-reduced-motion` shows text in its final state with no motion.

## Common mistakes → fixes (S4)

Text feels cramped → raise line-height to 1.6+ (prose) and add paragraph spacing · lines too long →
`max-width: 65ch` · headings look disconnected → reduce space above, keep space below · text looks
blurry → check font-smoothing, try a different weight, increase size · fonts load slowly → subset,
`font-display: swap`, preload · body too small → increase (phones are held farther than assumed) ·
hierarchy unclear → increase size/weight differences · typefaces clash → one family or ensure
structural contrast · lorem ipsum testing → test with real representative content.
```

## references/ux-laws.md

```markdown
# Laws of UX applied to ASW dashboards

Sources: S7 lawsofux.com (primary listing pages for each law) · S6 wondel `ux-heuristics` (Krug +
Nielsen) · S1 taste-skill layout discipline. Digest: `docs/design/research-digest.md`.

## The laws, paraphrased (lawsofux.com is CC-BY-NC-ND: its phrasing is not redistributable in derived works), with the ASW dashboard decision each drives

**Hick's Law** — decision time rises with both the number and the complexity of the choices on
offer (lawsofux.com). Its guidance: cut choices where response time matters, split complex tasks
into steps, surface a recommended option instead of a flat list, onboard progressively — but stop
short of simplifying until the expert's path disappears.
→ *ASW*: filter bar shows sensible defaults plus **one recommended preset**, advanced filters behind
progressive disclosure; **≤7 visible choices per decision point**; the recommended option is
visually highlighted; the expert path (raw filter builder, saved searches, bulk actions) is never
removed — simplifying it away would be abstraction, not clarity.

**Fitts's Law** — the time to reach a target grows with distance and shrinks with target size
(lawsofux.com). Its guidance: make targets big enough to hit confidently, space them generously,
and place them where the hand or pointer already is; keep the gap between the user's attention and
the control that serves it as small as possible.
→ *ASW*: **row actions live inside the row**, not in a distant toolbar; primary action adjacent to
the data it acts on; targets ≥24×24 CSS px (WCAG 2.2 SC 2.5.8) and 44×44 pt on touch (Apple);
ample spacing between adjacent targets so 24px circles don't intersect; sticky action bar within
pointer/thumb reach on long tables.

**Jakob's Law** — people arrive carrying the habits of every other product they use, and they
prefer yours to behave the way those already do (lawsofux.com). Its guidance: reuse familiar
mental models so effort goes to the task, not to learning; and when you must change established
behaviour, let users keep the familiar version for a limited transition window.
→ *ASW*: conventional placement is not creative budget — **nav left, search top, filters above the
table, pagination bottom-right**. For the revamp specifically: **ship a temporary "classic view"
toggle** so analysts keep working while they adapt. Novel navigation costs users relearning and buys
nothing.

**Miller's Law** — working memory holds roughly seven items, plus or minus two (lawsofux.com).
Its guidance: chunk content into small groups, and treat the number as a warning about overload —
not as permission to cap a feature arbitrarily — because real capacity varies with prior knowledge
and situation. (Its own further reading cites Cowan, *The Magical Mystery Four*, whose modern
estimate is ~4 chunks for novel items — see REVALIDATION R14.)
→ *ASW*: chunk table columns into headed groups; **4-6 KPI tiles per row for novel comparisons,
7±2 only for familiar/chunked sets** (nav destinations, column groups); long forms chunked into
labeled fieldsets; never invoke 7±2 to justify leaving 9 filters visible.

**Law of Prägnanz (Gestalt)** — ambiguous or complex visuals are read as the simplest available
interpretation, because that reading costs the least effort (lawsofux.com). Its guidance: the eye
prefers order because order prevents overwhelm; simple figures are processed and remembered better;
complex shapes get collapsed into one unified shape whether you intended it or not.
→ *ASW*: simplest form wins — no ambiguous half-bordered groupings, no overlapping card/region
boundaries, no chart chrome the eye must resolve before it can read the data.

**Law of Common Region** — elements enclosed in one shared area with a clear boundary are read as a
group (lawsofux.com). Its guidance: a region is the cheapest structure signal — a border around the
group or a shared background behind it both create it.
→ *ASW*: **a card must mean a region.** A card around one ungrouped element, or a card inside a
card, is noise. Boundary can be a 1px border *or* a level-1/2 background fill — not both plus glass.

**Law of Proximity** — elements placed near each other are read as related (lawsofux.com). Its
guidance: distance is a relationship statement; close elements are assumed to share function, and
grouping by spacing lets people organise information faster.
→ *ASW*: related fields closer than unrelated ones; a metric's label, value and delta form one
tight cluster; whitespace between data groups does the grouping work that borders would otherwise
do (S4's dashboard guidance: "whitespace between data groups").

**Peak-End Rule** — an experience is judged by its most intense moment and by how it ended, not by
the average of it (lawsofux.com). Its guidance: design the peaks and the final moments on purpose;
identify where the product is most valuable; and remember that bad moments are recalled more vividly
than good ones.
→ *ASW*: two moments get deliberate design — the **end** (export/report completion, save
confirmation: clear completion state, no dead end, the action keeps its name through the flow) and
the **peak** (the worst-case large route-data query: progress, not a spinner; a tolerable wait with
visible movement). A negative peak here is a silent multi-second freeze.

**Von Restorff Effect (Isolation Effect)** — among similar items, the one that differs is the one
that gets remembered (lawsofux.com). Its guidance: make the important item distinctive; ration
emphasis, because competing highlights cancel each other and salient blocks start reading as
advertising; and never carry the distinction by colour alone (colour-vision and low-vision users)
or by motion alone (motion-sensitive users).
→ *ASW*: **exactly one isolated element per view** (the primary metric or the primary CTA). With two
warm accents in the brand this law is decisive: Gold (8.42:1) and Amber (8.44:1) are near-identical
in role — **one accent per view earns the effect, two cancel it.** Emphasis always pairs colour with
a glyph or shape, and never uses motion as the sole differentiator.

**Zeigarnik Effect** — unfinished or interrupted tasks stay in memory better than completed ones
(lawsofux.com). Its guidance: signpost that more content exists, show real progress toward a goal,
and always indicate how far along the user is.
→ *ASW*: profile-completeness and onboarding meters, saved-search setup progress, and
"+12 more routes" signifiers instead of silent truncation. These are legitimate information design,
not gamification — the incompleteness is real.

**Doherty Threshold** — productivity holds while system and user keep pace with each other, which
the original research puts under about 400ms of response (lawsofux.com; Doherty & Thadani, IBM
Systems Journal 1982, replacing the earlier 2-second standard). Its guidance: feedback inside that
budget, perceived-performance techniques while work continues, progress indication that makes waits
tolerable even when imprecise, and — used honestly — a deliberate pause can signal value.
→ *ASW*: optimistic UI for filters and toggles; **skeleton within 400ms**; progress indication for
long route-data queries; never a blank region while loading. The 400ms budget is the design
constraint, not an aspiration.

Also relevant from the same listing: **Aesthetic-Usability Effect** (pleasing design is perceived as
more usable — the warrant for investing in the elevation ladder rather than shipping raw tables) ·
**Choice Overload** (Hick's companion) · **Cognitive Load** · **Goal-Gradient Effect** (motivation
rises near the goal — pairs with Zeigarnik for progress meters) · **Serial Position Effect** (first
and last items are best remembered — put the primary KPI first and the primary action last) ·
**Tesler's Law / Conservation of Complexity** (some complexity cannot be removed, only moved — the
Apple TV Remote example moves it from the device to the interface; ASW's equivalent is moving
route-analysis complexity into sensible defaults plus progressive disclosure) · **Occam's Razor** ·
**Pareto Principle** · **Postel's Law** (be liberal in what you accept — tolerant input parsing for
airport codes and date formats) · **Paradox of the Active User** (users never read manuals, they
start immediately → the empty state and inline hints are the documentation).

## Nielsen's 10 heuristics, dashboard-critical (S6)

1. **Visibility of system status** — timely feedback for every action; "Saving…" → "Saved";
   skeleton screens for loading; **silent failures destroy trust**.
2. **Match between system and real world** — users' language ("Sign in" not "Authenticate");
   natural ordering (airport → city → country, not internal codes first).
3. **User control and freedom** — clear emergency exits; **undo beats "Are you sure?"** because users
   click through confirmations unread; back buttons must never break; never hijack browser history.
4. **Consistency and standards** — same words, styles and behaviours mean the same thing; internal
   plus external consistency; **one term per concept** ("Routes" everywhere, never mixed with
   "Segments" or "Pairs").
5. **Error prevention** — constrained inputs (date pickers over text fields, airport-code
   autocomplete), sensible defaults, unsaved-changes warnings; slips and mistakes need different
   prevention.
6. **Recognition rather than recall** — breadcrumbs, recent searches, prefilled fields, decoded
   dropdown values, **direct data labels instead of legends**.
7. **Flexibility and efficiency of use** — keyboard shortcuts, bulk actions, saved searches, a
   **Cmd+K command palette**; progressive disclosure keeps it simple for beginners while experts get
   full power.
8. **Aesthetic and minimalist design** — **every element must earn its place; when everything
   screams for attention, nothing stands out; one primary CTA per page.**
9. **Help users recognize, diagnose and recover from errors** — three parts: what happened, why, and
   how to fix it; plain language ("Connection failed" not "ECONNREFUSED"); specific ("Password must
   be 8+ characters" not "Invalid"); never blame the user; **preserve their input**.
10. **Help and documentation** — searchable, task-focused ("How to…"), contextual (tooltips, inline
    hints, guided tours).

**Krug's four** (S6): *Don't Make Me Think* (every question mark is cognitive load; clever names
lose to clear names) · *It doesn't matter how many clicks* (click **quality** matters — painless,
obvious, confidence-building; three mindless clicks beat one deliberated click; **never bury
cancellation in extra steps**) · *Get rid of half the words* (then half again; brevity must not omit
critical disclosures) · *The Trunk Test* (any page instantly answers: what site, what page, what are
the major sections, what are my options here, where am I in the hierarchy, where is search —
operationally: page title matches the clicked link, a **"you are here" indicator** exists, section
headings orient).

**Heuristic conflicts, resolved** (S6): simplicity vs flexibility → progressive disclosure;
consistency vs context → consistent patterns, contextual prominence; efficiency vs error prevention →
prefer undo over confirmation dialogs; discoverability vs minimalism → primary actions visible,
secondary hidden.

**Severity scale 0-4** weighted by frequency × impact × persistence: 0 not a problem (disagreement)
· 1 cosmetic (fix if time) · 2 minor, causes delay or frustration (schedule) · 3 major, significant
task failure (fix soon) · 4 catastrophic, prevents task completion (fix immediately). Output a
ranked triage list, never a general opinion. **Heuristic evaluation is a cheap pre-filter, not a
substitute for user testing** — it cannot tell you whether people want the feature or why they gave
up.

## S6 named mistakes that map directly onto this revamp

**Mystery-meat navigation** (icons without labels → the nav-rail risk) · too many choices (reduce to
7±2) · **no "you are here" indicator** · no inline validation (validate on blur with specific
messages) · marking required instead of optional · wall of text · jargon labels · **no loading
indicators** (users think the system is broken) · **tiny tap targets (min 44×44px)** · **hover-only
information** (mobile and keyboard users miss it — the dense-dashboard tooltip risk) · no undo ·
"Invalid input" errors · **low contrast text (WCAG AA 4.5:1 minimum)** · inconsistent nav location ·
broken back button.

Dark patterns to refuse (S6): forced continuity (hard to cancel), roach motel (easy in, hard out),
confirmshaming (guilt-based options), hidden costs (surprise fees at checkout).
```

## references/trends-2026.md

```markdown
# 2026 experience-design trends → ASW applicability

Source: S8 Joe Smiley, "The most popular experience design trends of 2026", UX Collective
(uxdesign.cc), 2026-01-26, 22 min read; author is Design Director @ Microsoft. Digest:
`docs/design/research-digest.md`.

Nine trends predicted. Four transfer to a B2B aviation dashboard; three are consumer trends whose only
transferable residue is *calm confidence*; two are warnings.

## Trend 5 — Return of glassmorphism (directly load-bearing)

The author's position: glassmorphism has returned, but as a matured functional layer rather than the
flashy visual trend it was dismissed as — one that borrows skeuomorphism's interest in realism and
neumorphism's experiments with subtle depth. That framing is the warrant for ASW's three-language
combination: glass and neo are presented as *lineages of the same 2026 layer*, not competing styles.

His mechanics for the 2026 version: it behaves as a functional design layer whose parameters are
finally controllable in tooling — specifically **opacity, background blur radius, and elevation**,
i.e. how much of the environment bleeds through and how fast it diffuses. → These three dials are
exactly the parameters tabulated in `glass-neo.md`.

Apple is cited as leading the shift (Liquid Glass), turning glassmorphism into a dynamic system
rather than a static style, made practical by modern blur APIs, standardised system styles and
better cross-device performance.

**Accessibility issues, named explicitly by the author** (he sides with the critics): readability
becomes inconsistent — text ends up too light, too dark, or washed out entirely — and a busy
background image makes every case worse. His three recommendations:

1. Keep contrast high for text and essential features so the result stays inside WCAG-safe ratios.
2. Ship an in-product opacity/transparency control so users can reduce or disable glass effects
   themselves.
3. Test the surfaces against real backgrounds, in motion, in both light and dark modes.

→ Adopted: the computed contrast tables (not vibes) decide every glass token; the in-product
**"Reduce glass" setting is mandatory** because `prefers-reduced-transparency` is experimental with
uneven support; glass/neo verification happens over real scrolling route-map and table content, in
motion, at 200% zoom, in both themes.

## Trend 3 — Machine Experience (MX) design for generative AI

His argument: generative systems cannot run on visual signals alone; they need component
*meaning*. Citing Figma's guidance, he prescribes three practices: **component documentation**
(descriptions and metadata explaining *why* a component exists and *when* to use it, not just how
it looks); **semantic tokens** (a **role** like `button-primary-background` rather than a literal
value like `blue-500`, so the machine reads intent); **relationship mapping** (explicitly link a
form label to its input so an agent interprets the requested data correctly).

Why it matters commercially: customers ask ChatGPT/Gemini/Perplexity to "find the best" or "compare
options", and those agents interpret the site structurally. Citing Mike Simpson's research, he
notes AI systems depend on **semantic HTML, clear heading hierarchy, predictable patterns and
consistent labeling** to infer relevance — messy signals get misread or dropped. His conclusion:
machine experience is not a niche technical layer but the new cost of being visible.

→ *ASW*: semantic role tokens throughout (three independent sources converge — S8, S9's Apple semantic
ladders, S12's `DESIGN.md`); **no skipped heading levels** (also an Impeccable detector rule); real
`<label for>` associations and `aria-describedby` for helper and error text; predictable component
naming so the portal is machine-readable as well as analyst-readable.

## Trend 2 — Designing for intent

His definition: design that recognises, respects and responds to what the user is actually trying
to accomplish — not what the product wants them to do, not what features exist, not what the system
assumes. The shift is from designing interfaces to designing **outcomes**: instead of specifying
every funnel step, design the conditions the system uses to decide what to show, what to emphasise
and how to adapt.

Four intent types: **informational** (seeking knowledge), **navigational** (seeking a destination),
**commercial** (consideration phase), **transactional** (completing a transaction). Intent surfaces
explicitly (a question, prompt or choice) or implicitly through behavior — the Google PAIR guidebook
distinction.

His measurement shift: judge success by how users behave — do they move forward, stay engaged and
accomplish what they came for — rather than by how a screen compares to the old one. Optimization
targets become features → flows of understanding, layout → logic, aesthetics → intent.

→ *ASW*: the analyst's intent is **informational → transactional** — "which airport pairs are
under-served" then "save this filter set / export this analysis". Removal criterion 2 in
`minimalism.md` operationalises this: **does it change a decision the user makes?** A metric that never
alters an action is decoration.

## Trend 6 — AI-generated design systems (a warning, adopted as discipline)

His warning: design systems are not component libraries, they are **records of decisions** —
encoded taste, tradeoffs and hard-won context about users, technology and the business. A system
generated instantly skips the conversations that make a system useful, yielding consistency without
conviction; teams that treat generation as a shortcut get work that looks polished but is brittle,
working right up until something unusual happens, which is most real products. His verdict:
generated systems are powerful starting points, but used poorly they replace thinking with output.

→ *ASW*: this skill and the digest are the **record of decisions with rationale and citations**,
including the contested ones (R13, R14, R16, R17, R18) with the adopted value stated. A token without
a reason is not a decision. His Motiff findings are also relevant to maintenance: AI scanning real
files to inventory reusable elements, report usage counts and flag mismatches — a consistency
*checker*, with the human deciding what to include and how to build.

## Trend 9 — Design maturity takes a step backwards (the governing warning)

His claim: AI introduces speed and ambiguity most organisations are structurally unprepared to
absorb — output rises while thoughtfulness stops being rewarded. The mechanism: when everything is
generable instantly, teams **skip framing, research and exploration**, the very practices that
define mature design organisations. Symptoms: juniors lean on prompts instead of judgment; seniors
get pulled into production firefighting; craft becomes optional rather than intentional; design
systems get bypassed, standards relax, and consistency gives way to velocity. His conclusion: the
most mature teams will not be the ones using the most AI, but the ones disciplined enough to slow
down, think deeply and use AI deliberately.

Design maturity is two pillars: the level of Design Thinking knowledge across *every* employee, and how
well Design Thinking is integrated into how the organization operates and decides (he uses InVision's
5-level model from *The New Design Frontier*, surveying 2,200+ companies).

→ *ASW*: the counter-measure is a **process gate, not more output** — the Kaidera SDLC loop in
`sdlc.md`. Phases 0-1 of the critique protocol exist precisely to keep framing and research from being
skipped.

## Trend 8 — Designing better prompts (the four-question intake)

His prompt-design checklist, adapted as ASW's design-brief intake: **1. Who is it for?** (audience and
prior knowledge; likely emotional state — curious, anxious, rushed; how the output should "sound").
**2. What's the intent?** (problem being solved; is this surface even the right medium; the specific
outcome; one answer or several to compare). **3. What are the boundaries?** (facts that must be correct
and cited; legal, ethical, accessibility constraints baked in; what to explicitly avoid).
**4. How will you verify?** (steps to check output against real user needs; who reviews before it goes
live).

His complaint about generic AI output — that prompt shortcuts produce volume without thinking and
a flood of interchangeable results — is the same anti-slop problem S1, S2 and S12 attack; questions
3-4 turn it into a gate.

## Consumer trends: what transfers and what doesn't

**Trend 1 Multimodal experiences** (voice, vision, touch/haptics, context and sensors, with the
screen no longer the sole focal point) — his principles: don't make all modes equal (pick the best
mode for the moment); design seamless mode switching; **always design a fallback**, because each
mode has an environment where it fails (voice in noise, gestures in low light, screens when hands
are busy); feedback must be audible, haptic or temporal; allow personalization. → For ASW the
transferable part is the **fallback rule**: every interaction path needs a non-hover, non-pointer
equivalent — the same conclusion S6 reaches from usability (hover-only information is missed by
mobile and keyboard users).

**Trend 4 Nostalgia** — familiarity becomes a feature when everything else changes fast; his point
is borrowing the past's **emotional clarity** rather than copying its look — older interfaces were
simpler with clearer intentions. It manifests as familiar UI patterns, typography echoing early
software, quiet skeuomorphic cues returning, and micro-interactions that feel **tactile** instead of
abstract; his observation is that familiar things make people relax, explore more and forgive more.
→ *ASW*: the emotional warrant for **Jakob's Law** conformity and for neumorphism's tactile pressed
state. Adopted narrowly: tactile micro-interactions and familiar patterns yes; retro styling no.

**Trend 7 Emotionally aware modes** (Morning/Focus/Evening/Reflective modes mapped to Don Norman's
visceral/behavioral/reflective levels; his framing is designing **systems of feeling**, giving users
control rather than only automation, and being transparent about emotional sensing) → **Not adopted
for ASW.** An interface that changes vibe by time of day is wrong for a B2B analysis tool where
consistency *is* the product. The transferable residue is Norman's point that emotion directly
affects cognition, problem solving and trust — i.e. **calm confidence**: predictable patterns,
low-noise chrome, no attention-seeking motion. The author's own Focus Mode description (low
contrast, minimal animation, calm rhythm) is what a good analyst dashboard should be *all the time*.

## Net position for ASW

Glass returns as a **functional layer** with three tunable parameters and named accessibility failures;
semantics become the cost of visibility; intent replaces funnel design as the unit of work; generated
systems are brittle without recorded decisions; and maturity regresses unless the process is gated. All
five map onto rules already in this skill — glass-neo parameters and fallbacks, semantic role tokens,
the "does it change a decision" removal criterion, citations-plus-rationale, and the SDLC process gate.
```

## references/impeccable.md

```markdown
# Impeccable — detector rules, command vocabulary, evidence standard

Source: S12 pbakaus/impeccable README (Apache-2.0; "1 skill, 23 commands, live browser iteration, and
61 deterministic detector rules for AI-generated frontend design"). Impeccable started from Anthropic's
`frontend-design` skill (S2) and adds setup, vocabulary and deterministic detection. Digest:
`docs/design/research-digest.md`.

## Why it exists (verbatim problem statement)

"Every model trained on the same SaaS templates. Skip the guidance and you get the same handful of
tells on every project: **Inter for everything, purple-to-blue gradients, cards nested in cards, gray
text on colored backgrounds, the rounded-square icon tile above every heading.**"

→ *ASW relevance*: three of the five are live risks in a dashboard revamp (Inter-by-default, cards
nested in cards, gray text on coloured backgrounds). The icon-tile-above-every-heading tell maps onto
the tracked-eyebrow tell S1 calls "the #1 violated rule in production tests".

## Setup: separate product truth from visual direction

`/impeccable init` "records durable product truth in `PRODUCT.md`, so later commands know the
**audience, purpose, operating context, constraints, voice, and evidence** without confusing those facts
with surface-level visual direction." Visual direction and the incumbent or newly built visual system
are recorded separately in `DESIGN.md`.

→ *ASW adoption*: two documents, not one. The aviation brand brief, audience (network-planning analysts,
route-development managers) and evidence live as product truth; the glass/neo/minimalism direction,
palette and tokens live as visual direction. Confusing them is how a brand decision gets silently
re-litigated as a styling preference.

## Command vocabulary — shared design words instead of adjectives

| Command | What it does | ASW use |
|---|---|---|
| `shape` | Plan UX/UI **before** writing code | Phase 1 of the critique protocol |
| `critique` | UX design review: hierarchy, clarity, emotional resonance | Phase 3 |
| `audit` | Technical quality checks (a11y, performance, responsive) | Phase 4 |
| `polish` | Final pass, design-system alignment, shipping readiness | Phase 4, pre-handoff |
| `distill` | **Strip to essence** | The minimalism removal criteria, as a verb |
| `quieter` / `bolder` | Tone down / amplify | Ornament-ceiling adjustments |
| `typeset` | Fix font choices, hierarchy, sizing | `typography.md` rules |
| `layout` | Fix layout, spacing, visual rhythm | 8pt grid, card hierarchy |
| `colorize` | Introduce strategic colour | Teal-chrome / accent-is-data-viz split |
| `animate` | Add purposeful motion | MOTION 2; motion must be motivated |
| `harden` | Error handling, i18n, **text overflow**, edge cases | State matrices; accessible truncation |
| `onboard` | First-run flows, empty states, activation paths | Empty states, Zeigarnik progress |
| `clarify` | Improve unclear UX copy | Krug "get rid of half the words" |
| `adapt` | Adapt for different devices | Explicit `<768px` collapse |
| `optimize` | Performance improvements | CLS/LCP/INP, font payload |
| `document` / `extract` | Generate DESIGN.md from code / pull reusable components and tokens into the design system | Token governance |
| `craft` | Full shape-then-build flow with visual iteration | Whole-feature work |
| `delight` / `overdrive` / `live` / `pin` | Joy moments / extraordinary effects / browser variant iteration / standalone shortcuts | **Not used for ASW dashboards** — `overdrive` and most `delight` conflict with MOTION 2 and the ornament ceiling |

Commands accept a target: `/impeccable audit blog`, `/impeccable polish the checkout form`.

## The 61 deterministic detector rules

Two families: **AI slop** (side-tab borders, purple gradients, **bounce easing**, **dark glows**) and
**general design quality** (**line length**, **cramped padding**, **small touch targets**, **skipped
headings**, and more).

Mechanics worth copying even without the tool: exit `0` = completed without primary findings, `2` =
completed **with** primary findings, `1` = at least one target could not be scanned (operational
failure takes precedence). `--json` for CI. URL scans inspect rendered DOM, computed layout and
accessible linked stylesheets. Inline waivers travel with the file:
`<!-- impeccable-disable overused-font: exported brand doc -->` (whole file), plus `-line` /
`-next-line` variants; bypassed by `--no-inline-ignores` / `--no-config`. Repo-level waivers require a
reason: `ignores add-value overused-font Inter --reason "Brand font"`.

→ *ASW*: four rules are directly checkable here — line length (measure 45-75ch), cramped padding (8pt
grid, 24-40px card padding), small touch targets (24×24 CSS px / 44×44 pt, and the §H.2 pill guard),
skipped headings. **"Dark glows" is a detector hit that the house style deliberately overrides** — the
§H.3 glow is hue-tinted at ≤0.36 alpha and computes below 3:1, so it is not the neon glow the rule
targets; if the detector flags it, the waiver carries that reason. Bounce easing is banned outright
here, so it is a review finding rather than detector output. **A waiver must carry a reason** — that
discipline is adopted for any deviation from this skill.

## The evidence standard (adopted verbatim)

> "**A clean detector run is evidence, not proof of visual or accessibility quality**: it does not
> replace inspecting the rendered experience across relevant viewports."

This is the same standard the SDLC sets from the other direction ("verification is output that can
fail… a green suite is not evidence of behaviour"). Combined ASW rule: **run the deterministic checks,
then look at the rendered surface across viewports** — desktop, laptop, tablet, mobile, 200% zoom, both
transparency preferences, reduced motion, **both themes** — and commit the screenshots as evidence.

## Anti-patterns (explicit guidance on what to avoid)

Don't use overused fonts (Arial, Inter, system defaults) · **don't use gray text on colored
backgrounds** · **don't use pure black/gray (always tint)** · **don't wrap everything in cards or nest
cards inside cards** · **don't use bounce/elastic easing (feels dated)**.

Cross-checks: "always tint" is independently confirmed by S1 ("no pure `#000000`… pure values kill
depth"), S9 ("don't use pure black — use `systemBackground`") and S11 (body text never absolute black)
— and by computation: neumorphism is not implementable on a pure-black canvas because the darkest
useful neo shadow reaches only **1.08:1** against `#000000`. "Gray text on colored backgrounds" is the
exact failure computed in `palettes.md`: `#8B8B9E` passes on canvas (5.10:1) but fails on a composited
glass panel (3.54:1); and the light-theme slate `#626F77` passes on white (5.17:1) but fails on the
raised card (3.49:1).

## Build path is a recorded choice, not a default

Impeccable records `buildPath` as either `comp` (generate a full-fidelity comp first, then build to
match — "composes bolder and takes longer") or `code` (build straight in code with the ambition written
into a **development-only direction contract** in the surface brief and "checked at the finish" —
"leaner and faster"). The choice is a default rather than a lock: every decision page carries a footer
toggle that binds that session only.

→ *ASW*: for a revamp of existing surfaces, **code-first with a written direction contract per
surface** is the fit — the ambition for each screen is stated up front and checked at the finish, which
is what Phase 4 of the critique protocol does. Comp-first is reserved for genuinely new surfaces (a new
route-analysis view) where composition risk is higher.

## Artifact hygiene

Shared artifacts are **tracked**: unified config, live-mode framework wiring, the shared design spec
(`design.json`), **`surfaces/*.md`** (route- or artifact-specific strategy and direction contracts) and
**`critique/*.md`** (review reports). Ephemeral artifacts are gitignored: screenshots, session and
preview state, runtime caches, per-developer config. The ignore block is wrapped in markers so it can be
recognised and refreshed, and patterns are deliberately **unanchored** because in a monorepo the active
project often lives under a nested workspace path.

→ *ASW*: **critique reports and per-surface direction contracts are committed artifacts, not chat** —
exactly the SDLC's "artifacts, not chat" non-negotiable. Screenshots taken as verification evidence are
committed to the review artifact (they are the receipt), while incidental iteration screenshots stay out
of git.
```

## references/design-critique.md

```markdown
# Design critique — running and receiving it

Sources: S13 slb2248/ai-ux-skills `design-critique/SKILL.md` · S14 Kaidera SDLC review/verify gates ·
S2 Anthropic self-critique pass · S12 Impeccable command vocabulary · S6 severity scale. Digest:
`docs/design/research-digest.md`.

The merged protocol below is ordered — **each phase gates the next**. Evidence is pasted output or a
committed artifact, never an adjective.

## Before the critique (S13)

**Presenter preparation.** State the context: what problem are you solving, who is the target user, what
constraints exist. Define the scope: what stage is this work, what feedback do you need, what is out of
scope. Share materials in advance — design files or prototypes, user research findings, business
requirements.

**Facilitator preparation.** Set time limits, define the feedback format, prepare prompts.

For ASW, add two S14/S1 artifacts to the pre-read: the **Design Read** one-liner with the three dial
values and their reasons, and the token plan (base hexes, typefaces and roles, layout concept with ASCII
wireframes, principles) — because the critique is cheaper when it reviews a *plan* than when it reviews
finished pixels.

## Critique structure (S13, timeboxed)

| Phase | Time | Content |
|---|---|---|
| 1. Presentation | 5-10 min | Problem statement, user needs, design solution, **specific questions** |
| 2. Clarifying questions | 5 min | "What happens when…?" · "How did you decide…?" · "What alternatives did you consider?" |
| 3. Feedback round | 15-20 min | Each reviewer in the formats below |
| 4. Discussion | 10 min | Explore key themes, identify next steps, prioritize changes |

Facilitation: use a timer, interrupt politely if needed, go around the room, call on quiet people, limit
dominant voices, redirect tangents, park off-topic items, summarise key points. Remote: collaborative
tools (Figma, Miro), commenting enabled, mute when not speaking, video for engagement, record for absent
members.

## Feedback formats (S13)

**"I Like / I Wish / What If"** — what's working well ("I like how the onboarding flow reduces
friction"); opportunities ("I wish the error states were more helpful"); ideas to explore ("What if we
added a progress indicator?").

**Observation → Impact → Suggestion** — "I notice the CTA is below the fold. This might reduce
conversions. Consider testing it above the fold."

**Actionable vs preferential.** Actionable (give this): "The contrast ratio on this button is 2.8:1,
which fails WCAG AA. Increase the contrast to at least 4.5:1." Preferential (avoid this): "I don't like
the blue. Try green instead."

**Specific vs vague.** Specific (give this): "The form has 12 fields. Consider progressive disclosure to
reduce cognitive load." Vague (avoid this): "This feels overwhelming."

→ *ASW*: every finding cites a computed number or a named rule from this skill — e.g. "SKILL.md §P.2:
raw `--asw-teal` is 2.23:1 on white and fails; use `--asw-teal-text #256F57` at 6.02:1". "It feels too
glassy" is not a finding; "§3.3: this panel carries body text above `--surface-glass-max`" is.

## Feedback matches the design stage (S13)

| Stage | Focus on | Avoid |
|---|---|---|
| Early exploration | Problem framing, conceptual direction, user-needs alignment | Visual polish details, pixel-level feedback, implementation concerns |
| Mid-fidelity | Information architecture, user flows, interaction patterns | Final copy critique, colour/font perfection, edge cases |
| **High-fidelity** | **Visual consistency, accessibility compliance, content quality, edge cases** | — |

## Severity rating (S6)

Rate every issue, weigh **frequency × impact × persistence**, and return a **ranked triage list**, not
an opinion.

| Severity | Rating | Description | Priority |
|---|---|---|---|
| 0 | Not a problem | Disagreement, not a usability issue | Ignore |
| 1 | Cosmetic | Minor annoyance, low impact | Fix if time |
| 2 | Minor | Causes delay or frustration | Schedule fix |
| 3 | Major | Significant task failure | Fix soon |
| 4 | Catastrophic | Prevents task completion | Fix immediately |

→ *ASW calibration*: a WCAG AA failure on primary data text, an accent hue used as chrome, a hover glow
that reads as an outline (>3:1), or an icon-only nav destination is **severity 3 minimum**. A missing
`prefers-reduced-transparency` fallback with no in-product "Reduce glass" setting is **severity 4** —
it excludes users with no workaround.

## Receiving feedback (S13)

**Do**: listen fully before responding, take notes, ask clarifying questions, thank reviewers, follow up
on actions. **Don't**: defend every decision, explain away feedback, take it personally, **ignore
patterns in feedback**.

## Documenting outcomes (S13)

Capture all feedback, note priorities, **assign owners to action items**. → For ASW these are committed
artifacts, not chat: critique reports live alongside the surface's direction contract (S12 keeps
`critique/*.md` and `surfaces/*.md` tracked while gitignoring screenshots and session state).

## Merged with the SDLC review gates (S14)

The critique session above is the *human* half. The SDLC adds the gates that make it binding:

**Self-critique before anyone else looks** (S2, S14 §4). Screenshot the real surface and review it — "a
picture is worth 1000 tokens"; for UI close the loop with a screenshot or browser check, **two or three
rounds**. Run the SKILL.md §9 pre-flight. Then the Chanel pass: remove one accessory, and **re-run the
contrast and target-size checks, because removal changes adjacency** (SC 1.4.11 measures against
*adjacent* colours; SC 2.5.8 spacing depends on neighbours).

**Verification is output that can fail** (S14 non-negotiable 4). "Done means the command ran and its
literal output is in the report… A green suite is not evidence of behaviour; prove the effect, not the
declaration. Never skip, weaken or delete a failing test to pass." A defect fix **starts with a failing
check** (screenshot, contrast report or test) that reproduces it; confirm it fails for the expected
reason, then fix without weakening the check.

**Deterministic checks are evidence, not proof** (S12). "A clean detector run… does not replace
inspecting the rendered experience across relevant viewports." Inspect desktop, laptop, tablet, mobile,
200% zoom, both transparency preferences, reduced motion, **both themes**.

**The author never approves** (S14 non-negotiable 6). A different reviewer runs the adversarial pass,
bound to a pre-fold SHA, trying to refute every claim with evidence; "no findings" carries a receipt of
what was attempted. Findings are ranked; **nits are capped at five**; "important" is reserved for
behaviour, data or policy breaks. Anything committed after the reviewed SHA is unreviewed — it goes back
or is named hunk by hunk. The adjudicator answers every finding against the reviewed tip; re-pins and
re-baselines are ratified or refused item by item, never slipped in. The reviewer never merges.

**Every gate leaves an append-only gate record** — never edited; a correction is a new record pointing at
the superseded one — carrying authorizer, role, SHAs (`reviewed_sha`, `adjudicated_sha`, `merged_sha`),
scope pathspecs, receipts (command + exit code + output hash), findings count and the
separation-of-duties identities.

**Lenses, named when used** (S14 grill.md): Product/CEO · Engineering · **Design and DevEx** ("the
operator's first five minutes, the magical moment, friction points, the empty state, the error text") ·
Security · Validation · Adversarial ("try to refute every claim with evidence; a claim without a command
that can fail is a claim, not a finding").

**Taste stays human** (S14 governance): policy acceptance, approval, release authorisation, incident
triage and **taste — product scope, UX, naming, messaging** are human judgement. Agents own diagnosis,
implementation, self-verification and uniform review. The agent acts **up to** the gate and cannot pass
it.

**Mistake twice, rule once** (S14 non-negotiable 9): a repeated design defect becomes a dated rule, a
skill line, or a fitness/detector check — with its evidence and reopening trigger — never a longer
prompt. **Every rule is a dated decision.**

## Definition of done (S14 — paste the evidence, not the adjective)

The plan the work followed, with in-flight amendments · the verification commands and their literal
output, run on the final tree · the review verdicts and how each finding was dispositioned · the gate
record the change waits at (decision_id and SHA), or the merge record with gates rerun on the merged SHA
· **the rule, eval or skill line that keeps this mistake from recurring, if there was one.**
```

## references/sdlc.md

```markdown
# Kaidera SDLC — the governing design process

Source: S14 Kaidera-AI/skills `skills/development/kaidera-sdlc.SKILL.md` v1.1.0 (Apache-2.0; note the
file is `kaidera-sdlc.SKILL.md`, not `SKILL.md`). This is the **governing process** for all ASW design
work. Digest: `docs/design/research-digest.md`.

## The loop

```
 INTENT ──> GRILL ──> SPEC ──> PLAN ──> BUILD <──> VERIFY ──> REVIEW ──> SHIP ──> MAINTAIN
   ^                                                                                 |
   └──────────────── incidents, findings and scans re-enter as intent ───────────────┘
```

"Code is no longer the bottleneck. The bottleneck is knowing what to build, proving it works, and
getting it through the gates without a person on the critical path of every edit." **The same loop for a
two-line fix and a six-wave epic; only the depth changes.**

Mapped to design work: **BRIEF** = Intent + Grill + Spec. **DESIGN** = Plan (token plan, wireframes,
direction contract). **BUILD** = implementation. **CRITIQUE** = Verify + Review. **HANDOFF** = Ship.
Incidents, accessibility findings and design-defect scans re-enter as Intent.

## Non-negotiables binding design work

1. **Nothing is implemented without an accepted plan.** A plan names the files that change, the order of
   work, the risks and the proof. "Someone unfamiliar with the conversation could implement from it
   alone." Departing from the plan means updating the plan **in the same commit**.
2. **Grill before you build. One question at a time.** Look facts up yourself; put decisions to the
   human. Walk every branch of the decision tree. Stop when there is shared understanding, not when the
   questions run out. **Risk beats urgency**: incidents, destructive work, security, money,
   customer-data, migration, fold and cross-project work force the full grill.
3. **Artifacts, not chat.** Intent, spec and plan live in the repo next to the epic and are referenced
   from the handoff. "Reports go into the artifact; chat points at it."
4. **Verification is output that can fail.** "Done means the command ran and its literal output is in
   the report. A green suite is not evidence of behaviour; prove the effect, not the declaration. Never
   skip, weaken or delete a failing test to pass."
5. **A bug fix starts with a failing test.** Reproduce as a test, confirm it fails for the expected
   reason, commit it, then fix without touching the test.
6. **Review runs in both directions and separates duties.** The author never approves. The reviewer's
   adversarial review is bound to a pre-fold SHA; the adjudicator diffs against that SHA; the
   integration custodian folds and reruns the gates on the merged SHA; the reviewer never merges.
   Findings are ranked; **nits are capped at five**; policy findings feed back into rules.
7. **The agent acts up to the gate and cannot pass it.** Merge to main, deploy, publish and release wait
   for the release authority's go — **a human, never an agent**. Rollback is the most rehearsed path.
8. **Humans own judgement.** Policy acceptance, approval, release authorisation, incident triage,
   **taste**. Agents own diagnosis, implementation, self-verification, uniform review.
9. **Mistake twice, rule once.** A repeated mistake becomes a dated rule (Cortex rule, CLAUDE.md, or a
   fitness test), never a longer prompt.
10. **Incidents become intent and evals.** Detection stays deterministic; the agent is invoked by a
    breached band; the diagnosis is written as intent and the fix ships with an eval.
11. **Every rule is a dated decision** with its evidence and its reopening trigger. Cite it that way;
    challenge it in review with evidence.
12. **Destructive operations follow the checklist**: adjudications expire, commits with pathspecs,
    proofs that can fail, one mutation per command with full output.

**Taste is explicitly human**: governance lists what stays human as policy acceptance and ownership,
approval, incident triage, and **"Taste: product scope, UX, naming, messaging."** → Design taste calls
are human decisions the agent prepares and evidences, never decides. This is why the house-style and
palette `[OWNER-DIRECTIVE]` sections outrank every external source in this skill.

## Grill modes (references/grill.md)

| Mode | Signals | Depth | Output |
|---|---|---|---|
| **Quick** | one-liner, "sanity check", a handoff summary, no time, and none of the forcing conditions | 5-8 questions, one lens | a scored gap list in the artifact |
| **Full** | a new epic, a plan before build, "stress-test this", anything touching data, money, security or a customer | every branch of the decision tree, all applicable lenses | the artifact rewritten until it stands alone |
| **Re-grill** | an artifact exists and reality moved: a review came back, an experiment ran, a ruling changed | only the branches that changed | a dated amendment |

**Risk beats urgency.** Full mode is forced, whatever the signal, for: an incident or alert; destructive
work; security; money; customer data; a migration; a removal or fold; any cross-project change. "'No
time' and 'a handoff summary' change the pace of the answers, never the set of questions."

**Operating rules**: one question at a time, wait for the answer · facts are yours to find, decisions
are theirs to make · walk the decision tree, resolve dependencies one by one, don't skip to the
interesting branch · **do not act until shared understanding is confirmed** · write then point ·
**challenge the premise before the details** ("should this exist, and is this the narrowest thing that
proves it?").

**The 13 forcing questions** (ask the ones the branch needs, in order): what problem in the originator's
words, who feels it, what do they do today instead · why now, what changed · the proposed outcome stated
so it could be measured · the narrowest wedge that tests the riskiest assumption, and what would falsify
it · who and what is affected (users, systems, data, other projects, platform boundary) · which
constraints are real (policy, security, licence, budget, ruling) and which are habit · what could break,
which step is riskiest, what is the blast radius · which alternatives were considered and why rejected ·
**what is the proof — which command, test, screenshot or receipt shows it worked** · what is the
rollback and has it been rehearsed · **what stays human here: which approval, which judgement, which
taste call** · what do we not know yet and who owns finding out · (removal/fold only) which definitions,
files, migrations and config keys go, listed by name from the merged tree.

→ *Design translation*: for a new dashboard view the "riskiest assumption" is usually **whether the
analyst's intent is what we think it is**, and the falsifying experiment is a walkthrough of the current
surface with one real analyst — not a higher-fidelity mockup.

**Full-grill scoring**: 10 criteria × 0-5 = **/50** — problem clarity, evidence of demand or need,
narrowness of the wedge, measurability of the outcome, technical feasibility on our stack, policy fit
(security, licence, rulings), blast radius and reversibility, proof design, ownership and capacity, and
"what stays human" clarity. **Every criterion carries two lines or it scores 0**: the source or receipt
(a path, a command with its output, a record, a measurement — "we believe" is not a source) and the
counter-evidence, or an owned unknown (who finds out, by when). Counter-evidence and refuted claims stay
in the artifact with their reasons; they are not deleted when the score moves.

Thresholds: **under 25, do not build — write the experiment. 25-39, build the wedge only. 40 and above,
plan it.** Whatever the criteria sum to, **the total is capped at 39 until all three are resolved**: the
riskiest-assumption experiment has run and its result is in the artifact; the proof names a command that
can fail, with its expected output; the rollback has been rehearsed and its receipt is in the artifact.

**Lenses, named when used**: Product/CEO (rethink the problem; is there a ten-star version; expand or
cut scope only when it makes a better product; kill sunk-cost branches) · Engineering (architecture,
data flow, migrations and their immutability, edge cases, failure modes, test coverage, performance
under the real engine, one concern per commit) · **Design and DevEx** ("the operator's first five
minutes, the magical moment, friction points, the empty state, the error text") · Security (trust
boundaries, secrets, injection, PII in logs, least privilege, what an attacker does with this change) ·
Validation (score on evidence, red flags, and a falsifiable experiment before anyone builds; the
riskiest assumption gets tested first) · Adversarial (try to refute every claim with evidence; "a claim
without a command that can fail is a claim, not a finding").

**Exit**: the mode used (and which condition forced Full), the score and whether it is capped, the
decisions taken and by whom, the open questions with owners, and the next stage. That block goes at the
top of the artifact.

## The six stages, design-relevant detail

**1. Intent.** The originator brainstorms in their own words; the lead grills (quick mode unless risk
forces full) and writes `intent.md`. Intent enters through any door — a person, a ticket, a handoff, an
alert, a scan finding. For small work the handoff summary *is* the intent, but it must still answer the
template's five content headings.

**2. Spec.** Produce the spec from the accepted intent **in one session**, with policy applied *while
writing* (security, licence, architecture rules, platform boundary), not discovered in review. Flag every
concern where policies conflict and resolve with the policy owner before engineering sees the spec.
**"Design docs (`docs/design/NN-*.md`) are specs for cross-cutting work"** — which is exactly what
`docs/design/research-digest.md` is.

**3. Plan and build.** Plan mode first: read the codebase without changing it, write `plan.md` (files
that change, order of work, risks, proof), grill the plan (full mode for anything non-trivial), commit
it, then implement. Before the first edit the plan carries the pre-edit evidence: worktree ownership, a
clean tree, the declared scope. **Worktree per agent; one concern per commit.** Waves become epic
increments, each a handoff to one agent with one worktree.

**4. Verify.** Every task has a feedback loop: one command that exits non-zero on failure, listed with
its healthy output; state the quantifiable target before starting. Bug fixes: failing test first.
**"For UI: close the loop with a screenshot or browser check, two or three rounds."** Verification is
part of done and the literal output is pasted into the return. Evidence discipline: exit codes captured
to files, never piped through a filter that swallows them; verify the effect, never the declaration; an
errored check is not a check; a change to a shared interface runs the full suite of every consumer
surface, never a `-k` filter. **Continuous evals**: 20-50 real tasks with expected outcomes, run in CI on
a schedule and on any change to rules, skills or hooks; every incident becomes an eval.

**5. Review and ship.** Every change gets the same passes: bugs, security, compliance against spec, plan
and rulings. "Important" is reserved for behaviour, data or policy breaks; **nits capped at five**. Only
generated noise with no policy or behavioural consequence goes unreported. Findings that cite policy
feed the rule or skill that should have caught them. Gates: **claim before edit** (a 409 on claim is a
live-sibling alarm, not a retry) → **plan accepted** with pre-edit evidence pasted → **verification on
the final tree** → **adversarial review** by a different agent bound to a pre-fold `reviewed_sha` →
**adjudication** diffing `reviewed_sha..adjudicated_sha` first → **merge, then rerun the gates on
`merged_sha`** (gates read HEAD, so a pre-merge green proves nothing about the merged tree) →
**real-engine proof on a fresh host** ("a warm host is a different product") → **the go** (the release
authority tests the running thing at `merged_sha`, then authorises) → **rollback rehearsed before it is
needed**. Branch protection: everything an agent writes is a PR; nothing lands on main directly.

**6. Maintain.** Detection stays deterministic: a version-controlled, unit-tested script watches one
metric with a stable baseline and control bands (`bands.yaml`). The agent is invoked only when a band is
breached, at the tier the band allows: log, diagnose read-only, or propose through a PR or pre-approved
runbook. The diagnosis is written as intent and re-enters at stage 1, where an incident forces the full
grill. **Every shipped fix adds an eval.** Monthly tune: rate review findings and cap the nits; update
skills and hooks and prove them with evals; move repeated mistakes into rules; tune bands from
dismissals; add the month's incidents as evals; **challenge one standing rule with evidence**.

## Gate records

An append-only JSON file at `Program/<release>/gates/<gate>-<decision_id>.json`, schema
`kaidera-sdlc.gate-record.v1`, with fields: `schema`, `gate` (intent|spec|plan|review|adjudication|merge|
release|go), `decision_id` (uuid4), `authorizer`, `role` (reviewer|adjudicator|integration-custodian|
release-authority|originator), `timestamp` (ISO-8601 UTC), `reviewed_sha`, `adjudicated_sha`,
`merged_sha` (each full 40-hex or null where not applicable; review requires `reviewed_sha`,
adjudication requires both, merge requires all three, release/go require `merged_sha`), `tree_sha`,
`scope` (non-empty pathspec list), `receipts` (list of `{command, exit_code, output_sha256}`; a merge
record must include a receipt whose command reran the gates on `merged_sha`), `findings_count` (a review
with zero findings still needs a receipt), `separation` (`{reviewer, adjudicator, custodian}` — reviewer
must differ from adjudicator and custodian), `previous_record_sha256`, `record_sha256`. **Records are
never edited**: a correction is a new record whose `previous_record_sha256` points at the superseded one.
**Freshness**: a merge/release/go record is stale when `merged_sha` is not the current head of its target
branch.

Artifacts (`intent.md`, `spec.md`, `plan.md`, `REVIEW.md`) carry a status block copying the record's
`decision_id`, SHAs, authorizer, role and timestamp, and pointing at the file. **The block is a pointer;
the record wins on any disagreement.**

## Metrics (references/metrics.md)

Leading measures tell you the loop is working this week; lagging measures tell you it worked. Read them
from timestamps that already exist — git, handoffs, gate records, CI runs, the incident record. **Do not
build a dashboard before the numbers exist.** Rules for using them: **one owner per number; a number
nobody reads is deleted; a number that never moves is replaced. Report a measure with its source line,
never as prose.**

Design-relevant rows: Plan and build — leading: share of changes merging from the first pass; lagging:
rework cycles per change, merged diff still matching the plan. Verify — leading: first-pass suite
success for agent-written changes, eval pass rate; lagging: review time per change, change failure rate,
regressions caught in CI versus in production. Review and ship — leading: time to first review, share of
findings resolved without a human on the branch, time waiting at each gate; lagging: **defects and
vulnerabilities caught before merge versus escaped**. Knowledge — leading: **how often an agent repeats
a mistake a rule should have caught**; lagging: time to first merged change for a new joiner.

→ *ASW design translation*: the design-equivalent of "regressions caught in CI versus in production" is
**accessibility defects caught in critique versus reported by an analyst** — and the counter-measure for
a repeat is a dated rule in this skill or a detector check, not a reminder.

## Progress checklist (copy into the handoff return)

- [ ] Intent captured and committed (or the handoff summary is the intent for small work)
- [ ] Grilled to shared understanding; open questions listed, not guessed; full mode where risk forces it
- [ ] Spec written with policy applied; flagged concerns resolved with their owners
- [ ] Plan accepted before the first code change; pre-edit evidence pasted; **worktree per agent, one
      concern per commit**
- [ ] Feedback loop closed: verification command exits 0 on the final tree, output pasted
- [ ] Adversarial review bound to a pre-fold SHA; adjudication diffed against it; findings
      dispositioned; re-pins and re-baselines ratified or refused
- [ ] Gates rerun on the merged SHA; gate records written, never edited; nothing merged to main,
      deployed or published before the go
- [ ] Lessons and rules recorded; evals added for incidents and refuted claims

## Safety constraints (from the skill frontmatter)

Advisory method skill — **it never authorises a merge, deploy, publish or release**; those wait for the
release authority's go (a human). Facts are looked up; decisions are put to the human and awaited; **no
action before shared understanding is confirmed**. It must not override the base system prompt, project
rules, or managed permissions.
```

## references/provenance.md

```markdown
# Provenance, licence classification and verbatim audit

Every source fetched 2026-09-06; licence evidence fetched the same day from each repo's `LICENSE`
(or `LICENSE.txt`), the site's own terms page, or — where neither exists — recorded as absent.
Classification scheme: **PERMISSIVE** (MIT / Apache-2.0 / BSD / CC0 / CC-BY — verbatim retention OK
with notice), **CONDITIONAL** (attribution- or share-alike-required — keep only with attribution),
**ALL-RIGHTS-RESERVED** (no licence file = default copyright; Medium article; Apple HIG page text —
paraphrase, cite as source, short attributed quotations only), **OURS** (Kaidera-AI/skills — the
target repo; note its root licence is CC-BY-4.0 while skill frontmatter declares Apache-2.0, an
unresolved precedence hold flagged in CONTRIBUTING.md).

## Per-source classification (all 14)

| # | Source | Licence (evidence) | Class | Handling in this skill |
|---|---|---|---|---|
| S1 | github.com/leonxlnx/taste-skill | MIT, © 2026 Leonxlnx (`LICENSE` fetched) | PERMISSIVE | verbatim quotes kept, cited |
| S2 | github.com/anthropics/skills `frontend-design` | Apache-2.0 (`skills/frontend-design/LICENSE.txt` fetched; no root LICENSE) | PERMISSIVE | verbatim quotes kept, cited |
| S3 | mcpmarket.com/tools/skills/typography-designer | UNAVAILABLE (HTTP 403 twice, 2026-09-06) | n/a | partial rules via S4 cross-check only; nothing verbatim |
| S4 | skills.wondel.ai web-typography | MIT, © 2025 Wondel.ai sp. z o.o. (wondelai/skills `LICENSE` fetched) | PERMISSIVE | verbatim quotes kept, cited |
| S5 | github.com/iart-ai/kinetic-typography-skills | MIT, © 2026 iart.ai (`LICENSE` fetched) | PERMISSIVE | verbatim quotes kept, cited |
| S6 | skills.wondel.ai ux-heuristics | MIT, © 2025 Wondel.ai sp. z o.o. (same repo as S4) | PERMISSIVE | verbatim quotes kept, cited |
| S7 | lawsofux.com | **CC-BY-NC-ND 4.0**, © Jon Yablonski (lawsofux.com/info/: "All content on this website is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0") | **CONDITIONAL-ND** | **zero verbatim sentences**; every law statement and takeaway paraphrased in `ux-laws.md` and digest S7; ideas/facts cited to lawsofux.com |
| S8 | uxdesign.cc (Medium), Joe Smiley 2026-01-26 | Medium terms: all rights reserved | ALL-RIGHTS-RESERVED | paraphrased in `trends-2026.md` + digest S8; no sentence-level quotes retained |
| S9 | github.com/jamesrochabrun/skills `apple-hig-designer` | MIT, © 2025 James Rochabrun (`LICENSE` fetched) | PERMISSIVE | verbatim quotes kept, cited |
| S10 | github.com/heyman333/atelier-ui `apple-ui-designer` | **no licence file** (repo root listing fetched: `.claude-plugin`, `README.md`, `images`, `skills` only) | ALL-RIGHTS-RESERVED | paraphrased; short attributed phrases only |
| S11 | taste-skill `minimalist-skill` | MIT, © 2026 Leonxlnx (same repo as S1) | PERMISSIVE | verbatim quotes kept, cited |
| S12 | github.com/pbakaus/impeccable | Apache-2.0, © 2025 Paul Bakaus (`LICENSE` fetched; **no NOTICE file** — 404 checked, so §4(d) adds nothing) | PERMISSIVE | verbatim quotes kept, cited |
| S13 | github.com/slb2248/ai-ux-skills `design-critique` | MIT, © 2025 AI/UX Playground (`LICENSE` fetched) | PERMISSIVE | verbatim quotes kept, cited |
| S14 | github.com/Kaidera-AI/skills `kaidera-sdlc` | **CC-BY-4.0 © 2026 EnGenAI at repo root**; skill frontmatter declares Apache-2.0 (precedence hold unresolved in CONTRIBUTING.md) | OURS + CONDITIONAL | `sdlc.md` carries attribution, licence link and a changes-made note; quotes retained under CC-BY-4.0 |

## Secondary authorities used in REVALIDATION

| Authority | Licence | Handling |
|---|---|---|
| WCAG 2.2 (w3.org/WAI/WCAG22) | W3C Software and Document License (2015) — copying/quotation with copyright notice and attribution permitted | short SC quotes kept with citation |
| Apple HIG *Materials* / *Design Tips* | Apple site terms: all rights reserved | **paraphrased** in `apple-hig.md` + digest §APPLE; only short attributed directives quoted ("Don't use Liquid Glass in the content layer", "Use Liquid Glass effects sparingly.") |
| Material Design 3 (m3.material.io) | Apache-2.0 or CC-BY-4.0 unless otherwise noted | facts (dp ladder, tonal elevation) cited |
| MDN Web Docs | CC-BY-SA 2.5 or later (Mozilla Contributors) | paraphrased with attribution (`prefers-reduced-transparency` experimental status); no verbatim reuse |

## Verbatim audit — what is retained verbatim, and why it is allowed

- **MIT sources (S1, S4, S5, S6, S9, S11, S13)**: quoted sentences retained in `minimalism.md`,
  `typography.md`, `glass-neo.md`, `impeccable.md`, `design-critique.md`, `apple-hig.md` (S9/S10
  parts), `SKILL.md`. MIT requires only that the copyright notice and permission notice accompany
  the material; each reference names its source and this file carries the copyright lines below.
- **Apache-2.0 sources (S2, S12)**: quoted sentences retained with citation; modified/derived
  documents state their source. Impeccable ships no NOTICE file, so §4(d) imposes no extra text.
- **CC-BY-4.0 (S14)**: `sdlc.md` quotes the SDLC loop, non-negotiables and gate schema; attribution
  ("Kaidera-AI/skills, kaidera-sdlc v1.1.0"), licence link (creativecommons.org/licenses/by/4.0/)
  and a changes-made note (condensed to design-relevant content) are present in `sdlc.md` header.
- **CC-BY-NC-ND (S7)**: **no verbatim sentence anywhere**. Paraphrased passages: the ten law
  statements + takeaways in `ux-laws.md` (Hick, Fitts, Jakob, Miller, Prägnanz, Common Region,
  Proximity, Peak-End, Von Restorff, Zeigarnik, Doherty) and digest line S7 + the Hick dashboard row.
  Facts and law names are not copyrightable; the site's phrasing is, and ND bars derivatives.
- **All-rights-reserved (S8, S10, Apple HIG)**: paraphrased passages: all nine trend blocks in
  `trends-2026.md`, digest S8/S9-adjacent lines, the Apple material-level bullets and vibrancy
  paragraph in `apple-hig.md`, digest §APPLE line. Retained quotations are short attributed
  directives or coined phrases (≤ one sentence each), listed where they appear.
- **CC-BY-SA (MDN)**: paraphrased; attribution named in `apple-hig.md` and `glass-neo.md`.

## Notices retained (required by the licences above)

- MIT License © 2026 Leonxlnx — taste-skill, minimalist-skill (S1, S11)
- MIT License © 2025 Wondel.ai sp. z o.o. — web-typography, ux-heuristics (S4, S6)
- MIT License © 2026 iart.ai — kinetic-typography-skills (S5)
- MIT License © 2025 James Rochabrun — apple-hig-designer (S9)
- MIT License © 2025 AI/UX Playground — design-critique (S13)
- Apache License 2.0 © Anthropic — frontend-design (S2)
- Apache License 2.0 © 2025 Paul Bakaus — impeccable (S12)
- CC-BY-4.0 © 2026 EnGenAI (engenai.app) — Kaidera-AI/skills incl. kaidera-sdlc (S14)
- CC-BY-NC-ND 4.0 © Jon Yablonski — lawsofux.com (S7; paraphrased only)
- All rights reserved — Joe Smiley / UX Collective (S8); heyman333/atelier-ui (S10, no licence
  file); Apple Inc. HIG page text (paraphrased, short quotes only)
- CC-BY-SA 2.5 © Mozilla Contributors — MDN Web Docs (paraphrased with attribution)
- W3C Software and Document License — WCAG 2.2 (short quotes with citation)

## Licence of this skill

`adaptech-uiux-design` is published under **Apache-2.0** per the Kaidera-AI/skills per-skill
convention (catalogue row + frontmatter). **Open hold for maintainers:** the Kaidera-AI/skills repo
root is CC-BY-4.0 while skill frontmatter declares Apache-2.0; CONTRIBUTING.md records that no
ratified precedence rule exists. Until maintainers resolve it, treat the stricter reading
(CC-BY-4.0 attribution obligations) as binding for redistribution of this entry. Third-party
material inside this skill remains under the licences listed above; the notices block is the
attribution for all of it.
```
