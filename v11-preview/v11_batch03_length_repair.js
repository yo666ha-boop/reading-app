(function repairV11Batch03Length(){
'use strict';
const ps=[...(window.V11_BATCH03_DRAFT_G2_PASSAGES||[]),...(window.V11_BATCH03_DRAFT_G3_PASSAGES||[])];if(ps.length!==33)throw new Error('Batch03 G2/G3 drafts missing');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although)\b/gi,'/ $1');}
const A={
'V11-SS-G2-P8-3-019':[['We also wrote a small label for each group so the materials would not be mixed again.','材料がまた混ざらないよう、それぞれのグループに小さなラベルも書きました。']],
'V11-SS-G2-P8-3-020':[['My partner said the changed shape made the badge more interesting than our first drawing.','相手は、変わった形のおかげで最初の絵よりバッジがおもしろくなったと言いました。']],
'V11-SS-G2-P8-3-022':[['The unused middle piece was saved for a future class project.','使わなかった中央の部分は今後のクラス作品のために取っておきました。'],['Both groups wrote their names on the pieces before returning to work.','両方の班は作業に戻る前に、それぞれの板に名前を書きました。']],
'V11-SS-G2-P8-3-023':[['I tested the words by holding the paper at the same distance as the finished badge.','完成したバッジと同じくらいの距離で紙を持ち、言葉の見え方を確かめました。'],['That small check confirmed that the shorter message was easier to read.','その小さな確認で、短いメッセージのほうが読みやすいと確かめられました。']],
'V11-SS-G2-P8-3-024':[['We used separate cloths for different materials and kept the work area clear.','材料ごとに別の布を使い、作業場所をきれいに保ちました。'],['By the time we began making things, everyone knew which pieces were ready.','物作りを始めるころには、どの材料が使える状態か全員が分かっていました。']],
'V11-NH-G2-U7-4-019':[['We also removed a small piece of trash that was caught under a nearby rock.','近くの岩の下にはさまっていた小さなごみも取り除きました。']],
'V11-NH-G2-U7-4-020':[['While we waited, we talked quietly about how quickly mountain weather can change.','待っている間、山の天気がどれほど速く変わることがあるか静かに話しました。'],['That conversation made the reason for stopping easier to understand.','その会話で、なぜ止まる必要があったのか理解しやすくなりました。']],
'V11-NH-G2-U7-4-023':[['They also wrote the refill time on a small sheet so the next volunteers would know what had been done.','次のボランティアに作業内容が分かるよう、補充した時刻を小さな紙に書きました。'],['That note made the simple refill plan easier to continue.','そのメモで簡単な補充計画を続けやすくなりました。']],
'V11-NH-G2-U7-4-024':[['Before leaving, each group checked that no marked area had been forgotten.','出発前に、それぞれの班が印をつけた場所を忘れていないか確認しました。'],['This final check made the next cleanup easier to plan.','その最後の確認で、次の清掃を計画しやすくなりました。']],
'V11-NH-G2-U7-4-025':[['The tourist also asked where the cleanup bags were taken after the campaign.','旅行者は清掃活動後にごみ袋がどこへ運ばれるのかもたずねました。']],
'V11-NH-G2-U7-4-026':[['We agreed that the slower safe climb had still given us a morning worth remembering.','安全にゆっくり登ったことでも、十分思い出に残る朝になったと私たちは意見が一致しました。']],
'V11-NH-G2-U7-4-027':[['We added the new information to our class record before returning to school.','学校へ戻る前に、新しい情報をクラスの記録に加えました。']],
'V11-SS-G3-P7-3-022':[['After the test, the team recorded the safer movement settings in its project document.','テスト後、班はより安全な動きの設定をプロジェクト文書に記録しました。']],
'V11-SS-G3-P7-3-026':[['We also recorded the cause so the same connection problem would be easier to find next time.','次に同じ接続問題を見つけやすくするため、原因も記録しました。']],
'V11-NH-G3-U6-4-021':[['We then added the customer at the end of the diagram and discussed how payment moved back through the chain.','それから図の最後に客を加え、支払いが流れを逆にどう動くか話し合いました。'],['This made the relationship look less like a straight line and more like a continuing exchange.','そのことで、関係は単なる一直線ではなく続く交換のように見えました。']],
'V11-NH-G3-U6-4-023':[['We wrote one sentence under each product explaining whether crossing a border was necessary for its story.','それぞれの製品の下に、国境を越えることがその流れに必要かを説明する一文を書きました。']],
'V11-NH-G3-U6-4-024':[['The exercise also made us ask which connections were essential and which could be replaced more easily.','その活動から、どのつながりが不可欠で、どれならより簡単に代えられるかも考えました。']]
};
let changed=0,added=0;for(const p of ps){const rows=A[p.id];if(!rows)continue;for(const [en,jp] of rows){p.sentences.push(en);p.fullTranslation+=jp;p.slashRows.push({en:slash(en),jp});added++;}p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.auditNote+=' Batch03 length repair added story-specific content; target band unchanged.';changed++;}
if(changed!==17)throw new Error('Batch03 length repair changed '+changed);window.V11_BATCH03_LENGTH_REPAIR_STATE={changed,added,registered:false};
})();