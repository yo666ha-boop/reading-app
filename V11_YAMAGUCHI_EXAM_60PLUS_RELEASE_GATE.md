# v11 山口県公立高校入試型 60題以上 — 最終Release Gate

更新: 2026-09-05 JST

## 必須完成条件
- v11 1000題完成時、`YAMAGUCHI_EXAM` として人間確認済みの長文を **60題以上** 登録する。
- 50題ちょうどを下限にせず、欠落・差し替え後も50題を下回らないよう release target を60題以上とする。
- `YAMAGUCHI_EXAM` は中3向けで、山口県公立高校入試の読解操作を反映したオリジナル問題とする。実問題本文のコピーは禁止。

## 1題ごとの必須要件
- 長文本文と自然な全文訳。
- slash EN/JP の前からの意味対応。
- A/B 各5問、合計10問。
- `CONTENT_MATCH` / `REASON` / `INFERENCE` を中心に、`MATERIAL_LINK`、`SENTENCE_INSERTION`、`SUMMARY_FILL`、`CONTEXT_WORD`、`PHRASE_FILL` 等を本文・資料に応じて組み合わせる。
- 資料統合型では、時刻表・地図・表・案内・条件カード等を本文と独立に読ませ、本文だけで答えが出ない設問を含める。
- 必要に応じ20〜30語程度の英作文を含める。
- v7語彙時系列、文法時系列、required-local gloss、human semantic review、question evidence、cross-batch、Chromium/WebKit、A4、persistent runtimeの全gateを通過する。

## UI必須条件
- 公開preview / 最終版で `山口県入試型` を明示して絞り込めること。
- 画面に「全登録題数」と「現在の絞り込み後候補数」を別々に表示し、候補数をアプリ総問題数と誤認しない表示にする。
- release gateで `YAMAGUCHI_EXAM >= 60` を実数監査し、59以下ならFAIL-CLOSED。

## 現在の方針変更
従来の各50題Batchで中3 `STANDARD 8 / LONG 4 / YAMAGUCHI_EXAM 4` を固定する方式は、最終60題以上を満たすには不足する。Batch14以降は完成済み本文を壊さず、未作成の中3枠と残りBatchの配分を再設計し、1000題完成時に60題以上へ到達させる。
