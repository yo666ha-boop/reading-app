(function rewriteV11Batch08Questions(){
'use strict';
function Q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function rewrite(p){
 const s=p.sentences||[], r=p.slashRows||[]; if(s.length<8||r.length!==s.length) return;
 const n=s.length, at=x=>Math.max(0,Math.min(n-1,x)), e=i=>s[at(i)], j=i=>r[at(i)].jp;
 const i0=0,i1=at(1),i2=at(Math.floor(n*.25)),i3=at(Math.floor(n*.38)),i4=at(Math.floor(n*.5)),i5=at(Math.floor(n*.62)),i6=at(Math.floor(n*.72)),i7=at(Math.floor(n*.82)),i8=at(n-2),i9=n-1;
 const title=`「${p.title}」`;
 p.questions=[
  Q('GIST',`${title}で、最初に取り組もうとしたことは何ですか。`,j(i0),e(i0),j(i0),'本文の冒頭に、調査・計画・課題の出発点が示されています。'),
  Q('DETAIL',`最初の記録や行動を進めたあと、どのような事実が分かりましたか。`,j(i2),e(i2),j(i2),'初期の調査・行動から得られた具体的な事実です。'),
  Q('REASON',`そのまま最初の考えを採用せず、調べ方や計画を見直す必要があったのはなぜですか。`,j(i3),e(i3),j(i3),'本文中で、最初の判断だけでは十分でない理由が示されています。'),
  Q('CONTENT_MATCH',`見直しのあとに実際に行ったこととして、本文に合う内容を答えなさい。`,j(i5),e(i5),j(i5),'見直し後の具体的な行動と一致する文が根拠です。'),
  Q('DETAIL',`新しい記録や比較から、どのようなことが分かりましたか。`,j(i6),e(i6),j(i6),'再調査・比較によって得られた結果が本文に示されています。')
 ];
 p.questionSetB=[
  Q('INFERENCE',`本文全体から、このグループが判断するときに大切にしたと考えられることは何ですか。`,j(i7),e(i7),j(i7),'後半の行動から、判断のしかたについて読み取れます。'),
  Q('SUMMARY_FILL',`${title}の流れをまとめるとき、「最初の考えを見直したあと、_____。」の空所に入る内容を答えなさい。`,j(i5),e(i5),j(i5),'見直し後に行った中心的な行動を入れると、本文の流れに合います。'),
  Q('PHRASE_FILL',`「より確かな判断につながった情報」として本文から答えるなら、どの内容が最も適切ですか。`,j(i6),e(i6),j(i6),'再調査・比較で得た情報が、その後の判断につながっています。'),
  Q('CONTENT_MATCH',`最終的に決めたこと・変更したこととして、本文に合う内容を答えなさい。`,j(i8),e(i8),j(i8),'終盤で具体的な変更や決定が示されています。'),
  Q('GIST',`この文章から読み取れる最も大切な学びを答えなさい。`,j(i9),e(i9),j(i9),'最後の文が、出来事全体から得た学びをまとめています。')
 ];
 if(p.level==='YAMAGUCHI_EXAM'){
   p.questions=[
    Q('GIST',`${title}で、委員会・グループが解決しようとした中心問題は何ですか。`,j(i0),e(i0),j(i0),'冒頭で検討対象となる問題が示されています。'),
    Q('DETAIL',`最初に使われていた案・資料・記録には、どのような条件が示されていましたか。`,j(i1),e(i1),j(i1),'初期条件を示す本文記述が根拠です。'),
    Q('REASON',`最初の案だけでは十分でないと考えた理由を答えなさい。`,j(i3),e(i3),j(i3),'実際の状況と最初の想定にずれがあることが示されています。'),
    Q('CONTENT_MATCH',`追加の確認として行ったことに合う内容を答えなさい。`,j(i5),e(i5),j(i5),'追加調査・再確認の行動が本文に直接示されています。'),
    Q('MATERIAL_LINK',`資料の条件と本文中の出来事を合わせて判断するとき、特に重要だった情報は何ですか。`,j(i6),e(i6),j(i6),'資料だけでなく、本文中で確認した条件を組み合わせる必要があります。')
   ];
   p.questionSetB=[
    Q('INFERENCE',`追加の記録まで考えると、最初の案をそのまま使うことにどのような問題があると読み取れますか。`,j(i7),e(i7),j(i7),'複数の条件を合わせることで、最初の案の弱点を推論できます。'),
    Q('SUMMARY_FILL',`文章の流れを「最初の案 → 問題の発見 → 追加確認 → _____」とまとめるとき、空所に入る内容を答えなさい。`,j(i8),e(i8),j(i8),'終盤の変更・提案が一連の検討の結論になります。'),
    Q('CONTEXT_WORD',`後半で判断を変えるきっかけになった出来事を、本文の内容に即して答えなさい。`,j(i6),e(i6),j(i6),'判断変更の直前に示された具体的な情報が根拠です。'),
    Q('PHRASE_FILL',`「より現実に合う案にするために必要だったこと」として、本文から答えなさい。`,j(i7),e(i7),j(i7),'後半の比較・確認が、現実に合う案へ修正する根拠です。'),
    Q('GIST',`この調査から得られた最も重要な学びを答えなさい。`,j(i9),e(i9),j(i9),'本文末が、資料と実際の条件をどう扱うべきかをまとめています。')
   ];
 }
 p.questionStage='BATCH08_HUMAN_REWRITE_R1';
}
const groups=[window.V11_BATCH08_G1_DRAFTS||[],window.V11_BATCH08_G2_DRAFTS||[],window.V11_BATCH08_G3_DRAFTS||[]];
groups.flat().forEach(rewrite);
window.V11_BATCH08_HUMAN_QUESTION_REWRITE={count:groups.flat().length,version:'R1'};
})();
