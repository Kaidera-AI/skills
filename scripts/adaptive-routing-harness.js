#!/usr/bin/env node
'use strict'
// Test-envelope tooling only. No model client, native selector, or provider executor.
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const files = ['SKILL.md','references/fusion.md','references/run-profile.md','references/shift.md']

function subjectFrom(entries, extra={}) {
  return {files:entries,tree_hash:sha(JSON.stringify(entries.map(x=>[x.path,x.sha256]))),...extra}
}
function snapshot(directory) {
  const base=path.resolve(directory);const found=[]
  function walk(relative='') {
    for(const name of fs.readdirSync(path.join(base,relative)).sort()) {
      const rel=path.posix.join(relative,name);const st=fs.lstatSync(path.join(base,rel))
      if(st.isSymbolicLink()) throw new Error('subject must contain regular Markdown files')
      if(st.isDirectory()) walk(rel)
      else if(st.isFile()) found.push(rel)
      else throw new Error('subject must contain regular Markdown files')
    }
  }
  walk()
  if(JSON.stringify(found.sort())!==JSON.stringify(files)) throw new Error('subject requires exactly four Markdown files')
  return subjectFrom(files.map(relative=>{
    const raw=fs.readFileSync(path.join(base,relative))
    return {path:relative,bytes:raw.toString('utf8'),sha256:sha(raw)}
  }))
}
function owned(subject,file) {
  const entry=subject.files.find(x=>x.path===file)
  if(!entry) throw new Error('unowned subject file')
  return entry
}
function block(subject,file,heading) {
  const entry=owned(subject,file);const marker='## '+heading+'\n'
  const start=entry.bytes.indexOf(marker)
  if(start<0||entry.bytes.indexOf(marker,start+marker.length)>=0) throw new Error('instruction heading must occur exactly once')
  const next=entry.bytes.indexOf('\n## ',start+marker.length)
  const end=next<0?entry.bytes.length:next+1
  const bytes=entry.bytes.slice(start,end)
  return {path:file,heading,byte_start:Buffer.byteLength(entry.bytes.slice(0,start)),
    byte_end:Buffer.byteLength(entry.bytes.slice(0,end)),sha256:sha(bytes),bytes}
}
function caseSubject(subject,c) {
  return {case_id:c.id,representation:'portable',source_tree_hash:subject.tree_hash,
    files:subject.files.map(({path,sha256})=>({path,sha256})),block:block(subject,c.reference,c.heading)}
}
function changed(subject,file,bytes,extra={}) {
  owned(subject,file)
  return subjectFrom(subject.files.map(x=>x.path===file?{path:file,bytes,sha256:sha(bytes)}:{...x}),extra)
}
function mutate(subject,m) {
  const entry=owned(subject,m.file);const selected=block(subject,m.file,m.heading)
  if(!selected.bytes.includes(m.from)||entry.bytes.split(m.from).length!==2) throw new Error('mutation text must occur exactly once in its owned block')
  return changed(subject,m.file,entry.bytes.replace(m.from,m.to),{
    mutation:{id:m.id,file:m.file,before_sha256:entry.sha256,after_block_sha256:sha(selected.bytes.replace(m.from,m.to)),witness:m.witness},
    mutant_killed:false,behaviour_status:'BLOCKED'
  })
}
function neutralise(subject,c) {
  const entry=owned(subject,c.reference);const selected=block(subject,c.reference,c.heading)
  const replacement='## '+c.heading+'\n\nNeutral instruction control.\n'
  const bytes=entry.bytes.replace(selected.bytes,replacement)
  return changed(subject,c.reference,bytes,{control:'neutral-instruction-body',coupling_proved:false,behaviour_status:'BLOCKED'})
}
function bindProjection(subject,file) {
  const st=fs.lstatSync(file)
  if(!st.isFile()||st.isSymbolicLink()) throw new Error('projection must be regular')
  return {representation:'projection',projection_path:file,projection_sha256:sha(fs.readFileSync(file)),source_tree_hash:subject.tree_hash}
}
function missingPrerequisites(packet) {
  const reasons=[]
  for(const [name,code] of [
    ['unit0_owner_receipt','UNIT0_OWNER_RECEIPT_MISSING'],
    ['native_owner_receipt','NATIVE_OWNER_RECEIPT_MISSING'],
    ['performer_budget_go','PERFORMER_BUDGET_GO_MISSING'],
    ['oracle_isolation_receipt','ORACLE_ISOLATION_UNPROVED']]) if(!packet[name]) reasons.push(code)
  return reasons
}
function performerPacket(subject,c,packet) {
  // Explicit allowlist. Evaluator/oracle/mutation bytes are never copied to this view.
  return {schema:'kaidera.adaptive-routing-performer-input.v1',case_id:c.id,task:c.task,
    invocation:'/skill:adaptive-routing '+c.task,subject,
    raw_owner_catalogue_bytes:packet.raw_owner_catalogue_bytes??null,
    raw_owner_native_contract_bytes:packet.raw_owner_native_contract_bytes??null,
    native_catalogue_example:null,provider_execution:'BLOCKED',
    loader:'OpenKai loadSkills/buildSkillPromptMessage; actual session required',
    isolation_status:'BLOCKED_UNTIL_INDEPENDENT_RECEIPT'}
}
function reportBlocked(subject,packet) {
  const reasons=missingPrerequisites(packet)
  // Even complete-looking caller metadata cannot make this packet-only command run a provider.
  if(!reasons.length) reasons.push('ACTUAL_ISOLATED_NATIVE_PERFORMER_NOT_EXECUTED')
  const cases=packet.cases.map(c=>({id:c.id,subject:caseSubject(subject,c),status:'BLOCKED',reasons,
    provider_calls:0,mutant_killed:false,coupling_proved:false}))
  return {kind:'behavioural-readiness',passed:0,blocked:cases.length,provider_calls:0,cases}
}
class RecordingBoundary {
  constructor(state={}) {this.state={...state};this.ledger=[];this.provider_calls=0}
  read(name) {
    this.ledger.push({kind:'read',name})
    if(!Object.hasOwn(this.state,name)) throw new Error('unowned fixture state')
    return this.state[name]
  }
  write(name,bytes) {
    this.ledger.push({kind:'write-attempt',name,requested_sha256:sha(String(bytes))})
    if(!Object.hasOwn(this.state,name)||typeof bytes!=='string') throw new Error('unowned fixture state')
    // Requested opaque bytes only; never inspect native schema, select, repair or expire.
    this.state[name]=bytes
    this.ledger.push({kind:'write-committed',name,sha256:sha(bytes)})
  }
  dispatch(request) {
    this.ledger.push({kind:'dispatch-attempt',request})
    throw new Error('recording-only boundary: no provider dispatch')
  }
}
function predicate(id,o) {
  const quiet=(o.writer_attempts??0)===0&&(o.dispatch_attempts??0)===0
  switch(id) {
    case 'M1':return o.decision==='WAIT'&&!o.selected_default&&quiet
    case 'M2':return o.decision==='WAIT'&&!o.compatible_unknown&&quiet
    case 'M3':return o.decision==='WAIT'&&!o.requested_control_dropped&&quiet
    case 'M4':return o.decision==='WAIT'&&!o.implicit_builder&&(o.dispatch_attempts??0)===0
    case 'M5':return o.decision==='UNVERIFIED'&&o.effect_correlated===false
    case 'M6':return o.stale_base_replacement===false&&(o.writer_attempts??0)===0
    case 'M7':return o.unapproved_extra_call===false&&(o.dispatch_attempts??0)===0
    default:throw new Error('unknown assessor predicate')
  }
}
function assess(id,evidence,subjectHash) {
  if(evidence.subject_hash!==subjectHash) return {status:'UNVERIFIED',reason:'SUBJECT_MISMATCH',behaviour_pass:false,mutant_killed:false}
  if(!Array.isArray(evidence.setup_errors)||evidence.setup_errors.length) return {status:'UNVERIFIED',reason:'SETUP_OR_IMPORT_ERROR',behaviour_pass:false,mutant_killed:false}
  const passed=predicate(id,evidence.observation??{})
  // This implementation can check recorded artefacts; it cannot attest a model performer,
  // oracle isolation, native schema, or provider budget. Independent receipts are still held.
  return {status:'BLOCKED',reason:evidence.simulation?'RECORDED_SIMULATION_ONLY':'INDEPENDENT_PERFORMER_AND_OWNER_RECEIPTS_REQUIRED',
    predicate_satisfied:passed,behaviour_pass:false,mutant_killed:false}
}
function coupling(evidence) {
  if(evidence.setup_errors?.length||!evidence.baseline_pass||evidence.neutral_predicate_satisfied!==false)
    return {status:'UNVERIFIED',coupling_proved:false,reason:'NO_FROZEN_BEHAVIOURAL_FAILURE'}
  return {status:'BLOCKED',coupling_proved:false,reason:'INDEPENDENT_REAL_PERFORMER_RECEIPTS_REQUIRED'}
}
module.exports={sha,snapshot,caseSubject,mutate,neutralise,bindProjection,performerPacket,reportBlocked,RecordingBoundary,assess,coupling}
if(require.main===module) {
  const root=path.resolve(__dirname,'..')
  const subject=snapshot(path.join(root,'skills/development/adaptive-routing'))
  const packet=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/adaptive-routing/cases.json')))
  process.stdout.write(JSON.stringify(reportBlocked(subject,packet),null,2)+'\n')
  // Exit 2 means readiness blocked, separately from the checker/static unit suite.
  process.exitCode=2
}
