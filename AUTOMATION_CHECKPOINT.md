# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-26 JST (automation continuation, vocabulary chronology PASS + grammar chronology foundation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. Native workbook was exported again this run; no v5/v6 authority used.
- Authoritative vocabulary audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-5 and notes batches 2-17 before scanning all 168 passages. Notes remain exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.
- Grammar final gate is fail-closed. Candidate detection alone is never PASS evidence; exact same-textbook chronological boundaries must resolve every occurrence.

## Completed this run
- Re-read branch HEAD, main HEAD, prior checkpoint, latest Actions/status, authoritative runtime load order and latest unresolved queue before editing. Public main remained unchanged.
- Started from verified `156 unique / 312 occurrences` vocabulary queue = `82 FUTURE_V7_LEAK + 230 UNREGISTERED_V7`, notes `511`, missing_gloss `0`, passages `168/168`.
- Processed the complete remaining two-occurrence lexical cohort rather than stopping in small groups.
- Added `v10_passage_local_proper_names_batch5.js` for the exact-passage proper-name components `Taj / Mahal / Shah / Jahan` in NH2 Unit 7-3 only; never cumulative. Commit `61a9b3a0836353c8b8252e5523abc71034b3587c`.
- Added `v10_passage_local_notes_batch17.js` for the remaining required two-occurrence lexical terms, exact passage only. Commit `1e92091942ce7877c4917b1deca47ac9d4bf958e`.
- Updated authoritative vocabulary scanner to load proper-name batches 1-5 and notes batches 2-17. Commit `6c3775e3d44f2e017544385ce9d88e4fa6251750`.
- Authoritative persisted vocabulary state reached: passages `168/168`; FUTURE_V7_LEAK `0`; UNREGISTERED_V7 `0`; UNREGISTERED_PROPER `0`; unique_unresolved `0`; future_vocab_leak `0`; vocabulary_chronology `PASS`; notes `663`; missing_gloss `0`; notes UI `PASS`.
- Slash-quality for batch17/content changes completed SUCCESS at run `32868771993`; no slash/reference regression from the final vocabulary-note batch.
- Audited the existing grammar candidate detector and found material false positives: ordinary prepositional `to` detected as infinitive, adjective/present-participle `-ing` detected as gerund, demonstrative `that` detected as relative pronoun, adjectival complements like `was tired` detected as passive, and ordinary `the + noun` strings detected as superlative. Therefore the prior 22-family candidate result was not accepted as chronology evidence.
- Rebuilt grammar detector to version 2 with tighter structure-specific patterns and additional chronology-relevant features (present/past progressive, wh-to-infinitive, object-to-infinitive, participle postmodifier, etc.). Initial refinement commit `42f283e3fad3c2203518801dd266a158b26cd688`; persisted fail-closed gate integration commit `0b9235d3bcb2aa8f2da35de3a831645b431327d8`.
- Added `v10_grammar_chronology_evidence.json` as an evidence foundation using current 2025 publisher curriculum sources. Exact boundaries are recorded only where the official source supports the part/subunit; unit/program-only evidence stays explicitly pending and cannot authorize PASS. Commit `4736254ceccbe253963d7cc83aef7ce33e2399cb`.
- Added `v10_grammar_chronology_gate_audit.js`, a fail-closed occurrence resolver. It resolves only exact evidence-backed same-textbook boundaries and separately reports unresolved and future occurrences. Commit `53e58d947bf4e3d74dcec8d2b210e4d1ec2c6b3d`.
- Refined grammar run `32870080040` completed SUCCESS. Current detector v2 actual: passages `168/168`, detected feature types `24`, detected occurrences `1344`, resolved against currently exact evidence `98`, unresolved `1226`, future grammar leak candidates `20`, final grammar gate `FAIL_CLOSED`.
- The known 20 future candidates were inspected from actual runtime text. Confirmed genuine early structures include NH2 Unit1-3 `when we need help` and sentence-initial gerund `Shopping was ...`, NH2 Unit3-4 `how to read`, NH3 Unit3-1 / Unit4-3 / Unit4-4 relative clauses before the current official Unit5 relative-pronoun boundary, and NH3 Unit4-2 `too heavy to carry`. These must not be hidden by relaxing the chronology gate; they are rewrite/synchronization candidates unless exact earlier evidence is found.
- Also identified a chronology-model defect that must be fixed next: the current gate keys exact boundaries by the current grade, so previously learned grammar from earlier grades is not yet carried forward correctly. In addition, broad families such as generic TO_INFINITIVE and combined MODAL must be split by chronology-relevant subtype before final permission mapping.

## Current exact state
- Vocabulary passages audited: `168/168`.
- Vocabulary violations: `0 unique / 0 occurrences`.
- FUTURE_V7_LEAK: `0`.
- UNREGISTERED_V7: `0`.
- UNREGISTERED_PROPER: `0`.
- Notes present: `663`.
- missing_gloss: `0`.
- Vocabulary chronology: `PASS 168/168`.
- Notes UI gate: `PASS`.
- Slash/reference: final vocabulary content batch slash-quality `PASS` at run `32868771993`; full final release rerun still required after grammar completion.
- Grammar candidate coverage: `168/168`.
- Grammar detector: v2, `24` currently detected feature types, `1344` detected occurrences.
- Grammar chronology resolved with current exact evidence: `98` occurrences.
- Grammar chronology unresolved: `1226` occurrences.
- Current future grammar candidate occurrences: `20`.
- Grammar chronology: `FAIL-CLOSED / IN PROGRESS`.
- Public main release: NOT performed.

## Exact stop / next start
- Exact stop: vocabulary chronology has reached authoritative PASS (`0/0`, missing gloss 0, notes UI PASS) and batch17 slash-quality PASS. Grammar detector v2 and fail-closed gate now produce actual counts: `1344 detected / 98 resolved / 1226 unresolved / 20 future`.
- Next start: re-read latest branch/status/action first. Then (1) split chronology-sensitive broad detector families, especially TO_INFINITIVE by use and MODAL by form; (2) change chronology resolution to carry verified earlier-grade introductions forward; (3) inspect and correct the confirmed early future structures, synchronizing sentence, fullTranslation, slashRows, A/B answer/evidence/evidenceJp/reason and reference slash whenever text changes; (4) extend current official NH/SS exact-subunit evidence until unresolved=0 and futureGrammarLeak=0.
- First rewrite candidates to inspect/fix: NH2 Unit1-3 `when we need help` + `Shopping was an interesting experience`; NH2 Unit3-4 `how to read clearly`; NH3 Unit3-1 `animal that lives...`; NH3 Unit4-3 `friend who...` / `people who had died`; NH3 Unit4-4 `people who still needed help`; NH3 Unit4-2 `too heavy to carry`.
- After grammar chronology reaches `PASS 168/168`, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion and automation stop.
