#!/usr/bin/env node
'use strict';
/* Deterministic, dependency-free regression for the verified 1323-question app.
   Read-only: does not generate or rewrite questions, figures or the immutable original. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.join(__dirname, '..', 'public-origin');
const current = fs.readFileSync(path.join(root, 'index.html'));
const immutable = fs.readFileSync(path.join(root, 'index1323-exact.html'));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const CURRENT_SHA = '64f4f2294c373b19922da7ec470a16860ccd4e8db854cbab15fb5122c53e09a6';
const ORIGINAL_SHA = '47893e010514fffa44d45dac3832cf502aee075345b1ecdf378f69d764b32521';
assert.equal(sha(current), CURRENT_SHA, 'app index content drift');
assert.equal(current.byteLength, 6819914, 'app index byte length drift');
assert.equal(sha(immutable), ORIGINAL_SHA, 'immutable 1323 exact original changed');

const html = current.toString('utf8');
const marker = 'const EMBEDDED_RECORDS=';
const begin = html.indexOf(marker);
assert.ok(begin >= 0, 'embedded real records missing');
const start = begin + marker.length;
assert.equal(html[start], '[', 'embedded record array start');
let depth = 0, inString = false, escapeNext = false, end = -1;
for (let i = start; i < html.length; i++) {
  const c = html[i];
  if (inString) {
    if (escapeNext) escapeNext = false;
    else if (c === '\\') escapeNext = true;
    else if (c === '"') inString = false;
    continue;
  }
  if (c === '"') { inString = true; continue; }
  if (c === '[') depth++;
  else if (c === ']' && --depth === 0) { end = i + 1; break; }
}
assert.ok(end > start, 'embedded record array not closed');
const records = JSON.parse(html.slice(start, end));
assert.equal(records.length, 1323, 'record count');

const byId = new Map(), originals = [], variants = [], books = {}, grades = {}, images = new Set();
let figuredRows = 0, figureMentions = 0, markerIssues = 0;
const refPattern = /^assets\/math\/[A-Za-z0-9_/-]+\.(png|jpe?g|webp|gif|svg)$/i;
for (const r of records) {
  assert.ok(r && typeof r.id === 'string' && r.id, 'missing ID');
  assert.ok(!byId.has(r.id), 'duplicate ID: ' + r.id);
  byId.set(r.id, r);
  assert.ok([1, 2, 3].includes(r.grade), 'invalid grade: ' + r.id);
  assert.ok(typeof r.question === 'string' && r.question.trim(), 'blank question: ' + r.id);
  assert.ok(typeof r.answer === 'string' && r.answer.trim(), 'blank answer: ' + r.id);
  assert.ok(r.audit?.problem_answer_verified === true &&
            r.audit?.structure_verified === true &&
            r.audit?.figure_refs_verified === true, 'audit fail: ' + r.id);
  assert.ok(Array.isArray(r.figure_refs), 'figure refs absent: ' + r.id);
  assert.equal(new Set(r.figure_refs).size, r.figure_refs.length, 'duplicate figure refs: ' + r.id);
  grades[r.grade] = (grades[r.grade] || 0) + 1;
  if (r.source?.is_generated_variant) variants.push(r);
  else {
    originals.push(r);
    books[r.source.book] = (books[r.source.book] || 0) + 1;
  }
  if (r.figure_refs.length) figuredRows++;
  for (const ref of r.figure_refs) {
    assert.ok(refPattern.test(ref) && !ref.includes('..'), 'invalid figure path: ' + ref);
    images.add(ref);
    figureMentions++;
  }
  for (const value of [r.question, r.answer, r.explanation]) {
    if (typeof value !== 'string') continue;
    for (const m of value.matchAll(/\[\[IMAGE:([^\]\r\n]+)\]\]/g)) {
      if (!r.figure_refs.includes(m[1].trim())) markerIssues++;
    }
  }
}
assert.equal(byId.size, 1323);
assert.equal(originals.length, 1271);
assert.equal(variants.length, 52);
assert.deepEqual(books, { Winpass: 717, '実力錬成': 237, Standard: 317 });
assert.deepEqual(grades, { '1': 808, '2': 214, '3': 301 });
assert.equal(figuredRows, 459);
assert.equal(figureMentions, 602);
assert.equal(images.size, 282);
assert.equal(markerIssues, 0, 'unmapped inline image markers');
for (const r of variants) {
  const p = byId.get(r.source?.parent_id);
  assert.ok(p && !p.source?.is_generated_variant, 'variant parent missing: ' + r.id);
  assert.equal(r.grade, p.grade, 'variant grade drift');
  assert.deepEqual(r.unit, p.unit, 'variant unit drift');
  assert.equal(r.skill, p.skill, 'variant skill drift');
  assert.equal(r.question_format, p.question_format, 'variant format drift');
}

const fst = html.indexOf('function filtered(){');
const fend = html.indexOf('function sourceSort(', fst);
assert.ok(fst >= 0 && fend > fst, 'filter function extraction failed');
const filterSource = html.slice(fst, fend);
assert.ok(filterSource.includes('exactId!=null?r.id===exactId'), 'exact-ID priority absent');
const controls = { search: '', kind: 'both' };
const $ = id => ({ value: controls[id] || '' });
const major = r => r.unit?.major || '';
const minor = r => r.unit?.minor || '';
const isVar = r => !!r.source.is_generated_variant;
const parentBook = r => r.source.is_generated_variant ?
  byId.get(r.source.parent_id)?.source?.book || '' : r.source.book;
const filterFactory = new Function('records', '$', 'major', 'minor', 'isVar', 'parentBook',
                                   filterSource + '; return filtered;');
const filtered = filterFactory(records, $, major, minor, isVar, parentBook);
let exactIdSearches = 0;
for (const r of records) {
  controls.search = r.id;
  const result = filtered();
  assert.equal(result.length, 1, 'full ID must match only one problem: ' + r.id);
  assert.equal(result[0].id, r.id, 'full ID returned a different problem');
  exactIdSearches++;
}
controls.search = 'Winpass';
assert.ok(filtered().length >= 717, 'keyword search regression');
const sample = records.find(r => r.id.includes('25winpasst3suhy000101.docx:M02:S02'));
assert.ok(sample, 'known partial ID test missing');
controls.search = sample.id.slice(0, -2);
assert.ok(filtered().some(r => r.id === sample.id), 'partial ID fallback regression');

console.log(JSON.stringify({
  result: 'PASS',
  check: 'math1323_readonly_static_and_exact_id_regression',
  source_sha256: sha(current),
  immutable_sha256: sha(immutable),
  records: records.length,
  original: originals.length,
  variants: variants.length,
  books,
  grades,
  figured_rows: figuredRows,
  figure_mentions: figureMentions,
  distinct_images: images.size,
  marker_issues: markerIssues,
  exact_id_searches: exactIdSearches,
  keyword_search: 'PASS',
  partial_id_search: 'PASS'
}, null, 2));
