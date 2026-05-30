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
        const { history, message, systemOverride, userId } = await readBody(req);

        // Fetch user profile to personalize Yara's responses
        let profileContext = '';
        if (userId && userId !== 'guest') {
            const rows = await sb(`/user_profiles?id=eq.${encodeURIComponent(userId)}&select=*`);
            const p = rows?.[0];
            if (p) {
                const detail = p.interests_detail ? `\n- Favorite specifics: ${p.interests_detail}` : '';
                profileContext = `\n\nStudent profile:\n- English level: ${p.english_level || 'beginner'}\n- Learning goals: ${(p.goals || []).join(', ') || 'general'}\n- Interests: ${(p.interests || []).join(', ') || 'various'}${detail}\n- Daily study goal: ${p.daily_goal_minutes || 10} minutes\nTailor your language complexity and vocabulary to their level. When relevant, reference their specific favorites naturally in examples or conversation.`;
            }
        }

        const basePrompt = `You are Yara, a friendly and cheerful capybara who teaches English to Brazilian students.\nRules:\n- Adapt your English level to the student's profile (default: A1 simple if unknown).\n- Keep every reply to 1-3 short sentences maximum.\n- Be warm, playful and encouraging. Use 1-2 emojis per reply.\n- If the student makes a grammar mistake, gently correct it once, then continue.\n- If the student writes in Portuguese, reply in English and kindly encourage them to try in English.\n- Never discuss anything outside English learning or friendly topics.\n- Always end with a simple question or encouragement to keep the conversation going.`;
        const systemPrompt = systemOverride || (basePrompt + profileContext);
        const messages = [{ role: 'system', content: systemPrompt }];
        (history || []).forEach(m => messages.push({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text }));
        messages.push({ role: 'user', content: message });
        callOpenAI(messages, 150, 0.85, res); return;
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
            id: a.id, name: a.name, avatar: a.avatar || '🐾',
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

    // ── User Profile ──────────────────────────────────────────────────────────

    // GET /api/profile?userId=xxx → returns user_profiles row
    if (req.method === 'GET' && url.startsWith('/api/profile')) {
        const qs = new URL(req.url, 'http://localhost').searchParams;
        const userId = qs.get('userId');
        if (!userId) { res.status(400).json({ error: 'userId required' }); return; }
        const rows = await sb(`/user_profiles?id=eq.${encodeURIComponent(userId)}&select=*`);
        res.status(200).json(rows?.[0] || null); return;
    }

    // POST /api/profile → upserts user_profiles row
    if (req.method === 'POST' && url === '/api/profile') {
        const { userId, ...profileData } = await readBody(req);
        if (!userId) { res.status(400).json({ error: 'userId required' }); return; }
        await sb('/user_profiles', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({ id: userId, ...profileData, updated_at: new Date().toISOString() }),
        });
        res.status(200).json({ success: true }); return;
    }

    // GET /api/me?userId=xxx → returns subscription/plan info
    // Used by frontend to gate Pro/Super features in real time.
    // Cache: private 60s (don't broadcast plan to CDN, but allow short browser cache).
    if (req.method === 'GET' && url.startsWith('/api/me')) {
        const qs = new URL(req.url, 'http://localhost').searchParams;
        const userId = qs.get('userId');
        if (!userId) { res.status(400).json({ error: 'userId required' }); return; }
        const rows = await sb(`/user_profiles?id=eq.${encodeURIComponent(userId)}&select=plan,plan_expires_at,kiwify_subscription_id`);
        const row = rows?.[0] || {};
        // Default to 'free' if no row or plan column doesn't exist yet
        const plan = (row.plan === 'pro' || row.plan === 'super') ? row.plan : 'free';
        // If plan expired, downgrade to free
        let effectivePlan = plan;
        if (plan !== 'free' && row.plan_expires_at) {
            if (new Date(row.plan_expires_at) < new Date()) effectivePlan = 'free';
        }
        res.setHeader('Cache-Control', 'private, max-age=60');
        res.status(200).json({
            plan: effectivePlan,
            planExpiresAt: row.plan_expires_at || null,
            kiwifySubscriptionId: row.kiwify_subscription_id || null,
        });
        return;
    }

    // ── YouTube Learning Lab ───────────────────────────────────────────────────

    // POST /api/youtube → fetch transcript + generate learning content
    if (req.method === 'POST' && url === '/api/youtube') {
        const { videoUrl, userId } = await readBody(req);

        // Extract video ID
        const videoIdMatch = (videoUrl || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
        if (!videoIdMatch) {
            res.status(400).json({ error: 'URL do YouTube inválida. Verifique o link e tente novamente.' }); return;
        }
        const videoId = videoIdMatch[1];

        // ── httpsFetch: uses native https module (avoids fetch availability issues) ──
        function httpsFetch(urlStr, opts = {}) {
            return new Promise((resolve, reject) => {
                try {
                    const u = new URL(urlStr);
                    const reqOpts = {
                        hostname: u.hostname,
                        path: u.pathname + u.search,
                        method: opts.method || 'GET',
                        headers: { 'Accept-Encoding': 'identity', ...(opts.headers || {}) },
                        timeout: 8000,
                    };
                    const req = https.request(reqOpts, r => {
                        const chunks = [];
                        r.on('data', c => chunks.push(c));
                        r.on('end', () => {
                            const body = Buffer.concat(chunks).toString('utf8');
                            resolve({ ok: r.statusCode >= 200 && r.statusCode < 300, status: r.statusCode,
                                text: () => body, json: () => JSON.parse(body) });
                        });
                    });
                    req.on('error', reject);
                    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
                    if (opts.body) req.write(opts.body);
                    req.end();
                } catch(e) { reject(e); }
            });
        }

        function parseCaptionEvents(data) {
            try {
                const obj = typeof data === 'string' ? JSON.parse(data) : data;
                return (obj.events || [])
                    .filter(e => e.segs?.length)
                    .map(e => e.segs.map(s => s.utf8 || '').join(''))
                    .join(' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            } catch(e) { return null; }
        }

        async function fetchCaptionUrl(baseUrl) {
            try {
                const url = baseUrl.replace(/\\u0026/g, '&') + '&fmt=json3';
                const r = await httpsFetch(url);
                if (r.ok) return parseCaptionEvents(r.json());
            } catch(e) {}
            return null;
        }

        async function tryInnerTube(clientName, clientVersion, extraCtx = {}) {
            try {
                const body = JSON.stringify({
                    context: { client: { clientName, clientVersion, hl: 'en', gl: 'US', ...extraCtx } },
                    videoId
                });
                const r = await httpsFetch('https://www.youtube.com/youtubei/v1/player', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Youtube-Client-Name': clientName === 'ANDROID' ? '3' : clientName === 'IOS' ? '5' : '1', 'X-Youtube-Client-Version': clientVersion },
                    body
                });
                if (!r.ok) return null;
                const data = r.json();
                const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
                const track = tracks.find(t => t.languageCode === 'en' && !t.kind)
                           || tracks.find(t => t.languageCode === 'en')
                           || tracks.find(t => t.languageCode?.startsWith('en'))
                           || tracks[0];
                if (track?.baseUrl) return fetchCaptionUrl(track.baseUrl);
            } catch(e) { console.error('[YT InnerTube]', clientName, e.message); }
            return null;
        }

        // Fetch transcript — try 4 strategies in order
        let transcript = null;

        // Strategy 1: ANDROID client (least restricted by YouTube)
        if (!transcript) transcript = await tryInnerTube('ANDROID', '19.09.37', {
            androidSdkVersion: 30,
            userAgent: 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip'
        });

        // Strategy 2: IOS client
        if (!transcript) transcript = await tryInnerTube('IOS', '19.09.3', {
            deviceModel: 'iPhone16,2',
            userAgent: 'com.google.ios.youtube/19.09.3 (iPhone16,2; U; CPU iOS 17_1_2 like Mac OS X;)'
        });

        // Strategy 3: WEB client
        if (!transcript) transcript = await tryInnerTube('WEB', '2.20240101.00.00', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
        });

        // Strategy 4: HTML scraping
        if (!transcript || transcript.length < 50) {
            try {
                const r = await httpsFetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept': 'text/html,application/xhtml+xml',
                    }
                });
                if (r.ok) {
                    const html = r.text();
                    const match = html.match(/"captionTracks":(\[[\s\S]+?\])/);
                    if (match) {
                        const tracks = JSON.parse(match[1].replace(/\\u0026/g, '&'));
                        const track = tracks.find(t => t.languageCode === 'en' || t.languageCode?.startsWith('en')) || tracks[0];
                        if (track?.baseUrl) transcript = await fetchCaptionUrl(track.baseUrl);
                    }
                }
            } catch(e) { console.error('[YT scrape]', e.message); }
        }

        if (!transcript || transcript.length < 50) {
            res.status(422).json({ error: 'Não consegui encontrar legendas para este vídeo. Tente um vídeo em inglês com legendas automáticas ativadas.' }); return;
        }

        // Limit transcript to ~3000 chars for the AI call
        const transcriptSnippet = transcript.length > 3000 ? transcript.slice(0, 3000) + '...' : transcript;

        // Call OpenAI to generate learning content
        const prompt = `You are an English teacher. Analyze this YouTube video transcript and create learning material for a Brazilian student.

Transcript: "${transcriptSnippet}"

Respond ONLY with valid JSON in this exact format:
{
  "vocabulary": [
    {"word": "example", "phonetic": "/ɪɡˈzæmpəl/", "definition": "Simple definition in English", "ptTranslation": "Tradução em português", "example": "A short example sentence."}
  ],
  "questions": [
    {"question": "Comprehension question?", "options": ["A", "B", "C", "D"], "correct": "A", "explanation": "Why A is correct."}
  ],
  "summary": "A 2-3 sentence summary of the video in English.",
  "summaryPt": "Resumo em 2-3 frases em português.",
  "conversationStarter": "An engaging question Yara would ask the student about this video."
}

Rules:
- vocabulary: exactly 8 useful words/phrases from the transcript, sorted easiest to hardest
- questions: exactly 5 multiple choice questions with 4 options each
- Keep everything appropriate for language learning`;

        if (!API_KEY) {
            res.status(503).json({ error: 'AI features require OPENAI_API_KEY.' }); return;
        }

        const aiBody = JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 1800, temperature: 0.3, response_format: { type: 'json_object' } });
        const aiOptions = {
            hostname: 'api.openai.com', path: '/v1/chat/completions', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'Content-Length': Buffer.byteLength(aiBody) }
        };

        const aiReq = https.request(aiOptions, aiRes => {
            let data = '';
            aiRes.on('data', c => data += c);
            aiRes.on('end', () => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/json');
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed?.choices?.[0]?.message?.content || '{}';
                    const learning = JSON.parse(content);
                    res.status(200).json({ videoId, transcript: transcriptSnippet, ...learning });
                } catch(e) {
                    res.status(500).json({ error: 'Erro ao processar o conteúdo do vídeo.' });
                }
            });
        });
        aiReq.on('error', () => res.status(500).json({ error: 'Erro de conexão com a IA.' }));
        aiReq.write(aiBody);
        aiReq.end();
        return;
    }

    // ── Personalized Lesson Tab ───────────────────────────────────────────────

    // POST /api/personalize → AI mini-lesson themed around user interests
    if (req.method === 'POST' && url === '/api/personalize') {
        const { topic, vocab, userId } = await readBody(req);

        let interests = 'various topics', detail = '', level = 'beginner';
        if (userId && userId !== 'guest') {
            const rows = await sb(`/user_profiles?id=eq.${encodeURIComponent(userId)}&select=*`);
            const p = rows?.[0];
            if (p) {
                interests = (p.interests || []).join(', ') || interests;
                detail    = p.interests_detail || '';
                level     = p.english_level    || level;
            }
        }

        const favorites = detail ? `Their specific favorites: ${detail}.` : '';
        const prompt = `You are Yara, a friendly capybara English teacher for Brazilian students. Create a short personalized bonus lesson.

Lesson topic: "${topic}"
Key vocabulary from today's lesson: ${(vocab || []).join(', ')}
Student interests: ${interests}
${favorites}
Student English level: ${level}

Create 4-6 example sentences that use TODAY'S vocabulary BUT are themed around the student's actual interests.
Example: if they like BTS and the lesson teaches HAVE/WANT/NEED/LIKE → "BTS have millions of fans worldwide. I want to go to their concert someday!"

Rules:
- Use the lesson vocabulary naturally in the examples (bold the key word concept in your mind)
- Theme the examples around the student's specific interests (music artists, teams, shows, etc.)
- Keep sentences appropriate for the student's level (${level})
- The mini_quiz must use the lesson's vocabulary in interest-themed sentences
- Respond ONLY with valid JSON (no markdown, no code blocks):

{
  "intro": "Uma frase curta e animada sobre o que você vai personalizar, ex: 'Já que você ama [interesse], aqui vão seus exemplos especiais!'",
  "examples": [
    {"en": "sentence in English", "pt": "tradução em português", "highlight": "key_vocab_word_used"}
  ],
  "mini_quiz": [
    {"q": "Fill-in sentence with ___ blank", "opts": ["option1", "option2", "option3"], "ans": 0}
  ],
  "tip": "One short practical grammar tip based on these examples, in Portuguese."
}`;

        if (!API_KEY) { res.status(503).json({ error: 'AI features require OPENAI_API_KEY.' }); return; }

        const body = JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 700, temperature: 0.85, response_format: { type: 'json_object' } });
        const opts = { hostname: 'api.openai.com', path: '/v1/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'Content-Length': Buffer.byteLength(body) } };
        const apiReq = https.request(opts, apiRes => {
            let data = '';
            apiRes.on('data', c => data += c);
            apiRes.on('end', () => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/json');
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed?.choices?.[0]?.message?.content || '{}';
                    res.status(200).json(JSON.parse(content));
                } catch(e) { res.status(500).json({ error: 'Erro ao gerar aula personalizada.' }); }
            });
        });
        apiReq.on('error', () => res.status(500).json({ error: 'Erro de conexão com a IA.' }));
        apiReq.write(body); apiReq.end(); return;
    }

    // ── Study Plan ────────────────────────────────────────────────────────────

    // POST /api/study-plan → AI-generated weekly study schedule
    if (req.method === 'POST' && url === '/api/study-plan') {
        const { userId, currentLesson, dailyGoalMinutes, interests, level } = await readBody(req);

        const mins    = dailyGoalMinutes || 10;
        const intList = (interests || []).join(', ') || 'various';
        const lvl     = level || 'beginner';
        const lesson  = currentLesson || 1;

        const prompt = `You are an expert English study planner for Brazilian learners. Create a 7-day personalized weekly study schedule.

Student profile:
- Level: ${lvl}
- Daily goal: ${mins} minutes
- Interests: ${intList}
- Next lesson in sequence: aula_${String(lesson).padStart(2,'0')}.html

Activity types to mix:
- "aula": structured lessons from the course (aula_01.html through aula_44.html in order)
- "youtube": YouTube Lab sessions (youtube_lab.html) — suggest a YouTube search topic related to their interests
- "music": Music Lab sessions (music_lab.html) — suggest a specific artist/song related to their interests
- "review": Review of previous lesson concepts (link to the previous aula)

Rules:
- Each day's total activity duration must NOT exceed ${mins} minutes
- On rest days (suggest 1-2 per week), use light activities only (music or review, max 5 min)
- Vary the activity types across the week
- Include specific YouTube topic suggestions and music artist suggestions based on their interests
- Lesson days: use sequential aula files starting from aula_${String(lesson).padStart(2,'0')}.html
- Respond ONLY with valid JSON (no markdown, no code blocks):

{
  "weeklyGoal": "Short motivational message about the week's goal in Portuguese",
  "weeklyPlan": [
    {
      "day": "Segunda",
      "dayEn": "Monday",
      "isRestDay": false,
      "activities": [
        {"type": "aula", "title": "Aula XX — Topic Name", "duration": 15, "link": "aula_XX.html", "icon": "📖", "description": "Short description in Portuguese"},
        {"type": "music", "title": "Música: Artist Name — Song", "duration": 5, "link": "music_lab.html", "icon": "🎵", "description": "Cole a letra desta música no Music Lab"}
      ]
    }
  ]
}`;

        if (!API_KEY) { res.status(503).json({ error: 'AI features require OPENAI_API_KEY.' }); return; }

        const body = JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 1200, temperature: 0.75, response_format: { type: 'json_object' } });
        const opts = { hostname: 'api.openai.com', path: '/v1/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'Content-Length': Buffer.byteLength(body) } };
        const apiReq = https.request(opts, apiRes => {
            let data = '';
            apiRes.on('data', c => data += c);
            apiRes.on('end', () => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/json');
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed?.choices?.[0]?.message?.content || '{}';
                    res.status(200).json(JSON.parse(content));
                } catch(e) { res.status(500).json({ error: 'Erro ao gerar cronograma.' }); }
            });
        });
        apiReq.on('error', () => res.status(500).json({ error: 'Erro de conexão com a IA.' }));
        apiReq.write(body); apiReq.end(); return;
    }

    // ── Music Lab ─────────────────────────────────────────────────────────────

    // POST /api/music → analyze song lyrics, generate vocab/chunks/quiz
    if (req.method === 'POST' && url === '/api/music') {
        const { lyrics, artist, userId } = await readBody(req);

        let level = 'beginner';
        if (userId && userId !== 'guest') {
            const rows = await sb(`/user_profiles?id=eq.${encodeURIComponent(userId)}&select=english_level`);
            level = rows?.[0]?.english_level || level;
        }

        const snippet = (lyrics || '').slice(0, 1000);
        if (snippet.length < 20) { res.status(400).json({ error: 'Cole a letra da música antes de analisar!' }); return; }

        const prompt = `You are Yara, a friendly capybara English teacher. Analyze these song lyrics and create a music-based English lesson for a Brazilian ${level}-level student.

Artist: ${artist || 'Unknown Artist'}
Lyrics:
"""
${snippet}
"""

Rules:
- Find 5-7 useful vocabulary words OR natural expressions from the lyrics
- For each vocab item, explain simply in Portuguese and give the lyric line as example
- Find 2-3 interesting "chunks" (natural phrases, idioms, or expressions worth learning)
- Create 3 quiz questions about the lyrics (comprehension or vocabulary)
- Keep everything positive and encouraging
- Respond ONLY with valid JSON (no markdown, no code blocks):

{
  "artistNote": "One fun fact or context about this artist/song in Portuguese (1 sentence)",
  "vocab": [
    {"word": "dream", "phonetic": "/driːm/", "pt": "sonho", "example": "The exact lyric line using this word", "tip": "Dica rápida em português sobre como usar esta palavra"}
  ],
  "chunks": [
    {"phrase": "I can't stop the feeling", "meaning": "Explicação em português do que significa e como usar", "type": "expressão", "example": "How to use it in a new sentence"}
  ],
  "quiz": [
    {"q": "Question about the lyrics?", "opts": ["option A", "option B", "option C"], "ans": 0, "explain": "Explicação em português da resposta"}
  ]
}`;

        if (!API_KEY) { res.status(503).json({ error: 'AI features require OPENAI_API_KEY.' }); return; }

        const body = JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 1400, temperature: 0.75, response_format: { type: 'json_object' } });
        const opts = { hostname: 'api.openai.com', path: '/v1/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'Content-Length': Buffer.byteLength(body) } };
        const apiReq = https.request(opts, apiRes => {
            let data = '';
            apiRes.on('data', c => data += c);
            apiRes.on('end', () => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/json');
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed?.choices?.[0]?.message?.content || '{}';
                    res.status(200).json(JSON.parse(content));
                } catch(e) { res.status(500).json({ error: 'Erro ao analisar a letra.' }); }
            });
        });
        apiReq.on('error', () => res.status(500).json({ error: 'Erro de conexão com a IA.' }));
        apiReq.write(body); apiReq.end(); return;
    }

    // ── Lyrics Proxy ──────────────────────────────────────────────────────────
    // GET /api/lyrics-search?q=query  → suggest songs via lyrics.ovh
    if (req.method === 'GET' && url.startsWith('/api/lyrics-search')) {
        const q = new URL(`https://x.com${req.url}`).searchParams.get('q') || '';
        if (!q) { res.status(400).json({ error: 'q required' }); return; }
        const target = `https://api.lyrics.ovh/suggest/${encodeURIComponent(q)}`;
        https.get(target, { headers: { 'User-Agent': 'CapyEnglish/1.0' } }, (r) => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(r.statusCode).end(d);
            });
        }).on('error', () => res.status(502).json({ error: 'lyrics search failed' }));
        return;
    }

    // GET /api/lyrics?artist=...&title=...  → fetch full lyrics via lyrics.ovh
    if (req.method === 'GET' && url.startsWith('/api/lyrics')) {
        const p = new URL(`https://x.com${req.url}`).searchParams;
        const artist = p.get('artist') || '';
        const title  = p.get('title')  || '';
        if (!artist || !title) { res.status(400).json({ error: 'artist and title required' }); return; }
        const target = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
        https.get(target, { headers: { 'User-Agent': 'CapyEnglish/1.0' } }, (r) => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(r.statusCode).end(d);
            });
        }).on('error', () => res.status(502).json({ error: 'lyrics fetch failed' }));
        return;
    }

    // ── OpenAI TTS ───────────────────────────────────────────────────────────
    // GET /api/tts?text=hello&voice=nova&lang=en  → streams MP3 from OpenAI TTS
    // lang=fr uses gpt-4o-mini-tts with native French accent instructions
    if (req.method === 'GET' && url === '/api/tts') {
        if (!API_KEY) { res.status(503).json({ error: 'OPENAI_API_KEY not set' }); return; }
        const qs2 = new URL(req.url, 'http://localhost').searchParams;
        const text = (qs2.get('text') || '').slice(0, 500);
        if (!text.trim()) { res.status(400).json({ error: 'text required' }); return; }
        const voice = qs2.get('voice') || 'nova';
        const lang  = qs2.get('lang')  || 'en';

        // French: use gpt-4o-mini-tts with native accent instructions
        const isFr = lang === 'fr';
        const ttsModel = isFr ? 'gpt-4o-mini-tts' : 'tts-1';
        const bodyObj = { model: ttsModel, input: text, voice, response_format: 'mp3' };
        if (isFr) {
            bodyObj.instructions = 'You are a native French speaker. Pronounce every word with a perfect, authentic French accent — no English influence. Speak clearly and naturally like a French teacher.';
        }
        const body = JSON.stringify(bodyObj);

        const ttsReq = https.request({
            hostname: 'api.openai.com',
            path: '/v1/audio/speech',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        }, ttsRes => {
            if (ttsRes.statusCode !== 200) {
                let d = '';
                ttsRes.on('data', c => d += c);
                ttsRes.on('end', () => {
                    let detail = d;
                    try { detail = JSON.parse(d)?.error?.message || d; } catch {}
                    res.status(502).json({ error: 'OpenAI TTS error', detail: String(detail).slice(0, 400) });
                });
                return;
            }
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', '*');
            ttsRes.pipe(res);
        });
        ttsReq.on('error', e => res.status(502).json({ error: e.message }));
        ttsReq.write(body);
        ttsReq.end();
        return;
    }

    // ── Homework Submissions ──────────────────────────────────────────────────

    // POST /api/homework → save a student homework submission to Supabase
    if (req.method === 'POST' && url === '/api/homework') {
        const { userId, studentName, lessonId, lessonTitle, answers, xp } = await readBody(req);
        if (!userId || !lessonId) { res.status(400).json({ error: 'userId and lessonId required' }); return; }
        const result = await sb('/homework_submissions', {
            method: 'POST',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify({
                user_id:       userId,
                student_name:  studentName || 'Unknown',
                lesson_id:     String(lessonId),
                lesson_title:  lessonTitle || '',
                answers:       answers || {},
                xp_earned:     xp || 0,
                submitted_at:  new Date().toISOString(),
            }),
        });
        res.status(200).json({ success: true, id: result?.[0]?.id || null }); return;
    }

    // GET /api/homework?key=TEACHER_KEY → list all submissions (teacher only)
    // GET /api/homework?key=TEACHER_KEY&lessonId=32 → filter by lesson
    // GET /api/homework?key=TEACHER_KEY&userId=xxx → filter by student
    if (req.method === 'GET' && url.startsWith('/api/homework')) {
        const p = new URL(`https://x.com${req.url}`).searchParams;
        const key      = p.get('key') || '';
        const expected = process.env.TEACHER_KEY || 'capyteacher2025';
        if (key !== expected) { res.status(401).json({ error: 'Unauthorized' }); return; }
        const lessonId = p.get('lessonId');
        const userId   = p.get('userId');
        let filter = '';
        if (lessonId) filter += `&lesson_id=eq.${encodeURIComponent(lessonId)}`;
        if (userId)   filter += `&user_id=eq.${encodeURIComponent(userId)}`;
        const rows = await sb(`/homework_submissions?select=*&order=submitted_at.desc${filter}`);
        res.status(200).json(rows || []); return;
    }

    res.status(404).json({ error: 'Not found' });
};
