/* Exact 1323 runtime regression on a real, navigable local HTTP origin.
 * No release/publication status is modified by this test.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium, firefox, webkit } = require('playwright');

(async () => {
  const target = process.env.BROWSER || 'chromium';
  const isFireEmulation = target === 'fire-emulation';
  const browserType = isFireEmulation ? chromium : { chromium, firefox, webkit }[target];
  if (!browserType) throw new Error('Unsupported browser: ' + target);
  const viewport = target === 'webkit' ? { width: 390, height: 844 } :
                   isFireEmulation ? { width: 800, height: 1280 } :
                   { width: 1280, height: 900 };
  const options = { viewport };
  if (target === 'webkit') {
    options.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1';
  }
  if (isFireEmulation) {
    options.userAgent = 'Mozilla/5.0 (Linux; U; en-US; KFTRWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/124.4.1 like Chrome Safari/535.19';
  }
  const browser = await browserType.launch({ headless: true });
  try {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', e => pageErrors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('dialog', async d => { pageErrors.push('dialog:' + d.message()); await d.dismiss(); });
    await page.addInitScript(() => {
      window.__actualPrintCalls = 0;
      window.print = () => { window.__actualPrintCalls += 1; };
    });
    const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8765/';
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() =>
      document.querySelector('#gate')?.textContent?.includes('1323実データゲート PASS'),
      null, { timeout: 120000 }
    );
    const startingStatus = await page.locator('#status').textContent();
    for (const part of ['1323', '1271', '52', '717', '237', '317', '構造 0', '親 0', '図版 0']) {
      assert.ok(startingStatus.includes(part), 'Runtime status missing ' + part + ': ' + startingStatus);
    }
    assert.match(await page.locator('#summary').textContent(), /候補 1323/);

    // Prove actual record filtering, not only the test-harness DOM.
    await page.selectOption('#kind', 'variant');
    assert.match(await page.locator('#summary').textContent(), /候補 52/);
    await page.click('#draw');
    assert.equal(await page.locator('.problem').count(), 10);
    assert.ok((await page.locator('.problem .meta').allTextContents()).every(s => s.includes('類題')));

    await page.selectOption('#kind', 'original');
    assert.match(await page.locator('#summary').textContent(), /候補 1271/);
    await page.selectOption('#book', 'Standard');
    assert.match(await page.locator('#summary').textContent(), /候補 317/);
    await page.selectOption('#order', 'source');
    await page.locator('#count').fill('20');
    await page.click('#draw');
    assert.equal(await page.locator('.problem').count(), 20);
    assert.ok((await page.locator('.problem .meta').allTextContents()).every(s => s.includes('Standard')));

    // native localStorage persistence across a fresh HTTP page navigation
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() =>
      document.querySelector('#gate')?.textContent?.includes(' PASS'),
      null, { timeout: 120000 }
    );
    assert.equal(await page.locator('#kind').inputValue(), 'original');
    assert.equal(await page.locator('#book').inputValue(), 'Standard');
    assert.equal(await page.locator('#order').inputValue(), 'source');
    assert.equal(await page.locator('#count').inputValue(), '20');
    await page.click('#draw');
    assert.equal(await page.locator('.problem').count(), 20);
    await page.click('#toggle');
    assert.equal(await page.locator('body').evaluate(e => e.classList.contains('show-answers')), true);
    await page.waitForFunction(() => [...document.querySelectorAll('#list img')].every(
      x => x.complete && x.naturalWidth > 0), null, { timeout: 60000 });

    await page.click('#printQ');
    await page.waitForFunction(() => window.__actualPrintCalls >= 1, null, { timeout: 20000 });
    assert.equal(await page.locator('body').evaluate(e => e.classList.contains('print-answers')), false);
    await page.click('#printA');
    await page.waitForFunction(() => window.__actualPrintCalls >= 2, null, { timeout: 20000 });
    assert.equal(await page.locator('body').evaluate(e => e.classList.contains('print-answers')), true);

    let a4 = 'not_applicable';
    if (target === 'chromium') {
      const buf = await page.pdf({ format: 'A4', printBackground: true });
      assert.equal(buf.subarray(0, 5).toString(), '%PDF-');
      assert.ok(buf.length > 5000);
      a4 = { bytes: buf.length, signature: 'PASS', pages: 'not_counted' };
    }
    const dimensions = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      rendered: document.querySelectorAll('.problem').length,
      images: document.querySelectorAll('#list img').length,
      unloadedImages: [...document.querySelectorAll('#list img')].filter(x=>!x.complete||!x.naturalWidth).length
    }));
    assert.ok(dimensions.scrollWidth <= dimensions.viewportWidth + 1,
              'Horizontal overflow: ' + JSON.stringify(dimensions));
    assert.equal(dimensions.unloadedImages, 0);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(consoleErrors, []);
    console.log(JSON.stringify({
      pass: true, browser: target,
      classification: isFireEmulation ? 'FIRE_SILK_EMULATION_ONLY_NOT_PHYSICAL_FIRE' :
        target === 'webkit' ? 'WEBKIT_ENGINE_IPHONE_VIEWPORT_NOT_PHYSICAL_IPHONE' :
        'DESKTOP_BROWSER_ENGINE',
      actual_records: 1323, originals: 1271, variants: 52, source: {Standard:317, '実力錬成':237, Winpass:717},
      actual_filter_and_draw: 'PASS', local_storage_reload: 'PASS',
      question_and_answer_print_hooks: 'PASS', a4, dimensions,
      pageErrors, consoleErrors,
      publication_ready: false
    }, null, 2));
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
