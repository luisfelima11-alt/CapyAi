const Store = {
    state: {
        xp: 0,
        streakActive: false,
        streakDays: 0,
        badges: [],
        completedActivities: {},
        completedLessons: [],
        completedMinis: [],
        customLessons: [],
        playerName: '',
        lastQuestDate: '',
        starBerries: 50, // Start with a little bonus!
        purchasedItems: [],
        planType: 'free',       // 'free' | 'plus' | 'pro'
        aiUsageToday: 0,        // resets daily
        aiUsageLimit: 3,        // 3=free, 15=plus, 50=pro
        aiCreditsExtra: 0,      // top-up credits (one-time purchase)
        // ── User profile / personalization ────────────────────────
        englishLevel: null,           // 'beginner'|'elementary'|'intermediate'|'advanced'
        goals: [],                    // ['travel','work','entertainment',...]
        interests: [],                // ['music','sports','food',...]
        dailyGoalMinutes: 10,         // 5|10|20|30
        onboardingComplete: false
    },
    
    init() {
        const saved = localStorage.getItem('capyYaraState');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        } else {
            this.save();
        }
        this.checkDailyReset();
        // Background-sync plan from /api/me (fresh after Kiwify webhook updates it).
        // Forces immediate sync if URL has ?refresh=1 (used after Kiwify checkout return).
        const forceSync = new URLSearchParams(window.location.search).get('refresh') === '1';
        this.syncPlanFromServer({ force: forceSync });
    },

    // ── Plan helpers ───────────────────────────────────────────────────────────
    isPro()   { return this.state.planType === 'pro' || this.state.planType === 'super'; },
    isSuper() { return this.state.planType === 'super'; },
    isFree()  { return !this.isPro(); },

    // Fetch /api/me and merge plan/planExpiresAt into state.
    // Throttled: only re-fetches if last sync > 1h ago (unless force=true).
    async syncPlanFromServer({ force = false } = {}) {
        try {
            const session = JSON.parse(localStorage.getItem('capySession') || 'null');
            if (!session || !session.id || session.id === 'guest') return;
            const lastSync = parseInt(localStorage.getItem('capyPlanSyncedAt') || '0', 10);
            const oneHour = 60 * 60 * 1000;
            if (!force && (Date.now() - lastSync) < oneHour) return;
            const r = await fetch('/api/me?userId=' + encodeURIComponent(session.id));
            if (!r.ok) return;
            const data = await r.json();
            const before = this.state.planType;
            this.state.planType = data.plan || 'free';
            this.state.planExpiresAt = data.planExpiresAt || null;
            this.state.kiwifySubscriptionId = data.kiwifySubscriptionId || null;
            // Update AI usage limit to match new plan
            this.state.aiUsageLimit = data.plan === 'super' ? 500 : data.plan === 'pro' ? 200 : 3;
            localStorage.setItem('capyPlanSyncedAt', String(Date.now()));
            this.save();
            if (before !== this.state.planType) {
                document.dispatchEvent(new CustomEvent('planChanged', {
                    detail: { from: before, to: this.state.planType }
                }));
            }
        } catch (e) { /* offline / api down — keep cached plan */ }
    },

    checkDailyReset() {
        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        if (this.state.lastQuestDate !== today) {
            this.state.completedActivities = {};   // clear ALL daily activities
            this.state.streakActive = false;
            this.state.aiUsageToday = 0;           // reset AI counter daily
            this.state.lastQuestDate = today;
            this.save();
        }
    },

    save() {
        localStorage.setItem('capyYaraState', JSON.stringify(this.state));
        document.dispatchEvent(new Event('stateChanged'));
        
        try {
            const b = localStorage.getItem('capySession');
            if (b) {
                const session = JSON.parse(b);
                if (session && session.id && session.id !== 'guest') {
                    localStorage.setItem('capyYaraState_' + session.id, JSON.stringify(this.state));
                    fetch('/api/db', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'state', userId: session.id, payload: this.state })
                    }).catch(e => {});
                }
            }
        } catch(e) {}
    },

    addXP(amount) {
        const levelBefore = this.getLevel();
        this.state.xp += amount;
        this.state.starBerries += Math.ceil(amount / 2); // Earn berries alongside XP
        this.save();
        const levelAfter = this.getLevel();
        if (levelAfter > levelBefore) {
            document.dispatchEvent(new CustomEvent('levelUp', { detail: { level: levelAfter } }));
        }
    },

    getLevel() {
        // Linear scaling for prototype
        return Math.floor(this.state.xp / 100) + 1;
    },

    getXPForNextLevel() {
        return this.getLevel() * 100;
    },

    activateStreak() {
        if (!this.state.streakActive) {
            this.state.streakActive = true;
            this.state.streakDays += 1;
            this.save();
            this.checkStreakMilestone();
        }
    },

    checkStreakMilestone() {
        const milestones = {
            3:  { xp: 20,  badge: null,           msg: '🔥 3-day streak! +20 bonus XP!' },
            7:  { xp: 50,  badge: 'week_warrior',  msg: '🏅 7-day streak! Week Warrior badge!' },
            14: { xp: 100, badge: 'fortnight_hero', msg: '🏆 14-day streak! Incredible!' },
            30: { xp: 250, badge: 'legend',         msg: '👑 30-day streak! You are a Legend!' },
        };
        const m = milestones[this.state.streakDays];
        if (m) {
            this.addXP(m.xp);
            if (m.badge) this.unlockBadge(m.badge);
            document.dispatchEvent(new CustomEvent('streakMilestone', { detail: { days: this.state.streakDays, msg: m.msg } }));
        }
    },

    unlockBadge(badgeId) {
        if (!this.state.badges.includes(badgeId)) {
            this.state.badges.push(badgeId);
            this.save();
            // Fire event so badge-toast.js can show the popup
            document.dispatchEvent(new CustomEvent('badgeUnlocked', { detail: { badgeId } }));
        }
    },

    completeActivity(activityId) {
        if (!this.state.completedActivities[activityId]) {
            this.state.completedActivities[activityId] = true;
            this.save();
        }
    },

    saveCustomLesson(lesson) {
        if (!this.state.customLessons) this.state.customLessons = [];
        const idx = this.state.customLessons.findIndex(l => l.id === lesson.id);
        if (idx >= 0) this.state.customLessons[idx] = lesson;
        else this.state.customLessons.push(lesson);
        this.save();
    },

    deleteCustomLesson(id) {
        if (!this.state.customLessons) return;
        this.state.customLessons = this.state.customLessons.filter(l => l.id !== id);
        this.save();
    },

    getNextCustomLessonId() {
        if (!this.state.customLessons || this.state.customLessons.length === 0) return 100;
        return Math.max(...this.state.customLessons.map(l => l.id)) + 1;
    },

    completeMini(lessonId, miniNum) {
        const key = `${lessonId}_${miniNum}`;
        if (!this.state.completedMinis) this.state.completedMinis = [];
        if (!this.state.completedMinis.includes(key)) {
            this.state.completedMinis.push(key);
            this.save();
        }
        // When last mini done → also mark the full lesson complete + streak
        if (miniNum === 4) {
            this.completeLesson(lessonId);
            this.activateStreak();
        }
    },

    isMiniDone(lessonId, miniNum) {
        if (!this.state.completedMinis) return false;
        return this.state.completedMinis.includes(`${lessonId}_${miniNum}`);
    },

    completeLesson(lessonId) {
        if (!this.state.completedLessons) this.state.completedLessons = [];
        if (!this.state.completedLessons.includes(lessonId)) {
            this.state.completedLessons.push(lessonId);
            this.save();
        }
    },

    setPlayerName(name) {
        this.state.playerName = name.trim();
        this.save();
    },

    addBerries(amount) {
        this.state.starBerries += amount;
        this.save();
    },

    spendBerries(amount) {
        if (this.state.starBerries >= amount) {
            this.state.starBerries -= amount;
            this.save();
            return true;
        }
        return false;
    },

    unlockItem(itemId) {
        if (!this.state.purchasedItems) this.state.purchasedItems = [];
        if (!this.state.purchasedItems.includes(itemId)) {
            this.state.purchasedItems.push(itemId);
            this.save();
        }
    },

    // ── Plan & AI gating ──────────────────────────────────────
    consumeAI() {
        // Returns true if AI interaction is allowed; false if limit hit
        const limit = this.state.aiUsageLimit || 3;
        if ((this.state.aiUsageToday || 0) < limit) {
            this.state.aiUsageToday = (this.state.aiUsageToday || 0) + 1;
            this.save();
            return true;
        }
        // Fall back to top-up credits
        if ((this.state.aiCreditsExtra || 0) > 0) {
            this.state.aiCreditsExtra -= 1;
            this.save();
            return true;
        }
        return false;
    },

    getRemainingAI() {
        const base = (this.state.aiUsageLimit || 3) - (this.state.aiUsageToday || 0);
        return Math.max(0, base) + (this.state.aiCreditsExtra || 0);
    },

    addCredits(amount) {
        this.state.aiCreditsExtra = (this.state.aiCreditsExtra || 0) + amount;
        this.save();
    },

    setPlan(type) {
        const limits = { free: 3, plus: 15, pro: 50 };
        this.state.planType = type;
        this.state.aiUsageLimit = limits[type] || 3;
        this.save();
    },

    isPlusPlan() {
        return this.state.planType === 'plus' || this.state.planType === 'pro';
    }
};

// Immediately initialize
Store.init();
