/**
 * badge-toast.js
 * Shows an animated toast notification whenever a badge is unlocked.
 * Include this script on any page that calls Store.unlockBadge().
 * Usage: BadgeToast.show('explorer') — or it fires automatically via
 *        the 'badgeUnlocked' CustomEvent dispatched by store.js.
 */
(function () {
    const BADGE_META = {
        tree_warden:    { icon: 'eco',                      color: '#10b981', label: 'Tree Warden',     msg: 'You mastered the forest words! 🌿' },
        fast_tracker:   { icon: 'rocket_launch',            color: '#ec4899', label: 'Fast Tracker',    msg: 'Lightning-fast learner! 🚀' },
        explorer:       { icon: 'style',                    color: '#ec4899', label: 'Card Explorer',   msg: 'You completed a full flashcard deck! 🃏' },
        chat_master:    { icon: 'chat_bubble',              color: '#10b981', label: 'Chat Master',     msg: 'Amazing dialogue skills! 💬' },
        game_hero:      { icon: 'sports_esports',           color: '#f59e0b', label: 'Game Hero',       msg: 'Word Match champion! 🎮' },
        forest_sage:    { icon: 'auto_awesome',             color: '#a855f7', label: 'Forest Sage',     msg: 'Puzzle master of the forest! 🧩' },
        grammar_star:   { icon: 'school',                   color: '#06b6d4', label: 'Grammar Star',    msg: 'Sentence builder genius! 🏫' },
        word_wizard:    { icon: 'spellcheck',               color: '#8b5cf6', label: 'Word Wizard',     msg: 'You spelled every word right! ✏️' },
        number_wizard:  { icon: '123',                      color: '#3b82f6', label: 'Number Wizard',   msg: 'You know your numbers! 🔢' },
        story_teller:   { icon: 'menu_book',                color: '#f43f5e', label: 'Story Teller',    msg: 'Yara loved your story adventure! 📖' },
        week_warrior:   { icon: 'local_fire_department',    color: '#f97316', label: 'Week Warrior',    msg: '7 days in a row! Amazing! 🔥' },
        body_champ:     { icon: 'directions_run',           color: '#06b6d4', label: 'Body Champ',      msg: 'You know every body part! 💪' },
        food_explorer:  { icon: 'restaurant',               color: '#f97316', label: 'Food Explorer',   msg: 'You know all the yummy words! 🍕' },
        emotion_star:   { icon: 'sentiment_very_satisfied', color: '#8b5cf6', label: 'Emotion Star',    msg: 'You can name every feeling! 😊' },
        fortnight_hero: { icon: 'whatshot',                 color: '#ef4444', label: 'Fortnight Hero',  msg: '14 days straight! You\'re on fire! 🔥' },
        legend:         { icon: 'emoji_events',             color: '#f59e0b', label: 'Legend',          msg: '30-day streak! You are legendary! 👑' },
    };

    // Inject keyframe styles once
    const style = document.createElement('style');
    style.textContent = `
        @keyframes badge-slide-in  { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes badge-slide-out { from { transform: translateX(0);    opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
        @keyframes badge-icon-pop  { 0%{transform:scale(0) rotate(-20deg)} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
        #badge-toast-container { position: fixed; bottom: 90px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .badge-toast {
            display: flex; align-items: center; gap: 12px;
            background: linear-gradient(135deg, #001f3f, #002a54);
            border: 1.5px solid rgba(255,255,255,0.15);
            border-radius: 999px; padding: 10px 18px 10px 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            animation: badge-slide-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
            pointer-events: auto; min-width: 220px; max-width: 300px;
            font-family: 'Lexend', 'Be Vietnam Pro', sans-serif;
        }
        .badge-toast.dismissing { animation: badge-slide-out 0.35s ease forwards; }
        .badge-toast-icon {
            width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; animation: badge-icon-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.15s both;
        }
        .badge-toast-icon .material-symbols-outlined { font-size: 22px; color: #fff; font-variation-settings: 'FILL' 1; }
        .badge-toast-text { display: flex; flex-direction: column; gap: 1px; overflow: hidden; }
        .badge-toast-title { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.5); white-space: nowrap; }
        .badge-toast-name  { font-size: 14px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .badge-toast-msg   { font-size: 11px; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .badge-toast-sparkle { font-size: 20px; margin-left: auto; flex-shrink: 0; animation: badge-icon-pop 0.5s ease 0.3s both; }
    `;
    document.head.appendChild(style);

    // Create container
    let container = document.getElementById('badge-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'badge-toast-container';
        document.body.appendChild(container);
    }

    window.BadgeToast = {
        show(badgeId) {
            const meta = BADGE_META[badgeId] || {
                icon: 'emoji_events', color: '#f59e0b',
                label: badgeId.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
                msg: 'New badge unlocked! 🎉'
            };

            const toast = document.createElement('div');
            toast.className = 'badge-toast';
            toast.innerHTML = `
                <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid ${meta.color}60;animation:badge-icon-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.15s both;">
                    <img src="Hello Yara profile pic 002.png" alt="Yara" style="width:100%;height:100%;object-fit:cover;"/>
                </div>
                <div class="badge-toast-text">
                    <span class="badge-toast-title" style="color:${meta.color};">🏅 Badge Unlocked!</span>
                    <span class="badge-toast-name">${meta.label}</span>
                    <span class="badge-toast-msg">${meta.msg}</span>
                </div>
                <span class="badge-toast-sparkle">✨</span>
            `;

            container.appendChild(toast);

            // Auto-dismiss after 3.5 s
            setTimeout(() => {
                toast.classList.add('dismissing');
                setTimeout(() => toast.remove(), 380);
            }, 3500);

            // Click to dismiss early
            toast.addEventListener('click', () => {
                toast.classList.add('dismissing');
                setTimeout(() => toast.remove(), 380);
            });
        }
    };

    // Listen for badge unlock events
    document.addEventListener('badgeUnlocked', e => {
        BadgeToast.show(e.detail.badgeId);
    });

    // Listen for streak milestone events
    document.addEventListener('streakMilestone', e => {
        const { days, msg } = e.detail;
        const toast = document.createElement('div');
        toast.className = 'badge-toast';
        toast.innerHTML = `
            <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid rgba(249,115,22,0.6);animation:badge-icon-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.15s both;">
                <img src="Hello Yara profile pic 002.png" alt="Yara" style="width:100%;height:100%;object-fit:cover;"/>
            </div>
            <div class="badge-toast-text">
                <span class="badge-toast-title" style="color:#fb923c;">🔥 ${days}-Day Streak!</span>
                <span class="badge-toast-name" style="color:#fb923c;">${days} Days in a Row!</span>
                <span class="badge-toast-msg">${msg.replace(/[🔥🏅🏆👑]/g,'').trim()}</span>
            </div>
            <span class="badge-toast-sparkle">🔥</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('dismissing'); setTimeout(() => toast.remove(), 380); }, 4000);
        toast.addEventListener('click', () => { toast.classList.add('dismissing'); setTimeout(() => toast.remove(), 380); });
    });
})();
