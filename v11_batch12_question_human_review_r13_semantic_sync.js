function syncR13(f){
  'use strict';
  if(!f||!Array.isArray(f.passages))return f;
  const p9=f.passages.find(x=>x.id==='V11-B12-G3-009');if(!p9)throw new Error('R13 semantic sync: G3-009 missing');
  const a9=[...(p9.questions||[]),...(p9.questionSetB||[])];
  const rope=a9.filter(x=>x.evidence==='Some fishing rope appeared near the working harbor but not near the swimming area.');
  if(rope.length!==2)throw new Error('R13 semantic sync: expected two harbor-rope questions, got '+rope.length);
  for(const q of rope){q.evidence='The later counts were much lower, and some fishing rope appeared near the working harbor but not near the swimming area.';q.evidenceJp='その後の数はずっと少なく、漁港近くでは漁網の一部が見つかりましたが、遊泳区域では見つかりませんでした。';q.humanReview='HUMAN_REVIEW_R13_SEMANTIC_SYNC';}
  const p10=f.passages.find(x=>x.id==='V11-B12-G3-010');if(!p10)throw new Error('R13 semantic sync: G3-010 missing');
  const a10=[...(p10.questions||[]),...(p10.questionSetB||[])];
  const shelf=a10.filter(x=>x.evidence==='The translators checked the entrance and found two shelves, one beside the reception table and one near the emergency door.'||x.evidence==='Only the shelf beside reception held visitor slippers.');
  if(shelf.length!==2)throw new Error('R13 semantic sync: expected two shelf-layout questions, got '+shelf.length);
  for(const q of shelf){q.evidence='The translators checked the entrance and found two shelves, one beside the reception table and one near the emergency door. Only the shelf beside reception held visitor slippers.';q.evidenceJp='翻訳チームが入口を確認すると、受付の横と非常口の近くに二つの棚があり、来客用スリッパがあるのは受付横だけでした。';q.humanReview='HUMAN_REVIEW_R13_SEMANTIC_SYNC';}
  const bg=a10.find(x=>x.questionType==='CONTEXT_WORD'&&x.prompt&&x.prompt.includes('background knowledge'));if(!bg)throw new Error('R13 semantic sync: background-knowledge question missing');
  bg.evidence='The Japanese notice made sense to regular students because everyone already knew the entrance layout, but the English version had to work for people without that background knowledge.';bg.evidenceJp='日本語案内は校内の配置を知っている普段の生徒には通じますが、英語版はその知識のない人にも分かる必要があります。';bg.reason='background knowledgeを、普段の生徒が知る入口配置と、初めて来る人が持たない知識の対比から特定します。';bg.humanReview='HUMAN_REVIEW_R13_SEMANTIC_SYNC';
  const test=a10.find(x=>x.questionType==='GIST'&&x.prompt&&x.prompt.includes('場所を示す案内'));if(!test)throw new Error('R13 semantic sync: visitor-test GIST missing');
  test.evidence='They then tested the new version with five students who had never attended the event. All five chose the correct shelf.';test.evidenceJp='初めてイベントへ来る五人の生徒に試すと、全員が正しい棚を選べました。';test.reason='現場確認だけでなく、初参加者5人の実利用テストで全員が正しい棚を選べたことまでを根拠に一般化します。';test.humanReview='HUMAN_REVIEW_R13_SEMANTIC_SYNC';
  return f;
}
if(typeof module!=='undefined'&&module.exports)module.exports=syncR13;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R13;if(f)syncR13(f);}
