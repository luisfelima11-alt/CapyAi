/* capy-presence.js — a capivara "viva" no palco da ai_chat.html (8/out).
 *
 * So apresentacao: nao mexe em microfone, rede da conversa, cota nem login.
 * Le o data-estado do #palco (que a pagina e o CapyChamada atualizam) e decide
 * qual clipe toca:
 *   ia_falando, ou resposta escrita aparecendo ........ fala
 *   aluno na vez dele na ligacao (se houver `ouvindo`) . ouvindo
 *   qualquer outro ..................................... parada
 * Cada capivara traz os clipes dela no /api/personas (`clipes`). Antes so a Yara
 * padrao se mexia: a capivara do agro ficava foto parada (relato do Luis, 7/out).
 *
 * Rede e bateria:
 *   - zero bytes de video antes do 1o toque ou tecla do aluno;
 *   - nada com movimento reduzido, economia de dados ou conexao 2g;
 *   - clipe que deu erro nao e tentado de novo nesta visita (fica a foto);
 *   - pausa com a aba oculta, no pagehide e depois de 90 s sem interacao
 *     (fora de ligacao).
 *
 * Dois <video> se revezam: o proximo clipe carrega por baixo e so aparece no
 * `playing`, com fusao. Trocar o src do mesmo <video> mostrava um quadro preto.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const palco = $('palco');
  const videos = palco ? Array.prototype.slice.call(palco.querySelectorAll('.quadro video')) : [];
  const botao = $('btn-movimento');
  if (!palco || videos.length < 2) return;

  const CHAVE = 'capyPresenceMotion';   // a mesma chave de antes: quem pausou continua pausado
  const OCIOSO_MS = 90000;
  const CLIPE_VALIDO = /^[a-z0-9-]+\.mp4$/;
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const conexao = navigator.connection || null;
  const economia = () => !!(conexao && (conexao.saveData || /(^|-)2g$/.test(conexao.effectiveType || '')));

  let arte = videos[0].getAttribute('poster') || '';
  let clipes = null;
  let ligado = true;
  try { if (localStorage.getItem(CHAVE) === 'off') ligado = false; } catch (_) {}
  let interagiu = false;
  let visivel = 0;
  let revisao = 0;
  let falaAte = 0, falaTimer = 0;
  let ultimoToque = Date.now(), ociosoTimer = 0;
  const falhou = new Set();

  // iOS so toca sem gesto se `muted` estiver no atributo E na propriedade.
  videos.forEach(v => { v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.playsInline = true; });

  // So aceita nome de arquivo da raiz: o catalogo e nosso, mas e barato conferir.
  function normalizar(c) {
    if (!c || typeof c !== 'object') return null;
    const ok = {};
    ['parada', 'fala', 'ouvindo'].forEach(k => { if (typeof c[k] === 'string' && CLIPE_VALIDO.test(c[k])) ok[k] = c[k]; });
    return ok.parada ? ok : null;
  }

  const disponivel = () => !reduzido.matches && !economia() && !!clipes;
  const emLigacao = () => ['microfone', 'conectando', 'ouvindo', 'falando', 'ia_falando'].indexOf(palco.dataset.estado) >= 0;
  const ocioso = () => Date.now() - ultimoToque > OCIOSO_MS && !emLigacao() && Date.now() >= falaAte;

  function clipeDesejado() {
    if (!clipes) return '';
    const usavel = c => !!c && !falhou.has(c);
    const e = palco.dataset.estado;
    if ((e === 'ia_falando' || Date.now() < falaAte) && usavel(clipes.fala)) return clipes.fala;
    if ((e === 'ouvindo' || e === 'falando') && usavel(clipes.ouvindo)) return clipes.ouvindo;
    return usavel(clipes.parada) ? clipes.parada : '';
  }

  function pintarBotao() {
    palco.dataset.movimento = ligado ? 'on' : 'off';
    if (!botao) return;
    botao.hidden = !disponivel();
    botao.setAttribute('aria-pressed', String(ligado));
    botao.title = ligado ? 'Pausar o movimento' : 'Animar a capivara';
  }

  function mostrar(i) {
    visivel = i;
    videos[i].style.opacity = '1';
    videos[1 - i].style.opacity = '0';
  }

  function carregar(v, clipe) {
    v.onplaying = null;
    v.dataset.clipe = clipe;
    v.poster = arte;
    v.preload = 'auto';
    v.src = clipe;
    try { v.load(); } catch (_) {}
  }

  function descarregar(v) {
    v.onplaying = null;
    try { v.pause(); } catch (_) {}
    delete v.dataset.clipe;
    if (v.getAttribute('src')) {
      v.removeAttribute('src');
      try { v.load(); } catch (_) {}
    }
  }

  // play() recusado (iOS em pouca energia, autoplay bloqueado): fica a foto.
  function tocar(v, rev) {
    let p = null;
    try { p = v.play(); } catch (_) {}
    if (p && p.catch) p.catch(() => { if (rev === revisao && v === videos[visivel]) palco.dataset.video = 'off'; });
  }

  // Com o `parada` no ar, o `fala` ja vai carregando no <video> de tras: assim a
  // 1a resposta dela nao espera download. Com economia de dados, nao.
  function preCarregar() {
    if (!clipes || !clipes.fala || falhou.has(clipes.fala) || economia()) return;
    const frente = videos[visivel], tras = videos[1 - visivel];
    if (frente.dataset.clipe === clipes.fala || tras.dataset.clipe === clipes.fala) return;
    carregar(tras, clipes.fala);
  }

  function sync() {
    pintarBotao();
    const alvo = ligado && disponivel() && interagiu && !document.hidden && !ocioso() ? clipeDesejado() : '';
    if (!alvo) {
      revisao++;
      videos.forEach(v => { v.onplaying = null; try { v.pause(); } catch (_) {} });
      palco.dataset.video = 'off';
      return;
    }
    const iFrente = visivel, iTras = 1 - visivel;
    const frente = videos[iFrente], tras = videos[iTras];
    const rev = ++revisao;
    if (frente.dataset.clipe === alvo) {
      tras.onplaying = null;
      try { tras.pause(); } catch (_) {}
      tocar(frente, rev);
      return;
    }
    if (tras.dataset.clipe !== alvo) carregar(tras, alvo);
    tras.onplaying = () => {
      tras.onplaying = null;
      if (rev !== revisao) return;
      mostrar(iTras);
      palco.dataset.video = 'on';
      setTimeout(() => { if (rev === revisao) { try { frente.pause(); } catch (_) {} } }, 240);
      preCarregar();
    };
    tocar(tras, rev);
  }

  videos.forEach((v, i) => {
    v.addEventListener('playing', () => { if (i === visivel) palco.dataset.video = 'on'; });
    v.addEventListener('error', () => {
      const c = v.dataset.clipe;
      if (!c || !v.getAttribute('src')) return;
      falhou.add(c);
      descarregar(v);
      if (i === visivel) palco.dataset.video = 'off';
      sync();
    });
  });

  // 1o toque libera o video; cada toque adia a pausa por ociosidade.
  function toque(ev) {
    const noBotao = ev.target && ev.target.closest && ev.target.closest('#btn-movimento');
    const estavaOcioso = ocioso();
    ultimoToque = Date.now();
    clearTimeout(ociosoTimer);
    ociosoTimer = setTimeout(sync, OCIOSO_MS + 50);
    if (!interagiu && !noBotao) { interagiu = true; sync(); }
    else if (estavaOcioso) sync();
  }
  document.addEventListener('pointerdown', toque, true);
  document.addEventListener('keydown', toque, true);
  document.addEventListener('touchstart', toque, { capture: true, passive: true });
  document.addEventListener('wheel', toque, { capture: true, passive: true });

  if (botao) botao.addEventListener('click', () => {
    ligado = !ligado;
    interagiu = true;
    try { localStorage.setItem(CHAVE, ligado ? 'on' : 'off'); } catch (_) {}
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => videos.forEach(v => { try { v.pause(); } catch (_) {} }));
  if (reduzido.addEventListener) reduzido.addEventListener('change', sync);
  if (conexao && conexao.addEventListener) conexao.addEventListener('change', sync);

  window.CapyPresence = Object.freeze({
    sync,
    // Aceita { arte, clipes } ou so a arte (string), como a versao anterior.
    setPersona(p) {
      const novaArte = typeof p === 'string' ? p : (p && p.arte) || arte;
      const novos = typeof p === 'string' ? null : normalizar(p && p.clipes);
      const mudou = novaArte !== arte || JSON.stringify(novos) !== JSON.stringify(clipes);
      arte = novaArte;
      clipes = novos;
      videos.forEach(v => { v.poster = arte; });
      if (mudou) {
        revisao++;
        videos.forEach(descarregar);
        mostrar(0);
        falaAte = 0;
        palco.dataset.video = 'off';
      }
      sync();
    },
    // Resposta ESCRITA: o clipe falando toca pelo tempo de leitura,
    // entre 2,2 s e 7 s (55 ms por caractere).
    falarTexto(texto) {
      const ms = Math.min(7000, Math.max(2200, 55 * String(texto || '').length));
      falaAte = Date.now() + ms;
      clearTimeout(falaTimer);
      falaTimer = setTimeout(sync, ms + 20);
      sync();
    },
  });

  palco.dataset.video = 'off';
  mostrar(0);
  sync();
})();
