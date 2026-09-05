# V11 Yamaguchi Entrance Exam Reading Specification

Status: ACTIVE_SPEC / READING_ONLY / applies to Batch07 onward and final 1000-passage release audit
Updated: 2026-09-05 JST

## Purpose

The v11 app is an English long-reading comprehension app. The Yamaguchi exam-style track must train reading operations and reading-question forms that appear in Yamaguchi Prefecture public high-school entrance examinations, while preserving textbook/unit vocabulary and grammar chronology.

**English composition / free writing is out of scope for this app.** Even when an actual Yamaguchi examination includes a composition task, v11 does not reproduce, model, score, or count that task. The dedicated Yamaguchi-style 100-passage subset is reading comprehension only.

This specification is an original structural analysis. It does not copy or redistribute copyrighted exam passages.

## Evidence checked

Primary / actual-paper sources checked:
- Yamaguchi Prefecture public high-school English problem/answer archive as reproduced by ReseMom for 2022, 2023 and 2024. ReseMom states that the public-high-school problems/answers are provided by the prefectural boards of education.
  - https://resemom.jp/pages/public-highschool-exam/35yamaguchi/index.html
  - 2024 English archive and answer pages were inspected, including the long narrative about a student doing library volunteering and its attached questions.
  - 2023 and 2022 English problem/answer page sets were checked for page structure and question continuity.
- 2025 Yamaguchi English problem/answer image set published by tys / TBS NEWS DIG.
  - https://newsdig.tbs.co.jp/articles/-/1767650
- 2026 Yamaguchi English problem/answer image set published by tys / TBS NEWS DIG.
  - https://newsdig.tbs.co.jp/articles/-/2507925
- Yamaguchi Prefecture official result/overview material for the 2022 selection, confirming emphasis on grasping gist, key points and necessary information from dialogues/stories.
  - https://www.pref.yamaguchi.lg.jp/uploaded/attachment/114691.pdf

Secondary trend sources were used only to corroborate overall volume/format, not as substitutes for reading actual problem pages.

## Observed Yamaguchi-style reading operations

The app must cover these operations as separate question types instead of treating all questions as literal extraction.

1. DETAIL — locate a stated fact or event accurately.
2. GIST — identify the main point or overall purpose.
3. REASON — identify why a character acted/felt/thought something.
4. INFERENCE — infer a conclusion supported by the passage but not copied verbatim.
5. SENTENCE_INSERTION — choose the logically correct position for a supplied sentence using cohesion and discourse flow.
6. CONTENT_MATCH — choose statements that agree with the passage; distractors should differ by time, actor, cause, degree, or detail.
7. CONTEXT_WORD — complete a word from context, including forms where an initial letter is supplied.
8. PHRASE_FILL — complete a short phrase/expression that fits the dialogue or passage context.
9. SUMMARY_FILL — complete a post-reading summary/dialogue using information from the text.
10. MATERIAL_LINK — integrate a chart, table, sign, schedule, map, survey, graph or other material with the English text.

No free-writing/composition question type belongs to this reading-app taxonomy.

## Concrete actual-paper observations

### 2024
The inspected long narrative uses a coherent multi-stage story rather than isolated grammar sentences. The attached tasks include:
- sentence insertion into one of several marked positions;
- a reason/feeling question;
- a question about the character's idea/intention;
- content-match/detail discrimination;
- post-reading dialogue/summary completion with one-word contextual answers.

This establishes that Yamaguchi-style practice must include discourse cohesion, cause/reason, intention, accurate detail comparison and contextual lexical completion in the same reading set.

### 2025
The actual-paper set and answer information confirm a multi-section structure with multiple reading sections. For this app, only the reading-comprehension components are modeled: shorter dialogue reading, longer coherent passages, material/information integration and contextual single-word/short-phrase completion. Any composition component in the real examination is intentionally excluded.

### 2022–2023
The archived full page sets and official 2022 overview confirm continued use of dialogue/story reading to obtain gist, key points and necessary information. The yearly page organization supports treating the exam as a sequence of short contextual reading, information/material reading and longer coherent reading rather than one isolated long passage only.

## Passage length policy

Developmental textbook reading remains necessary, so not every passage becomes entrance-exam length.

- Grade 1 standard: 90–125 words
- Grade 1 long: 135–165 words
- Grade 2 standard: 115–155 words
- Grade 2 long: 170–210 words
- Grade 3 standard: 150–230 words
- Grade 3 long: 240–330 words
- Grade 3 Yamaguchi exam tier: 330–450 words

The upper tier exists to build stamina for current Yamaguchi long-reading volume. It must contain a coherent development and may not be padded with generic filler.

## Batch07 Grade 3 requirement

Among the 16 Grade 3 passages in Batch07:
- 8 STANDARD: 150–230 words
- 4 LONG: 240–330 words
- 4 YAMAGUCHI_EXAM: 330–450 words

The four required YAMAGUCHI_EXAM passages are:
- V11-B07-G3-003 — old map / current records
- V11-B07-G3-006 — emergency message / channel comparison
- V11-B07-G3-009 — two interviews / conflicting accounts
- V11-B07-G3-014 — visitor survey / missing sample group

The four required LONG passages are:
- V11-B07-G3-001
- V11-B07-G3-004
- V11-B07-G3-008
- V11-B07-G3-013

The remaining eight Grade 3 passages are STANDARD.

## Question-set contract

The UI may continue to present A/B sets, but each question object must carry a `questionType` from the reading-only taxonomy above.

For Grade 1/2 and Grade 3 STANDARD:
- keep A 5 + B 5;
- require more than one question type;
- every item keeps answer, evidence English, matching evidence Japanese and reason.

For Grade 3 LONG:
- A must contain DETAIL/GIST/REASON/CONTENT_MATCH coverage;
- B must include at least one of INFERENCE, SENTENCE_INSERTION, CONTEXT_WORD, PHRASE_FILL, SUMMARY_FILL or MATERIAL_LINK;
- no set may consist only of direct extraction.

For Grade 3 YAMAGUCHI_EXAM:
- keep A 5 + B 5 for app compatibility;
- all ten items must be reading-comprehension items;
- at least 6 distinct reading question types across the 10 questions;
- must include CONTENT_MATCH;
- must include at least one of SENTENCE_INSERTION or SUMMARY_FILL;
- must include at least one of CONTEXT_WORD or PHRASE_FILL;
- must include at least one of REASON or INFERENCE;
- when the passage naturally supports it, include MATERIAL_LINK;
- no `freeWriteTask`, `freeWrite`, composition prompt, composition model answer, or writing-score condition is permitted.

## Evidence contract for non-literal tasks

- DETAIL / REASON / CONTENT_MATCH: `evidence` must be exact text evidence and `evidenceJp` its corresponding Japanese evidence.
- INFERENCE: evidence may span multiple sentences; store all supporting sentence IDs or evidence strings and explain the inference in `reason`.
- SENTENCE_INSERTION: store the selected position plus the sentence(s) immediately before/after that justify cohesion; explanation must identify pronoun/reference/connective/topic flow rather than saying only “it fits.”
- CONTEXT_WORD / PHRASE_FILL / SUMMARY_FILL: store the passage evidence and the grammatical/contextual constraint that determines the answer.
- MATERIAL_LINK: store both passage evidence and structured material evidence.

## Dedicated Yamaguchi-style 100-passage subset

Before v11 final release, maintain a dedicated count of 100 original Yamaguchi-style reading passages inside the 1000-passage corpus. The 100 are not a separate composition course and do not add writing tasks. They must collectively cover passage-length stamina, content matching, reasons/inference, sentence insertion, contextual vocabulary/phrase completion, summary completion and material-integrated reading.

## Final 1000-passage release requirement

Before v11 is considered complete:
- audit the dedicated Yamaguchi-style reading subset and require exactly 100 qualifying passages;
- audit the distribution of word-count tiers across Grade 3 passages;
- ensure YAMAGUCHI_EXAM passages are not concentrated only in the last batch;
- ensure all reading taxonomy types occur repeatedly across the exam-preparation subset;
- require English-composition/free-writing task count = 0 in the reading app;
- ensure no copied Yamaguchi exam text is stored in the app; all training passages/questions must be original;
- keep the existing vocabulary chronology, grammar chronology, translation/slash, required-note/easy-support, cross-batch diversity, PC/iPhone and A4 gates.

This specification strengthens the existing gates; it does not relax any chronology or naturalness requirement.
