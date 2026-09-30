import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyConnectRequest, createConnectResponse } from '../src/lib/server/discourse-connect.mjs';

const secret = 'unit-test-secret-that-is-not-a-real-secret';
const community = 'https://community.example.test';
function signed(raw) {
  const sso = Buffer.from(raw).toString('base64');
  return {sso, sig: createHmac('sha256', secret).update(sso).digest('hex')};
}
const request = signed('nonce=original-nonce&return_sso_url=https%3A%2F%2Fcommunity.example.test%2Fsession%2Fsso_login');
const account = {externalId:'immutable-account-123', email:'verified@example.test', emailVerified:true,
                 name:'A & B', username:'verified_user'};

test('signed request returns the original nonce and only the configured community', () => {
  assert.deepEqual(verifyConnectRequest(request.sso, request.sig, secret, community),
                   {nonce:'original-nonce',returnUrl:community+'/session/sso_login'});
});
test('website identity response is signed and preserves the immutable account ID', () => {
  const url = new URL(createConnectResponse(request, {...account, admin:true}, secret, community));
  const payload = url.searchParams.get('sso');
  assert.equal(url.searchParams.get('sig'), createHmac('sha256',secret).update(payload).digest('hex'));
  const data = new URLSearchParams(Buffer.from(payload,'base64').toString());
  assert.equal(data.get('nonce'),'original-nonce');
  assert.equal(data.get('external_id'), account.externalId);
  assert.equal(data.get('name'), 'A & B');
  assert.equal(data.has('admin'), false);
});
test('rejects unverified email rather than linking an existing community account', () => {
  assert.throws(() => createConnectResponse(request, {...account,emailVerified:false},secret,community));
});
test('rejects missing secret, tampering and malformed signature', () => {
  for (const [sso,sig,key] of [[request.sso,request.sig,''],[request.sso+'A',request.sig,secret],
                              [request.sso,'invalid',secret]]) {
    assert.throws(() => verifyConnectRequest(sso,sig,key,community));
  }
});
test('rejects signed external redirects and duplicate nonce parameters', () => {
  for (const raw of ['nonce=a&return_sso_url=https://evil.example/session/sso_login',
                     'nonce=a&nonce=b&return_sso_url='+community+'/session/sso_login',
                     'nonce=a&return_sso_url='+community+'/session/sso_login?next=evil',
                     'return_sso_url='+community+'/session/sso_login']) {
    const r=signed(raw);
    assert.throws(() => verifyConnectRequest(r.sso,r.sig,secret,community));
  }
});
test('rejects missing permanent account identifiers', () => {
  assert.throws(() => createConnectResponse(request,{...account,externalId:''},secret,community));
});
