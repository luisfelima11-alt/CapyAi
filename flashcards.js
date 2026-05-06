// ── Deck definitions ─────────────────────────────────────────────────────────
const DECKS = {
    forest: {
        id: 'forest',
        label: 'Forest Friends',
        emoji: '🌿',
        badgeId: 'explorer',
        cards: [
            { word:'Apple',    pronunciation:'/ˈæp.əl/',    icon:'eco',           image:'', aiEmoji:'🍎' },
            { word:'River',    pronunciation:'/ˈrɪv.ər/',   icon:'water',         image:'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Sun',      pronunciation:'/sʌn/',        icon:'light_mode',    image:'https://images.unsplash.com/photo-1533316238634-118805fdbac9?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Mountain', pronunciation:'/ˈmaʊn.tən/', icon:'landscape',     image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Bird',     pronunciation:'/bɜːrd/',      icon:'flutter_dash',  image:'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Tree',     pronunciation:'/triː/',        icon:'forest',        image:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Water',    pronunciation:'/ˈwɔː.tər/',  icon:'water_drop',    image:'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Flower',   pronunciation:'/ˈflaʊ.ər/',  icon:'local_florist', image:'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Star',     pronunciation:'/stɑːr/',      icon:'star',          image:'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Rain',     pronunciation:'/reɪn/',        icon:'rainy',         image:'https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    },
    animals: {
        id: 'animals',
        label: 'Animal Kingdom',
        emoji: '🐾',
        badgeId: 'explorer',
        cards: [
            { word:'Dog',     pronunciation:'/dɒɡ/',        icon:'pets',          image:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Cat',     pronunciation:'/kæt/',        icon:'cruelty_free',  image:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Fish',    pronunciation:'/fɪʃ/',        icon:'set_meal',      image:'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Bear',    pronunciation:'/beər/',       icon:'forest',        image:'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Fox',     pronunciation:'/fɒks/',       icon:'eco',           image:'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Rabbit',  pronunciation:'/ˈræb.ɪt/',   icon:'cruelty_free',  image:'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Owl',     pronunciation:'/aʊl/',        icon:'flutter_dash',  image:'https://images.unsplash.com/photo-1579551053957-09d648e70e3b?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Turtle',  pronunciation:'/ˈtɜː.tl̩/',   icon:'water',         image:'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    },
    colors: {
        id: 'colors',
        label: 'Colour World',
        emoji: '🎨',
        badgeId: 'explorer',
        cards: [
            { word:'Red',    pronunciation:'/red/',          icon:'palette', color:'#ef4444', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Blue',   pronunciation:'/bluː/',         icon:'palette', color:'#3b82f6', image:'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Green',  pronunciation:'/ɡriːn/',        icon:'palette', color:'#22c55e', image:'https://images.unsplash.com/photo-1491466424936-e304919aada7?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Yellow', pronunciation:'/ˈjel.əʊ/',     icon:'palette', color:'#eab308', image:'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Pink',   pronunciation:'/pɪŋk/',         icon:'palette', color:'#ec4899', image:'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Purple', pronunciation:'/ˈpɜː.pl̩/',     icon:'palette', color:'#a855f7', image:'https://images.unsplash.com/photo-1550159930-40066082a4fc?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Orange', pronunciation:'/ˈɒr.ɪndʒ/',    icon:'palette', color:'#f97316', image:'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Brown',  pronunciation:'/braʊn/',        icon:'palette', color:'#92400e', image:'https://images.unsplash.com/photo-1559181567-c3190ca9d5db?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    },
    numbers: {
        id: 'numbers',
        label: 'Numbers 1–10',
        emoji: '🔢',
        badgeId: 'number_wizard',
        cards: [
            { word:'One',   pronunciation:'/wʌn/',   icon:'looks_one',  numeral:'1',  image:'https://images.unsplash.com/photo-1632933630253-1f1da3bb2168?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Two',   pronunciation:'/tuː/',   icon:'looks_two',  numeral:'2',  image:'https://images.unsplash.com/photo-1620411862-6a13012e2a7b?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Three', pronunciation:'/θriː/',  icon:'looks_3',    numeral:'3',  image:'https://images.unsplash.com/photo-1617440168937-c6497eaa8db5?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Four',  pronunciation:'/fɔːr/',  icon:'looks_4',    numeral:'4',  image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Five',  pronunciation:'/faɪv/',  icon:'looks_5',    numeral:'5',  image:'https://images.unsplash.com/photo-1558591710-4b4a1ae0f665?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Six',   pronunciation:'/sɪks/',  icon:'looks_6',    numeral:'6',  image:'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Seven', pronunciation:'/ˈsev.ən/', icon:'filter_7', numeral:'7',  image:'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Eight', pronunciation:'/eɪt/',   icon:'filter_8',   numeral:'8',  image:'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Nine',  pronunciation:'/naɪn/',  icon:'filter_9',   numeral:'9',  image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Ten',   pronunciation:'/ten/',   icon:'filter_9_plus', numeral:'10', image:'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    },
    food: {
        id: 'food',
        label: 'Yummy Food',
        emoji: '🍕',
        badgeId: 'food_explorer',
        cards: [
            { word:'Pizza',      pronunciation:'/ˈpiːt.sə/',    icon:'local_pizza',    image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Cake',       pronunciation:'/keɪk/',         icon:'cake',           image:'https://images.unsplash.com/photo-1558636508-e0969431e2c4?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Milk',       pronunciation:'/mɪlk/',         icon:'water_drop',     image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Bread',      pronunciation:'/bred/',          icon:'breakfast_dining',image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Egg',        pronunciation:'/eɡ/',            icon:'egg',            image:'https://images.unsplash.com/photo-1612257416648-11e5e5e5e5e5?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Rice',       pronunciation:'/raɪs/',          icon:'rice_bowl',      image:'https://images.unsplash.com/photo-1536304993881-ff86e8c6f9d3?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Soup',       pronunciation:'/suːp/',          icon:'soup_kitchen',   image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Cookie',     pronunciation:'/ˈkʊk.i/',       icon:'cookie',         image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Banana',     pronunciation:'/bəˈnɑː.nə/',    icon:'local_florist',  image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Juice',      pronunciation:'/dʒuːs/',         icon:'local_drink',    image:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    },
    body: {
        id: 'body',
        label: 'My Body',
        emoji: '🧍',
        badgeId: 'body_champ',
        cards: [
            { word:'Head',       pronunciation:'/hed/',           icon:'face',           image:'https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Eyes',       pronunciation:'/aɪz/',           icon:'visibility',     image:'https://images.unsplash.com/photo-1483095348487-53dbf97d8d5b?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Nose',       pronunciation:'/nəʊz/',          icon:'face_retouching_natural', image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Mouth',      pronunciation:'/maʊθ/',          icon:'sentiment_satisfied', image:'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Hand',       pronunciation:'/hænd/',          icon:'back_hand',      image:'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Foot',       pronunciation:'/fʊt/',           icon:'directions_walk',image:'https://images.unsplash.com/photo-1533000971552-6a962ff0b9f9?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Ear',        pronunciation:'/ɪər/',           icon:'hearing',        image:'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Hair',       pronunciation:'/heər/',          icon:'face_3',         image:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    },
    feelings: {
        id: 'feelings',
        label: 'How I Feel',
        emoji: '😊',
        badgeId: 'emotion_star',
        cards: [
            { word:'Happy',      pronunciation:'/ˈhæp.i/',       icon:'sentiment_very_satisfied', image:'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Sad',        pronunciation:'/sæd/',           icon:'sentiment_dissatisfied', image:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Angry',      pronunciation:'/ˈæŋ.ɡri/',      icon:'mood_bad',       image:'https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Scared',     pronunciation:'/skeərd/',        icon:'pan_tool',       image:'https://images.unsplash.com/photo-1520811350916-03bd1b04a7cb?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Excited',    pronunciation:'/ɪkˈsaɪ.tɪd/',  icon:'celebration',    image:'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Tired',      pronunciation:'/ˈtaɪərd/',      icon:'bedtime',        image:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Surprised',  pronunciation:'/səˈpraɪzd/',    icon:'back_hand',      image:'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=400&h=400' },
            { word:'Brave',      pronunciation:'/breɪv/',         icon:'shield',         image:'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&q=80&w=400&h=400' },
        ]
    }
};

// ── Web Speech ────────────────────────────────────────────────────────────────
function speakWord(word) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang  = 'en-US';
    utt.rate  = 0.85;
    utt.pitch = 1.1;
    window.speechSynthesis.speak(utt);
}

// ── Active deck state ─────────────────────────────────────────────────────────
let activeDeckId    = 'forest';
let currentCardIndex = 0;

function getActiveDeck() {
    return DECKS[activeDeckId];
}

// ── Switch deck ───────────────────────────────────────────────────────────────
function switchDeck(deckId) {
    activeDeckId     = deckId;
    currentCardIndex = 0;
    updateFlashcard();
    updateDeckPicker();
}

// ── Card display ──────────────────────────────────────────────────────────────
function updateFlashcard() {
    const deck = getActiveDeck();
    const card = deck.cards[currentCardIndex];

    const imgEl = document.getElementById('card-image');
    if (imgEl) {
        if (card.image) {
            imgEl.src = card.image;
            imgEl.style.display = '';
        } else {
            imgEl.src = '';
            imgEl.style.display = 'none';
        }
    }

    // Show ai emoji as large placeholder when no image
    const emojiPlaceholder = document.getElementById('card-emoji-placeholder');
    if (emojiPlaceholder) {
        emojiPlaceholder.textContent = card.aiEmoji || '';
        emojiPlaceholder.style.display = card.image ? 'none' : (card.aiEmoji ? '' : 'none');
    }

    document.getElementById('card-icon').innerText  = card.icon  || 'style';
    document.getElementById('card-word').innerText  = card.word;
    document.getElementById('card-pron').innerText  = card.pronunciation;

    // Deck label
    const deckLabelEl = document.getElementById('deck-label');
    if (deckLabelEl) deckLabelEl.textContent = deck.emoji + ' ' + deck.label;

    // Progress
    document.getElementById('progress-text').innerText =
        `${currentCardIndex + 1} / ${deck.cards.length} Cards`;
    const progressPercent = ((currentCardIndex + 1) / deck.cards.length) * 100;
    document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;

    // Reset flip
    const container = document.getElementById('card-container');
    if (container) container.classList.remove('flipped');
}

function nextCard() {
    const deck = getActiveDeck();
    if (currentCardIndex < deck.cards.length - 1) {
        currentCardIndex++;
        updateFlashcard();
    } else {
        finishDeck();
    }
}

function finishDeck() {
    const deck = getActiveDeck();
    if (window.Store) {
        Store.addXP(50);
        Store.activateStreak();
        Store.unlockBadge(deck.badgeId || 'explorer');
        Store.completeActivity('flashcards');
    }
    showDeckComplete();
}

function showDeckComplete() {
    const deck = getActiveDeck();
    const overlay = document.createElement('div');
    overlay.id = 'deck-complete-overlay';
    overlay.className = 'fixed inset-0 z-[9000] flex items-center justify-center bg-black/60 backdrop-blur-sm';
    overlay.innerHTML = `
        <div class="bg-gradient-to-br from-[#001f3f] to-slate-900 border-2 border-emerald-500/60
                    rounded-[3rem] px-12 py-12 flex flex-col items-center gap-6 shadow-2xl
                    text-center max-w-sm mx-4 scale-0 opacity-0 transition-all duration-500"
             id="deck-complete-card">
            <div class="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <span class="material-symbols-outlined text-white text-6xl"
                      style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
            <div>
                <p class="font-label text-emerald-400 font-bold text-sm uppercase tracking-widest mb-1">Deck Complete!</p>
                <h2 class="font-headline text-5xl font-black text-white mb-2">+50 XP</h2>
                <p class="font-body text-slate-300">${deck.emoji} <strong>${deck.label}</strong><br/>All ${deck.cards.length} words learned!</p>
            </div>
            <div class="flex gap-1 mt-1">
                <span class="material-symbols-outlined text-yellow-400 text-3xl" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="material-symbols-outlined text-yellow-400 text-3xl" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="material-symbols-outlined text-yellow-400 text-3xl" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
            <div class="flex gap-3 flex-wrap justify-center">
                <button onclick="document.getElementById('deck-complete-overlay').remove(); currentCardIndex=0; updateFlashcard();"
                        class="bg-white/10 hover:bg-white/20 text-white font-label font-bold
                               px-8 py-3 rounded-full border border-white/20 active:scale-95 transition-all">
                    Replay
                </button>
                <button onclick="launchAIQuiz()"
                        class="bg-pink-500 hover:bg-pink-600 text-white font-label font-bold
                               px-8 py-3 rounded-full active:scale-95 transition-all shadow-lg shadow-pink-500/30 flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1;">auto_awesome</span>
                    AI Quiz!
                </button>
                <button onclick="window.location.href='6_Home_Forest_Expedition.html'"
                        class="bg-emerald-500 hover:bg-emerald-600 text-white font-label font-bold
                               px-8 py-3 rounded-full active:scale-95 transition-all shadow-lg shadow-emerald-500/30">
                    Back to Forest 🌿
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const card = document.getElementById('deck-complete-card');
        card.style.transform = 'scale(1)';
        card.style.opacity   = '1';
    }));
}

// ── Launch AI Quiz ────────────────────────────────────────────────────────────
function launchAIQuiz() {
    const deck  = getActiveDeck();
    const words = deck.cards.map(c => c.word).join(',');
    const url   = `ai_quiz.html?deck=${deck.id}&label=${encodeURIComponent(deck.label)}&words=${encodeURIComponent(words)}`;
    window.location.href = url;
}

// ── Deck picker renderer ──────────────────────────────────────────────────────
function updateDeckPicker() {
    const picker = document.getElementById('deck-picker');
    if (!picker) return;
    picker.innerHTML = Object.values(DECKS).map(d => {
        const active = d.id === activeDeckId;
        return `<button onclick="switchDeck('${d.id}')"
                        class="flex items-center gap-2 px-5 py-3 rounded-full font-label font-bold text-sm
                               transition-all active:scale-95 whitespace-nowrap
                               ${active
                                   ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                                   : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'}">
                    <span>${d.emoji}</span>
                    <span>${d.label}</span>
                    ${active ? '<span class="material-symbols-outlined text-sm" style="font-variation-settings:\'FILL\' 1;">check_circle</span>' : ''}
                </button>`;
    }).join('');
}

// ── AI Topic Discovery ────────────────────────────────────────────────────────
const AI_TOPICS = [
    { id: 'weather',   label: 'Weather',   emoji: '⛅' },
    { id: 'transport', label: 'Transport', emoji: '🚗' },
    { id: 'space',     label: 'Space',     emoji: '🚀' },
    { id: 'clothes',   label: 'Clothes',   emoji: '👕' },
    { id: 'sports',    label: 'Sports',    emoji: '⚽' },
    { id: 'school',    label: 'School',    emoji: '🏫' },
    { id: 'kitchen',   label: 'Kitchen',   emoji: '🍳' },
    { id: 'garden',    label: 'Garden',    emoji: '🌻' },
    { id: 'ocean',     label: 'Ocean',     emoji: '🌊' },
    { id: 'music',     label: 'Music',     emoji: '🎵' },
];

let aiDeckLoading = false;

function renderAITopics() {
    const container = document.getElementById('ai-topics-row');
    if (!container) return;
    container.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-pink-400 text-lg" style="font-variation-settings:'FILL' 1;">auto_awesome</span>
            <span class="font-label font-bold text-pink-300 text-sm uppercase tracking-widest">AI Decks</span>
            <span class="text-white/40 text-xs font-body">— new words every day!</span>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-1 w-full" style="scrollbar-width:none;">
            ${AI_TOPICS.map(t => `
                <button id="ai-chip-${t.id}" onclick="loadAIDeck('${t.id}')"
                        class="flex items-center gap-2 px-5 py-3 rounded-full font-label font-bold text-sm
                               bg-white/10 text-white/70 hover:bg-pink-500/30 hover:text-pink-200
                               border border-white/20 hover:border-pink-400/50
                               transition-all active:scale-95 whitespace-nowrap">
                    <span>${t.emoji}</span>
                    <span>${t.label}</span>
                </button>`).join('')}
        </div>
        <div id="ai-deck-status" class="text-xs text-white/40 font-body mt-1 h-4"></div>
    `;
}

async function loadAIDeck(topicId) {
    if (aiDeckLoading) return;
    const topic = AI_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    const today    = new Date().toISOString().slice(0, 10);
    const cacheKey = `capyAIDeck_${topicId}_${today}`;
    const statusEl = document.getElementById('ai-deck-status');

    // Highlight the active chip
    AI_TOPICS.forEach(t => {
        const chip = document.getElementById(`ai-chip-${t.id}`);
        if (chip) chip.className = chip.className
            .replace('bg-pink-500 text-white shadow-lg shadow-pink-500/30', '')
            .replace('bg-white/10 text-white/70', 'bg-white/10 text-white/70');
    });
    const activeChip = document.getElementById(`ai-chip-${topicId}`);
    if (activeChip) {
        activeChip.className = activeChip.className
            .replace('bg-white/10 text-white/70', 'bg-pink-500 text-white shadow-lg shadow-pink-500/30');
    }

    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        applyAIDeck(topic, JSON.parse(cached));
        if (statusEl) statusEl.textContent = `${topic.emoji} ${topic.label} deck loaded!`;
        return;
    }

    // Fetch from server
    aiDeckLoading = true;
    if (statusEl) statusEl.textContent = `✨ Generating ${topic.label} deck…`;

    try {
        const res  = await fetch('/api/flashcard-deck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic.label })
        });
        const json = await res.json();

        if (json?.error) {
            if (statusEl) statusEl.textContent = `⚠️ Could not load — try again!`;
            aiDeckLoading = false;
            return;
        }

        const raw   = json?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const clean = raw.replace(/```json|```/g, '').trim();
        const cards = JSON.parse(clean);

        localStorage.setItem(cacheKey, JSON.stringify(cards));
        applyAIDeck(topic, cards);
        if (statusEl) statusEl.textContent = `${topic.emoji} ${topic.label} deck ready!`;
    } catch (e) {
        if (statusEl) statusEl.textContent = `⚠️ Error loading deck — try again!`;
    }

    aiDeckLoading = false;
}

function applyAIDeck(topic, cards) {
    // Build deck object in the same shape as DECKS entries
    const deckId = `ai_${topic.id}`;
    DECKS[deckId] = {
        id:      deckId,
        label:   `${topic.label} (AI)`,
        emoji:   topic.emoji,
        badgeId: 'explorer',
        cards:   cards.map(c => ({
            word:          c.word,
            pronunciation: c.pronunciation || '',
            icon:          'auto_awesome',
            image:         '',
            hint:          c.hint || '',
            example:       c.example || '',
            aiEmoji:       c.emoji || topic.emoji,
        }))
    };
    switchDeck(deckId);
    updateDeckPicker();
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateDeckPicker();
    updateFlashcard();
    renderAITopics();
});
