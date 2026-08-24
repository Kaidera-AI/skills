#!/usr/bin/env node

'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const Ajv2020 = require('ajv/dist/2020')
const addFormats = require('ajv-formats')
const YAML = require('yaml')

const MAX_REPORT_BYTES = 16 * 1024 * 1024
const TYPE = { null: 0, raw: 1, utf8: 2, u64: 3, boolean: 4 }
const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
const EMPTY_TREE = {
  sha1: '4b825dc642cb6eb9a060e54bf8d69288fbee4904',
  sha256: '6ef19b41225c5369f1c104d45d8d85efa9b057b53b14b4b9b939dd74decc5321',
}

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
    ['head_state', 'utf8'],
    ['head_commit', 'utf8'],
    ['head_tree', 'utf8'],
    ['base_commit', 'utf8'],
    ['base_tree', 'utf8'],
    ['merge_base', 'utf8'],
    ['comparison_parent', 'utf8'],
    ['range_style', 'utf8'],
    ['paths_layer', 'utf8'],
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
    ['target_mode', 'utf8'],
    ['target_head_state', 'utf8'],
    ['target_paths_layer', 'utf8'],
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
    ['old_content_sha256', 'utf8'],
    ['new_content_sha256', 'utf8'],
    ['hunks_total', 'u64'],
    ['hunks_reviewed', 'u64'],
    ['bytes_total', 'u64'],
    ['bytes_reviewed', 'u64'],
    ['classification_as', 'utf8'],
    ['classification_method', 'utf8'],
    ['classification_source', 'utf8'],
    ['classification_evidence_sha256', 'utf8'],
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
  evidenceRevision: [
    ['artifact_blob_id', 'utf8'],
    ['content_sha256', 'utf8'],
    ['line', 'u64'],
    ['snippet_sha256', 'utf8'],
    ['position_status', 'utf8'],
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

function canonicalUtf8Bytes(value, label = 'UTF-8 profile value') {
  if (typeof value !== 'string') throw new TypeError(`${label} must be a string`)
  const encoded = Buffer.from(value, 'utf8')
  if (encoded.toString('utf8') !== value) throw new TypeError(`${label} does not round-trip canonically`)
  return encoded
}

function encodeValue(kind, value) {
  if (value === null || value === undefined) return { tag: TYPE.null, bytes: Buffer.alloc(0) }
  if (kind === 'raw') {
    if (!Buffer.isBuffer(value)) throw new TypeError('raw profile value must be a Buffer')
    return { tag: TYPE.raw, bytes: value }
  }
  if (kind === 'utf8') {
    return { tag: TYPE.utf8, bytes: canonicalUtf8Bytes(value) }
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

function canonicalBase64(value, label = 'base64 value') {
  if (typeof value !== 'string' || value.length % 4 !== 0) throw new TypeError(`${label} is not canonical`)
  const decoded = Buffer.from(value, 'base64')
  if (decoded.toString('base64') !== value) throw new TypeError(`${label} is not canonical`)
  return decoded
}

function bytesAreCanonicalUtf8(bytes) {
  try {
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return Buffer.compare(Buffer.from(decoded, 'utf8'), bytes) === 0
  } catch {
    return false
  }
}

function losslessValueBytes(value, label) {
  if (value === null) return null
  if (value.encoding === 'utf8') return canonicalUtf8Bytes(value.value, `UTF-8 ${label}`)
  if (value.encoding === 'base64') {
    const decoded = canonicalBase64(value.value, `base64 ${label}`)
    if (bytesAreCanonicalUtf8(decoded)) throw new TypeError(`${label} must use utf8 encoding for valid UTF-8 bytes`)
    return decoded
  }
  throw new TypeError(`unknown ${label} encoding`)
}

function validateRepositoryPathBytes(bytes) {
  if (bytes.length === 0) throw new TypeError('repository path must not be empty')
  if (bytes.includes(0)) throw new TypeError('repository path must not contain NUL')
  const pathText = bytes.toString('latin1')
  if (pathText.startsWith('/') || pathText.startsWith('\\')) throw new TypeError('repository path must be relative')
  if (/^[A-Za-z]:[\\/]/.test(pathText)) throw new TypeError('repository path must not be drive-absolute')
  const components = pathText.split(/[\\/]/)
  if (components.some(component => component === '' || component === '.' || component === '..')) {
    throw new TypeError('repository path must not contain empty, dot, or parent components')
  }
  return bytes
}

function losslessPathBytes(pathValue) {
  if (pathValue === null) return null
  return validateRepositoryPathBytes(losslessValueBytes(pathValue, 'path value'))
}

function losslessSourceBytes(sourceValue) {
  const bytes = losslessValueBytes(sourceValue, 'policy source value')
  if (bytes.length === 0 || bytes.includes(0)) throw new TypeError('policy source value must be non-empty and NUL-free')
  return bytes
}

function canonicalAbsoluteRoot(value, label = 'absolute path') {
  canonicalUtf8Bytes(value, label)
  if (value.includes('\0')) throw new TypeError(`${label} must be NUL-free`)
  if (value.includes('\\')) throw new TypeError(`${label} must use canonical forward slashes`)
  let remainder
  if (value.startsWith('/')) {
    if (value.startsWith('//')) throw new TypeError(`${label} must not use an unsupported UNC form`)
    remainder = value.slice(1)
  } else if (/^[A-Z]:\//.test(value)) {
    remainder = value.slice(3)
  } else {
    throw new TypeError(`${label} must be an absolute POSIX or uppercase-drive path`)
  }
  if (remainder !== '') {
    const components = remainder.split('/')
    if (components.some(component => component === '' || component === '.' || component === '..')) {
      throw new TypeError(`${label} must not contain empty, dot, or parent components`)
    }
  }
  return value
}

function canonicalLocationDisplay(pathValue) {
  if (pathValue.encoding === 'utf8') return pathValue.value
  return `base64:${pathValue.value}`
}

function flattenPathRecord(record) {
  const classification = record.classification_evidence
  return {
    target_mode: record.target_mode,
    target_head_state: record.target_head_state,
    target_paths_layer: record.target_paths_layer,
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
    old_content_sha256: record.old_content_sha256,
    new_content_sha256: record.new_content_sha256,
    hunks_total: record.hunks_total,
    hunks_reviewed: record.hunks_reviewed,
    bytes_total: record.bytes_total,
    bytes_reviewed: record.bytes_reviewed,
    classification_as: classification?.classified_as ?? null,
    classification_method: classification?.method ?? null,
    classification_source: classification?.source ?? null,
    classification_evidence_sha256: classification?.evidence_sha256 ?? null,
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
  const layerOrder = { head: 0, index: 1, worktree: 2, patch: 3 }
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

function validateCanonicalPathOrder(records, errors) {
  let inputBodies
  let sortedBodies
  try {
    inputBodies = records.map(flattenPathRecord)
    sortedBodies = sortedPathBodies(records)
  } catch (error) {
    errors.push(`target_receipt path order is not canonical: ${error.message}`)
    return
  }
  for (let index = 0; index < inputBodies.length; index += 1) {
    const input = encodeRecords(PROFILES.path, [inputBodies[index]])
    const sorted = encodeRecords(PROFILES.path, [sortedBodies[index]])
    if (Buffer.compare(input, sorted) !== 0) {
      errors.push('target_receipt.paths records are not in canonical path/layer/stage order')
      return
    }
  }
}

function flattenPolicyRecord(record) {
  return {
    authority_rank: record.authority_rank,
    applicability: record.applicability,
    source_encoding: record.source.encoding,
    source_value: losslessSourceBytes(record.source),
    revision: record.revision,
    object_identity: record.object_identity,
    content_sha256: record.content_sha256,
    classification: record.classification,
  }
}

function sortedPolicyBodies(records) {
  return records.map(flattenPolicyRecord).sort((left, right) => {
    return left.authority_rank - right.authority_rank ||
      Buffer.compare(left.source_value, right.source_value) ||
      Buffer.compare(encodeRecords(PROFILES.policy, [left]), encodeRecords(PROFILES.policy, [right]))
  })
}

function hashPolicyReceipt(records) {
  return sha256(encodeRecords(PROFILES.policy, sortedPolicyBodies(records)))
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
  if (finding.location.side === 'new') return pathRecord.new_path
  return pathRecord.new_path || pathRecord.old_path
}

function findingObjectId(finding, pathRecord) {
  if (finding.location.side === 'old') return pathRecord.old_object_id
  if (finding.location.side === 'new') return pathRecord.new_object_id
  return pathRecord.new_path ? pathRecord.new_object_id : pathRecord.old_object_id
}

function findingContentSha256(finding, pathRecord) {
  if (finding.location.side === 'old') return pathRecord.old_content_sha256
  if (finding.location.side === 'new') return pathRecord.new_content_sha256
  return pathRecord.new_path ? pathRecord.new_content_sha256 : pathRecord.old_content_sha256
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

function hashEvidenceRevision(finding) {
  return sha256(encodeRecords(PROFILES.evidenceRevision, [{
    artifact_blob_id: finding.artifact_blob_id,
    content_sha256: finding.location.content_sha256,
    line: finding.location.line,
    snippet_sha256: finding.location.snippet_sha256,
    position_status: finding.location.position_status,
  }]))
}

function addReferenceErrors(ids, references, label, errors) {
  for (const id of references) if (!ids.has(id)) errors.push(`${label} references unknown path_record_id ${id}`)
}

function validateCanonicalUtf8Tree(value, pointer, errors) {
  if (typeof value === 'string') {
    try {
      canonicalUtf8Bytes(value, pointer)
    } catch {
      errors.push(`${pointer} contains a non-canonical UTF-8 string`)
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateCanonicalUtf8Tree(item, `${pointer}/${index}`, errors))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) validateCanonicalUtf8Tree(item, `${pointer}/${key}`, errors)
  }
}

function validatePolicyReceipt(records, target, errors) {
  let inputBodies
  let sortedBodies
  try {
    inputBodies = records.map(flattenPolicyRecord)
    sortedBodies = sortedPolicyBodies(records)
  } catch (error) {
    errors.push(`policy_receipt is not canonically encoded: ${error.message}`)
    return
  }

  const logicalIds = new Set()
  if (!records.some(record => record.classification === 'accepted-policy')) {
    errors.push('policy_receipt requires at least one accepted-policy record')
  }
  for (const body of inputBodies) {
    const logicalId = `${body.applicability}:${body.source_value.toString('base64')}`
    if (logicalIds.has(logicalId)) errors.push(`duplicate policy_receipt source/applicability ${logicalId}`)
    logicalIds.add(logicalId)
  }
  for (let index = 0; index < inputBodies.length; index += 1) {
    const input = encodeRecords(PROFILES.policy, [inputBodies[index]])
    const sorted = encodeRecords(PROFILES.policy, [sortedBodies[index]])
    if (Buffer.compare(input, sorted) !== 0) {
      errors.push('policy_receipt records are not in canonical authority/source order')
      break
    }
  }
  if (target.policy_receipt_sha256 !== hashPolicyReceipt(records)) {
    errors.push('target_receipt.policy_receipt_sha256 does not match policy_receipt')
  }
}

function requireTargetFields(target, fields, mode, errors) {
  for (const field of fields) {
    if (target[field] === null) errors.push(`target_receipt.${field} is required for ${mode} mode`)
  }
}

function forbidTargetFields(target, fields, mode, errors) {
  for (const field of fields) {
    if (target[field] !== null) errors.push(`target_receipt.${field} must be null for ${mode} mode`)
  }
}

function isAllZeroObjectId(value) {
  return typeof value === 'string' && /^0+$/.test(value)
}

function validateTargetMode(target, errors) {
  requireTargetFields(target, ['review_diff_sha256', 'path_ledger_sha256', 'policy_receipt_sha256', 'receipt_sha256'], 'machine output', errors)

  if (target.repository_root !== null) {
    try {
      canonicalAbsoluteRoot(target.repository_root, 'target_receipt.repository_root')
    } catch (error) {
      errors.push(error.message)
    }
  }

  const repositoryFields = ['repository_root', 'git_object_format', 'git_version']
  const workspaceFields = [
    'index_entries_sha256', 'staged_diff_sha256', 'unstaged_diff_sha256',
    'status_porcelain_v2_sha256', 'untracked_inventory_sha256',
  ]
  const comparisonFields = ['base_commit', 'base_tree', 'merge_base', 'comparison_parent', 'range_style', 'paths_layer']

  if ((target.head_commit === null) !== (target.head_tree === null)) {
    errors.push('target_receipt head_commit and head_tree must be present together')
  }
  if (target.head_state === 'present') {
    requireTargetFields(target, ['head_commit', 'head_tree'], target.mode, errors)
  } else if (target.head_commit !== null || target.head_tree !== null) {
    errors.push('target_receipt head objects require head_state present')
  }
  if (['commit', 'range'].includes(target.mode) && target.head_state !== 'present') {
    errors.push(`${target.mode} mode requires head_state present`)
  }
  if (['workspace', 'staged', 'paths'].includes(target.mode) && !['present', 'unborn'].includes(target.head_state)) {
    errors.push(`${target.mode} mode requires head_state present or unborn`)
  }
  if (target.mode === 'patch' && !['present', 'unborn', 'not-applicable'].includes(target.head_state)) {
    errors.push('patch mode requires head_state present, unborn, or not-applicable')
  }

  if (target.mode === 'patch' && target.head_state === 'not-applicable') {
    forbidTargetFields(target, repositoryFields, 'context-free patch', errors)
  } else {
    requireTargetFields(target, repositoryFields, target.mode, errors)
  }

  if (target.mode === 'workspace') {
    requireTargetFields(target, workspaceFields, 'workspace', errors)
    forbidTargetFields(target, [...comparisonFields, 'supplied_patch_sha256'], 'workspace', errors)
  } else if (target.mode === 'staged') {
    requireTargetFields(target, workspaceFields, 'staged', errors)
    forbidTargetFields(target, [...comparisonFields, 'supplied_patch_sha256'], 'staged', errors)
    if (target.review_diff_sha256 !== target.staged_diff_sha256) {
      errors.push('staged review_diff_sha256 must equal staged_diff_sha256')
    }
  } else if (target.mode === 'commit') {
    requireTargetFields(target, ['comparison_parent', 'base_tree'], 'commit', errors)
    forbidTargetFields(target, ['merge_base', 'range_style', 'paths_layer', ...workspaceFields, 'supplied_patch_sha256'], 'commit', errors)
    if (target.comparison_parent === 'root') {
      if (target.base_commit !== null) errors.push('root commit comparison must have a null base_commit')
      if (target.git_object_format !== null && target.base_tree !== EMPTY_TREE[target.git_object_format]) {
        errors.push(`root commit base_tree must equal the canonical ${target.git_object_format} empty tree`)
      }
    } else if (target.base_commit !== target.comparison_parent) {
      errors.push('commit base_commit must equal the resolved comparison_parent')
    } else if (target.head_commit === target.comparison_parent) {
      errors.push('commit comparison_parent must not equal head_commit')
    }
  } else if (target.mode === 'range') {
    requireTargetFields(target, ['base_commit', 'base_tree', 'range_style'], 'range', errors)
    forbidTargetFields(target, ['comparison_parent', 'paths_layer', ...workspaceFields, 'supplied_patch_sha256'], 'range', errors)
    if (target.range_style === 'merge-base' && target.merge_base === null) {
      errors.push('merge-base range requires target_receipt.merge_base')
    }
    if (target.range_style === 'two-dot' && target.merge_base !== null) {
      errors.push('two-dot range must not claim a merge_base comparison')
    }
  } else if (target.mode === 'paths') {
    requireTargetFields(target, ['paths_layer'], 'paths', errors)
    forbidTargetFields(target, [...comparisonFields.filter(field => field !== 'paths_layer'), ...workspaceFields, 'supplied_patch_sha256'], 'paths', errors)
    if (target.head_state === 'unborn' && target.paths_layer === 'head') {
      errors.push('paths mode cannot select the head layer when head_state is unborn')
    }
  } else if (target.mode === 'patch') {
    requireTargetFields(target, ['supplied_patch_sha256'], 'patch', errors)
    forbidTargetFields(target, [...comparisonFields, ...workspaceFields], 'patch', errors)
    if (target.review_diff_sha256 !== target.supplied_patch_sha256) {
      errors.push('patch review_diff_sha256 must equal supplied_patch_sha256')
    }
  }
}

function equalLosslessPaths(left, right) {
  if (left === null || right === null) return left === right
  return Buffer.compare(losslessPathBytes(left), losslessPathBytes(right)) === 0
}

function conflictPathKey(record) {
  const selected = record.new_path || record.old_path
  if (!selected) return null
  return losslessPathBytes(selected).toString('base64')
}

function gitModeType(mode) {
  if (mode === null) return null
  if (mode === '100644' || mode === '100755') return 'regular'
  if (mode === '120000') return 'symlink'
  if (mode === '160000') return 'submodule'
  return 'invalid'
}

function validatePathTargetBinding(target, record, errors) {
  const label = `path ${record.path_record_id}`
  if (record.target_mode !== target.mode) errors.push(`${label} target_mode does not match target_receipt.mode`)
  if (record.target_head_state !== target.head_state) errors.push(`${label} target_head_state does not match target_receipt.head_state`)
  if (record.target_paths_layer !== target.paths_layer) errors.push(`${label} target_paths_layer does not match target_receipt.paths_layer`)

  const allowedLayers = {
    workspace: ['index', 'worktree'],
    staged: ['index'],
    commit: ['head'],
    range: ['head'],
    paths: target.paths_layer === null ? [] : [target.paths_layer],
    patch: ['patch'],
  }[target.mode]
  if (!allowedLayers.includes(record.layer)) {
    errors.push(`${label} layer ${record.layer} is not valid for ${target.mode} mode`)
  }
  if (target.head_state === 'unborn' && record.layer === 'head') {
    errors.push(`${label} cannot bind the head layer when head_state is unborn`)
  }
  if (target.head_state === 'not-applicable' && record.layer !== 'patch') {
    errors.push(`${label} must use the patch layer when head_state is not-applicable`)
  }
}

function validateStatusShape(record, errors) {
  const label = `path ${record.path_record_id}`
  const oldPresent = record.old_path !== null
  const newPresent = record.new_path !== null
  const samePath = oldPresent && newPresent && equalLosslessPaths(record.old_path, record.new_path)

  if (record.status !== 'U' && record.stage !== null) {
    errors.push(`${label} has an index stage for non-conflict status ${record.status}`)
  }
  if (record.status === 'A' && (oldPresent || !newPresent)) errors.push(`${label} status A requires only a new side`)
  if (record.status === 'D' && (!oldPresent || newPresent)) errors.push(`${label} status D requires only an old side`)
  if (record.status === 'M' && (!oldPresent || !newPresent || !samePath)) {
    errors.push(`${label} status M requires matching old and new paths`)
  }
  const comparableObjectIds = record.old_object_id !== null && record.new_object_id !== null
  if (record.status === 'M' && oldPresent && newPresent && samePath &&
      record.old_mode === record.new_mode && record.old_content_sha256 !== null &&
      record.old_content_sha256 === record.new_content_sha256 &&
      (!comparableObjectIds || record.old_object_id === record.new_object_id)) {
    errors.push(`${label} status M must represent a content, mode, or object-identity change`)
  }
  if (record.status === 'R' && (!oldPresent || !newPresent || samePath)) {
    errors.push(`${label} status R requires distinct old and new paths`)
  }
  const oldType = gitModeType(record.old_mode)
  const newType = gitModeType(record.new_mode)
  if (record.status === 'T' && (!oldPresent || !newPresent || !samePath ||
      oldType === null || newType === null || oldType === newType)) {
    errors.push(`${label} status T requires matching paths and a real Git object-type change`)
  }
  if (record.status !== 'T' && oldPresent && newPresent && oldType !== null && newType !== null && oldType !== newType) {
    errors.push(`${label} changes Git object type but does not use status T`)
  }
  if (record.status === 'U') {
    if (record.layer === 'index') {
      if (![1, 2, 3].includes(record.stage) || oldPresent || !newPresent) {
        errors.push(`${label} unresolved index status U requires stage 1, 2, or 3 and only a new side`)
      }
    } else if (record.layer === 'worktree') {
      if (record.stage !== null || oldPresent || !newPresent) {
        errors.push(`${label} unresolved worktree status U requires no stage and only a new side`)
      }
    } else {
      errors.push(`${label} status U is valid only in index or worktree layers`)
    }
  }
}

function validateGitIdentity(record, errors) {
  const label = `path ${record.path_record_id}`
  const oldPresent = record.old_path !== null
  const newPresent = record.new_path !== null
  const selectedMode = newPresent ? record.new_mode : record.old_mode
  const selectedType = gitModeType(selectedMode)
  const expectedKinds = {
    regular: ['file', 'binary', 'generated', 'vendored'],
    symlink: ['symlink'],
    submodule: ['submodule'],
  }

  if (selectedType !== null && selectedType !== 'invalid' && !expectedKinds[selectedType].includes(record.record_kind)) {
    errors.push(`${label} record_kind ${record.record_kind} does not match selected-side mode ${selectedMode}`)
  }
  if (['head', 'index'].includes(record.layer)) {
    for (const side of ['old', 'new']) {
      if (record[`${side}_path`] !== null &&
          (record[`${side}_mode`] === null || record[`${side}_object_id`] === null)) {
        errors.push(`${label} ${record.layer} ${side} side requires mode and object identity`)
      }
    }
  }
  if (record.layer === 'worktree') {
    for (const side of ['old', 'new']) {
      if (record[`${side}_path`] !== null && record[`${side}_mode`] === null) {
        errors.push(`${label} worktree ${side} side requires an exact mode`)
      }
    }
    if (oldPresent && record.old_object_id === null) errors.push(`${label} worktree old side requires its index object identity`)
    if (newPresent && record.new_object_id !== null) errors.push(`${label} worktree new side must not claim an unverified Git object identity`)
  }
}

function validateClassificationEvidence(target, record, errors) {
  const evidence = record.classification_evidence
  const label = `metadata-reviewed path ${record.path_record_id}`
  if (record.disposition !== 'metadata-reviewed') {
    if (evidence !== null) errors.push(`path ${record.path_record_id} has classification evidence without metadata-reviewed disposition`)
    return
  }
  if (evidence === null) {
    errors.push(`${label} requires classification evidence`)
    return
  }
  if (evidence.classified_as !== record.record_kind) errors.push(`${label} classification does not match record_kind`)
  const eligibleByMethod = {
    'blob-inspection': ['binary'],
    'mode-inspection': ['symlink', 'submodule'],
  }
  if (!eligibleByMethod[evidence.method].includes(evidence.classified_as)) {
    errors.push(`${label} has an ineligible ${evidence.method} classification`)
  }
  const presentModes = ['old', 'new']
    .filter(side => record[`${side}_path`] !== null)
    .map(side => record[`${side}_mode`])
  if (presentModes.some(mode => mode === null)) errors.push(`${label} requires an exact mode for every present side`)
  const modes = presentModes.filter(mode => mode !== null)
  if (evidence.classified_as === 'binary' && modes.some(mode => gitModeType(mode) !== 'regular')) {
    errors.push(`${label} binary classification requires regular-file modes`)
  }
  if (evidence.classified_as === 'symlink' && modes.some(mode => mode !== '120000')) {
    errors.push(`${label} symlink classification requires mode 120000 on every present side`)
  }
  if (evidence.classified_as === 'submodule' && modes.some(mode => mode !== '160000')) {
    errors.push(`${label} submodule classification requires mode 160000 on every present side`)
  }
}

function validateTargetSnapshot(target, policyReceipt, errors) {
  const paths = target.paths
  const pathById = new Map()
  const unresolvedByPath = new Map()
  const logicalPaths = new Map()
  const resolvedIndexPaths = new Set()

  validatePolicyReceipt(policyReceipt, target, errors)
  validateTargetMode(target, errors)
  validateCanonicalPathOrder(paths, errors)

  for (const record of paths) {
    let computed
    try {
      computed = hashPathRecord(record)
    } catch (error) {
      errors.push(`path ${record.path_record_id} is not canonical: ${error.message}`)
      continue
    }
    if (record.path_record_id !== computed) errors.push(`path_record_id does not match canonical record: ${record.path_record_id}`)
    if (pathById.has(record.path_record_id)) errors.push(`duplicate path_record_id ${record.path_record_id}`)
    validatePathTargetBinding(target, record, errors)
    validateStatusShape(record, errors)
    validateGitIdentity(record, errors)
    validateClassificationEvidence(target, record, errors)
    for (const side of ['old', 'new']) {
      if (record[`${side}_path`] === null) continue
      const rawPathKey = losslessPathBytes(record[`${side}_path`]).toString('base64')
      const key = `${record.layer}:${record.stage ?? '-'}:${rawPathKey}`
      if (logicalPaths.has(key) && logicalPaths.get(key) !== record.path_record_id) {
        errors.push(`logical path ${key} appears in multiple path records`)
      } else {
        logicalPaths.set(key, record.path_record_id)
      }
      if (record.layer === 'index' && record.status !== 'U') resolvedIndexPaths.add(rawPathKey)
    }
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
    if (record.old_path === null && [record.old_mode, record.old_object_id, record.old_content_sha256].some(item => item !== null)) {
      errors.push(`path ${record.path_record_id} has old-side metadata without an old path`)
    }
    if (record.new_path === null && [record.new_mode, record.new_object_id, record.new_content_sha256].some(item => item !== null)) {
      errors.push(`path ${record.path_record_id} has new-side metadata without a new path`)
    }
    if (record.old_path === null && record.new_path === null) errors.push(`path ${record.path_record_id} has no old or new side`)
    if (['reviewed', 'metadata-reviewed'].includes(record.disposition)) {
      if (record.old_path !== null && record.old_content_sha256 === null) {
        errors.push(`path ${record.path_record_id} lacks an old-side content digest`)
      }
      if (record.new_path !== null && record.new_content_sha256 === null) {
        errors.push(`path ${record.path_record_id} lacks a new-side content digest`)
      }
    }
    if (record.disposition === 'metadata-reviewed' && (typeof record.reason !== 'string' || record.reason.length === 0)) {
      errors.push(`metadata-reviewed path ${record.path_record_id} requires a reason`)
    }
    if (record.disposition === 'metadata-reviewed') {
      if (!['binary', 'symlink', 'submodule'].includes(record.record_kind)) {
        errors.push(`metadata-reviewed path ${record.path_record_id} has an ineligible record_kind`)
      }
      if (record.hunks_total !== 0 || record.hunks_reviewed !== 0 ||
          !Number.isInteger(record.bytes_total) || record.bytes_reviewed !== 0) {
        errors.push(`metadata-reviewed path ${record.path_record_id} requires zero hunk review and an exact byte inventory`)
      }
    }
    if (record.status === 'U') {
      const key = conflictPathKey(record)
      if (!unresolvedByPath.has(key)) unresolvedByPath.set(key, { stages: new Set(), indexCount: 0, worktreeCount: 0 })
      const group = unresolvedByPath.get(key)
      if (record.layer === 'index') {
        if (group.stages.has(record.stage)) errors.push(`unresolved path ${key} repeats index stage ${record.stage}`)
        group.stages.add(record.stage)
        group.indexCount += 1
      } else if (record.layer === 'worktree') {
        group.worktreeCount += 1
      }
    }
    pathById.set(record.path_record_id, record)
  }
  for (const [key, group] of unresolvedByPath) {
    if (group.indexCount < 1 || group.indexCount > 3) errors.push(`unresolved path ${key} requires one to three distinct index stages`)
    if (group.worktreeCount > 1) errors.push(`unresolved path ${key} has more than one worktree conflict record`)
    if (resolvedIndexPaths.has(key)) errors.push(`unresolved path ${key} cannot coexist with a resolved stage-0 index record`)
  }
  const pathIds = new Set(pathById.keys())
  try {
    if (target.path_ledger_sha256 !== hashPathLedger(paths)) errors.push('target_receipt.path_ledger_sha256 does not match paths')
  } catch (error) {
    errors.push(`target_receipt path ledger is not canonical: ${error.message}`)
  }
  if (paths.length === 0 && target.review_diff_sha256 !== EMPTY_SHA256) {
    errors.push('an empty path ledger requires the canonical empty review_diff_sha256')
  }
  if (paths.length > 0 && target.review_diff_sha256 === EMPTY_SHA256) {
    errors.push('a non-empty path ledger cannot use the canonical empty review_diff_sha256')
  }
  if (target.receipt_sha256 !== hashTargetReceipt(target)) errors.push('target_receipt.receipt_sha256 does not match canonical receipt')

  const objectLength = target.git_object_format === 'sha1' ? 40 : target.git_object_format === 'sha256' ? 64 : null
  for (const key of ['head_commit', 'head_tree', 'base_commit', 'base_tree', 'merge_base']) {
    if (target[key] !== null && (objectLength === null || target[key].length !== objectLength)) errors.push(`${key} width does not match git_object_format`)
    if (isAllZeroObjectId(target[key])) errors.push(`${key} cannot use Git's all-zero missing-object sentinel`)
  }
  if (target.comparison_parent !== null && target.comparison_parent !== 'root' &&
      (objectLength === null || target.comparison_parent.length !== objectLength)) {
    errors.push('comparison_parent width does not match git_object_format')
  }
  if (isAllZeroObjectId(target.comparison_parent)) {
    errors.push("comparison_parent cannot use Git's all-zero missing-object sentinel")
  }
  const commitObjects = [target.head_commit, target.base_commit, target.merge_base,
    target.comparison_parent === 'root' ? null : target.comparison_parent].filter(Boolean)
  const treeObjects = [target.head_tree, target.base_tree].filter(Boolean)
  if (commitObjects.some(commitObject => treeObjects.includes(commitObject))) {
    errors.push('commit and tree fields cannot claim the same Git object identity')
  }
  for (const record of paths) {
    for (const key of ['old_object_id', 'new_object_id']) {
      if (record[key] !== null && (objectLength === null || record[key].length !== objectLength)) errors.push(`${key} width does not match git_object_format`)
      if (isAllZeroObjectId(record[key])) errors.push(`${key} cannot use Git's all-zero missing-object sentinel`)
    }
  }

  return { paths, pathById, pathIds, unresolvedByPath }
}

function validateReportSemantics(report) {
  const errors = []
  const target = report.target_receipt

  validateCanonicalUtf8Tree(report, '$', errors)
  if (errors.length > 0) return errors

  if (target.review_scope_sha256 !== hashReviewScope(report.review_scope)) {
    errors.push('target_receipt.review_scope_sha256 does not match review_scope')
  }
  const { paths, pathById, pathIds, unresolvedByPath } = validateTargetSnapshot(
    target,
    report.policy_receipt,
    errors,
  )
  const objectLength = target.git_object_format === 'sha1' ? 40 : target.git_object_format === 'sha256' ? 64 : null

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
  const primaryCounts = new Map(paths.map(item => [item.path_record_id, 0]))
  for (const bundle of coverage.bundles) {
    if (bundleIds.has(bundle.id)) errors.push(`duplicate coverage bundle id ${bundle.id}`)
    bundleIds.add(bundle.id)
    addReferenceErrors(pathIds, bundle.primary_path_record_ids, `coverage bundle ${bundle.id}`, errors)
    addReferenceErrors(pathIds, bundle.supporting_path_record_ids, `coverage bundle ${bundle.id}`, errors)
    if (bundle.primary_path_record_ids.length === 0) errors.push(`coverage bundle ${bundle.id} has no primary path`)
    const primary = new Set(bundle.primary_path_record_ids)
    const supporting = new Set(bundle.supporting_path_record_ids)
    if (primary.size !== bundle.primary_path_record_ids.length) errors.push(`coverage bundle ${bundle.id} repeats a primary path`)
    if (supporting.size !== bundle.supporting_path_record_ids.length) errors.push(`coverage bundle ${bundle.id} repeats a supporting path`)
    for (const id of primary) {
      if (supporting.has(id)) errors.push(`coverage bundle ${bundle.id} uses one path as primary and supporting`)
      if (primaryCounts.has(id)) primaryCounts.set(id, primaryCounts.get(id) + 1)
    }
  }
  for (const [id, count] of primaryCounts) {
    if (count !== 1) errors.push(`path ${id} must belong to exactly one primary coverage bundle`)
  }
  if (coverage.complete) {
    if (coverage.metadata_reviewed !== 0 || coverage.unreadable !== 0 || coverage.skipped_with_reason !== 0) {
      errors.push('complete coverage cannot include metadata-only, unreadable, or skipped paths')
    }
    if (unresolvedByPath.size > 0) errors.push('complete coverage cannot include unresolved status U paths')
    for (const record of paths) {
      if (record.disposition === 'reviewed' &&
          (!Number.isInteger(record.hunks_total) || !Number.isInteger(record.hunks_reviewed) ||
           !Number.isInteger(record.bytes_total) || !Number.isInteger(record.bytes_reviewed) ||
           record.hunks_total !== record.hunks_reviewed || record.bytes_total !== record.bytes_reviewed)) {
        errors.push(`complete coverage does not fully account for reviewed path ${record.path_record_id}`)
      }
      const selectedMode = record.new_path !== null ? record.new_mode : record.old_mode
      const contentChanged = record.old_path === null
        ? record.new_content_sha256 !== null && record.new_content_sha256 !== EMPTY_SHA256
        : record.new_path === null
          ? record.old_content_sha256 !== null && record.old_content_sha256 !== EMPTY_SHA256
          : record.old_content_sha256 !== null && record.new_content_sha256 !== null &&
            record.old_content_sha256 !== record.new_content_sha256
      if (record.disposition === 'reviewed' && contentChanged && gitModeType(selectedMode) === 'regular' &&
          record.record_kind !== 'binary' && (record.hunks_total === 0 || record.bytes_total === 0)) {
        errors.push(`content-changed regular text path ${record.path_record_id} requires nonzero hunk and byte coverage`)
      }
    }
  }

  const findingIds = new Set()
  const findingFingerprints = new Set()
  for (const finding of report.findings) {
    if (findingIds.has(finding.id)) errors.push(`duplicate finding id ${finding.id}`)
    findingIds.add(finding.id)
    if (findingFingerprints.has(finding.fingerprint)) errors.push(`duplicate finding fingerprint ${finding.fingerprint}`)
    findingFingerprints.add(finding.fingerprint)
    const record = pathById.get(finding.location.path_record_id)
    if (!record) {
      errors.push(`finding ${finding.id} references unknown path_record_id`)
      continue
    }
    if (record.layer !== finding.location.layer) errors.push(`finding ${finding.id} layer does not match its path record`)
    const selected = findingPath(finding, record)
    if (!selected) {
      errors.push(`finding ${finding.id} target side does not exist in its path record`)
      continue
    }
    if (canonicalLocationDisplay(selected) !== finding.location.path) {
      errors.push(`finding ${finding.id} display path does not match its path record`)
    }
    if (finding.fingerprint !== hashFindingFingerprint(finding, record)) {
      errors.push(`finding ${finding.id} fingerprint does not match canonical identity`)
    }
    const expectedContentSha256 = findingContentSha256(finding, record)
    if (finding.location.content_sha256 !== null && finding.location.content_sha256 !== expectedContentSha256) {
      errors.push(`finding ${finding.id} content digest does not match its path record`)
    }
    const expectedObjectId = findingObjectId(finding, record)
    if (finding.artifact_blob_id !== expectedObjectId) {
      errors.push(`finding ${finding.id} artifact_blob_id does not match its target side`)
    } else if (finding.artifact_blob_id !== null && finding.artifact_blob_id.length !== objectLength) {
      errors.push(`finding ${finding.id} artifact_blob_id width does not match git_object_format`)
    }
    if (finding.location.position_status === 'verified' &&
        (finding.location.line === null || finding.location.snippet === null || finding.location.snippet_sha256 === null ||
         finding.location.content_sha256 === null || expectedContentSha256 === null)) {
      errors.push(`finding ${finding.id} has incomplete verified position evidence`)
    }
    if (finding.location.snippet !== null &&
        finding.location.snippet_sha256 !== sha256(canonicalUtf8Bytes(finding.location.snippet, 'finding snippet'))) {
      errors.push(`finding ${finding.id} snippet digest does not match its snippet`)
    }
    if ((finding.location.snippet === null) !== (finding.location.snippet_sha256 === null)) {
      errors.push(`finding ${finding.id} snippet and snippet digest presence do not match`)
    }
    if (finding.evidence_revision !== hashEvidenceRevision(finding)) {
      errors.push(`finding ${finding.id} evidence_revision does not match anchored evidence`)
    }
    const requiresIndependentRefutation = ['critical', 'high'].includes(finding.severity) ||
      (report.review_scope.depth === 'deep' && finding.severity === 'medium')
    if (requiresIndependentRefutation && finding.refutation.independence !== 'separate_agent') {
      errors.push(`finding ${finding.id} requires separate-agent refutation at this severity/depth`)
    }
    if (finding.refutation.independence === 'separate_agent' && finding.refutation.agent_receipt_sha256 === null) {
      errors.push(`finding ${finding.id} separate-agent refutation requires an agent receipt`)
    }
    if (finding.refutation.independence !== 'separate_agent' && finding.refutation.agent_receipt_sha256 !== null) {
      errors.push(`finding ${finding.id} same-agent refutation cannot claim a separate-agent receipt`)
    }
  }

  const candidateIds = new Set()
  const candidateFingerprints = new Set()
  const confirmedFingerprints = findingFingerprints
  for (const candidate of report.candidate_audit) {
    if (candidateIds.has(candidate.id)) errors.push(`duplicate candidate id ${candidate.id}`)
    candidateIds.add(candidate.id)
    if (candidateFingerprints.has(candidate.fingerprint) || confirmedFingerprints.has(candidate.fingerprint)) {
      errors.push(`duplicate candidate fingerprint ${candidate.fingerprint}`)
    }
    candidateFingerprints.add(candidate.fingerprint)
    const record = candidate.location ? pathById.get(candidate.location.path_record_id) : null
    if (candidate.location && !record) errors.push(`candidate ${candidate.id} references unknown path_record_id`)
    if (candidate.location && record && record.layer !== candidate.location.layer) {
      errors.push(`candidate ${candidate.id} layer does not match its path record`)
    }
    if (candidate.location && record) {
      const selected = findingPath(candidate, record)
      if (!selected) {
        errors.push(`candidate ${candidate.id} target side does not exist in its path record`)
      } else if (canonicalLocationDisplay(selected) !== candidate.location.path) {
        errors.push(`candidate ${candidate.id} display path does not match its path record`)
      }
    }
    if (candidate.fingerprint_status === 'verified') {
      if (!record) {
        errors.push(`candidate ${candidate.id} cannot verify its fingerprint without a path record`)
      } else {
        const selected = findingPath(candidate, record)
        if (!selected) {
          errors.push(`candidate ${candidate.id} target side does not exist in its path record`)
        } else {
          if (candidate.location.content_sha256 !== null &&
              candidate.location.content_sha256 !== findingContentSha256(candidate, record)) {
            errors.push(`candidate ${candidate.id} content digest does not match its path record`)
          }
          if (candidate.location.snippet !== null &&
              candidate.location.snippet_sha256 !== sha256(canonicalUtf8Bytes(candidate.location.snippet, 'candidate snippet'))) {
            errors.push(`candidate ${candidate.id} snippet digest does not match its snippet`)
          }
          if (candidate.fingerprint !== hashFindingFingerprint(candidate, record)) {
            errors.push(`candidate ${candidate.id} fingerprint does not match canonical identity`)
          }
        }
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
    if (candidate.suppression && candidate.suppression.scope !== candidate.fingerprint) {
      errors.push(`candidate ${candidate.id} suppression scope does not match its exact fingerprint`)
    }
    if (candidate.candidate_state === 'suppressed' && candidate.verdict_effect !== 'prevents_pass') {
      errors.push(`candidate ${candidate.id} has an unauthenticated suppression that must prevent PASS`)
    }
    if (['refuted', 'pre_existing', 'resolved', 'stale'].includes(candidate.candidate_state) &&
        candidate.verdict_effect !== 'none') {
      errors.push(`candidate ${candidate.id} has an impossible verdict_effect`)
    }
    if (candidate.candidate_state === 'unverified' && ['critical', 'high'].includes(candidate.severity) &&
        candidate.verdict_effect === 'none') {
      errors.push(`material unverified candidate ${candidate.id} must prevent PASS`)
    }
    const requiresIndependentRefutation = ['critical', 'high'].includes(candidate.severity) ||
      (report.review_scope.depth === 'deep' && candidate.severity === 'medium')
    const expectedRefutationResult = {
      refuted: 'refuted',
      unverified: 'inconclusive',
      pre_existing: 'not_applicable',
      resolved: 'not_applicable',
      stale: 'not_applicable',
      suppressed: 'not_applicable',
    }[candidate.candidate_state]
    if (candidate.refutation.result !== expectedRefutationResult) {
      errors.push(`candidate ${candidate.id} refutation result does not match candidate_state`)
    }
    if (candidate.refutation.result === 'refuted' && candidate.refutation.independence === 'not_performed') {
      errors.push(`candidate ${candidate.id} cannot claim refutation when no refutation was performed`)
    }
    if (candidate.refutation.result === 'not_applicable' && candidate.refutation.independence !== 'not_performed') {
      errors.push(`candidate ${candidate.id} not_applicable refutation must be not_performed`)
    }
    if (candidate.refutation.independence === 'separate_agent' && candidate.refutation.agent_receipt_sha256 === null) {
      errors.push(`candidate ${candidate.id} separate-agent refutation requires an agent receipt`)
    }
    if (candidate.refutation.independence !== 'separate_agent' && candidate.refutation.agent_receipt_sha256 !== null) {
      errors.push(`candidate ${candidate.id} non-independent refutation cannot claim a separate-agent receipt`)
    }
    if (candidate.candidate_state === 'refuted' && requiresIndependentRefutation &&
        candidate.refutation.independence !== 'separate_agent') {
      errors.push(`candidate ${candidate.id} requires separate-agent refutation at this severity/depth`)
    }
    if (candidate.candidate_state === 'unverified' && requiresIndependentRefutation) {
      const matchingLimits = report.limits.filter(limit =>
        limit.category === 'independent-refutation' &&
        limit.candidate_id === candidate.id &&
        limit.verdict_effect === 'prevents_pass')
      if (matchingLimits.length !== 1) {
        errors.push(`candidate ${candidate.id} requires exactly one unique independent-refutation prevents_pass limit`)
      }
    }
  }

  for (const validation of report.validation) {
    if (validation.argv.length === 0 || validation.argv.some(argument =>
      typeof argument !== 'string' || argument.length === 0 || argument.includes('\0'))) {
      errors.push('validation argv must contain at least one non-empty NUL-free argument')
    }
    try {
      canonicalAbsoluteRoot(validation.cwd, 'validation cwd')
    } catch (error) {
      errors.push(error.message)
    }
    if (validation.tool_version !== null &&
        (typeof validation.tool_version !== 'string' || validation.tool_version.length === 0 || validation.tool_version.includes('\0'))) {
      errors.push('validation tool_version must be a non-empty NUL-free string or null')
    }
    if (validation.target_receipt_sha256 !== target.receipt_sha256) {
      errors.push('validation target_receipt_sha256 does not match target receipt')
    }
    if (target.repository_root !== null && validation.cwd !== target.repository_root) {
      errors.push('repository-backed validation cwd must equal target_receipt.repository_root')
    }
    if (target.mode === 'patch' && target.head_state === 'not-applicable' && validation.result !== 'not_run') {
      errors.push('context-free patch validation cannot claim an executed result')
    }
    if (validation.result !== 'not_run' && (validation.stdout_sha256 === null || validation.stderr_sha256 === null)) {
      errors.push('executed validation must bind stdout and stderr digests')
    }
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

  const limitIds = new Set()
  const independentLimitCandidates = new Set()
  for (const limit of report.limits) {
    if (limitIds.has(limit.id)) errors.push(`duplicate limit id ${limit.id}`)
    limitIds.add(limit.id)
    if (limit.category === 'independent-refutation') {
      if (limit.candidate_id === null) {
        errors.push(`independent-refutation limit ${limit.id} requires candidate_id`)
        continue
      }
      if (independentLimitCandidates.has(limit.candidate_id)) {
        errors.push(`candidate ${limit.candidate_id} has more than one independent-refutation limit`)
      }
      independentLimitCandidates.add(limit.candidate_id)
      const candidate = report.candidate_audit.find(item => item.id === limit.candidate_id)
      if (!candidate) {
        errors.push(`independent-refutation limit ${limit.id} references unknown candidate ${limit.candidate_id}`)
        continue
      }
      const requiresIndependentRefutation = ['critical', 'high'].includes(candidate.severity) ||
        (report.review_scope.depth === 'deep' && candidate.severity === 'medium')
      if (candidate.candidate_state !== 'unverified' || !requiresIndependentRefutation) {
        errors.push(`independent-refutation limit ${limit.id} does not bind a material unverified candidate`)
      }
      if (limit.verdict_effect !== 'prevents_pass') {
        errors.push(`independent-refutation limit ${limit.id} must prevent PASS`)
      }
      const expectedPathIds = candidate.location ? [candidate.location.path_record_id] : []
      if (JSON.stringify(limit.affected_path_record_ids) !== JSON.stringify(expectedPathIds)) {
        errors.push(`independent-refutation limit ${limit.id} must bind exactly its candidate path`)
      }
    } else if (limit.candidate_id !== null) {
      errors.push(`non-refutation limit ${limit.id} must have candidate_id null`)
    }
  }

  const readback = report.final_readback
  const finalTarget = readback.final_target_receipt
  validateTargetSnapshot(finalTarget, readback.final_policy_receipt, errors)
  const boundReviewScopeSha256 = hashReviewScope(report.review_scope)
  if (finalTarget.review_scope_sha256 !== boundReviewScopeSha256 ||
      finalTarget.review_scope_sha256 !== target.review_scope_sha256) {
    errors.push('final_target_receipt.review_scope_sha256 is immutable and must match review_scope')
  }
  if (new Set(readback.changed_fields).size !== readback.changed_fields.length) {
    errors.push('final_readback.changed_fields must contain unique canonical fields')
  }
  const canonicalChangedFields = new Set(PROFILES.target.map(([key]) => key))
  for (const field of readback.changed_fields) {
    if (!canonicalChangedFields.has(field)) errors.push(`final_readback.changed_fields contains unknown field ${field}`)
  }
  if (readback.initial_receipt_sha256 !== target.receipt_sha256) {
    errors.push('final_readback.initial_receipt_sha256 does not match target receipt')
  }
  if (readback.final_receipt_sha256 !== finalTarget.receipt_sha256) {
    errors.push('final_readback.final_receipt_sha256 does not match final_target_receipt')
  }
  const expectedChangedFields = PROFILES.target
    .map(([field]) => field)
    .filter(field => target[field] !== finalTarget[field])
  if (JSON.stringify(readback.changed_fields) !== JSON.stringify(expectedChangedFields)) {
    errors.push('final_readback.changed_fields must exactly equal canonical initial/final target differences')
  }
  const expectedMatch = expectedChangedFields.length === 0
  if (readback.matches_initial !== expectedMatch) {
    errors.push('final_readback.matches_initial does not match the recomputed final target comparison')
  }
  if (expectedMatch && readback.final_receipt_sha256 !== readback.initial_receipt_sha256) {
    errors.push('matching final_readback must have equal initial and final receipt hashes')
  }
  if (!expectedMatch && readback.final_receipt_sha256 === readback.initial_receipt_sha256) {
    errors.push('drifted final_readback must have different initial and final receipt hashes')
  }

  const confirmedBlockers = report.findings.filter(item => item.disposition === 'blocking')
  const confirmedAdvisories = report.findings.filter(item => item.disposition === 'advisory')
  const externalEffects = [...report.candidate_audit, ...report.validation, ...report.limits]
  const preventsPass = report.findings.length > 0 || externalEffects.some(item => item.verdict_effect !== 'none')
  const hasBlockingLimit = externalEffects.some(item => item.verdict_effect === 'blocking')
  const hasPreventsPassExternal = externalEffects.some(item => item.verdict_effect === 'prevents_pass')
  const hasIncompleteSignal = !coverage.complete || !readback.matches_initial ||
    externalEffects.some(item => item.verdict_effect === 'prevents_pass')
  if (report.verdict === 'PASS' && (!coverage.complete || !readback.matches_initial || preventsPass)) {
    errors.push('PASS requires complete coverage, a stable target, and no confirmed findings or external verdict effects')
  }
  if (report.verdict === 'ADVISORIES' &&
      (!coverage.complete || !readback.matches_initial || confirmedAdvisories.length === 0 ||
       confirmedBlockers.length > 0 || externalEffects.some(item => item.verdict_effect !== 'none'))) {
    errors.push('ADVISORIES requires complete content coverage, a stable target, advisory findings only, and no unresolved external verdict effects')
  }
  if (target.mode === 'patch' && target.head_state === 'not-applicable' && ['PASS', 'ADVISORIES'].includes(report.verdict)) {
    errors.push('a context-free patch cannot yield PASS or ADVISORIES')
  }
  if (report.verdict === 'CHANGES_REQUESTED' && confirmedBlockers.length === 0) {
    errors.push('CHANGES_REQUESTED requires a confirmed blocking finding')
  }
  if (report.verdict === 'CHANGES_REQUESTED' && (!coverage.complete || !readback.matches_initial)) {
    errors.push('CHANGES_REQUESTED requires complete coverage and a stable target')
  }
  if (report.verdict === 'CHANGES_REQUESTED' && (hasBlockingLimit || hasPreventsPassExternal)) {
    errors.push('CHANGES_REQUESTED cannot coexist with unresolved blocking or prevents_pass evidence')
  }
  if (report.verdict === 'BLOCKED' && !hasBlockingLimit) {
    errors.push('BLOCKED requires an explicit blocking candidate, validation, or limit')
  }
  if (report.verdict === 'INCOMPLETE' && !hasIncompleteSignal) {
    errors.push('INCOMPLETE requires unfinished coverage, target drift, or prevents_pass evidence')
  }
  if (report.verdict === 'INCOMPLETE' && hasBlockingLimit) {
    errors.push('INCOMPLETE cannot replace BLOCKED when external evidence is blocking')
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
    const source = new TextDecoder('utf-8', { fatal: true }).decode(payload)
    const duplicateCheck = YAML.parseDocument(source, {
      schema: 'json', strict: true, uniqueKeys: true, maxAliasCount: 0,
    })
    if (duplicateCheck.errors.length !== 0) {
      throw new Error('report JSON is ambiguous or is not uniquely keyed')
    }
    return JSON.parse(source)
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
  hashEvidenceRevision,
  hashFindingFingerprint,
  hashPathLedger,
  hashPathRecord,
  hashPolicyReceipt,
  hashReviewScope,
  hashTargetReceipt,
  sha256,
  validateReportSemantics,
}
