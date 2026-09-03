(function repairV11Batch02UnitSafe(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;
if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 draft missing before unit-safe repair');
const B={
 'サンシャイン|1|PROGRAM 10-2':[
  ['Yesterday, the theater was quiet.','昨日、劇場は静かでした。'],
  ['My friend was at the theater with me.','友達は私といっしょに劇場にいました。'],
  ['We watched a movie.','私たちは映画を見ました。'],
  ['The movie was interesting.','その映画はおもしろかったです。'],
  ['I was not tired.','私は疲れていませんでした。'],
  ['My friend was sleepy.','友達は眠そうでした。'],
  ['We had a good time.','私たちは楽しい時間を過ごしました。'],
  ['After the movie, we talked about school.','映画のあと、私たちは学校について話しました。'],
  ['We went home together.','私たちはいっしょに家へ帰りました。'],
  ['My house was not far from the theater.','私の家は劇場から遠くありませんでした。'],
  ['I was happy after the movie.','私は映画のあと、うれしかったです。'],
  ['Yesterday, the theater was busy.','昨日、劇場は混んでいました。']
 ],
 'ニューホライズン|1|Unit 10-2':[
  ['Yesterday, I looked at an album.','昨日、私はアルバムを見ました。'],
  ['I saw a picture in the album.','私はアルバムの中に写真を見ました。'],
  ['The picture was from a chorus contest.','その写真は合唱コンクールのものでした。'],
  ['The picture can bring back a good memory.','その写真はよい思い出をよみがえらせることがあります。'],
  ['I remember the contest.','私はそのコンクールを覚えています。'],
  ['Then, I had a break.','それから、私は休憩しました。'],
  ['I saw my friend on my way to school.','学校へ行く途中で友達に会いました。'],
  ['My friend also had an album.','友達もアルバムを持っていました。'],
  ['We looked at one picture together.','私たちはいっしょに1枚の写真を見ました。'],
  ['We talked about the memory.','私たちはその思い出について話しました。'],
  ['It was a good memory for us.','それは私たちにとってよい思い出でした。'],
  ['I saw the picture, and my heart can beat fast.','私はその写真を見ました。そして、私の心臓は速くどきどきすることがあります。']
 ],
 'サンシャイン|2|PROGRAM 8-3':[
  ['Our class has a project about old tin and wood.','私たちのクラスには古いブリキと木材についてのプロジェクトがあります。'],
  ['A box is filled with old tin and wood.','箱は古いブリキと木材でいっぱいです。'],
  ['We want to make the most of the old material.','私たちは古い材料を最大限に活用したいです。'],
  ['The tin is so thin that we can fold it.','ブリキはとても薄いので、私たちはそれを折ることができます。'],
  ['We make a small badge from the tin.','私たちはブリキから小さなバッジを作ります。'],
  ['We make a small figure from the wood.','私たちは木材から小さな人形を作ります。'],
  ['Each badge has a peace message.','それぞれのバッジには平和のメッセージがあります。'],
  ['The project is known to our class.','そのプロジェクトは私たちのクラスに知られています。'],
  ['After the project, we receive one badge.','プロジェクトのあと、私たちはバッジを1つ受け取ります。'],
  ['I wear the badge at school.','私は学校でそのバッジを身につけます。'],
  ['We can make more from the old material.','私たちはその古い材料からさらに作ることができます。'],
  ['We think this is a good way to use old tin and wood.','私たちはこれは古いブリキと木材を使うよい方法だと思います。']
 ],
 'ニューホライズン|2|Unit 7-4':[
  ['Recently, I saw a beautiful sunrise at the mountain.','最近、私は山で美しい日の出を見ました。'],
  ['A cloud was over the mountain.','山の上には雲がありました。'],
  ['I left early and started to climb.','私は早く出発して登り始めました。'],
  ['Near the crater, I saw a tourist on the trail.','噴火口の近くで、小道にいる観光客を見ました。'],
  ['More and more people visit the site.','ますます多くの人がその遺産を訪れます。'],
  ['Sometimes they leave a large amount of trash.','時には彼らはたくさんのごみを残します。'],
  ['A cleanup campaign can help the mountain.','清掃キャンペーンは山を助けることができます。'],
  ['People list the problems before the cleanup.','人々は清掃の前に問題をリストにします。'],
  ['The trail must stay safe and clean.','小道は安全で清潔なままでなければなりません。'],
  ['A bath near the mountain needs clean water.','山の近くの浴室にはきれいな水が必要です。'],
  ['We want to protect this site forever.','私たちはこの遺産を永遠に守りたいです。'],
  ['I hope every tourist can enjoy the mountain.','すべての観光客が山を楽しめることを願います。']
 ],
 'サンシャイン|3|PROGRAM 7-3':[
  ['An inventor can imagine a powerful robot for society.','発明家は社会のための強力なロボットを想像できます。'],
  ['The robot can lift a heavy box.','そのロボットは重い箱を持ち上げることができます。'],
  ['It can connect with a person who lives alone.','それは一人で暮らす人とつながることができます。'],
  ['A person may wish for someone to talk with.','人は話し相手がほしいと願うことがあります。'],
  ['The robot can help shrink loneliness.','そのロボットは孤独を減らす助けができます。'],
  ['People can get along with a robot and with each other.','人々はロボットとも、おたがいとも仲よくやっていけます。'],
  ['The inventor can take part in a meeting about robots.','発明家はロボットについての会議に参加できます。'],
  ['A document can explain the purpose of the robot.','文書はロボットの目的を説明できます。'],
  ['A password can protect the robot system.','パスワードはロボットの仕組みを守ることができます。'],
  ['The robot can shake hands with a person.','そのロボットは人と握手できます。'],
  ['Rather, the important point is how people use technology.','むしろ、大切な点は人々が技術をどう使うかです。'],
  ['A useful robot can connect people in society.','役立つロボットは社会の中で人々をつなぐことができます。']
 ],
 'ニューホライズン|3|Unit 6-4':[
  ['A person can sell a coat in the open air.','人は屋外でコートを売ることができます。'],
  ['One shop sold a coat yesterday.','ある店は昨日コートを売りました。'],
  ['Trade can support daily life.','貿易は日々の生活を支えることができます。'],
  ['In fact, a country can depend on another country.','実際、ある国は別の国に依存することがあります。'],
  ['A third country can import a product.','3番目の国は製品を輸入できます。'],
  ['Water can surround an island.','水は島を囲むことがあります。'],
  ['People in different places are interdependent.','異なる場所の人々は相互依存しています。'],
  ['There is one exception in this trade.','この貿易には1つの例外があります。'],
  ['Trade can go beyond a border.','貿易は国境を越えることができます。'],
  ['This relationship is quite important for survival.','この関係は生存にとってかなり重要です。'],
  ['We encourage a student to study trade.','私たちは生徒に貿易を学ぶよう励まします。'],
  ['A daily relationship can connect people.','日々の関係は人々をつなぐことができます。'],
  ['I think trade can support life beyond a border.','私は貿易が国境を越えて生活を支えられると思います。']
 ]
};
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until)\b/gi,'/ $1');}
for(let pi=0;pi<ps.length;pi++){
 const p=ps[pi], key=`${p.textbook}|${p.grade}|${p.section}`, bank=B[key];
 if(!bank)throw new Error('No audited unit-safe bank for '+key);
 const arcEn=p.sentences[0], arcJp=p.slashRows&&p.slashRows[0]?p.slashRows[0].jp:'';
 const shift=pi%bank.length;
 const selected=[];
 for(let i=0;i<bank.length;i++)selected.push(bank[(i+shift)%bank.length]);
 const rows=[[arcEn,arcJp],...selected];
 p.sentences=rows.map(r=>r[0]);
 p.fullTranslation=rows.map(r=>r[1]).join('');
 p.slashRows=rows.map(r=>({en:slash(r[0]),jp:r[1]}));
 const qrows=rows.slice(0,10);
 const qs=qrows.map((r,i)=>({prompt:`${i+1}. 本文の内容に合う英文を一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`本文の第${i+1}文が直接の根拠です。`}));
 p.questions=qs.slice(0,5);
 p.questionSetB=qs.slice(5,10);
 p.auditNote+=' Generic cross-unit padding removed; audited same-unit sentence bank applied as chronology repair pass 1. Story-specific arc sentence remains for next violation-focused rewrite.';
}
window.V11_BATCH02_UNIT_SAFE_REPAIR_STATE={version:'20260828-pass1',count:ps.length,registered:false,keptStoryArc:true,replacedGenericPadding:true};
})();