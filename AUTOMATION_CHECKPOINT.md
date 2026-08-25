# Long-reading app vocabulary / grammar / notes checkpoint

Updated: 2026-08-25 JST (manual continuation)

## Source of truth / safety
- Repo: `yo666ha-boop/reading-app`.
- Work branch: `v10-vocab-grammar-notes-audit`.
- Public `main`: `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`; NOT modified.
- Sole vocabulary authority: native Sheet `1AkKYV6h-9ZCq1-p8126u4t8z0pvPSRnHlOfY8C-3hH4`, tab `単語マスター`, 3975 canonical records.
- Final audit runtime waits for `V10_RUNTIME_LOAD_PROGRESS=complete`, then applies bounded passage-local proper-name/notes layers before scanning all 168 passages. Passage-local notes never enter cumulative vocabulary; proper names require explicit local tagging and capitalization.

## Completed this run
- Re-read branch HEAD, main HEAD, checkpoint, latest Actions and authoritative final-runtime scanner/load order, then resumed from run `32834908093`.
- Recovered run `32834908093` as SUCCESS. Proper-name layer reduced the verified state from `501 unique / 2093 occurrences` to `496 / 2053`; `787 FUTURE + 1266 UNREGISTERED`, notes `117`, missing_gloss `0`, 168/168.
- Located all three final-runtime `everyday` contexts. They are genuine adjectives, not erroneous adverbial `every day`: SS3 PROGRAM6-3 `everyday waste reduction`, NH2 Unit5-1 `everyday actions`, NH3 Unit5-4 `an everyday product`. Therefore no destructive text rewrite was made.
- Native v7 actual checks: no standalone `compare`, `bus`, or `director`; NH2 `learn` first appears at Unit3 Read and Think2; NH2 `explain` at Unit4 Read and Think1/2; NH2 `give-gave` at Let's Read1. These boundaries prove the current earlier uses are future/unregistered rather than globally licensed morphology.
- Added `v10_passage_local_notes_batch5.js`: `everyday` (3 sections), `compares` (2), `bus`, `director`, `explains` (2), `gives` (3), `learn` (3). Batch5 content commit `c17712b67d71e78fc7a8e29dc0de3576c59aed0b`; scanner-load commit `6e99bdd69fd2eb5af08f2373ff90cbe749094632`; rerun marker commit `3ddcf61055d224328a7ae293d902705698fc23f8`.
- Initial batch5 Actions attempts were cancelled by the workflow's same-branch `cancel-in-progress` while evidence-writer bot commits moved the branch. Re-ran the cancelled job after writer convergence. The second attempt completed the canonical snapshot, 168 vocabulary scan, 168 grammar candidate scan, reports, and bounded notes UI evidence.
- Verified batch5 result: `489 unique / 1987 occurrences` = `760 FUTURE + 1227 UNREGISTERED`; notes `132`; missing_gloss `0`; passages `168/168`; notes UI PASS; grammar candidates `168/168`, 20 feature families.
- Continued immediately into the next high-frequency group. Native v7 actual: `paw=（動物の）足` exists later in SS2 PROGRAM6 textbook body; `reindeer=トナカイ` later in SS1 PROGRAM9 body; `savanna=サバンナ` later in SS1 PROGRAM6 body; `supply-supplies=必需品` at NH3 Unit6 Part1. Runtime NH1 Unit9-3 confirms `charm` means `お守り`.
- Added `v10_passage_local_notes_batch6.js` for passage-local `paw`, `reindeer`, `savanna`, `shop`, `supplies` (NH3 Unit4-1/4-2/4-4), `banknote`, `cake`, `charm`, `classmate`, `comic`. Batch6 content commit `0aabc1c953c3af323a4fe3d4014f3219124c6d45`; scanner-load commit `4becbf94b398d8b56d9ae01aeb7a24bd5978d23a`.
- Authoritative batch6 evidence was persisted by bot through branch HEAD `bfcea4dfe635976e8ae1c231beeaa65f79673f45`.
- Verified batch6 result: `479 unique / 1902 occurrences` = `724 FUTURE + 1178 UNREGISTERED`; notes `144`; missing_gloss `0`; passages `168/168`; notes UI PASS; grammar candidates `168/168`, 20 feature families.
- Total verified progress during this run: `496 -> 479 unique`, `2053 -> 1902 occurrences`, a reduction of 17 unique / 151 unresolved occurrences without global-allowing the tokens.

## Current exact VERIFIED state
- Vocabulary passages audited: `168/168`.
- Vocabulary chronology: FAIL / IN PROGRESS.
- Unresolved: `479 unique / 1902 occurrences` = `724 FUTURE_V7_LEAK + 1178 UNREGISTERED_V7`.
- Notes present: `144`; `missing_gloss=0` PASS.
- Grammar candidate coverage: `168/168`; 20 detected feature families. Evidence-backed exact subunit introduction chronology is still incomplete, so grammar chronology remains fail-closed/pending; no PASS claimed.
- Notes UI: PASS on latest persisted batch6 evidence.
- Slash/browser/print: new batch6-triggered slash run `32840208534` was still `in_progress` at checkpoint save. Do not claim latest slash/browser/print PASS until that run (or a later authoritative run for the same content) completes successfully.
- Public main release: NOT performed; main remains `1f0cabf9bfcc4482f507e33188499bdbbd5bab57`.

## Actions / commits
- Prior proper-name authoritative run: `32834908093` SUCCESS.
- Batch5 content: `c17712b67d71e78fc7a8e29dc0de3576c59aed0b`.
- Batch5 scanner/retrigger: `6e99bdd69fd2eb5af08f2373ff90cbe749094632`, `3ddcf61055d224328a7ae293d902705698fc23f8`.
- Batch5 authoritative run: `32839854902`, attempt 2 used after cancellation/concurrency; evidence persisted and status verified at `489 / 1987`, notes 132.
- Batch6 content: `0aabc1c953c3af323a4fe3d4014f3219124c6d45`.
- Batch6 scanner: `4becbf94b398d8b56d9ae01aeb7a24bd5978d23a`.
- Batch6 authoritative reports persisted by bot to branch HEAD `bfcea4dfe635976e8ae1c231beeaa65f79673f45`; status verified at `479 / 1902`, notes 144.
- Batch6 slash-quality run: `32840208534` in progress at checkpoint save.

## Exact stop / next start
- Exact stop: authoritative batch6 vocabulary/notes evidence is persisted and verified (`479 unique / 1902 occurrences`, missing_gloss=0). The newest unresolved list begins with the next untreated group including `Anna` (8 occurrences, SS1 Step 6 / Our Project 3 / Power-Up 6) and further 8-occurrence content words after the batch6 removals. `Anna` must NOT be glossed blindly: first verify its final-runtime person-name context and add a passage-local proper-name allowance if warranted.
- Next start: first read branch/main, newest checkpoint, newest `VOCAB_GRAMMAR_NOTES_AUDIT_STATUS.txt` / unresolved JSON, and completion of slash run `32840208534`. If slash run fails, repair regression before proceeding; if it passes, preserve the evidence.
- Then verify `Anna` in final runtime and treat as proper name only with explicit local evidence. Continue the updated highest-frequency unresolved group (including any remaining 8-occurrence words such as communication and subsequent entries) against native v7 actual, preferring safe known-word rewrites only when natural; otherwise use bounded notes with canonical Japanese meaning where available.
- Continue without small-batch stopping until vocabulary chronology reaches `future_vocab_leak=0` / `unique_unresolved=0` / `missing_gloss=0`.
- Then populate evidence-backed exact-subunit grammar introduction boundaries for all 20 detected feature families and require `future_grammar_leak=0` across all 168 passages and A/B English fields.
- Finally rerun slash reference 168/168, A/B evidence consistency, coverage/DOM, Chromium/Firefox/WebKit-iPhone, A4 student/teacher print. Only every-gate PASS permits main update and live Pages verification; only live Pages PASS permits completion/automation stop.
