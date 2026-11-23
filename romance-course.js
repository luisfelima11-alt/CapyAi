/* Complete Spanish/Italian courses. Daily mini IDs are never used for progress. */
(async function(){
 'use strict';
 const el=(tag,cls,text,parent)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;if(parent)parent.append(n);return n;};
 const btn=(text,fn,parent,cls='rc-secondary')=>{const b=el('button',cls,text,parent);b.type='button';b.addEventListener('click',fn);return b;};
 const feedback=(parent)=>{const n=el('p','rc-feedback','',parent);n.hidden=true;n.setAttribute('role','status');return (text,ok)=>{n.hidden=false;n.className='rc-feedback '+(ok===true?'ok':ok===false?'error':'');n.textContent=text;};};
 const shuffled=xs=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const mountNav=()=>{for(const [id,render] of [['top-nav-placeholder','renderTopNav'],['side-nav-placeholder','renderSideNav'],['mobile-nav-placeholder','renderMobileNav']])Components.mount(id,Components[render]('classes'));};
 mountNav();
 try{await window.Auth?.ready();await Store._mergeEmCurso;}catch(e){/* offline: local progress remains available */}
 const course=window.ROMANCE_COURSE,L=window.ROMANCE_LESSON;
 if(course){
  const refresh=()=>{const done=course.lessons.filter(l=>Store.isLessonDone(l.id));
   document.getElementById('hub-progress').textContent=done.length+' de 8 aulas concluídas';
   for(const l of course.lessons){const yes=Store.isLessonDone(l.id),row=document.querySelector('[data-lesson="'+l.id+'"]');row.dataset.done=String(yes);row.querySelector('.rc-row-state').textContent=yes?'Concluída ✓':'A estudar';row.querySelector('.rc-row-state').setAttribute('aria-label',yes?'Aula concluída':'Aula ainda não concluída');document.querySelector('[data-stamp="'+l.id+'"]').classList.toggle('done',yes);}
   const next=course.lessons.find(l=>!Store.isLessonDone(l.id)),a=document.getElementById('course-continue');a.href=next?next.id+'.html':'learn.html?lang='+course.lang;a.textContent=next?(done.length?'Continuar na aula '+next.number+' →':'Começar o curso →'):'Praticar na trilha diária →';
  };refresh();document.addEventListener('stateChanged',refresh);return;
 }
 if(!L)return;
 const key='capyCourse_v1_'+(window.Auth?.getSession()?.id||'guest')+'_'+L.id;
 let saved={done:[],tab:'vocab',drafts:{}};
 try{const raw=JSON.parse(localStorage.getItem(key)||'null');if(raw&&typeof raw==='object')saved={...saved,...raw};}catch(e){}
 const keys=L.sections.map(s=>s.key),done=new Set(Array.isArray(saved.done)?saved.done.filter(k=>keys.includes(k)):[]);
 if(Store.isLessonDone(L.id))keys.forEach(k=>done.add(k));
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify({...saved,done:[...done]}));}catch(e){}};
 const say=text=>window.CapyTTS?.speak(text,L.locale);
 const normal=text=>window.CapyFala.normalizar(text,L.lang);
 const same=(a,b)=>normal(a)===normal(b);
 let recording=false,transcribing=false,speechIndex=0;
 function stopOnLeave(){if(recording){window.CapyMic?.cancel();recording=false;}window.CapyTTS?._stop();}
 function selectTab(key,focus=false){if(!keys.includes(key))key='vocab';if(saved.tab!==key)stopOnLeave();saved.tab=key;persist();
  for(const k of keys){const active=k===key,t=document.getElementById('tab-btn-'+k);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById('tab-'+k).hidden=!active;}
  if(focus){document.getElementById('tab-btn-'+key).focus();document.getElementById('tab-btn-'+key).scrollIntoView({block:'nearest',inline:'nearest'});}
 }
 function update(){
  for(const k of keys)document.getElementById('tab-btn-'+k).dataset.done=String(done.has(k));
  const status=document.getElementById('course-status');status.textContent=done.size+' de '+keys.length+' etapas concluídas · Retomada salva neste aparelho';
  if(done.size===keys.length){
   if(!Store.isLessonDone(L.id)){Store.completeLesson(L.id);Store.addXP(75);Store.activateStreak();document.dispatchEvent(new CustomEvent('lessonComplete',{detail:{lessonId:L.id,language:L.lang}}));}
   document.getElementById('course-finish').hidden=false;
  }
 }
 function mark(k){done.add(k);persist();update();}
 function completeButton(k,parent,text='Concluir esta etapa →'){const b=btn(text,()=>{mark(k);const next=keys[keys.indexOf(k)+1];if(next)selectTab(next,true);},parent,'rc-primary');b.dataset.complete=k;return b;}
 for(const k of keys){const tab=document.getElementById('tab-btn-'+k);tab.addEventListener('click',()=>selectTab(k));tab.addEventListener('keydown',e=>{let i=keys.indexOf(k);if(e.key==='ArrowRight')i=(i+1)%keys.length;else if(e.key==='ArrowLeft')i=(i+keys.length-1)%keys.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=keys.length-1;else return;e.preventDefault();selectTab(keys[i],true);});}
 const field=(parent,id,label,multiline=false)=>{el('label','',label,parent).htmlFor=id;const input=el(multiline?'textarea':'input','rc-input',undefined,parent);input.id=id;if(!multiline)input.type='text';else input.rows=3;input.autocomplete='off';input.lang=L.lang;input.spellcheck=false;input.value=saved.drafts?.[id]||'';input.addEventListener('input',()=>{saved.drafts||={};saved.drafts[id]=input.value.slice(0,4000);persist();});return input;};
 // Vocabulary: explicit reveal/review, no flip-card text hidden from assistive tech.
 const vocab=document.getElementById('content-vocab'),grid=el('div','rc-grid',undefined,vocab),seen=new Set(),vocabHint=feedback(vocab);
 const vocabFinish=completeButton('vocab',vocab);vocabFinish.disabled=!done.has('vocab');
 L.vocab.forEach((v,i)=>{const b=btn('',()=>{say(v.en);seen.add(i);b.setAttribute('aria-pressed','true');vocabHint(seen.size+' de '+L.vocab.length+' palavras revisadas.');vocabFinish.disabled=seen.size!==L.vocab.length;},grid,'rc-word');b.dataset.word=i;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Ouvir e revisar '+v.en);el('span','rc-progress','OUVIR E REVISAR',b);el('strong','',v.en,b);el('p','',v.pt,b);el('small','',v.ex,b);});
 // Expressions: one useful chunk at a time, with translation and a real example.
 const expressionRoot=document.getElementById('content-expressions');let expressionIndex=0;const expressionSeen=new Set();
 const expressionFinish=completeButton('expressions',expressionRoot);expressionFinish.disabled=!done.has('expressions');
 const expressionDeck=el('div','rc-deck',undefined);expressionRoot.prepend(expressionDeck);
 function renderExpression(){expressionSeen.add(expressionIndex);expressionDeck.replaceChildren();const e=L.expressions[expressionIndex];el('p','rc-progress',(expressionIndex+1)+' / '+L.expressions.length,expressionDeck);el('h3','',e.expr,expressionDeck);el('p','',e.pt,expressionDeck);el('p','',e.example,expressionDeck);const actions=el('div','rc-actions',undefined,expressionDeck);btn('Ouvir',()=>say(e.example),actions);const prev=btn('← Anterior',()=>{expressionIndex--;renderExpression();},actions);prev.disabled=expressionIndex===0;const next=btn('Próxima →',()=>{expressionIndex++;renderExpression();},actions);next.disabled=expressionIndex===L.expressions.length-1;expressionFinish.disabled=expressionSeen.size!==L.expressions.length;}
 renderExpression();
 document.querySelectorAll('[data-say-pattern]').forEach(b=>b.addEventListener('click',()=>say(L.patterns[Number(b.dataset.sayPattern)].text)));
 completeButton('grammar',document.getElementById('content-grammar'),'Entendi os exemplos →');
 const dialogue=document.getElementById('content-dialogue');el('p','rc-feedback',L.scene,dialogue);
 for(const line of L.dialogue){const box=el('article','rc-dialogue-line',undefined,dialogue);el('strong','',line.who,box);el('p','',line.en,box).lang=L.lang;btn('Ouvir esta fala',()=>say(line.en),box);const d=el('details','',undefined,box);el('summary','','Ver tradução',d);el('p','',line.pt,d);}
 completeButton('dialogue',dialogue,'Li e pratiquei o diálogo →');
 // Translation: show the model for both correct and incorrect answers.
 const translation=document.getElementById('content-translation'),translationAttempted=new Set();
 el('p','','Escreva no idioma do curso. A conferência compara com o modelo; outra formulação correta pode ser diferente dele.',translation);
 const translationFinish=completeButton('translation',translation);translationFinish.disabled=!done.has('translation');
 L.translation.forEach((q,i)=>{const box=el('div','rc-task',undefined,translation),input=field(box,'translation-'+i,(i+1)+'. '+q.pt),out=feedback(box);btn('Conferir',()=>{if(!input.value.trim()){out('Escreva sua tentativa antes de conferir.',false);return;}const ok=same(input.value,q.en);out((ok?'Correto! Modelo: ':'Compare com o modelo: ')+q.en,ok);translationAttempted.add(i);translationFinish.disabled=translationAttempted.size!==L.translation.length;},box);});
 // Quiz + sentence ordering. Answers and explanations remain visible until the next tap.
 const practice=document.getElementById('content-practice'),quizBox=el('div','rc-deck',undefined,practice);let qi=0,score=0,quizPassed=done.has('practice');
 const buildSolved=new Set(),practiceFinish=completeButton('practice',practice);practiceFinish.disabled=!done.has('practice');
 const refreshPractice=()=>{practiceFinish.disabled=!(quizPassed&&buildSolved.size===L.build.length);};
 function renderQuiz(){quizBox.replaceChildren();if(qi===L.quiz.length){el('h3','',score+' de '+L.quiz.length+' acertos',quizBox);quizPassed=score>=7;el('p','',quizPassed?'Quiz concluído. Agora monte as três frases abaixo.':'Revise os exemplos e tente novamente. A meta é pelo menos 7 acertos.',quizBox);btn('Refazer quiz',()=>{qi=0;score=0;quizPassed=false;refreshPractice();renderQuiz();},quizBox);refreshPractice();return;}
  const q=L.quiz[qi];el('p','rc-progress','Pergunta '+(qi+1)+' de '+L.quiz.length,quizBox);el('h3','',q.q,quizBox);const options=el('div','',undefined,quizBox),out=feedback(quizBox);const next=btn('Próxima pergunta →',()=>{qi++;renderQuiz();},quizBox,'rc-primary');next.hidden=true;
  for(const text of shuffled(q.opts))btn(text,()=>{const ok=text===q.a;if(ok)score++;for(const b of options.querySelectorAll('button'))b.disabled=true;out((ok?'Correto! ':'A resposta é: '+q.a+'. ')+q.why,ok);next.hidden=false;},options,'rc-option');
 }
 renderQuiz();el('h3','rc-section-head','Monte as frases',practice);
 L.build.forEach((sentence,i)=>{const task=el('div','rc-task',undefined,practice);el('p','',String(i+1)+'. Toque nas palavras para montar a frase; toque em uma palavra montada para devolvê-la.',task);const answer=el('div','rc-answer-bank',undefined,task),bank=el('div','rc-actions',undefined,task),out=feedback(task);answer.setAttribute('aria-label','Sua frase '+(i+1));const words=sentence.split(/\s+/).map((w,id)=>({w,id}));let chosen=[];
  function draw(){answer.replaceChildren();bank.replaceChildren();for(const x of chosen)btn(x.w,()=>{chosen=chosen.filter(v=>v.id!==x.id);draw();},answer,'rc-tile');for(const x of shuffled(words.filter(v=>!chosen.some(c=>c.id===v.id))))btn(x.w,()=>{chosen.push(x);draw();},bank,'rc-tile');}
  draw();btn('Conferir frase',()=>{const ok=same(chosen.map(x=>x.w).join(' '),sentence);out((ok?'Correto! ':'Compare com a frase: ')+sentence,ok);if(ok){buildSolved.add(i);refreshPractice();}},task);
 });
 // Cloze: six meaningful words from the authored dialogue; two distractors.
 const cloze=document.getElementById('content-cloze');el('p','','Complete a conversa com as palavras da caixa. Há duas palavras extras.',cloze);el('p','rc-feedback',shuffled([...L.cloze.answers,...L.cloze.distractors]).join(' · '),cloze);const paragraph=el('p','rc-cloze',undefined,cloze),selects=[];
 for(const token of L.cloze.tokens){if(token.slot===undefined)paragraph.append(document.createTextNode(token.text+' '));else{const select=el('select','',undefined,paragraph);select.setAttribute('aria-label','Lacuna '+(token.slot+1));el('option','','Escolher…',select).value='';for(const word of shuffled([...L.cloze.answers,...L.cloze.distractors]))el('option','',word,select).value=word;selects[token.slot]=select;paragraph.append(document.createTextNode(' '));}}
 const clozeOut=feedback(cloze),clozeFinish=completeButton('cloze',cloze);clozeFinish.disabled=!done.has('cloze');btn('Conferir lacunas',()=>{if(selects.some(s=>!s.value)){clozeOut('Preencha todas as seis lacunas antes de conferir.',false);return;}const hits=selects.filter((s,i)=>s.value===L.cloze.answers[i]).length;clozeOut(hits+' de 6 acertos. Respostas: '+L.cloze.answers.map((w,i)=>(i+1)+'. '+w).join(' · '),hits===6);clozeFinish.disabled=false;},cloze);
 // Listening: do not display the target until the student answers or requests it.
 const listen=document.getElementById('content-listen');let li=0;
 function renderListen(){listen.replaceChildren();if(li===L.listen.length){el('p','rc-feedback','Você praticou as seis falas. Volte ao diálogo para ouvi-las no contexto.',listen);completeButton('listen',listen);return;}const q=L.listen[li];el('p','rc-progress','Fala '+(li+1)+' de '+L.listen.length,listen);btn('Ouvir frase',()=>say(q.en),listen,'rc-primary');const input=field(listen,'listen-'+li,'Escreva o que você ouviu'),out=feedback(listen);const next=btn('Próxima fala →',()=>{li++;renderListen();},listen);next.hidden=true;
  const reveal=()=>{out('Você ouviu: '+q.en+' — '+q.pt);next.hidden=false;};btn('Conferir escuta',()=>{if(!input.value.trim()){out('Escreva sua tentativa ou use “Ver o modelo”.',false);return;}out((same(input.value,q.en)?'Correto! Você ouviu: ':'Compare: você ouviu ')+q.en+' — '+q.pt,same(input.value,q.en));next.hidden=false;},listen);btn('Não consegui ouvir · Ver o modelo',reveal,listen);
 }
 renderListen();
 // Speech: transcription measures recognized words, never a pretend accent score.
 const speak=document.getElementById('content-speak');
 function renderSpeak(){speak.replaceChildren();if(speechIndex===L.speak.length){el('p','rc-feedback','Prática de fala concluída. A transcrição não mede seu sotaque; ela mostra as palavras reconhecidas.',speak);completeButton('speak',speak);return;}
  const text=L.speak[speechIndex];el('p','rc-progress','Frase '+(speechIndex+1)+' de '+L.speak.length,speak);el('h3','',text,speak);btn('Ouvir modelo',()=>say(text),speak);const out=feedback(speak);let mic;
  const transcribe=async()=>{if(transcribing)return;transcribing=true;recording=false;mic.disabled=true;mic.textContent='Transcrevendo…';try{const result=await CapyMic.stopAndTranscribe({lang:L.lang});const heard=result?.text||'';if(heard){const pct=CapyFala.acerto(text,heard,L.lang).pct;out('Reconhecido: '+heard+' · '+pct+'% das palavras do modelo. Isto não é uma nota de sotaque.',pct>=80);}else out('Não recebemos uma transcrição. Tente novamente ou pratique sem gravar.',false);}catch(e){out('Não foi possível transcrever. Confira a permissão do microfone e tente novamente, ou pratique sem gravar.',false);}finally{transcribing=false;mic.disabled=false;mic.textContent='Gravar minha fala';}};
  mic=btn('Gravar minha fala',async()=>{if(recording){await transcribe();return;}try{window.CapyTTS?._stop();const ok=await CapyMic.start({onAutoStop:transcribe,onError:()=>out('Microfone indisponível. Permita o acesso no navegador ou pratique sem gravar.',false)});if(ok!==false){recording=true;mic.textContent='Parar e conferir';}else out('Microfone indisponível. Permita o acesso no navegador ou pratique sem gravar.',false);}catch(e){out('Microfone indisponível. Permita o acesso no navegador ou pratique sem gravar.',false);}},speak,'rc-primary');
  btn('Pratiquei em voz alta · Próxima →',()=>{stopOnLeave();speechIndex++;renderSpeak();},speak);el('p','rc-small','Você também pode praticar sem gravar. Nesse caso, esta etapa é uma marcação sua, sem avaliação automática.',speak);
 }
 renderSpeak();
 // Homework: three constrained translations and one personalized writing task.
 const homework=document.getElementById('content-homework');el('p','','Faça depois de estudar: 1) reescreva três falas; 2) confira os modelos; 3) crie seu texto; 4) leia seu texto em voz alta antes de entregar.',homework);
 const hwFields=L.homeworkModels.map((q,i)=>field(el('div','rc-task',undefined,homework),'homework-'+i,(i+1)+'. '+q.pt));
 const hwFree=field(el('div','rc-task',undefined,homework),'homework-free','4. '+L.homework+' Escreva pelo menos 15 palavras.',true);hwFree.dataset.selfStudyReady='1';
 const hwRead=el('label','rc-actions',undefined,homework),check=el('input','',undefined,hwRead);check.type='checkbox';check.id='homework-read';hwRead.append(document.createTextNode('Li meu texto em voz alta.'));
 const hwOut=feedback(homework),submit=document.getElementById('course-homework-submit');submit.disabled=done.has('homework');if(submit.disabled)submit.textContent='Lição de casa já entregue ✓';
 function submitRomanceHomework(){
  if(done.has('homework'))return;
  const remaining=keys.filter(k=>k!=='homework'&&!done.has(k));if(remaining.length){hwOut('Conclua as outras etapas antes de entregar: '+remaining.map(k=>L.sections.find(s=>s.key===k).label).join(', ')+'.',false);return;}
  const mistakes=hwFields.map((f,i)=>same(f.value,L.homeworkModels[i].en)?null:(i+1)+'. '+L.homeworkModels[i].en).filter(Boolean);if(mistakes.length){hwOut('Revise as três falas com os modelos: '+mistakes.join(' | '),false);return;}
  if(hwFree.value.trim().split(/\s+/).filter(Boolean).length<15||!check.checked){hwOut('Escreva pelo menos 15 palavras no seu texto e marque que o leu em voz alta.',false);return;}
  submit.disabled=true;submit.textContent='Lição de casa entregue ✓';mark('homework');hwOut('Aula concluída! +75 XP na primeira conclusão. A confirmação de envio ao professor aparece abaixo.',true);
 }
 window.submitRomanceHomework=submitRomanceHomework;
 // No custom /api/homework request: the existing components.js hook handles
 // session/CSRF, retries and guest guidance exactly once after a valid submit.
 window.addEventListener('pagehide',stopOnLeave);
 window.CapyRomanceCourse={lesson:L,done,selectTab};
 selectTab(saved.tab);update();
})();
