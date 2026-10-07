#!/usr/bin/env node
'use strict'
// Renders docs/SKILLS-GLOSSARY.md from the built marketplace, the catalogue markers and the
// authored prose in scripts/glossary-prose.json.
//
// Only the prose is authored. Skill names, categories, versions, file paths, postures and
// legacy flags are read from the same sources scripts/test-skills-catalog.js checks against,
// so a glossary row cannot disagree with a manifest without this script reproducing the
// disagreement on every run.
//
// Usage:
//   node scripts/render-glossary.js           write docs/SKILLS-GLOSSARY.md
//   node scripts/render-glossary.js --check   exit 1 if the committed file is not what this
//                                             script would render now
const fs = require('node:fs')
const path = require('node:path')
const { buildMarketplace } = require('./generate-marketplace')

const root = path.join(__dirname, '..')
const catalogPath = path.join(root, 'docs', 'KAIDERA-SKILLS-CATALOG.md')
const glossaryPath = path.join(root, 'docs', 'SKILLS-GLOSSARY.md')
const prosePath = path.join(__dirname, 'glossary-prose.json')
const markerPattern = /^<!-- kaidera-skill-catalog-entry (\{[^\r\n]+\}) -->$/gm

const POSTURE_LABELS = new Map([
  ['bounded-candidate', 'Bounded candidate'],
  ['reference-only', 'Reference-only'],
  ['manual-only', 'Manual-only'],
  ['rework-before-use', 'Rework before use'],
])
const POSTURE_ORDER = ['bounded-candidate', 'reference-only', 'manual-only', 'rework-before-use']

function readMarkers() {
  const content = fs.readFileSync(catalogPath, 'utf8')
  const markers = new Map()
  for (const match of content.matchAll(markerPattern)) {
    const marker = JSON.parse(match[1])
    markers.set(marker.name, marker)
  }
  return markers
}

// A projection declares kaidera.source (with the repository it is rendered from) or carries a
// generation marker. Only the published name and the source repository are reported here; the
// path inside that repository belongs to the manifest.
function projections(skills) {
  const found = []
  for (const skill of skills) {
    const file = path.join(root, skill.file)
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    const match = text.match(/^ {2}source:\n(?:.*\n)*? {4}repo: (\S+)/m)
    if (match) found.push({ name: skill.name, repo: match[1] })
    else if (text.includes('Generated from')) found.push({ name: skill.name, repo: null })
  }
  return found.sort((a, b) => a.name.localeCompare(b.name))
}

function proseFor(name, prose, pairs) {
  if (prose[name]) return prose[name]
  for (const [oldName, newName] of pairs) {
    if (name === oldName && prose[newName]) return prose[newName]
    if (name === newName && prose[oldName]) return prose[oldName]
  }
  throw new Error(`no glossary prose for skill "${name}"; add it to scripts/glossary-prose.json`)
}

// The status is read from the tree, so the register cannot claim a rename that has not
// happened on the branch a reader is looking at.
function renameStatus(entry, present) {
  const { kind, current, proposed } = entry
  if (kind === 'withdrawn') return 'withdrawn'
  if (kind === 'declined') return 'declined 2026-10-07'
  if (kind.startsWith('advisory')) return `advisory, unmerged candidate (${kind.split(', ')[1]})`
  if (kind === 'carried by #23') return 'carried by #23'
  if (present.has(proposed)) return 'applied in this tree'
  if (present.has(current)) return 'accepted, not yet applied'
  return 'accepted, not yet applied'
}

function render() {
  const { skills } = buildMarketplace()
  const markers = readMarkers()
  let authored
  try {
    authored = JSON.parse(fs.readFileSync(prosePath, 'utf8'))
  } catch (error) {
    throw new Error(
      `cannot read the authored glossary prose at ${prosePath}: ${error.message}\n`
      + 'That file is committed input to this renderer, not generated output. If it is '
      + 'missing, npm test fails here rather than reporting glossary drift.',
    )
  }
  const present = new Set(skills.map(skill => skill.name))

  // Fail loudly rather than render a glossary with a hole in it.
  for (const skill of skills) proseFor(skill.name, authored.prose, authored.rename_pairs)
  const unknown = Object.keys(authored.prose)
    .filter(name => !present.has(name)
      && !authored.rename_pairs.some(pair => pair.includes(name)))
  if (unknown.length > 0) {
    throw new Error(`glossary prose for skills this tree does not carry: ${unknown.join(', ')}`)
  }

  const preferred = authored.preferred_category_order
  const carried = new Set(skills.map(skill => skill.category))
  const categories = preferred.filter(category => carried.has(category))
    .concat([...carried].filter(category => !preferred.includes(category)).sort())
  const counts = new Map(categories.map(c => [c, skills.filter(s => s.category === c).length]))
  const postureCounts = new Map(POSTURE_ORDER.map(p => [
    p, [...markers.values()].filter(m => m.posture === p).length,
  ]))
  const legacyCount = [...markers.values()].filter(m => m.legacy).length
  const hasLegacyCategory = carried.has('legacy')
  const inflightPrs = new Set(authored.in_flight.map(row => row.pr))
  const proj = projections(skills)
  const inRepo = proj.filter(p => p.repo === 'Kaidera-AI/skills').map(p => p.name)
  const external = proj.filter(p => p.repo !== 'Kaidera-AI/skills')

  const out = []
  const w = line => out.push(line)

  w('# Kaidera Skills Glossary')
  w('')
  w('Status: **human-facing index; the manifests and the catalogue remain authoritative**')
  w('')
  w('Glossary date: **2026-10-07**')
  w('')
  w(`Published skills covered: **${skills.length}**`)
  w('')
  w('Rendered by `scripts/render-glossary.js` from the built marketplace, the catalogue')
  w('markers and the authored prose in `scripts/glossary-prose.json`. Skill names, categories')
  w('and postures are read from the manifests and the markers in the same tree, never')
  w('retyped; only the prose is authored here. `npm test` runs this script with `--check` and')
  w('fails on drift. The enclosing commit is the receipt, so this file does not')
  w('self-reference a SHA it cannot know.')
  w('')
  w('One row per skill: what it does, and why you would reach for it. This is the fast')
  w('index. It carries no authority. For posture definitions, capability meanings,')
  w('licensing, attribution, routing rules and migration debt read the')
  w('[Kaidera Skills Catalogue and Operating Guide](KAIDERA-SKILLS-CATALOG.md). For the')
  w('machine-readable record read the [generated marketplace](../.claude-plugin/marketplace.json).')
  w('')
  w('A glossary entry is a summary of a manifest. If this file and a manifest disagree,')
  w('the manifest wins and this file is stale — fix it in the same commit.')
  w('')
  w('---')
  w('')
  w('## Portfolio shape')
  w('')
  w('| Category | Published |')
  w('|---|---:|')
  for (const category of categories) w(`| \`${category}/\` | ${counts.get(category)} |`)
  w(`| **Total** | **${skills.length}** |`)
  w('')
  w('| Posture | Published |')
  w('|---|---:|')
  for (const posture of POSTURE_ORDER) w(`| ${POSTURE_LABELS.get(posture)} | ${postureCounts.get(posture)} |`)
  w('')
  if (hasLegacyCategory) {
    w(`Legacy entries: **${legacyCount}** of ${skills.length} are filed under \`legacy/\`. Twenty-one`)
    w('name EnGenAI, its domains or its named approvers outright; the twenty-second,')
    w('`code-review`, carries stale CTO-escalation, kill-switch, organisation-scope and')
    w('sprint-log controls instead. None of the 22 declares any capability, yet several')
    w('bodies describe installs, live production diagnostics, database and cluster access,')
    w('Git mutation or deployment. `legacy` is machine-readable in the manifest, in the')
    w('generated marketplace record and in the path, so a loader can filter or down-rank on')
    w('it; whether any current router does is unevaluated, which is the same Gate 3 hold the')
    w('catalogue states. Filing them separately also keeps the good names free for the')
    w('Kaidera-native skills that will replace them.')
  } else {
    w(`Legacy entries: **${legacyCount}** of ${skills.length}. The catalogue marks them, but they are`)
    w('not filed separately, so a legacy name still looks current at the path level.')
  }
  w('')
  w(`In flight: **${inflightPrs.size} pull requests** carrying **${authored.in_flight.length}** candidate skills.`)
  w('')
  w(`Consumed third-party, published by their owners elsewhere: **${authored.consumed_third_party.length}**.`)
  w('')
  w('---')
  w('')
  w('## Naming')
  w('')
  w('Names describe the job. Lowercase, hyphenated, short, stable. Never name a skill after')
  w('an ordinal, a date, a version, a person, a personality or a superlative. A vendor prefix')
  w("is correct only when the skill is that vendor's own work, kept verbatim.")
  w('')
  w('Three rules do most of the work:')
  w('')
  w('1. **A name must not promise an authority the manifest does not grant.** A skill that')
  w('   designs a test is not a `*-test`; a checklist is not a `*-review`; a policy document')
  w('   is not a gate.')
  w('2. **One job, one name.** Where two skills compete for the same words, the router picks')
  w('   the shorter one, and the shorter one is usually the weaker skill.')
  w('3. **A family prefix must identify a real shared core.** `jev-*` qualifies: every wrapper')
  w('   calls one bundled helper. A prefix that only names a topic does not qualify. A')
  w('   projected skill inherits its family from its canonical source, not from this')
  w('   repository, so renaming one member of a family that lives elsewhere desynchronises it')
  w('   from its siblings and is overwritten at the next render.')
  w('')
  w('Renames are not cosmetic, and renaming source does not rename a runtime. A rename in')
  w('this repository moves:')
  w('')
  w('1. the manifest file, and any canonical directory of the same name;')
  w('2. the catalogue entry, its local links and its review fingerprint;')
  w('3. the static-routing fixtures that name the skill;')
  w('4. the generated marketplace, which CI reproduces and fails on drift;')
  w('5. the posture policy and legacy sets in `scripts/test-skills-catalog.js`.')
  w('')
  w('A second, separately approved migration then moves every live consumer: agent')
  w('registrations, bindings, version and body pins, sibling dependencies, emitted boot')
  w('pointers, and project invocation records. Inventory consumers freeze their pins, test')
  w('the new route and its exact resources, update through the supported API, and regenerate')
  w('pointers. Do not hand-edit a generated pointer, and do not create a second live alias to')
  w('soften the cutover. Keep rollback to the old binding set until the migration is')
  w('accepted. Historical review records and protocol identifiers keep their original names.')
  w('')
  w('### Rename register')
  w('')
  w('| Current name | Proposed | Why | Status |')
  w('|---|---|---|---|')
  for (const entry of authored.renames) {
    w(`| \`${entry.current}\` | \`${entry.proposed}\` | ${entry.why} | ${renameStatus(entry, present)} |`)
  }
  w('')
  w('`applied in this tree` means the manifest, catalogue, marketplace and static fixtures here')
  w('already use the new name. `carried by #23` means another open pull request owns it.')
  w('`advisory` means the skill is still an unmerged candidate, so the name is not yet reserved')
  w("and the rename should be applied by that pull request's author. `withdrawn` and `declined`")
  w('are recorded so the same proposal is not raised twice without new evidence.')
  w('')
  w('Retiring a skill is also a naming decision, because it frees the name. Two retirements were')
  w('proposed and declined; the `legacy/` category is the cheaper answer to the same problem, since')
  w('it removes the router ambiguity without destroying the identity.')
  w('')
  w('---')
  w('')
  w('## Glossary')
  w('')
  w('Alphabetical across all published categories; the Category column carries the current')
  w('versus `legacy` split. `Posture` and `legacy` come from the catalogue markers; both are')
  w("portfolio judgements, separate from the manifest's `trust_tier`, and every skill here is")
  w('`unvetted`.')
  w('')
  w('| Skill | Category | What it does | Why you reach for it | Posture |')
  w('|---|---|---|---|---|')
  for (const skill of [...skills].sort((a, b) => a.name.localeCompare(b.name))) {
    const marker = markers.get(skill.name) || {}
    const label = POSTURE_LABELS.get(marker.posture) || '—'
    const posture = marker.legacy ? `${label}, legacy` : label
    const { what, why } = proseFor(skill.name, authored.prose, authored.rename_pairs)
    w(`| [\`${skill.name}\`](../${skill.file}) | \`${skill.category}\` | ${what} | ${why} | ${posture} |`)
  }
  w('')
  w('---')
  w('')
  w('## In-flight candidates')
  w('')
  w('Carried by an open pull request, not on the default branch, absent from the generated')
  w('marketplace, and not installable as a published identity. Nothing here is accepted, and')
  w("a candidate's name is not reserved until its pull request merges.")
  w('')
  w('| Skill | PR | Category | What it does | Why you reach for it | Risk |')
  w('|---|---|---|---|---|---|')
  for (const row of [...authored.in_flight].sort((a, b) => a.name.localeCompare(b.name))) {
    w(`| \`${row.name}\` | ${row.pr} | \`${row.category}\` | ${row.what} | ${row.why} | ${row.risk} |`)
  }
  w('')
  w('`design/` (PR 20) is not yet in the category enum in `scripts/validate-skill.js` or the')
  w('category labels in `scripts/test-skills-catalog.js`; that pull request adds both. The')
  w('`integrations/` category is in the enum and carries no skills.')
  w('')
  w('---')
  w('')
  w('## Projections')
  w('')
  w(`**${proj.length}** published skills are generated rather than authored here: they carry`)
  w('`kaidera.source` or a generation marker, and are re-rendered from a canonical source')
  w('instead of being edited in place.')
  w('')
  if (inRepo.length > 0) {
    const verb = inRepo.length === 1 ? 'One of them keeps' : `${inRepo.length} of them keep`
    const pronoun = inRepo.length === 1 ? 'its' : 'their'
    w(`${verb} ${pronoun} canonical directory inside this repository `
      + `(${inRepo.map(n => `\`${n}\``).join(', ')}): the flat manifest is generated from`)
    w('the directory of the same name, and `npm test` fails if the two drift.')
    w('')
  }
  if (external.length > 0) {
    const repos = [...new Set(external.map(p => p.repo).filter(Boolean))].sort()
    const where = repos.length > 0 ? repos.map(r => `\`${r}\``).join(' or ') : 'another repository'
    w(`The other ${external.length} are projected from a canonical directory in ${where}: `
      + external.map(p => `\`${p.name}\``).join(', ') + '.')
    w('')
  }
  w('Three consequences, and they are the reason the rename register above withdraws one')
  w('proposal:')
  w('')
  w('1. **A projection is renamed at its source, not here.** Editing the name in this')
  w('   repository is overwritten at the next render and desynchronises the skill from the')
  w('   family it belongs to.')
  w('2. **A projection inherits its family prefix from its source.** A prefix that looks')
  w('   topical here may identify a real shared core upstream, which is exactly when the')
  w('   naming convention says to keep it.')
  w('3. **A `content_sha256` pin is only as good as the source it points at.** If the')
  w('   canonical directory is not resolvable by a reviewer, the pin is an assertion, not')
  w('   evidence. Provenance that cannot be checked is a release hold, not a guarantee.')
  w('')
  w('---')
  w('')
  w('## Consumed third-party skills')
  w('')
  w("Installed into agent trees from their owners' repositories, not published here. Listed")
  w('so a reader can tell “Kaidera does not have a skill for this” apart from “Kaidera')
  w("consumes someone else's”. Every one of them must be pinned in the consuming project's")
  w('`skills-lock.json` with its source, ref and content hash; an unpinned third-party skill')
  w('is an unreproducible dependency.')
  w('')
  w('| Skill | Owner | Licence | What it does |')
  w('|---|---|---|---|')
  for (const row of [...authored.consumed_third_party].sort((a, b) => a.name.localeCompare(b.name))) {
    w(`| \`${row.name}\` | ${row.owner} | ${row.license} | ${row.what} |`)
  }
  w('')
  w('---')
  w('')
  w('## Maintaining this glossary')
  w('')
  w('This file is rendered, not edited. To change it, change `scripts/glossary-prose.json` or')
  w('the manifests, then run `node scripts/render-glossary.js`. `npm test` runs the same')
  w('renderer with `--check` and fails if the committed file is not what the current tree')
  w('produces, so a rename, a category move, a posture change, an addition or a removal')
  w('cannot leave this file silently stale.')
  w('')
  w('The renderer fails rather than guessing when a published skill has no prose entry, and')
  w('when prose exists for a skill this tree does not carry. In-flight candidates and the')
  w('rename register are authored here rather than derived, because neither is in the')
  w('marketplace yet; a candidate whose pull request merges must be moved into `prose` in the')
  w('same commit, and one that is closed without merging must be deleted.')
  w('')
  w('Version numbers are deliberately absent. They drift on every bump and the marketplace')
  w('already carries them. If a row needs a version to be understood, the row is describing')
  w('a release, not a skill.')
  w('')
  w('Keep each `what` to one line and each `why` to one line. The moment a row needs a')
  w('paragraph, the content belongs in the catalogue entry, not here.')
  w('')
  w('## Related documents')
  w('')
  w('- [Kaidera Skills Catalogue and Operating Guide](KAIDERA-SKILLS-CATALOG.md) — authority, posture, routing, debt')
  w('- [Skill format and trust policy](../spec/SKILL_FORMAT.md) — the manifest schema')
  w('- [Static skill evaluations](static-skill-evaluations.md) — routing evidence for the evaluated skills')
  w('- [Generated marketplace](../.claude-plugin/marketplace.json) — machine-readable record')
  w('- [Contributing guide](../CONTRIBUTING.md) — submission and review process')
  w('')

  return out.join('\n')
}

// Reports the first line that differs, so the person hitting this after a rebase knows
// whether to regenerate or investigate instead of staring at "stale".
function firstDrift(committed, rendered) {
  const a = committed.split('\n')
  const b = rendered.split('\n')
  const limit = Math.max(a.length, b.length)
  for (let i = 0; i < limit; i += 1) {
    if (a[i] !== b[i]) {
      const clip = value => JSON.stringify(String(value ?? '<absent>').slice(0, 150))
      return `line ${i + 1}\n  committed: ${clip(a[i])}\n  rendered:  ${clip(b[i])}`
    }
  }
  return 'no line difference (trailing newline or line-ending mismatch)'
}

function main(argv = process.argv.slice(2)) {
  const rendered = render()
  if (argv.includes('--check')) {
    // Compare against the committed bytes and never write on this path, so the check
    // cannot pass by making the file match what it just rendered.
    const committed = fs.existsSync(glossaryPath) ? fs.readFileSync(glossaryPath, 'utf8') : ''
    if (committed !== rendered) {
      console.error('ERROR: docs/SKILLS-GLOSSARY.md does not match what this tree renders.')
      console.error(`First difference at ${firstDrift(committed, rendered)}`)
      console.error('A rename, category move, posture change, addition or removal requires')
      console.error('`node scripts/render-glossary.js` in the same commit. If the committed')
      console.error('wording is the intended text, edit scripts/glossary-prose.json instead.')
      return 1
    }
    console.log(`skills glossary current: ${buildMarketplace().skills.length} published skills`)
    return 0
  }
  fs.writeFileSync(glossaryPath, rendered)
  console.log(`rendered docs/SKILLS-GLOSSARY.md: ${rendered.split('\n').length - 1} lines`)
  return 0
}

if (require.main === module) process.exit(main())
module.exports = { main, render }
