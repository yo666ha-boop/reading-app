# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 03:03 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD at checkpoint write base: `ef4b603788a858ca30a74bc79381cf1c82fa2b73` (`audit: repair v7-confirmed prior-grade eat and large metadata`).
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source re-opened live: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, sheet `単語マスター`, 3975 canonical records. Old v5/v6 were not used as source of truth.

## Work completed this run
- Re-read actual branch/main/checkpoint/workflow and `v10_stage2.html` final script order. `v10_vocab_corrections.js` loads before passage datasets, followed by G1/G2/G3 data/fixes, metadata, then `DATASETS`.
- Diagnosed the bounded notes-UI failure further: v7 corrections were deferred behind a runtime/load/30-second path while the test expected the correction within 10 seconds. Changed the correction applier to poll/apply as target datasets become available (`824f3abeddab317e8f68cea275fcf179b808d882`).
- Removed unreliable jsdom browser-`load` readiness from the all-168 vocabulary audit and made 168 actual datasets + correction readiness the invariant (`2080d5bc70c385da1d355e275a63aa8fc1987af5`).
- Found and fixed a major chronology error: the scanner had reset vocabulary at each grade, incorrectly treating prior-grade words as unknown. It now carries all reviewed vocabulary forward within the same textbook while still excluding future sections (`67cb35e286739bca84b7a712906d7740d86a979e`).
- Removed the same jsdom `load` dependency from grammar candidate extraction (`463f627bed0bc8cacc5f8a478aa6c1c1c7af14ac`).
- Fixed morphology routing for possessive `'s`, doubled-consonant/y comparative/superlative forms, and `cannot`, so these go to chronology/grammar rather than false unknown-word lookup (`89d72b39b438ddd2dd97c6ba1cc67aaa4ae8cf1a`).
- Fresh persisted core audit after those fixes: bot commit `10042aeba8bc12333c42b6032c113fff1acb0ee4`. It audited 168/168 with 28,065 exact-allowed occurrences, 9,953 cumulative occurrences, 154 function-to-grammar, 138 morphology-to-grammar, 63 remaining normal v7-lookup occurrences, 7 proper-class occurrences, 15 normal unique lookup candidates + 2 proper-class candidates, notes 0, missing gloss 0, missing allowedWords 0. Grammar extraction covers 168/168 and 19 detected feature families; chronology is not yet PASS.
- Live v7 evidence resolved additional false candidates:
  - `eat`: NH1 v7 ID 39 and SS1 v7 ID 2152, both プレステップ4, `eat / ~を食べる`; therefore its G2 uses are prior-grade learned.
  - `large`: NH1 v7 ID 558, Unit7 / Real Life English 3, `large / 大きい, 広い`; therefore NH2 Unit 1-3/1-4 uses are prior-grade learned.
  - Added evidence-backed metadata corrections at the first relevant G2 passage for SS `eat`, NH `eat`, and NH `large` in commit `ef4b603...`; no passage English/slash/questions were rewritten.
  - `give`: v7 NH2 ID 1114 occurs at Let's Read 1 (P44-P47) as `give-gave`; Unit 2-2 use still needs exact cutoff comparison, so it remains unresolved rather than being auto-approved.
  - `bring`: v7 SS2 ID 3036 occurs at Reading1 / Power-Up2 (P50) as `bring`; PROGRAM 2-1 use still needs exact cutoff comparison, so it remains unresolved.
  - `sixteen`: no exact English-row match found in the v7 master; it still needs explicit elementary-known evidence or unknown-word handling.
- No passage body, fullTranslation, slash row, A/B question, answer, evidence, evidenceJp, or reason text was changed this run.

## Current authoritative counts before the final eat/large correction rerun
- passages audited: `168/168`
- exact allowed occurrences: `28065`
- cumulative prior/current allowed occurrences: `9953`
- function-to-grammar occurrences: `154`
- morphology-to-grammar occurrences: `138`
- unresolved v7 lookup occurrences: `63`
- unresolved proper-class lookup occurrences: `7`
- unique normal v7 lookup candidates: `15`
- unique proper-class candidates: `2`
- notes present: `0`
- missing gloss: `0`
- missing allowedWords: `0`
- grammar candidate passages: `168/168`
- grammar detected feature families: `19`
- These lookup counts are candidates, not confirmed future-vocabulary violations. The next CI rerun after `ef4b603...` should reduce them further because `eat` and `large` are now repaired as prior-grade metadata.

## UI / gate status
- Latest completed bounded notes-UI evidence before the `ef4b603...` rerun is still `FAIL_OR_TIMEOUT` at bot commit `51fd9b9f495030c0a7732eff48690bc9082a76ca`; its persisted log reaches `datasets=168` but does not yet reach PASS. Do not mark notes UI PASS.
- `v10_vocab_corrections.js` timing has been repaired, but a fresh final UI run after the latest corrections must be inspected. If it still fails after `datasets=168`, instrument the exact correction state (`V10_VOCAB_CORRECTION_TARGETS_SEEN`, `V10_VOCAB_CORRECTIONS_APPLIED`, Get Ready 4 allowedWords) and fix the remaining test/runtime mismatch rather than weakening the gate.
- Slash reference was not intentionally changed. Final slash-reference 168/168 regression remains mandatory after all vocabulary/text repairs.
- main remains gated and untouched.

## Remaining candidate set before eat/large rerun
The last persisted set was: `eat`, `large`, `give`, `sixteen`, `today` (sentence-initial false-proper candidate), `bring`, `map`, `nine`, `process`, `using`, `above`, `hike`, `tells`, `used`, `learn`, `lot`, plus proper name `anna`. Possessives/comparatives/`cannot` were removed from unknown lookup by the morphology fix. After the `eat`/`large` metadata correction rerun, use the newly persisted report rather than this list.

## Exact stop / next start
- Exact stop: committed v7-backed prior-grade metadata repairs for `eat` (SS/NH) and `large` (NH) at `ef4b603...`; fresh CI for that commit had not yet persisted its new report/UI evidence when this checkpoint was written. No genuine future-vocabulary count is finalized yet; no indispensable unknown-word note has been added yet.
- Next start: read branch HEAD and the bot-persisted report produced after `ef4b603...`; verify whether `eat` and `large` disappeared and inspect the fresh notes-UI log/status. Continue exact v7 cutoff resolution of every remaining candidate (especially `give`, `bring`, `sixteen`, `today`, `map`, `nine`, `process`, `using`, `above`, `hike`, `tells`, `used`, `learn`, `lot`, `anna`). Apply only source-backed metadata repairs or synchronized passage rewrites/notes. Then build evidence-backed grammar introduction thresholds for all 19 feature families and audit all 168 passages + A/B English. Finally rerun slash 168/168, A/B evidence/translation sync, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Merge to main only after every gate passes and verify GitHub Pages live.

## PASS / FAIL record
- vocabulary scanner execution: PASS 168/168; chronology final: IN PROGRESS.
- grammar candidate extraction: PASS 168/168; chronology final: IN PROGRESS.
- missing gloss among current notes: PASS (`0`), but notes requirement finalization remains IN PROGRESS.
- notes UI: FAIL_OR_TIMEOUT on latest completed bounded run; fresh rerun pending.
- future vocab leak: NOT FINALIZED.
- future grammar leak: NOT FINALIZED.
- slash regression: no content edit this run; final gate pending.
- public main/live release: NOT RUN / intentionally blocked.
