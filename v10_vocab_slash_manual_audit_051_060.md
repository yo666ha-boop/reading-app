# V10 Vocabulary + Slash Human Audit 051-060

Reference: front-to-back meaning chunks; preserve be+complement, auxiliary+verb, simple verb+short object, fixed expressions, and short question/answer units. Vocabulary is checked against the canonical NH/SS 2026 chronology plus reviewed cumulative/elementary/textbook-confirmed gates.

## 051 NH G1 Unit 4-3 — FAIL FOUND -> REPAIRED -> PASS
- `story` was used in `Read this English story, please.` but NH1 does not introduce `story` by Unit 4-3; `read` is already available from NH1 Pre-step/Unit2.
- Repaired to `Read this, please.` and synchronized full translation, A/B evidence and slash rows.
- No note required.

## 052 NH G1 Unit 5-1 — FAIL FOUND -> REPAIRED -> PASS
- The reviewed Unit 5-1 gate explicitly licenses `enjoy ...ing`; `I enjoy my work.` broadened usage beyond that reviewed grammar gate.
- Replaced it with `My work is interesting.` using Unit 5-1 `work` + cumulative `interesting`.
- Translation/slash synchronized. No note required.

## 053 NH G1 Unit 5-2 — INITIAL FALSE ALARM -> RESTORED -> PASS
- An initial narrow keyword check did not find `water`, so the first manual layer temporarily removed `The dolphin is in the water.`
- A broader cumulative source check then found definitive provenance in the reviewed NH G1 Unit 8-3 source gate: `water` is recorded as `Sounds and Letters 3 cumulative`, which is earlier than Unit 5-2.
- Therefore `water` is valid at Unit 5-2. The coherent original sentence `The dolphin is in the water.` was restored, together with its full translation, A question/evidence, B question/evidence and human slash row.
- Final restoration layer: `v10_vocab_slash_manual_corrections.js`, loaded after `v10_vocab_slash_manual_051_060.js`.
- This passage is NOT counted as a vocabulary-driven rewrite. No note required.

## 054 NH G1 Unit 5-3 — COMPLETE
Vocabulary PASS, notes=0. cafe/website/owner/know/popular/wonderful/dish/friendly/fried egg/on top of are explicitly in Unit 5-3; brother/want to/visit are cumulative.
Slash PASS. Short clauses stay intact; fixed phrasal units are not broken internally.

## 055 NH G1 Unit 6-1 — COMPLETE
Vocabulary PASS, notes=0. show/performer/U.K./him/together/Why don’t we are explicit; know/watch/Sounds/interesting are cumulative.
Slash PASS. Short questions and can+verb units stay whole.

## 056 NH G1 Unit 6-2 — COMPLETE
Vocabulary PASS, notes=0. history/whose/yours/maybe/ticket/(Riko)’s/Thanks are explicit; near is cumulative and book is elementary.
Slash PASS. Ownership questions stay whole.

## 057 NH G1 Unit 6-3 — FAIL FOUND -> REPAIRED -> PASS
- `first` is cumulative from NH1 Unit 3 Part 3 and is valid.
- `Then` was not supported by the checked canonical chronology or the reviewed Unit 6-3 gate.
- Replaced `Then I use the towel.` with `I use the towel after the cushion.` using cumulative `after` from Unit 3-2.
- Translation, A/B evidence and slash rows synchronized. No note required.

## 058 NH G1 Unit 7-1 — COMPLETE
Vocabulary PASS, notes=0. tomorrow/free/talk/busy/What’s up?/look forward to explicit; practice/tennis/after school/Why don’t we cumulative.
Slash PASS.

## 059 NH G1 Unit 7-2 — COMPLETE
Vocabulary PASS, notes=0. place/market/souvenir/buy/Welcome to explicit; popular/look at/want to/beautiful cumulative.
Slash PASS.

## 060 NH G1 Unit 7-3 — COMPLETE
Vocabulary PASS, notes=0. mom/dad/palace/travel/exciting/we’re explicit; `plan` cumulative from Unit 7-1; free/tomorrow/visit/Sounds/Let’s cumulative.
Slash PASS.

## Implementation
- Main batch layer: `v10_vocab_slash_manual_051_060.js`.
- Final cumulative correction: `v10_vocab_slash_manual_corrections.js` restores valid Unit 5-2 `water` after the main batch layer.
- Genuine rewrites this batch: 3 (051, 052, 057).
- Notes required: 0.

Cumulative progress through passage 060: vocabulary 60/168, slash human audit 60/168, genuine vocabulary/grammar-driven rewrites 5, notes confirmed 0.
Next: passage 061.
