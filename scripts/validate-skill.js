#!/usr/bin/env node

'use strict'

const net = require('node:net')
const fs = require('node:fs')
const path = require('node:path')
const { computeContentHash, parseSkillContent, readSkillFile } = require('./skill-format')

const REQUIRED_TOP = ['name', 'version', 'description', 'engenai', 'author', 'license', 'updated', 'safety_constraints']
const ALLOWED_TOP = new Set([
  ...REQUIRED_TOP,
  'tags',
  'parameters',
  'attribution_author',
  'attribution_url',
  'attribution_notes',
])
const REQUIRED_ENGENAI = [
  'category',
  'trust_tier',
  'risk_level',
  'capabilities_required',
  'allowed_domains',
  'content_hash',
  'signed_by',
  'last_reviewed',
  'reviewer',
]
const ALLOWED_ENGENAI = new Set(REQUIRED_ENGENAI)
const ALLOWED_PARAMETER_FIELDS = new Set(['type', 'required', 'description'])
const VALID_CATEGORIES = ['development', 'devops', 'security', 'documentation', 'research', 'integrations', 'context']
const VALID_TRUST_TIERS = ['official', 'verified_partner', 'community_vetted', 'unvetted']
const VALID_RISK_LEVELS = ['low', 'medium', 'high']
const VALID_CAPABILITIES = [
  'tool:code_interpreter',
  'tool:web_search',
  'tool:mcp_external',
  'tool:file_read',
  'tool:file_write',
]
const VALID_PARAMETER_TYPES = ['string', 'boolean', 'number', 'array', 'object']
const TRUST_GATE_ENABLED = false
const MINIMUM_CAPABILITY_RISK = {
  'tool:code_interpreter': 'medium',
  'tool:web_search': 'medium',
  'tool:mcp_external': 'high',
  'tool:file_write': 'medium',
}
const RISK_ORDER = { low: 0, medium: 1, high: 2 }

function loadSecurityPatterns() {
  const document = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'spec', 'skill-security-patterns.json'), 'utf8'),
  )
  if (!isPlainObject(document) || Object.keys(document).sort().join(',') !== 'patterns,schema_version' ||
      document.schema_version !== 1 || !Array.isArray(document.patterns) || document.patterns.length === 0) {
    throw new Error('invalid shared security pattern document')
  }
  const ids = new Set()
  const names = new Set()
  return document.patterns.map(item => {
    const keys = Object.keys(item).sort().join(',')
    if (keys !== 'flags,id,name,pattern' || typeof item.id !== 'string' || !/^[a-z0-9-]+$/.test(item.id) ||
        typeof item.name !== 'string' || item.name === '' || typeof item.pattern !== 'string' || item.pattern === '' ||
        !['', 'i'].includes(item.flags) || ids.has(item.id) || names.has(item.name)) {
      throw new Error(`invalid shared security pattern entry: ${String(item.id)}`)
    }
    ids.add(item.id)
    names.add(item.name)
    return { name: item.name, pattern: new RegExp(item.pattern, item.flags) }
  })
}

const FORBIDDEN_PATTERNS = loadSecurityPatterns()

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (month < 1 || month > 12 || day < 1) return false
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return day <= days[month - 1]
}

function suspiciousBase64Tokens(content) {
  const candidates = content.match(/[A-Za-z0-9+/]{40,}={0,2}/g) || []
  return candidates.filter(candidate => {
    if (candidate.length % 4 !== 0 || !/[A-Z]/.test(candidate) || !/[a-z]/.test(candidate) || !/\d/.test(candidate)) {
      return false
    }
    try {
      const decoded = Buffer.from(candidate, 'base64')
      if (decoded.length < 24 || decoded.toString('base64').replace(/=+$/, '') !== candidate.replace(/=+$/, '')) return false
      const printable = [...decoded].filter(byte => byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126)).length
      return printable / decoded.length >= 0.85
    } catch {
      return false
    }
  })
}

function validateStringArray(value, field, errors, { allowedValues = null } = {}) {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || item.trim() === '')) {
    errors.push(`${field} must be a list of non-empty strings`)
    return []
  }
  if (new Set(value).size !== value.length) {
    errors.push(`${field} contains duplicate entries`)
  }
  if (allowedValues) {
    for (const item of value) {
      if (!allowedValues.includes(item)) {
        errors.push(`Invalid ${field} entry: ${item}. Must be one of: ${allowedValues.join(', ')}`)
      }
    }
  }
  return value
}

function referencedDomains(content) {
  const domains = new Set()
  const candidates = []
  const normalizedContent = content
    .replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_match, hex, decimal) => {
      const value = Number.parseInt(hex || decimal, hex ? 16 : 10)
      return Number.isInteger(value) && value >= 0 && value <= 0x10ffff ? String.fromCodePoint(value) : _match
    })
    .replace(/&colon;/gi, ':')
    .replace(/&sol;/gi, '/')
    .replace(/&period;/gi, '.')
  const absoluteUrlPattern = /https?:\/\/(?:\[[0-9a-f:.%]+\]|[^\s<>()\]"'`]+)[^\s<>()"'`]*/gi
  const schemeRelativePattern = /\/\/(?:\[[0-9a-f:.%]+\]|[a-z0-9.-]+)(?:[/:?#][^\s<>()"'`]*)?/gi

  for (const match of normalizedContent.matchAll(absoluteUrlPattern)) {
    candidates.push(match[0].replace(/[.,;:!?]+$/, ''))
  }
  for (const match of normalizedContent.matchAll(schemeRelativePattern)) {
    candidates.push(`https:${match[0].replace(/[.,;:!?]+$/, '')}`)
  }

  for (const candidate of candidates) {
    try {
      const hostname = new URL(candidate).hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '')
      if (!hostname || hostname === 'localhost' || hostname === 'test' || hostname.endsWith('.localhost')) continue
      if (net.isIP(hostname)) {
        if (hostname === '127.0.0.1' || hostname === '::1') continue
        domains.add(hostname)
        continue
      }
      domains.add(hostname)
    } catch {
      // A malformed literal is ordinary text unless another schema rule owns it.
    }
  }

  return [...domains].sort()
}

function validateSkill(filePath, { strict = false } = {}) {
  const errors = []
  const warnings = []

  if (!filePath.endsWith('.SKILL.md')) {
    return { errors: ['File must end in .SKILL.md'], warnings }
  }

  let content
  try {
    content = readSkillFile(filePath)
  } catch (error) {
    return { errors: [`Could not read skill: ${error.message}`], warnings }
  }

  let parsed
  try {
    parsed = parseSkillContent(content)
  } catch (error) {
    return { errors: [`Invalid YAML frontmatter: ${error.message}`], warnings }
  }

  const { frontmatter: fm, body } = parsed
  for (const field of Object.keys(fm)) {
    if (!ALLOWED_TOP.has(field)) errors.push(`Unknown top-level field: ${field}`)
  }
  for (const field of REQUIRED_TOP) {
    if (!(field in fm)) errors.push(`Missing required field: ${field}`)
  }

  if (typeof fm.name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fm.name)) {
    errors.push('name must be lowercase kebab-case')
  } else {
    const expectedName = path.basename(filePath, '.SKILL.md')
    if (fm.name !== expectedName) {
      errors.push(`name field "${fm.name}" does not match filename "${expectedName}"`)
    }
  }

  if (typeof fm.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(fm.version)) {
    errors.push(`version must be semver (for example 1.0.0), got: ${String(fm.version)}`)
  }
  if (typeof fm.description !== 'string' || fm.description.trim() === '') {
    errors.push('description must be a non-empty string')
  }
  if (typeof fm.author !== 'string' || fm.author.trim() === '') errors.push('author must be a non-empty string')
  if (typeof fm.license !== 'string' || fm.license.trim() === '') errors.push('license must be a non-empty string')
  if (!isISODate(fm.updated)) {
    errors.push('updated must be a real ISO calendar date (YYYY-MM-DD)')
  }
  if (body.trim() === '') errors.push('skill body must not be empty')

  const safetyConstraints = validateStringArray(fm.safety_constraints, 'safety_constraints', errors)
  if (safetyConstraints.length === 0) errors.push('safety_constraints must contain at least one constraint')
  if ('tags' in fm) validateStringArray(fm.tags, 'tags', errors)

  if (!isPlainObject(fm.engenai)) {
    errors.push('engenai must be a mapping')
  } else {
    const manifest = fm.engenai
    for (const field of Object.keys(manifest)) {
      if (!ALLOWED_ENGENAI.has(field)) errors.push(`Unknown engenai field: ${field}`)
    }
    for (const field of REQUIRED_ENGENAI) {
      if (!(field in manifest)) errors.push(`Missing required engenai.${field}`)
    }

    if (!VALID_CATEGORIES.includes(manifest.category)) {
      errors.push(`Invalid category: ${String(manifest.category)}. Must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }
    if (!VALID_TRUST_TIERS.includes(manifest.trust_tier)) {
      errors.push(`Invalid trust_tier: ${String(manifest.trust_tier)}`)
    } else if (!TRUST_GATE_ENABLED && manifest.trust_tier !== 'unvetted') {
      errors.push('trusted tiers are disabled until a ratified Gate 4 verifier exists')
    }
    if (!VALID_RISK_LEVELS.includes(manifest.risk_level)) {
      errors.push(`Invalid risk_level: ${String(manifest.risk_level)}`)
    }

    const capabilities = validateStringArray(manifest.capabilities_required, 'engenai.capabilities_required', errors, {
      allowedValues: VALID_CAPABILITIES,
    })
    if (VALID_RISK_LEVELS.includes(manifest.risk_level)) {
      for (const capability of capabilities) {
        const minimum = MINIMUM_CAPABILITY_RISK[capability]
        if (minimum && RISK_ORDER[manifest.risk_level] < RISK_ORDER[minimum]) {
          errors.push(`${capability} requires risk_level ${minimum} or higher`)
        }
      }
    }
    const allowedDomains = validateStringArray(manifest.allowed_domains, 'engenai.allowed_domains', errors)
    for (const domain of allowedDomains) {
      if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain)) {
        errors.push(`Invalid allowed domain: ${domain}`)
      }
    }

    for (const field of ['content_hash', 'signed_by', 'last_reviewed', 'reviewer']) {
      if (typeof manifest[field] !== 'string') errors.push(`engenai.${field} must be a string`)
    }
    if (typeof manifest.last_reviewed === 'string' && manifest.last_reviewed !== '' && !isISODate(manifest.last_reviewed)) {
      errors.push('engenai.last_reviewed must be empty or a real ISO calendar date (YYYY-MM-DD)')
    }
    if (manifest.trust_tier === 'unvetted' &&
        [manifest.signed_by, manifest.last_reviewed, manifest.reviewer].some(value => value !== '')) {
      errors.push('unvetted skills must not carry signature or approval claims')
    }
    if (typeof manifest.content_hash === 'string' && manifest.content_hash !== '') {
      if (!/^[0-9a-f]{64}$/.test(manifest.content_hash)) {
        errors.push('engenai.content_hash must be empty or a lowercase SHA-256')
      } else if (manifest.content_hash !== computeContentHash(body)) {
        errors.push('engenai.content_hash does not match the canonical skill body')
      }
    }

    for (const domain of referencedDomains(content)) {
      if (net.isIP(domain)) {
        errors.push(`Referenced external IP is not permitted by the domain allowlist: ${domain}`)
        continue
      }
      const allowed = allowedDomains.some(entry => domain === entry || domain.endsWith(`.${entry}`))
      if (!allowed) errors.push(`Referenced domain is not allowlisted: ${domain}`)
    }
  }

  if ('parameters' in fm) {
    if (!isPlainObject(fm.parameters)) {
      errors.push('parameters must be a mapping')
    } else {
      for (const [name, descriptor] of Object.entries(fm.parameters)) {
        if (!/^[a-z][a-z0-9_]*$/.test(name) || !isPlainObject(descriptor)) {
          errors.push(`Invalid parameter definition: ${name}`)
          continue
        }
        for (const field of Object.keys(descriptor)) {
          if (!ALLOWED_PARAMETER_FIELDS.has(field)) errors.push(`Unknown parameters.${name} field: ${field}`)
        }
        if (!VALID_PARAMETER_TYPES.includes(descriptor.type)) {
          errors.push(`Invalid parameter type for ${name}: ${String(descriptor.type)}`)
        }
        if (typeof descriptor.required !== 'boolean') {
          errors.push(`parameters.${name}.required must be boolean`)
        }
        if (typeof descriptor.description !== 'string' || descriptor.description.trim() === '') {
          errors.push(`parameters.${name}.description must be a non-empty string`)
        }
      }
    }
  }

  const normalizedParts = path.normalize(filePath).split(path.sep)
  const skillsIndex = normalizedParts.lastIndexOf('skills')
  if (skillsIndex !== -1 && normalizedParts.length > skillsIndex + 2 && isPlainObject(fm.engenai)) {
    const pathCategory = normalizedParts[skillsIndex + 1]
    if (pathCategory !== fm.engenai.category) {
      errors.push(`path category ${pathCategory} does not match engenai.category ${String(fm.engenai.category)}`)
    }
  }

  for (const field of ['attribution_author', 'attribution_url', 'attribution_notes']) {
    if (field in fm && (typeof fm[field] !== 'string' || fm[field].trim() === '')) {
      errors.push(`${field} must be a non-empty string when present`)
    }
  }

  for (const { pattern, name } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) errors.push(`Forbidden pattern detected: ${name}`)
  }
  if (suspiciousBase64Tokens(content).length > 0) errors.push('Forbidden pattern detected: base64-encoded payload')

  if (strict) {
    if (!Array.isArray(fm.tags) || fm.tags.length === 0) warnings.push('Consider adding tags for search discoverability')
    if (!isPlainObject(fm.parameters)) warnings.push('No parameters defined — add if skill accepts inputs')
  }

  return { errors, warnings, parsed }
}

function main(argv = process.argv.slice(2)) {
  const strict = argv.includes('--strict')
  const files = argv.filter(argument => !argument.startsWith('--'))
  if (files.length === 0) {
    console.error('Usage: validate-skill.js [--strict] <skill-file.SKILL.md> ...')
    return 1
  }

  let totalErrors = 0
  const names = new Map()
  for (const file of files) {
    const { errors, warnings, parsed } = validateSkill(file, { strict })
    if (errors.length === 0) {
      console.log(`✓ ${file}`)
    } else {
      console.error(`✗ ${file}`)
      for (const error of errors) console.error(`  ERROR: ${error}`)
      totalErrors += errors.length
    }
    if (errors.length === 0) {
      const name = parsed.frontmatter.name
      const prior = names.get(name)
      if (prior) {
        console.error(`  ERROR: duplicate skill name ${name}: ${prior} and ${file}`)
        totalErrors += 1
      } else {
        names.set(name, file)
      }
    }
    for (const warning of warnings) console.warn(`  WARN:  ${warning}`)
  }

  if (totalErrors > 0) {
    console.error(`\n${totalErrors} error(s) found. Fix before merging.`)
    return 1
  }
  console.log(`\nAll ${files.length} skill(s) valid.`)
  return 0
}

if (require.main === module) process.exit(main())

module.exports = {
  main,
  referencedDomains,
  validateSkill,
}
