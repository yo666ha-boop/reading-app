# v11 Batch05 initial chronology checkpoint

Date: 2026-08-28 JST
Branch: `v11-1000passage-easy-notes`
Persistent runtime remains: **368/1000**
Batch05 registration: **false**

## Authoring completed in this work pass

- Locked `V11_BATCH05_50_PASSAGE_PLAN.md`: 50 distinct story designs across the same six proven late-unit anchors.
- Authored non-runtime drafts:
  - Grade 1: 17 passages
  - Grade 2: 17 passages
  - Grade 3: 16 passages
  - Total: 50/50
- Each draft currently contains full Japanese translation, slash rows, A=5 and B=5 provisional evidence-linked questions, and story-specific required-note seeds.

## Structural gate

GitHub Actions run `33197558441` — **SUCCESS**.

Checked 50/50 count, grade split, unique IDs, target word bands, stored word counts, sentence/slash row integrity, fullTranslation/slash JP identity, A/B 5+5 fields and evidence integrity, and `registered=false`.

The earlier Grade 1-only run `33197155406` also succeeded for 17/17.

## Initial independent chronology gate

GitHub Actions run `33197652899` — **FAIL (expected fail-closed; no registration)**.

Using canonical v7 lexicon source count 3975 and existing grammar chronology detector/gate:

- passages: 50/50
- semantic rewrite marker: 50/50
- runtime_total: 368
- vocabulary tokens scanned: 25,340
- required-note-covered occurrences: 1,210
- unregistered vocabulary occurrences: **3,308**
- future vocabulary leak occurrences: **1,450**
- grammar detected occurrences: 702
- grammar resolved occurrences: 500
- grammar unresolved occurrences: **202**
- future grammar leak: **0**
- final: FAIL

The most frequent unresolved vocabulary candidates include `route`, `visitors`, `practice`, `checked`, `correct`, `used`, `everyone`, `beside`, `easy`, `note`, `map`, `final`, `sheets`, `without`, `classroom`, `usual`, `train`, `quickly`, `file`, and `online`.

The most frequent future-vocabulary candidates include `group`, `several`, `instead`, `groups`, `reached`, `report`, `already`, `card`, `minutes`, `began`, `moved`, `part`, `leaving`, `checking`, `put`, `stood`, `ready`, and `sign`.

Grammar unresolved candidates include detector-flagged constructions such as HAVE_TO, BECAUSE_CLAUSE, MODAL_COULD, WHEN_WHILE_CLAUSE, MODAL_SHOULD, ASK_TELL_WANT_O_TO, WHETER/WHETHER_CLAUSE, LET_O_V, RELATIVE_PRONOUN, PARTICIPLE_POSTMODIFIER, MODAL_MAY_MIGHT, and MAKE_O_V at sections where the current evidence boundary cannot resolve them.

## Next repair order

1. Do **not** weaken the chronology gate and do **not** register any Batch05 passage yet.
2. Repair grammar first where a sentence can be rewritten naturally using clearly earlier grammar; preserve meaning and update slash/full translation afterward.
3. Re-run chronology and extract the remaining vocabulary by passage.
4. For genuinely story-essential words, add accurate Japanese required-local notes; do not leave placeholder glosses in the final batch.
5. Prefer natural earlier-vocabulary rewrites over unnecessary note inflation.
6. Re-run until unregistered=0, future_vocab=0, grammar_unresolved=0, future_grammar=0.
7. Only then regenerate/diversify A/B questions, perform final translation/slash sync, normal/easy note audit, cross-batch diversity, PC/iPhone, A4 and persistent-runtime checks.
8. Register 368 -> 418 only after all gates are green.
