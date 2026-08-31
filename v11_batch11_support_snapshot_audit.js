'use strict';
const fs=require('fs'),vm=require('vm');
global.window=global;
const chain=['v11_batch11_passages_draft_g1.js','v11_batch11_passages_draft_g2.js','v11_batch11_g3_core.js','v11_batch11_passages_draft_g3_standard.js','v11_batch11_passages_draft_g3_long.js','v11_batch11_passages_draft_g3_yamaguchi_a.js','v11_batch11_passages_draft_g3_yamaguchi_b.js','v11_batch11_length_repair_r1.js','v11_batch11_length_repair_r2.js','v11_batch11_length_repair_r3.js','v11_batch11_length_repair_r4.js','v11_batch11_grammar_repair_r1.js','v11_batch11_grammar_repair_r2.js','v11_batch11_semantic_repair_r5.js','v11_batch11_semantic_repair_r6.js','v11_batch11_question_human_rewrite_r1.js','v11_batch11_question_human_rewrite_r2.js','v11_batch11_question_human_rewrite_r3.js','v11_batch11_question_human_rewrite_r4.js','v11_batch11_question_human_rewrite_r5.js','v11_batch11_question_human_rewrite_r6.js','v11_batch11_question_human_rewrite_r7.js','v11_batch11_question_human_rewrite_r8.js','v11_batch11_question_human_rewrite_r9.js','v11_batch11_question_human_rewrite_r10.js','v11_batch11_question_human_rewrite_r11.js','v11_batch11_question_human_rewrite_r12.js','v11_batch11_question_human_rewrite_r13.js','v11_batch11_question_human_rewrite_r14.js','v11_batch10_prior_verified_gloss.js','v11_batch10_manual_gloss_r1.js','v11_batch11_manual_gloss_r1.js','v11_batch11_verified_gloss_reuse.js'];
function run(f){vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});}
for(const f of chain)run(f);
const ps=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('expected 50 passages, got '+ps.length);
const ids=ps.map(p=>p&&p.id);const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];if(dup.length)throw Error('duplicate ids '+JSON.stringify(dup));
let thrown=null;try{run('v11_batch11_easy_support_r1.js')}catch(e){thrown=String(e&&e.stack||e)}
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
const stop=new Set(['i','a','an','the','am','is','are','was','were','be','been','being','do','does','did','can','could','will','would','should','must','may','might','have','has','had','to','of','in','on','at','for','from','by','with','and','but','or','so','if','that','this','these','those','it','he','she','we','they','you','my','your','his','her','our','their','me','him','us','them','not','no','yes','too','very']);
function freeWords(p){const req=new Set((p.notes||[]).map(n=>norm(n&&n.english)));const words=(String((p.sentences||[]).join(' ')).replace(/[’‘]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).map(norm);return [...new Set(words.filter(w=>!stop.has(w)&&!req.has(w)))];}
const rows=ps.map((p,i)=>({index:i+1,id:p.id,support:Array.isArray(p.supportNotes)?p.supportNotes.length:0,notes:Array.isArray(p.notes)?p.notes.length:0,title:p.title||'',freeWords:(!Array.isArray(p.supportNotes)||!p.supportNotes.length)?freeWords(p):undefined}));
const empty=rows.filter(x=>!x.support);
const snapshot=typeof window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS==='function'?window.V11_GET_BATCH11_VERIFIED_SUPPORT_SNAPSHOTS():[];
const out={passages:ps.length,uniqueIds:new Set(ids).size,thrown,generatedSupport:rows.filter(x=>x.support).length,empty,snapshotCount:snapshot.length,state:window.V11_BATCH11_EASY_SUPPORT_STATE||null};
fs.writeFileSync('V11_BATCH11_SUPPORT_SNAPSHOT_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
if(thrown||empty.length||snapshot.length!==50)process.exitCode=1;
