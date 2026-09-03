(function repairV11Batch08GrammarR3(){
'use strict';
const ps=[...(window.V11_BATCH08_G1_DRAFTS||[]),...(window.V11_BATCH08_G2_DRAFTS||[]),...(window.V11_BATCH08_G3_DRAFTS||[])];
const oldEn='The club learned this lesson: people must actually see the information for a notice to be useful.';
const newEn='The club learned this lesson: a clear notice needs real readers.';
const newJp='掲示は、実際に読む人がいて初めて役立つと部は学びました。';
let hits=0;for(const p of ps){const i=p.sentences.indexOf(oldEn);if(i<0)continue;hits++;const oldJp=p.slashRows[i].jp;p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(q.evidence===oldEn){q.evidence=newEn;q.evidenceJp=newJp;}if(q.answer===oldJp)q.answer=newJp;}p.fullTranslation=p.slashRows.map(r=>r.jp).join('');p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.grammarChronologyRepair='20260829-r3';}
if(hits!==1)throw Error('Batch08 grammar r3 hit count '+hits);window.V11_BATCH08_GRAMMAR_REPAIR_R3_STATE={hits,registered:false};
})();
