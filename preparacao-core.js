// ══════════════════════════════════════════════════════════════════════════════
// Preparação de aula — a parte sem tela (preparacao.html, home e curso)
// ══════════════════════════════════════════════════════════════════════════════
// Roda no navegador (window.CapyPrep) e nos testes do Node (require). Guarda no
// aparelho, sem servidor:
//   capyPrepFeitas      { "fr_aula_03": { em, pct } }  — aulas preparadas
//   capyPrepPalavras_fr { "rouge": { pt, ex, emoji, nivel, volta } } — palavras
//                       que o aluno não sabia, com repetição espaçada
//                       (uma chave por idioma: _fr, _en)
//   capyPrepCurso       "agro" — o último curso aberto na Preparação
// Nos dados (data/preparacao/*.json), `txt` é o texto no idioma do curso.
// O professor fica sabendo pelo POST /api/homework ("<aula>-prep"), no fim.
// ══════════════════════════════════════════════════════════════════════════════
(function (raiz) {
    'use strict';

    const VERSAO_DADOS = 'prep2';           // troque ao regenerar data/preparacao
    const DIA = 86400000;
    // Revisão espaçada: errou → volta amanhã; acertou → 3, 7 e 14 dias; depois sai.
    const INTERVALOS = [1, 3, 7, 14];

    function ler(chave, padrao) {
        try { const v = JSON.parse(raiz.localStorage.getItem(chave)); return v == null ? padrao : v; } catch (_) { return padrao; }
    }
    function gravar(chave, valor) {
        try { raiz.localStorage.setItem(chave, JSON.stringify(valor)); } catch (_) { /* aparelho cheio: segue */ }
    }

    // ── Dados ───────────────────────────────────────────────────────────────
    async function carregarCursos() {
        const r = await fetch(`data/preparacao/cursos.json?v=${VERSAO_DADOS}`);
        if (!r.ok) throw new Error('cursos_' + r.status);
        return r.json();
    }

    async function carregarAula(aula) {
        if (!/^[a-z]+_aula_\d{2}$/.test(String(aula || ''))) throw new Error('aula_invalida');
        const r = await fetch(`data/preparacao/${aula}.json?v=${VERSAO_DADOS}`);
        if (!r.ok) throw new Error('aula_' + r.status);
        return r.json();
    }

    // ── Próxima aula ────────────────────────────────────────────────────────
    function concluidas(curso) {
        const v = ler(curso.concluidas, []);
        return Array.isArray(v) ? v.map(Number) : [];
    }
    function feitas() { return ler('capyPrepFeitas', {}) || {}; }

    // A próxima aula é a primeira que o aluno ainda não terminou, na ordem do
    // curso. Se ele já se preparou para ela, a seguinte vira "adiantar".
    function proxima(curso, nums, prep) {
        const aulas = curso.aulas || [];
        const i = aulas.findIndex(a => !nums.includes(a.num));
        if (i < 0) return null;                          // curso inteiro feito
        const atual = aulas[i];
        return {
            aula: atual,
            preparada: prep[atual.aula] || null,
            seguinte: aulas[i + 1] || null,
        };
    }

    // ── Curso ───────────────────────────────────────────────────────────────
    // Sem curso na URL: o último aberto; senão o da preparação mais recente;
    // senão o primeiro em que o aluno já terminou alguma aula; senão o primeiro.
    function cursoPreferido(cursos) {
        const lista = Array.isArray(cursos) ? cursos : [];
        const salvo = ler('capyPrepCurso', null);
        const porSalvo = lista.find(c => c.id === salvo);
        if (porSalvo) return porSalvo;
        const prep = feitas();
        let melhor = null, quando = '';
        for (const c of lista) {
            for (const a of c.aulas || []) {
                const f = prep[a.aula];
                if (f && String(f.em || '') > quando) { quando = String(f.em || ''); melhor = c; }
            }
        }
        return melhor || lista.find(c => concluidas(c).length > 0) || lista[0] || null;
    }
    function lembrarCurso(id) { gravar('capyPrepCurso', String(id || '')); }

    // O aluno já está nesse curso? (aula terminada ou preparação feita nele)
    function estuda(curso) {
        const prep = feitas();
        return concluidas(curso).length > 0 || (curso.aulas || []).some(a => prep[a.aula]);
    }

    // Dá para dizer qual é a próxima aula? Num curso em que a Preparação começa
    // no meio (Agro: aulas 11 a 15), só se o aluno já chegou lá.
    function sabeAProxima(curso) {
        const aulas = curso.aulas || [];
        if (!aulas.length) return false;
        const primeira = aulas[0].num, prep = feitas();
        return primeira <= 1 || concluidas(curso).some(n => n >= primeira - 1) || aulas.some(a => prep[a.aula]);
    }

    function marcarFeita(aula, pct) {
        const f = feitas();
        const ja = !!f[aula];
        f[aula] = { em: new Date().toISOString(), pct: Math.max(0, Math.min(100, Math.round(pct))) };
        gravar('capyPrepFeitas', f);
        return !ja;                                       // primeira vez nesta aula?
    }

    // A aula que tem o passo "🎯 Prepare" (Agro) guarda os passos feitos numa
    // lista própria (capyAgro15Done). Terminar a Preparação põe o passo lá: a
    // aula abre com ele feito e não paga XP de novo (o XP é o daqui).
    function marcarPassoDaAula(alvo) {
        if (!alvo || !/^capy[A-Za-z0-9]{1,40}Done$/.test(String(alvo.chave)) || !/^[a-z-]{1,30}$/.test(String(alvo.secao))) return false;
        const guardado = ler(alvo.chave, []);
        const lista = Array.isArray(guardado) ? guardado : [];
        if (lista.includes(alvo.secao)) return false;
        lista.push(alvo.secao);
        gravar(alvo.chave, lista);
        return true;
    }

    // ── Voz: o aluno falou a frase? ─────────────────────────────────────────
    // Sem acento, sem pontuação e sem apóstrofo ("J'ai" e "jai" viram jai): o
    // Whisper escreve dos dois jeitos. Número vira palavra dos dois lados: ele
    // escreve "19" quando o aluno diz "dix-neuf" (e a frase pode ter "38").
    const UNIDADES = ['zero', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
        'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix sept', 'dix huit', 'dix neuf'];
    const DEZENAS = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
    function numeroFr(n) {
        if (n < 20) return UNIDADES[n];
        if (n === 100) return 'cent';
        if (n < 70) { const d = Math.floor(n / 10), u = n % 10; return DEZENAS[d] + (u === 0 ? '' : u === 1 ? ' et un' : ' ' + UNIDADES[u]); }
        if (n < 80) return n === 71 ? 'soixante et onze' : 'soixante ' + UNIDADES[n - 60];
        return 'quatre vingt' + (n === 80 ? '' : ' ' + UNIDADES[n - 80]);
    }
    function palavras(t) {
        return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[’']/g, '')
            .replace(/\d+/g, m => ' ' + (Number(m) <= 100 ? numeroFr(Number(m)) : m) + ' ')
            .replace(/[^a-z0-9\s-]/g, ' ').split(/[\s-]+/).filter(Boolean);
    }
    // Inglês: contração e número por extenso dos dois lados ("we're" = "we are",
    // "20" = "twenty"). No navegador a régua é a do CapyFala (components.js), a
    // mesma do Speak das aulas; aqui fica uma igual para os testes do Node.
    const CONTRACOES_EN = [[/\b(i)'m\b/g, '$1 am'], [/\b(\w+)'re\b/g, '$1 are'], [/\b(\w+)'ll\b/g, '$1 will'], [/\b(\w+)'ve\b/g, '$1 have'],
        [/\bcan't\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\b(\w+)n't\b/g, '$1 not'], [/\blet's\b/g, 'let us'],
        [/\b(he|she|it|that|what|who|where|there|here)'s\b/g, '$1 is'], [/\b(\w+)'d\b/g, '$1 would']];
    const UNIDADES_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
        'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const DEZENAS_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    function numeroEn(n) {
        if (n < 20) return UNIDADES_EN[n];
        if (n === 100) return 'one hundred';
        return DEZENAS_EN[Math.floor(n / 10)] + (n % 10 ? ' ' + UNIDADES_EN[n % 10] : '');
    }
    function palavrasEn(t) {
        let s = String(t || '').toLowerCase().replace(/[’`]/g, "'").replace(/\bokay\b/g, 'ok').replace(/\be-mail/g, 'email');
        for (const [de, para] of CONTRACOES_EN) s = s.replace(de, para);
        return s.replace(/'s\b/g, '').replace(/'/g, '')
            .replace(/\d+/g, m => ' ' + (Number(m) <= 100 ? numeroEn(Number(m)) : m) + ' ')
            .replace(/[^a-z0-9\s-]/g, ' ').split(/[\s-]+/).filter(Boolean);
    }
    function notaFala(esperado, falado, idioma) {
        const em = idioma === 'en' ? palavrasEn : palavras;
        const alvo = em(esperado), dito = new Set(em(falado));
        if (!alvo.length || !dito.size) return 0;
        return alvo.filter(w => dito.has(w)).length / alvo.length;
    }
    const falouBem = (esperado, falado, idioma) => notaFala(esperado, falado, idioma) >= 0.7;

    // ── Embaralhar sem mudar a cada redesenho ───────────────────────────────
    function embaralhar(lista, semente) {
        let h = 2166136261;
        for (const c of String(semente)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
        const a = lista.slice();
        for (let i = a.length - 1; i > 0; i--) {
            h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
            const j = h % (i + 1);
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ── Palavras para revisar (repetição espaçada, no aparelho) ─────────────
    const chavePalavras = idioma => 'capyPrepPalavras_' + idioma;

    function anotarPalavra(idioma, p, sabia, agora = Date.now()) {
        const todas = ler(chavePalavras(idioma), {}) || {};
        const k = String(p.txt || '').trim();
        if (!k) return;
        const velha = todas[k];
        if (sabia && !velha) return;                      // sabia de primeira: nada a revisar
        const nivel = sabia ? (velha.nivel || 0) + 1 : 0;
        if (nivel >= INTERVALOS.length) { delete todas[k]; gravar(chavePalavras(idioma), todas); return; }
        todas[k] = { pt: p.pt || '', ex: p.ex || '', emoji: p.emoji || '', nivel, volta: agora + INTERVALOS[nivel] * DIA };
        gravar(chavePalavras(idioma), todas);
    }

    function palavrasParaRevisar(idioma, agora = Date.now()) {
        const todas = ler(chavePalavras(idioma), {}) || {};
        return Object.entries(todas)
            .filter(([, v]) => v && v.volta <= agora)
            .sort((a, b) => a[1].volta - b[1].volta)
            .map(([txt, v]) => ({ txt, pt: v.pt, ex: v.ex, emoji: v.emoji }));
    }

    // ── Placar ──────────────────────────────────────────────────────────────
    // r = { ouvir:[bool], palavras:{sabia, total}, perceber:[bool], falar:[bool|null], resposta }
    function placar(r) {
        const conta = arr => arr.filter(Boolean).length;
        const partes = [
            { rotulo: 'Ouvir', feito: conta(r.ouvir), total: r.ouvir.length },
            { rotulo: 'Palavras', feito: r.palavras.sabia, total: r.palavras.total },
            { rotulo: 'Reparar', feito: conta(r.perceber), total: r.perceber.length },
            { rotulo: 'Falar', feito: conta(r.falar), total: r.falar.length },
        ];
        const feito = partes.reduce((s, p) => s + p.feito, 0), total = partes.reduce((s, p) => s + p.total, 0);
        const pct = total ? Math.round(100 * feito / total) : 0;
        const texto = partes.map(p => `${p.rotulo} ${p.feito}/${p.total}`).join(' · ') + ` · Total ${pct}%`;
        return { partes, pct, texto };
    }

    const CapyPrep = {
        VERSAO_DADOS, carregarCursos, carregarAula, concluidas, feitas, proxima, marcarFeita,
        cursoPreferido, lembrarCurso, estuda, sabeAProxima, marcarPassoDaAula,
        palavras, palavrasEn, notaFala, falouBem, embaralhar, anotarPalavra, palavrasParaRevisar, placar,
    };
    if (typeof module === 'object' && module.exports) module.exports = CapyPrep;
    else raiz.CapyPrep = CapyPrep;
})(typeof window !== 'undefined' ? window : globalThis);
