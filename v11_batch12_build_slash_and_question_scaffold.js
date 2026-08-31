const fs=require('fs');
const src=require('./v11_batch12_assembled_draft.json');
// Rerun after human-reviewed sentence-alignment repairs; still fail closed on every mismatch.
if(src.registered!==false||src.humanReviewedCount!==50||src.humanReviewPendingCount!==0)throw new Error('Batch12 semantic review must be complete and unregistered');
function splitEn(s){return (s.match(/[^.!?]+[.!?]+(?:[”"'](?=\s|$))?|[^.!?]+$/g)||[]).map(x=>x.trim()).filter(Boolean)}
function splitJp(s){return (s.match(/[^。！？]+[。！？]/g)||[]).map(x=>x.trim()).filter(Boolean)}
function Q(type,prompt,answer,evidence,evidenceJp,reason){return{questionType:type,prompt,answer,evidence,evidenceJp,reason,humanReview:'PENDING'}}
const out=JSON.parse(JSON.stringify(src));let rows=0,q=0;
for(const p of out.passages){const en=splitEn(p.body),jp=splitJp(p.fullTranslation);if(en.length!==jp.length)throw new Error(`${p.id} sentence alignment mismatch en=${en.length} jp=${jp.length}`);if(en.length<6)throw new Error(`${p.id} too few aligned sentences ${en.length}`);p.sentences=en;p.slashRows=en.map((x,i)=>({en:x,jp:jp[i]}));rows+=en.length;const n=en.length, idx={first:0,clue:Math.min(2,n-1),turn:Math.max(1,Math.floor(n/2)-1),action:Math.max(1,n-2),last:n-1};const mk=(i)=>({en:en[i],jp:jp[i]});let x;
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
p.questionStage='B12_SCAFFOLD_HUMAN_REVIEW_REQUIRED';q+=10;delete p.body;
}
if(out.passages.length!==50||q!==500)throw new Error('count mismatch');out.status='SLASH_ALIGNED_50_QUESTION_SCAFFOLD_500_HUMAN_REVIEW_REQUIRED';out.slashAlignedPassages=50;out.slashRowsTotal=rows;out.questionScaffoldCount=q;out.humanQuestionReviewed=0;out.registered=false;
fs.writeFileSync('v11_batch12_slash_question_scaffold.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({passages:50,slashRows:rows,questions:q,humanQuestionReviewed:0,registered:false},null,2));