#!/usr/bin/env node

'use strict'

const assert = require('node:assert/strict')
const path = require('node:path')
const {
  classifyCommand,
  createSuiteValidator,
  runEvaluation,
  semanticLint,
  stableStringify,
} = require('./static-skill-eval')

const root = path.join(__dirname, '..')
const first = runEvaluation({ root })
const second = runEvaluation({ root })

assert.equal(first.status, 'PASS')
assert.equal(first.claim, 'STATIC_CONTRACT_ONLY')
assert.equal(first.trust_tier, 'unvetted')
assert.deepEqual(first.summary, {
  suites: 3,
  cases: 12,
  semantic_lint_findings: 0,
  errors: 0,
})
assert.equal(stableStringify(first), stableStringify(second), 'evaluation report must be deterministic')
assert(first.limitations.some(limit => /not model-routing or instruction-following evidence/.test(limit)))
assert(first.limitations.some(limit => /Gate 3.*Gate 4.*HOLD/.test(limit)))
assert(first.suites.every(suite => suite.no_write && suite.no_network))
assert(first.suites.every(suite => /^[0-9a-f]{64}$/.test(suite.fixture_sha256)))
assert(first.suites.every(suite => /^[0-9a-f]{64}$/.test(suite.skill_sha256)))

const outcomes = new Map(first.cases.map(item => [`${item.suite}/${item.case}`, item.static_result]))
assert.deepEqual(outcomes.get('open-code-review/bounded-staged-review'), {
  outcome: 'route',
  route: 'open-code-review',
  candidates: ['open-code-review'],
  reason: 'single-match',
})
assert.deepEqual(outcomes.get('assumption-validation/ordinary-unit-tests'), {
  outcome: 'abstain',
  route: null,
  candidates: [],
  reason: 'no-match',
})
assert.deepEqual(outcomes.get('research-brief/review-brief-collision'), {
  outcome: 'manual-only',
  route: null,
  candidates: ['open-code-review', 'research-brief'],
  reason: 'multi-skill-collision',
})
assert.deepEqual(outcomes.get('assumption-validation/production-evidence-boundary'), {
  outcome: 'manual-only',
  route: null,
  candidates: ['assumption-validation'],
  reason: 'safety-boundary',
})

const validateSuite = createSuiteValidator(root)
assert.equal(validateSuite({ schema_version: 1 }), false, 'incomplete fixture must fail the schema')
assert(validateSuite.errors.some(error => error.keyword === 'required'))

assert.deepEqual([...classifyCommand('git diff --cached')], ['read'])
assert.deepEqual([...classifyCommand('git push origin main')].sort(), ['network', 'write'])
assert.deepEqual([...classifyCommand('curl https://example.test')], ['network'])
assert.deepEqual([...classifyCommand('printf x > result.txt')], ['write'])

const restrictive = { no_write: true, no_network: true }
const dangerousBody = [
  '```bash',
  'git push origin main',
  'curl https://example.test',
  'printf x > result.txt',
  'cat README.md',
  '```',
].join('\n')
const dangerousFindings = semanticLint(dangerousBody, [], restrictive)
assert.deepEqual(dangerousFindings.map(finding => finding.code), [
  'STATIC_LINT_NETWORK_COMMAND',
  'STATIC_LINT_WRITE_COMMAND',
  'STATIC_LINT_NETWORK_COMMAND',
  'STATIC_LINT_WRITE_COMMAND',
  'STATIC_LINT_UNDECLARED_FILE_READ',
])

const nonExecutableBody = [
  'The words curl and git push in prose are not executable examples.',
  '```json',
  '{"command":"curl https://example.test"}',
  '```',
].join('\n')
assert.deepEqual(semanticLint(nonExecutableBody, [], restrictive), [])
assert.deepEqual(semanticLint('```bash\ncat README.md\n```', ['tool:file_read'], restrictive), [])

console.log('Static skill evaluation schema, routing fixtures, ceilings, and bounded lint tests passed')
