(function rewriteV11Batch09Questions(){
'use strict';
function Q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function rewrite(p){
 const s=p.sentences||[],r=p.slashRows||[];if(s.length<8||r.length!==s.length)throw Error('Batch09 question rewrite source invalid '+p.id);
 const n=s.length,at=x=>Math.max(0,Math.min(n-1,x)),e=i=>s[at(i)],j=i=>r[at(i)].jp;
 const i0=0,i1=at(1),i2=at(Math.floor(n*.25)),i3=at(Math.floor(n*.38)),i4=at(Math.floor(n*.5)),i5=at(Math.floor(n*.62)),i6=at(Math.floor(n*.72)),i7=at(Math.floor(n*.82)),i8=at(n-2),i9=n-1;
 const title=`「${p.title}」`;
 p.questions=[
  Q('GIST',`${title}で、最初に解決・確認しようとしたことは何ですか。`,j(i0),e(i0),j(i0),'冒頭で、この文章の出発点となる課題や目的が示されています。'),
  Q('DETAIL','最初の調査・記録・行動から分かった具体的なことを答えなさい。',j(i2),e(i2),j(i2),'初めの判断材料となった具体的事実が本文に示されています。'),
  Q('REASON','最初の考えや判断をそのまま採用せず、見直す必要があったのはなぜですか。',j(i3),e(i3),j(i3),'最初の判断だけでは不十分だと分かる理由が本文中にあります。'),
  Q('CONTENT_MATCH','見直したあとに実際に行ったこととして、本文に合う内容を答えなさい。',j(i5),e(i5),j(i5),'見直し後の具体的な行動が根拠です。'),
  Q('DETAIL','追加の確認・比較から新しく分かったことを答えなさい。',j(i6),e(i6),j(i6),'再確認で得られた新しい情報が本文に直接示されています。')
 ];
 p.questionSetB=[
  Q('INFERENCE','本文全体から、登場人物が判断するときに大切にしたと考えられることを答えなさい。',j(i7),e(i7),j(i7),'後半の行動と判断から、重視した考え方を読み取れます。'),
  Q('SUMMARY_FILL',`${title}の流れを「最初の判断 → 問題点の発見 → _____ → 最終判断」とまとめるとき、空所に入る内容を答えなさい。`,j(i5),e(i5),j(i5),'見直し後に行った中心的な確認・行動が文章の転換点です。'),
  Q('PHRASE_FILL','「より確かな判断につながった情報」として本文から答えるなら、どの内容が最も適切ですか。',j(i6),e(i6),j(i6),'追加調査や比較で得た情報がその後の判断を支えています。'),
  Q('CONTENT_MATCH','最終的に決めたこと・変更したこととして、本文に合う内容を答えなさい。',j(i8),e(i8),j(i8),'終盤で最終的な対応が具体的に示されています。'),
  Q('GIST','この文章全体から得られる最も大切な学びを答えなさい。',j(i9),e(i9),j(i9),'最後の文が出来事全体から得た学びをまとめています。')
 ];
 if(p.level==='YAMAGUCHI_EXAM'){
  p.questions=[
   Q('GIST',`${title}で、解決しようとした中心問題は何ですか。`,j(i0),e(i0),j(i0),'冒頭で検討対象となる問題が示されています。'),
   Q('MATERIAL_LINK','最初の案を考えるとき、本文と資料から読み取る必要があった条件を答えなさい。',j(i1),e(i1),j(i1),'資料だけでなく本文中の条件も合わせて確認する必要があります。'),
   Q('REASON','最初の案だけでは十分でないと考えた理由を答えなさい。',j(i3),e(i3),j(i3),'実際の条件と最初の想定のずれが根拠です。'),
   Q('CONTENT_MATCH','追加確認として実際に行ったことに合う内容を答えなさい。',j(i5),e(i5),j(i5),'追加調査・再確認の行動が本文に直接示されています。'),
   Q('MATERIAL_LINK','資料の数値・時刻・場所条件と本文中の出来事を合わせると、判断で特に重要だった情報は何ですか。',j(i6),e(i6),j(i6),'資料と本文の両方を結びつける条件が判断の鍵です。')
  ];
  p.questionSetB=[
   Q('INFERENCE','追加の情報まで考えると、最初の案をそのまま使うことにどのような問題があると読み取れますか。',j(i7),e(i7),j(i7),'複数の条件を合わせると最初の案の弱点を推論できます。'),
   Q('SUMMARY_FILL','文章の流れを「最初の案 → 問題の発見 → 追加確認 → _____」とまとめるとき、空所に入る内容を答えなさい。',j(i8),e(i8),j(i8),'終盤の変更・決定が一連の検討の結論です。'),
   Q('CONTEXT_WORD','後半で判断を変える直接のきっかけになった情報を、本文の内容に即して答えなさい。',j(i6),e(i6),j(i6),'判断変更の直前に示された具体的な条件が根拠です。'),
   Q('PHRASE_FILL','「より現実の条件に合う案にするために必要だったこと」として本文から答えなさい。',j(i7),e(i7),j(i7),'後半の比較・確認が現実に合う案へ直す根拠です。'),
   Q('GIST','本文と資料の両方から得られる最も重要な学びを答えなさい。',j(i9),e(i9),j(i9),'本文末が資料と実際の条件をどう扱うべきかまとめています。')
  ];
  if(p.id==='V11-B09-G3-016'){
   const model='Check current opening hours, choose a safe open shelter, and ask a nearby adult for help if walking in severe heat feels unsafe.';
   p.questionSetB[4]=Q('FREE_WRITE_20_30','本文と資料を参考に、暑さの中で安全な避難先を選ぶための提案を英語20〜30語で書きなさい。',model,e(i9),j(i9),'開館時間、経路、体調を確認し、危険なら近くの大人へ助けを求める内容を20〜30語でまとめます。',{scoring:{wordMin:20,wordMax:30,conditions:['開館時間または利用可能時刻に触れる','安全な経路または安全な避難先に触れる','体調が悪い場合の助けを求める行動に触れる']}});
  }
 }
 p.questionStage='BATCH09_HUMAN_REWRITE_R1';
}
const groups=[window.V11_BATCH09_G1_DRAFTS||[],window.V11_BATCH09_G2_DRAFTS||[],window.V11_BATCH09_G3_DRAFTS||[]];const all=groups.flat();if(all.length!==50)throw Error('Batch09 question source count '+all.length);all.forEach(rewrite);window.V11_BATCH09_HUMAN_QUESTION_REWRITE={count:all.length,version:'R1',registered:false};
})();
