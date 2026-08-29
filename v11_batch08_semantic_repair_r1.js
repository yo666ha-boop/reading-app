(function repairV11Batch08SemanticR1(){'use strict';
const ps=[...(window.V11_BATCH08_G1_DRAFTS||[]),...(window.V11_BATCH08_G2_DRAFTS||[]),...(window.V11_BATCH08_G3_DRAFTS||[])];
function replaceJp(id,en,newJp){const p=ps.find(x=>x.id===id);if(!p)throw Error('missing '+id);const row=(p.slashRows||[]).find(r=>r.en===en);if(!row)throw Error('missing sentence '+id);const old=row.jp;row.jp=newJp;p.fullTranslation=(p.slashRows||[]).map(r=>r.jp).join('');for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){if(q.evidence===en&&q.evidenceJp===old)q.evidenceJp=newJp;if(q.answer===old)q.answer=newJp;}return {id,en,old,newJp};}
const changes=[];
changes.push(replaceJp('V11-B08-G1-007','She went to another classroom for two lessons.','結菜は二時間の授業の間、別の教室へ行きました。'));
changes.push(replaceJp('V11-B08-G1-007','After two lessons, the water was much cooler.','二時間の授業の後、水はずっと冷たいままでした。'));
window.V11_BATCH08_SEMANTIC_REPAIR_R1={version:'20260829',reviewedRange:'G1 001-017',reviewedPassages:17,changes,registered:false};
})(typeof window!=='undefined'?window:this);
