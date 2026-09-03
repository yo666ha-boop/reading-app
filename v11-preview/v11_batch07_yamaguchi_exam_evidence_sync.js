(function syncV11Batch07YamaguchiEvidenceJapanese(){
'use strict';
const ps=window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[];
let questions=0, synced=0, missing=[];
for(const p of ps){
  const enToJp=new Map((p.slashRows||[]).map(r=>[r.en,r.jp]));
  const all=[...(p.questions||[]),...(p.questionSetB||[])];
  for(const item of all){
    questions++;
    const ev=Array.isArray(item.evidence)?item.evidence:[item.evidence];
    if(ev.filter(Boolean).every(x=>enToJp.has(x))){
      const exact=ev.map(x=>enToJp.get(x));
      item.evidenceJp=Array.isArray(item.evidence)?exact:exact[0];
      synced++;
    } else {
      const absent=ev.filter(Boolean).filter(x=>!enToJp.has(x));
      if(absent.length) missing.push({passageId:p.id,questionType:item.questionType,evidence:absent});
    }
  }
}
window.V11_BATCH07_YAMAGUCHI_EVIDENCE_SYNC_STATE={version:'20260829',passages:ps.length,questions,synced,missing};
})();
