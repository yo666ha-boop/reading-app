# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / branch safety
- Repository: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`; latest actual before this checkpoint: `9ce63c0baa0422e5729f9dffbedcca9dd1e7c190` (Actions evidence commit after manual `58cec58825b9a03585a6809b5bc42bb1721186cf`). Always re-read branch HEAD next run because Actions appends `[skip ci]` report commits.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: Google Sheet `英単語_教科書別マスターデータ_NH_SS_2026_v7_app_wordbook_master`, id `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, canonical 3975 records.
- Bounded elementary source remains `v10_elementary_vocab_allowlist.json`, exactly 104 provenance-backed records; productive inflections stay grammar-gated.

## This manual run completed
- Re-read branch/main, old checkpoint, current Actions, production runtime load order, v7 Sheet and current unresolved reports before editing.
- Diagnosed slash regression correctly: production semantic chronology changed early Sunshine G1 `great -> nice`, while reference rows still held authored `great`. A first broad reverse transform also exposed and was fixed because it incorrectly changed legitimate `Nice to meet you.` / `This city is nice.`.
- Added `v10_reference_chronology_sync.js` with section-exact legacy Great rows. It temporarily restores only documented authored Great rows for reference-boundary loading, then reapplies v7-safe Nice to final sentences/slash/A-B evidence and synchronized Japanese without changing slash boundaries.
- Fixed malformed JP synchronization (`すてきなです -> すてきです`) and synchronized `evidenceJp/reason` as well as English evidence.
- Integrated the chronology bridge into production `v10_interaction_metadata.js`, so the real dynamic loader no longer stops at `validation-error` before authoritative-ready.
- Confirmed run `32805924775`: reference runtime PASS, authoritative sample PASS, 168 coverage PASS, DOM PASS, browser install PASS, Chromium/Firefox/WebKit-iPhone + print validation PASS, public reference runtime smoke PASS.
- Added passage-local retained-word notes for content-bearing future/outside words instead of globally authorizing them: `water` (8 passages), `idea` (6), `hamster` (2), `chocolate` (2). Current notes=18, all Japanese glosses nonblank, `missing_gloss=0`, notes UI gate PASS. These notes never become cumulative vocabulary.
- Reworked vocabulary chronology audit safely: preserved original scanner as `v10_vocab_notes_candidate_audit_base.js`; current `v10_vocab_notes_candidate_audit.js` wraps it and treats a token as `NOTED_UNLEARNED_ALLOWED` only in the current passage and only when its note has both nonblank English and Japanese. Capitalization/proper-name and all other v7 chronology rules remain fail-closed.
- Vocabulary reductions during this run: prior checkpoint `563 unique / 3041 occurrences`; after reference-v7 Nice repair `561 / 2978`; after 14 passage-local water/idea notes `559 / 2894`; after hamster/chocolate notes `557 / 2848`.
- v7 evidence checked directly in native Sheet: `hamster` appears in SS2 PROGRAM7 textbook body with gloss `ハムスター`; `idea` canonical gloss includes `考え`; `fair` is explicitly available before several current `unfair` uses, so `unfair -> not fair` is the next replacement candidate rather than an automatic note. `chocolate` is the PROGRAM5 topic but has no standalone v7 lexical row, so it is retained only with a passage-local gloss.

## Current exact state
- Vocabulary audited: `168/168`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Current strict unresolved: `557` unique / `2848` leak occurrences = `1071 FUTURE_V7_LEAK + 1777 UNREGISTERED_V7 + 0 UNREGISTERED_PROPER`.
- Other current classifications: `10132 V7_CHRONOLOGY_ALLOWED`, `2505 MORPHOLOGY_TO_GRAMMAR`, `227 CONTRACTION_TO_GRAMMAR`, `20703 EXPLICIT_FUNCTION_TO_GRAMMAR`.
- Notes present: `18`; notes added this manual run: `18`; missing_gloss=`0`; notes UI=`PASS`.
- Grammar structural scan: `168/168`, 19 detected feature families. Final evidence-backed NH/SS subunit grammar chronology remains fail-closed: `v10_grammar_chronology_gate.json` still has empty `introductionEvidence`, resolvedOccurrences=0, futureGrammarLeak=PENDING, finalPass=false.
- Slash/reference: known complete PASS run `32805924775`, including Chromium/Firefox/WebKit-iPhone and print. Latest rescan `32806585032` had reference runtime PASS, sample PASS, coverage PASS, DOM PASS and was installing browser engines at checkpoint time; final result must be re-read next run.
- A/B evidence synchronization for the Great/Nice chronology bridge is included; no main release performed.

## Key commits / runs
- Production runtime chronology integration: `9a7b083b48f5259837c9ae97e8cf776e98fb0ae6`.
- Section-exact chronology + note bridge evolved through `b67c71ef...`, latest note expansion manual commit `4230611b6011a976151a27466cb0c63f8bf16f2c`.
- Base vocabulary scanner preserved: `c7dc0c9a6b1cb807931b092c33033a835aca527f`.
- Passage-note-aware vocabulary wrapper: `b3ad70d41b51706008f5846c09f1e289efe571ea`; rescan trigger/current manual audit commit `58cec58825b9a03585a6809b5bc42bb1721186cf`.
- Latest generated audit evidence commit before checkpoint: `9ce63c0baa0422e5729f9dffbedcca9dd1e7c190`.
- Full slash/browser/print PASS: run `32805924775`.
- Latest slash rescan: run `32806585032`, in progress at browser-install step when checkpoint was written.

## Exact stop / next start
- Exact stop: strict vocabulary is confirmed at `557 unique / 2848 occurrences`; 18 passage-local notes are visible and gloss-complete; grammar chronology is still fail-closed. Latest slash rescan has passed through DOM.
- Next start 1: re-read branch HEAD, main HEAD, this checkpoint, latest `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt`, latest unresolved JSON, and final result/log of slash run `32806585032`.
- Next start 2: continue highest-frequency unresolved list without batching. Start with `unfair` (22 occurrences): direct v7 evidence shows `fair=公平な` exists earlier for relevant later contexts; inspect every affected sentence and use natural `not fair` only where grammar remains natural, synchronizing fullTranslation/slashRows/A-B answer/evidence/evidenceJp/reason. Do not blanket-replace adjective modifiers.
- Next start 3: continue genuine future/unregistered candidates in descending frequency. Prefer natural prior-vocab replacement; add a passage-local note only when meaning would otherwise be distorted. Every note must have v7-priority JP gloss and never become cumulative vocabulary.
- Next start 4: once vocabulary leak reaches zero, populate evidence-backed NH/SS exact-subunit `introductionEvidence` for all 19 grammar feature families and turn candidate scanning into true chronology PASS/FAIL; drive unresolved grammar and future grammar leak to zero.
- Final only after vocab+grammar+missing gloss+slash+A/B all PASS: rerun coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only then update main and verify live GitHub Pages 168/168 + notes + mobile + print. Stop automation only after live public PASS.
