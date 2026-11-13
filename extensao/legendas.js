// ══════════════════════════════════════════════════════════════════════════════
// Capy no YouTube — a parte "pura" das legendas (sem DOM, sem chrome.*)
// ══════════════════════════════════════════════════════════════════════════════
// Roda no content script (como `self.CapyLegendas`) e nos testes do Node
// (`require('../extensao/legendas.js')`). Tudo aqui é cálculo: ler o json3 do
// YouTube, montar a URL da faixa traduzida, casar a linha em português com a
// linha em inglês e decidir para onde os botões ⏮ 🔁 ⏭ levam.
// ══════════════════════════════════════════════════════════════════════════════
(function (raiz) {
    'use strict';

    // Um pouco de folga: depois de um seek para `inicio`, o currentTime às
    // vezes volta alguns milissegundos antes. Sem folga, a frase "atual"
    // seria a anterior e o 🔁 repetiria a frase errada.
    const FOLGA = 0.05;

    function limparTexto(t) {
        return String(t || '')
            .replace(/\s+/g, ' ')
            .replace(/^>>\s*/, '')      // marca de troca de quem fala
            .trim();
    }

    // json3 do /api/timedtext → [{ inicio, fim, texto }] em segundos, em ordem
    // e sem sobreposição. As legendas automáticas (kind=asr) "rolam": cada
    // evento fica na tela enquanto o próximo entra, e há eventos só de "\n"
    // (aAppend). Para estudar frase a frase, cada linha termina quando a
    // próxima começa.
    function lerJson3(dados) {
        let obj = dados;
        if (typeof dados === 'string') {
            try { obj = JSON.parse(dados); } catch (_) { return []; }
        }
        const eventos = obj && Array.isArray(obj.events) ? obj.events : [];
        const cues = [];
        for (const ev of eventos) {
            if (!ev || ev.aAppend || !Array.isArray(ev.segs)) continue;
            const texto = limparTexto(ev.segs.map(s => (s && s.utf8) || '').join(''));
            if (!texto) continue;
            const inicio = Math.max(0, Number(ev.tStartMs) || 0) / 1000;
            const dur = Math.max(0, Number(ev.dDurationMs) || 0) / 1000;
            cues.push({ inicio, fim: inicio + (dur || 2), texto });
        }
        cues.sort((a, b) => a.inicio - b.inicio);

        const saida = [];
        for (const c of cues) {
            const ultimo = saida[saida.length - 1];
            // Mesma linha repetida em seguida (acontece nas automáticas): junta.
            if (ultimo && ultimo.texto === c.texto && c.inicio <= ultimo.fim + 0.2) {
                ultimo.fim = Math.max(ultimo.fim, c.fim);
                continue;
            }
            saida.push({ ...c });
        }
        for (let i = 0; i < saida.length - 1; i++) {
            if (saida[i].fim > saida[i + 1].inicio) saida[i].fim = Math.max(saida[i].inicio + 0.05, saida[i + 1].inicio);
        }
        return saida;
    }

    function idiomaBase(codigo) {
        return String(codigo || '').toLowerCase().split(/[-_]/)[0];
    }

    // A URL que o próprio player pediu (com o token `pot`, que o YouTube passou
    // a exigir) vira a URL da faixa em `alvo`: o original se já é desse idioma,
    // a tradução automática do YouTube (`tlang`) se não é. Sempre em json3.
    function urlDaFaixa(urlCapturada, alvo) {
        const u = new URL(urlCapturada, 'https://www.youtube.com');
        u.searchParams.set('fmt', 'json3');
        if (idiomaBase(u.searchParams.get('lang')) === idiomaBase(alvo)) u.searchParams.delete('tlang');
        else u.searchParams.set('tlang', alvo);
        return u.toString();
    }

    function dadosDaUrl(url) {
        try {
            const u = new URL(url, 'https://www.youtube.com');
            return {
                videoId: u.searchParams.get('v') || '',
                lang: (u.searchParams.get('lang') || '').toLowerCase(),
                tlang: (u.searchParams.get('tlang') || '').toLowerCase(),
                kind: u.searchParams.get('kind') || '',
                fmt: u.searchParams.get('fmt') || '',
            };
        } catch (_) {
            return { videoId: '', lang: '', tlang: '', kind: '', fmt: '' };
        }
    }

    // Casa cada linha em inglês com o português. Nas legendas feitas por gente
    // os tempos são idênticos; nas automáticas o YouTube traduz frases inteiras
    // e os tempos não batem. Regra: entram as linhas PT cujo MEIO cai dentro da
    // linha EN; se nenhuma cai, vale a de maior sobreposição.
    function alinhar(en, pt) {
        const lista = Array.isArray(pt) ? pt : [];
        let j0 = 0;
        return en.map(c => {
            while (j0 < lista.length && lista[j0].fim <= c.inicio) j0++;
            const partes = [];
            let melhor = null, melhorSobre = 0;
            // Volta um pouco: uma linha PT longa pode começar antes desta EN.
            for (let j = Math.max(0, j0 - 2); j < lista.length; j++) {
                const p = lista[j];
                if (p.inicio >= c.fim) break;
                if (p.fim <= c.inicio) continue;
                const sobre = Math.min(c.fim, p.fim) - Math.max(c.inicio, p.inicio);
                const meio = (p.inicio + p.fim) / 2;
                if (meio >= c.inicio && meio < c.fim) partes.push(p.texto);
                if (sobre > melhorSobre) { melhorSobre = sobre; melhor = p; }
            }
            return { ...c, pt: partes.length ? partes.join(' ') : (melhor ? melhor.texto : '') };
        });
    }

    // Índice da última linha que JÁ COMEÇOU em `t` (busca binária), ou -1.
    // Pode ser uma linha que já terminou: num silêncio entre falas, "a frase
    // atual" é a última que se ouviu — é ela que o 🔁 deve repetir.
    function indiceNoTempo(cues, t) {
        let lo = 0, hi = cues.length - 1, achou = -1;
        while (lo <= hi) {
            const m = (lo + hi) >> 1;
            if (cues[m].inicio <= t + FOLGA) { achou = m; lo = m + 1; } else hi = m - 1;
        }
        return achou;
    }

    // A linha que deve aparecer na tela em `t` (ou -1 num silêncio).
    function indiceVisivel(cues, t) {
        const i = indiceNoTempo(cues, t);
        return i >= 0 && t < cues[i].fim ? i : -1;
    }

    // ⏮ 🔁 ⏭ → índice da linha de destino (ou -1 se não há para onde ir).
    function destino(cues, t, acao) {
        if (!cues.length) return -1;
        const i = indiceNoTempo(cues, t);
        if (acao === 'proxima') return i + 1 < cues.length ? i + 1 : -1;
        if (acao === 'repetir') return Math.max(0, i);
        if (acao === 'anterior') return Math.max(0, i - 1);
        return -1;
    }

    // "Don't stop, Ana!" → pedaços; os que são palavra ficam clicáveis.
    function tokens(texto) {
        const s = String(texto || '');
        const re = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g;
        const partes = [];
        let ultimo = 0, m;
        while ((m = re.exec(s))) {
            if (m.index > ultimo) partes.push({ texto: s.slice(ultimo, m.index), palavra: null });
            partes.push({ texto: m[0], palavra: m[0].replace(/’/g, "'").toLowerCase() });
            ultimo = re.lastIndex;
        }
        if (ultimo < s.length) partes.push({ texto: s.slice(ultimo), palavra: null });
        return partes;
    }

    const CapyLegendas = { lerJson3, urlDaFaixa, dadosDaUrl, idiomaBase, alinhar, indiceNoTempo, indiceVisivel, destino, tokens };

    if (typeof module === 'object' && module.exports) module.exports = CapyLegendas;
    else raiz.CapyLegendas = CapyLegendas;
})(typeof self !== 'undefined' ? self : this);
