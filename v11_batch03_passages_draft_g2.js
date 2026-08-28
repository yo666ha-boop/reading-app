(function buildV11Batch03Grade2Draft(){
'use strict';
const BATCH='V11-B03-G2-DRAFT-20260828';
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while)\b/gi,'/ $1');}
function wc(rows){return (rows.map(r=>r[0]).join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function build(id,textbook,section,baseline,title,rows,long,notes){
 const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));
 return {id,textbook,grade:'2',section,level:'STEP',title,genre:'story',batch:BATCH,sourceSectionBaselineId:baseline,targetWordBand:long?[170,210]:[115,155],wordCount:wc(rows),sentences:rows.map(r=>r[0]),fullTranslation:rows.map(r=>r[1]).join(''),slashRows:rows.map(r=>({en:slash(r[0]),jp:r[1]})),questions:qs.slice(0,5),questionSetB:qs.slice(5,10),notes:(notes||[]).map(n=>({english:n[0],japanese:n[1],kind:'unlearned_local_required',source:'v11 Batch03 G2 story-specific required note seed'})),semanticRewrite:'BATCH03_G2_STORY_SPECIFIC_20260828',registered:false,auditNote:'Batch03 G2 non-runtime authoring draft. Story-specific passage; chronology, length, question diversity, notes, cross-batch, PC/iPhone and A4 gates still required.'};
}
const SS='サンシャイン',NH='ニューホライズン',ssBase='V10-SS-G2-P8-3-001',nhBase='V10-NH-G2-U7-4-001';
const all=[
build('V11-SS-G2-P8-3-018',SS,'PROGRAM 8-3',ssBase,'Making a Badge from Scrap',[
['Our class kept small pieces of old material after a project.','私たちのクラスはプロジェクトのあと、古い材料の小さなかけらを取っておきました。'],
['One afternoon, I found a piece of tin that was still clean and useful.','ある午後、まだきれいで使えるブリキの一片を見つけました。'],
['I asked my teacher if I could make something from it.','私は先生に、それから何か作ってよいかたずねました。'],
['The teacher checked the piece first and said it was safe to use.','先生はまずその一片を確認し、安全に使えると言いました。'],
['I drew a small circle on paper and used it as a simple plan.','私は紙に小さな円を描き、簡単な計画として使いました。'],
['Then I folded the edge of the tin carefully.','それからブリキの端を注意して折りました。'],
['My friend helped me add a short peace message to the front.','友達が前面に短い平和のメッセージを加えるのを手伝ってくれました。'],
['The badge was not perfect, but it came from material that might have been thrown away.','そのバッジは完璧ではありませんでしたが、捨てられていたかもしれない材料からできました。'],
['I wore it at school the next day.','次の日、私は学校でそれを身につけました。'],
['When someone asked about it, I explained why I had reused the old tin.','だれかにたずねられたとき、古いブリキを再利用した理由を説明しました。'],
['The small badge helped me see that even a little material can have another use.','その小さなバッジのおかげで、少しの材料にも別の使い道があると分かりました。']
],false,[['scrap','余り・廃材'],['edge','端'],['reused','再利用した']]),
build('V11-SS-G2-P8-3-019',SS,'PROGRAM 8-3',ssBase,'A Box with Three Materials',[
['Our group received one box filled with old tin, wood, and paper.','私たちの班は古いブリキ、木、紙が入った箱を一つ受け取りました。'],
['At first, everything was mixed together.','最初、すべてが混ざっていました。'],
['We put the tin on one side of the table and the wood on the other side.','私たちはブリキを机の片側に、木を反対側に置きました。'],
['The paper went into a separate pile.','紙は別の山にしました。'],
['Then we checked which pieces were clean enough to use.','それから、どのかけらが使えるほどきれいか確認しました。'],
['One wooden piece had a sharp part, so we did not use it.','木の一片にはとがった部分があったので、使いませんでした。'],
['The safe wood could become a small figure.','安全な木は小さな人形にできそうでした。'],
['The thin tin could be folded into two badges.','薄いブリキは折って二つのバッジにできそうでした。'],
['We saved the clean paper for signs and notes.','きれいな紙は看板やメモのために取っておきました。'],
['Sorting the box first helped us make the most of each material.','最初に箱の中を分けたことで、それぞれの材料を最大限に活用できました。']
],false,[['separate','別の'],['pile','山'],['sharp','とがった']]),
build('V11-SS-G2-P8-3-020',SS,'PROGRAM 8-3',ssBase,'The Bent Tin Problem',[
['I was making a small badge from old tin during class.','私は授業中、古いブリキから小さなバッジを作っていました。'],
['The tin was thin, so I thought it would be easy to fold.','ブリキは薄かったので、簡単に折れると思いました。'],
['I folded one side too far, and the shape changed.','片側を折りすぎて、形が変わってしまいました。'],
['For a moment, I wanted to throw the piece away and start again.','一瞬、その一片を捨ててやり直したいと思いました。'],
['My partner stopped me and looked at the bent part.','相手が私を止め、曲がった部分を見ました。'],
['We pressed it flat slowly with a safe tool.','私たちは安全な道具を使って、ゆっくり平らにしました。'],
['The old plan no longer worked, but the material was still useful.','元の計画はもう使えませんでしたが、材料はまだ使えました。'],
['We changed the badge into a smaller design.','私たちはバッジをもっと小さなデザインに変えました。'],
['The new design used the bent line as part of its shape.','新しいデザインでは、曲がった線を形の一部として使いました。'],
['In the end, the mistake helped us make a different badge instead of wasting the tin.','最後には、その間違いのおかげでブリキを無駄にせず、違うバッジを作れました。']
],false,[['bent','曲がった'],['pressed','押した'],['wasting','無駄にすること']]),
build('V11-SS-G2-P8-3-021',SS,'PROGRAM 8-3',ssBase,'A Small Exhibition Table',[
['Our class prepared a small exhibition about reusing old materials.','私たちのクラスは古い材料の再利用について小さな展示を準備しました。'],
['We did not have a large room, so each group received one table.','大きな部屋がなかったので、それぞれの班が机を一つ使いました。'],
['Our group chose three objects: a tin badge, a wooden figure, and a paper sign.','私たちの班はブリキのバッジ、木の人形、紙の看板の三つを選びました。'],
['Before putting them on the table, we wrote where each material had come from.','机に置く前に、それぞれの材料がどこから来たか書きました。'],
['The tin had been part of an old container.','ブリキは古い容器の一部でした。'],
['The wood came from a broken class project that could not be used again in its old form.','木は壊れたクラス作品から来たもので、元の形では再利用できませんでした。'],
['The paper sign was made from the clean back of used paper.','紙の看板は使用済みの紙のきれいな裏面から作りました。'],
['We placed the objects in the order of their original materials.','私たちは元の材料の順に作品を並べました。'],
['Then we practiced a short explanation for visitors.','それから来た人への短い説明を練習しました。'],
['During the exhibition, one visitor asked why the badge still had a small mark on it.','展示中、一人の来場者がなぜバッジに小さな跡が残っているのかたずねました。'],
['I explained that the mark showed the tin had another life before becoming a badge.','私は、その跡はバッジになる前にブリキが別の役目を持っていたことを示していると説明しました。'],
['Another visitor wanted to know why we had not painted the wood.','別の来場者は、なぜ木を塗らなかったのか知りたがりました。'],
['My partner said we wanted people to see the original material clearly.','相手は、元の材料をはっきり見てもらいたかったと言いました。'],
['By the end of the day, our simple table had started many conversations.','一日の終わりまでに、私たちの簡単な展示台から多くの会話が始まりました。'],
['The exhibition taught us that explaining reuse can be as important as making the objects.','その展示から、再利用を説明することも作品を作ることと同じくらい大切だと学びました。']
],true,[['exhibition','展示'],['container','容器'],['original','元の']]),
build('V11-SS-G2-P8-3-022',SS,'PROGRAM 8-3',ssBase,'Two Uses for One Board',[
['Two groups in our class wanted the same old wooden board.','クラスの二つの班が同じ古い木の板を使いたがりました。'],
['Our group wanted it for a small sign.','私たちの班は小さな看板に使いたいと思っていました。'],
['The other group wanted it for the base of a figure.','もう一つの班は人形の台に使いたがっていました。'],
['At first, both groups thought they needed the whole board.','最初、どちらの班も板全部が必要だと思っていました。'],
['We measured the space needed for our sign.','私たちは看板に必要な大きさを測りました。'],
['The other group did the same for its figure.','もう一つの班も人形に必要な大きさを測りました。'],
['Then we saw that both projects could use smaller pieces.','すると、どちらの作品ももっと小さな板で作れると分かりました。'],
['An adult helped us divide the board safely.','大人が安全に板を分けるのを手伝ってくれました。'],
['Each group received enough wood for its project.','それぞれの班が作品に十分な木を受け取りました。'],
['Sharing the board meant that neither group had to find new material.','板を分けたことで、どちらの班も新しい材料を探す必要がありませんでした。']
],false,[['board','板'],['measured','測った'],['divide','分ける']]),
build('V11-SS-G2-P8-3-023',SS,'PROGRAM 8-3',ssBase,'The Message on the Badge',[
['I wanted to put a short peace message on a badge.','私はバッジに短い平和のメッセージを入れたいと思いました。'],
['I wrote two ideas on paper before touching the tin.','ブリキに触る前に、紙に二つの案を書きました。'],
['The first message was long and difficult to read on a small badge.','最初のメッセージは長く、小さなバッジでは読みにくいものでした。'],
['The second message used only a few words.','二つ目のメッセージは数語だけを使っていました。'],
['I asked a classmate to look at both ideas.','私はクラスメートに両方の案を見てもらいました。'],
['My classmate understood the second message immediately.','クラスメートは二つ目のメッセージをすぐ理解しました。'],
['We talked about why a clear message was important.','なぜ分かりやすいメッセージが大切か話しました。'],
['Then I chose the shorter one and placed it in the center of the badge.','それから短いほうを選び、バッジの中央に置きました。'],
['When the badge was finished, the words were easy to see.','バッジが完成すると、言葉は見やすくなっていました。'],
['Choosing fewer words made the message stronger, not weaker.','言葉を少なくしたことで、メッセージは弱くなるのではなく、より伝わりやすくなりました。']
],false,[['immediately','すぐに'],['center','中央']]),
build('V11-SS-G2-P8-3-024',SS,'PROGRAM 8-3',ssBase,'Cleaning Old Material First',[
['Our group found several old pieces of material for a reuse project.','私たちの班は再利用プロジェクトのために古い材料をいくつか見つけました。'],
['Some pieces were dusty because they had been stored for a long time.','長く保管されていたので、ほこりのついた物もありました。'],
['We wanted to start making things immediately.','私たちはすぐ作り始めたいと思いました。'],
['Our teacher told us to prepare the material safely first.','先生はまず材料を安全に準備するよう言いました。'],
['We made a simple order for the work.','私たちは作業の簡単な順番を決めました。'],
['First, we checked for sharp or broken parts.','最初に、とがった部分や壊れた部分がないか確認しました。'],
['Next, we cleaned only the pieces that were safe to keep.','次に、安全に使える物だけをきれいにしました。'],
['We put wet pieces aside until they were dry.','ぬれた物は乾くまで別に置きました。'],
['Only after that did we begin planning what to make.','そのあとになって初めて、何を作るか計画し始めました。'],
['The extra preparation took time, but it made the project safer and easier.','追加の準備には時間がかかりましたが、プロジェクトをより安全で進めやすくしました。']
],false,[['dusty','ほこりのついた'],['stored','保管された']]),
build('V11-SS-G2-P8-3-025',SS,'PROGRAM 8-3',ssBase,'From Leftovers to a Class Sign',[
['After several reuse projects, many small pieces were left on our classroom tables.','いくつかの再利用プロジェクトのあと、教室の机には小さなかけらがたくさん残りました。'],
['Most pieces were too small for the projects that had created them.','多くは、それを生んだ作品に使うには小さすぎました。'],
['At first, students put them into different boxes for later.','最初、生徒たちは後で使うため別々の箱に入れました。'],
['A week later, the boxes were still full.','一週間後も箱はいっぱいのままでした。'],
['Our teacher asked whether we could make one thing from the leftovers instead of keeping them forever.','先生は、ずっと取っておくのではなく余り物から一つ何か作れないかたずねました。'],
['We spread the safe pieces across a large table and looked at their colors and shapes.','安全なかけらを大きな机に広げ、色や形を見ました。'],
['Someone suggested making a class sign from many small parts.','だれかが多くの小さな部分からクラスの看板を作る案を出しました。'],
['We drew the letters first and placed pieces around them without using glue.','最初に文字を描き、のりを使わずにその周りへかけらを置きました。'],
['Some shapes did not fit, so we moved them to different places.','合わない形もあったので、別の場所へ動かしました。'],
['When the design looked balanced, an adult helped us fix the pieces in place.','デザインのバランスがよくなったとき、大人がかけらを固定するのを手伝ってくれました。'],
['Tin pieces reflected light, while the wood gave the sign a warm look.','ブリキのかけらは光を反射し、木は看板に温かい見た目を与えました。'],
['Small paper parts added color between them.','小さな紙の部分がその間に色を加えました。'],
['The finished sign showed many different materials from many earlier projects.','完成した看板には、以前の多くの作品から出たさまざまな材料が使われていました。'],
['We hung it near the classroom entrance.','私たちはそれを教室の入口近くに飾りました。'],
['The leftovers had not become waste; together they became something our whole class could use.','余り物はごみにならず、合わせることでクラス全体が使える物になりました。']
],true,[['leftover','余り物'],['balanced','バランスの取れた'],['reflected','反射した']]),
build('V11-NH-G2-U7-4-019',NH,'Unit 7-4',nhBase,'Trash near the Trail Sign',[
['Our cleanup group reached a large trail sign near the mountain.','私たちの清掃グループは山の近くの大きな小道の看板に着きました。'],
['Several bottles and pieces of paper were on the ground around it.','その周りの地面には何本かのボトルと紙くずがありました。'],
['The trash made the bottom of the sign hard to see.','ごみで看板の下の部分が見えにくくなっていました。'],
['We put on gloves and collected the safe trash first.','私たちは手袋をつけ、安全なごみから集めました。'],
['One student held the bag while two others looked behind the sign.','一人が袋を持ち、ほかの二人が看板の後ろを確認しました。'],
['We found more paper there and added it to the bag.','そこでも紙くずを見つけ、袋に入れました。'],
['After the ground was clear, we stepped back and looked again.','地面がきれいになったあと、少し下がってもう一度見ました。'],
['The trail information was much easier to notice.','小道の情報がずっと見つけやすくなりました。'],
['We took one photo for our cleanup record.','清掃記録のために写真を一枚撮りました。'],
['Cleaning a small area helped visitors see an important sign again.','小さな場所をきれいにしたことで、来た人が大切な看板をまた見やすくなりました。']
],false,[['gloves','手袋'],['record','記録']]),
build('V11-NH-G2-U7-4-020',NH,'Unit 7-4',nhBase,'A Cloud over the Mountain',[
['We were walking on a mountain trail when a thick cloud moved over the area.','私たちは山道を歩いているとき、厚い雲がその場所をおおいました。'],
['The view became difficult to see very quickly.','景色はすぐに見えにくくなりました。'],
['Our leader told us not to continue until we could see the trail clearly.','リーダーは小道がはっきり見えるまで進まないよう言いました。'],
['We moved to a safe rest place beside the trail.','私たちは小道のそばの安全な休憩場所へ移動しました。'],
['No one tried to hurry through the cloud.','だれも雲の中を急いで進もうとはしませんでした。'],
['We drank water and checked the weather information.','水を飲み、天気の情報を確認しました。'],
['After some time, the cloud became thinner.','しばらくすると、雲が薄くなりました。'],
['We could see the next trail sign again.','次の小道の看板がまた見えるようになりました。'],
['The leader checked the group and then allowed us to continue.','リーダーはグループを確認し、それから進むことを許しました。'],
['Waiting safely was better than taking a risk for a few minutes.','数分のために危険を冒すより、安全に待つほうがよいことでした。']
],false,[['thick','厚い'],['leader','リーダー'],['risk','危険']]),
build('V11-NH-G2-U7-4-021',NH,'Unit 7-4',nhBase,'The Full Cleanup Bag',[
['Our group started a cleanup with two large bags.','私たちの班は大きな袋二つで清掃を始めました。'],
['The first part of the trail had more trash than we expected.','小道の最初の部分には予想より多くのごみがありました。'],
['One bag became full before we reached the halfway point.','半分の地点に着く前に、一つの袋がいっぱいになりました。'],
['We did not want to carry an open bag along the trail.','開いた袋を小道で運びたくありませんでした。'],
['We tied the full bag and left it at the planned collection place.','いっぱいの袋をしばり、決められた回収場所に置きました。'],
['Then we used the second bag only for light trash.','それから二つ目の袋は軽いごみだけに使いました。'],
['Larger items were listed on our map for another group to collect safely.','大きな物は別の班が安全に回収できるよう地図に記録しました。'],
['This change helped us finish the rest of our route.','この変更で、残りのルートを終えられました。'],
['At the end, both groups compared their maps and collected the remaining items.','最後に、両方の班が地図を比べ、残った物を回収しました。'],
['A full bag changed our plan, but it did not stop the cleanup.','袋がいっぱいになって計画は変わりましたが、清掃は止まりませんでした。']
],false,[['halfway','半分の地点'],['tied','しばった'],['route','ルート']]),
build('V11-NH-G2-U7-4-022',NH,'Unit 7-4',nhBase,'Explaining the Trail Rule',[
['During a mountain visit, our group saw two tourists near a protected part of the trail.','山を訪れているとき、私たちの班は小道の保護された場所の近くで二人の旅行者を見ました。'],
['They were looking at a small side path that visitors were not supposed to use.','二人は来訪者が使うことになっていない小さな脇道を見ていました。'],
['A sign explained the rule, but the writing was partly hidden by a branch.','看板にルールが書かれていましたが、文字の一部が枝で隠れていました。'],
['One tourist asked us whether the side path led to a better view.','一人の旅行者が、その脇道はもっとよい景色へ続くのか私たちにたずねました。'],
['I pointed to the main trail and explained that the side area needed protection.','私は本道を指し、脇の場所は保護が必要だと説明しました。'],
['Walking there could damage plants and make the ground weaker.','そこを歩くと植物を傷つけ、地面を弱くする可能性がありました。'],
['My friend moved the loose branch so the posted information was easier to read.','友達が垂れた枝を動かし、掲示情報を読みやすくしました。'],
['The tourists read the sign again and chose the main trail.','旅行者たちは看板をもう一度読み、本道を選びました。'],
['They thanked us before they continued.','二人は進む前に私たちにお礼を言いました。'],
['Later, our group told a worker that the sign had been hard to see.','あとで私たちの班は、看板が見えにくかったことを係の人に伝えました。'],
['The worker said the area would be checked again.','係の人はその場所をもう一度確認すると言いました。'],
['I realized that a rule is more useful when people can understand why it exists.','ルールは、なぜあるのか理解できるとより役に立つと気づきました。'],
['Simply saying “do not go there” was not as helpful as explaining the reason.','単に「そこへ行かないで」と言うより、理由を説明するほうが役に立ちました。'],
['The short conversation helped protect the trail and helped the visitors choose safely.','短い会話が小道を守り、旅行者が安全に選ぶ助けにもなりました。']
],true,[['protected','保護された'],['damage','傷つける'],['exists','存在する']]),
build('V11-NH-G2-U7-4-023',NH,'Unit 7-4',nhBase,'Water for the Rest Area',[
['A mountain rest area was busy during a warm morning.','山の休憩場所は暖かい午前中に混んでいました。'],
['Many visitors used the clean water there.','多くの来訪者がそこで清潔な水を使いました。'],
['By noon, one water container was almost empty.','正午までに、一つの水容器がほとんど空になりました。'],
['A volunteer checked the amount and called another worker.','ボランティアが量を確認し、別の係の人を呼びました。'],
['They did not wait until the container was completely empty.','容器が完全に空になるまで待ちませんでした。'],
['Instead, they brought a second container from a safe storage place.','代わりに、安全な保管場所から二つ目の容器を運びました。'],
['One person cleaned the table while another changed the water container.','一人が机をきれいにする間、もう一人が水容器を交換しました。'],
['The work took only a short time.','作業は短い時間で終わりました。'],
['Visitors could continue to use clean water during the afternoon.','来訪者は午後も清潔な水を使い続けられました。'],
['Checking the supply early kept a small problem from becoming a larger one.','早めに備えを確認したことで、小さな問題が大きくなるのを防げました。']
],false,[['container','容器'],['supply','供給・備え'],['storage','保管場所']]),
build('V11-NH-G2-U7-4-024',NH,'Unit 7-4',nhBase,'Before the Cleanup Starts',[
['Our class joined a cleanup campaign near a mountain trail.','私たちのクラスは山道の近くの清掃活動に参加しました。'],
['Before collecting anything, we looked at a map of the area.','何かを集める前に、その場所の地図を見ました。'],
['Students marked places where trash had been reported.','生徒たちはごみがあると報告された場所に印をつけました。'],
['There were four main problem areas on the map.','地図には主な問題場所が四つありました。'],
['We divided the trail into two routes.','私たちは小道を二つのルートに分けました。'],
['Each group received one route and wrote down what it found.','それぞれの班が一つのルートを担当し、見つけた物を書きました。'],
['My group found less trash than the report had shown.','私たちの班は報告にあったより少ないごみしか見つけませんでした。'],
['The other group found a new problem near a rest place.','もう一つの班は休憩場所の近くで新しい問題を見つけました。'],
['After the cleanup, we put both sets of notes beside the map.','清掃後、両方の班のメモを地図のそばに置きました。'],
['Comparing the notes showed us how the situation had changed.','メモを比べることで、状況がどう変わったか分かりました。']
],false,[['campaign','活動・キャンペーン'],['marked','印をつけた'],['situation','状況']]),
build('V11-NH-G2-U7-4-025',NH,'Unit 7-4',nhBase,'One Tourist, One Question',[
['A tourist stopped near our cleanup table and asked one simple question.','一人の旅行者が清掃の机の近くで立ち止まり、一つ簡単な質問をしました。'],
['“Why does this place need so much protection?” the tourist asked.','「なぜこの場所はそんなに保護が必要なのですか」と旅行者はたずねました。'],
['I first pointed to a photo of trash beside the trail.','私はまず小道のそばのごみの写真を指しました。'],
['I explained that many visitors can leave a large amount of trash over time.','多くの来訪者が時間とともに大量のごみを残すことがあると説明しました。'],
['Then I showed another photo of a clean trail after a campaign.','それから清掃活動後のきれいな小道の別の写真を見せました。'],
['My friend added that safe trails and clean water are important for everyone.','友達は安全な小道と清潔な水がみんなに大切だと付け加えました。'],
['The tourist looked at both pictures for a while.','旅行者はしばらく両方の写真を見ました。'],
['Then the tourist said the difference was easy to understand.','それから旅行者は違いが分かりやすいと言いました。'],
['Before leaving, the tourist took a small cleanup information card.','出発する前に、旅行者は清掃情報の小さなカードを持って行きました。'],
['One question became a chance to explain why protection matters.','一つの質問が、なぜ保護が大切か説明する機会になりました。']
],false,[['protection','保護'],['matters','重要である']]),
build('V11-NH-G2-U7-4-026',NH,'Unit 7-4',nhBase,'The Sunrise We Almost Missed',[
['My friends and I planned to see the sunrise from a safe mountain viewpoint.','友達と私は安全な山の展望場所から日の出を見る予定でした。'],
['We wanted to start very early, but one person arrived later than planned.','とても早く出発したかったのですが、一人が予定より遅く着きました。'],
['For a moment, we thought about walking very fast to make up the time.','一瞬、時間を取り戻すためとても速く歩こうかと考えました。'],
['Our leader reminded us that the trail was still dark in some places.','リーダーは小道の一部がまだ暗いことを思い出させました。'],
['We decided to keep a safe pace instead of rushing.','急ぐのではなく、安全な速さを保つことにしました。'],
['The sky slowly became brighter while we climbed.','登っている間、空は少しずつ明るくなりました。'],
['A few clouds were already turning orange above the mountain.','山の上のいくつかの雲はすでにオレンジ色になっていました。'],
['We reached a small viewpoint before the sun appeared completely.','太陽が完全に出る前に、小さな展望場所へ着きました。'],
['The best part of the sunrise had already started, but we could still see the changing sky.','日の出のいちばんよい部分はすでに始まっていましたが、変わる空をまだ見ることができました。'],
['No one complained about missing the first few minutes.','最初の数分を見逃したことに文句を言う人はいませんでした。'],
['We sat quietly and watched the light spread across the mountain.','私たちは静かに座り、光が山に広がるのを見ました。'],
['Afterward, we took one group photo and drank water.','そのあと、集合写真を一枚撮り、水を飲みました。'],
['Our leader said that arriving safely was more important than arriving first.','リーダーは最初に着くことより安全に着くことのほうが大切だと言いました。'],
['I agreed because the morning still felt special without any dangerous hurry.','危険な急ぎ方をしなくても朝は特別に感じられたので、私は賛成しました。']
],true,[['viewpoint','展望場所'],['pace','速さ'],['complained','文句を言った']]),
build('V11-NH-G2-U7-4-027',NH,'Unit 7-4',nhBase,'A Cleaner Place One Month Later',[
['Our class returned to a mountain site one month after a cleanup campaign.','私たちのクラスは清掃活動の一か月後に山の場所へ戻りました。'],
['We brought the notes and photos from our first visit.','最初の訪問のメモと写真を持って行きました。'],
['The trail entrance looked cleaner than before.','小道の入口は前よりきれいに見えました。'],
['We counted fewer bottles and pieces of paper near the rest area.','休憩場所の近くで数えるボトルや紙くずも少なくなっていました。'],
['One old problem place still had some trash.','以前の問題場所の一つにはまだ少しごみがありました。'],
['We marked it on the new map and collected what we could safely carry.','新しい地図に印をつけ、安全に運べる物を集めました。'],
['Then we compared the new photos with the old ones.','それから新しい写真と古い写真を比べました。'],
['The difference was clear, even though the site was not perfect.','その場所は完璧ではありませんでしたが、違いははっきりしていました。'],
['Our teacher said that one campaign cannot solve every problem forever.','先生は一回の活動ですべての問題を永遠に解決できるわけではないと言いました。'],
['Returning later helped us see which changes had lasted.','あとで戻ることで、どの変化が続いていたか分かりました。']
],false,[['lasted','続いた']])
];
if(all.length!==17)throw new Error('Batch03 G2 draft count '+all.length);
if(new Set(all.map(x=>x.id)).size!==17)throw new Error('Batch03 G2 duplicate IDs');
window.V11_BATCH03_DRAFT_G2_PASSAGES=all;
window.V11_BATCH03_DRAFT_G2_STATE={batch:BATCH,count:17,registered:false,currentRuntimeTotal:268,targetRuntimeTotalAfterFullBatch03:318,wordCounts:all.map(p=>({id:p.id,wordCount:p.wordCount,target:p.targetWordBand}))};
})();