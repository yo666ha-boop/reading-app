# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD before this checkpoint write: `8cc43fa90db2687c5975a5ba37d6a0ac8a9a8c14` (`fix: sync passage 100 reference after give chronology repair`).
- Public `main` HEAD: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main NOT modified.
- Sole vocabulary source remains native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. Older v5/v6 and guessed dictionaries are not authority.

## This run completed
- Re-read branch HEAD, main HEAD, prior checkpoint, latest Actions, and actual current `index.html` load order before editing.
- Confirmed public v10 load begins with `v10_vocab_corrections.js`, then SS1/NH1, SS2/NH2, SS3/NH3 data/fix layers, then interaction metadata merge; reference slash files are audit-time data, not the public runtime load path.
- Fixed four false-positive slash-quality failures without weakening ordinary comma checks: only true letter salutations/signoffs matching `Dear …,`, `Best wishes,`, and `Sincerely yours,` are exempted. Commit `e6a95a02736058ba1b32af54196e04500f9cfc28`.
- Fixed genuine passage 73 / SS2 PROGRAM 2-1 reference regression by removing the stale reference row `Baseball can bring people together.` so the reference now has the same 11 sentences as runtime after the future-vocabulary repair. Commit `d19bc06faa9af73129f31d8b2445cb3201d9ed2b`.
- Fixed genuine passage 100 / NH2 Unit 2-2 reference regression: reference row 1 now matches runtime `At school, I talk about local food in a short speech.` with four aligned EN/JP slash chunks. Commit `8cc43fa90db2687c5975a5ba37d6a0ac8a9a8c14`.
- Inspected NH3 Unit 6-2 reference data and confirmed the remaining known slash-quality defect is passage 166 row 7: current row is `We send the backpack / through the program / rather / than to an unknown person.`; next repair is `... / rather than / to an unknown person.` with the existing four JP chunks.
- No new passage-content wording was changed this run; changes were reference synchronization plus a narrow audit-rule correction. Notes added this run: 0.

## Current stage and counts
- Current stage: slash-reference regression repair, then strict v7 lexical chronology continuation.
- Vocabulary passages audited: `168/168` from latest persisted strict run.
- Vocabulary chronology final: `FAIL / IN PROGRESS`.
- Latest persisted unresolved vocabulary: `454` unique keys / `2489` occurrences = `1450 FUTURE_V7_LEAK + 982 UNREGISTERED_V7 + 57 UNREGISTERED_PROPER`.
- Vocabulary corrections this run: `0` passage-content edits; reference/audit implementation repairs: `3`.
- Notes currently present: `0`; notes added this run: `0`.
- Missing gloss: current existing-note count `0`, but final missing-gloss gate remains NOT PASS while unresolved vocabulary exists.
- Grammar structural scan: `168/168`; `19` detected families. Grammar chronology final remains fail-closed; exact future-grammar violation count is still pending evidence-backed subunit introduction thresholds.
- Slash regression: previous first-stage had 7 failures. This run repaired 6 of those causes (passage 73, passage 100, and four letter-comma false positives). One known cause remains: passage 166 / NH3 Unit 6-2 `to` boundary.
- A/B evidence final: PENDING final rerun after chronology/content stabilization.
- coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print: PENDING behind slash + chronology gates.

## Actions / PASS FAIL
- Previous notes/vocab audit PASS for structural 168 load + bounded notes UI: run `32787000537`.
- Previous slash-quality run `32787260968`: FAIL, diagnosed causes above.
- New CI runs triggered by this run's commits; at checkpoint time the post-reference-sync runs were still in progress / not yet safe to call PASS.
- v7 source identity / canonical snapshot: PASS.
- vocabulary structural coverage: PASS `168/168`.
- vocabulary chronology: FAIL / IN PROGRESS (`454` keys / `2489` occurrences from latest persisted run).
- notes UI bounded contract: PASS from prior verified run; no regression-inducing UI change this run.
- missing gloss final: NOT YET PASS.
- grammar extraction: PASS `168/168` candidate detection only.
- grammar chronology final: FAIL-CLOSED / IN PROGRESS.
- slash reference final: FAIL / IN PROGRESS until passage 166 is repaired and all 168 rerun passes.
- main/public Pages: unchanged / not released.

## Exact stop / next start
- Exact stop: branch HEAD `8cc43fa90db2687c5975a5ba37d6a0ac8a9a8c14`; passage 73 and 100 references are synchronized; four true-letter comma false positives are removed narrowly; remaining known slash-quality issue is passage 166 row 7 (`rather / than to` boundary).
- Next start 1: re-read latest branch HEAD + Actions; repair `v10_reference_slash_manual_161_168.js` passage 166 row 7 to `We send the backpack / through the program / rather than / to an unknown person.` and preserve 4/4 EN-JP chunks.
- Next start 2: rerun slash reference runtime/quality all 168. If new mismatches surface from earlier vocabulary repairs (`learn`, `hiking`, `process`, `nine`, `sixteen`, `Anna→Friend`), synchronize every affected reference file continuously rather than one-at-a-time stopping.
- Next start 3: resume the 454-key / 2489-occurrence strict v7 chronology audit in descending occurrence impact. Distinguish real future-v7, real unregistered, bounded proper names, and explicitly evidenced elementary/review allowances. Replace when natural; use `notes` only for indispensable outside words with English + Japanese gloss.
- Next start 4: populate exact NH/SS subunit introduction chronology for all 19 grammar families and judge all morphology/function/contraction handoffs, driving future grammar leak to 0.
- Final sequence only after vocabulary + grammar + slash + A/B PASS: coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print; then merge main, verify live GitHub Pages 168/168 + notes + mobile + print, and stop automation only after public PASS.
