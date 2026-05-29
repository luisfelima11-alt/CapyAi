/**
 * tts-fr.js — Browser Speech Synthesis for French course pages
 * Uses the system's fr-FR voice (Chrome/Edge/Safari have good native French voices).
 * Include AFTER lesson-engine.js so it overrides window.speak.
 */
(function () {
  function speakFr(text) {
    if (!text || !window.speechSynthesis) return;
    const clean = text.replace(/<[^>]+>/g, '').trim();
    if (!clean) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'fr-FR';
    u.rate = 0.85;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  }

  window.speak   = speakFr;
  window.speakFr = speakFr;
})();
