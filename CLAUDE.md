# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Capy Yara Adventures is a gamified English-learning platform for Brazilian students, centered on a capybara mascot named Yara 🦫. Built with vanilla HTML/CSS/JS (Tailwind CDN) + a Node.js dev server with OpenAI integration. No build step — all files are static except the API layer.

## Dev Server

```bash
npm run dev        # node scripts/dev-server.js → http://localhost:8765
npm run mock:db    # optional: in-memory Supabase stand-in on :54321
npm run test:api   # security/auth regression tests (no network, no keys needed)
```

`scripts/dev-server.js` serves the static files and delegates every `/api/*` request to the
**same handler that runs in production** (`api/index.js`). Never re-implement API routes in the dev server.
It also sets `CAPY_DEV=1` (magic links are shown on screen instead of e-mailed) and a random
`SESSION_SECRET` if none is set.

Env vars (see `.env.example`): `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_KEY`, `OPENAI_API_KEY`,
`RESEND_API_KEY`, `EMAIL_FROM`, `APP_URL`, `TEACHER_KEY`, `KIWIFY_WEBHOOK_SECRET`, optional `OPENAI_MODEL`,
`PORT`, `ALLOWED_ORIGINS`. For local dev without a database: `SUPABASE_URL=http://localhost:54321 SUPABASE_KEY=dev`.

## Deployment

Vercel (project: `capy-yara-adventures`). Production URL: **https://www.capyenglish.com.br**

**Order matters when a change needs the database:** run the SQL in `supabase/migrations/` (Supabase SQL editor)
**before** deploying code that depends on it; files named "after deploy" run after. Required production env:
`SESSION_SECRET` (auth is disabled without it), `RESEND_API_KEY` (magic links refuse to work without it),
`TEACHER_KEY` (8+ chars; admin pages are closed without it).

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

**⚠️ Cache busting:** Pages reference local scripts as `name.js?v=<git sha>`. After changing any shared JS
(`components.js`, `store.js`, `auth.js`, `yara-widget.js`...), commit and run `npm run bump`, then commit the bump.

**⚠️ Chrome Auto-Translate:** The nav container uses `translate="no"` to prevent Chrome from auto-translating nav labels (e.g. "Cursos" → "Lessons"). Never remove this attribute.

### State Management (`store.js`)

Progress in `localStorage`: `capyYaraState_{userId}` for logged-in users, `capyYaraState` for guests.
- `xp`, `badges[]`, `completedLessons[]`, `completedMinis[]`
- `planType`: `'free'` | `'pro'` | `'super'` (synced from `/api/me`; UI hint only — the server enforces limits)
- `starBerries`, `streakDays`, `aiUsageToday`

Key methods: `Store.addXP(n)`, `Store.completeLesson(id)`, `Store.completeMini(lessonId, miniNum)`, `Store.consumeAI()`,
`Store.resetProgress()` (also resets the server copy — never "reset" by deleting localStorage keys).

Sync rules: `save()` writes locally and pushes to `/api/db` with a 2s debounce (flushed on `pagehide`).
For logged-in users nothing is pushed until the server copy was loaded (`Store._remoteReady`) — this
prevents a new device from overwriting saved progress. On load, `/api/auth/session` is checked once per tab;
a 401 sends the user to login with `?reason=session`.

`Store` and `Auth` are exposed as `window.Store` / `window.Auth` (a top-level `const` is not a window property;
many pages check `if (window.Store)`).

Fires DOM events: `stateChanged`, `levelUp`, `badgeUnlocked`, `streakMilestone`, `planChanged`.

### Auth (`auth.js` + `/api/auth/*`)

The session is an **HttpOnly cookie** `capy_sess` set by the server (HMAC-signed `{uid, v, exp, iat, m}`,
30 days, `api/_lib/session.js`). Same-origin `fetch('/api/...')` calls send it automatically.
`localStorage.capySession` = `{id, name, email, avatar}` is only a display cache.
```js
await Auth.signUp(name, email, password, avatar)  // POST /api/auth/signup (password ≥ 8 chars)
await Auth.login(email, password)                  // POST /api/auth/login + copies saved progress to the device
Auth.logout()                                      // POST /api/auth/logout + clears local data
Auth.getSession() / Auth.continueAsGuest() / Auth.checkOnboarding()
```
- Passwords: scrypt hash in `accounts.password_hash`. The old base64 `accounts.password` column was exposed
  publicly and is **never** accepted: such accounts get `403 password_reset_required`, sign in with the
  magic link (`/api/auth/magic-link` → `verify.html`) and create a new password (`POST /api/auth/password`).
- `accounts.session_version` revokes sessions (bumped on password change → other devices are logged out).

### Backend — Supabase (`api/index.js`)

The API uses Supabase Postgres via its REST API (`api/_lib/supabase.js`: `sb()`, `sbRows()`, `sbRequest()`).
`SUPABASE_KEY` is the service-role key: server-side only. RLS is enabled on all tables with no policies,
so only the API can read/write them.

**Supabase tables:**
- `accounts` — `id, name, email, password (legacy, nulled), password_hash, session_version, email_verified_at, avatar, pending_setup, created_at`
- `user_state` — `user_id (PK), data (jsonb), updated_at`
- `user_profiles` — `id (PK), english_level, goals, interests, interests_detail, daily_goal_minutes, onboarding_complete, plan, plan_expires_at, kiwify_subscription_id, updated_at`
- `magic_link_tokens`, `rate_limit_log`, `api_metrics_daily`, `homework_submissions`

Schema changes live in `supabase/migrations/` (run them in the Supabase SQL editor; see Deployment).

### 🔒 Security rules (keep these when adding features)

- **Identity comes only from the session** (`session.requireUser(req, res)` for private data,
  `session.readSession(req)` for rate-limit identity). Never trust a `userId` sent by the browser.
- Users may only edit whitelisted profile fields (`PROFILE_FIELDS`); plan/billing fields are written only by the Kiwify webhook.
- Never return password/hash columns; never add endpoints that list other users' data.
- **AI:** system prompts live on the server (`api/_lib/prompts.js`, `POST /api/chat` with `mode`). Every
  endpoint that calls OpenAI must call `checkRateLimit()` first and clip user input.
- No `Access-Control-Allow-Origin: *`; cross-site POSTs are rejected (`isAllowedOrigin`).
- Admin endpoints use the `X-Admin-Key` header (`TEACHER_KEY`), never a query string or a default key.
- Escape user-provided text (names, e-mails) before putting it in `innerHTML`.
- Add a case to `scripts/smoke-api.js` for every new endpoint and run `npm run test:api`.

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

### ⚠️ Critical Bugs — Known Issues in Old-Template Aulas

#### 1. result-overlay backdrop trap (lesson-engine.js aulas)

**Pattern:** `<div id="result-overlay" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">` WITHOUT an `onclick` handler.

**Symptom:** After completing the practice quiz, the overlay shows at `z-50`. Clicking outside the white modal does nothing. The overlay stays, covering the `z-40` sticky tab bar. ALL tabs and buttons become unclickable. User is completely stuck.

**Fix:** Add `onclick="if(event.target===this){this.classList.add('hidden')}"` to the outer overlay div.

**Status:**
- ✅ Fixed: aula_20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 34
- ✅ Not affected: aula_25 (no result-overlay), new-template aulas (different quiz pattern)
- ⚠️ Always add this onclick when creating any new old-template aula with a result-overlay.

#### 2. correct-pulse animation in old-template

**Issue:** `lesson-engine.js`'s `answerPrac()` set `btn.className` directly but never added `.correct` class, so the CSS animation never triggered.

**Fix applied to `lesson-engine.js`:** Added `btn.classList.add('correct')` after the `btn.className =` line on correct answers.

**Required CSS in each old-template aula** (add after `@keyframes shake{...}`):
```css
@keyframes correct-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.opt-btn.correct{animation:correct-pulse .3s ease}
```
Added to: aula_20–24, 26–27, 29–32, 34.

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

Present: `aula_01` – `aula_44` (**44 lessons total**, including `aula_25`). All lessons are available and linked in `classes.html`.

⚠️ Inline scripts break on unescaped apostrophes (`'Let's go'`). Check every page with a JS parser after
editing lesson content (e.g. extract `<script>` blocks and run them through `new vm.Script()`).

**Homework status (all aulas now have homework):**
- aulas 01–19: always had homework (new template)
- aulas 20–24: homework **added** (old template, `initLesson` tabs updated to include `'homework'`)
- aulas 25–28: homework was already present
- aulas 29–32: homework **added** (old template, 7 tabs total)
- aulas 33–42: always had homework (new template)
- aulas 43, 44: homework included (communicative template)

Lesson content data for aulas 29–37: `C:\Users\Win10\lesson-pdfs\lessons-data.js`
Custom dialogues for aulas 29–37: `C:\Users\Win10\lesson-pdfs\generate-html.js` (`DIALOGUES` object, keys 29–37)

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

⚠️ When creating any old-template aula, **always add the onclick backdrop fix** to the result-overlay div. See "Critical Bugs" section above.

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

## API Endpoints (`api/index.js`)

Auth: `POST /api/auth/signup | login | logout | password | magic-link | verify`, `GET /api/auth/session`.

User data (session required): `GET/POST /api/db` (`type=state`), `GET/POST /api/profile`, `GET /api/me` (plan),
`POST /api/homework`. Public: `GET /api/db/leaderboard` (names HTML-escaped).

AI (rate limited per plan; guests per IP — `RATE_LIMITS`):
- `POST /api/chat` — Yara. `mode`: `tutor` (default), `lesson` (widget; `context.page`, `context.lang`),
  `youtube` (`context.summary`, `context.vocabulary`), `challenge-grade` (`context.instruction`),
  `reading-story` (`context.topic`, `context.difficulty`). Replies use the legacy envelope
  `{candidates:[{content:{parts:[{text}]}}]}`.
- `POST /api/quiz | translate | story | flashcard-deck | dialogue-scene | parent-report | lesson-quiz | lesson-chat`
- `GET /api/word-of-day`, `GET /api/daily-challenge` (cached per day)
- `POST /api/youtube | personalize | study-plan | music`, `GET /api/lyrics-search | lyrics`, `GET /api/tts`

Admin (`X-Admin-Key` header): `GET /api/homework`, `GET /api/admin/stats`. Payments: `POST /api/kiwify-webhook` (HMAC).
