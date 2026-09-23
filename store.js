// ── Que dia é hoje PARA O ALUNO ─────────────────────────────────────────────
// O servidor já datava em São Paulo (api/index.js:2734). O cliente usava
// toISOString(), que é UTC — então das 21h à meia-noite de Brasília o navegador
// já estava em "amanhã", e o dia do aluno virava três horas cedo demais. Quem
// estudava segunda de manhã e terça à noite perdia a streak: para o código,
// terça 22h já era quarta.
//
// Declarados com `x = x || ...` de propósito: o components.js declara os mesmos
// três (há página que o carrega sem o store.js), e qualquer ordem de carga tem
// que dar o mesmo resultado.
globalThis.capyHojeBR = globalThis.capyHojeBR || function () {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
};
// Âncora ao meio-dia UTC: longe de qualquer borda de dia, então somar ou
// subtrair 24h nunca cai no dia errado por causa de fuso ou horário de verão.
globalThis.capyDiaBR = globalThis.capyDiaBR || function (offset, base) {
    const ref = base || globalThis.capyHojeBR();
    const t = Date.parse(ref + 'T12:00:00Z') + (offset || 0) * 86400000;
    return Number.isNaN(t) ? '' : new Date(t).toISOString().slice(0, 10);
};
globalThis.capyDiasEntre = globalThis.capyDiasEntre || function (a, b) {
    if (!a || !b) return null;
    const ms = Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z');
    return Number.isNaN(ms) ? null : Math.round(ms / 86400000);
};

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
        onboardingComplete: false,
        // ── Gamification: daily quests / chests / streak freeze ────
        dailyQuests: { date: '', quests: [] },
        chestsOpened: [],
        streakFreezes: 0,
        lastFreezeUsed: '',
        // `lastQuestDate` acima diz quando o app ROTACIONOU o dia — é gravado
        // por mera visita. Os três abaixo separam o que realmente importa para
        // a streak. Sem essa separação o Streak Freeze de 80 🫐 só protegia
        // quem NÃO abrisse o app, que é o oposto do que o aluno espera.
        lastPracticeDate: '',      // último dia em que PRATICOU de verdade
        streakCoveredThrough: '',  // último dia coberto por um freeze
        streakSchema: 0,           // 1 = já migrado para datas de Brasília
        // ── Boss challenges ("Desafio da Yara") ─────────────────────
        bossesBeaten: []
    },
    
    init() {
        const saved = localStorage.getItem('capyYaraState');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        } else {
            this.save();
        }
        this.migrarStreakBR();   // backfill de lastPracticeDate, antes do reset
        this.checkDailyReset();
        // Background-sync plan from /api/me (fresh after Kiwify webhook updates it).
        // Forces immediate sync if URL has ?refresh=1 (used after Kiwify checkout return).
        const forceSync = new URLSearchParams(window.location.search).get('refresh') === '1';
        this.syncPlanFromServer({ force: forceSync });
        this.mergeFromServer();
    },

    // ── Mescla com o servidor, sempre para cima ───────────────────────────────
    // Até agora o estado só era lido do servidor no LOGIN. Quem estudava no
    // celular e depois abria no computador começava do localStorage antigo do
    // computador — e como o save manda o estado inteiro, o aparelho atrasado
    // apagava o progresso do outro.
    //
    // Aqui nada é sobrescrito: número que só cresce entra pelo MAIOR, lista de
    // conquista entra por UNIÃO. Assim mesclar duas vezes, ou nas duas ordens,
    // dá sempre o mesmo resultado — e ninguém volta no tempo.
    async mergeFromServer() {
        try {
            const bruto = localStorage.getItem('capySession');
            if (!bruto) return;
            const sessao = JSON.parse(bruto);
            if (!sessao || !sessao.id || sessao.id === 'guest') return;

            const r = await fetch('/api/db?type=state');
            if (!r.ok) return;
            const remoto = await r.json();
            if (!remoto || typeof remoto !== 'object') return;

            const maior = ['xp', 'streakDays', 'starBerries'];
            const uniao = ['badges', 'completedLessons', 'completedMinis',
                           'purchasedItems', 'bossesBeaten', 'chestsOpened'];
            let mudou = false;

            for (const k of maior) {
                const v = Number(remoto[k]);
                if (Number.isFinite(v) && v > (Number(this.state[k]) || 0)) {
                    this.state[k] = v; mudou = true;
                }
            }
            for (const k of uniao) {
                if (!Array.isArray(remoto[k])) continue;
                const atual = Array.isArray(this.state[k]) ? this.state[k] : [];
                const juntos = [...new Set([...atual, ...remoto[k]])];
                if (juntos.length !== atual.length) { this.state[k] = juntos; mudou = true; }
            }
            // completedActivities é objeto de contadores: fica o maior de cada
            if (remoto.completedActivities && typeof remoto.completedActivities === 'object') {
                const alvo = this.state.completedActivities || (this.state.completedActivities = {});
                for (const [k, v] of Object.entries(remoto.completedActivities)) {
                    if (Number(v) > (Number(alvo[k]) || 0)) { alvo[k] = v; mudou = true; }
                }
            }
            // Perfil: o servidor só preenche o que aqui está vazio.
            for (const k of ['englishLevel', 'playerName', 'aiPersona']) {
                if (!this.state[k] && remoto[k]) { this.state[k] = remoto[k]; mudou = true; }
            }
            for (const k of ['goals', 'interests']) {
                if (Array.isArray(remoto[k]) && remoto[k].length &&
                    !(this.state[k] || []).length) { this.state[k] = remoto[k]; mudou = true; }
            }
            // Datas de prática entram por MAIS RECENTE. "Praticou no dia X" é
            // fato positivo, igual a badge: nunca some, e as duas ordens de
            // sincronização dão o mesmo resultado.
            const dataISO = /^\d{4}-\d{2}-\d{2}$/;
            for (const k of ['lastPracticeDate', 'streakCoveredThrough']) {
                const v = typeof remoto[k] === 'string' ? remoto[k] : '';
                if (dataISO.test(v) && v > (this.state[k] || '')) { this.state[k] = v; mudou = true; }
            }
            // streakFreezes fica FORA do merge de propósito: é saldo gastável,
            // e entrar por MAIOR reembolsaria o freeze a cada sincronização.

            // planType NÃO entra aqui: quem manda nele é o /api/me.

            // streakDays entrou por MAIOR lá em cima. Sozinho, isso
            // ressuscitaria a streak de um aparelho parado há uma semana.
            // Reavaliar contra a data mesclada é o que impede: o número só
            // sobrevive se a data justificar.
            const antes = JSON.stringify([this.state.streakDays, this.state.streakActive,
                                          this.state.streakFreezes, this.state.streakCoveredThrough]);
            this.resolverStreak();
            const depois = JSON.stringify([this.state.streakDays, this.state.streakActive,
                                           this.state.streakFreezes, this.state.streakCoveredThrough]);

            if (mudou || antes !== depois) this.save();
        } catch (e) { /* offline ou sem sessão: segue com o que tem local */ }
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

    // ── Migração para datas de Brasília ──────────────────────────────────────
    // Roda uma vez por aparelho, antes do primeiro checkDailyReset novo.
    //
    // Por que é seguro: o rótulo UTC antigo é sempre IGUAL ou UM DIA À FRENTE
    // do dia real em Brasília, nunca atrás. Lê-lo como data BR só pode fazer a
    // última prática parecer mais recente. A troca de fuso, sozinha, é incapaz
    // de zerar uma streak que não devia zerar.
    //
    // O risco real não era o fuso: era o `lastPracticeDate` não existir. Isto
    // aqui é backfill desse campo, deduzido do que o estado velho já sabia.
    // Não é janela de tolerância — grava uma DATA concreta, então no dia
    // seguinte a regra normal já vale inteira.
    migrarStreakBR() {
        if ((this.state.streakSchema || 0) >= 1) return;
        const hoje = capyHojeBR();
        const rotulo = this.state.lastQuestDate || '';

        if (!this.state.lastPracticeDate) {
            if (this.state.streakActive && rotulo) {
                // streakActive só fica true depois de ganhar XP no dia do rótulo.
                this.state.lastPracticeDate = rotulo;
            } else if ((this.state.streakDays || 0) > 0 && rotulo) {
                // Sobreviveu ao último reset com streak > 0: pela regra antiga
                // isso só acontecia se tivesse praticado na véspera do rótulo.
                this.state.lastPracticeDate = capyDiaBR(-1, rotulo);
            } else {
                this.state.lastPracticeDate = '';
            }
        }
        // Rótulo UTC pode estar um dia à frente do dia real. Nunca deixar uma
        // data de prática no futuro — ela travaria o próximo activateStreak.
        if (this.state.lastPracticeDate > hoje) this.state.lastPracticeDate = hoje;
        if (rotulo > hoje) this.state.lastQuestDate = hoje;

        this.state.streakSchema = 1;
        this.save({ postar: false });
    },

    checkDailyReset() {
        const hoje = capyHojeBR();

        // 1) Rotação do dia. É a única parte que depende de "abriu o app".
        if (this.state.lastQuestDate !== hoje) {
            this.state.completedActivities = {};   // clear ALL daily activities
            this.state.aiUsageToday = 0;           // reset AI counter daily
            this.state.lastFreezeUsed = '';
            this.state.lastQuestDate = hoje;
            this.generateDailyQuests(hoje);
        }

        // 2) A streak NUNCA depende de "abriu" — só de lastPracticeDate.
        this.resolverStreak();

        // postar:false de propósito: o mergeFromServer ainda não rodou. Se este
        // aparelho estiver atrasado e postar streakDays=0 agora, ele apaga no
        // servidor o que foi feito no celular antes do GET do merge chegar.
        this.save({ postar: false });
    },

    // Decide se a streak vive, morre ou é salva por um freeze.
    // Idempotente de propósito: rodar N vezes no mesmo dia dá o mesmo resultado
    // — por isso pode ser chamada de novo depois do merge, quando pode ter
    // chegado uma prática mais recente feita em outro aparelho.
    resolverStreak() {
        const hoje = capyHojeBR();
        const ancora = [this.state.lastPracticeDate || '',
                        this.state.streakCoveredThrough || ''].sort().pop();
        const gap = ancora ? capyDiasEntre(ancora, hoje) : null;   // 0 = hoje, 1 = ontem

        this.state.streakActive = (this.state.lastPracticeDate === hoje);

        if (!(this.state.streakDays > 0)) return;
        if (gap === null || gap < 0) { this.state.streakDays = 0; return; }
        if (gap <= 1) return;                       // praticou hoje ou ontem: viva

        // O freeze cobre UM dia de ausência. Aqui ele finalmente funciona para
        // quem ABRIU o app sem estudar — o caso de quase todo mundo, e
        // exatamente o que o código velho não cobria: ele exigia
        // `lastQuestDate === anteontem`, mas `lastQuestDate` era sobrescrito
        // por qualquer visita. O aluno pagava 80 🫐 por proteção inalcançável.
        if (gap === 2 && (this.state.streakFreezes || 0) > 0) {
            this.state.streakFreezes -= 1;
            this.state.lastFreezeUsed = hoje;
            this.state.streakCoveredThrough = capyDiaBR(1, ancora);
            return;                                 // streakDays intacto
        }

        this.state.streakDays = 0;
        this.state.streakCoveredThrough = '';
        this.state.lastFreezeUsed = '';
    },

    // ── Daily Quests ─────────────────────────────────────────────
    QUEST_POOL: [
        { type: 'earn_xp',       target: 30, label: 'Ganhe 30 XP',                    icon: '⭐' },
        { type: 'complete_minis',target: 2,  label: 'Complete 2 mini-aulas',          icon: '📚' },
        { type: 'quiz_correct',  target: 8,  label: 'Acerte 8 questões de quiz',      icon: '❓' },
        { type: 'listen_correct',target: 6,  label: 'Acerte 6 no listening',          icon: '🔊' },
        { type: 'speak_ok',      target: 1,  label: 'Complete 1 prática de fala',     icon: '🎤' }
    ],

    generateDailyQuests(today) {
        const pool = [...this.QUEST_POOL];
        // Shuffle (Fisher-Yates)
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const picked = pool.slice(0, 3).map((q, idx) => ({
            id: `${today}_${idx}`,
            type: q.type,
            target: q.target,
            label: q.label,
            icon: q.icon,
            progress: 0,
            done: false,
            claimed: false
        }));
        this.state.dailyQuests = { date: today, quests: picked };
    },

    questProgress(type, amount = 1) {
        const dq = this.state.dailyQuests;
        if (!dq || !dq.quests) return;
        let changed = false;
        dq.quests.forEach(q => {
            if (q.type !== type || q.done) return;
            q.progress = Math.min(q.target, q.progress + amount);
            changed = true;
            if (q.progress >= q.target && !q.done) {
                q.done = true;
                if (!q.claimed) {
                    q.claimed = true;
                    this.state.starBerries += 10;
                    document.dispatchEvent(new CustomEvent('questCompleted', { detail: { quest: q } }));
                }
            }
        });
        if (changed) this.save();
    },

    // ── Streak Freeze ────────────────────────────────────────────
    buyStreakFreeze() {
        const cost = 80;
        if ((this.state.streakFreezes || 0) >= 2) return false;
        if (this.spendBerries(cost)) {
            this.state.streakFreezes = (this.state.streakFreezes || 0) + 1;
            this.save();
            return true;
        }
        return false;
    },

    // ── Boss challenges ("Desafio da Yara") ─────────────────────────
    beatBoss(chapterId) {
        if (!this.state.bossesBeaten) this.state.bossesBeaten = [];
        if (!this.state.bossesBeaten.includes(chapterId)) {
            this.state.bossesBeaten.push(chapterId);
            this.addXP(50);
            this.save();
            return true;
        }
        return false;
    },

    // ── Chests ───────────────────────────────────────────────────
    isChestOpened(key) {
        return (this.state.chestsOpened || []).includes(key);
    },

    openChest(key) {
        if (!this.state.chestsOpened) this.state.chestsOpened = [];
        if (this.state.chestsOpened.includes(key)) return false;
        this.state.chestsOpened.push(key);
        this.state.starBerries += 25;
        this.save();
        return true;
    },

    // postar:false grava só localmente. Usado no reset diário e na migração,
    // que rodam ANTES do mergeFromServer — postar ali deixa um aparelho
    // atrasado sobrescrever no servidor o progresso feito em outro.
    save({ postar = true } = {}) {
        localStorage.setItem('capyYaraState', JSON.stringify(this.state));
        document.dispatchEvent(new Event('stateChanged'));
        if (!postar) return;

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
        if (amount > 0) this.questProgress('earn_xp', amount);
        const levelAfter = this.getLevel();
        if (levelAfter > levelBefore) {
            document.dispatchEvent(new CustomEvent('levelUp', { detail: { level: levelAfter } }));
        }
        // Qualquer prática que rende XP mantém a streak viva
        // (activateStreak tem guard: só incrementa 1x por dia)
        if (amount > 0) this.activateStreak();
    },

    getLevel() {
        // Linear scaling for prototype
        return Math.floor(this.state.xp / 100) + 1;
    },

    getXPForNextLevel() {
        return this.getLevel() * 100;
    },

    // Idempotente POR DATA, não pela flag. A flag `streakActive` era zerada
    // pelo reset diário, e nada garantia que o reset tivesse rodado antes —
    // então o incremento dependia da ordem de execução da página.
    activateStreak() {
        const hoje = capyHojeBR();
        if (this.state.lastPracticeDate === hoje) return;    // já contou hoje

        const ancora = [this.state.lastPracticeDate || '',
                        this.state.streakCoveredThrough || ''].sort().pop();
        const gap = ancora ? capyDiasEntre(ancora, hoje) : null;

        // Continua a sequência se a última prática (ou o dia coberto por
        // freeze) foi ontem ou hoje; senão recomeça em 1.
        this.state.streakDays = (gap !== null && gap >= 0 && gap <= 1)
            ? (this.state.streakDays || 0) + 1
            : 1;
        this.state.lastPracticeDate = hoje;
        this.state.streakActive = true;
        this.save();
        this.checkStreakMilestone();
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

    _lessonKey(lessonId, language = 'en') {
        return language === 'en' ? lessonId : `${language}:${lessonId}`;
    },

    _miniKey(lessonId, miniNum, language = 'en') {
        return language === 'en' ? `${lessonId}_${miniNum}` : `${language}:${lessonId}_${miniNum}`;
    },

    completeMini(lessonId, miniNum, language = 'en') {
        const key = this._miniKey(lessonId, miniNum, language);
        if (!this.state.completedMinis) this.state.completedMinis = [];
        if (!this.state.completedMinis.includes(key)) {
            this.state.completedMinis.push(key);
            this.save();
            this.questProgress('complete_minis', 1);
        }
        // When last mini done → also mark the full lesson complete + streak
        if (miniNum === 4) {
            this.completeLesson(lessonId, language);
            this.activateStreak();
            // O pico de satisfação do aluno no site inteiro — e até aqui era o
            // único grande momento que ninguém escutava. Quem quiser reagir a
            // "terminou uma aula" (pedir lembrete, celebrar) escuta este evento
            // em vez de editar as 124 páginas de aula.
            document.dispatchEvent(new CustomEvent('lessonComplete', { detail: { lessonId, language } }));
        }
    },

    isMiniDone(lessonId, miniNum, language = 'en') {
        if (!this.state.completedMinis) return false;
        const key = this._miniKey(lessonId, miniNum, language);
        return this.state.completedMinis.includes(key) ||
            (language === 'fr' && this.state.completedMinis.includes(`${lessonId}_${miniNum}`));
    },

    completeLesson(lessonId, language = 'en') {
        if (!this.state.completedLessons) this.state.completedLessons = [];
        const key = this._lessonKey(lessonId, language);
        if (!this.state.completedLessons.includes(key)) {
            this.state.completedLessons.push(key);
            this.save();
        }
    },

    isLessonDone(lessonId, language = 'en') {
        if (!this.state.completedLessons) return false;
        return this.state.completedLessons.includes(this._lessonKey(lessonId, language)) ||
            (language === 'fr' && this.state.completedLessons.includes(lessonId));
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

// `const Store` no topo de um script clássico cria um binding LEXICAL global:
// a variável existe, mas NÃO aparece em `window`. 36 páginas — a trilha diária,
// os 21 jogos, o alphabet, o grammar_lab — guardam as chamadas com
// `if (window.Store) Store.addXP(...)`, e essa condição era SEMPRE falsa.
// Resultado: o aluno terminava a lição, via "+50 XP" na tela (que é só o rótulo
// passado para a animação) e não ganhava XP nenhum.
//
// Medido em 09/set/2026, em produção: `typeof Store === 'object'` mas
// `typeof window.Store === 'undefined'`. Com esta linha, o mesmo teste credita
// 8 XP onde antes creditava 0.
//
// Não trocar os 36 arquivos para usar `Store` direto: são ~90 pontos de chamada,
// e uma página esquecida volta a falhar em silêncio. A exposição aqui conserta
// todos de uma vez e mantém os dois nomes válidos.
window.Store = Store;

// Immediately initialize
Store.init();
