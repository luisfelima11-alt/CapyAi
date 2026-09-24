// ════════════════════════════════════════════════════════════════════════════
// dev-server.js — local development server
// ════════════════════════════════════════════════════════════════════════════
// Serves the static site and delegates every /api/* request to the SAME
// handler that runs in production (api/index.js), so local behaviour matches
// Vercel (auth, rate limits, magic link, TTS...).
//
// Usage:  node scripts/dev-server.js      → http://localhost:8765
// Env:    .env in the repo root (see .env.example)
// ════════════════════════════════════════════════════════════════════════════
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

// Root of the project (one level up from scripts/)
const ROOT = path.join(__dirname, '..');

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

const PORT = process.env.PORT || 8765;

// Dev-only defaults — must be set BEFORE api/index.js is required.
process.env.CAPY_DEV = '1';   // allows magic-link devLink in the response
if (!process.env.APP_URL) process.env.APP_URL = `http://localhost:${PORT}`;
if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  SESSION_SECRET not set — using a random one (sessions reset on restart).');
}
if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is not set — AI features will return 503. Static pages still work.');
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.warn('⚠️  SUPABASE_URL / SUPABASE_KEY not set — login and saved progress will not work.');
}

const apiHandler = require('../api/index.js');

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
    '.ico':  'image/x-icon',
    '.mp4':  'video/mp4',
    '.webp': 'image/webp',
};

// Minimal shims for the helpers Vercel's Node runtime adds to `res`.
function addVercelShims(res) {
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (obj) => {
        if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
        return res;
    };
}

function serveStatic(req, res) {
    let pathname;
    try { pathname = decodeURIComponent(req.url.split('?')[0]); }
    catch (e) { res.writeHead(400); res.end('Bad Request'); return; }
    if (pathname === '/') pathname = '/4_Login_Capy_Yara_Welcomes_You.html';

    // Only serve files inside ROOT, never dotfiles (.env, .git) or server code.
    const filePath = path.resolve(ROOT, '.' + pathname);
    const rel = path.relative(ROOT, filePath);
    const blocked = rel.startsWith('..') || path.isAbsolute(rel)
        || rel.split(path.sep).some(seg => seg.startsWith('.'))
        || /^(api|scripts|supabase|node_modules)(\/|\\|$)/.test(rel);
    if (blocked) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404 Not Found'); return; }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500, { 'Content-Type': 'text/plain' });
            res.end(error.code === 'ENOENT' || error.code === 'EISDIR' ? '404 Not Found' : 'Server Error');
            return;
        }
        const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
        res.end(content);
    });
}

const handler = (req, res) => {
    if (req.url.startsWith('/api/')) {
        addVercelShims(res);
        Promise.resolve(apiHandler(req, res)).catch(err => {
            console.error('[dev-server] API error:', err);
            if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: 'internal_error' })); }
        });
        return;
    }
    serveStatic(req, res);
};

module.exports = handler;

// ── Start HTTP server only when run directly ─────────────────────────────────
if (require.main === module) {
    const server = http.createServer(handler);
    server.on('error', (err) => {
        console.error(err.code === 'EADDRINUSE' ? `❌ Port ${PORT} is already in use.` : '❌ Server error:', err.code === 'EADDRINUSE' ? '' : err);
        process.exit(1);
    });
    server.listen(PORT, () => {
        console.log(`✅ Capy English running at http://localhost:${PORT}/ (API = api/index.js)`);
    });
}
