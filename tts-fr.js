/**
 * tts-fr.js — voz da OpenAI (gpt-4o-mini-tts, sotaque francês) nas aulas de francês.
 * Include DEPOIS do components.js (usa o CapyAudio, o áudio que o primeiro toque libera no
 * iPhone) e do lesson-engine.js, para trocar window.speak. Se a voz da OpenAI falhar, cai na
 * voz do navegador (fr-FR), uma vez só.
 *
 *   speakFr(texto)       fala e esquece.
 *   speakFrEnd(texto)    devolve uma Promise: true quando a fala terminou, false se foi
 *                        interrompida. Usada pelo "Ouvir diálogo completo".
 *   speakFrStop()        para tudo.
 *
 * A voz lê só a frase em francês: o que está entre parênteses (tradução em português,
 * "(e)" de Enchanté(e), "(de)" de Avoir peur (de)) é pulado e continua na tela.
 * O áudio fica no mesmo cache do CapyTTS (capy-tts-v1), então a frase é paga uma vez só.
 */
(function () {
  const CACHE = 'capy-tts-v1';
  let turno = 0;
  let encerraAnterior = null;

  function paraFala(text) {
    return String(text || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s*\[[^\]]*\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);
  }

  function vozDoNavegador(clean, fim) {
    try {
      if (!window.speechSynthesis) { fim(false); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'fr-FR'; u.rate = 0.85; u.pitch = 1.05;
      u.onend = () => fim(true);
      u.onerror = () => fim(false);
      speechSynthesis.speak(u);
    } catch (e) { fim(false); }
  }

  async function baixa(clean) {
    const chave = '/__capy-tts-cache/fr/' + encodeURIComponent(clean.toLowerCase());
    let cache = null, blob = null;
    try {
      if (window.caches) {
        cache = await caches.open(CACHE);
        const hit = await cache.match(chave);
        if (hit) blob = await hit.blob();
      }
    } catch (e) { cache = null; }
    if (!blob) {
      const r = await fetch('/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova&lang=fr');
      if (!r.ok) throw new Error('tts_http_' + r.status);
      blob = await r.blob();
      if (cache && blob.size > 500) {
        try { await cache.put(chave, new Response(blob.slice(0), { headers: { 'Content-Type': 'audio/mpeg' } })); } catch (e) {}
      }
    }
    return blob;
  }

  function speakFrStop() {
    turno++;
    if (encerraAnterior) { encerraAnterior(false); encerraAnterior = null; }
    try { if (window.CapyAudio) window.CapyAudio.stop(); } catch (e) {}
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  }

  function speakFrEnd(text) {
    const clean = paraFala(text);
    if (!clean) return Promise.resolve(false);
    speakFrStop();
    const meu = turno;
    return new Promise(resolve => {
      let feito = false;
      const fim = v => { if (!feito) { feito = true; if (encerraAnterior === fim) encerraAnterior = null; resolve(v); } };
      encerraAnterior = fim;
      (async () => {
        try {
          const blob = await baixa(clean);
          if (meu !== turno) return fim(false);
          const url = URL.createObjectURL(blob);
          const solta = () => { try { URL.revokeObjectURL(url); } catch (e) {} };
          const aoFalhar = () => { solta(); if (meu === turno) vozDoNavegador(clean, fim); else fim(false); };
          if (window.CapyAudio) {
            await window.CapyAudio.play(url, { onended: () => { solta(); fim(true); }, onerror: aoFalhar });
          } else {
            const a = new Audio(url);
            a.onended = () => { solta(); fim(true); };
            a.onerror = aoFalhar;
            await a.play();
          }
        } catch (e) {
          if (meu === turno) vozDoNavegador(clean, fim); else fim(false);
        }
      })();
    });
  }

  function speakFr(text) { speakFrEnd(text); }

  window.speak = speakFr;
  window.speakFr = speakFr;
  window.speakFrEnd = speakFrEnd;
  window.speakFrStop = speakFrStop;
})();
