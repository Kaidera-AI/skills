#!/usr/bin/env node

'use strict'

const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { spawnSync } = require('node:child_process')
const os = require('node:os')

const root = path.join(__dirname, '..')
const skillPath = path.join(root, 'skills', 'development', 'open-code-review.SKILL.md')
const marketplacePath = path.join(root, '.claude-plugin', 'marketplace.json')
const generatorPath = path.join(root, 'scripts', 'generate-marketplace.js')
const validatorPath = path.join(root, 'scripts', 'validate-skill.js')

const skill = fs.readFileSync(skillPath, 'utf8')
const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'))
const entry = marketplace.skills.find(item => item.name === 'open-code-review')
const dryRunOutput = execFileSync(process.execPath, [generatorPath, '--dry-run'], {
  encoding: 'utf8',
})
const dryRunMarker = '\n\nDry run:'
assert(dryRunOutput.includes(dryRunMarker), 'marketplace dry run must include its summary marker')
const dryRunMarketplace = JSON.parse(dryRunOutput.slice(0, dryRunOutput.lastIndexOf(dryRunMarker)))
const dryRunEntry = dryRunMarketplace.skills.find(item => item.name === 'open-code-review')

assert(entry, 'open-code-review must be present in marketplace.json')
assert(dryRunEntry, 'open-code-review must be present in marketplace dry-run output')
assert.equal(entry.version, '2.0.0')
assert.equal(entry.risk_level, 'medium')
assert.deepEqual(entry.capabilities_required, ['tool:file_read', 'tool:code_interpreter'])
assert(!entry.capabilities_required.some(capability => capability.startsWith('-')))
assert.equal(entry.attribution_author, 'Alibaba OpenCodeReview contributors')
assert.equal(
  entry.attribution_url,
  'https://github.com/alibaba/open-code-review/tree/0c44f1049e054b062b8900b93a4828f7b0baf77b',
)
assert(entry.attribution_notes.includes('0c44f1049e054b062b8900b93a4828f7b0baf77b'))
assert.deepEqual(dryRunEntry, entry, 'committed marketplace entry must match a fresh generation')

const body = skill.split('---').slice(2).join('---').trim()
const expectedHash = crypto.createHash('sha256').update(body, 'utf8').digest('hex')
const cliHash = execFileSync(process.execPath, [generatorPath, '--hash', skillPath], {
  encoding: 'utf8',
}).trim()
assert.equal(cliHash, expectedHash)
assert.equal(entry.content_hash, expectedHash)

for (const required of [
  'Target before interpretation',
  'Every changed path is accounted for',
  'Material findings face a refuter',
  'INCOMPLETE (target drift)',
  'Optional Alibaba OpenCodeReview adapter',
]) {
  assert(skill.includes(required), `missing review invariant: ${required}`)
}

for (const forbidden of [
  'tool:file_write',
  'Precision: > 85%',
  'Default bundle size: 3-5 files',
  'Add to `packages/core/src/session/tools.ts`',
]) {
  assert(!skill.includes(forbidden), `obsolete v1 contract survived: ${forbidden}`)
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'open-code-review-contract-'))
const fixturePath = path.join(fixtureRoot, 'open-code-review.SKILL.md')

function expectValidationFailure(mutatedSkill, expectedMessage) {
  fs.writeFileSync(fixturePath, mutatedSkill)
  const result = spawnSync(process.execPath, [validatorPath, '--strict', fixturePath], {
    cwd: root,
    encoding: 'utf8',
  })
  assert.notEqual(result.status, 0, `validator accepted invalid fixture: ${expectedMessage}`)
  assert(
    `${result.stdout}\n${result.stderr}`.includes(expectedMessage),
    `validator did not report expected failure: ${expectedMessage}`,
  )
}

try {
  fs.writeFileSync(fixturePath, skill)
  execFileSync(process.execPath, [path.join(root, 'scripts', 'update-hash.js'), fixturePath, cliHash], {
    cwd: root,
    encoding: 'utf8',
  })
  assert(
    fs.readFileSync(fixturePath, 'utf8').includes(`content_hash: "${cliHash}"`),
    'publisher hash updater must store the generator hash unchanged',
  )
  expectValidationFailure(
    skill.replace('    - tool:file_read', '    - tool:root_shell'),
    'Invalid capability: tool:root_shell',
  )
  expectValidationFailure(
    `${skill}\n[undeclared domain](https://example.invalid/review)\n`,
    'Referenced domain is not allowlisted: example.invalid',
  )
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true })
}

console.log('open-code-review marketplace and contract checks passed')
