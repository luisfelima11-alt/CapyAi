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
