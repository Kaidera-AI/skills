#!/usr/bin/env node

'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const Ajv2020 = require('ajv/dist/2020')
const YAML = require('yaml')

const PROFILE_VERSION = 'v2'
const PROFILE = 'kaidera-static-routing-v2'
const SCHEMA_VERSION = 2
const MAX_EVAL_BYTES = 1024 * 1024
const INTERPRETATION_DEPENDENCIES = [
  'ajv', 'ajv-formats', 'fast-deep-equal', 'fast-uri', 'json-schema-traverse', 'require-from-string', 'yaml',
]
const EVALUATOR_IMPLEMENTATION_PATHS = [
  'scripts/static-skill-eval.js',
  'scripts/skill-format.js',
  'scripts/validate-skill.js',
  'spec/skill-security-patterns.json',
]
const NETWORK_CAPABILITIES = new Set(['tool:mcp_external', 'tool:web_search'])
const SHELL_FENCE_LANGUAGES = new Set(['bash', 'console', 'powershell', 'pwsh', 'sh', 'shell', 'zsh'])
const NETWORK_COMMANDS = new Set(['curl', 'ftp', 'nc', 'ncat', 'netcat', 'scp', 'sftp', 'ssh', 'telnet', 'wget'])
const WRITE_COMMANDS = new Set(['chmod', 'chown', 'cp', 'dd', 'install', 'mkdir', 'mv', 'rm', 'rmdir', 'tee', 'touch', 'truncate'])
const READ_COMMANDS = new Set(['awk', 'cat', 'grep', 'head', 'less', 'more', 'readlink', 'rg', 'sed', 'stat', 'tail'])
const NEUTRAL_COMMANDS = new Set(['basename', 'date', 'dirname', 'echo', 'false', 'printf', 'pwd', 'true', 'type', 'uname', 'which'])
const NETWORK_GIT_SUBCOMMANDS = new Set(['clone', 'fetch', 'ls-remote', 'pull', 'push', 'submodule'])
const WRITE_GIT_SUBCOMMANDS = new Set([
  'add', 'am', 'apply', 'branch', 'checkout', 'cherry-pick', 'clean', 'clone', 'commit', 'fetch',
  'gc', 'init', 'maintenance', 'merge', 'mv', 'notes', 'pull', 'push', 'rebase', 'reset', 'restore',
  'revert', 'rm', 'sparse-checkout', 'stash', 'submodule', 'switch', 'tag', 'update-index', 'worktree',
  'write-tree',
])
const READ_GIT_SUBCOMMANDS = new Set([
  'cat-file', 'diff', 'diff-tree', 'for-each-ref', 'grep', 'hash-object', 'log', 'ls-files',
  'merge-base', 'name-rev', 'rev-list', 'rev-parse', 'show', 'show-ref', 'status',
])
const POWERSHELL_NETWORK_COMMANDS = new Set(['irm', 'invoke-restmethod', 'invoke-webrequest', 'iwr'])
const POWERSHELL_WRITE_COMMANDS = new Set([
  'add-content', 'clear-content', 'copy-item', 'move-item', 'new-item', 'out-file', 'remove-item',
  'rename-item', 'set-content',
])
const POWERSHELL_READ_COMMANDS = new Set(['get-childitem', 'get-content', 'get-item', 'select-string'])
const PACKAGE_MANAGER_RULES = new Map([
  ['apt', { networkWrite: new Set(['download', 'install', 'update', 'upgrade']), network: new Set([]), write: new Set(['autoremove', 'purge', 'remove']), read: new Set(['list', 'show']) }],
  ['apt-get', { networkWrite: new Set(['download', 'install', 'update', 'upgrade']), network: new Set([]), write: new Set(['autoremove', 'purge', 'remove']), read: new Set(['indextargets']) }],
  ['brew', { networkWrite: new Set(['install', 'update', 'upgrade']), network: new Set([]), write: new Set(['uninstall']), read: new Set(['info', 'list']) }],
  ['bun', { networkWrite: new Set(['add', 'install', 'publish', 'remove', 'update']), network: new Set([]), write: new Set([]), read: new Set([]) }],
  ['cargo', { networkWrite: new Set(['install', 'publish', 'update']), network: new Set(['search']), write: new Set(['uninstall']), read: new Set(['metadata']) }],
  ['dnf', { networkWrite: new Set(['install', 'update', 'upgrade']), network: new Set([]), write: new Set(['remove']), read: new Set(['info', 'list']) }],
  ['npm', { networkWrite: new Set(['add', 'audit', 'ci', 'install', 'publish', 'uninstall', 'update']), network: new Set(['view']), write: new Set([]), read: new Set(['list']) }],
  ['pip', { networkWrite: new Set(['download', 'install']), network: new Set([]), write: new Set(['uninstall']), read: new Set(['freeze', 'list', 'show']) }],
  ['pip3', { networkWrite: new Set(['download', 'install']), network: new Set([]), write: new Set(['uninstall']), read: new Set(['freeze', 'list', 'show']) }],
  ['pipx', { networkWrite: new Set(['install', 'upgrade']), network: new Set([]), write: new Set(['uninstall']), read: new Set(['list']) }],
  ['pnpm', { networkWrite: new Set(['add', 'audit', 'install', 'publish', 'remove', 'update']), network: new Set(['view']), write: new Set([]), read: new Set(['list']) }],
  ['yarn', { networkWrite: new Set(['add', 'install', 'npm', 'remove', 'up', 'upgrade']), network: new Set(['info']), write: new Set([]), read: new Set(['list', 'why']) }],
  ['yum', { networkWrite: new Set(['install', 'update', 'upgrade']), network: new Set([]), write: new Set(['remove']), read: new Set(['info', 'list']) }],
])
let evaluatorSupport = null

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex')
}

function uint64(value) {
  const bytes = Buffer.allocUnsafe(8)
  bytes.writeBigUInt64BE(BigInt(value))
  return bytes
}

function updateFileRecord(hash, relativePath, bytes) {
  const pathBytes = Buffer.from(relativePath, 'utf8')
  hash.update(uint64(pathBytes.length))
  hash.update(pathBytes)
  hash.update(uint64(bytes.length))
  hash.update(bytes)
}

function hashFileRecords(files) {
  const hash = crypto.createHash('sha256')
  for (const file of files) updateFileRecord(hash, file.path, file.bytes)
  return hash.digest('hex')
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

function readRegularBytes(filePath) {
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
    return bytes
  } finally {
    fs.closeSync(fd)
  }
}

function hashDirectoryTree(directoryPath) {
  const rootPath = fs.realpathSync.native(directoryPath)
  const hash = crypto.createHash('sha256')
  let fileCount = 0
  let totalBytes = 0

  function visit(absoluteDirectory, relativeDirectory) {
    const entries = fs.readdirSync(absoluteDirectory, { withFileTypes: true }).sort((left, right) => compareText(left.name, right.name))
    for (const entry of entries) {
      const absolutePath = path.join(absoluteDirectory, entry.name)
      const relativePath = path.posix.join(relativeDirectory, entry.name)
      const stat = fs.lstatSync(absolutePath)
      if (stat.isSymbolicLink()) throw new Error(`dependency tree contains a symlink: ${relativePath}`)
      if (stat.isDirectory()) {
        visit(absolutePath, relativePath)
      } else if (stat.isFile()) {
        const bytes = readRegularBytes(absolutePath)
        updateFileRecord(hash, relativePath, bytes)
        fileCount += 1
        totalBytes += bytes.length
      } else {
        throw new Error(`dependency tree contains a non-file entry: ${relativePath}`)
      }
    }
  }

  visit(rootPath, '')
  return { sha256: hash.digest('hex'), files: fileCount, bytes: totalBytes }
}

function decodeUtf8(bytes, { rejectBom = false } = {}) {
  if (rejectBom && bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    throw new Error('must not contain a UTF-8 BOM')
  }
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: rejectBom }).decode(bytes)
  } catch {
    throw new Error('must contain valid UTF-8')
  }
}

function rootContext(root) {
  const absoluteRoot = path.resolve(root)
  const rootStat = fs.lstatSync(absoluteRoot)
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new Error('repository root must be a regular non-symlink directory')
  }
  return { absoluteRoot, realRoot: fs.realpathSync.native(absoluteRoot) }
}

function resolveRootEntry(root, relativePath, expectedType = 'file') {
  if (typeof relativePath !== 'string' || relativePath === '' || path.isAbsolute(relativePath) || relativePath.includes('\0')) {
    throw new Error('path must be a non-empty repository-relative path')
  }
  const segments = relativePath.split('/')
  if (segments.length === 0 || segments.some(segment => segment === '.' || segment === '..' || segment.includes(path.sep))) {
    throw new Error('path must not contain empty, dot, or parent components')
  }

  const { absoluteRoot, realRoot } = rootContext(root)
  let current = absoluteRoot
  for (let index = 0; index < segments.length; index += 1) {
    current = path.join(current, segments[index])
    const stat = fs.lstatSync(current)
    if (stat.isSymbolicLink()) throw new Error(`path component is a symlink: ${segments.slice(0, index + 1).join('/')}`)
    if (index < segments.length - 1 && !stat.isDirectory()) {
      throw new Error(`path component is not a directory: ${segments.slice(0, index + 1).join('/')}`)
    }
  }

  const finalStat = fs.lstatSync(current)
  if (expectedType === 'file' && !finalStat.isFile()) throw new Error('must resolve to a regular file')
  if (expectedType === 'directory' && !finalStat.isDirectory()) throw new Error('must resolve to a directory')
  const realEntry = fs.realpathSync.native(current)
  const containment = path.relative(realRoot, realEntry)
  if (containment === '..' || containment.startsWith(`..${path.sep}`) || path.isAbsolute(containment)) {
    throw new Error('resolved path escapes repository root')
  }
  return current
}

function readRootBytes(root, relativePath) {
  const absolutePath = resolveRootEntry(root, relativePath, 'file')
  const bytes = readRegularBytes(absolutePath)
  return { absolutePath, bytes }
}

function readRootUtf8(root, relativePath, { rejectBom = true } = {}) {
  const { absolutePath, bytes } = readRootBytes(root, relativePath)
  return { absolutePath, bytes, source: decodeUtf8(bytes, { rejectBom }) }
}

function parseUniqueJsonRead(read) {
  const { source } = read
  let value
  try {
    value = JSON.parse(source)
  } catch (error) {
    throw new Error(`must contain strict JSON: ${error.message}`)
  }
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
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('must contain one JSON object')
  return { ...read, value }
}

function parseUniqueJsonAtRoot(root, relativePath) {
  return parseUniqueJsonRead(readRootUtf8(root, relativePath))
}

function loadEvaluatorSupport() {
  if (!evaluatorSupport) {
    const skillFormat = require('./skill-format')
    const skillValidator = require('./validate-skill')
    evaluatorSupport = {
      parseSkillContent: skillFormat.parseSkillContent,
      validateSkill: skillValidator.validateSkill,
    }
  }
  return evaluatorSupport
}

function normalizeText(value) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
}

function isWordCharacter(value) {
  return typeof value === 'string' && /[\p{L}\p{N}_]/u.test(value)
}

function phraseMatches(normalizedPrompt, phrase) {
  let offset = 0
  const first = [...phrase][0]
  const last = [...phrase].at(-1)
  while (offset <= normalizedPrompt.length - phrase.length) {
    const index = normalizedPrompt.indexOf(phrase, offset)
    if (index === -1) return false
    const before = index === 0 ? null : [...normalizedPrompt.slice(0, index)].at(-1)
    const afterIndex = index + phrase.length
    const after = afterIndex === normalizedPrompt.length ? null : [...normalizedPrompt.slice(afterIndex)][0]
    if ((!isWordCharacter(first) || !isWordCharacter(before)) &&
        (!isWordCharacter(last) || !isWordCharacter(after))) return true
    offset = index + 1
  }
  return false
}

function groupMatches(normalizedPrompt, group) {
  return group.every(phrase => phraseMatches(normalizedPrompt, phrase))
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
    if (character === '>') {
      if (command[index + 1] !== '&') return true
      const duplicationTarget = command.slice(index + 2).match(/^\s*([^\s;&|<>]+)/)
      if (!duplicationTarget || !/^\d+$/.test(duplicationTarget[1])) return true
      index += 1 + duplicationTarget[0].length
    }
  }
  return false
}

function hasUnsupportedControlOperator(command) {
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
    if (character === '&' && !['&', '<', '>'].includes(command[index - 1]) && !['&', '>'].includes(command[index + 1])) {
      return true
    }
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

function gitSubcommand(args) {
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index].toLowerCase()
    if (['-c', '-C', '--git-dir', '--namespace', '--super-prefix', '--work-tree'].map(value => value.toLowerCase()).includes(argument)) {
      index += 1
      continue
    }
    if (argument.startsWith('--git-dir=') || argument.startsWith('--namespace=') ||
        argument.startsWith('--super-prefix=') || argument.startsWith('--work-tree=')) continue
    if (argument.startsWith('-')) continue
    return { name: argument, args: args.slice(index + 1) }
  }
  return { name: '', args: [] }
}

function classifyPackageManager(executable, args, classifications) {
  const rules = PACKAGE_MANAGER_RULES.get(executable)
  if (!rules) return false
  const subcommand = (args.find(argument => !argument.startsWith('-')) || '').toLowerCase()
  if (rules.networkWrite.has(subcommand)) {
    classifications.add('network')
    classifications.add('write')
  } else if (rules.network.has(subcommand)) {
    classifications.add('network')
  } else if (rules.write.has(subcommand)) {
    classifications.add('write')
  } else if (rules.read.has(subcommand)) {
    classifications.add('read')
  } else {
    classifications.add('unknown')
  }
  return true
}

function classifyCommand(command) {
  const classifications = new Set()
  if (hasOutputRedirection(command)) classifications.add('write')
  if (hasUnsupportedControlOperator(command)) classifications.add('unknown')

  for (const part of commandParts(command)) {
    const executable = part.executable.toLowerCase()
    let recognized = false

    if (NETWORK_COMMANDS.has(executable)) {
      recognized = true
      classifications.add('network')
    }
    if (WRITE_COMMANDS.has(executable)) {
      recognized = true
      classifications.add('write')
    }
    if (READ_COMMANDS.has(executable)) {
      recognized = true
      classifications.add('read')
      if (executable === 'sed' && part.args.some(argument => {
        const option = argument.toLowerCase()
        return option === '-i' || /^-[^-]*i/.test(option) || option.startsWith('--in-place')
      })) {
        classifications.add('write')
      }
    }
    if (NEUTRAL_COMMANDS.has(executable)) recognized = true
    if (executable === 'find') {
      recognized = true
      classifications.add('read')
      if (part.args.some(argument => argument.toLowerCase() === '-delete')) classifications.add('write')
      if (part.args.some(argument => ['-fls', '-fprintf', '-fprint', '-fprint0'].includes(argument.toLowerCase()))) {
        classifications.add('write')
      }
      if (part.args.some(argument => ['-exec', '-execdir', '-ok', '-okdir'].includes(argument.toLowerCase()))) {
        classifications.add('unknown')
      }
    }
    if (executable === 'git') {
      recognized = true
      const subcommand = gitSubcommand(part.args)
      if (!subcommand.name) classifications.add('unknown')
      if (NETWORK_GIT_SUBCOMMANDS.has(subcommand.name)) classifications.add('network')
      if ((WRITE_GIT_SUBCOMMANDS.has(subcommand.name) ||
          (subcommand.name === 'hash-object' && subcommand.args.includes('-w')))) classifications.add('write')
      if (READ_GIT_SUBCOMMANDS.has(subcommand.name)) classifications.add('read')
      if (!NETWORK_GIT_SUBCOMMANDS.has(subcommand.name) && !WRITE_GIT_SUBCOMMANDS.has(subcommand.name) &&
          !READ_GIT_SUBCOMMANDS.has(subcommand.name)) classifications.add('unknown')
    }
    if (executable === 'gh') {
      recognized = true
      classifications.add('network')
    }
    if (POWERSHELL_NETWORK_COMMANDS.has(executable)) {
      recognized = true
      classifications.add('network')
      if (part.args.some(argument => argument.toLowerCase() === '-outfile')) classifications.add('write')
    }
    if (POWERSHELL_WRITE_COMMANDS.has(executable)) {
      recognized = true
      classifications.add('write')
    }
    if (POWERSHELL_READ_COMMANDS.has(executable)) {
      recognized = true
      classifications.add('read')
    }
    if (classifyPackageManager(executable, part.args, classifications)) recognized = true
    if (!recognized) classifications.add('unknown')
  }
  return classifications
}

function semanticLint(body, declaredCapabilities, assertions) {
  const findings = []
  const capabilitySet = new Set(declaredCapabilities)
  for (const entry of shellFenceLines(body)) {
    const classifications = classifyCommand(entry.command)
    const command = entry.command.slice(0, 160)
    if (!capabilitySet.has('tool:code_interpreter')) {
      findings.push({ code: 'STATIC_LINT_UNDECLARED_CODE_INTERPRETER', line: entry.line, command })
    }
    if (classifications.has('unknown')) {
      findings.push({ code: 'STATIC_LINT_UNKNOWN_COMMAND', line: entry.line, command })
    }
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

function listFixturePaths(root) {
  const baseRelativePath = 'evals/static-routing'
  const baseAbsolutePath = resolveRootEntry(root, baseRelativePath, 'directory')
  const fixturePaths = []

  function visit(absoluteDirectory, relativeDirectory) {
    const entries = fs.readdirSync(absoluteDirectory, { withFileTypes: true }).sort((left, right) => compareText(left.name, right.name))
    for (const entry of entries) {
      const relativePath = path.posix.join(relativeDirectory, entry.name)
      const absolutePath = path.join(absoluteDirectory, entry.name)
      const stat = fs.lstatSync(absolutePath)
      if (stat.isSymbolicLink()) throw new Error(`fixture path component is a symlink: ${relativePath}`)
      if (stat.isDirectory()) {
        visit(absolutePath, relativePath)
      } else if (stat.isFile() && entry.name.endsWith('.eval.json')) {
        fixturePaths.push(relativePath)
      }
    }
  }

  visit(baseAbsolutePath, baseRelativePath)
  return fixturePaths.sort(compareText)
}

function createSuiteValidator(root = path.join(__dirname, '..')) {
  const schemaPath = 'spec/static-skill-eval.schema.json'
  const schemaDocument = parseUniqueJsonAtRoot(root, schemaPath)
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  const validate = ajv.compile(schemaDocument.value)
  validate.schemaReceipt = { path: schemaPath, sha256: sha256(schemaDocument.bytes) }
  return validate
}

function dependencyReceipt(name) {
  const packageJsonPath = fs.realpathSync.native(require.resolve(`${name}/package.json`))
  const bytes = readRegularBytes(packageJsonPath)
  const parsed = parseUniqueJsonRead({
    absolutePath: packageJsonPath,
    bytes,
    source: decodeUtf8(bytes, { rejectBom: true }),
  })
  const tree = hashDirectoryTree(path.dirname(packageJsonPath))
  return {
    name,
    version: parsed.value.version,
    package_json_sha256: sha256(bytes),
    package_tree_sha256: tree.sha256,
    package_tree_files: tree.files,
    package_tree_bytes: tree.bytes,
  }
}

function runningImplementationPath(relativePath) {
  return relativePath === 'scripts/static-skill-eval.js'
    ? __filename
    : path.join(__dirname, '..', ...relativePath.split('/'))
}

function createInterpretationReceipts(root, validateSuite, errors) {
  const lockPath = 'package-lock.json'
  const lockDocument = parseUniqueJsonAtRoot(root, lockPath)
  const implementationFiles = EVALUATOR_IMPLEMENTATION_PATHS.map(relativePath => {
    const repositoryRead = readRootBytes(root, relativePath)
    const runningBytes = readRegularBytes(fs.realpathSync.native(runningImplementationPath(relativePath)))
    if (!repositoryRead.bytes.equals(runningBytes)) {
      errors.push(`${relativePath}: repository bytes do not match the running evaluator implementation`)
    }
    return { path: relativePath, bytes: runningBytes, sha256: sha256(runningBytes) }
  })
  loadEvaluatorSupport()
  for (const file of implementationFiles) {
    const repositoryAfterLoad = readRootBytes(root, file.path).bytes
    const runningAfterLoad = readRegularBytes(fs.realpathSync.native(runningImplementationPath(file.path)))
    if (!file.bytes.equals(repositoryAfterLoad) || !file.bytes.equals(runningAfterLoad)) {
      errors.push(`${file.path}: evaluator implementation changed while support modules were loading`)
    }
  }
  const bundleSha256 = hashFileRecords(implementationFiles)
  const dependencies = INTERPRETATION_DEPENDENCIES.map(dependencyReceipt).sort((left, right) => compareText(left.name, right.name))
  for (const dependency of dependencies) {
    const lockedVersion = lockDocument.value.packages?.[`node_modules/${dependency.name}`]?.version
    if (dependency.version !== lockedVersion) {
      errors.push(`${lockPath}: resolved ${dependency.name}@${dependency.version} does not match lock version ${String(lockedVersion)}`)
    }
  }
  return {
    evaluator: {
      path: implementationFiles[0].path,
      sha256: implementationFiles[0].sha256,
      bundle_sha256: bundleSha256,
      support_files: implementationFiles.slice(1).map(file => ({ path: file.path, sha256: file.sha256 })),
    },
    schema: validateSuite.schemaReceipt,
    package_lock: { path: lockPath, sha256: sha256(lockDocument.bytes) },
    runtime: { node: process.version },
    dependencies,
  }
}

function groupSubsumes(left, right) {
  const rightPhrases = new Set(right)
  return left.every(phrase => rightPhrases.has(phrase))
}

function withoutRoutingGroup(suites, skill, ruleName, groupIndex) {
  return suites.map(suite => {
    if (suite.skill !== skill) return suite
    return {
      ...suite,
      routing: {
        ...suite.routing,
        [ruleName]: suite.routing[ruleName].filter((_, index) => index !== groupIndex),
      },
    }
  })
}

function ruleHasOutcomeSensitiveCase(suite, allSuites, ruleName, groupIndex) {
  const mutatedSuites = withoutRoutingGroup(allSuites, suite.skill, ruleName, groupIndex)
  return suite.cases.some(testCase => {
    const baseline = evaluatePrompt(testCase.prompt, allSuites)
    if (stableStringify(baseline) !== stableStringify(testCase.expected)) return false
    const mutated = evaluatePrompt(testCase.prompt, mutatedSuites)
    if (ruleName === 'route_when_any') {
      return testCase.kind === 'positive' && baseline.outcome === 'route' && baseline.route === suite.skill &&
        (mutated.outcome !== 'route' || mutated.route !== suite.skill)
    }
    return testCase.kind === 'boundary' && baseline.outcome === 'manual-only' && baseline.reason === 'safety-boundary' &&
      (mutated.outcome !== 'manual-only' || mutated.reason !== 'safety-boundary')
  })
}

function addRuleRelationshipErrors(suite, allSuites, prefix, errors) {
  for (const ruleName of ['route_when_any', 'manual_only_when_any']) {
    for (let groupIndex = 0; groupIndex < suite.routing[ruleName].length; groupIndex += 1) {
      const group = suite.routing[ruleName][groupIndex]
      const identity = stableStringify(sorted(group))
      for (const otherSuite of allSuites) {
        for (let otherIndex = 0; otherIndex < otherSuite.routing[ruleName].length; otherIndex += 1) {
          if (suite.skill === otherSuite.skill && groupIndex === otherIndex) continue
          const otherGroup = otherSuite.routing[ruleName][otherIndex]
          if (groupSubsumes(otherGroup, group)) {
            errors.push(`${prefix}: redundant ${ruleName} phrase group ${identity} is subsumed by ${otherSuite.skill}/${ruleName}[${otherIndex}]`)
            otherIndex = otherSuite.routing[ruleName].length
            break
          }
        }
      }
      if (ruleName === 'route_when_any') {
        for (const otherSuite of allSuites) {
          const shadowIndex = otherSuite.routing.manual_only_when_any.findIndex(manualGroup => groupSubsumes(manualGroup, group))
          if (shadowIndex !== -1) {
            errors.push(`${prefix}: shadowed route_when_any phrase group ${identity} is subsumed by ${otherSuite.skill}/manual_only_when_any[${shadowIndex}]`)
            break
          }
        }
      }
      if (!ruleHasOutcomeSensitiveCase(suite, allSuites, ruleName, groupIndex)) {
        const kind = ruleName === 'route_when_any' ? 'positive route' : 'safety-boundary'
        errors.push(`${prefix}: ${ruleName} phrase group ${identity} has no outcome-distinguishing ${kind} case`)
      }
    }
  }
}

function addSuiteSemanticErrors(wrapper, allSkillNames, allSuites, errors) {
  const { suite, fixturePath, root } = wrapper
  const { parseSkillContent, validateSkill } = loadEvaluatorSupport()
  const prefix = fixturePath
  if (path.posix.basename(fixturePath) !== `${suite.skill}.eval.json`) {
    errors.push(`${prefix}: fixture filename must be ${suite.skill}.eval.json`)
  }
  let beforeRead
  try {
    beforeRead = readRootUtf8(root, suite.skill_path)
  } catch (error) {
    errors.push(`${prefix}: could not read contained skill: ${error.message}`)
    return
  }

  let validation
  try {
    validation = validateSkill(beforeRead.absolutePath, { strict: true })
  } catch (error) {
    errors.push(`${prefix}: could not validate skill: ${error.message}`)
    return
  }
  if (validation.errors.length > 0) {
    errors.push(...validation.errors.map(error => `${prefix}: target skill invalid: ${error}`))
    return
  }

  let afterRead
  try {
    afterRead = readRootUtf8(root, suite.skill_path)
  } catch (error) {
    errors.push(`${prefix}: could not re-read contained skill: ${error.message}`)
    return
  }
  if (!beforeRead.bytes.equals(afterRead.bytes)) {
    errors.push(`${prefix}: target skill changed while it was being validated`)
    return
  }

  const content = afterRead.source
  const { frontmatter, body } = parseSkillContent(content)
  // The legacy engenai: key goes through the validator's single cutoff path (warning before
  // 2026-12-31, error from then on); this evaluator never reads it directly.
  const legacyErrors = []
  require('./validate-skill').normalizeLegacyManifestKey(frontmatter, legacyErrors, [])
  if (legacyErrors.length > 0) {
    legacyErrors.forEach((message) => errors.push(`${prefix}: ${message}`))
    return
  }
  wrapper.skillSha256 = sha256(afterRead.bytes)
  wrapper.semanticLint = semanticLint(body, frontmatter.kaidera.capabilities_required, suite.contract)

  if (frontmatter.name !== suite.skill) errors.push(`${prefix}: skill name does not match target frontmatter`)
  if (frontmatter.kaidera.trust_tier !== suite.contract.expected_trust_tier) {
    errors.push(`${prefix}: trust tier drifted from ${suite.contract.expected_trust_tier}`)
  }

  const declared = sorted(frontmatter.kaidera.capabilities_required)
  const expected = sorted(suite.contract.expected_declared_capabilities)
  const ceiling = new Set(suite.contract.capability_ceiling)
  if (stableStringify(declared) !== stableStringify(expected)) {
    errors.push(`${prefix}: declared capabilities do not match expected_declared_capabilities`)
  }
  for (const capability of declared) {
    if (!ceiling.has(capability)) errors.push(`${prefix}: ${capability} exceeds capability_ceiling`)
  }
  if (suite.contract.no_write && ceiling.has('tool:file_write')) {
    errors.push(`${prefix}: no_write conflicts with capability_ceiling tool:file_write`)
  }
  const ceilingNetworkCapabilities = [...ceiling].filter(capability => NETWORK_CAPABILITIES.has(capability))
  if (suite.contract.no_network && ceilingNetworkCapabilities.length > 0) {
    errors.push(`${prefix}: no_network conflicts with capability_ceiling ${ceilingNetworkCapabilities.sort().join(', ')}`)
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
    }
  }
  addRuleRelationshipErrors(suite, allSuites, prefix, errors)
}

function runEvaluation({ root = path.join(__dirname, '..') } = {}) {
  const errors = []
  const validateSuite = createSuiteValidator(root)
  const interpretationReceipts = createInterpretationReceipts(root, validateSuite, errors)

  const fixturePaths = listFixturePaths(root)
  if (fixturePaths.length === 0) errors.push('no static routing fixtures found')
  const wrappers = []
  const seenSkills = new Set()

  for (const relativePath of fixturePaths) {
    const expectedPrefix = `evals/static-routing/${PROFILE_VERSION}/`
    if (!relativePath.startsWith(expectedPrefix)) {
      errors.push(`${relativePath}: unsupported fixture profile directory; expected ${expectedPrefix}`)
      continue
    }
    let parsed
    try {
      parsed = parseUniqueJsonAtRoot(root, relativePath)
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
      fixtureSha256: sha256(parsed.bytes),
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
    schema_version: SCHEMA_VERSION,
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
    interpretation_receipts: interpretationReceipts,
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
      'Boundary-aware literal fixture matching is not model-routing or instruction-following evidence.',
      'Rules and expected results share one reviewable fixture; a coordinated edit can redefine the static contract.',
      'Semantic lint inspects only explicit shell-language fenced examples and is not a general program analysis.',
      'Receipts identify checked on-disk bytes and installed package trees, not atomic process-memory state or provenance.',
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
  groupMatches,
  hashDirectoryTree,
  hashFileRecords,
  main,
  normalizeText,
  phraseMatches,
  runEvaluation,
  semanticLint,
  shellFenceLines,
  stableStringify,
}
