'use strict';
const fs=require('fs'),vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
function extractGloss(file){
  const src=fs.readFileSync(file,'utf8');
  const m=src.match(/const gloss=({[\s\S]*?});\nconst ps=/);
  if(!m) throw new Error('gloss object not found in '+file);
  return vm.runInNewContext('('+m[1]+')');
}
const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
for(const f of ['v11_batch06_passages_draft_g1.js','v11_batch06_passages_draft_g2.js','v11_batch06_passages_draft_g3.js','v11_batch06_draft_repairs.js','v11_batch06_grammar_repair.js','v11_batch06_chronology_repair.js'])run(s,f);
const ps=[...(s.window.V11_BATCH06_G1_PASSAGES||[]),...(s.window.V11_BATCH06_G2_PASSAGES||[]),...(s.window.V11_BATCH06_G3_PASSAGES||[])];
if(ps.length!==50)throw new Error('Batch06 passage count '+ps.length);
const canonical={...extractGloss('v11_batch05_notes_finalize.js'),...extractGloss('v11_batch05_notes_finalize_pre.js')};
const placeholders=[],resolvable=[],unresolved=[];
for(const p of ps)for(const n of(p.notes||[])){
  if(!n||!n.english||!String(n.japanese||'').includes('最終注整理対象'))continue;
  const key=String(n.english).replace(/[’]/g,"'").toLowerCase();
  const row={id:p.id,english:n.english,key};placeholders.push(row);
  if(canonical[key])resolvable.push({...row,japanese:canonical[key]});else unresolved.push(row);
}
const uniq=a=>[...new Map(a.map(x=>[x.key,x])).values()];
const out={generatedAt:new Date().toISOString(),passages:ps.length,placeholderOccurrences:placeholders.length,resolvableOccurrences:resolvable.length,unresolvedOccurrences:unresolved.length,placeholderDistinct:uniq(placeholders).length,resolvableDistinct:uniq(resolvable).length,unresolvedDistinct:uniq(unresolved).length,unresolvedWords:uniq(unresolved).map(x=>x.key).sort(),pass:unresolved.length===0};
fs.writeFileSync('V11_BATCH06_NOTE_GAP_AUDIT.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(unresolved.length)process.exitCode=2;
