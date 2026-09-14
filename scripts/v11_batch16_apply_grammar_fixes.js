const fs = require('fs');

const files = [
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_001_010.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G1_011_017.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_001_009.json',
  'V11_BATCH16_BODY_TRANSLATION_DRAFT_G2_010_017.json'
];

const fixes = {
  'V11-B16-G1-001': [
    ['Few students used it because the tables were far from the book shelves.', 'Few students sat there. The tables were far from the book shelves.'],
    ['During the next week, more students used the corner.', 'During the next week, more students came to the corner.']
  ],
  'V11-B16-G1-002': [
    ['Some members often arrived late because they had to clean their classrooms first.', 'Some members often arrived late. They cleaned their classrooms first.'],
    ['She found that most late students finished cleaning at four twenty-five.', 'She found that many late students finished cleaning at four twenty-five.']
  ],
  'V11-B16-G1-003': [
    ['but she often took most of it home.', 'but she often took much of it home.'],
    ['Mika first thought a large bottle was safer because she would never run out of water.', 'Mika first thought a large bottle was safer. She did not want to run out of water.']
  ],
  'V11-B16-G1-004': [
    ['some signs became difficult to read.', 'some signs became hard for readers.'],
    ['changed only the way the covers were placed.', 'changed only how they put the covers.']
  ],
  'V11-B16-G1-005': [
    ['It found that most students already knew what they wanted before reaching the table.', 'It found that many students already knew what they wanted before reaching the table.'],
    ['Students could choose a line before they reached the front.', 'Students chose a line before they reached the front.']
  ],
  'V11-B16-G1-006': [
    ['His teacher asked him to try the difficult part first for one week.', 'His teacher said, “Try the difficult part first for one week.”'],
    ['He noticed that he made fewer mistakes when he was not tired.', 'He noticed fewer mistakes on days he was not tired.']
  ],
  'V11-B16-G1-007': [
    ['The students learned that useful directions must appear where a choice is difficult.', 'The students learned that useful directions help at a place with a hard choice.']
  ],
  'V11-B16-G1-008': [
    ['Members usually threw them away because they were too small for a full poster.', 'Members usually threw them away. The pieces were too small for a full poster.']
  ],
  'V11-B16-G1-009': [
    ['In the morning, when the building beside it made shade, people often used it.', 'In the morning, the building beside it made shade, and many people sat there.'],
    ['More people used it during hot afternoons.', 'More people sat there during hot afternoons.']
  ],
  'V11-B16-G1-010': [
    ['Students could not easily see them while carrying equipment.', 'Students did not see them well with equipment in their hands.'],
    ['They needed a storage system that was easy to understand while they were using it.', 'They needed a clear storage system during use.']
  ],
  'V11-B16-G1-011': [
    ['Before spending money, it watched how students used the shelf for three rainy days.', 'Before spending money, it watched the shelf for three rainy days.'],
    ['Most mistakes happened because umbrellas were placed in one crowded row.', 'Many mistakes happened. Umbrellas were in one crowded row.'],
    ['Students began putting umbrellas in the correct area when they arrived.', 'Students put umbrellas in the correct area after they arrived.'],
    ['A clearer place was more useful than a new tag for every item.', 'A clearer place helped more. A new tag for every item was not needed.']
  ],
  'V11-B16-G1-012': [
    ['The tennis club often could not find enough practice balls at the start of practice.', 'The tennis club often failed to find enough practice balls at the start of practice.'],
    ['because the balls were easy to count and find.', 'because counting and finding the balls was simple.'],
    ['It was the way they were collected.', 'The problem came from how the club put the balls back.']
  ],
  'V11-B16-G1-013': [
    ['Their teacher asked them to check the room first.', 'Their teacher said, “Check the room first.”'],
    ['They learned that changing the room conditions could help before using more electricity.', 'They learned that changing the room conditions helped before they used more electricity.']
  ],
  'V11-B16-G1-014': [
    ['A librarian thought the box might be too small.', 'A librarian thought the box was too small.'],
    ['a simple picture of a book going into the box.', 'a simple picture showing a book inside the box.']
  ],
  'V11-B16-G1-015': [
    ['She could remember many words that evening,', 'She remembered many words that evening,'],
    ['On the nights when she tested herself,', 'On those test nights,'],
    ['spent most of her time on short self-tests.', 'spent much of her time on short self-tests.']
  ],
  'V11-B16-G1-016': [
    ['Students often stopped in front of the shelves while they changed shoes, so others could not pass.', 'Students often stopped in front of the shelves to change shoes, so others had no room to pass.'],
    ['They saw that most people needed only a few seconds at the shelf,', 'They saw that many people needed only a few seconds at the shelf,']
  ],
  'V11-B16-G1-017': [
    ['the student nearest the door should always turn it off.', 'the student nearest the door always turned it off.'],
    ['This worked on some days but failed when that student left early for club activities.', 'This worked on some days. It failed after an early exit for club activities.'],
    ['A task connected to the last person worked better than a task connected to one fixed student.', 'A task connected to the last person worked well. A task connected to one fixed student did not.']
  ],
  'V11-B16-G2-003': [
    ['Ingredient details stayed on a second sheet for people who needed them.', 'Ingredient details stayed on a second sheet for visitors needing them.']
  ],
  'V11-B16-G2-007': [
    ['books that needed checking.', 'books needing a check.']
  ],
  'V11-B16-G2-009': [
    ['Fewer students made unnecessary trips.', 'The number of unnecessary trips went down.']
  ],
  'V11-B16-G2-011': [
    ['The real problem was that the checklist asked whether a timer was present, not whether it worked.', 'The real problem was that the checklist asked if a timer was present, but it did not ask if the timer worked.']
  ]
};

let changed = 0;
const touched = new Set();
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const item of data.items || []) {
    const list = fixes[item.id];
    if (!list) continue;
    for (const [from, to] of list) {
      if (!item.body.includes(from)) throw new Error(`${item.id}: missing source phrase: ${from}`);
      item.body = item.body.replace(from, to);
      changed++;
    }
    // All edits above preserve the original proposition, so the existing Japanese fullTranslation
    // remains a complete translation of the revised passage. Keep it paired and non-empty.
    if (!String(item.fullTranslation || '').trim()) throw new Error(`${item.id}: missing fullTranslation`);
    touched.add(item.id);
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

if (changed !== 43) throw new Error(`Expected 43 grammar repairs, got ${changed}`);
if (touched.size !== 21) throw new Error(`Expected 21 touched passages, got ${touched.size}`);
console.log(`Batch16 grammar repair: replacements=${changed}, passages=${touched.size}`);
