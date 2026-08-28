'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console}; vm.createContext(sandbox);
for(const f of ['v11_batch07_yamaguchi_exam_draft_g3.js','v11_batch07_yamaguchi_semantic_repair.js','v11_batch07_yamaguchi_exam_evidence_sync.js']){
  vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
}
const ps=sandbox.window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[];
const repair=sandbox.window.V11_BATCH07_YAMAGUCHI_SEMANTIC_REPAIR_STATE||{};
const sync=sandbox.window.V11_BATCH07_YAMAGUCHI_EVIDENCE_SYNC_STATE||{};
const errors=[],details=[];
const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);
const find=id=>ps.find(p=>p.id===id);
const allQs=p=>[...(p.questions||[]),...(p.questionSetB||[])];
const evArr=x=>Array.isArray(x)?x:[x];
const jpArr=x=>Array.isArray(x)?x:[x];
function must(cond,msg){if(!cond)errors.push(msg);}

must(ps.length===4,`passage-count:${ps.length}`);
must(repair.reviewed===4,`human-reviewed:${repair.reviewed||0}`);
must((sync.missing||[]).length===0,`evidence-sync-missing:${(sync.missing||[]).length}`);

for(const p of ps){
  const body=(p.sentences||[]).join(' '), jp=(p.slashRows||[]).map(r=>r.jp).join('');
  const qs=allQs(p), prompts=qs.map(q=>q.prompt);
  const review=p.semanticHumanReview||{};
  const requiredReview=['reviewed','timelineCoherent','actorPerspectiveClear','materialBodyConsistent','questionAnswerLogical','insertionReferentNatural','freeWriteNatural'];
  for(const k of requiredReview) must(review[k]===true,`human-review:${p.id}:${k}`);
  must(!body.includes('about forty years ago'),`stale-timeline:${p.id}`);
  must(!prompts.some(x=>String(x).includes('speed alone was not enough')),`stale-insertion-logic:${p.id}`);
  must(!body.includes('She believed the rain had started first and that the parade waited near the school gate before moving.'),`stale-perspective:${p.id}`);
  must((p.sentences||[]).length===(p.slashRows||[]).length,`slash-count:${p.id}`);
  must((p.slashRows||[]).every((r,i)=>r.en===p.sentences[i]&&!!r.jp),`slash-pair:${p.id}`);
  must(p.fullTranslation===jp,`full-translation:${p.id}`);
  const wc=words(body).length; must(p.wordCount===wc,`word-count-field:${p.id}:${p.wordCount}/${wc}`); must(wc>=330&&wc<=450,`word-band:${p.id}:${wc}`);
  must(qs.length===10,`question-count:${p.id}:${qs.length}`);
  must(new Set(prompts).size===prompts.length,`duplicate-prompt:${p.id}`);
  for(const [i,q] of qs.entries()){
    must(!!q.questionType&&!!q.prompt&&!!q.answer&&!!q.reason,`question-fields:${p.id}:${i+1}`);
    const ev=evArr(q.evidence).filter(Boolean), ej=jpArr(q.evidenceJp).filter(Boolean);
    must(ev.length>0&&ev.length===ej.length,`evidence-shape:${p.id}:${i+1}`);
    ev.forEach((x,j)=>{
      const row=(p.slashRows||[]).find(r=>r.en===x);
      must(!!row,`evidence-en:${p.id}:${i+1}:${j+1}`);
      if(row) must(row.jp===ej[j],`evidence-jp:${p.id}:${i+1}:${j+1}`);
    });
    if(q.questionType==='SENTENCE_INSERTION'){
      must(Number.isInteger(q.insertAfterSentence)&&q.insertAfterSentence>=1&&q.insertAfterSentence<(p.sentences||[]).length,`insertion-index:${p.id}:${i+1}`);
    }
    if(['CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL'].includes(q.questionType)){
      must(String(q.prompt).includes('_____')||String(q.prompt).includes('空所'),`fill-prompt:${p.id}:${i+1}`);
      must(words(q.answer).length>=1,`fill-answer:${p.id}:${i+1}`);
    }
  }
  const fw=p.freeWriteTask||{}, fwc=words(fw.modelAnswer).length;
  must(fw.questionType==='FREE_WRITE_20_30',`freewrite-type:${p.id}`);
  must(Array.isArray(fw.wordRange)&&fw.wordRange[0]===20&&fw.wordRange[1]===30,`freewrite-range:${p.id}`);
  must(fwc>=20&&fwc<=30,`freewrite-model-count:${p.id}:${fwc}`);
  must(Array.isArray(fw.scoringConditions)&&fw.scoringConditions.some(x=>String(x).includes('意味の通る英文')),`freewrite-meaning:${p.id}`);
  details.push({id:p.id,wordCount:wc,questionCount:qs.length,freeWriteWords:fwc,humanReview:review});
}

const p003=find('V11-B07-G3-003');
must(!!p003&&p003.sentences.includes('We found a town map printed about thirty-five years ago and compared it with a current map.'),'G3-003-old-map-date');
must(!!p003&&p003.sentences.some(s=>s.includes('opened in 1988')),'G3-003-library-1988');
must(!!p003&&p003.sentences.some(s=>s.includes('new name in 1992')),'G3-003-rename-1992');
if(p003){const m=p003.materialData&&p003.materialData.items||[]; must(m.some(x=>x[0]==='Old map label'&&x[1]==='Harbor Road'),'G3-003-material-old-label'); must(m.some(x=>x[0]==='Current map label'&&x[1]==='Green Street'),'G3-003-material-current-label'); must(m.some(x=>x[0]==='Library opening record'&&x[1]==='1988'),'G3-003-material-library');}

const p006=find('V11-B07-G3-006');
if(p006){
  const ins=(p006.questionSetB||[]).find(q=>q.questionType==='SENTENCE_INSERTION');
  must(!!ins&&String(ins.prompt).includes('reaching everyone was not enough; the process also had to be quick'),'G3-006-insertion-meaning');
  const b=p006.sentences.join(' '),m=p006.materialData&&p006.materialData.items||[];
  for(const s of ['eighteen students had confirmed','Twenty-one students responded within ten minutes','all twenty-four students, but it took eighteen minutes','every student confirmed the message within nine minutes']) must(b.includes(s),`G3-006-body-number:${s}`);
  must(m.some(x=>x[0]==='Group chat'&&x[1]==='18 of 24 within 10 min'),'G3-006-material-group');
  must(m.some(x=>x[0]==='School app'&&x[1]==='21 of 24 within 10 min'),'G3-006-material-app');
  must(m.some(x=>x[0]==='Phone tree'&&x[1]==='24 of 24 within 18 min'),'G3-006-material-phone');
  must(m.some(x=>x[0]==='Combined method'&&x[1]==='24 of 24 within 9 min'),'G3-006-material-combined');
}

const p009=find('V11-B07-G3-009');
if(p009){
  must(p009.sentences.includes('She believed the rain had started before the back of the parade began moving from the school gate.'),'G3-009-back-perspective');
  must(p009.sentences.some(s=>s.includes('near the front of the parade')),'G3-009-front-perspective');
  must(p009.sentences.some(s=>s.includes('near the back, helping younger children')),'G3-009-back-position');
  const m=p009.materialData&&p009.materialData.items||[]; must(m.some(x=>x[0]==='Interview B'&&x[1]==='rain started before back group moved from school gate'),'G3-009-material-perspective');
}

const p014=find('V11-B07-G3-014');
if(p014){const m=p014.materialData&&p014.materialData.items||[]; must(m.length===4,'G3-014-material-four-periods'); must(m.some(x=>x[0]==='Saturday 15:00–17:00'&&x[1].includes('under 30 = 21')),'G3-014-material-youngest-peak'); must(p014.sentences.some(s=>s.includes('No single age group represented every visitor.')),'G3-014-sampling-conclusion');}

const report={pass:errors.length===0,reviewVersion:repair.version||null,evidenceSyncMissing:(sync.missing||[]).length,count:ps.length,errors,details};
fs.writeFileSync('V11_BATCH07_YAMAGUCHI_SEMANTIC_QUALITY_AUDIT.json',JSON.stringify(report,null,2)+'\n');
for(const d of details) console.log(`${d.id} words=${d.wordCount} questions=${d.questionCount} freewrite=${d.freeWriteWords} human=PASS`);
console.log(`BATCH07 YAMAGUCHI SEMANTIC QUALITY errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
