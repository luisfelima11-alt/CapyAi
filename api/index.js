const https = require('https');

// ── Supabase ──────────────────────────────────────────────────────────────────
const SB_URL = process.env.SUPABASE_URL;   // https://xxxx.supabase.co
const SB_KEY = process.env.SUPABASE_KEY;   // service role key (server-side only)

async function sb(path, opts = {}) {
  if (!SB_URL || !SB_KEY) return null;
  try {
    const r = await fetch(`${SB_URL}/rest/v1${path}`, {
      ...opts,
      headers: {
        'apikey':        SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type':  'application/json',
        ...(opts.headers || {}),
      },
    });
    if (r.status === 204) return null;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  } catch (e) { return null; }
}

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL   = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function callOpenAI(messages, maxTokens, temperature, res) {
    if (!API_KEY) {
        res.status(503).json({ error: { code: 503, message: 'AI features require OPENAI_API_KEY.', status: 'UNAVAILABLE' } });
        return;
    }
    const postData = JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature });
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
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'application/json');
            if (apiRes.statusCode !== 200) {
                let errBody; try { errBody = JSON.parse(data); } catch { errBody = { error: { message: data } }; }
                res.status(200).end(JSON.stringify({ error: { code: apiRes.statusCode, message: errBody?.error?.message || data } }));
                return;
            }
            try {
                const parsed = JSON.parse(data);
                const text = parsed?.choices?.[0]?.message?.content || '';
                res.status(200).end(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }));
            } catch(e) {
                res.status(500).end(JSON.stringify({ error: { code: 500, message: 'Failed to parse OpenAI response' } }));
            }
        });
    });
    apiReq.on('error', err => { res.status(500).end(JSON.stringify({ error: { code: 500, message: err.message } })); });
    apiReq.write(postData);
    apiReq.end();
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
        req.on('error', reject);
    });
}


module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }

    const url = req.url.split('?')[0];

    if (req.method === 'POST' && url === '/api/chat') {
        const { history, message, systemOverride } = await readBody(req);
        const systemPrompt = systemOverride || `You are Yara, a friendly and cheerful capybara who teaches English to young children aged 5-8.\nRules:\n- Always respond in very simple English (A1 level).\n- Keep every reply to 1-3 short sentences maximum.\n- Be warm, playful and encouraging. Use 1-2 emojis per reply.\n- If the child makes a grammar mistake, gently correct it once, then continue.\n- If the child writes in another language, reply in English and kindly ask them to try in English.\n- Never discuss anything outside English learning or child-friendly topics.\n- Always end with a simple question or encouragement to keep the conversation going.`;
        const messages = [{ role: 'system', content: systemPrompt }];
        (history || []).forEach(m => messages.push({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text }));
        messages.push({ role: 'user', content: message });
        callOpenAI(messages, 120, 0.85, res); return;
    }

    if (req.method === 'POST' && url === '/api/quiz') {
        const { words, deckLabel } = await readBody(req);
        const prompt = `You are creating a fun English quiz for children aged 5-8.\nThe child just studied these words from the "${deckLabel}" deck: ${(words||[]).join(', ')}.\nGenerate exactly 4 multiple-choice questions. Each has 4 options, one correct answer.\nRespond ONLY with a valid JSON array:\n[{"question":"What is this? 🍎","image_hint":"Apple","options":["Apple","River","Bird","Tree"],"correct":"Apple"}]`;
        callOpenAI([{ role: 'user', content: prompt }], 600, 0.7, res); return;
    }

    if (req.method === 'POST' && url === '/api/translate') {
        const { word, targetLang } = await readBody(req);
        const prompt = `Translate the English word "${word}" into ${targetLang}.\nRespond ONLY with valid JSON:\n{"translation": "...", "example": "A simple sentence using the translation (in ${targetLang})."}`;
        callOpenAI([{ role: 'user', content: prompt }], 80, 0.3, res); return;
    }

    if (req.method === 'POST' && url === '/api/story') {
        const { words, name } = await readBody(req);
        const childName = name || 'Explorer';
        const wordList  = (words || ['apple','tree','bird']).join(', ');
        const prompt = `Write a short fun English story for a child named ${childName} aged 5-8.\nMUST use these words: ${wordList}.\nMax 5 sentences. Simple English. Feature capybara Yara. Happy ending. 1-2 emojis per sentence.\nRespond ONLY with valid JSON:\n{"title":"...","sentences":["..."],"moral":"..."}`;
        callOpenAI([{ role: 'user', content: prompt }], 400, 0.85, res); return;
    }

    if (req.method === 'GET' && url === '/api/word-of-day') {
        const today = new Date().toISOString().slice(0, 10);
        const prompt = `Today is ${today}. Pick ONE interesting English word for a child aged 5-8.\nRespond ONLY with valid JSON:\n{"word":"Butterfly","emoji":"🦋","pronunciation":"/ˈbʌt.ə.flaɪ/","partOfSpeech":"noun","simpleMeaning":"A beautiful insect with big colourful wings.","exampleSentence":"I saw a butterfly in the garden today.","funFact":"Butterflies taste with their feet!"}`;
        callOpenAI([{ role: 'user', content: prompt }], 200, 0.9, res); return;
    }

    if (req.method === 'GET' && url === '/api/daily-challenge') {
        const today = new Date().toISOString().slice(0, 10);
        const prompt = `Today is ${today}. Create ONE fun English challenge for a child aged 5-8.\nRespond ONLY with valid JSON:\n{"type":"sentence","emoji":"🦁","title":"Use a Brave Word!","instruction":"Use the word 'brave' in a sentence about an animal.","hint":"Think about what a brave animal might do.","example":"The brave lion protected its cubs.","xp":20}`;
        callOpenAI([{ role: 'user', content: prompt }], 150, 1.0, res); return;
    }

    if (req.method === 'POST' && url === '/api/flashcard-deck') {
        const { topic } = await readBody(req);
        const t = topic || 'animals';
        const prompt = `Create 10 English vocabulary flashcards for "${t}" for children aged 5-8.\nRespond ONLY with a valid JSON array:\n[{"word":"Sun","emoji":"☀️","pronunciation":"/sʌn/","hint":"It shines in the sky","example":"The sun is bright today."}]`;
        callOpenAI([{ role: 'user', content: prompt }], 600, 0.8, res); return;
    }

    if (req.method === 'POST' && url === '/api/dialogue-scene') {
        const { topic } = await readBody(req);
        const t = topic || 'pets';
        const prompt = `Create a short English grammar dialogue for children aged 5-8 about "${t}".\nRespond ONLY with valid JSON:\n{"emoji":"🐶","scene":"...","intro":"...","grammarFocus":"...","questions":[{"prompt":"___ dog is fluffy.","choices":["My","Me","I"],"answer":"My","explanation":"We use My to show the dog belongs to me."}]}\nProvide exactly 6 questions, each with 3 choices.`;
        callOpenAI([{ role: 'user', content: prompt }], 700, 0.8, res); return;
    }

    if (req.method === 'POST' && url === '/api/parent-report') {
        const { name, xp, badges, lessons, recentDate } = await readBody(req);
        const prompt = `Act as an educational analyst for a children's language app.\nChild: ${name||'Student'}, XP: ${xp||0}, Badges: ${badges?badges.length:0}, Lessons: ${lessons?lessons.length:0}, Last active: ${recentDate||'Recently'}.\nWrite a warm 2-3 paragraph summary for parents celebrating effort and giving one practical offline tip.\nRespond ONLY with valid JSON:\n{"title":"Weekly Progress Report for ${name||'Your Child'}","summary":"[Paragraph 1]\\n\\n[Paragraph 2]","parentTip":"[The tip]"}`;
        callOpenAI([{ role: 'user', content: prompt }], 500, 0.7, res); return;
    }

    if (req.method === 'POST' && url === '/api/lesson-quiz') {
        const { topic, vocab, level } = await readBody(req);
        const prompt = `Create 5 multiple-choice English quiz questions about "${topic}" at ${level||'beginner'} level for children.\nVocabulary: ${(vocab||[]).join(', ')}.\nReturn ONLY valid JSON array:\n[{"q":"...","opts":["A","B","C","D"],"a":"correct option","explain":"why"}]`;
        callOpenAI([{ role: 'user', content: prompt }], 700, 0.7, res); return;
    }

    if (req.method === 'POST' && url === '/api/lesson-chat') {
        const { history, message, lessonTopic, vocab } = await readBody(req);
        const system = `You are Yara, a friendly capybara teaching English to children aged 8-12.\nLesson: "${lessonTopic}". Vocabulary: ${(vocab||[]).join(', ')}.\nRules: under 2 sentences per reply; simple English; end with a question; warm and encouraging.`;
        const messages = [{ role: 'system', content: system }];
        (history||[]).forEach(m => messages.push({ role: m.role==='model'?'assistant':'user', content: m.text }));
        messages.push({ role: 'user', content: message });
        callOpenAI(messages, 120, 0.85, res); return;
    }

    // ── DB endpoints (Supabase) ───────────────────────────────────────────────

    // Leaderboard: top 20 by XP
    if (req.method === 'GET' && url.startsWith('/api/db/leaderboard')) {
        const [accounts, states] = await Promise.all([
            sb('/accounts?select=id,name,avatar'),
            sb('/user_state?select=user_id,data'),
        ]);
        const stateMap = {};
        (states || []).forEach(s => { stateMap[s.user_id] = s.data || {}; });
        const board = (accounts || []).map(a => ({
            id: a.id, name: a.name, avatar: a.avatar || '🦫',
            xp: stateMap[a.id]?.xp || 0,
            badgesCount: (stateMap[a.id]?.badges || []).length,
        })).sort((a, b) => b.xp - a.xp).slice(0, 20);
        res.status(200).json(board); return;
    }

    // Get all accounts (auth.js login/signup flow)
    if (req.method === 'GET' && url.startsWith('/api/db/accounts')) {
        const rows = await sb('/accounts?select=id,name,email,password,avatar,created_at&order=created_at.asc');
        res.status(200).json({ accounts: rows || [] }); return;
    }

    // Save accounts — auth.js sends the full array on signup; upsert handles duplicates
    if (req.method === 'POST' && url === '/api/db/accounts') {
        const { accounts } = await readBody(req);
        if (accounts && accounts.length) {
            await sb('/accounts', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify(accounts),
            });
        }
        res.status(200).json({ success: true }); return;
    }

    // Get user progress state
    if (req.method === 'GET' && url.startsWith('/api/db')) {
        const qs = new URL(req.url, 'http://localhost').searchParams;
        const type = qs.get('type'), userId = qs.get('userId');
        if (type === 'state' && userId) {
            const rows = await sb(`/user_state?user_id=eq.${encodeURIComponent(userId)}&select=data`);
            res.status(200).json(rows?.[0]?.data || null);
        } else {
            res.status(200).json(null);
        }
        return;
    }

    // Save user progress state
    if (req.method === 'POST' && url === '/api/db') {
        const { type, userId, payload } = await readBody(req);
        if (userId && payload && type === 'state') {
            await sb('/user_state', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify({
                    user_id:    userId,
                    data:       payload,
                    updated_at: new Date().toISOString(),
                }),
            });
        }
        res.status(200).json({ success: true }); return;
    }

    res.status(404).json({ error: 'Not found' });
};
