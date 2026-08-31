const fs=require('fs');
const src=require('./v11_batch12_assembled_draft.json');
if(src.registered!==false||src.humanReviewedCount!==50||src.humanReviewPendingCount!==0)throw new Error('Batch12 semantic review must be complete and unregistered');
const enSeg=new Intl.Segmenter('en',{granularity:'sentence'}),jpSeg=new Intl.Segmenter('ja',{granularity:'sentence'});
function splitWith(seg,s){return [...seg.segment(s)].map(x=>x.segment.trim()).filter(Boolean)}
function splitEn(s){return splitWith(enSeg,s)} function splitJp(s){return splitWith(jpSeg,s)}
function partition(a,k){if(k<1||k>a.length)throw new Error('invalid partition');const out=[];let from=0;for(let i=0;i<k;i++){const to=Math.round((i+1)*a.length/k);out.push(a.slice(from,to));from=to;}return out}
function align(en,jp){const k=Math.min(en.length,jp.length),eg=partition(en,k),jg=partition(jp,k);return eg.map((x,i)=>({en:x.join(' '),jp:jg[i].join(''),humanReview:(x.length===1&&jg[i].length===1)?'PENDING_CONFIRM':'PENDING_GROUP_BOUNDARY'}))}
function Q(type,prompt,answer,evidence,evidenceJp,reason){return{questionType:type,prompt,answer,evidence,evidenceJp,reason,humanReview:'PENDING'}}
const out=JSON.parse(JSON.stringify(src));let rows=0,q=0,grouped=0;
for(const p of out.passages){const en=splitEn(p.body),jp=splitJp(p.fullTranslation);if(en.length<6||jp.length<6)throw new Error(`${p.id} too few sentence units en=${en.length} jp=${jp.length}`);p.sentences=en;p.slashRows=align(en,jp);if(p.slashRows.some(r=>r.humanReview==='PENDING_GROUP_BOUNDARY'))grouped++;rows+=p.slashRows.length;const n=p.slashRows.length,idx={first:0,clue:Math.min(2,n-1),turn:Math.max(1,Math.floor(n/2)-1),action:Math.max(1,n-2),last:n-1};const mk=i=>p.slashRows[i];let x;
x=mk(idx.first);p.questions=[Q('GIST','本文の最初に示された状況・問題を答えなさい。',x.jp,x.en,x.jp,'冒頭の状況を本文から確認します。')];
x=mk(idx.clue);p.questions.push(Q('DETAIL','判断の手がかりになった具体的な情報を一つ答えなさい。',x.jp,x.en,x.jp,'本文中の具体情報が根拠です。'));
x=mk(idx.turn);p.questions.push(Q('REASON','最初の考えをそのまま実行せず、確認や見直しをした理由を答えなさい。',x.jp,x.en,x.jp,'判断が変わる付近の記述を根拠にします。'));
x=mk(idx.action);p.questions.push(Q('CONTENT_MATCH','問題を解決するために行った中心的な対応を答えなさい。',x.jp,x.en,x.jp,'終盤の行動が根拠です。'));
x=mk(idx.last);p.questions.push(Q('GIST','この出来事から分かったこと・最後に確かめられたことを答えなさい。',x.jp,x.en,x.jp,'結末の記述が文章全体をまとめています。'));
x=mk(idx.last);p.questionSetB=[Q('INFERENCE','本文全体から、同じような場面で大切だと考えられることを答えなさい。',x.jp,x.en,x.jp,'本文の結末とそれまでの判断過程から読み取ります。')];
x=mk(idx.turn);p.questionSetB.push(Q('SUMMARY_FILL','確認後、話の流れを変えた中心的な出来事を答えなさい。',x.jp,x.en,x.jp,'中盤の転換点が根拠です。'));
x=mk(idx.clue);p.questionSetB.push(Q('DETAIL','判断を変えるきっかけになった情報を答えなさい。',x.jp,x.en,x.jp,'具体的な手がかりを本文から探します。'));
x=mk(idx.action);p.questionSetB.push(Q('CONTENT_MATCH','最終的に行った変更・決定・対応を答えなさい。',x.jp,x.en,x.jp,'終盤の決定と一致する内容です。'));
x=mk(idx.last);p.questionSetB.push(Q('GIST','文章全体を最もよく表す学び・結論を答えなさい。',x.jp,x.en,x.jp,'最後の文を中心に文章全体をまとめます。'));
p.slashStage='B12_SLASH_SCAFFOLD_HUMAN_REVIEW_REQUIRED';p.questionStage='B12_QUESTION_SCAFFOLD_HUMAN_REVIEW_REQUIRED';q+=10;}
if(out.passages.length!==50||q!==500)throw new Error('count mismatch');out.status='SLASH_AND_QUESTION_SCAFFOLD_READY_HUMAN_REVIEW_REQUIRED';out.slashScaffoldPassages=50;out.slashRowsTotal=rows;out.slashGroupedBoundaryPassages=grouped;out.slashHumanReviewed=0;out.questionScaffoldCount=q;out.humanQuestionReviewed=0;out.registered=false;
fs.writeFileSync('v11_batch12_slash_question_scaffold.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({passages:50,slashRows:rows,groupedBoundaryPassages:grouped,questions:q,slashHumanReviewed:0,humanQuestionReviewed:0,registered:false},null,2));