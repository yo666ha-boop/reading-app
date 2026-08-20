import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

const BASE_URL = process.env.MATH_APP_BASE_URL || 'http://127.0.0.1:8765/index.html';
const REPORT_PATH = process.env.MATH_BROWSER_REPORT || 'math-bank/state/browser-regression-latest.json';
const SVG_DATA = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%2260%22 viewBox=%220 0 120 60%22%3E%3Crect width=%22120%22 height=%2260%22 fill=%22white%22/%3E%3Cpath d=%22M10 50 L60 10 L110 50 Z%22 fill=%22none%22 stroke=%22black%22 stroke-width=%222%22/%3E%3C/svg%3E';

function fail(message) {
  throw new Error(message);
}

async function injectCanonicalFixture(page) {
  await page.evaluate(({ svgData }) => {
    const rows = [];
    const originals = [];
    let i = 0;
    const books = [['Winpass', 570], ['実力錬成', 237], ['Standard', 317]];
    for (const [book, count] of books) {
      for (let n = 1; n <= count; n++) {
        i++;
        const grade = i <= 400 ? 1 : (i <= 800 ? 2 : 3);
        const rid = `TEST-ORIG-${String(i).padStart(4, '0')}`;
        const hasChoices = i % 10 === 0;
        originals.push({ rid, grade, hasChoices, minor: grade === 1 ? '正負の数' : (grade === 2 ? '式の計算' : '多項式') });
        rows.push({
          id: rid,
          grade,
          unit: {
            major: '数と式',
            minor: grade === 1 ? '正負の数' : (grade === 2 ? '式の計算' : '多項式'),
            tags: ['TEST_ONLY_BROWSER_FIXTURE'],
          },
          title: `テスト専用 ${i}`,
          skill: '計算',
          question_format: hasChoices ? '選択' : '記述',
          difficulty: 'standard',
          source: {
            book,
            document: 'TEST_ONLY_NOT_CANONICAL',
            original_no: String(n),
            is_generated_variant: false,
            parent_id: null,
          },
          question: i === 1 ? `ブラウザ回帰専用問題 ${i}\n[[IMAGE:${svgData}]]\n図の直後の文` : `ブラウザ回帰専用問題 ${i}`,
          choices: hasChoices ? ['選択肢A', '選択肢B', '選択肢C'] : null,
          answer: hasChoices ? '選択肢B' : String(i),
          explanation: `ブラウザ回帰専用解説 ${i}`,
          figure_refs: i === 1 ? [svgData] : [],
          variant_group: null,
          prerequisites: [],
          audit: {
            problem_answer_verified: true,
            structure_verified: true,
            figure_refs_verified: true,
          },
        });
      }
    }
    for (let n = 1; n <= 107; n++) {
      i++;
      const parent = originals[n - 1];
      const hasChoices = parent.hasChoices;
      rows.push({
        id: `TEST-VAR-${String(n).padStart(3, '0')}`,
        grade: parent.grade,
        unit: { major: '数と式', minor: parent.minor, tags: ['TEST_ONLY_BROWSER_FIXTURE'] },
        title: `テスト専用類題 ${n}`,
        skill: '計算',
        question_format: hasChoices ? '選択' : '記述',
        difficulty: 'standard',
        source: {
          book: 'generated',
          document: 'TEST_ONLY_NOT_CANONICAL_VARIANT',
          original_no: null,
          is_generated_variant: true,
          parent_id: parent.rid,
        },
        question: `ブラウザ回帰専用類題 ${n}`,
        choices: hasChoices ? ['選択肢A', '選択肢B', '選択肢C'] : null,
        answer: hasChoices ? '選択肢B' : String(n),
        explanation: `ブラウザ回帰専用類題解説 ${n}`,
        figure_refs: [],
        variant_group: parent.rid,
        prerequisites: [],
        audit: {
          problem_answer_verified: true,
          structure_verified: true,
          figure_refs_verified: true,
        },
      });
    }
    for (let n = 1; n <= 3; n++) {
      i++;
      const parent = originals[198 + n];
      const hasChoices = parent.hasChoices;
      rows.push({
        id: `TEST-XVAR-${String(n).padStart(3, '0')}`,
        grade: parent.grade,
        unit: { major: '数と式', minor: parent.minor, tags: ['TEST_ONLY_BROWSER_FIXTURE', 'EXPANDED_VARIANT'] },
        title: `テスト専用追加類題 ${n}`,
        skill: '計算',
        question_format: hasChoices ? '選択' : '記述',
        difficulty: 'standard',
        source: {
          book: 'generated',
          document: 'TEST_ONLY_EXPANDED_VARIANT',
          original_no: null,
          is_generated_variant: true,
          parent_id: parent.rid,
        },
        question: `ブラウザ回帰専用追加類題 ${n}`,
        choices: hasChoices ? ['選択肢A', '選択肢B', '選択肢C'] : null,
        answer: hasChoices ? '選択肢B' : String(2000 + n),
        explanation: `ブラウザ回帰専用追加類題解説 ${n}`,
        figure_refs: [],
        variant_group: parent.rid,
        prerequisites: [],
        audit: {
          problem_answer_verified: true,
          structure_verified: true,
          figure_refs_verified: true,
        },
      });
    }
    if (rows.length !== 1234) throw new Error(`fixture count ${rows.length}`);
    window.acceptRecords(rows, 'TEST_ONLY_BROWSER_MEMORY_FIXTURE');
  }, { svgData: SVG_DATA });
  await page.waitForFunction(() => document.querySelector('#gate')?.textContent?.includes('PASS'));
}

async function setSelect(page, id, value) {
  await page.selectOption(`#${id}`, value);
}

function assertA4Pdf(buffer, label) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 5000) fail(`${label}: PDF too small or missing (${buffer?.length ?? 0} bytes)`);
  if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') fail(`${label}: missing PDF header`);
  const ascii = buffer.toString('latin1');
  const boxes = [...ascii.matchAll(/\/MediaBox\s*\[\s*0\s+0\s+([0-9.]+)\s+([0-9.]+)\s*\]/g)];
  if (!boxes.length) fail(`${label}: MediaBox not found`);
  for (const m of boxes) {
    const w = Number(m[1]);
    const h = Number(m[2]);
    const portraitA4 = Math.abs(w - 595.28) < 3 && Math.abs(h - 841.89) < 3;
    if (!portraitA4) fail(`${label}: non-A4 MediaBox ${w}x${h}`);
  }
  return { bytes: buffer.length, pages: boxes.length };
}

async function runCase(browserType, name, viewport) {
  let browser = null;
  let context = null;
  let phase = 'launch';
  const pageErrors = [];
  try {
    browser = await browserType.launch({ headless: true });
    phase = 'new-context';
    context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', err => pageErrors.push(String(err)));

    phase = 'initial-load';
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#status')?.textContent?.includes('基準データ未接続'));
    const rendererLoaded = await page.evaluate(() => !!window.MikamiMathFigureMarkers?.renderCanonicalText);
    if (!rendererLoaded) fail(`${name}: inline figure marker renderer not loaded`);

    phase = 'canonical-fixture-injection';
    await injectCanonicalFixture(page);
    const gate = await page.textContent('#gate');
    if (!gate?.includes('拡張ゲート PASS') || !gate.includes('追加3問')) fail(`${name}: expanded gate did not pass with dynamic verified variants: ${gate}`);
    const summary = await page.textContent('#summary');
    if (!summary?.includes('候補 1234問') || !summary.includes('原問題 1124問') || !summary.includes('類題 110問')) {
      fail(`${name}: expanded summary mismatch: ${summary}`);
    }

    phase = 'inline-figure-marker-readiness';
    await page.fill('#search', 'TEST-ORIG-0001');
    await page.click('#draw');
    await page.waitForSelector('.inline-figure img[data-inline-figure="1"]');
    await page.waitForFunction(() => {
      const img = document.querySelector('.inline-figure img[data-inline-figure="1"]');
      return img && img.complete;
    });
    const markerState = await page.evaluate(() => ({
      rawMarkerVisible: document.querySelector('.q')?.textContent?.includes('[[IMAGE:') || false,
      inlineImages: document.querySelectorAll('.inline-figure img[data-inline-figure="1"]').length,
      duplicateStandaloneImages: document.querySelectorAll('.figures img').length,
      markerErrors: document.querySelectorAll('[data-figure-marker-error="1"]').length,
      qText: document.querySelector('.q')?.textContent || '',
      readiness: window.figurePrintReadiness(),
    }));
    if (markerState.rawMarkerVisible) fail(`${name}: raw [[IMAGE:...]] marker leaked to visible question`);
    if (markerState.inlineImages !== 1) fail(`${name}: inline marker rendered ${markerState.inlineImages} images instead of 1`);
    if (markerState.duplicateStandaloneImages !== 0) fail(`${name}: inline marker ref was rendered again as standalone figure`);
    if (markerState.markerErrors !== 0) fail(`${name}: valid inline marker produced marker error`);
    if (!markerState.qText.includes('図の直後の文')) fail(`${name}: text after inline marker was lost`);
    if (!markerState.readiness.ready || markerState.readiness.failed !== 0 || markerState.readiness.pending !== 0 || markerState.readiness.images !== 1) {
      fail(`${name}: inline figure readiness failed ${JSON.stringify(markerState.readiness)}`);
    }

    phase = 'title-choices-answer';
    await page.fill('#search', 'TEST-ORIG-0010');
    await page.click('#draw');
    if ((await page.locator('.problem-title').count()) !== 1) fail(`${name}: title not rendered`);
    if ((await page.locator('.choices li').count()) !== 3) fail(`${name}: choices not rendered in order`);
    const renderedChoices = await page.locator('.choices li').allTextContents();
    if (JSON.stringify(renderedChoices) !== JSON.stringify(['選択肢A', '選択肢B', '選択肢C'])) fail(`${name}: choices changed ${JSON.stringify(renderedChoices)}`);
    await page.click('.answer-toggle');
    const answerDisplay = await page.locator('.answer').evaluate(el => getComputedStyle(el).display);
    if (answerDisplay === 'none') fail(`${name}: per-question answer did not open`);

    phase = 'parent-variant-source-order';
    await page.fill('#search', '');
    await setSelect(page, 'grade', '1');
    await setSelect(page, 'book', 'Winpass');
    await setSelect(page, 'kind', 'both');
    await setSelect(page, 'order', 'source');
    await page.fill('#count', '20');
    await page.locator('#count').press('Tab');
    await page.click('#draw');
    const firstIds = await page.locator('.problem').evaluateAll(els => els.slice(0, 4).map(el => el.dataset.id));
    if (firstIds[0] !== 'TEST-ORIG-0001' || firstIds[1] !== 'TEST-VAR-001') fail(`${name}: parent/variant source order mismatch ${JSON.stringify(firstIds)}`);

    phase = 'settings-save';
    await setSelect(page, 'major', '数と式');
    await setSelect(page, 'minor', '正負の数');
    await setSelect(page, 'skill', '計算');
    await setSelect(page, 'difficulty', 'standard');
    await setSelect(page, 'qformat', '記述');
    await page.fill('#count', '17');
    await page.locator('#count').press('Tab');

    phase = 'settings-reload';
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#status')?.textContent?.includes('基準データ未接続'));
    await injectCanonicalFixture(page);
    const restored = await page.evaluate(() => Object.fromEntries(['grade','major','minor','skill','difficulty','qformat','book','count','order'].map(id => [id, document.getElementById(id).value])));
    const expectedRestored = { grade:'1', major:'数と式', minor:'正負の数', skill:'計算', difficulty:'standard', qformat:'記述', book:'Winpass', count:'17', order:'source' };
    if (JSON.stringify(restored) !== JSON.stringify(expectedRestored)) fail(`${name}: settings restore mismatch ${JSON.stringify(restored)}`);

    phase = 'print-css-question';
    await setSelect(page, 'qformat', '');
    await page.fill('#search', 'TEST-ORIG-0001');
    await page.click('#draw');
    await page.waitForSelector('.inline-figure img[data-inline-figure="1"]');
    await page.waitForFunction(() => document.querySelector('.inline-figure img')?.complete === true);
    if ((await page.locator('.problem').count()) !== 1) fail(`${name}: print marker problem did not render`);
    const beforePrintReadiness = await page.evaluate(() => window.figurePrintReadiness());
    if (!beforePrintReadiness.ready || beforePrintReadiness.images !== 1) fail(`${name}: marker figure not print-ready`);
    await page.emulateMedia({ media: 'print' });
    const questionPrint = await page.evaluate(() => ({
      controls: getComputedStyle(document.querySelector('.controls')).display,
      answer: getComputedStyle(document.querySelector('.answer')).display,
      inlineImage: getComputedStyle(document.querySelector('.inline-figure img')).display,
    }));
    if (questionPrint.controls !== 'none' || questionPrint.answer !== 'none' || questionPrint.inlineImage === 'none') fail(`${name}: question print CSS mismatch ${JSON.stringify(questionPrint)}`);

    let pdf = null;
    if (name === 'chromium-desktop') {
      phase = 'question-pdf';
      const questionPdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
      const question = assertA4Pdf(questionPdf, `${name}: question PDF`);
      phase = 'answer-pdf';
      await page.evaluate(() => document.body.classList.add('print-answers'));
      await page.emulateMedia({ media: 'print' });
      const answerPrintBeforePdf = await page.locator('.answer').evaluate(el => getComputedStyle(el).display);
      if (answerPrintBeforePdf === 'none') fail(`${name}: answer print CSS hides answer before PDF generation`);
      const answerPdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
      const answer = assertA4Pdf(answerPdf, `${name}: answer PDF`);
      if (question.pages < 1 || answer.pages < 1) fail(`${name}: PDF page count invalid`);
      pdf = { question, answer };
    } else {
      phase = 'answer-print-css';
      await page.evaluate(() => document.body.classList.add('print-answers'));
      await page.emulateMedia({ media: 'print' });
      const answerPrint = await page.locator('.answer').evaluate(el => getComputedStyle(el).display);
      if (answerPrint === 'none') fail(`${name}: answer print CSS still hides answer`);
    }

    phase = 'screen-overflow';
    await page.evaluate(() => document.body.classList.remove('print-answers'));
    await page.emulateMedia({ media: 'screen' });
    const overflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    if (overflow.scrollWidth > overflow.width + 1) fail(`${name}: horizontal overflow ${JSON.stringify(overflow)}`);
    if (pageErrors.length) fail(`${name}: page errors ${JSON.stringify(pageErrors)}`);

    return {
      name,
      status: 'success',
      phase: 'complete',
      viewport,
      gate: 'PASS',
      choices: 'PASS',
      sourceOrder: 'PASS',
      settings: 'PASS',
      figure: 'PASS',
      inlineFigureMarker: 'PASS',
      printCss: 'PASS',
      pdf: pdf ?? 'not-applicable',
      overflow,
      pageErrors,
    };
  } catch (error) {
    return {
      name,
      status: 'failure',
      phase,
      viewport,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : '',
      pageErrors,
    };
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

const cases = [
  [chromium, 'chromium-desktop', { width: 1280, height: 900 }],
  [firefox, 'firefox-desktop', { width: 1280, height: 900 }],
  [webkit, 'webkit-iphone', { width: 390, height: 844 }],
  [chromium, 'chromium-fire', { width: 800, height: 1280 }],
];

const results = [];
for (const [browserType, name, viewport] of cases) {
  const result = await runCase(browserType, name, viewport);
  results.push(result);
  console.log(`${result.status === 'success' ? 'PASS' : 'FAIL'} ${name} phase=${result.phase}${result.error ? ` error=${result.error}` : ''}`);
}

const failed = results.filter(r => r.status !== 'success');
const report = {
  workflow_test: 'Math Problem Bank Browser Regression',
  overall_result: failed.length ? 'failure' : 'success',
  base_url: BASE_URL,
  synthetic_fixture_only: true,
  canonical_data_written: false,
  results,
};
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(failed.length ? 'FAIL_BROWSER_REGRESSION' : 'PASS_BROWSER_REGRESSION');
console.log(JSON.stringify(report, null, 2));
if (failed.length) process.exitCode = 1;
