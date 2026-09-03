(function rewriteV11Batch10Questions(){
'use strict';
function Q(type,prompt,answer,evidence,evidenceJp,reason,extra){return Object.assign({questionType:type,prompt,answer,evidence,evidenceJp,reason},extra||{});}
function shortCue(s,max=13){const w=String(s||'').trim().split(/\s+/);return w.length<=max?w.join(' '):w.slice(0,max).join(' ')+' ...';}
function rewrite(p){
 const s=p.sentences||[],r=p.slashRows||[];if(s.length<8||r.length!==s.length)throw Error('Batch10 question rewrite source invalid '+p.id);
 const n=s.length,at=x=>Math.max(0,Math.min(n-1,x)),e=i=>s[at(i)],j=i=>r[at(i)].jp;
 const i0=0,i1=at(1),i2=at(Math.floor(n*.25)),i3=at(Math.floor(n*.38)),i4=at(Math.floor(n*.5)),i5=at(Math.floor(n*.62)),i6=at(Math.floor(n*.72)),i7=at(Math.floor(n*.82)),i8=at(n-2),i9=n-1;
 const title=`「${p.title}」`;
 const c1=shortCue(e(i1)),c3=shortCue(e(i3)),c5=shortCue(e(i5)),c7=shortCue(e(i7));
 p.questions=[
  Q('GIST',`${title}で、冒頭に示された出来事・課題は何ですか。`,j(i0),e(i0),j(i0),`${title}の出発点は冒頭の一文に直接示されています。`),
  Q('DETAIL',`${title}で「${c1}」とある場面のあと、判断の材料になった具体的な事実は何ですか。`,j(i2),e(i2),j(i2),'直前の場面を受けて確認された具体的事実が根拠です。'),
  Q('REASON',`${title}で最初の考えをそのまま採用できなくなった理由を答えなさい。「${c3}」付近の内容を手がかりにしなさい。`,j(i3),e(i3),j(i3),'最初の判断の弱点・不足がこの箇所で明らかになります。'),
  Q('CONTENT_MATCH',`${title}で問題点に気づいたあと、実際に行った確認・変更は何ですか。`,j(i5),e(i5),j(i5),'本文中盤以降の具体的な行動が根拠です。'),
  Q('RESULT',`${title}で追加の対応をした結果、新しく分かったこと・改善したことは何ですか。`,j(i7),e(i7),j(i7),'対応後の結果が後半に具体的に示されています。')
 ];
 p.questionSetB=[
  Q('INFERENCE',`${title}で「${c5}」という対応を選んだことから、登場人物が何を重視したと考えられますか。`,j(i6),e(i6),j(i6),'対応の直後に示される確認内容から、判断基準を読み取れます。'),
  Q('SEQUENCE',`${title}の流れで、最初の問題発見と最終判断の間に行われた重要な確認を一つ答えなさい。`,j(i5),e(i5),j(i5),'中盤の確認・比較が最初の案から最終判断へ移る転換点です。'),
  Q('EVIDENCE',`${title}で最終判断を支えた具体的な根拠は何ですか。「${c7}」付近から答えなさい。`,j(i7),e(i7),j(i7),'終盤の判断直前に置かれた事実が最終判断を支えています。'),
  Q('CONTENT_MATCH',`${title}で最終的に決めたこと、または変更したことを答えなさい。`,j(i8),e(i8),j(i8),'結論直前に最終的な対応が具体的に述べられています。'),
  Q('GIST',`${title}の出来事全体から得られる学びを、本文に即して答えなさい。`,j(i9),e(i9),j(i9),'最後の文が本文全体の経験から得た学びをまとめています。')
 ];
 if(p.level==='YAMAGUCHI_EXAM'){
  p.questions=[
   Q('GIST',`${title}で、本文と資料を使って解決しようとした中心問題は何ですか。`,j(i0),e(i0),j(i0),'冒頭で資料を使って検討する目的が示されています。'),
   Q('MATERIAL_LINK',`${title}で最初の案を考えるとき、本文中の「${c1}」と資料を合わせて確認すべき条件は何ですか。`,j(i1),e(i1),j(i1),'資料だけでなく本文中の条件を同時に読む必要があります。'),
   Q('REASON',`${title}で最初の案をそのまま使えないと判断した理由を答えなさい。「${c3}」付近を根拠にしなさい。`,j(i3),e(i3),j(i3),'最初の想定と実際の条件のずれがここで明らかになります。'),
   Q('CONTENT_MATCH',`${title}で条件のずれを確かめたあと、どのような追加確認・変更を行いましたか。`,j(i5),e(i5),j(i5),'中盤の追加確認が修正案へ進む直接の行動です。'),
   Q('MATERIAL_LINK',`${title}で本文と資料の両方を照合した結果、判断で特に重要になった情報は何ですか。`,j(i6),e(i6),j(i6),'本文と資料を結び付けた条件が最終判断を支えます。')
  ];
  p.questionSetB=[
   Q('INFERENCE',`${title}で「${c5}」という確認まで必要だったことから、最初の案にはどのような弱点があったと分かりますか。`,j(i7),e(i7),j(i7),'追加確認によって最初の案では扱えていなかった条件を推論できます。'),
   Q('SEQUENCE',`${title}で、資料の確認後に最終案へ進むために行った重要な修正を答えなさい。`,j(i8),e(i8),j(i8),'終盤の修正・決定が資料検討の結論です。'),
   Q('EVIDENCE',`${title}で判断を変える決め手となった情報を、「${c7}」付近の内容に即して答えなさい。`,j(i7),e(i7),j(i7),'終盤の具体条件が判断変更の根拠です。'),
   Q('MATERIAL_LINK',`${title}でより現実の条件に合う案を作るため、本文と資料をどのように使いましたか。`,j(i8),e(i8),j(i8),'最終案では資料上の条件と本文で確認した現実の条件を合わせています。'),
   Q('GIST',`${title}から、複数の資料を使って判断するときに大切だと分かることを答えなさい。`,j(i9),e(i9),j(i9),'本文末が資料と現実条件を照合する学びをまとめています。')
  ];
  if(p.id==='V11-B10-G3-016'){
   const model='Check the newest snow forecast, choose indoor places within bus capacity, and send each group a clear departure time before the event.';
   p.questionSetB[4]=Q('FREE_WRITE_20_30','本文と資料を参考に、冬の行事を安全に運営するための提案を英語20〜30語で書きなさい。',model,e(i9),j(i9),'最新の天候、利用可能な屋内場所、移動人数や時刻を確認して安全な案を20〜30語でまとめます。',{scoring:{wordMin:20,wordMax:30,conditions:['最新の天候または雪予報に触れる','安全に使える屋内場所または収容人数に触れる','出発時刻など具体的な連絡に触れる']}});
  }
 }
 p.questionStage='BATCH10_HUMAN_REWRITE_R1';
}
const groups=[window.V11_BATCH10_G1_DRAFTS||[],window.V11_BATCH10_G2_DRAFTS||[],window.V11_BATCH10_G3_DRAFTS||[]];const all=groups.flat();if(all.length!==50)throw Error('Batch10 question source count '+all.length);all.forEach(rewrite);window.V11_BATCH10_HUMAN_QUESTION_REWRITE={count:all.length,version:'R1',registered:false};
})();
