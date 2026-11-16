/**
 * tts-en.js — OpenAI TTS override for English lesson pages
 * Uses Nova voice via /api/tts. Fallback to browser Speech Synthesis.
 * Include AFTER lesson-engine.js so it overrides window.speak/speakRaw.
 *
 *   speakEnEnd(texto, { voice, mp3 })  devolve uma Promise: true quando a fala terminou,
 *                        false se foi interrompida (página de Preparação). Tenta, nesta
 *                        ordem: o mp3 gravado da fala (se a aula tiver), a voz da OpenAI
 *                        (/api/tts, com a voz pedida) e a voz do navegador.
 *   speakEnStop()        para a fala do speakEnEnd.
 */
(function () {
  let _currentAudio = null;
  let _speakId = 0;

  function fallbackSpeak(clean) {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'en-US'; u.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  async function speakEn(text) {
    if (!text || !text.trim()) return;
    const clean = text.replace(/<[^>]+>/g, '').trim();
    if (!clean) return;

    // CapyAudio (components.js) holds the element the first touch unlocked,
    // which is what lets the iPhone play it. Pages without it keep new Audio().
    const shared = window.CapyAudio;
    if (_currentAudio) {
      if (shared) shared.stop();
      else { _currentAudio.onerror = null; _currentAudio.pause(); }
      _currentAudio = null;
    }
    const speakId = ++_speakId;

    const url = '/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova';
    const onended = () => { if (_speakId === speakId) _currentAudio = null; };
    // A failed clip fires onerror and also rejects play(): speak once.
    let fellBack = false;
    const onerror = () => {
      if (fellBack || _speakId !== speakId) return;
      fellBack = true;
      _currentAudio = null;
      fallbackSpeak(clean);
    };

    try {
      if (shared) {
        _currentAudio = shared.element();
        await shared.play(url, { onended, onerror });
      } else {
        const audio = new Audio(url);
        _currentAudio = audio;
        audio.onended = onended;
        audio.onerror = onerror;
        await audio.play();
      }
    } catch (e) {
      onerror();
    }
  }

  // Override global speak used by lesson-engine.js and older pages
  window.speak   = speakEn;
  window.speakEn = speakEn;

  // Also override speakRaw used by lesson-engine.js buildSpeak()
  const _origSpeakRaw = window.speakRaw;
  window.speakRaw = function(i) {
    if (window._SPEAK_DATA && window._SPEAK_DATA[i]) {
      const plain = window._SPEAK_DATA[i].text
        ? window._SPEAK_DATA[i].text.replace(/<[^>]+>/g, '')
        : String(window._SPEAK_DATA[i]);
      speakEn(plain);
    } else if (_origSpeakRaw) {
      _origSpeakRaw(i);
    }
  };
  // ── Fala com fim (speakEnEnd / speakEnStop), no modelo do tts-fr.js ───────────
  // O áudio da OpenAI fica no cache capy-tts-v1 (uma entrada por voz): a frase é
  // paga uma vez só por aparelho.
  const VOZES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  const CACHE = 'capy-tts-v1';
  let turno = 0;
  let encerraAnterior = null;

  function paraFala(text) {
    return String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
  }

  function vozDoNavegador(clean, fim) {
    try {
      if (!window.speechSynthesis) { fim(false); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-US'; u.rate = 0.9;
      u.onend = () => fim(true);
      u.onerror = () => fim(false);
      speechSynthesis.speak(u);
    } catch (e) { fim(false); }
  }

  async function baixa(clean, voice) {
    const chave = '/__capy-tts-cache/en-' + voice + '/' + encodeURIComponent(clean.toLowerCase());
    let cache = null, blob = null;
    try {
      if (window.caches) {
        cache = await caches.open(CACHE);
        const hit = await cache.match(chave);
        if (hit) blob = await hit.blob();
      }
    } catch (e) { cache = null; }
    if (!blob) {
      const r = await fetch('/api/tts?text=' + encodeURIComponent(clean) + '&voice=' + voice);
      if (!r.ok) throw new Error('tts_http_' + r.status);
      blob = await r.blob();
      if (cache && blob.size > 500) {
        try { await cache.put(chave, new Response(blob.slice(0), { headers: { 'Content-Type': 'audio/mpeg' } })); } catch (e) {}
      }
    }
    return blob;
  }

  async function toca(url, onended, onerror) {
    if (window.CapyAudio) return window.CapyAudio.play(url, { onended, onerror });
    const a = new Audio(url);
    a.onended = onended;
    a.onerror = onerror;
    return a.play();
  }

  function speakEnStop() {
    turno++;
    if (encerraAnterior) { encerraAnterior(false); encerraAnterior = null; }
    try { if (window.CapyAudio) window.CapyAudio.stop(); } catch (e) {}
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  }

  function speakEnEnd(text, opts) {
    const clean = paraFala(text);
    if (!clean) return Promise.resolve(false);
    const voice = VOZES.includes(opts && opts.voice) ? opts.voice : 'nova';
    // Só áudio do próprio site, no lugar onde as aulas guardam as falas.
    const mp3 = opts && /^\/assets\/audio\/[a-z0-9]+\/[a-z0-9]+\.mp3$/.test(String(opts.mp3 || '')) ? opts.mp3 : '';
    speakEnStop();
    const meu = turno;
    return new Promise(resolve => {
      let feito = false;
      const fim = v => { if (!feito) { feito = true; if (encerraAnterior === fim) encerraAnterior = null; resolve(v); } };
      encerraAnterior = fim;
      const pelaIA = async () => {
        try {
          const blob = await baixa(clean, voice);
          if (meu !== turno) return fim(false);
          const url = URL.createObjectURL(blob);
          const solta = () => { try { URL.revokeObjectURL(url); } catch (e) {} };
          // Um áudio que falha dispara o onerror e também rejeita o play(): cai uma vez só.
          let caiu = false;
          const peloNavegador = () => {
            if (caiu) return; caiu = true; solta();
            if (meu === turno) vozDoNavegador(clean, fim); else fim(false);
          };
          try { await toca(url, () => { solta(); fim(true); }, peloNavegador); } catch (e) { peloNavegador(); }
        } catch (e) {
          if (meu === turno) vozDoNavegador(clean, fim); else fim(false);
        }
      };
      (async () => {
        if (!mp3) return pelaIA();
        let falhou = false;   // onerror + play() rejeitado: pede a voz da IA uma vez só
        const seFalhar = () => { if (falhou) return; falhou = true; if (meu === turno) pelaIA(); else fim(false); };
        try { await toca(mp3, () => fim(true), seFalhar); } catch (e) { seFalhar(); }
      })();
    });
  }

  window.speakEnEnd = speakEnEnd;
  window.speakEnStop = speakEnStop;
})();
