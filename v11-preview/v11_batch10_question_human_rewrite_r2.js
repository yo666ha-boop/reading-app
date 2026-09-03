(function rewriteV11Batch10QuestionsR2(){
'use strict';
const ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch10 question r2 requires 50 passages');
function Q(type,prompt,p,i,reason,extra){const row=p.slashRows[i];return Object.assign({questionType:type,prompt,answer:row.jp,evidence:p.sentences[i],evidenceJp:row.jp,reason},extra||{});}
function clamp(n,i){return Math.max(0,Math.min(n-1,i));}
function firstMatch(p,start,end,re){for(let i=start;i<=end;i++)if(re.test(p.sentences[i]))return i;return -1;}
function firstDistinct(cands,used,n){for(const x of cands){const i=clamp(n,x);if(!used.has(i))return i;}for(let i=0;i<n;i++)if(!used.has(i))return i;return 0;}
function rewriteStandard(p){const n=p.sentences.length,used=new Set(),take=i=>{i=clamp(n,i);used.add(i);return i;};
 const i0=take(0);
 const iEarly=take(firstDistinct([2,1,3],used,n));
 let problem=firstMatch(p,2,Math.max(2,n-4),/(realized|noticed|found that|showed that|did not|could not|was not|were not|too\b|only\b|rather than|instead|but\b)/i);if(problem<0||used.has(problem))problem=firstDistinct([Math.floor(n*.35),4,5],used,n);const iProblem=take(problem);
 let action=firstMatch(p,Math.min(iProblem+1,n-2),n-2,/(changed|checked|asked|moved|used|revised|added|kept|printed|wrote|placed|decided|planned|tried|replaced|lowered|marked|created|chose|sent|recorded|compared|designed|rewrote|returned|told|made|walked|tested|gave|put|set|reduced|assigned|displayed|contacted|proposed|measured|read|removed|published|updated|reported|listed)/i);if(action<0||used.has(action))action=firstDistinct([Math.floor(n*.56),6,7],used,n);const iAction=take(action);
 let result=firstDistinct([n-2,n-3,n-4],used,n);const iResult=take(result);
 const iSummary=take(firstDistinct([Math.floor(n*.52),Math.floor(n*.62),5],used,n));
 const iEvidence=take(firstDistinct([Math.floor(n*.38),Math.floor(n*.45),3],used,n));
 const iExtra=take(firstDistinct([Math.floor(n*.70),Math.floor(n*.76),n-4],used,n));
 const iLate=take(firstDistinct([n-3,n-4,n-2],used,n));
 const iLesson=n-1;
 p.questions=[
  Q('GIST',`「${p.title}」の冒頭では、どのような状況・目的が示されていますか。`,p,i0,'文章の出発点を示す冒頭の内容が根拠です。'),
  Q('DETAIL',`「${p.title}」の前半で、判断を進める材料になった具体的な事実を一つ答えなさい。`,p,iEarly,'本文前半の具体的事実を正確に読み取る問題です。'),
  Q('REASON',`「${p.title}」で、最初の方法や考えを見直す必要があると分かった内容を答えなさい。`,p,iProblem,'問題点・制約が明らかになる本文中の記述が根拠です。'),
  Q('CONTENT_MATCH',`「${p.title}」で、問題点を確認したあとに実際に行った対応を一つ答えなさい。`,p,iAction,'見直し後の具体的な行動を本文から確認します。'),
  Q('RESULT',`「${p.title}」の終盤で、その対応後に確認できた結果・変化を答えなさい。`,p,iResult,'対応後の状態や結果を示す終盤の記述が根拠です。')
 ];
 p.questionSetB=[
  Q('SUMMARY_FILL',`「${p.title}」の流れを「最初の状況 → 問題・制約の確認 → _____ → 終盤の結果」とまとめるとき、空所に入る本文中の重要な内容を答えなさい。`,p,iSummary,'文章の中盤で流れを前へ進める重要な内容が入ります。'),
  Q('EVIDENCE',`「${p.title}」で、判断や見直しを支えた別の具体的な情報を本文から答えなさい。`,p,iEvidence,'本文中の別の具体情報を根拠として読み取ります。'),
  Q('CONTENT_MATCH',`「${p.title}」で、解決・改善のために追加して行った工夫や確認を一つ答えなさい。`,p,iExtra,'中盤から後半に行った追加の工夫・確認が根拠です。'),
  Q('PHRASE_FILL',`「${p.title}」について「最終段階で確認・実施したこと：_____」とメモを完成させるとき、空所に入る内容を本文から答えなさい。`,p,iLate,'終盤の具体的な確認・実施内容をそのまま根拠にします。'),
  Q('GIST',`「${p.title}」の出来事全体から得られる学びを、本文に即して答えなさい。`,p,iLesson,'最後の文が出来事全体から得た学びをまとめています。')
 ];
}
const Y={
 'V11-B10-G3-004':{A:[1,4,9,15,18],B:[12,13,19,23,24],promptsA:[
  '本文と資料を使って、四人がこの芸術祭で実現しようとした条件を答えなさい。','粘土講座の開始時刻と受付規則を合わせると、特に確認すべき受付条件は何ですか。','最初の移動案をそのまま使わないと決めた理由を本文に即して答えなさい。','ギャラリーの入場時刻について、資料から判断して利用した条件を答えなさい。','帰りの計画で基準となったシャトルの時刻を答えなさい。'],promptsB:[
  '資料確認後、入口から講座へ向かう基本の移動順をどのように直しましたか。','徒歩時間に少し遅れが出ても受付に間に合うと判断した根拠を答えなさい。','帰りに慌てないため、何時にどこへ集合することにしましたか。','最終的に三時半までに駅へ戻る条件を満たせたことが分かる結果を答えなさい。','この文章から、時刻表・規則・徒歩時間を組み合わせて計画するときの学びを答えなさい。']},
 'V11-B10-G3-008':{A:[1,2,7,10,17],B:[13,15,18,21,24],promptsA:[
  '本文と資料を使って、海岸清掃で同時に満たそうとした安全上の条件を答えなさい。','潮位表で、岩場の作業順を決める基準になった時刻情報を答えなさい。','A、CのあとにBへ行く最初の順序を見直した理由を答えなさい。','潮位条件を考えて、Zone Bの作業順をどのように変更しましたか。','帰りのバスを選ぶとき、全作業との関係でどの便を選んだか答えなさい。'],promptsB:[
  '岩場での作業を長引かせないため、Zone Bについて何時ごろまでに行った対応を答えなさい。','Zone CがZone Bほど早く始めなくてよいと判断できた利用時間の条件を答えなさい。','遅い帰り便を使わなかった理由を、潮の変化と作業内容に結び付けて答えなさい。','最終的に安全な時間内に全員がそろったことが分かる結果を答えなさい。','この文章から、潮位・交通・区域・監督を組み合わせる野外活動の学びを答えなさい。']},
 'V11-B10-G3-012':{A:[1,7,13,14,18],B:[9,17,19,22,24],promptsA:[
  '本文と資料を使って、ボランティアが各行事で守る必要があった中心条件を答えなさい。','申込数と部屋定員を比べたとき、本の修理教室について分かったことを答えなさい。','作家講演後に同じ生徒が修理受付へ移動する案に余裕が少ない理由を答えなさい。','その移動問題を避けるため、修理受付の担当をどのように変更しましたか。','物語教室の申込数と定員を合わせると、当日参加についてどのように判断できましたか。'],promptsB:[
  '満員の修理教室で、別室の空席を流用せずに行った対応を答えなさい。','一時五十五分のキャンセル後、空いた一席をどのように扱いましたか。','修理教室終了後、物語教室へ移動する時間が足りると分かる条件を答えなさい。','最終的に定員管理が正しくできたことが分かる結果を答えなさい。','この文章から、部屋定員・申込状況・移動時間を組み合わせる案内の学びを答えなさい。']},
 'V11-B10-G3-016':{A:[1,7,8,16,19],B:[10,21,22,23],promptsA:[
  '本文と資料を使って、元の冬行事計画で予定していた時間帯と場所を答えなさい。','参加者総数と各会場の定員を比べた結果、全員が一室に入れる会場について分かったことを答えなさい。','最初の屋内案をそのまま使えなかった開館時間上の問題を答えなさい。','家庭へ再確認した後も、バス座席数について残った不足を答えなさい。','座席不足を解決するため、最終的にどの車両構成を使うことにしましたか。'],promptsB:[
  '市民ホールの閉館前に安全に退場するため、行事終了後にどれだけの時間を確保しましたか。','当日朝の天候悪化に備えて設定した確認時刻と中止基準について答えなさい。','実施当日の天候と、修正版の計画でどのように終えられたかを答えなさい。','この文章から、冬の行事で会場・交通・天候を組み合わせるときの学びを答えなさい。']}
};
function rewriteY(p,spec){p.questions=spec.A.map((idx,k)=>Q(k===0?'GIST':k===1||k===4?'MATERIAL_LINK':k===2?'REASON':'CONTENT_MATCH',`「${p.title}」で、${spec.promptsA[k]}`,p,idx,k===0?'本文と資料を使う目的・条件を確認します。':k===1||k===4?'本文中の数値・時刻と資料条件を対応させる問題です。':k===2?'最初の案を見直す直接の制約が根拠です。':'資料確認後の具体的な変更・対応が根拠です。'));
 p.questionSetB=spec.B.map((idx,k)=>Q(k===0?'SUMMARY_FILL':k===1?'MATERIAL_LINK':k===2?'EVIDENCE':k===3?'RESULT':'GIST',`「${p.title}」で、${spec.promptsB[k]}`,p,idx,k===0?'資料確認後の計画の流れをまとめます。':k===1?'資料の数値・時刻と本文の行動を結び付けます。':k===2?'判断を支えた具体的条件・結果が根拠です。':k===3?'最終的に条件を満たした結果を確認します。':'本文末が複数資料を使った学びをまとめています。'));
 if(p.id==='V11-B10-G3-016'){
  const model='Check the newest snow forecast, choose indoor places within bus capacity, and send each group a clear departure time before the event.';
  p.questionSetB.push({questionType:'FREE_WRITE_20_30',prompt:'本文と資料を参考に、冬の行事を安全に運営するための提案を英語20〜30語で書きなさい。',answer:model,evidence:p.sentences[23],evidenceJp:p.slashRows[23].jp,reason:'最新の天候、会場定員、移動手段や連絡を組み合わせ、20〜30語で具体的に提案します。',scoring:{wordMin:20,wordMax:30,conditions:['最新の天候または雪予報に触れる','安全に使える屋内場所または収容人数に触れる','出発時刻など具体的な連絡に触れる']}});
 }
}
for(const p of ps){if(Y[p.id])rewriteY(p,Y[p.id]);else rewriteStandard(p);p.questionStage='BATCH10_HUMAN_REWRITE_R2';p.questionHumanReview='FULL_50_PASSAGE_REVIEW_20260829';}
window.V11_BATCH10_HUMAN_QUESTION_REWRITE_R2={version:'20260829-r2',passages:ps.length,questions:ps.reduce((n,p)=>n+(p.questions||[]).length+(p.questionSetB||[]).length,0),yamaguchi:Object.keys(Y).length,registered:false};
})();
