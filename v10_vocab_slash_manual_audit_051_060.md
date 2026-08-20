# V10 Vocabulary + Slash Human Audit 051-060

Reference: front-to-back meaning chunks; preserve be+complement, auxiliary+verb, simple verb+short object, fixed expressions, and short question/answer units. Vocabulary is checked against the canonical NH/SS 2026 chronology plus reviewed cumulative/elementary gates.

## 051 NH G1 Unit 4-3 — FAIL FOUND -> REPAIRED -> PASS
- `story` was used in `Read this English story, please.` but canonical NH1 master does not introduce `story` by Unit 4-3; canonical search places `story` later (NH2 Unit3). `read` itself is already available from NH1 Pre-step/Unit2.
- Repaired to `Read this, please.` and synchronized full translation, A question 1, B question 2/evidence, and slash rows.
- No note required.

## 052 NH G1 Unit 5-1 — FAIL FOUND -> REPAIRED -> PASS
- Source gate explicitly licenses the Unit 5-1 grammar pattern `enjoy ...ing`; `I enjoy my work.` broadened usage beyond the reviewed gate.
- Replaced final sentence with `My work is interesting.` using Unit 5-1 `work` + cumulative `interesting`.
- Existing A/B evidence remains valid; translation/slash updated. No note required.

## 053 NH G1 Unit 5-2 — FAIL FOUND -> REPAIRED -> PASS
- `water` was not in the reviewed Unit 5-2 gate and canonical NH1 search in the checked range did not supply a supporting row.
- Removed `The dolphin is in the water.`; passage now stays on blog/dolphin-picture + allowed swim/surf/write content.
- A question 3 and B question 1 were rebuilt; full translation/slash/A/B evidence synchronized. No note required.

## 054 NH G1 Unit 5-3 — COMPLETE
Vocabulary PASS, notes=0. cafe/website/owner/know/popular/wonderful/dish/friendly/fried egg/on top of are explicitly in Unit 5-3; brother/want to/visit are cumulative.
Slash PASS. Short clauses stay intact; fixed phrasal units `look at`, `on top of`, `want to visit` are not broken internally.

## 055 NH G1 Unit 6-1 — COMPLETE
Vocabulary PASS, notes=0. show/performer/U.K./him/together/Why don’t we are explicit Unit 6-1 words/phrases; know/watch/Sounds/interesting are cumulative.
Slash PASS. Short questions and can+verb units stay whole; only source/postmodifier chunks are separated.

## 056 NH G1 Unit 6-2 — COMPLETE
Vocabulary PASS, notes=0. history/whose/yours/maybe/ticket/(Riko)’s/Thanks are explicit; near is cumulative from Unit 3-3 and book is elementary.
Slash PASS. Ownership questions stay whole; only `Maybe / ...` is split as discourse framing.

## 057 NH G1 Unit 6-3 — FAIL FOUND -> REPAIRED -> PASS
- `first` is cumulative from NH1 Unit3 Part3 and is valid.
- `Then` was not found in the checked canonical NH1 range and was not in the reviewed Unit 6-3 gate.
- Replaced `Then I use the towel.` with `I use the towel after the cushion.` using cumulative `after` from Unit 3-2.
- Synchronized translation, A question 3, B question 2/evidence and slash rows. No note required.

## 058 NH G1 Unit 7-1 — COMPLETE
Vocabulary PASS, notes=0. tomorrow/free/talk/busy/What’s up?/look forward to explicit; morning/want to/practice/tennis/after school/Why don’t we cumulative.
Slash PASS. time adjuncts separated; question frames and `look forward to` remain intact.

## 059 NH G1 Unit 7-2 — COMPLETE
Vocabulary PASS, notes=0. place/market/souvenir/buy/Welcome to explicit; popular/look at/want to/beautiful cumulative.
Slash PASS. `I want to buy a souvenir / for my family.` uses beneficiary chunk; short dialogue lines stay intact.

## 060 NH G1 Unit 7-3 — COMPLETE
Vocabulary PASS, notes=0. mom/dad/palace/travel/exciting/we’re explicit; `plan` is cumulative from Unit 7-1; free/tomorrow/visit/Sounds/Let’s cumulative.
Slash PASS. only tomorrow time adjuncts are separated where helpful; short family dialogue and `Sounds exciting.` stay whole.

## Implementation
- Runtime override: `v10_vocab_slash_manual_051_060.js`.
- Loader updated so it runs last after 041-050 and all earlier automatic/semantic layers.
- Rewrites this batch: 4 (051, 052, 053, 057).
- Notes required: 0.

Cumulative progress: vocabulary 60/168, slash human audit 60/168, vocabulary-driven rewrites 6, notes confirmed 0.
Next: passage 061.
