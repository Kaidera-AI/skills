#!/usr/bin/env node

'use strict'

const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const {
  classifyCommand,
  createSuiteValidator,
  evaluatePrompt,
  hashDirectoryTree,
  hashFileRecords,
  normalizeText,
  phraseMatches,
  runEvaluation,
  semanticLint,
  stableStringify,
} = require('./static-skill-eval')

const root = path.join(__dirname, '..')
const fixtureDirectory = path.join('evals', 'static-routing', 'v2')

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex')
}

function classifications(command) {
  return [...classifyCommand(command)].sort()
}

function copyEvaluationRoot() {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'kaidera-static-eval-v2-'))
  const tempRoot = path.join(workspace, 'root')
  fs.mkdirSync(tempRoot)
  for (const directory of ['evals', 'skills', 'spec']) {
    fs.cpSync(path.join(root, directory), path.join(tempRoot, directory), { recursive: true })
  }
  fs.mkdirSync(path.join(tempRoot, 'scripts'))
  for (const script of ['skill-format.js', 'static-skill-eval.js', 'validate-skill.js']) {
    fs.copyFileSync(path.join(root, 'scripts', script), path.join(tempRoot, 'scripts', script))
  }
  fs.copyFileSync(path.join(root, 'package-lock.json'), path.join(tempRoot, 'package-lock.json'))
  return { tempRoot, workspace }
}

function withEvaluationRoot(callback) {
  const copy = copyEvaluationRoot()
  try {
    callback(copy.tempRoot, copy.workspace)
  } finally {
    fs.rmSync(copy.workspace, { force: true, recursive: true })
  }
}

function fixturePath(tempRoot, skill) {
  return path.join(tempRoot, fixtureDirectory, `${skill}.eval.json`)
}

function updateFixture(tempRoot, skill, update) {
  const filePath = fixturePath(tempRoot, skill)
  const fixture = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  update(fixture)
  fs.writeFileSync(filePath, `${JSON.stringify(fixture, null, 2)}\n`)
}

const first = runEvaluation({ root })
const second = runEvaluation({ root })

assert.equal(first.status, 'PASS')
assert.equal(first.schema_version, 2)
assert.equal(first.evaluator_profile, 'kaidera-static-routing-v2')
assert.equal(first.claim, 'STATIC_CONTRACT_ONLY')
assert.equal(first.trust_tier, 'unvetted')
assert.deepEqual(first.summary, {
  suites: 3,
  cases: 17,
  semantic_lint_findings: 0,
  errors: 0,
})
assert.equal(stableStringify(first), stableStringify(second), 'evaluation report and receipts must be deterministic')
assert.deepEqual(first.interpretation_receipts, second.interpretation_receipts)
assert(first.limitations.some(limit => /not model-routing or instruction-following evidence/.test(limit)))
assert(first.limitations.some(limit => /Gate 3.*Gate 4.*HOLD/.test(limit)))
assert(first.suites.every(suite => suite.no_write && suite.no_network))
assert(first.suites.every(suite => /^[0-9a-f]{64}$/.test(suite.fixture_sha256)))
assert(first.suites.every(suite => /^[0-9a-f]{64}$/.test(suite.skill_sha256)))

const receipts = first.interpretation_receipts
assert.equal(receipts.evaluator.sha256, sha256(fs.readFileSync(path.join(root, receipts.evaluator.path))))
assert.match(receipts.evaluator.bundle_sha256, /^[0-9a-f]{64}$/)
for (const supportFile of receipts.evaluator.support_files) {
  assert.equal(supportFile.sha256, sha256(fs.readFileSync(path.join(root, supportFile.path))))
}
const evaluatorFiles = [{ path: receipts.evaluator.path }, ...receipts.evaluator.support_files]
  .map(file => ({ path: file.path, bytes: fs.readFileSync(path.join(root, file.path)) }))
assert.equal(receipts.evaluator.bundle_sha256, hashFileRecords(evaluatorFiles))
assert.notEqual(
  hashFileRecords([
    { path: 'a', bytes: Buffer.from('Xb\0') },
    { path: 'c', bytes: Buffer.from('Y') },
  ]),
  hashFileRecords([
    { path: 'a', bytes: Buffer.from('X') },
    { path: 'b', bytes: Buffer.from('c\0Y') },
  ]),
  'length-prefixed tree records must distinguish path/content boundary shifts',
)
assert.equal(receipts.schema.sha256, sha256(fs.readFileSync(path.join(root, receipts.schema.path))))
assert.equal(receipts.package_lock.sha256, sha256(fs.readFileSync(path.join(root, receipts.package_lock.path))))
assert.equal(receipts.runtime.node, process.version)
const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'))
assert.deepEqual(
  receipts.dependencies.map(dependency => dependency.name),
  Object.keys(lock.packages).filter(packagePath => packagePath.startsWith('node_modules/'))
    .map(packagePath => packagePath.slice('node_modules/'.length)).sort(),
)
for (const dependency of receipts.dependencies) {
  assert.equal(dependency.version, lock.packages[`node_modules/${dependency.name}`].version)
  const packageJsonPath = fs.realpathSync.native(require.resolve(`${dependency.name}/package.json`))
  assert.equal(dependency.package_json_sha256, sha256(fs.readFileSync(packageJsonPath)))
  const packageTree = hashDirectoryTree(path.dirname(packageJsonPath))
  assert.equal(dependency.package_tree_sha256, packageTree.sha256)
  assert.equal(dependency.package_tree_files, packageTree.files)
  assert.equal(dependency.package_tree_bytes, packageTree.bytes)
}
for (const suite of first.suites) {
  assert.equal(suite.fixture_sha256, sha256(fs.readFileSync(path.join(root, suite.fixture_path))))
  assert.equal(suite.skill_sha256, sha256(fs.readFileSync(path.join(root, suite.skill_path))))
}

const outcomes = new Map(first.cases.map(item => [`${item.suite}/${item.case}`, item.static_result]))
assert.deepEqual(outcomes.get('open-code-review/bounded-staged-review'), {
  outcome: 'route', route: 'open-code-review', candidates: ['open-code-review'], reason: 'single-match',
})
assert.deepEqual(outcomes.get('open-code-review/bounded-commit-review'), {
  outcome: 'route', route: 'open-code-review', candidates: ['open-code-review'], reason: 'single-match',
})
assert.deepEqual(outcomes.get('open-code-review/substring-non-match'), {
  outcome: 'abstain', route: null, candidates: [], reason: 'no-match',
})
assert.deepEqual(outcomes.get('research-brief/browser-answer-substring-route'), {
  outcome: 'route', route: 'research-brief', candidates: ['research-brief'], reason: 'single-match',
})
assert.deepEqual(outcomes.get('research-brief/review-brief-collision'), {
  outcome: 'manual-only', route: null, candidates: ['open-code-review', 'research-brief'], reason: 'multi-skill-collision',
})
assert.deepEqual(outcomes.get('assumption-validation/production-evidence-boundary'), {
  outcome: 'manual-only', route: null, candidates: ['assumption-validation'], reason: 'safety-boundary',
})

assert.equal(phraseMatches(normalizeText('preview our commitment'), 'review'), false)
assert.equal(phraseMatches(normalizeText('preview our commitment'), 'commit'), false)
assert.equal(phraseMatches(normalizeText('implementation prefixes'), 'implement'), false)
assert.equal(phraseMatches(normalizeText('implementation prefixes'), 'fixes'), false)
assert.equal(phraseMatches(normalizeText('browser answer'), 'browse'), false)
assert.equal(phraseMatches(normalizeText('review the commit'), 'review'), true)

const validateSuite = createSuiteValidator(root)
assert.equal(validateSuite({ schema_version: 2 }), false, 'incomplete fixture must fail the schema')
assert(validateSuite.errors.some(error => error.keyword === 'required'))

assert.deepEqual(classifications('git diff --cached'), ['read'])
assert.deepEqual(classifications('git push origin main'), ['network', 'write'])
assert.deepEqual(classifications('git rm obsolete.txt'), ['write'])
assert.deepEqual(classifications('git branch release'), ['write'])
assert.deepEqual(classifications('git ls-remote origin'), ['network'])
assert.deepEqual(classifications('apt-get install jq'), ['network', 'write'])
assert.deepEqual(classifications('npm view lodash version'), ['network'])
assert.deepEqual(classifications('pnpm view lodash version'), ['network'])
assert.deepEqual(classifications('cargo search serde'), ['network'])
assert.deepEqual(classifications('find . -delete'), ['read', 'write'])
assert.deepEqual(classifications('find . -exec cat {} ;'), ['read', 'unknown'])
assert.deepEqual(classifications('find . -fprint result.txt'), ['read', 'write'])
assert.deepEqual(classifications("sed -n '1,5p' README.md"), ['read'])
assert.deepEqual(classifications("sed -i '' README.md"), ['read', 'write'])
assert.deepEqual(classifications("awk '{print $1}' README.md"), ['read'])
assert.deepEqual(classifications('Invoke-WebRequest https://example.test'), ['network'])
assert.deepEqual(classifications('Remove-Item result.txt'), ['write'])
assert.deepEqual(classifications('Set-Content result.txt value'), ['write'])
assert.deepEqual(classifications('Get-Content README.md'), ['read'])
assert.deepEqual(classifications('node unknown-script.js'), ['unknown'])
assert.deepEqual(classifications('printf x > result.txt'), ['write'])
assert.deepEqual(classifications('printf x >> result.txt'), ['write'])
assert.deepEqual(classifications('echo hi >& result.txt'), ['write'])
assert.deepEqual(classifications('echo hi >&2.log'), ['write'])
assert.deepEqual(classifications('echo hi >&2foo'), ['write'])
assert.deepEqual(classifications('echo hi 1>&2'), [])
assert.deepEqual(classifications('true & curl https://example.test'), ['unknown'])

const restrictive = { no_write: true, no_network: true }
const declared = ['tool:code_interpreter', 'tool:file_read']
const dangerousBody = [
  '```bash',
  'git push origin main',
  'apt-get install jq',
  'find . -delete',
  'cat README.md',
  '```',
].join('\n')
assert.deepEqual(semanticLint(dangerousBody, declared, restrictive).map(finding => finding.code), [
  'STATIC_LINT_NETWORK_COMMAND',
  'STATIC_LINT_WRITE_COMMAND',
  'STATIC_LINT_NETWORK_COMMAND',
  'STATIC_LINT_WRITE_COMMAND',
  'STATIC_LINT_WRITE_COMMAND',
])
assert.deepEqual(semanticLint('```powershell\nInvoke-WebRequest https://example.test\nRemove-Item result.txt\n```', declared, restrictive)
  .map(finding => finding.code), ['STATIC_LINT_NETWORK_COMMAND', 'STATIC_LINT_WRITE_COMMAND'])
assert.deepEqual(semanticLint('```bash\nnode unknown-script.js\n```', declared, restrictive)
  .map(finding => finding.code), ['STATIC_LINT_UNKNOWN_COMMAND'])
assert.deepEqual(semanticLint('```bash\ntrue & curl https://example.test\n```', declared, restrictive)
  .map(finding => finding.code), ['STATIC_LINT_UNKNOWN_COMMAND'])
assert.deepEqual(semanticLint('```bash\necho hi >& result.txt\n```', declared, restrictive)
  .map(finding => finding.code), ['STATIC_LINT_WRITE_COMMAND'])
assert.deepEqual(semanticLint('```bash\necho hi >&2.log\n```', declared, restrictive)
  .map(finding => finding.code), ['STATIC_LINT_WRITE_COMMAND'])
assert.deepEqual(semanticLint('```bash\nnpm view lodash version\nfind . -fprint result.txt\n```', declared, restrictive)
  .map(finding => finding.code), ['STATIC_LINT_NETWORK_COMMAND', 'STATIC_LINT_WRITE_COMMAND'])
assert.deepEqual(semanticLint('```bash\ncat README.md\n```', ['tool:file_read'], restrictive)
  .map(finding => finding.code), ['STATIC_LINT_UNDECLARED_CODE_INTERPRETER'])
assert.deepEqual(semanticLint('```bash\ncat README.md\n```', declared, restrictive), [])
assert.deepEqual(semanticLint('The words curl and git push in prose are not executable examples.\n```json\n{"command":"curl x"}\n```', [], restrictive), [])

withEvaluationRoot(tempRoot => {
  updateFixture(tempRoot, 'open-code-review', fixture => {
    fixture.contract.capability_ceiling.push('tool:file_write', 'tool:web_search', 'tool:mcp_external')
  })
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /capability_ceiling/.test(error)))
})

withEvaluationRoot(tempRoot => {
  updateFixture(tempRoot, 'open-code-review', fixture => {
    fixture.routing.route_when_any.push(['implement', 'fixes'])
  })
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /shadowed route_when_any/.test(error)))
  assert(report.errors.some(error => /no outcome-distinguishing positive route case/.test(error)))
})

withEvaluationRoot(tempRoot => {
  updateFixture(tempRoot, 'open-code-review', fixture => {
    fixture.cases = fixture.cases.filter(testCase => testCase.id !== 'bounded-commit-review')
  })
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /\["commit","review"\].*no outcome-distinguishing positive route case/.test(error)))
})

withEvaluationRoot(tempRoot => {
  updateFixture(tempRoot, 'research-brief', fixture => {
    fixture.cases = fixture.cases.filter(testCase => testCase.id !== 'publish-report-boundary')
    fixture.cases.find(testCase => testCase.id === 'conduct-research-boundary').prompt =
      'Browse the web, answer the research question, and publish the report now.'
  })
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.filter(error => /no outcome-distinguishing safety-boundary case/.test(error)).length >= 2)
})

withEvaluationRoot(tempRoot => {
  updateFixture(tempRoot, 'assumption-validation', fixture => {
    fixture.routing.route_when_any.push(['validate', 'assumption', 'pricing'])
  })
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /redundant route_when_any/.test(error)))
})

withEvaluationRoot(tempRoot => {
  const filePath = fixturePath(tempRoot, 'assumption-validation')
  fs.writeFileSync(filePath, `# YAML comment is not JSON\n${fs.readFileSync(filePath, 'utf8')}`)
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /must contain strict JSON/.test(error)))
})

withEvaluationRoot(tempRoot => {
  const filePath = fixturePath(tempRoot, 'assumption-validation')
  const bytes = fs.readFileSync(filePath)
  fs.writeFileSync(filePath, Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), bytes]))
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /must not contain a UTF-8 BOM/.test(error)))
})

withEvaluationRoot(tempRoot => {
  const filePath = fixturePath(tempRoot, 'assumption-validation')
  const source = fs.readFileSync(filePath, 'utf8').replace(
    '"schema_version": 2,',
    '"schema_version": 2,\n  "schema_version": 2,',
  )
  fs.writeFileSync(filePath, source)
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /Map keys must be unique/.test(error)))
})

if (process.platform !== 'win32') {
  withEvaluationRoot((tempRoot, workspace) => {
    const development = path.join(tempRoot, 'skills', 'development')
    const outside = path.join(workspace, 'external-development')
    fs.renameSync(development, outside)
    fs.symlinkSync(outside, development, 'dir')
    const report = runEvaluation({ root: tempRoot })
    assert.equal(report.status, 'FAIL')
    assert(report.errors.some(error => /path component is a symlink: skills\/development/.test(error)))
  })

  withEvaluationRoot((tempRoot, workspace) => {
    const schemaDirectory = path.join(tempRoot, 'spec')
    const outside = path.join(workspace, 'external-spec')
    fs.renameSync(schemaDirectory, outside)
    fs.symlinkSync(outside, schemaDirectory, 'dir')
    assert.throws(() => runEvaluation({ root: tempRoot }), /path component is a symlink: spec/)
  })

  withEvaluationRoot((tempRoot, workspace) => {
    const profileDirectory = path.join(tempRoot, fixtureDirectory)
    const outside = path.join(workspace, 'external-profile')
    fs.renameSync(profileDirectory, outside)
    fs.symlinkSync(outside, profileDirectory, 'dir')
    assert.throws(() => runEvaluation({ root: tempRoot }), /fixture path component is a symlink/)
  })
}

withEvaluationRoot(tempRoot => {
  const oldProfile = path.join(tempRoot, 'evals', 'static-routing', 'v1')
  fs.mkdirSync(oldProfile)
  fs.copyFileSync(fixturePath(tempRoot, 'open-code-review'), path.join(oldProfile, 'open-code-review.eval.json'))
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /unsupported fixture profile directory/.test(error)))
})

withEvaluationRoot(tempRoot => {
  const lockPath = path.join(tempRoot, 'package-lock.json')
  const changedLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'))
  changedLock.packages['node_modules/ajv'].version = '0.0.0-test'
  fs.writeFileSync(lockPath, `${JSON.stringify(changedLock, null, 2)}\n`)
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /resolved ajv@.*does not match lock version/.test(error)))
})

withEvaluationRoot(tempRoot => {
  fs.appendFileSync(path.join(tempRoot, 'scripts', 'static-skill-eval.js'), '\n// changed evaluator specimen\n')
  const report = runEvaluation({ root: tempRoot })
  assert.equal(report.status, 'FAIL')
  assert(report.errors.some(error => /repository bytes do not match the running evaluator implementation/.test(error)))
})

const routingSuites = first.suites.map(suite => ({
  skill: suite.skill,
  routing: JSON.parse(fs.readFileSync(path.join(root, suite.fixture_path), 'utf8')).routing,
}))
assert.equal(evaluatePrompt('Please preview our commitment schedule.', routingSuites).outcome, 'abstain')

console.log('Static skill evaluation v2 schema, routing, containment, receipts, ceilings, and bounded lint tests passed')
