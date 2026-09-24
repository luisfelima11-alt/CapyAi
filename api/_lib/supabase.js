// Supabase REST (PostgREST) helpers — server-side only (service role key).
// Env: SUPABASE_URL, SUPABASE_KEY (service role; never expose client-side).

// Low-level call: always resolves to { ok, status, data }.
async function sbRequest(path, opts = {}) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    if (!url || !key) return { ok: false, status: 503, data: null };
    try {
        const r = await fetch(`${url}/rest/v1${path}`, {
            ...opts,
            headers: {
                'apikey':        key,
                'Authorization': `Bearer ${key}`,
                'Content-Type':  'application/json',
                ...(opts.headers || {}),
            },
        });
        const text = r.status === 204 ? '' : await r.text();
        let data = null;
        if (text) { try { data = JSON.parse(text); } catch (e) { data = null; } }
        return { ok: r.ok, status: r.status, data };
    } catch (e) {
        return { ok: false, status: 502, data: null };
    }
}

// Convenience wrapper kept for existing call sites: returns parsed JSON or null.
// NOTE: on PostgREST errors this returns the error object (not an array) —
// callers that need rows must check Array.isArray().
async function sb(path, opts = {}) {
    const { data } = await sbRequest(path, opts);
    return data;
}

// Rows helper: always an array (empty on error).
async function sbRows(path, opts = {}) {
    const { ok, data } = await sbRequest(path, opts);
    return ok && Array.isArray(data) ? data : [];
}

module.exports = { sbRequest, sb, sbRows };
