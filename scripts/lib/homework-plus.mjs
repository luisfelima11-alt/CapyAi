// Homework das aulas do GPS Tronic e do Agro English (07/nov/2026).
//
// Usado pelos dois geradores (build-gpstronic-aula.mjs e build-agro-aula.mjs),
// ANTES da troca de identificadores: aqui tudo ainda fala a língua do molde
// (gps9, Gps9, GPS9), e o gerador troca para o sufixo da aula depois.
//
// Faz duas coisas:
//  1. Conserta textos que vinham fixos do molde (aula 09) em todas as aulas: a
//     tarefa de escrita pedia "5 passos para o cliente reiniciar o monitor" e a
//     Parte 2 do treino falava em "imperativo", fosse qual fosse o tema.
//  2. Nas aulas com o homework novo (conteudo.json → homework.completar etc.),
//     o homework passa de 4 para 8 tarefas (uns 20 minutos): completar frases,
//     compreensão do diálogo, gravação de voz e frase livre, desenhadas pelo
//     homework-plus.js, e a escrita guiada no fim. Ao entregar, o placar de
//     cada tarefa vai junto para o professor (campo "placar") e o aluno ganha
//     um card para compartilhar.
import fs from 'node:fs';
import path from 'node:path';

const j = v => JSON.stringify(v);
// JSON dentro de <script>: nada de "</script>" nem "<!--" vindo do conteúdo.
const jsonNoScript = v => JSON.stringify(v).replace(/</g, '\\u003c');
const escHtml = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

function trocar(t, de, para, rotulo) {
    if (!t.includes(de)) throw new Error(`homework-plus: não achei ${rotulo} no molde`);
    return t.split(de).join(para);
}

// O cartão da tarefa de escrita no molde: do cartão "4" até o fim do botão de entrega.
const INICIO_ESCRITA = '  <div class="bg-white border-2 border-emerald-200 rounded-2xl p-5 mb-6">';
const FIM_ESCRITA = '      🚀 Entregar Homework (+75 XP)\n    </button>\n  </div>';

export const SUBMIT_MOLDE = "function submitHomeworkGps9(){if(hwEntregue)return;hwEntregue=true;markSection('homework');if(typeof Store!=='undefined')Store.addXP(55);const btn=document.querySelector('[onclick=\"submitHomeworkGps9()\"]');btn.textContent='🎉 Homework submitted! +75 XP';btn.disabled=true;}";
const SUBMIT_NOVO = "function submitHomeworkGps9(){if(hwEntregue)return;if(window.HomeworkPlus&&!HomeworkPlus.podeEntregar())return;hwEntregue=true;markSection('homework');if(typeof Store!=='undefined')Store.addXP(55);const btn=document.querySelector('[onclick=\"submitHomeworkGps9()\"]');btn.textContent='🎉 Homework submitted! +75 XP';btn.disabled=true;if(window.HomeworkPlus)HomeworkPlus.entregue();}";

export const temHomeworkNovo = c => !!(c.homework && Array.isArray(c.homework.completar));

// A escrita das aulas que ainda não têm o homework novo: um pedido que serve
// para qualquer tema, com os padrões e as frases da própria aula como exemplo.
function escritaPadrao(c) {
    const padroes = (c.gramatica && c.gramatica.slides ? c.gramatica.slides : [])
        .slice(0, 3).map(s => s.padrao.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim());
    const exemplo = (c.speak || []).slice(0, 3).map(s => s.replace(/<[^>]+>/g, '')).join('\n');
    return {
        titulo: 'Escreva 4 frases sobre o seu dia a dia usando o que você aprendeu nesta aula.',
        dica: padroes.length ? `Use os padrões da aula: ${padroes.join(' · ')}.` : 'Use as palavras e as expressões da aula.',
        exemplo,
    };
}

function cartaoEscrita(numero, e) {
    return `  <div class="bg-white border-2 border-emerald-200 rounded-2xl p-5 mb-6">
    <div class="flex items-center gap-2 mb-3">
      <span class="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center">${numero}</span>
      <div><p class="font-black text-navy text-sm">${escHtml(e.titulo)}</p><p class="text-slate-500 text-xs">${escHtml(e.dica)}</p></div>
    </div>
    <textarea id="texto-guiado" rows="6" class="w-full border-2 border-slate-200 rounded-xl p-3 text-sm text-navy focus:border-emerald-400 focus:outline-none resize-none" placeholder="${escHtml(e.exemplo).replace(/\n/g, '&#10;')}"></textarea>
    <p id="texto-guiado-aviso" class="hidden text-xs font-black text-red-600 mt-1"></p>
    <button onclick="submitHomeworkGps9()" class="mt-3 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-black px-6 py-3 rounded-2xl hover:scale-105 transition-all w-full">
      🚀 Entregar Homework (+75 XP)
    </button>
    <div id="hw-card"></div>
  </div>`;
}

/**
 * @param {string} t   HTML da aula, ainda com os nomes do molde (gps9)
 * @param {object} o   { c, d, n, pagina, raiz, curso, cor }
 */
export function aplicarHomework(t, { c, d, n, pagina, raiz, curso, cor }) {
    // A Parte 2 do treino ("Complete a instrução" / "imperativo") era da aula 09.
    t = trocar(t, '✏️ Parte 2 — Complete a instrução', c.verbsQuizTitulo || '✏️ Parte 2 — Complete a frase', 'título da Parte 2');
    t = trocar(t, 'Escreva o verbo na forma certa do imperativo.', c.verbsQuizDica || 'Escreva a palavra que falta, como você viu na aula.', 'dica da Parte 2');

    const novo = temHomeworkNovo(c);
    const h = c.homework;
    const escrita = novo ? h.escrita : escritaPadrao(c);

    // O cartão de escrita (e o botão de entrega) com o pedido desta aula.
    const i = t.indexOf(INICIO_ESCRITA), f = t.indexOf(FIM_ESCRITA, i);
    if (i < 0 || f < 0) throw new Error('homework-plus: não achei o cartão de escrita no molde');
    const antes = novo ? '  <div id="hw-plus"></div>\n\n' : '';
    t = t.slice(0, i) + antes + cartaoEscrita(novo ? 8 : 4, escrita) + t.slice(f + FIM_ESCRITA.length);

    t = trocar(t, 'Complete as 4 tarefas interativas abaixo.',
        novo ? 'São 8 tarefas, uns 20 minutos. No fim, você ganha um card para mandar para o seu teacher.' : 'Complete as 4 tarefas abaixo.',
        'texto do topo do homework');

    // A entrega: confere a escrita e, depois de entregue, mostra o card.
    t = trocar(t, SUBMIT_MOLDE, SUBMIT_NOVO, 'submitHomeworkGps9');

    // O placar vai para o professor como o primeiro campo da entrega: o
    // components.js lê os campos de texto do homework na ordem da página.
    if (novo) {
        t = trocar(t, '<div id="tab-homework" class="tab-content fade-in hidden">',
            '<div id="tab-homework" class="tab-content fade-in hidden">\n  <input type="text" id="placar" hidden readonly tabindex="-1" aria-hidden="true"/>', 'aba do homework');
        const dados = {
            aula: n, titulo: d.titulo, curso, cor,
            completar: h.completar, compreensao: h.compreensao, voz: h.voz, livre: h.livre,
        };
        // O estado das 3 primeiras tarefas fica em variáveis do molde: aqui elas
        // viram uma função que o homework-plus.js chama na hora da entrega.
        const estado = "window.HW_ESTADO=function(){const er=document.getElementById('err-gps9-fb');return{ordem:WO_GPS9_DATA.map((x,i)=>wo_gps9[i].ans.join(' ').toLowerCase()===x.s.toLowerCase()),pares:[mp_gps9_Done.size,MP_GPS9.length],erro:!!(er&&/✅/.test(er.textContent))};};";
        const tags = `<script>window.HW_PLUS=${jsonNoScript(dados)};${estado}</script>\n<script src="homework-plus.js?v=hw1"></script>\n`;
        if ((t.match(/<\/body>/g) || []).length !== 1) throw new Error('homework-plus: </body> ambíguo');
        t = t.replace('</body>', tags + '</body>');
    }

    // O cartão "Folha da aula": o gerador tira o do molde; se o PDF desta aula já
    // existe, a tag volta aqui (igual à que o gera-folha-aula.mjs põe), para que
    // gerar a aula de novo não peça um PDF novo.
    if (fs.existsSync(path.join(raiz, `assets/pdf/${pagina}-folha.pdf`)) && !t.includes('folha-da-aula.js')) {
        t = t.replace('</body>', `<script src="folha-da-aula.js?v=fa1" data-pdf="assets/pdf/${pagina}-folha.pdf"></script>\n</body>`);
    }
    return t;
}

// Conferências do homework, para o validar() dos geradores.
export function checarHomework(c, t, ok) {
    ok(!t.includes('Escreva 5 passos para o cliente reiniciar o monitor'), 'sem a tarefa de escrita da aula 09');
    ok(!t.includes('forma certa do imperativo'), 'sem a dica de imperativo da aula 09 na Parte 2');
    ok(t.includes('id="texto-guiado"'), 'tarefa de escrita com id para o professor');
    if (!temHomeworkNovo(c)) return;
    const h = c.homework;
    ok(h.completar.length === 4 && h.completar.every(x => /___/.test(x.f) && Array.isArray(x.r) && x.r.length && x.dica), '4 frases para completar, cada uma com ___, resposta e dica');
    ok(h.compreensao.length === 2 && h.compreensao.every(q => q.opts.includes(q.a) && new Set(q.opts).size === q.opts.length), '2 perguntas de compreensão, resposta entre as opções e sem repetição');
    ok(Array.isArray(h.voz) && h.voz.length === 2 && h.voz.every(s => s.split(/\s+/).length <= 12), '2 frases para gravar, até 12 palavras');
    ok(h.livre && h.livre.pedido && h.livre.exemplo, 'frase livre com pedido e exemplo');
    ok(h.escrita && h.escrita.titulo && h.escrita.dica && h.escrita.exemplo, 'escrita guiada com título, dica e exemplo');
    ok(t.includes('homework-plus.js?v=') && t.includes('id="hw-plus"') && t.includes('id="placar"'), 'homework novo ligado (homework-plus.js, #hw-plus, placar)');
}
