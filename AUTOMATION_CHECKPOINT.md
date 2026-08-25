# Long-reading app vocabulary / grammar audit checkpoint

Updated: 2026-08-25 JST

## Source of truth
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit` only.
- Work branch HEAD immediately before this checkpoint write: `e035a19bd6a045d2624ae720db56a25d3810dca6` (Actions persisted latest audit/UI evidence on top of this run's test fixes).
- Public `main` HEAD remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; main NOT modified.
- Sole vocabulary authority: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, exactly 3975 canonical records. Export rechecked this run: English/Japanese/reading blanks 0, v6 English diff 0, v6 Japanese diff 0.

## This run completed
- Re-read branch/main HEAD, previous checkpoint, latest Actions and public v10 load order before editing.
- Diagnosed slash-reference CI ordering race: audit-time legacy `v10_vocab_slash_manual_*` replay could temporarily restore pre-chronology rows before `v10_vocab_corrections.js` reasserted the final actual. Changed the reference runtime audit to wait for chronology corrections before applying authoritative reference rows. Commit `9f2e3bd29b62a5b689ade4913818aa327aaee94f`.
- Isolated startup-only transient jsdom errors from authoritative post-load reference validation without weakening reference assertions. The authoritative reference scripts still throw/fail on any real row mismatch.
- Achieved authoritative slash runtime PASS: `168/168`, `1853` rows, `1809` slash boundaries; problem split PASS 168/168; slash gate runtime PASS 168; problem quality PASS; interaction audit PASS 168.
- Achieved full stage2 data/content coverage assertions at least once: SS1=38, NH1=31, SS2=24, NH2=29, SS3=21, NH3=25, total `168`, B-sets `168`.
- Diagnosed two jsdom teardown/readiness false failures after successful assertions. `v10_stage2_full_coverage_test.js` now exits only after all assertions/browser checks and waits on the real 168-dataset/final-repair ready state instead of the long-lived loader sentinel (`6ea3a687d9a4567e7a5d37cb4f43787f428c18e7` plus follow-up cleanup). `v10_stage2_dom_test.js` likewise exits cleanly after all DOM assertions.
- Latest slash-quality run before final fix, `32797563932`, still failed coverage only because a transient startup `Slash mismatch PROGRAM 2-1` remained in the jsdom error buffer even though final reference runtime had already passed. Patched coverage gate to clear only pre-readiness startup errors and continue collecting/failing on all post-readiness errors. Commit `424fab349903b1c1d67cca7054520524161ffd15`.
- Revalidated canonical v7 audit workflow run `32797563966`: canonical snapshot PASS 3975 records; 168/168 vocabulary scan; grammar candidate scan 168/168, 19 feature types; bounded notes UI PASS.
- No passage wording/content was changed this run. Notes added this run: 0.

## Current stage and exact counts
- Vocabulary passages audited: `168/168`.
- Latest persisted strict vocabulary result: `454` unique unresolved keys / `2488` occurrences = `1449 FUTURE_V7_LEAK + 982 UNREGISTERED_V7 + 57 UNREGISTERED_PROPER`; vocabulary chronology `FAIL / IN PROGRESS`.
- Other vocab classifications: v7 chronology allowed 13985; morphology to grammar 1698; contractions to grammar 212; explicit structural/function to grammar 20700; reviewed explicit allowance 1808.
- Notes present: 0; notes added this run: 0; `missing_gloss=0`; notes UI gate PASS.
- Grammar structural/candidate scan: `168/168`, `19` detected families; grammar chronology remains FAIL-CLOSED because evidence-backed NH/SS subunit introduction thresholds are not yet populated. Exact future-grammar leak count therefore still pending.
- Slash reference: authoritative runtime `PASS 168/168` after the ordering fix. The overall slash-quality workflow still awaits a fresh run after commit `424fab...` to progress beyond the transient coverage browser-error buffer issue.
- A/B evidence: runtime problem-quality and interaction audits PASS in the slash chain seen this run; final all-gate claim remains pending chronology stabilization.
- Coverage: actual assertions PASS `168/168`, B-set `168/168`; latest workflow result before `424fab...` was FAIL solely on a pre-readiness startup jsdom error buffer.
- DOM: actual assertions reached `STAGE2 DOM PASS` in run `32797405591`; teardown-only close error was fixed afterward. Fresh end-to-end rerun still required before final PASS declaration.
- Chromium/Firefox/WebKit-iPhone and A4 student/teacher print: not yet reached in a fully green chain because the prior coverage step stopped the workflow.

## Newly found strict-vocabulary auditor issue
- `v10_vocab_notes_candidate_audit.js` currently builds `reviewedEvidence` from each passage's own `allowedWords` before classifying that same passage. Therefore a token absent from canonical v7 can potentially self-authorize as `REVIEWED_EXPLICIT_ALLOWED` instead of being treated as an unregistered candidate.
- Canonical-v7 future tokens are still caught first, so this primarily affects v7-absent/unregistered tokens, but it violates the requirement that existing elementary/function/review allowances be prior, bounded and evidenced.
- This must be fixed fail-closed: classify the current passage using only prior passages' reviewed evidence, then add the current passage's explicit allowance set for subsequent passages. Record exact prior provenance rather than an unrestricted allowlist. The unresolved count may increase after this correction; that increase is expected and more truthful.

## Actions / PASS FAIL
- `32797563966` vocab/grammar/notes workflow: SUCCESS. Canonical v7 snapshot PASS; vocabulary structural coverage 168/168; vocabulary chronology FAIL (2488 occurrences); grammar candidate extraction 168/168 only; notes UI PASS.
- `32797162133` slash-quality: authoritative reference PASS 168/168 and full coverage assertions PASS, then teardown-only jsdom error.
- `32797405591` slash-quality: reference PASS 168/168, full coverage PASS 168/B168, DOM assertions PASS; stopped on teardown-only DOM close error later fixed.
- `32797563932` slash-quality: reference PASS 168/168; stopped at coverage because pre-readiness transient PROGRAM 2-1 jsdom error remained buffered. Commit `424fab...` fixes that boundary while keeping post-readiness browser errors fatal.
- vocabulary chronology: FAIL / IN PROGRESS.
- grammar chronology: FAIL-CLOSED / IN PROGRESS.
- slash reference: PASS 168/168 at authoritative runtime gate; overall chain pending rerun.
- main/public Pages: unchanged / not released.

## Exact stop / next start
- Exact stop: branch had advanced to `e035a19bd6a045d2624ae720db56a25d3810dca6` from Actions persistence after this run's changes. Latest manual test fix is commit `424fab349903b1c1d67cca7054520524161ffd15`; re-read branch first because Actions may append [skip ci] evidence commits.
- Next start 1: read fresh slash-quality run after `424fab...`. Continue through DOM, browser engines and cross-browser/print steps; fix the first real failing gate, not just report it.
- Next start 2: fix `v10_vocab_notes_candidate_audit.js` self-authorization: do NOT merge current passage `allowedWords` into cumulative reviewed evidence until after every current sentence/slash/A-B English field is classified. Preserve exact earlier-section provenance. Re-run all 168 and record the new truthful unresolved/future counts.
- Next start 3: resolve remaining strict v7 future/unregistered tokens continuously, replacing naturally where possible and adding notes only for indispensable outside words with English+Japanese gloss.
- Next start 4: populate evidence-backed NH/SS subunit introduction chronology for all 19 grammar families, then classify morphology/function/contraction handoffs and drive future grammar leak to zero.
- Final sequence only after vocabulary + grammar + slash + A/B all PASS: coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print; then merge main, verify live GitHub Pages 168/168 + notes + mobile + print, and stop automation only after public PASS.
