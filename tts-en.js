/**
 * tts-en.js — OpenAI TTS override for English lesson pages
 * Uses Nova voice via /api/tts. Fallback to browser Speech Synthesis.
 * Include AFTER lesson-engine.js so it overrides window.speak/speakRaw.
 */
(function () {
  let _currentAudio = null;

  async function speakEn(text) {
    if (!text || !text.trim()) return;
    const clean = text.replace(/<[^>]+>/g, '').trim();
    if (!clean) return;

    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio.src = '';
      _currentAudio = null;
    }

    try {
      const url = '/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova';
      const audio = new Audio(url);
      _currentAudio = audio;
      audio.onended = () => { _currentAudio = null; };
      audio.onerror = () => {
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(clean);
          u.lang = 'en-US'; u.rate = 0.9;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        }
        _currentAudio = null;
      };
      await audio.play();
    } catch (e) {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'en-US'; u.rate = 0.9;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      }
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
