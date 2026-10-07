#!/usr/bin/env node
'use strict'
// Regenerates the machine-checked fields of docs/KAIDERA-SKILLS-CATALOG.md from the built
// marketplace (the same source scripts/test-skills-catalog.js checks against):
//   - every `kaidera-skill-catalog-entry` marker's category, path, version, capabilities,
//     risk, trust tier and review fingerprint;
//   - the at-a-glance table's Category, Skill and Version cells.
// Posture, legacy classification, and the at-a-glance Function/Posture/Risk cells are reviewed
// or authored text and are kept exactly as written. A marker or row whose skill no longer
// exists is reported, never invented. Both passes look a skill up by its current name, so a
// rename must be applied to the marker and to the row's name cell by hand first.
// Usage: node scripts/update-catalog-markers.js [--check]
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { buildMarketplace } = require('./generate-marketplace')

const root = path.join(__dirname, '..')
const catalogPath = path.join(root, 'docs', 'KAIDERA-SKILLS-CATALOG.md')
const markerPattern = /^<!-- kaidera-skill-catalog-entry (\{[^\r\n]+\}) -->$/gm

function canonicalValue(value) {
  if (Array.isArray(value)) return value.map(canonicalValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalValue(value[key])]))
  }
  return value
}
function reviewFingerprint(skill) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalValue(skill)), 'utf8').digest('hex')
}


const CATEGORY_LABELS = new Map([
  ['context', 'Context'],
  ['development', 'Development'],
  ['devops', 'DevOps'],
  ['documentation', 'Documentation'],
  ['legacy', 'Legacy'],
  ['research', 'Research'],
  ['security', 'Security'],
])

// test-skills-catalog.js compares the at-a-glance Category, Skill and Version cells against
// the marketplace, but nothing regenerated them, so every version bump or category move left
// them stale until the test failed. Repair them here, inside the glance table only, and leave
// the authored Function, Posture and Risk cells untouched.
function repairGlanceCells(content, skills) {
  const byName = new Map(skills.map(skill => [skill.name, skill]))
  const lines = content.split('\n')
  const start = lines.findIndex(line => line === '## Catalogue at a glance')
  if (start === -1) return { text: content, repaired: 0 }
  let end = lines.length
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].startsWith('## ')) { end = i; break }
  }
  let repaired = 0
  for (let i = start; i < end; i += 1) {
    const match = lines[i].match(/^\| [^|]* \| `([a-z0-9-]+)` \| `[^|]*` \|/)
    if (!match) continue
    const skill = byName.get(match[1])
    const label = skill && CATEGORY_LABELS.get(skill.category)
    if (!label) continue
    const cells = lines[i].split('|')
    const rendered = [cells[0], ` ${label} `, ` \`${skill.name}\` `, ` \`${skill.version}\` `,
      ...cells.slice(4)].join('|')
    if (rendered !== lines[i]) { lines[i] = rendered; repaired += 1 }
  }
  return { text: lines.join('\n'), repaired }
}

function main(argv = process.argv.slice(2)) {
  const check = argv.includes('--check')
  const skills = buildMarketplace().skills
  const byName = new Map(skills.map(skill => [skill.name, skill]))
  const content = fs.readFileSync(catalogPath, 'utf8')
  const missing = []
  let changed = 0
  const updated = content.replace(markerPattern, (line, json) => {
    const marker = JSON.parse(json)
    const skill = byName.get(marker.name)
    if (!skill) { missing.push(marker.name); return line }
    const next = {
      capabilities_required: skill.capabilities_required,
      category: skill.category,
      legacy: marker.legacy,
      name: skill.name,
      path: skill.file,
      posture: marker.posture,
      review_fingerprint: reviewFingerprint(skill),
      risk_level: skill.risk_level,
      trust_tier: skill.trust_tier,
      version: skill.version,
    }
    const rendered = `<!-- kaidera-skill-catalog-entry ${JSON.stringify(next)} -->`
    if (rendered !== line) changed += 1
    return rendered
  })
  const glance = repairGlanceCells(updated, skills)
  const final = glance.text
  for (const name of missing) console.error(`ERROR: marker ${name} has no marketplace skill`)
  if (check) {
    if (changed || glance.repaired || missing.length) {
      console.error(`${changed} stale marker(s), ${glance.repaired} stale at-a-glance row(s)`)
      return 1
    }
    console.log('catalogue markers and at-a-glance identity cells current')
    return 0
  }
  if (final !== content) fs.writeFileSync(catalogPath, final)
  console.log(`${changed} marker(s) and ${glance.repaired} at-a-glance row(s) rewritten, `
    + `${skills.length} skills`)
  return missing.length ? 1 : 0
}
if (require.main === module) process.exit(main())
module.exports = { main, reviewFingerprint }
