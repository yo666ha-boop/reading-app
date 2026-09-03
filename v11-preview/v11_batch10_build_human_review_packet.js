'use strict';
const fs=require('fs'),vm=require('vm');
const files=['v11_batch10_passages_draft_g1.js','v11_batch10_passages_draft_g2.js','v11_batch10_passages_draft_g3.js','v11_batch10_length_repair_r1.js','v11_batch10_grammar_repair_r1.js','v11_batch10_grammar_repair_r2.js','v11_batch10_length_repair_r2.js','v11_batch10_question_human_rewrite.js'];
const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
const ps=[...(sandbox.window.V11_BATCH10_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH10_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH10_G3_DRAFTS||[])];if(ps.length!==50)throw Error('need 50 passages');
let out='# V11 Batch10 Human Review Packet\n\nFinal review stack: drafts → length r1 → grammar r1/r2 → length r2 → human question rewrite. registered=false.\n\n';
for(const p of ps){out+=`## ${p.id} | G${p.grade} | ${p.level} | ${p.textbook} ${p.section}\nTitle: ${p.title}\nWordCount: ${p.wordCount}\n`;
 if(p.materialData)out+=`MaterialData: ${JSON.stringify(p.materialData)}\n`;
 out+='### Body / Translation\n';(p.slashRows||[]).forEach((r,i)=>{out+=`${i+1}. EN: ${r.en}\n   JP: ${r.jp}\n`;});
 out+='### Questions A\n';(p.questions||[]).forEach((q,i)=>{out+=`A${i+1} [${q.questionType}] ${q.prompt}\n   Ans: ${q.answer}\n   Ev: ${q.evidence}\n   EvJP: ${q.evidenceJp}\n   Why: ${q.reason}\n`;});
 out+='### Questions B\n';(p.questionSetB||[]).forEach((q,i)=>{out+=`B${i+1} [${q.questionType}] ${q.prompt}\n   Ans: ${q.answer}\n   Ev: ${q.evidence}\n   EvJP: ${q.evidenceJp}\n   Why: ${q.reason}\n`;if(q.scoring)out+=`   Scoring: ${JSON.stringify(q.scoring)}\n`;});
 out+='\n';
}
fs.writeFileSync('V11_BATCH10_HUMAN_REVIEW_PACKET.md',out);console.log(`packet passages=${ps.length} bytes=${Buffer.byteLength(out)} lines=${out.split(/\n/).length}`);
