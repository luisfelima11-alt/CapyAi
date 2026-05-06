const http    = require('http');
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
// Root of the project (one level up from scripts/)
const ROOT    = path.join(__dirname, '..');

// ── Load .env (zero-dependency parser) ────────────────────────────────────────
(function loadEnv() {
    const envPath = path.join(ROOT, '.env');
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const idx = line.indexOf('=');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = val;
    }
})();

const PORT    = process.env.PORT || 8765;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL   = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is not set — AI features will return a friendly error. Static pages will still work.');
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'text/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.json': 'application/json',
    '.md':   'text/markdown',
    '.ico':  'image/x-icon'
};

// ── OpenAI API helper ─────────────────────────────────────────────────────────
// Calls OpenAI chat/completions and returns the response wrapped in the same
// Gemini-compatible envelope { candidates:[{content:{parts:[{text}]}}] }
// so all existing client-side parsers continue to work unchanged.
function callOpenAI(messages, maxTokens, temperature, res) {
    if (!API_KEY) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: { code: 503, message: 'AI features require OPENAI_API_KEY to be configured.', status: 'UNAVAILABLE' } }));
        return;
    }
    const postData = JSON.stringify({
        model:       MODEL,
        messages,
        max_tokens:  maxTokens,
        temperature
    });

    const options = {
        hostname: 'api.openai.com',
        path:     '/v1/chat/completions',
        method:   'POST',
        headers: {
            'Content-Type':   'application/json',
            'Authorization':  `Bearer ${API_KEY}`,
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            if (apiRes.statusCode !== 200) {
                console.error('[OpenAI Error]', apiRes.statusCode, data);
                // Forward the error in a Gemini-shaped envelope so clients handle it
                let errBody;
                try { errBody = JSON.parse(data); } catch { errBody = { error: { message: data } }; }
                res.writeHead(200, {
                    'Content-Type':                'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                // Map to Gemini-style error so existing client error checks still fire
                res.end(JSON.stringify({ error: { code: apiRes.statusCode, message: errBody?.error?.message || data, status: errBody?.error?.type || 'API_ERROR' } }));
                return;
            }

            try {
                const parsed = JSON.parse(data);
                const text   = parsed?.choices?.[0]?.message?.content || '';
                // Wrap in Gemini-compatible envelope
                const envelope = {
                    candidates: [{ content: { parts: [{ text }] } }]
                };
                res.writeHead(200, {
                    'Content-Type':                'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(envelope));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { code: 500, message: 'Failed to parse OpenAI response' } }));
            }
        });
    });

    apiReq.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { code: 500, message: err.message } }));
    });

    apiReq.write(postData);
    apiReq.end();
}

// ── Request handler (exported for Vercel, also used locally) ─────────────────
const handler = (req, res) => {

    // ── CORS pre-flight ───────────────────────────────────────────────────────
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin':  '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // ── POST /api/chat  (Yara free-chat) ──────────────────────────────────────
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { history, message, systemOverride } = JSON.parse(body);

                const systemPrompt = systemOverride ||
                    `You are Yara, a friendly and cheerful capybara who teaches English to young children aged 5-8.
Rules:
- Always respond in very simple English (A1 level).
- Keep every reply to 1-3 short sentences maximum.
- Be warm, playful and encouraging. Use 1-2 emojis per reply.
- If the child makes a grammar mistake, gently correct it once, then continue.
- If the child writes in another language, reply in English and kindly ask them to try in English.
- Never discuss anything outside English learning or child-friendly topics.
- Always end with a simple question or encouragement to keep the conversation going.`;

                const messages = [{ role: 'system', content: systemPrompt }];

                // Append conversation history
                (history || []).forEach(m => {
                    messages.push({
                        role:    m.role === 'model' ? 'assistant' : 'user',
                        content: m.text
                    });
                });

                messages.push({ role: 'user', content: message });

                callOpenAI(messages, 120, 0.85, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/quiz  (AI quiz generation) ─────────────────────────────────
    if (req.method === 'POST' && req.url === '/api/quiz') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { words, deckLabel } = JSON.parse(body);

                const prompt = `You are creating a fun English quiz for children aged 5-8.
The child just studied these words from the "${deckLabel}" deck: ${words.join(', ')}.

Generate exactly 4 multiple-choice questions to test those words.
Each question must have exactly 4 answer options (A, B, C, D) with only one correct answer.

Respond ONLY with a valid JSON array — no explanation, no markdown, no code block.
Format:
[
  {
    "question": "What is this? 🍎",
    "image_hint": "Apple",
    "options": ["Apple", "River", "Bird", "Tree"],
    "correct": "Apple"
  }
]

Keep questions very simple. Use emojis in questions. Vary question types (What is this? / Which word means...? / Fill in the blank).`;

                callOpenAI([{ role: 'user', content: prompt }], 600, 0.7, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/translate  (word translation) ──────────────────────────────
    if (req.method === 'POST' && req.url === '/api/translate') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { word, targetLang } = JSON.parse(body);
                const prompt = `Translate the English word "${word}" into ${targetLang}.
Respond ONLY with valid JSON — no markdown, no explanation.
Format: {"translation": "...", "example": "A simple sentence using the translation (in ${targetLang})."}`;

                callOpenAI([{ role: 'user', content: prompt }], 80, 0.3, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/story  (AI Story Time) ─────────────────────────────────────
    if (req.method === 'POST' && req.url === '/api/story') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { words, name } = JSON.parse(body);
                const childName = name || 'Explorer';
                const wordList  = (words || ['apple','tree','bird']).join(', ');

                const prompt = `Write a short, fun English story for a child named ${childName}, aged 5-8.
The story MUST use these words naturally: ${wordList}.

Rules:
- Maximum 5 sentences. Very simple English (A1 level).
- Make it fun, warm, and set in a magical forest.
- Feature a friendly capybara named Yara as a character.
- End with a happy, positive message.
- Add 1-2 emojis per sentence.

Respond ONLY with valid JSON — no markdown, no code block.
Format:
{
  "title": "The Magic Apple Tree",
  "sentences": [
    "Yara the capybara found a big apple tree in the forest. 🌳🍎",
    "..."
  ],
  "moral": "Always share with your friends!"
}`;

                callOpenAI([{ role: 'user', content: prompt }], 400, 0.85, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── GET /api/word-of-day  (AI Word of the Day) ────────────────────────────
    if (req.method === 'GET' && req.url === '/api/word-of-day') {
        const today = new Date().toISOString().slice(0, 10);
        const prompt = `Today is ${today}. Pick ONE interesting English word that a child aged 5-8 would find fun and useful.

Respond ONLY with valid JSON — no markdown, no code block, no explanation.
Format:
{
  "word": "Butterfly",
  "emoji": "🦋",
  "pronunciation": "/ˈbʌt.ə.flaɪ/",
  "partOfSpeech": "noun",
  "simpleMeaning": "A beautiful insect with big colourful wings.",
  "exampleSentence": "I saw a butterfly in the garden today.",
  "funFact": "Butterflies taste with their feet!"
}`;

        callOpenAI([{ role: 'user', content: prompt }], 200, 0.9, res);
        return;
    }

    // ── GET /api/daily-challenge  (AI Daily Challenge) ───────────────────────
    if (req.method === 'GET' && req.url === '/api/daily-challenge') {
        const today = new Date().toISOString().slice(0, 10);
        const prompt = `Today is ${today}. Create ONE fun English challenge for a child aged 5-8.

Respond ONLY with valid JSON — no markdown, no code block, no explanation.
Format exactly:
{"type":"sentence","emoji":"🦁","title":"Use a Brave Word!","instruction":"Use the word 'brave' in a sentence about an animal.","hint":"Think about what a brave animal might do.","example":"The brave lion protected its cubs.","xp":20}

Types allowed: sentence (use a given word in a sentence), describe (describe something using adjectives), translate (translate simple words to English).
Make it fun, simple, and educational. XP should be 20 or 30.`;

        callOpenAI([{ role: 'user', content: prompt }], 150, 1.0, res);
        return;
    }

    // ── POST /api/flashcard-deck  (AI Flashcard Deck) ────────────────────────
    if (req.method === 'POST' && req.url === '/api/flashcard-deck') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            let topic = 'animals';
            try { topic = JSON.parse(body).topic || 'animals'; } catch {}
            const messages = [{
                role: 'user',
                content: `Create 10 English vocabulary flashcards for the topic "${topic}" for children aged 5-8.
Respond ONLY with a valid JSON array — no markdown, no code block, no explanation.
Format exactly:
[{"word":"Sun","emoji":"☀️","pronunciation":"/sʌn/","hint":"It shines in the sky","example":"The sun is bright today."}]
Words should be common, age-appropriate, and varied.`
            }];
            callOpenAI(messages, 600, 0.8, res);
        });
        return;
    }

    // ── POST /api/dialogue-scene  (AI Dialogue Scene) ────────────────────────
    if (req.method === 'POST' && req.url === '/api/dialogue-scene') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            let topic = 'pets';
            try { topic = JSON.parse(body).topic || 'pets'; } catch {}
            const messages = [{
                role: 'user',
                content: `Create a short English grammar dialogue scene for children aged 5-8 about the topic "${topic}".
Respond ONLY with valid JSON — no markdown, no code block, no explanation.
Format exactly:
{"emoji":"🐶","scene":"Yara and a friend are at the park with their pets.","intro":"Let's talk about our pets! Can you help me?","grammarFocus":"possessive pronouns","questions":[{"prompt":"___ dog is fluffy and brown.","choices":["My","Me","I"],"answer":"My","explanation":"We use 'My' to show the dog belongs to me."}]}
Provide exactly 6 questions. Keep language very simple. Each question has exactly 3 choices.`
            }];
            callOpenAI(messages, 700, 0.8, res);
        });
        return;
    }

    // ── POST /api/parent-report  (AI Progress Analysis) ──────────────────────
    if (req.method === 'POST' && req.url === '/api/parent-report') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { name, xp, badges, lessons, recentDate } = JSON.parse(body);
                const prompt = `Act as an encouraging, professional educational analyst for a children's language app.
Review this child's progress data:
- Name: ${name || 'The student'}
- Total XP: ${xp || 0}
- Badges Earned: ${badges ? badges.length : 0}
- Flashcards/Decks completed: ${lessons ? lessons.length : 0}
- Last active: ${recentDate || 'Recently'}

Write a 2-3 paragraph summary for the parents.
Focus on:
1. Celebrating their effort and consistency.
2. Highlighting their engagement with the app.
3. Providing one constructive, practical tip for the parent to practice English with them offline this week (e.g. at the dinner table).

Keep the tone extremely warm, positive, and concise.
Respond ONLY with valid JSON — no markdown, no code block.
Format exactly:
{"title":"Weekly Progress Report for ${name || 'Your Child'}","summary":"[Paragraph 1]\\n\\n[Paragraph 2]","parentTip":"[The tip]"}
`;
                callOpenAI([{ role: 'user', content: prompt }], 500, 0.7, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/lesson-quiz  (AI quiz questions for a lesson topic) ─────────
    if (req.method === 'POST' && req.url === '/api/lesson-quiz') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { topic, vocab, level } = JSON.parse(body);
                const messages = [{
                    role: 'user',
                    content: `Create 5 multiple-choice English quiz questions for children learning about "${topic}" at ${level || 'beginner'} level.
Key vocabulary to test: ${(vocab || []).join(', ')}.
Return ONLY valid JSON array (no markdown, no code block):
[{"q":"question text","opts":["option A","option B","option C","option D"],"a":"exact correct option text","explain":"one short sentence why"}]
Keep questions simple, fun, and age-appropriate for 8-12 year olds. Each question must have exactly 4 options.`
                }];
                callOpenAI(messages, 700, 0.7, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── POST /api/lesson-chat  (Yara AI conversation for lesson practice) ────
    if (req.method === 'POST' && req.url === '/api/lesson-chat') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { history, message, lessonTopic, vocab } = JSON.parse(body);
                const system = `You are Yara, a friendly capybara who teaches English to children aged 8-12.
The lesson topic is "${lessonTopic}". Key vocabulary: ${(vocab || []).join(', ')}.
Rules: keep every reply under 2 sentences; use simple English words only; always end your reply with a short question to the student to keep the conversation going; be warm, playful, and encouraging.`;
                const messages = [{ role: 'system', content: system }];
                (history || []).forEach(m => messages.push({
                    role: m.role === 'model' ? 'assistant' : 'user',
                    content: m.text
                }));
                messages.push({ role: 'user', content: message });
                callOpenAI(messages, 120, 0.85, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad request' }));
            }
        });
        return;
    }

    // ── DATABASE ENDPOINTS (Local JSON Store) ────────────────────────────────
    const DB_FILE = path.join(ROOT, 'database.json');
    const readDB = () => { try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch { return { accounts: [], users: {}, settings: {} }; } };
    const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    if (req.method === 'GET' && req.url.startsWith('/api/db/leaderboard')) {
        let db = readDB();
        let board = [];
        const accounts = db.accounts || [];
        for (const act of accounts) {
            const st = db.users[act.id] || {};
            const set = db.settings[act.id] || {};
            board.push({
                id: act.id,
                name: act.name,
                avatar: set.avatar || act.avatar || '🦫',
                xp: st.xp || 0,
                badgesCount: (st.badges || []).length
            });
        }
        board.sort((a, b) => b.xp - a.xp);
        board = board.slice(0, 20); // Top 20

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(board));
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/db/accounts')) {
        let db = readDB();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accounts: db.accounts }));
        return;
    }

    if (req.method === 'POST' && req.url === '/api/db/accounts') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { accounts } = JSON.parse(body);
                let db = readDB();
                db.accounts = accounts;
                writeDB(db);
                res.writeHead(200); res.end(JSON.stringify({ success: true }));
            } catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: true })); }
        });
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/db')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const type = urlParams.get('type'); // 'state' or 'settings'
        const userId = urlParams.get('userId');
        
        let db = readDB();
        let payload = null;
        if (type === 'state' && userId) payload = db.users[userId] || null;
        if (type === 'settings' && userId) payload = db.settings[userId] || null;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
        return;
    }

    if (req.method === 'POST' && req.url === '/api/db') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { type, userId, payload } = JSON.parse(body);
                if (userId && payload) {
                    let db = readDB();
                    if (type === 'state') db.users[userId] = payload;
                    else if (type === 'settings') db.settings[userId] = payload;
                    writeDB(db);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Save failed' }));
            }
        });
        return;
    }

    // ── Static file serving ───────────────────────────────────────────────────
    const urlPathname = req.url.split('?')[0]; // strip query string before file lookup
    let filePath = path.join(ROOT, urlPathname === '/' ? '4_Login_Capy_Yara_Welcomes_You.html' : urlPathname);
    const extname     = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found', 'utf-8');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

// ── Export for Vercel serverless ──────────────────────────────────────────────
module.exports = handler;

// ── Local dev: start HTTP server only when run directly ───────────────────────
if (require.main === module) {
    const server = http.createServer(handler);
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use.`);
        } else {
            console.error('❌ Server error:', err);
        }
        process.exit(1);
    });
    server.listen(PORT, () => {
        console.log(`✅ Capy Yara Adventures running at http://localhost:${PORT}/`);
        console.log(`🤖 AI endpoints ready (powered by OpenAI ${MODEL}):`);
        console.log(`   POST http://localhost:${PORT}/api/chat`);
        console.log(`   POST http://localhost:${PORT}/api/quiz`);
        console.log(`   POST http://localhost:${PORT}/api/translate`);
        console.log(`   POST http://localhost:${PORT}/api/story`);
        console.log(`   GET  http://localhost:${PORT}/api/word-of-day`);
        console.log(`   GET  http://localhost:${PORT}/api/daily-challenge`);
    });
}
