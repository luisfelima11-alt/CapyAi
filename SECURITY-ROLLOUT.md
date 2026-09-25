# Security rollout runbook

This runbook separates code that is already implemented from production actions
that require account-owner access. Never paste secrets, reset links, email addresses,
or raw request bodies into tickets or logs.

## Release 1 — containment

1. Preserve Vercel and Supabase logs before changing retention.
2. Deploy the current code to a preview and run `npm run security:check` and
   `npm run test:e2e:security`.
3. Verify that `/api/db/accounts` returns `410`, while `/database.json`, `/.env`,
   `/auth.js`, and traversal attempts return `404`.
4. Deploy to production only after the preview checks pass.
5. Rotate, in this order, the Supabase secret/service key, OpenAI, Resend, Kiwify,
   VAPID, cron secret, and cookie/IP hashing secrets. Add new environment values,
   deploy, verify, then revoke old values.
6. Preserve an encrypted evidence copy of legacy data with access logging. Do not
   retain it in the repository or Vercel build context.

Rollback: restore the previous deployment only if it does not restore the account
dump or shared-key endpoints. Otherwise keep the containment release and fix forward.

## Release 2 — schema and account migration

1. Take and restore-test a Supabase backup.
2. Apply every file in `supabase/migrations` in filename order. They install the
   RLS baseline, atomic rate limiting and webhook claims, public-only leaderboard,
   and column-level privileges.
3. Run `npm run auth:migrate:dry-run`. Resolve every invalid or duplicate email in
   `auth_migration_failures`; never merge accounts automatically.
4. Run `node scripts/migrate-to-supabase-auth.js --execute` to create/link Auth
   users without sending mail. Compare total accounts, linked users, profiles,
   progress rows, plans, and homework counts.
5. After reconciliation, run the same command with `--execute --send-emails`.
   Existing passwords are never read or imported; every user must choose a new one.
6. Apply `supabase/manual/retire_legacy_credentials.sql` only when its precondition
   succeeds and reset delivery has been reviewed.

Rollback: restore the database backup and disable email delivery. Auth users created
during a failed dry migration may be left disabled until reconciliation; do not
re-enable legacy passwords.

## Release 3 — Auth, roles, MFA, and RLS

1. Configure the exact `APP_ORIGIN`, PKCE redirect allowlist, short access-token
   lifetime, refresh-token rotation, password length of 12+, and leaked-password
   protection in Supabase.
2. Set `app_metadata.role` to `admin` or `teacher` only through the Supabase admin
   API. Never accept role changes from user metadata or browser requests.
3. Enroll individual staff accounts in MFA. Production admin APIs reject sessions
   whose JWT does not have `aal2`.
4. Verify with two test users that neither can read or mutate the other's state,
   profile, plan, or homework. Verify admin/student and teacher/student role tests.
5. Inspect every exposed table in Supabase and confirm RLS is enabled and there are
   no permissive legacy policies. Ordinary browser traffic must not use the service
   role; the server-only client is reserved for webhooks, cron, migration, and admin.

## Release 4 — browser hardening

The Vercel configuration enforces HSTS, frame blocking, MIME protection, referrer
and permissions policies, plus a compatibility CSP for legacy lesson pages.

Phase one is implemented for login, password reset, account, admin, admin metrics,
and teacher homework: Tailwind and Chart.js are local, scripts and event handlers are
externalized, and the route-specific CSP uses `script-src 'self'` with
`script-src-attr 'none'`. Rebuild these assets with `npm run build:security-assets`.

The remaining work is to self-host the Google fonts, replace dynamic `style=`
attributes, and migrate the lesson pages in reviewed groups. Keep the compatibility
CSP for those legacy pages until preview testing reports no violations; then remove
`'unsafe-inline'` and executable CDN origins globally.

The service worker never caches API or HTML responses. Keep auth callbacks, admin
pages, and personal data network-only.

## Incident review

Search Vercel and Supabase logs for requests to `/api/db/accounts`,
`/database.json`, unexpected profile/state identifiers, shared-key query parameters,
and anomalous exports. Record timestamps, actor/IP hashes, response sizes, and scope
without copying personal data into the report. If access to personal data may have
occurred, escalate to the data-protection/legal owner for LGPD notification analysis.

History rewriting and force-pushing are repository-owner operations. After the
encrypted evidence copy is verified, use a reviewed history-rewrite procedure,
coordinate with every collaborator, invalidate existing clones, and run secret
scanning against the rewritten full history before reopening pushes.

## Release 5 — 2026-09-24 audit (branch `claude/security-hardening`)

Deploy order:

1. Run `supabase/migrations/202609240001_release1_hardening.sql` in the Supabase
   SQL editor **before** deploying: markup check on `accounts.name/avatar`,
   `revoke execute on current_account_id() from anon`, and the
   `tokens_in/tokens_out` columns the metrics code now writes.
2. Deploy to Preview, then production. `ADMIN_KEY` is no longer read (delete it);
   `CRON_SECRET` only opens the two cron routes now. Optional knobs:
   `VOZ_SESSAO_MAX_MIN` (default 30) and `VOZ_USD_POR_MIN_PISO` (default 0.02).
3. Open `/admin.html`, use the "Ativar agora" banner to enrol an authenticator
   and keep its secret in a password manager. Then set `ADMIN_REQUIRE_MFA=true`
   and redeploy: admin routes require `aal2` from then on. Lost phone: delete
   the factor in Supabase (Authentication → Users) and enrol again.

Checks after deploy:

- `curl -sI https://www.capyenglish.com.br/admin.html | grep -i content-security`
  shows `script-src 'self';` (the compatibility CSP no longer matches the six
  hardened pages).
- A Kiwify test webhook lands in `webhook_events` (signature is read from
  `?signature=` or the header).
- `/.well-known/security.txt` is served; `voice-test.html` and
  `pixel_preview.html` are not.

Owner actions outside the code: make the GitHub repository private (the old
history still holds student e-mails), MFA on every platform account, SPF/DKIM
(Resend) and DMARC `p=none` on the domain plus MX forwarding for
`contato@`/`privacidade@` (published on the site, currently undeliverable),
"Confirm email" on in Supabase Auth, and a monthly spending limit at OpenAI.

## Release 5b — prompts for 16+ and the visitor invitation (2026-09-25, same branch)

No migration. It ships together with Release 5.

Checks after deploy (the AI text itself can only be judged with the real key):

- Open `ai_quiz.html`, `story_time.html`, `daily_challenge.html`,
  `3_Dialogue_Expedition_Yara_Turn.html` and the flashcards page (AI deck +
  translate). Content is written for adults and no page falls back to its
  error state.
- The word of the day and the daily challenge vary from day to day; the old
  single examples ("Butterfly", "Use a Brave Word!") are gone from the prompts.
- In a private window, continue as a visitor and use AI 3 times, with more
  than a minute before the 3rd (visitors get 2 per minute). The 4th use shows
  the "Criar conta grátis" invitation, and its button opens the signup tab.

Env note: the API reads `SUPABASE_SECRET_KEY` and falls back to `SUPABASE_KEY`
(`api/index.js`, `api/security.js`). Delete `SUPABASE_KEY` on Vercel only after
confirming that `SUPABASE_SECRET_KEY` is set for Production and Preview:
otherwise every database call fails.
