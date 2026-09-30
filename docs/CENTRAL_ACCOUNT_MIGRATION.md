# Central Worksphere accounts — migration assessment, 2026-09-30

Status: central account candidate implemented and tested. Not deployed; live login unchanged.
Branch: 2026-09-30-central-account-sso (name delegated by user).

## Verified current systems

- Website: pushpinder6805/main, Next.js 15.2.6, deployed as Vercel project
  prj_qrcDEzNXNSkrl0PW3QRsLuX8gGpI in team_zOepxKKNT4QOEdske7AbtSeK.
  The latest returned production deployment aliases workspherepulse.com.
- Website login currently uses Discourse as identity provider. A readable JSON
  cookie/localStorage object supplies client identity and role; this is not a
  verifiable backend credential. api-client.ts sends a username header to the old
  backend. The new backend correctly rejects a username header alone.
- Website program screens write advisor/application/appointment data directly to
  a separate Supabase database. That does not update Django onboarding or approval.
  Supabase URL in source: https://myjmjcrtgwkkqgwdirec.supabase.co; hostname not
  resolving during assessment. Active project/configuration must be confirmed.
- Website rate schema describes hourly rates; the app/backend use USD per minute.
  Preserve units explicitly and convert any historical rates with an audited rule.
- App/backend copies: pushpinder6805/WSP and WSP-backend. Current API:
  https://admin.workspherepulse.com. Backend role/approval fixes deployed on Sept 30.
- Build 16 uses Discourse user-API credentials and needs a new binary for central
  website authentication. Current users must keep working during staged migration.

## Target ownership

1. Website presents signup, email verification, login, password recovery, account
   settings, advisor expertise/rate/availability form, and waiting-for-approval page.
2. Django supplies the permanent public account ID, hashed-password authentication,
   verified-email challenges, revocable bearer sessions and password recovery.
   Raw session tokens are stored only in an HttpOnly Secure website cookie and as
   SHA-256 digests in Django. The unavailable Supabase project is not an identity dependency.
3. Django links the public account identity to the existing User ID and remains authoritative
   for customer/advisor role, submitted onboarding, admin approval, meetings,
   payments and wallet ledger. Client metadata can request advisor application;
   it cannot set approval, staff status, ownership or balances.
4. Website authenticated server routes call the same Django APIs as the app.
   Remove direct program-table writes to Supabase. Keep unrelated website content
   and support chat separate from the booking/account migration.
5. Discourse consumes website login through DiscourseConnect. Permanent external_id
   and verified email preserve the community-account mapping. No staff privileges
   are taken from signup metadata. Sign-in must respect backend approval gates.
6. App uses a browser-based authorization flow with PKCE/state and an allowlisted
   callback. No access/refresh tokens in navigation query strings. Tokens stored
   in platform-secure storage. Same backend profile controls onboarding/approval.

## Account migration

- Inventory identities and establish a one-to-one central subject -> backend user
  -> Discourse user link. Keep existing database IDs, bookings and ledger entries.
- Prove ownership before linking. Do not merge by a client-supplied username,
  display name, unverified email or editable user metadata. Existing Discourse
  sign-in can serve as a transitional proof alongside verified central sign-in.
- Export/backup existing website advisor and booking records before disabling
  its old program writes; reconcile them with backend records, including rates,
  payment provenance and duplicate accounts. No balances should be invented.
- Original production history that was never imported into the new backend is
  still a separate data migration; central login does not restore it automatically.

## Implementation and rollout sequence

1. Configure production email delivery and the website/backend origins. Establish
   server-side authenticated website sessions.
2. Add backend identity links and verified bearer authentication alongside current
   app authentication. Test identity mismatch, revoked/expired sessions, duplicate
   links and persistence of approvals/history.
3. Build website login/signup/recovery and backend-powered onboarding/waiting UI.
   Point dashboard/history to backend APIs, remove fake refill/withdraw buttons.
4. Wire the tested DiscourseConnect protocol helper to verified server sessions
   and backend identity links; configure its dedicated secret in website and
   Discourse. Preserve the original signed request/nonce through login safely.
5. Implement the app authorization callback and backend tokens, preserving forum
   access and existing features. Archive/sign and upload the new TestFlight build.
6. Test a real customer and advisor across website/app/community, including
   email verification, submission, pending denial, backend approval, re-login,
   booking/history and logout. Switch Discourse login only after these pass and
   an admin recovery route is verified. Keep a documented rollback.

## Implemented in the candidate branches

- Django signup, email verification, login, revocable sessions, logout and password
  recovery endpoints. Advisor signup creates a pending advisor and never self-approves.
- Website server routes keep bearer tokens in an HttpOnly Secure SameSite cookie.
  Login, signup, verification, recovery, backend-powered advisor onboarding and the
  approval waiting page are implemented.
- The signed DiscourseConnect provider route validates HMAC using timing-safe comparison,
  checks the nonce and fixed community return address, and supplies the permanent public ID.
- The Next.js production build, six protocol tests and 64 Django/backend tests pass.

## External prerequisites not yet verified

- Production email delivery configuration and verified sender/domain.
- Discourse administrator settings access to enable consumer SSO and set a secret.
- Actual website program data inventory/migration; no private rows were queried.

References:
- https://meta.discourse.org/t/setup-discourseconnect-official-single-sign-on-for-discourse-sso/13045
- https://supabase.com/docs/guides/auth/server-side
- https://supabase.com/docs/guides/auth/native-mobile-deep-linking
