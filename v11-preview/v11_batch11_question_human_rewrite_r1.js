(function(){'use strict';
const all=[...(window.V11_BATCH11_G1_DRAFTS||[]),...(window.V11_BATCH11_G2_DRAFTS||[]),...(window.V11_BATCH11_G3_DRAFTS||[])];
if(all.length!==50)throw Error('Batch11 passages missing');
const jpFor=(p,en)=>{const r=(p.slashRows||[]).find(x=>x.en===en);if(!r)throw Error('JP evidence missing '+p.id+' '+en);return r.jp;};
const causeRe=/\b(because|therefore|so|since|reason|meant|required|needed|could not|couldn't|failed|instead|rather than|in order to|so that|without|only when|enough|less than|more than)\b/i;
const resultRe=/\b(after|afterward|then|finally|result|returned|reached|changed|added|found|showed|ended|stayed|became|completed|arrived|sent|received)\b/i;
function pick(s,re,fallback,used){
  const conclusion=s[s.length-1];
  const candidates=[];
  for(const raw of fallback){const k=Math.max(0,Math.min(s.length-1,raw));if(!candidates.includes(k))candidates.push(k);}
  const ok=k=>!used.has(k)&&s[k]!==conclusion;
  for(const k of candidates){if(ok(k)&&re.test(s[k]))return k;}
  for(const k of candidates){if(ok(k))return k;}
  for(let i=0;i<Math.max(0,s.length-1);i++){if(ok(i)&&re.test(s[i]))return i;}
  for(let i=0;i<Math.max(0,s.length-1);i++){if(ok(i))return i;}
  for(let i=0;i<s.length;i++)if(!used.has(i))return i;
  return Math.max(0,s.length-1);
}
function make(p,type,en,variant){
  const jp=jpFor(p,en),title=p.title;let prompt,reason;
  switch(type){
    case 'GIST': prompt=`「${title}」全体を読んで、筆者が最も伝えたいことを答えなさい。`; reason='結末だけでなく、本文全体の出来事や判断をまとめて考える必要があります。'; break;
    case 'DETAIL': prompt=variant===2?`「${title}」の後半で述べられている具体的な事実を一つ答えなさい。`:`「${title}」で述べられている重要な具体的事実を一つ答えなさい。`; reason='本文に直接書かれた具体的事実を根拠に答えます。'; break;
    case 'REASON': prompt=`「${title}」で、登場人物がその判断・行動をした理由または必要だった条件を答えなさい。`; reason='判断や行動の前後を読み、原因・条件を示す本文記述から答えます。'; break;
    case 'CONTENT_MATCH': prompt=`「${title}」の内容と一致する事実を、本文に基づいて一つ答えなさい。`; reason='本文の記述と一致する内容を、根拠の範囲を超えずに答えます。'; break;
    case 'RESULT': prompt=`「${title}」で、行動や確認のあとに起きたこと・分かったことを答えなさい。`; reason='本文の時間順を追い、行動や確認の結果を示す記述から答えます。'; break;
    case 'SUMMARY_FILL': prompt=`「${title}」の流れを要約するとき、空所【　】に入る重要な内容を本文に基づいて答えなさい。`; reason='本文全体の流れを保つうえで必要な内容を根拠に答えます。'; break;
    case 'EVIDENCE': prompt=`「${title}」で、登場人物の判断を支える手がかり・証拠となった内容を答えなさい。`; reason='判断を支える具体的な本文記述を根拠に答えます。'; break;
    case 'PHRASE_FILL': prompt=`「${title}」の出来事の流れを自然につなぐため、空所【　】に入る内容を本文に基づいて答えなさい。`; reason='前後の出来事・判断のつながりが自然になる内容を本文から確認します。'; break;
    case 'MATERIAL_LINK': prompt=`「${title}」で、資料の数値・条件と本文を合わせると確実に言えることを答えなさい。`; reason='資料の条件と本文の数値・時刻・数量を対応させて判断します。'; break;
    default: throw Error('unknown question type '+type);
  }
  return {questionType:type,prompt,answer:jp,evidence:en,evidenceJp:jp,reason,questionReview:'B11_R4_NONLEAK_PENDING_HUMAN'};
}
for(const p of all){
  const s=p.sentences||[];if(s.length<8)throw Error('too few sentences '+p.id);const used=new Set();
  const take=(idxs,re)=>{const k=re?pick(s,re,idxs,used):pick(s,/$^/,idxs,used);used.add(k);return s[k];};
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
  p.questions=q.slice(0,5);p.questionSetB=q.slice(5,10);
  p.questionStage='BATCH11_R4_NONLEAK_PENDING_HUMAN';
  p.questionHumanReview='PENDING_FULL_50_PASSAGE_REVIEW_R4';
}
window.V11_BATCH11_QUESTION_REWRITE_R1_STATE={passages:all.length,questions:all.length*10,registered:false,version:'20260830-r4-nonleak-pending-human'};
})();