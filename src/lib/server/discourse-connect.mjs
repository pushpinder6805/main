import { createHmac, timingSafeEqual } from 'node:crypto';

function signature(payload, secret) {
  if (typeof secret !== 'string' || secret.length < 10) {
    throw new Error('Configure a dedicated DiscourseConnect secret of at least 10 characters.');
  }
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/** Validate the Discourse request before preserving it across website sign-in. */
export function verifyConnectRequest(payload, sig, secret, communityOrigin) {
  if (typeof payload !== 'string' || payload.length > 8192 || !payload.length ||
      typeof sig !== 'string' || !/^[a-f0-9]{64}$/i.test(sig)) {
    throw new Error('Invalid community sign-in request.');
  }
  const expected = Buffer.from(signature(payload, secret), 'hex');
  if (!timingSafeEqual(expected, Buffer.from(sig, 'hex'))) {
    throw new Error('Invalid community sign-in signature.');
  }
  const decoded = Buffer.from(payload, 'base64');
  if (decoded.toString('base64') !== payload) throw new Error('Invalid payload encoding.');
  const params = new URLSearchParams(decoded.toString('utf8'));
  const nonce = params.get('nonce');
  if (!nonce || nonce.length > 256 || params.getAll('nonce').length !== 1 ||
      params.getAll('return_sso_url').length !== 1) {
    throw new Error('Invalid community sign-in nonce.');
  }
  const origin = new URL(communityOrigin);
  if (origin.protocol !== 'https:' || origin.username || origin.password) {
    throw new Error('Community must use HTTPS.');
  }
  const destination = new URL(params.get('return_sso_url'));
  if (destination.origin !== origin.origin || destination.pathname !== '/session/sso_login' ||
      destination.search || destination.hash || destination.username || destination.password) {
    throw new Error('Unexpected community return address.');
  }
  return { nonce, returnUrl: destination.href };
}

/**
 * account must come from verified central identity + the backend account link,
 * never from a browser cookie, form role, username header, or user-editable JWT metadata.
 * Discourse consumes the original nonce and rejects expired/replayed requests.
 */
export function createConnectResponse(request, account, secret, communityOrigin) {
  const incoming = verifyConnectRequest(request.sso, request.sig, secret, communityOrigin);
  if (account.emailVerified !== true || typeof account.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
    throw new Error('Verify your email before entering the community.');
  }
  if (typeof account.externalId !== 'string' || !account.externalId || account.externalId.length > 255) {
    throw new Error('A permanent account identifier is required.');
  }
  const params = new URLSearchParams({
    nonce: incoming.nonce,
    external_id: account.externalId,
    email: account.email,
    require_activation: 'false',
  });
  if (account.username) params.set('username', account.username);
  if (account.name) params.set('name', account.name);
  // Staff privileges and advisor approval are never taken from signup metadata.
  const payload = Buffer.from(params.toString()).toString('base64');
  const url = new URL(incoming.returnUrl);
  url.search = new URLSearchParams({ sso: payload, sig: signature(payload, secret) }).toString();
  return url.toString();
}
