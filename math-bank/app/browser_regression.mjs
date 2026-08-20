import { chromium, firefox, webkit } from 'playwright';

const BASE_URL = process.env.MATH_APP_BASE_URL || 'http://127.0.0.1:8765/index.html';
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
        originals.push({ rid, grade });
        const hasChoices = i % 10 === 0;
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
          question: `ブラウザ回帰専用問題 ${i}`,
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
      const hasChoices = i % 10 === 0;
      rows.push({
        id: `TEST-VAR-${String(n).padStart(3, '0')}`,
        grade: parent.grade,
        unit: { major: '数と式', minor: '正負の数', tags: ['TEST_ONLY_BROWSER_FIXTURE'] },
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
    if (rows.length !== 1231) throw new Error(`fixture count ${rows.length}`);
    window.acceptRecords(rows, 'TEST_ONLY_BROWSER_MEMORY_FIXTURE');
  }, { svgData: SVG_DATA });
  await page.waitForFunction(() => document.querySelector('#gate')?.textContent?.includes('PASS'));
}

async function setSelect(page, id, value) {
  await page.selectOption(`#${id}`, value);
}

async function runCase(browserType, name, viewport) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(String(err)));

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#status')?.textContent?.includes('正本データ未接続'));
    await injectCanonicalFixture(page);

    const gate = await page.textContent('#gate');
    if (!gate?.includes('PASS') || !gate.includes('タイトル/選択肢')) fail(`${name}: canonical gate did not pass with title/choices`);
    const summary = await page.textContent('#summary');
    if (!summary?.includes('候補 1231問') || !summary.includes('原問題 1124問') || !summary.includes('既存類題 107問')) {
      fail(`${name}: canonical summary mismatch: ${summary}`);
    }

    // Figure load/readiness using the first original record.
    await page.fill('#search', 'TEST-ORIG-0001');
    await page.click('#draw');
    await page.waitForSelector('.figures img');
    await page.waitForFunction(() => {
      const img = document.querySelector('.figures img');
      return img && img.complete;
    });
    const figureReady = await page.evaluate(() => window.figurePrintReadiness());
    if (!figureReady.ready || figureReady.failed !== 0 || figureReady.pending !== 0) fail(`${name}: figure readiness failed ${JSON.stringify(figureReady)}`);

    // Title, choices, search, per-question answer.
    await page.fill('#search', 'TEST-ORIG-0010');
    await page.click('#draw');
    if ((await page.locator('.problem-title').count()) !== 1) fail(`${name}: title not rendered`);
    if ((await page.locator('.choices li').count()) !== 3) fail(`${name}: choices not rendered in order`);
    const renderedChoices = await page.locator('.choices li').allTextContents();
    if (JSON.stringify(renderedChoices) !== JSON.stringify(['選択肢A', '選択肢B', '選択肢C'])) fail(`${name}: choices changed ${JSON.stringify(renderedChoices)}`);
    await page.click('.answer-toggle');
    const answerDisplay = await page.locator('.answer').evaluate(el => getComputedStyle(el).display);
    if (answerDisplay === 'none') fail(`${name}: per-question answer did not open`);

    // Source order: generated variant must immediately follow its parent within Winpass.
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

    // Dynamic localStorage restore through a full reload and re-injection.
    await setSelect(page, 'major', '数と式');
    await setSelect(page, 'minor', '正負の数');
    await setSelect(page, 'skill', '計算');
    await setSelect(page, 'difficulty', 'standard');
    await setSelect(page, 'qformat', '記述');
    await page.fill('#count', '17');
    await page.locator('#count').press('Tab');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#status')?.textContent?.includes('正本データ未接続'));
    await injectCanonicalFixture(page);
    const restored = await page.evaluate(() => Object.fromEntries(['grade','major','minor','skill','difficulty','qformat','book','count','order'].map(id => [id, document.getElementById(id).value])));
    const expectedRestored = { grade:'1', major:'数と式', minor:'正負の数', skill:'計算', difficulty:'standard', qformat:'記述', book:'Winpass', count:'17', order:'source' };
    if (JSON.stringify(restored) !== JSON.stringify(expectedRestored)) fail(`${name}: settings restore mismatch ${JSON.stringify(restored)}`);

    // Print CSS contract: controls hidden; answers hidden on question print, visible on answer print.
    await setSelect(page, 'qformat', '');
    await page.fill('#search', 'TEST-ORIG-0010');
    await page.click('#draw');
    if ((await page.locator('.problem').count()) !== 1) fail(`${name}: print test choice problem did not render`);
    await page.emulateMedia({ media: 'print' });
    const questionPrint = await page.evaluate(() => ({
      controls: getComputedStyle(document.querySelector('.controls')).display,
      answer: getComputedStyle(document.querySelector('.answer')).display,
    }));
    if (questionPrint.controls !== 'none' || questionPrint.answer !== 'none') fail(`${name}: question print CSS mismatch ${JSON.stringify(questionPrint)}`);
    await page.evaluate(() => document.body.classList.add('print-answers'));
    const answerPrint = await page.locator('.answer').evaluate(el => getComputedStyle(el).display);
    if (answerPrint === 'none') fail(`${name}: answer print CSS still hides answer`);
    await page.evaluate(() => document.body.classList.remove('print-answers'));
    await page.emulateMedia({ media: 'screen' });

    const overflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    if (overflow.scrollWidth > overflow.width + 1) fail(`${name}: horizontal overflow ${JSON.stringify(overflow)}`);
    if (pageErrors.length) fail(`${name}: page errors ${JSON.stringify(pageErrors)}`);

    return { name, viewport, gate: 'PASS', choices: 'PASS', sourceOrder: 'PASS', settings: 'PASS', figure: 'PASS', printCss: 'PASS', overflow };
  } finally {
    await context.close();
    await browser.close();
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
  results.push(await runCase(browserType, name, viewport));
}
console.log('PASS_BROWSER_REGRESSION');
console.log(JSON.stringify(results, null, 2));
