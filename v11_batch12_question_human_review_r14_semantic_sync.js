function syncR14(f){
  'use strict';
  if(!f||!Array.isArray(f.passages))return f;
  const p13=f.passages.find(x=>x.id==='V11-B12-G3-013');if(!p13)throw new Error('R14 semantic sync: G3-013 missing');
  const a13=[...(p13.questions||[]),...(p13.questionSetB||[])];
  const contrast=a13.filter(x=>x.evidence==='Several species appeared only near fallen branches in the second.'||x.evidence==='The new survey still found many insects in the first pond.');
  if(contrast.length!==2)throw new Error('R14 semantic sync: expected two G3-013 contrast questions, got '+contrast.length);
  for(const q of contrast){q.evidence='The new survey still found many insects in the first pond, but several species appeared only near fallen branches in the second.';q.evidenceJp='最初の池ではやはり多くの昆虫が見つかりましたが、二つ目の池では落ちた枝の近くだけに現れる種類もありました。';q.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';}

  const p14=f.passages.find(x=>x.id==='V11-B12-G3-014');if(!p14)throw new Error('R14 semantic sync: G3-014 missing');
  const a14=[...(p14.questions||[]),...(p14.questionSetB||[])];
  const repair=a14.find(x=>x.evidence==='The largest repair costs came from two electric tools used without instruction.');if(!repair)throw new Error('R14 semantic sync: G3-014 repair-risk inference missing');
  repair.evidence='Most late returns involved low-cost hand tools, while the largest repair costs came from two electric tools used without instruction.';repair.evidenceJp='返却遅れの多くは安い手工具で起きていましたが、大きな修理費は、説明を受けず使われた電動工具二件から生じていました。';repair.reason='返却遅れと高額修理の原因が別種類の工具に分かれていた対比から、安全説明が電動工具の誤使用リスクに対応すると推論します。';repair.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';
  const access=a14.find(x=>x.evidence==='Several residents said the amount would prevent some families from using the service.');if(!access)throw new Error('R14 semantic sync: G3-014 access context missing');
  access.evidence='During a public meeting, however, several residents said the amount would prevent some families from using the service.';access.evidenceJp='しかし住民説明会では、その金額では利用できない家庭もあるという意見が出ました。';access.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';

  const p15=f.passages.find(x=>x.id==='V11-B12-G3-015');if(!p15)throw new Error('R14 semantic sync: G3-015 missing');
  const a15=[...(p15.questions||[]),...(p15.questionSetB||[])];
  const lighting=a15.find(x=>x.evidence==='Apartment residents used the park more often in the evening and asked for brighter path lighting.');if(!lighting)throw new Error('R14 semantic sync: G3-015 lighting inference missing');
  lighting.evidence='Apartment residents used the park more often in the evening and asked for brighter path lighting, a pattern that had barely appeared in the first results.';lighting.evidenceJp='集合住宅の住民は夕方に公園を使う割合が高く、通路を明るくしてほしいという希望も多く、最初の結果にはほとんど現れていませんでした。';lighting.reason='集合住宅の追加調査で初めて強く現れた夕方利用・照明要望と、旧地図でその住民が抜けていたことを結び付けます。';lighting.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';

  const p16=f.passages.find(x=>x.id==='V11-B12-G3-016');if(!p16)throw new Error('R14 semantic sync: G3-016 missing');
  const a16=[...(p16.questions||[]),...(p16.questionSetB||[])];
  const roomCap=a16.find(x=>x.evidence==='Room B was heated and held thirty-five.');if(!roomCap)throw new Error('R14 semantic sync: G3-016 room-capacity inference missing');
  roomCap.evidence='Hall A was heated and held eighty people, Room B was heated and held thirty-five, and the outdoor stage held 120 but had no heating.';
  roomCap.evidenceJp='Aホールは暖房があり定員80人、B室は暖房があり定員35人、屋外ステージは120人入れますが暖房はありません。';
  roomCap.reason='B室の定員35人を、同じ正本文に示された部屋条件全体から確認し、60人を入れると25人超過すると推論します。';
  roomCap.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';
  return f;
}
if(typeof module!=='undefined'&&module.exports)module.exports=syncR14;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R14;if(f)syncR14(f);}
