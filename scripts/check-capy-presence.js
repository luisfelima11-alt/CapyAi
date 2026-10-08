'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.TEST_BASE || 'http://localhost:8765';
(async () => {
  const browser = await chromium.launch({ headless:true });
  const output = path.join(root, 'test-results', 'presence'); fs.mkdirSync(output, { recursive:true });
  try {
    for (const width of [1280, 390, 320]) {
      const context = await browser.newContext({ viewport:{width, height:850} });
      let avatar = 'capy-astronaut'; const writes = [], errors = [];
      const user = () => ({ id:'test-student', name:'Aluno teste', role:'student', avatar });
      await context.addInitScript(u => localStorage.setItem('capySession', JSON.stringify(u)), user());
      await context.route('**/api/**', async route => {
        const req = route.request(), url = new URL(req.url());
        let body = {};
        if (url.pathname === '/api/auth/session') body = { user:user(), csrfToken:'test-csrf' };
        else if (url.pathname === '/api/account/avatar') { const data = req.postDataJSON(); writes.push(data); avatar = data.avatar; body = { ok:true, avatar }; }
        else if (url.pathname === '/api/personas') body = { personas:[{ id:'conversa', rotulo:'Yara AI', arte:'yara-quadrado-v1.jpg' }] };
        else if (url.pathname === '/api/chat') body = { reply:'Great! Tell me about your work. What do you enjoy most about your job?' };
        else if (url.pathname === '/api/db') body = {};
        await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(body) });
      });
      const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + '/ai_chat.html');
      await page.locator('#presence-caption').filter({ hasText:'Olá' }).waitFor();
      assert.equal(await page.locator('#yara-video').getAttribute('src'), null, 'no video download before interaction');
      await page.locator('#entrada').fill('I am a marketing manager.');
      await page.locator('#compositor').evaluate(form => form.requestSubmit());
      await page.locator('#presence-caption').filter({ hasText:'Great!' }).waitFor();
      assert.equal(await page.locator('#fio p[data-quem="eu"]').count(), 1);
      if (width < 768) {
        assert.equal(await page.locator('#fio').isVisible(), false);
        await page.locator('#presence-history-toggle').click();
        assert.equal(await page.locator('#fio').isVisible(), true);
        await page.screenshot({ path:path.join(output, `history-${width}.png`) });
        await page.locator('#presence-history-toggle').click();
      }
      const bounds = await page.evaluate(() => {
        const a = document.getElementById('palco').getBoundingClientRect(), b = document.getElementById('presence-caption').getBoundingClientRect();
        return {overflow:document.documentElement.scrollWidth > innerWidth, stageHeight:a.height, separate:b.top >= a.bottom};
      });
      assert.equal(bounds.overflow, false); assert.ok(bounds.stageHeight > 140); assert.ok(bounds.separate);
      await page.screenshot({ path:path.join(output, `stage-${width}.png`) });
      await page.locator('#presence-motion').click();
      assert.equal(await page.locator('#presence-motion').getAttribute('aria-pressed'), 'false');
      await page.evaluate(() => CapyPresence.setPersona('yara-avatar.png'));
      assert.equal(await page.locator('#yara-video').getAttribute('src'), null, 'no Yara clip for another character');
      await page.emulateMedia({ reducedMotion:'reduce' });
      await page.waitForFunction(() => document.getElementById('presence-motion').disabled);
      assert.equal(await page.locator('#presence-motion').isDisabled(), true);
      await page.goto(base + '/settings.html#capy-wardrobe');
      await page.locator('#avatar-grid button').first().waitFor();
      assert.equal(await page.locator('#avatar-grid button').count(), 15);
      await page.locator('#av-capy-gymbot').click();
      await page.locator('#save-btn').click();
      await page.locator('#skin-status').filter({ hasText:'Skin salva na sua conta' }).waitFor();
      assert.deepEqual(writes, [{ avatar:'capy-gymbot' }]);
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#av-capy-gymbot')?.getAttribute('aria-pressed') === 'true');
      assert.ok(await page.locator('[data-capy-avatar] [data-capy-skin="capy-gymbot"]').count());
      await page.locator('#capy-wardrobe').scrollIntoViewIfNeeded();
      await page.screenshot({ path:path.join(output, `skins-${width}.png`) });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).slice(0,8).map(el=>({tag:el.tagName,id:el.id,cls:el.className})))));
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: conversation, captions, history, persona, reduced motion, 15 skins, save/reload/header`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
