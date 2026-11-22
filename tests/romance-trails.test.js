'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const json=f=>JSON.parse(read(f));
const index=json('data/lessons-index.json');
const ctx={window:{},document:{currentScript:null,addEventListener(){}},console};
vm.runInNewContext(read('components.js'),ctx);
for(const [lang,start,course] of [['es',901,'spanish'],['it',1001,'italian']]){
 test(lang+': eight complete units with unique exercises and generated data',()=>{
  const source={window:{}};
  vm.runInNewContext(read('lessons_'+lang+'_data.js'),source);
  const units=source.window['LESSONS_'+lang.toUpperCase()];
  assert.equal(units.length,8);
  assert.deepEqual(Array.from(units,u=>u.id),Array.from({length:8},(_,i)=>start+i));
  assert.equal(index.filter(l=>l.lang===lang).length,8);
  for(const u of units){
   assert.equal(u.lang,lang);assert.equal(u.course,course);assert.equal(u.level,'A1');
   assert(u.objective && u.focus);
   assert.equal(u.vocab.length,10);
   assert.equal(new Set(u.vocab.map(w=>w.en)).size,10);
   assert.equal(new Set(u.vocab.map(w=>w.pt)).size,10);
   assert(u.sentences.length>=6 && u.speak.length>=4 && u.expressions.length>=3);
   assert(u.grammar.rules.length>=3 && u.grammar.table.rows.length>=4);
   assert.equal(u.quiz.length,5);
   for(const q of u.quiz){
    assert.equal(new Set(q.opts).size,4);
    assert.equal(q.opts.filter(a=>a===q.a).length,1);
    assert(q.why && q.q);
   }
   assert.deepEqual(json('data/lessons/'+u.id+'.json'),JSON.parse(JSON.stringify(u)));
   const context=json('api/aulas-contexto.json')['trilha_'+u.id];
   assert.equal(context.lang,lang);assert.equal(context.familia,'trilha_'+lang);
  }
 });
 test(lang+': audio never falls back to an English locale',()=>{
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.CapyTTS._mapLang(lang))),{bcp47:lang==='es'?'es-ES':'it-IT',apiLang:lang});
 });
}
test('number transcription accepts Spanish and Italian words or digits',()=>{
 const f=ctx.window.CapyFala;
 for(const [lang,a,b] of [
  ['es','Tengo treinta años.','Tengo 30 años.'],
  ['es','Tengo treinta y dos años.','Tengo 32 años.'],
  ['es','Necesito veintidós copias.','Necesito 22 copias.'],
  ['it','Ho trenta anni.','Ho 30 anni.'],
  ['it','Ho trent’anni.','Ho 30 anni.'],
  ['it','Ho ventotto anni.','Ho 28 anni.'],
  ['it','Ho trentadue anni.','Ho 32 anni.'],
  ['fr',"J’ai vingt-cinq ans.","J’ai 25 ans."],
  ['en',"I'm twenty five years old.","I am 25 years old."]
 ]) assert.equal(f.normalizar(a,lang),f.normalizar(b,lang),a);
});
test('catalogue and course ranges stay disjoint from existing courses',()=>{
 const c={window:{}};vm.runInNewContext(read('trail-language-catalog.js'),c);
 const chapters=new Set();
 for(const course of c.window.CapyLanguageTrails) {
  assert.equal(course.lessons.length,8);
  for(const lesson of course.lessons) assert.equal(index.find(l=>l.id===lesson.id).lang,course.lang);
  for(let i=0;i<course.blocks.length;i++){
   assert(!chapters.has(course.chapterStart+i));chapters.add(course.chapterStart+i);
  }
 }
 assert.equal(new Set(index.map(l=>l.id)).size,index.length);
 assert.equal(index.filter(l=>l.lang==='en').length,241);
 assert.equal(index.filter(l=>l.lang==='fr').length,42);
 assert.equal(index.filter(l=>l.lang==='tr').length,36);
});
test('new completion keys cannot complete lessons in another language',()=>{
 const values=new Map();
 const c={
  localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)},
  window:{location:{search:''}},document:{dispatchEvent(){}},CustomEvent:function(){},Event:function(){},
  URLSearchParams,Date,fetch:async()=>({ok:false})
 };
 vm.runInNewContext(read('store.js')+';globalThis.s=Store;',c);
 const s=c.s;
 s.completeMini(901,1,'es');
 assert(s.isMiniDone(901,1,'es'));
 assert(!s.isMiniDone(901,1,'en') && !s.isMiniDone(901,1,'it') && !s.isMiniDone(1001,1,'it'));
 s.completeMini(1001,1,'it');s.completeLesson(901,'es');
 assert(s.isMiniDone(1001,1,'it'));
 assert(s.isLessonDone(901,'es') && !s.isLessonDone(901,'en'));
 assert.equal(s.state.completedMinis.length,2);
});
