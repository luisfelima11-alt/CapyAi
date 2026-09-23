const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8772;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const RESULTS_DIR = process.env.LANDING_SCREENSHOT_DIR
  ? path.resolve(ROOT, process.env.LANDING_SCREENSHOT_DIR)
  : path.join(ROOT, 'test-results', 'landing-page', String(process.pid));
const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 720 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
];

const SESSIONS = {
  anonymous: null,
  registered: {
    id: 'landing-registered',
    name: 'Ana',
    email: 'ana@example.test',
    avatar: '🌿',
    role: 'student',
  },
  guest: {
    id: 'landing-guest',
    name: 'Visitante',
    email: '',
    avatar: '🐾',
    role: 'guest',
  },
};

function startServer() {
  const child = spawn(process.execPath, ['scripts/dev-server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  return { child, output: () => output };
}

async function waitForServer(server, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.child.exitCode !== null) {
      throw new Error(`Landing dev server exited early (${server.child.exitCode}).\n${server.output()}`);
    }
    try {
      const response = await fetch(`${BASE_URL}/landing.html`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error(`Landing dev server did not become ready on port ${PORT}.\n${server.output()}`);
}

async function stopServer(server) {
  if (!server || server.child.exitCode !== null) return;
  const exited = new Promise(resolve => server.child.once('exit', resolve));
  server.child.kill();
  await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 3_000))]);
  if (server.child.exitCode === null) server.child.kill('SIGKILL');
}

async function openLanding(browser, session, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const jsErrors = [];
  const failedLocalRequests = [];
  const badLocalResponses = [];

  page.on('pageerror', error => jsErrors.push(error.message));
  page.on('console', message => {
    if (message.type() !== 'error') return;
    const sourceUrl = message.location().url || '';
    if (/^Failed to load resource:/.test(message.text()) && sourceUrl && !sourceUrl.startsWith(BASE_URL)) return;
    jsErrors.push(message.text());
  });
  page.on('requestfailed', request => {
    if (request.url().startsWith(BASE_URL)) {
      failedLocalRequests.push(`${request.method()} ${request.url()} (${request.failure()?.errorText || 'failed'})`);
    }
  });
  page.on('response', response => {
    if (response.url().startsWith(BASE_URL) && response.status() >= 400) {
      badLocalResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.route('**/api/auth/session', async route => {
    if (!session) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, user: null, csrfToken: '' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: session, csrfToken: 'landing-test-csrf' }),
    });
  });

  const response = await page.goto(`${BASE_URL}/landing.html`, { waitUntil: 'load' });
  assert.equal(response?.status(), 200, 'landing.html should return HTTP 200');
  await page.waitForFunction(() => {
    const probe = document.querySelector('.max-w-sm');
    return probe && getComputedStyle(probe).maxWidth !== 'none';
  }, undefined, { timeout: 15_000 });
  await page.waitForFunction(() => window.Auth && window.Auth._readyPromise);
  await page.evaluate(() => window.Auth.ready());
  await page.waitForTimeout(150);
  return { context, page, jsErrors, failedLocalRequests, badLocalResponses };
}

async function assertHeaderSession(page, state) {
  const nav = page.locator('#nav-session-link');
  await nav.waitFor({ state: 'visible' });
  assert.match((await nav.textContent()).trim(), /entrar/i, `${state} header should always show Entrar`);
  assert.match(await nav.getAttribute('href'), /4_Login_Capy_Yara_Welcomes_You\.html$/, `${state} Entrar should always open login`);

  const hero = page.locator('#hero-cta');
  assert.match(await hero.getAttribute('href'), /learn\.html$/, `${state} hero CTA should navigate to learn.html`);
  if (state === 'registered') {
    assert.match((await hero.textContent()).trim(), /continuar minha trilha/i, 'registered users should see the continue CTA');
  } else {
    assert.match((await hero.textContent()).trim(), /começar de graça/i, `${state} users should see the start CTA`);
  }
}

async function assertNoOverflow(page, viewport) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    offenders: [...document.querySelectorAll('body *')].flatMap(element => {
      const rect = element.getBoundingClientRect();
      return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1
        ? [`${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.classList.length ? `.${[...element.classList].slice(0, 3).join('.')}` : ''} [${Math.round(rect.left)}, ${Math.round(rect.right)}]`]
        : [];
    }).slice(0, 8),
  }));
  assert.ok(
    dimensions.document <= dimensions.viewport + 1 && dimensions.body <= dimensions.viewport + 1,
    `${viewport.name} has horizontal overflow: ${JSON.stringify(dimensions)}`,
  );
}

async function assertAssets(page) {
  const badImages = await page.locator('img').evaluateAll(images => images
    .filter(image => !image.complete || image.naturalWidth === 0)
    .map(image => image.currentSrc || image.getAttribute('src') || image.getAttribute('alt') || '<image>'));
  assert.deepEqual(badImages, [], `all landing images should load: ${badImages.join(', ')}`);

  const badMedia = await page.locator('video, audio').evaluateAll(media => media
    .filter(item => item.getAttribute('src') && item.readyState === 0 && item.error)
    .map(item => item.currentSrc || item.getAttribute('src')));
  assert.deepEqual(badMedia, [], `landing media should not be broken: ${badMedia.join(', ')}`);
}

async function assertFragmentAndLocalLinks(page) {
  const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
  const problems = await page.locator('a[href]').evaluateAll(links => links.flatMap(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return [];
    if (href.startsWith('#')) return document.querySelector(href) ? [] : [`missing fragment ${href}`];
    return [];
  }));
  for (const href of hrefs) {
    if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    const pathname = href.split('#')[0].split('?')[0].replace(/^\/+/, '');
    if (pathname && !fs.existsSync(path.join(ROOT, pathname))) problems.push(`missing local target ${href}`);
  }
  assert.deepEqual(problems, [], problems.join(', '));
}

async function assertPricingToggle(page) {
  const toggle = page.locator('#billing-toggle');
  await toggle.waitFor({ state: 'visible' });
  const before = await page.evaluate(() => ({
    monthly: !document.querySelector('.pro-price-monthly')?.classList.contains('hidden'),
    annual: !document.querySelector('.pro-price-annual')?.classList.contains('hidden'),
    monthlyButton: !document.querySelector('#pro-btn-monthly')?.classList.contains('hidden'),
    annualButton: !document.querySelector('#pro-btn-annual')?.classList.contains('hidden'),
  }));
  assert.deepEqual(before, { monthly: true, annual: false, monthlyButton: true, annualButton: false });
  await toggle.click();
  const after = await page.evaluate(() => ({
    monthly: !document.querySelector('.pro-price-monthly')?.classList.contains('hidden'),
    annual: !document.querySelector('.pro-price-annual')?.classList.contains('hidden'),
    monthlyButton: !document.querySelector('#pro-btn-monthly')?.classList.contains('hidden'),
    annualButton: !document.querySelector('#pro-btn-annual')?.classList.contains('hidden'),
  }));
  assert.deepEqual(after, { monthly: false, annual: true, monthlyButton: false, annualButton: true });
}

async function assertFaqToggle(page) {
  const faq = page.locator('#faq');
  await faq.waitFor({ state: 'visible' });
  const details = faq.locator('details');
  if (await details.count()) {
    const first = details.first();
    const summary = first.locator('summary');
    assert.ok(await summary.count(), 'FAQ details should have a summary control');
    const wasOpen = await first.evaluate(element => element.open);
    await summary.click();
    assert.equal(await first.evaluate(element => element.open), !wasOpen, 'FAQ item should toggle open state');
    return;
  }

  const control = faq.locator('button[aria-expanded]').first();
  assert.ok(await control.count(), 'FAQ should expose a details/summary or aria-expanded button');
  const before = await control.getAttribute('aria-expanded');
  await control.click();
  assert.notEqual(await control.getAttribute('aria-expanded'), before, 'FAQ aria-expanded state should change');
}

test('landing page is responsive, interactive, asset-complete, and session-aware', { timeout: 90_000 }, async () => {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const server = startServer();
  let browser;
  try {
    await waitForServer(server);
    browser = await chromium.launch({ headless: true });

    for (const viewport of VIEWPORTS) {
      const state = await openLanding(browser, SESSIONS.anonymous, viewport);
      try {
        await state.page.locator('.reveal').evaluateAll(elements => {
          for (const element of elements) element.classList.add('visible');
        });
        await state.page.screenshot({
          path: path.join(RESULTS_DIR, `${viewport.name}.png`),
          fullPage: true,
          animations: 'disabled',
        });
        await assertHeaderSession(state.page, 'anonymous');
        await assertNoOverflow(state.page, viewport);
        await assertAssets(state.page);
        await assertFragmentAndLocalLinks(state.page);
        await assertPricingToggle(state.page);
        await assertFaqToggle(state.page);
        assert.deepEqual(state.failedLocalRequests, [], `local requests failed at ${viewport.name}`);
        assert.deepEqual(state.badLocalResponses, [], `local responses failed at ${viewport.name}`);
        assert.deepEqual(state.jsErrors, [], `JavaScript errors at ${viewport.name}: ${state.jsErrors.join('\n')}`);
        if (viewport.name === 'mobile-390') {
          await Promise.all([
            state.page.waitForURL(/4_Login_Capy_Yara_Welcomes_You\.html$/),
            state.page.locator('#nav-session-link').click(),
          ]);
          assert.match(state.page.url(), /4_Login_Capy_Yara_Welcomes_You\.html$/, 'Entrar click should reach the login page');
        }
      } finally {
        await state.context.close();
      }
    }

    for (const stateName of ['registered', 'guest']) {
      const state = await openLanding(browser, SESSIONS[stateName], VIEWPORTS[1]);
      try {
        await assertHeaderSession(state.page, stateName);
        await assertNoOverflow(state.page, VIEWPORTS[1]);
        assert.deepEqual(state.jsErrors, [], `JavaScript errors for ${stateName}: ${state.jsErrors.join('\n')}`);
      } finally {
        await state.context.close();
      }
    }
    console.log(`Landing screenshots: ${RESULTS_DIR}`);
  } finally {
    if (browser) await browser.close();
    await stopServer(server);
  }
});
