# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Capy Yara Adventures is a gamified English-learning platform for Brazilian students, centered on a capybara mascot named Yara 🦫. Built with vanilla HTML/CSS/JS (Tailwind CDN) + a Node.js dev server with OpenAI integration. No build step — all files are static except the API layer.

## Dev Server

```bash
node scripts/dev-server.js   # starts on http://localhost:8765
```

Requires `.env`:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini   # optional, this is the default
PORT=8765                   # optional
```

The server also exports a `handler` used by Vercel serverless (`/api/index.js`).

## Deployment

Vercel (project: `capy-yara-adventures`). Production URL: **https://capy-yara-adventures.vercel.app**

```bash
npx vercel --prod --force   # always use --force to bypass cache
```

`vercel.json` rewrites:
- `/api/*` → `/api/index.js`
- `/` → `4_Login_Capy_Yara_Welcomes_You.html`

Cache headers (`no-store`) are set globally in `vercel.json` for all routes to prevent stale deployments.

## GitHub

```
https://github.com/luisfelima11-alt/CapyAi.git
```

Typical push after changes:
```bash
git add <files>
git commit -m "description"
git push origin main
npx vercel --prod --force
```

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

**⚠️ Cache busting:** All pages reference `components.js?v=3`. When `components.js` changes, bump the version on ALL html files (use Node.js `fs.readdirSync` + `replace` loop, not sed).

**⚠️ Chrome Auto-Translate:** The nav container uses `translate="no"` to prevent Chrome from auto-translating nav labels (e.g. "Cursos" → "Lessons"). Never remove this attribute.

### State Management (`store.js`)

Global state in `localStorage` key `capyYaraState_{userId}`:
- `xp`, `badges[]`, `completedLessons[]`, `completedMinis[]`
- `planType`: `'free'` | `'plus'` | `'pro'`
- `starBerries`, `streakDays`, `aiUsageToday`

Key methods: `Store.addXP(n)`, `Store.completeLesson(id)`, `Store.completeMini(lessonId, miniNum)`, `Store.consumeAI()`.

Fires DOM events: `stateChanged`, `levelUp`, `badgeUnlocked`, `streakMilestone`.

### Auth (`auth.js`)

Session in `localStorage.capySession` = `{id, name, email, avatar}`.
```js
Auth.requireAuth()      // redirects to login if no session
Auth.getSession()       // returns session object or null
Auth.continueAsGuest()  // guest session: {id:'guest', name:'Explorer'}
```
Passwords are base64-encoded (not production-grade). User data stored in Supabase (see below).

### Backend — Supabase (`api/index.js`)

The API uses Supabase Postgres for persistent user data. Env vars required on Vercel:
```
SUPABASE_URL=https://kxihhowppupmfanufkim.supabase.co
SUPABASE_KEY=<service role key>   # server-side only, never expose client-side
```

API calls Supabase REST API directly via `fetch()` — no npm package needed:
```js
async function sb(path, opts = {}) {
  const r = await fetch(`${SB_URL}/rest/v1${path}`, {
    ...opts,
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`,
                'Content-Type': 'application/json', ...(opts.headers||{}) },
  });
  if (r.status === 204) return null;
  const text = await r.text();
  return text ? JSON.parse(text) : null;
}
```

**Supabase tables:**
- `accounts` — `id, name, email, password, avatar, created_at`
- `user_state` — `user_id (PK), data (jsonb), updated_at`

`/api/db` GET/POST reads and upserts `user_state`. `/api/db/accounts` reads/writes `accounts`.
Upsert uses `Prefer: resolution=merge-duplicates,return=minimal` header.

### Lesson Architecture

Trail defined in `learn.html` (`TRAIL` array, 24 lessons, 4 chapters). Each lesson has 4 mini-lessons × 6 steps (Listen, Quiz, Game, Build, Speak, Chat). Progress key: `localStorage.capyGuidedStep_{lessonId}_m{miniNum}`.

### Aula Pages (`aula_XX.html`)

Each `aula_XX.html` is a self-contained lesson page. **Newer pages (aula_33+)** follow a 7-tab pattern:
1. **Tab 1** — Vocabulary (flip cards, 18+ words)
2. **Tab 2** — Expressions (expandable cards with example + meaning)
3. **Tab 3** — Grammar (accordion sections with rules and examples)
4. **Tab 4** — Dialogue (Leo & Capy Yara conversation, key structures highlighted)
5. **Tab 5** — Practice (quiz, 10 questions with auto-scoring)
6. **Tab 6** — Speak (TTS sentences, 8 items, checkbox to mark done)
7. **Tab 7** — Homework (interactive exercises, see below)

**Template pattern** (use `aula_33.html` or `aula_28.html` as the reference to copy):
```html
<div id="top-nav-placeholder"></div>
<div id="side-nav-placeholder"></div>
<main class="md:pl-24 pb-32 md:pb-10">
  <!-- HERO: bg-gradient-to-br from-navy via-[dark] to-[accent], floating emojis -->
  <!-- STICKY TAB BAR: .tab-btn buttons with data-tab attribute -->
  <!-- 6 content divs: id="tab-{name}" class="tab-content fade-in" -->
</main>
<script src="store.js"></script>
<script src="components.js"></script>
<script>
  Components.mount('top-nav-placeholder', Components.renderTopNav('classes'));
  Components.mount('side-nav-placeholder', Components.renderSideNav('classes'));
  Components.mount('mobile-nav-placeholder', Components.renderMobileNav('classes'));
  // define data arrays, build flip cards, wire tabs, section progress
</script>
```

Back link in hero goes to `classes.html`.

**Key CSS classes (defined inline in each aula):**
- `.flip-card` / `.flip-card.flipped` — 3D perspective flip
- `.tab-btn` / `.tab-btn.active` — gradient underline via `::after`
- `.fade-in` — opacity + translateY entrance animation
- `.prog-dot` — 10×10px circle for section progress indicator
- `.xp-pop` — floating "+XP" animation on reward

**Section progress pattern:**
```js
let sectionsDone = 0;
function markSection() { sectionsDone++; buildSectionDots(); }
buildSectionDots(); // renders dots in hero, colors based on sectionsDone
```

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

Present: `aula_20` – `aula_24`, `aula_26` – `aula_35`.
Missing: `aula_25`, `aula_36`, `aula_37`.

Pages `aula_33`, `aula_34`, `aula_35` were built with the newer 7-tab pattern including interactive homework.
Pages `aula_26`, `aula_27`, `aula_28` have homework tabs with interactive exercises (word order, match pairs, error correction).

Lesson content data for aulas 29–37: `C:\Users\Win10\lesson-pdfs\lessons-data.js`
Custom dialogues for aulas 29–37: `C:\Users\Win10\lesson-pdfs\generate-html.js` (`DIALOGUES` object, keys 29–37)

## Homework Tab Pattern (standard for all aula pages)

Every aula page must include a `📋 Homework` tab as the **last tab**, after `🗣️ Speak`. Homework takes 10–15 minutes and is based on the lesson content.

### Adding Homework to an aula

**1. Tab button** — append after the Speak button in the sticky tab bar:
```html
<button class="tab-btn px-5 py-4 text-sm text-slate-500 whitespace-nowrap" data-tab="homework">📋 Homework</button>
```

**2. Content div** — place after the Speak section, before `</div><!-- /content -->` or `</main>`:
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

  <div class="space-y-4">
    <!-- 3–4 task cards. Each task: -->
    <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
      <div class="flex items-start gap-4 mb-4">
        <div class="w-9 h-9 rounded-full bg-[color]-100 text-[color]-700 font-black text-sm flex items-center justify-center flex-shrink-0">1</div>
        <div>
          <h3 class="font-black text-navy text-base">Task title</h3>
          <p class="text-slate-500 text-sm mt-1">Instructions.</p>
        </div>
      </div>
      <!-- Input fields or textarea depending on task type -->
      <input type="text" placeholder="..." class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[color]-400"/>
      <!-- OR for long-form: -->
      <textarea rows="5" placeholder="..." class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[color]-400 resize-none"></textarea>
    </div>
  </div>

  <button onclick="submitHomework('XX')" class="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 rounded-2xl hover:scale-105 transition-all shadow-sm text-base">
    ✓ Submit Homework &nbsp;+75 XP
  </button>
  <div id="hw-done-XX" class="hidden mt-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
    <div class="text-3xl mb-2">🏆</div>
    <p class="font-black text-emerald-700">Homework complete! +75 XP earned!</p>
  </div>
</div>
```

**3. Script** — add `submitHomework` helper and update `initLesson`:
```js
function submitHomework(lessonId) {
  const btn = event.target;
  btn.disabled = true; btn.textContent = '✓ Submitted!'; btn.classList.add('opacity-75');
  document.getElementById('hw-done-' + lessonId).classList.remove('hidden');
  markSection();
  if (typeof Store !== 'undefined') Store.addXP(75);
}
window.submitHomework = submitHomework;

initLesson({
  tabs: ['vocab','expressions','grammar','practice','speak','homework'], // add 'homework'
  totalSections: 6, // increment by 1
  ...
});
```

For aulas with **custom tab systems** (no `initLesson`), also update the `TABS` array:
```js
const TABS = ['tab1','tab2','...','speak','homework'];
```
And increment section dot loop: `for (let i = 0; i < N+1; i++)` and label `/ N+1 sections done`.

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

## API Endpoints (`scripts/dev-server.js`)

- `POST /api/chat` — Free-form Yara conversation
- `POST /api/quiz` — AI quiz generation
- `POST /api/translate` — Word translation
- `POST /api/lesson-chat` — Yara chat scoped to lesson topic
- `POST /api/dialogue-scene` — AI grammar dialogue generator
- `POST /api/flashcard-deck` — Vocabulary deck generation
- `POST /api/story` — AI story generation
- `GET /api/word-of-day` — Daily vocabulary word
- `GET /api/daily-challenge` — Daily challenge prompt
- `GET/POST /api/db` — Local JSON user state (reads/writes `database.json`)
- `GET /api/db/leaderboard` — Top 20 users by XP
