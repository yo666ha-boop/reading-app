# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / branch safety
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Branch HEAD at start of this run: `99f3b08ec527cfd40736130334bd853aa51394bd`.
- Latest branch HEAD before this checkpoint write: `6338a677b03892aed0859ca1c2c57e867847e117` (Actions bounded-notes evidence commit following content commit `6811239804d200ed924a234d3a7513080d49fffc`).
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, canonical 3975 records.
- Final dynamic v10 load order was re-read from `v10_interaction_metadata.js`: terminal manual corrections -> chronology/reference bridge prepare -> reference slash files -> final chronology bridge apply -> runtime complete.

## This manual run completed
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, and final v10 dynamic load order before continuing.
- Diagnosed the prior SS1 Get Ready 6 post-repair slash failure: the old reference layer still exact-compared `I had lunch... / I ate... / I saw...` against the chronology-safe final passage.
- Added a bounded reference bridge in `v10_reference_chronology_sync.js`: old Get Ready 6 English is restored only during authoritative legacy reference exact validation, then final runtime restores the chronology-safe `I eat lunch. / I am at the zoo. / I like ...` passage and slash rows. Commit `cbb219dc701e1346a103d0544e4a5ead1faf3bb0`.
- Verified that repair with audit run `32819039113` SUCCESS and slash-quality run `32819039077` SUCCESS. `saw` disappeared from the unresolved candidate list.
- Live-v7 checked six high-frequency content-bearing families and added passage-local, non-cumulative glosses rather than globally whitelisting or distorting the passage: `food`, `part`, `contest`, `fruit`, `partner`, `town`.
- Added 22 new passage-local note definitions (notes 22 -> 44), covering all occurrences of those six families. Commit `48e96db0f0823ff62c478dc86295c995edede7c4`.
- That reduced verified unresolved vocabulary by exactly 123 occurrences: `food 26 + part 21 + contest 20 + fruit 20 + partner 19 + town 17`.
- Hardened `v10_grammar_chronology_candidate_audit.js` so runtime failures are printed to stdout and persist in Actions artifacts instead of disappearing from the workflow log. Commit `e49f8cf57b73df968d874a17f385e1668af37f94`.
- Recovered the exact intermittent/reference failure from run `32819539877`: passage 100 had old reference `At school, I talk about local food in a short speech.` versus runtime `At school, I give a short speech about local food.`
- Live-v7 evidence showed `talk` is already introduced in NH1 Unit 7, `speech` is NH2 Unit 2 Part2, but `give-gave` is not introduced until NH2 Let's Read 1. Therefore the reference wording is both reference-correct and chronology-safer.
- Updated the terminal manual correction for NH2 Unit 2-2 so the final sentence/evidence is `At school, I talk about local food in a short speech.`; synchronized Japanese full translation, slash first row, A evidence/evidenceJp/reason and matching B evidence if present. Commit `6811239804d200ed924a234d3a7513080d49fffc`.
- Fresh audit run `32819972389` completed its discovery job SUCCESS: vocabulary audit 168/168, grammar candidate audit 168/168, notes UI PASS, runtime browser errors 0.
- Grammar scanner now reliably persists a 168/168 authoritative-final-runtime scan with 20 detected feature families; this remains candidate coverage only, not chronology PASS.

## Current exact verified state
- Passages vocabulary-audited: `168/168`.
- Vocabulary chronology: `FAIL / IN PROGRESS`.
- Verified unresolved: `548 unique / 2684 occurrences` = `989 FUTURE_V7_LEAK + 1695 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER`.
- Previous verified state before this run: `556 unique / 2826 occurrences`; net verified improvement this run: `-8 unique / -142 occurrences` (includes Get Ready 6 cleanup plus six note families).
- Notes present: `44` passage-local entries; new notes this run: `22`.
- `missing_gloss=0` PASS.
- `NOTED_UNLEARNED_ALLOWED=275` occurrences.
- Grammar candidate coverage: `168/168`, `20` detected feature families, authoritative runtime complete. Evidence-backed exact subunit introduction boundaries are still pending; grammar chronology remains FAIL-CLOSED/PENDING.
- Notes UI gate: PASS.
- Latest complete prior slash-quality run after the six-family note patch: `32819539860` SUCCESS, including reference runtime 168, sample gate, coverage, DOM, Chromium/Firefox/WebKit-iPhone cross-browser+print, and public Pages reference-runtime smoke.
- Slash-quality run for newest NH2 Unit 2-2 content commit: `32819972404`; reference runtime, sample gate, coverage and DOM were already PASS at checkpoint time, browser-engine/cross-browser stages were still in progress and final conclusion not yet claimed.
- Public main release: NOT performed.

## Canonical-v7 evidence captured this run
- `food`: canonical Japanese `食べ物`.
- `part`: canonical `部分, 地域`; phrase `part of ~` also exists.
- `contest`: canonical `コンテスト, 競技(会)`; NH1 has later phrase `chorus contest`, so no global early whitelist was created.
- `fruit`, `partner`, `town`: no standalone canonical token row; retained only passage-locally with glosses, not cumulatively.
- NH2 Unit 2-2 sentence conflict: `talk` is cumulative from NH1 Unit 7; `speech` is introduced in NH2 Unit 2 Part2; `give-gave` is NH2 Let's Read 1, so final wording now follows reference + chronology.
- Next unresolved high-frequency families already identified from the current report: `badge 16`, `checklist 16`, `ocean 16`, `production 16`, `race 16`, `researchers 16`, `trash 16`, `white 16`, `basketball 15`, `straw 15`, followed by lower-count families.
- Live-v7 checks already started for the next group: `badge=バッジ`, `race=競走, レース`, `straw=ストロー`; `researcher` exists only as a later/other-textbook canonical item for the current NH3 uses, and `white` has no standalone v7 row.

## PASS / FAIL snapshot
- canonical v7 source: PASS / live Sheet actual used.
- vocabulary coverage: 168/168 PASS.
- vocabulary chronology: FAIL (`2684` unresolved occurrences).
- missing gloss: PASS (`0`).
- notes UI: PASS.
- grammar candidate coverage: 168/168 PASS; grammar chronology PENDING/FAIL-CLOSED until evidence-backed introductions are populated.
- reference slash after Get Ready 6 bridge: PASS on completed runs.
- newest NH2 Unit2-2 reference exact validation + coverage + DOM: PASS so far; final cross-browser/print run conclusion still pending at checkpoint time.
- public main/live release: intentionally unchanged / not final.

## Exact stop / next start
- Exact stop: content commit `6811239804d200ed924a234d3a7513080d49fffc` aligned NH2 Unit 2-2 to the old authoritative reference wording and removed the later `give` usage; audit run `32819972389` discovery is SUCCESS at `548 unique / 2684 occurrences`, while slash run `32819972404` had passed reference/sample/coverage/DOM and was entering cross-browser validation.
- Next start: re-read branch HEAD because Actions appends `[skip ci]` evidence commits; first read final conclusion of `32819972404`. If PASS, continue directly from unresolved `badge 16`, then `checklist 16`, `ocean 16`, `production 16`, `race 16`, `researchers 16`, `trash 16`, `white 16`, `basketball 15`, `straw 15`, and continue descending without a small-batch stop.
- For every family: live-v7 exact/base/variant + textbook/grade/subunit evidence first; fix morphology scanner where canonical base+allowed grammar should license the form; otherwise prefer a natural cumulative-word rewrite; only content-essential words get passage-local English+Japanese notes.
- After vocabulary leak reaches zero: populate evidence-backed exact-subunit grammar introduction boundaries for all 20 detected families, run true grammar chronology, and reduce future_grammar_leak to zero.
- Final only after vocabulary chronology 168/168 PASS, grammar chronology 168/168 PASS, missing_gloss=0, future vocab/grammar leak=0, slash reference=168/168, A/B evidence, coverage/DOM, Chromium/Firefox/WebKit-iPhone and A4 student/teacher print all PASS: update main, verify live GitHub Pages, then stop automation.
