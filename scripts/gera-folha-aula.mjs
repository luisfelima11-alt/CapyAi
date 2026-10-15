// Folha da aula: o PDF de UMA página que o aluno imprime para acompanhar a aula.
// Regra do Luis (12/out/2026): toda aula nova de curso sai com a folha.
//
//   node scripts/gera-folha-aula.mjs gpstronic_aula_14.html [outra.html ...]
//   node scripts/gera-folha-aula.mjs --curso gpstronic_aula
//
// Lê VOCAB_DATA, EXPR_DATA e a seção Patterns (tab-grammar) da própria aula — a aula é a
// fonte única, a folha nunca é escrita à mão. Sai em assets/pdf/<slug>-folha.pdf.
// Preto no branco, cor só nos títulos. Se não couber em 1 página, corta exemplos até caber;
// se nem assim couber, falha.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.join(RAIZ, 'assets', 'pdf');

const CURSOS = {
    gpstronic_aula: { nome: 'GPS Tronic', cor: '#047857' },
    agro_aula: { nome: 'Agro English', cor: '#3f6212' },
    med_aula: { nome: 'Medical English', cor: '#0e7490' },
    business_aula: { nome: 'Business English', cor: '#1d4ed8' },
    travel_aula: { nome: 'Travel English', cor: '#0369a1' },
    intermediate_aula: { nome: 'Intermediate', cor: '#6d28d9' },
    advanced_aula: { nome: 'Advanced', cor: '#9f1239' },
    interview_aula: { nome: 'Entrevista em inglês', cor: '#334155' },
    fr_aula: { nome: 'Français', cor: '#1e3a8a' },
    aula: { nome: 'Starter', cor: '#001f3f' },
};

// A palavra proibida não entra na folha nem por acidente (regra de 12/out).
const PROIBIDA = /gram[aá]tic|grammar/i;

function familiaDe(arquivo) {
    const m = path.basename(arquivo).match(/^(.*?)_?(\d+)\.html$/);
    if (!m) throw new Error(`nome de aula inesperado: ${arquivo}`);
    return { familia: m[1] || 'aula', numero: Number(m[2]) };
}

// Recorta "const NOME=[ ... ];" respeitando strings e colchetes, e avalia isolado.
function lerArray(html, nome) {
    const i = html.search(new RegExp(`const\\s+${nome}\\s*=\\s*\\[`));
    if (i < 0) return [];
    let j = html.indexOf('[', i), prof = 0, aspas = null;
    for (let k = j; k < html.length; k++) {
        const c = html[k];
        if (aspas) { if (c === '\\') k++; else if (c === aspas) aspas = null; continue; }
        if (c === '"' || c === "'" || c === '`') aspas = c;
        else if (c === '[') prof++;
        else if (c === ']' && --prof === 0) {
            return vm.runInNewContext(`(${html.slice(j, k + 1)})`, {}, { timeout: 500 });
        }
    }
    throw new Error(`${nome} sem fim`);
}

const semTags = s => s.replace(/<s>(.*?)<\/s>/g, '~~$1~~').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();

// A seção Patterns (id tab-grammar) num DOM de verdade: os dois moldes de aula guardam os
// exemplos de jeitos diferentes (linhas com ✅/❌ separadas por <br> no molde novo; frases entre
// aspas, uma por <span>, no antigo), e regex não aguenta div aninhada.
function secaoPadroes(html) {
    const ini = html.indexOf('<div id="tab-grammar"');
    if (ini < 0) return '';
    const fim = html.indexOf('<div id="tab-', ini + 20);
    return html.slice(ini, fim < 0 ? undefined : fim).replace(/<script[\s\S]*?<\/script>/gi, '');
}

// Roda dentro do navegador (o Playwright serializa a função).
function LER_PADROES() {
  const limpa = el => {
    const c = el.cloneNode(true);
    c.querySelectorAll('s').forEach(s => s.replaceWith('~~' + s.textContent + '~~'));
    return c.textContent.replace(/\s+/g, ' ').trim();
  };
  return [...document.querySelectorAll('[onclick^="toggleAccordion"]')].map(btn => {
    const id = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
    const titulo = (btn.querySelector('.font-black.text-navy') || btn).textContent.trim();
    const corpo = document.getElementById(id);
    let certo = [], errado = [];
    if (corpo) {
      const caixa = corpo.querySelector('div') || corpo;
      const html = caixa.innerHTML;
      if (/✅|❌/.test(html)) {
        html.split(/<br\s*\/?>/i).forEach(pedaco => {
          const d = document.createElement('div'); d.innerHTML = pedaco;
          const t = limpa(d);
          if (t.startsWith('✅')) certo.push(t.replace(/^✅\s*/, ''));
          else if (t.startsWith('❌')) errado.push(t.replace(/^❌\s*/, ''));
        });
      } else {
        caixa.querySelectorAll('.flex > span:last-child').forEach(s => {
          const t = limpa(s).replace(/^["“]|["”]$/g, '');
          if (t && !/^(💡|⚡)/.test(t)) certo.push(t);
        });
      }
    }
    if (!certo.length) {
      const sub = btn.querySelector('.font-black.text-navy + div');
      if (sub) certo.push(sub.textContent.trim().replace(/^["“]|["”]$/g, ''));
    }
    return { titulo, certo, errado };
  }).filter(p => p.titulo);
}

function lerAula(arquivo) {
    const html = fs.readFileSync(arquivo, 'utf8');
    const { familia, numero } = familiaDe(arquivo);
    const titulo = (html.match(/lessonTitle\s*:\s*["']([^"']+)/) || [])[1]
        || semTags((html.match(/<title>([^<]*)/) || [])[1] || '').split(/ — | em inglês/)[0];
    const vocab = lerArray(html, 'VOCAB_DATA').map(v => ({ en: v.en, pt: v.pt, ex: v.ex || '' }));
    const frases = lerArray(html, 'EXPR_DATA').map(e => ({ en: e.expr || e.en, pt: e.pt }));
    if (!vocab.length) return lerAulaDeConversa(html, { familia, numero, titulo });
    return { familia, numero, titulo, vocab, frases, secao: secaoPadroes(html) };
}

// Aulas de conversa (Intermediate 05, 10, 15, 20): leitura + perguntas, sem VOCAB_DATA.
// O vocabulário vem do quadro "Key Vocabulary" da leitura, o modelo vem das respostas-modelo
// do Speaking e as perguntas vêm do CONV_DATA.
function lerAulaDeConversa(html, base) {
    const ini = html.indexOf('Key Vocabulary');
    const bloco = ini < 0 ? '' : html.slice(ini, html.indexOf('</button>', ini));
    const vocab = [...bloco.matchAll(/<span[^>]*>([^<]+)<\/span>\s*<span[^>]*>([^<]+)<\/span>/g)]
        .map(m => ({ en: semTags(m[1]), pt: semTags(m[2]), ex: '' }));
    const padroes = lerArray(html, 'SPEAKING_PROMPTS').slice(0, 4)
        .map(p => ({ titulo: p.prompt, certo: [p.modelAnswer], errado: [] }));
    const conv = lerArray(html, 'CONV_DATA');
    const frases = conv.slice(0, 6).map(c => ({ en: c.q, pt: (c.starters || []).join(' / ') }));
    return { ...base, vocab, frases, padroes, dicas: conv.slice(0, 2).map(c => (c.starters || [])[0]).filter(Boolean),
        rotuloPadroes: 'Model answers · respostas-modelo', rotuloFrases: 'Conversation · perguntas da aula' };
}

// A folha é preto no branco: emoji que vier da aula sai antes de escapar.
const semEmoji = s => String(s ?? '').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim();
// Trava: em 13/out um escape errado neste filtro apagou letras comuns de todas as folhas.
if (semEmoji('\u26A0\uFE0F Have a nice trip \u2705') !== 'Have a nice trip') throw new Error('semEmoji est\u00E1 apagando texto');
const esc = s => semEmoji(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const riscado = s => esc(s).replace(/~~(.*?)~~/g, '<s>$1</s>');

// corte: 0 = tudo; 1 = sem o tropeço; 2 = 1 exemplo por padrão e sem frase no vocab longo...
function montarHtml(a, corte) {
    const curso = CURSOS[a.familia] || CURSOS.aula;
    const vocab = a.vocab.map(v => `<li><b>${esc(v.en)}</b> <span class="pt">${esc(v.pt)}</span>${corte < 3 && v.ex ? `<i>${esc(v.ex)}</i>` : ''}</li>`).join('');
    const padroes = a.padroes.slice(0, corte < 2 ? 4 : 3).map(p => `<li><b>${esc(p.titulo)}</b>
        ${p.certo.slice(0, corte < 2 ? 2 : 1).map(c => `<span class="ok">✓ ${esc(c)}</span>`).join('')}
        ${corte < 1 && p.errado[0] ? `<span class="no">✗ ${riscado(p.errado[0].split('❌')[0])}</span>` : ''}</li>`).join('');
    const frases = a.frases.slice(0, 6).map(f => `<li><b>${esc(f.en)}</b> <span class="pt">${esc(f.pt)}</span></li>`).join('');
    const dica = a.dicas ? a.dicas.map(esc).join('   ·   ')
        : a.padroes.slice(0, 2).map(p => esc(p.certo[0] || '').split(' ').slice(0, 4).join(' ').replace(/[.!?]+$/, '') + '…').join('   ·   ');
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@page{size:A4;margin:12mm 13mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,Helvetica,sans-serif;font-size:9.6pt;line-height:1.32;color:#111}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1.5pt solid #111;padding-bottom:2mm;margin-bottom:3mm}
header small{display:block;font-size:8pt;letter-spacing:.06em;text-transform:uppercase;color:#444}
header h1{font-size:15pt;line-height:1.15}
header .nome{font-size:8.5pt;color:#444;white-space:nowrap}
h2{font-size:9.5pt;text-transform:uppercase;letter-spacing:.07em;color:${curso.cor};margin:3mm 0 1.4mm;border-bottom:.6pt solid ${curso.cor};padding-bottom:.6mm}
ul{list-style:none}
.vocab{columns:2;column-gap:7mm}
.vocab li{break-inside:avoid;margin-bottom:1.1mm}
.vocab i{display:block;color:#444;font-size:8.6pt}
.pt{color:#444}
.padroes{display:grid;grid-template-columns:1fr 1fr;gap:1.6mm 7mm}
.padroes span{display:block;font-size:9pt}
.padroes .no{color:#555}
.frases{columns:2;column-gap:7mm}
.frases li{break-inside:avoid;margin-bottom:.8mm}
.linha{border-bottom:.5pt solid #999;height:7.2mm}
.dica{font-size:8.4pt;color:#555;margin-bottom:.5mm}
#notas{display:flex;flex-direction:column}
footer{font-size:7.5pt;color:#777;text-align:right;margin-top:2mm}
</style></head><body>
<header><div><small>Capy English · ${esc(curso.nome)} · Aula ${a.numero}</small><h1>${esc(a.titulo)}</h1></div>
<div class="nome">Nome: ____________________ &nbsp; Data: ___/___</div></header>
<h2>Vocabulary</h2><ul class="vocab">${vocab}</ul>
${padroes ? `<h2>${a.rotuloPadroes || "Patterns · o padrão da aula"}</h2><ul class="padroes">${padroes}</ul>` : ''}
${frases ? `<h2>${a.rotuloFrases || "Key phrases"}</h2><ul class="frases">${frases}</ul>` : ''}
<h2>Minhas frases · escreva 3 exemplos seus antes da aula</h2>
${dica ? `<p class="dica">Comece com: ${dica}</p>` : ''}
<div class="linha"></div><div class="linha"></div><div class="linha"></div>
<h2>Notas</h2><div id="notas"></div>
<footer>capyenglish.com.br</footer>
</body></html>`;
}

// Enche "Notas" com linhas até o fim da página (sem passar para a segunda).
const ENCHER_NOTAS = `(() => {
  const n = document.getElementById('notas');
  const alturaPagina = (297 - 24) * 96 / 25.4 - 2;
  const sobra = alturaPagina - document.body.scrollHeight;
  const qtd = Math.max(2, Math.floor((sobra - 4) / (7.2 * 96 / 25.4)));
  for (let i = 0; i < qtd; i++) { const d = document.createElement('div'); d.className = 'linha'; n.appendChild(d); }
  return { sobra, qtd, cabe: document.body.scrollHeight <= alturaPagina };
})()`;

async function gerar(navegador, arquivo) {
    const a = lerAula(arquivo);
    if (!a.vocab.length) throw new Error(`${arquivo}: sem VOCAB_DATA`);
    const slug = path.basename(arquivo, '.html');
    // Mesma largura útil do A4 (210 - 26 mm), em modo impressão: a conta das linhas de nota
    // só bate se a tela medir igual ao papel.
    const pagina = await navegador.newPage({ viewport: { width: Math.round(184 * 96 / 25.4), height: 1100 } });
    await pagina.emulateMedia({ media: 'print' });
    await pagina.setContent(a.secao || "");
    if (!a.padroes) a.padroes = a.secao ? await pagina.evaluate(LER_PADROES) : [];
    for (let corte = 0; corte <= 3; corte++) {
        const html = montarHtml(a, corte);
        if (PROIBIDA.test(html.replace(/<style>[\s\S]*?<\/style>/, ''))) throw new Error(`${slug}: a folha tem a palavra proibida`);
        await pagina.setContent(html);
        const r = await pagina.evaluate(ENCHER_NOTAS);
        if (!r.cabe) continue;
        const pdf = await pagina.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: false });
        const paginas = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
        if (paginas !== 1) continue;
        fs.mkdirSync(SAIDA, { recursive: true });
        const destino = path.join(SAIDA, `${slug}-folha.pdf`);
        fs.writeFileSync(destino, pdf);
        await pagina.close();
        console.log(`✓ ${path.relative(RAIZ, destino)}  (${a.vocab.length} palavras, ${a.padroes.length} padrões, ${a.frases.length} frases, corte ${corte}, ${r.qtd} linhas de nota, ${Math.round(pdf.length / 1024)} KB)`);
        return destino;
    }
    await pagina.close();
    throw new Error(`${slug}: não coube em 1 página nem cortando exemplos`);
}

const args = process.argv.slice(2);
let arquivos = args.filter(a => !a.startsWith('--'));
const iCurso = args.indexOf('--curso');
if (iCurso >= 0) {
    const fam = args[iCurso + 1];
    arquivos = fs.readdirSync(RAIZ).filter(f => new RegExp(`^${fam}_\\d+\\.html$`).test(f)).sort();
}
if (!arquivos.length) { console.error('uso: node scripts/gera-folha-aula.mjs <aula>.html | --curso <familia>'); process.exit(1); }

const navegador = await chromium.launch();
let falhas = 0;
for (const f of arquivos) {
    try { await gerar(navegador, path.resolve(RAIZ, f)); }
    catch (e) { falhas++; console.error(`✗ ${e.message}`); }
}
await navegador.close();
process.exit(falhas ? 1 : 0);
