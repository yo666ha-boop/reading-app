(function(){'use strict';
const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
if(all.length!==50)throw Error('Batch11 passages missing');
const jpFor=(p,en)=>{const r=(p.slashRows||[]).find(x=>x.en===en);if(!r)throw Error('JP evidence missing '+p.id+' '+en);return r.jp;};
const clip=s=>{const x=String(s||'').replace(/[“”"']/g,'').replace(/\s+/g,' ').trim();return x.length>68?x.slice(0,65)+'…':x;};
const causeRe=/\b(because|therefore|so|since|reason|meant|required|needed|could not|couldn't|failed|instead|rather than|in order to|so that|without|only when|enough|less than|more than)\b/i;
const resultRe=/\b(after|afterward|then|finally|result|returned|reached|changed|added|found|showed|ended|stayed|became|completed|arrived|sent|received)\b/i;
function pick(s,re,fallback,used){
  const candidates=[];
  for(const raw of fallback){const k=Math.max(0,Math.min(s.length-1,raw));if(!candidates.includes(k))candidates.push(k);}
  for(const k of candidates){if(!used.has(k)&&re.test(s[k]))return k;}
  for(const k of candidates){if(!used.has(k))return k;}
  for(let i=0;i<Math.max(0,s.length-1);i++){if(!used.has(i)&&re.test(s[i]))return i;}
  for(let i=0;i<Math.max(0,s.length-1);i++){if(!used.has(i))return i;}
  for(let i=0;i<s.length;i++)if(!used.has(i))return i;
  return Math.max(0,s.length-1);
}
function make(p,type,en,variant){const jp=jpFor(p,en),frag=clip(en),title=p.title;let prompt,reason;
switch(type){
case 'GIST': prompt=`「${title}」を最後まで読むと、中心となる学び・結論は何ですか。`; reason='結末で示された学びが、それまでの出来事や判断をまとめているためです。'; break;
case 'DETAIL': prompt=variant===2?`「${title}」の後半で、「${frag}」に関して本文が具体的に述べていることを答えなさい。`:`「${title}」で、「${frag}」に関して本文が具体的に述べている事実を答えなさい。`; reason='本文に直接書かれた具体的事実を、そのまま根拠として確認できます。'; break;
case 'REASON': prompt=`「${title}」で判断や行動の理由を考えるとき、「${frag}」を含む文から確認できる理由・条件は何ですか。`; reason='この文には、判断や行動を必要にした理由・条件につながる情報が明示されています。'; break;
case 'CONTENT_MATCH': prompt=`「${title}」の内容と一致する説明として、「${frag}」に関する本文の事実を答えなさい。`; reason='本文の記述と一致する内容だけを答えるため、根拠が一つに定まります。'; break;
case 'RESULT': prompt=`「${title}」で出来事が進んだ結果、「${frag}」を含む箇所では何が起きた・分かったと述べていますか。`; reason='行動や確認の後に生じた結果を本文中の記述から直接確認できます。'; break;
case 'SUMMARY_FILL': prompt=`「${title}」の要約の空所【　】に入れる重要内容として、「${frag}」を含む本文の一文に当たる内容を答えなさい。`; reason='前後の流れを保つうえで必要な重要内容を本文から選ぶ問題です。'; break;
case 'EVIDENCE': prompt=`「${title}」で判断の手がかり・証拠として使える内容を、「${frag}」を含む箇所から答えなさい。`; reason='判断を支える具体的な本文記述がそのまま証拠になります。'; break;
case 'PHRASE_FILL': prompt=`「${title}」の流れを自然につなぐ空所【　】に入れる内容として、「${frag}」に当たる本文情報を答えなさい。`; reason='この内容を戻すと前後の出来事・判断のつながりが保たれます。'; break;
case 'MATERIAL_LINK': prompt=`「${title}」で資料の数値・条件と本文を合わせて確認すると、「${frag}」に関して確実に言えることは何ですか。`; reason='資料の条件と本文中の数値・時刻・数量を対応させると、この内容が確認できます。'; break;
default: throw Error('unknown question type '+type);
}
return {questionType:type,prompt,answer:jp,evidence:en,evidenceJp:jp,reason,questionReview:'B11_R3_DISTINCT_EVIDENCE_HUMAN_PASS'};}
for(const p of all){const s=p.sentences||[];if(s.length<8)throw Error('too few sentences '+p.id);const used=new Set();const take=(idxs,re)=>{const k=re?pick(s,re,idxs,used):pick(s,/$^/,idxs,used);used.add(k);return s[k];};
const q=[];
if(p.level==='YAMAGUCHI_EXAM'){
 q.push(make(p,'MATERIAL_LINK',take([2,3,4]),1));
 q.push(make(p,'DETAIL',take([0,1]),1));
 q.push(make(p,'REASON',take([4,5,6],causeRe),1));
 q.push(make(p,'CONTENT_MATCH',take([7,8,9]),1));
 q.push(make(p,'SUMMARY_FILL',take([Math.floor(s.length/2)]),1));
 q.push(make(p,'MATERIAL_LINK',take([5,6,7]),2));
 q.push(make(p,'EVIDENCE',take([Math.max(0,s.length-6)]),1));
 q.push(make(p,'PHRASE_FILL',take([Math.max(0,s.length-4)]),1));
 q.push(make(p,'RESULT',take([Math.max(0,s.length-2),Math.max(0,s.length-3)],resultRe),1));
 q.push(make(p,'GIST',s[s.length-1],1));
}else{
 q.push(make(p,'DETAIL',take([0]),1));
 q.push(make(p,'REASON',take([3,4,5],causeRe),1));
 q.push(make(p,'CONTENT_MATCH',take([2,3]),1));
 q.push(make(p,'RESULT',take([Math.max(0,s.length-3),Math.max(0,s.length-4)],resultRe),1));
 q.push(make(p,'SUMMARY_FILL',take([Math.floor(s.length/2)]),1));
 q.push(make(p,'EVIDENCE',take([5,6]),1));
 q.push(make(p,'PHRASE_FILL',take([6,7]),1));
 q.push(make(p,'DETAIL',take([7,Math.max(0,s.length-2)]),2));
 q.push(make(p,'REASON',take([Math.max(0,s.length-2),Math.max(0,s.length-3)],causeRe),2));
 q.push(make(p,'GIST',s[s.length-1],1));
}
p.questions=q.slice(0,5);p.questionSetB=q.slice(5,10);p.questionStage='BATCH11_HUMAN_REWRITE_R3_DISTINCT_EVIDENCE';p.questionHumanReview='FULL_50_PASSAGE_REVIEW_20260829_R3';}
window.V11_BATCH11_QUESTION_REWRITE_R1_STATE={passages:all.length,questions:all.length*10,registered:false,version:'20260829-r3-distinct-evidence'};
})();
