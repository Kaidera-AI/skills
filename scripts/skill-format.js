'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const YAML = require('yaml')

const MAX_SKILL_BYTES = 1024 * 1024

function readSkillFile(filePath) {
  const before = fs.lstatSync(filePath)
  if (!before.isFile() || before.isSymbolicLink()) {
    throw new Error('skill path must be a regular non-symlink file')
  }
  if (before.size > MAX_SKILL_BYTES) {
    throw new Error(`skill exceeds ${MAX_SKILL_BYTES} byte limit`)
  }

  const noFollow = fs.constants.O_NOFOLLOW || 0
  const nonBlock = fs.constants.O_NONBLOCK || 0
  const fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow | nonBlock)
  try {
    const held = fs.fstatSync(fd)
    if (!held.isFile() || held.dev !== before.dev || held.ino !== before.ino) {
      throw new Error('skill path changed before it could be read')
    }
    const chunks = []
    let total = 0
    while (total <= MAX_SKILL_BYTES) {
      const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, MAX_SKILL_BYTES + 1 - total))
      const count = fs.readSync(fd, chunk, 0, chunk.length, null)
      if (count === 0) break
      chunks.push(chunk.subarray(0, count))
      total += count
    }
    const bytes = Buffer.concat(chunks, total)
    const after = fs.fstatSync(fd)
    if (bytes.length > MAX_SKILL_BYTES || after.size !== held.size || bytes.length !== after.size) {
      throw new Error('skill bytes changed while they were being read or exceed the size limit')
    }
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      throw new Error('skill must contain valid UTF-8')
    }
  } finally {
    fs.closeSync(fd)
  }
}

function splitSkillDocument(content) {
  if (typeof content !== 'string') {
    throw new TypeError('skill content must be a string')
  }

  const opening = content.match(/^---[ \t]*(?:\r?\n)/)
  if (!opening) {
    throw new Error('skill must start with a YAML frontmatter delimiter')
  }

  const closingPattern = /^---[ \t]*(?:\r?\n|$)/gm
  closingPattern.lastIndex = opening[0].length
  const closing = closingPattern.exec(content)
  if (!closing) {
    throw new Error('skill frontmatter is missing its closing delimiter')
  }

  return {
    frontmatterSource: content.slice(opening[0].length, closing.index),
    body: content.slice(closing.index + closing[0].length),
  }
}

function parseSkillContent(content) {
  const split = splitSkillDocument(content)
  const document = YAML.parseDocument(split.frontmatterSource, {
    prettyErrors: true,
    schema: 'core',
    strict: true,
    uniqueKeys: true,
  })

  if (document.errors.length > 0) {
    throw new Error(document.errors.map(error => error.message).join('; '))
  }

  const frontmatter = document.toJS({ maxAliasCount: 0 })
  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw new Error('skill frontmatter must be a YAML mapping')
  }

  return {
    frontmatter,
    body: split.body.trim(),
    frontmatterSource: split.frontmatterSource,
  }
}

function computeContentHash(body) {
  const canonicalBody = body.replace(/\r\n?/g, '\n').trim()
  return crypto.createHash('sha256').update(canonicalBody, 'utf8').digest('hex')
}

module.exports = {
  MAX_SKILL_BYTES,
  computeContentHash,
  parseSkillContent,
  readSkillFile,
  splitSkillDocument,
}
