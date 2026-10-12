// UI lifecycle regression checks; the decoder is covered by test-browser-patcher.mjs.
// Usage: node scripts/test-patcher-lifecycle.mjs URL EVIDENCE_DIR
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const [url, evidence] = process.argv.slice(2);
if (!url || !evidence) throw new Error('Supply the installer URL and evidence directory.');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { checks: [], errors: [] };
const check = name => { report.checks.push(name); console.log('PASS ' + name); };
const wrong = { name: 'wrong.iso', mimeType: 'application/octet-stream', buffer: Buffer.from('wrong image') };
try {
  const delayed = await browser.newPage();
  delayed.on('pageerror', error => report.errors.push(error.message));
  let release;
  const hold = new Promise(resolve => { release = resolve; });
  await delayed.route('**/patcher.js*', async route => { await hold; await route.continue(); });
  await delayed.goto(url, { waitUntil: 'commit' });
  await delayed.locator('#iso').waitFor();
  assert.equal(await delayed.locator('#iso').isDisabled(), true);
  check('file selection disabled until installer is ready');
  // Simulate a browser restoring FileList before the deferred listener exists.
  await delayed.locator('#iso').setInputFiles(wrong);
  release();
  await delayed.waitForLoadState('load');
  await delayed.getByRole('heading', { name: 'Choose an original USA ISO' }).waitFor();
  assert.equal(await delayed.locator('#iso').isEnabled(), true);
  check('selection restored before initialization is handled');
  await delayed.close();

  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.addInitScript(() => {
    window.testWorkers = [];
    window.Worker = class {
      constructor() { window.testWorkers.push(this); }
      postMessage(message) { this.message = message; }
      terminate() { this.stopped = true; }
    };
  });
  await page.goto(url);
  await page.evaluate(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['restored selection'], 'restored.iso'));
    document.getElementById('iso').files = transfer.files;
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await page.getByRole('heading', { name: 'Choose an original USA ISO' }).waitFor();
  check('pageshow handles a restored selection without change');
  await page.evaluate(() => {
    const transfer = new DataTransfer();
    const file = new File(['fixture'], 'fixture.iso');
    Object.defineProperty(file, 'size', { value: CAREER_PATCH.inputBytes });
    transfer.items.add(file);
    const input = document.getElementById('iso');
    input.files = transfer.files;
    // DataTransfer clones File metadata, so keep this UI fixture at supported size.
    Object.defineProperty(input.files[0], 'size', { value: CAREER_PATCH.inputBytes });
    input.dispatchEvent(new Event('change'));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    input.dispatchEvent(new Event('change'));
  });
  assert.equal(await page.evaluate(() => testWorkers.length), 1);
  assert.equal(await page.locator('#iso').isDisabled(), true);
  check('restoring an active page does not start a second worker');
  await page.evaluate(() => {
    testWorkers[0].onmessage({ data: { type: 'ready', buffer: new ArrayBuffer(8) } });
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  assert.equal(await page.evaluate(() => testWorkers.length), 1);
  assert.equal(await page.locator('#save-iso').isVisible(), true);
  check('restoring a completed page preserves its download');
  await page.locator('#iso').setInputFiles(wrong);
  await page.getByRole('heading', { name: 'Choose an original USA ISO' }).waitFor();
  assert.equal(await page.locator('#save-iso').isVisible(), false);
  check('new selection clears the previous download');
  await page.close();

  const missing = await browser.newPage();
  missing.on('pageerror', error => report.errors.push(error.message));
  await missing.route('**/patch-config.js*', route => route.abort());
  await missing.goto(url);
  await missing.getByRole('heading', { name: 'Could not finish' }).waitFor();
  assert.equal(await missing.locator('#iso').isDisabled(), true);
  assert.match(await missing.locator('#result-text').textContent(), /could not load/);
  check('failed configuration download shows recovery instructions');
  await missing.close();
  assert.deepEqual(report.errors, []);
  report.status = 'PASS';
} finally {
  await writeFile(resolve(evidence, 'lifecycle-tests.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
