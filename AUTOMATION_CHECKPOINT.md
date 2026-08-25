# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Authoritative audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-3 and notes batches 2-12 before scanning all 168 passages. Notes are exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions, current wrapper/final audit load order, and recovered the previous successful candidate-report Actions artifact rather than relying on stale checked-in JSON.
- Start state verified from prior batch9 artifact/checkpoint: `425 unique / 1493 occurrences` = `543 FUTURE_V7_LEAK + 950 UNREGISTERED_V7`; notes `215`; `missing_gloss=0`; passages `168/168`.
- Added `v10_passage_local_notes_batch10.js` with 69 exact textbook+grade+section definitions, including the remaining 7-occurrence `without` and most 6-occurrence unresolved vocabulary. Commit `69c3292099660de91791c3955910accda8fb0eca`; scanner-load commit `d33ac5dd92fa4b194a7e251b7ae200954f23126d`.
- Added `v10_passage_local_proper_names_batch3.js` instead of glossing names as ordinary vocabulary: `Emi`, `France`, `Kenya` (two exact passages), `Singapore`, `Osaka`. Commit `ead48820cd4af9a4b1fe0fdf61f9708500b4258c`; scanner-load commit `cae769b73bd434ddd5e480f3789369e4e81635d0`.
- Added `v10_passage_local_notes_batch11.js` for the remaining common 6-occurrence items and the full 5-occurrence group except proper-name `Osaka`. Content commit `9536b00c6192014053db13bb5f667d11b2712872`; authoritative-load commit / tested content HEAD `8b1bb87dc62306799605773e779febcf7b49ec12`.
- Authoritative PR run `32851438908` for HEAD `8b1bb87...` completed SUCCESS. Passage audit `32851438922` for the same HEAD completed SUCCESS.
- Downloaded the authoritative run artifact `9564423098` and verified exact post-batch11 state: `332 unique / 957 unresolved occurrences` = `300 FUTURE_V7_LEAK + 657 UNREGISTERED_V7`; notes `328`; `missing_gloss=0`; passages `168/168`; proper-name unresolved `0`; mapping errors `0`; runtime browser errors `0`.
- Therefore verified progress this run through batch11 is `425 -> 332 unique`, `1493 -> 957 occurrences`: reduction `93 unique / 536 occurrences`; notes `215 -> 328`; missing gloss remained zero.
- Grammar candidate report from the same artifact still classifies itself `CANDIDATES_NOT_PASS_FAIL`; all `168` passages are covered and 20 feature families are extracted, but evidence-backed exact subunit introduction boundaries are not yet complete. No grammar chronology PASS is claimed.
- Rechecked v7 native Sheet for `month`: exact canonical row is NH1 U3 `month = （暦上での）月`, base `month`; no same-textbook SS chronology entry licenses SS3 PROGRAM 2-2 `months`.
- Added `v10_passage_local_notes_batch12.js` for that final 6-occurrence token `months`, using the v7 Japanese gloss but keeping it SS3 passage-local/non-cumulative. Content commit `1a273faa876a6ee3cc692d6805c83c54723b6bd9`; scanner-load commit `f215a795c9c1f2f4c62dd110cd141028597f28ce`.

## Current exact state
- Vocabulary passages audited: `168/168` on the latest completed authoritative evidence (batch11).
- Latest VERIFIED vocabulary state: `332 unique / 957 occurrences` = `300 FUTURE + 657 UNREGISTERED`; notes `328`; `missing_gloss=0`.
- Batch12 (`months`) is implemented and wired, but its new authoritative run `32851870832` was still pending at checkpoint time; do not claim the expected one-token/six-occurrence reduction until its artifact is read.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Grammar chronology: FAIL-CLOSED / IN PROGRESS; candidate coverage `168/168`, 20 feature families, exact introduction chronology incomplete.
- Slash: previous batch9 content run `32845023852` SUCCESS. Same-HEAD batch11 slash-quality run `32851438968` was still reported `in_progress` at the latest explicit recheck, so no new batch11 slash PASS is claimed yet.
- Notes UI / candidate audit: latest completed authoritative batch11 run has notes `328`, missing gloss `0`, mapping errors `0`, runtime browser errors `0`.
- Public main release: NOT performed.

## Commits / runs
- batch10 notes: `69c3292099660de91791c3955910accda8fb0eca`
- batch10 scanner load: `d33ac5dd92fa4b194a7e251b7ae200954f23126d`
- proper-name batch3: `ead48820cd4af9a4b1fe0fdf61f9708500b4258c`
- proper-name batch3 scanner load: `cae769b73bd434ddd5e480f3789369e4e81635d0`
- batch11 notes: `9536b00c6192014053db13bb5f667d11b2712872`
- batch11 scanner load / tested HEAD: `8b1bb87dc62306799605773e779febcf7b49ec12`
- batch11 authoritative audit: `32851438908` SUCCESS
- batch11 passage audit: `32851438922` SUCCESS
- batch11 slash quality: `32851438968` latest observed `in_progress`
- batch12 notes: `1a273faa876a6ee3cc692d6805c83c54723b6bd9`
- batch12 scanner load: `f215a795c9c1f2f4c62dd110cd141028597f28ce`
- batch12 authoritative run: `32851870832` pending at checkpoint time

## Exact stop / next start
- Exact stop: batch12 is implemented/wired. Latest completed artifact after batch11 leaves exactly one 6-occurrence token (`months`), then `114` four-occurrence unique tokens, `61` three-occurrence tokens, and `156` two-occurrence tokens. Batch12 targets the sole six-occurrence token.
- Next start: re-read branch/main/checkpoint and run `32851870832`; if completed, download its candidate artifact and persist the exact new unresolved metrics. Then continue directly through the 4-occurrence group beginning `afternoon`, `area`, `asia`, `attack`, `attacking`, `automatic`, `aya`, `ball`, `banana`, `beach`, `believed`, `brown`, `charity`, `connected`, `connection`, `conservation`, etc. For each token distinguish same-textbook v7 chronology, productive morphology/grammar, proper name, natural learned-vocabulary rewrite, and required passage-local note; never global-allow merely to reduce counts.
- Continue vocabulary until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`. Then complete evidence-backed exact-subunit grammar introduction boundaries for all 20 feature families and require `future_grammar_leak=0` across all 168 passages plus A/B English fields.
- After both chronologies reach zero leaks, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion.
