-- ════════════════════════════════════════════════════════════════════════════
-- 0002_purge_legacy_passwords.sql
-- ════════════════════════════════════════════════════════════════════════════
-- Run AFTER the Phase 0 code is live in production.
-- The old /api/db/accounts endpoint exposed these base64 (= plain text)
-- passwords, so they are no longer accepted and must not be kept.
-- Users of old accounts sign in with the e-mail link and create a new password.
-- ════════════════════════════════════════════════════════════════════════════
update public.accounts set password = null where password is not null;
