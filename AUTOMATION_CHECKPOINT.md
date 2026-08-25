# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. Metadata re-read this run: 3976 rows including header, 33 columns, tab sheetId `109187341`.
- Authoritative audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-4 and notes batches 2-13 before scanning all 168 passages. Notes are exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions and authoritative load order before editing. Main remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
- Recovered successful authoritative artifact from run `32851939899` and verified batch12 (`months`) state exactly: `331 unique / 951 occurrences` = `300 FUTURE_V7_LEAK + 651 UNREGISTERED_V7`; notes `329`; `missing_gloss=0`; passages `168/168`.
- Re-read native v7 Sheet metadata and bounded live source data; did not use v5/v6 as authority.
- Added passage-local proper-name batch4 for `Aya` only in SS3 PROGRAM 3-1. Commit `9f00badeacddce0b290bca20797c5876145cd732`.
- Added `v10_passage_local_notes_batch13.js` for 29 four-occurrence unresolved token families across exact passages: `afternoon`, `area`, `Asia`, `attack`, `attacking`, `automatic`, `ball`, `banana`, `beach`, `believed`, `brown`, `charity`, `connected`, `connection`, `conservation`, `consumers`, `continued`, `continues`, `conversation`, `damaged`, `dangerous`, `decline`, `development`, `done`, `door`, `dream`, `economics`, `elevator`, `emergency`. Commit `4a9abe9392d6d381a15853924ac52ab3eb9c451a`.
- Updated authoritative scanner to load proper-name batch4 and notes batch13 after final runtime completion. Commit `fba5023d5690d40cfba4dba30bc1afd38679ca93`.
- Authoritative run `32856710276` completed SUCCESS. Artifact `9566464062` was downloaded and read directly.
- Exact post-batch13 state: `301 unique / 831 unresolved occurrences` = `252 FUTURE_V7_LEAK + 579 UNREGISTERED_V7`; notes `360`; `missing_gloss=0`; passages `168/168`; proper-name unresolved `0`; runtime browser errors `0`; notes UI PASS.
- Verified reduction this run from the pre-batch12 baseline `332 / 957` to `301 / 831`: `31 unique / 126 occurrences`; notes `328 -> 360`; missing gloss remained zero. Relative to verified batch12 state, batch13/proper-name batch4 reduced `30 unique / 120 occurrences` and added 31 notes.
- Grammar candidate scan still covers `168/168` and detects 20 feature families, but status remains `CANDIDATES_NOT_PASS_FAIL_REQUIRE_EVIDENCE_BACKED_SECTION_CHRONOLOGY`; no grammar chronology PASS is claimed.

## Current exact state
- Vocabulary passages audited: `168/168`.
- Vocabulary violations: `301 unique / 831 occurrences`.
- FUTURE_V7_LEAK: `252 occurrences`.
- UNREGISTERED_V7: `579 occurrences`.
- Notes present: `360`.
- missing gloss: `0`.
- Proper-name unresolved: `0`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Grammar chronology: FAIL-CLOSED / IN PROGRESS; candidate coverage `168/168`, 20 feature families, evidence-backed exact subunit boundaries incomplete.
- Notes UI gate: PASS on run `32856710276`.
- Slash/reference: no new sentence/slash mutations were introduced by batch13/proper-name batch4; final slash/browser/print revalidation still required before release.
- Public main release: NOT performed.

## Exact stop / next start
- Exact stop: batch13/proper-name batch4 authoritative audit is verified SUCCESS at `301 unique / 831 occurrences`; checkpoint now records that exact artifact-backed state.
- Next start: continue immediately through the remaining four-occurrence group beginning `enter`, `essential`, `evening`, `exciting`, `fold`, `forms`, `four`, `goal`, `gorgeous`, `grew`, etc. For each token distinguish same-textbook v7 chronology, productive morphology/grammar, proper name, safe learned-vocabulary rewrite, and required exact passage-local note; never global-allow merely to reduce counts.
- Continue vocabulary until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`. Then complete evidence-backed exact-subunit grammar introduction boundaries for all 20 feature families and require `future_grammar_leak=0` across all 168 passages plus A/B English fields.
- After both chronologies reach zero leaks, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion.
