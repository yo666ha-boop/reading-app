const fs = require('fs');
const { chromium, webkit } = require('playwright');

const PREVIEW_URL = process.env.V11_PREVIEW_URL || 'https://yo666ha-boop.github.io/reading-app/v11-preview/';
const EXPECTED_SHA = process.env.EXPECTED_SOURCE_SHA || '';
const samples = [
  { textbook:'サンシャイン', grade:'1', major:'PROGRAM 10', section:'PROGRAM 10-2' },
  { textbook:'ニューホライズン', grade:'1', major:'Unit 10', section:'Unit 10-2' },
  { textbook:'サンシャイン', grade:'2', major:'PROGRAM 8', section:'PROGRAM 8-3' },
  { textbook:'ニューホライズン', grade:'2', major:'Unit 7', section:'Unit 7-4' },
  { textbook:'サンシャイン', grade:'3', major:'PROGRAM 7', section:'PROGRAM 7-3' },
  { textbook:'ニューホライズン', grade:'3', major:'Unit 6', section:'Unit 6-4' },
];

const norm = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const promptText = s => norm(String(s || '').replace(/^\d+\.\s*/, ''));

async function waitForPublishedSource(request) {
  const deadline = Date.now() + 240000;
  let last = '';
  while (Date.now() < deadline) {
    try {
      const res = await request.get(PREVIEW_URL + 'PREVIEW_SOURCE.txt?ts=' + Date.now(), { timeout: 15000 });
      if (res.ok()) {
        last = await res.text();
        if (!EXPECTED_SHA || last.includes('source_sha=' + EXPECTED_SHA)) return last;
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('public preview did not reach expected source SHA ' + EXPECTED_SHA + '; last=' + last);
}

async function selectExact(page, id, value) {
  await page.selectOption('#' + id, { label: value }).catch(async () => {
    await page.selectOption('#' + id, value);
  });
  await page.waitForTimeout(80);
}

async function settleRuntime(page) {
  await page.waitForFunction(() => {
    const s = window.V11_MULTI_PASSAGE_STATE;
    return !!(s && s.extraPassages >= 650 && typeof window.V11_SYNC_PASSAGE_VARIANT_UI === 'function');
  }, null, { timeout: 120000 });
  await page.evaluate(() => window.V11_SYNC_PASSAGE_VARIANT_UI({ preserveSelection:false, source:'public-audit-settle' }));
  await page.waitForTimeout(100);
}

async function inspectSelected(page, expectedId) {
  return page.evaluate((expectedId) => {
    const p = typeof window.choose === 'function' ? window.choose() : null;
    const passage = document.getElementById('passage');
    const slash = document.getElementById('slash');
    const questions = document.getElementById('questions');
    const answers = document.getElementById('answers');
    const support = window.V11_EASY_SUPPORT_LAST_RENDER || null;
    const variant = document.getElementById('v11PassageVariant');
    const qA = p && Array.isArray(p.questions) ? p.questions : [];
    const qB = p && Array.isArray(p.questionSetB) ? p.questionSetB : [];
    return {
      id: p && p.id,
      expectedId,
      bodyText: passage ? passage.textContent : '',
      slashText: slash ? slash.textContent : '',
      questionsText: questions ? questions.textContent : '',
      answersText: answers ? answers.textContent : '',
      optionCount: variant ? variant.options.length : 0,
      optionLabels: variant ? Array.from(variant.options).map(o => o.textContent) : [],
      optionValues: variant ? Array.from(variant.options).map(o => o.value) : [],
      fullTranslation: p && p.fullTranslation || '',
      firstSentence: p && p.sentences && p.sentences[0] || '',
      firstSlashEn: p && p.slashRows && p.slashRows[0] && p.slashRows[0].en || '',
      firstSlashJp: p && p.slashRows && p.slashRows[0] && p.slashRows[0].jp || '',
      aCount: qA.length,
      bCount: qB.length,
      aPrompt: qA[0] && qA[0].prompt || '',
      aEvidence: qA[0] && qA[0].evidence || '',
      aEvidenceJp: qA[0] && qA[0].evidenceJp || '',
      aReason: qA[0] && qA[0].reason || '',
      bPrompt: qB[0] && qB[0].prompt || '',
      bEvidence: qB[0] && qB[0].evidence || '',
      bEvidenceJp: qB[0] && qB[0].evidenceJp || '',
      bReason: qB[0] && qB[0].reason || '',
      notesCount: p && Array.isArray(p.notes) ? p.notes.length : 0,
      supportNotesCount: p && Array.isArray(p.supportNotes) ? p.supportNotes.length : 0,
      supportLastRender: support,
      uiState: window.V11_MULTI_PASSAGE_UI_STATE || null,
    };
  }, expectedId);
}

function requireCondition(cond, message, failures) {
  if (!cond) failures.push(message);
}

async function auditEngine(browserType, engineName) {
  const browser = await browserType.launch();
  const page = await browser.newPage({ viewport: engineName === 'webkit' ? { width:390, height:844 } : { width:1440, height:1000 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => pageErrors.push(String(err)));
  await page.goto(PREVIEW_URL + '?audit=' + Date.now(), { waitUntil:'domcontentloaded', timeout:120000 });
  await settleRuntime(page);

  const results = [];
  const failures = [];

  for (const s of samples) {
    await selectExact(page, 'textbook', s.textbook);
    await selectExact(page, 'grade', s.grade);
    await selectExact(page, 'major', s.major);
    await selectExact(page, 'section', s.section);
    await page.selectOption('#pattern', 'all');
    await page.evaluate(() => window.V11_SYNC_PASSAGE_VARIANT_UI({ preserveSelection:false, source:'public-audit-filter' }));
    await page.waitForTimeout(100);

    const options = await page.locator('#v11PassageVariant option').evaluateAll(os => os.map(o => ({ value:o.value, label:o.textContent })));
    requireCondition(options.length > 1, `${engineName} ${s.textbook} G${s.grade} ${s.section}: only ${options.length} passage option(s)`, failures);
    requireCondition(options[0] && /^基本/.test(options[0].label), `${engineName} ${s.section}: first option is not 基本`, failures);
    requireCondition(options.slice(1).every(o => /^追加\d+｜/.test(o.label)), `${engineName} ${s.section}: additional option labels missing`, failures);

    if (options.length <= 1) {
      results.push({ ...s, optionCount:options.length, options, pass:false });
      continue;
    }

    const baseValue = options[0].value;
    const extraValue = options[1].value;

    await page.selectOption('#v11PassageVariant', extraValue);
    await page.waitForTimeout(100);
    await page.waitForFunction(id => window.choose && window.choose() && window.choose().id === id, extraValue, { timeout:10000 });

    let extra = await inspectSelected(page, extraValue);
    requireCondition(extra.id === extraValue, `${engineName} ${s.section}: selected extra id mismatch ${extra.id} != ${extraValue}`, failures);
    requireCondition(extra.aCount === 5, `${engineName} ${extraValue}: A questions=${extra.aCount}`, failures);
    requireCondition(extra.bCount === 5, `${engineName} ${extraValue}: B questions=${extra.bCount}`, failures);
    requireCondition(norm(extra.bodyText).includes(norm(extra.firstSentence)), `${engineName} ${extraValue}: body not synchronized`, failures);
    requireCondition(norm(extra.bodyText).includes(norm(extra.fullTranslation)), `${engineName} ${extraValue}: fullTranslation not synchronized`, failures);
    requireCondition(norm(extra.slashText).includes(norm(extra.firstSlashEn)) && norm(extra.slashText).includes(norm(extra.firstSlashJp)), `${engineName} ${extraValue}: slash not synchronized`, failures);
    requireCondition(norm(extra.questionsText).includes(promptText(extra.aPrompt)), `${engineName} ${extraValue}: A prompt not synchronized`, failures);
    requireCondition(norm(extra.answersText).includes(norm(extra.aEvidence)) && norm(extra.answersText).includes(norm(extra.aEvidenceJp)) && norm(extra.answersText).includes(norm(extra.aReason)), `${engineName} ${extraValue}: A evidence/reason not synchronized`, failures);

    const altDisabled = await page.locator('#altSetBtn').isDisabled();
    requireCondition(!altDisabled, `${engineName} ${extraValue}: B set button disabled`, failures);
    if (!altDisabled) {
      await page.click('#altSetBtn');
      await page.waitForTimeout(80);
      const bUi = await page.evaluate(() => ({
        q: document.getElementById('questions').textContent,
        a: document.getElementById('answers').textContent,
      }));
      requireCondition(norm(bUi.q).includes(promptText(extra.bPrompt)), `${engineName} ${extraValue}: B prompt not synchronized`, failures);
      requireCondition(norm(bUi.a).includes(norm(extra.bEvidence)) && norm(bUi.a).includes(norm(extra.bEvidenceJp)) && norm(bUi.a).includes(norm(extra.bReason)), `${engineName} ${extraValue}: B evidence/reason not synchronized`, failures);
    }

    const supportButton = page.locator('#v11WordSupportBtn');
    requireCondition(await supportButton.count() === 1, `${engineName} ${extraValue}: support button missing`, failures);
    if (await supportButton.count()) {
      const checked = await supportButton.getAttribute('aria-checked');
      if (checked !== 'true') await supportButton.click();
      await page.waitForFunction(id => window.V11_EASY_SUPPORT_LAST_RENDER && window.V11_EASY_SUPPORT_LAST_RENDER.passageId === id && window.V11_EASY_SUPPORT_LAST_RENDER.on === true, extraValue, { timeout:10000 });
      extra = await inspectSelected(page, extraValue);
      requireCondition(extra.supportLastRender && extra.supportLastRender.passageId === extraValue, `${engineName} ${extraValue}: support render passage mismatch`, failures);
      requireCondition(extra.supportNotesCount > 0 || extra.notesCount > 0, `${engineName} ${extraValue}: no normal/easy support notes`, failures);
      requireCondition((await page.locator('#passage .v11-notes').count()) === 1, `${engineName} ${extraValue}: support notes UI missing`, failures);
    }

    await page.selectOption('#v11PassageVariant', baseValue);
    await page.waitForTimeout(80);
    const base = await inspectSelected(page, baseValue);
    requireCondition(base.id === baseValue, `${engineName} ${s.section}: base switch failed ${base.id} != ${baseValue}`, failures);
    requireCondition(base.id !== extra.id && norm(base.bodyText) !== norm(extra.bodyText), `${engineName} ${s.section}: base/extra UI did not change`, failures);

    results.push({
      ...s,
      optionCount:options.length,
      options,
      baseId:base.id,
      extraId:extra.id,
      extraA:extra.aCount,
      extraB:extra.bCount,
      supportNotes:extra.supportNotesCount,
      requiredNotes:extra.notesCount,
      pass:failures.filter(f=>f.includes(s.section)).length===0
    });
  }

  const runtime = await page.evaluate(() => ({
    multi: window.V11_MULTI_PASSAGE_STATE || null,
    ui: window.V11_MULTI_PASSAGE_UI_STATE || null,
    batch13: window.V11_BATCH13_RUNTIME_REGISTERED || null,
  }));

  requireCondition(runtime.multi && runtime.multi.extraPassages >= 650, `${engineName}: registered extras=${runtime.multi && runtime.multi.extraPassages}`, failures);
  requireCondition(pageErrors.length === 0, `${engineName}: page errors: ${pageErrors.join(' | ')}`, failures);

  await browser.close();
  return { engineName, results, runtime, consoleErrors, pageErrors, failures, pass:failures.length===0 };
}

(async () => {
  const requestBrowser = await chromium.launch();
  const requestContext = await requestBrowser.newContext();
  const source = await waitForPublishedSource(requestContext.request);
  await requestBrowser.close();

  const chromiumResult = await auditEngine(chromium, 'chromium');
  const webkitResult = await auditEngine(webkit, 'webkit');
  const report = {
    previewUrl:PREVIEW_URL,
    expectedSourceSha:EXPECTED_SHA,
    previewSource:source.trim(),
    samples,
    chromium:chromiumResult,
    webkit:webkitResult,
    finalPass:chromiumResult.pass && webkitResult.pass,
    createdAt:new Date().toISOString()
  };
  fs.writeFileSync('V11_PREVIEW_MULTI_PASSAGE_UI_AUDIT.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.finalPass) process.exit(1);
})().catch(err => {
  const report = { previewUrl:PREVIEW_URL, expectedSourceSha:EXPECTED_SHA, fatal:String(err && err.stack || err), finalPass:false, createdAt:new Date().toISOString() };
  fs.writeFileSync('V11_PREVIEW_MULTI_PASSAGE_UI_AUDIT.json', JSON.stringify(report, null, 2));
  console.error(report.fatal);
  process.exit(1);
});