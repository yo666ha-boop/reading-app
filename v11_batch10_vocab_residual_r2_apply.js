(function applyV11Batch10ResidualVocabR2(){
'use strict';
const ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch10 residual vocab r2 requires 50 passages');
const byId={
'V11-B10-G1-005':['check','caused','rule'],
'V11-B10-G1-008':['continue','explain'],
'V11-B10-G1-009':['added','cause','foods','wasted'],
'V11-B10-G1-010':['ride','rule','solve','yet'],
'V11-B10-G1-012':['mark',"pair's",'find'],
'V11-B10-G1-013':['described','thought'],
'V11-B10-G1-014':['thought'],
'V11-B10-G1-015':['clear','yet'],
'V11-B10-G1-016':['actual','chose','explained','person','rule'],
'V11-B10-G1-017':['sang','start','unclear','became','kept','trouble'],
'V11-B10-G2-001':['caused'],
'V11-B10-G2-002':['person'],
'V11-B10-G2-010':['stood'],
'V11-B10-G2-015':['forgot'],
'V11-B10-G2-016':['overlook','reveal','tests'],
'V11-B10-G2-017':['helpers']
};
const gloss={actual:'実際の',added:'加えた',became:'～になった',cause:'引き起こす・原因となる',caused:'引き起こした',check:'確認する',chose:'選んだ',clear:'はっきりした',continue:'続ける',described:'説明した',explain:'説明する',explained:'説明した',find:'見つける',foods:'食べ物（複数）',forgot:'忘れた',helpers:'手伝う人たち',kept:'保った・残した',mark:'印',overlook:'見落とす',"pair's":'ペアの',person:'人',reveal:'明らかにする',ride:'乗る',rule:'ルール・決まり',sang:'歌った',solve:'解決する',start:'始める',stood:'立っていた',tests:'テスト（複数）',thought:'考えた',trouble:'困難・問題',unclear:'はっきりしない',wasted:'無駄にした',yet:'まだ'};
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
let added=0;
for(const p of ps){const need=byId[p.id]||[];p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.filter(Boolean).map(n=>norm(n.english)));for(const w of need){if(have.has(w))continue;const j=gloss[w];if(!j)throw Error('missing formal gloss '+w);p.notes.push({english:w,japanese:j,kind:'unlearned_local_required',source:'v11 Batch10 post-grammar exact chronology residual r2; verified Japanese gloss'});have.add(w);added++;}}
window.V11_BATCH10_VOCAB_RESIDUAL_R2_STATE={version:'20260829-r2',passages:ps.length,distinctWords:Object.keys(gloss).length,notesAdded:added,registered:false};
})();
