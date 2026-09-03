module.exports=function syncR7(r){
  const p=r.passages.find(x=>x.id==='V11-B12-G1-016');
  if(!p) throw new Error('R7 G1-016 missing');
  const freshEn='Because the mistake was found early, the class could record the mix-up and continue the observation without assuming that Cup B had stayed by the north window all day.';
  const freshJp='早く間違いに気づいたので、その入れ替わりを記録し、Bが一日中北側の窓にあったと決めつけずに観察を続けることができました。';
  for(const q of [...p.questions,...p.questionSetB]){
    if(q.evidence && q.evidence.startsWith('Because the mistake was found early,')){
      q.evidence=freshEn;
      q.evidenceJp=freshJp;
      if(q.questionType==='GIST'){
        q.answer='入れ替わりを記録し、Bが一日中北側にあったと決めつけずに観察を続けられたからです。';
        q.reason='早期発見によって、誤った条件を事実として扱わず記録に残せた点を確認します。';
      }
      if(q.questionType==='INFERENCE'){
        q.answer='Bが一日中北側にあったと誤って記録・解釈し、光条件の比較を誤る可能性がありました。';
        q.reason='本文が「一日中北側にあったと決めつけない」ことを明示しているため、その逆の誤りを本文範囲で推論できます。';
      }
    }
  }
  return r;
};
