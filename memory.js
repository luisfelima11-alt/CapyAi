// ══════════════════════════════════════════════════════════════════════════════
// CAPY MEMORY — as palavras que o aluno erra, no servidor
// ══════════════════════════════════════════════════════════════════════════════
// Antes disto, as palavras fracas viviam só no localStorage, uma chave por lição
// (`lessonProgress_j<id>`). Trocar de aparelho perdia a fila de revisão inteira, e
// nenhum agente no servidor conseguia enxergá-las.
//
// Por que NÃO entra no Store.state: medido, o estado do aluno pesa 941 bytes e as
// palavras fracas pesam 81 KB — 88× maior. O `Store.save()` não tem debounce e tem
// 25 pontos de chamada, então uma revisão de 10 palavras viraria ~15 POSTs de 81 KB.
// Fica numa linha própria (`mem_<userId>`), com ritmo próprio.
//
// Regra que não pode ser quebrada: a PRIMEIRA sincronização é só de envio. Se o
// servidor responder vazio para quem só tem dado local — ou seja, todo mundo no dia
// do deploy — o cliente NÃO pode limpar o localStorage. Errar isso apaga a fila de
// revisão de todos os alunos de uma vez.
// ══════════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    const CHAVE_LOCAL = 'capyMemory';        // lista mesclada, canônica no cliente
    const ESPERA_MS   = 10000;               // debounce; nunca a cada recordWeakWord
    const TETO        = 80;                  // igual ao teto do servidor

    let pendente = null;
    let enviando = false;
    let sujo     = false;

    const norm = w => String(w && w.en || '').trim().toLowerCase();

    function logado() {
        try {
            const s = JSON.parse(localStorage.getItem('capySession') || 'null');
            return !!(s && s.id && s.id !== 'guest');
        } catch (e) { return false; }
    }

    // ── Leitura do que existe no aparelho ─────────────────────────────────────
    // Duas fontes: as chaves por lição (escritas pelo runner da trilha) e a lista
    // canônica do CapyMemory (que inclui o que veio de outros aparelhos).
    function lerLocal() {
        const mapa = new Map();

        const juntar = (w, lessonId) => {
            const k = norm(w);
            if (!k) return;
            const novo = {
                en: String(w.en).slice(0, 60),
                pt: w.pt == null ? null : String(w.pt).slice(0, 80),
                source: String(w.source || '').slice(0, 40),
                lessonId: Number(lessonId ?? w.lessonId) || 0,
                mastered: Boolean(w.mastered),
                srs: {
                    streak:  Math.max(0, Number(w.srs && w.srs.streak) || 0),
                    nextDue: Math.max(0, Number(w.srs && w.srs.nextDue) || 0),
                },
            };
            const velho = mapa.get(k);
            if (!velho) { mapa.set(k, novo); return; }
            const vence = novo.srs.streak > velho.srs.streak ? novo : velho;
            mapa.set(k, { ...vence, mastered: velho.mastered || novo.mastered, pt: velho.pt || novo.pt });
        };

        try {
            const canon = JSON.parse(localStorage.getItem(CHAVE_LOCAL) || '[]');
            if (Array.isArray(canon)) canon.forEach(w => juntar(w));
        } catch (e) { /* chave corrompida: as por-lição ainda salvam o dia */ }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || key.indexOf('lessonProgress_j') !== 0) continue;
            try {
                const d = JSON.parse(localStorage.getItem(key));
                const id = parseInt(key.replace('lessonProgress_j', ''), 10);
                (d && d.weakWords || []).forEach(w => juntar(w, id));
            } catch (e) { /* entrada malformada, ignora */ }
        }
        return [...mapa.values()];
    }

    function gravarLocal(lista) {
        try {
            const cortada = lista
                .slice()
                .sort((a, b) => (a.mastered - b.mastered) || (a.srs.nextDue - b.srs.nextDue))
                .slice(0, TETO);
            localStorage.setItem(CHAVE_LOCAL, JSON.stringify(cortada));
        } catch (e) { /* cota estourada: seguir com o que há */ }
    }

    // ── Sincronização ─────────────────────────────────────────────────────────
    async function sincronizar(opts) {
        opts = opts || {};
        if (!logado() || enviando) return null;
        const words = lerLocal();
        if (!words.length && !opts.forcar) return null;

        enviando = true;
        try {
            const r = await fetch('/api/memory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                keepalive: !!opts.saindo,   // sendBeacon NÃO aceita header custom,
                                            // então o X-CSRF-Token não iria junto e
                                            // o flush final levaria 403. keepalive
                                            // no fetch resolve e mantém o header.
                body: JSON.stringify({ words }),
            });
            if (!r.ok) return null;
            const dados = await r.json();
            // O servidor devolve a UNIÃO, nunca menos do que mandamos — mas a
            // guarda fica explícita: resposta vazia jamais apaga dado local.
            if (dados && Array.isArray(dados.words) && dados.words.length) {
                gravarLocal(dados.words);
                sujo = false;
                return dados.words;
            }
            return null;
        } catch (e) {
            return null;   // offline: o dado continua no localStorage
        } finally {
            enviando = false;
        }
    }

    function agendar() {
        sujo = true;
        clearTimeout(pendente);
        pendente = setTimeout(() => sincronizar(), ESPERA_MS);
    }

    const CapyMemory = {
        // Chamado por quem detecta erro (lessons.html, self-study.js nas aulas).
        // Nunca sincroniza na hora: agenda.
        record(palavras, source, contexto) {
            const lista = Array.isArray(palavras) ? palavras : [palavras];
            if (!lista.length) return;
            const atual = lerLocal();
            const vistos = new Set(atual.map(norm));
            let mudou = false;
            for (const p of lista) {
                const w = typeof p === 'string' ? { en: p, pt: null } : p;
                const k = norm(w);
                if (!k || vistos.has(k)) continue;
                vistos.add(k);
                atual.push({
                    en: String(w.en).slice(0, 60),
                    pt: w.pt == null ? null : String(w.pt).slice(0, 80),
                    source: String(source || w.source || '').slice(0, 40),
                    lessonId: Number(w.lessonId) || 0,
                    mastered: false,
                    srs: { streak: 0, nextDue: 0 },
                });
                mudou = true;
            }
            if (!mudou) return;
            gravarLocal(atual);
            agendar();
        },

        // Fila de revisão: o que está vencido e ainda não dominado.
        due() {
            const agora = Date.now();
            return lerLocal()
                .filter(w => !w.mastered && (!w.srs.nextDue || w.srs.nextDue <= agora))
                .sort((a, b) => a.srs.nextDue - b.srs.nextDue);
        },

        all: lerLocal,
        sync: sincronizar,
        marcarSujo: agendar,
    };

    // Puxa do servidor uma vez ao abrir. É POST (envia o local junto), então a
    // primeira sincronização de quem só tem dado local não corre risco de
    // receber vazio e limpar nada.
    function iniciar() {
        if (!logado()) return;
        setTimeout(() => sincronizar({ forcar: true }), 1500);
    }

    // Flush ao sair. `pagehide` é o único evento confiável no Safari iOS —
    // `beforeunload` não dispara lá.
    window.addEventListener('pagehide', () => {
        if (sujo) sincronizar({ saindo: true });
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && sujo) sincronizar({ saindo: true });
    });

    window.CapyMemory = CapyMemory;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
