'use strict';
// Generate the complete course pages without changing the daily trail sources.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),courses=require('./romance-course-content');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
const sections=[['vocab','Palavras'],['expressions','Expressões'],['grammar','Patterns'],['dialogue','Diálogo'],['translation','Como se diz?'],['practice','Prática'],['cloze','Texto com lacunas'],['listen','Escuta'],['speak','Fala'],['homework','Lição de casa']];
function head(title,description,slug){return `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Capy Yara</title><meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)} · Capy Yara"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="https://www.capyenglish.com.br/og-cover.png?v=og2"><meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:description" content="${esc(description)}">
<link rel="canonical" href="https://www.capyenglish.com.br/${slug}.html"><link rel="icon" href="/favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{navy:'#001f3f'},fontFamily:{sans:['Plus Jakarta Sans','sans-serif']}}}}</script>
<link rel="stylesheet" href="romance-course.css?v=rc1"><script src="analytics.js?v=ga1" defer></script></head>
<body><div id="top-nav-placeholder"></div><div id="side-nav-placeholder"></div><div id="mobile-nav-placeholder"></div>`;}
const scripts=`<script src="auth-secure.js?v=rc1"></script><script src="store.js?v=rc1"></script><script src="capy-skins.js?v=skins1"></script><script src="components.js?v=esit1"></script>`;
function makeData(lang,config,i,units){
 const source=config.lessons[i],pair=units.slice(i*2,i*2+2),allSentences=[...source.dialogue.map(d=>d[1]),...(source.examples||[]),...pair.flatMap(u=>u.sentences),...pair.flatMap(u=>u.expressions.map(e=>e.example))];
 const wordIn=(text,word)=>new RegExp('(^|[^\\p{L}])'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^\\p{L}])','iu').test(text);
 const vocab=[...new Map(pair.flatMap(u=>u.vocab).map(v=>[v.en,v])).values()].map(v=>({...v,ex:allSentences.find(s=>wordIn(s,v.en))})).filter(v=>v.ex).slice(0,12);
 if(vocab.length<10)throw Error(lang+' '+i+': not enough contextual vocabulary');
 const dialogue=source.dialogue.map(([who,en,pt])=>({who,en,pt}));
 const words=dialogue.map(d=>d.en).join(' ').split(/\s+/);
 if(words.length<60)throw Error(lang+' '+i+': dialogue needs 60 words');
 const candidates=words.map((w,index)=>({w,index})).filter(({w,index})=>index>3&&index<words.length-3&&/^\p{L}{4,}$/u.test(w));
 const chosen=[];for(const c of candidates){if(chosen.length===6)break;if(!chosen.some(a=>a.w.toLowerCase()===c.w.toLowerCase())&&(!chosen.length||c.index-chosen.at(-1).index>5))chosen.push(c);}
 if(chosen.length!==6)throw Error('Not enough cloze slots');
 const blanks=new Map(chosen.map((v,i)=>[v.index,i]));
 return {id:lang+'_aula_'+String(i+1).padStart(2,'0'),number:i+1,lang,locale:config.locale,language:config.name,native:config.native,flag:config.flag,title:source.title,summary:source.summary,scene:source.scene,homework:source.homework,
  vocab,expressions:pair.flatMap(u=>u.expressions).map(e=>({expr:e.expr,pt:e.meaning,example:e.example})),
  patterns:[1,3,5,7].map(n=>({text:dialogue[n].en,pt:dialogue[n].pt})),dialogue,
  translation:dialogue.slice(0,6).map(d=>({pt:d.pt,en:d.en})),quiz:pair.flatMap(u=>u.quiz),
  build:[...pair.flatMap(u=>u.sentences),...dialogue.map(d=>d.en)].filter(s=>s.split(/\s+/).length>=4).slice(0,3),
  cloze:{tokens:words.map((w,index)=>blanks.has(index)?{slot:blanks.get(index)}:{text:w}),answers:chosen.map(c=>c.w),distractors:lang==='es'?['ayer','nunca']:['ieri','mai']},
  listen:dialogue.slice(0,6).map(d=>({en:d.en,pt:d.pt})),speak:pair.flatMap(u=>u.speak).slice(0,6),
  homeworkModels:dialogue.slice(0,3).map(d=>({en:d.en,pt:d.pt})),sections:sections.map(([key,label])=>({key,label})),
  next:i===7?null:lang+'_aula_'+String(i+2).padStart(2,'0')+'.html'};
}
function lessonPage(d){
 const tabs=sections.map(([key,label],i)=>`<button class="rc-tab" role="tab" id="tab-btn-${key}" aria-controls="tab-${key}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-tab="${key}"><span>${String(i+1).padStart(2,'0')}</span> ${label}</button>`).join('');
 const patterns=d.patterns.map((p,i)=>`<button class="rc-pattern" type="button" data-say-pattern="${i}"><span class="font-black text-navy">Exemplo ${i+1}</span><div>✅ ${esc(p.text)}</div><p>${esc(p.pt)}</p><small>Toque para ouvir</small></button>`).join('');
 return head(d.title+' · Aula '+d.number+' de '+d.language,d.summary+' Aula completa de '+d.language+' para iniciantes, com diálogo, áudio, exercícios e folha de apoio.',d.id)+`
<main class="rc-main"><header class="rc-hero"><a href="classes_${d.lang}.html">← Curso de ${d.language}</a><p class="rc-eyebrow">${d.flag} Português → ${d.native} · A1 inicial</p><h1>${esc(d.title)}</h1><p>${esc(d.summary)}</p><div class="rc-hero-foot"><span>Aula ${String(d.number).padStart(2,'0')} de 08 · Estude no seu ritmo</span><a href="learn.html?lang=${d.lang}">Praticar na trilha diária ↗</a></div><div id="course-status" role="status" aria-live="polite"></div></header>
<nav class="rc-tabs" role="tablist" aria-label="Etapas da aula">${tabs}</nav><div class="rc-content">
${sections.map(([key,label],i)=>`<div id="tab-${key}" class="rc-panel" role="tabpanel" aria-labelledby="tab-btn-${key}" tabindex="0" ${i?'hidden':''}><div class="rc-section-head"><p class="rc-eyebrow">Aula ${d.number} · Etapa ${i+1} de ${sections.length}</p><h2>${label}</h2></div>${key==='grammar'?`<p>Ouça os modelos e troque as informações para falar de você.</p><div class="rc-grid">${patterns}</div>`:''}<div id="content-${key}"></div>${key==='homework'?'<button type="button" id="course-homework-submit" class="rc-primary" onclick="submitRomanceHomework()" disabled>Entregar lição de casa · +75 XP</button>':''}</div>`).join('')}
<div id="course-finish" class="rc-finish" hidden><h2>Aula concluída!</h2><p>Seu progresso no curso foi salvo. Você ganhou 75 XP na primeira conclusão.</p><a class="rc-primary" href="${d.next||'classes_'+d.lang+'.html'}">${d.next?'Ir para a próxima aula →':'Voltar ao curso →'}</a></div>
<section class="rc-sheet" id="folha-da-aula"><h2>Folha da aula</h2><p>Uma página para imprimir, acompanhar a aula e escrever seus próprios exemplos.</p><a class="rc-secondary" href="assets/pdf/${d.id}-folha.pdf" download>Baixar folha da aula (PDF)</a></section>
</div></main>
<script>const VOCAB_DATA=${json(d.vocab)};const EXPR_DATA=${json(d.expressions)};const DIALOGUE_DATA=${json(d.dialogue)};const SPEAK_DATA=${json(d.speak)};window.ROMANCE_LESSON=${json(d)};window.SELF_STUDY=true;window.YARA_WIDGET={lang:'${d.lang}',lessonTitle:${json(d.title)},lessonNum:${d.number}};</script>
${scripts}<script src="romance-course.js?v=rc1"></script><script src="yara-widget.js?v=esit1"></script><script src="folha-da-aula.js?v=fa1" data-pdf="assets/pdf/${d.id}-folha.pdf"></script></body></html>\n`;
}
function hubPage(lang,config,lessons){
 const desc='Curso inicial de '+config.name+' com 8 aulas completas: conversas do dia a dia, áudio, exercícios, entrevista de emprego e folhas de apoio em PDF.';
 const cards=lessons.map(d=>`<article class="rc-course-row" data-lesson="${d.id}"><div class="rc-stamp">${String(d.number).padStart(2,'0')}</div><div><p class="rc-eyebrow">Aula ${d.number}</p><h2><a href="${d.id}.html">${esc(d.title)}</a></h2><p>${esc(d.summary)}</p><div class="rc-row-actions"><a href="${d.id}.html">Abrir aula →</a><a href="assets/pdf/${d.id}-folha.pdf" download>Folha em PDF ↓</a></div></div><span class="rc-row-state" aria-label="Aula ainda não concluída">A estudar</span></article>`).join('');
 return head('Curso de '+config.name+' · 8 aulas',desc,'classes_'+lang)+`<main class="rc-main"><header class="rc-hero rc-hub-hero"><div><a href="classes.html">← Todos os cursos</a><p class="rc-eyebrow">${config.flag} Português → ${config.native} · A1 inicial</p><h1>${lang==='es'?'De “hola” à sua<br>primeira conversa.':'De “ciao” à sua<br>primeira conversa.'}</h1><p>8 aulas completas para construir suas primeiras conversas: conhecer pessoas, resolver situações e se apresentar no trabalho.</p><div class="rc-hero-actions"><a id="course-continue" class="rc-primary" href="${lessons[0].id}.html">Começar o curso →</a><a class="rc-secondary" href="learn.html?lang=${lang}">Abrir trilha diária · 64 mini-lições</a></div></div><aside class="rc-passport"><p class="rc-eyebrow">Seu passaporte de conversas</p><div class="rc-passport-stamps">${lessons.map(d=>`<span data-stamp="${d.id}">${String(d.number).padStart(2,'0')}</span>`).join('')}</div><p id="hub-progress" aria-live="polite">0 de 8 aulas concluídas</p><p class="rc-small">Curso e trilha têm progressos separados. Esta é uma etapa inicial, não todo o nível A1.</p></aside></header><section class="rc-content"><div class="rc-section-head"><p class="rc-eyebrow">Uma conversa por aula</p><h2>Seu caminho em ${config.name.toLowerCase()}</h2><p>Palavras, expressões, Patterns, diálogo traduzido, escrita, escuta, fala e lição de casa. Sem pressa e sem misturar idiomas.</p></div><div class="rc-course-list">${cards}</div></section></main>
<script>window.ROMANCE_COURSE=${json({lang,lessons:lessons.map(({id,number,title})=>({id,number,title}))})};</script>${scripts}<script src="romance-course.js?v=rc1"></script>
<!-- SEO:indice-aulas --><nav class="sr-only" aria-label="Todas as aulas do curso"><h2>Todas as aulas do curso</h2><ul>${lessons.map(d=>`<li><a href="${d.id}.html">${esc(d.title)}</a></li>`).join('')}</ul></nav></body></html>\n`;
}
for(const [lang,config] of Object.entries(courses)){
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'lessons_'+lang+'_data.js'),'utf8'),sandbox);
 const units=sandbox.window['LESSONS_'+lang.toUpperCase()];
 const lessons=config.lessons.map((_,i)=>makeData(lang,config,i,units));
 for(const d of lessons)fs.writeFileSync(path.join(root,d.id+'.html'),lessonPage(d));
 fs.writeFileSync(path.join(root,'classes_'+lang+'.html'),hubPage(lang,config,lessons));
 console.log(lang+': '+lessons.length+' complete classes; '+lessons.reduce((n,l)=>n+l.vocab.length,0)+' contextual vocabulary entries; 80 authored dialogue lines');
}
const sitemapFile=path.join(root,'sitemap.xml');let sitemap=fs.readFileSync(sitemapFile,'utf8');
for(const lang of Object.keys(courses))for(const slug of ['classes_'+lang,...Array.from({length:8},(_,i)=>lang+'_aula_'+String(i+1).padStart(2,'0'))]){
 const url='https://www.capyenglish.com.br/'+slug+'.html';if(!sitemap.includes('<loc>'+url+'</loc>'))sitemap=sitemap.replace('</urlset>',`  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>`);
}
fs.writeFileSync(sitemapFile,sitemap);
