/**
 * tts-en.js — OpenAI TTS override for English lesson pages
 * Uses Nova voice via /api/tts. Fallback to browser Speech Synthesis.
 * Include AFTER lesson-engine.js so it overrides window.speak/speakRaw.
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
})();
