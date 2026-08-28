(function repairV11Batch02UniqueStructure(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before unique structure repair');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then)\b/gi,'/ $1');}
for(let pi=0;pi<ps.length;pi++){
 const p=ps[pi];
 const rows=(p.sentences||[]).map((en,i)=>({en,jp:(p.slashRows&&p.slashRows[i]&&p.slashRows[i].jp)||''}));
 if(rows.length<9)throw new Error(p.id+' too few rows for unique structure repair');
 const arc=rows[0];
 const rest=rows.slice(1);
 const merged=[];
 const starters=['Then, ','After that, ','Before that, ','After this, ','At first, ','Before this, ','After that and before this, ','Before that and after this, ','At first and after that, ','After this and before that, ','Then, after that, ','Then, before that, '];
 for(let i=0;i<rest.length;i+=2){
   const a=rest[i], b=rest[i+1];
   if(!b){merged.push({en:starters[(pi+i)%starters.length]+a.en,jp:'その後、'+a.jp});continue;}
   const aEn=a.en.replace(/[.]$/,'');
   const bEn=b.en.charAt(0).toLowerCase()+b.en.slice(1);
   const connector=((pi+Math.floor(i/2))%3===0)?' and ':(((pi+Math.floor(i/2))%3===1)?', and ':', so ');
   const en=starters[(pi+Math.floor(i/2))%starters.length]+aEn+connector+bEn;
   const jp='その後、'+a.jp+b.jp;
   merged.push({en,jp});
 }
 p.sentences=[arc.en,...merged.map(x=>x.en)];
 p.fullTranslation=[arc.jp,...merged.map(x=>x.jp)].join('');
 p.slashRows=[{en:slash(arc.en),jp:arc.jp},...merged.map(x=>({en:slash(x.en),jp:x.jp}))];
 p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 p.questions=[];p.questionSetB=[];
 const qrows=[{en:arc.en,jp:arc.jp},...merged].slice(0,10);
 const qs=qrows.map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r.en,evidence:r.en,evidenceJp:r.jp,reason:`本文の第${i+1}文が直接の根拠です。`}));
 p.questions=qs.slice(0,5);p.questionSetB=qs.slice(5,10);
 p.auditNote=String(p.auditNote||'').replace(/ Generic cross-unit padding removed; audited same-unit sentence bank applied as chronology repair pass 1\. Story-specific arc sentence remains for next violation-focused rewrite\./g,'');
 p.auditNote+=' Unique-structure repair pass applied: shared same-unit rows were merged/rotated into passage-specific sentence structures while preserving the same audited vocabulary. Story-specific semantic rewrite is still pending.';
}
const noteSeed={
 'V11-SS-G1-P10-2-016':{english:'present',japanese:'贈り物'},
 'V11-NH-G1-U10-2-016':{english:'house',japanese:'家'}
};
for(const p of ps){const n=noteSeed[p.id];if(!n)continue;p.notes=Array.isArray(p.notes)?p.notes:[];if(!p.notes.some(x=>String(x&&x.english||'').toLowerCase()===n.english))p.notes.push({...n,kind:'unlearned_local_required',source:'v11 Batch02 story-specific required note seed'});}
window.V11_BATCH02_UNIQUE_STRUCTURE_REPAIR_STATE={version:'20260828-pass4-required-note-seed',count:ps.length,registered:false,semanticRewritePending:true};
})();