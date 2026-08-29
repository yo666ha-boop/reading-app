(function repairV11Batch08G3Length(){
'use strict';
const ps=(typeof window!=='undefined'&&window.V11_BATCH08_G3_DRAFTS)||[];
const p=ps.find(x=>x.id==='V11-B08-G3-015');
if(!p) throw new Error('V11-B08-G3-015 not found');
const en='The weekday survey also missed parents who usually shopped after the class had already left the area.';
const jp='平日の調査では、クラスがその場所を離れた後に買い物をする保護者も含まれていませんでした。';
if(!p.sentences.includes(en)){
  const pos=Math.max(0,p.sentences.length-1);
  p.sentences.splice(pos,0,en);
  p.slashRows.splice(pos,0,{en,jp});
}
p.fullTranslation=p.slashRows.map(r=>r.jp).join('');
p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
p.lengthRepair={version:'20260829',reason:'preserve LONG 240-330 band without filler',storySpecific:true};
window.V11_BATCH08_G3_LENGTH_REPAIR_STATE={repairedId:p.id,wordCount:p.wordCount,registered:false};
})(typeof window!=='undefined'?window:this);
