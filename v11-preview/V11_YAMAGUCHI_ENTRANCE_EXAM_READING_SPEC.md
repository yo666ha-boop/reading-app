# V11 Yamaguchi Entrance Exam Reading Specification

Status: ACTIVE_SPEC / applies to Batch07 onward and final 1000-passage release audit
Updated: 2026-08-29 JST

## Purpose

The v11 app must not imitate Yamaguchi entrance-exam preparation only by making passages longer. It must train the reading operations and question forms that appear in actual Yamaguchi Prefecture public high-school entrance examinations, while preserving textbook/unit vocabulary and grammar chronology.

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
- Yamaguchi Prefecture official result/overview material for the 2022 selection, confirming emphasis on grasping gist, key points and necessary information from dialogues/stories and on writing English according to purpose/situation/context.
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
11. FREE_WRITE_20_30 — write an original 20–30 word response linked to the situation/theme. This is an output task and should not replace reading-comprehension questions.

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
The actual-paper set and answer information confirm a six-major-question structure with multiple reading sections. Contemporary analysis of the same paper describes two shorter dialogue readings and two longer reading passages, plus a 20–30 word free composition tied to a communicative situation. Answer forms also include contextual single-word/short-phrase completion rather than only multiple choice.

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

The UI may continue to present A/B sets, but each question object must carry a `questionType` from the taxonomy above.

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
- at least 6 distinct question types across the 10 questions;
- must include CONTENT_MATCH;
- must include at least one of SENTENCE_INSERTION or SUMMARY_FILL;
- must include at least one of CONTEXT_WORD or PHRASE_FILL;
- must include at least one of REASON or INFERENCE;
- when the story naturally supports it, include MATERIAL_LINK;
- add one separate optional `freeWriteTask` of 20–30 words tied to the passage/situation. It is not counted among the ten A/B reading questions.

## Evidence contract for non-literal tasks

- DETAIL / REASON / CONTENT_MATCH: `evidence` must be exact text evidence and `evidenceJp` its corresponding Japanese evidence.
- INFERENCE: evidence may span multiple sentences; store all supporting sentence IDs or evidence strings and explain the inference in `reason`.
- SENTENCE_INSERTION: store the selected position plus the sentence(s) immediately before/after that justify cohesion; explanation must identify pronoun/reference/connective/topic flow rather than saying only “it fits.”
- CONTEXT_WORD / PHRASE_FILL / SUMMARY_FILL: store the passage evidence and the grammatical/contextual constraint that determines the answer.
- MATERIAL_LINK: store both passage evidence and structured material evidence.
- FREE_WRITE_20_30: store scoring conditions and an original model answer; do not require one fixed wording.

## Final 1000-passage release requirement

Before v11 is considered complete:
- audit the distribution of word-count tiers across all Grade 3 passages;
- ensure YAMAGUCHI_EXAM passages are not concentrated only in the last batch;
- ensure all taxonomy types occur repeatedly across the exam-preparation subset;
- ensure no copied Yamaguchi exam text is stored in the app; all training passages/questions must be original;
- keep the existing vocabulary chronology, grammar chronology, translation/slash, required-note/easy-support, cross-batch diversity, PC/iPhone and A4 gates.

This specification strengthens the existing gates; it does not relax any chronology or naturalness requirement.
