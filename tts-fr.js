/**
 * tts-fr.js — OpenAI TTS override for French course pages
 * Uses OpenAI nova voice (speaks French natively). Fallback to browser Speech Synthesis.
 * Include AFTER lesson-engine.js so it overrides window.speak.
 */
(function () {
  let _currentAudio = null;

  async function speakFr(text) {
    if (!text || !text.trim()) return;
    // Strip HTML tags just in case
    const clean = text.replace(/<[^>]+>/g, '').trim();
    if (!clean) return;

    // Stop any currently playing audio
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio.src = '';
      _currentAudio = null;
    }

    try {
      const url = '/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova&lang=fr';
      const audio = new Audio(url);
      _currentAudio = audio;
      audio.onended = () => { _currentAudio = null; };
      audio.onerror = () => {
        // Fallback to browser TTS if ElevenLabs fails
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(clean);
          u.lang = 'fr-FR'; u.rate = 0.85;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        }
        _currentAudio = null;
      };
      await audio.play();
    } catch (e) {
      // Fallback
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'fr-FR'; u.rate = 0.85;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      }
    }
  }

  // Override speak globally on French pages
  window.speak    = speakFr;
  window.speakFr  = speakFr;
})();
