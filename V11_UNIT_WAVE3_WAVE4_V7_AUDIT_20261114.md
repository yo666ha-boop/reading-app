# 第3・第4弾：英語長文UNIT対応・語彙監査台帳（2026-11-14 JST）

## 作業区分と監査の線引き
対象はGitHub `v11_unit_supplemental_wave3_20261114.js` および `v11_unit_supplemental_wave4_20261114.js` の**新規12本文**。Wave1/2の12題と合わせて新規24題を保持し、既存1000題を変更しない。正本 `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master` の「単語マスター」各行を確認。**下記は単元の根拠と注目語の照合であり、全語・全構文の正式承認ではない**。

※正本の行番号はヘッダーを含むシート行で、A列のIDとは一致しない。例：Sheet row 187 はID186。

| 教科書・学年 | 追加対象の小単元 | v7単語マスター該当行 | この単元での確認対象語・表現 | 登録候補ID |
|---|---|---:|---|---|
| Sunshine 中1 | PROGRAM 1-3 | **個別行を分離できない**（PROGRAM1 1-2の登録行2264–2286内に対応語を含む） | quiet, cheerful, polite, science, fan（原本の1-3境界は再確認） | V11-UNIT-SS-G1-P1-3-003 |
| New Horizon 中1 | Unit 1-3 | 172–186 | art, draw, comic, swimming, lesson, How about you? | V11-UNIT-NH-G1-U1-3-003 |
| Sunshine 中2 | PROGRAM 2-1 | 2882–2897 | hear-heard, project, promote, history, should, root for | V11-UNIT-SS-G2-P2-1-003 |
| New Horizon 中2 | Unit 1-3（Read and Think 1） | 974–985 | find-found, language, Chinese, communicate, dollar, meter | V11-UNIT-NH-G2-U1-3-003 |
| Sunshine 中3 | PROGRAM 2-1 | 3604–3615 | just, already, yet, regular, affect, health, at least | V11-UNIT-SS-G3-P2-1-003 |
| New Horizon 中3 | Unit 1-3（Read and Think 1） | 1669–1681 | make A B, adventure, adult, drawing, genre, quality, global | V11-UNIT-NH-G3-U1-3-003 |
| Sunshine 中1 | PROGRAM 2-1 | 2287–2307 | flip book, artist, picture, draw, after school, clean | V11-UNIT-SS-G1-P2-1-004 |
| New Horizon 中1 | Unit 2-1 | 187–204 | he, she, on, team, Ms., our, be good at | V11-UNIT-NH-G1-U2-1-004 |
| Sunshine 中2 | PROGRAM 2-2 | 2898–2905 | when, coach, believe, university, peace, create, national | V11-UNIT-SS-G2-P2-2-004 |
| New Horizon 中2 | Unit 1-4（Read and Think 2） | 986–991（同Unit教科書本文992–994は別列挙） | culture, painting, surprised, India, area, wall, Singapore, mosque | V11-UNIT-NH-G2-U1-4-004 |
| Sunshine 中3 | PROGRAM 2-2 | 3616–3623 | for, since, habit, be based on, concentrate on, be full of | V11-UNIT-SS-G3-P2-2-004 |
| New Horizon 中3 | Unit 1-4（Read and Think 2） | 1682–1696 | scroll, It is said that, roots, link, movement, influence, technique | V11-UNIT-NH-G3-U1-4-004 |

## 修正記録
- 中1 NH Unit 1-3：2人の会話が同じ話者に見える問題を修正。ミカ・ケンの話者ラベルを全12行に追加し、和訳・英文解釈と問題文も一致させた。
- 中1 NH Unit 2-1：「This is Ken, too.」という不自然な人物紹介を「This is Ken.」に修正。
- 中2 SS PROGRAM 2-2：大学のコーチを「大学出身」と不自然に説明する箇所を「大学で働いている」に修正。
- 中1 NH Unit 1-3の未習の he/she 三単現や、中1 NH Unit 2-1の未習の can は入れないようにする。中2 NH Unit 1-3では次節の culture/painting/surprised を使わない。
- 中3 SS PROGRAM 2-1では次節の since / habit / concentrate on を避け、2-2で初めて使う。中3 NH Unit 1-3は次節の scroll / roots / technique を避け、1-4で初めて扱う。
- 出題の根拠英文は該当本文の全文一致を必須とする。基本本文との過剰な同文流用もQAで検出する。

## 未確定事項
- **SS中1 PROGRAM 1-3 は正本に独立した単元語彙ブロックが見つからず、既存v10本体とv7の行分けにずれがある。正式な単元境界照合を要する。**
- NH中3 Unit 1-1/1-2の共通語彙枠も引き続き未確定。教材の原本、語彙の出現順、授業文法に照らしたレビューが必要。
- すべての追加24題は `curriculumGate:'PENDING_FINAL_V7_CANONICAL_REVIEW'` のまま。**単元キー・設問・画面の自動検査の成功を、人手レベルの全文語彙/文法監修完了と混同しない。**

## 登録・公開の安全設計
基本168題＋追加832題＝1000題の厳密な登録件数を維持し、24題は独立追補レジストリへ。実画面「習ったUNITまで／選んだUNITだけ」の動作、未習UNIT非表示、A/B問題切替、ジャンル、全1000題との完全・高類似重複チェックはGitHub Actionsで自動検査する。合格後も Draft PR #9 とする。main と公開 v11-preview は正式承認前に変更しない。
