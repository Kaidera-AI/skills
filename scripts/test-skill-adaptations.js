#!/usr/bin/env node

'use strict'

const assert = require('node:assert/strict')
const os = require('node:os')
const path = require('node:path')
const fs = require('fs')
const { buildMarketplace } = require('./generate-marketplace')
const { computeContentHash } = require('./skill-format')
const { LEGACY_MANIFEST_KEY_CUTOFF, TODAY_OVERRIDE_ENV, validateSkill } = require('./validate-skill')

const root = path.join(__dirname, '..')
const donorCommit = '69c3ae5228eb146724fd23dac3d43eab5805bcc3'
const cases = [
  {
    name: 'assumption-validation',
    category: 'development',
    risk: 'medium',
    capabilities: ['tool:file_read', 'tool:code_interpreter'],
    relativePath: 'skills/development/assumption-validation.SKILL.md',
    donorPath: 'skills/ops-and-setup/risky-changes',
    requiredBody: [
      /Correctness:/,
      /Validity:/,
      /PROCEED/,
      /CHANGE THE DESIGN/,
      /HOLD — insufficient evidence/,
      /Human decision gate/,
    ],
    requiredSafety: [/production systems/i, /customer data/, /secrets/, /paid services/, /Do not implement/],
  },
  {
    name: 'research-brief',
    category: 'research',
    risk: 'low',
    capabilities: ['tool:file_read'],
    relativePath: 'skills/research/research-brief.SKILL.md',
    donorPath: 'skills/research-and-web/research-prompt',
    requiredBody: [
      /This\s+skill stops after drafting the brief/,
      /one primary decision question/,
      /Define the evidence contract/,
      /contradiction, counterexample, and gap pass/,
      /Brief template/,
    ],
    requiredSafety: [/Draft only/, /Do not browse/, /Do not put secrets/, /Preserve the user's decision/],
  },
]

const marketplace = buildMarketplace()

for (const candidate of cases) {
  const filePath = path.join(root, candidate.relativePath)
  const result = validateSkill(filePath, { strict: true })
  assert.deepEqual(result.errors, [], `${candidate.name} must pass strict validation`)
  const { frontmatter, body } = result.parsed
  const manifest = frontmatter.kaidera

  assert.equal(frontmatter.name, candidate.name)
  assert.equal(manifest.category, candidate.category)
  assert.equal(manifest.trust_tier, 'unvetted')
  assert.equal(manifest.risk_level, candidate.risk)
  assert.deepEqual(manifest.capabilities_required, candidate.capabilities)
  assert.deepEqual(manifest.allowed_domains, ['github.com'])
  assert.equal(manifest.content_hash, '')
  assert.equal(manifest.signed_by, '')
  assert.equal(manifest.last_reviewed, '')
  assert.equal(manifest.reviewer, '')
  assert.equal(frontmatter.attribution_author, 'David Ondrej')
  assert.equal(
    frontmatter.attribution_url,
    `https://github.com/davidondrej/skills/tree/${donorCommit}/${candidate.donorPath}`,
  )
  assert(frontmatter.attribution_notes.includes(donorCommit))

  for (const pattern of candidate.requiredBody) assert.match(body, pattern)
  const safety = frontmatter.safety_constraints.join('\n')
  for (const pattern of candidate.requiredSafety) assert.match(safety, pattern)

  assert(!manifest.capabilities_required.includes('tool:web_search'))
  assert(!manifest.capabilities_required.includes('tool:mcp_external'))
  assert(!manifest.capabilities_required.includes('tool:file_write'))
  assert.doesNotMatch(body, /deepapi\.co|DEEPAPI_API_KEY|\bcurl\b|POST \/v1\/|source ~\//i)

  const entry = marketplace.skills.find(item => item.name === candidate.name)
  assert(entry, `${candidate.name} must be present in the generated catalogue`)
  assert.equal(entry.file, candidate.relativePath)
  assert.equal(entry.content_hash, computeContentHash(body))
  assert.equal(entry.trust_tier, 'unvetted')
  assert.deepEqual(entry.capabilities_required, candidate.capabilities)
}

const skillFileCount = fs.readdirSync(path.join(__dirname, '..', 'skills'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .reduce((total, entry) => total + fs.readdirSync(path.join(__dirname, '..', 'skills', entry.name))
    .filter(name => name.endsWith('.SKILL.md')).length, 0)
assert.equal(marketplace.skills.length, skillFileCount)
assert.equal(new Set(marketplace.skills.map(item => item.name)).size, skillFileCount)

// Validator contract: the legacy `engenai:` manifest key is a dated decision (renamed 2026-09-03,
// rejected from LEGACY_MANIFEST_KEY_CUTOFF). Both sides of the cutoff run through the date override.
function withToday(value, callback) {
  const previous = process.env[TODAY_OVERRIDE_ENV]
  if (value === undefined) delete process.env[TODAY_OVERRIDE_ENV]
  else process.env[TODAY_OVERRIDE_ENV] = value
  try {
    return callback()
  } finally {
    if (previous === undefined) delete process.env[TODAY_OVERRIDE_ENV]
    else process.env[TODAY_OVERRIDE_ENV] = previous
  }
}

function manifestSkill(manifestKeys) {
  const manifestBody = [
    '  category: development',
    '  trust_tier: unvetted',
    '  risk_level: low',
    '  capabilities_required: []',
    '  allowed_domains: []',
    '  content_hash: ""',
    '  signed_by: ""',
    '  last_reviewed: ""',
    '  reviewer: ""',
  ].join('\n')
  return [
    '---',
    'name: legacy-key',
    'version: 1.0.0',
    'description: Legacy manifest key fixture.',
    ...manifestKeys.map(key => `${key}:\n${manifestBody}`),
    'author: kaidera',
    'license: Apache-2.0',
    'updated: 2026-09-04',
    'safety_constraints:',
    '  - Fixture only.',
    '---',
    '',
    '# Legacy key',
    '',
    'Fixture body.',
    '',
  ].join('\n')
}

assert.equal(LEGACY_MANIFEST_KEY_CUTOFF, '2026-12-31')
const legacyWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'kaidera-legacy-key-'))
try {
  const legacyPath = path.join(legacyWorkspace, 'skills', 'development', 'legacy-key.SKILL.md')
  fs.mkdirSync(path.dirname(legacyPath), { recursive: true })
  const rejected = /legacy manifest key engenai: is rejected from 2026-12-31/

  fs.writeFileSync(legacyPath, manifestSkill(['engenai']))
  const before = withToday('2026-12-30', () => validateSkill(legacyPath))
  assert.deepEqual(before.errors, [], 'legacy key must validate before the cutoff')
  assert(before.warnings.some(warning => /legacy manifest key engenai: normalised to kaidera:/.test(warning)),
    'legacy key must warn before the cutoff')
  assert.equal(before.parsed.frontmatter.engenai, undefined)
  assert.equal(before.parsed.frontmatter.kaidera.category, 'development')
  for (const today of ['2026-12-31', '2027-01-01']) {
    const after = withToday(today, () => validateSkill(legacyPath))
    assert(after.errors.some(error => rejected.test(error)), `legacy key must be an error on ${today}`)
  }
  const clock = withToday(undefined, () => validateSkill(legacyPath))
  const clockPastCutoff = new Date().toISOString().slice(0, 10) >= LEGACY_MANIFEST_KEY_CUTOFF
  assert.equal(clock.errors.some(error => rejected.test(error)), clockPastCutoff,
    'without an override the validator must follow the clock')
  const malformed = withToday('yesterday', () => validateSkill(legacyPath))
  assert(malformed.errors.some(error => error.includes(TODAY_OVERRIDE_ENV)), 'malformed override must be an error')
  assert(malformed.errors.some(error => rejected.test(error)), 'malformed override must not accept the legacy key')

  fs.writeFileSync(legacyPath, manifestSkill(['kaidera', 'engenai']))
  for (const today of ['2026-12-30', '2027-01-01']) {
    const combined = withToday(today, () => validateSkill(legacyPath))
    assert(combined.errors.some(error => /cannot be combined with kaidera:/.test(error)),
      `combined keys must be an error on ${today}`)
  }

  fs.writeFileSync(legacyPath, manifestSkill(['kaidera']))
  for (const today of ['2026-12-30', '2027-01-01']) {
    const current = withToday(today, () => validateSkill(legacyPath))
    assert.deepEqual(current.errors, [], `kaidera: key must validate on ${today}`)
    assert.deepEqual(current.warnings, [])
  }
} finally {
  fs.rmSync(legacyWorkspace, { force: true, recursive: true })
}

console.log('David-inspired skill adaptation contracts and validator legacy-key cutoff cases passed')
