module.exports=function syncR8(r){
  const byId=new Map(r.passages.map(p=>[p.id,p]));
  const p1=byId.get('V11-B12-G2-001');
  for(const q of [...p1.questions,...p1.questionSetB]){
    if(q.evidenceJp==='4分以上待つ生徒はいなくなり、どちらのグループも十分に水を飲めました。') q.evidenceJp='4分を超えて待つ生徒はいなくなり、どちらのグループも十分に水を飲めました。';
    if(q.evidenceJp==='翌日、もう一度待ち時間を測ると、4分以上待つ生徒はいなくなり、どちらのグループも十分に水を飲めました。') q.evidenceJp='翌日、もう一度待ち時間を測ると、4分を超えて待つ生徒はいなくなり、どちらのグループも十分に水を飲めました。';
  }
  const p2=byId.get('V11-B12-G2-002');
  for(const q of [...p2.questions,...p2.questionSetB]) if(q.evidenceJp==='クラスはその位置を二時間の授業で試しました。') q.evidenceJp='クラスはその位置を二回の授業で試しました。';
  const p4=byId.get('V11-B12-G2-004');
  const oldEn='The club compared sunset times for September and October and changed its rule: from October, lights would be checked before every evening ride, and the group would leave ten minutes earlier.';
  const newEn='The club compared sunset times for September and late October and changed its rule from that week on: lights would be checked before every evening ride, and the group would leave ten minutes earlier.';
  const oldJp='部員は9月と10月の日没時刻を比べ、10月からは夕方の走行前に毎回ライトを確認し、10分早く出発することにしました。';
  const newJp='部員は9月と10月下旬の日没時刻を比べ、その週からは夕方の走行前に毎回ライトを確認し、10分早く出発することにしました。';
  for(const q of [...p4.questions,...p4.questionSetB]){if(q.evidence===oldEn) q.evidence=newEn;if(q.evidenceJp===oldJp) q.evidenceJp=newJp;}
  return r;
};
