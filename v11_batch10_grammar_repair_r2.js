(function repairV11Batch10GrammarR2(){
'use strict';
const ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch10 grammar repair r2 requires 50 passages');
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').trim();
function replaceRow(oldEn,newEn,newJp){let hits=0;for(const p of ps){const i=(p.sentences||[]).findIndex(x=>norm(x)===norm(oldEn));if(i<0)continue;hits++;const oldActual=p.sentences[i],oldJp=p.slashRows[i]&&p.slashRows[i].jp;p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(typeof q.evidence==='string'&&norm(q.evidence)===norm(oldActual)){q.evidence=newEn;q.evidenceJp=newJp;if(typeof q.answer==='string'&&oldJp&&q.answer===oldJp)q.answer=newJp;}}}if(hits!==1)throw Error(`Batch10 grammar r2 row hits=${hits}: ${oldEn}`);}
replaceRow('He rode home slowly. The light let him see the road, and other people saw him too.','He rode home slowly. With the light, he saw the road, and other people saw him too.','彼はゆっくり家へ自転車で帰りました。ライトがあったので道が見え、ほかの人からも彼が見えました。');
replaceRow('Rina checked the other messages. Most had a Friday date.','Rina checked the other messages. Many had a Friday date.','里奈はほかのメッセージを確認しました。多くには金曜日の日付がありました。');
for(const p of ps){p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');p.wordCount=((p.sentences||[]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.grammarChronologyRepairR2='20260829-r2';}
window.V11_BATCH10_GRAMMAR_REPAIR_R2_STATE={version:'20260829-r2',passages:ps.length,replacements:2,registered:false};
})();
