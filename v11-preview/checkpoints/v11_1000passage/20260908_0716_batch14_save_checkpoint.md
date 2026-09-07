# 英語長文読解アプリ v11 1000題化 保存checkpoint
保存時刻: 2026-09-08 07:16 JST
branch: v11-1000passage-easy-notes

## 現在地
- 正式登録: 818/1000
- Batch14: 50題未登録、部分登録なし
- 最新正常GitHub checkpoint: 6811eb45d46591842d4f098ffbe7550ba97c0373
- 既存R4 overlay: bdac0ddccfdb61f4410b4cd0f4d43c081680f4cc
- 既存R5 question checkpoint: aa00c84259d46a33f7b9b7cffc6d5a9211f28200
- run10 recovery checkpoint: 6811eb45d46591842d4f098ffbe7550ba97c0373

## 直近実作業
- G2-007 / G2-008 をそれぞれ A5問 + B5問、合計20問までhuman authoring済み。
- 問題タイプは GIST / DETAIL / REASON / CONTENT_MATCH / CONTEXT_WORD / SUMMARY_FILL / MATERIAL_LINK / INFERENCE を使用。
- 各問 answer / evidence / evidenceJp / reason 付き。
- 直近確認では evidence/evidenceJp fail-closed 検証 0エラー。
- ただしこの20問の外部正本統合は未完。未統合のまま完成扱いしない。

## 次回開始点
1. R4/R5/run10 の未統合差分を assembled 正本へ小分け統合
2. G2-007/G2-008 20問を正本へ統合
3. evidence/evidenceJp fail-closed再確認
4. G2-009からauthoring継続
5. Batch14全gate PASS時のみ818→868を原子的に一括登録
