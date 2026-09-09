const fs=require('fs');
const a=JSON.parse(fs.readFileSync('v11_batch14_assembled_draft.json','utf8'));
const map=new Map(a.passages.map(p=>[p.id,p]));
const specs={
'V11-B14-G3-004':['v11_batch14_g3_004_005_questions_r16_20260908.json'],
'V11-B14-G3-005':['v11_batch14_g3_004_005_questions_r16_20260908.json'],
'V11-B14-G3-006':['v11_batch14_g3_006_questions_r17_20260908.json'],
'V11-B14-G3-007':['v11_batch14_g3_007_questionsA_r18_20260908.json','v11_batch14_g3_007_questionsB_r18_20260908.json'],
'V11-B14-G3-008':['v11_batch14_g3_008_questionsA_r19_20260908.json','v11_batch14_g3_008_questionsB_r19_20260908.json'],
'V11-B14-G3-009':['v11_batch14_g3_009_questionsA_r20_20260908.json','v11_batch14_g3_009_questionsB_r20_20260908.json'],
'V11-B14-G3-010':['v11_batch14_g3_010_questionsA_r21_20260908.json','v11_batch14_g3_010_questionsB_r22_20260908.json'],
'V11-B14-G3-011':['v11_batch14_g3_011_questions_r23_20260909.json'],
'V11-B14-G3-012':['v11_batch14_g3_012_questions_r24_20260909.json'],
'V11-B14-G3-013':['v11_batch14_g3_013_questionsA_r23_20260909.json','v11_batch14_g3_013_questionsB_r23_20260909.json'],
'V11-B14-G3-014':['v11_batch14_g3_014_questionsA_r24_20260909.json','v11_batch14_g3_014_questionsB_r24_20260909.json'],
'V11-B14-G3-015':['v11_batch14_g3_015_questionsA_part1_r25_20260909.json','v11_batch14_g3_015_questionsA_part2_r25_20260909.json','v11_batch14_g3_015_questionsB_part1_r25_20260909.json','v11_batch14_g3_015_questionsB_part2_r25_20260909.json'],
'V11-B14-G3-016':['v11_batch14_g3_016_questionsA_r26_20260909.json','v11_batch14_g3_016_questionsB_part1_r26_20260909.json','v11_batch14_g3_016_questionsB_part2_r26_20260909.json']
};
function arraysForId(x,id){
 if(Array.isArray(x)) return [x];
 if(!x||typeof x!=='object') return [];
 if(x.questionRewrites&&x.questionRewrites[id]){
   const q=x.questionRewrites[id];
   return [q.A,q.B].filter(Array.isArray);
 }
 const ab=[x.A,x.B].filter(Array.isArray);
 if(ab.length) return ab;
 return Object.values(x).filter(Array.isArray);
}
for(const [id,files] of Object.entries(specs)){
 let qs=[];
 for(const f of files){
   const x=JSON.parse(fs.readFileSync(f,'utf8'));
   for(const ar of arraysForId(x,id)){
     qs.push(...ar.filter(q=>q&&typeof q==='object'&&('answer'in q||'evidence'in q)));
   }
 }
 const p=map.get(id);
 if(!p) throw Error('missing '+id);
 const uniq=[]; const seen=new Set();
 for(const q of qs){const k=JSON.stringify(q);if(!seen.has(k)){seen.add(k);uniq.push(q)}}
 if(uniq.length!==10) throw Error(id+' questions='+uniq.length);
 p.questions=uniq.slice(0,5);
 p.questionSetB=uniq.slice(5);
}
fs.writeFileSync('v11_batch14_assembled_draft.json',JSON.stringify(a,null,2)+'\n');
console.log('integrated',Object.keys(specs).length,'G3 passages with ID-local extraction');
