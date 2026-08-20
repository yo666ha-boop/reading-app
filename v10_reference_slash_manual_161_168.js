// Reference/minimum-rule slash audit passages 161-168.
(function(){
 const PASS='PASS_REFERENCE_20260820';
 function setAudit(data,section,rows,n){const p=data&&data[section];if(!p)throw new Error('Missing reference passage '+n+': '+section);if(rows.length!==(p.sentences||[]).length)throw new Error('Row mismatch '+n);for(let i=0;i<rows.length;i++){const e=String(rows[i].en||'').replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim(),s=String(p.sentences[i]||'').replace(/\s+/g,' ').trim();if(e!==s)throw new Error('English mismatch '+n+'#'+(i+1)+': '+e+' <> '+s);const ec=String(rows[i].en||'').split(/\s*\/\s*/).filter(Boolean).length,jc=String(rows[i].jp||'').split(/\s*\/\s*/).filter(Boolean).length;if(ec!==jc)throw new Error('EN/JP chunks '+n+'#'+(i+1)+' '+ec+'/'+jc)}p.slashRows=rows;p.slashReadingVersion='reference-book-minimum-rules-20260820';p.slashReferenceAudit=PASS;p.slashReferencePassageNo=n}
 const d=window.V10_PASSAGES_G3_NH||{};
 setAudit(d,'Unit 5-1',[
  {en:'Our history class studies a national leader / whose image appears / on a banknote.',jp:'歴史の授業で国の指導者について学びます / その肖像が使われている / 紙幣に'},
  {en:'The teacher first shows us the note / and asks why this person was chosen.',jp:'先生はまず私たちにその紙幣を見せます / そしてなぜこの人物が選ばれたのかたずねます'},
  {en:'We learn / that the leader worked / for major change / in the country.',jp:'私たちは学びます / その指導者が働いたことを / 大きな変化のために / 国で'},
  {en:'One important idea / in the movement was non-violence.',jp:'大切な考えの1つは / その運動の非暴力でした'},
  {en:'The leader believed / that people could challenge unfair systems / without attacking others.',jp:'その指導者は信じていました / 人々が不公平な仕組みに立ち向かえると / 他人を攻撃せずに'},
  {en:'This idea influenced many supporters.',jp:'この考えは多くの支持者に影響を与えました。'},
  {en:'The banknote image is not only a picture / of a famous person.',jp:'紙幣の肖像は単なる写真ではありません / 有名人の'},
  {en:'It also reminds people / of the values connected / with the leader’s work.',jp:'それは人々に思い出させるものでもあります / 価値観を / 指導者の活動と結びついた'},
  {en:'One student asks how non-violence affected later movements.',jp:'ある生徒は非暴力が後の運動にどう影響したかたずねます。'},
  {en:'We decide / to research that question next.',jp:'私たちは決めます / 次にその問いを調べることに'}
 ],161);
 setAudit(d,'Unit 5-2',[
  {en:'A group / of people faced an unfair rule / that limited one / of their rights.',jp:'ある集団が / 人々の不公平な規則に直面しました / 1つを制限する / 彼らの権利の'},
  {en:'They wanted the government / to change the rule.',jp:'彼らは政府に望みました / その規則を変えることを'},
  {en:'Their leader asked them / to use non-violence.',jp:'指導者は彼らに求めました / 非暴力を使うように'},
  {en:'Some people joined a peaceful protest.',jp:'一部の人々は平和的な抗議に参加しました。'},
  {en:'The leader also began a fast / to show how serious the issue was.',jp:'指導者は断食も始めました / 問題の深刻さを示すために'},
  {en:'The protesters did not attack other people.',jp:'抗議する人々は他の人を攻撃しませんでした。'},
  {en:'Their actions brought public attention / to the human-rights problem.',jp:'その行動は社会の注目を集めました / 人権問題に'},
  {en:'More people began / to discuss the unfair rule.',jp:'より多くの人が始めました / 不公平な規則について話すことを'},
  {en:'The campaign became part / of a wider fight / for rights / and independence.',jp:'その運動は一部になりました / より広い闘いの / 権利のための / そして独立のための'},
  {en:'The example shows how protest / and non-violence can work together / toward political change.',jp:'この例は抗議がどう働けるか示します / そして非暴力がいっしょに / 政治的変化に向けて'}
 ],162);
 setAudit(d,'Unit 5-3',[
  {en:'A lawyer learned / about a law / that treated one group unfairly.',jp:'ある弁護士は知りました / 法律について / 1つの集団を不公平に扱う'},
  {en:'He joined a movement / to challenge the law.',jp:'彼は運動に参加しました / その法律に立ち向かうための'},
  {en:'The movement first held a peaceful public meeting.',jp:'運動はまず平和的な公開集会を開きました。'},
  {en:'The lawyer stood / before the crowd / and explained why the law was wrong.',jp:'弁護士は立ちました / 人々の前に / そしてなぜその法律が間違っているのか説明しました'},
  {en:'Police later arrested some protesters / for breaking the rule.',jp:'警察は後に一部の抗議者を逮捕しました / 規則を破ったために'},
  {en:'The lawyer was also sent / to jail / for a short time.',jp:'弁護士も送られました / 刑務所へ / 短い期間'},
  {en:'Even after his release, / he continued / to defend free speech / and equal treatment.',jp:'釈放後も / 彼は続けました / 言論の自由を守ることを / そして平等な扱いも'},
  {en:'The arrests drew more attention / to the law.',jp:'逮捕はさらに注目を集めました / その法律に'},
  {en:'Public pressure grew, / and the government later changed the law.',jp:'社会の圧力が強まりました / そして政府は後に法律を変えました'},
  {en:'The movement showed / that one legal challenge can become part / of a larger social change.',jp:'その運動は示しました / 1つの法的な挑戦が一部になりうると / より大きな社会変化の'}
 ],163);
 setAudit(d,'Unit 5-4',[
  {en:'People / in one region had / to pay an unfair tax / on an everyday product.',jp:'人々が / ある地域の必要がありました / 不公平な税を払う / 日用品に'},
  {en:'Many families felt the rule was especially hard / on ordinary people.',jp:'多くの家族はその規則が特に厳しいと感じました / 普通の人々に'},
  {en:'A local leader planned a peaceful protest.',jp:'地元の指導者は平和的な抗議を計画しました。'},
  {en:'Supporters walked together / to a public market / outside the town.',jp:'支持者たちはいっしょに歩きました / 公共市場まで / 町の外の'},
  {en:'They carried signs explaining why they opposed the tax.',jp:'彼らは税に反対する理由を書いた表示を持って行きました。'},
  {en:'The group did not damage shops / or attack other people.',jp:'その集団は店を壊しませんでした / または他の人を攻撃しませんでした'},
  {en:'News / of the protest spread / to other towns.',jp:'ニュースが / 抗議の広がりました / ほかの町へ'},
  {en:'More people began / to question the tax / and the government’s rule.',jp:'より多くの人が始めました / 税に疑問を持つことを / そして政府の規則に'},
  {en:'The tax was not removed immediately, / but the campaign became an important part / of a larger independence movement.',jp:'税はすぐにはなくなりませんでした / しかしその運動は大切な一部になりました / より大きな独立運動の'},
  {en:'People later remembered the protest / as a legacy / of peaceful political action.',jp:'人々は後にその抗議を記憶しました / 遺産として / 平和的な政治行動の'}
 ],164);
 setAudit(d,'Unit 6-1',[
  {en:'I found an unused backpack / at home.',jp:'私は使っていないリュックサックを見つけました / 家で'},
  {en:'It was still clean / and strong enough / to use.',jp:'それはまだきれいでした / そして十分丈夫でした / 使うのに'},
  {en:'Our class was planning a donation project, / so I brought the backpack / to school.',jp:'クラスは寄付プロジェクトを計画していました / だから私はリュックを持って行きました / 学校へ'},
  {en:'We checked it carefully / before using it.',jp:'私たちはそれを注意深く確認しました / 使う前に'},
  {en:'Then we collected a notebook, / pencils, / and other school supplies.',jp:'それから私たちはノートを集めました / 鉛筆 / そしてその他の学用品を'},
  {en:'We put the supplies / inside the backpack.',jp:'私たちは用品を入れました / リュックの中に'},
  {en:'Our teacher explained / that the project would support students abroad.',jp:'先生は説明しました / そのプロジェクトが海外の生徒を支援するものだと'},
  {en:'I felt happy / because something unused / at home could become useful again.',jp:'私はうれしく感じました / 使われていなかった物が / 家で再び役立つから'},
  {en:'We know one backpack cannot solve every problem.',jp:'リュック1つですべての問題を解決できないことは分かっています。'},
  {en:'Still, / it can be one practical part / of our class project.',jp:'それでも / それは実際的な一部になれます / 私たちのクラスのプロジェクトの'}
 ],165);
 setAudit(d,'Unit 6-2',[
  {en:'Our class has prepared one backpack / for a donation project.',jp:'私たちのクラスはリュックを1つ準備しました / 寄付プロジェクトのために'},
  {en:'We have checked the bag / and the school supplies / inside it.',jp:'私たちはバッグを確認しました / そして学用品を / その中の'},
  {en:'The backpack will be sent / to a partner program / in Afghanistan.',jp:'そのリュックは送られます / 協力プログラムへ / アフガニスタンの'},
  {en:'Before sending it, / we learn where the program works / and what students there need.',jp:'それを送る前に / 私たちはプログラムがどこで活動するか学びます / そして現地の生徒が何を必要としているか'},
  {en:'We also write a short message / to go / with the donation.',jp:'私たちは短いメッセージも書きます / いっしょに行くための / 寄付と'},
  {en:'So far, / our project is small, / but every item has a clear purpose.',jp:'今のところ / 私たちのプロジェクトは小さいです / しかしすべての品物には明確な目的があります'},
  {en:'We send the backpack / through the program / rather / than to an unknown person.',jp:'私たちはリュックを送ります / そのプログラムを通して / むしろ / 知らない個人へ直接より'},
  {en:'We hope the supplies will be useful / at school.',jp:'私たちは学用品が役立つことを願っています / 学校で'},
  {en:'We also hope the project helps our class learn / about another place respectfully.',jp:'私たちはそのプロジェクトがクラスの学びを助けることも願っています / 別の場所について敬意をもって'},
  {en:'The donation is one small way / to connect learning / with action.',jp:'寄付は小さな方法の1つです / 学びをつなぐための / 行動と'}
 ],166);
 setAudit(d,'Unit 6-3',[
  {en:'Our class joins a literacy-support project / with a partner school abroad.',jp:'私たちのクラスは識字支援プロジェクトに参加します / 海外の協力校と'},
  {en:'The partner school tells us / that some learners need more easy reading books.',jp:'協力校は私たちに伝えます / 読みやすい本をもっと必要としている学習者がいると'},
  {en:'We look / at a globe / to find the country / and learn / about the school first.',jp:'私たちは見ます / 地球儀を / その国を見つけるために / そして学びます / まず学校について'},
  {en:'We do not guess what each family needs.',jp:'それぞれの家族が何を必要としているかを勝手に想像しません。'},
  {en:'Instead, / we follow the request sent / by the partner program.',jp:'代わりに / 私たちは送られた要望に従います / 協力プログラムから'},
  {en:'Our class collects suitable books / and checks their condition.',jp:'私たちのクラスは適切な本を集めます / そして状態を確認します'},
  {en:'We pack the books carefully / for air delivery.',jp:'私たちは本を注意深く梱包します / 航空便のために'},
  {en:'The program will send them / across the border / to the partner school.',jp:'プログラムはそれらを送ります / 国境を越えて / 協力校へ'},
  {en:'A teacher there will decide how the books are used.',jp:'現地の先生が本の使い方を決めます。'},
  {en:'We hope the books support learners / who are building literacy skills.',jp:'私たちは本が学習者を支えることを願っています / 読み書きの力を身につけている'},
  {en:'The project teaches us / that useful service begins / by listening / to the people receiving help.',jp:'そのプロジェクトは私たちに教えます / 役立つ奉仕は始まると / 聞くことによって / 助けを受ける人の声を'}
 ],167);
 setAudit(d,'Unit 6-4',[
  {en:'Our class studies the trade history / of one coat sold / in a local shop.',jp:'私たちのクラスは貿易の流れを学びます / 売られた1着のコートの / 地元の店で'},
  {en:'The coat was designed / in one country.',jp:'そのコートはデザインされました / ある国で'},
  {en:'Some material was imported / from another country.',jp:'素材の一部は輸入されました / 別の国から'},
  {en:'The coat was made / in a third country / and then shipped / to Japan.',jp:'コートは作られました / 3つ目の国で / そしてその後運ばれました / 日本へ'},
  {en:'Yesterday, / a customer bought the coat / during a shop sale.',jp:'昨日 / 客がそのコートを買いました / 店のセール中に'},
  {en:'This one product crossed more / than one border / before reaching the customer.',jp:'この1つの製品はより多く越えました / 1つの国境より / 客に届く前に'},
  {en:'No country / in the chain did every part alone.',jp:'どの国も / この流れの中ですべての工程を1国だけで行ったわけではありません'},
  {en:'The design, / material, / production, / transport, / and sale depended / on work / in different places.',jp:'デザイン / 素材 / 生産 / 輸送 / そして販売は支えられていました / 仕事に / それぞれ異なる場所の'},
  {en:'An island country is surrounded / by water, / but trade connects it / with many other countries.',jp:'島国は囲まれています / 水に / しかし貿易はそれをつなぎます / 多くのほかの国と'},
  {en:'This kind / of interdependence is part / of daily life.',jp:'この種類は / 相互依存の一部です / 日常生活の'},
  {en:'The coat helps us see a concrete relationship / between international trade / and the things we use every day.',jp:'そのコートは私たちが具体的な関係を見る助けになります / 国際貿易との間の / そして毎日使う物との'}
 ],168);
 window.V10_REFERENCE_SLASH_AUDIT={version:'2026-08-20',passagesAudited:168,total:168,lastCompleted:168,minimumRuleImageConfirmed:true};
})();