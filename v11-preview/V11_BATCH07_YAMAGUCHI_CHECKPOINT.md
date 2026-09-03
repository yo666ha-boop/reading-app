# V11 Batch07 Yamaguchi Entrance-Exam Integration Checkpoint

Date: 2026-08-29 JST
Branch: `v11-1000passage-easy-notes`
Formal runtime: 468/1000
Batch07: NOT_REGISTERED

## Actual-paper review incorporated

The project now uses a dedicated structural specification based on actual Yamaguchi Prefecture English exam problem/answer page sets, not only commentary articles or passage-length estimates.

Reviewed sources include the 2022–2024 Yamaguchi public-high-school problem/answer archive, the 2025 and 2026 tys/TBS NEWS DIG problem image sets, and official Yamaguchi result/overview material. The 2024 long-reading pages were inspected at question level; observed tasks include sentence insertion, reason/feeling, intention, content-match/detail discrimination, and post-reading one-word contextual completion. Contemporary Yamaguchi papers also retain short dialogue/context reading, material-linked reading and 20–30 word communicative writing.

No copyrighted exam passage text has been copied into the app. The project stores only an original structural analysis and original training passages/questions.

## Canonical Yamaguchi spec

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

Each YAMAGUCHI_EXAM passage keeps app-compatible A5+B5 but must use at least six distinct question types, must include content match, reason/inference, insertion/summary, contextual word/phrase completion, and must have a separate optional 20–30 word free-write task. Material-linked stories also use MATERIAL_LINK.

## Plan gate

Files:
- `v11_batch07_yamaguchi_plan_audit.js`
- `.github/workflows/v11-batch07-yamaguchi-plan-audit.yml`

Run `33218956246`: SUCCESS.
Verified Grade 3 count=16, exam tier=4, long tier=4, standard tier=8, taxonomy/spec markers present, question contract present, registration lock preserved.

## Four YAMAGUCHI_EXAM drafts authored

Files:
- `v11_batch07_yamaguchi_exam_draft_g3.js`
- `v11_batch07_yamaguchi_exam_evidence_sync.js`
- `v11_batch07_yamaguchi_exam_draft_audit.js`
- `.github/workflows/v11-batch07-yamaguchi-exam-draft-audit.yml`

All four are original, non-runtime drafts with full Japanese translation, sentence-aligned slashRows, materialData, A5+B5 typed reading questions, answer/evidence/evidenceJp/reason, MATERIAL_LINK and a separate 20–30 word freeWriteTask.

Measured English word counts:
- V11-B07-G3-003 = 366 words
- V11-B07-G3-006 = 367 words
- V11-B07-G3-009 = 377 words
- V11-B07-G3-014 = 374 words

Each is within the new 330–450 word YAMAGUCHI_EXAM tier.

The first audit correctly detected one exact Japanese evidence mismatch in G3-006. The gate was not weakened. A canonical evidence-sync layer now maps exact English evidence sentences to their exact slashRows Japanese counterparts, and the audit fails if an English evidence sentence has no slash-row match.

Draft audit run `33219387086`: SUCCESS.
Workflow-path hardening rerun `33219416820`: SUCCESS.
Current draft audit verifies all four passages: word band, translation/slash structure, A/B 5+5, at least six distinct question types, required Yamaguchi task types, material-linked evidence, exact evidence alignment and free-write contract.

## Registration state

Batch07 remains `registered=false`; formal runtime remains 468/1000. The four exam-tier drafts have not yet passed v7 vocabulary chronology, grammar chronology, final notes/easy-support, cross-batch, PC/iPhone, A4 or persistent-runtime gates, so they are not counted in the runtime total.

## Next exact work point

Continue Batch07 authoring from the locked plan: author the four LONG Grade 3 passages at 240–330 words and the remaining eight STANDARD Grade 3 passages at 150–230 words, then Grade 1=17 and Grade 2=17. After all 50 English passages are stable, run vocabulary/grammar chronology without reducing the new length tiers, synchronize translation/slash after every repair, finalize A/B typed question evidence and notes, then run cross-batch, PC/iPhone, A4 and persistent runtime. Only after all gates pass may 468→518 be registered.
