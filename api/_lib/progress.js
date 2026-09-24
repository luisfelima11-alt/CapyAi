// ════════════════════════════════════════════════════════════════════════════
// Lesson progress, study days and streaks (tables from migration 0003)
// ════════════════════════════════════════════════════════════════════════════
const { sb, sbRows, sbRequest } = require('./supabase');
const { todayBRT, addDays } = require('./dates');
const CURRICULUM = require('../../curriculum.json');

const enc = encodeURIComponent;
const nowIso = () => new Date().toISOString();

const LESSON_ID_RE = /^(fr_)?aula_\d{2}$/;
// 'section:<tab>' or 'xp:<tab>:<amount>#<n>' (see progress.js on the client)
const ITEM_RE = /^(section:[a-z0-9_-]{1,24}|xp:[a-z0-9_-]{1,24}:\d{1,3}#\d{1,2})$/;
const MAX_ITEMS_PER_LESSON = 80;
const MAX_ITEMS_PER_REQUEST = 20;
const MILESTONES = [3, 7, 14, 30, 50, 100, 365];

// Daily goal from onboarding minutes: ~5 min per study activity (min 1).
function dailyGoalTarget(minutes) {
    const m = Number(minutes);
    return Math.max(1, Math.round((Number.isFinite(m) && m > 0 ? m : 10) / 5));
}

// Streak as the user should see it today (0 if the last study day is before yesterday).
function effectiveStreak(row, today) {
    const day = today || todayBRT();
    if (!row || !row.last_day) return { current: 0, longest: (row && row.longest) || 0, activeToday: false };
    const alive = row.last_day === day || row.last_day === addDays(day, -1);
    return { current: alive ? row.current || 0 : 0, longest: row.longest || 0, activeToday: row.last_day === day };
}

async function getStreakRow(userId) {
    return (await sbRows(`/user_streaks?user_id=eq.${enc(userId)}&select=current,longest,last_day`))[0] || null;
}

// Counts one study activity for today and extends the streak on the first one.
// Returns { streak: {current, longest, activeToday, extended, milestone}, today: {count, goal, reached, justReached} }
async function recordStudyDay(userId) {
    const today = todayBRT();
    const [dayRow, streakRow, profile] = await Promise.all([
        sbRows(`/activity_days?user_id=eq.${enc(userId)}&day=eq.${today}&select=count`).then(r => r[0]),
        getStreakRow(userId),
        sbRows(`/user_profiles?id=eq.${enc(userId)}&select=daily_goal_minutes`).then(r => r[0]),
    ]);

    const count = (dayRow && dayRow.count || 0) + 1;
    await sb('/activity_days', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ user_id: userId, day: today, count, updated_at: nowIso() }),
    });

    let streak;
    if (streakRow && streakRow.last_day === today) {
        streak = { ...effectiveStreak(streakRow, today), extended: false };
    } else {
        const continues = streakRow && streakRow.last_day === addDays(today, -1);
        const current = continues ? (streakRow.current || 0) + 1 : 1;
        const longest = Math.max(current, (streakRow && streakRow.longest) || 0);
        await sb('/user_streaks', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({ user_id: userId, current, longest, last_day: today, updated_at: nowIso() }),
        });
        streak = { current, longest, activeToday: true, extended: true };
    }
    streak.milestone = streak.extended && MILESTONES.includes(streak.current) ? streak.current : null;

    const goal = dailyGoalTarget(profile && profile.daily_goal_minutes);
    return { streak, today: { count, goal, reached: count >= goal, justReached: count === goal } };
}

function isLessonDone(lesson, items) {
    if (!items || !items.size) return false;
    return items.has('section:homework') || (lesson.tabs.length > 0 && lesson.tabs.every(t => items.has('section:' + t)));
}

function findLesson(lessonId) {
    return CURRICULUM.en.find(l => l.id === lessonId) || CURRICULUM.fr.find(l => l.id === lessonId) || null;
}

// Saves new items for one lesson. Returns { inserted, lessonCompleted, study } (study = recordStudyDay result or null).
async function saveLessonItems(userId, lessonId, rawItems) {
    const wanted = [...new Set((Array.isArray(rawItems) ? rawItems : []).map(String))]
        .filter(i => ITEM_RE.test(i))
        .slice(0, MAX_ITEMS_PER_REQUEST);
    const existing = await sbRows(`/lesson_progress?user_id=eq.${enc(userId)}&lesson_id=eq.${lessonId}&select=item`);
    const have = new Set(existing.map(r => r.item));
    const fresh = wanted.filter(i => !have.has(i)).slice(0, Math.max(0, MAX_ITEMS_PER_LESSON - have.size));

    let inserted = [];
    if (fresh.length) {
        const ins = await sbRequest('/lesson_progress', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=ignore-duplicates,return=representation' },
            body: JSON.stringify(fresh.map(item => ({ user_id: userId, lesson_id: lessonId, item }))),
        });
        if (!ins.ok) return { error: 'save_failed' };
        inserted = Array.isArray(ins.data) ? ins.data.map(r => r.item) : [];
    }

    const all = new Set([...have, ...inserted]);
    const lesson = findLesson(lessonId);
    const lessonCompleted = lesson ? isLessonDone(lesson, all) : all.has('section:homework');
    const study = inserted.some(i => i.startsWith('section:')) ? await recordStudyDay(userId) : null;
    return { inserted, lessonCompleted, study };
}

async function getLessonItems(userId, lessonId) {
    const rows = await sbRows(`/lesson_progress?user_id=eq.${enc(userId)}&lesson_id=eq.${lessonId}&select=item`);
    return rows.map(r => r.item);
}

// Home "continue where you left off" + streak + daily goal.
async function getSummary(userId) {
    const today = todayBRT();
    const [streakRow, dayRow, profile, items] = await Promise.all([
        getStreakRow(userId),
        sbRows(`/activity_days?user_id=eq.${enc(userId)}&day=eq.${today}&select=count`).then(r => r[0]),
        sbRows(`/user_profiles?id=eq.${enc(userId)}&select=daily_goal_minutes`).then(r => r[0]),
        sbRows(`/lesson_progress?user_id=eq.${enc(userId)}&select=lesson_id,item`),
    ]);

    const byLesson = {};
    items.forEach(r => { (byLesson[r.lesson_id] = byLesson[r.lesson_id] || new Set()).add(r.item); });

    const en = CURRICULUM.en;
    const completed = en.filter(l => isLessonDone(l, byLesson[l.id])).map(l => l.n);
    // Continue from the most advanced lesson the user has touched.
    let idx = -1;
    en.forEach((l, i) => { if (byLesson[l.id] && [...byLesson[l.id]].some(x => x.startsWith('section:'))) idx = i; });
    if (idx >= 0 && isLessonDone(en[idx], byLesson[en[idx].id])) idx += 1;
    const next = en[Math.max(0, idx)] || null;
    let nextLesson = null;
    if (next) {
        const done = byLesson[next.id] || new Set();
        nextLesson = {
            n: next.n, id: next.id, title: next.title, href: next.id + '.html',
            section: next.tabs.find(t => !done.has('section:' + t)) || next.tabs[0] || null,
            started: [...done].some(x => x.startsWith('section:')),
        };
    }

    const goal = dailyGoalTarget(profile && profile.daily_goal_minutes);
    const count = (dayRow && dayRow.count) || 0;
    return {
        streak: effectiveStreak(streakRow, today),
        today: { count, goal, reached: count >= goal },
        lessons: { completed, total: en.length, next: nextLesson },
    };
}

module.exports = {
    LESSON_ID_RE, ITEM_RE,
    recordStudyDay, saveLessonItems, getLessonItems, getSummary,
    effectiveStreak, dailyGoalTarget,
};
