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

Vercel (project: `capy-yara-adventures`). No build step. `vercel.json` rewrites:
- `/api/*` → `/api/index.js`
- `/` → `4_Login_Capy_Yara_Welcomes_You.html`

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
Passwords are base64-encoded (not production-grade). Local DB: `database.json`.

### Lesson Architecture

Trail defined in `learn.html` (`TRAIL` array, 24 lessons, 4 chapters). Each lesson has 4 mini-lessons × 6 steps (Listen, Quiz, Game, Build, Speak, Chat). Progress key: `localStorage.capyGuidedStep_{lessonId}_m{miniNum}`.

### Aula Pages (`aula_XX.html`)

Each `aula_XX.html` is a self-contained lesson page following a strict 6-tab pattern:
1. **Tab 1** — Core vocabulary (flip cards)
2. **Tab 2** — Secondary vocabulary / grammar examples (flip cards)
3. **Tab 3** — Expressions (flip cards)
4. **Tab 4** — Grammar focus (structured explanation)
5. **Tab 5** — Practice (fill-in-blank or matching exercises)
6. **Tab 6** — Speak (sentences for oral practice + XP reward)

**Template pattern** (use `aula_28.html` as the reference to copy):
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

Present: `aula_20` – `aula_24`, `aula_26` – `aula_32`, `aula_34`.
Missing: `aula_25`, `aula_33`, `aula_35`, `aula_36`, `aula_37`.

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

### Homework task types (use 3–4 per lesson)
- **Sentence writing** — write N sentences using the grammar/vocabulary (inputs)
- **Fill-in-blank** — short inline fill-ins based on grammar patterns
- **Translation** — PT→EN sentences targeting lesson structures
- **Free paragraph** — 4–5 sentences on a personal theme using lesson vocab (textarea)
- **Expression usage** — write original sentences using idioms from the lesson

### XP reward
Always `+75 XP` on homework submission (vs +50 XP for practice quiz).

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
