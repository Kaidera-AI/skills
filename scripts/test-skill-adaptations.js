#!/usr/bin/env node

'use strict'

const assert = require('node:assert/strict')
const path = require('node:path')
const { buildMarketplace } = require('./generate-marketplace')
const { computeContentHash } = require('./skill-format')
const { validateSkill } = require('./validate-skill')

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
  const manifest = frontmatter.engenai

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

assert.equal(marketplace.skills.length, 27)
assert.equal(new Set(marketplace.skills.map(item => item.name)).size, 27)

console.log('David-inspired skill adaptation contracts passed')
