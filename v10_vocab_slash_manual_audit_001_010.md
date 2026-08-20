# V10 Vocabulary + Slash Human Audit 001-010

Reference model: front-to-back meaning chunks. Project manual example: `I went to the park / to play baseball / with my friends / yesterday.` Short basic sentences are not split just to create slashes.

Vocabulary basis: canonical NH/SS 2026 vocabulary chronology plus each passage's reviewed `allowedWords` classification (exact section / cumulative / textbook-confirmed / elementary). Missing keyword-table rows alone are not treated as automatic failure when the reviewed gate explicitly classifies a word as elementary or section-valid.

## 001 Sunshine G1 Get Ready 2 — COMPLETE
Vocabulary: PASS, notes=0. Planned wording retained. `notebook` remains because reviewed `allowedWords` classifies it as elementary; dog/cat/book/read/write are confirmed before this point.
Slash: PASS. `This is my English book.` and `I can read “dog”.` remain intact; the longer write sentences split only before the place phrase: `I write “dog” / in my notebook.`

## 002 Sunshine G1 Get Ready 3 — COMPLETE
Vocabulary: PASS, notes=0. `subject` is explicitly section-valid in reviewed `allowedWords`; planned `What subject do you like?` retained.
Slash: PASS. Short question/answer units such as `I like English.` and `Can you read English?` are not broken into grammar-drill fragments.

## 003 Sunshine G1 Get Ready 4 — COMPLETE
Vocabulary: PASS, notes=0. Reviewed gate covers basketball/club/practice/gym/every day/run/jump/high/shoot/ball/very/exciting/together/let’s plus cumulative/basic words.
Slash: PASS. Short clauses stay intact. Only `I practice / in the gym / every day.` is split into action/place/time meaning chunks.

## 004 Sunshine G1 Get Ready 5 — COMPLETE
Vocabulary: PASS, notes=0. Final passage stays inside the reviewed Get Ready 5/cumulative/elementary gate; no later-unit form is introduced.
Slash: PASS. All ten sentences are short basic preference/question units, so forced splits such as `Do you like / the zoo?` and `I like / the panda and the monkey.` were removed.

## 005 Sunshine G1 Get Ready 6 — COMPLETE
Vocabulary: PASS, notes=0. Final zoo diary retains only the reviewed Get Ready 6/cumulative vocabulary and already-approved past forms; no extra note is required.
Slash: PASS. Simple verb+object clauses (`I ate pizza.`, `I saw a panda.`) remain intact. `I had lunch / at the zoo.` alone is split into event/place chunks.

## 006 Sunshine G1 PROGRAM 1-1 — COMPLETE
Vocabulary: PASS, notes=0. Source `allowedWords` explicitly covers the PROGRAM 1-1 personality/student vocabulary and cumulative music/trumpet/practice/Wednesday/school/basketball vocabulary.
Slash: PASS. be+complement and verb+short-object units remain intact. `I practice / every Wednesday.` separates only the time phrase.

## 007 Sunshine G1 PROGRAM 1-2 — COMPLETE
Vocabulary: PASS, notes=0. Source `allowedWords` explicitly covers Australia/Japan/be from/hello and cumulative student/teacher/kind/friendly/school vocabulary.
Slash: PASS. `I’m from Australia.` and `My teacher is from Japan.` remain intact instead of splitting be-from constructions.

## 008 Sunshine G1 PROGRAM 1-3 — COMPLETE
Vocabulary: PASS, notes=0. Source `allowedWords` explicitly covers city/nice/class/new/quiet/cheerful/math/science/Japanese/fan/movie/want to/be good at plus cumulative words.
Slash: PASS. Short self-introduction statements remain whole, including `I’m good at math.`, `I’m a fan of movies.`, and `I want to be friendly.`

## 009 Sunshine G1 PROGRAM 2-1 — COMPLETE
Vocabulary: PASS, notes=0. Source `allowedWords` explicitly covers after/town/bicycle/walk/ride/read/clean/beautiful/sometimes/at home/very much/after school plus cumulative friend/go/home/with/etc.
Slash: PASS. Natural front-to-back chunks used only where useful: `After school, / I ride my bicycle.`, `I sometimes ride / with my friend.`, `We ride / in our town.`, `At home, / I clean my bicycle.` Short predicate/object units stay together.

## 010 Sunshine G1 PROGRAM 2-2 — COMPLETE
Vocabulary: PASS, notes=0. Source `allowedWords` explicitly covers weekend/but/before/dinner/study/on plus PROGRAM 2-1 cumulative and PROGRAM 1-3 subject words.
Slash: PASS. Time/place/coordination chunks follow the model: `On the weekend, / I ride my bicycle / with my friend.`, `Before dinner, / I clean my bicycle.`, `I like math, / but I like science, too.`, `I read / at home / after dinner.`

## Implementation
- Manual runtime overrides for 004-010: `v10_vocab_slash_manual_004_010.js`.
- Loaded after `v10_semantic_runtime_final_fixes.js` so the human-reviewed slash rows are the final effective rows.
- No vocabulary-driven English rewrite was required in 004-010.

Progress in this ledger: vocabulary 10/10, slash human audit 10/10.
Passages rewritten for vocabulary in this phase: 0. Notes confirmed: 0.
Next: passage 011 Sunshine G1 PROGRAM 2-3.
