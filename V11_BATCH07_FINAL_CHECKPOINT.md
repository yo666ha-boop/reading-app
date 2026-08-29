# v11 Batch07 final checkpoint — 518/1000

Date: 2026-08-29 JST
Branch: `v11-1000passage-easy-notes`

## Formal state
- Baseline: 168
- Batch01-07 additions: 350
- Current total: **518/1000**
- Remaining: **482**
- Batch07 passages: 50
- Batch07 registered: **true**
- Next batch: Batch08
- Next target: 568
- Main release: NO until 1000 passages plus final release gates pass.

## Batch07 composition
- Grade 1: 17
- Grade 2: 17
- Grade 3: 16
- G3 STANDARD: 8
- G3 LONG: 4
- G3 YAMAGUCHI_EXAM: 4
- The four Yamaguchi-exam-style passages preserve the original non-copied exam-operation design and long-reading band.

## Final gates
### Final content quality
Run `33224843787`: **SUCCESS**
- passages=50
- tier counts=17/17/8/4/4
- length issues=0
- structure issues=0
- translation issues=0
- question issues=0
- note issues=0
- high-shared pairs=0
- required-note finalized=1386
- required-note unresolved=0
- temporary glosses=false
- registrationReady=true

### Vocabulary / grammar chronology
Run `33224880824`: **SUCCESS**
- passages=50/50
- vocab tokens scanned=24123
- required-note covered=5657
- vocab unregistered=0
- future vocab leak=0
- grammar occurrences=540
- grammar unresolved=0
- future grammar=0
- final=PASS

### Persistent runtime / UI / support / cross-batch / A4
Run `33224958681`: **SUCCESS**
- persistent total=518
- Batch07=50/50
- extra passages=350
- PC Chromium: overflow=0, errors=0
- iPhone/WebKit: overflow=0, errors=0
- PC normal notes=1450, support notes=584
- iPhone normal notes=1450, support notes=584
- duplicate IDs=0
- duplicate bodies=0
- near duplicates=0
- A4 representative sections=6
- A4 student/teacher PDFs=12
- finalPass=true

## Important repairs completed in Batch07
- Grammar chronology repairs were made without weakening the gate.
- Temporary all-word vocabulary inventory was excluded from chronology eligibility and not used to fake a pass.
- Exact required vocabulary was frozen from actual failures, then Japanese glosses were finalized using verified canonical reuse plus context-reviewed manual glosses.
- G2-010 was one word below its minimum band; a story-compatible sentence was added rather than lowering the band or adding filler.
- Final-quality audit was corrected to understand valid tuple notes and multi-sentence evidence instead of falsely rejecting them.
- Chronology report persistence was made concurrency-safe to prevent non-fast-forward report-push races.

## Next start point
Re-read Drive 00/99 and GitHub actual first. Then continue Batch08 with 50 distinct story designs, G1/G2/G3=17/17/16, preserve meaningful length variety and the G3 standard/long/Yamaguchi-exam mix, and do not register 568 until every gate passes.
