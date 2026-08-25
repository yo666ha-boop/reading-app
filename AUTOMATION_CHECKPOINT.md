# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records. Metadata re-read this run: 3976 rows including header, 33 columns, tab sheetId `109187341`.
- Authoritative audit waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies passage-local proper-name batches 1-4 and notes batches 2-13 before scanning all 168 passages. Notes are exact-passage/non-cumulative; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read current branch HEAD, main HEAD, checkpoint, latest Actions and authoritative load order before editing. Starting branch HEAD was `3c17bdf64d5f1caa94f0f0dd7ab743d19b29ebe7`; main remained `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.
- Recovered the latest completed authoritative artifact from run `32851939899` (artifact `9564614908`) instead of trusting the stale pending note in the previous checkpoint.
- Verified batch12 (`months`) is actually included in that successful HEAD. Exact verified vocabulary state after batch12: `331 unique / 951 unresolved occurrences` = `300 FUTURE_V7_LEAK + 651 UNREGISTERED_V7`; notes `329`; `missing_gloss=0`; passages `168/168`; proper-name unresolved `0`; runtime browser errors `0`; notes UI PASS.
- Therefore batch12 produced the exact expected reduction from the prior verified `332 / 957`: `-1 unique / -6 occurrences`, with notes `328 -> 329` and missing gloss still zero.
- Re-read the native v7 Sheet metadata and performed a bounded live search for `asia`; canonical sheet contains `Asian = アジア(人)の` at row 2053, while unresolved `Asia` remains chronology-gated in SS3 PROGRAM 4-3 and is not globally licensed from that hit.
- Added passage-local proper-name batch4 for `Aya` only in SS3 PROGRAM 3-1 instead of glossing the person name as ordinary vocabulary. Commit `9f00badeacddce0b290bca20797c5876145cd732`.
- Added `v10_passage_local_notes_batch13.js` covering the first large block of four-occurrence unresolved vocabulary, including `afternoon`, `area`, `Asia`, `attack`, `attacking`, `automatic`, `ball`, `banana`, `beach`, `believed`, `brown`, `charity`, `connected`, `connection`, `conservation`, `consumers`, `continued`, `continues`, `conversation`, `damaged`, `dangerous`, `decline`, `development`, `done`, `door`, `dream`, `economics`, `elevator`, `emergency`. All entries are exact textbook+grade+section and non-cumulative. Commit `4a9abe9392d6d381a15853924ac52ab3eb9c451a`.
- Updated the authoritative scanner so it now loads proper-name batch4 and notes batch13 after final runtime completion. Commit / tested-content HEAD `fba5023d5690d40cfba4dba30bc1afd38679ca93`.
- New authoritative run `32856710276` started for `fba5023d...`; latest explicit recheck in this run: `in_progress`. Do not claim the post-batch13 reduced count until its artifact is read.

## Current exact state
- Vocabulary passages audited on latest completed evidence: `168/168`.
- Latest VERIFIED vocabulary state: `331 unique / 951 occurrences` = `300 FUTURE + 651 UNREGISTERED`; notes `329`; `missing_gloss=0`.
- Batch13 + Aya proper-name batch4 are implemented and wired but their exact post-run metrics are still pending authoritative artifact confirmation.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Grammar chronology: FAIL-CLOSED / IN PROGRESS; latest completed candidate coverage remains `168/168`, 20 feature families, exact textbook subunit introduction chronology incomplete; no grammar PASS claimed.
- Slash/reference: no regression claim is made for the new batch13 content until its relevant workflow evidence is completed/read. Notes/proper-name changes do not intentionally alter sentences/slashes.
- Public main release: NOT performed.

## Counters requested for continuation
- Audited passages: `168/168` on latest completed authoritative evidence.
- Vocabulary violations: latest verified `331 unique / 951 occurrences`.
- Vocabulary fixes this run verified before new pending batch: `1 unique / 6 occurrences` from batch12; additional batch13 changes implemented but not yet counted.
- Notes present: latest verified `329`; batch13 adds bounded definitions but exact runtime-added count awaits artifact.
- Grammar violations: not yet an exact leak count; 20 candidate feature families remain chronology-unresolved / fail-closed.
- missing gloss: `0` latest verified.
- future leak: `300` FUTURE occurrences latest verified; total unresolved occurrences `951`.
- slash regression: latest new batch not yet reverified; prior completed slash evidence remains the last PASS baseline.

## Exact stop / next start
- Exact stop: authoritative run `32856710276` for batch13/proper-name batch4 is in progress. New code is committed and scanner-wired; main is untouched.
- Next start: re-read branch/main/checkpoint and run `32856710276`; when completed, download its candidate artifact and persist exact `unique_unresolved`, FUTURE/UNREGISTERED occurrence counts, notes and missing gloss. If the batch passes, continue immediately through the remaining four-occurrence group beginning after `emergency` (`enter`, `essential`, `evening`, `exciting`, `fold`, `forms`, `four`, `goal`, `gorgeous`, `grew`, etc.), distinguishing same-textbook v7 chronology, morphology+grammar, proper names, safe rewrites, and exact passage-local notes.
- Continue vocabulary until `unique_unresolved=0`, `future_vocab_leak=0`, `missing_gloss=0`; then complete evidence-backed exact-subunit grammar introduction boundaries for all 20 feature families and require `future_grammar_leak=0` across all 168 passages plus A/B English fields.
- After both chronologies reach zero leaks, rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion.
