// Run with: node tests/stories.e2e.js (requires installed Playwright and Chromium).
process.chdir(require('node:path').join(__dirname, '..'));
const http = require('node:http'), assert = require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm');
const { chromium } = require('playwright');
(async () => {
 const baseData=fs.readFileSync('stories-data.js','utf8'), extra=fs.readFileSync('stories-extended.js','utf8');
 const agro=fs.readFileSync('stories-agro.js','utf8');
 const stories=vm.runInNewContext(baseData+extra+agro+'; STORIES');
 assert.equal(stories.length,6);
 const farmStory=stories.find(s=>s.id==='antes-da-chuva');
 assert.equal(farmStory.pages.length,8);
 assert.equal(farmStory.vocabulary.flat().length,40);
 assert(farmStory.pages.map(p=>p[1]).join(' ').split(/\s+/).length>1000);
 for (const page of farmStory.vocabulary) {
  assert.equal(page.length,5);
  for (const entry of page) assert(entry.length===3 && entry.every(s=>typeof s==='string' && s.trim()));
 }
 for (const s of stories) for (const p of s.pages) assert(p.length===5 && p.every(x=>x.trim()));
 console.log('Words:',stories.map(s=>[s.id,s.pages.length,s.pages.map(p=>p[1]).join(' ').match(/[a-z]+(?:['-][a-z]+)*/gi).length]));
 const server=http.createServer(require('../scripts/dev-server'));
 await new Promise((r,j)=>server.once('error',j).listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try {
  browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:950},serviceWorkers:'block'});
  const errors=[], requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*', async r=>{
   const u=new URL(r.request().url());
   if(u.origin!==origin) return r.abort();
   if(u.pathname==='/api/auth/session') {
    await new Promise(resolve=>setTimeout(resolve,100));
    return r.fulfill({json:{user:{id:'test-user',name:'Test',role:'student'},csrfToken:'test-csrf'}});
   }
   if(u.pathname!=='/api/translate') return r.continue();
   assert.equal(r.request().headers()['x-csrf-token'],'test-csrf');
   const req=r.request().postDataJSON();
   requests.push(req);
   if(req.word==='reached') await new Promise(resolve=>setTimeout(resolve,180));
   const tr=({train:'trem',reached:'chegou',wilted:'murchas',last:'ultima',yield:'produtividade'})[req.word] || 'traduzida';
   return r.fulfill({json:{candidates:[{content:{parts:[{text:JSON.stringify({translation:tr})}]}}]}});
  });
  const goto=(id,l='en',p=1)=>page.goto(origin+'/historias.html'+(id?'?historia='+id+'&idioma='+l+'&pagina='+p:''));
  await goto();
  assert.equal(await page.locator('.book').count(),6);
  assert.match(await page.locator('.book').first().innerText(),/Agro.*B1–B2.*8 páginas/);
  await page.locator('.book[href*="historia=ultima-parada"]').click();
  await page.waitForURL('**/historias.html?historia=ultima-parada&idioma=en&pagina=1');
  await page.locator('#page-text > p').first().waitFor();
  const words=page.locator('#page-text .capy-t-word'), tip=page.locator('#capy-translate-tooltip');
  assert.equal(await page.locator('#page-text > p').count(),3);
  assert.equal(await page.locator('#story-vocabulary').isVisible(),false);
  await words.nth(2).click();
  await tip.getByText('trem',{exact:true}).waitFor();
  assert.equal(requests[0].word,'train');
  assert.match(requests[0].context,/^English: When the train reached/);
  await page.keyboard.press('Escape');
  assert.equal(await tip.isVisible(),false);
  await words.first().focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator(':focus').innerText(),'the');
  await page.keyboard.press('Enter');
  await tip.getByText('traduzida',{exact:true}).waitFor();
  await words.nth(3).click();
  await words.nth(5).click();
  await tip.getByText('ultima',{exact:true}).waitFor();
  await new Promise(r=>setTimeout(r,240));
  assert.equal(await tip.locator('p').last().innerText(),'ultima');
  await page.keyboard.press('Escape');
  await page.screenshot({path:'test-results/stories-b1-desktop.png',fullPage:true});
  await page.locator('#next-page').click();
  await page.locator('#story-language').selectOption('fr');
  await page.waitForURL('**/historias.html?historia=ultima-parada&idioma=fr&pagina=2');
  assert.equal(await page.locator('#page-text').getAttribute('lang'),'fr');
  await page.locator('#page-text .capy-t-word').first().click();
  await tip.getByText('traduzida',{exact:true}).waitFor();
  assert.match(requests.at(-1).context,/^French:/);
  await page.locator('#translation summary').click();
  assert.equal(await page.locator('#translation-text > p').count(),3);
  assert.equal(await page.locator('#translation-text > p').first().isVisible(),true);
  await page.locator('#story-language').selectOption('tr');
  await page.waitForURL('**/historias.html?historia=ultima-parada&idioma=tr&pagina=2');
  assert.equal(await page.locator('#page-text').getAttribute('lang'),'tr');
  await page.locator('#story-language').selectOption('pt');
  await page.waitForURL('**/historias.html?historia=ultima-parada&idioma=pt&pagina=2');
  assert.equal(await page.locator('#word-help').isVisible(),false);
  assert.equal(await words.count(),0);
  for (const s of stories) for(let i=1;i<=s.pages.length;i++) {
   await goto(s.id,'en',i);
   assert.equal(await page.locator('#page-number').innerText(),'Página '+i+' de '+s.pages.length);
   const dim=await page.locator('#story-image').evaluate(async el=>{await el.decode();return el.naturalWidth});
   assert.equal(dim,900);
   assert(await words.count()>0);
   assert.equal(await page.locator('#story-vocabulary').isVisible(),s.id==='antes-da-chuva');
  }
  await goto('antes-da-chuva','en',2);
  await page.locator('#vocabulary-heading').click();
  assert.equal(await page.locator('#vocabulary-list dt').count(),5);
  assert.equal(await page.locator('#vocabulary-list dt').first().innerText(),'crop yield');
  await page.locator('#page-text [data-word=yield]').first().click();
  await tip.getByText('produtividade',{exact:true}).waitFor();
  await page.keyboard.press('Escape');
  await page.screenshot({path:'test-results/stories-agro-desktop.png',fullPage:true});
  await page.evaluate(()=>window.scrollTo(0,600));
  const artTop=await page.locator('#story-image').evaluate(el=>el.getBoundingClientRect().top);
  assert(Math.abs(artTop-16)<2,'Long-read art should stay visible while reading on desktop');
  await page.locator('#story-language').selectOption('fr');
  await page.waitForURL('**/historias.html?historia=antes-da-chuva&idioma=fr&pagina=2');
  assert.equal(await page.locator('#story-vocabulary').isVisible(),false);
  assert.equal(await page.locator('#page-text').getAttribute('lang'),'fr');
  await page.setViewportSize({width:320,height:760});
  await goto('antes-da-chuva','en',6);
  await page.locator('#vocabulary-heading').click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  assert.match(await page.locator('#vocabulary-list').innerText(),/peso bruto/);
  await page.screenshot({path:'test-results/stories-agro-mobile.png',fullPage:true});
  await goto('jardim-no-telhado');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  await page.locator('[data-word=wilted]').click();
  await tip.getByText('murchas',{exact:true}).waitFor();
  const rect=await tip.boundingBox();
  assert(rect.x>=0&&rect.x+rect.width<=320);
  await page.screenshot({path:'test-results/stories-b2-mobile.png',fullPage:true});

  // Failed API responses must never become a cached translation.
  await page.route('**/api/translate', r=>r.fulfill({status:503,json:{error:'unavailable'}}));
  await goto('ultima-parada');
  await page.locator('[data-word=maya]').first().click();
  await tip.getByText('⚠️ Tradução indisponível',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-word=maya]').first().evaluate(el=>el.classList.contains('capy-t-learned')),false);
  // One paragraph retains the exact source text, including punctuation.
  assert.equal(await page.locator('#page-text > p').first().textContent(),stories.find(s=>s.id==='ultima-parada').pages[0][1].split('\n\n')[0]);

  assert.equal(errors.length,0,errors.join('\n'));
  console.log('Browser OK: 6 stories, 32 illustrations, 40 agro vocabulary entries, four languages, contextual click, keyboard, rapid clicks, and 320px viewport.');
 } finally {await browser?.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
