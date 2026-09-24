// ── Que dia é hoje PARA O ALUNO ─────────────────────────────────────────────
// Cópia idêntica do bloco no topo do store.js. Duplicado de propósito: há
// página que carrega o components.js sem o store.js (landing.html), e um
// arquivo novo só para isto obrigaria a editar ~200 HTMLs. Os `x || ...` fazem
// qualquer ordem de carga dar o mesmo resultado.
globalThis.capyHojeBR = globalThis.capyHojeBR || function () {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
};
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
        let sessionAvatar = '🐾';
        try {
            const sess = JSON.parse(localStorage.getItem('capySession') || 'null');
            if (sess) { sessionName = sess.name || ''; sessionAvatar = sess.avatar || '🐾'; }
        } catch(e) {}

        return `
            <nav id="top-nav-bar" class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800" style="transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);">
                <div class="flex justify-between items-center w-full px-5 py-3 max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans'] antialiased">

                <!-- Logo -->
                <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.location.href='6_Home_Forest_Expedition.html'">
                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-400/60 shadow-md flex-shrink-0 bg-pink-100 flex items-center justify-center">
                        <img src="logo-capy.png?v=lg2" alt="Yara" class="w-full h-full object-cover"
                             onerror="this.style.display='none';this.parentElement.innerHTML='🐾'"/>
                    </div>
                    <span class="text-xl font-black tracking-tight text-navy dark:text-blue-100">Capy Yara English</span>
                </div>

                <!-- Right: streak + XP + avatar -->
                <div class="flex items-center gap-2.5">
                    <!-- Streak compact pill -->
                    <div class="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-3 py-1.5 rounded-full">
                        <span class="material-symbols-outlined text-orange-500 text-base" style="font-variation-settings:'FILL' 1;font-size:16px">local_fire_department</span>
                        <span id="nav-streak" class="font-black text-xs text-orange-500">${streakDays}</span>
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
                            <a href="account.html" class="flex items-center gap-3 px-4 py-3 text-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors">
                                <span class="material-symbols-outlined text-orange-500 text-base" style="font-variation-settings:'FILL' 1;">workspace_premium</span> Minha conta
                            </a>
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
                        <button onclick="window.location.href='2_Flashcard_Journey_Expedition_Edition.html'" title="Flashcards"
                                class="${activeTab === 'flashcards' ? 'bg-cyan-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-cyan-500/40' : 'text-slate-400 p-2'} hover:text-cyan-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">style</span>
                        </button>
                        <button onclick="window.location.href='quadro.html'" title="Quadro Branco"
                                class="${activeTab === 'quadro' ? 'bg-lime-500 text-white rounded-full p-3 scale-110 shadow-lg shadow-lime-500/40' : 'text-slate-400 p-2'} hover:text-lime-500 active:scale-90 hover:rotate-6 transition-all duration-300">
                            <span class="material-symbols-outlined text-2xl">stylus</span>
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
            <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-3 flex justify-around items-center z-50 border-t border-slate-100 dark:border-slate-800">
                <button onclick="window.location.href='6_Home_Forest_Expedition.html'" class="${activeTab === 'home' ? 'text-pink-500' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl ${activeTab === 'home' ? 'bg-pink-50' : ''}">
                    <span class="material-symbols-outlined text-2xl" ${activeTab === 'home' ? 'style="font-variation-settings:\'FILL\' 1;"' : ''}>home</span>
                    <span class="text-[10px] font-black">Início</span>
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
                <button onclick="openMoreSheet()" class="${['games','youtube','music','studyplan','flashcards','quadro','leaderboard','progress','settings'].includes(activeTab) ? 'text-slate-700' : 'text-slate-400'} flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl">
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
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">Jogos</span>
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
                    <button onclick="window.location.href='2_Flashcard_Journey_Expedition_Edition.html'" class="flex flex-col items-center gap-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl py-3 px-1 active:scale-95 transition-all ${activeTab === 'flashcards' ? 'ring-2 ring-cyan-400' : ''}">
                        <span class="material-symbols-outlined text-cyan-500 text-2xl" style="font-variation-settings:'FILL' 1;">style</span>
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">🃏 Flashcards</span>
                    </button>
                    <button onclick="window.location.href='quadro.html'" class="flex flex-col items-center gap-2 bg-lime-50 dark:bg-lime-500/10 rounded-2xl py-3 px-1 active:scale-95 transition-all ${activeTab === 'quadro' ? 'ring-2 ring-lime-400' : ''}">
                        <span class="material-symbols-outlined text-lime-500 text-2xl" style="font-variation-settings:'FILL' 1;">stylus</span>
                        <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">🖊️ Quadro</span>
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
            <footer class="w-full rounded-t-[3rem] mt-20 bg-[#001f3f] dark:bg-[#001229] border-t border-white/10">
                <div class="flex flex-col md:flex-row justify-between items-center p-12 gap-6 w-full max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] text-xs font-medium">
                <div class="text-lg font-black text-pink-400">Capy Yara English 🐾</div>
                <div class="flex flex-wrap justify-center gap-8">
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="privacidade.html">Privacidade</a>
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="termos.html">Termos</a>
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="privacidade.html#seguranca">Segurança</a>
                    <a class="text-emerald-100/70 hover:text-white transition-all cursor-pointer hover:translate-y-[-2px]" href="parent_dashboard.html">Pais</a>
                </div>
                <div class="text-emerald-300">© 2026 Capy Yara English</div>
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
        const streakEl  = document.getElementById('nav-streak');
        if (!lvlEl || !xpEl) return;
        try {
            const level = Store.getLevel();
            const xp    = Store.state.xp;
            const berries = Store.state.starBerries || 0;
            lvlEl.textContent = `Lv.${level}`;
            xpEl.textContent  = `${xp} XP`;
            if (berriesEl) berriesEl.textContent = berries.toString();
            if (streakEl) streakEl.textContent = (Store.state.streakDays || 0).toString();
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

    // ── Icon system — outline SVGs replacing chapter/course emojis ───────────
    // Dictionary key → inner SVG markup (viewBox 0 0 24 24). Wrapper adds the
    // shared stroke attrs so every icon looks consistent without repeating them.
    _ICONS: {
        sprout: '<path d="M12 21v-8"/><path d="M12 13c0-3.5-2.5-6-6-6 0 3.5 2.5 6 6 6z"/><path d="M12 13c0-4 3-7 7-7 0 4-3 7-7 7z"/>',
        seedling: '<path d="M12 21v-9"/><path d="M12 12C7 12 5 8 5 4c5 0 7 4 7 8z"/><path d="M12 9c0-2.5 2-4.5 5-4.5 0 2.5-2 4.5-5 4.5z"/>',
        sapling: '<path d="M12 21V9"/><path d="M12 9c-4.5 0-7-3-7-7 4.5 0 7 3 7 7z"/><path d="M12 9c4 0 6-2.5 6-6-4 0-6 2.5-6 6z"/><path d="M9 21h6"/>',
        tree: '<path d="M12 21v-6"/><path d="M12 3l5 7h-3l4 6H6l4-6H7l5-7z"/>',
        building: '<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 8h6v13h-6"/><path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1"/>',
        compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-6 2 2-6z"/>',
        stethoscope: '<path d="M6 4v6a4 4 0 0 0 8 0V4"/><circle cx="18" cy="16" r="3"/><path d="M14 12v1a4 4 0 0 1-8 0v-1M6 4H4M10 4H8"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18z"/>',
        briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
        clapperboard: '<path d="M3 9l1.5-4h3l-1.5 4z"/><path d="M8 9l1.5-4h3l-1.5 4z"/><path d="M13 9l1.5-4h3l-1.5 4z"/><rect x="3" y="9" width="18" height="11" rx="1.5"/>',
        'message-circle': '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.7-.85L3 21l1.85-5.8A8.5 8.5 0 1 1 21 11.5z"/>',
        wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.5 1.5 0 0 0 2 2l6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z"/>',
        smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
        'heart-handshake': '<path d="M12 6l-1.5-1.5a3 3 0 1 0-4.24 4.24L12 15l5.74-6.26a3 3 0 1 0-4.24-4.24z"/><path d="M8 14l2.5 2.5a1.5 1.5 0 0 0 2 0l1-1a1.5 1.5 0 0 1 2 0l.5.5"/>',
        brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3.5 3.5 0 0 0 8 18a2.5 2.5 0 0 0 4-2V7a3 3 0 0 0-3-3z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3.5 3.5 0 0 1 16 18a2.5 2.5 0 0 1-4-2"/>',
        presentation: '<path d="M3 4h18"/><path d="M5 4v11h14V4"/><path d="M12 15v5M9 20h6"/>',
        lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6v.5h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3z"/>',
        mountain: '<path d="M3 20l6-11 4 7 2-3 6 7z"/>',
        'scroll-text': '<path d="M8 3h11v15a2.5 2.5 0 0 1-2.5 2.5H8"/><path d="M8 20.5A2.5 2.5 0 0 1 5.5 18V6A2.5 2.5 0 0 0 3 3.5"/><path d="M11 8h5M11 12h5"/>',
        target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
        mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"/>',
        drama: '<circle cx="8.5" cy="9" r="4.5"/><path d="M6.8 8.3h.01M10.2 8.3h.01M6.5 10.8a2.5 2.5 0 0 0 4 0"/><path d="M15.5 6a4.5 4.5 0 1 1 3.3 7.6M13.5 15.5a4.5 4.5 0 0 0 6.4 3.9"/>',
        coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M7 2c-.5 1 .5 1.5 0 2.5M11 2c-.5 1 .5 1.5 0 2.5"/>',
        plane: '<path d="M10.5 21l1.5-5 6-3-1-2-6.5 1.5L9 4 7 4.5l1 8-6 1.5v2l6-1 1.5 6z"/>',
        home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
        eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
        'graduation-cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/><path d="M21 9v6"/>',
        award: '<circle cx="12" cy="8" r="5.5"/><path d="M8.5 13l-2 8 5.5-3 5.5 3-2-8"/>',
        satellite: '<path d="M13 7 9 3 4 8l4 4"/><path d="m17 11 4 4-5 5-4-4"/><path d="m8 12 4 4 6-6"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>',
    },

    // Returns an inline outline SVG for `key`, or '' if the key is unknown.
    // `cls` is passed straight through to the wrapping <svg class="">.
    icon(key, cls) {
        const body = this._ICONS[key];
        if (!body) return '';
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="${cls || ''}">${body}</svg>`;
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
    },

    // ── Writing Coach: "Yara corrige sua redação" ──────────────────────────
    // Auto-injects a correction button under the free-writing textarea of every
    // lesson (homework tab, and the writing tab of conversation lessons).
    // Free plan: 1 correction/day. Pro/Super: unlimited.
    autoInjectWritingCoach() {
        const targets = [];
        const hw = document.querySelector('#tab-homework');
        if (hw) {
            const tas = hw.querySelectorAll('textarea');
            if (tas.length) targets.push(tas[tas.length - 1]); // free-writing is always the last task
        }
        const wr = document.querySelector('#tab-writing textarea');
        if (wr) targets.push(wr);
        if (!targets.length) return;

        const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

        targets.forEach((ta, idx) => {
            if (ta.dataset.yaraCoach) return; // guard double-injection
            ta.dataset.yaraCoach = '1';

            const wrap = document.createElement('div');
            wrap.className = 'mt-3';
            wrap.innerHTML = `
              <button id="yara-coach-btn-${idx}" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-black px-6 py-3 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-pink-500/20">
                <img src="logo-capy.png?v=lg2" alt="" class="w-6 h-6 rounded-full object-cover border border-white/40" onerror="this.style.display='none'"/>
                🐾 Corrigir com a Yara
              </button>
              <div id="yara-coach-out-${idx}" class="hidden mt-3"></div>`;
            ta.insertAdjacentElement('afterend', wrap);

            const btn = wrap.querySelector(`#yara-coach-btn-${idx}`);
            const out = wrap.querySelector(`#yara-coach-out-${idx}`);

            btn.addEventListener('click', async () => {
                const text = ta.value.trim();
                out.classList.remove('hidden');
                if (!text || text.split(/\s+/).length < 3) {
                    out.innerHTML = `<div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-sm font-bold text-amber-700">✍️ Escreva pelo menos uma frase primeiro — aí a Yara corrige pra você!</div>`;
                    return;
                }

                // Plan gate: free = 1/day
                const isFree = (typeof Store !== 'undefined') ? Store.isFree() : true;
                const todayKey = 'capyWritingCoach_' + capyHojeBR();
                const usedToday = parseInt(localStorage.getItem(todayKey) || '0', 10);
                if (isFree && usedToday >= 1) {
                    out.innerHTML = `
                      <div class="bg-gradient-to-br from-navy to-purple-950 text-white rounded-2xl p-5 text-center">
                        <div class="text-3xl mb-2">🐾✨</div>
                        <p class="font-black mb-1">Você já usou sua correção grátis de hoje!</p>
                        <p class="text-white/70 text-sm mb-4">No plano Pro a Yara corrige TODAS as suas redações, sem limite.</p>
                        <a href="landing.html#pricing" class="inline-block bg-pink-500 hover:bg-pink-400 text-white font-black px-6 py-2.5 rounded-full transition-all">Quero correções ilimitadas →</a>
                      </div>`;
                    return;
                }

                btn.disabled = true;
                btn.classList.add('opacity-70');
                out.innerHTML = `<div class="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 flex items-center gap-3 text-sm font-bold text-pink-600"><span class="animate-bounce text-xl">🐾</span> Yara está lendo seu texto com carinho...</div>`;

                try {
                    const lessonTitle = (window.YARA_WIDGET && window.YARA_WIDGET.lessonTitle) || document.title;
                    const course = (window.YARA_WIDGET && window.YARA_WIDGET.course) || 'english';
                    const taskDesc = ta.getAttribute('placeholder') || 'free writing';
                    const userId = (typeof Store !== 'undefined' && Store.state && Store.state.userId) || undefined;

                    const r = await fetch('/api/correct-writing', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, text, lessonTitle, course, task: taskDesc })
                    });
                    const d = await r.json();
                    if (!r.ok || d.error) throw new Error(d.error || 'Erro na correção');

                    localStorage.setItem(todayKey, String(usedToday + 1));

                    const paws = '🐾'.repeat(d.score) + '<span class="opacity-25">' + '🐾'.repeat(5 - d.score) + '</span>';
                    const errHtml = (d.errors && d.errors.length)
                        ? d.errors.map(e => `
                            <div class="bg-white rounded-xl p-3 border border-slate-100">
                              <div class="text-sm"><span class="line-through text-red-500 font-semibold">${esc(e.original)}</span> → <span class="text-emerald-600 font-black">${esc(e.fixed)}</span></div>
                              <div class="text-xs text-slate-500 mt-1">💡 ${esc(e.why)}</div>
                            </div>`).join('')
                        : `<div class="bg-emerald-50 rounded-xl p-3 text-sm font-bold text-emerald-700">🎉 Nenhum erro encontrado — texto impecável!</div>`;

                    out.innerHTML = `
                      <div class="bg-gradient-to-br from-pink-50 to-fuchsia-50 border-2 border-pink-200 rounded-2xl p-5 space-y-4">
                        <div class="flex items-center gap-3">
                          <img src="logo-capy.png?v=lg2" alt="Yara" class="w-12 h-12 rounded-full object-cover border-2 border-pink-300" onerror="this.style.display='none'"/>
                          <div>
                            <div class="font-black text-navy text-sm">Correção da Yara</div>
                            <div class="text-lg leading-none">${paws}</div>
                          </div>
                        </div>
                        <p class="text-sm font-bold text-navy">${esc(d.praise)}</p>
                        <div class="space-y-2">${errHtml}</div>
                        <div class="bg-white rounded-xl p-3 border border-pink-100">
                          <div class="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1">✨ Sua versão melhorada</div>
                          <p class="text-sm text-navy italic">"${esc(d.improved)}"</p>
                        </div>
                        ${d.tip ? `<div class="text-xs font-bold text-slate-500">🎯 Dica da Yara: ${esc(d.tip)}</div>` : ''}
                      </div>`;

                    if (typeof Store !== 'undefined' && d.score >= 3) Store.addXP(10);
                    if (d.score >= 3 && window.CapyPWA) setTimeout(() => CapyPWA.softAskPush('Correção feita! 🐾'), 2500);
                } catch (err) {
                    out.innerHTML = `<div class="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-sm font-bold text-red-600">😅 Ops, a Yara não conseguiu corrigir agora. Tenta de novo em instantes!</div>`;
                } finally {
                    btn.disabled = false;
                    btn.classList.remove('opacity-70');
                }
            });
        });
    }
};

// ── Analytics: lightweight funnel beacon (fire-and-forget, never blocks UI) ──
window.capyTrack = function capyTrack(event, meta) {
    try {
        const payload = JSON.stringify({ event, meta: meta || {} });
        if (navigator.sendBeacon) {
            const ok = navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
            if (ok) return;
        }
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
        }).catch(() => {});
    } catch (e) { /* analytics must never break the app */ }
};

// ── PWA: Service Worker + manifest + Push + Install ─────────────────────────
window.CapyPWA = {
    init() {
        // Manifest + theme-color em toda página (a maioria não tem no <head>)
        if (!document.querySelector('link[rel="manifest"]')) {
            const l = document.createElement('link');
            l.rel = 'manifest'; l.href = '/manifest.json';
            document.head.appendChild(l);
        }
        if (!document.querySelector('meta[name="theme-color"]')) {
            const m = document.createElement('meta');
            m.name = 'theme-color'; m.content = '#001f3f';
            document.head.appendChild(m);
        }
        // Service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        // Botão instalar (Android/desktop disparam beforeinstallprompt)
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this._installEvt = e;
            this.showInstallChip();
        });
    },

    // ── Instalar app ──
    showInstallChip() {
        if (document.getElementById('capy-install-chip')) return;
        const dismissed = parseInt(localStorage.getItem('capyInstallDismissed') || '0', 10);
        if (Date.now() - dismissed < 14 * 864e5) return;
        // só nas páginas "hub" pra não atrapalhar aula
        if (!/(Home_Forest|classes|learn)\.?/i.test(location.pathname) && location.pathname !== '/') return;
        const chip = document.createElement('div');
        chip.id = 'capy-install-chip';
        chip.style.cssText = 'position:fixed;bottom:88px;right:16px;z-index:70;';
        chip.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;background:#001f3f;border:1px solid rgba(236,72,153,.4);border-radius:999px;padding:10px 16px;box-shadow:0 10px 30px rgba(0,0,0,.35)">
            <span style="font-size:20px">📲</span>
            <button id="capy-install-go" style="background:none;border:0;color:#fff;font-weight:900;font-size:13px;cursor:pointer;font-family:inherit">Instalar o app</button>
            <button id="capy-install-x" style="background:none;border:0;color:rgba(255,255,255,.4);font-size:14px;cursor:pointer">✕</button>
          </div>`;
        document.body.appendChild(chip);
        document.getElementById('capy-install-go').onclick = async () => {
            chip.remove();
            if (this._installEvt) { this._installEvt.prompt(); this._installEvt = null; }
        };
        document.getElementById('capy-install-x').onclick = () => {
            localStorage.setItem('capyInstallDismissed', String(Date.now()));
            chip.remove();
        };
    },

    // ── Push: pedir no momento feliz ──
    async subscribePush() {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
            const reg = await navigator.serviceWorker.ready;
            const r = await fetch('/api/push-public-key');
            const { key } = await r.json();
            if (!key) return false;
            const b64 = key.replace(/-/g, '+').replace(/_/g, '/');
            const pad = '='.repeat((4 - b64.length % 4) % 4);
            const raw = atob(b64 + pad);
            const appKey = new Uint8Array([...raw].map(c => c.charCodeAt(0)));
            const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appKey });
            if (typeof Store !== 'undefined') {
                Store.state.pushSub = sub.toJSON();
                Store.save(); // sincroniza pro Supabase junto com o resto do estado
            }
            return true;
        } catch (e) { return false; }
    },

    softAskPush(reason) {
        try {
            if (!('Notification' in window) || Notification.permission !== 'default') return;
            if (document.getElementById('capy-push-card')) return;
            const askedAt = parseInt(localStorage.getItem('capyPushAskedAt') || '0', 10);
            if (Date.now() - askedAt < 7 * 864e5) return;

            const card = document.createElement('div');
            card.id = 'capy-push-card';
            card.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:80;width:min(92vw,380px);';
            card.innerHTML = `
              <div style="background:linear-gradient(135deg,#001f3f,#1e1b4b);border:1px solid rgba(236,72,153,.35);border-radius:20px;padding:16px;display:flex;gap:12px;align-items:center;box-shadow:0 16px 48px rgba(0,0,0,.45);font-family:inherit">
                <img src="/icon-192.png" style="width:44px;height:44px;border-radius:50%;border:2px solid rgba(236,72,153,.5)"/>
                <div style="flex:1">
                  <div style="color:#fff;font-weight:900;font-size:13px;margin-bottom:2px">${reason || 'Mandou bem! 🐾'}</div>
                  <div style="color:rgba(255,255,255,.65);font-size:12px;line-height:1.35">Quer que a Yara te lembre de praticar todo dia?</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px">
                  <button id="capy-push-yes" style="background:#ec4899;color:#fff;font-weight:900;border:0;border-radius:999px;padding:8px 14px;font-size:12px;cursor:pointer;font-family:inherit">Sim!</button>
                  <button id="capy-push-no" style="background:none;color:rgba(255,255,255,.45);border:0;font-size:11px;cursor:pointer;font-family:inherit">Agora não</button>
                </div>
              </div>`;
            document.body.appendChild(card);
            localStorage.setItem('capyPushAskedAt', String(Date.now()));
            document.getElementById('capy-push-yes').onclick = async () => {
                card.remove();
                const perm = await Notification.requestPermission();
                if (perm === 'granted') await this.subscribePush();
            };
            document.getElementById('capy-push-no').onclick = () => card.remove();
        } catch (e) {}
    }
};

// ══════════════════════════════════════════════════════════════════════════
// CAPY PUSH — lembretes diários que realmente chegam
// ══════════════════════════════════════════════════════════════════════════
// O pedido do dono foi "o app tem que pedir o tempo todo para ligar os
// lembretes". Ao pé da letra isso DESTRÓI a capacidade: a permissão do
// navegador é de tiro único — negada uma vez, vira `denied` permanente e
// nenhum código consegue reperguntar. A intenção (adoção máxima) se entrega
// de outro jeito:
//
//   1. pedir em TODO momento de vitória, mas só enquanto a permissão é
//      `default`, onde pedir é de graça e reversível;
//   2. um caminho permanente em Ajustes, que não gasta a permissão;
//   3. saída para os becos sem saída — que hoje são silenciosos e definitivos.
//
// Três becos existiam antes disto:
//   • inscrição apagada do servidor por uma aba velha (o /api/db substitui o
//     estado inteiro) + permissão já `granted` ⇒ o card nunca mais aparecia e
//     o aluno ficava sem push PARA SEMPRE, sem saber;
//   • quem negou não tinha nenhuma tela explicando como desbloquear;
//   • iPhone: `Notification` nem existe em aba do Safari, então o card saía
//     calado e o aluno nunca descobria que precisa instalar o app na tela de
//     início. Era literalmente o público inteiro de iOS, invisível.
// ══════════════════════════════════════════════════════════════════════════
window.CapyPush = {
    K_PEDIDOS: 'capyPushPedidos',
    K_IOS: 'capyIosDica',
    K_CONFIRMADO: 'capyPushConfirmadoEm',

    // ── Função PURA: dá para testar a máquina inteira sem navegador ────────
    // A ORDEM das checagens é a regra de negócio, não estilo:
    //  · optOut vem primeiro — quem desligou não pode ser reinscrito por nada;
    //  · iOS-em-aba vem ANTES de "não suportado", senão o iPhone cai no balde
    //    errado (lá `Notification` é undefined) e nunca recebe a instrução de
    //    instalar, que é a única coisa que destrava push nele.
    estado(ctx) {
        if (ctx.optOut) return 'desligado_por_escolha';
        if (ctx.ios && !ctx.standalone) return 'ios_aba';
        if (!ctx.suportado) return 'nao_suportado';
        if (ctx.permission === 'denied') return 'negado';
        if (ctx.permission === 'granted') {
            if (!ctx.temSubNavegador) return 'granted_sem_sub';
            if (!ctx.temSubServidor) return 'orfa';
            return 'ligado';
        }
        return 'pode_pedir';
    },

    ehIOS() {
        return /iP(hone|ad|od)/.test(navigator.userAgent) ||
            // iPadOS se apresenta como Mac; o toque é o que o entrega.
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    },
    standalone() {
        return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
            window.navigator.standalone === true;
    },
    optOut() {
        try { return Boolean(typeof Store !== 'undefined' && Store.state.pushOptOut); } catch (e) { return false; }
    },
    logado() {
        try {
            const s = JSON.parse(localStorage.getItem('capySession') || 'null');
            return Boolean(s && s.id && s.id !== 'guest');
        } catch (e) { return false; }
    },
    _ler(chave) {
        try { return JSON.parse(localStorage.getItem(chave) || '{}') || {}; } catch (e) { return {}; }
    },
    _gravar(chave, v) { try { localStorage.setItem(chave, JSON.stringify(v)); } catch (e) {} },

    // A verdade sobre "tem inscrição" é o navegador, NÃO o Store. É essa
    // distinção que transforma o beco sem saída em conserto automático: a aba
    // velha apagou o blob no servidor, mas a inscrição continua viva aqui.
    async subDoNavegador() {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
            const reg = await navigator.serviceWorker.ready;
            return await reg.pushManager.getSubscription();
        } catch (e) { return null; }
    },

    async contexto() {
        const sub = await this.subDoNavegador();
        return {
            permission: ('Notification' in window) ? Notification.permission : 'unsupported',
            suportado: ('Notification' in window) && ('serviceWorker' in navigator) && ('PushManager' in window),
            temSubNavegador: Boolean(sub),
            temSubServidor: Boolean(typeof Store !== 'undefined' && Store.state.pushSub && Store.state.pushSub.endpoint),
            ios: this.ehIOS(),
            standalone: this.standalone(),
            logado: this.logado(),
            optOut: this.optOut(),
        };
    },

    // ── Conserto automático ───────────────────────────────────────────────
    // Roda no init de toda página, mas custa quase nada: os primeiros return
    // são locais, e o POST é limitado a um por aluno por DIA.
    async reconciliar() {
        try {
            if (this.optOut()) return;              // respeitar quem desligou vem primeiro
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            let sub = await this.subDoNavegador();
            if (!sub) {
                // Permissão já concedida: reinscrever não pergunta nada ao aluno.
                const ok = await CapyPWA.subscribePush();
                if (!ok) return;
                sub = await this.subDoNavegador();
                if (!sub) return;
            }
            const json = sub.toJSON();
            if (typeof Store === 'undefined') return;
            const atual = Store.state.pushSub;
            if (!atual || atual.endpoint !== json.endpoint) {
                Store.state.pushSub = json;
                Store.save();
                return;
            }
            // O servidor pode ter perdido a inscrição mesmo com o endpoint
            // igual aqui (aba velha sobrescreveu o blob inteiro). Reconfirmar
            // uma vez por dia é barato e fecha esse buraco.
            if (localStorage.getItem(this.K_CONFIRMADO) !== capyHojeBR() && this.logado()) {
                Store.save();
                localStorage.setItem(this.K_CONFIRMADO, capyHojeBR());
            }
        } catch (e) { /* nunca quebrar a página por causa de push */ }
    },

    // ── Cadência ──────────────────────────────────────────────────────────
    // Gravar na RESPOSTA, não na exibição. Antes, o card marcava 7 dias no
    // momento em que entrava no DOM — então IGNORAR (o caso mais comum e o
    // mais recuperável: a tela rolou, o aluno nem viu) custava o mesmo que um
    // "não". Aqui ignorar custa 1 dia e recusar custa cada vez mais.
    esperaMs(p) {
        if (p.ultimaResposta === 'nunca') return Infinity;
        if (p.ultimaResposta === 'ignorou') return 1 * 864e5;
        const adiamentos = p.adiou || 0;
        if (adiamentos >= 4) return Infinity;
        return [3, 7, 21][Math.min(adiamentos, 2) ] * 864e5;
    },
    podePedir() {
        const p = this._ler(this.K_PEDIDOS);
        if (!p.ultimoEm) return true;
        const espera = this.esperaMs(p);
        return espera !== Infinity && (Date.now() - p.ultimoEm) >= espera;
    },
    _registrar(resposta) {
        const p = this._ler(this.K_PEDIDOS);
        p.n = (p.n || 0) + 1;
        p.ultimoEm = Date.now();
        p.ultimaResposta = resposta;
        if (resposta === 'adiou') p.adiou = (p.adiou || 0) + 1;
        this._gravar(this.K_PEDIDOS, p);
        if (window.capyTrack) capyTrack('push_' + resposta, {});
    },

    // ── O momento feliz ───────────────────────────────────────────────────
    async momento(motivo) {
        try {
            const ctx = await this.contexto();
            const st = this.estado(ctx);
            if (st === 'ios_aba') return this.dicaIOS();
            if (st !== 'pode_pedir') return;
            if (!this.podePedir()) return;
            if (document.getElementById('capy-push-card')) return;
            this.cartao(motivo);
        } catch (e) {}
    },

    cartao(motivo) {
        const card = document.createElement('div');
        card.id = 'capy-push-card';
        card.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:80;width:min(92vw,380px);';
        card.innerHTML = `
          <div style="background:linear-gradient(135deg,#001f3f,#1e1b4b);border:1px solid rgba(236,72,153,.35);border-radius:20px;padding:16px;display:flex;gap:12px;align-items:center;box-shadow:0 16px 48px rgba(0,0,0,.45);font-family:inherit">
            <img src="/icon-192.png" alt="" style="width:44px;height:44px;border-radius:50%;border:2px solid rgba(236,72,153,.5)"/>
            <div style="flex:1">
              <div style="color:#fff;font-weight:900;font-size:13px;margin-bottom:2px">${motivo || 'Mandou bem! 🐾'}</div>
              <div style="color:rgba(255,255,255,.65);font-size:12px;line-height:1.35">Quer que a Yara te lembre de praticar todo dia?</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <button id="capy-push-yes" style="background:#ec4899;color:#fff;font-weight:900;border:0;border-radius:999px;padding:8px 14px;font-size:12px;cursor:pointer;font-family:inherit">Sim!</button>
              <button id="capy-push-no" style="background:none;color:rgba(255,255,255,.45);border:0;font-size:11px;cursor:pointer;font-family:inherit">Agora não</button>
              <button id="capy-push-never" style="background:none;color:rgba(255,255,255,.25);border:0;font-size:10px;cursor:pointer;font-family:inherit">Não quero</button>
            </div>
          </div>`;
        document.body.appendChild(card);
        if (window.capyTrack) capyTrack('push_card_visto', {});

        let respondeu = false;
        const fechar = (resposta) => {
            if (respondeu) return;
            respondeu = true;
            clearTimeout(t);
            this._registrar(resposta);
            card.remove();
        };
        // Some sozinho: sem isto, sair da página não gravaria resposta nenhuma
        // e o card reapareceria na próxima — irritante do outro lado.
        const t = setTimeout(() => fechar('ignorou'), 12000);
        window.addEventListener('pagehide', () => fechar('ignorou'), { once: true });

        card.querySelector('#capy-push-yes').onclick = async () => {
            clearTimeout(t);
            respondeu = true;
            card.remove();
            const perm = await Notification.requestPermission();
            this._registrar(perm === 'granted' ? 'sim' : 'negou');
            if (perm === 'granted') {
                await CapyPWA.subscribePush();
                this.aviso('Pronto! A Yara te lembra às 19h 🐾');
            }
        };
        card.querySelector('#capy-push-no').onclick = () => fechar('adiou');
        card.querySelector('#capy-push-never').onclick = () => fechar('nunca');
    },

    // ── iPhone ────────────────────────────────────────────────────────────
    // Sem o app instalado na tela de início, o iOS não entrega push nenhum.
    // Não adianta pedir permissão — nem existe API. O que dá para fazer é
    // ensinar a instalar; depois disso o caminho normal funciona.
    dicaIOS() {
        const d = this._ler(this.K_IOS);
        if ((d.n || 0) >= 3) return;
        if (d.ultimoEm && Date.now() - d.ultimoEm < 10 * 864e5) return;
        if (document.getElementById('capy-ios-dica')) return;

        const ipad = navigator.maxTouchPoints > 1 && !/iPhone/.test(navigator.userAgent);
        const onde = ipad ? 'no canto superior direito' : 'na barra de baixo';
        const el = document.createElement('div');
        el.id = 'capy-ios-dica';
        el.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:80;width:min(92vw,380px);';
        el.innerHTML = `
          <div style="background:linear-gradient(135deg,#001f3f,#1e1b4b);border:1px solid rgba(46,196,182,.4);border-radius:20px;padding:16px;box-shadow:0 16px 48px rgba(0,0,0,.45);font-family:inherit">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
              <img src="/icon-192.png" alt="" style="width:40px;height:40px;border-radius:50%;border:2px solid rgba(46,196,182,.5)"/>
              <div style="flex:1;color:#fff;font-weight:900;font-size:13px;line-height:1.3">Instale o Capy na tela de início para a Yara te lembrar 🐾</div>
              <button id="capy-ios-x" aria-label="Fechar" style="background:none;color:rgba(255,255,255,.4);border:0;font-size:18px;cursor:pointer;line-height:1;padding:0 4px">&times;</button>
            </div>
            <div style="color:rgba(255,255,255,.7);font-size:12px;line-height:1.5">
              1. Toque em <b style="color:#2EC4B6">Compartilhar</b> ${onde}<br>
              2. Escolha <b style="color:#2EC4B6">Adicionar à Tela de Início</b><br>
              3. Abra o Capy por lá — aí sim dá para ligar os lembretes
            </div>
          </div>`;
        document.body.appendChild(el);
        d.n = (d.n || 0) + 1; d.ultimoEm = Date.now();
        this._gravar(this.K_IOS, d);
        if (window.capyTrack) capyTrack('ios_dica_vista', { n: d.n });
        const sair = () => el.remove();
        el.querySelector('#capy-ios-x').onclick = sair;
        setTimeout(sair, 20000);
    },

    aviso(texto) {
        const el = document.createElement('div');
        el.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:81;background:#10b981;color:#fff;font-weight:900;font-size:13px;padding:12px 20px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.4);font-family:inherit';
        el.textContent = texto;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    },

    // Desligar de verdade. Antes não havia caminho nenhum: nem unsubscribe(),
    // nem lugar na interface. Quem aceitasse ficava preso ao bloqueio do
    // navegador como única saída.
    async desligar() {
        try {
            const sub = await this.subDoNavegador();
            if (sub) await sub.unsubscribe();
            if (typeof Store !== 'undefined') {
                Store.state.pushSub = null;
                Store.state.pushOptOut = true;   // intenção explícita, sobrevive ao reconciliar
                Store.save();
            }
            try { localStorage.removeItem(this.K_CONFIRMADO); } catch (e) {}
            return true;
        } catch (e) { return false; }
    },

    async ligar() {
        try {
            if (typeof Store !== 'undefined' && Store.state.pushOptOut) {
                Store.state.pushOptOut = false;
                Store.save();
            }
            if (!('Notification' in window)) return 'nao_suportado';
            if (Notification.permission === 'denied') return 'negado';
            const perm = Notification.permission === 'granted'
                ? 'granted' : await Notification.requestPermission();
            if (perm !== 'granted') return 'negado';
            await CapyPWA.subscribePush();
            return 'ligado';
        } catch (e) { return 'erro'; }
    },
};

// ── CapyMic: gravação de voz + transcrição via Whisper (compartilhado) ──────
// Usado no Speak step da trilha (lessons.html), no "Falar resposta" das aulas
// de curso e na pronúncia do self-study.js. (O ai_chat.html tem gravador próprio.)
window.CapyMic = {
    MAX_MS: 15000, // sobra para frase curta; no "Falar resposta" das aulas, um 2º toque acrescenta à resposta
    _rec: null,    // gravação atual: { stream, recorder, chunks, timer, stopped, claimed }

    // Pede permissão e começa a gravar. onError recebe 'not_supported' | 'permission_denied'.
    // onAutoStop() é chamado se a trava de MAX_MS parar o gravador antes do chamador:
    // o áudio fica guardado, e o chamador pega o texto chamando stopAndTranscribe()
    // (o mesmo caminho do toque em "parar"). Quem não passa onAutoStop recebe o
    // áudio guardado no próximo stopAndTranscribe().
    async start({ onError, onAutoStop } = {}) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
            onError && onError('not_supported');
            return false;
        }
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            onError && onError('permission_denied');
            return false;
        }
        this.cancel(); // gravação anterior esquecida aberta: solta o mic dela
        const mimeType = ['audio/webm', 'audio/mp4', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported(t)) || '';
        const rec = {
            stream, recorder: new MediaRecorder(stream, mimeType ? { mimeType } : undefined),
            chunks: [], timer: 0, stopped: null, claimed: false,
        };
        rec.recorder.ondataavailable = e => { if (e.data && e.data.size) rec.chunks.push(e.data); };
        rec.recorder.start();
        this._rec = rec;
        // Trava de segurança: ninguém fica com o mic aberto pra sempre. Ela só PARA
        // o gravador. Antes ela chamava stopAndTranscribe() sozinha e jogava o
        // texto fora: quem falava mais de 15s pagava a transcrição, perdia a fala
        // e, ao tocar em "parar", recebia { empty:true } — "Não ouvi nada".
        rec.timer = setTimeout(() => {
            this._stop(rec).then(() => { if (!rec.claimed && onAutoStop) onAutoStop(); });
        }, this.MAX_MS);
        return true;
    },

    isRecording() { return !!(this._rec && this._rec.recorder.state === 'recording'); },

    // Para o gravador (uma vez só) e resolve quando o último pedaço de áudio chegou:
    // sem timeslice, o MediaRecorder entrega todo o áudio no dataavailable do stop.
    _stop(rec) {
        clearTimeout(rec.timer);
        if (!rec.stopped) {
            rec.stopped = new Promise(resolve => {
                rec.recorder.onstop = () => { rec.stream.getTracks().forEach(t => t.stop()); resolve(); };
            });
            if (rec.recorder.state !== 'inactive') rec.recorder.stop();
            else rec.recorder.onstop(); // parou sozinho (ex.: mic desconectado)
        }
        return rec.stopped;
    },

    // Para a gravação e devolve { text, empty, error }. Cada gravação é transcrita
    // (e cobrada) uma vez só: uma 2ª chamada devolve { empty:true }.
    async stopAndTranscribe({ lang } = {}) {
        const rec = this._rec;
        if (!rec) return { text: '', empty: true };
        rec.claimed = true;
        this._rec = null;
        await this._stop(rec);
        if (!rec.chunks.length) return { text: '', empty: true };
        const mimeType = rec.recorder.mimeType || 'audio/webm';
        const blob = new Blob(rec.chunks, { type: mimeType });
        try {
            const text = await this._sendToWhisper(blob, mimeType, lang);
            return { text, empty: false };
        } catch (e) {
            return { text: '', empty: false, error: e.message || 'Erro na transcrição.' };
        }
    },

    cancel() {
        const rec = this._rec;
        if (!rec) return;
        rec.claimed = true;
        this._rec = null;
        this._stop(rec);
    },

    async _sendToWhisper(blob, mimeType, lang) {
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result).split(',')[1] || '');
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        const r = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64: base64, mimeType, lang })
        });
        const data = await r.json();
        // O servidor manda {error:'rate_limited', message:'Limite diário...'} — o
        // CÓDIGO em `error`, o texto pra humano em `message`. Antes isto jogava
        // fora o `message` e usava `data.error` (o código cru) como mensagem —
        // quem batia no limite diário via "rate_limited" na tela em vez de
        // "Limite diário do plano grátis atingido".
        if (!r.ok || data.error) throw new Error(data.message || data.error || 'Erro na transcrição.');
        return data.text || '';
    }
};

// ── Juice: celebração visual de XP e conclusões ──────────────────────────────
window.CapyJuice = {
    _reduced: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    _lastConfetti: 0,

    init() {
        if (this._reduced) return;
        // Estilos (uma vez)
        const st = document.createElement('style');
        st.textContent = `
          @keyframes capyXpPop{0%{opacity:0;transform:translateY(6px) scale(.8)}20%{opacity:1;transform:translateY(0) scale(1.1)}80%{opacity:1;transform:translateY(-26px) scale(1)}100%{opacity:0;transform:translateY(-44px) scale(.9)}}
          .capy-xp-pop{position:fixed;top:64px;right:24px;z-index:95;background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;font-weight:900;font-size:14px;padding:6px 14px;border-radius:999px;box-shadow:0 8px 24px rgba(236,72,153,.35);pointer-events:none;animation:capyXpPop 1.4s ease forwards;font-family:'Plus Jakarta Sans',sans-serif}
          @keyframes capyConfettiFall{0%{transform:translateY(-10vh) rotate(0deg)}100%{transform:translateY(110vh) rotate(var(--rz,720deg))}}
          .capy-confetti{position:fixed;top:0;width:10px;height:14px;border-radius:2px;pointer-events:none;animation:capyConfettiFall var(--dur,2.2s) ease-in var(--delay,0s) forwards;z-index:94}
        `;
        document.head.appendChild(st);

        // XP pop: envolve Store.addXP mantendo o comportamento original
        if (typeof Store !== 'undefined' && typeof Store.addXP === 'function' && !Store.__capyJuiced) {
            const orig = Store.addXP.bind(Store);
            Store.addXP = (amount) => { const r = orig(amount); if (amount > 0) this.xpPop(amount); return r; };
            Store.__capyJuiced = true;
        }

        // Confete automático quando um overlay de conclusão aparece
        ['result-overlay', 'guided-complete-overlay'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            new MutationObserver(() => {
                if (!el.classList.contains('hidden')) this.celebrate();
            }).observe(el, { attributes: true, attributeFilter: ['class'] });
        });
    },

    xpPop(amount) {
        if (this._reduced) return;
        const el = document.createElement('div');
        el.className = 'capy-xp-pop';
        el.textContent = `+${amount} XP ⭐`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    },

    celebrate() {
        if (this._reduced) return;
        const now = Date.now();
        if (now - this._lastConfetti < 3000) return; // 1 festa por overlay
        this._lastConfetti = now;
        const colors = ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#f472b6'];
        for (let i = 0; i < 34; i++) {
            const p = document.createElement('div');
            p.className = 'capy-confetti';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.background = colors[i % colors.length];
            p.style.setProperty('--dur', (1.8 + Math.random() * 1.4) + 's');
            p.style.setProperty('--delay', (Math.random() * 0.5) + 's');
            p.style.setProperty('--rz', (360 + Math.random() * 720) + 'deg');
            if (Math.random() > 0.5) p.style.borderRadius = '50%';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4200);
        }
    }
};

// ── CapySound: bipes de feedback (Web Audio, sem arquivo externo) ────────────
window.CapySound = {
    _ctx: null,
    _enabled: true,

    _getCtx() {
        if (this._ctx) return this._ctx;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this._ctx = new AC();
        return this._ctx;
    },

    _tone(freq, start, dur, type, gainPeak) {
        const ctx = this._getCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        const t0 = ctx.currentTime + start;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
    },

    correct() {
        if (!this._enabled) return;
        try {
            this._tone(880, 0, 0.12, 'sine', 0.18);
            this._tone(1318.5, 0.09, 0.16, 'sine', 0.16);
        } catch (e) {}
    },

    wrong() {
        if (!this._enabled) return;
        try {
            this._tone(220, 0, 0.18, 'sawtooth', 0.1);
        } catch (e) {}
    },

    fanfare() {
        if (!this._enabled) return;
        try {
            this._tone(523.25, 0,    0.16, 'sine', 0.18); // C5
            this._tone(659.25, 0.12, 0.16, 'sine', 0.18); // E5
            this._tone(783.99, 0.24, 0.28, 'sine', 0.2);  // G5
        } catch (e) {}
    },

    setEnabled(v) { this._enabled = !!v; }
};

// ── CapyTTS: shared OpenAI voice helper (Nova/gpt-4o-mini-tts) ─────────────
// speak(text, lang) — lang: 'en-US' | 'fr-FR' | 'pt-BR' (also accepts 'en'/'fr'/'pt')
// Caches audio via Cache API (capy-tts-v1). Falls back to speechSynthesis on
// fetch failure/rate limit/offline so the student is never left without audio.
window.CapyTTS = {
    _currentAudio: null,
    _cacheName: 'capy-tts-v1',

    // One-time cleanup: purge only French-cached audio clips from every
    // student's browser so everyone regenerates fresh French audio on next
    // play. Runs once per browser via a localStorage flag.
    async _purgeOldFrenchAudioOnce() {
        const flag = 'capyTtsFrPurged_v1';
        try {
            if (localStorage.getItem(flag)) return;
            if (window.caches) {
                const cache = await caches.open(this._cacheName);
                const keys = await cache.keys();
                for (const req of keys) {
                    if (req.url.includes('/__capy-tts-cache/fr/')) {
                        await cache.delete(req);
                    }
                }
            }
            localStorage.setItem(flag, '1');
        } catch (e) {}
    },

    _stop() {
        if (this._currentAudio) {
            try { this._currentAudio.pause(); this._currentAudio.src = ''; } catch (e) {}
            this._currentAudio = null;
        }
        try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    },

    _mapLang(lang) {
        const l = String(lang || 'en-US').toLowerCase();
        if (l.startsWith('fr')) return { bcp47: 'fr-FR', apiLang: 'fr' };
        if (l.startsWith('tr')) return { bcp47: 'tr-TR', apiLang: 'tr' };
        if (l.startsWith('pt')) return { bcp47: 'pt-BR', apiLang: 'pt' };
        return { bcp47: 'en-US', apiLang: 'en' };
    },

    _fallbackSpeak(text, bcp47) {
        try {
            if (!window.speechSynthesis) return;
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = bcp47; u.rate = 0.85;
            speechSynthesis.speak(u);
        } catch (e) {}
    },

    async speak(text, lang) {
        if (!text || !String(text).trim()) return;
        const clean = String(text).replace(/<[^>]+>/g, '').trim().slice(0, 300);
        if (!clean) return;
        this._stop();

        const { bcp47, apiLang } = this._mapLang(lang);
        const cacheKey = `/__capy-tts-cache/${apiLang}/${encodeURIComponent(clean.toLowerCase())}`;

        try {
            let blob = null;
            if (window.caches) {
                try {
                    const cache = await caches.open(this._cacheName);
                    const hit = await cache.match(cacheKey);
                    if (hit) blob = await hit.blob();
                    if (!blob) {
                        const url = '/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova&lang=' + apiLang;
                        const resp = await fetch(url);
                        if (!resp.ok) throw new Error('tts_http_' + resp.status);
                        blob = await resp.blob();
                        if (blob && blob.size > 500) {
                            try { await cache.put(cacheKey, new Response(blob.slice(0), { headers: { 'Content-Type': 'audio/mpeg' } })); } catch (e) {}
                        }
                    }
                } catch (e) {
                    const url = '/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova&lang=' + apiLang;
                    const resp = await fetch(url);
                    if (!resp.ok) throw new Error('tts_http_' + resp.status);
                    blob = await resp.blob();
                }
            } else {
                const url = '/api/tts?text=' + encodeURIComponent(clean) + '&voice=nova&lang=' + apiLang;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error('tts_http_' + resp.status);
                blob = await resp.blob();
            }

            const objUrl = URL.createObjectURL(blob);
            const audio = new Audio(objUrl);
            this._currentAudio = audio;
            audio.onended = () => { URL.revokeObjectURL(objUrl); if (this._currentAudio === audio) this._currentAudio = null; };
            audio.onerror = () => { URL.revokeObjectURL(objUrl); if (this._currentAudio === audio) this._currentAudio = null; this._fallbackSpeak(clean, bcp47); };
            await audio.play();
        } catch (e) {
            this._fallbackSpeak(clean, bcp47);
        }
    }
};

// ── CapyTranslate: shared click-to-translate word component ────────────────
// Extracted from the newsline.html / historyline.html inline implementations
// (renderClickable / onWordClick / tokenize + nl-tooltip + capyNewsTrans_
// cache pattern) so any page can reuse the same "Language Reactor" style
// click-a-word translation without duplicating the logic.
//
// Usage: CapyTranslate.enable(elementOrSelector)
// Turns every word inside the given element into a clickable span. Clicking
// a word fetches (and caches) a PT-BR translation and shows it in a shared
// tooltip. Safe to call more than once on the same element (idempotent) and
// never throws — network/parse failures degrade to a short error message.
window.CapyTranslate = (function () {
    const CACHE_KEY    = 'capyTransCache';
    const CACHE_LIMIT  = 500;
    const TARGET_LANG  = 'Portuguese (Brazil)';
    const STYLE_ID     = 'capy-translate-styles';
    const TOOLTIP_ID   = 'capy-translate-tooltip';

    function escapeHtml(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Tokenize text into words + non-word chunks, preserving punctuation/spacing.
    function tokenize(text) {
        try {
            return String(text || '').match(/[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*|[^\p{L}\p{M}]+/gu) || [];
        } catch (e) {
            return [String(text || '')];
        }
    }

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.capy-t-word{cursor:pointer;border-radius:5px;transition:background .12s}
.capy-t-word:hover{background:#fce7f3}
.capy-t-word.capy-t-learned{text-decoration:underline;text-decoration-color:#f9a8d4;text-decoration-style:dotted;text-underline-offset:2px}
#${TOOLTIP_ID}{display:none;font-family:'Plus Jakarta Sans',sans-serif;line-height:1.35}
`;
        document.head.appendChild(style);
    }

    function ensureTooltip() {
        let tip = document.getElementById(TOOLTIP_ID);
        if (tip) return tip;
        tip = document.createElement('div');
        tip.id = TOOLTIP_ID;
        tip.className = 'fixed z-[999] bg-navy text-white text-xs font-bold rounded-2xl px-4 py-3 shadow-2xl max-w-[240px]';
        document.body.appendChild(tip);

        // Close on outside click / tap, or Esc — shared across every enabled element.
        document.addEventListener('click', e => {
            if (!e.target.closest('.capy-t-word') && !e.target.closest('#' + TOOLTIP_ID)) {
                tip.style.display = 'none';
            }
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') tip.style.display = 'none';
        });
        return tip;
    }

    function positionTooltip(tip, span) {
        try {
            const rect = span.getBoundingClientRect();
            tip.style.display = 'block';
            const left = Math.max(8, Math.min(window.innerWidth - 248, rect.left));
            const top  = Math.max(8, rect.top - 8 - tip.offsetHeight);
            tip.style.left = left + 'px';
            tip.style.top  = (top > 0 ? top : rect.bottom + 8) + 'px';
        } catch (e) {}
    }

    // ── Translation cache (localStorage, FIFO cap) ──────────────────────────
    function getCacheObj() {
        try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{"order":[],"map":{}}'); }
        catch (e) { return { order: [], map: {} }; }
    }
    function getCachedTranslation(word) {
        try { return getCacheObj().map[word]; } catch (e) { return undefined; }
    }
    function setCachedTranslation(word, translation) {
        try {
            const c = getCacheObj();
            if (!(word in c.map)) {
                c.order.push(word);
                if (c.order.length > CACHE_LIMIT) { const old = c.order.shift(); delete c.map[old]; }
            }
            c.map[word] = translation;
            localStorage.setItem(CACHE_KEY, JSON.stringify(c));
        } catch (e) {}
    }

    async function onWordClick(span) {
        try {
            const word    = span.dataset.word || '';
            const context = span.dataset.context || '';
            const tip = ensureTooltip();
            tip.innerHTML = '<span class="opacity-70">…</span>';
            positionTooltip(tip, span);

            const cached = getCachedTranslation(word);
            if (cached) {
                tip.innerHTML = `<p class="text-sm">${escapeHtml(word)}</p><p class="text-pink-300">${escapeHtml(cached)}</p>`;
                positionTooltip(tip, span);
                span.classList.add('capy-t-learned');
                return;
            }

            try {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ word, targetLang: TARGET_LANG, context })
                });
                const data = await res.json();
                const raw   = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                const clean = String(raw).replace(/```json/gi, '').replace(/```/g, '').trim();
                const obj = JSON.parse(clean);
                const translation = obj.translation || '—';
                setCachedTranslation(word, translation);
                tip.innerHTML = `<p class="text-sm">${escapeHtml(word)}</p><p class="text-pink-300">${escapeHtml(translation)}</p>`;
                positionTooltip(tip, span);
                span.classList.add('capy-t-learned');
            } catch (e) {
                tip.innerHTML = '<span>⚠️ Tradução indisponível</span>';
                positionTooltip(tip, span);
            }
        } catch (e) {
            // Word-click must never break the host page.
        }
    }

    function renderClickable(text) {
        const tokens = tokenize(text);
        const ctx = String(text || '').slice(0, 300).replace(/"/g, '&quot;');
        return tokens.map(tok => {
            try {
                if (/\p{L}/u.test(tok)) {
                    const w = tok.toLowerCase();
                    return `<span class="capy-t-word" data-word="${escapeHtml(w)}" data-context="${escapeHtml(ctx)}">${escapeHtml(tok)}</span>`;
                }
            } catch (e) {}
            return escapeHtml(tok);
        }).join('');
    }

    // Turn every word inside `target` (an Element or a CSS selector) into a
    // clickable, translatable span. Idempotent: calling twice on the same
    // element is a no-op the second time.
    function enable(target) {
        try {
            const el = (typeof target === 'string') ? document.querySelector(target) : target;
            if (!el || !el.nodeType) return;
            if (el.dataset && el.dataset.capyTranslateEnabled === '1') return;

            ensureStyles();
            ensureTooltip();

            const text = el.textContent;
            if (!text || !text.trim()) return;
            el.innerHTML = renderClickable(text);
            if (el.dataset) el.dataset.capyTranslateEnabled = '1';

            el.querySelectorAll('.capy-t-word').forEach(span => {
                span.addEventListener('click', e => { e.stopPropagation(); onWordClick(span); });
            });
        } catch (e) {
            // Never let the translate component break the page it's mounted on.
        }
    }

    return { enable };
})();


// ── CapyFala: comparação de fala tolerante a número escrito x falado ───────
// POR QUÊ: o Whisper transcreve número como ALGARISMO ("j'ai 25 ans"), mas a
// frase-alvo da aula está por extenso ("J'ai vingt-cinq ans"). Comparando o
// texto cru, o aluno pronuncia certo e o site diz que errou. Aqui os dois
// lados viram a mesma coisa antes de comparar: acento fora, apóstrofo fora,
// pontuação fora e todo número por extenso convertido para algarismo.
window.CapyFala = (function () {
    // 0-19, dezenas, e os multiplicadores. O francês 70/80/90 (soixante-dix,
    // quatre-vingts, quatre-vingt-dix) sai da regra de multiplicação abaixo.
    const BASE = {
        en: {
            zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
            nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
            sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
            forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
            hundred: 100, thousand: 1000,
        },
        fr: {
            zero: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7,
            huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14,
            quinze: 15, seize: 16, vingt: 20, vingts: 20, trente: 30, quarante: 40,
            cinquante: 50, soixante: 60, cent: 100, cents: 100, mille: 1000, milles: 1000,
        },
        tr: {
            sifir: 0, bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8,
            dokuz: 9, on: 10, yirmi: 20, otuz: 30, kirk: 40, elli: 50, altmis: 60,
            yetmis: 70, seksen: 80, doksan: 90, yuz: 100, bin: 1000,
        },
    };
    // Palavras que ligam número sem valor próprio: "vingt ET un", "one hundred AND five"
    const LIGACAO = { et: 1, and: 1, e: 1 };
    // O Whisper alterna entre "I'm" e "I am" na mesma frase; para uma atividade
    // de fala as duas formas são a mesma coisa dita. Expandimos antes de tirar
    // o apóstrofo, senão "im" e "i am" viram palavras diferentes na contagem.
    const CONTRACOES_EN = [
        [/\bi'm\b/g, 'i am'], [/\b(he|she|it|that|there|what|who|here)'s\b/g, '$1 is'],
        [/\b(you|we|they)'re\b/g, '$1 are'], [/\b(i|you|he|she|it|we|they)'ve\b/g, '$1 have'],
        [/\b(i|you|he|she|it|we|they)'ll\b/g, '$1 will'], [/\b(i|you|he|she|it|we|they)'d\b/g, '$1 would'],
        [/\bcan't\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\bshan't\b/g, 'shall not'],
        [/\b(\w+)n't\b/g, '$1 not'], [/\blet's\b/g, 'let us'],
    ];

    // Letras que o NFD NÃO decompõe, porque não são "letra + acento" e sim
    // letra própria do alfabeto. Sem isso o ı do turco (yaşındayım) e o œ do
    // francês (sœur) somem na limpeza e partem a palavra ao meio.
    const LETRAS_SOLTAS = [
        [/[\u0131\u0130]/g, 'i'], [/\u00f8/g, 'o'], [/\u00df/g, 'ss'], [/\u00e6/g, 'ae'],
        [/\u0153/g, 'oe'], [/\u0142/g, 'l'], [/[\u0111\u00f0]/g, 'd'], [/\u00fe/g, 'th'],
    ];

    function semAcento(s) {
        let t = String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        for (const [re, sub] of LETRAS_SOLTAS) t = t.replace(re, sub);
        return t;
    }

    function idioma(lang) {
        const l = semAcento(String(lang || 'en')).toLowerCase();
        if (l.startsWith('fr')) return 'fr';
        if (l.startsWith('tr')) return 'tr';
        return 'en';
    }

    // Soma um trecho de palavras-número. Cobre "twenty five" (25),
    // "soixante dix" (70), "quatre vingt dix sept" (97) e "deux cent vingt" (220).
    function valorDoTrecho(tokens, mapa) {
        let total = 0, atual = 0;
        for (const t of tokens) {
            if (LIGACAO[t]) continue;
            const v = mapa[t];
            if (v === undefined) continue;
            if (v === 1000) { total += (atual || 1) * 1000; atual = 0; }
            else if (v === 100) { atual = (atual || 1) * 100; }
            // "quatre vingts" = 4x20: vinte precedido de unidade vira multiplicador
            else if (v === 20 && atual > 1 && atual < 10) { atual = atual * 20; }
            else { atual += v; }
        }
        return total + atual;
    }

    // Troca todo número por extenso pelo algarismo correspondente.
    function numerosEmAlgarismo(texto, lang) {
        const mapa = BASE[idioma(lang)];
        const tokens = String(texto || '').split(' ');
        const saida = [];
        let trecho = [];
        const fechar = () => {
            if (!trecho.length) return;
            // uma ligação sozinha ("and", "et") não é número: devolve como texto
            const temNumero = trecho.some(t => mapa[t] !== undefined);
            if (temNumero) saida.push(String(valorDoTrecho(trecho, mapa)));
            else saida.push(...trecho);
            trecho = [];
        };
        for (const t of tokens) {
            if (!t) continue;
            if (mapa[t] !== undefined || (LIGACAO[t] && trecho.length)) trecho.push(t);
            else { fechar(); saida.push(t); }
        }
        fechar();
        return saida.join(' ');
    }

    // Deixa os dois lados no mesmo formato antes de qualquer comparação.
    // Apóstrofo some de vez: "j'ai" e "jai" viram a mesma coisa, e numa
    // atividade de PRONÚNCIA isso nunca deveria contar como erro.
    function normalizar(texto, lang) {
        let t = semAcento(String(texto || '')).toLowerCase();
        t = t.replace(/[\u2018\u2019\u02bc]/g, "'").replace(/[\u201c\u201d]/g, '"');
        // Contração vira forma longa ANTES de o apóstrofo sumir.
        if (idioma(lang) === 'en') {
            for (const [re, sub] of CONTRACOES_EN) t = t.replace(re, sub);
        }
        t = t.replace(/[-\u2010-\u2015_/]/g, ' ');           // hífen junta número composto
        t = t.replace(/[^a-z0-9 ]/g, ' ');                    // tira pontuação e apóstrofo
        t = t.replace(/\s+/g, ' ').trim();
        return numerosEmAlgarismo(t, lang);
    }

    function palavras(texto, lang) {
        return normalizar(texto, lang).split(' ').filter(Boolean);
    }

    function distancia(a, b) {
        const m = a.length, n = b.length;
        if (!m) return n;
        if (!n) return m;
        let ant = Array.from({ length: n + 1 }, (_, j) => j);
        for (let i = 1; i <= m; i++) {
            const cur = [i];
            for (let j = 1; j <= n; j++) {
                cur[j] = a[i - 1] === b[j - 1] ? ant[j - 1]
                    : 1 + Math.min(ant[j], cur[j - 1], ant[j - 1]);
            }
            ant = cur;
        }
        return ant[n];
    }

    // Duas palavras contam como a mesma fala? Número tem que bater exato — é
    // sempre ele o conteúdo do exercício. Palavra comprida aceita um caractere
    // de diferença, que é o erro típico de transcrição.
    function mesmaPalavra(a, b) {
        if (a === b) return true;
        if (/\d/.test(a) || /\d/.test(b)) return false;
        return a.length >= 5 && b.length >= 5 && distancia(a, b) <= 1;
    }

    // Quanto da frase-alvo o aluno realmente disse, de 0 a 100. Palavra falada
    // a mais não penaliza: o que conta é ter dito tudo o que era pra dizer.
    function acerto(alvo, dito, lang) {
        const pAlvo = palavras(alvo, lang);
        const pDito = palavras(dito, lang);
        if (!pAlvo.length) return { pct: 0, faltando: [] };
        const restante = pDito.slice();
        const faltando = [];
        for (const p of pAlvo) {
            const i = restante.findIndex(q => q !== null && mesmaPalavra(p, q));
            if (i >= 0) restante[i] = null;
            else faltando.push(p);
        }
        return { pct: Math.round((pAlvo.length - faltando.length) / pAlvo.length * 100), faltando };
    }

    // Aprovado quando o aluno disse pelo menos 80% das palavras do alvo.
    // Nada de régua por letra aqui: em frase curta ela aprova o número errado.
    function passou(alvo, dito, lang) {
        if (!normalizar(alvo, lang)) return false;
        return acerto(alvo, dito, lang).pct >= 80;
    }

    return { normalizar, palavras, acerto, passou, distancia, numerosEmAlgarismo };
})();

// Auto-inject personalized tab on aula pages (runs after all inline scripts)
document.addEventListener('DOMContentLoaded', () => {
    Components.autoInjectPersonalizedTab();
    Components.autoInjectWritingCoach();
    CapyPWA.init();
    CapyJuice.init();
    if (window.CapyTTS) CapyTTS._purgeOldFrenchAudioOnce();

    // Conserto silencioso da inscrição de push. Fica no idle porque não tem
    // pressa nenhuma e não pode competir com o primeiro render.
    const reparar = () => CapyPush.reconciliar();
    if (window.requestIdleCallback) requestIdleCallback(reparar, { timeout: 5000 });
    else setTimeout(reparar, 3000);

    // ── Momentos de vitória ────────────────────────────────────────────────
    // Antes existiam DOIS pedidos no site inteiro, e o mais forte de todos —
    // terminar uma aula — não era um deles. Estes cinco saem de graça: o
    // store.js já dispara os eventos, só ninguém escutava.
    let pediuNestaSessao = false;
    const pedir = (motivo) => {
        if (pediuNestaSessao) return;
        pediuNestaSessao = true;
        setTimeout(() => CapyPush.momento(motivo), 1200);   // deixa a celebração passar
    };
    document.addEventListener('lessonComplete', () => pedir('Aula concluída! 🎉'));
    document.addEventListener('streakMilestone', e => pedir(`${(e.detail && e.detail.days) || ''} dias seguidos! 🔥`.trim()));
    document.addEventListener('levelUp', e => pedir(`Nível ${(e.detail && e.detail.level) || ''}! 🚀`.trim()));
    document.addEventListener('badgeUnlocked', () => pedir('Nova conquista! 🏅'));
    document.addEventListener('questCompleted', () => pedir('Missão do dia feita! 🎯'));

    // O antigo pedido ao abrir um hub continua, mas rebaixado: só entra se
    // nenhum momento de vitória tiver pedido nesta sessão. Ele é o mais fraco
    // dos sete — ninguém acabou de conquistar nada ao abrir uma página.
    setTimeout(() => {
        try {
            if (pediuNestaSessao) return;
            const engaged = typeof Store !== 'undefined' && (Store.state.xp > 50 || Store.state.streakDays > 0);
            const isHub = /(Home_Forest|classes|learn)/i.test(location.pathname);
            if (engaged && isHub) { pediuNestaSessao = true; CapyPush.momento('Sua streak merece proteção! 🔥'); }
        } catch (e) {}
    }, 4000);
});
