# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST, continuation after v7 candidate repair batch

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD immediately before this checkpoint write: `5f0767eff98a6caac6168f532364584e2562979c` (`audit: wait for final correction layer before 168 vocab scan`).
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Canonical vocabulary source re-opened live this run: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, sheet `単語マスター`, 3975 canonical records.

## Work completed this run
- Re-read actual branch/main, prior checkpoint, persisted reports and v10 runtime load order before modifying anything.
- Rechecked remaining candidates directly against canonical v7. Important confirmed evidence includes: NH1 `today` (master ID 101, pre-step9), NH1 `use` (ID80), SS1 `use` (ID2193), NH1 `tell` (ID365), SS1 `nine` (ID2231), NH1 `a lot` (ID757), NH2 `give-gave` first at Let's Read 1 (ID1114), SS2 `bring` first later than PROGRAM 2-1, SS2 `above` before SS3 PROGRAM 6-2; `process`, `hike`, `sixteen`, and proper name `Anna` had no canonical exact v7 row in the searches performed.
- Added narrow evidence-backed metadata repairs for prior-grade/earlier-section vocabulary (`today`, later `give`, `map`, `a lot`, `above`, base `use`, base `tell`, etc.) instead of globally allowing them.
- Confirmed and removed a genuine future-vocabulary leak in SS2 PROGRAM 2-1: `Baseball can bring people together.` because `bring` is introduced later in canonical SS2 Reading 1. Removed the sentence and slash row, removed its JP translation, and synchronized B5 to existing evidence `We should root for the project, too.`
- Confirmed and rewrote genuine/unsupported candidates without adding avoidable notes:
  - NH2 Unit 1-4 `We learn about a different culture.` -> `We talk about a different culture.`; fullTranslation/slash synchronized.
  - NH2 Unit 7-1 `We know UNESCO has a selection process.` -> `We know UNESCO has a way to select sites.`; fullTranslation/slash and B1 prompt/answer/evidence/evidenceJp/reason synchronized.
  - SS2 PROGRAM 4-1 `After the hike, I hear from my friend.` -> `After hiking, I hear from my friend.` using the explicitly registered `hiking` form; slash and B evidence synchronized.
  - NH2 Unit 4-2 `I must take a shower by nine.` -> `I must take a shower by dinner time.` because NH v7 did not provide `nine`; target `by ~` preserved and fullTranslation/slash/A3 synchronized.
  - SS3 PROGRAM 6-2 `At the age of sixteen...` -> `At the age of nine...`, using SS1-v7-confirmed `nine`; target grammar retained and fullTranslation/slash/A1/B1 evidence synchronized.
- Kept the earlier NH2 Unit 2-2 future `give` -> prior `talk about` synchronized repair active.
- Updated `v10_v7_vocab_resolution.json` with evidence-backed statuses and policy; commit `90598e092cd490bf3c11e2c3b123b49801c1584b`.
- Updated correction/runtime repair layer for the candidate batch; commits include `b8274f28ef0db69ff6b193f8cc333db255b24fa4` and `be8651700fd4548bc3c00961e694e1e17204e5b1`.
- Moved `using` / `used` out of unresolved vocabulary only after live-verifying canonical prior-grade base `use`; they are explicitly handed to grammar chronology and are NOT vocabulary-PASSed by morphology alone. Commit `db602f4be83f28079a7889d76466172a30db35b1`.
- Diagnosed a new scanner race from persisted run `39c5a065...`: it reported 420 normal + 21 proper unique candidates because the scanner started as soon as the 168 DATASETS object existed, before the asynchronous correction/final merge layer had reached all target sections. That 420/21 report is an INTERMEDIATE-STATE artifact and is not accepted as chronology truth.
- Hardened `v10_vocab_notes_candidate_audit.js` to wait until all `V10_VOCAB_CORRECTIONS` targets are actually seen/applied, then wait an additional stabilization interval before taking the 168 snapshot. Commit `5f0767eff98a6caac6168f532364584e2562979c`.
- main was never written.

## Current counts / truth status
- passages structurally loaded by the scanner: `168/168`.
- latest pre-race stable candidate report before the final repair batch: unresolved normal occurrences `7`, proper occurrences `2`, unique normal `2`, unique proper `1`; missing gloss `0`; missing allowedWords `0`.
- after this run's content/metadata repairs, the intended remaining lexical focus is proper-name `Anna`; however this MUST be confirmed by the fresh scanner after commit `5f0767e` before declaring `future vocab leak=0`.
- the immediately preceding persisted report showing normal unique `420` / proper unique `21` is marked INVALID FOR GATING because it captured the pre-finalized asynchronous runtime state. It is retained as diagnostic evidence of the race, not used as PASS/FAIL truth.
- notes added this run: `0` (all confirmed nonessential future/unsupported words repaired naturally instead).
- missing gloss: `0` among current notes.
- grammar candidate extraction remains `168/168`, `19` detected feature families; chronology PASS is NOT yet established.
- body/content future-vocabulary repairs performed this run: `5` new passage rewrites (`bring`, `learn`, `process`, `hike`, `nine/sixteen pair` across the affected sections), in addition to the prior `give` repair. Associated A/B/slash/fullTranslation dependencies were synchronized where affected.

## UI / regression status
- Notes renderer remains installed and zero-note display remains hidden by design; bounded notes UI audit must be re-read after the corrected final-load scanner run.
- Full slash reference 168/168 has NOT yet been re-certified after the synchronized sentence changes. Do not merge.
- A/B evidence was synchronized for the changed sentences that were referenced, but the full evidence consistency gate still must run.
- Chromium/Firefox/WebKit-iPhone and A4 student/teacher print final gates remain pending.

## Exact stop / next start
- Exact stop: scanner timing race fixed at commit `5f0767eff98a6caac6168f532364584e2562979c`; Actions had not yet persisted the fresh post-fix report at checkpoint time.
- Next start: re-read branch HEAD and the newly persisted `v10_vocab_notes_candidate_report.json`. If it returns the expected small residual set, resolve `Anna` by inspecting the actual SS1 `Step 6 / Our Project 3 / Power-Up 6` sentence/slash/A/B context and replace it naturally with an already-learned expression when possible; do not auto-approve it as a proper noun. Then harden the closed FUNCTION_TO_GRAMMAR set so lexical items cannot bypass v7 merely by membership; emit unique function tokens/sections and verify them.
- After vocabulary is genuinely exhausted: build evidence-backed textbook/section thresholds for all 19 grammar families and audit sentences + slash + A/B English chronologically, including `using`, `used`, `tells` and all other inflections handed from vocabulary. Then run slash reference 168/168, A/B evidence, coverage/DOM, notes UI, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only after all PASS may main be updated and Pages verified live.

## PASS / FAIL record
- vocabulary scanner coverage: PASS `168/168`; final chronology: IN PROGRESS.
- latest large 420/21 persisted candidate result: INVALID INTERMEDIATE SNAPSHOT; race fixed, fresh rerun required.
- future vocab leak: NOT FINALIZED; most known residuals repaired, `Anna` still requires actual-context resolution and fresh count.
- grammar extraction: PASS `168/168`; grammar chronology: IN PROGRESS / not PASS.
- notes present: `0`; missing gloss: `0`; final unknown-note necessity: IN PROGRESS.
- notes UI: fresh final-load result pending.
- slash regression: pending full 168/168 rerun after synchronized edits.
- public main/live release: NOT RUN / intentionally blocked.
