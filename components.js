const Components = {
    applyDarkMode() {
        try {
            const s = JSON.parse(localStorage.getItem('capySettings') || '{}');
            if (s.darkMode) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        } catch(e) {}
    },

    renderTopNav(activeTab) {
        const { streakDays } = Store.state;
        let sessionName   = '';
        let sessionAvatar = '🦫';
        try {
            const sess = JSON.parse(localStorage.getItem('capySession') || 'null');
            if (sess) { sessionName = sess.name || ''; sessionAvatar = sess.avatar || '🦫'; }
        } catch(e) {}

        return `
            <nav id="top-nav-bar" class="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800" style="transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);">
                <div class="flex justify-between items-center w-full px-5 py-3 max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans'] antialiased">

                <!-- Logo -->
                <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.location.href='6_Home_Forest_Expedition.html'">
                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-400/60 shadow-md flex-shrink-0 bg-pink-100 flex items-center justify-center">
                        <img src="yara-avatar.png?v=1" alt="Yara" class="w-full h-full object-cover"
                             onerror="this.style.display='none';this.parentElement.innerHTML='🦫'"/>
                    </div>
                    <span class="text-xl font-black tracking-tight text-navy dark:text-blue-100">Yara's Forest</span>
                </div>

                <!-- Right: streak + XP + avatar -->
                <div class="flex items-center gap-2.5">
                    <!-- Streak compact pill -->
                    <div class="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-3 py-1.5 rounded-full">
                        <span class="material-symbols-outlined text-orange-500 text-base" style="font-variation-settings:'FILL' 1;font-size:16px">local_fire_department</span>
                        <span class="font-black text-xs text-orange-500">${streakDays}</span>
                    </div>
                    <!-- XP + Level pill -->
                    <div id="nav-xp-pill" class="hidden sm:flex items-center gap-1.5 bg-amber-50 dark:bg-yellow-500/10 border border-amber-100 dark:border-yellow-400/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-amber-100 transition-colors" onclick="window.location.href='progress.html'">
                        <span class="material-symbols-outlined text-amber-500 dark:text-yellow-400" style="font-variation-settings:'FILL' 1;font-size:14px">star</span>
                        <span id="nav-level" class="font-black text-amber-700 dark:text-yellow-300 text-xs">Lv.1</span>
                        <span class="text-slate-300 text-xs">·</span>
                        <span id="nav-xp" class="font-bold text-slate-600 dark:text-white/70 text-xs">0 XP</span>
                    </div>
                    <!-- Avatar + dropdown -->
                    <div class="relative group/user">
                        <div class="w-9 h-9 rounded-full bg-slate-700 border-2 border-pink-400/60 flex items-center justify-center cursor-pointer active:scale-95 transition-transform text-xl hover:border-pink-400 select-none"
                             title="${sessionName || 'Profile'}">
                            ${sessionAvatar}
                        </div>
                        <div class="invisible group-hover/user:visible opacity-0 group-hover/user:opacity-100 transition-all duration-200
                                    absolute top-full right-0 mt-2 w-52
                                    bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                            ${sessionName ? `
                            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                <p class="font-black text-sm text-navy dark:text-white truncate">${sessionName}</p>
                                <p class="text-xs text-slate-400 mt-0.5">Explorer</p>
                            </div>` : ''}
                            <a href="progress.html" class="flex items-center gap-3 px-4 py-3 text-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors">
                                <span class="material-symbols-outlined text-emerald-500 text-base" style="font-variation-settings:'FILL' 1;">military_tech</span> My Progress
                            </a>
                            <a href="settings.html" class="flex items-center gap-3 px-4 py-3 text-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors">
                                <span class="material-symbols-outlined text-slate-400 text-base">settings</span> Settings
                            </a>
                            <div class="border-t border-slate-100 dark:border-slate-800">
                                <button onclick="(function(){ try{ var a=window.Auth||null; if(a){ a.logout(); } else { localStorage.removeItem('capySession'); window.location.href='4_Login_Capy_Yara_Welcomes_You.html'; } }catch(e){ localStorage.removeItem('capySession'); window.location.href='4_Login_Capy_Yara_Welcomes_You.html'; } })()"
                                        class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm transition-colors text-left">
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
            <aside id="side-nav-aside" class="fixed left-4 top-24 bottom-8 w-20 rounded-[3rem] flex flex-col items-center py-4 gap-1 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] hidden md:flex overflow-hidden">

                <!-- Up arrow -->
                <button id="sidenav-up" onclick="sideNavScroll(-1)"
                        class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-100 active:scale-90 transition-all"
                        style="opacity:0;pointer-events:none">
                    <span class="material-symbols-outlined" style="font-size:20px">keyboard_arrow_up</span>
                </button>

                <!-- Clip window — hides overflowing items -->
                <div id="side-nav-window" class="flex-1 w-full overflow-hidden" style="position:relative">
                    <!-- Sliding inner list — moved via translateY -->
                    <div id="side-nav-inner" class="flex flex-col gap-3 items-center w-full" style="transition:transform 0.25s ease;will-change:transform">
                        <button onclick="window.location.href='6_Home_Forest_Expedition.html'" title="Home" class="${activeTab === 'home' ? 'bg-pink-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-pink-500/40' : 'text-slate-400 p-2'} active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl" ${activeTab === 'home' ? 'style="font-variation-settings:\'FILL\' 1;"' : ''}>home</span>
                        </button>
                        <button onclick="window.location.href='classes.html'" title="Cursos" class="${activeTab === 'classes' ? 'bg-violet-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-violet-500/40' : 'text-slate-400 p-2'} hover:text-violet-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">menu_book</span>
                        </button>
                        <button onclick="window.location.href='learn.html'" title="Trilha Diária" class="${activeTab === 'lessons' ? 'bg-amber-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-amber-500/40' : 'text-slate-400 p-2'} hover:text-amber-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">route</span>
                        </button>
                        <button onclick="window.location.href='5_Game_Pavilion_Forest_Edition.html'" title="Games" class="${activeTab === 'games' ? 'bg-emerald-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-emerald-500/40' : 'text-slate-400 p-2'} hover:text-emerald-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">sports_esports</span>
                        </button>
                        <button onclick="window.location.href='ai_chat.html'" title="Yara AI"
                                class="${activeTab === 'ai' ? 'bg-pink-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-pink-500/40' : 'text-slate-400 p-2'} hover:text-pink-500 active:scale-90 hover:rotate-6 transition-all duration-300 relative">
                            <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">auto_awesome</span>
                            <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-white animate-pulse"></span>
                        </button>
                        <button onclick="window.location.href='youtube_lab.html'" title="YouTube Lab"
                                class="${activeTab === 'youtube' ? 'bg-red-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-red-500/40' : 'text-slate-400 p-2'} hover:text-red-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">smart_display</span>
                        </button>
                        <button onclick="window.location.href='music_lab.html'" title="Music Lab"
                                class="${activeTab === 'music' ? 'bg-purple-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-purple-500/40' : 'text-slate-400 p-2'} hover:text-purple-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">music_note</span>
                        </button>
                        <button onclick="window.location.href='study_plan.html'" title="Meu Plano"
                                class="${activeTab === 'studyplan' ? 'bg-indigo-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-indigo-500/40' : 'text-slate-400 p-2'} hover:text-indigo-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">calendar_month</span>
                        </button>
                    </div>
                </div>

                <!-- Down arrow -->
                <button id="sidenav-down" onclick="sideNavScroll(1)"
                        class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-90 transition-all">
                    <span class="material-symbols-outlined" style="font-size:20px">keyboard_arrow_down</span>
                </button>
            </aside>
        `;
    },

    initSideNavScroll() {
        var _navOffset = 0;
        var STEP = 72;
        var win   = document.getElementById('side-nav-window');
        var inner = document.getElementById('side-nav-inner');
        var btnUp = document.getElementById('sidenav-up');
        var btnDn = document.getElementById('sidenav-down');
        if (!win || !inner || !btnUp || !btnDn) return;

        function maxOffset() { return Math.max(0, inner.offsetHeight - win.offsetHeight); }
        function update() {
            inner.style.transform = 'translateY(-' + _navOffset + 'px)';
            var atTop = _navOffset <= 0;
            var atBot = _navOffset >= maxOffset() - 1;
            btnUp.style.opacity       = atTop ? '0' : '1';
            btnUp.style.pointerEvents = atTop ? 'none' : 'auto';
            btnDn.style.opacity       = atBot ? '0' : '1';
            btnDn.style.pointerEvents = atBot ? 'none' : 'auto';
        }
        window.sideNavScroll = function(dir) {
            _navOffset = Math.max(0, Math.min(_navOffset + dir * STEP, maxOffset()));
            update();
        };
        setTimeout(update, 150);
        window.addEventListener('resize', update);
    },

    renderMobileNav(activeTab) {
        return `
            <!-- Bottom Nav (5 tabs) -->
            <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-3 flex justify-around items-center z-50 border-t border-slate-100 dark:border-slate-800">
                <button onclick="window.location.href='6_Home_Forest_Expedition.html'" class="${activeTab === 'home' ? 'text-pink-500' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl ${activeTab === 'home' ? 'bg-pink-50' : ''}">
                    <span class="material-symbols-outlined text-2xl" ${activeTab === 'home' ? 'style="font-variation-settings:\'FILL\' 1;"' : ''}>home</span>
                    <span class="text-[10px] font-black">Home</span>
                </button>
                <button onclick="window.location.href='classes.html'" class="${activeTab === 'classes' ? 'text-violet-500' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl ${activeTab === 'classes' ? 'bg-violet-50' : ''}">
                    <span class="material-symbols-outlined text-2xl" ${activeTab === 'classes' ? 'style="font-variation-settings:\'FILL\' 1;"' : ''}>menu_book</span>
                    <span class="text-[10px] font-black">Cursos</span>
                </button>
                <button onclick="window.location.href='learn.html'" class="${activeTab === 'lessons' ? 'text-amber-500' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl ${activeTab === 'lessons' ? 'bg-amber-50' : ''}">
                    <span class="material-symbols-outlined text-2xl" ${activeTab === 'lessons' ? 'style="font-variation-settings:\'FILL\' 1;"' : ''}>route</span>
                    <span class="text-[10px] font-black">Trilha</span>
                </button>
                <button onclick="window.location.href='ai_chat.html'" class="${activeTab === 'ai' ? 'text-pink-500' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl relative ${activeTab === 'ai' ? 'bg-pink-50' : ''}">
                    <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">auto_awesome</span>
                    <span class="text-[10px] font-black">Yara AI</span>
                    <span class="absolute top-0.5 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                </button>
                <button onclick="openMoreSheet()" class="${['games','youtube','music','studyplan','leaderboard','progress','settings'].includes(activeTab) ? 'text-slate-700' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl">
                    <span class="material-symbols-outlined text-2xl">grid_view</span>
                    <span class="text-[10px] font-black">Mais</span>
                </button>
            </nav>

            <!-- More Sheet Overlay -->
            <div id="more-sheet-overlay" class="md:hidden fixed inset-0 bg-black/40 z-[60] hidden" onclick="closeMoreSheet()"></div>

            <!-- More Sheet Panel -->
            <div id="more-sheet" class="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-slate-900 rounded-t-3xl pb-10 pt-4 px-5 shadow-2xl"
                 style="transform:translateY(100%);transition:transform .3s cubic-bezier(.32,0,.67,0)">
                <!-- Handle -->
                <div class="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5"></div>
                <p class="font-black text-navy dark:text-white text-xs mb-4 uppercase tracking-widest opacity-50">Explorar</p>

                <!-- Feature grid -->
                <div class="grid grid-cols-4 gap-3 mb-5">
                    <button onclick="window.location.href='5_Game_Pavilion_Forest_Edition.html'" class="flex flex-col items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl py-3 px-1 active:scale-95 transition-all ${activeTab === 'games' ? 'ring-2 ring-emerald-400' : ''}">
                        <span class="material-symbols-outlined text-emerald-500 text-2xl" style="font-variation-settings:'FILL' 1;">sports_esports</span>
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">Games</span>
                    </button>
                    <button onclick="window.location.href='youtube_lab.html'" class="flex flex-col items-center gap-2 bg-red-50 dark:bg-red-500/10 rounded-2xl py-3 px-1 active:scale-95 transition-all ${activeTab === 'youtube' ? 'ring-2 ring-red-400' : ''}">
                        <span class="material-symbols-outlined text-red-500 text-2xl" style="font-variation-settings:'FILL' 1;">smart_display</span>
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">YouTube</span>
                    </button>
                    <button onclick="window.location.href='music_lab.html'" class="flex flex-col items-center gap-2 bg-purple-50 dark:bg-purple-500/10 rounded-2xl py-3 px-1 active:scale-95 transition-all ${activeTab === 'music' ? 'ring-2 ring-purple-400' : ''}">
                        <span class="material-symbols-outlined text-purple-500 text-2xl" style="font-variation-settings:'FILL' 1;">music_note</span>
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">Music Lab</span>
                    </button>
                    <button onclick="window.location.href='study_plan.html'" class="flex flex-col items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl py-3 px-1 active:scale-95 transition-all ${activeTab === 'studyplan' ? 'ring-2 ring-indigo-400' : ''}">
                        <span class="material-symbols-outlined text-indigo-500 text-2xl" style="font-variation-settings:'FILL' 1;">calendar_month</span>
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">Meu Plano</span>
                    </button>
                </div>

                <!-- Utility links -->
                <div class="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-around">
                    <a href="progress.html" class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                        <span class="material-symbols-outlined text-emerald-500 text-lg" style="font-variation-settings:'FILL' 1;">military_tech</span> Progresso
                    </a>
                    <a href="settings.html" class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                        <span class="material-symbols-outlined text-slate-400 text-lg">settings</span> Ajustes
                    </a>
                </div>
            </div>

        `;
    },

    initMoreSheet() {
        window.openMoreSheet = function() {
            const overlay = document.getElementById('more-sheet-overlay');
            const sheet   = document.getElementById('more-sheet');
            if (!overlay || !sheet) return;
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                sheet.style.transform  = 'translateY(0)';
                sheet.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1)';
            });
        };
        window.closeMoreSheet = function() {
            const overlay = document.getElementById('more-sheet-overlay');
            const sheet   = document.getElementById('more-sheet');
            if (!overlay || !sheet) return;
            sheet.style.transform  = 'translateY(100%)';
            sheet.style.transition = 'transform .3s cubic-bezier(.32,0,.67,0)';
            setTimeout(() => overlay.classList.add('hidden'), 300);
        };
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
            if (containerId === 'top-nav-placeholder') {
                this.refreshStats();
                if (!this._statsListenerAdded) {
                    document.addEventListener('stateChanged', () => this.refreshStats());
                    this._statsListenerAdded = true;
                }
            }
            if (containerId === 'side-nav-placeholder') {
                this.initSideNavScroll();
            }
            if (containerId === 'mobile-nav-placeholder') {
                this.initMoreSheet();
            }
        }
    },

    // ── Personalized Tab — auto-injected into all aula_NN.html pages ──────────

    autoInjectPersonalizedTab() {
        // Only run on aula pages
        if (!window.location.pathname.match(/aula_\d+\.html/i) &&
            !window.location.href.match(/aula_\d+\.html/i)) return;
        // Guard against double-injection
        if (document.getElementById('tab-personalizada')) return;

        // 1. Find the tab bar (the sticky div that holds tab-btn elements)
        const tabBar = document.querySelector('.tab-btn')?.closest('div');
        if (!tabBar) return;

        // 2. Add the new tab button
        const btn = document.createElement('button');
        btn.className = 'tab-btn px-5 py-4 text-sm text-slate-500 whitespace-nowrap';
        btn.dataset.tab = 'personalizada';
        btn.innerHTML = '✨ Para Você';
        tabBar.appendChild(btn);

        // 3. Add the panel (lazy-loaded on demand)
        // Use the existing vocab tab's parent as reference — avoids accidentally targeting the tab bar div
        const mainContent = document.getElementById('tab-vocab')?.parentElement ||
                            document.querySelector('.max-w-5xl.mx-auto.py-8') ||
                            document.querySelector('.max-w-5xl');
        if (!mainContent) return;
        const panel = document.createElement('div');
        panel.id = 'tab-personalizada';
        panel.className = 'fade-in hidden';
        panel.innerHTML = `
            <div id="personalized-inner" class="py-8">
                <div class="text-center py-12">
                    <div class="text-5xl mb-4">✨</div>
                    <h2 class="text-2xl font-black text-navy mb-2">Aula Para Você!</h2>
                    <p class="text-slate-500 mb-6 max-w-sm mx-auto">A Yara vai criar exemplos personalizados usando seus interesses favoritos com o vocabulário de hoje.</p>
                    <button onclick="loadPersonalizedLesson()" class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black px-10 py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-sm text-base">
                        Gerar Minha Aula 🌿
                    </button>
                </div>
            </div>`;
        mainContent.appendChild(panel);

        // 4. Click handler for our tab button
        btn.addEventListener('click', () => {
            // Mark all tab buttons inactive
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
            // Hide all panels (using id^=tab- selector catches all including ours)
            document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.add('hidden'));
            // Show ours
            panel.classList.remove('hidden');
        });

        // 5. When other tab buttons are clicked → hide our panel
        //    (their existing TABS array doesn't include 'personalizada', so they won't hide it)
        document.querySelectorAll('.tab-btn').forEach(existingBtn => {
            if (existingBtn === btn) return;
            existingBtn.addEventListener('click', () => {
                panel.classList.add('hidden');
            });
        });

        // 6. Define global functions for loading and rendering
        window.loadPersonalizedLesson = async function() {
            const inner = document.getElementById('personalized-inner');
            inner.innerHTML = `
                <div class="text-center py-16">
                    <div class="text-5xl mb-4 animate-bounce">🌿</div>
                    <p class="font-black text-slate-500 text-lg">Yara está criando sua aula especial...</p>
                    <p class="text-slate-400 text-sm mt-2">Isso leva alguns segundos</p>
                </div>`;

            try {
                const topic = document.querySelector('h1')?.textContent?.trim() || document.title || 'English';
                const vocab = (window.VOCAB || []).slice(0, 8).map(v => Array.isArray(v) ? v[0] : v);
                const session = JSON.parse(localStorage.getItem('capySession') || '{}');
                const userId = session?.id || 'guest';

                const res = await fetch('/api/personalize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, vocab, userId })
                });
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                inner.innerHTML = window.renderPersonalizedLesson(data);
            } catch(err) {
                inner.innerHTML = `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-3">😅</div>
                        <p class="font-black text-slate-600 mb-2">Não consegui gerar sua aula agora</p>
                        <p class="text-slate-400 text-sm mb-5">${err.message || 'Tente novamente em instantes'}</p>
                        <button onclick="loadPersonalizedLesson()" class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black px-8 py-3 rounded-2xl hover:scale-105 transition-all">
                            Tentar novamente 🌿
                        </button>
                    </div>`;
            }
        };

        window.renderPersonalizedLesson = function(data) {
            const examples = (data.examples || []).map(ex => `
                <div class="bg-white border-2 border-emerald-100 rounded-2xl p-5">
                    <p class="font-black text-navy text-base mb-1">${ex.en}</p>
                    <p class="text-emerald-600 font-bold text-sm mb-2">${ex.pt}</p>
                    ${ex.highlight ? `<span class="inline-block bg-emerald-100 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full">📌 ${ex.highlight}</span>` : ''}
                </div>`).join('');

            let quizHtml = '';
            if (data.mini_quiz?.length) {
                const qItems = data.mini_quiz.map((q, qi) => `
                    <div class="bg-white border-2 border-slate-100 rounded-2xl p-5">
                        <p class="font-black text-navy text-sm mb-3"><span class="text-emerald-500">${qi+1}.</span> ${q.q}</p>
                        <div class="flex flex-wrap gap-2">
                            ${(q.opts || []).map((o, oi) => `
                                <button onclick="pQuizSelect(this,${qi},${oi},${q.ans})"
                                        class="px-4 py-2 rounded-xl text-sm font-bold border-2 border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                                    ${o}
                                </button>`).join('')}
                        </div>
                    </div>`).join('');
                quizHtml = `
                    <div>
                        <h3 class="text-lg font-black text-navy mb-4">🎯 Mini Quiz</h3>
                        <div class="space-y-3">${qItems}</div>
                    </div>`;
            }

            return `
                <div class="space-y-8 py-4">
                    <!-- Intro -->
                    <div class="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                        <div class="text-3xl mb-2">✨</div>
                        <p class="font-black text-lg mb-1">Sua Aula Personalizada</p>
                        <p class="text-white/85 text-sm">${data.intro || 'Aqui estão seus exemplos personalizados!'}</p>
                    </div>

                    <!-- Examples -->
                    <div>
                        <h3 class="text-lg font-black text-navy mb-4">💬 Seus Exemplos</h3>
                        <div class="space-y-3">${examples}</div>
                    </div>

                    ${quizHtml}

                    ${data.tip ? `
                    <div class="bg-amber-50 border-2 border-amber-100 rounded-2xl p-5">
                        <p class="font-black text-amber-700 text-sm mb-1">💡 Dica da Yara</p>
                        <p class="text-amber-800 text-sm">${data.tip}</p>
                    </div>` : ''}

                    <!-- Reload -->
                    <div class="text-center">
                        <button onclick="loadPersonalizedLesson()"
                                class="text-slate-400 hover:text-emerald-500 text-sm font-bold transition-colors">
                            🔄 Gerar novos exemplos
                        </button>
                    </div>
                </div>`;
        };

        // Quiz interaction for personalized mini-quiz
        window.pQuizSelect = function(btn, qi, oi, correctAns) {
            const parent = btn.closest('div');
            parent.querySelectorAll('button').forEach(b => {
                b.disabled = true;
                b.classList.remove('border-emerald-400', 'bg-emerald-50', 'border-red-400', 'bg-red-50');
            });
            if (oi === correctAns) {
                btn.classList.add('border-emerald-400', 'bg-emerald-50', 'text-emerald-700');
            } else {
                btn.classList.add('border-red-400', 'bg-red-50', 'text-red-700');
                parent.querySelectorAll('button')[correctAns]?.classList.add('border-emerald-400', 'bg-emerald-50', 'text-emerald-700');
            }
        };
    }
};

// Auto-inject personalized tab on aula pages (runs after all inline scripts)
document.addEventListener('DOMContentLoaded', () => {
    Components.autoInjectPersonalizedTab();
});
