#!/usr/bin/env node
'use strict'
// Regenerates the machine-checked fields of every `kaidera-skill-catalog-entry` marker in
// docs/KAIDERA-SKILLS-CATALOG.md from the built marketplace (the same source
// scripts/test-skills-catalog.js checks against). Posture and legacy classification are
// reviewed policy and are kept exactly as written; a marker whose skill no longer exists is
// reported, never invented. Usage: node scripts/update-catalog-markers.js [--check]
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
  for (const name of missing) console.error(`ERROR: marker ${name} has no marketplace skill`)
  if (check) {
    if (changed || missing.length) { console.error(`${changed} stale marker(s)`); return 1 }
    console.log('catalogue markers current'); return 0
  }
  if (updated !== content) fs.writeFileSync(catalogPath, updated)
  console.log(`${changed} marker(s) rewritten, ${skills.length} skills`)
  return missing.length ? 1 : 0
}
if (require.main === module) process.exit(main())
module.exports = { main, reviewFingerprint }
