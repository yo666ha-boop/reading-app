const fs=require('fs');
const src=require('./v11_batch12_slash_question_scaffold.json');
if(src.registered!==false||src.passages.length!==50) throw new Error('Batch12 scaffold must remain unregistered with 50 passages');
const passages=src.passages.map(p=>({
  id:p.id,
  title:p.title,
  body:p.body,
  fullTranslation:p.fullTranslation,
  groupedRows:(p.slashRows||[]).filter(r=>r.humanReview==='PENDING_GROUP_BOUNDARY')
})).filter(p=>p.groupedRows.length);
const out={
  status:'HUMAN_GROUPED_SLASH_REVIEW_REQUIRED',
  registered:false,
  passageCount:passages.length,
  rowCount:passages.reduce((n,p)=>n+p.groupedRows.length,0),
  passages
};
if(out.passageCount!==22) throw new Error(`expected 22 grouped passages, got ${out.passageCount}`);
fs.writeFileSync('v11_batch12_grouped_slash_review_packet.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({passageCount:out.passageCount,rowCount:out.rowCount,registered:false},null,2));