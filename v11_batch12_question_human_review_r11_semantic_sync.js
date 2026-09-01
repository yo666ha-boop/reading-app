(() => {
  'use strict';
  const f = window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R11;
  if (!f || !Array.isArray(f.passages)) return;
  const p = f.passages.find(x => x.id === 'V11-B12-G3-004');
  if (!p) throw new Error('R11 semantic sync: G3-004 missing');
  const all = [...(p.questions || []), ...(p.questionSetB || [])];
  const q = all.find(x => x.prompt && x.prompt.includes('14時35分のバス'));
  if (!q) throw new Error('R11 semantic sync: target question missing');
  q.answer = 'フェリーが14時15分に港へ着くため、14時35分のバスまで20分あるからです。';
  q.evidence = 'That ferry reached the city harbor at 14:15, leaving twenty minutes before the 14:35 bus.';
  q.evidenceJp = 'その便は14時15分に市の港へ着き、14時35分のバスまで20分あります。';
  q.reason = '13時40分便の到着14時15分と、14時35分発の帰りバスの20分差を資料と本文の両方から確認します。';
  q.humanReview = 'HUMAN_REVIEW_R11_SEMANTIC_SYNC';
})();
