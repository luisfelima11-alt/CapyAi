const { test, expect } = require('playwright/test');

const LOGIN_PAGE = '/4_Login_Capy_Yara_Welcomes_You.html';
const HOME_PAGE = '/6_Home_Forest_Expedition.html';

async function mockLoginApi(page, { session, status = 200, guest } = {}) {
  const calls = [];
  await page.route('**/api/**', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    calls.push({ path, method: request.method() });
    if (path === '/api/auth/session') {
      await route.fulfill({ status, json: status === 200
        ? { ok: true, user: session, csrfToken: 'mock-session-csrf' }
        : { error: 'authentication_required' } });
    } else if (path === '/api/auth/guest' && guest) {
      await route.fulfill({ status: 201, json: { ok: true, user: guest, csrfToken: 'mock-guest-csrf' } });
    } else {
      // Every API request is intercepted: these tests never mutate real auth.
      await route.fulfill({ status: 401, json: { error: 'unexpected_mock_request' } });
    }
  });
  await page.route('**/6_Home_Forest_Expedition.html', route => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><title>Mock home</title><main>Mock home</main>',
  }));
  return calls;
}

test('stale display cache waits for server verification and stays on login after 401', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('capySession', JSON.stringify({ id: 'expired-display-only', role: 'student' }));
    sessionStorage.setItem('capyCsrf', 'expired-csrf');
  });
  await mockLoginApi(page, { status: 401 });
  let releaseSession;
  const responseGate = new Promise(resolve => { releaseSession = resolve; });
  let sessionRequested;
  const requestSeen = new Promise(resolve => { sessionRequested = resolve; });
  await page.route('**/api/auth/session', async route => {
    sessionRequested();
    await responseGate;
    await route.fulfill({ status: 401, json: { error: 'authentication_required' } });
  });
  try {
    await page.goto(LOGIN_PAGE);
    await requestSeen;
    await expect(page.locator('#login-email')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(LOGIN_PAGE);
  } finally {
    releaseSession();
  }
  await page.evaluate(() => window.Auth.ready());
  await expect(page).toHaveURL(new RegExp(LOGIN_PAGE.replace(/\./g, '\\.') + '$'));
  expect(await page.evaluate(() => localStorage.getItem('capySession'))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem('capyCsrf'))).toBeNull();
});

test('server-verified registered session redirects from login to home', async ({ page }) => {
  await mockLoginApi(page, { session: { id: 'registered-user', name: 'Mock student', role: 'student' } });
  await page.goto(LOGIN_PAGE);
  await expect(page).toHaveURL(new RegExp(HOME_PAGE.replace(/\./g, '\\.') + '$'));
});

test('login waits for delayed initial session 401 and preserves the successful session', async ({ page }) => {
  await mockLoginApi(page, { status: 401 });
  let releaseSession;
  const responseGate = new Promise(resolve => { releaseSession = resolve; });
  let sessionRequested;
  const requestSeen = new Promise(resolve => { sessionRequested = resolve; });
  let initialSessionFinished = false;
  let loginPosts = 0;
  const user = { id: 'newly-verified-user', name: 'Mock student', role: 'student' };
  await page.route('**/api/auth/session', async route => {
    sessionRequested();
    await responseGate;
    initialSessionFinished = true;
    await route.fulfill({ status: 401, json: { error: 'authentication_required' } });
  });
  await page.route('**/api/auth/login', async route => {
    expect(initialSessionFinished).toBe(true);
    expect(route.request().method()).toBe('POST');
    loginPosts++;
    await route.fulfill({ status: 200, json: { ok: true, user, csrfToken: 'new-login-csrf' } });
  });
  try {
    await page.goto(LOGIN_PAGE);
    await requestSeen;
    // Call the real browser facade without the UI's delayed navigation splash.
    await page.evaluate(() => {
      window.__mockAuthPaths = [];
      const request = window.Auth._request;
      window.Auth._request = function (path, options) {
        window.__mockAuthPaths.push(path);
        return request.call(this, path, options);
      };
      window.__mockLoginPromise = window.Auth.login('mock@example.com', 'fake-test-password');
    });
    await page.evaluate(() => Promise.resolve());
    expect(await page.evaluate(() => window.__mockAuthPaths)).toEqual([]);
    expect(loginPosts).toBe(0);
  } finally {
    releaseSession();
  }
  expect(await page.evaluate(() => window.__mockLoginPromise)).toEqual({ ok: true, user });
  expect(loginPosts).toBe(1);
  expect(await page.evaluate(() => window.__mockAuthPaths)).toEqual(['/api/auth/login']);
  expect(await page.evaluate(() => window.Auth.ready())).toEqual(user);
  expect(await page.evaluate(() => window.Auth.getSession())).toEqual({ ...user, email: '', avatar: '🐾' });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('capySession')))).toEqual({ ...user, email: '', avatar: '🐾' });
  expect(await page.evaluate(() => window.Auth.getCsrfToken())).toBe('new-login-csrf');
});

test('server-verified signed guest stays on login instead of auto-redirecting', async ({ page }) => {
  const guest = { id: 'guest_a1b2c3', name: 'Explorer', role: 'guest' };
  const calls = await mockLoginApi(page, { session: guest });
  await page.goto(LOGIN_PAGE);
  await page.evaluate(() => window.Auth.ready());
  await expect(page.locator('#login-email')).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(LOGIN_PAGE);
  expect(calls.some(call => call.path === '/api/profile')).toBe(false);
});

test('continue as signed guest goes home without profile lookup or onboarding', async ({ page }) => {
  const guest = { id: 'guest_f00dcafe', name: 'Explorer', role: 'guest' };
  const calls = await mockLoginApi(page, { status: 401, guest });
  await page.goto(LOGIN_PAGE);
  await page.evaluate(() => window.Auth.ready());
  await page.getByRole('button', { name: 'Continue as Guest' }).click();
  await expect(page).toHaveURL(new RegExp(HOME_PAGE.replace(/\./g, '\\.') + '$'));
  expect(calls.filter(call => call.path === '/api/auth/guest')).toEqual([
    { path: '/api/auth/guest', method: 'POST' },
  ]);
  expect(calls.some(call => call.path === '/api/profile')).toBe(false);
  expect(page.url()).not.toContain('onboarding');
});

test('private files and traversal are unavailable', async ({ request }) => {
  for (const target of ['/database.json', '/.env', '/auth.js', '/%2e%2e/.env']) {
    const response = await request.get(target);
    expect(response.status(), target).toBe(404);
  }
});

test('legacy account dump is retired and IDOR request is unauthorized', async ({ request }) => {
  expect((await request.get('/api/db/accounts')).status()).toBe(410);
  const state = await request.get('/api/db?type=state&userId=victim');
  expect(state.status()).toBe(401);
  expect(await state.text()).not.toContain('victim');
});

test('login page uses the server-backed auth facade', async ({ page }) => {
  await page.goto('/4_Login_Capy_Yara_Welcomes_You.html');
  await expect(page.locator('#login-email')).toBeVisible();
  const hasLegacyScript = await page.locator('script[src^="auth.js"]').count();
  const hasSecureScript = await page.locator('script[src^="auth-secure.js"]').count();
  expect(hasLegacyScript).toBe(0);
  expect(hasSecureScript).toBeGreaterThan(0);
  expect(await page.locator('script:not([src])').count()).toBe(0);
  expect(await page.locator('[onclick],[onchange],[oninput],[onsubmit]').count()).toBe(0);
  expect(await page.locator('script[src*="cdn.tailwindcss.com"]').count()).toBe(0);

  await page.locator('#tab-signup').click();
  await expect(page.locator('#form-signup')).not.toHaveClass(/hidden-panel/);
  await expect(page.locator('#form-login')).toHaveClass(/hidden-panel/);
  await page.locator('#tab-login').click();
  await expect(page.locator('#form-login')).not.toHaveClass(/hidden-panel/);
  await expect(page.locator('#form-signup')).toHaveClass(/hidden-panel/);
});

test('oversized JSON returns 413', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    headers: { Origin: 'http://127.0.0.1:8765', 'Content-Type': 'application/json' },
    data: { email: 'a@example.com', password: 'x'.repeat(300 * 1024) },
  });
  expect(response.status()).toBe(413);
});
