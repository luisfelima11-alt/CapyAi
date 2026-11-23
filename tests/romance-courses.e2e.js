// All API responses are fixtures. No real students, provider calls or recording.
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
process.chdir(path.join(__dirname,'..'));const {chromium}=require('playwright');
(async()=>{const server=http.createServer(require('../scripts/dev-server'));await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:900},serviceWorkers:'block'}),errors=[],requests=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error('BROWSER:',e.stack);});page.setDefaultTimeout(12000);
 await page.addInitScript(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return[];},speak(u){window.__spoken.push({text:u.text,lang:u.lang});}}});window.SpeechSynthesisUtterance=function(text){this.text=text;};});
 await page.route('**/api/**',async r=>{const url=new URL(r.request().url()),body=r.request().postData();requests.push({path:url.pathname,body:body?JSON.parse(body):null});
  if(url.pathname==='/api/auth/session')return r.fulfill({json:{user:{id:'fixture-course',name:'Teste',role:'student'},csrfToken:'fixture'}});
  if(url.pathname==='/api/profile')return r.fulfill({json:{onboarding_complete:true}});
  if(url.pathname==='/api/tts')return r.fulfill({status:503,json:{error:'synthetic fallback'}});
  return r.fulfill({json:{}});
 });
 const open=async slug=>{await page.goto(origin+'/'+slug+'.html');await page.waitForFunction(()=>window.CapyRomanceCourse);};
 const tab=async key=>{await page.locator('#tab-btn-'+key).click();await page.locator('#tab-'+key).waitFor({state:'visible'});};
 const complete=async key=>page.locator('[data-complete="'+key+'"]').click();
 for(const lang of ['es','it']){
  await page.goto(origin+'/classes_'+lang+'.html');await page.locator('#hub-progress').filter({hasText:'0 de 8'}).waitFor();assert.equal(await page.locator('.rc-course-row').count(),8);
  await page.locator('#course-continue').click();await page.waitForFunction(()=>window.CapyRomanceCourse);
  const d=await page.evaluate(()=>ROMANCE_LESSON);
  assert.equal(await page.evaluate(()=>CapyYaraWidget.aula()),lang+'_aula_01');
  await tab('homework');await page.locator('#course-homework-submit').click();assert(!(await page.locator('#course-homework-submit').isDisabled()));assert.equal(requests.filter(r=>r.path==='/api/homework'&&r.body.lessonId===d.id).length,0);await tab('vocab');
  for(const b of await page.locator('[data-word]').all())await b.click();await complete('vocab');
  assert.equal(await page.evaluate(()=>window.__spoken.at(-1).lang),d.locale);
  for(let i=0;i<5;i++)await page.locator('#content-expressions').getByRole('button',{name:'Próxima →',exact:true}).click();await complete('expressions');await complete('grammar');await complete('dialogue');
  for(let i=0;i<6;i++){await page.locator('#translation-'+i).fill(d.translation[i].en);await page.locator('#content-translation .rc-task').nth(i).getByRole('button',{name:'Conferir',exact:true}).click();}await complete('translation');
  await page.reload();await page.waitForFunction(()=>window.CapyRomanceCourse);assert.equal(await page.locator('#tab-btn-practice').getAttribute('aria-selected'),'true');assert.equal(await page.evaluate(()=>CapyRomanceCourse.done.size),5);
  for(const q of d.quiz){await page.locator('#content-practice .rc-deck').getByRole('button',{name:q.a,exact:true}).click();await page.locator('#content-practice .rc-deck').getByRole('button',{name:'Próxima pergunta →',exact:true}).click();}
  for(let i=0;i<3;i++){const box=page.locator('#content-practice .rc-task').nth(i);for(const word of d.build[i].split(/\s+/))await box.locator('.rc-actions').getByRole('button',{name:word,exact:true}).first().click();await box.getByRole('button',{name:'Conferir frase',exact:true}).click();}await complete('practice');
  for(let i=0;i<6;i++)await page.locator('#content-cloze select').nth(i).selectOption(d.cloze.answers[i]);await page.locator('#content-cloze').getByRole('button',{name:'Conferir lacunas',exact:true}).click();await complete('cloze');
  for(let i=0;i<6;i++){await page.locator('#listen-'+i).fill(i===0?'uma resposta errada':d.listen[i].en);await page.locator('#content-listen').getByRole('button',{name:'Conferir escuta',exact:true}).click();assert((await page.locator('#content-listen .rc-feedback').innerText()).includes(d.listen[i].en));await page.locator('#content-listen').getByRole('button',{name:'Próxima fala →',exact:true}).click();}await complete('listen');
  await page.evaluate(()=>{CapyMic.start=async()=>true;CapyMic.stopAndTranscribe=async o=>{window.__micLang=o.lang;return{text:ROMANCE_LESSON.speak[0]};};CapyMic.cancel=()=>{};});
  await page.locator('#content-speak').getByRole('button',{name:'Gravar minha fala',exact:true}).click();await page.locator('#content-speak').getByRole('button',{name:'Parar e conferir',exact:true}).click();assert.equal(await page.evaluate(()=>window.__micLang),lang);
  for(let i=0;i<6;i++)await page.locator('#content-speak').getByRole('button',{name:'Pratiquei em voz alta · Próxima →',exact:true}).click();await complete('speak');
  for(let i=0;i<3;i++)await page.locator('#homework-'+i).fill(d.homeworkModels[i].en);
  await page.locator('#homework-free').fill(d.dialogue.slice(0,4).map(l=>l.en).join(' '));await page.locator('#homework-read').check();
  const before=await page.evaluate(()=>Store.state.xp);await page.locator('#course-homework-submit').click();await page.locator('#course-finish').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>Store.state.xp),before+75);
  assert.equal(await page.evaluate(()=>Store.state.completedMinis.length),0);
  assert(await page.evaluate(id=>Store.isLessonDone(id),d.id));assert(!await page.evaluate(lang=>Store.isLessonDone((lang==='es'?'it':'es')+'_aula_01'),lang)||lang==='it');
  await page.waitForTimeout(100);assert.equal(requests.filter(r=>r.path==='/api/homework'&&r.body.lessonId===d.id).length,1);
  await page.reload();await page.waitForFunction(()=>window.CapyRomanceCourse);assert.equal(await page.evaluate(()=>Store.state.xp),before+75);assert(await page.locator('#course-homework-submit').isDisabled());
  await page.goto(origin+'/classes_'+lang+'.html');await page.locator('#hub-progress').filter({hasText:'1 de 8'}).waitFor();assert((await page.locator('#course-continue').getAttribute('href')).endsWith('_02.html'));
  await page.setViewportSize({width:320,height:800});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(let n=1;n<=8;n++){const slug=lang+'_aula_'+String(n).padStart(2,'0');await open(slug);for(const key of ['vocab','dialogue','cloze','homework']){await tab(key);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),slug+' '+key+' fits at 320px');}const pdf=await page.request.get(origin+'/assets/pdf/'+slug+'-folha.pdf');assert.equal(pdf.status(),200);assert((await pdf.body()).subarray(0,4).equals(Buffer.from('%PDF')));}
  await page.goto(origin+'/classes_'+lang+'.html');await page.locator('#hub-progress').filter({hasText:'1 de 8'}).waitFor();await page.waitForTimeout(500);assert(await page.locator('#more-sheet').evaluate(e=>e.getBoundingClientRect().top>=innerHeight));fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/course-'+lang+'-mobile.png',fullPage:false});await page.setViewportSize({width:1366,height:900});await page.waitForTimeout(500);await page.screenshot({path:'test-results/course-'+lang+'-desktop.png',fullPage:false});
 }
 await page.goto(origin+'/classes.html');await page.waitForFunction(()=>typeof CURSOS!=='undefined');assert.equal(await page.evaluate(()=>CURSOS.spanish),'classes_es.html');assert.equal(await page.evaluate(()=>CURSOS.italian),'classes_it.html');assert.equal(await page.evaluate(()=>progresso('spanish').feitas),1);assert.equal(await page.evaluate(()=>progresso('italian').feitas),1);
 assert.deepEqual(errors,[]);console.log('OK: 16 classes, both full learning flows, 10 sections, target audio/mic, homework delivered once, +75 XP once, course/trail separation, all 16 PDFs, 320px layout, no JS errors.');
}finally{await browser?.close();server.closeAllConnections();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
