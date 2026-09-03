function syncR11(f){
  'use strict';
  if(!f || !Array.isArray(f.passages)) return f;
  const p=f.passages.find(x=>x.id==='V11-B12-G3-004');
  if(!p) throw new Error('R11 semantic sync: G3-004 missing');
  const all=[...(p.questions||[]),...(p.questionSetB||[])];

  const plan=all.find(x=>x.prompt&&x.prompt.includes('診療所での活動と帰路'));
  if(!plan) throw new Error('R11 semantic sync: visit-plan question missing');
  plan.answer='8時45分に島へ着き、9時15分ごろに始め、約90分後の10時45分ごろに終えて、昼食後13時40分の便で戻れます。';
  plan.evidence='The 8:10 ferry arrived at 8:45, so the group could walk to the clinic and begin around 9:15. After about ninety minutes, they could finish around 10:45, eat lunch near the port, and take the 13:40 ferry back.';
  plan.evidenceJp='8時10分の便なら8時45分に到着し、歩いて診療所へ行けば9時15分ごろに始められます。約90分のインタビューを10時45分ごろに終え、港近くで昼食を取り、13時40分の便で戻れます。';
  plan.reason='往路・約90分の訪問・復路を、修正後の9時15分開始と10時45分終了で一続きに確認します。';
  plan.humanReview='HUMAN_REVIEW_R11_SEMANTIC_SYNC';

  const bus=all.find(x=>x.prompt&&x.prompt.includes('14時35分のバス'));
  if(!bus) throw new Error('R11 semantic sync: 14:35-bus question missing');
  bus.answer='フェリーが14時15分に港へ着くため、14時35分のバスまで20分あるからです。';
  bus.evidence='That ferry reached the city harbor at 14:15, leaving twenty minutes before the 14:35 bus.';
  bus.evidenceJp='その便は14時15分に市の港へ着き、14時35分のバスまで20分あります。';
  bus.reason='13時40分便の到着14時15分と、14時35分発の帰りバスの20分差を資料と本文の両方から確認します。';
  bus.humanReview='HUMAN_REVIEW_R11_SEMANTIC_SYNC';

  const exactJp='一つの時刻表だけでは答えは出ませんでした。移動時間、診療所の条件、天候、帰りのバスを結びつけて初めて実行可能な計画になりました。';
  const integrated=all.filter(x=>x.evidenceJp==='一つの時刻表だけでは答えは出ず、移動時間、診療所の条件、天候、帰りのバスを結びつけて初めて実行可能な計画になりました。');
  if(integrated.length!==2) throw new Error('R11 semantic sync: expected two integrated-evidence questions, got '+integrated.length);
  for(const q of integrated){q.evidenceJp=exactJp;q.humanReview='HUMAN_REVIEW_R11_SEMANTIC_SYNC';}
  return f;
}
if(typeof module!=='undefined'&&module.exports) module.exports=syncR11;
if(typeof window!=='undefined'){
  const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R11;
  if(f) syncR11(f);
}
