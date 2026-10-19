/* ❤️ Vidas do plano grátis (regras do Luis, 19/out/2026).
 *
 * Só na TRILHA DIÁRIA (lessons.html): 5 vidas, cada erro numa pergunta gasta 1,
 * e volta 1 a cada 4 horas. Cursos, jogos e prática solta não gastam vida (o
 * limite deles é só a IA). Quem conta é o servidor (GET /api/vidas, POST
 * /api/vidas/errou); aqui só se mostra o contador e se avisa o erro. Pro e
 * Super não veem nada.
 *
 * Um erro é o som de erro (CapySound.wrong) tocado DENTRO de uma das respostas
 * de pergunta da trilha (RESPOSTAS_DA_TRILHA). A pronúncia também toca esse som
 * quando o reconhecimento de voz não entende, e não gasta vida.
 *
 * Em toda página, também guarda o código de convite de um link ?convite=... e,
 * quando o aluno entra na conta, manda para POST /api/convite/aceitar.
 */
(function () {
    if (window.__capyVidas) return;
    const Vidas = window.__capyVidas = { ativo: false, vidas: null, max: 5, proximaEm: null };
    // The landing loads this only to keep an invite code (data-so-convite).
    const soConvite = !!(document.currentScript && document.currentScript.hasAttribute('data-so-convite'));

    // ── Convite: guarda o código do link para quando o aluno tiver conta ───────
    try {
        const cod = new URLSearchParams(location.search).get('convite');
        if (cod && /^[a-z0-9]{10}$/i.test(cod)) localStorage.setItem('capyConvite', cod.toLowerCase());
    } catch (e) {}

    // ── Onde a vida conta: só nas perguntas da trilha diária ─────────────────
    const NA_TRILHA = /(^|\/)lessons\.html$/.test(location.pathname);
    const RESPOSTAS_DA_TRILHA = ['answerQuiz', 'answerReview', 'answerListen', 'answerSpeed'];
    let respondendo = 0;     // > 0 while one of those answers runs
    let errouAgora = false;

    // ── Contador ─────────────────────────────────────────────────────────────
    let selo = null;
    function desenharSelo() {
        if (!selo) {
            selo = document.createElement('div');
            selo.id = 'capy-vidas';
            selo.setAttribute('role', 'status');
            selo.style.cssText = 'position:fixed;top:76px;right:12px;z-index:45;background:#fff;color:#001f3f;'
                + 'font:800 14px "Plus Jakarta Sans",system-ui,sans-serif;padding:6px 12px;border-radius:9999px;'
                + 'box-shadow:0 4px 14px rgba(0,31,63,.15);cursor:pointer;user-select:none';
            selo.addEventListener('click', () => abrirAviso(false));
            document.body.appendChild(selo);
        }
        selo.textContent = `❤️ ${Vidas.vidas}`;
        selo.title = Vidas.vidas > 0 ? `${Vidas.vidas} de ${Vidas.max} vidas` : 'Sem vidas agora';
        selo.style.opacity = Vidas.vidas > 0 ? '1' : '.7';
    }

    function falta(iso) {
        const ms = iso ? new Date(iso).getTime() - Date.now() : 0;
        if (!(ms > 0)) return 'em instantes';
        const h = Math.floor(ms / 3600000), m = Math.ceil((ms % 3600000) / 60000);
        return h ? `em ${h}h ${m}min` : `em ${m} min`;
    }

    // ── Aviso (sem vidas, ou ao tocar no contador) ───────────────────────────
    function botao(texto, fundo, cor, acao) {
        const b = document.createElement(acao ? 'button' : 'a');
        b.textContent = texto;
        b.style.cssText = `display:block;width:100%;margin-top:10px;padding:13px 16px;border:0;border-radius:9999px;`
            + `background:${fundo};color:${cor};font-family:inherit;font-weight:800;font-size:15px;text-align:center;text-decoration:none;cursor:pointer`;
        if (acao) { b.type = 'button'; b.addEventListener('click', acao); }
        return b;
    }

    function abrirAviso(semVidas) {
        document.getElementById('capy-vidas-aviso')?.remove();
        const fundo = document.createElement('div');
        fundo.id = 'capy-vidas-aviso';
        fundo.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,31,63,.6);backdrop-filter:blur(6px);'
            + 'display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Plus Jakarta Sans",system-ui,sans-serif';
        fundo.addEventListener('click', e => { if (e.target === fundo) fundo.remove(); });
        const caixa = document.createElement('div');
        caixa.setAttribute('role', 'dialog');
        caixa.setAttribute('aria-modal', 'true');
        caixa.style.cssText = 'background:#fff;color:#001f3f;border-radius:1.5rem;padding:24px;max-width:360px;width:100%;text-align:center';
        const emoji = document.createElement('div');
        emoji.style.cssText = 'font-size:44px';
        emoji.textContent = semVidas ? '💔' : '❤️';
        const titulo = document.createElement('h2');
        titulo.style.cssText = 'font-size:20px;font-weight:900;margin:8px 0 4px';
        titulo.textContent = semVidas ? 'Suas vidas acabaram' : `${Vidas.vidas} de ${Vidas.max} vidas`;
        const texto = document.createElement('p');
        texto.style.cssText = 'font-size:14px;color:#475569;margin:0 0 6px';
        texto.textContent = Vidas.vidas < Vidas.max
            ? `Cada erro numa pergunta gasta 1 vida. A próxima volta ${falta(Vidas.proximaEm)}.`
            : 'Cada erro numa pergunta gasta 1 vida, e elas voltam sozinhas: 1 a cada 4 horas.';
        const aviso = document.createElement('p');
        aviso.style.cssText = 'font-size:13px;font-weight:700;color:#059669;min-height:18px;margin:6px 0 0';
        caixa.append(emoji, titulo, texto,
            botao('🔗 Convidar um amigo (+5 vidas)', '#ec4899', '#fff', () => convidar(aviso)),
            Object.assign(botao('💎 Vidas ilimitadas no Pro', '#001f3f', '#fff'), { href: 'landing.html#pricing' }),
            botao(semVidas ? 'Esperar a recarga' : 'Fechar', '#f1f5f9', '#001f3f', () => fundo.remove()),
            aviso);
        fundo.appendChild(caixa);
        document.body.appendChild(fundo);
    }

    async function convidar(aviso) {
        aviso.style.color = '#059669';
        aviso.textContent = 'Gerando seu link…';
        try {
            const r = await fetch('/api/convite', { credentials: 'same-origin' });
            const d = await r.json();
            if (!r.ok || !d.link) throw new Error();
            const msg = 'Estou aprendendo inglês com a Yara no Capy English. Entra pelo meu link e a gente ganha vidas extras:';
            if (navigator.share) {
                try { await navigator.share({ title: 'Capy English', text: msg, url: d.link }); aviso.textContent = 'Convite enviado! Quando seu amigo confirmar o e-mail, vocês dois ganham.'; return; }
                catch (e) { if (e && e.name === 'AbortError') { aviso.textContent = ''; return; } }
            }
            await navigator.clipboard.writeText(`${msg} ${d.link}`);
            aviso.textContent = 'Link copiado! Mande para um amigo: quando ele confirmar o e-mail, vocês dois ganham.';
        } catch (e) {
            aviso.style.color = '#ba1a1a';
            aviso.textContent = 'Não deu para gerar o link agora. Tente de novo.';
        }
    }

    // ── Embrulha as respostas da trilha e o som de erro ───────────────────────
    function embrulhar() {
        const som = window.CapySound;
        if (som && typeof som.wrong === 'function' && !som.wrong.__capyVidas) {
            const tocar = som.wrong;
            som.wrong = function (...args) {
                if (respondendo > 0) errouAgora = true;
                return tocar.apply(this, args);
            };
            som.wrong.__capyVidas = true;
        }
        for (const nome of RESPOSTAS_DA_TRILHA) {
            const original = window[nome];
            if (typeof original !== 'function' || original.__capyVidas) continue;
            const embrulhada = function (...args) {
                if (Vidas.ativo && Vidas.vidas <= 0) { abrirAviso(true); return; }
                respondendo++;
                errouAgora = false;
                try {
                    return original.apply(this, args);
                } finally {
                    respondendo--;
                    if (Vidas.ativo && errouAgora) perder();
                    errouAgora = false;
                }
            };
            embrulhada.__capyVidas = true;
            window[nome] = embrulhada;
        }
    }

    async function perder() {
        Vidas.vidas = Math.max(0, Vidas.vidas - 1);
        desenharSelo();
        try {
            const r = await fetch('/api/vidas/errou', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
            const d = await r.json();
            if (d.ilimitado) { Vidas.ativo = false; selo?.remove(); return; }
            if (typeof d.vidas === 'number') { Vidas.vidas = d.vidas; Vidas.proximaEm = d.proximaEm; desenharSelo(); }
        } catch (e) {}
        if (Vidas.vidas <= 0) setTimeout(() => abrirAviso(true), 1800);
    }

    async function aceitarConvite() {
        let cod = null;
        try { cod = localStorage.getItem('capyConvite'); } catch (e) {}
        if (!cod) return;
        try {
            const r = await fetch('/api/convite/aceitar', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo: cod }) });
            if (r.status >= 500) return;           // try again on the next page
            const d = await r.json().catch(() => ({}));
            try { localStorage.removeItem('capyConvite'); } catch (e) {}
            if (d.status === 'ok') {
                const t = document.createElement('div');
                t.setAttribute('role', 'status');
                t.style.cssText = 'position:fixed;left:50%;top:84px;transform:translateX(-50%);z-index:300;background:#10b981;color:#fff;'
                    + 'font:800 14px "Plus Jakarta Sans",system-ui,sans-serif;padding:10px 16px;border-radius:9999px;box-shadow:0 6px 20px rgba(0,0,0,.2)';
                t.textContent = `🎉 Convite aceito: você e seu amigo ganharam +${d.premio.vidas} vidas e +${d.premio.ia} créditos de IA`;
                document.body.appendChild(t);
                setTimeout(() => t.remove(), 6000);
            }
        } catch (e) {}
    }

    async function iniciar() {
        if (soConvite || !window.Auth || typeof Auth.ready !== 'function') return;   // só guarda o convite
        let user = null;
        try { user = await Auth.ready(); } catch (e) {}
        if (!user || user.role === 'guest') return;
        await aceitarConvite();
        if (!NA_TRILHA) return;              // lives only on the daily trail
        try {
            const r = await fetch('/api/vidas', { credentials: 'same-origin' });
            if (!r.ok) return;
            const d = await r.json();
            if (d.ilimitado || typeof d.vidas !== 'number') return;
            Object.assign(Vidas, { ativo: true, vidas: d.vidas, max: d.max || 5, proximaEm: d.proximaEm });
            desenharSelo();
            embrulhar();
        } catch (e) {}
    }

    Vidas.embrulhar = embrulhar;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
