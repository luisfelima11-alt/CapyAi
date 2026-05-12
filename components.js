const Components = {
    applyDarkMode() {
        try {
            const s = JSON.parse(localStorage.getItem('capySettings') || '{}');
            if (s.darkMode) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        } catch(e) {}
    },

    renderTopNav(activeTab) {
        const { streakActive, streakDays } = Store.state;
        // Session info (Auth may not be loaded on every page yet)
        let sessionName   = '';
        let sessionAvatar = '🦫';
        try {
            const sess = JSON.parse(localStorage.getItem('capySession') || 'null');
            if (sess) { sessionName = sess.name || ''; sessionAvatar = sess.avatar || '🦫'; }
        } catch(e) {}
        const days = ['M','T','W','T','F','S','S'];

        const streakTrackerHTML = `
            <div class="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
                <span class="material-symbols-outlined text-orange-500 text-base" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                <span class="font-bold text-xs text-orange-500 mr-1">${streakDays}</span>
                ${days.map((d, i) => {
                    const lit = i < streakDays;
                    return `<div class="flex gap-1 items-center">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                            ${lit ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}">
                            ${d}
                        </div>
                    </div>`;
                }).join('')}
            </div>
        `;

        // Helper to determine active styles
        const linkClass = "text-navy/70 dark:text-slate-400 font-medium hover:text-pink-500 transition-colors cursor-pointer";
        const activeClass = "text-pink-500 dark:text-pink-400 font-bold border-b-4 border-pink-500 pb-1 cursor-pointer";

        return `
            <nav id="top-nav-bar" class="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800" style="transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);">
                <div class="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans'] antialiased">
                <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.location.href='6_Home_Forest_Expedition.html'">
                    <div class="w-9 h-9 rounded-full overflow-hidden border-2 border-pink-400/60 shadow-md flex-shrink-0 bg-pink-100 flex items-center justify-center">
                        <img src="yara-avatar.png?v=1" alt="Yara" class="w-full h-full object-cover"
                             onerror="this.style.display='none';this.parentElement.innerHTML='🦫'"/>
                    </div>
                    <span class="text-2xl font-black tracking-tight text-navy dark:text-blue-100">Yara's Forest</span>
                </div>
                <!-- Center nav links — translate="no" prevents Chrome auto-translate from mangling nav text -->
                <div class="hidden md:flex gap-6 items-center font-['Plus_Jakarta_Sans']" translate="no">
                    <a href="classes.html"   class="${activeTab==='classes'    ? 'text-pink-500 dark:text-pink-400 font-bold border-b-2 border-pink-500 pb-0.5' : 'text-navy/70 dark:text-slate-400 font-medium hover:text-pink-500 transition-colors'}">Cursos</a>
                    <a href="learn.html"     class="${activeTab==='lessons'    ? 'text-pink-500 dark:text-pink-400 font-bold border-b-2 border-pink-500 pb-0.5' : 'text-navy/70 dark:text-slate-400 font-medium hover:text-pink-500 transition-colors'}">Trilha Diária</a>
                    <a href="9_Game_Pavilion_Yaras_Expedition.html" class="${activeTab==='games' ? 'text-pink-500 dark:text-pink-400 font-bold border-b-2 border-pink-500 pb-0.5' : 'text-navy/70 dark:text-slate-400 font-medium hover:text-pink-500 transition-colors'}">Games</a>
                    <a href="ai_chat.html"   class="${activeTab==='ai'         ? 'text-pink-500 dark:text-pink-400 font-bold border-b-2 border-pink-500 pb-0.5' : 'text-navy/70 dark:text-slate-400 font-medium hover:text-pink-500 transition-colors'} flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1;font-size:16px">auto_awesome</span> Yara AI
                    </a>
                </div>
                <div class="flex gap-3 items-center">
                    ${streakTrackerHTML}
                    <!-- Live XP + Level pill -->
                    <div id="nav-xp-pill" class="hidden sm:flex items-center gap-1.5 bg-amber-50 dark:bg-yellow-500/15 border border-amber-200 dark:border-yellow-400/30 px-3 py-1.5 rounded-full cursor-pointer hover:bg-amber-100 dark:hover:bg-yellow-500/25 transition-colors" onclick="window.location.href='progress.html'" title="My Progress">
                        <span class="material-symbols-outlined text-amber-500 dark:text-yellow-400 text-sm" style="font-variation-settings:'FILL' 1;">star</span>
                        <span id="nav-level" class="font-label font-bold text-amber-700 dark:text-yellow-300 text-xs">Lv.1</span>
                        <span class="text-slate-300 dark:text-white/30 text-xs">·</span>
                        <span id="nav-xp" class="font-label font-bold text-slate-700 dark:text-white/80 text-xs">0 XP</span>
                    </div>
                    <!-- Plan badge -->
                    ${(Store.state.planType || 'free') === 'free'
                        ? `<button onclick="window.location.href='landing.html'"
                             class="hidden sm:flex items-center gap-1 bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-pink-500/25 transition-all whitespace-nowrap">
                             <span class="material-symbols-outlined text-xs" style="font-size:14px">upgrade</span> Upgrade
                           </button>`
                        : `<div class="hidden sm:flex items-center gap-1 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                             ✨ Plus
                           </div>`
                    }
                    <!-- Berries pill -->
                    <div id="nav-berries-pill" class="hidden sm:flex items-center gap-1.5 bg-pink-50 dark:bg-pink-500/15 border border-pink-200 dark:border-pink-400/30 px-3 py-1.5 rounded-full cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-500/25 transition-colors" onclick="window.location.href='shop.html'" title="Star Berries">
                        <span class="text-sm">🍓</span>
                        <span id="nav-berries" class="font-label font-bold text-pink-600 dark:text-pink-300 text-xs">0</span>
                    </div>
                    <!-- User avatar + name dropdown -->
                    <div class="relative group/user flex items-center gap-2">
                        ${sessionName ? `<span class="hidden lg:block font-label font-bold text-xs text-slate-600 dark:text-slate-300 max-w-[90px] truncate">${sessionName}</span>` : ''}
                        <div class="w-10 h-10 rounded-full bg-slate-700 border-2 border-pink-400/60 flex items-center justify-center cursor-pointer active:scale-95 transition-transform text-2xl hover:border-pink-400 select-none"
                             title="${sessionName || 'Profile'}">
                            ${sessionAvatar}
                        </div>
                        <!-- dropdown -->
                        <div class="invisible group-hover/user:visible opacity-0 group-hover/user:opacity-100 transition-all duration-200
                                    absolute top-full right-0 mt-2 w-52
                                    bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                            ${sessionName ? `
                            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                <p class="font-label font-bold text-sm text-navy dark:text-white truncate">${sessionName}</p>
                                <p class="font-body text-xs text-slate-400 mt-0.5">Explorer</p>
                            </div>` : ''}
                            <a href="progress.html" class="flex items-center gap-3 px-4 py-3 text-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-label font-bold text-sm transition-colors">
                                <span class="material-symbols-outlined text-emerald-500 text-base" style="font-variation-settings:'FILL' 1;">military_tech</span> My Progress
                            </a>
                            <a href="settings.html" class="flex items-center gap-3 px-4 py-3 text-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-label font-bold text-sm transition-colors">
                                <span class="material-symbols-outlined text-slate-400 text-base">settings</span> Settings
                            </a>
                            <div class="border-t border-slate-100 dark:border-slate-800">
                                <button onclick="(function(){ try{ var a=window.Auth||null; if(a){ a.logout(); } else { localStorage.removeItem('capySession'); window.location.href='4_Login_Capy_Yara_Welcomes_You.html'; } }catch(e){ localStorage.removeItem('capySession'); window.location.href='4_Login_Capy_Yara_Welcomes_You.html'; } })()"
                                        class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-label font-bold text-sm transition-colors text-left">
                                    <span class="material-symbols-outlined text-base">logout</span> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </nav>
            <script>
            (function() {
              const nav = document.getElementById('top-nav-bar');
              if (!nav) return;
              let hideTimer = null;

              function showNav() {
                clearTimeout(hideTimer);
                nav.style.transform = 'translateY(0)';
              }
              function scheduleHide(delay) {
                clearTimeout(hideTimer);
                hideTimer = setTimeout(function() {
                  nav.style.transform = 'translateY(-110%)';
                }, delay);
              }

              // Auto-hide after 1.8s on page load
              scheduleHide(1800);

              // Reveal when mouse enters top 64px zone
              document.addEventListener('mousemove', function(e) {
                if (e.clientY < 64) {
                  showNav();
                } else if (e.clientY > 100) {
                  scheduleHide(1400);
                }
              });

              // Mobile: reveal on touch near top edge
              document.addEventListener('touchstart', function(e) {
                if (e.touches[0].clientY < 60) showNav();
              }, { passive: true });
            })();
            </script>
        `;
    },

    renderSideNav(activeTab) {
        return `
            <aside class="fixed left-4 top-24 bottom-8 w-20 rounded-[3rem] flex flex-col items-center py-8 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] hidden md:flex">
                <div class="flex flex-col gap-8 items-center font-['Plus_Jakarta_Sans'] text-sm font-semibold uppercase tracking-wider">
                    <button onclick="window.location.href='6_Home_Forest_Expedition.html'" title="Home" class="${activeTab === 'home' ? 'bg-pink-500 text-white rounded-full p-4 scale-110 shadow-lg shadow-pink-500/40' : 'text-slate-400 p-4'} active:scale-90 hover:rotate-6 transition-all duration-300">
                        <span class="material-symbols-outlined text-2xl" ${activeTab === 'home' ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>home</span>
                    </button>
                    <button onclick="window.location.href='classes.html'" title="Cursos" class="${activeTab === 'classes' ? 'bg-violet-500 text-white rounded-full p-4 scale-110 shadow-lg shadow-violet-500/40' : 'text-slate-400 p-4'} hover:text-violet-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                        <span class="material-symbols-outlined text-2xl">menu_book</span>
                    </button>
                    <button onclick="window.location.href='learn.html'" title="Trilha Diária" class="${activeTab === 'lessons' ? 'bg-amber-500 text-white rounded-full p-4 scale-110 shadow-lg shadow-amber-500/40' : 'text-slate-400 p-4'} hover:text-amber-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                        <span class="material-symbols-outlined text-2xl">route</span>
                    </button>
                    <button onclick="window.location.href='5_Game_Pavilion_Forest_Edition.html'" title="Games" class="${activeTab === 'games' ? 'bg-emerald-500 text-white rounded-full p-4 scale-110 shadow-lg shadow-emerald-500/40' : 'text-slate-400 p-4'} hover:text-emerald-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                        <span class="material-symbols-outlined text-2xl">sports_esports</span>
                    </button>
                    <button onclick="window.location.href='ai_chat.html'" title="Yara AI"
                            class="${activeTab === 'ai' ? 'bg-pink-500 text-white rounded-full p-4 scale-110 shadow-lg shadow-pink-500/40' : 'text-slate-400 p-4'} hover:text-pink-500 active:scale-90 hover:rotate-6 transition-all duration-300 relative">
                        <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">auto_awesome</span>
                        <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-white animate-pulse"></span>
                    </button>
                </div>
                <div class="mt-auto flex flex-col gap-3">
                    <button onclick="window.location.href='leaderboard.html'" class="${activeTab === 'leaderboard' ? 'bg-amber-500 text-white' : 'bg-white/10 hover:bg-white/20 text-amber-400'} shadow-lg w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-all" title="Leaderboard">
                        <span class="material-symbols-outlined">social_leaderboard</span>
                    </button>
                    <button onclick="window.location.href='progress.html'" class="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all" title="My Progress">
                        <span class="material-symbols-outlined">explore</span>
                    </button>
                    <button onclick="window.location.href='settings.html'" class="bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-all border border-white/10" title="Settings">
                        <span class="material-symbols-outlined text-xl">settings</span>
                    </button>
                </div>
            </aside>
        `;
    },

    renderMobileNav(activeTab) {
        return `
            <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md px-6 py-4 flex justify-around items-center z-50 border-t border-slate-100">
                <button onclick="window.location.href='6_Home_Forest_Expedition.html'" class="${activeTab === 'home' ? 'text-navy' : 'text-slate-400'} flex flex-col items-center gap-1">
                    <span class="material-symbols-outlined" ${activeTab === 'home' ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>home</span>
                    <span class="text-[10px] font-bold">Home</span>
                </button>
                <button onclick="window.location.href='classes.html'" class="${activeTab === 'classes' ? 'text-violet-500' : 'text-slate-400'} flex flex-col items-center gap-1">
                    <span class="material-symbols-outlined" ${activeTab === 'classes' ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>menu_book</span>
                    <span class="text-[10px] font-bold">Cursos</span>
                </button>
                <button onclick="window.location.href='learn.html'" class="${activeTab === 'lessons' ? 'text-amber-500' : 'text-slate-400'} flex flex-col items-center gap-1">
                    <span class="material-symbols-outlined" ${activeTab === 'lessons' ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>route</span>
                    <span class="text-[10px] font-bold">Trilha</span>
                </button>
                <button onclick="window.location.href='5_Game_Pavilion_Forest_Edition.html'" class="${activeTab === 'games' ? 'text-emerald-500' : 'text-slate-400'} flex flex-col items-center gap-1">
                    <span class="material-symbols-outlined" ${activeTab === 'games' ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>sports_esports</span>
                    <span class="text-[10px] font-bold">Games</span>
                </button>
                <button onclick="window.location.href='ai_chat.html'" class="${activeTab === 'ai' ? 'text-pink-500' : 'text-slate-400'} flex flex-col items-center gap-1 relative">
                    <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">auto_awesome</span>
                    <span class="text-[10px] font-bold">Yara AI</span>
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                </button>
            </nav>
        `;
    },

    renderFooter() {
        return `
            <footer class="w-full rounded-t-[3rem] mt-20 bg-emerald-900 dark:bg-emerald-950">
                <div class="flex flex-col md:flex-row justify-between items-center p-12 gap-6 w-full max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] text-xs font-medium">
                <div class="text-lg font-black text-pink-400">Yara's Forest 🦫</div>
                <div class="flex flex-wrap justify-center gap-8">
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="#">Privacy</a>
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="#">Terms</a>
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="#">Safety</a>
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="parent_dashboard.html">Parents</a>
                </div>
                <div class="text-emerald-300">© 2026 Yara's Forest</div>
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-all">
                        <span class="material-symbols-outlined text-sm">favorite</span>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 cursor-pointer hover:scale-110 transition-all">
                        <span class="material-symbols-outlined text-sm">pets</span>
                    </div>
                </div>
                </div>
            </footer>
        `;
    },

    refreshStats() {
        const lvlEl = document.getElementById('nav-level');
        const xpEl  = document.getElementById('nav-xp');
        const berriesEl = document.getElementById('nav-berries');
        if (!lvlEl || !xpEl) return;
        try {
            const level = Store.getLevel();
            const xp    = Store.state.xp;
            const berries = Store.state.starBerries || 0;
            lvlEl.textContent = `Lv.${level}`;
            xpEl.textContent  = `${xp} XP`;
            if (berriesEl) berriesEl.textContent = berries.toString();
        } catch (e) { /* Store not available */ }
    },

    mount(containerId, html) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
            this.applyDarkMode();
            // Wire live XP updates whenever the top nav is mounted
            if (containerId === 'top-nav-placeholder') {
                this.refreshStats();
                if (!this._statsListenerAdded) {
                    document.addEventListener('stateChanged', () => this.refreshStats());
                    this._statsListenerAdded = true;
                }
            }
        }
    }
};
