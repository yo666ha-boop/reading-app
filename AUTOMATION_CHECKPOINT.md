# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST, continuation after canonical-v7 scanner diagnosis and grammar fail-closed gate setup

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD at start of this run: `a30dc8d39118988b1089a94f6c33c8719ab7fcae` (`audit: close known v7 residual vocabulary repair ledger`).
- Public `main` HEAD re-read live this run: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source re-opened live: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, sheet `単語マスター`, 3975 canonical records. Columns including `検索用基本形`, `変化形・別表記`, `語句構造`, `v7確認状態` were directly confirmed.

## Work completed this run
- Re-read branch/main, prior checkpoint, current reports, workflow definition, current branch tree and v10 final load order before changes.
- Diagnosed that the persisted `420 normal + 21 proper` candidate result is not only a timing problem: the candidate scanner is architecturally using app-side per-passage/cumulative `allowedWords` as the main chronology source. This violates the final requirement that canonical v7 chronology is primary and creates large false-positive sets.
- Proved the false-positive diagnosis against live v7 examples: words such as `only`, `help`, and `heavy` have earlier canonical textbook occurrences and therefore cannot be treated as genuine future leaks merely because a passage-local allowedWords list misses them.
- Confirmed v10 load order: `v10_vocab_corrections.js` loads before passage data and applies repairs later. Correction-layer readiness is useful for runtime consistency but cannot define canonical lexical chronology.
- Resolved the last known repair-batch proper-name candidate `Anna` in actual source `v10_data_sunshine_g1_program10_fix.js`: `Dear Anna,` -> `Dear Friend,`; `fullTranslation` and `slashRows` were synchronized. A/B evidence did not depend on the name. Commit `670e1bebde9cd15e6bac1400c7285f827ebeef2b`.
- Consolidated the v7 evidence ledger `v10_v7_vocab_resolution.json`, including prior `give / bring / learn / process / hike / nine / sixteen` repairs and explicit handoff of `using / used / tells` to grammar chronology. Set `knownRepairBatchResiduals=[]` while keeping `finalCanonicalScannerPending=true`. Commit `a30dc8d39118988b1089a94f6c33c8719ab7fcae`.
- Re-opened current `.github/workflows/v10-vocab-grammar-notes-audit.yml` and current `v10_grammar_chronology_candidate_audit.js`. The grammar script scans all 168 and A/B English sources but intentionally outputs `CANDIDATES_NOT_PASS_FAIL`; it does not yet contain evidence-backed textbook/subunit introduction thresholds.
- Added `v10_grammar_chronology_gate.json` as a fail-closed final-gate scaffold. It explicitly forbids treating unit flags/old reports as PASS, requires exact textbook/subunit chronology for every detected occurrence, and keeps `finalPass=false` until every occurrence is evidence-resolved and `futureGrammarLeak=0`. Commit `5db6988789e31d2eee2d4a9d847aff0e1261e968`.
- main was never written.

## Current counts / truth status
- passages structurally scanned/loaded: `168/168`.
- vocabulary violation count for FINAL gating: `PENDING CANONICAL-v7 RESCAN`; the old 420/21 candidate report is INVALID as the final count and must not be reported as actual future leaks.
- known repair-batch unresolved entries in the v7 resolution ledger: `0`, but this is not equivalent to final vocabulary PASS.
- content repair this run: `1` (`Anna` -> `Friend`), synchronized across source/fullTranslation/slash.
- notes added this run: `0`.
- missing gloss: legacy/current-note count `0`, but final canonical unknown-word scan is still pending.
- future vocab leak: `PENDING` final canonical-v7 scanner rebuild.
- grammar structural scan: `168/168`; detector contains 24 rule families and the last persisted candidate run reported 19 actually detected families. Grammar chronology PASS is NOT established.
- grammar violations/future grammar leak: `PENDING` evidence-backed exact-section mapping.

## UI / regression status
- Notes renderer remains installed; final notes-UI result must be rerun after canonical vocabulary resolution.
- `Anna` local slash synchronization: PASS. Full slash-reference `168/168`: pending rerun after all synchronized edits.
- Full A/B evidence consistency: pending rerun.
- coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print: pending final gates.

## Exact stop / next start
- Exact stop: known residual `Anna` is removed and grammar final gate now fails closed instead of relying on candidate detection alone. Canonical-v7-derived cumulative scanner is still not implemented, and grammar `introductionEvidence` is not populated.
- Next start: replace/refactor `v10_vocab_notes_candidate_audit.js` so allowed vocabulary is built from canonical v7 textbook/grade/subunit order rather than passage `allowedWords`; use `検索用基本形` and `変化形・別表記`, but send inflected forms through grammar chronology. Re-run all 168 + slash + A/B fields and obtain the first authoritative future-vocab/missing-gloss set.
- Then populate `v10_grammar_chronology_gate.json.introductionEvidence` from textbook/subunit evidence, map the 19 actually detected families occurrence-by-occurrence, explicitly resolve `using / used / tells`, and rerun all 168.
- After both chronology gates genuinely reach zero leaks: run slash reference 168/168, A/B evidence, coverage/DOM, notes UI, Chromium/Firefox/WebKit-iPhone and A4 student/teacher print. Only all-PASS may update main and verify GitHub Pages live.

## PASS / FAIL record
- vocabulary structural coverage: PASS `168/168`.
- vocabulary chronology final: IN PROGRESS / NOT PASS.
- old persisted 420/21 candidate result: INVALID FOR FINAL GATING (wrong source hierarchy; also susceptible to intermediate runtime state).
- future vocab leak: PENDING authoritative canonical-v7 rescan.
- grammar extraction: PASS `168/168` candidate detection only.
- grammar chronology: FAIL-CLOSED / IN PROGRESS; `finalPass=false`.
- notes added: `0`; final missing-gloss gate: PENDING canonical rescan.
- slash regression: local Anna sync PASS; global 168/168 pending.
- final browser/print/public release: NOT RUN / intentionally blocked.
