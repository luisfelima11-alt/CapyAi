#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
// mock-supabase.js — tiny in-memory stand-in for Supabase's REST API (PostgREST)
// ════════════════════════════════════════════════════════════════════════════
// Supports exactly what api/index.js uses: filters (eq, gte, is.null),
// select (columns or *), order, limit, POST insert/upsert
// (Prefer: resolution=merge-duplicates), PATCH, and return=representation.
// Also enforces the unique lower(email) index from supabase/migrations/0001.
//
// Local dev without a real database:
//   node scripts/mock-supabase.js            (port 54321)
//   SUPABASE_URL=http://localhost:54321 SUPABASE_KEY=dev node scripts/dev-server.js
// Data lives in memory only and is lost on restart.
// ════════════════════════════════════════════════════════════════════════════
const http   = require('http');
const crypto = require('crypto');

const PRIMARY_KEYS = {
    accounts:             ['id'],
    user_state:           ['user_id'],
    user_profiles:        ['id'],
    rate_limit_log:       ['bucket'],
    api_metrics_daily:    ['day', 'endpoint'],
    magic_link_tokens:    ['token'],
    homework_submissions: ['id'],
};

function createStore() {
    const tables = {};
    Object.keys(PRIMARY_KEYS).forEach(t => { tables[t] = []; });
    return tables;
}

function pgError(res, status, code, message) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code, message, details: null, hint: null }));
}

function parseFilters(params) {
    const filters = [];
    for (const [key, raw] of params.entries()) {
        if (['select', 'order', 'limit', 'on_conflict'].includes(key)) continue;
        const dot = raw.indexOf('.');
        filters.push({ col: key, op: raw.slice(0, dot), val: raw.slice(dot + 1) });
    }
    return filters;
}

function matches(row, filters) {
    return filters.every(({ col, op, val }) => {
        const v = row[col];
        if (op === 'eq')  return v != null && String(v) === val;
        if (op === 'gte') return v != null && String(v) >= val;
        if (op === 'is')  return val === 'null' ? v == null : String(v) === val;
        return false;
    });
}

function project(row, select) {
    if (!select || select === '*') return { ...row };
    const out = {};
    select.split(',').map(s => s.trim()).filter(Boolean).forEach(c => { out[c] = row[c] === undefined ? null : row[c]; });
    return out;
}

function sortRows(rows, order) {
    if (!order) return rows;
    const keys = order.split(',').map(part => {
        const [col, dir] = part.split('.');
        return { col, desc: dir === 'desc' };
    });
    return rows.slice().sort((a, b) => {
        for (const { col, desc } of keys) {
            if (a[col] === b[col]) continue;
            const r = a[col] > b[col] ? 1 : -1;
            return desc ? -r : r;
        }
        return 0;
    });
}

function createServer(store = createStore()) {
    let homeworkSeq = 1;

    function emailTaken(table, row, exceptRow) {
        if (table !== 'accounts' || !row.email) return false;
        const e = String(row.email).toLowerCase();
        return store.accounts.some(r => r !== exceptRow && String(r.email || '').toLowerCase() === e);
    }

    const server = http.createServer((req, res) => {
        const u = new URL(req.url, 'http://localhost');
        const m = u.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
        if (!m) return pgError(res, 404, 'PGRST000', 'not found');
        const table = m[1];
        if (!store[table]) return pgError(res, 404, '42P01', `relation "public.${table}" does not exist`);
        if (!req.headers.apikey) return pgError(res, 401, 'PGRST301', 'missing apikey');

        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const prefer = String(req.headers.prefer || '');
            const wantRows = prefer.includes('return=representation');
            const filters = parseFilters(u.searchParams);
            const rows = store[table];

            if (req.method === 'GET') {
                let out = sortRows(rows.filter(r => matches(r, filters)), u.searchParams.get('order'));
                const limit = parseInt(u.searchParams.get('limit') || '0', 10);
                if (limit > 0) out = out.slice(0, limit);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(out.map(r => project(r, u.searchParams.get('select')))));
            }

            let payload;
            try { payload = body ? JSON.parse(body) : null; } catch (e) { return pgError(res, 400, 'PGRST102', 'invalid json'); }

            if (req.method === 'POST') {
                const items = Array.isArray(payload) ? payload : [payload];
                const upsert = prefer.includes('resolution=merge-duplicates');
                const pk = PRIMARY_KEYS[table];
                const written = [];
                for (const item of items) {
                    const row = { ...item };
                    if (table === 'accounts') {
                        if (!row.id) row.id = crypto.randomUUID();
                        if (row.session_version == null) row.session_version = 1;
                    }
                    if (table === 'homework_submissions' && row.id == null) row.id = homeworkSeq++;
                    const existing = rows.find(r => pk.every(k => r[k] === row[k]));
                    if (existing && !upsert) return pgError(res, 409, '23505', 'duplicate key value violates unique constraint');
                    if (emailTaken(table, row, existing)) return pgError(res, 409, '23505', 'duplicate key value violates unique constraint "accounts_email_lower_key"');
                    if (existing) { Object.assign(existing, row); written.push(existing); }
                    else { rows.push(row); written.push(row); }
                }
                if (wantRows) { res.writeHead(201, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(written)); }
                res.writeHead(201); return res.end();
            }

            if (req.method === 'PATCH') {
                const target = rows.filter(r => matches(r, filters));
                for (const r of target) {
                    if (emailTaken(table, { ...r, ...payload }, r)) return pgError(res, 409, '23505', 'duplicate key');
                    Object.assign(r, payload);
                }
                if (wantRows) { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(target)); }
                res.writeHead(204); return res.end();
            }

            if (req.method === 'DELETE') {
                store[table] = rows.filter(r => !matches(r, filters));
                res.writeHead(204); return res.end();
            }

            pgError(res, 405, 'PGRST000', 'method not allowed');
        });
    });
    return { server, store };
}

module.exports = { createServer, createStore };

if (require.main === module) {
    const port = Number(process.env.MOCK_SUPABASE_PORT || 54321);
    createServer().server.listen(port, () => {
        console.log(`🧪 Mock Supabase REST at http://localhost:${port} (in-memory)`);
    });
}
