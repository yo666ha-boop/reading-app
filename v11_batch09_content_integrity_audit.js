'use strict';
const fs=require('fs'),vm=require('vm');
const files=['v11_batch09_passages_draft_g1.js','v11_batch09_g1_length_repair.js','v11_batch09_passages_draft_g2.js','v11_batch09_passages_draft_g3.js','v11_batch09_g3_length_repair.js','v11_batch09_grammar_repair.js','v11_batch09_grammar_repair_r2.js','v11_batch09_verified_gloss_base.js','v11_batch09_manual_gloss_a_h.js','v11_batch09_manual_gloss_i_r.js','v11_batch09_vocab_repair.js','v11_batch09_gloss_apply.js','v11_batch09_vocab_repair_r2.js','v11_batch09_prior_final_gloss.js','v11_batch09_manual_gloss_residual_r3.js','v11_batch09_gloss_apply_r2.js','v11_batch09_chronology_residual_notes_r3.js','v11_batch09_semantic_repair_g1_r1.js','v11_batch09_semantic_repair_g2_r1.js','v11_batch09_semantic_repair_g3_r1.js'];
const s={window:{},console};s.globalThis=s.window;vm.createContext(s);for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});
const ps=[...(s.window.V11_BATCH09_G1_DRAFTS||[]),...(s.window.V11_BATCH09_G2_DRAFTS||[]),...(s.window.V11_BATCH09_G3_DRAFTS||[])];
const fail=[],rows=[];const wc=x=>(String(x||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
function bad(id,gate,detail){fail.push({id,gate,detail});}
for(const p of ps){
 if(!p.semanticRewrite||!p.semanticRewrite.humanRead||!p.semanticRewrite.fullPassageReread)bad(p.id,'semantic_review','missing human-read semantic marker');
 if(!Array.isArray(p.sentences)||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)bad(p.id,'slash_shape','sentence/slash length mismatch');
 else for(let i=0;i<p.sentences.length;i++)if(p.sentences[i]!==p.slashRows[i].en)bad(p.id,'slash_en',`row ${i+1} English mismatch`);
 const rebuilt=(p.slashRows||[]).map(r=>String(r&&r.jp||'')).join('');if(String(p.fullTranslation||'')!==rebuilt)bad(p.id,'full_translation','fullTranslation != slash JP join');
 const actual=wc((p.sentences||[]).join(' '));if(actual!==Number(p.wordCount))bad(p.id,'word_count',`stored ${p.wordCount} actual ${actual}`);
 const band=p.targetWordBand||[];if(band.length===2&&(actual<band[0]||actual>band[1]))bad(p.id,'word_band',`${actual} outside ${band[0]}-${band[1]}`);
 for(const [name,qs] of [['A',p.questions],['B',p.questionSetB]]){
   if(!Array.isArray(qs)||qs.length!==5){bad(p.id,`${name}_count`,String(qs&&qs.length));continue;}
   qs.forEach((q,i)=>{if(!q||!String(q.prompt||'').trim())bad(p.id,`${name}_prompt`,String(i+1));if(!String(q.answer||'').trim())bad(p.id,`${name}_answer`,String(i+1));if(!String(q.evidence||'').trim())bad(p.id,`${name}_evidence`,String(i+1));if(!String(q.evidenceJp||'').trim())bad(p.id,`${name}_evidenceJp`,String(i+1));if(!String(q.reason||'').trim())bad(p.id,`${name}_reason`,String(i+1));
     if(q.questionType!=='FREE_WRITE_20_30'){
       const k=(p.sentences||[]).indexOf(q.evidence);if(k<0)bad(p.id,`${name}_evidence_source`,`${i+1}:${q.evidence}`);else if(String(p.slashRows[k].jp)!==String(q.evidenceJp))bad(p.id,`${name}_evidence_sync`,`${i+1}: row ${k+1}`);
     } else {const n=wc(q.answer);if(n<20||n>30)bad(p.id,'free_write_length',`${n} words`);}
   });
 }
 const types=new Set([...(p.questions||[]),...(p.questionSetB||[])].map(q=>q&&q.questionType));if(types.size<4)bad(p.id,'question_diversity',`${types.size} types`);
 if(p.level==='YAMAGUCHI_EXAM'&&!p.materialData)bad(p.id,'material','Yamaguchi item missing materialData');
 for(const n of (p.notes||[])){if(n&&n.kind==='unlearned_local_required'){const j=String(n.japanese||'').trim();if(!j||j.toLowerCase()===String(n.english||'').toLowerCase()||/placeholder|temporary|最終注整理対象/i.test(j))bad(p.id,'required_local_gloss',`${n.english}=${j}`);}}
 rows.push({id:p.id,grade:p.grade,wordCount:actual,semantic:!!p.semanticRewrite,a:(p.questions||[]).length,b:(p.questionSetB||[]).length,types:types.size});
}
const out={generatedAt:new Date().toISOString(),passages:ps.length,semanticComplete:ps.filter(p=>p.semanticRewrite&&p.semanticRewrite.humanRead).length,failures:fail.length,finalPass:ps.length===50&&fail.length===0,fail,rows};fs.writeFileSync('V11_BATCH09_CONTENT_INTEGRITY_REPORT.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('V11_BATCH09_CONTENT_INTEGRITY_STATUS.txt',[`passages=${ps.length}/50`,`semantic_complete=${out.semanticComplete}/50`,`failures=${fail.length}`,`final=${out.finalPass?'PASS':'FAIL'}`].join('\n')+'\n');console.log(fs.readFileSync('V11_BATCH09_CONTENT_INTEGRITY_STATUS.txt','utf8'));if(!out.finalPass)process.exitCode=1;
