(function finalizeV11Batch04Grade2Notes(){
'use strict';
const gloss={
'activity':'活動','fact':'事実','guesses':'推測','instead':'代わりに','message':'メッセージ','nobody':'だれも〜ない','noisy':'騒がしい','pieces':'いくつかの部分','repeating':'繰り返して','shared':'共有した','shown':'示された','train':'電車','usual':'いつもの','whole':'全体の',
'comparing':'比べて','counted':'数えた','counting':'数えること','drops':'しずく','experiment':'実験','honestly':'正直に','marked':'印をつけた','observations':'観察結果','observe':'観察する','organized':'整理した','parts':'部分','prepared':'準備した','pretending':'〜のふりをして','rain':'雨','raindrops':'雨粒','rainy':'雨の','recorded':'記録した','results':'結果','science':'科学','simple':'簡単な','sky':'空','strong':'強い','sunlight':'日光','sunny':'晴れた','visible':'見える','without':'〜なしで',
'address':'住所','below':'下に','beside':'〜のそばに','button':'ボタン','correct':'正しい','document':'文書','email':'メール','file':'ファイル','final':'最終の','finger':'指','forgotten':'忘れられた','messages':'メッセージ','part':'部分','prevented':'防いだ','reminded':'思い出させた','report':'報告・レポート','screen':'画面','version':'版・バージョン',
'choices':'選択肢','easily':'簡単に','included':'含めた','negative':'否定的な','noticed':'気づいた','opinions':'意見','positive':'肯定的な','possible':'可能な','push':'押す','quiet':'静かな','rewrote':'書き直した','seemed':'〜のように思えた','several':'いくつかの','space':'場所・空間','toward':'〜の方へ',
'afterward':'その後','chair':'いす','empty':'空の','fifteen':'15','nearby':'近くの','project':'課題','sat':'座った','smoothly':'順調に',
'easier':'より簡単な','explanation':'説明','footsteps':'足音','method':'方法','point':'点・要点','real':'本当の','safer':'より安全な','visitor':'訪問者','visitors':'訪問者たち',
'already':'すでに','described':'説明した','description':'説明','item':'項目','key':'かぎ・重要な点','keys':'かぎ・重要な点','lost':'なくした','matched':'一致した','returned':'戻った','search':'探す・検索','searching':'探して','shoes':'靴',
'air':'空気','coach':'コーチ','corner':'角','dried':'乾かした','dry':'乾いた','easy':'簡単な','extra':'追加の','folder':'フォルダー','outdoor':'屋外の','rained':'雨が降った','reach':'届く','reached':'届いた・着いた','returning':'戻ること','separating':'分けて','until':'〜まで','water':'水','wet':'ぬれた',
'actions':'行動','chairs':'いす','classroom':'教室','continued':'続けた','drew':'描いた','enough':'十分な','happens':'起こる','imagined':'想像した','path':'道筋','pointed':'指し示した','similar':'似ている','unsure':'確信がない','used':'使った',
'actual':'実際の','aloud':'声に出して','appeared':'現れた・表示された','changes':'変更点','changing':'変えている','check':'確認する','checked':'確認した','complete':'完全な・完成させる','contents':'内容','copy':'写し・コピー','corrected':'訂正した','date':'日付','files':'ファイル','group':'グループ','guessing':'推測して','include':'含める','paragraph':'段落','title':'題名',
'canceling':'取り消すこと','changed':'変更した','confusion':'混乱','discussed':'話し合った','dish':'料理','everyone':'みんな','food':'食べ物','seasonings':'調味料','shopping':'買い物','steps':'手順','suggested':'提案した','together':'一緒に','vegetable':'野菜','vegetables':'野菜',
'absent':'欠席の','afternoon':'午後','cause':'原因','match':'合う','minutes':'分','players':'選手','practice':'練習','practiced':'練習した','roles':'役割','sick':'病気の','unfamiliar':'不慣れな','usually':'たいてい','voices':'声',
'interesting':'興味深い','letters':'文字','main':'主な','notice':'気づく・掲示','result':'結果','shortened':'短くした','starting':'始めること','wall':'壁',
'captions':'説明文・キャプション','compare':'比べる','compared':'比べた','connected':'つないだ','copied':'写した','dates':'日付','device':'機器','display':'表示','exhibit':'展示物','exhibits':'展示物','let':'〜させる','mentioned':'述べた','museum':'博物館','previous':'前の','sign':'標識・表示','skipped':'飛ばした','topic':'話題','unavailable':'利用できない','website':'ウェブサイト',
'area':'地域・場所','bicycles':'自転車','blocked':'ふさがれた','choice':'選択','chose':'選んだ','construction':'工事','joined':'加わった','map':'地図','mapped':'地図に示した','phone':'電話','rode':'乗った','side':'側','solution':'解決策','stopped':'止まった','street':'通り','wide':'幅が広い',
'borrowed':'借りた','buttons':'ボタン','hard':'難しい','math':'数学','normally':'通常は','note':'メモ','partner':'相手','pressed':'押した','someone':'だれか','trusting':'信頼して','unclear':'不明確な','weak':'弱い',
'assigned':'割り当てられた','checking':'確認すること','colors':'色','conflicts':'重なり・衝突','form':'用紙・形式','hidden':'隠れた','obvious':'明らかな','overlaps':'重なり','period':'時間帯・期間','posted':'掲示した','rebuilt':'作り直した','row':'行','schedule':'予定','volunteer':'ボランティア','volunteers':'ボランティアたち',
'reading':'読むこと','nighttime':'夜','festival':'祭り','port':'港','mud':'泥','divided':'分けられた','protect':'守る','local people':'地元の人々','swallowed':'飲み込んだ','smell':'におい','further':'さらに遠く','leaf':'葉','flood':'洪水','filtered':'ろ過した','insects':'昆虫','sealed':'密閉した','threatened':'おびやかした'
};
const grade2=[...(window.V11_BATCH04_G2_PASSAGES||[])];
let replaced=0,unresolved=[];
for(const p of grade2){p.notes=Array.isArray(p.notes)?p.notes:[];for(const n of p.notes){if(!n||!n.english||!String(n.japanese||'').includes('最終注整理対象'))continue;const key=String(n.english).replace(/[’]/g,"'").toLowerCase();if(gloss[key]){n.japanese=gloss[key];n.source='v11 Batch04 grade2 final context gloss 20260828';replaced++;}else unresolved.push({id:p.id,english:n.english});}}
window.V11_BATCH04_G2_NOTE_FINALIZE_STATE={version:'20260828-g2-final',passages:grade2.length,replaced,unresolved,ready:grade2.length===17&&unresolved.length===0};
})();
