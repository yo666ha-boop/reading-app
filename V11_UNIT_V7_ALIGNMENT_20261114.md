# 英語長文アプリ：UNIT別追加12題とv7単語マスターの直接照合（2026-11-14 JST）

**状態：単元の実在・新出語の初期照合完了。全文全語・文法進度の最終承認は未完了。**

正本はGoogle Sheets `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master` の `単語マスター` タブ。ここに記載する数値は**シート行番号（見出し行を含む）**であり、A列の語彙IDとは異なる。B列=教科書、C列=コード、D列=学年、H列=単元名、O列=英語を直接照会した。語彙データをGitHubに丸ごと再掲しない。

| 教科書・学年 | 追加候補が対応するUNIT | v7シート行 | 独立行数 | 今回の本文で使用する該当・既習語（例） |
|---|---|---:|---:|---|
| Sunshine G1 | PROGRAM 1-1 | 2246–2263 | 18 | friendly, kind, student, like |
| Sunshine G1 | PROGRAM 1-2 | 2264–2286 | 23 | fan, Japanese, of、累積Australia等 |
| New Horizon G1 | Unit 1-1 | 142–159 | 18 | from, club, want to, South Africa |
| New Horizon G1 | Unit 1-2 | 160–171 | 12 | often, watch, rugby, fan, but |
| Sunshine G2 | PROGRAM 1-2 | 2843–2857 | 15 | will, won't, worried, text, keep in touch |
| Sunshine G2 | PROGRAM 1-3 | 2858–2868 | 11 | overseas, quiz, maybe, short, won't/cry |
| New Horizon G2 | Unit 1-1 | 953–964 | 12 | be going to, airport, flight, arrive |
| New Horizon G2 | Unit 1-2 | 965–973 | 9 | will, seafood, reservation, excited, far |
| Sunshine G3 | PROGRAM 1-2 | 3564–3567 | 4 | homemade, eel, marathon, musical instrument |
| Sunshine G3 | PROGRAM 1-3 | 3568–3585 | 18 | I've, eaten, a few, portion, twice, sell out |
| New Horizon G3 | Unit 1-1 | 1657–1668 **共有ブロック** | 12 | have been to, once, twice, never |
| New Horizon G3 | Unit 1-2 | **同じ共有ブロック** | 分割単独列なし | fashion, regional, foreigner, haven't 等 |

## 調査上の注意
1. **NH G3の語彙分割**：実際のv7シートでは当該12行が「Unit1 Part1」としてまとめられている。v10監査では前半6語/後半6語をUnit1-1/1-2へ振り分けたが、最新教科書の教材原本と照合するまではこの分割を確定しない。
2. Sunshine G1のPROGRAM1 1-2に記載される新出単語はP1-1とは異なる。Wave2本文は`fan of Japanese music`へ修正して該当UNIT語を実際に使う形へ調整済み。
3. New Horizon G1 Unit1-2はまだ三単現の`likes`を習う前なので、Wave2の`My friend likes soccer`を既習のbe動詞表現に変更した。
4. New Horizon G3 Unit1-2の候補には`haven't`を明示しているが、教科書原本での位置・文法進度は改めて照合する。
5. 他にも本文が既習の累積単語・固有名詞・基礎機能語を用いる場合がある。ここに載せた12単元の**語彙行参照だけ**をもって全文の単語順・文法順をPASSにしてはならない。

## 今回達成した作業
- 既存168題＋追加832題の1000題コアに変更を加えず、別枠でUNIT別新規12題を作成。
- 新規12題に英文・和訳・行単位解釈・A/B設問（合計120問）を作成。
- Node検査は同一UNIT紐付け・設問の本文根拠・全文スラッシュ行一致・ベース本文の過大再利用回避・未来UNIT除外に対応。
- Chromiumの6コース12チェックポイントで本文選択とA/B切替を実検査。
- 全UNITの空白・偏りを可視化する`scripts/v11_unit_coverage_inventory.cjs`を追加し、GitHub Actionsで JSONレポートの生成・保存を設定。

## 正式監修の次段階
対象12題を1文ずつ v7単語マスターの累積登録語・原本教科書の文法進度と照合し、本文・和訳・設問の意味と自然さを原文で再点検する。妥協して形式だけで`curriculumGate=VERIFIED_V7_CANONICAL`に昇格しない。現在も`PENDING_FINAL_V7_CANONICAL_REVIEW`を維持する。
