// Microfone e WebRTC falsos para os testes de voz no navegador. Roda DENTRO da
// pagina (context.addInitScript): nada de audio de verdade, nada de OpenAI.
// Usado por tests/realtime-voice.test.js (ai_chat, entrevista) e por
// tests/yara-widget.test.js (a ligacao de dentro das aulas).
function installBrowserVoiceMocks() {
  const mock = window.__voiceMock = { mode: 'success', tracks: [], peers: [], micCalls: 0, resolveMic: null };
  function stream() {
    const track = { enabled: true, stopped: false, stop() { this.stopped = true; } };
    mock.tracks.push(track);
    return { getTracks: () => [track], getAudioTracks: () => [track] };
  }
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => {
    mock.micCalls++;
    if (mock.mode === 'denied') throw new DOMException('Permission denied', 'NotAllowedError');
    if (mock.mode === 'pending') return new Promise(resolve => { mock.resolveMic = () => resolve(stream()); });
    return stream();
  } } });
  class Channel extends EventTarget {
    constructor() { super(); this.readyState = 'connecting'; this.sent = []; }
    send(value) { this.sent.push(JSON.parse(value)); }
    close() { this.readyState = 'closed'; this.dispatchEvent(new Event('close')); }
    message(value) { this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(value) })); }
  }
  window.RTCPeerConnection = class Peer extends EventTarget {
    constructor() { super(); this.connectionState = 'new'; this.channel = new Channel(); mock.peers.push(this); }
    addTrack() {}
    createDataChannel() { return this.channel; }
    async createOffer() { return { type: 'offer', sdp: 'mock-browser-offer' }; }
    async setLocalDescription() {}
    async setRemoteDescription() {
      setTimeout(() => {
        this.connectionState = 'connected';
        this.dispatchEvent(new Event('connectionstatechange'));
        if (this.onconnectionstatechange) this.onconnectionstatechange({});
        this.channel.readyState = 'open'; this.channel.dispatchEvent(new Event('open'));
        if (this.channel.onopen) this.channel.onopen({});
      }, 5);
    }
    close() { this.connectionState = 'closed'; this.closed = true; }
  };
}

module.exports = { installBrowserVoiceMocks };
