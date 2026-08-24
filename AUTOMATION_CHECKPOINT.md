# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST, notes renderer loop fixed; lexical/function chronology separation hardened

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Latest work branch HEAD immediately before this checkpoint write: `302fdbd88f92c4f6dcdda2b19196be5167f6bd01` (`Record bounded notes UI audit [skip ci]`), which contains the current persisted audit reports. This checkpoint commit will advance HEAD once written.
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main was NOT modified.
- Sole vocabulary source re-opened live this run: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`. Live headers reconfirmed the required chronology/lexicon fields including 教科書, 学年, ファイル単元, 大単元, 単元名, PDF順, 英語, 日本語, 注記, 読みの目安, 検索用基本形, 変化形・別表記, 語句構造, v7確認状態. Canonical snapshot/audit still identifies 3975 source records.

## Work completed this run
- Re-read branch HEAD, main HEAD, this checkpoint, latest Actions, current audit reports, workflow definitions, and actual `v10_stage2.html` / `index.html` load path before changes.
- Revalidated the live Google Drive v7 column layout and kept v7 as the only vocabulary chronology source.
- Found the notes UI timeout root cause in the production renderer, not merely the test: the MutationObserver watched `#passage`; each render removed/reinserted `.v10-gloss-box`, which retriggered the observer indefinitely after a note appeared.
- Fixed the renderer to be idempotent using a stable note key (`english`, `japanese`, `reading`) stored on the rendered box; unchanged notes no longer mutate the DOM. Commit `43010d735e3a579e66486c0a058f9f078973c4ca` (`fix: make unknown-word gloss renderer idempotent`).
- Verified that fix in Actions run `32786897819`: the full `discovery` job succeeded, including canonical v7 snapshot verification, all-168 vocabulary audit, all-168 grammar candidate audit, `Verify v7 correction and gloss UI`, final UI status, and evidence persistence. Notes UI is therefore no longer blocked by the previous self-loop.
- Examined the strict 491-key report and found a second audit-logic defect: closed structural/function forms such as `the`, `and`, `too` were being counted as lexical `FUTURE_V7_LEAK` because canonical lexical lookup ran before the explicit function/contraction handoff, even though these forms must be judged by grammar chronology rather than lexical chronology.
- Hardened `v10_vocab_notes_candidate_audit.js` so the bounded contraction and explicit structural/function sets are handed to grammar chronology BEFORE lexical lookup. This is not a vocabulary PASS; they remain fail-closed until the grammar chronology gate judges legality at the exact unit. All ordinary lexical items still obey strict v7 chronology, and future v7 words / future inflection bases cannot be rescued by app `allowedWords`. Commit `8cf063c085373a17fb0a505f197b72085ab7b338`.
- Fresh all-168 strict rerun completed successfully in audit Actions run `32787000537`, including notes UI. Persisted vocabulary counts are now `V7_CHRONOLOGY_ALLOWED=13987`, `REVIEWED_EXPLICIT_ALLOWED=1809`, `MORPHOLOGY_TO_GRAMMAR=1698`, `CONTRACTION_TO_GRAMMAR=212`, `EXPLICIT_FUNCTION_TO_GRAMMAR=20701`, `FUTURE_V7_LEAK=1450`, `UNREGISTERED_V7=982`, `UNREGISTERED_PROPER=57`, `unique_unresolved=454`, `future_vocab_leak_occurrences=2489`, `notes=0`, `missing_gloss=0`, `runtime_browser_errors=0`. The reduction from 491/3023 to 454/2489 is a classification correction, not a weakened gate.
- Pulled the failed slash-quality job logs for run `32787004131` and identified all seven first-stage failures exactly:
  1. browser `Row mismatch 73`.
  2. browser `English mismatch 100#1`: old reference `At school, I give a short speech about local food.` versus corrected runtime `At school, I talk about local food in a short speech.`
  3. SS1 Step 6 / Our Project 3 / Power-Up 6 row 1: salutation `Dear Anna,` incorrectly fails the generic comma-boundary rule.
  4. same passage row 13: signoff `Best wishes,` incorrectly fails the generic comma-boundary rule.
  5. NH2 Unit 3-4 row 1: `Dear Ms. Brown,` same false-positive comma rule.
  6. NH2 Unit 3-4 row 12: `Sincerely yours,` same false-positive comma rule.
  7. NH3 Unit 6-2 row 7: `rather than to an unknown person` lacks the reference-required slash before infinitival `to` under the current quality rule.
- Traced `Row mismatch 73` to `v10_reference_slash_manual_071_080.js`: passage 73 / SS2 PROGRAM 2-1 still contains 12 reference rows including the previously removed future-vocabulary sentence `Baseball can bring people together.`, while runtime content has 11 sentences. This is a genuine reference-sync regression and must be fixed in the reference source, not hidden.
- Traced passage 100 to `v10_reference_slash_manual_091_100.js`: its Unit 2-2 reference row still uses the old `give` sentence, while the runtime correction uses `talk about`. This is also a genuine reference-sync regression.
- No passage text was newly changed this run; the production changes were renderer/audit logic only. main was never written.

## Current counts / truth status
- vocabulary passages scanned: `168/168`.
- vocabulary chronology: `FAIL / in progress`.
- unresolved vocabulary keys: `454`.
- future vocabulary leak occurrences: `2489` total = `1450 FUTURE_V7_LEAK + 982 UNREGISTERED_V7 + 57 UNREGISTERED_PROPER`.
- morphology handed to grammar: `1698`.
- contractions handed to grammar: `212`.
- explicit structural/function forms handed to grammar: `20701`.
- notes currently present: `0`; notes added this run: `0`.
- missing gloss: `0` for existing notes; final missing-gloss gate is not yet PASS while unresolved vocabulary remains.
- content repairs this run: `0` passage-content edits; implementation repairs: `2` (`v10_vocab_corrections.js` renderer and `v10_vocab_notes_candidate_audit.js` classifier).
- grammar structural scan: `168/168`; `19` detected grammar families; final grammar chronology remains fail-closed and future grammar leak count is still `PENDING` until evidence-backed textbook/subunit introduction thresholds are populated.
- slash reference: `FAIL` at first quality stage with 7 reported issues; downstream reference sample, coverage/DOM, browser and print stages were skipped by that run.

## UI / regression status
- Notes UI bounded contract: PASS in run `32786897819` and again within successful audit run `32787000537`; production MutationObserver self-loop is fixed.
- Vocabulary chronology: FAIL (`2489` unresolved occurrences), so no main release.
- Slash/reference: FAIL. Known genuine sync defects include passage 73 removed-`bring` row and passage 100 old-`give` row; generic comma rule also has four salutation/signoff false positives; NH3 Unit 6-2 has one `to`-boundary failure.
- A/B evidence consistency: not yet final-rerun PASS after all vocabulary/reference repairs.
- coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print: blocked/skipped by first-stage slash failure and final chronology work.

## Exact stop / next start
- Exact stop: notes renderer self-loop is fixed and CI-verified; explicit function/contraction forms are correctly separated from lexical v7 chronology; latest strict vocabulary result is 454 unresolved keys / 2489 leak occurrences. Slash run `32787004131` is diagnosed to seven exact first-stage failures, with passage 73 and passage 100 confirmed as reference-data synchronization regressions.
- Next start 1: re-read latest branch HEAD and Actions, then synchronize all reference slash files affected by prior vocabulary-content changes, starting with passage 73 SS2 PROGRAM 2-1 (remove stale `Baseball can bring people together.` row) and passage 100 NH2 Unit 2-2 (`give` -> `talk about`). Continue through earlier repairs (`learn`, `hike`, `process`, `nine`, `sixteen`, `Anna/Friend`) so reference 168/168 matches final sentences rather than waiting for one failure at a time.
- Next start 2: repair `v10_reference_runtime_audit.js` comma-boundary rule narrowly for true letter salutations/signoffs without weakening ordinary comma slash checks; fix NH3 Unit 6-2 reference row so `than / to an unknown person` satisfies the existing infinitive boundary rule if consistent with the reference/minimum rules.
- Next start 3: rerun reference runtime 168 validation and slash quality until first-stage passes; only then trust downstream sample/coverage/DOM/browser/print results.
- Next start 4: process the remaining 454 strict lexical keys / 2489 occurrences in descending impact, separating genuine future-v7 words, genuine unregistered words, replaceable proper names, and evidence-backed bounded elementary/review allowances. Add `notes` only for indispensable unresolved lexical items, always with English + Japanese meaning (v7 meaning when available).
- Next start 5: populate evidence-backed introduction chronology for all 19 grammar families, including every morphology/function/contraction handoff, and drive future grammar leak to zero.
- Final sequence only after vocabulary+grammar+slash+A/B all pass: coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print; then and only then merge main, verify live GitHub Pages 168/168 + notes + mobile + print, and stop the automation.

## PASS / FAIL record
- canonical v7 source identity / 3975-record snapshot: PASS.
- vocabulary structural coverage: PASS `168/168`.
- notes UI renderer bounded contract: PASS.
- vocabulary chronology final: FAIL / IN PROGRESS (`454` keys, `2489` occurrences).
- missing gloss final: NOT YET PASS (current notes missing gloss `0`, but unresolved vocabulary remains).
- grammar extraction: PASS `168/168` candidate detection only.
- grammar chronology final: FAIL-CLOSED / IN PROGRESS (`19` families, exact violation count pending chronology evidence).
- slash reference global: FAIL (7 first-stage issues diagnosed in run `32787004131`).
- A/B evidence final: PENDING.
- coverage/DOM + Chromium/Firefox/WebKit-iPhone + A4 print: PENDING / skipped behind slash failure.
- main/public Pages: unchanged / not released.
