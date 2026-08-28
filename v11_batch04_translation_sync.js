(function syncV11Batch04Translations(){
'use strict';
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
if(ps.length!==50)throw new Error('Batch04 50 passages missing before translation sync');
const J={
'My cousin said, “Check the bus before we get on.”':'いとこは「乗る前にバスを確認しよう」と言いました。',
'Writing the whole name was a good choice. A familiar sound was not enough.':'名前を全部書くのはよい選択でした。聞き覚えのある響きだけでは十分ではありませんでした。',
'I first gave a long explanation to her in the hall.':'最初、私は廊下で彼女に長い説明をしました。',
'I saw that my words were difficult. She did not remember them easily.':'私は自分の説明が難しいと気づきました。彼女はそれを簡単には覚えられませんでした。',
'My mother said, “Please get one kind of noodles at a store.”':'母は「店でこの種類のめんを買ってきて」と言いました。',
'I got home, and my mother checked it.':'家に帰ると、母がそれを確認しました。',
'I read it happily, but I did not write the return date anywhere.':'私はうれしくその本を読みましたが、返す日をどこにも書きませんでした。',
'My friend asked, “Are you still reading the book?”':'友達は「まだその本を読んでいるの？」とたずねました。',
'We left under a gray sky, but it was not raining.':'空は灰色でしたが、出発したときは雨は降っていませんでした。',
'We waited for a short time. Running through heavy rain was not a good idea.':'私たちは少し待ちました。強い雨の中を走るのはよい考えではありませんでした。',
'We needed the next rule, so I explained it then.':'次のルールが必要になったので、そのときに説明しました。',
'My uncle called me during my homework.':'私が宿題をしているとき、おじから電話がかかってきました。',
'Just then, my mother said, “Please help me carry this.”':'ちょうどそのとき、母が「これを運ぶのを手伝って」と言いました。',
'He said it was fine and said, “Call again later.”':'おじは大丈夫だと言い、「あとでまた電話して」と言いました。',
'I told my uncle, “I do not have much time to talk.”':'私はおじに「長く話す時間がないんだ」と言いました。',
'A clear time helped us finish an interrupted call later.':'はっきりした時間を決めたことで、中断した電話をあとで続けられました。',
'He wanted to come, so he needed the correct day.':'彼は来たかったので、正しい日を知る必要がありました。',
'I checked one calendar. A fast answer from memory was not enough.':'私はカレンダーを一つ確認しました。記憶だけですぐ答えるのでは十分ではありませんでした。',
'We showed the destination and the price in order. People followed our help easily.':'私たちは行き先と料金を順番に示しました。人々は私たちの案内を簡単に理解できました。',
'I told my friend, “I want number three.”':'私は友達に「3番がいい」と言いました。',
'We finished, and one cleaning tool was missing.':'作業が終わると、掃除道具が一つなくなっていました。',
'We did not find it there.':'そこでは見つかりませんでした。',
'The list showed the place for each tool.':'その一覧には、それぞれの道具を置く場所が示されていました。',
'Changing the place solved the problem quickly. Repeating the same photo did not help.':'置き場所を変えると問題はすぐ解決しました。同じ写真を繰り返しても役には立ちませんでした。',
'We arrived and saw another family already using it.':'着いてみると、別の家族がすでにそこを使っていました。',
'My little brother liked that place, so he looked disappointed.':'弟はその場所が好きだったので、がっかりした様子でした。',
'My mother said, “Please leave it in the family room.”':'母は「それを家族の部屋に置いて」と言いました。',
'The name on the new package was small, so I did not see it easily.':'新しい箱の名前は小さかったので、簡単には見えませんでした。',
'A large clear name helped us tell the three similar boxes apart.':'大きくはっきりした名前のおかげで、似た三つの箱を見分けられました。',
'He came home and found his box immediately.':'彼は家に帰ると、すぐに自分の箱を見つけました。',
'The first file appeared at the top of the folder, so one student wanted to send it.':'最初のファイルがフォルダの一番上に表示されたので、一人の生徒はそれを送りたいと言いました。',
'Our captain said, “List the jobs that are still open.”':'リーダーは「まだ担当が決まっていない仕事を書き出そう」と言いました。',
'The small picture helped people notice the poster, so we kept it.':'その小さな絵は人々がポスターに気づく助けになったので、残しました。',
'We almost skipped the exhibit, but it was important for our topic.':'私たちはその展示を飛ばしそうになりましたが、私たちのテーマには重要でした。',
'Reading the captions carefully helped us continue without pretending that we heard the guide.':'説明文を注意深く読むことで、案内を聞いたふりをせずに調べ続けられました。',
'The teacher later said, “Compare your notes with the museum website at school.”':'先生はあとで「学校でメモを博物館のウェブサイトと比べなさい」と言いました。',
'We usually used the same wide road. We remembered it easily.':'私たちはいつも同じ広い道を使っていました。その道は簡単に覚えられました。',
'The street was new to us, so we chose it and rode slowly.':'その道は初めてだったので、そこを選び、ゆっくり自転車で進みました。',
'Our teacher said, “Think about things you can still observe from inside.”':'先生は「中からでも観察できることを考えなさい」と言いました。',
'I saw the word “attached” and looked below the message box.':'私は「attached」という語を見て、メッセージ欄の下を確認しました。',
'A ten-second check stopped a wrong email to my teacher. The file was not there.':'10秒の確認で、先生への誤ったメール送信を防げました。ファイルは添付されていませんでした。',
'Then our teacher asked, “Can someone easily answer ‘no’ after reading those words?”':'そのあと先生は「この言い方を読んだ人は簡単に『いいえ』と答えられるかな」とたずねました。',
'We learned an important survey rule: collect opinions and do not choose an opinion for other people.':'私たちは大切なアンケートのルールを学びました。意見を集め、ほかの人の意見をこちらで決めないことです。',
'Our teacher said, “Explain one part of our school life in simple English.”':'先生は「学校生活の一つを簡単な英語で説明しなさい」と言いました。',
'Then I thought, “Maybe the student does not understand one of my words.”':'そのとき私は「もしかすると、その生徒は私の使った語の一つが分からないかもしれない」と考えました。',
'We checked the update date, so we explained the source clearly.':'更新日を確認したので、情報源をはっきり説明できました。',
'From the experience, we learned an important point: information can look convincing, but an old date reduces its value.':'その経験から、大切なことを学びました。情報はもっともらしく見えても、日付が古いと価値が下がることがあります。',
'I collected the data, so I knew the answer, but the graph itself did not show it.':'私はデータを集めていたので答えを知っていましたが、グラフ自体にはそれが示されていませんでした。',
'I did not ask “why” after every sentence. Too many questions sound unnatural.':'私は一文ごとに「なぜ」とはたずねませんでした。質問が多すぎると不自然に聞こえます。',
'Then we asked, “Can you send the two selected photos by the end of the day?”':'それから私たちは「選んだ二枚の写真を今日中に送れますか」とたずねました。'
};
let changed=0,missing=[];
for(const p of ps){
 for(let i=0;i<(p.sentences||[]).length;i++){
   const en=p.sentences[i],jp=J[en];if(!jp)continue;
   if(!p.slashRows||!p.slashRows[i]){missing.push(p.id+':row'+i);continue;}
   p.slashRows[i].jp=jp;changed++;
 }
 p.fullTranslation=(p.slashRows||[]).map(r=>r&&r.jp||'').join('');
 p.translationSync='B04_POST_GRAMMAR_SYNC_20260828';
}
if(missing.length)throw new Error('Batch04 translation sync missing rows: '+missing.join(','));
if(changed!==50)throw new Error('Batch04 translation sync expected 50 changed rows but got '+changed);
window.V11_BATCH04_TRANSLATION_SYNC_STATE={version:'20260828-v1',count:ps.length,changed,registered:false};
})();