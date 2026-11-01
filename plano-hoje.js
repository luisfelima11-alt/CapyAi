/* Plano de hoje (home nova, PR 2 de 3, 29/out/2026).
 *
 * Três tarefas de ~5 min montadas SEM IA, a partir do progresso do aluno: abre na
 * hora e não gasta crédito (o "Meu Plano" semanal da IA continua no study_plan).
 *   1. Trilha: a próxima mini-lição (capyLastMini_en ou a 1ª incompleta).
 *   2. Conversa com a Yara: ligação (Super ou teste grátis) ou chat por mensagem.
 *   3. Revisão: as palavras que o aluno erra (/api/memory) no modo revisão.
 *
 * "Feito" vem de marcas com data, gravadas onde a coisa acontece (uma "foto do dia"
 * tirada na home errava quando o progresso do servidor chegava depois):
 *   trilha   → a mini aberta hoje (capyLastMini_en.at) já está concluída;
 *   conversa → ai_chat.html grava capyConversaDia (resposta da Yara ou ligação > 30 s);
 *   revisão  → lessons.html?review=1 grava capyRevisaoDia.
 *
 * O horário fica em Store.state.horarioEstudo (vai junto no /api/db). "Pôr na
 * agenda" abre o Google Agenda ou baixa /api/agenda.ics (iPhone e Outlook), um
 * evento diário com alarme na hora.
 */
(function () {
    'use strict';
    if (window.CapyPlano) return;

    const TZ = 'America/Sao_Paulo';
    const MINUTOS = 15;
    const ler = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const gravar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
    const diaBR = (d = new Date()) => d.toLocaleDateString('en-CA', { timeZone: TZ });
    const estado = () => (window.Store && Store.state) || {};

    function horario() {
        const h = estado().horarioEstudo || ler('capyHorario') || '19:00';
        return /^([01]\d|2[0-3]):[0-5]\d$/.test(h) ? h : '19:00';
    }

    function salvarHorario(h) {
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(h))) return false;
        gravar('capyHorario', h);
        if (window.Store && Store.state) { Store.state.horarioEstudo = h; if (typeof Store.save === 'function') Store.save(); }
        return true;
    }

    // Próxima mini-lição em inglês: continua de onde parou; senão, a 1ª incompleta.
    function proximaMini(indice, feitas, ultima) {
        const ok = new Set((feitas || []).map(String));
        const licoes = (indice || []).filter(l => (l.lang || 'en') === 'en' && l.id >= 1 && l.id < 200).map(l => l.id).sort((a, b) => a - b);
        const feita = (id, n) => ok.has(`${id}_${n}`);
        let ini = 0;
        if (ultima && licoes.includes(Number(ultima.lessonId))) ini = licoes.indexOf(Number(ultima.lessonId));
        for (let i = ini; i < licoes.length; i++) {
            for (let n = 1; n <= 4; n++) if (!feita(licoes[i], n)) return { lessonId: licoes[i], mini: n };
        }
        for (const id of licoes) for (let n = 1; n <= 4; n++) if (!feita(id, n)) return { lessonId: id, mini: n };
        return null;
    }

    async function json(url) {
        try { const r = await fetch(url, { credentials: 'same-origin' }); return r.ok ? await r.json() : null; } catch (e) { return null; }
    }

    async function hoje() {
        const s = estado();
        const dia = diaBR();
        const [indice, memoria, me] = await Promise.all([
            json('data/lessons-index.json?v=gps24'), json('/api/memory'), json('/api/me'),
        ]);
        let ultima = null;
        try { ultima = JSON.parse(ler('capyLastMini_en') || 'null'); } catch (e) {}
        const prox = proximaMini(indice || [], s.completedMinis, ultima);
        const licao = prox && (indice || []).find(l => l.id === prox.lessonId);
        const palavras = memoria && Array.isArray(memoria.words) ? memoria.words.length : 0;
        const plano = (me && me.plan) || s.planType || 'free';
        const vozTeste = me && me.vozTeste;
        const conversa = plano === 'super'
            ? { titulo: 'Ligação com a Yara', detalhe: 'Converse 5 minutos em inglês' }
            : vozTeste === 'disponivel'
                ? { titulo: 'Ligação com a Yara', detalhe: '1ª ligação: 3 minutos grátis' }
                : { titulo: 'Chat com a Yara', detalhe: 'Por mensagem · usa 1 crédito' };
        const trilhaFeita = !!(ultima && ultima.at && diaBR(new Date(ultima.at)) === dia
            && (s.completedMinis || []).map(String).includes(`${ultima.lessonId}_${ultima.miniNum}`));
        const itens = [
            {
                id: 'trilha', min: 5,
                // Feita hoje: mostra o que o aluno fez e qual vem a seguir.
                titulo: trilhaFeita ? `Trilha: mini-lição ${ultima.miniNum} feita`
                    : prox ? `Trilha: mini-lição ${prox.mini}` : 'Trilha: revisar a última lição',
                detalhe: trilhaFeita && prox ? `Próxima: Aula ${prox.lessonId}, mini-lição ${prox.mini}`
                    : licao ? `Aula ${licao.id} · ${licao.title}` : 'Você terminou a trilha em inglês!',
                href: prox ? `lessons.html?lesson=${prox.lessonId}&guided=1&mini=${prox.mini}` : 'lessons.html',
                feito: trilhaFeita,
            },
            {
                id: 'conversa', min: 5, ...conversa, href: 'ai_chat.html',
                feito: ler('capyConversaDia') === dia,
            },
            {
                id: 'revisao', min: 5,
                titulo: 'Revisão de palavras',
                detalhe: palavras ? `${palavras} palavra${palavras === 1 ? '' : 's'} que você errou` : 'As palavras das últimas lições',
                href: 'lessons.html?review=1',
                feito: ler('capyRevisaoDia') === dia,
            },
        ];
        return { dia, horario: horario(), minutos: MINUTOS, feitos: itens.filter(i => i.feito).length, itens, plano, vozTeste };
    }

    // ── Agenda ───────────────────────────────────────────────────────────────
    const TITULO = 'Inglês com a Yara 🐾';
    const DETALHES = 'Seu plano de hoje no Capy English: trilha, conversa com a Yara e revisão (15 min).\nhttps://www.capyenglish.com.br/';

    function linkGoogle(h = horario(), dia = diaBR()) {
        const [hh, mm] = h.split(':').map(Number);
        const ini = `${dia.replace(/-/g, '')}T${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
        const fimMin = hh * 60 + mm + MINUTOS;
        const fim = `${dia.replace(/-/g, '')}T${String(Math.floor(fimMin / 60) % 24).padStart(2, '0')}${String(fimMin % 60).padStart(2, '0')}00`;
        const p = new URLSearchParams({ action: 'TEMPLATE', text: TITULO, details: DETALHES, dates: `${ini}/${fim}`, ctz: TZ, recur: 'RRULE:FREQ=DAILY' });
        return 'https://calendar.google.com/calendar/render?' + p.toString();
    }

    function linkIcs(h = horario()) { return `/api/agenda.ics?hora=${encodeURIComponent(h)}`; }

    window.CapyPlano = { hoje, horario, salvarHorario, linkGoogle, linkIcs, _proximaMini: proximaMini };
})();
