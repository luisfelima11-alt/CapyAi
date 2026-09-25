# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Capy Yara Adventures is a gamified English-learning platform for Brazilian students, centered on a capybara mascot named Yara 🐾. Built with vanilla HTML/CSS/JS (Tailwind CDN) + a Node.js dev server with OpenAI integration. No build step — all files are static except the API layer.

## Antes de investigar um bug: leia BUGS-APRENDIDOS.md

`BUGS-APRENDIDOS.md` guarda cada bug já consertado neste projeto, com a **causa raiz**
e um **comando que denuncia o mesmo defeito em 5 segundos**. Vários bugs daqui já
voltaram por não terem sido registrados. Consulte antes de diagnosticar, e registre
depois de corrigir.

O ciclo: **capy-bughunter** acha o sintoma → **capy-debugger** prova a causa raiz →
**capy-fixer** corrige e escreve a lição de volta no arquivo.

## Jogo novo? Registre no game-celebra.js

O fim de partida dos jogos dispara a comemoração da Yara por meio do `game-celebra.js`,
que envolve a função de fim de cada jogo listada no `MAPA` dele (`finishGame`,
`showGameOver`, `showFinished`...). **Jogo que não está no mapa não comemora — em silêncio.**
Ao criar um jogo: (1) acrescente `pagina: { fn: 'nomeDaFuncaoDeFim' }` no `MAPA`;
(2) a função tem que ser uma declaração `function` global (não `const`/`let`, e não dentro de IIFE);
(3) carregue `celebration.js` e depois `game-celebra.js` imediatamente antes de `</body>`.
Confira no console da página: `window.__capyGameCelebra.instalado` tem que ser `true`.
O `flappy_yara` fica fora de propósito (a partida termina numa colisão seguida de quiz).

## Dev Server

```bash
node scripts/dev-server.js   # http://localhost:8765 — pages + every /api/* through api/index.js
```

`scripts/dev-server.js` serves the pages and hands every `/api/*` request to the production
handler (`api/index.js`); change the API there, never by adding routes to the dev server.
Local `.env` (never committed): `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY`, `SESSION_COOKIE_SECRET`, `APP_ORIGIN`; optional `OPENAI_MODEL`
(default `gpt-4o-mini`), `OPENROUTER_API_KEY`, `PORT`.

Tests: `npm run test:security` (node --test, no network or keys needed); `npm run security:check`
adds `npm audit`. Add a case to `tests/security.test.js` for every security-relevant change.

## Deployment and branches

Vercel project `capy-yara-adventures`, production https://capyenglish.com.br. **The owner
publishes production.** Don't run `vercel --prod` or push to `main` unless the owner asks for it
in the session: work on a branch and open a PR (`sync/estado-producao` mirrors what is live).

- `vercel.json` sends `/api/*` to `api/index.js` and `/` to `landing.html`, and sets the security
  headers and two CSPs: strict for the six hardened pages (login, set-password, account, admin,
  admin-metrics, teacher_homework — no inline script, local Tailwind), compatibility for the rest.
- SQL in `supabase/migrations/` runs in the Supabase SQL editor **before** the code that needs it.
  Release steps and owner actions live in `SECURITY-ROLLOUT.md`.
- `scripts/`, `tests/`, `supabase/` and `*.md` never ship (`.vercelignore`).

## Architecture

### Navigation & Components (`components.js`)

Every page injects nav via placeholder divs:
```html
<div id="top-nav-placeholder"></div>
<div id="side-nav-placeholder"></div>
<div id="mobile-nav-placeholder"></div>
```
```js
Components.mount('top-nav-placeholder', Components.renderTopNav('classes'));
Components.mount('side-nav-placeholder', Components.renderSideNav('classes'));
Components.mount('mobile-nav-placeholder', Components.renderMobileNav('classes'));
```
Valid `activeTab` values: `'home'`, `'classes'`, `'lessons'`, `'games'`, `'chat'`.

**Cache busting:** pages load shared files as `name.js?v=<tag>`. After changing a shared JS/CSS file
(`components.js`, `store.js`, `auth-secure.js`…), run `npm run bump` (rewrites every `?v=` to the
current commit SHA) and commit the result.

**⚠️ Chrome Auto-Translate:** The nav container uses `translate="no"` to prevent Chrome from auto-translating nav labels (e.g. "Cursos" → "Lessons"). Never remove this attribute.

### State Management (`store.js`)

Global state in `localStorage` key `capyYaraState_{userId}`:
- `xp`, `badges[]`, `completedLessons[]`, `completedMinis[]`
- `planType`: `'free'` | `'pro'` | `'super'` — a UI hint synced from `/api/me`; the server enforces plans
- `starBerries`, `streakDays`, `aiUsageToday`

Key methods: `Store.addXP(n)`, `Store.completeLesson(id)`, `Store.completeMini(lessonId, miniNum)`, `Store.consumeAI()`.

Fires DOM events: `stateChanged`, `levelUp`, `badgeUnlocked`, `streakMilestone`.

### Auth and sessions (`auth-secure.js` + `/api/auth/*`)

Supabase Auth behind the API: tokens live only in HttpOnly `__Host-` cookies set by `api/security.js`.
`localStorage.capySession` is a display cache, never proof of identity.

- `auth-secure.js` wraps `window.fetch`: same-origin writes carry `X-CSRF-Token` (double-submit with
  the `__Host-capy-csrf` cookie), so pages just call `fetch('/api/...')`.
- `Auth.login / signUp / logout / refreshSession / ready / continueAsGuest` → `/api/auth/*`. Magic link,
  e-mail confirmation and password recovery come back through `/api/auth/callback`. Passwords are
  Supabase's (bcrypt), 12+ characters, checked against HaveIBeenPwned.
- Guests get a signed session cookie (`/api/auth/guest`). Plans are `free | pro | super`, written only
  by the Kiwify webhook and admin routes.
- Roles come from `app_metadata.role` (set with the Supabase admin API). Admin routes accept only an
  admin session (`isAdminReq`); with `ADMIN_REQUIRE_MFA=true` it must be `aal2` (TOTP enrolled at
  `/admin.html`). `CRON_SECRET` only opens the two cron routes.

### Data (Supabase Postgres, from `api/index.js`)

The API calls Supabase REST with the service key (`sb()`, `SUPABASE_SECRET_KEY`), server-side only.
RLS is on for every table, and column grants keep plan/role out of the browser's reach. Main tables:
`accounts` (`auth_user_id` → Supabase Auth), `user_state` (jsonb per user, plus server rows such as
`__voz_*`), `user_profiles` (level, goals, plan), `webhook_events`, `rate_limit_*`,
`api_metrics_daily` (requests and tokens per endpoint/day), `security_audit_log`,
`homework_submissions`, `push_subscriptions`.

### Security rules (keep them when adding features)

- Identity only from the session (`getRequestIdentity` / `resolveSecurityIdentity`), never from a
  `userId` sent by the browser.
- Text a student or an outside service controls (names, AI output, song titles) goes into HTML escaped
  or through `textContent`, never inside `onclick="…"` strings: use listeners with indexes / `data-*`.
- Student text going into a prompt passes `textoLivreParaPrompt` / `listaParaPrompt` (`textoParaPrompt`
  for titles and slugs); AI responses leave through `sanitizeAiOutput`.
- Every AI route is listed in `AI_ROUTE_KEYS`: the central gate identifies the student and applies the
  plan's daily limit (guests: 3 AI uses a day).
- Writes need an allowed `Origin`; no per-handler `Access-Control-Allow-Origin`; provider errors go to
  the log, not to the response.
- Pure helpers are exported for tests as `module.exports._internos`.

### Lesson Architecture

Trail defined in `learn.html` (`TRAIL` array, 24 lessons, 4 chapters). Each lesson has 4 mini-lessons × 6 steps (Listen, Quiz, Game, Build, Speak, Chat). Progress key: `localStorage.capyGuidedStep_{lessonId}_m{miniNum}`.

### Aula Pages (`aula_XX.html`)

The course has **44 lessons total**. The grid in `classes.html` displays them in logical order — file names and display numbers do not always match (see navigation chain below).

**Navigation chain (in lesson order):**
`aula_01 → ... → aula_32 → aula_43 → aula_44 → aula_33 → aula_34 → ... → aula_42`

`classes.html` LESSONS array maps display positions 33/34 → `aula_43.html`/`aula_44.html`, positions 35–44 → `aula_33.html` through `aula_42.html`.

---

### Three Lesson Templates

#### Template 1 — New/Standard (aulas 01–19, 33–42)
7-tab pattern, fully self-contained inline JS, no `lesson-engine.js`.

Tabs: `vocab → expressions → grammar → practice → speak → homework`
(Some aulas use a dialogue tab instead of grammar.)

```js
// markSection takes a string arg
const SECTIONS = ['vocab','expressions','grammar','practice','speak','homework'];
const _done = new Set();
function markSection(s) {
  if (_done.has(s)) return;
  _done.add(s);
  Store.addXP(20);
  showXP('+20 XP 🔥');
  updateDots();
}
```

**Reference file:** `aula_33.html`

---

#### Template 2 — Old/Engine (aulas 20–32, 34)
Uses `lesson-engine.js` — `initLesson({tabs, totalSections, vocab, expressions, practice, speak})`.

```js
// markSection takes NO args — lesson-engine.js handles it
markSection();           // increments internal counter
Store.addXP(75);        // called SEPARATELY for homework (not automatic)

initLesson({
  tabs: ['vocab','expressions','grammar','practice','speak','homework'],
  totalSections: 6,    // increment when adding a new tab
  vocab: [...],
  ...
});
```

The `result-overlay` (practice quiz result modal) in old-template aulas is rendered by `lesson-engine.js`.

**Reference file:** `aula_28.html`

---

#### Template 3 — Communicative (aulas 43, 44)
6-tab pattern focused on real-life conversation scenarios, NOT grammar drilling. Uses new-template inline JS.

Tabs: `situation → dialogue → chunks → practice → speak → homework`

| Tab | Content |
|-----|---------|
| 🎬 Situation | Context card, character cards, grammar focus grid |
| 💬 Dialogue | JS-rendered chat bubbles, color-coded grammar, per-line TTS (`speakLine43(i)`) |
| 🔑 Chunks | 8 key phrases with PT translation, usage note, TTS buttons; Mark button unlocks after 4 listened |
| ✏️ Practice | MCQ (`opt-btn`) + fill-in-blank (`fill-inp`) |
| 🗣️ Speak | Roleplay prompts with toggle-reveal example answers |
| 📋 Homework | Standard wo/mp/err/free-writing pattern |

```js
// markSection pattern (same as new template):
const SECTIONS43 = ['situation','dialogue','chunks','practice','speak','homework'];
const _done43 = new Set();
function markSection(s) {
  if (_done43.has(s)) return;
  _done43.add(s);
  if (typeof Store !== 'undefined') Store.addXP(20);
  showXP('+20 XP 🔥');
  updateDots43();
}
```

CSS used by communicative aulas: copy `.opt-btn`, `.fill-inp`, `.wo-tile`, `.wo-bank`, `.wo-ans`, `.mp-btn`, `.prog-dot.done` from `aula_40.html`.

**Files:**
- `aula_43.html` — "Let's Make Plans!" 🗓️ (Will vs Going To + Making Plans, scenario: planning trip to Rio)
- `aula_44.html` — "Tell Me About Yourself" 🎤 (Present Perfect + Will/Going To, scenario: job interview)

---

#### Template 4 — Verb-Enhanced (Travel 06+, Business 06+, Intermediate 01–04)

8-tab pattern. Identical to Template 1 (new/standard) but adds a dedicated **Verbs** tab between Vocab and Expressions. Use for all new lessons going forward.

```
Tabs: vocab → verbs → expressions → grammar → dialogue → practice → speak → homework
SECTIONS = ['vocab','verbs','expressions','grammar','dialogue','practice','speak','homework']
8 × +20 XP + +75 homework = 235 XP total
```

**Tab Verbs content:**
- 3–5 key verbs from the lesson topic
- Conjugation table per verb (6 forms): Present · Past · Past Continuous · Present Perfect · Past Perfect · Future
- 3 real-life example sentences per tense form
- Mini conjugation quiz: 5–8 fill-in-blank inputs (`data-ans` attribute) + "Check Answers" button
- `markSection('verbs')` + `Store.addXP(20)` when student completes the quiz

```js
// Verbs tab mini-quiz pattern:
function checkVerbQuiz() {
  const inputs = document.querySelectorAll('.verb-check');
  let correct = 0;
  inputs.forEach(inp => {
    const ok = inp.value.toLowerCase().trim() === inp.dataset.ans;
    inp.classList.toggle('!border-emerald-400', ok);
    inp.classList.toggle('!border-red-400', !ok);
    if (ok) correct++;
  });
  document.getElementById('verb-result').textContent = `${correct}/${inputs.length} correct`;
  if (correct >= Math.floor(inputs.length * 0.7)) markSection('verbs'); // ≥70% to pass
}
```

**Reference files:** `travel_aula_06.html`, `business_aula_06.html`, `intermediate_aula_01.html`

**Intermediate course specifics:** Verbs tab shows 4–5 verbs with ALL 6 tenses (because verb mastery is the course focus). Quiz has 8 fill-in-blank. `markSection('verbs')` requires ≥6/8 correct.

---

#### Template 5 — Conversation (Intermediate conversation lessons)

6-tab pattern focused on real-world listening, reading, and free production. NO flip cards, NO grammar accordion.

```
Tabs: reading → listening → questions → speaking → writing → homework
SECTIONS = ['reading','listening','questions','speaking','writing','homework']
6 × +20 XP + +75 homework = 195 XP total
```

| Tab | Content |
|-----|---------|
| 📖 Reading | Long text (350–400 words), keywords bolded in accent color, expandable glossary (8 words) |
| 🎧 Listening | Audio via browser `speechSynthesis` (rate 0.85), NO transcript shown; textarea "write what you heard"; word counter; "Reveal Transcript" button appears at ≥20 words |
| ❓ Questions | 10 questions: 3 comprehension (radio Y/N + feedback), 4 open-ended (textarea), 3 personal opinion (textarea) |
| 🗣️ Speaking | 5 roleplay prompts, each with toggle-reveal model answer + TTS button |
| ✏️ Writing | Textarea + tense checklist (student marks which tenses they used); `markSection('writing')` when ≥2 tenses checked |
| 📋 Homework | Word Order (3) + Error Correction (3) + Free Writing paragraph (8–10 sentences, 3+ tenses) |

**Listening pattern — critical details:**
```js
// Different text from Reading tab (oral, shorter ~150 words)
const LISTEN_TEXT = `...`;
let listenPlayed = false;

function playListening() {
  const u = new SpeechSynthesisUtterance(LISTEN_TEXT);
  u.lang = 'en-US'; u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  listenPlayed = true;
  document.getElementById('listen-field').classList.remove('hidden');
}

function checkReveal() {
  const words = document.getElementById('listen-textarea').value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('word-count').textContent = `${words} words`;
  if (words >= 20) document.getElementById('reveal-btn').classList.remove('hidden');
}

function revealTranscript() {
  document.getElementById('transcript').classList.remove('hidden');
  document.getElementById('reveal-btn').disabled = true;
  markSection('listening');
  Store.addXP(20);
}
```

**Reference file:** `intermediate_aula_05.html`

---

**Template pattern** (use `aula_33.html` or `aula_28.html` as reference):
```html
<div id="top-nav-placeholder"></div>
<div id="side-nav-placeholder"></div>
<main class="md:pl-24 pb-32 md:pb-10">
  <!-- HERO: bg-gradient-to-br from-navy via-[dark] to-[accent], floating emojis -->
  <!-- STICKY TAB BAR: .tab-btn buttons with data-tab attribute -->
  <!-- content divs: id="tab-{name}" class="tab-content fade-in" -->
</main>
<script src="store.js"></script>
<script src="components.js"></script>
<script>
  Components.mount('top-nav-placeholder', Components.renderTopNav('classes'));
  Components.mount('side-nav-placeholder', Components.renderSideNav('classes'));
  Components.mount('mobile-nav-placeholder', Components.renderMobileNav('classes'));
</script>
```

Back link in hero goes to `classes.html`. Prev/Next navigation links in hero must follow the **navigation chain** above.

**Key CSS classes (defined inline in each aula):**
- `.flip-card` / `.flip-card.flipped` — 3D perspective flip
- `.tab-btn` / `.tab-btn.active` — gradient underline via `::after`
- `.fade-in` — opacity + translateY entrance animation
- `.prog-dot` — 10×10px circle for section progress indicator
- `.xp-pop` — floating "+XP" animation on reward

**Section progress (new/communicative template):**
```js
const SECTIONS = [...];
const _done = new Set();
function markSection(s) { if (_done.has(s)) return; _done.add(s); Store.addXP(20); showXP('+20 XP 🔥'); updateDots(); }
```

---

### Old-template aulas (`lesson-engine.js`): two required fixes

- `#result-overlay` needs `onclick="if(event.target===this){this.classList.add('hidden')}"` on the outer
  div. Without it, the `z-50` overlay stays over the `z-40` tab bar after the practice quiz and the
  student can't click anything.
- Add the correct-answer animation after `@keyframes shake{...}` (`answerPrac()` adds `.correct`):
```css
@keyframes correct-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.opt-btn.correct{animation:correct-pulse .3s ease}
```

## Escuta sem texto: a resposta certa SEMPRE aparece escrita

**Regra do Luis, 13/set/2026. Vale para o site inteiro, daqui em diante.**

Em toda atividade que é **só de escutar** — o aluno ouve um áudio e não há
nada escrito na tela — assim que ele responde, **a resposta certa tem que
aparecer por escrito**. Vale tanto quando acerta quanto quando erra; quem
errou é justamente quem mais precisa ver como se escreve.

**Por quê:** uma atividade que cobra escuta e nunca devolve a grafia ensina o
aluno a reconhecer o som e a continuar sem saber escrever a palavra. Ele
termina o exercício com 100% de acerto e sem ter aprendido a forma escrita.

**Onde isso já vale (verificado):**

| Atividade | Situação |
|---|---|
| `lessons.html` → `renderListen()` / `answerListen()` | **corrigido em 13/set.** O `<p id="listen-reveal">` embaixo do botão de áudio troca "Toque para ouvir" pela palavra ouvida + a tradução. O avanço automático subiu de 700/1200ms para **1600/2400ms**, senão não dá tempo de ler. |
| `listening-lab.js` (ditado das aulas de curso) | já cumpria: o `pintar()` revela a frase-alvo inteira, palavra a palavra, depois do "Conferir". |

**Ao criar atividade de escuta nova, o checklist é:**
1. Depois da resposta, a palavra/frase **ouvida** aparece escrita — não só a opção que o aluno clicou.
2. Aparece também no erro.
3. O tempo até avançar dá para ler (≥1,5s; no erro, mais).
4. Use `textContent`, não `innerHTML`, para escrever a palavra revelada.

## Confirmação de acerto e de erro (regra do Luis, 13/set/2026)

Toda atividade tem que dizer **em texto** o que aconteceu. Cor sozinha não serve:
daltônico não enxerga verde/vermelho, e quem errou precisa **ler qual era a certa**.

| Onde | Acerto | Erro |
|---|---|---|
| `answerQuiz` (trilha) | `✅ Isso!` | `💡 Quase — a resposta é X` + o `why`, se a lição tiver |
| `answerListen` (trilha) | `✅ Isso!` + a grafia | `💡 Quase — você ouviu:` + a grafia |
| `buildCheck` (trilha) | `✨ Correto!` | `🔄 Tente novamente!`; **na 3ª tentativa revela a frase** |
| aula de curso (`answerQ`) | `✅ Correct!` + `q.rule` | `❌ Not quite.` + `q.rule` |

Os tempos de avanço subiram para dar tempo de LER: quiz 1100/2600ms,
listen 1600/2400ms (antes 600/1200 e 700/1200).

**Campo `why` no quiz da trilha:** opcional, uma linha dizendo por que aquela é a
certa. As 218 lições que já existem **não têm** — por isso a caixa degrada sozinha
para só a resposta. Lição nova deve trazer `why`.

## O dia 2 da trilha usa o vocabulário da lição (13/set/2026)

`showGameStep()` roteia o mini 2 para **speed / scramble / typing** in-page
(`id % 3`), todos montados de `currentLesson.vocab`. Antes ele abria um jogo
standalone com lista de palavras própria — nenhum dos jogos lê parâmetro de URL
ou sabe qual é a lição, então o dia 2 era desconexo por construção.

Se for mexer: **não crie jogo novo**. Os painéis que já leem o vocabulário da
lição são `panel-listen`, `panel-typing`, `panel-speed`, `panel-scramble` e
`panel-build`.

## Quiz de IA do modo guiado

`loadAIQuiz()` troca o quiz estático da lição por 5 perguntas de `POST /api/lesson-quiz`. O nível vem de
`nivelDaLicao(lesson)` (faixa de id = curso), a gramática da lição vai junto e o `explain` alimenta a
caixa de feedback. Cache no navegador: `capyAIQuiz_v2_<id>_<data>`; mude o `v2` quando o formato das
perguntas mudar.

Limitação: mesmo pedindo 2 de 5 perguntas de gramática, o modelo tende a perguntar sobre o tema. Se
incomodar, misture 2–3 perguntas estáticas de gramática com 2–3 da IA.

Prompts do site: o público é **brasileiro de 16+**. Descreva os campos do JSON em vez de dar um exemplo
com valores reais — este modelo copia o exemplo (já aconteceu com opções "A/B/C/D"). Rota que responde
um objeto usa o modo JSON da API (`callOpenAI(..., { json: true })`); rota que responde uma lista não pode.

## Custo da ligação por voz

- Voz em tempo real só para o plano Super (`VOZ_MINUTOS_MES`) e para o admin; teto global em dólar no
  mês (`VOZ_TETO_USD_MES`).
- Ao emitir o token (`/api/realtime-token`), o servidor **reserva** `min(minutos restantes, 30 min)`
  numa linha `__voz_<aluno>_<data>_reserva` (`reservarVoz`).
- Ao desligar, o navegador manda `uso` + `duracaoMs` para `/api/conversa-uso` (via `sendBeacon`); o
  servidor **liquida** a reserva com o maior valor entre o relato e o relógio dele desde a emissão
  (`liquidarReservaVoz`). Sem relato, a reserva inteira fica cobrada.
- Preço por token na tabela `PRECO_VOZ` do servidor; o `/api/conversa-feedback` (entrevista) calcula com
  a mesma função (`calcularCustoVoz`).

## Design System

Full spec in `1_Design_System.md`. Key constraints:

- **Font:** Plus Jakarta Sans (400–900) via Google Fonts
- **Navy** `#001f3f` — hero backgrounds, deep containers
- **Pink** `#ec4899` — CTAs, active state, energy
- **Green** `#10b981` — success, forest theme
- **No 1px borders** — separate sections via background color shifts only
- **No yellow** — use `error` `#ba1a1a` for warnings
- **Rounded:** `3rem` for top-level containers, `1.5rem` for nested items
- **Hero gradient:** `bg-gradient-to-br from-navy via-violet-950 to-[chapter-accent]`
- **Glassmorphism nav:** surface @ 70% opacity + `backdrop-blur-[20px]`
- **Buttons:** `border-radius: 9999px`, `scale(0.98)` on press

Chapter accent colors (hero gradients):
| Chapter | Colors |
|---|---|
| 1 — Beginner | `from-emerald-600 to-emerald-500` |
| 2 — Elementary | `from-blue-600 to-blue-500` |
| 3 — Pre-Intermediate | `from-violet-600 to-violet-500` |
| 4 — Intermediate | `from-amber-600 to-amber-500` |

## Existing Aula Files

Present: `aula_01` – `aula_44` (**44 lessons total**). All lessons are available and linked in `classes.html`.


All 44 aulas have a homework tab (new, old and communicative templates).

## Homework Tab Pattern (standard for all aula pages)

Every aula page must include a `📋 Homework` tab as the **last tab**, after `🗣️ Speak`. Homework takes 10–15 minutes and is based on the lesson content. **All 44 aulas already have homework** — this section is for creating new aulas.

### Adding Homework to a new aula

**1. Tab button** — append after the Speak button in the sticky tab bar:
```html
<button class="tab-btn px-5 py-4 text-sm text-slate-500 whitespace-nowrap" data-tab="homework">📋 Homework</button>
```

**2. Content div** — place after the Speak section:
```html
<div id="tab-homework" class="fade-in hidden">
  <!-- Amber header banner -->
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-2xl font-black mb-1">📋 Homework</h2>
        <p class="text-white/80 text-sm">Aula XX — [Lesson Title]</p>
      </div>
      <div class="bg-white/20 rounded-full px-4 py-2 text-sm font-black">⏱️ 10–15 min</div>
    </div>
  </div>
  <!-- task cards, then submit button -->
  <button onclick="submitHomeworkXX()" class="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 rounded-2xl hover:scale-105 transition-all shadow-sm text-base">
    ✓ Submit Homework &nbsp;+75 XP
  </button>
  <div id="hw-done-XX" class="hidden mt-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
    <div class="text-3xl mb-2">🏆</div>
    <p class="font-black text-emerald-700">Homework complete! +75 XP earned!</p>
    <a href="aula_YY.html" class="mt-3 inline-block bg-emerald-500 text-white font-black px-6 py-2.5 rounded-full hover:scale-105 transition-all text-sm">Continue to Aula YY →</a>
  </div>
</div>
```

**3. Script — NEW template** (standalone, no lesson-engine.js):
```js
function submitHomeworkXX() {
  markSection('homework');  // ← NEW template: pass section name
  Store.addXP(75);
  document.getElementById('hw-done-XX').classList.remove('hidden');
  event.target.disabled = true;
}
// Update SECTIONS array to include 'homework'
const SECTIONS = ['vocab','expressions','grammar','practice','speak','homework'];
```

**3. Script — OLD template** (uses lesson-engine.js / `initLesson`):
```js
function submitHomeworkXX() {
  markSection();           // ← OLD template: NO args
  Store.addXP(75);        // ← must call SEPARATELY
  document.getElementById('hw-done-XX').classList.remove('hidden');
  event.target.disabled = true;
}
// Add to initLesson call:
initLesson({
  tabs: ['vocab','expressions','grammar','practice','speak','homework'], // add 'homework'
  totalSections: 6, // increment by 1 from previous
  ...
});
```

### Homework interactive task types (use 4–5 per lesson)

**1. Word Order (Duolingo-style)** — shuffle word tiles, drag/tap to reconstruct a sentence.
```js
const WO_DATA = [
  { s: 'I will achieve my goals this year', w: ['I','will','achieve','my','goals','this','year'] },
  ...
];
const wo = WO_DATA.map(d => ({ ans:[], bank: shuffle(d.w) }));
// wo[i].ans = built sentence, wo[i].bank = remaining tiles
// woRender() → click tile to move between bank↔ans
// woCheck(i) → compare ans.join(' ').toLowerCase() to s.toLowerCase()
// woReset(i) → restore bank, clear ans
```

**2. Match Pairs** — two columns; tap left then right to connect pairs.
```js
const MP = [
  { l:'GET UP ⬆️', r:'Levantar da cama' },
  ...
];
const mpR = shuffle(MP.map((p,i) => ({ label:p.r, pid:i })));
let mpSelL = null; const mpDone = new Set();
// mpClickL(i) → sets mpSelL
// mpClickR(i) → if mpR[i].pid === mpSelL, add to mpDone
// Wrong match: flash red border for 700ms then reset
```

**3. Error Correction** — show sentence with underlined error; student rewrites in `<input>`.
```js
const ERR_CHECKS = [
  v => v.includes('correct form') && !v.includes('wrong form'),
  ...
];
const ERR_HINTS = ['wrong form → correct form (reason)'];
function checkErrors() {
  const v = input.value.toLowerCase().replace(/[?.!,]/g,'').trim();
  if (check(v)) show '✅ Correto!'; else show `❌ Dica: "${hint}"`;
}
```

**4. Multiple-choice identification** — radio buttons per scenario (e.g. WILL use identification).
```js
// Build with WILL_USES array: { sentence, opts[], ans }
// Radio inputs name="will-use-{i}", check on button click
```

**5. Fill-in-blank** — inline `<input>` with `data-ans` attribute; verify on button click.
```js
document.querySelectorAll('.fill-check').forEach(inp => {
  const correct = inp.value.toLowerCase().trim() === inp.dataset.ans;
});
```

**6. Free writing (always last)** — `<textarea>` for open-ended composition. Submit button calls `submitHomework{N}()`.

### XP rewards
- Practice quiz completion: **+50 XP**
- Dialogue read button: **+20 XP**
- Homework submission: **+75 XP**

---

## API endpoints (`api/index.js`)

Source of truth: the `if (req.method === … && url === …)` blocks in `api/index.js`.

- **Auth:** `POST /api/auth/signup | login | logout | guest | magic-link | request-reset | set-password`,
  `GET /api/auth/session`, `GET /api/auth/callback`, `GET /api/auth/mfa/status`,
  `POST /api/auth/mfa/enroll | verify`.
- **Student data (session):** `/api/db` (state), `/api/profile`, `/api/me`, `/api/homework`,
  `POST /api/track`, `GET /api/db/leaderboard` (public, names without markup).
- **AI (per-plan limits, `AI_ROUTE_KEYS`):** `/api/chat`, `/api/lesson-chat`, `/api/quiz`,
  `/api/lesson-quiz`, `/api/translate`, `/api/story`, `/api/flashcard-deck`, `/api/dialogue-scene`,
  `/api/parent-report`, `/api/word-of-day`, `/api/daily-challenge`, `/api/newsline`, `/api/historyline`,
  `/api/youtube`, `/api/personalize`, `/api/correct-writing`, `/api/study-plan`, `/api/music`,
  `/api/lyrics-search`, `/api/lyrics`, `/api/transcribe`, `GET /api/tts`.
- **Voice:** `POST /api/realtime-token`, `/api/conversa-uso`, `/api/conversa-feedback`, `GET /api/personas`.
- **Admin (admin session, aal2 with `ADMIN_REQUIRE_MFA=true`):** `/api/admin/*` — overview, students,
  courtesies, grant-plan, revoke-plan, login-link, set-password, broadcast, campaign, funnel, voz,
  brief, stats, gpstronic-results, email-test.
- **Server-to-server:** `POST /api/kiwify-webhook` (HMAC signature in `?signature=` or header);
  crons `GET /api/send-reminders` and `GET /api/teacher-brief` (`Authorization: Bearer $CRON_SECRET`).
