const fs = require('fs');

const path = 'v10_reference_slash_rules.json';
if (!fs.existsSync(path)) {
  console.error('REFERENCE SLASH GATE FAIL: missing ' + path);
  process.exit(1);
}

let state;
try {
  state = JSON.parse(fs.readFileSync(path, 'utf8'));
} catch (e) {
  console.error('REFERENCE SLASH GATE FAIL: invalid JSON: ' + e.message);
  process.exit(1);
}

const expected = ['英語長文基本.pdf', '英語長文基本解答.pdf'];
const sources = Array.isArray(state.source_files) ? state.source_files : [];
const missing = expected.filter(x => !sources.includes(x));

const errors = [];
if (missing.length) errors.push('missing authoritative source declaration: ' + missing.join(', '));
if (state.reference_files_read !== 2) errors.push('reference_files_read must be 2');
if (!(state.reference_pages_read > 0)) errors.push('reference_pages_read must be recorded after full-page inspection');
if (!Array.isArray(state.rules) || state.rules.length === 0) errors.push('reference-derived slash rules are empty');
if (state.verified_complete !== true) errors.push('verified_complete is not true');
if (state.passages_target !== 168) errors.push('passages_target must remain 168');

if (errors.length) {
  console.error('REFERENCE SLASH GATE BLOCKED');
  for (const e of errors) console.error('- ' + e);
  console.error('Do not substitute generic slash-reading rules for the two reference PDFs.');
  process.exit(1);
}

console.log('REFERENCE SLASH GATE PASS: both authoritative PDFs were fully inspected and reference-derived rules are recorded.');
