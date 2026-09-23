'use strict';

// Idempotent migration. Dry-run is the default; use --execute --send-emails
// only after the security migration and a verified backup.
const crypto = require('crypto');

const execute = process.argv.includes('--execute');
const sendEmails = process.argv.includes('--send-emails');
const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || '';
const resendKey = process.env.RESEND_API_KEY || '';
const appOrigin = String(process.env.APP_ORIGIN || 'https://capyenglish.com.br').replace(/\/$/, '');
const emailFrom = process.env.EMAIL_FROM || 'Capy English <contato@capyenglish.com.br>';

if (!supabaseUrl || !serviceKey) {
  console.error('SUPABASE_URL and SUPABASE_SECRET_KEY are required.');
  process.exit(1);
}
if (sendEmails && (!execute || !resendKey)) {
  console.error('--send-emails requires --execute and RESEND_API_KEY.');
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const error = new Error(`request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function normalizeEmail(value) {
  const email = String(value || '').normalize('NFKC').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

async function recordFailure(accountId, reason) {
  if (!execute) return;
  await request('/rest/v1/auth_migration_failures?on_conflict=account_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ account_id: String(accountId), reason: String(reason).slice(0, 120), recorded_at: new Date().toISOString() }),
  });
}

async function linkAccount(accountId, authUserId) {
  await request(`/rest/v1/accounts?id=eq.${encodeURIComponent(accountId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ auth_user_id: authUserId }),
  });
}

async function generateRecovery(email) {
  const result = await request('/auth/v1/admin/generate_link', {
    method: 'POST',
    body: JSON.stringify({
      type: 'recovery',
      email,
      redirect_to: `${appOrigin}/api/auth/callback?next=/set-password.html`,
    }),
  });
  const tokenHash = result?.hashed_token || result?.properties?.hashed_token;
  if (!tokenHash) throw new Error(`recovery token hash was not returned (keys: ${Object.keys(result || {}).join(',')})`);
  return `${appOrigin}/api/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=recovery&next=${encodeURIComponent('/set-password.html')}`;
}

async function sendRecovery(email, name, actionLink) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: emailFrom,
      to: [email],
      subject: 'Defina uma nova senha da Capy English',
      text: `Olá ${name || 'Explorer'}! Por segurança, sua senha antiga foi invalidada. Defina uma nova senha neste link: ${actionLink}`,
    }),
  });
  if (!response.ok) throw new Error(`Resend failed (${response.status})`);
}

async function loadAllAccounts() {
  const rows = [];
  const pageSize = 500;
  for (let start = 0; ; start += pageSize) {
    const page = await request('/rest/v1/accounts?select=id,name,email,auth_user_id&order=id.asc', {
      headers: { Range: `${start}-${start + pageSize - 1}` },
    });
    rows.push(...(page || []));
    if (!Array.isArray(page) || page.length < pageSize) return rows;
  }
}

async function loadAllAuthUsers() {
  const users = [];
  const pageSize = 1000;
  for (let page = 1; ; page++) {
    const result = await request(`/auth/v1/admin/users?page=${page}&per_page=${pageSize}`);
    const batch = result?.users || [];
    users.push(...batch);
    if (batch.length < pageSize) return users;
  }
}

async function main() {
  const [accounts, authUsers] = await Promise.all([loadAllAccounts(), loadAllAuthUsers()]);
  const existingByEmail = new Map(authUsers.map(user => [normalizeEmail(user.email), user]).filter(([email]) => email));
  const counts = new Map();
  for (const account of accounts || []) {
    const email = normalizeEmail(account.email);
    if (email) counts.set(email, (counts.get(email) || 0) + 1);
  }

  const stats = { total: accounts?.length || 0, linked: 0, skipped: 0, invalid: 0, duplicate: 0, failed: 0, emailed: 0, resent: 0 };
  for (const account of accounts || []) {
    const accountRef = crypto.createHash('sha256').update(String(account.id)).digest('hex').slice(0, 12);
    if (account.auth_user_id) {
      stats.skipped++;
      // Already linked from a prior --execute run. If this run also asks to send
      // emails, resend the recovery link — the original run may have skipped it
      // (e.g. linking happened before --send-emails was available/configured).
      if (execute && sendEmails) {
        const email = normalizeEmail(account.email);
        if (email) {
          try {
            const actionLink = await generateRecovery(email);
            await sendRecovery(email, String(account.name || '').slice(0, 80), actionLink);
            stats.resent++;
            console.log(`account ${accountRef}: already linked, recovery resent`);
          } catch (error) {
            console.error(`account ${accountRef}: resend failed (${error.status || 'unknown'}) ${error.message || ''} ${error.data ? JSON.stringify(error.data) : ''}`);
          }
        }
      }
      continue;
    }
    const email = normalizeEmail(account.email);
    if (!email) {
      stats.invalid++;
      await recordFailure(account.id, 'invalid_email');
      console.log(`account ${accountRef}: queued (invalid email)`);
      continue;
    }
    if (counts.get(email) !== 1) {
      stats.duplicate++;
      await recordFailure(account.id, 'duplicate_email');
      console.log(`account ${accountRef}: queued (duplicate email)`);
      continue;
    }
    if (!execute) {
      console.log(`account ${accountRef}: ready`);
      continue;
    }

    try {
      let authUser = existingByEmail.get(email);
      if (!authUser) {
        authUser = await request('/auth/v1/admin/users', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password: crypto.randomBytes(48).toString('base64url'),
            email_confirm: true,
            user_metadata: { name: String(account.name || '').slice(0, 80), migrated_from_legacy: true },
          }),
        });
        existingByEmail.set(email, authUser);
      }
      await linkAccount(account.id, authUser.id);
      stats.linked++;
      if (sendEmails) {
        const actionLink = await generateRecovery(email);
        await sendRecovery(email, String(account.name || '').slice(0, 80), actionLink);
        stats.emailed++;
      }
      console.log(`account ${accountRef}: linked${sendEmails ? ' and recovery sent' : ''}`);
    } catch (error) {
      stats.failed++;
      await recordFailure(account.id, `migration_failed_${error.status || 'unknown'}`);
      console.error(`account ${accountRef}: failed (${error.status || 'unknown'})`);
    }
  }

  console.log(JSON.stringify({ mode: execute ? 'execute' : 'dry-run', sendEmails, ...stats }, null, 2));
  if (!execute) console.log('No data changed. Re-run with --execute after reviewing the reconciliation queue.');
  if (stats.failed) process.exitCode = 2;
}

main().catch(error => {
  console.error(`Migration aborted: ${error.message}`);
  process.exit(1);
});
