// Requires Playwright + Chrome. Usage: node scripts/test-browser-patcher.mjs URL ORIGINAL_ISO EVIDENCE_DIR [SECOND_ORIGINAL_ISO]
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, open, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const [url, original, evidence, second] = process.argv.slice(2);
if (!url || !original || !evidence) throw new Error('Supply URL, original ISO and evidence directory.');
await mkdir(evidence, { recursive: true });
const expectedSha = 'ae3d5268a3cc8777ba45e9bf00e3f3870a4cba0c1d5ee6f92ad7682cf4a95213';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1100, height: 900 } });
const page = await context.newPage();
const errors = [];
const report = { checks: [], outputs: [], requests: [] };
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => report.requests.push({ method: request.method(), url: request.url() }));
const check = name => { report.checks.push(name); console.log('PASS ' + name); };
try {
  await page.goto(url);
  await page.locator('#iso').setInputFiles({ name: 'wrong.iso', mimeType: 'application/octet-stream', buffer: Buffer.from('wrong image') });
  await page.getByRole('heading', { name: 'Choose an original USA ISO' }).waitFor();
  assert.equal(report.requests.some(r => r.url.endsWith('.xdelta')), false);
  check('wrong size rejected before downloading patch');

  await page.locator('#iso').setInputFiles(original);
  await page.locator('#cancel').click();
  await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Cancelled.'));
  assert.equal(await page.locator('#iso').isEnabled(), true);
  check('cancel restores file selection');

  for (const iso of [original, second].filter(Boolean)) {
    const start = performance.now();
    await page.locator('#iso').setInputFiles(iso);
    await page.getByRole('heading', { name: 'Your career ISO is ready' }).waitFor({ timeout: 240000 });
    await page.screenshot({ path: resolve(evidence, 'desktop-ready.png'), fullPage: true });
    const downloadPending = page.waitForEvent('download');
    await page.locator('#save-iso').click();
    const download = await downloadPending;
    assert.equal(download.suggestedFilename(), 'Gran-Turismo-PSP-Career-v1.1.iso');
    const path = await download.path();
    const hash = createHash('sha256');
    let bytes = 0;
    for await (const chunk of createReadStream(path)) { hash.update(chunk); bytes += chunk.length; }
    const sha256 = hash.digest('hex');
    assert.equal(bytes, 1137475584);
    assert.equal(sha256, expectedSha);
    report.outputs.push({ input: iso, bytes, sha256, seconds: (performance.now() - start) / 1000 });
    check('saved ISO matches release SHA-256: ' + iso);
    await page.locator('#iso').setInputFiles(path);
    await page.getByRole('heading', { name: 'This is the finished 1.1 ISO' }).waitFor({ timeout: 120000 });
    assert.equal(await page.locator('#save-iso').isVisible(), false);
    check('finished image recognised without repatching');
    // Only remove this test's temporary browser download, after hashing it.
    await unlink(path);
  }

  const badIso = resolve(evidence, 'unsupported-sparse.iso');
  const fixture = await open(badIso, 'w');
  await fixture.truncate(1097826304);
  await fixture.close();
  const before = report.requests.filter(r => r.url.endsWith('.xdelta')).length;
  await page.locator('#iso').setInputFiles(badIso);
  await page.waitForFunction(() => document.getElementById('result-text').textContent.includes('This ISO is not supported'), null, { timeout: 120000 });
  assert.equal(report.requests.filter(r => r.url.endsWith('.xdelta')).length, before);
  await unlink(badIso);
  check('unsupported CRC rejected before patch download');

  await context.route('**/patches/*.xdelta', async route => {
    const response = await route.fetch();
    const bytes = await response.body();
    bytes[bytes.length - 1] ^= 1;
    await route.fulfill({ response, body: bytes });
  });
  await page.locator('#iso').setInputFiles(original);
  await page.waitForFunction(() => document.getElementById('result-text').textContent.includes('patch download failed its check'), null, { timeout: 120000 });
  assert.equal(await page.locator('#save-iso').isVisible(), false);
  check('corrupted patch refused without producing ISO');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: resolve(evidence, 'mobile-error.png'), fullPage: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  assert.equal(report.requests.every(r => r.method === 'GET'), true);
  check('mobile layout, no page errors, no uploads');
  report.status = 'PASS';
} finally {
  await writeFile(resolve(evidence, 'desktop-tests.json'), JSON.stringify(report, null, 2) + '\n');
  await context.close();
  await browser.close();
}
