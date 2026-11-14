#!/usr/bin/env node
'use strict';
/* Read-only independent mathematics spot-check. Never "correct" source answers
   automatically. Scope is intentionally narrow to avoid false positives from
   OCR fractions, algebra, power/root notation and numbered subquestions. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const sourcePath = path.join(__dirname, '..', 'public-origin', 'index.html');
const source = fs.readFileSync(sourcePath);
const EXPECTED_SHA = '64f4f2294c373b19922da7ec470a16860ccd4e8db854cbab15fb5122c53e09a6';
assert.equal(crypto.createHash('sha256').update(source).digest('hex'), EXPECTED_SHA);
const html = source.toString('utf8');
const marker = 'const EMBEDDED_RECORDS=';
const first = html.indexOf(marker);
assert.ok(first >= 0, 'canonical JSON missing');
const start = first + marker.length;
let depth = 0, quoted = false, escaped = false, end = -1;
for (let i = start; i < html.length; i++) {
  const c = html[i];
  if (quoted) {
    if (escaped) escaped = false;
    else if (c === '\\') escaped = true;
    else if (c === '"') quoted = false;
    continue;
  }
  if (c === '"') { quoted = true; continue; }
  if (c === '[') depth++;
  else if (c === ']' && --depth === 0) { end = i + 1; break; }
}
assert.ok(end > start, 'embedded JSON incomplete');
const originals = JSON.parse(html.slice(start, end)).filter(r => !r.source.is_generated_variant);
assert.equal(originals.length, 1271);
const clean = text => text.normalize('NFKC').replace(/[−－]/g, '-').replace(/[＋]/g, '+')
  .replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
function calculate(s) {
  let i = 0;
  function atom() {
    let sign = 1;
    while (s[i] === '+' || s[i] === '-') { if (s[i] === '-') sign = -sign; i++; }
    if (s[i] === '(') {
      i++;
      const value = expression();
      if (s[i++] !== ')') throw Error('unbalanced');
      return sign * value;
    }
    const found = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (!found) throw Error('invalid number');
    i += found[0].length;
    return sign * Number(found[0]);
  }
  function term() {
    let value = atom();
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i++], next = atom();
      value = op === '*' ? value * next : value / next;
    }
    return value;
  }
  function expression() {
    let value = term();
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++], next = term();
      value = op === '+' ? value + next : value - next;
    }
    return value;
  }
  const value = expression();
  if (i !== s.length || !Number.isFinite(value)) throw Error('incomplete');
  return value;
}

let tested = 0, passed = 0;
const skipped = { other_question: 0, non_basic: 0, ambiguous_numeric: 0, parser: 0 };
const mismatches = [];
for (const r of originals) {
  const matched = r.question.match(/計算をしなさい[。．]\s*([\s\S]+)$/);
  if (!matched) { skipped.other_question++; continue; }
  const raw = matched[1].replace(/^\s*[⑴-⒇①-⑳]\s*/, '').trim();
  if (/[√^∛a-zA-Z=\/]/.test(raw)) { skipped.non_basic++; continue; }
  const expr = clean(raw), answer = clean(r.answer);
  if (!/^[0-9+\-*().\/]+$/.test(expr) || !/[+\-*]/.test(expr) ||
      !/^[+\-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(answer)) {
    skipped.ambiguous_numeric++;
    continue;
  }
  let value;
  try { value = calculate(expr); } catch { skipped.parser++; continue; }
  tested++;
  const listed = Number(answer);
  if (Math.abs(value - listed) < 1e-8) passed++;
  else mismatches.push({ id: r.id, calculated: value, listed });
}
console.log(JSON.stringify({
  result: mismatches.length ? 'REVIEW_REQUIRED' : 'PASS',
  source_sha256: EXPECTED_SHA,
  source_originals: originals.length,
  independently_recalculated: tested,
  matching_answers: passed,
  mismatches,
  skipped,
  scope: 'Only unambiguous basic arithmetic; not a full 1271-answer audit'
}, null, 2));
assert.equal(tested, 66, 'numeric audit coverage changed unexpectedly');
assert.equal(mismatches.length, 0, 'numeric answer disagreements require original-source review');
