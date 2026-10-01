import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { verifyDiscoursePayload } from '@/lib/discourse-auth';
import { backendJson, setSession } from '@/lib/server/backend-auth';

export async function GET(request: NextRequest) {
  const sso = request.nextUrl.searchParams.get('sso');
  const sig = request.nextUrl.searchParams.get('sig');
  if (!sso || !sig) return NextResponse.redirect(new URL('/login?error=missing_params', request.url));

  const user = verifyDiscoursePayload(sso, sig);
  if (!user) return NextResponse.redirect(new URL('/login?error=invalid_signature', request.url));

  const exchangeSecret = process.env.CENTRAL_AUTH_WEBSITE_EXCHANGE_SECRET || '';
  if (exchangeSecret.length < 32) {
    return NextResponse.redirect(new URL('/login?error=community_exchange_unavailable', request.url));
  }
  const body = JSON.stringify({
    external_id: String(user.id),
    username: user.username,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url || '',
  });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac('sha256', exchangeSecret).update(`${timestamp}.${body}`).digest('hex');
  const {response: backendResponse, data} = await backendJson('/auth/discourse/exchange/', {
    method: 'POST',
    body,
    headers: {
      'X-Worksphere-Timestamp': timestamp,
      'X-Worksphere-Signature': signature,
    },
  });
  if (!backendResponse.ok || !data.access_token) {
    return NextResponse.redirect(new URL('/login?error=community_exchange_failed', request.url));
  }

  const requested = request.nextUrl.searchParams.get('return_to') || '/program/dashboard';
  const returnTo = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/program/dashboard';
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  setSession(response, data.access_token);
  return response;
}
