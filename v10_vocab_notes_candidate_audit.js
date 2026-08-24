const fs=require('fs');
const {JSDOM,VirtualConsole}=require('jsdom');
const {loadCanonicalV7}=require('./v10_v7_lexicon_loader');

function uniq(a){return [...new Set(a)];}
function assert(c,m){if(!c)throw new Error(m)}
function morphologyBases(w){
  const out=[];
  if(w.endsWith("'s")&&w.length>3)out.push(w.slice(0,-2));
  if(w.endsWith("s'")&&w.length>3)out.push(w.slice(0,-1));
  if(w.endsWith('ies')&&w.length>4)out.push(w.slice(0,-3)+'y');
  if(w.endsWith('ied')&&w.length>4)out.push(w.slice(0,-3)+'y');
  if(w.endsWith('ves')&&w.length>4){out.push(w.slice(0,-3)+'f',w.slice(0,-3)+'fe');}
  if(w.endsWith('es')&&w.length>3){out.push(w.slice(0,-2),w.slice(0,-1));}
  if(w.endsWith('s')&&w.length>3)out.push(w.slice(0,-1));
  if(w.endsWith('ing')&&w.length>5){const b=w.slice(0,-3);out.push(b,b+'e');if(b.endsWith('y'))out.push(b);if(b.length>2&&b.at(-1)===b.at(-2))out.push(b.slice(0,-1));}
  if(w.endsWith('ed')&&w.length>4){const b=w.slice(0,-2);out.push(b,b+'e');if(b.endsWith('i'))out.push(b.slice(0,-1)+'y');if(b.length>2&&b.at(-1)===b.at(-2))out.push(b.slice(0,-1));}
  if(w.endsWith('er')&&w.length>4){const b=w.slice(0,-2);out.push(b,b+'e');if(b.endsWith('i'))out.push(b.slice(0,-1)+'y');if(b.length>2&&b.at(-1)===b.at(-2))out.push(b.slice(0,-1));}
  if(w.endsWith('est')&&w.length>5){const b=w.slice(0,-3);out.push(b,b+'e');if(b.endsWith('i'))out.push(b.slice(0,-1)+'y');if(b.length>2&&b.at(-1)===b.at(-2))out.push(b.slice(0,-1));}
  return uniq(out.filter(Boolean));
}
const IRREGULAR_BASE=new Map(Object.entries({went:'go',gone:'go',came:'come',seen:'see',saw:'see',made:'make',took:'take',taken:'take',gave:'give',given:'give',wrote:'write',written:'write',read:'read',bought:'buy',brought:'bring',thought:'think',found:'find',knew:'know',known:'know',told:'tell',said:'say',spoke:'speak',spoken:'speak',ate:'eat',eaten:'eat',drank:'drink',drunk:'drink',ran:'run',swam:'swim',swum:'swim',became:'become',began:'begin',begun:'begin',left:'leave',felt:'feel',kept:'keep',met:'meet',sent:'send',built:'build',held:'hold',heard:'hear',lost:'lose',paid:'pay',put:'put',stood:'stand',understood:'understand'}));
const EXPLICIT_FUNCTION_TO_GRAMMAR=new Set(`a an the i me my mine you your yours he him his she her hers it its we us our ours they them their theirs this that these those who whose whom which what when where why how am is are was were be been being do does did doing have has had having can cannot could may might must shall should will would not no yes and or but so if because as than to of in on at by for from with about into over under before after during while through up down out off again then there here also too very more most less least some any many much few little each every all both either neither another other same own one two first second third`.split(/\s+/));
const CONTRACTIONS_TO_GRAMMAR=new Set(["i'm","you're","he's","she's","it's","we're","they're","isn't","aren't","wasn't","weren't","don't","doesn't","didn't","can't","couldn't","won't","wouldn't","shouldn't","mustn't","i've","you've","we've","they've","hasn't","haven't","hadn't","i'll","you'll","he'll","she'll","we'll","they'll"]);
function sourceStrings(m,meta){const out=[];(m.sentences||[]).forEach((s,i)=>out.push({where:`sentence:${i+1}`,text:s}));(m.slashRows||[]).forEach((r,i)=>out.push({where:`slash:${i+1}`,text:r&&r.en}));(m.questions||[]).forEach((q,i)=>['prompt','answer','evidence'].forEach(k=>out.push({where:`A${i+1}.${k}`,text:q&&q[k]})));const b=meta&&Array.isArray(meta.questionSetB)?meta.questionSetB:[];b.forEach((q,i)=>['prompt','answer','evidence'].forEach(k=>out.push({where:`B${i+1}.${k}`,text:q&&q[k]})));return out;}
function canonicalCode(textbook){if(textbook==='ニューホライズン')return 'NH';if(textbook==='サンシャイン')return 'SS';throw new Error(`unknown textbook ${textbook}`);}
function canonicalCutoff(v7,textbook,grade,section){
  const code=canonicalCode(textbook),g=Number(grade),units=v7.units[`${code}|${g}`]||{};
  const at=(fileUnit,subrank)=>{const pdf=Number(units[fileUnit]);if(!pdf)throw new Error(`v7 unit mapping missing ${code}|${g}|${section} -> ${fileUnit}`);return {code,grade:g,fileUnit,pdf,subrank:Number(subrank)};};
  if(code==='SS'){
    let m=String(section).match(/^Get Ready\s*(\d+)$/i);if(m)return at('Pr',Number(m[1]));
    if(/Step\s*6|Our Project\s*3|Power-Up\s*6/i.test(section))return at('P10',8);
    m=String(section).match(/^PROGRAM\s*(\d+)-(\d+)$/i);if(m){const n=Number(m[1]),k=Number(m[2]);let r=k;if(g===1&&n===9&&k>=2)r=Math.max(r,3);if(g===1&&n===10&&k===1)r=2;if(g===1&&n===10&&k>=4)r=8;if(g===2&&n===7&&k===1)r=2;if(g===2&&n===8&&k>=2)r=3;if(g===3&&n===7&&k===1)r=2;return at(`P${n}`,r);}
  }else{
    let m=String(section).match(/^Unit\s*0$/i);if(m)return at('U0',9);
    m=String(section).match(/^Unit\s*(\d+)-(\d+)$/i);if(m){const n=Number(m[1]),k=Number(m[2]);let r;if(g===1){r=k<=2?k:(n<=4?3:6);if(n===8&&k===1)r=2;}else{r=k===1?1:k===2?2:k===3?4:5;if(g===2&&n===3&&k===1)r=2;if(g===2&&n===7&&k===1)r=2;if(g===3&&n===1&&k===1)r=2;}return at(`U${n}`,r);}
  }
  throw new Error(`no canonical cutoff mapping for ${textbook}|${grade}|${section}`);
}
function introFor(v7,code,w){return v7.lex[`${code}|${w}`]||null;}
function introAllowed(intro,cut){if(!intro)return false;const [g,pdf,sub]=intro;if(Number(g)<cut.grade)return true;if(Number(g)>cut.grade)return false;return Number(pdf)<cut.pdf||(Number(pdf)===cut.pdf&&Number(sub)<=cut.subrank);}
function classifyToken(v7,w,raw,cut){const direct=introFor(v7,cut.code,w);if(direct&&introAllowed(direct,cut))return {kind:'V7_CHRONOLOGY_ALLOWED',intro:direct};const bases=uniq([IRREGULAR_BASE.get(w),...morphologyBases(w)].filter(Boolean));for(const base of bases){const bi=introFor(v7,cut.code,base);if(bi&&introAllowed(bi,cut))return {kind:'MORPHOLOGY_TO_GRAMMAR',base,intro:bi};}if(CONTRACTIONS_TO_GRAMMAR.has(w))return {kind:'CONTRACTION_TO_GRAMMAR'};if(!direct&&EXPLICIT_FUNCTION_TO_GRAMMAR.has(w))return {kind:'EXPLICIT_FUNCTION_TO_GRAMMAR'};if(direct)return {kind:'FUTURE_V7_LEAK',intro:direct};const proper=/^[A-Z][A-Za-z]+(?:'[A-Za-z]+)?$/.test(String(raw||''))&&w.length>1;return {kind:proper?'UNREGISTERED_PROPER':'UNREGISTERED_V7'};}
async function waitFor(fn,ms=45000,label='condition'){const st=Date.now();while(Date.now()-st<ms){try{if(fn())return;}catch(_){}await new Promise(r=>setTimeout(r,50));}throw new Error(`timeout waiting for ${label}`);}
function datasetCount(d){let n=0;for(const g of Object.values(d||{}))for(const t of Object.values(g||{}))n+=Object.keys(t||{}).length;return n;}
(async()=>{let dom;try{
  const v7=loadCanonicalV7();const browserErrors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>browserErrors.push(String(e&&e.message||e)));
  dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window;
  await waitFor(()=>datasetCount(w.eval('DATASETS'))===168,45000,'168 datasets');
  await waitFor(()=>{const expected=(w.V10_VOCAB_CORRECTIONS||[]).length;return expected>0&&Number(w.V10_VOCAB_CORRECTION_TARGETS_SEEN||0)>=expected;},45000,'all v10 correction targets');
  await new Promise(r=>setTimeout(r,250));
  const DATASETS=w.eval('DATASETS'),META=w.eval('META');let total=0,notesPresent=0,missingGloss=0;const passages=[],global=new Map(),mappingErrors=[];const counts={V7_CHRONOLOGY_ALLOWED:0,MORPHOLOGY_TO_GRAMMAR:0,CONTRACTION_TO_GRAMMAR:0,EXPLICIT_FUNCTION_TO_GRAMMAR:0,FUTURE_V7_LEAK:0,UNREGISTERED_V7:0,UNREGISTERED_PROPER:0};
  for(const grade of ['1','2','3'])for(const textbook of ['サンシャイン','ニューホライズン'])for(const [section,m] of Object.entries((DATASETS[grade]||{})[textbook]||{})){
    total++;let cut;try{cut=canonicalCutoff(v7,textbook,grade,section);}catch(e){mappingErrors.push(String(e.message||e));continue;}const meta=META[`${textbook}|${grade}|${section}`]||{},found=new Map();
    for(const src of sourceStrings(m,meta)){const rawTokens=String(src.text||'').replace(/[’]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[];for(const raw of rawTokens){const tok=raw.toLowerCase(),c=classifyToken(v7,tok,raw,cut);counts[c.kind]++;if(c.kind==='V7_CHRONOLOGY_ALLOWED')continue;const key=`${c.kind}|${tok}|${c.base||''}`;if(!found.has(key))found.set(key,{token:tok,kind:c.kind,base:c.base||null,intro:c.intro||null,locations:[]});if(found.get(key).locations.length<10)found.get(key).locations.push(src.where);if(['FUTURE_V7_LEAK','UNREGISTERED_V7','UNREGISTERED_PROPER'].includes(c.kind)){const gkey=`${c.kind}|${tok}`;if(!global.has(gkey))global.set(gkey,{token:tok,kind:c.kind,intro:c.intro||null,occurrences:0,sections:new Set(),examples:[]});const x=global.get(gkey);x.occurrences++;x.sections.add(`${textbook}|${grade}|${section}`);if(x.examples.length<12)x.examples.push(`${textbook}|${grade}|${section}|${src.where}`);}}}
    const notes=Array.isArray(m.notes)?m.notes:[];notesPresent+=notes.length;for(const n of notes)if(!n||!String(n.english||'').trim()||!String(n.japanese||'').trim())missingGloss++;passages.push({grade,textbook,section,id:m.id||'',cutoff:cut,notes:notes.length,candidates:[...found.values()]});
  }
  assert(total===168,`expected 168 passages, got ${total}`);assert(mappingErrors.length===0,`canonical cutoff mapping errors: ${mappingErrors.join(' | ')}`);assert(browserErrors.length===0,`browser errors: ${browserErrors.join(' | ')}`);
  const unresolved=[...global.values()].map(x=>({...x,sectionCount:x.sections.size,sections:[...x.sections]})).sort((a,b)=>b.occurrences-a.occurrences||a.token.localeCompare(b.token));const finalVocabLeak=counts.FUTURE_V7_LEAK+counts.UNREGISTERED_V7+counts.UNREGISTERED_PROPER;const summary={generatedAt:new Date().toISOString(),passages:total,canonicalSource:{spreadsheetId:v7.source[0],sheet:v7.source[1],records:v7.source[2],modifiedTime:v7.source[3]},counts,notesPresent,missingGloss,mappingErrors,uniqueUnresolved:unresolved.length,futureVocabLeakOccurrences:finalVocabLeak,chronologyPass:finalVocabLeak===0&&missingGloss===0&&mappingErrors.length===0,rule:'Primary lexical gate is canonical v7 earliest occurrence by textbook + grade + PDF order + canonical subunit rank. Previous grades are cumulative. Later PDF/subunits are forbidden. Morphology and closed structural forms are never lexical PASS; they are handed to grammar chronology.'};fs.writeFileSync('v10_vocab_notes_candidate_report.json',JSON.stringify({summary,unresolved,passages},null,2));console.log(`V7 VOCAB CHRONOLOGY AUDIT passages=${total} sourceRecords=${v7.source[2]}`);console.log(Object.entries(counts).map(([k,v])=>`${k}=${v}`).join(' '));console.log(`unique_unresolved=${unresolved.length} future_vocab_leak_occurrences=${finalVocabLeak} notes=${notesPresent} missing_gloss=${missingGloss} chronologyPass=${summary.chronologyPass}`);console.log('REPORT=v10_vocab_notes_candidate_report.json');
}finally{if(dom)dom.window.close();}})().catch(e=>{console.log(`V7 VOCAB CHRONOLOGY AUDIT FAIL: ${e.stack||e}`);process.exit(1)});
