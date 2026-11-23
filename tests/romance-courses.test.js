'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
function data(html){const literal=html.match(/window\.ROMANCE_LESSON=(\{.*?\});window\.SELF_STUDY/)[1];return JSON.parse(literal);}
for(const lang of ['es','it'])test(lang+': eight complete standalone classes, exercises, PDFs and canonical Yara context',()=>{
 const hub=read('classes_'+lang+'.html');let dialogueLines=0;
 for(let n=1;n<=8;n++){
  const slug=lang+'_aula_'+String(n).padStart(2,'0'),html=read(slug+'.html'),d=data(html);
  assert.equal(d.id,slug);assert.equal(d.lang,lang);assert.equal(d.number,n);
  assert.equal(d.sections.length,10);assert.equal(new Set(d.sections.map(s=>s.key)).size,10);
  assert(d.vocab.length>=10);assert(d.vocab.every(v=>v.en&&v.pt&&v.ex));assert.equal(d.expressions.length,6);
  assert.equal(d.dialogue.length,10);dialogueLines+=d.dialogue.length;assert(d.dialogue.every(v=>v.who&&v.en&&v.pt));
  assert(d.dialogue.map(v=>v.en).join(' ').split(/\s+/).length>=60);
  assert.equal(d.quiz.length,10);for(const q of d.quiz){assert.equal(new Set(q.opts).size,4);assert(q.opts.includes(q.a));assert(q.why);}
  assert.equal(d.translation.length,6);assert.equal(d.build.length,3);assert.equal(d.speak.length,6);assert.equal(d.listen.length,6);
  assert.equal(d.cloze.answers.length,6);assert.equal(new Set(d.cloze.answers.map(w=>w.toLowerCase())).size,6);
  assert(!d.cloze.distractors.some(w=>d.cloze.answers.includes(w)));
  assert.equal(d.next,n===8?null:lang+'_aula_'+String(n+1).padStart(2,'0')+'.html');
  assert(hub.includes(slug+'.html'));assert(html.includes('learn.html?lang='+lang));
  const visible=html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,'');assert.doesNotMatch(visible,/gram[aá]tic|grammar/i);
  const pdf=fs.readFileSync(path.join(root,'assets/pdf/'+slug+'-folha.pdf'));assert.equal(pdf.subarray(0,4).toString(),'%PDF');assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1);
  const ctx=JSON.parse(read('api/aulas-contexto.json'))[slug];assert.equal(ctx.lang,lang);assert.equal(ctx.familia,lang+'_aula');assert.equal(ctx.falas.length,10);assert(ctx.palavras.length>=10);
 }
 assert.equal(dialogueLines,80);
});
test('standalone completion cannot mark a daily mini done or the other course done',()=>{
 const values=new Map(),c={localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},window:{location:{search:''}},document:{dispatchEvent(){}},CustomEvent:function(){},Event:function(){},URLSearchParams,Date,fetch:async()=>({ok:false})};
 vm.runInNewContext(read('store.js')+';globalThis.s=Store;',c);c.s.completeLesson('es_aula_01');
 assert(c.s.isLessonDone('es_aula_01'));assert(!c.s.isLessonDone('it_aula_01'));assert(!c.s.isLessonDone(901,'es'));assert(!c.s.isMiniDone(901,1,'es'));assert.equal(c.s.state.completedMinis.length,0);
});
test('all new course assets are published file types, use shared protected homework flow and no external AI in runner',()=>{
 const src=read('romance-course.js');assert(!/fetch\(/.test(src));assert(read('es_aula_01.html').includes('submitRomanceHomework()'));assert(src.includes('Store.completeLesson(L.id)'));assert(src.includes('Store.addXP(75)'));
 assert(!src.includes('innerHTML'));assert(!src.includes('completeMini('));assert(src.includes('CapyTTS?.speak(text,L.locale)'));assert(src.includes('stopAndTranscribe({lang:L.lang})'));
});
