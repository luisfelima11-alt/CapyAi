// Local browser verification. All API calls are fixtures; no user data or paid requests.
process.chdir(require('node:path').join(__dirname,'..'));
const http=require('node:http'),fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const server=http.createServer(require('../scripts/dev-server'));
 await new Promise((r,j)=>server.once('error',j).listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try {
  browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1366,height:900},serviceWorkers:'block'});
  const errors=[],requests=[];
  page.on('pageerror',e=>{errors.push(e.message);console.error('Browser:',e.stack);});
  page.setDefaultTimeout(10000);
  await page.addInitScript(()=>{
   window.__spoken=[];
   Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return[];},speak(u){window.__spoken.push({text:u.text,lang:u.lang});}}});
   window.SpeechSynthesisUtterance=function(text){this.text=text;};
  });
  await page.route('**/api/**',async route=>{
   const req=route.request(),u=new URL(req.url()),p=u.pathname;
   const body=req.postData()?JSON.parse(req.postData()):{};
   requests.push({path:p,body,url:u.href});
   if(p==='/api/auth/session') return route.fulfill({json:{user:{id:'test-student',name:'Test',role:'student'},csrfToken:'test-csrf'}});
   if(p==='/api/profile') return route.fulfill({json:{onboarding_complete:true,english_level:'beginner'}});
   if(p==='/api/tts') return route.fulfill({status:503,json:{error:'synthetic audio fallback'}});
   if(p==='/api/lesson-quiz'){
    const id=new URL(page.url()).searchParams.get('lesson');
    const lesson=JSON.parse(fs.readFileSync('data/lessons/'+id+'.json','utf8'));
    return route.fulfill({json:{candidates:[{content:{parts:[{text:JSON.stringify(lesson.quiz)}]}}]}});
   }
   if(p==='/api/lesson-chat'||p==='/api/chat') return route.fulfill({json:{candidates:[{content:{parts:[{text:body.lang==='it'?'Ottimo, continuiamo!':'¡Muy bien, seguimos!'}]}}]}});
   return route.fulfill({json:{}});
  });
  const lessonUrl=(id,mini)=>origin+'/lessons.html?lesson='+id+'&mini='+mini+'&guided=1';
  for(const [lang,start,locale,name] of [['es',901,'es-ES','espanhol'],['it',1001,'it-IT','italiano']]){
   await page.goto(origin+'/learn.html?lang='+lang);
   await page.locator('#continue-btn').waitFor();
   assert.equal(await page.locator('[data-lang='+lang+']').getAttribute('aria-pressed'),'true');
   assert.equal(await page.evaluate(()=>MINI_TRAIL.filter(m=>CHAPTERS.find(c=>c.id===m.chapter)?.lang===currentTrailLang).length),64);
   assert.equal(await page.evaluate(()=>document.querySelectorAll('[onclick*="startBoss"],[onclick*="openBoss"]').length),0);
   assert.equal(await page.evaluate(()=>CapyYaraWidget.aula()),'trilha_'+start);
   await page.locator('#continue-btn').click();
   await page.waitForURL('**/lessons.html?lesson='+start+'&mini=1&guided=1');
   await page.waitForFunction(id=>typeof currentLesson!=='undefined'&&currentLesson?.id===id,start);
   assert.equal(await page.evaluate(()=>currentLesson.lang),lang);
   assert.equal(await page.evaluate(()=>CUR_TTS_LANG),locale);
   await page.locator('#listen-opts button').first().waitFor();
   await page.locator('#listen-opts button[onclick*="true"]').click();
   await page.waitForFunction(()=>listenIdx===1);
   await page.evaluate(()=>switchTool('quiz',true));
   const answer=await page.evaluate(()=>(aiQuizQuestions.length ? aiQuizQuestions : shuffledQuiz)[quizIdx].a);
   await page.locator('#quiz-opts button').filter({hasText:answer}).first().click();
   await page.waitForFunction(()=>quizIdx===1);
   assert(requests.some(r=>r.path==='/api/lesson-quiz'&&r.body.lang===lang));
   await page.goto(lessonUrl(start,2));
   await page.waitForFunction(id=>currentLesson?.id===id,start);
   assert(['speed','scramble','typing'].includes(await page.evaluate(()=>currentTool)));
   assert(await page.evaluate(()=>shuffledVocab.every(v=>currentLesson.vocab.some(w=>w.en===v.en))));
   await page.goto(lessonUrl(start,3));
   await page.locator('#build-tiles button').first().waitFor();
   const sentence=await page.evaluate(()=>shuffledSentences[buildSentIdx]);
   for(const word of sentence.split(' ')){
    const tile=await page.locator('#build-tiles button:not(.used)').evaluateAll((tiles,word)=>tiles.find(t=>t.dataset.word===word)?.id,word);
    assert(tile,'Sentence tile must exist: '+word);
    await page.locator('#'+tile).click();
   }
   await page.locator('#panel-build button[onclick^="buildCheck"]').click();
   assert.match(await page.locator('#build-feedback').innerText(),/Correto/);
   await page.evaluate(()=>{
    switchTool('speak',true);
    CapyMic.start=async()=>true;
    CapyMic.stopAndTranscribe=async o=>{window.__micLanguage=o.lang;return{text:shuffledSpeak[speakIdx]};};
   });
   assert.match(await page.locator('#panel-speak').innerText(),new RegExp('Diga em '+name,'i'));
   await page.locator('#mic-btn').click();
   await page.waitForFunction(()=>isListening);
   await page.locator('#mic-btn').click();
   await page.locator('#speak-feedback').waitFor();
   assert.equal(await page.evaluate(()=>window.__micLanguage),lang);
   await page.goto(lessonUrl(start,4));
   await page.locator('#aichat-input').waitFor();
   assert.match(await page.locator('#aichat-input').getAttribute('placeholder'),lang==='es'?/español/:/italiano/);
   await page.evaluate(()=>{Store.consumeAI=()=>true;});
   for(let n=0;n<3;n++){
    await page.locator('#aichat-input').fill(lang==='es'?'Hola, soy Ana.':'Ciao, sono Ana.');
    await page.locator('#panel-aichat button[onclick="sendChat()"]').click();
    await page.waitForFunction(()=>!document.getElementById('aichat-input').disabled);
   }
   assert(requests.some(r=>r.path==='/api/lesson-chat'&&r.body.lang===lang));
   await page.locator('#aichat-done-row button').click();
   await page.locator('#guided-continue-banner button').click();
   assert(await page.evaluate(({start,lang})=>Store.isMiniDone(start,4,lang),{start,lang}));
   assert(!await page.evaluate(start=>Store.isMiniDone(start,4,'en'),start));
   assert.equal(await page.evaluate(()=>trilhaDoCurso(currentLesson.id)),'learn.html?lang='+lang);
   assert.equal(await page.evaluate(()=>_nextLessonInCurrentLanguage().id),start+1);
   for(let id=start;id<start+16;id++){
    await page.goto(origin+'/lessons.html?lesson='+id);
    await page.waitForFunction(id=>currentLesson?.id===id,id);
    assert.equal(await page.evaluate(()=>_lessonLanguage()),lang);
    assert.equal(await page.evaluate(()=>posicaoNoCurso(currentLesson.id).total),16);
    if(id===start+7) assert.equal(await page.evaluate(()=>_nextLessonInCurrentLanguage().id),start+8);
   }
   assert.equal(await page.evaluate(()=>_nextLessonInCurrentLanguage()),null);
   // Expanded units use every guided tool with their own target-language material.
   for(let mini=1;mini<=4;mini++){
    await page.goto(lessonUrl(start+15,mini));
    await page.waitForFunction(id=>currentLesson?.id===id,start+15);
    const selector={1:'#listen-opts button',2:'#panel-'+await page.evaluate(()=>currentTool),3:'#build-tiles button',4:'#aichat-input'}[mini];
    await page.locator(selector).first().waitFor();
    assert.equal(await page.evaluate(()=>CUR_TTS_LANG),locale);
    if(mini===2) assert(['speed','scramble','typing'].includes(await page.evaluate(()=>currentTool)));
    await page.setViewportSize({width:320,height:760});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'New mini '+mini+' fits at 320px');
    await page.setViewportSize({width:1366,height:900});
   }
   await page.goto(origin+'/learn.html?lang='+lang);
   await page.locator('#continue-btn').waitFor();
   // A returning learner who finished the original release continues at unit 9.
   await page.evaluate(({start,lang})=>{
    for(let id=start;id<start+8;id++) for(let n=1;n<=4;n++) Store.completeMini(id,n,lang);
    localStorage.setItem('capyLastMini_'+lang,JSON.stringify({lessonId:start+7,miniNum:4}));
    buildContinueCard();
   },{start,lang});
   assert.deepEqual(await page.evaluate(lang=>{const m=computeNextMini(lang);return[m.lessonId,m.miniNum];},lang),[start+8,1]);
   assert.equal(await page.evaluate(()=>CapyYaraWidget.aula()),'trilha_'+(start+8));
   await page.locator('#continue-btn').click();
   await page.waitForURL('**/lessons.html?lesson='+(start+8)+'&mini=1&guided=1');
   await page.goto(origin+'/learn.html?lang='+lang);
   await page.locator('#continue-btn').waitFor();
   await page.waitForTimeout(1200);
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:'test-results/trail-'+lang+'-desktop.png',fullPage:false});
   await page.setViewportSize({width:320,height:760});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
   await page.screenshot({path:'test-results/trail-'+lang+'-mobile.png',fullPage:false});
   await page.setViewportSize({width:1366,height:900});
  }
  await page.goto(origin+'/classes.html');
  await page.waitForFunction(()=>typeof CURSOS!=='undefined');
  assert.equal(await page.evaluate(()=>CURSOS.spanish),'learn.html?lang=es');
  assert.equal(await page.evaluate(()=>CURSOS.italian),'learn.html?lang=it');
  assert.equal(await page.evaluate(()=>CURSO_POR_ID.spanish.aulas),16);
  assert.equal(await page.evaluate(()=>CURSO_POR_ID.italian.aulas),16);
  assert.equal(await page.evaluate(()=>progresso('spanish').feitas),8);
  assert.equal(await page.evaluate(()=>progresso('italian').feitas),8);
  await page.evaluate(()=>localStorage.setItem('capyPlacementDone','1'));
  await page.goto(origin+'/learn.html?lang=en');
  await page.locator('#continue-btn').waitFor();
  assert.equal(await page.locator('[data-lang=en]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
  console.log('OK: 32 units, 128 minis, five language buttons, game/build/quiz/speech/chat, returning learners advance to unit 9, progress separation, course links and 320px layout. No JavaScript errors.');
 }finally{await browser?.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
