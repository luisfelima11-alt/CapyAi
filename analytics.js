/* Google Analytics 4 com aviso de cookies (LGPD), regra do Luis em 19/out/2026.
 *
 * Nada do Google carrega antes de o visitante aceitar: o gtag.js só é baixado depois do
 * "Aceitar" (Consent Mode no modo básico). Recusar fica guardado e o aviso não volta.
 * A escolha mora em localStorage.capyCookies ('aceito' | 'recusado'), e
 * CapyAnalytics.preferencias() reabre o aviso (link na política de privacidade).
 *
 * Eventos: os do funil próprio (window.capyTrack, components.js) vão também para o GA com o
 * mesmo nome, e os cliques em checkout (Kiwify) e WhatsApp viram begin_checkout e
 * generate_lead. Nunca vai dado pessoal: só o nome do evento e o id da lição.
 *
 * Sem um ID de medição de verdade em GA_ID, ou fora do domínio de produção, não faz nada.
 */
(function () {
    if (window.CapyAnalytics) return;

    const GA_ID = 'G-XXXXXXXXXX';   // trocar pelo ID do fluxo da Web (Admin → Fluxos de dados)
    const DOMINIOS = ['www.capyenglish.com.br', 'capyenglish.com.br'];
    const CHAVE = 'capyCookies';

    const ativo = /^G-[A-Z0-9]{6,12}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX'
        && DOMINIOS.includes(location.hostname) && window.top === window.self;

    let carregado = false;
    const fila = [];

    function lerEscolha() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
    function gravarEscolha(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

    function carregar() {
        if (carregado || !ativo) return;
        carregado = true;
        window.gtag = gtag;
        gtag('consent', 'default', {
            analytics_storage: 'granted', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied',
        });
        gtag('js', new Date());
        gtag('config', GA_ID);
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
        document.head.appendChild(s);
        while (fila.length) { const [n, p] = fila.shift(); gtag('event', n, p); }
    }

    function apagarCookiesDoGa() {
        const dominio = '.' + location.hostname.replace(/^www\./, '');
        document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => /^_ga/.test(n)).forEach(n => {
            document.cookie = `${n}=; Max-Age=0; path=/; domain=${dominio}`;
            document.cookie = `${n}=; Max-Age=0; path=/`;
        });
    }

    function evento(nome, params) {
        if (!ativo || !/^[a-z][a-z0-9_]{0,39}$/.test(String(nome))) return;
        const p = {};
        if (params && params.lessonId != null && /^[A-Za-z0-9_.-]{1,40}$/.test(String(params.lessonId))) p.lesson_id = String(params.lessonId);
        if (params && typeof params.valor === 'string' && /^[a-z0-9_-]{1,40}$/.test(params.valor)) p.valor = params.valor;
        if (carregado) gtag('event', nome, p);
        else if (lerEscolha() !== 'recusado' && fila.length < 20) fila.push([nome, p]);
    }

    // ── Aviso de cookies ─────────────────────────────────────────────────────
    function botao(texto, primario, acao) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = texto;
        b.style.cssText = 'border:0;border-radius:9999px;padding:10px 18px;font:800 14px "Plus Jakarta Sans",system-ui,sans-serif;cursor:pointer;'
            + (primario ? 'background:#ec4899;color:#fff' : 'background:rgba(255,255,255,.14);color:#fff');
        b.addEventListener('click', acao);
        return b;
    }

    function mostrarAviso() {
        if (!ativo || document.getElementById('capy-cookies')) return;
        const caixa = document.createElement('div');
        caixa.id = 'capy-cookies';
        caixa.setAttribute('role', 'dialog');
        caixa.setAttribute('aria-label', 'Aviso de cookies');
        caixa.setAttribute('translate', 'no');
        const celular = window.matchMedia('(max-width: 767px)').matches;
        caixa.style.cssText = 'position:fixed;left:12px;right:12px;z-index:250;margin:0 auto;max-width:640px;'
            + `bottom:calc(env(safe-area-inset-bottom, 0px) + ${celular ? 88 : 16}px);`
            + 'background:#001f3f;color:#fff;border-radius:1.5rem;padding:16px 18px;box-shadow:0 12px 32px rgba(0,31,63,.35);'
            + 'font:500 14px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:12px;align-items:center';
        const texto = document.createElement('p');
        texto.style.cssText = 'margin:0;flex:1 1 260px';
        texto.append('🍪 Usamos cookies do Google Analytics para entender como o site é usado e melhorar as aulas. ');
        const link = document.createElement('a');
        link.href = '/privacidade.html#cookies';
        link.textContent = 'Saiba mais';
        link.style.cssText = 'color:#f9a8d4;font-weight:800';
        texto.appendChild(link);
        const acoes = document.createElement('div');
        acoes.style.cssText = 'display:flex;gap:8px;margin-left:auto';
        acoes.append(
            botao('Recusar', false, () => { gravarEscolha('recusado'); fila.length = 0; apagarCookiesDoGa(); caixa.remove(); }),
            botao('Aceitar', true, () => { gravarEscolha('aceito'); caixa.remove(); carregar(); }),
        );
        caixa.append(texto, acoes);
        document.body.appendChild(caixa);
    }

    function preferencias() {
        if (!ativo) return;
        const antes = lerEscolha();
        try { localStorage.removeItem(CHAVE); } catch (e) {}
        if (antes === 'aceito' && carregado) {
            // Para de medir já; o gtag.js carregado só sai com um novo carregamento da página.
            gtag('consent', 'update', { analytics_storage: 'denied' });
        }
        mostrarAviso();
    }

    // ── Liga nos eventos que o site já tem ───────────────────────────────────
    function ligarEventos() {
        const original = window.capyTrack;
        if (typeof original === 'function' && !original.__capyGa) {
            const embrulhado = function (event, meta) {
                try { evento(event, meta); } catch (e) {}
                return original.apply(this, arguments);
            };
            embrulhado.__capyGa = true;
            window.capyTrack = embrulhado;
        }
        document.addEventListener('click', e => {
            const a = e.target && e.target.closest && e.target.closest('a[href]');
            if (!a) return;
            const href = a.getAttribute('href') || '';
            if (/kiwify\.com|pay\.kiwify/i.test(href)) evento('begin_checkout', {});
            else if (/wa\.me|api\.whatsapp\.com/i.test(href)) evento('generate_lead', { valor: 'whatsapp' });
        }, true);
    }

    window.CapyAnalytics = { evento, preferencias, ativo };

    function iniciar() {
        if (!ativo) return;
        ligarEventos();
        const escolha = lerEscolha();
        if (escolha === 'aceito') carregar();
        else if (escolha !== 'recusado') mostrarAviso();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
