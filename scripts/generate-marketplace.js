#!/usr/bin/env node

'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { computeContentHash, parseSkillContent, readSkillFile } = require('./skill-format')
const { validateSkill } = require('./validate-skill')

const root = path.join(__dirname, '..')
const skillsDir = path.join(root, 'skills')
const outputPath = path.join(root, '.claude-plugin', 'marketplace.json')

function findSkillFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findSkillFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.SKILL.md')) {
      results.push(fullPath)
    }
  }
  return results.sort()
}

function marketplaceRelativePath(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/')
}

function skillEntry(filePath) {
  const { errors, parsed } = validateSkill(filePath, { strict: false })
  if (errors.length > 0) {
    throw new Error(`${filePath} failed validation:\n- ${errors.join('\n- ')}`)
  }

  const { frontmatter: fm, body } = parsed
  const manifest = fm.kaidera || fm.engenai
  const entry = {
    name: fm.name,
    version: fm.version,
    description: fm.description,
    category: manifest.category,
    trust_tier: manifest.trust_tier,
    risk_level: manifest.risk_level,
    capabilities_required: manifest.capabilities_required,
    allowed_domains: manifest.allowed_domains,
    safety_constraints: fm.safety_constraints,
    parameters: fm.parameters || {},
    author: fm.author,
    license: fm.license,
    updated: fm.updated,
    tags: fm.tags || [],
    content_hash: computeContentHash(body),
    signed_by: manifest.signed_by,
    last_reviewed: manifest.last_reviewed,
    reviewer: manifest.reviewer,
    file: marketplaceRelativePath(filePath),
  }

  if (fm.attribution_author || fm.attribution_url || fm.attribution_notes) {
    entry.attribution_author = fm.attribution_author || ''
    entry.attribution_url = fm.attribution_url || ''
    entry.attribution_notes = fm.attribution_notes || ''
  }

  return entry
}

function assertUniqueSkillNames(skills) {
  const seen = new Map()
  for (const skill of skills) {
    const prior = seen.get(skill.name)
    if (prior) {
      throw new Error(`duplicate skill name ${skill.name}: ${prior} and ${skill.file}`)
    }
    seen.set(skill.name, skill.file)
  }
}

function buildMarketplace() {
  const skills = findSkillFiles(skillsDir).map(skillEntry)
  assertUniqueSkillNames(skills)
  const newestSkillDate = skills.reduce(
    (latest, skill) => (skill.updated > latest ? skill.updated : latest),
    '1970-01-01',
  )

  return {
    name: 'Kaidera Skills Marketplace',
    description: 'Locally validated, provenance-aware skills for Kaidera agents',
    version: '1.0.0',
    source: 'https://github.com/Kaidera-AI/skills',
    // This is deliberately source-derived so two clean checkouts produce the
    // same catalogue bytes. It is the newest declared skill revision date,
    // not a wall-clock timestamp from the generator process.
    generated_at: `${newestSkillDate}T00:00:00.000Z`,
    generation_basis: 'maximum skill updated date',
    skills,
  }
}

function main(argv = process.argv.slice(2)) {
  const hashIndex = argv.indexOf('--hash')
  if (hashIndex !== -1) {
    const filePath = argv[hashIndex + 1]
    if (!filePath) {
      console.error('Usage: generate-marketplace.js --hash <skill-file.SKILL.md>')
      return 1
    }
    try {
      const { body } = parseSkillContent(readSkillFile(filePath))
      console.log(computeContentHash(body))
      return 0
    } catch (error) {
      console.error(`ERROR: ${error.message}`)
      return 1
    }
  }

  let marketplace
  try {
    marketplace = buildMarketplace()
  } catch (error) {
    console.error(`ERROR: ${error.message}`)
    return 1
  }

  const output = JSON.stringify(marketplace, null, 2)
  if (argv.includes('--dry-run')) {
    console.log(output)
    console.log(`\nDry run: ${marketplace.skills.length} skill(s) would be published.`)
    return 0
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${output}\n`)
  console.log(`Generated marketplace.json with ${marketplace.skills.length} skill(s).`)
  return 0
}

if (require.main === module) process.exit(main())

module.exports = {
  assertUniqueSkillNames,
  buildMarketplace,
  findSkillFiles,
  main,
  marketplaceRelativePath,
  skillEntry,
}
