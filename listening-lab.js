/* ══════════════════════════════════════════════════════════════════════════
   listening-lab.js — a aba de Listening que faltava nas aulas de curso.

   POR QUÊ: das 124 aulas de curso, só 5 tinham qualquer coisa de listening.
   Em todas as outras o aluno LÊ a frase e clica no play — ou seja, ele nunca
   precisa reconhecer o som sozinho, porque o texto está ali do lado.

   Aqui é o contrário: a frase toca e NADA aparece escrito. O aluno escuta
   quantas vezes quiser (tem também a versão devagar), escreve o que entendeu
   e só depois disso o texto aparece, palavra por palavra, mostrando o que ele
   pegou e o que passou batido.

   Carregue depois de components.js em qualquer aula de curso. Não precisa de
   configuração nem de mexer no script inline da aula: a aba e o painel são
   criados em runtime, e as frases saem do que já está renderizado na página
   (as frases da aba Speak e as falas do diálogo). Se a aula não tiver nem uma
   nem outra, o script não faz nada.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const CFG = (typeof window !== 'undefined' && window.YARA_WIDGET) || {};
    const FR = CFG.lang === 'fr';
    const API_LANG = FR ? 'fr' : 'en';
    const BCP47 = FR ? 'fr-FR' : 'en-US';
    const MIN_ITENS = 4;

    let itens = [];
    let atual = 0;
    let conferidos = [];   // pontuação de cada item, ou null
    let painel = null;

    // ── 1. De onde saem as frases ─────────────────────────────────────────
    // Tudo vem do DOM já montado, porque os arrays da aula (SPEAK_DATA,
    // DIALOGUE_LINES) são `const` dentro do script inline — não existem no
    // window. Ler o DOM também faz o script funcionar nos dois formatos de
    // aula do site sem precisar saber qual é qual.
    // Tira tudo que é controle e não fala: o play, o checkbox "Done", o botão
    // de microfone. Sem isso a frase saía como "...for the first time. Done" —
    // e o TTS lia o "Done" junto.
    function textoDe(el) {
        const c = el.cloneNode(true);
        c.querySelectorAll('button, input, select, textarea, script, style, .material-symbols-outlined')
            .forEach(n => n.remove());
        // Nos dois formatos de aula a frase mora num <p> — é a fonte mais limpa,
        // e pegar só ele já descarta o "☐" e o "Done" que vêm ao lado.
        const p = c.querySelector('p');
        if (p && p.textContent.trim().split(/\s+/).length >= 3) {
            return p.textContent.replace(/\s+/g, ' ').trim();
        }
        // Sem <p>: sobrou legenda de controle. Some com as curtas.
        // (Não dá para remover <label> antes: no formato antigo é ele que
        // ENVOLVE a frase, e removê-lo apagava a frase inteira.)
        c.querySelectorAll('label').forEach(l => {
            if (l.textContent.trim().split(/\s+/).length < 3) l.remove();
        });
        return c.textContent.replace(/\s+/g, ' ').trim();
    }

    // "👩 Friend: What happened?" → "What happened?"
    function semRotulo(t) {
        return t.replace(/^[^\p{L}\p{N}]+/u, '').replace(/^[^:]{1,40}:\s*/, '').trim();
    }

    function serve(t) {
        if (!t) return false;
        const palavras = t.split(/\s+/).filter(Boolean);
        if (palavras.length < 3 || palavras.length > 26) return false;
        if (t.length < 12 || t.length > 180) return false;
        if (!/[a-zA-ZÀ-ÿ]/.test(t)) return false;
        return true;
    }

    function coletar() {
        const brutos = [];
        const speak = document.querySelector('#speak-grid, #speak-list');
        if (speak) Array.from(speak.children).forEach(f => brutos.push(semRotulo(textoDe(f))));
        const dlg = document.getElementById('dialogue-lines');
        if (dlg) Array.from(dlg.children).forEach(f => brutos.push(semRotulo(textoDe(f))));

        const vistos = new Set();
        const saida = [];
        for (const t of brutos) {
            const limpo = t.replace(/^\d+[.)]\s*/, '').trim();
            if (!serve(limpo)) continue;
            const chave = emPalavras(limpo).join(' ');
            if (vistos.has(chave)) continue;
            vistos.add(chave);
            saida.push(limpo);
        }
        return saida;
    }

    // ── 2. Áudio ──────────────────────────────────────────────────────────
    // Reaproveita EXATAMENTE o cache do CapyTTS (mesmo nome de cache e mesma
    // chave), então ouvir aqui não gera chamada nova de API para uma frase que
    // a aula já falou — e vice-versa. O que o CapyTTS não faz e a gente precisa
    // é controlar a velocidade, por isso o áudio é tocado aqui.
    const CACHE = 'capy-tts-v1';
    let audioAtual = null;

    function pararAudio() {
        if (audioAtual) { try { audioAtual.pause(); audioAtual.src = ''; } catch (e) { } audioAtual = null; }
        try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { }
    }

    function falarNavegador(texto, taxa) {
        try {
            if (!window.speechSynthesis) return;
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(texto);
            u.lang = BCP47; u.rate = taxa;
            speechSynthesis.speak(u);
        } catch (e) { }
    }

    async function tocar(texto, taxa) {
        const limpo = String(texto || '').replace(/<[^>]+>/g, '').trim().slice(0, 300);
        if (!limpo) return;
        pararAudio();
        const chave = `/__capy-tts-cache/${API_LANG}/${encodeURIComponent(limpo.toLowerCase())}`;
        try {
            let blob = null;
            if (window.caches) {
                const cache = await caches.open(CACHE);
                const hit = await cache.match(chave);
                if (hit) blob = await hit.blob();
            }
            if (!blob) {
                const url = '/api/tts?text=' + encodeURIComponent(limpo) + '&voice=nova&lang=' + API_LANG;
                const r = await fetch(url);
                if (!r.ok) throw new Error('tts ' + r.status);
                blob = await r.blob();
                if (window.caches) {
                    try {
                        const cache = await caches.open(CACHE);
                        await cache.put(chave, new Response(blob, {
                            headers: { 'Content-Type': blob.type || 'audio/mpeg' }
                        }));
                    } catch (e) { }
                }
            }
            const a = new Audio(URL.createObjectURL(blob));
            a.playbackRate = taxa;
            audioAtual = a;
            a.onended = () => { try { URL.revokeObjectURL(a.src); } catch (e) { } };
            await a.play();
        } catch (e) {
            falarNavegador(limpo, taxa * 0.9);
        }
    }

    // ── 3. Comparação do que o aluno escreveu ─────────────────────────────
    // Normaliza PALAVRA A PALAVRA, não a frase inteira: a pintura do resultado
    // é posicional (uma marca por palavra exibida), então "vingt-cinq" precisa
    // virar "25" mantendo-se um token só. Quem escreve "25" onde está escrito
    // "vingt-cinq" ouviu certo e tem que contar como acerto.
    function normalizarPalavra(t) {
        if (window.CapyFala) return CapyFala.normalizar(t, FR ? 'fr' : 'en').replace(/\s+/g, '');
        return String(t || '').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
    }

    // Corta S\u00d3 no espa\u00e7o \u2014 o mesmo corte que pintar() usa para exibir. Assim a
    // marca de \u00edndice k \u00e9 sempre a da palavra k na tela, mesmo quando uma
    // palavra composta encolhe ("vingt-cinq" \u2192 "25").
    function emPalavras(t) {
        return String(t || '').split(/\s+/).filter(Boolean).map(normalizarPalavra);
    }

    // Casa as duas listas pela maior subsequ\u00eancia comum. Comparar por \u00edndice
    // n\u00e3o serve: quem perde UMA palavra no meio desalinha o resto todo e leva
    // 68% tendo acertado quase tudo. Com a subsequ\u00eancia, faltar uma palavra
    // custa s\u00f3 aquela palavra.
    function alinhar(a, d) {
        const n = a.length, m = d.length;
        const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = m - 1; j >= 0; j--) {
                dp[i][j] = (a[i] && a[i] === d[j]) ? dp[i + 1][j + 1] + 1
                    : Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
        const casados = new Set();
        let i = 0, j = 0;
        while (i < n && j < m) {
            if (a[i] && a[i] === d[j]) { casados.add(i); i++; j++; }
            else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
            else j++;
        }
        return casados;
    }

    function conferir(alvo, dito) {
        const a = emPalavras(alvo);
        const d = emPalavras(dito).filter(Boolean);
        const casados = alinhar(a, d);
        const sobra = d.slice();
        casados.forEach(i => { const k = sobra.indexOf(a[i]); if (k >= 0) sobra[k] = null; });

        let vale = 0, acertos = 0;
        const marcas = a.map((p, i) => {
            if (!p) return 'ok';                      // s\u00f3 pontua\u00e7\u00e3o: n\u00e3o pontua nem penaliza
            vale++;
            if (casados.has(i)) { acertos += 1; return 'ok'; }
            const k = sobra.indexOf(p);
            if (k >= 0) { sobra[k] = null; acertos += 0.5; return 'fora'; }  // ouviu, mas fora de lugar
            return 'faltou';
        });
        return { marcas, pct: vale ? Math.round(acertos / vale * 100) : 0 };
    }

    // Mostra o formato das palavras sem entregar as letras: "▁▁▁ ▁▁ ▁▁▁▁▁"
    function silhueta(texto) {
        return texto.split(/\s+/).map(p => '▁'.repeat(Math.min(p.replace(/[^\p{L}\p{N}']/gu, '').length, 12))).join(' ');
    }

    // ── 4. Interface ──────────────────────────────────────────────────────
    function esc(s) {
        return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    function pintar() {
        const item = itens[atual];
        const estado = conferidos[atual];
        const feitos = conferidos.filter(x => x !== null && x !== undefined).length;

        painel.querySelector('.ll-contador').textContent = `Frase ${atual + 1} de ${itens.length}`;
        painel.querySelector('.ll-barra-fill').style.width = (feitos / itens.length * 100) + '%';

        const alvo = painel.querySelector('.ll-alvo');
        const resultado = painel.querySelector('.ll-resultado');
        const campo = painel.querySelector('.ll-resposta');
        const dica = painel.querySelector('.ll-silhueta');

        campo.value = (estado && estado.escrito) || '';
        dica.textContent = '';
        dica.classList.add('hidden');

        if (estado) {
            // pinta palavra a palavra: verde acertou, âmbar ouviu mas trocou de
            // lugar, vermelho passou batido
            alvo.classList.remove('hidden');
            alvo.innerHTML = item.split(/\s+/).map((p, k) => {
                const m = estado.marcas[k] || 'faltou';
                return `<span class="ll-p ll-${m}">${esc(p)}</span>`;
            }).join(' ');
            resultado.classList.remove('hidden');
            const pct = estado.pct;
            resultado.className = 'll-resultado ' + (pct >= 80 ? 'll-bom' : pct >= 50 ? 'll-medio' : 'll-ruim');
            resultado.textContent = pct >= 80 ? `🎉 ${pct}% — ouvido muito bem!`
                : pct >= 50 ? `👂 ${pct}% — quase lá, escute de novo as partes em vermelho.`
                    : `💪 ${pct}% — ouça devagar e tente outra vez.`;
        } else {
            alvo.classList.add('hidden');
            alvo.innerHTML = '';
            resultado.classList.add('hidden');
            resultado.textContent = '';
        }

        painel.querySelector('.ll-prev').disabled = atual === 0;
        painel.querySelector('.ll-next').disabled = atual === itens.length - 1;

        const fim = painel.querySelector('.ll-fim');
        fim.classList.toggle('hidden', feitos < itens.length);
    }

    function montarPainel(container) {
        const div = document.createElement('div');
        div.id = 'tab-listening';
        div.className = 'fade-in hidden';
        div.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-black text-navy mb-1">🎧 Listening</h2>
        <p class="text-slate-500 text-sm">Sem texto na tela. Ouça, escreva o que você entendeu e só então descubra a frase.</p>
      </div>
      <div class="ll-caixa">
        <div class="ll-topo">
          <span class="ll-contador"></span>
          <div class="ll-barra"><div class="ll-barra-fill"></div></div>
        </div>

        <button type="button" class="ll-play" aria-label="Ouvir a frase">▶</button>
        <div class="ll-velocidades">
          <button type="button" class="ll-devagar">🐢 Devagar</button>
          <button type="button" class="ll-dica">💡 Formato das palavras</button>
        </div>
        <div class="ll-silhueta hidden"></div>

        <textarea class="ll-resposta" rows="3" placeholder="Escreva aqui o que você ouviu..."></textarea>

        <div class="ll-acoes">
          <button type="button" class="ll-conferir">✅ Conferir</button>
          <button type="button" class="ll-revelar">👁️ Revelar a frase</button>
        </div>

        <div class="ll-alvo hidden"></div>
        <div class="ll-resultado hidden"></div>

        <div class="ll-navegar">
          <button type="button" class="ll-prev">← Anterior</button>
          <button type="button" class="ll-next">Próxima →</button>
        </div>
      </div>
      <div class="ll-fim hidden">
        <p>🏆 Você ouviu as ${itens.length} frases da aula!</p>
        <button type="button" class="ll-xp">Concluir listening +30 XP</button>
      </div>`;
        container.appendChild(div);

        const q = s => div.querySelector(s);
        q('.ll-play').addEventListener('click', () => tocar(itens[atual], 1));
        q('.ll-devagar').addEventListener('click', () => tocar(itens[atual], 0.65));
        q('.ll-dica').addEventListener('click', () => {
            const el = q('.ll-silhueta');
            el.textContent = silhueta(itens[atual]);
            el.classList.remove('hidden');
        });
        q('.ll-conferir').addEventListener('click', () => {
            const escrito = q('.ll-resposta').value.trim();
            if (!escrito) { q('.ll-resposta').focus(); return; }
            const r = conferir(itens[atual], escrito);
            conferidos[atual] = { ...r, escrito };
            pintar();
            if (window.CapySound) (r.pct >= 80 ? CapySound.correct : CapySound.wrong)();
        });
        q('.ll-revelar').addEventListener('click', () => {
            const escrito = q('.ll-resposta').value.trim();
            const r = conferir(itens[atual], escrito);
            conferidos[atual] = { ...r, escrito };
            pintar();
        });
        q('.ll-prev').addEventListener('click', () => { if (atual > 0) { atual--; pararAudio(); pintar(); } });
        q('.ll-next').addEventListener('click', () => { if (atual < itens.length - 1) { atual++; pararAudio(); pintar(); } });
        q('.ll-alvo').addEventListener('click', () => tocar(itens[atual], 1));
        q('.ll-xp').addEventListener('click', ev => {
            const b = ev.currentTarget;
            b.disabled = true;
            b.textContent = '✓ Listening concluído!';
            const chave = 'capyListening:' + location.pathname;
            if (!localStorage.getItem(chave)) {
                localStorage.setItem(chave, '1');
                if (window.Store && typeof Store.addXP === 'function') Store.addXP(30);
            }
            if (window.CapySound) CapySound.fanfare();
        });
        return div;
    }

    // ── 5. Encaixe na barra de abas ───────────────────────────────────────
    // A troca de aba da página percorre um array fixo (SECTIONS/TABS) que só
    // existe dentro do script inline, então o botão novo não entra nele. A
    // gente resolve por fora: escuta todo clique em .tab-btn e cuida do
    // próprio painel — mostra quando é o nosso botão, esconde quando é outro.
    function ligarAba() {
        const barra = document.querySelector('.tab-btn');
        if (!barra) return null;
        const modelo = document.querySelector('.tab-btn:not(.active)') || barra;
        const btn = document.createElement('button');
        btn.className = modelo.className.replace(/\bactive\b/, '').trim();
        btn.dataset.tab = 'listening';
        btn.type = 'button';
        btn.textContent = '🎧 Listening';

        // depois da aba Speak quando existir; senão antes de Homework; senão no fim
        const speak = document.querySelector('.tab-btn[data-tab="speak"]');
        const hw = document.querySelector('.tab-btn[data-tab="homework"]');
        if (speak) speak.insertAdjacentElement('afterend', btn);
        else if (hw) hw.insertAdjacentElement('beforebegin', btn);
        else barra.parentElement.appendChild(btn);

        document.addEventListener('click', ev => {
            const alvo = ev.target.closest && ev.target.closest('.tab-btn');
            if (!alvo || !painel) return;
            const meu = alvo === btn;
            if (meu) {
                // o handler da página não conhece esta aba: escondemos os outros
                document.querySelectorAll('[id^="tab-"]').forEach(p => {
                    if (p !== painel) p.classList.add('hidden');
                });
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                painel.classList.remove('hidden');
                pararAudio();
            } else {
                painel.classList.add('hidden');
                btn.classList.remove('active');
                pararAudio();
            }
        });
        return btn;
    }

    // ── 6. Estilo ─────────────────────────────────────────────────────────
    const css = `
.ll-caixa{background:#fff;border:2px solid #e2e8f0;border-radius:1.25rem;padding:1.5rem;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:1rem}
.ll-topo{width:100%;display:flex;align-items:center;gap:.75rem}
.ll-contador{font-weight:800;color:#64748b;font-size:.85rem;white-space:nowrap}
.ll-barra{flex:1;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden}
.ll-barra-fill{height:100%;width:0;background:linear-gradient(90deg,#10b981,#14b8a6);transition:width .3s}
.ll-play{width:110px;height:110px;border-radius:50%;border:none;cursor:pointer;color:#fff;font-size:2.6rem;line-height:1;
  background:linear-gradient(135deg,#001f3f,#0f3d68);box-shadow:0 10px 30px rgba(0,31,63,.28);transition:transform .15s}
.ll-play:hover{transform:scale(1.06)}
.ll-play:active{transform:scale(.96)}
.ll-velocidades{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center}
.ll-velocidades button,.ll-navegar button{background:#f1f5f9;border:2px solid #e2e8f0;border-radius:999px;
  padding:.45rem 1rem;font-weight:700;font-size:.85rem;color:#334155;cursor:pointer;transition:all .15s}
.ll-velocidades button:hover,.ll-navegar button:hover{background:#e2e8f0}
.ll-silhueta{font-family:ui-monospace,monospace;font-size:1.35rem;letter-spacing:.08em;color:#94a3b8;word-break:break-word}
.ll-resposta{width:100%;max-width:640px;border:2px solid #e2e8f0;border-radius:1rem;padding:.9rem 1rem;
  font-size:1rem;resize:vertical;outline:none}
.ll-resposta:focus{border-color:#001f3f}
.ll-acoes{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center}
.ll-acoes button{border:none;border-radius:999px;padding:.6rem 1.4rem;font-weight:800;cursor:pointer;transition:transform .15s}
.ll-acoes button:hover{transform:scale(1.04)}
.ll-conferir{background:linear-gradient(90deg,#10b981,#14b8a6);color:#fff}
.ll-revelar{background:#f1f5f9;color:#475569;border:2px solid #e2e8f0!important}
.ll-alvo{font-size:1.25rem;font-weight:700;line-height:1.6;cursor:pointer;max-width:680px}
.ll-p{padding:.05em .18em;border-radius:.35rem}
.ll-ok{color:#047857;background:#d1fae5}
.ll-fora{color:#b45309;background:#fef3c7}
.ll-faltou{color:#be123c;background:#ffe4e6;text-decoration:underline wavy #fb7185}
.ll-resultado{font-weight:800;font-size:.95rem;padding:.6rem 1rem;border-radius:.9rem}
.ll-bom{color:#047857;background:#ecfdf5}
.ll-medio{color:#b45309;background:#fffbeb}
.ll-ruim{color:#be123c;background:#fff1f2}
.ll-navegar{display:flex;gap:.6rem;justify-content:center;width:100%}
.ll-navegar button:disabled{opacity:.4;cursor:not-allowed}
.ll-fim{margin-top:1.25rem;text-align:center;background:linear-gradient(135deg,#001f3f,#0f3d68);color:#fff;
  border-radius:1.25rem;padding:1.5rem}
.ll-fim p{font-weight:900;font-size:1.15rem;margin-bottom:.75rem}
.ll-xp{background:#fff;color:#001f3f;font-weight:900;border:none;border-radius:999px;padding:.7rem 1.6rem;cursor:pointer}
.ll-xp:disabled{opacity:.7;cursor:default}
@media (max-width:640px){.ll-play{width:92px;height:92px;font-size:2.1rem}.ll-alvo{font-size:1.05rem}}`;

    // ── 7. Boot ───────────────────────────────────────────────────────────
    function iniciar() {
        if (document.getElementById('tab-listening')) return;
        itens = coletar();
        if (itens.length < MIN_ITENS) return;   // aula sem material: não cria aba vazia
        conferidos = new Array(itens.length).fill(null);

        const ancora = document.getElementById('tab-vocab') || document.querySelector('[id^="tab-"]');
        if (!ancora || !ancora.parentElement) return;

        const tag = document.createElement('style');
        tag.textContent = css;
        document.head.appendChild(tag);

        painel = montarPainel(ancora.parentElement);
        ligarAba();
        pintar();
        window.CapyListening = { itens, tocar };
    }

    // As frases são criadas pelos build*() inline da aula, que rodam durante o
    // parse. Um tick depois do DOMContentLoaded já tem tudo montado.
    // A segunda passada é para as aulas que montam a lista de frases num tick
    // posterior (buscando algo, ou dentro de outro setTimeout). iniciar() sai
    // fora se a aba já existir, então rodar duas vezes não duplica nada.
    function agendar() { setTimeout(iniciar, 0); setTimeout(iniciar, 1500); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', agendar);
    } else {
        agendar();
    }
})();
