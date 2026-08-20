import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium, firefox, webkit } from 'playwright';

const BASE_URL = process.env.MATH_APP_BASE_URL || 'http://127.0.0.1:8765/index.html';
const DATA_PATH = process.env.MATH_REAL_DATA_PATH || 'math-bank/app/app-records.json';
const REPORT_PATH = process.env.MATH_REAL_BROWSER_REPORT || 'math-bank/state/browser-real-regression-latest.json';
const PDF_DIR = process.env.MATH_REAL_PDF_DIR || 'math-bank/state/real-print-regression';
const EXPECTED = { total: 1231, original: 1124, variant: 107, source: { Winpass: 570, '実力錬成': 237, Standard: 317 } };

function fail(message) { throw new Error(message); }
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function isVariant(r) { return !!r?.source?.is_generated_variant; }
function uniq(values) { return [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b), 'ja', { numeric: true })); }
function localFigureRef(ref) {
  if (typeof ref !== 'string' || !ref.trim()) return null;
  const s = ref.trim();
  if (/^(https?:|data:|blob:|\/\/)/i.test(s)) return null;
  return s.split(/[?#]/, 1)[0];
}

if (!fs.existsSync(DATA_PATH)) {
  console.log('REAL_CANONICAL_BROWSER_BLOCKED_EXPECTED: app-records.json is absent');
  process.exit(3);
}

const raw = fs.readFileSync(DATA_PATH);
const parsed = JSON.parse(raw.toString('utf8'));
const rows = Array.isArray(parsed) ? parsed : parsed.records;
if (!Array.isArray(rows)) fail('real app-records does not contain an array');
if (rows.length !== EXPECTED.total) fail(`real record count ${rows.length} != ${EXPECTED.total}`);
const originals = rows.filter(r => !isVariant(r));
const variants = rows.filter(isVariant);
if (originals.length !== EXPECTED.original || variants.length !== EXPECTED.variant) fail('real original/variant count mismatch');
for (const [book, expected] of Object.entries(EXPECTED.source)) {
  const actual = originals.filter(r => r?.source?.book === book).length;
  if (actual !== expected) fail(`real ${book} count ${actual} != ${expected}`);
}
const byId = new Map(rows.map(r => [r.id, r]));
for (const v of variants) {
  const p = byId.get(v?.source?.parent_id);
  if (!p || isVariant(p)) fail(`invalid variant parent ${v?.id}`);
}

const staticCoverage = {
  dataset_sha256: sha256(raw),
  records: rows.length,
  original: originals.length,
  variants: variants.length,
  grades: Object.fromEntries([1,2,3].map(g => [g, rows.filter(r => r.grade === g).length])),
  books: Object.fromEntries(Object.keys(EXPECTED.source).map(book => [book, originals.filter(r => r.source.book === book).length])),
  majors: uniq(rows.map(r => r?.unit?.major)),
  minors: uniq(rows.map(r => r?.unit?.minor)),
  skills: uniq(rows.map(r => r?.skill)),
  difficulties: uniq(rows.map(r => r?.difficulty)),
  question_formats: uniq(rows.map(r => r?.question_format)),
  choice_records: rows.filter(r => Array.isArray(r?.choices) && r.choices.length).length,
  figure_records: rows.filter(r => Array.isArray(r?.figure_refs) && r.figure_refs.length).length,
  local_figure_refs: uniq(rows.flatMap(r => (r.figure_refs || []).map(localFigureRef).filter(Boolean))),
  external_figure_refs: rows.flatMap(r => r.figure_refs || []).filter(ref => localFigureRef(ref) === null).length,
  grade_major_minor_combinations: uniq(rows.map(r => `${r.grade}\u0000${r.unit.major}\u0000${r.unit.minor}`)).length,
};

function assertA4Pdf(buffer, label) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 5000) fail(`${label}: PDF too small ${buffer?.length ?? 0}`);
  if (buffer.subarray(0,5).toString('ascii') !== '%PDF-') fail(`${label}: PDF header missing`);
  const ascii = buffer.toString('latin1');
  const boxes = [...ascii.matchAll(/\/MediaBox\s*\[\s*0\s+0\s+([0-9.]+)\s+([0-9.]+)\s*\]/g)];
  if (!boxes.length) fail(`${label}: MediaBox not found`);
  for (const m of boxes) {
    const w = Number(m[1]), h = Number(m[2]);
    if (!(Math.abs(w - 595.28) < 3 && Math.abs(h - 841.89) < 3)) fail(`${label}: non-A4 ${w}x${h}`);
  }
  return { bytes: buffer.length, pages: boxes.length, sha256: sha256(buffer) };
}

async function waitGate(page) {
  await page.waitForFunction(() => document.querySelector('#gate')?.textContent?.includes('PASS'), { timeout: 30000 });
  const status = await page.textContent('#status');
  if (!status?.includes('app-records.json')) fail(`real data source not reported: ${status}`);
  const summary = await page.textContent('#summary');
  if (!summary?.includes('候補 1231問') || !summary.includes('原問題 1124問') || !summary.includes('既存類題 107問')) {
    fail(`real summary mismatch: ${summary}`);
  }
}

async function renderAllRecordsInChunks(page, chunkSize = 100) {
  let rendered = 0;
  let renderedChoices = 0;
  let renderedFigures = 0;
  for (let start = 0; start < rows.length; start += chunkSize) {
    const chunk = rows.slice(start, start + chunkSize);
    await page.evaluate(chunkRows => window.render(chunkRows), chunk);
    const count = await page.locator('.problem').count();
    if (count !== chunk.length) fail(`DOM chunk ${start}: rendered ${count} != ${chunk.length}`);
    const ids = await page.locator('.problem').evaluateAll(els => els.map(el => el.dataset.id));
    const expectedIds = chunk.map(r => r.id);
    if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) fail(`DOM chunk ${start}: ID/order mismatch`);
    const titleCount = await page.locator('.problem-title').count();
    if (titleCount !== chunk.length) fail(`DOM chunk ${start}: title count ${titleCount} != ${chunk.length}`);
    const expectedChoices = chunk.reduce((n,r) => n + (Array.isArray(r.choices) ? r.choices.length : 0), 0);
    const choiceCount = await page.locator('.choices li').count();
    if (choiceCount !== expectedChoices) fail(`DOM chunk ${start}: choices ${choiceCount} != ${expectedChoices}`);
    const expectedFigures = chunk.reduce((n,r) => n + (Array.isArray(r.figure_refs) ? r.figure_refs.length : 0), 0);
    if (expectedFigures) {
      await page.waitForFunction(() => [...document.querySelectorAll('#list .figures img')].every(img => img.complete), null, { timeout: 30000 });
      const figureState = await page.evaluate(() => window.figurePrintReadiness());
      if (!figureState.ready || figureState.failed || figureState.pending) fail(`DOM chunk ${start}: figure load failed ${JSON.stringify(figureState)}`);
    }
    rendered += chunk.length;
    renderedChoices += choiceCount;
    renderedFigures += expectedFigures;
  }
  return { rendered, renderedChoices, renderedFigures, chunks: Math.ceil(rows.length / chunkSize) };
}

async function testEveryUnitFilter(page) {
  const combos = uniq(rows.map(r => `${r.grade}\u0000${r.unit.major}\u0000${r.unit.minor}`)).map(x => x.split('\u0000'));
  let tested = 0;
  for (const [grade, major, minor] of combos) {
    await page.selectOption('#grade', String(grade));
    await page.selectOption('#major', major);
    await page.selectOption('#minor', minor);
    const summary = await page.textContent('#summary');
    const m = summary?.match(/候補\s+(\d+)問/);
    if (!m || Number(m[1]) < 1) fail(`unit filter empty for 中${grade}/${major}/${minor}: ${summary}`);
    await page.click('#draw');
    if ((await page.locator('.problem').count()) < 1) fail(`unit draw empty for 中${grade}/${major}/${minor}`);
    tested++;
  }
  await page.selectOption('#grade', '');
  return { combinations: tested };
}

async function testDimensionFilters(page) {
  const results = {};
  const dimensions = [
    ['skill', uniq(rows.map(r => r.skill))],
    ['difficulty', uniq(rows.map(r => r.difficulty))],
    ['qformat', uniq(rows.map(r => r.question_format))],
    ['book', Object.keys(EXPECTED.source)],
  ];
  for (const [id, values] of dimensions) {
    let tested = 0;
    for (const value of values) {
      for (const resetId of ['grade','major','minor','skill','difficulty','qformat','book']) {
        const el = await page.$(`#${resetId}`);
        if (el) await page.selectOption(`#${resetId}`, '').catch(() => {});
      }
      await page.selectOption(`#${id}`, value);
      const summary = await page.textContent('#summary');
      const m = summary?.match(/候補\s+(\d+)問/);
      if (!m || Number(m[1]) < 1) fail(`dimension filter ${id}=${value} empty: ${summary}`);
      tested++;
    }
    results[id] = tested;
  }
  return results;
}

async function testSearchSamples(page) {
  const indexes = uniq([0,1,2,9,99,199,399,599,799,999,1123,1124,1230].filter(i => i < rows.length));
  let tested = 0;
  for (const idx of indexes) {
    const id = rows[idx].id;
    await page.fill('#search', id);
    await page.click('#draw');
    const count = await page.locator('.problem').count();
    if (count !== 1) fail(`ID search ${id}: count ${count}`);
    const renderedId = await page.locator('.problem').getAttribute('data-id');
    if (renderedId !== id) fail(`ID search ${id}: got ${renderedId}`);
    tested++;
  }
  await page.fill('#search','');
  return { ids: tested };
}

async function testSourceOrderAll(page) {
  const sortedIds = await page.evaluate(allRows => allRows.slice().sort(window.sourceSort).map(r => r.id), rows);
  const sorted = sortedIds.map(id => byId.get(id));
  let checked = 0;
  let nearestOriginal = null;
  for (const r of sorted) {
    if (!isVariant(r)) nearestOriginal = r.id;
    else {
      if (nearestOriginal !== r.source.parent_id) fail(`variant ${r.id} is not grouped after parent ${r.source.parent_id}; nearest original=${nearestOriginal}`);
      checked++;
    }
  }
  if (checked !== EXPECTED.variant) fail(`source-order variants checked ${checked} != ${EXPECTED.variant}`);
  return { variants_grouped_after_parent: checked };
}

async function testAllFigureUrls(page) {
  const refs = uniq(rows.flatMap(r => r.figure_refs || []));
  const results = [];
  for (const ref of refs) {
    if (/^data:/i.test(ref) || /^blob:/i.test(ref)) { results.push({ ref, status: 'embedded-skip-http' }); continue; }
    const url = new URL(ref, BASE_URL).toString();
    const response = await page.request.get(url, { timeout: 30000, failOnStatusCode: false });
    if (!response.ok()) fail(`figure HTTP failed ${response.status()} ${ref}`);
    const body = await response.body();
    if (!body.length) fail(`figure empty ${ref}`);
    results.push({ ref, status: response.status(), bytes: body.length, sha256: sha256(body) });
  }
  return { refs: refs.length, fetched: results.length, results };
}

async function printGradeSamples(page, name) {
  if (name !== 'chromium-desktop') return 'not-applicable';
  fs.mkdirSync(PDF_DIR, { recursive: true });
  const output = {};
  for (const grade of [1,2,3]) {
    await page.selectOption('#grade', String(grade));
    await page.selectOption('#kind', 'both');
    await page.selectOption('#order', 'source');
    await page.fill('#count','10');
    await page.locator('#count').press('Tab');
    await page.fill('#search','');
    await page.click('#draw');
    if ((await page.locator('.problem').count()) < 1) fail(`grade ${grade}: no print rows`);
    await page.waitForFunction(() => [...document.querySelectorAll('#list .figures img')].every(img => img.complete));
    const readiness = await page.evaluate(() => window.figurePrintReadiness());
    if (!readiness.ready) fail(`grade ${grade}: figures not print-ready ${JSON.stringify(readiness)}`);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.body.classList.remove('print-answers'));
    const qpdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
    const q = assertA4Pdf(qpdf, `grade ${grade} question`);
    const qPath = path.join(PDF_DIR, `grade${grade}-questions.pdf`);
    fs.writeFileSync(qPath, qpdf);
    await page.evaluate(() => document.body.classList.add('print-answers'));
    const apdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
    const a = assertA4Pdf(apdf, `grade ${grade} answers`);
    const aPath = path.join(PDF_DIR, `grade${grade}-answers.pdf`);
    fs.writeFileSync(aPath, apdf);
    output[`grade${grade}`] = { question: { ...q, path: qPath }, answer: { ...a, path: aPath } };
    await page.evaluate(() => document.body.classList.remove('print-answers'));
    await page.emulateMedia({ media: 'screen' });
  }
  return output;
}

async function runCase(browserType, name, viewport) {
  let browser = null;
  let context = null;
  const pageErrors = [];
  let phase = 'launch';
  try {
    browser = await browserType.launch({ headless: true });
    context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', e => pageErrors.push(String(e)));
    phase = 'load-real-canonical';
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await waitGate(page);

    phase = 'all-record-dom-render';
    const dom = await renderAllRecordsInChunks(page);
    phase = 'all-unit-filter-combinations';
    const units = await testEveryUnitFilter(page);
    phase = 'dimension-filters';
    const dimensions = await testDimensionFilters(page);
    phase = 'search-samples';
    const search = await testSearchSamples(page);
    phase = 'source-order-all-variants';
    const sourceOrder = await testSourceOrderAll(page);
    phase = 'figure-http-assets';
    const figures = await testAllFigureUrls(page);
    phase = 'grade-print-pdfs';
    const pdf = await printGradeSamples(page, name);
    phase = 'screen-overflow';
    const overflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    if (overflow.scrollWidth > overflow.width + 1) fail(`${name}: horizontal overflow ${JSON.stringify(overflow)}`);
    if (pageErrors.length) fail(`${name}: page errors ${JSON.stringify(pageErrors)}`);
    return { name, status:'success', phase:'complete', viewport, dom, units, dimensions, search, sourceOrder, figures, pdf, overflow, pageErrors };
  } catch (error) {
    return { name, status:'failure', phase, viewport, error:error instanceof Error ? error.message : String(error), stack:error instanceof Error ? error.stack : '', pageErrors };
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

const cases = [
  [chromium, 'chromium-desktop', { width:1280, height:900 }],
  [firefox, 'firefox-desktop', { width:1280, height:900 }],
  [webkit, 'webkit-iphone', { width:390, height:844 }],
  [chromium, 'chromium-fire', { width:800, height:1280 }],
];
const results = [];
for (const [browserType, name, viewport] of cases) {
  const r = await runCase(browserType, name, viewport);
  results.push(r);
  console.log(`${r.status === 'success' ? 'PASS' : 'FAIL'} REAL ${name} phase=${r.phase}${r.error ? ` error=${r.error}` : ''}`);
}
const failed = results.filter(r => r.status !== 'success');
const report = {
  workflow_test: 'Math Problem Bank REAL Canonical Browser Regression',
  overall_result: failed.length ? 'failure' : 'success',
  synthetic_fixture_only: false,
  canonical_data_written: true,
  base_url: BASE_URL,
  data_path: DATA_PATH,
  staticCoverage,
  results,
};
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive:true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(failed.length ? 'FAIL_REAL_CANONICAL_BROWSER_REGRESSION' : 'PASS_REAL_CANONICAL_BROWSER_REGRESSION');
console.log(JSON.stringify(report, null, 2));
if (failed.length) process.exitCode = 1;
