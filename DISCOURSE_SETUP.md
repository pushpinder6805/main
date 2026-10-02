# Workspherepulse community single sign-on

The Worksphere website and Django backend are the only account authority. Discourse
consumes those accounts through DiscourseConnect; it never authenticates the website.

## Production settings

Configure these settings in the Discourse administration panel:

- `enable_discourse_connect`: enabled
- `discourse_connect_url`: `https://workspherepulse.com/api/auth/discourse/connect`
- `discourse_connect_secret`: the same random value stored in Vercel as
  `DISCOURSE_CONNECT_PROVIDER_SECRET`
- `auth_overrides_email`: enabled
- `auth_overrides_username`: enabled
- `auth_overrides_name`: enabled
- `auth_skip_create_confirm`: enabled

Keep at least one documented Discourse administrator recovery path before enabling
DiscourseConnect. Never commit or paste the shared secret into source control or chat.

## User flow

1. A visitor selects Community on the website.
2. Discourse sends a signed, single-use nonce to the website provider endpoint.
3. The website asks the visitor to sign in with their Worksphere account if needed.
4. The website loads the verified backend identity and signs the DiscourseConnect response.
5. Discourse creates or updates the matching community account using the backend public ID.

Email must be verified before community access. The response never grants administrator,
moderator, advisor approval, or other privileged roles.
