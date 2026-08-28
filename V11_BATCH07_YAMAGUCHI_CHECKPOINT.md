# V11 Batch07 Yamaguchi Entrance-Exam Integration Checkpoint

Date: 2026-08-29 JST
Branch: `v11-1000passage-easy-notes`
Formal runtime: 468/1000
Batch07: NOT_REGISTERED

## Actual-paper review incorporated

The project now uses a dedicated structural specification based on actual Yamaguchi Prefecture English exam problem/answer page sets, not only commentary articles or passage-length estimates.

Reviewed sources include the 2022–2024 Yamaguchi public-high-school problem/answer archive, the 2025 and 2026 tys/TBS NEWS DIG problem image sets, and official Yamaguchi result/overview material. The 2024 long-reading pages were inspected at question level; observed tasks include sentence insertion, reason/feeling, intention, content-match/detail discrimination, and post-reading one-word contextual completion. Contemporary Yamaguchi papers also retain short dialogue/context reading, material-linked reading and 20–30 word communicative writing.

No copyrighted exam passage text has been copied into the app. The project stores only an original structural analysis and will author original training passages/questions.

## New canonical spec

`V11_YAMAGUCHI_ENTRANCE_EXAM_READING_SPEC.md`

Question taxonomy:
- DETAIL
- GIST
- REASON
- INFERENCE
- SENTENCE_INSERTION
- CONTENT_MATCH
- CONTEXT_WORD
- PHRASE_FILL
- SUMMARY_FILL
- MATERIAL_LINK
- FREE_WRITE_20_30

Grade 3 length tiers from Batch07 onward:
- STANDARD 150–230
- LONG 240–330
- YAMAGUCHI_EXAM 330–450

Batch07 Grade 3 distribution is locked to 8 STANDARD + 4 LONG + 4 YAMAGUCHI_EXAM.

YAMAGUCHI_EXAM IDs:
- V11-B07-G3-003
- V11-B07-G3-006
- V11-B07-G3-009
- V11-B07-G3-014

LONG IDs:
- V11-B07-G3-001
- V11-B07-G3-004
- V11-B07-G3-008
- V11-B07-G3-013

Each YAMAGUCHI_EXAM passage keeps app-compatible A5+B5 but must use at least six distinct question types, must include content match, reason/inference, insertion/summary, contextual word/phrase completion, and must have a separate optional 20–30 word free-write task. Material-linked stories should also use MATERIAL_LINK.

## Audit

New gate:
- `v11_batch07_yamaguchi_plan_audit.js`
- `.github/workflows/v11-batch07-yamaguchi-plan-audit.yml`

Run `33218956246`: SUCCESS.
Verified Grade 3 count=16, exam tier=4, long tier=4, standard tier=8, taxonomy/spec markers present, question contract present, registration lock preserved.

## Registration state

Batch07 remains `registered=false`; formal runtime remains 468/1000. This change strengthens authoring requirements and does not bypass vocabulary/grammar chronology, translation/slash, note, naturalness, cross-batch, PC/iPhone, A4, or persistent-runtime gates.

## Next exact work point

Author the locked Batch07 50 passages using the new length tiers. For the four YAMAGUCHI_EXAM passages, create 330–450 word original passages first, then create typed A/B questions and optional free-write tasks. After the English is stable, perform chronology repair without lowering the new length tier, synchronize fullTranslation/slashRows, then run all existing and Yamaguchi-specific final gates before 468→518 registration.
