const fs=require('fs');
const {JSDOM,VirtualConsole}=require('jsdom');

function tokenize(text){
  return (String(text||'').replace(/[’]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).map(x=>x.toLowerCase());
}
function uniq(a){return [...new Set(a)];}
function assert(c,m){if(!c)throw new Error(m)}
function flattenAllowed(m){
  const rows=Array.isArray(m&&m.allowedWords)?m.allowedWords:[];
  const src=rows.map(r=>Array.isArray(r)?String(r[0]||''):String(r||'')).join(' / ');
  return new Set(tokenize(src));
}
function morphologyBases(w){
  const out=[];
  if(w.endsWith('ies')&&w.length>4)out.push(w.slice(0,-3)+'y');
  if(w.endsWith('ied')&&w.length>4)out.push(w.slice(0,-3)+'y');
  if(w.endsWith('es')&&w.length>3){out.push(w.slice(0,-2));out.push(w.slice(0,-1));}
  if(w.endsWith('s')&&w.length>3)out.push(w.slice(0,-1));
  if(w.endsWith('ing')&&w.length>5){const b=w.slice(0,-3);out.push(b,b+'e');if(b.length>2&&b.at(-1)===b.at(-2))out.push(b.slice(0,-1));}
  if(w.endsWith('ed')&&w.length>4){const b=w.slice(0,-2);out.push(b,b+'e');if(b.length>2&&b.at(-1)===b.at(-2))out.push(b.slice(0,-1));}
  if(w.endsWith('er')&&w.length>4){const b=w.slice(0,-2);out.push(b,b+'e');}
  if(w.endsWith('est')&&w.length>5){const b=w.slice(0,-3);out.push(b,b+'e');}
  return uniq(out.filter(Boolean));
}
// Vocabulary-only exemption: these are routed to the separate grammar chronology gate,
// NOT declared taught at every section here.
const FUNCTION_TO_GRAMMAR=new Set(`a an the i me my mine you your yours he him his she her hers it its we us our ours they them their theirs this that these those who whose whom which what when where why how am is are was were be been being do does did doing have has had having can could may might must shall should will would not no yes and or but so if because as than to of in on at by for from with about into over under before after during while through up down out off again then there here also too very more most less least some any many much few little each every all both either neither another other same own one two first second third`.split(/\s+/));
const CONTRACTIONS_TO_GRAMMAR=new Set(["i'm","you're","he's","she's","it's","we're","they're","isn't","aren't","wasn't","weren't","don't","doesn't","didn't","can't","couldn't","won't","wouldn't","shouldn't","mustn't","i've","you've","we've","they've","hasn't","haven't","hadn't","i'll","you'll","he'll","she'll","we'll","they'll"]);
const IRREGULAR_TO_GRAMMAR=new Map(Object.entries({went:'go',gone:'go',came:'come',seen:'see',saw:'see',made:'make',took:'take',taken:'take',gave:'give',given:'give',wrote:'write',written:'write',read:'read',bought:'buy',brought:'bring',thought:'think',found:'find',knew:'know',known:'know',told:'tell',said:'say',spoke:'speak',spoken:'speak',ate:'eat',eaten:'eat',drank:'drink',drunk:'drink',ran:'run',swam:'swim',swum:'swim',became:'become',began:'begin',begun:'begin',left:'leave',felt:'feel',kept:'keep',met:'meet',sent:'send',built:'build',held:'hold',heard:'hear',lost:'lose',paid:'pay',put:'put',stood:'stand',understood:'understand'}));
function sourceStrings(m,meta){
  const out=[];
  (m.sentences||[]).forEach((s,i)=>out.push({where:`sentence:${i+1}`,text:s}));
  (m.slashRows||[]).forEach((r,i)=>out.push({where:`slash:${i+1}`,text:r&&r.en}));
  (m.questions||[]).forEach((q,i)=>['prompt','answer','evidence'].forEach(k=>out.push({where:`A${i+1}.${k}`,text:q&&q[k]})));
  const b=meta&&Array.isArray(meta.questionSetB)?meta.questionSetB:[];
  b.forEach((q,i)=>['prompt','answer','evidence'].forEach(k=>out.push({where:`B${i+1}.${k}`,text:q&&q[k]})));
  return out;
}
function classifyToken(w,allowed,raw){
  if(allowed.has(w))return {kind:'EXACT_ALLOWED'};
  if(FUNCTION_TO_GRAMMAR.has(w)||CONTRACTIONS_TO_GRAMMAR.has(w))return {kind:'FUNCTION_TO_GRAMMAR'};
  const irr=IRREGULAR_TO_GRAMMAR.get(w);if(irr&&allowed.has(irr))return {kind:'MORPHOLOGY_TO_GRAMMAR',base:irr};
  const base=morphologyBases(w).find(b=>allowed.has(b));if(base)return {kind:'MORPHOLOGY_TO_GRAMMAR',base};
  const proper=/\b[A-Z][A-Za-z]+(?:'[A-Za-z]+)?\b/.test(String(raw||''))&&w.length>1;
  return {kind:proper?'PROPER_V7_LOOKUP_REQUIRED':'V7_LOOKUP_REQUIRED'};
}
async function waitFor(fn,ms=30000){const st=Date.now();while(Date.now()-st<ms){if(fn())return;await new Promise(r=>setTimeout(r,50));}throw new Error('runtime load timeout');}
(async()=>{
  const browserErrors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>browserErrors.push(String(e&&e.message||e)));
  const dom=await JSDOM.fromFile('v10_stage2.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc});
  await new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('load timeout')),20000);dom.window.addEventListener('load',()=>{clearTimeout(t);res()},{once:true});});
  const w=dom.window;await waitFor(()=>w.V10_RUNTIME_LOAD_PROGRESS==='complete'&&!w.V10_RUNTIME_LOAD_ERROR);
  const DATASETS=w.eval('DATASETS');const META=w.eval('META');
  let total=0;const report=[];const counts={EXACT_ALLOWED:0,FUNCTION_TO_GRAMMAR:0,MORPHOLOGY_TO_GRAMMAR:0,PROPER_V7_LOOKUP_REQUIRED:0,V7_LOOKUP_REQUIRED:0};
  let notesPresent=0,missingGloss=0,missingAllowedWords=0;
  for(const grade of ['1','2','3'])for(const textbook of ['サンシャイン','ニューホライズン']){
    const set=(DATASETS[grade]||{})[textbook]||{};
    for(const [section,m] of Object.entries(set)){
      total++;
      const allowed=flattenAllowed(m);if(!allowed.size)missingAllowedWords++;
      const meta=META[`${textbook}|${grade}|${section}`]||{};
      const found=new Map();
      for(const src of sourceStrings(m,meta))for(const rawTok of (String(src.text||'').replace(/[’]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[])){
        const wtok=rawTok.toLowerCase();const c=classifyToken(wtok,allowed,rawTok);counts[c.kind]++;
        if(c.kind==='EXACT_ALLOWED')continue;
        const key=`${c.kind}|${wtok}|${c.base||''}`;
        if(!found.has(key))found.set(key,{token:wtok,kind:c.kind,base:c.base||null,locations:[]});
        const f=found.get(key);if(f.locations.length<8)f.locations.push(src.where);
      }
      const notes=Array.isArray(m.notes)?m.notes:[];notesPresent+=notes.length;
      for(const n of notes)if(!n||!String(n.english||'').trim()||!String(n.japanese||'').trim())missingGloss++;
      report.push({grade,textbook,section,id:m.id||'',allowedTokenCount:allowed.size,notes:notes.length,candidates:[...found.values()]});
    }
  }
  assert(total===168,`expected 168 passages, got ${total}`);
  assert(browserErrors.length===0,`browser errors: ${browserErrors.join(' | ')}`);
  const summary={generatedAt:new Date().toISOString(),passages:total,counts,notesPresent,missingGloss,missingAllowedWords,
    semantics:{FUNCTION_TO_GRAMMAR:'vocabulary exemption only; must pass chronological grammar gate',MORPHOLOGY_TO_GRAMMAR:'base appears in reviewed allowedWords; inflection still requires grammar chronology check',V7_LOOKUP_REQUIRED:'must be checked against v7 master at the exact textbook/grade/section cutoff',PROPER_V7_LOOKUP_REQUIRED:'proper-name candidate; not auto-approved'}};
  const payload={summary,passages:report};
  fs.writeFileSync('v10_vocab_notes_candidate_report.json',JSON.stringify(payload,null,2));
  console.log(`VOCAB CANDIDATE AUDIT passages=${total}`);
  console.log(`EXACT_ALLOWED=${counts.EXACT_ALLOWED} FUNCTION_TO_GRAMMAR=${counts.FUNCTION_TO_GRAMMAR} MORPHOLOGY_TO_GRAMMAR=${counts.MORPHOLOGY_TO_GRAMMAR} PROPER_LOOKUP=${counts.PROPER_V7_LOOKUP_REQUIRED} V7_LOOKUP=${counts.V7_LOOKUP_REQUIRED}`);
  console.log(`notes_present=${notesPresent} missing_gloss=${missingGloss} missing_allowedWords=${missingAllowedWords}`);
  console.log('REPORT=v10_vocab_notes_candidate_report.json');
  dom.window.close();
})().catch(e=>{console.error(`VOCAB CANDIDATE AUDIT FAIL: ${e.stack||e}`);process.exit(1)});
