# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (automation continuation, batches15-16 + grammar routing)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. Live native workbook was exported/read again this run; no v5/v6 authority used.
- Authoritative audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-4 and notes batches 2-16 before scanning all 168 passages. Notes are exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, authoritative runtime order, and latest unresolved artifact before editing. Public main remained unchanged.
- Started from verified batch14 state `247 unique / 615 occurrences` = `200 FUTURE_V7_LEAK + 415 UNREGISTERED_V7`, notes `415`, missing_gloss `0`, passages `168/168`.
- Processed the complete remaining four-occurrence cohort rather than stopping in small groups. Added `v10_passage_local_notes_batch15.js` with 37 exact-passage definitions covering all 30 remaining four-occurrence token families. Content commit `a03c7c593544dbcb8814bbdfd5b2cecf98e967c1`; scanner connection commit `102aed2f6834e5a1992f12b77e603536ad75d22e`.
- Important bounded cases: `U.N.` is annotated as `国際連合` only in SS2 PROGRAM 5-3, so tokenizer output is not globally authorized; `hard` in SS1 PROGRAM 6-2 was checked against actual sentence `We practice hard there.` / Japanese meaning `一生懸命に`.
- Continued immediately through the three-occurrence cohort. Added `v10_passage_local_notes_batch16.js` with 59 exact-passage lexical definitions; deliberately excluded `I'd` and `whether` because they are grammar/contraction structures, not lexical notes. Content commit `e0507469a34df1fa972912545aad5911735a4c56`; scanner connection commit `c6e99e15727a525e754a768983fa183644db25db`.
- Authoritative run `32863554450` completed SUCCESS. Artifact `9569148748` was downloaded/read. Post-batch16 exact state was `158 unique / 318 occurrences` = `82 FUTURE_V7_LEAK + 236 UNREGISTERED_V7`; notes `511`; missing_gloss `0`; passages `168/168`; unresolved proper `0`.
- Slash-quality run `32863517406` completed SUCCESS for batch16 content; no slash/reference regression from batches15-16.
- Fixed vocabulary classification so `I'd` is routed to `CONTRACTION_TO_GRAMMAR` and `whether` to `EXPLICIT_FUNCTION_TO_GRAMMAR`, before local-note handling. Commit `11277e08a578201997b92700157c98c62814dda3`.
- Extended grammar candidate detection with explicit `WOULD_LIKE` (`I would like to` / `I'd like to`) and `WHETHER_CLAUSE` features. Commit `b37703f61a1974e688c418a7a96ff95b88c65032`.
- Latest persisted authoritative status after grammar routing: `156 unique / 312 occurrences`; `82 FUTURE_V7_LEAK + 230 UNREGISTERED_V7`; contraction-to-grammar `230`, explicit-function-to-grammar `20704`; notes `511`; missing_gloss `0`; passages `168/168`.
- Grammar candidate coverage remains `168/168`; detected feature families increased from 20 to 22 because `WOULD_LIKE` and `WHETHER_CLAUSE` are now represented instead of being hidden as vocabulary. Exact evidence-backed textbook/subunit introduction boundaries are still incomplete, so no grammar PASS is claimed.

## Current exact state
- Vocabulary passages audited: `168/168`.
- Vocabulary violations: `156 unique / 312 occurrences`.
- FUTURE_V7_LEAK: `82 occurrences`.
- UNREGISTERED_V7: `230 occurrences`.
- Notes present: `511`.
- missing gloss: `0`.
- Proper-name unresolved: `0`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Grammar chronology: FAIL-CLOSED / IN PROGRESS; candidate coverage `168/168`, now 22 detected feature families, evidence-backed exact subunit boundaries incomplete.
- Slash/reference: batch16 content slash-quality PASS at run `32863517406`; later grammar-scanner-only changes do not mutate sentences/slash data. Full final release slash/browser/print gate still required after chronology completion.
- Public main release: NOT performed.

## Exact stop / next start
- Exact stop: batches15-16 are content-complete and authoritative batch16 audit is SUCCESS. Grammar routing removed `I'd` and `whether` from lexical unresolved, yielding persisted `156 unique / 312 occurrences`. Latest branch Actions were still settling after grammar-scanner changes; treat `156/312` as current persisted authoritative queue.
- Next start: read latest branch HEAD/status/artifact first, then continue the 156 two-occurrence lexical cohort from `across`, `act`, `acting`, `action`, `affected`, `air`, `album`, `alternate`, `article`, `attracted`, `background`, `bang`, `bedtime`, `bench`, `board`, `body`, `bookshop`, etc. Prefer natural learned-vocabulary rewrite when it preserves meaning; use exact passage-local notes only for content-required terms. Do not convert morphology/grammar/structural tokens into lexical notes merely to reduce counts.
- Continue vocabulary until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`. Then populate evidence-backed exact-subunit grammar introduction boundaries for all detected feature families (currently 22) and require `future_grammar_leak=0` across all 168 passages plus A/B English fields.
- After both chronologies reach zero leaks, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion.
