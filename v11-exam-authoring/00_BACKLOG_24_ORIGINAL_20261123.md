# 山口県公立高校入試型・オリジナル長文追加24題 — 実制作バックログ

開始 2026-11-23 JST
正本: v11-preview/V11_EXAM_ENTRY_RUNTIME_QA_20261123.md / V11_YAMAGUCHI_ENTRANCE_EXAM_READING_SPEC.md
作業ブランチ: work/yamaguchi-60-new-originals-20261123

## 確定事実と制約
- 既存公開 v11 登録1000題は不変。入試本番型36題が既存1000題の内数。
- 目標60題には**新作24題**が必要。2026-11-23の更新時点：新作下書き19/24（YE-001〜019は英文・全訳・slash・設問A/Bまで制作）、品質最終合格0/24、公開反映0/24。
- 県型の既存正本仕様は中3 **330–450語**。今後の作成目標は400–450語（仕様上限を勝手に超過しない）。
- 100題のうち64題（長文32、基礎標準32）は本番型ではなく段階練習。100題の水増しを60題達成に使用しない。
- 既存文章の単語追加・引き延ばしだけによる長文化は不可。物語/説明が自然に展開し、各設問がその本文に依存すること。
- 現行13年度ソース確保13/13、構造監査は2014–2021未完。未監査は未監査のまま表示する。

## 制作予定（テーマは重複監査が通るまでは仮説）
- [x] YE-001｜給水所の設置と調査標本の偏り／日陰・バリアフリー・営業時間｜445語｜A/B各5問・訳・25文slash・資料証拠｜状態=下書き保存済み／v7・意味・印刷・ブラウザ品質未合格、公開未登録
- [x] YE-002｜地域バスの経路変更と乗継時刻／時刻表・注意書きの照合｜449語・英文25文・全文訳25文・英日slash25行・A/B各5問（9種類）・資料表｜状態=教材下書き保存／v7・semantic・ブラウザ・印刷未合格、公開未登録
- [x] YE-003｜博物館の音声案内改善／複数利用者の異なる意見｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=421語・24文・全文訳・slash・A/B各5問・資料表を作業ブランチに下書き保存／Node構造PASS／v7・semantic・ブラウザ未承認
- [x] YE-004｜学校の太陽光実験／天候データと結論の限界｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=434語・22文・全文訳・slash・A/B各5問・資料表を作業ブランチに下書き保存／Node構造PASS／v7・semantic・ブラウザ未承認
- [x] YE-005｜図書館のイベント予約／定員・曜日・希望条件の組合せ｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=433語・22文・全文訳・slash・A/B各5問・資料表を作業ブランチに下書き保存／Node構造PASS／v7・semantic・ブラウザ未承認
- [x] YE-006｜地域スポーツ大会の熱中症対策／参加者別休憩計画｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=444語・22文・全文訳・slash・A/B各5問・休憩場所表を作業ブランチに下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-007｜農産物販売会の食品ロス対策／売上表と発注判断｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=414語・21文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作WebKit/iPhone/A4未承認
- [x] YE-008｜海岸清掃の記録／調査方法の変更と比較可能性｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=426語・22文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作WebKit/iPhone/A4未承認
- [x] YE-009｜川の水質調査／測定時刻・降雨量・推論｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=439語・22文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-010｜移動図書館の停車場所／アクセス条件と公平性｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=422語・22文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-011｜停電時の情報伝達／媒体別到達時間と弱点｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=441語・22文・全文訳・英日slash・A/B各5問・資料表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-012｜修学旅行の班行動／地図・開館時間・優先順位｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=433語・22文・全文訳・英日slash・A/B各5問・資料表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-013｜動物観察調査／撮影データと観察回数の偏り｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=436語・21文・全文訳・英日slash・A/B各5問・資料表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-014｜児童館の読書会／募集状況と参加者の意見｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=434語・22文・全文訳・英日slash・A/B各5問・資料表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-015｜地域防災避難所／設備一覧と多様な住民の条件｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=422語・21文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-016｜学校給食の地産地消／納入量・輸送・季節性｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=422語・21文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-017｜観光案内の翻訳改善／分かりやすさの実地検証｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=408語・21文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-018｜公園の樹木保護／観測データと原因推論｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=425語・21文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [x] YE-019｜音楽祭の案内改善／誘導サイン・移動時間・混雑｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=418語・21文・全文訳・英日slash・A/B各5問・比較表付き下書き保存／Node構造PASS／v7・semantic・新作ブラウザ未承認
- [ ] YE-020｜町の自転車安全マップ／距離と安全性の相違｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=未作成
- [ ] YE-021｜リサイクル分別の学校調査／回答者選びの問題｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=未作成
- [ ] YE-022｜読書習慣の調査／報告数と実際の読書時間｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=未作成
- [ ] YE-023｜山道の歩行イベント／天候・必要装備・計画変更｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=未作成
- [ ] YE-024｜コミュニティカフェの運営／予算表・営業時間・目的｜400–450語｜A/B各5問・訳・slash・資料証拠｜状態=未作成

## 1題ごとの必要ゲート
1. オリジナル英文、400–450語、全文の自然な日本語訳、文ごとに英日対応する意味ブロックslash。
2. A/B各5問、計10問。設問タイプ6種類以上、CONTENT_MATCH・理由/推論・文挿入または要約補充・語句補充を確保。適切な本文では資料統合を入れる。英作文なし。
3. answer/evidence/evidenceJp/reasonの本文根拠と日本語訳を原文まで往復照合。
4. 教科書NH/SSのv7語彙・文法時系列、required-local gloss、同一本文/近似重複、Chromium/WebKit・iPhone/A4印刷。
5. すべてPASSした新作だけ登録。未検査・下書き・外部に書き出しただけの問題は36→60に算入しない。

## 短期の具体的開始地点
- YE-001『Choosing Water Stations for Everyone』445語の英文25文、自然な全文訳25文、対応slash25行、A/B各5問（9タイプ）、資料表を `v11-exam-authoring/001_water_stations_original_draft.json` へ実保存。v7/意味監査など未通過のため合格に算入しない。
- 第1稿462語は450語上限超過として拒否。その後表現を自然に短縮して445語とし、第2稿の構造確認後、GitHub下書きとして保存。ただし語彙時系列と全問意味監査は未完で公開登録は不可。
- その他23題の原文・設問は未作成。次回はYE-001のv7/全問意味・重複・ブラウザ・A4監査と、YE-002の本文制作を優先。

## 引継ぎ規則
毎runでこの一覧の状態、作業ブランチHEAD、残題数、検査結果を更新し、GitHub読み戻し後に次の題へ進む。進捗確認だけで終了しない。公開版への登録は全gate後。

## 2026-11-23 17:52–18:00 JST｜構造品質ゲート実装
- GitHubに `v11-exam-authoring/validate_original_drafts.cjs` を新規実装（commit `0461c35a31ddbef4ce3ed05e4b6d3eb38df3e086`）。英文400–450語、保存語数、全文訳の文数、英日slashのブロック数と英文復元一致、A/B各5問、6種以上・必須設問分類、根拠欄、作文項目の静的チェックを実装。構造合格と公開承認は分離し、公開承認は常にfalseとする。
- 今回のゲートはGitHubに保存済みだが、Node実行・CI・Chromium/WebKit/iPhone/A4は未実行。実行済みと誤記しない。次は `node v11-exam-authoring/validate_original_drafts.cjs` を実行してエラー修正、v7原本照合、YE-002原文制作。
- 公開本番型36題、新作下書き1/24、全品質合格0/24、未制作23/24、公開追加0/24。mainと本番rootは無変更。

## 2026-11-23 18:53 JST〜｜検査器の実修正
- main QA・仕様・100題subsetを再取得。仕様・subsetの実パスは `v11-preview/` 内であると確認。main最新確認commit `b40c653f4f6a713fd80df9f8e1572422d2877082`。
- 既存検査器のデフォルト入力がリポジトリrootからの相対パスになっておらず、指定なし実行で下書きを開けない不具合を修正。さらに根拠英文の原文一致を警告し、資料統合問題の `materialEvidence` 欠落をエラーにする。保存commit `3c43037f8689182ba5ed9ef96691a8ad21409237`、読み戻し確認済み。
- Node実行・公開ブラウザ実測・v7照合はこのrunでは未実行。前回QAの最終安定値は本番型36、400語以上15。新作下書き1、品質合格0、未制作23、公開追加0を維持。次は検査器実行とYE-002全文制作。root v10/mainは未変更。

## 2026-11-23 19:54 JST〜｜追加構造ゲート強化
- mainのQA・仕様・100題subsetを再取得（仕様・subsetはv11-preview配下）、作業ブランチのbacklog・検査器・YE-001原本、Driveマスターを再取得。
- 検査器に英文slash最低3分割、根拠訳と全文訳の文単位一致、設問重複、英文文重複、資料表の存在、original宣言、DRAFT状態を追加。commit a361ab13cca2e753dbe675638822e5e6ad18632c、読み戻し一致。
- 注意：Node実行、公開Chromium/WebKit、iPhone/A4、NH/SS v7、semanticは今回未実施。検査器変更は合格判定ではない。公開36、新作下書き1/24、品質合格0/24、未制作23/24、公開追加0/24。
- 次：検査器Node実行、YE-001根拠訳照合の検証、YE-002の400–450語原文・訳・slash・10問の実制作。main/root v10変更なし。

## 2026-11-23 20:52 JST〜｜証拠文・作文禁止ゲートの実修正
- main QA、v11-preview配下のspec/subset、作業ブランチbacklog/validator、Driveマスターを再取得。既存の証拠英文不一致は警告だけで構造PASSし得たため、**エラー**へ変更。英文末尾句読点、設問文中の自由英作文指示の拒否も追加。validator commit e1761c27130e0504e0857e356c9c38ed73f28428。GitHub保存済み。Node実行・ブラウザ実測は未実施のためPASS宣言不可。
- YE-002英文511語の試稿は400–450語上限超過のため**採用・保存せず**。次は自然な短縮後、訳/slash/10問を制作する。新作下書き1/24、正式合格0/24、未制作23/24、公開36のまま。main/root v10無変更。

## 2026-11-23 21:52 JST〜｜YE-002実制作
- 開始時にmain QA・v11-preview内spec/subset、作業ブランチbacklog/YE-001/validator、Drive引継ぎを再取得。mainのspec/subsetはrepo rootでなく `v11-preview/` 内。
- YE-002のオリジナル英文25文449語と自然な全文訳25文、病院バス乗継時刻表・日曜運休注意書きを `v11-exam-authoring/002_bus_route_original_draft.json` に保存（commit `99d9938ef510b53ff2d69077db2e1a4f41690da6`）。前runの511語超過試稿は不採用。今回の原稿は仕様上限450語内。
- **未完を明記**：slashRows・A/B各5問は未制作。構造validatorをこの状態で通していない。NH/SS v7・semantic・重複・Chromium/WebKit・iPhone・A4・公開UIの新規実監査も未実施。新作下書き2/24（YE-002は部分下書き）、正式合格0/24、残り新作22/24、公開本番型36題・公開追加0。
- 次回：YE-002の文ごと多分割slash英日とA/B10問（根拠・根拠訳・理由）を実制作しvalidatorを実行。公開v11-previewの最終ロード後400語フィルタ・A/B・slashをChromium/WebKit/iPhone/A4で再検証。全ゲート前は公開禁止。main/root v10無変更。
- 終了JST：21:5x（GitHub/Drive保存後の確定時刻は別途記録）。

## 2026-11-23 22:50 JST〜｜YE-002英日slash・設問実制作
- mainのQA、v11-preview内spec/subset、作業branch backlog・YE-002・YE-001/validator、Drive引継ぎを再取得。root直下のspec/subsetは404、正しいパスはv11-preview配下。
- YE-002 449語・25文の全訳に対応する多分割slashRows25行と、A/B各5問（DETAIL/MATERIAL_LINK/REASON/CONTENT_MATCH/INFERENCE/SENTENCE_INSERTION/SUMMARY_FILL/CONTEXT_WORD/GIST、9種）をGitHub下書きに実保存。教材commit `649b00dbf949aeaf0df8454b1fe09831156dfb56`、読み戻し文字列一致。
- 重要：英語slashは英文復元可能な区切りを機械的に配置した初稿であり、意味単位・日本語ブロックの人間監査は未完。Node実行、v7、semantic、Chromium/WebKit/iPhone/A4、公開再監査も未完。構造PASS/公開承認を宣言しない。
- 公開36、新作下書き2/24、正式品質合格0/24、未制作22/24、公開追加0/24。次はYE-002の意味単位slash再編集、Node実行、YE-001/002の根拠・v7・ブラウザ監査。main/root v10変更なし。


## 2026-11-23 23:07–23:24 JST｜新作3題実制作・5題Nodeゲート・公開Chrome回帰
- 着手前にGitHub main QA/spec/subset、独立作業branch backlog/validator/YE-001・YE-002、Drive引継ぎマスターを再取得。開始main HEAD b40c653f4f6a713fd80df9f8e1572422d2877082、作業branch HEAD 58c10c96e469f0d049ef4f300b44dd93b5ddd805。
- 実作成：YE-003『A Guide That Works for More Visitors』421語・24文・訳/slash24行・A/B5+5・9種・案内比較表、commit 2161cb0e99b82c8edf82cc0f666e7353b0a4bd92。YE-004『Three Days of Solar Data』434語・22文・訳/slash22行・A/B5+5・9種・測定表、commit eeadcf07e6dda388df06d5274cf994cc687e35dc。YE-005『The Right Storytelling Session』433語・22文・訳/slash22行・A/B5+5・9種・予約条件表、commit f20cfe82e196d2a87b9b6e7f246b599c6ad181b5。
- 仕様上限超過の検討案：YE-003初稿534語、YE-004初稿475語、YE-005初稿451語は保存・採用せず、内容を整理した400–450語版のみ登録。
- Windows Node 24でGitHub現行validatorを実実行：YE-001 445語25文、YE-002 449語25文、YE-003 421語24文、YE-004 434語22文、YE-005 433語22文。5題ともA/B各5問、9設問種、slash全行、エラー0、構造PASS／公開承認false。
- 公開URL https://yo666ha-boop.github.io/reading-app/v11-preview/ の実ブラウザChrome Desktop 1280×850・mobile390×844で、追加832/832ロード後に本番型36・準備100・400語以上15・語数マニフェスト差0、本文409語とslash27行、A/B各5問、A4印刷PDF 245415B、pageerror0を両方確認（Chromium系のみ）。WebKit実行は未実施。
- 重要：新作5題のv7単語・文法時系列、本文と設問の意味監査、近似重複、Chromium/WebKit・iPhone・A4新作印刷、公開登録は未通過。構造PASSを品質最終PASSと扱わず、公開本番型36・新作品質合格0/24・新作公開追加0/24を維持。新作下書き5/24、残り19題未制作。
- 次：v7正本照合とslash/根拠の意味単位手動校正→YE-006・007以降の400–450語原創制作→既存1000との重複監査→新作専用runtimeでA/B・A4・WebKit/Chromium→全gate後のみPR/公開。


## 2026-11-23 23:25–23:31 JST｜YE-006実制作＋v7原本3,975語監査の着手
- YE-006『More Than the Nearest Rest Area』を独立ブランチに実保存（commit e72cc387c036f89c02d0ec07c322b31290d9bdb3）。444語・22文、自然な全文訳22文、英日対応slash22行、A/B各5問、9種類、休憩施設の席数・開館時刻の比較表を備える。
- Windows Node24でYE-001〜006の6題を読み込み、現行 validate_original_drafts.cjs を指定ファイル全件で実行。出口0、6題とも400〜450語/文末句読点/全文訳文数/slash復元/3分割以上/A5+B5/根拠対照/9タイプ/資料表の構造ゲート PASS。publicationApproved=false は不変。
- 正本v7語彙：Google Sheets 『英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master』(https://docs.google.com/spreadsheets/d/1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4/edit)、単語マスター A2:Q3976 の実3,975行を検索。正本NH/SS grade1–3の完全単語表記と新作YE-001〜005の英文固有tokenを突合した予備監査 v11-exam-authoring/V7_LEXICAL_PREAUDIT_20261123.json（commit 9e4ed0af2547c4aecf56bcd825cf1654dc82ff0a）を保存。未一致は語形変化・固有名詞・単元の違いを含むため原本不登録と断定しない。必要注釈の人間校正と文法時系列は未完。YE-006への予備監査は次回拡張。
- 公開版1000題を無変更で維持。新作下書き6/24、未制作18/24、正式品質合格0/24、公開追加0/24。新作についてWebKit/iPhone実機/A4検査は未実行。次はv7候補語の翻訳・注釈判定、YE-006 lexical、YE-007以降の実制作、近似重複・意味ゲート。


## 2026-11-23 23:32–23:44 JST｜YE-007/008追加・8題Node／公開1000題重複監査・YE-002 slash修正
- 新作YE-007『Vegetable Boxes and Better Predictions』414語・21文・全文訳/slash21行・A/B5+5・9設問種・過去三日間の販売表を実制作保存 (commit a3fc0f9849ca8c8435aa7a12a94e984825b80d90)。
- YE-008『What the Beach Numbers Really Showed』426語・22文・全文訳/slash22行・A/B5+5・9設問種・調査範囲と潮位の比較表を実制作保存 (commit 8ebafae82030b4b3925828381993896259d27ccd)。
- Windows Node24で現行独立branchのvalidate_original_drafts.cjsをYE-001〜008に実行。8/8題でwords400–450、訳/slash文数一致、英文slash復元、A/B各5問、最低6種類・資料根拠、英文証拠/根拠訳一致など構造PASS。エラー0。正式品質合格ではない。
- 公開GitHub Pages v11-preview の実ブラウザChromeで基本168＋追加832=1000題全件ロード後、8下書きの本文と英単語5-gram Jaccard・全文完全一致を比較。完全一致0、近似5-gram重なりの最大0.0038。GitHub監査原票 v11-exam-authoring/V11_EXAM_8_DRAFT_DUPLICATE_AUDIT_20261123.json (commit d738fd3d1e2340af803540818ac8fc983af0c600)。機械的重複スクリーニングのみPASS、意味内容の人間監査は未了。
- YE-002の元slashは文章途中を機械的に切断して不自然だった。25行を意味単位のEN/JP対応へ手動修正し、英文 'ten minutes earlier' に対応する誤った旧訳『十分早く』を『10分早く』へ修正。commit 42c6d5bc6e95a158574f421798b519cd689300bf と5ff7290760c6a8282ec6a1c1319a2db4e9cebaaf。全行の最終校閲・v7文法は未承認。
- 現在公開36題（変更なし）、新作下書き8/24、未制作16/24、正式品質合格0/24、公開追加0/24。既存1000題、本番root v10、mainは不変更。次はYE-009以降の実制作、v7語彙時系列・文法・意味・正誤・新作Chromium/WebKit/A4印刷を実検証し、全gate後のみ公開する。


## 2026-11-23 23:44 JST以降｜YE-009/010実制作、YE-001〜010全件Node再実行
- YE-009『Three Numbers from the River』439語・22文・訳/slash22行・A/B各5問・9種類・採水時間/雨量/濁り表をGitHub独立branchへ保存、commit 58efa80b67e7cb687278fcf83ba16b75b3b73a95。
- YE-010『Where Should the Book Bus Stop?』422語・22文・訳/slash22行・A/B各5問・9種類・停車場の安全/時間/段差の比較表をGitHubへ保存、commit b956de0d126303ee3c0bbee45fe83e9e56056d2f。
- WindowsのNode24でGitHub作業branchの現行validatorをYE-001〜010の全10題に実行、EXIT=0。各題400〜450語、全文訳/sentence-aligned slash、A/B5問、9種類、英文根拠/根拠訳等の構造 gate PASS。構造PASS=公開品質合格ではない。
- 現状：新作下書き10/24（今run追加8）、未制作14/24、正式品質合格0/24、公開追加0/24。公開v11入試型36/36、既存1000題と本番root v10及びmainは不変更。
- 次：YE-011以降の実制作、v7語彙・文法の各正本照合・注、10題のsemantic/回答根拠・人間review、公開1000題との再重複監査、新作専用ブラウザChromium/WebKit/iPhone/A4 gateを閉じる。全gate合格前は公開不許可。


## 2026-11-23 23:50 JST｜YE-011追加静的監査
- QA/spec/subsetおよびDriveマスターを再取得。YE-011の英文・日本語訳・slash英日ブロック数・A/B全10問の根拠英文/訳の完全一致を新規静的監査し、`YE011_STATIC_ALIGNMENT_AUDIT_20261123.json` を独立branchへ保存（commit 41c61045b470ca1baf2cfb0e0aaf2c51686104c3）。
- 検出 0 件。この範囲で不一致なし。 意味・v7・実ブラウザ・A4の合格ではない。公開登録・main/root v10変更なし。
- YE-011は下書きとして確認。新作下書き少なくとも11/24、正式品質合格0、公開36。次は検出箇所修正とv7・semantic・WebKit監査。


## 2026-11-23 深夜・追加実制作｜YE-011〜014
- YE-011『The Message That Reached Everyone?』441語22文・訳/slash22行・A/B各5問・停電時のウェブ/メール/電話/ラジオの配信時刻・到達制約表。コミット25c0fc7aac27a24f52b3c6031c3b8c63371451c3。
- YE-012『A Map Cannot Tell Us Everything』433語22文・訳/slash22行・A/B各5問・学校旅行の距離/開館/迂回路の時間表。コミット70fa240e2339b330ed317635d4c06670391dea3d。
- YE-013『Where Did the Pond Birds Go?』436語21文・訳/slash21行・A/B各5問・野鳥調査の天気/時刻/観察時間比較表。コミット29b7038273d52a27ffb6d8c551358ffc686a3316。
- YE-014『Why Was the Reading Circle Empty?』434語22文・訳/slash22行・A/B各5問・児童館読み聞かせ予約数表。コミットacf4984d8fb1379b83e57e66c23ce4964b842fd8。
- Windows Node24の既存validatorをYE-001〜014の全14題に実実行：EXIT=0、14/14構造PASS、A/B5+5、最低9種類、本文400〜450語、訳/slash行整合。ただしv7単語/文法時系列・意味・設問の実質的根拠・近似重複再監査・新作のWebKit/印刷/スマホ監査は未合格。公開36維持、未制作10/24、正式合格0/24、公開追加0/24。独立作業branchのみ更新。


## 2026-11-23〜24 JST｜YE-015〜019連続新規作成とNode19題実検査
- YE-015『Which Shelter Can Everyone Reach?』422語・21文、洪水警戒レベル/橋の閉鎖/収容数、commit 4f3aece8d566f178d9a821c731b8467d5e960e84。
- YE-016『Local Vegetables for Every Lunch』422語・21文、地元給食供給不足・納品日表、commit 6a2ee9da7da0febd51ca6701f47e6f69da88feb1。
- YE-017『The Truth Behind One Photograph』408語・21文、新聞写真の文脈と公園観察の誤解、commit 933b0484f7ee36ba33009b88ffaca5bc38846247。
- YE-018『A Concert for More Listeners』425語・21文、音楽公演の収容/時間/補助席、commit 995573cdf8ea7fb363eca9551b7521f3510a9628。
- YE-019『A Welcome Map That Works』418語・21文、駅からの案内図と利用者テスト、commit f6f2319d7d2f45a1193c9c8d9649e4c56b9d2098。
- 5題とも原創長文・自然な全文訳・意味単位の英日slash（全句3以上）・A/B各5問・9種類・数字/資料表を含み、独立branchへ実保存。Windows Node24でYE-001〜019の全19題を現行validatorで再検査、EXIT0・構造PASS19/19、error0。
- 品質合格/公開追加は0。前回の公開対象は36、旧1000題/本番root v10/mainは変更なし。未制作5題、残るv7/意味/注/新作WebKit/iPhone/A4の全門監査を突破するまで未承認下書きを公開扱いしない。

## 2026-11-24 00:58 JST〜｜読解分類と英作文禁止の品質ゲート追加
- main QA/spec/subset（正しいパスはv11-preview配下）、独立ブランチbacklog/validator、Drive進捗マスターを再取得。開始backlog blob ea895bc6fc1b1a4c0fe3669be5c80787a0af92f3。
- 仕様の読解10分類以外のquestionTypeを構造不合格にする検査、設問文の日本語『英作文』『自由英作』『英文で書く/答える』および追加英語作文指示の拒否を検査器へ実装。validator commit 812bbbcc1efaaecc6ab85509e2e8527d4bc820bc。既存のDRAFT限定・公開承認falseを維持。
- 新作下書き19/24、未制作5/24、最終品質合格0/24、公開追加0/24、公開本番型36題を維持。今回Node実行・公開実ブラウザ/WebKit/iPhone/A4・v7全文監査は未実施でPASS宣言しない。次はYE-020〜024の制作と全下書きの新ゲート実行。main/root v10・既存1000題は変更しない。


## 2026-11-24 01:54 JST〜｜独立整合監査スクリプト追加
- mainの公開QA、v11-preview内のspecと100題subset、作業branch backlog、Drive進捗マスターを再取得。19題下書き・未制作5題・正式合格0・公開36題を起点にした。
- `v11-exam-authoring/audit_draft_alignment_independent.cjs` を独立branchに新設（commit e2a58df50633cd7d22868526b4cb0bc93aae6265）。全下書きJSONを自動列挙し、本文重複、全文訳行数、slash英語復元・英日ブロック数、10問、根拠文と本文の一致、根拠訳・理由の欠落、誤承認を検出する補助検査を実装。
- **このrunでNode実行・実ブラウザ検証は未実施。** この新検査器のPASSは未宣言。既存validatorとのデータスキーマ互換性を実行で確認してから品質判定する。v7・semantic・WebKit/iPhone/A4も未承認。
- 新作下書き19/24、未制作5/24、正式品質合格0/24、公開追加0/24、公開本番型36。main/root v10/既存1000題は変更なし。
- 次の地点：新検査器を実行して誤検知を修正、YE-020〜024の本文・全訳・slash・A/Bを制作、全品質ゲート実施。終了記録はGitHub保存時点。


## 2026-11-24 02:54 JST〜｜独立監査器v2の実修正
- main公開QA、正しい `v11-preview/` 配下の仕様と100題subset、作業branchバックログ・独立監査器、Drive引継ぎマスターを再取得。root直下の仕様/subsetは404、v11-preview内の正本を確認。
- 独立監査器の異常データ耐性を実修正。`sentences` / `slashRows` が配列でない場合のクラッシュ回避、下書きID重複・本文完全重複、空のslashブロック、根拠英文欠落の検出を追加。GitHub commit `8519368da8c0466af4f5a6c8694ac5d27bb23db1`、保存後の全文読み戻し一致。
- 今回はNode実行、公開ブラウザ再試験、YE-020〜024の新規制作、v7/semantic/WebKit/iPhone/A4は未実施。追加監査器v2のPASSは未宣言。下書き19/24、未制作5、正式品質合格0、公開追加0、公開本番型36のまま。main/root v10/既存1000題は変更なし。
- 次：Nodeで独立監査器v2と既存validatorを全19題に実行して修正、YE-020〜024の制作、公開v11の全832件安定ロード後の語数/A/B/slash/スマホ/A4/WebKit検証。終了記録はGitHub/Drive保存後。


## 2026-11-24 03:49 JST開始｜構造監査の対象漏れ修正
- mainの公開QA/spec/subset（spec/subsetはv11-preview内）、独立branch backlog/validator、Drive進捗マスターを再取得。公開QAの最終安定実測は36題、400語以上15題。公開ブラウザの今回再実測は未実施。
- `validate_original_drafts.cjs` の引数省略時にYE-001だけを検査してしまう対象漏れを修正。`v11-exam-authoring` 内の番号付き `*_original_draft.json` を全件自動列挙し、0件なら失敗、対象数をstderrに表示する。commit `7edd348a85f88db1dff5e65a442f591f8bff71ad`、GitHub読み戻し一致。
- Node実行・全19題の検査結果・v7/semantic/Chromium/WebKit/iPhone/A4・新作YE-020〜024制作は今回未実施。**修正しただけでPASSを宣言しない**。
- 現在の既知状態：新作下書き19/24、未制作5、最終品質合格0、公開追加0、公開本番型36。main/root v10/既存1000題は変更しない。
- 次：`node v11-exam-authoring/validate_original_drafts.cjs` を作業branchの全ファイルがある実行環境で起動し、結果を保存。YE-020〜024の制作、公開ブラウザとv7/semantic/重複/印刷ゲートへ進む。
- 終了JST：2026-11-24 03:5x（記録時点）。
