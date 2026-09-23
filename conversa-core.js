// Shared voice engine. Permanent keys/persona stay on the server.
// Capture starts only from ligar(), called by an explicit user action.
(function () {
'use strict';
function CapyChamada(opcoes) {
  const op = opcoes || {};
  const emit = (nome, ...args) => { try { if (typeof op[nome] === 'function') op[nome](...args); } catch (_) {} };
  const fresh = () => ({audioIn:0,audioOut:0,cache:0,textoIn:0,textoOut:0,respostas:0});
  let current = null, usage = fresh(), transcript = [], duration = 0, silence = 0;
  // Falas em andamento, por item_id. O delta chega palavra a palavra e a linha
  // cresce; quando o turno fecha, ela e FINALIZADA em vez de virar uma segunda
  // linha. Sem este mapa o texto apareceria duas vezes: uma pelos deltas e
  // outra pelo response.done, que sempre inseriu a fala inteira.
  let vivas = new Map();
  const active = s => current === s && !s.closed;
  const stop = stream => { try { if (stream) stream.getTracks().forEach(t => { try { t.stop(); } catch (_) {} }); } catch (_) {} };
  const number = n => Number.isFinite(n) && n > 0 ? n : 0;
  // ?debug=1 na URL liga o log dos eventos que este arquivo ignora. Foi o
  // silencio do if/else que escondeu os deltas de transcricao ate 19/set.
  const debug = op.debug === true || (typeof location === 'object' && /[?&]debug=1/.test(location.search || ''));
  function end(s, reason) {
    if (!active(s)) return;
    current = null; s.closed = true;
    duration = s.started ? Math.max(0, Date.now() - s.started) : 0;
    silence = s.silence;
    clearTimeout(s.timeout); clearInterval(s.timer);
    s.abort.abort(); s.resolve(false);
    try { if (s.channel) s.channel.close(); } catch (_) {}
    stop(s.stream);
    try { if (s.pc) s.pc.close(); } catch (_) {}
    if (s.audio) {
      try { s.audio.pause(); } catch (_) {}
      stop(s.audio.srcObject); s.audio.srcObject = null;
      try { s.audio.remove(); } catch (_) {}
    }
    // Desligou no meio de uma fala: a linha viva nunca recebeu o `.done`. Ela
    // entra no transcript assim mesmo, senao a ultima frase some da devolutiva.
    for (const linha of vivas.values()) {
      const resto = String(linha.texto || '').trim();
      if (resto) transcript.push({quem:linha.quem,texto:resto});
    }
    vivas.clear();
    emit('aoEstado','desconectado'); emit('aoUso',{...usage});
    if (s.connected) emit('aoDesligar',reason || 'manual',{uso:{...usage},transcricao:transcript.map(t=>({...t})),duracaoMs:duration});
  }
  function fail(s,msg) { if (active(s)) { end(s,'erro'); emit('aoErro',msg); } }
  // Pedaco de fala chegando. Nao entra no `transcript` — so a versao final entra,
  // senao a devolutiva da Yara receberia a frase repetida em pedacos.
  function parcial(who,id,pedaco) {
    if (!id) return;
    const linha = vivas.get(id) || {quem:who,texto:''};
    linha.texto += String(pedaco == null ? '' : pedaco);
    vivas.set(id,linha);
    emit('aoFalaParcial',who,linha.texto.trim(),id);
  }
  function said(who,text,id) {
    if (id) vivas.delete(id);          // fecha a linha viva, se houve deltas
    const value = String(text || '').trim();
    if (value) { transcript.push({quem:who,texto:value}); emit('aoFala',who,value,id); }
  }
  function message(s,event) {
    if (!active(s)) return;
    let m; try { m=JSON.parse(event.data); } catch (_) { return; }
    if (!m || typeof m !== 'object') return;
    if (m.type === 'response.done') {
      const r=m.response || {};
      if (r.id && s.responses.has(r.id)) return;
      if (r.id) s.responses.add(r.id);
      if (r.usage) {
        const i=r.usage.input_token_details || {}, o=r.usage.output_token_details || {}, c=i.cached_tokens_details || {};
        usage.cache += number(i.cached_tokens) || number(c.audio_tokens)+number(c.text_tokens);
        usage.audioIn += Math.max(0,number(i.audio_tokens)-number(c.audio_tokens));
        usage.textoIn += Math.max(0,number(i.text_tokens)-number(c.text_tokens));
        usage.audioOut += number(o.audio_tokens); usage.textoOut += number(o.text_tokens); usage.respostas++;
      }
      if (!s.buffer) { s.ai=false; emit('aoEstado','ouvindo'); }
      for (const item of (Array.isArray(r.output)?r.output:[])) for(const c of (Array.isArray(item.content)?item.content:[])) if(c.transcript) said('ia',c.transcript,item.id);
      emit('aoUso',{...usage});
    } else if (m.type==='input_audio_buffer.speech_started') { s.student=true; emit('aoEstado','falando'); }
    else if(m.type==='input_audio_buffer.speech_stopped') { s.student=false; emit('aoEstado','pensando'); }
    else if(['output_audio_buffer.started','response.output_audio.delta','response.audio.delta'].includes(m.type)) {
      if(m.type==='output_audio_buffer.started') s.buffer=true;
      s.ai=true; emit('aoEstado','ia_falando');
    } else if(['output_audio_buffer.stopped','output_audio_buffer.cleared'].includes(m.type)) { s.buffer=s.ai=false; emit('aoEstado','ouvindo'); }
    else if(m.type==='conversation.item.input_audio_transcription.completed') said('eu',m.transcript,m.item_id);
    // Transcricao chegando palavra a palavra. Os dois nomes coexistem conforme
    // o modelo: o GA usa `output_audio_transcript`, o antigo usa `audio_transcript`.
    else if(m.type==='response.output_audio_transcript.delta'||m.type==='response.audio_transcript.delta') parcial('ia',m.item_id,m.delta);
    else if(m.type==='conversation.item.input_audio_transcription.delta') parcial('eu',m.item_id,m.delta);
    else if(m.type==='error') fail(s,'A chamada encontrou um erro. Tente novamente em instantes.');
    else if(debug) { try { console.debug('[capy-voz] evento ignorado:',m.type); } catch(_) {} }
  }
  function ready(s) {
    if(!active(s)||s.connected||!s.sdpReady||s.pc.connectionState!=='connected'||s.channel.readyState!=='open') return;
    s.connected=true; s.started=s.last=Date.now(); clearTimeout(s.timeout);
    s.timer=setInterval(()=>{
      if(!active(s)) return;
      const now=Date.now(), delta=Math.max(0,now-s.last);
      if(!s.student&&!s.ai) { s.silence+=delta; s.quiet+=delta; } else s.quiet=0;
      s.last=now; emit('aoUso',{...usage});
      // 3 min de silêncio e 15 min de chamada. O teto de minutos caiu de 20 para
      // 15 em 19/set: uma simulação de entrevista real dura 10-15 min, e 20 min
      // estourava o dobro da cota mensal que a landing vende no plano Super.
      if(s.quiet>=180000) end(s,'silencio');
      else if(now-s.started>=900000) end(s,'tempo');
    },250);
    emit('aoEstado','ouvindo');
    try { s.channel.send(JSON.stringify({type:'response.create'})); }
    catch(_) { fail(s,'A conexão de voz foi interrompida. Tente novamente.'); return; }
    s.resolve(true);
  }
  async function prepare(s,body) {
    let messageError='Não consegui conectar a chamada. Confira sua internet e tente novamente.';
    try {
      // This settles CSRF initialization; auth-secure injects it into same-origin POST.
      if(window.Auth && typeof window.Auth.ready==='function') await window.Auth.ready();
      if(!active(s)) return;
      emit('aoEstado','microfone');
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
      if(!active(s)) { stop(stream); return; }
      s.stream=stream;
      const tracks=stream.getAudioTracks?stream.getAudioTracks():stream.getTracks();
      if(!tracks.length) throw Error('empty microphone');
      emit('aoEstado','conectando');
      const r=await fetch('/api/realtime-token',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(body||{}),signal:s.abort.signal});
      if(!active(s)) return;
      const cred=await r.json();
      if(!active(s)) return;
      if(!r.ok||!cred||typeof cred.value!=='string'||!cred.value) {
        messageError=({401:'Entre na sua conta para iniciar a chamada.',403:'Esta chamada não está disponível para sua conta. Confira seu acesso.',429:'Você atingiu o limite de chamadas. Tente mais tarde ou fale com o professor.',503:'A voz está indisponível no momento. Tente novamente mais tarde.'})[r.status] || 'Não foi possível abrir a chamada. Tente novamente.';
        throw Error('token unavailable');
      }
      emit('aoCota', typeof cred.minutosRestantes === 'number' ? cred.minutosRestantes : null);
      s.pc=new RTCPeerConnection();
      s.audio=document.createElement('audio'); s.audio.autoplay=true; s.audio.hidden=true;
      s.audio.setAttribute('playsinline',''); s.audio.setAttribute('aria-hidden','true');
      document.body.appendChild(s.audio);
      s.pc.ontrack=e=>{
        if(!active(s)) return;
        try {
          s.audio.srcObject=e.streams&&e.streams[0]?e.streams[0]:new MediaStream([e.track]);
          const playing=s.audio.play();
          if(playing&&playing.catch) playing.catch(()=>fail(s,'O navegador bloqueou o áudio. Autorize o som deste site e ligue novamente.'));
        } catch(_) { fail(s,'Não foi possível reproduzir a voz. Confira o áudio do navegador.'); }
      };
      s.pc.onconnectionstatechange=()=>{
        if(!active(s)) return;
        if(['failed','disconnected','closed'].includes(s.pc.connectionState)) fail(s,'A conexão caiu. O microfone foi desligado; tente novamente.');
        else ready(s);
      };
      tracks.forEach(t=>{t.onended=()=>fail(s,'O microfone foi desconectado. Confira o dispositivo.');s.pc.addTrack(t,stream);});
      s.channel=s.pc.createDataChannel('oai-events');
      s.channel.addEventListener('message',e=>message(s,e));
      s.channel.addEventListener('open',()=>ready(s));
      s.channel.addEventListener('close',()=>fail(s,'A conexão de voz foi encerrada.'));
      s.channel.addEventListener('error',()=>fail(s,'A conexão de voz encontrou um erro.'));
      const offer=await s.pc.createOffer(); if(!active(s)) return;
      await s.pc.setLocalDescription(offer); if(!active(s)) return;
      const response=await fetch('https://api.openai.com/v1/realtime/calls',{
        method:'POST',headers:{Authorization:'Bearer '+cred.value,'Content-Type':'application/sdp'},body:offer.sdp,signal:s.abort.signal
      });
      if(!active(s)) return;
      if(!response.ok) throw Error('SDP refused');
      const sdp=await response.text(); if(!active(s)) return;
      await s.pc.setRemoteDescription({type:'answer',sdp}); if(!active(s)) return;
      s.sdpReady=true; ready(s);
    } catch(e) {
      if(!active(s)) return;
      if(e&&['NotAllowedError','PermissionDeniedError'].includes(e.name)) messageError='Autorize o microfone no navegador e tente novamente.';
      else if(e&&['NotFoundError','NotReadableError'].includes(e.name)) messageError='Não consegui usar o microfone. Confira se ele está conectado ou em uso por outro aplicativo.';
      fail(s,messageError);
    }
  }
  function ligar(body) {
    if(current) return Promise.resolve(false);
    if(!window.isSecureContext||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof RTCPeerConnection!=='function') {
      emit('aoErro','Use um navegador com microfone e abra este site por HTTPS para ligar.');emit('aoEstado','desconectado');return Promise.resolve(false);
    }
    usage=fresh();transcript=[];vivas.clear();duration=silence=0;
    const s={abort:new AbortController(),connected:false,closed:false,silence:0,quiet:0,student:false,ai:false,muted:false,responses:new Set()};
    current=s;
    const promise=new Promise(resolve=>{s.resolve=resolve;});
    s.timeout=setTimeout(()=>fail(s,'A chamada demorou para conectar. O microfone foi desligado; tente novamente.'),30000);
    emit('aoEstado','conectando');prepare(s,body);return promise;
  }
  function desligar(reason) { if(current) end(current,reason||'manual'); }
  function silenciar(value) {
    if(!current||!current.connected) return false;
    current.muted=Boolean(value);if(current.muted) current.student=false;
    current.stream.getTracks().forEach(t=>{t.enabled=!current.muted;});return current.muted;
  }
  window.addEventListener('pagehide',()=>desligar('saida'));
  window.addEventListener('beforeunload',()=>desligar('saida'));
  return {ligar,desligar,silenciar,mudo:()=>Boolean(current&&current.muted),
    fluxo:()=>current&&current.connected?current.stream:null,
    ligado:()=>Boolean(current&&current.connected),pendente:()=>Boolean(current&&!current.connected),
    uso:()=>({...usage}),transcricao:()=>transcript.map(t=>({...t})),
    decorridoMs:()=>current&&current.started?Math.max(0,Date.now()-current.started):duration,
    silencioMs:()=>current?current.silence:silence};
}
window.CapyChamada=CapyChamada;
})();
