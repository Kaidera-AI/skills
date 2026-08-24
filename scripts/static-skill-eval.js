#!/usr/bin/env node

'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const Ajv2020 = require('ajv/dist/2020')
const YAML = require('yaml')
const { parseSkillContent, readSkillFile } = require('./skill-format')
const { validateSkill } = require('./validate-skill')

const PROFILE = 'kaidera-static-routing-v1'
const MAX_EVAL_BYTES = 1024 * 1024
const SHELL_FENCE_LANGUAGES = new Set(['bash', 'console', 'powershell', 'pwsh', 'sh', 'shell', 'zsh'])
const NETWORK_COMMANDS = new Set(['curl', 'ftp', 'nc', 'ncat', 'netcat', 'scp', 'sftp', 'ssh', 'telnet', 'wget'])
const WRITE_COMMANDS = new Set(['chmod', 'chown', 'cp', 'dd', 'install', 'mkdir', 'mv', 'rm', 'rmdir', 'tee', 'touch', 'truncate'])
const READ_COMMANDS = new Set(['cat', 'find', 'grep', 'head', 'less', 'more', 'readlink', 'rg', 'stat', 'tail'])
const NETWORK_GIT_SUBCOMMANDS = new Set(['clone', 'fetch', 'pull', 'push'])
const WRITE_GIT_SUBCOMMANDS = new Set([
  'add', 'am', 'apply', 'checkout', 'cherry-pick', 'clean', 'commit', 'gc', 'maintenance',
  'merge', 'push', 'rebase', 'reset', 'restore', 'tag', 'update-index', 'write-tree',
])
const READ_GIT_SUBCOMMANDS = new Set(['cat-file', 'diff', 'log', 'ls-files', 'rev-parse', 'show', 'status'])

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex')
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableValue(value[key])]))
  }
  return value
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value))
}

function readRegularUtf8(filePath) {
  const before = fs.lstatSync(filePath)
  if (!before.isFile() || before.isSymbolicLink()) throw new Error('must be a regular non-symlink file')
  if (before.size > MAX_EVAL_BYTES) throw new Error(`exceeds ${MAX_EVAL_BYTES} byte limit`)

  const noFollow = fs.constants.O_NOFOLLOW || 0
  const nonBlock = fs.constants.O_NONBLOCK || 0
  const fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow | nonBlock)
  try {
    const held = fs.fstatSync(fd)
    if (!held.isFile() || held.dev !== before.dev || held.ino !== before.ino || held.size !== before.size) {
      throw new Error('changed before it could be read')
    }
    const chunks = []
    let total = 0
    while (total <= MAX_EVAL_BYTES) {
      const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, MAX_EVAL_BYTES + 1 - total))
      const count = fs.readSync(fd, chunk, 0, chunk.length, null)
      if (count === 0) break
      chunks.push(chunk.subarray(0, count))
      total += count
    }
    const bytes = Buffer.concat(chunks, total)
    const after = fs.fstatSync(fd)
    if (bytes.length > MAX_EVAL_BYTES || after.size !== held.size || bytes.length !== after.size) {
      throw new Error('changed while being read or exceeds the byte limit')
    }
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      throw new Error('must contain valid UTF-8')
    }
  } finally {
    fs.closeSync(fd)
  }
}

function parseUniqueJson(filePath) {
  const source = readRegularUtf8(filePath)
  const document = YAML.parseDocument(source, {
    prettyErrors: true,
    schema: 'json',
    strict: true,
    uniqueKeys: true,
  })
  if (document.errors.length > 0) {
    throw new Error(document.errors.map(error => error.message).join('; '))
  }
  if (document.warnings.length > 0) {
    throw new Error(document.warnings.map(warning => warning.message).join('; '))
  }
  const value = document.toJS({ maxAliasCount: 0 })
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('must contain one JSON object')
  return { source, value }
}

function normalizeText(value) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
}

function groupMatches(normalizedPrompt, group) {
  return group.every(phrase => normalizedPrompt.includes(phrase))
}

function evaluatePrompt(prompt, suites) {
  const normalizedPrompt = normalizeText(prompt)
  const candidates = new Set()
  const boundaryCandidates = new Set()

  for (const suite of suites) {
    if (suite.routing.route_when_any.some(group => groupMatches(normalizedPrompt, group))) {
      candidates.add(suite.skill)
    }
    if (suite.routing.manual_only_when_any.some(group => groupMatches(normalizedPrompt, group))) {
      boundaryCandidates.add(suite.skill)
    }
  }

  const allCandidates = [...new Set([...candidates, ...boundaryCandidates])].sort()
  if (boundaryCandidates.size > 0) {
    return { outcome: 'manual-only', route: null, candidates: allCandidates, reason: 'safety-boundary' }
  }
  if (candidates.size > 1) {
    return { outcome: 'manual-only', route: null, candidates: allCandidates, reason: 'multi-skill-collision' }
  }
  if (candidates.size === 1) {
    return { outcome: 'route', route: allCandidates[0], candidates: allCandidates, reason: 'single-match' }
  }
  return { outcome: 'abstain', route: null, candidates: [], reason: 'no-match' }
}

function shellFenceLines(body) {
  const result = []
  let fence = null
  const lines = body.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!fence) {
      const opening = line.match(/^\s*(`{3,}|~{3,})\s*([A-Za-z0-9_-]*)/)
      if (!opening) continue
      const language = opening[2].toLowerCase()
      fence = { marker: opening[1][0], length: opening[1].length, language }
      continue
    }

    const closing = line.match(/^\s*(`{3,}|~{3,})\s*$/)
    if (closing && closing[1][0] === fence.marker && closing[1].length >= fence.length) {
      fence = null
      continue
    }
    if (!SHELL_FENCE_LANGUAGES.has(fence.language)) continue

    let command = line.trim()
    if (fence.language === 'console') {
      const prompt = command.match(/^(?:\$|PS>)\s+(.+)$/i)
      if (!prompt) continue
      command = prompt[1].trim()
    } else {
      command = command.replace(/^\$\s+/, '')
    }
    if (command && !command.startsWith('#')) result.push({ line: index + 1, command })
  }
  return result
}

function hasOutputRedirection(command) {
  let quote = null
  let escaped = false
  for (let index = 0; index < command.length; index += 1) {
    const character = command[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (character === '\\' && quote !== "'") {
      escaped = true
      continue
    }
    if (quote) {
      if (character === quote) quote = null
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '>' && command[index + 1] !== '&' && command[index - 1] !== '>') return true
  }
  return false
}

function commandParts(command) {
  const segments = command.split(/\s*(?:&&|\|\||;|\|)\s*/)
  return segments.map(segment => {
    const tokens = segment.replace(/^[({]\s*/, '').trim().split(/\s+/).filter(Boolean)
    while (tokens[0] === 'sudo' || tokens[0] === 'command' || tokens[0] === 'env' || /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[0] || '')) {
      tokens.shift()
    }
    const executable = (tokens.shift() || '').replace(/^['"]|['"]$/g, '')
    return { executable: path.basename(executable), args: tokens }
  }).filter(part => part.executable)
}

function classifyCommand(command) {
  const classifications = new Set()
  if (hasOutputRedirection(command)) classifications.add('write')

  for (const part of commandParts(command)) {
    const executable = part.executable.toLowerCase()
    const first = (part.args[0] || '').toLowerCase()
    const second = (part.args[1] || '').toLowerCase()
    if (part.args.some(argument => ['--help', '--version'].includes(argument.toLowerCase()))) continue

    if (NETWORK_COMMANDS.has(executable)) classifications.add('network')
    if (WRITE_COMMANDS.has(executable)) classifications.add('write')
    if (READ_COMMANDS.has(executable)) classifications.add('read')
    if (executable === 'git') {
      if (NETWORK_GIT_SUBCOMMANDS.has(first)) classifications.add('network')
      if (WRITE_GIT_SUBCOMMANDS.has(first) || (first === 'hash-object' && part.args.includes('-w'))) classifications.add('write')
      if (READ_GIT_SUBCOMMANDS.has(first)) classifications.add('read')
    }
    if (executable === 'gh' && (first === 'api' || ['comment', 'create', 'merge'].includes(second))) {
      classifications.add('network')
    }
    if (['npm', 'pnpm', 'yarn'].includes(executable) && ['add', 'ci', 'install', 'publish'].includes(first)) {
      classifications.add('network')
      classifications.add('write')
    }
    if (['pip', 'pip3'].includes(executable) && first === 'install') {
      classifications.add('network')
      classifications.add('write')
    }
    if (executable === 'brew' && ['install', 'update', 'upgrade'].includes(first)) {
      classifications.add('network')
      classifications.add('write')
    }
  }
  return classifications
}

function semanticLint(body, declaredCapabilities, assertions) {
  const findings = []
  const capabilitySet = new Set(declaredCapabilities)
  for (const entry of shellFenceLines(body)) {
    const classifications = classifyCommand(entry.command)
    const command = entry.command.slice(0, 160)
    if (classifications.has('network') && assertions.no_network) {
      findings.push({ code: 'STATIC_LINT_NETWORK_COMMAND', line: entry.line, command })
    }
    if (classifications.has('write') && assertions.no_write) {
      findings.push({ code: 'STATIC_LINT_WRITE_COMMAND', line: entry.line, command })
    }
    if (classifications.has('read') && !capabilitySet.has('tool:file_read')) {
      findings.push({ code: 'STATIC_LINT_UNDECLARED_FILE_READ', line: entry.line, command })
    }
  }
  return findings
}

function sorted(values) {
  return [...values].sort()
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0
}

function formatSchemaErrors(errors) {
  return (errors || []).map(error => `${error.instancePath || '/'} ${error.message}`).sort()
}

function createSuiteValidator(root = path.join(__dirname, '..')) {
  const schemaPath = path.join(root, 'spec', 'static-skill-eval.schema.json')
  const schemaDocument = parseUniqueJson(schemaPath)
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  return ajv.compile(schemaDocument.value)
}

function addSuiteSemanticErrors(wrapper, allSkillNames, allSuites, errors) {
  const { suite, fixturePath, root } = wrapper
  const prefix = fixturePath
  if (path.posix.basename(fixturePath) !== `${suite.skill}.eval.json`) {
    errors.push(`${prefix}: fixture filename must be ${suite.skill}.eval.json`)
  }
  const skillAbsolutePath = path.resolve(root, suite.skill_path)
  const rootPrefix = `${path.resolve(root)}${path.sep}`
  if (!skillAbsolutePath.startsWith(rootPrefix)) {
    errors.push(`${prefix}: skill_path escapes repository root`)
    return
  }

  let validation
  try {
    validation = validateSkill(skillAbsolutePath, { strict: true })
  } catch (error) {
    errors.push(`${prefix}: could not validate skill: ${error.message}`)
    return
  }
  if (validation.errors.length > 0) {
    errors.push(...validation.errors.map(error => `${prefix}: target skill invalid: ${error}`))
    return
  }

  const content = readSkillFile(skillAbsolutePath)
  const { frontmatter, body } = parseSkillContent(content)
  wrapper.skillSha256 = sha256(Buffer.from(content, 'utf8'))
  wrapper.semanticLint = semanticLint(body, frontmatter.engenai.capabilities_required, suite.contract)

  if (frontmatter.name !== suite.skill) errors.push(`${prefix}: skill name does not match target frontmatter`)
  if (frontmatter.engenai.trust_tier !== suite.contract.expected_trust_tier) {
    errors.push(`${prefix}: trust tier drifted from ${suite.contract.expected_trust_tier}`)
  }

  const declared = sorted(frontmatter.engenai.capabilities_required)
  const expected = sorted(suite.contract.expected_declared_capabilities)
  const ceiling = new Set(suite.contract.capability_ceiling)
  if (stableStringify(declared) !== stableStringify(expected)) {
    errors.push(`${prefix}: declared capabilities do not match expected_declared_capabilities`)
  }
  for (const capability of declared) {
    if (!ceiling.has(capability)) errors.push(`${prefix}: ${capability} exceeds capability_ceiling`)
  }
  if (suite.contract.no_write && declared.includes('tool:file_write')) {
    errors.push(`${prefix}: no_write conflicts with tool:file_write`)
  }
  if (suite.contract.no_network && declared.some(capability => ['tool:web_search', 'tool:mcp_external'].includes(capability))) {
    errors.push(`${prefix}: no_network conflicts with a declared network capability`)
  }
  for (const finding of wrapper.semanticLint) {
    errors.push(`${prefix}: ${finding.code} at skill body line ${finding.line}: ${finding.command}`)
  }

  const caseIds = new Set()
  const kinds = new Set()
  for (const testCase of suite.cases) {
    if (caseIds.has(testCase.id)) errors.push(`${prefix}: duplicate case id ${testCase.id}`)
    caseIds.add(testCase.id)
    kinds.add(testCase.kind)
    const normalizedCandidates = sorted(testCase.expected.candidates)
    if (stableStringify(normalizedCandidates) !== stableStringify(testCase.expected.candidates)) {
      errors.push(`${prefix}/${testCase.id}: expected candidates must be sorted`)
    }
    for (const candidate of testCase.expected.candidates) {
      if (!allSkillNames.has(candidate)) errors.push(`${prefix}/${testCase.id}: unknown candidate ${candidate}`)
    }
    if (testCase.expected.route && !allSkillNames.has(testCase.expected.route)) {
      errors.push(`${prefix}/${testCase.id}: unknown route ${testCase.expected.route}`)
    }
    if (testCase.expected.outcome === 'route' &&
        (testCase.expected.route !== suite.skill || testCase.expected.candidates[0] !== suite.skill)) {
      errors.push(`${prefix}/${testCase.id}: positive route must resolve exactly to ${suite.skill}`)
    }
    if (testCase.kind === 'positive' && testCase.expected.outcome !== 'route') {
      errors.push(`${prefix}/${testCase.id}: positive case must expect route`)
    }
    if (testCase.kind === 'negative' && testCase.expected.outcome !== 'abstain') {
      errors.push(`${prefix}/${testCase.id}: negative case must expect abstain`)
    }
    if (testCase.kind === 'collision' && (testCase.expected.outcome !== 'manual-only' ||
        testCase.expected.reason !== 'multi-skill-collision' || !testCase.expected.candidates.includes(suite.skill))) {
      errors.push(`${prefix}/${testCase.id}: collision case must be manual-only and contain ${suite.skill}`)
    }
    if (testCase.kind === 'boundary' && (testCase.expected.outcome !== 'manual-only' ||
        testCase.expected.reason !== 'safety-boundary' || !testCase.expected.candidates.includes(suite.skill))) {
      errors.push(`${prefix}/${testCase.id}: boundary case must be a safety-boundary containing ${suite.skill}`)
    }
  }
  for (const requiredKind of ['positive', 'negative', 'collision']) {
    if (!kinds.has(requiredKind)) errors.push(`${prefix}: missing required ${requiredKind} case`)
  }
  if (!suite.cases.some(testCase => testCase.kind === 'positive' && testCase.expected.outcome === 'route')) {
    errors.push(`${prefix}: positive case must expect route`)
  }
  if (!suite.cases.some(testCase => testCase.kind === 'negative' && testCase.expected.outcome === 'abstain')) {
    errors.push(`${prefix}: negative case must expect abstain`)
  }
  if (!suite.cases.some(testCase => testCase.kind === 'collision' &&
      testCase.expected.outcome === 'manual-only' && testCase.expected.reason === 'multi-skill-collision' &&
      testCase.expected.candidates.includes(suite.skill))) {
    errors.push(`${prefix}: collision case must expect a manual-only collision containing ${suite.skill}`)
  }

  for (const [ruleName, groups] of Object.entries(suite.routing)) {
    const seen = new Set()
    for (const group of groups) {
      for (const phrase of group) {
        if (normalizeText(phrase) !== phrase) errors.push(`${prefix}: ${ruleName} phrase is not canonical: ${phrase}`)
      }
      const identity = stableStringify(sorted(group))
      if (seen.has(identity)) errors.push(`${prefix}: duplicate ${ruleName} phrase group ${identity}`)
      seen.add(identity)
      if (!allSuites.some(otherSuite => otherSuite.cases.some(testCase =>
        groupMatches(normalizeText(testCase.prompt), group)))) {
        errors.push(`${prefix}: unexercised ${ruleName} phrase group ${identity}`)
      }
    }
  }
}

function runEvaluation({ root = path.join(__dirname, '..') } = {}) {
  const errors = []
  const evalDirectory = path.join(root, 'evals', 'static-routing', 'v1')
  const validateSuite = createSuiteValidator(root)

  const fixtureNames = fs.readdirSync(evalDirectory).filter(name => name.endsWith('.eval.json')).sort()
  if (fixtureNames.length === 0) errors.push('no static routing fixtures found')
  const wrappers = []
  const seenSkills = new Set()

  for (const fixtureName of fixtureNames) {
    const absolutePath = path.join(evalDirectory, fixtureName)
    const relativePath = path.relative(root, absolutePath).split(path.sep).join('/')
    let parsed
    try {
      parsed = parseUniqueJson(absolutePath)
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`)
      continue
    }
    if (!validateSuite(parsed.value)) {
      errors.push(...formatSchemaErrors(validateSuite.errors).map(error => `${relativePath}: ${error}`))
      continue
    }
    if (seenSkills.has(parsed.value.skill)) errors.push(`${relativePath}: duplicate suite for ${parsed.value.skill}`)
    seenSkills.add(parsed.value.skill)
    wrappers.push({
      root,
      fixturePath: relativePath,
      fixtureSha256: sha256(Buffer.from(parsed.source, 'utf8')),
      suite: parsed.value,
      semanticLint: [],
      skillSha256: null,
    })
  }

  const allSkillNames = new Set(wrappers.map(wrapper => wrapper.suite.skill))
  const allSuites = wrappers.map(wrapper => wrapper.suite)
  for (const wrapper of wrappers) addSuiteSemanticErrors(wrapper, allSkillNames, allSuites, errors)

  const suites = wrappers.map(wrapper => wrapper.suite).sort((left, right) => compareText(left.skill, right.skill))
  const caseReceipts = []
  for (const suite of suites) {
    for (const testCase of suite.cases) {
      const staticResult = evaluatePrompt(testCase.prompt, suites)
      if (stableStringify(staticResult) !== stableStringify(testCase.expected)) {
        errors.push(`${suite.skill}/${testCase.id}: expected ${stableStringify(testCase.expected)}, computed ${stableStringify(staticResult)}`)
      }
      caseReceipts.push({
        suite: suite.skill,
        case: testCase.id,
        kind: testCase.kind,
        prompt_sha256: sha256(Buffer.from(testCase.prompt, 'utf8')),
        static_result: staticResult,
      })
    }
  }

  errors.sort()
  const semanticLintFindings = wrappers.reduce((total, wrapper) => total + wrapper.semanticLint.length, 0)
  return {
    schema_version: 1,
    evaluator_profile: PROFILE,
    claim: 'STATIC_CONTRACT_ONLY',
    status: errors.length === 0 ? 'PASS' : 'FAIL',
    trust_tier: 'unvetted',
    summary: {
      suites: suites.length,
      cases: caseReceipts.length,
      semantic_lint_findings: semanticLintFindings,
      errors: errors.length,
    },
    suites: wrappers.map(wrapper => ({
      skill: wrapper.suite.skill,
      fixture_path: wrapper.fixturePath,
      fixture_sha256: wrapper.fixtureSha256,
      skill_path: wrapper.suite.skill_path,
      skill_sha256: wrapper.skillSha256,
      capability_ceiling: wrapper.suite.contract.capability_ceiling,
      no_write: wrapper.suite.contract.no_write,
      no_network: wrapper.suite.contract.no_network,
    })).sort((left, right) => compareText(left.skill, right.skill)),
    cases: caseReceipts,
    limitations: [
      'Literal fixture matching is not model-routing or instruction-following evidence.',
      'Rules and expected results share one reviewable fixture; a coordinated edit can redefine the static contract.',
      'Semantic lint inspects only explicit shell-language fenced examples and is not a general program analysis.',
      'No skill, model, command, network service, write operation, credential, or sandbox is executed.',
      'Gate 3 runtime isolation and Gate 4 human trust, provenance, and signing remain HOLD.',
    ],
    errors,
  }
}

function main(argv = process.argv.slice(2)) {
  const unknown = argv.filter(argument => argument !== '--json')
  if (unknown.length > 0) {
    console.error(`Unknown argument(s): ${unknown.join(', ')}`)
    return 2
  }

  let report
  try {
    report = runEvaluation()
  } catch (error) {
    console.error(`Static skill evaluation failed closed: ${error.message}`)
    return 1
  }

  if (argv.includes('--json')) {
    console.log(`${JSON.stringify(report, null, 2)}\n`)
  } else if (report.status === 'PASS') {
    console.log(`Static skill contract evaluation passed: ${report.summary.suites} suites, ${report.summary.cases} cases, ${report.summary.semantic_lint_findings} lint findings`)
    console.log('HOLD: this is Gate 1/2-style static evidence only; Gate 3 and Gate 4 remain unproven.')
  } else {
    console.error(`Static skill contract evaluation failed with ${report.errors.length} error(s):`)
    for (const error of report.errors) console.error(`  - ${error}`)
  }
  return report.status === 'PASS' ? 0 : 1
}

if (require.main === module) process.exit(main())

module.exports = {
  classifyCommand,
  createSuiteValidator,
  evaluatePrompt,
  main,
  normalizeText,
  runEvaluation,
  semanticLint,
  shellFenceLines,
  stableStringify,
}
