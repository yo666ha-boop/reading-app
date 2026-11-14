// Verify UNIT supplements without mutating the frozen v11 1000-passage inventory.
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const arch=read('v11_multi_passage_architecture.js');
const source=read('v11_unit_supplemental_20261114.js');
const window={V11_EXTRA_PASSAGES:{'frozen|core':[ {id:'existing-v11-core'} ]}};
const ctx={window,console,setTimeout:()=>0,CustomEvent:class{},Event:class{}};
vm.runInNewContext(arch,ctx,{filename:'v11_multi_passage_architecture.js'});
const before=window.V11_MULTI_PASSAGE_STATE.extraPassages;
vm.runInNewContext(source,ctx,{filename:'v11_unit_supplemental_20261114.js'});
vm.runInNewContext(read('v11_unit_supplemental_wave2_20261114.js'),ctx,{filename:'v11_unit_supplemental_wave2_20261114.js'});
assert.equal(window.V11_MULTI_PASSAGE_STATE.extraPassages,before,'supplements must not affect frozen core registry');
assert.equal(window.V11_UNIT_SUPPLEMENTAL_STATE.count,12);
assert.equal(window.V11_UNIT_SUPPLEMENTAL_STATE.sections,12);
const supplements=Object.values(window.V11_UNIT_SUPPLEMENTAL_PASSAGES).flat();
for(const p of supplements)assert.ok((window.V11_UNIT_SUPPLEMENTAL_PASSAGES[window.V11_PASSAGE_REGISTRY_KEY(p)]||[]).some(v=>v.id===p.id),
  'normalized section key lost '+p.id);
assert.equal(supplements.length,12);
const baselines={
 'サンシャイン|1|PROGRAM 1-1':['v10_data_sunshine_g1_program1.js','V10_PASSAGES'],
 'ニューホライズン|1|Unit 1-1':['v10_data_newhorizon_g1.js','V10_PASSAGES'],
 'サンシャイン|2|PROGRAM 1-2':['v10_data_sunshine_g2_program1.js','V10_PASSAGES_G2_SS'],
 'ニューホライズン|2|Unit 1-1':['v10_data_newhorizon_g2_unit0_1.js','V10_PASSAGES_G2_NH'],
 'サンシャイン|3|PROGRAM 1-2':['v10_data_sunshine_g3_program1.js','V10_PASSAGES_G3_SS'],
 'ニューホライズン|3|Unit 1-1':['v10_data_newhorizon_g3_unit0_1.js','V10_PASSAGES_G3_NH'],
 'サンシャイン|1|PROGRAM 1-2':['v10_data_sunshine_g1_program1.js','V10_PASSAGES'],
 'ニューホライズン|1|Unit 1-2':['v10_data_newhorizon_g1_unit1_2.js','V10_PASSAGES'],
 'サンシャイン|2|PROGRAM 1-3':['v10_data_sunshine_g2_program1.js','V10_PASSAGES_G2_SS'],
 'ニューホライズン|2|Unit 1-2':['v10_data_newhorizon_g2_unit0_1.js','V10_PASSAGES_G2_NH'],
 'サンシャイン|3|PROGRAM 1-3':['v10_data_sunshine_g3_program1.js','V10_PASSAGES_G3_SS'],
 'ニューホライズン|3|Unit 1-2':['v10_data_newhorizon_g3_unit0_1.js','V10_PASSAGES_G3_NH']
};
const cmp=s=>String(s).replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();
const ids=new Set(),bodies=new Set();
for(const p of supplements){
 const key=[p.textbook,p.grade,p.section].join('|');
 assert.ok(baselines[key],'No audited baseline for '+key);
 const [filename,globalName]=baselines[key];
 const bwindow={V10_PASSAGES:{},V10_PASSAGES_G2_SS:{},V10_PASSAGES_G2_NH:{},V10_PASSAGES_G3_SS:{},V10_PASSAGES_G3_NH:{}};
 vm.runInNewContext(read(filename),{window:bwindow},{filename});
 const baseline=bwindow[globalName][p.section];
 assert.ok(baseline,'UNIT missing in verified v10 source '+key);
 assert.equal(baseline.textbook,p.textbook);
 assert.equal(String(baseline.grade),String(p.grade));
 assert.ok(p.sentences.length>=10,'Passage too short in sentences '+p.id);
 assert.equal(p.slashRows.length,p.sentences.length);
 assert.ok(p.fullTranslation.length>=30);
 assert.equal(p.questions.length,5);
 assert.equal(p.questionSetB.length,5);
 assert.equal(p.curriculumGate,'PENDING_FINAL_V7_CANONICAL_REVIEW');
 assert.ok(!ids.has(p.id));ids.add(p.id);
 const body=p.sentences.join(' ');
 assert.ok(!bodies.has(body));bodies.add(body);
 assert.notEqual(body,baseline.sentences.join(' '),'Must be original supplement');
 const shared=p.sentences.filter(sentence=>baseline.sentences.includes(sentence));
 assert.ok(shared.length/p.sentences.length<=0.4,
   p.id+' reuses too many full baseline sentences ('+shared.length+'/'+p.sentences.length+')');
 for(let i=0;i<p.sentences.length;i++){
  assert.equal(cmp(p.slashRows[i].en),cmp(p.sentences[i]),p.id+' mismatch at slash '+i);
  assert.ok(p.slashRows[i].jp&&p.slashRows[i].jp.length>1);
 }
 for(const [setName,qs] of [['A',p.questions],['B',p.questionSetB]]){
  for(const q of qs){
   assert.ok(p.sentences.includes(q.evidence),p.id+' '+setName+' evidence absent');
   assert.ok(q.answer&&q.evidenceJp&&q.reason);
  }
 }
}
const beforeToken='function rangeKeys(){',afterToken='function matchesWord';
const a=arch.indexOf(beforeToken),b=arch.indexOf(afterToken,a);
assert.ok(a>0&&b>a,'Cumulative UNIT scope function not found');
const rangeDefinition=arch.slice(a,b).trim();
const buildStart=arch.indexOf('function buildRecords(){'),buildEnd=arch.indexOf('function label(r)',buildStart);
assert.ok(buildStart>0&&buildEnd>buildStart,'Build records function missing');
const buildDefinition=arch.slice(buildStart,buildEnd).trim();
for(const p of supplements){
 const target=p.section;
 const later=/^PROGRAM/.test(target)?target.replace(/(\d+)-(\d+)$/,(m,a,b)=>a+'-'+(Number(b)+1))
   :target.replace(/(\d+)-(\d+)$/,(m,a,b)=>a+'-'+(Number(b)+1));
 const previous=/^PROGRAM/.test(target)?'Get Ready 6':'Unit 0';
 const base={};
 base[previous]={id:'PREVIOUS',section:previous,sentences:['Before.']};
 base[target]={id:'BASE',section:target,sentences:['Current.']};
 base[later]={id:'FUTURE',section:later,sentences:['Future.']};
 const values={grade:p.grade,textbook:p.textbook,section:target,pattern:'all'};
 const document={getElementById:id=>({value:values[id]})};
 const localWindow={V11_UNIT_SUPPLEMENTAL_PASSAGES:window.V11_UNIT_SUPPLEMENTAL_PASSAGES};
 const env={window:localWindow,document,dataset:()=>base,registry:{},seen:new Set(),
  keyOf:o=>[o.textbook,String(o.grade),String(o.section).replace(/^(program|unit)\s*/i,m=>m.trim().toUpperCase()+' ')].join('|'),
  wordCount:()=>100,matchesWord:()=>true,matchesPattern:()=>true};
 const scope=vm.runInNewContext('('+rangeDefinition+')',env);
 env.rangeKeys=scope;
 assert.deepEqual(Array.from(scope()),[previous,target],'scope must include prior section and exclude future');
 assert.equal(localWindow.V11_UNIT_RANGE_STATE.mode,'studied-through');
 assert.deepEqual(Array.from(localWindow.V11_UNIT_RANGE_STATE.futureSectionsExcluded),[later]);
 const build=vm.runInNewContext('('+buildDefinition+')',env);
 const records=build();
 assert.ok(records.some(r=>r.passage.id===p.id),'supplement missing at studied unit '+p.id);
 assert.ok(records.some(r=>r.passage.id==='PREVIOUS'),'earlier base item missing');
 assert.ok(records.some(r=>r.passage.id==='BASE'),'current base item missing');
 assert.ok(!records.some(r=>r.passage.id==='FUTURE'),'future passage leaked '+p.id);
 values.v11UnitScope='current-unit';
 const exact=Array.from(scope());
 assert.deepEqual(exact,[target],'exact UNIT must not include previous lessons');
 assert.equal(localWindow.V11_UNIT_RANGE_STATE.mode,'current-unit');
 const exactRecords=build();
 assert.ok(exactRecords.some(r=>r.passage.id===p.id),'selected UNIT omitted '+p.id);
 assert.ok(!exactRecords.some(r=>r.passage.id==='PREVIOUS'),'exact UNIT leaked earlier section '+p.id);
 assert.ok(!exactRecords.some(r=>r.passage.id==='FUTURE'),'exact UNIT leaked future '+p.id);
}
console.log('PASS unit supplementary '+supplements.length+' texts / 12 verified baseline section IDs');
console.log('PASS '+(supplements.length*10)+' questions with exact passage evidence and '+supplements.reduce((n,p)=>n+p.sentences.length,0)+' slash rows');
console.log('PASS cumulative/exact UNIT scope: cumulative includes previous, exact excludes previous, neither leaks future (12 checkpoints)');
console.log('PASS frozen core count unchanged ('+before+'); new passages remain in separate registry');
