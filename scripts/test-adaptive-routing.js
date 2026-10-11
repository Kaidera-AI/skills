#!/usr/bin/env node
'use strict'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { test } = require('node:test')
const root = path.resolve(__dirname, '..')
const source = path.join(root, 'skills/development/adaptive-routing')
const fixtures = path.join(__dirname, 'fixtures/adaptive-routing')
const cases = JSON.parse(fs.readFileSync(path.join(fixtures,'cases.json')))
const mutations = JSON.parse(fs.readFileSync(path.join(fixtures,'mutations.json')))
function harness() {
  assert.ok(fs.existsSync(path.join(source,'SKILL.md')), 'new adaptive-routing instruction bytes absent')
  assert.ok(fs.existsSync(path.join(__dirname,'adaptive-routing-harness.js')), 'recording harness contract absent')
  return require('./adaptive-routing-harness')
}

test('four owned Markdown files form an exact source subject', () => {
  const h = harness(); const s = h.snapshot(source)
  assert.deepEqual(s.files.map(x=>x.path), ['SKILL.md','references/fusion.md','references/run-profile.md','references/shift.md'])
  assert.equal(s.files.length,4)
  assert.match(s.tree_hash,/^[a-f0-9]{64}$/)
  for(const file of s.files) assert.match(file.sha256,/^[a-f0-9]{64}$/)
})

test('each scenario binds actual source and selected instruction block bytes', () => {
  const h=harness(); const s=h.snapshot(source)
  for(const c of cases.cases) {
    const subject=h.caseSubject(s,c)
    assert.equal(subject.case_id,c.id)
    assert.equal(subject.source_tree_hash,s.tree_hash)
    assert.equal(subject.block.path,c.reference)
    assert.ok(subject.block.byte_end>subject.block.byte_start)
    assert.match(subject.block.sha256,/^[a-f0-9]{64}$/)
  }
})

test('native dependencies and performer go keep every actual behaviour case BLOCKED', () => {
  const h=harness(); const report=h.reportBlocked(h.snapshot(source),cases)
  assert.equal(report.kind,'behavioural-readiness')
  assert.equal(report.passed,0)
  assert.equal(report.blocked,7)
  assert.equal(report.provider_calls,0)
  for(const row of report.cases) {
    assert.equal(row.status,'BLOCKED')
    assert.ok(row.reasons.includes('UNIT0_OWNER_RECEIPT_MISSING'))
    assert.ok(row.reasons.includes('PERFORMER_BUDGET_GO_MISSING'))
    assert.equal(row.mutant_killed,false)
    assert.equal(row.coupling_proved,false)
  }
})

test('each mutation changes only its owned Markdown carrier, not fixtures or native code', () => {
  const h=harness(); const s=h.snapshot(source)
  const original=fs.readFileSync(path.join(fixtures,'cases.json'))
  for(const m of mutations) {
    const changed=h.mutate(s,m)
    assert.equal(changed.mutation.id,m.id)
    assert.notEqual(changed.tree_hash,s.tree_hash)
    assert.equal(changed.files.filter(f=>f.sha256!==s.files.find(x=>x.path===f.path).sha256).length,1)
    assert.ok(changed.files.find(f=>f.path===m.file).bytes.includes(m.to))
    assert.deepEqual(fs.readFileSync(path.join(fixtures,'cases.json')),original)
  }
  assert.equal(mutations.length,7)
})

test('neutral coupling subject stays discoverable and changes real instruction bytes', () => {
  const h=harness(); const s=h.snapshot(source)
  for(const c of cases.cases) {
    const changed=h.neutralise(s,c)
    assert.notEqual(changed.tree_hash,s.tree_hash)
    assert.ok(changed.files.find(f=>f.path==='SKILL.md').bytes.startsWith('---\n'))
    assert.ok(changed.files.find(f=>f.path===c.reference).bytes.includes('Neutral instruction control.'))
    assert.equal(changed.coupling_proved,false)
  }
})

test('projection is a separate frozen representation subject', () => {
  const h=harness(); const s=h.snapshot(source)
  const p=h.bindProjection(s,path.join(root,'skills/development/adaptive-routing.SKILL.md'))
  assert.equal(p.representation,'projection')
  assert.match(p.projection_sha256,/^[a-f0-9]{64}$/)
  assert.equal(p.source_tree_hash,s.tree_hash)
})

test('recording-only fake boundary records attempts before fixture refusal', () => {
  const h=harness(); const b=new h.RecordingBoundary({catalogue:'opaque-owner-response'})
  assert.equal(b.read('catalogue'),'opaque-owner-response')
  assert.throws(()=>b.dispatch({opaque_request:'request'}),/no provider dispatch/)
  assert.equal(b.ledger[1].kind,'dispatch-attempt')
  assert.equal(b.provider_calls,0)
  assert.equal(b.ledger.length,2)
})

test('fake writer applies exact requested opaque bytes without selecting or repairing', () => {
  const h=harness(); const b=new h.RecordingBoundary({config:'old-base'})
  b.write('config','requested-next-base')
  assert.equal(b.state.config,'requested-next-base')
  assert.equal(b.ledger[0].kind,'write-attempt')
  assert.equal(b.ledger[1].kind,'write-committed')
  assert.equal(b.ledger[0].requested_sha256,h.sha('requested-next-base'))
  assert.throws(()=>b.write('../outside','data'),/unowned fixture state/)
})

test('performer packet excludes oracle, mutation specification and expected response', () => {
  const h=harness(); const s=h.snapshot(source)
  for(const c of cases.cases) {
    const packet=h.performerPacket(h.caseSubject(s,c),c,cases)
    assert.equal(packet.invocation,'/skill:adaptive-routing '+c.task)
    assert.equal(packet.native_catalogue_example,null)
    assert.equal(packet.expected,undefined)
    assert.equal(packet.oracle,undefined)
    assert.equal(packet.mutation,undefined)
    assert.equal(packet.provider_execution,'BLOCKED')
  }
})

test('recorded simulation can test checker predicates but never count as skill behaviour PASS', () => {
  const h=harness(); const s=h.snapshot(source)
  const evidence={subject_hash:s.tree_hash,simulation:true,setup_errors:[],observation:{decision:'WAIT',selected_default:false,writer_attempts:0,dispatch_attempts:0}}
  const r=h.assess('M1',evidence,s.tree_hash)
  assert.equal(r.predicate_satisfied,true)
  assert.equal(r.status,'BLOCKED')
  assert.equal(r.behaviour_pass,false)
})

test('seven bad-branch observations fail unchanged assessor predicates (checker unit evidence only)', () => {
  const h=harness(); const expected=h.snapshot(source).tree_hash
  const observations={
    M1:{decision:'PLAN',selected_default:true,writer_attempts:1},
    M2:{decision:'APPLIED',compatible_unknown:true,writer_attempts:1},
    M3:{decision:'APPLIED',requested_control_dropped:true,dispatch_attempts:1},
    M4:{decision:'APPLIED',implicit_builder:true,dispatch_attempts:1},
    M5:{decision:'VERIFIED',effect_correlated:false},
    M6:{stale_base_replacement:true,writer_attempts:1},
    M7:{unapproved_extra_call:true,dispatch_attempts:1}
  }
  for(const [id,observation] of Object.entries(observations)) {
    const r=h.assess(id,{subject_hash:expected,simulation:true,setup_errors:[],observation},expected)
    assert.equal(r.predicate_satisfied,false,id)
    assert.equal(r.status,'BLOCKED',id)
    assert.equal(r.mutant_killed,false,id)
  }
})

test('coupling cannot close from a missing file or a correct independent shim', () => {
  const h=harness()
  assert.equal(h.coupling({baseline_pass:true,neutral_predicate_satisfied:true,setup_errors:[]}).status,'UNVERIFIED')
  assert.equal(h.coupling({baseline_pass:true,neutral_predicate_satisfied:false,setup_errors:['missing subject']}).status,'UNVERIFIED')
  assert.equal(h.coupling({baseline_pass:true,neutral_predicate_satisfied:false,setup_errors:[],simulation:true}).status,'BLOCKED')
})

test('fixture and source failures do not become eligible performer runs', () => {
  const h=harness(); const s=h.snapshot(source)
  assert.throws(()=>h.caseSubject(s,{id:'bad',reference:'../foreign',heading:'Discovery'}),/unowned/)
  assert.throws(()=>h.mutate(s,{...mutations[0],file:'../native.ts'}),/unowned/)
  assert.throws(()=>h.mutate(s,{...mutations[0],from:'not in the source'}),/exactly once/)
})

test('symlink and extra JSON input refuse the injectable source subject', () => {
  const h=harness(); const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'adaptive-subject-'))
  try {
    fs.cpSync(source,tmp,{recursive:true})
    fs.writeFileSync(path.join(tmp,'native.json'),'{}')
    assert.throws(()=>h.snapshot(tmp),/four Markdown/)
    fs.rmSync(path.join(tmp,'native.json'))
    fs.rmSync(path.join(tmp,'references/shift.md'))
    fs.symlinkSync(path.join(source,'references/shift.md'),path.join(tmp,'references/shift.md'))
    assert.throws(()=>h.snapshot(tmp),/regular/)
  } finally {fs.rmSync(tmp,{recursive:true,force:true})}
})

test('root symlink cannot masquerade as the frozen source directory', () => {
  const h=harness();const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'adaptive-root-'))
  try {const link=path.join(tmp,'subject');fs.symlinkSync(source,link);assert.throws(()=>h.snapshot(link),/regular source directory/)}
  finally {fs.rmSync(tmp,{recursive:true,force:true})}
})

test('projection binds the actual portable source hash, not an arbitrary caller claim', () => {
  const h=harness();const s=h.snapshot(source);const changed=h.mutate(s,mutations[0])
  assert.throws(()=>h.bindProjection(changed,path.join(root,'skills/development/adaptive-routing.SKILL.md')),/projection source binding/)
})

test('materialised performer packet contains frozen skill bytes, no oracle and explicit BLOCKED state', () => {
  const h=harness();assert.equal(typeof h.materialisePacket,'function','performer packet materialisation absent')
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'adaptive-packet-'));const dest=path.join(tmp,'case')
  try {
    const s=h.snapshot(source);const result=h.materialisePacket(s,cases.cases[0],cases,dest)
    assert.equal(h.snapshot(path.join(dest,'.agents/skills/adaptive-routing')).tree_hash,s.tree_hash)
    const visible=JSON.parse(fs.readFileSync(path.join(dest,'performer-input.json')))
    assert.equal(visible.provider_execution,'BLOCKED')
    assert.equal(visible.oracle,undefined)
    assert.equal(visible.expected,undefined)
    assert.equal(result.provider_calls,0)
    assert.throws(()=>h.materialisePacket(s,cases.cases[0],cases,dest),/fresh destination/)
  } finally {fs.rmSync(tmp,{recursive:true,force:true})}
})
