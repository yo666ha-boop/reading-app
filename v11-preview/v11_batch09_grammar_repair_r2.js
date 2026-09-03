(function repairV11Batch09GrammarR2(){
'use strict';
const ps=[...(window.V11_BATCH09_G1_DRAFTS||[]),...(window.V11_BATCH09_G2_DRAFTS||[]),...(window.V11_BATCH09_G3_DRAFTS||[])];
const norm=s=>String(s||'').replace(/[’‘]/g,"'").trim();
function rep(oldEn,newEn,newJp){let hits=0;for(const p of ps){const i=(p.sentences||[]).findIndex(x=>norm(x)===norm(oldEn));if(i<0)continue;hits++;const oldJp=p.slashRows[i].jp;p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(norm(q.evidence)===norm(oldEn)){q.evidence=newEn;q.evidenceJp=newJp;if(q.answer===oldJp)q.answer=newJp;}}p.fullTranslation=p.slashRows.map(r=>r.jp).join('');p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}if(hits!==1)throw Error(`hits=${hits} ${oldEn}`);}
rep('They learned that picture details can show time order clearly. Color alone may not show the order.','They learned that picture details can show time order clearly. Color alone sometimes does not show the order.','写真の細部は時間の順序をはっきり示せます。色だけでは順序が分からないこともあると学びました。');
rep('Students used the page during a weekend visit in July.','Students visited the center on a weekend in July and used the page.','7月の週末に生徒たちはセンターを訪れ、そのページを使いました。');
window.V11_BATCH09_GRAMMAR_REPAIR_R2={version:'20260829-r2',registered:false};
})();