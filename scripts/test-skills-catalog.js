#!/usr/bin/env node

'use strict'

const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { buildMarketplace } = require('./generate-marketplace')
const { readSkillFile } = require('./skill-format')

const root = path.join(__dirname, '..')
const catalogPath = path.join(root, 'docs', 'KAIDERA-SKILLS-CATALOG.md')
const readmePath = path.join(root, 'README.md')
const markerPattern = /^<!-- kaidera-skill-catalog-entry (\{[^\r\n]+\}) -->$/gm
const markerFields = [
  'capabilities_required',
  'category',
  'legacy',
  'name',
  'path',
  'posture',
  'review_fingerprint',
  'risk_level',
  'trust_tier',
  'version',
]
const postureLabels = new Map([
  ['bounded-candidate', 'Bounded candidate'],
  ['reference-only', 'Reference-only'],
  ['manual-only', 'Manual-only'],
  ['rework-before-use', 'Rework before use'],
])
const posturePolicy = new Map([
  ['bounded-candidate', new Set([
    'adaptech-uiux-design',
    'assumption-validation',
    'open-code-review',
    'research-brief',
      'kaidera-sdlc',
    'unlazy',
])],
  ['reference-only', new Set([
    'agent-platform-context',
    'api-design',
    'api-test',
    'backend-context',
    'container-build',
    'frontend-context',
    'infrastructure-context',
    'k8s-deploy',
    'prompt-injection-test',
    'security-context',
    'workspace-context',
      'human-voice',
])],
  ['manual-only', new Set([
    'deploy-to-dev',
    'sprint-closing',
    'terraform-module',
      'assert-fact-gate',
    'cloud-agnostic-policy',
    'deploy-gate',
    'infra-naming-gate',
    'route-handoff-gate',
    'scope-work-gate',
])],
  ['rework-before-use', new Set([
    'code-review',
    'code-review-security',
    'database-migration',
    'dependency-audit',
    'git-workflow',
    'incident-response',
    'performance-profiling',
    'sprint-context',
    'tdd-workflow',
    'ultrareview',
  ])],
])
const legacySkills = new Set([
  'agent-platform-context',
  'api-design',
  'api-test',
  'backend-context',
  'code-review',
  'code-review-security',
  'container-build',
  'database-migration',
  'dependency-audit',
  'deploy-to-dev',
  'frontend-context',
  'git-workflow',
  'incident-response',
  'infrastructure-context',
  'k8s-deploy',
  'performance-profiling',
  'security-context',
  'sprint-closing',
  'sprint-context',
  'tdd-workflow',
  'terraform-module',
  'workspace-context',
])
const currentSourceSkills = new Set([
  'adaptech-uiux-design',
  'assumption-validation',
  'open-code-review',
  'prompt-injection-test',
  'research-brief',
  'ultrareview',
    'assert-fact-gate',
    'cloud-agnostic-policy',
    'deploy-gate',
    'human-voice',
    'infra-naming-gate',
    'kaidera-sdlc',
    'route-handoff-gate',
    'scope-work-gate',
    'unlazy',
])
const categoryLabels = new Map([
  ['context', 'Context'],
  ['development', 'Development'],
  ['devops', 'DevOps'],
  ['documentation', 'Documentation'],
  ['research', 'Research'],
  ['security', 'Security'],
])
const requiredHeadings = [
  '# Kaidera Skills Catalogue and Operating Guide',
  '## Current release boundary',
  '## Portfolio summary',
  '## Authority and invocation model',
  '## Ecosystem use and compatibility',
  '## Operating-posture legend',
  '## Capability legend',
  '## Routing guide',
  '## Catalogue at a glance',
  '## Ownership, licensing, attribution, and domain metadata',
  '## Context skills',
  '## Development skills',
  '## DevOps skills',
  '## Documentation skills',
  '## Research skills',
  '## Security skills',
  '## Common usage examples',
  '## Portfolio overlaps and collision rules',
  '## Lifecycle from source to runtime',
  '## Known portfolio debt',
  '## Recommended portfolio roadmap',
  '## Maintaining this canonical catalogue',
  '## Related canonical and evidence documents',
]

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function lineCount(content, line) {
  return (content.match(new RegExp(`^${escapeRegExp(line)}$`, 'gm')) || []).length
}

function linePrefixCount(content, prefix) {
  return (content.match(new RegExp(`^${escapeRegExp(prefix)}`, 'gm')) || []).length
}

function markdownCell(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/\|/g, '\\|')
}

function governanceRow(skill) {
  const domains = skill.allowed_domains.length > 0
    ? skill.allowed_domains.map(domain => `\`${markdownCell(domain)}\``).join(', ')
    : 'None'
  const donor = skill.attribution_author
    ? `[${markdownCell(skill.attribution_author)}](${skill.attribution_url})`
    : '—'
  return `| \`${skill.name}\` | \`${markdownCell(skill.author)}\` | `
    + `\`${markdownCell(skill.license)}\` | ${domains} | ${donor} |`
}

function canonicalValue(value) {
  if (Array.isArray(value)) return value.map(canonicalValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, canonicalValue(value[key])]),
    )
  }
  return value
}

function reviewFingerprint(skill) {
  return crypto.createHash('sha256')
    .update(JSON.stringify(canonicalValue(skill)), 'utf8')
    .digest('hex')
}

function expectedPosture(name) {
  for (const [posture, names] of posturePolicy) {
    if (names.has(name)) return posture
  }
  return null
}

function capabilitySummary(marker) {
  if (marker.capabilities_required.length === 0) {
    return marker.posture === 'reference-only' ? 'none' : 'none declared'
  }
  const labels = new Map([
    ['tool:file_read', 'file read'],
    ['tool:file_write', 'file write'],
    ['tool:code_interpreter', 'interpreter'],
    ['tool:web_search', 'web search'],
    ['tool:mcp_external', 'external connector'],
  ])
  return marker.capabilities_required.map(capability => labels.get(capability) || capability).join(', ')
}

function parseMarkers(content, errors) {
  const rawCount = (content.match(/^<!-- kaidera-skill-catalog-entry/gm) || []).length
  const markers = []
  for (const match of content.matchAll(markerPattern)) {
    try {
      markers.push(JSON.parse(match[1]))
    } catch (error) {
      errors.push(`catalogue marker is not valid JSON: ${error.message}`)
    }
  }
  if (rawCount !== markers.length) {
    errors.push(`expected ${rawCount} well-formed catalogue markers, parsed ${markers.length}`)
  }
  return markers
}

function validateLocalLinks(content, errors) {
  for (const match of content.matchAll(/\[[^\]\r\n]+\]\(([^)\r\n]+)\)/g)) {
    const target = match[1]
    if (target.startsWith('https://') || target.startsWith('#')) continue
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) {
      errors.push(`unsupported catalogue link target: ${target}`)
      continue
    }
    const relativeTarget = target.split('#', 1)[0]
    const resolved = path.resolve(path.dirname(catalogPath), relativeTarget)
    const relativeToRoot = path.relative(root, resolved)
    if (relativeToRoot === '..' || relativeToRoot.startsWith(`..${path.sep}`) || path.isAbsolute(relativeToRoot)) {
      errors.push(`catalogue link escapes repository root: ${target}`)
      continue
    }
    try {
      const stat = fs.lstatSync(resolved)
      if (!stat.isFile() || stat.isSymbolicLink()) {
        errors.push(`catalogue link is not a regular repository file: ${target}`)
      }
    } catch {
      errors.push(`catalogue link target does not exist: ${target}`)
    }
  }
}

function validateCatalog(content, marketplace) {
  const errors = []
  validateLocalLinks(content, errors)
  const markers = parseMarkers(content, errors)
  const skills = marketplace.skills
  const byName = new Map(skills.map(skill => [skill.name, skill]))
  const markerNames = markers.map(marker => marker.name)
  const expectedNames = skills.map(skill => skill.name)
  const policyNames = [...posturePolicy.values()].flatMap(names => [...names]).sort()
  const legacyPolicyNames = [...legacySkills, ...currentSourceSkills].sort()

  if (JSON.stringify(markerNames) !== JSON.stringify(expectedNames)) {
    errors.push('catalogue markers must cover every marketplace skill once in canonical file order')
  }
  if (JSON.stringify(policyNames) !== JSON.stringify([...expectedNames].sort())) {
    errors.push('portfolio posture policy must cover every marketplace skill exactly once')
  }
  if (JSON.stringify(legacyPolicyNames) !== JSON.stringify([...expectedNames].sort())) {
    errors.push('legacy/current-source policy must cover every marketplace skill exactly once')
  }

  const seen = new Set()
  for (const marker of markers) {
    const name = typeof marker.name === 'string' ? marker.name : '<missing-name>'
    if (seen.has(name)) errors.push(`duplicate catalogue marker for ${name}`)
    seen.add(name)

    const actualFields = Object.keys(marker).sort()
    if (JSON.stringify(actualFields) !== JSON.stringify(markerFields)) {
      errors.push(`${name}: marker fields must be exactly ${markerFields.join(', ')}`)
    }
    if (!postureLabels.has(marker.posture)) {
      errors.push(`${name}: unsupported operating posture ${JSON.stringify(marker.posture)}`)
    }
    if (marker.posture !== expectedPosture(name)) {
      errors.push(`${name}: operating posture differs from the reviewed portfolio policy`)
    }
    if (typeof marker.legacy !== 'boolean') {
      errors.push(`${name}: legacy classification must be boolean`)
    } else if (marker.legacy !== legacySkills.has(name)) {
      errors.push(`${name}: legacy classification differs from the reviewed portfolio policy`)
    }

    const skill = byName.get(name)
    if (!skill) {
      errors.push(`${name}: marker does not match a marketplace skill`)
      continue
    }
    const expected = {
      name: skill.name,
      path: skill.file,
      version: skill.version,
      category: skill.category,
      trust_tier: skill.trust_tier,
      risk_level: skill.risk_level,
      capabilities_required: skill.capabilities_required,
      review_fingerprint: reviewFingerprint(skill),
    }
    for (const [field, value] of Object.entries(expected)) {
      if (JSON.stringify(marker[field]) !== JSON.stringify(value)) {
        errors.push(`${name}: marker ${field} does not match the skill manifest`)
      }
    }

    const heading = `### \`${name}\``
    if (lineCount(content, heading) !== 1) {
      errors.push(`${name}: expected exactly one detailed skill heading`)
      continue
    }
    const start = content.indexOf(`${heading}\n`)
    const rest = content.slice(start + heading.length + 1)
    const nextHeading = rest.search(/^#{2,3} /m)
    const section = nextHeading === -1 ? rest : rest.slice(0, nextHeading)
    for (const label of ['Function', 'Use when', 'Do not use when', 'Authority and effects', 'Kaidera action']) {
      if (!section.includes(`- **${label}:**`)) {
        errors.push(`${name}: detailed entry is missing ${label}`)
      }
    }
    const hasCombinedIO = section.includes('- **Inputs and output:**')
    const hasSeparateIO = section.includes('- **Inputs:**') && section.includes('- **Output:**')
    if (!hasCombinedIO && !hasSeparateIO) {
      errors.push(`${name}: detailed entry must document inputs and output`)
    }

    const manifestLink = `- **Manifest:** [${path.basename(skill.file)}](../${skill.file})`
    if (!section.includes(manifestLink)) {
      errors.push(`${name}: detailed entry has a missing or stale manifest link`)
    }
    const category = categoryLabels.get(skill.category)
    const glancePrefix = `| ${category} | \`${name}\` |`
    if (linePrefixCount(content, glancePrefix) !== 1) {
      errors.push(`${name}: expected exactly one catalogue-at-a-glance row`)
    } else {
      const glanceRow = content.split('\n').find(line => line.startsWith(glancePrefix))
      const cells = glanceRow.split('|').slice(1, -1).map(cell => cell.trim())
      const expectedGlancePosture = `${postureLabels.get(marker.posture)}${marker.legacy ? ', legacy' : ''}`
      const expectedRiskCapabilities = `${marker.risk_level} / ${capabilitySummary(marker)}`
      if (cells[0] !== category || cells[1] !== `\`${name}\`` || cells[2] !== `\`${skill.version}\``) {
        errors.push(`${name}: catalogue-at-a-glance identity or version is stale`)
      }
      if (cells[3].length === 0) {
        errors.push(`${name}: catalogue-at-a-glance function is empty`)
      }
      if (cells[4] !== expectedGlancePosture) {
        errors.push(`${name}: catalogue-at-a-glance posture is stale`)
      }
      if (cells[5] !== expectedRiskCapabilities) {
        errors.push(`${name}: catalogue-at-a-glance risk or capabilities are stale`)
      }
    }
    if (lineCount(content, governanceRow(skill)) !== 1) {
      errors.push(`${name}: ownership/licence/domain/attribution row is missing or stale`)
    }
  }

  const totalLine = `Total skills: **${skills.length}**`
  if (lineCount(content, totalLine) !== 1) {
    errors.push(`catalogue total must be exactly ${skills.length}`)
  }

  for (const [category, label] of categoryLabels) {
    const count = skills.filter(skill => skill.category === category).length
    if (lineCount(content, `| ${label} | ${count} |`) !== 1) {
      errors.push(`${label}: portfolio category count must be ${count}`)
    }
  }
  const trustCounts = new Map()
  for (const skill of skills) {
    trustCounts.set(skill.trust_tier, (trustCounts.get(skill.trust_tier) || 0) + 1)
  }
  for (const [trustTier, count] of trustCounts) {
    if (lineCount(content, `| \`${trustTier}\` | ${count} |`) !== 1) {
      errors.push(`${trustTier}: portfolio trust-tier count must be ${count}`)
    }
  }
  if (trustCounts.size === 1) {
    const [[trustTier, count]] = trustCounts
    if (lineCount(content, `- All ${count} skills are \`${trustTier}\`.`) !== 1) {
      errors.push(`release-boundary trust statement must cover all ${count} skills`)
    }
  }
  for (const [posture, label] of postureLabels) {
    const count = markers.filter(marker => marker.posture === posture).length
    if (lineCount(content, `| ${label} | ${count} |`) !== 1) {
      errors.push(`${label}: portfolio posture count must be ${count}`)
    }
  }
  if (lineCount(content, `Legacy entries: **${legacySkills.size}**`) !== 1) {
    errors.push(`legacy entry count must be ${legacySkills.size}`)
  }
  if (lineCount(content, `Current-source entries: **${currentSourceSkills.size}**`) !== 1) {
    errors.push(`current-source entry count must be ${currentSourceSkills.size}`)
  }

  for (const heading of requiredHeadings) {
    if (lineCount(content, heading) !== 1) {
      errors.push(`required heading must appear exactly once: ${heading}`)
    }
  }

  return errors
}

function validateReadme(readme, marketplace) {
  const errors = []
  if (!readme.includes('[Kaidera Skills Catalogue and Operating Guide](docs/KAIDERA-SKILLS-CATALOG.md)')) {
    errors.push('README must link to the canonical skills catalogue')
  }
  for (const [category, label] of categoryLabels) {
    const count = marketplace.skills.filter(skill => skill.category === category).length
    if (lineCount(readme, `| \`${category}/\` | ${readmeCategoryDescription(category)} | ${count} |`) !== 1) {
      errors.push(`${label}: README category count or description is stale`)
    }
  }
  return errors
}

function readmeCategoryDescription(category) {
  return new Map([
    ['context', 'Project and workspace awareness'],
    ['development', 'Code writing, review, testing'],
    ['devops', 'Deployment, infrastructure, CI/CD'],
    ['documentation', 'Specs, docs, changelogs, writing voice'],
    ['research', 'Research briefs and evidence planning'],
    ['security', 'Auditing, scanning, incident response'],
  ]).get(category)
}

function assertRejected(label, content, marketplace, expectedError) {
  const errors = validateCatalog(content, marketplace)
  assert(
    errors.some(error => error.includes(expectedError)),
    `${label}: expected error containing ${JSON.stringify(expectedError)}, got ${errors.join('; ')}`,
  )
}

function assertReadmeRejected(label, readme, marketplace, expectedError) {
  const errors = validateReadme(readme, marketplace)
  assert(
    errors.some(error => error.includes(expectedError)),
    `${label}: expected README error containing ${JSON.stringify(expectedError)}, got ${errors.join('; ')}`,
  )
}

function main() {
  const content = readSkillFile(catalogPath)
  const readme = readSkillFile(readmePath)
  const marketplace = buildMarketplace()
  const errors = [
    ...validateCatalog(content, marketplace),
    ...validateReadme(readme, marketplace),
  ]
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`)
    return 1
  }

  const firstSkill = marketplace.skills[0]
  const firstMarker = content.match(markerPattern)[0]
  const firstRecord = JSON.parse(
    firstMarker.match(/^<!-- kaidera-skill-catalog-entry (\{[^\r\n]+\}) -->$/)[1],
  )
  assertRejected(
    'missing marker',
    content.replace(`${firstMarker}\n`, ''),
    marketplace,
    'cover every marketplace skill once',
  )
  assertRejected(
    'duplicate marker',
    `${content}\n${firstMarker}\n`,
    marketplace,
    'duplicate catalogue marker',
  )
  assertRejected(
    'metadata drift',
    content.replace(firstMarker, firstMarker.replace(
      `"version":"${firstRecord.version}"`,
      '"version":"999.0.0"',
    )),
    marketplace,
    'marker version does not match',
  )
  const changedMarketplace = structuredClone(marketplace)
  changedMarketplace.skills[0].description = `${changedMarketplace.skills[0].description} changed`
  assertRejected(
    'reviewed source contract drift',
    content,
    changedMarketplace,
    'marker review_fingerprint does not match',
  )
  assertRejected(
    'total drift',
    content.replace(`Total skills: **${marketplace.skills.length}**`, 'Total skills: **999**'),
    marketplace,
    `catalogue total must be exactly ${marketplace.skills.length}`,
  )
  assertRejected(
    'unsupported posture',
    content.replace(firstMarker, firstMarker.replace(
      `"posture":"${firstRecord.posture}"`,
      '"posture":"automatic"',
    )),
    marketplace,
    'unsupported operating posture',
  )
  const alternatePosture = [...postureLabels.keys()].find(posture => posture !== firstRecord.posture)
  assertRejected(
    'unreviewed posture promotion',
    content.replace(firstMarker, firstMarker.replace(
      `"posture":"${firstRecord.posture}"`,
      `"posture":"${alternatePosture}"`,
    )),
    marketplace,
    'operating posture differs from the reviewed portfolio policy',
  )
  assertRejected(
    'unreviewed legacy reclassification',
    content.replace(firstMarker, firstMarker.replace(
      `"legacy":${firstRecord.legacy}`,
      `"legacy":${!firstRecord.legacy}`,
    )),
    marketplace,
    'legacy classification differs from the reviewed portfolio policy',
  )
  assertRejected(
    'category count drift',
    content.replace(
      `| ${categoryLabels.get(firstSkill.category)} | `
        + `${marketplace.skills.filter(skill => skill.category === firstSkill.category).length} |`,
      `| ${categoryLabels.get(firstSkill.category)} | 999 |`,
    ),
    marketplace,
    `${categoryLabels.get(firstSkill.category)}: portfolio category count must be`,
  )
  assertRejected(
    'governance metadata drift',
    content.replace(governanceRow(firstSkill), governanceRow(firstSkill).replace(
      `\`${firstSkill.author}\``,
      '`unknown`',
    )),
    marketplace,
    'ownership/licence/domain/attribution row is missing or stale',
  )
  assertRejected(
    'visible posture drift',
    content.replace(
      `${postureLabels.get(firstRecord.posture)}${firstRecord.legacy ? ', legacy' : ''}`,
      'Bounded candidate',
    ),
    marketplace,
    'catalogue-at-a-glance posture is stale',
  )
  assertRejected(
    'visible risk drift',
    content.replace(
      `${firstRecord.risk_level} / ${capabilitySummary(firstRecord)}`,
      'critical / cluster-admin',
    ),
    marketplace,
    'catalogue-at-a-glance risk or capabilities are stale',
  )
  assertRejected(
    'broken local link',
    content.replace(`../${firstSkill.file}`, '../skills/missing.SKILL.md'),
    marketplace,
    'catalogue link target does not exist',
  )
  assertRejected(
    'missing authority section',
    content.replace('## Authority and invocation model', '## Authority model removed'),
    marketplace,
    'required heading must appear exactly once',
  )
  assertReadmeRejected(
    'README catalogue link removal',
    readme.replace('[Kaidera Skills Catalogue and Operating Guide]', '[Skills guide removed]'),
    marketplace,
    'README must link to the canonical skills catalogue',
  )
  assertReadmeRejected(
    'README category count drift',
    readme.replace(`| \`${firstSkill.category}/\` | ${readmeCategoryDescription(firstSkill.category)} |`,
      `| \`${firstSkill.category}/\` | ${readmeCategoryDescription(firstSkill.category)} changed |`),
    marketplace,
    'README category count or description is stale',
  )

  console.log(
    `skills catalogue valid: ${marketplace.skills.length} skills, `
      + 'source fingerprints, metadata, and required section shapes match',
  )
  return 0
}

if (require.main === module) process.exit(main())

module.exports = { governanceRow, reviewFingerprint, validateCatalog, validateReadme }
