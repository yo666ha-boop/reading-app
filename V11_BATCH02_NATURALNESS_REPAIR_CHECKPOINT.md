# V11 Batch02 naturalness repair checkpoint

Date: 2026-08-28 JST
Branch: `v11-1000passage-easy-notes`
Runtime: 218/1000 (Batch02 remains unregistered)

## Confirmed starting point
- Drive 00/99 and GitHub actual matched at `dddf980d62733b24500f38d79fcdbb83967f2928`.
- Prior chronology gate remains PASS at run `33137033513`: vocab unregistered=0, future_vocab=0, grammar unresolved=0, future_grammar=0.
- Prior naturalness gate run `33137544793`: 184 high-shared pairs, worst Jaccard 0.867, high-common-sentence-ratio failures 50/50.

## Work in this run
- Added `v11_batch02_unique_structure_repair.js` as a non-runtime intermediate repair layer.
- It merges/rotates same-unit chronology-safe rows into passage-specific sentence structures without introducing new content vocabulary outside the already audited material/function-word set.
- Updated `v11_batch02_naturalness_audit.js` to distinguish structural de-duplication from true story-specific semantic completion. The gate deliberately still fails while `semanticRewritePending` remains.
- Updated naturalness workflow to execute the new intermediate repair.

## Measured result
- Naturalness run `33140416735`: high-shared pairs reduced from 184 to 10; high-common-sentence-ratio failures reduced from 50 to 0; old same-unit repair marker reduced to 0. Semantic rewrite pending remains 50/50.
- Follow-up run `33140457483` confirms the same remaining 10 pairs. These are periodic structure overlaps, not a reason to mark the passages complete.
- Final naturalness remains FAIL by design because all 50 passages still require story-specific semantic rewriting.

## Safety / completion rule
- Do not register Batch02 or change runtime 218→268 yet.
- Do not weaken the naturalness gate merely to make it green.
- Next work must replace the remaining chronology-safe scaffolding with title/event-specific coherent prose, then rerun chronology, question, naturalness, notes/easy-support, cross-batch, PC/iPhone, and A4 gates.
