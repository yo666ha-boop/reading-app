'use strict';
const fs=require('fs');
global.window={};
require('./v11_batch10_passages_draft_g1.js');
require('./v11_batch10_passages_draft_g2.js');
require('./v11_batch10_passages_draft_g3.js');
require('./v11_batch10_length_repair_r1.js');
require('./v11_batch10_grammar_repair_r1.js');
require('./v11_batch10_grammar_repair_r2.js');
require('./v11_batch10_length_repair_r2.js');
require('./v11_batch10_human_semantic_review_r1.js');
require('./v11_batch10_question_human_rewrite.js');
require('./v11_batch10_question_human_rewrite_r2.js');
const plan=JSON.parse(fs.readFileSync('v11_batch10_authoring_plan.json','utf8'));
const groups=[window.V11_BATCH10_G1_DRAFTS,window.V11_BATCH10_G2_DRAFTS,window.V11_BATCH10_G3_DRAFTS];
const ps=groups.flatMap(x=>Array.isArray(x)?x:[]);
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);}
const failures=[],ids=new Set(),titles=new Set(),bodies=new Set(),sentenceSeen=new Map();
if(groups[0].length!==17)failures.push(['B10','G1 count '+groups[0].length]);if(groups[1].length!==17)failures.push(['B10','G2 count '+groups[1].length]);if(groups[2].length!==16)failures.push(['B10','G3 count '+groups[2].length]);if(ps.length!==50)failures.push(['B10','total '+ps.length]);
for(const p of ps){
 if(ids.has(p.id))failures.push([p.id,'duplicate id']);ids.add(p.id);if(titles.has(p.title))failures.push([p.id,'duplicate title']);titles.add(p.title);const body=(p.sentences||[]).join(' ');if(bodies.has(body))failures.push([p.id,'duplicate body']);bodies.add(body);
 const planRow=(plan.passages||[]).find(x=>x.id===p.id);if(!planRow||planRow.title!==p.title)failures.push([p.id,'plan mismatch']);if(p.registered!==false)failures.push([p.id,'must remain unregistered']);
 if(p.semanticReview!=='BATCH10_HUMAN_REVIEW_20260829')failures.push([p.id,'human semantic review marker missing']);if(p.questionStage!=='BATCH10_HUMAN_REWRITE_R2')failures.push([p.id,'question r2 missing']);
 if(!Array.isArray(p.sentences)||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)failures.push([p.id,'sentence/slash row mismatch']);if(String(p.fullTranslation||'')!==(p.slashRows||[]).map(x=>x&&x.jp||'').join(''))failures.push([p.id,'fullTranslation mismatch']);if((p.slashRows||[]).some((r,i)=>!r||r.en!==p.sentences[i]||!r.jp))failures.push([p.id,'slash alignment']);
 const wc=words(body).length;if(wc!==p.wordCount)failures.push([p.id,'wordCount field '+p.wordCount+' actual '+wc]);const band=p.targetWordBand||[];if(wc<(band[0]||0)||wc>(band[1]||Infinity))failures.push([p.id,'word band '+wc+' not '+JSON.stringify(band)]);
 const min=p.grade==='1'?9:p.grade==='2'?11:p.level==='STANDARD'?12:p.level==='LONG'?18:24;if(p.sentences.length<min)failures.push([p.id,'sentence count '+p.sentences.length+' < '+min]);if(p.level==='YAMAGUCHI_EXAM'&&!p.materialData)failures.push([p.id,'materialData missing']);
 if((p.sentences||[]).some(s=>/[ぁ-んァ-ヶ一-龠]/.test(s)))failures.push([p.id,'Japanese in English sentence']);if((p.slashRows||[]).some(r=>/�/.test(String(r.en)+String(r.jp))))failures.push([p.id,'replacement character']);if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)failures.push([p.id,'A/B question count']);
 for(const s of (p.sentences||[])){const key=s.trim().toLowerCase();if(sentenceSeen.has(key))failures.push([p.id,'exact sentence reused from '+sentenceSeen.get(key)]);else sentenceSeen.set(key,p.id);}
}
const profiles={g1:groups[0].map(p=>p.wordCount),g2:groups[1].map(p=>p.wordCount),g3:groups[2].map(p=>({id:p.id,level:p.level,w:p.wordCount,n:p.sentences.length}))};const out={batch:'V11-B10',registered:false,passages:ps.length,humanSemanticReview:ps.filter(p=>p.semanticReview==='BATCH10_HUMAN_REVIEW_20260829').length,questionR2:ps.filter(p=>p.questionStage==='BATCH10_HUMAN_REWRITE_R2').length,g1:groups[0].length,g2:groups[1].length,g3:groups[2].length,uniqueIds:ids.size,uniqueTitles:titles.size,uniqueBodies:bodies.size,failures,profiles,pass:failures.length===0};fs.writeFileSync('V11_BATCH10_AUTHORING_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(failures.length)process.exitCode=1;else console.log('V11_BATCH10_AUTHORING_PASS');
