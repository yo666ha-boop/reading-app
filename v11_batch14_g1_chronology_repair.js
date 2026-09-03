const fs=require('fs');
const path='v11_batch14_g1_body_draft.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const fixes={
'V11-B14-G1-001':{
 body:[['She needed the umbrella that her class had borrowed for an outdoor lesson.','She needed her class umbrella for an outdoor lesson.']],
 jp:[['ミナは、屋外授業のために自分のクラスが借りた傘を必要としていました。','ミナは、屋外授業で自分のクラスが使う傘を必要としていました。']]
},
'V11-B14-G1-002':{
 body:[['There were two school bands, so Ren did not know who needed the note.','There were two school bands, so Ren did not know the right group for the note.']],
 jp:[['学校には二つの音楽グループがあったので、レンには誰のメモか分かりませんでした。','学校には二つの音楽グループがあったので、レンにはどちらのグループのメモか分かりませんでした。']]
},
'V11-B14-G1-004':{
 body:[
  ['Kota first thought the student had brought water inside.','Kota first thought the student brought water inside.'],
  ['The librarian came back and explained that rain had come through the open window that morning.','The librarian came back. She said rain came through the open window that morning.'],
  ['She had cleaned the floor but had not finished the corner.','She cleaned most of the floor, but the corner was still wet.'],
  ['Kota was glad that he had checked the area before blaming anyone.','Kota was glad. He checked the area first and did not blame anyone.']
 ],
 jp:[
  ['司書が戻ってきて、その朝、開いていた窓から雨が入ったのだと説明しました。床は掃除したものの、隅の部分がまだ終わっていませんでした。','司書が戻ってきました。司書は、その朝、開いていた窓から雨が入ったと言いました。床のほとんどは掃除しましたが、隅はまだぬれていました。'],
  ['誰かを責める前に周りを確かめてよかったとコウタは思いました。','コウタはほっとしました。先に周りを確認し、誰かを責めずにすみました。']
 ]
},
'V11-B14-G1-006':{
 body:[['Haru found the marker on the floor, but he did not know which pot it belonged to.','Haru found the marker on the floor, but the right pot was not clear.']],
 jp:[['ハルは床で札を見つけましたが、どの鉢のものか分かりませんでした。','ハルは床で札を見つけましたが、どの鉢に戻すべきかはっきりしませんでした。']]
},
'V11-B14-G1-007':{
 body:[
  ['It said that students returning books for the reading week could come between 1:00 and 1:15.','It said, “Reading Week book return: 1:00-1:15.”'],
  ['A small desk bell was used when the return box was full.','It also said, “Ring the small desk bell when the return box is full.”'],
  ["She also noticed that the bell stopped as soon as the empty box arrived, which matched the notice exactly.",'The empty box arrived, and the bell stopped. This matched the notice exactly.']
 ],
 jp:[
  ['図書室のドアの横の掲示を見ると、読書週間の本を返す生徒は1時から1時15分の間に来られると書かれていました。また、返却箱がいっぱいになったときには小さな卓上ベルを使うとも書かれていました。','図書室のドアの横の掲示には「読書週間の本の返却：1時〜1時15分」とありました。さらに「返却箱がいっぱいになったら小さな卓上ベルを鳴らしてください」と書かれていました。'],
  ['また、空の箱が届くとすぐベルが鳴らなくなり、その様子も掲示の説明とぴったり合っていました。','空の箱が届くとベルは止まりました。この様子も掲示の説明とぴったり合っていました。']
 ]
},
'V11-B14-G1-008':{
 body:[
  ['Riku was asked to give out English worksheets.','The teacher asked Riku to give out English worksheets.'],
  ['The teacher had written, ‘Today: pages 32-33. Next class: pages 34-35.’','On the board, he saw, ‘Today: pages 32-33. Next class: pages 34-35.’'],
  ['A small page number had stopped a simple mistake.','A small page number stopped a simple mistake.']
 ],
 jp:[
  ['リクは英語のプリントを配るよう頼まれました。','先生はリクに英語のプリントを配るよう頼みました。'],
  ['黒板を見ると「今日：32〜33ページ。次の授業：34〜35ページ」と書かれていました。','黒板には「今日：32〜33ページ。次の授業：34〜35ページ」とありました。']
 ]
},
'V11-B14-G1-009':{
 body:[['Three students had worked there that day.','Three students worked there that day.']],
 jp:[]
},
'V11-B14-G1-010':{
 body:[
  ['Toma understood that the clocks had been changed on purpose to help the student staff prepare early.','Toma understood the reason. The clocks were ten minutes fast on purpose, so the student staff could prepare early.']
 ],
 jp:[['時計は生徒スタッフが早めに準備できるよう、意図的に進められているのだとトウマは分かり、そのままにしました。','トウマは理由が分かりました。生徒スタッフが早めに準備できるよう、時計をわざと10分進めていたのです。トウマは時計をそのままにしました。']]
},
'V11-B14-G1-011':{
 body:[['She worried that someone had been left off the list.','She worried because one student might not have a seat.']],
 jp:[['ユナは誰かの名前が抜けているのではないかと心配しました。','ユナは、だれか一人の席がないのではないかと心配しました。']]
},
'V11-B14-G1-013':{
 body:[
  ['One picture had no name card, and the teacher did not know who made it.','One picture had no name card, and its artist was not clear.'],
  ["It matched the week when Ken's group had worked on that theme.","It matched Ken's group week for that theme."],
  ['Emi asked Ken to look at the picture before making a new card.','Emi showed the picture to Ken before she made a new card.'],
  ['He had forgotten to write his name because the bell rang at the end of class.','He forgot to write his name because the bell rang at the end of class.'],
  ["The teacher then wrote Ken’s name in the class record too, so the picture and the record would stay together.","The teacher then wrote Ken’s name in the class record too. Now the picture and the record had the same name."]
 ],
 jp:[
  ['一枚の絵には名札がなく、先生にも誰が作ったのか分かりませんでした。','一枚の絵には名札がなく、作者がはっきりしませんでした。'],
  ['さらに新しい絵の裏の日付を確認すると、ケンのグループがそのテーマに取り組んだ週と一致しました。','さらに新しい絵の裏の日付を確認すると、そのテーマのケンのグループの週と一致しました。'],
  ['エミは新しい名札を作る前に、ケン本人にも絵を見てもらいました。','エミは新しい名札を作る前に、その絵をケンに見せました。'],
  ['先生はクラスの記録にもケンの名前を書き、作品と記録がきちんと対応するようにしました。','先生はクラスの記録にもケンの名前を書きました。これで作品と記録の名前が同じになりました。']
 ]
},
'V11-B14-G1-014':{
 body:[['He was glad that he had checked the tag and the list instead of testing the key himself.','He was glad. He checked the tag and the list, and he did not test the key himself.']],
 jp:[['自分で鍵を試すのではなく、札と一覧を確認してよかったと思いました。','ダイチはよかったと思いました。札と一覧を確認し、自分で鍵を試しませんでした。']]
},
'V11-B14-G1-015':{
 body:[
  ['She wondered if someone had put it there by mistake.','She thought, “Is this line here by mistake?”'],
  ['What first looked strange was a temporary guide around the repair area.','The line looked strange at first, but it was a temporary guide around the repair area.']
 ],
 jp:[
  ['誰かが間違って貼ったのかと思いましたが、','ミオは「これは間違いかな」と思いましたが、'],
  ['最初は不思議に見えた線は、修理場所を避けるための一時的な案内だったのです。','その線は最初は不思議に見えましたが、修理場所を避けるための一時的な案内でした。']
 ]
},
'V11-B14-G1-016':{
 body:[
  ['On Wednesday, he saw that one display book had already been returned to the normal shelf.','On Wednesday, he saw one display book on the normal shelf.'],
  ['He thought the display might have ended, so he started to move the other books too.','He thought, “Is the display over?” and started to move the other books too.'],
  ['A student had borrowed it before the display began and had returned it that morning.','A student borrowed it before the display began and returned it that morning.']
 ],
 jp:[
  ['水曜日、展示していた本の一冊がすでに普通の棚へ戻されているのを見つけました。','水曜日、展示していた本の一冊が普通の棚にあるのを見つけました。'],
  ['展示が終わったのかと思い、ほかの本も動かそうとしましたが、','ケンタは「展示は終わったのかな」と思い、ほかの本も動かそうとしましたが、']
 ]
}
};
let changed=[];
for(const p of d.passages){
 const f=fixes[p.id]; if(!f) continue;
 for(const [a,b] of f.body){ if(!p.body.includes(a)) throw new Error(`${p.id} body source not found: ${a}`); p.body=p.body.replace(a,b); }
 for(const [a,b] of f.jp){ if(!p.fullTranslation.includes(a)) throw new Error(`${p.id} jp source not found: ${a}`); p.fullTranslation=p.fullTranslation.replace(a,b); }
 p.humanSemanticReview='B14_G1_HUMAN_REVIEW_R3_CHRONOLOGY_SYNC';
 changed.push(p.id);
}
d.status='BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R3_CHRONOLOGY_REPAIRED';
fs.writeFileSync(path,JSON.stringify(d,null,2)+'\n');
fs.writeFileSync('V11_BATCH14_G1_CHRONOLOGY_REPAIR.json',JSON.stringify({batch:'V11-B14',grade:1,registered:false,officialTotal:818,changed,changedCount:changed.length,policy:'repair data; no gate weakening',status:'REPAIR_APPLIED_REAUDIT_REQUIRED'},null,2)+'\n');
console.log(`repaired ${changed.length} passages`);
