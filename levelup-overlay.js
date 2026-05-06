/**
 * Level Up Celebration Overlay
 * Include this script (after store.js) on any page to get the
 * animated level-up popup whenever the player crosses a level.
 */
(function () {
    // Inject overlay HTML into the page
    const overlayHTML = `
        <div id="levelup-overlay"
             class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
             style="display:none!important;">
            <div id="levelup-card"
                 class="relative bg-gradient-to-br from-navy via-[#001f3f] to-slate-900
                        border-2 border-pink-500/60 rounded-[3rem] px-16 py-14
                        flex flex-col items-center gap-6 shadow-2xl shadow-pink-500/30
                        text-center max-w-sm mx-4 pointer-events-auto
                        scale-0 opacity-0 transition-all duration-500">
                <!-- Confetti burst (CSS only) -->
                <div id="levelup-sparks" class="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none"></div>
                <!-- Yara avatar with crown -->
                <div class="relative z-10">
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-pink-500/80 shadow-2xl shadow-pink-500/40">
                        <img src="Hello Yara profile pic 002.png" alt="Yara" style="width:100%;height:100%;object-fit:cover;"/>
                    </div>
                    <!-- Crown -->
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl select-none">👑</div>
                </div>
                <div class="relative z-10 text-center">
                    <p class="font-label text-yellow-400 font-bold text-sm uppercase tracking-widest mb-1">✨ Level Up! ✨</p>
                    <h2 id="levelup-title"
                        class="font-headline text-7xl font-black text-white leading-none mb-2">5</h2>
                    <p id="levelup-sub"
                       class="font-body text-slate-300 text-lg">You're now a <span class="text-green-400 font-bold">Level 5 Explorer</span>!</p>
                    <p class="font-label text-pink-300 text-sm mt-2">Yara is so proud of you! 🌿</p>
                </div>
                <button onclick="LevelUpOverlay.dismiss()"
                        class="relative z-10 mt-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400
                               text-white font-label font-bold px-10 py-4 rounded-full text-lg active:scale-95 transition-all
                               shadow-lg shadow-pink-500/40">
                    Keep Exploring! 🎉
                </button>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        injectSparkCSS();
    });

    function injectSparkCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #levelup-overlay { display: flex !important; }
            #levelup-overlay.hidden-overlay { display: none !important; }
            #levelup-card.show {
                transform: scale(1) !important;
                opacity: 1 !important;
            }
            .spark {
                position: absolute;
                width: 8px; height: 8px;
                border-radius: 50%;
                animation: sparkFly 0.9s ease-out forwards;
            }
            @keyframes sparkFly {
                0%   { transform: translate(0,0) scale(1); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function spawnSparks() {
        const container = document.getElementById('levelup-sparks');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ffffff'];
        for (let i = 0; i < 24; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            const angle = (i / 24) * 360;
            const dist = 80 + Math.random() * 80;
            const tx = Math.cos((angle * Math.PI) / 180) * dist + 'px';
            const ty = Math.sin((angle * Math.PI) / 180) * dist + 'px';
            spark.style.cssText = `
                left: 50%; top: 50%;
                background: ${colors[i % colors.length]};
                --tx: ${tx}; --ty: ${ty};
                animation-delay: ${Math.random() * 0.2}s;
            `;
            container.appendChild(spark);
        }
    }

    window.LevelUpOverlay = {
        show(level) {
            const overlay = document.getElementById('levelup-overlay');
            const card    = document.getElementById('levelup-card');
            const title   = document.getElementById('levelup-title');
            const sub     = document.getElementById('levelup-sub');
            if (!overlay) return;

            title.textContent = level;
            sub.innerHTML = `You reached <span class="text-green-400 font-bold">Level ${level}</span> — keep going, Explorer!`;

            overlay.classList.remove('hidden-overlay');
            spawnSparks();
            // Trigger CSS transition on next frame
            requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('show')));
        },
        dismiss() {
            const overlay = document.getElementById('levelup-overlay');
            const card    = document.getElementById('levelup-card');
            if (!overlay) return;
            card.classList.remove('show');
            setTimeout(() => overlay.classList.add('hidden-overlay'), 500);
        }
    };

    // Listen for the store's levelUp event on every page that includes this script
    document.addEventListener('levelUp', (e) => {
        LevelUpOverlay.show(e.detail.level);
    });
})();
