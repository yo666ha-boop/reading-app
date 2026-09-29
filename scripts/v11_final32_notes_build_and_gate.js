const fs=require('fs');
const bodyFiles=[
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
const bodies=bodyFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items||[]);
if(bodies.length!==32||new Set(bodies.map(x=>x.id)).size!==32)throw Error('FINAL32 body coverage invalid');
const vocab=JSON.parse(fs.readFileSync('V11_FINAL32_FORMAL_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
if(!vocab.finalPass||vocab.unregisteredOccurrences!==0||vocab.futureVocabLeakOccurrences!==0)throw Error('FINAL32 vocab chronology must be locked PASS before notes');
function norm(s){return String(s||'').toLowerCase().replace(/[’]/g,"'");}
function asciiOnly(s){return /^[\x00-\x7F]+$/.test(String(s||''));}
const groups={G1:[],G2:[],G3:[]},failures=[];
for(const b of bodies){
 const m=String(b.id).match(/-G([123])-([0-9]{3})$/); if(!m)throw Error('bad id '+b.id);
 const g='G'+m[1],n=m[2],p=`V11_FINAL32_REQUIRED_LOCAL_GLOSS_${g}_${n}.json`;
 if(!fs.existsSync(p))throw Error('missing '+p);
 const r=JSON.parse(fs.readFileSync(p,'utf8')), rows=Array.isArray(r.requiredLocal)?r.requiredLocal:[];
 const text=norm(b.body), ranked=[];
 for(const x of rows){
   const expression=String(x.word||x.expression||'').trim(),jp=String(x.gloss||x.jp||x.japanese||'').trim();
   if(!expression||!jp){failures.push(b.id+' blank required-local note');continue;}
   if(asciiOnly(jp)||norm(jp)===norm(expression)){failures.push(b.id+' invalid Japanese gloss '+expression+' => '+jp);continue;}
   const idx=text.indexOf(norm(expression)); if(idx<0){failures.push(b.id+' note not in body '+expression);continue;}
   ranked.push({expression,jp,idx});
 }
 ranked.sort((a,b)=>a.idx-b.idx||a.expression.localeCompare(b.expression));
 const uniq=[];const seen=new Set();for(const x of ranked){const k=norm(x.expression);if(seen.has(k))continue;seen.add(k);uniq.push(x);}
 if(uniq.length<8){failures.push(b.id+' needs >=8 contextual note candidates, got '+uniq.length);continue;}
 const toNote=x=>({expression:x.expression,jp:x.jp});
 const normalNotes=uniq.slice(0,5).map(toNote),easyNotes=uniq.slice(5,8).map(toNote),requiredLocalNotes=uniq.slice(0,3).map(toNote);
 groups[g].push({id:b.id,normalNotes,easyNotes,requiredLocalNotes});
}
for(const g of ['G1','G2','G3']){
 groups[g].sort((a,b)=>a.id.localeCompare(b.id));
 fs.writeFileSync(`V11_FINAL32_${g}_NOTES_NORMAL_EASY.json`,JSON.stringify({batch:'V11-FINAL32',stage:'normal_easy_notes_authoring',registered:false,officialTotal:968,group:g,items:groups[g]},null,2)+'\n');
}
const all=[...groups.G1,...groups.G2,...groups.G3];let blankGloss=0,englishAsJapaneseGloss=0,notInBody=0;
const bodyMap=new Map(bodies.map(x=>[x.id,x]));
for(const it of all)for(const key of ['normalNotes','easyNotes','requiredLocalNotes'])for(const n of it[key]||[]){
 if(!String(n.jp||'').trim())blankGloss++;
 if(asciiOnly(n.jp)||norm(n.jp)===norm(n.expression))englishAsJapaneseGloss++;
 if(!norm(bodyMap.get(it.id).body).includes(norm(n.expression)))notInBody++;
}
const report={generatedAt:new Date().toISOString(),batch:'V11-FINAL32',gate:'NORMAL_EASY_REQUIRED_LOCAL_NOTES_FINAL',registered:false,officialTotal:968,coverage:{G1:groups.G1.length,G2:groups.G2.length,G3:groups.G3.length,total:all.length},requirements:{normalNotesPerPassage:5,easyNotesPerPassage:3,requiredLocalNotesPerPassage:3,vocabChronologyZero:true,blankGloss,englishAsJapaneseGloss,notInBody},failures,finalPass:all.length===32&&groups.G1.length===11&&groups.G2.length===11&&groups.G3.length===10&&failures.length===0&&blankGloss===0&&englishAsJapaneseGloss===0&&notInBody===0};
fs.writeFileSync('V11_FINAL32_NOTES_FINAL_GATE.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2)); if(!report.finalPass)process.exit(2);