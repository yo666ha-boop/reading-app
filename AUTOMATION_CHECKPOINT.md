# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / branch safety
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`. Actions appends `[skip ci]` report commits, so always re-read branch HEAD before the next write. Latest actual observed immediately before this checkpoint: `cc9184ddd85616d4e9d1f776361a003776f6c90f`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, canonical 3975 records.

## This manual run completed
- Re-read branch HEAD, main HEAD, checkpoint, current Actions, final dynamic v10 load order, canonical v7 Sheet, and current unresolved reports before editing.
- Found and fixed an audit race: vocabulary and grammar scanners had been reading 168 datasets before the dynamic authoritative load reached its terminal state. Vocabulary scanner now waits for `V10_RUNTIME_LOAD_PROGRESS==='complete'` or an explicit runtime error and fails closed; grammar scanner now uses the same authoritative-terminal-state rule.
- Manual audit-infrastructure commits: `1a38548ec6ece49544ecca5b23aae58fb692afca`, `f80f5d7d8d1f87ac7dd1085ba93238882c10fd8d`, `b5c7c4718157a66fc6d6169e0fb689a14e92da57`, `e168f8ec0eae664a90f855cce68e15a9fca4c385`.
- Run `32811028574` exposed the old 60-second `progress==='complete'`-only wait as a false timeout; terminal-state handling was then corrected. The corrected authoritative scan confirmed that the prior unresolved counts were genuine final-runtime data rather than transient pre-final-load data.
- Authoritative final-runtime grammar candidate scan now sees 20 feature families across 168/168; this is still candidate detection, not chronology PASS.
- Direct v7 Sheet evidence for `unfair`: `fair=公平な` exists in NH3 Unit 2 and SS3 PROGRAM 3; `unfairly=不当に, 不公平に` exists in SS3 PROGRAM 5-3, but standalone `unfair` is absent from canonical v7. Because the adjective is content-bearing in four passages and blanket `not fair` replacement would alter synchronized syntax/A-B evidence, retained it passage-locally with explicit Japanese gloss `不公平な` in SS3 PROGRAM 5-3, NH3 Unit 2-4, Unit 5-1, Unit 5-2.
- Content commit: `609e3c9379e2a554b94fa9e99e8101eb11e135de` (`vocab: add passage-local unfair glosses`).
- Audit run `32811368244` completed SUCCESS through v7 snapshot, all-168 vocabulary scan, all-168 grammar candidate scan, notes UI and evidence persistence.
- Verified post-change reduction: unresolved `557 -> 556` unique; future-vocab leak occurrences `2848 -> 2826`; `UNREGISTERED_V7 1777 -> 1755`; notes `18 -> 22`; `missing_gloss=0`. Exactly the 22 `unfair` occurrences are now passage-local note-authorized and non-cumulative.
- Direct v7 Sheet follow-up: `see` is introduced in NH1 Unit 3 and SS1 PROGRAM 2; `see-saw` / `see-saw-seen` appears later. Therefore the 17 `saw` occurrences in SS1 Get Ready 6 are a genuine pre-introduction lexical/grammar issue, not a safe morphology auto-allow. This is a high-priority next repair candidate.

## Current exact state
- Vocabulary audited: `168/168`.
- Vocabulary chronology: `FAIL / IN PROGRESS`.
- Strict unresolved: `556` unique / `2826` leak occurrences = `1071 FUTURE_V7_LEAK + 1755 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER`.
- Other classifications: `10132 V7_CHRONOLOGY_ALLOWED`, `2505 MORPHOLOGY_TO_GRAMMAR`, `227 CONTRACTION_TO_GRAMMAR`, `20703 EXPLICIT_FUNCTION_TO_GRAMMAR`.
- Notes present: `22`; notes added this run: `4`; current note-authorized `unfair` occurrences: `22`; `missing_gloss=0`; notes UI=`PASS`.
- Grammar structural scan: `168/168`, `20` detected feature families. Evidence-backed NH/SS exact-subunit grammar introduction chronology is still not populated; `future_grammar_leak` remains pending and grammar chronology is NOT PASS.
- Slash/reference: prior full PASS run `32805924775` included reference 168/168, Chromium/Firefox/WebKit-iPhone and print. The later slash rescan `32806585032` was re-read this run and is SUCCESS. No slash boundary changes were made by the `unfair` note patch.
- A/B evidence: unchanged by `unfair` note retention; synchronized passage content remains intact.
- Main release: NOT performed.

## PASS / FAIL snapshot
- canonical v7 snapshot: PASS.
- vocabulary coverage: 168/168 PASS for scan coverage; chronology FAIL (`2826` leak occurrences remain).
- missing gloss: PASS (`0`).
- notes UI: PASS.
- grammar coverage: 168/168 candidate scan PASS; chronology PENDING/FAIL-CLOSED (20 feature families need evidence-backed intro boundaries).
- slash reference/regression: PASS at latest completed rescan.
- browser/print: last known full regression PASS; must rerun after vocabulary+grammar reach zero leaks.
- public main/live GitHub Pages: intentionally not updated / not final.

## Exact stop / next start
- Exact stop: `unfair` fully resolved via four passage-local glosses and verified by successful all-168 audit. Current remaining list starts from `food` 26, `part` 21, `contest` 20, `fruit` 20, `partner` 19, `saw` 17, `town` 17, then descending remainder. `saw` has already been confirmed by live v7 evidence as a genuine Get Ready 6 chronology problem.
- Next start: re-read branch/main/checkpoint/latest Actions/status/unresolved JSON, then continue the highest-value unresolved items without small batches. First inspect final-runtime SS1 Get Ready 6 `saw` sentences and replace with already-learned/current-safe wording if natural, synchronizing fullTranslation/slash/A-B evidence; do not authorize it as morphology. Then resolve `food/part/contest/fruit/partner/town` by direct v7 chronology evidence, preferring natural known-vocab replacement and using passage-local notes only where meaning would otherwise be distorted.
- After vocabulary leak reaches zero: populate evidence-backed exact-subunit grammar `introductionEvidence` for all 20 detected feature families, run true grammar chronology PASS/FAIL, and drive future grammar leak to zero.
- Final only after all vocabulary/grammar/missing-gloss/slash/A-B gates PASS: rerun coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print; only then update main and verify live GitHub Pages 168/168 + notes + mobile + print. Stop automation only after live public PASS.
