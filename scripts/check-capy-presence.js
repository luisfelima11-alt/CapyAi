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
        else if (url.pathname === '/api/personas') body = { personas:[{ id:'conversa', rotulo:'Yara AI', arte:'yara-quadrado-v1.jpg', clipes:{ parada:'yara-parada-v1.mp4', ouvindo:'yara-ouvindo-v1.mp4' } }] };
        else if (url.pathname === '/api/chat') body = { reply:'Great! Tell me about your work. What do you enjoy most about your job?' };
        else if (url.pathname === '/api/db') body = {};
        await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(body) });
      });
      const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + '/ai_chat.html');
      // Layout "chamada de video" (8/out): a capivara ocupa a tela e as falas
      // flutuam por cima da parte de baixo (em pe) ou num painel ao lado (deitado).
      await page.locator('#fio p[data-quem="ia"]').filter({ hasText:'Oi' }).waitFor();
      assert.equal(await page.locator('#palco video[src]').count(), 0, 'no video download before interaction');
      await page.locator('#entrada').fill('I am a marketing manager.');
      await page.locator('#compositor').evaluate(form => form.requestSubmit());
      await page.locator('#fio p').filter({ hasText:'Great!' }).waitFor();
      assert.equal(await page.locator('#fio p[data-quem="eu"]').count(), 1);
      const bounds = await page.evaluate(() => {
        const q = document.querySelector('#palco .quadro').getBoundingClientRect();
        const fio = document.getElementById('fio').getBoundingClientRect();
        const chamada = document.getElementById('chamada').getBoundingClientRect();
        return { overflow:document.documentElement.scrollWidth > innerWidth, stageHeight:q.height,
          deitado:innerWidth > innerHeight, fioTop:fio.top / innerHeight, painelLivre:chamada.left >= q.right - 1 };
      });
      assert.equal(bounds.overflow, false); assert.ok(bounds.stageHeight > 140);
      if (bounds.deitado) assert.ok(bounds.painelLivre, 'conversation panel covers the capybara');
      else assert.ok(bounds.fioTop >= 0.4, 'messages start over the face: ' + bounds.fioTop);
      await page.screenshot({ path:path.join(output, `stage-${width}.png`) });
      await page.locator('#btn-movimento').click();
      assert.equal(await page.locator('#btn-movimento').getAttribute('aria-pressed'), 'false');
      await page.locator('#btn-movimento').click();
      await page.evaluate(() => CapyPresence.setPersona('yara-avatar.png'));
      assert.equal(await page.locator('#palco video[src]').count(), 0, 'no Yara clip for another character');
      assert.equal(await page.locator('#btn-movimento').isHidden(), true, 'motion button without clips');
      await page.emulateMedia({ reducedMotion:'reduce' });
      await page.evaluate(() => CapyPresence.setPersona({ arte:'yara-quadrado-v1.jpg', clipes:{ parada:'yara-parada-v1.mp4' } }));
      await page.waitForFunction(() => document.getElementById('btn-movimento').hidden);
      assert.equal(await page.locator('#palco video[src]').count(), 0, 'reduced motion still downloads video');
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
      console.log(`PASS ${width}px: conversation, video-call layout, persona, motion button, reduced motion, 15 skins, save/reload/header`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
