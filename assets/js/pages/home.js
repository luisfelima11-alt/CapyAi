/* Home nova (PR 3 de 3, 29/out/2026): saudação, semana, ligação com a Yara e
 * "Continuar o curso". O plano de hoje é o plano-hoje-cartao.js, que avisa com o
 * evento `capyPlanoHoje` (traz plano e vozTeste do /api/me, sem um 2º fetch).
 *
 * Tudo por textContent: o nome e o título da aula vêm de dados do aluno.
 */
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const TZ = 'America/Sao_Paulo';
    const TOTAL_AULAS = 44;
    const AULAS_GRATIS = 5;   // o mesmo FREE_LESSON_LIMIT do classes.html
    const estado = () => (window.Store && Store.state) || {};
    const hojeBR = () => (window.capyHojeBR ? capyHojeBR() : new Date().toLocaleDateString('en-CA', { timeZone: TZ }));
    const ler = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const medir = (evento, meta) => { try { if (window.capyTrack) capyTrack(evento, meta || {}); } catch (e) {} };

    function saudacao(d = new Date()) {
        const h = Number(d.toLocaleString('en-US', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' }));
        return h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
    }

    function primeiroNome(sessao, nomeDoStore) {
        const nome = String((sessao && sessao.name) || nomeDoStore || '').trim().split(/\s+/)[0] || '';
        return nome.slice(0, 24);
    }

    // Segunda a domingo da semana de hoje. "Feito" = dentro da sequência atual
    // (streakDays dias terminando em lastPracticeDate): o app não guarda o
    // histórico de dias, então um dia estudado antes de uma falha não aparece.
    function semana(hoje, streak, ultimo) {
        const dow = (new Date(hoje + 'T12:00:00Z').getUTCDay() + 6) % 7;
        const dias = [];
        for (let i = 0; i < 7; i++) {
            const dia = capyDiaBR(i - dow, hoje);
            const gap = ultimo ? capyDiasEntre(dia, ultimo) : null;
            dias.push({
                dia, n: Number(dia.slice(8)), letra: 'STQQSSD'[i],
                feito: streak > 0 && gap !== null && gap >= 0 && gap < streak && dia <= hoje,
                hoje: dia === hoje,
            });
        }
        return dias;
    }

    // normal (visitante ou sem informação) | teste (1ª ligação grátis) | super | convite (teste já usado)
    function estadoLigacao(plano, vozTeste) {
        if (plano === 'super') return 'super';
        if (vozTeste === 'disponivel') return 'teste';
        if (vozTeste === 'usado') return 'convite';
        return 'normal';
    }

    const LIGAR = {
        selo: '● YARA ONLINE', titulo: 'Pratique conversando agora',
        texto: 'Ligação de voz em inglês, no seu nível. Ela corrige com carinho e te devolve um resumo no fim.',
        acao: 'Ligar para a Yara', href: 'ai_chat.html#ligar', bola: '📞',
    };
    const CARTAO = {
        normal: { ...LIGAR, sub: 'Fale em inglês no seu ritmo' },
        teste: { ...LIGAR, sub: '🎁 1ª ligação: 3 min grátis' },
        super: { ...LIGAR, sub: '💎 Incluída no seu plano Super' },
        convite: {
            selo: '💎 PLANO SUPER', titulo: 'Gostou de falar com a Yara?',
            texto: 'No Super você liga para a Yara todo mês e treina a conversa de verdade, além de tudo do Pro.',
            acao: 'Conhecer o plano Super', sub: 'Ligações de voz com a Yara', href: 'landing.html#pricing', bola: '💎',
        },
    };

    // A última aula aberta no classes.html (capyUltimaAula). Aula paga para quem
    // é grátis volta para o classes.html, que mostra o paywall.
    function cursoAtual(registro, plano) {
        const r = registro || {};
        const n = Number(r.n);
        const ok = Number.isInteger(n) && n >= 1 && n <= TOTAL_AULAS
            && typeof r.href === 'string' && /^aula_\d{2}\.html$/.test(r.href) && typeof r.title === 'string';
        if (!ok) {
            return { sub: 'Comece o curso de inglês', titulo: 'Aula 1 — To Have, Want, Need & Like', pct: 0, href: 'classes.html' };
        }
        const pago = plano === 'pro' || plano === 'super';
        return {
            sub: `Continuar o curso de inglês · Aula ${n} de ${TOTAL_AULAS}`,
            titulo: `Aula ${n} — ${r.title.slice(0, 80)}`,
            pct: Math.round((n / TOTAL_AULAS) * 100),
            href: n > AULAS_GRATIS && !pago ? 'classes.html' : r.href,
        };
    }

    window.CapyHome = { saudacao, primeiroNome, semana, estadoLigacao, cursoAtual, CARTAO };
    if (!$('home-ligar')) return;   // carregado só para os testes

    let plano = null;
    let ligacao = 'normal';

    function desenharTopo() {
        const s = estado();
        let sessao = null;
        try { sessao = JSON.parse(ler('capySession') || 'null'); } catch (e) {}
        const nome = primeiroNome(sessao, s.playerName);
        $('home-saudacao').textContent = saudacao();
        $('home-nome').textContent = nome ? `${nome}!` : 'explorador!';
        $('home-streak').textContent = String(s.streakDays || 0);
        $('home-nivel').textContent = String(window.Store && Store.getLevel ? Store.getLevel() : 1);

        const ol = $('home-semana');
        ol.textContent = '';
        for (const d of semana(hojeBR(), s.streakDays || 0, s.lastPracticeDate || '')) {
            const li = document.createElement('li');
            li.className = 'dia text-center text-[10px] font-extrabold text-slate-500' + (d.feito ? ' feito' : '') + (d.hoje ? ' hoje' : '');
            li.textContent = d.letra;
            const b = document.createElement('b');
            b.textContent = d.feito ? '✓' : String(d.n);
            li.setAttribute('aria-label', `${d.dia}${d.feito ? ', estudou' : ''}${d.hoje ? ', hoje' : ''}`);
            li.appendChild(b);
            ol.appendChild(li);
        }
    }

    function desenharLigacao() {
        const c = CARTAO[ligacao];
        const card = $('home-ligar');
        card.dataset.estado = ligacao;
        card.classList.toggle('convite', ligacao === 'convite');
        $('hl-selo').textContent = c.selo;
        $('hl-selo').className = 'text-[11px] font-extrabold tracking-widest ' + (ligacao === 'convite' ? 'text-pink-200' : 'text-emerald-300');
        $('hl-titulo').textContent = c.titulo;
        $('hl-texto').textContent = c.texto;
        $('hl-acao').href = c.href;
        $('hl-bola').textContent = c.bola;
        $('hl-bola').classList.toggle('pulso', ligacao !== 'convite');
        $('hl-acao-titulo').textContent = c.acao;
        $('hl-acao-sub').textContent = c.sub;
    }

    function desenharCurso() {
        let reg = null;
        try { reg = JSON.parse(ler('capyUltimaAula') || 'null'); } catch (e) {}
        const c = cursoAtual(reg, plano || estado().planType);
        $('hc-sub').textContent = c.sub;
        $('hc-titulo').textContent = c.titulo;
        $('hc-barra').style.width = `${c.pct}%`;
        $('home-curso').href = c.href;
    }

    function tudo() { desenharTopo(); desenharCurso(); }

    document.addEventListener('capyPlanoHoje', e => {
        const p = e.detail || {};
        plano = p.plano || null;
        ligacao = estadoLigacao(p.plano, p.vozTeste);
        desenharLigacao();
        desenharCurso();
    });
    document.addEventListener('stateChanged', tudo);

    $('hl-acao').addEventListener('click', () => medir(ligacao === 'convite' ? 'home_super' : 'home_ligar', { estado: ligacao }));
    $('hl-chat').addEventListener('click', () => medir('home_chat', {}));
    $('home-curso').addEventListener('click', () => medir('home_curso', {}));
    $('ph-itens').addEventListener('click', e => {
        const a = e.target.closest('a');
        if (a) medir('home_plano', { item: a.dataset.item || '' });
    });

    tudo();
    desenharLigacao();
})();
