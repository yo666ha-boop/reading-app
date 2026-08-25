# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-26 JST (automation continuation, future grammar rewritten to zero; unresolved evidence remains)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. No v5/v6 authority used.
- Grammar gate remains fail-closed: unresolved evidence or future grammar prevents PASS.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, grammar report/evidence/gate, and actual final runtime load order before editing.
- Recovered the persisted detailed grammar future list. Pre-fix refined state after detector correction was `1325 detected / 948 resolved / 320 unresolved / 57 future` over `168/168`.
- Fixed detector false positives where predicative adjectives ending in `-ing` (for example `interesting`, `amazing`) had been mistaken for present/past progressive. Detector v3.1 commit `890426950fc545b25a1ddd2021f6b14f35506490`. This removed 16 false future occurrences without widening chronology.
- Implemented synchronized future-grammar rewrites in the last reference/runtime correction layer (`v10_reference_slash_manual_zz_corrections.js`) for 20 exact sentences covering all 18 remaining future section-feature groups. Content commit `f076f0d757d38b6926ce0896df0dcbd9fd186799`. Each rewrite updates sentence, Japanese full translation substring, slash EN/JP, matching A evidence/question, matching B evidence/question, and audit note; missing targets throw rather than silently pass.
- Confirmed post-rewrite grammar authoritative state: `1268 detected / 948 resolved / 320 unresolved / 0 future`, features `29`, passages `168/168`; grammar remains FAIL-CLOSED only because 320 occurrences still lack exact evidence boundaries. Current log records `future=0`. No chronology boundary was widened to achieve this.
- The grammar-safe rewrite `every day` introduced one future lexical token `day` in NH1 Unit 3-3 and Unit 4-2 (10 occurrences). Detected this regression immediately: temporary vocabulary state was `1 unique / 10 future occurrences`.
- Added bounded final sync `v10_grammar_vocab_final_sync.js` replacing those two `every day` rewrites with already-learned `after school`, synchronizing sentence/translation/slash/A+B evidence. Commit `247c89b9dcf656a0bf5654701aa0986ea78b839c`.
- Updated authoritative vocabulary wrapper to execute that final sync after final runtime + local annotations. Commit `b63b49db6f3a88ca159f70194a18794eaf1d09bc`.
- Verified vocabulary chronology is restored to full PASS: `168/168`, `FUTURE_V7_LEAK=0`, `UNREGISTERED_V7=0`, unique unresolved `0`, future vocab leak `0`, notes `663`, missing_gloss `0`, runtime browser errors `0`.
- Re-opened official 2025 Sunshine 2/3 annual plans and visually checked the PDF pages. They prove PROGRAM-level placements (SS2 P1 future+gerund, P3 infinitive; SS3 P1 ask-O-to/It-is-for-to/present-perfect, P2 perfect/perfect-progressive, P4 participle+indirect question, P5 relative pronoun), but do not by themselves prove exact app subunit boundaries; therefore unresolved rows were NOT globally authorized.

## Current exact state
- Vocabulary chronology: `PASS 168/168`.
- Vocabulary violations: `0 unique / 0 occurrences`.
- FUTURE_V7_LEAK: `0`.
- UNREGISTERED_V7 / UNREGISTERED_PROPER: `0`.
- Notes present: `663`.
- missing_gloss: `0`.
- Notes UI: `PASS` on latest authoritative report.
- Grammar candidate coverage: `168/168`.
- Grammar detector: `v3.1`, 29 detected feature families after false-positive cleanup.
- Grammar detected occurrences: `1268`.
- Grammar resolved occurrences: `948`.
- Grammar unresolved occurrences: `320`.
- future grammar leak: `0`.
- Grammar chronology: `FAIL-CLOSED / IN PROGRESS` because unresolved exact evidence remains.
- Public main release: NOT performed.
- Latest slash-quality run for the new rewrite series: `32881545793` was still in progress at checkpoint time; do not claim final slash PASS yet.

## Important implementation caveat
- `v10_grammar_vocab_final_sync.js` is currently executed by the authoritative vocabulary audit wrapper after runtime completion, so vocabulary audit is back to 0/0. It is NOT yet inserted into the production `v10_interaction_metadata.js` chunk list. Before release, integrate it into the actual final runtime load order (after grammar/reference rewrite layer) and re-run all gates. Do not treat audit-only execution as production completion.

## Exact stop / next start
- Exact stop: confirmed future grammar is now `0`; vocabulary regression caused by the rewrites was found and corrected in authoritative audit; remaining grammar blocker is `320 unresolved` evidence occurrences plus production runtime integration of the final lexical sync.
- Next start: first retrieve latest slash-quality result `32881545793` and branch bot commits. If slash/reference fails, repair reference/runtime consistency without reverting chronology-safe text.
- Then finish evidence-backed exact subunit boundaries for the 320 unresolved grammar occurrences. Highest unresolved cohorts remain Sunshine/NH modal, passive, SV_OO, superlative, verb-to-infinitive and Sunshine program-level families. Use exact source evidence; PROGRAM-only evidence remains unresolved.
- Integrate `v10_grammar_vocab_final_sync.js` into the actual `v10_interaction_metadata.js` final load order after the grammar/reference correction layer, then require vocabulary 0/0 and grammar future 0 again on production-equivalent runtime.
- After `unresolvedOccurrences=0` and grammar final PASS, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only all-gate PASS permits main update and live GitHub Pages verification; only live Pages PASS permits completion/automation stop.

## Key commits/runs this continuation
- Detector v3.1 false-positive fix: `890426950fc545b25a1ddd2021f6b14f35506490`.
- Future-grammar synchronized rewrites: `f076f0d757d38b6926ce0896df0dcbd9fd186799`.
- Gate trigger/status: `24af2f1d245e37fd362f30e51ebfc6fc9bfe85d2`.
- Grammar-vocabulary final sync: `247c89b9dcf656a0bf5654701aa0986ea78b839c`.
- Authoritative vocabulary wrapper sync: `b63b49db6f3a88ca159f70194a18794eaf1d09bc`.
- Verified grammar log: `1268 / 948 / 320 / 0 future`.
- Verified vocabulary log: `0 unresolved / 0 future vocab / missing_gloss 0 / notes 663`.
- Slash-quality run `32881545793`: in progress at checkpoint write.
- Public main remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
