#!/usr/bin/env node

'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const Ajv2020 = require('ajv/dist/2020')
const addFormats = require('ajv-formats')

const MAX_REPORT_BYTES = 16 * 1024 * 1024
const TYPE = { null: 0, raw: 1, utf8: 2, u64: 3, boolean: 4 }

const PROFILES = {
  reviewScope: [
    ['depth', 'utf8'],
    ['intent_sha256', 'utf8'],
    ['focus_sha256', 'utf8'],
  ],
  target: [
    ['schema_version', 'u64'],
    ['mode', 'utf8'],
    ['repository_root', 'utf8'],
    ['git_object_format', 'utf8'],
    ['git_version', 'utf8'],
    ['receipt_profile', 'utf8'],
    ['review_scope_sha256', 'utf8'],
    ['head_commit', 'utf8'],
    ['head_tree', 'utf8'],
    ['base_commit', 'utf8'],
    ['base_tree', 'utf8'],
    ['merge_base', 'utf8'],
    ['index_entries_sha256', 'utf8'],
    ['staged_diff_sha256', 'utf8'],
    ['unstaged_diff_sha256', 'utf8'],
    ['status_porcelain_v2_sha256', 'utf8'],
    ['untracked_inventory_sha256', 'utf8'],
    ['supplied_patch_sha256', 'utf8'],
    ['review_diff_sha256', 'utf8'],
    ['path_ledger_sha256', 'utf8'],
    ['policy_receipt_sha256', 'utf8'],
  ],
  path: [
    ['record_kind', 'utf8'],
    ['status', 'utf8'],
    ['layer', 'utf8'],
    ['stage', 'u64'],
    ['old_path_encoding', 'utf8'],
    ['old_path_value', 'raw'],
    ['new_path_encoding', 'utf8'],
    ['new_path_value', 'raw'],
    ['old_mode', 'utf8'],
    ['new_mode', 'utf8'],
    ['old_object_id', 'utf8'],
    ['new_object_id', 'utf8'],
    ['content_sha256', 'utf8'],
    ['hunks_total', 'u64'],
    ['hunks_reviewed', 'u64'],
    ['bytes_total', 'u64'],
    ['bytes_reviewed', 'u64'],
    ['disposition', 'utf8'],
    ['reason', 'utf8'],
  ],
  policy: [
    ['authority_rank', 'u64'],
    ['applicability', 'utf8'],
    ['source_encoding', 'utf8'],
    ['source_value', 'raw'],
    ['revision', 'utf8'],
    ['object_identity', 'utf8'],
    ['content_sha256', 'utf8'],
    ['classification', 'utf8'],
  ],
  finding: [
    ['source', 'utf8'],
    ['rule_identity', 'utf8'],
    ['path_encoding', 'utf8'],
    ['path_value', 'raw'],
    ['symbol', 'utf8'],
    ['root_cause_class', 'utf8'],
    ['impact_class', 'utf8'],
    ['target_side', 'utf8'],
  ],
}

function unsigned(value, bytes) {
  const number = typeof value === 'bigint' ? value : BigInt(value)
  if (number < 0n || number >= 1n << BigInt(bytes * 8)) throw new RangeError('unsigned integer is out of range')
  const result = Buffer.alloc(bytes)
  result.writeBigUInt64BE(number, bytes - 8)
  return result
}

function lengthPrefix(value, bytes) {
  if (bytes === 2) {
    if (value > 0xffff) throw new RangeError('length exceeds u16')
    const result = Buffer.alloc(2)
    result.writeUInt16BE(value)
    return result
  }
  if (bytes === 4) {
    if (value > 0xffffffff) throw new RangeError('length exceeds u32')
    const result = Buffer.alloc(4)
    result.writeUInt32BE(value)
    return result
  }
  return unsigned(value, 8)
}

function encodeValue(kind, value) {
  if (value === null || value === undefined) return { tag: TYPE.null, bytes: Buffer.alloc(0) }
  if (kind === 'raw') {
    if (!Buffer.isBuffer(value)) throw new TypeError('raw profile value must be a Buffer')
    return { tag: TYPE.raw, bytes: value }
  }
  if (kind === 'utf8') {
    if (typeof value !== 'string') throw new TypeError('UTF-8 profile value must be a string')
    return { tag: TYPE.utf8, bytes: Buffer.from(value, 'utf8') }
  }
  if (kind === 'u64') {
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError('u64 profile value must be a safe unsigned integer')
    return { tag: TYPE.u64, bytes: unsigned(value, 8) }
  }
  if (kind === 'boolean') {
    if (typeof value !== 'boolean') throw new TypeError('boolean profile value must be boolean')
    return { tag: TYPE.boolean, bytes: Buffer.from([value ? 1 : 0]) }
  }
  throw new TypeError(`unknown profile type ${kind}`)
}

function encodeRecords(profile, records) {
  if (!Array.isArray(profile) || !Array.isArray(records)) throw new TypeError('profile and records must be arrays')
  const chunks = [Buffer.from('OCR1', 'ascii'), lengthPrefix(records.length, 4)]
  for (const record of records) {
    chunks.push(lengthPrefix(profile.length, 2))
    for (const [key, kind] of profile) {
      const keyBytes = Buffer.from(key, 'ascii')
      if (keyBytes.toString('ascii') !== key) throw new TypeError('profile keys must be ASCII')
      const encoded = encodeValue(kind, record[key])
      chunks.push(lengthPrefix(keyBytes.length, 2), keyBytes, Buffer.from([encoded.tag]), lengthPrefix(encoded.bytes.length, 8), encoded.bytes)
    }
  }
  return Buffer.concat(chunks)
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex')
}

function canonicalBase64(value) {
  if (typeof value !== 'string' || value.length % 4 !== 0) throw new TypeError('base64 path value is not canonical')
  const decoded = Buffer.from(value, 'base64')
  if (decoded.toString('base64') !== value) throw new TypeError('base64 path value is not canonical')
  return decoded
}

function losslessPathBytes(pathValue) {
  if (pathValue === null) return null
  if (pathValue.encoding === 'utf8') return Buffer.from(pathValue.value, 'utf8')
  if (pathValue.encoding === 'base64') return canonicalBase64(pathValue.value)
  throw new TypeError('unknown lossless path encoding')
}

function flattenPathRecord(record) {
  return {
    record_kind: record.record_kind,
    status: record.status,
    layer: record.layer,
    stage: record.stage,
    old_path_encoding: record.old_path?.encoding ?? null,
    old_path_value: losslessPathBytes(record.old_path),
    new_path_encoding: record.new_path?.encoding ?? null,
    new_path_value: losslessPathBytes(record.new_path),
    old_mode: record.old_mode,
    new_mode: record.new_mode,
    old_object_id: record.old_object_id,
    new_object_id: record.new_object_id,
    content_sha256: record.content_sha256,
    hunks_total: record.hunks_total,
    hunks_reviewed: record.hunks_reviewed,
    bytes_total: record.bytes_total,
    bytes_reviewed: record.bytes_reviewed,
    disposition: record.disposition,
    reason: record.reason,
  }
}

function hashPathRecord(record) {
  return sha256(encodeRecords(PROFILES.path, [flattenPathRecord(record)]))
}

function compareBuffers(left, right) {
  if (left === null && right === null) return 0
  if (left === null) return -1
  if (right === null) return 1
  return Buffer.compare(left, right)
}

function sortedPathBodies(records) {
  const layerOrder = { head: 0, index: 1, worktree: 2 }
  return records.map(flattenPathRecord).sort((left, right) => {
    return compareBuffers(left.new_path_value, right.new_path_value) ||
      layerOrder[left.layer] - layerOrder[right.layer] ||
      (left.stage ?? -1) - (right.stage ?? -1) ||
      compareBuffers(left.old_path_value, right.old_path_value) ||
      Buffer.compare(encodeRecords(PROFILES.path, [left]), encodeRecords(PROFILES.path, [right]))
  })
}

function hashPathLedger(records) {
  return sha256(encodeRecords(PROFILES.path, sortedPathBodies(records)))
}

function hashReviewScope(scope) {
  return sha256(encodeRecords(PROFILES.reviewScope, [scope]))
}

function flattenTargetReceipt(receipt) {
  const record = {}
  for (const [key] of PROFILES.target) record[key] = receipt[key]
  return record
}

function hashTargetReceipt(receipt) {
  return sha256(encodeRecords(PROFILES.target, [flattenTargetReceipt(receipt)]))
}

function findingPath(finding, pathRecord) {
  if (finding.location.side === 'old') return pathRecord.old_path
  return pathRecord.new_path || pathRecord.old_path
}

function flattenFinding(finding, pathRecord) {
  const selected = findingPath(finding, pathRecord)
  if (!selected) throw new TypeError('finding does not resolve to a path in its target record')
  return {
    source: finding.source,
    rule_identity: finding.rule,
    path_encoding: selected.encoding,
    path_value: losslessPathBytes(selected),
    symbol: finding.location.symbol,
    root_cause_class: finding.root_cause_class,
    impact_class: finding.impact_class,
    target_side: finding.location.side,
  }
}

function hashFindingFingerprint(finding, pathRecord) {
  return sha256(encodeRecords(PROFILES.finding, [flattenFinding(finding, pathRecord)]))
}

function addReferenceErrors(ids, references, label, errors) {
  for (const id of references) if (!ids.has(id)) errors.push(`${label} references unknown path_record_id ${id}`)
}

function validateReportSemantics(report) {
  const errors = []
  const target = report.target_receipt
  const paths = target.paths
  const pathById = new Map()

  if (target.review_scope_sha256 !== hashReviewScope(report.review_scope)) {
    errors.push('target_receipt.review_scope_sha256 does not match review_scope')
  }
  if (target.policy_receipt_sha256 === null) {
    errors.push('target_receipt.policy_receipt_sha256 is required for machine output')
  }

  for (const record of paths) {
    const computed = hashPathRecord(record)
    if (record.path_record_id !== computed) errors.push(`path_record_id does not match canonical record: ${record.path_record_id}`)
    if (pathById.has(record.path_record_id)) errors.push(`duplicate path_record_id ${record.path_record_id}`)
    if (record.hunks_total !== null && record.hunks_reviewed !== null && record.hunks_reviewed > record.hunks_total) {
      errors.push(`path ${record.path_record_id} reviews more hunks than exist`)
    }
    if (record.bytes_total !== null && record.bytes_reviewed !== null && record.bytes_reviewed > record.bytes_total) {
      errors.push(`path ${record.path_record_id} reviews more bytes than exist`)
    }
    if (['unreadable', 'skipped-with-reason'].includes(record.disposition) &&
        (typeof record.reason !== 'string' || record.reason.length === 0)) {
      errors.push(`path ${record.path_record_id} requires a disposition reason`)
    }
    if (record.stage !== null && record.layer !== 'index') errors.push(`path ${record.path_record_id} has an index stage outside the index layer`)
    pathById.set(record.path_record_id, record)
  }
  const pathIds = new Set(pathById.keys())
  if (target.path_ledger_sha256 !== hashPathLedger(paths)) errors.push('target_receipt.path_ledger_sha256 does not match paths')
  if (target.receipt_sha256 !== hashTargetReceipt(target)) errors.push('target_receipt.receipt_sha256 does not match canonical receipt')

  const objectLength = target.git_object_format === 'sha1' ? 40 : 64
  for (const key of ['head_commit', 'head_tree', 'base_commit', 'base_tree', 'merge_base']) {
    if (target[key] !== null && target[key].length !== objectLength) errors.push(`${key} width does not match git_object_format`)
  }
  for (const record of paths) {
    for (const key of ['old_object_id', 'new_object_id']) {
      if (record[key] !== null && record[key].length !== objectLength) errors.push(`${key} width does not match git_object_format`)
    }
  }

  const coverage = report.coverage
  const dispositions = {
    reviewed: paths.filter(item => item.disposition === 'reviewed').length,
    metadata_reviewed: paths.filter(item => item.disposition === 'metadata-reviewed').length,
    unreadable: paths.filter(item => item.disposition === 'unreadable').length,
    skipped_with_reason: paths.filter(item => item.disposition === 'skipped-with-reason').length,
  }
  if (coverage.path_records_total !== paths.length) errors.push('coverage.path_records_total does not match target paths')
  for (const [key, count] of Object.entries(dispositions)) {
    if (coverage[key] !== count) errors.push(`coverage.${key} does not match path dispositions`)
  }
  const sum = key => paths.reduce((total, item) => total + (item[key] ?? 0), 0)
  if (coverage.hunks_total !== sum('hunks_total')) errors.push('coverage.hunks_total does not match path records')
  if (coverage.hunks_reviewed !== sum('hunks_reviewed')) errors.push('coverage.hunks_reviewed does not match path records')
  const bundleIds = new Set()
  for (const bundle of coverage.bundles) {
    if (bundleIds.has(bundle.id)) errors.push(`duplicate coverage bundle id ${bundle.id}`)
    bundleIds.add(bundle.id)
    addReferenceErrors(pathIds, bundle.primary_path_record_ids, `coverage bundle ${bundle.id}`, errors)
    addReferenceErrors(pathIds, bundle.supporting_path_record_ids, `coverage bundle ${bundle.id}`, errors)
  }

  const findingIds = new Set()
  for (const finding of report.findings) {
    if (findingIds.has(finding.id)) errors.push(`duplicate finding id ${finding.id}`)
    findingIds.add(finding.id)
    const record = pathById.get(finding.location.path_record_id)
    if (!record) {
      errors.push(`finding ${finding.id} references unknown path_record_id`)
      continue
    }
    if (record.layer !== finding.location.layer) errors.push(`finding ${finding.id} layer does not match its path record`)
    const selected = findingPath(finding, record)
    if (selected?.encoding === 'utf8' && selected.value !== finding.location.path) {
      errors.push(`finding ${finding.id} display path does not match its path record`)
    }
    if (finding.fingerprint !== hashFindingFingerprint(finding, record)) {
      errors.push(`finding ${finding.id} fingerprint does not match canonical identity`)
    }
    if (finding.location.content_sha256 !== null && record.content_sha256 !== null &&
        finding.location.content_sha256 !== record.content_sha256) {
      errors.push(`finding ${finding.id} content digest does not match its path record`)
    }
    if (finding.artifact_blob_id !== null && finding.artifact_blob_id.length !== objectLength) {
      errors.push(`finding ${finding.id} artifact_blob_id width does not match git_object_format`)
    }
    if (finding.location.position_status === 'verified' &&
        (finding.location.line === null || finding.location.snippet === null || finding.location.snippet_sha256 === null)) {
      errors.push(`finding ${finding.id} has incomplete verified position evidence`)
    }
  }

  for (const candidate of report.candidate_audit) {
    const record = candidate.location ? pathById.get(candidate.location.path_record_id) : null
    if (candidate.location && !record) errors.push(`candidate ${candidate.id} references unknown path_record_id`)
    if (candidate.location && record && record.layer !== candidate.location.layer) {
      errors.push(`candidate ${candidate.id} layer does not match its path record`)
    }
    if (candidate.fingerprint_status === 'verified') {
      if (!record) {
        errors.push(`candidate ${candidate.id} cannot verify its fingerprint without a path record`)
      } else if (candidate.fingerprint !== hashFindingFingerprint(candidate, record)) {
        errors.push(`candidate ${candidate.id} fingerprint does not match canonical identity`)
      }
    }
    if (candidate.fingerprint_status === 'carried' && !['resolved', 'stale'].includes(candidate.candidate_state)) {
      errors.push(`candidate ${candidate.id} may carry a fingerprint only when resolved or stale`)
    }
    if (candidate.candidate_state === 'suppressed' ? candidate.suppression === null : candidate.suppression !== null) {
      errors.push(`candidate ${candidate.id} suppression does not match candidate_state`)
    }
    if (candidate.suppression && candidate.suppression.policy_receipt_sha256 !== target.policy_receipt_sha256) {
      errors.push(`candidate ${candidate.id} suppression does not bind the accepted policy receipt`)
    }
    if (candidate.suppression && Date.parse(candidate.suppression.expires_at) <= Date.now()) {
      errors.push(`candidate ${candidate.id} suppression has expired`)
    }
    if (['refuted', 'pre_existing', 'resolved', 'stale', 'suppressed'].includes(candidate.candidate_state) &&
        candidate.verdict_effect !== 'none') {
      errors.push(`candidate ${candidate.id} has an impossible verdict_effect`)
    }
    if (candidate.candidate_state === 'unverified' && ['critical', 'high'].includes(candidate.severity) &&
        candidate.verdict_effect === 'none') {
      errors.push(`material unverified candidate ${candidate.id} must prevent PASS`)
    }
  }

  for (const validation of report.validation) {
    if (validation.result === 'passed' && (validation.exit_code !== 0 || validation.not_run_reason !== null)) {
      errors.push('passed validation must have exit_code 0 and no not_run_reason')
    }
    if (validation.result === 'passed' && validation.verdict_effect !== 'none') {
      errors.push('passed validation cannot affect the verdict')
    }
    if (validation.result === 'failed' &&
        (!Number.isInteger(validation.exit_code) || validation.exit_code === 0 || validation.not_run_reason !== null)) {
      errors.push('failed validation must have a nonzero exit_code and no not_run_reason')
    }
    if (validation.result === 'failed' && validation.verdict_effect === 'none') {
      errors.push('failed validation must prevent PASS')
    }
    if (validation.result === 'not_run' &&
        (validation.exit_code !== null || validation.stdout_sha256 !== null || validation.stderr_sha256 !== null ||
         typeof validation.not_run_reason !== 'string' || validation.not_run_reason.length === 0)) {
      errors.push('not_run validation must have no execution result and a reason')
    }
  }

  for (const limit of report.limits) {
    addReferenceErrors(pathIds, limit.affected_path_record_ids, `limit ${limit.id}`, errors)
  }

  const readback = report.final_readback
  if (readback.initial_receipt_sha256 !== target.receipt_sha256) {
    errors.push('final_readback.initial_receipt_sha256 does not match target receipt')
  }
  if (readback.matches_initial) {
    if (readback.changed_fields.length !== 0 || readback.final_receipt_sha256 !== readback.initial_receipt_sha256) {
      errors.push('matching final_readback must have equal hashes and no changed fields')
    }
  } else if (readback.changed_fields.length === 0 || readback.final_receipt_sha256 === readback.initial_receipt_sha256) {
    errors.push('drifted final_readback must identify changed fields and a different final hash')
  }

  const preventsPass = report.findings.some(item => item.disposition === 'blocking') ||
    report.candidate_audit.some(item => item.verdict_effect !== 'none') ||
    report.validation.some(item => item.verdict_effect !== 'none') ||
    report.limits.some(item => item.verdict_effect !== 'none')
  if (report.verdict === 'PASS' && (!coverage.complete || !readback.matches_initial || preventsPass)) {
    errors.push('PASS requires complete coverage, a stable target, and no blocking evidence')
  }
  if (report.verdict === 'CHANGES_REQUESTED' && !preventsPass) {
    errors.push('CHANGES_REQUESTED requires blocking evidence')
  }

  return errors
}

function readReport(filePath) {
  const before = fs.lstatSync(filePath)
  if (!before.isFile() || before.isSymbolicLink() || before.size > MAX_REPORT_BYTES) {
    throw new Error('report must be a bounded regular non-symlink file')
  }
  const fd = fs.openSync(filePath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0) | (fs.constants.O_NONBLOCK || 0))
  try {
    const held = fs.fstatSync(fd)
    if (!held.isFile() || held.dev !== before.dev || held.ino !== before.ino) throw new Error('report path changed before read')
    const chunks = []
    let total = 0
    while (total <= MAX_REPORT_BYTES) {
      const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, MAX_REPORT_BYTES + 1 - total))
      const count = fs.readSync(fd, chunk, 0, chunk.length, null)
      if (count === 0) break
      chunks.push(chunk.subarray(0, count))
      total += count
    }
    const payload = Buffer.concat(chunks, total)
    const after = fs.fstatSync(fd)
    if (payload.length > MAX_REPORT_BYTES || payload.length !== held.size || after.size !== held.size) {
      throw new Error('report changed during read or exceeds the size limit')
    }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(payload))
  } finally {
    fs.closeSync(fd)
  }
}

function main(argv = process.argv.slice(2)) {
  if (argv.length !== 1) {
    console.error('Usage: open-code-review-contract.js <report.json>')
    return 1
  }
  try {
    const report = readReport(argv[0])
    const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spec', 'open-code-review-report.schema.json'), 'utf8'))
    const ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
    const validate = ajv.compile(schema)
    if (!validate(report)) throw new Error(ajv.errorsText(validate.errors))
    const errors = validateReportSemantics(report)
    if (errors.length > 0) throw new Error(errors.join('; '))
    console.log('open-code-review report valid')
    return 0
  } catch (error) {
    console.error(`ERROR: ${error.message}`)
    return 1
  }
}

if (require.main === module) process.exit(main())

module.exports = {
  PROFILES,
  encodeRecords,
  hashFindingFingerprint,
  hashPathLedger,
  hashPathRecord,
  hashReviewScope,
  hashTargetReceipt,
  sha256,
  validateReportSemantics,
}
