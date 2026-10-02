import {NextRequest, NextResponse} from 'next/server';
import {backendJson, SESSION_COOKIE} from '@/lib/server/backend-auth';
import {createConnectResponse, verifyConnectRequest} from '@/lib/server/discourse-connect.mjs';

const COMMUNITY_ORIGIN = process.env.DISCOURSE_ORIGIN || 'https://community.workspherepulse.com';

export async function GET(request: NextRequest) {
  const sso = request.nextUrl.searchParams.get('sso') || '';
  const sig = request.nextUrl.searchParams.get('sig') || '';
  const secret = process.env.DISCOURSE_CONNECT_PROVIDER_SECRET
    || process.env.DISCOURSE_CONNECT_SECRET
    || '';
  try {
    verifyConnectRequest(sso, sig, secret, COMMUNITY_ORIGIN);
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const returnTo = request.nextUrl.pathname + request.nextUrl.search;
      return NextResponse.redirect(new URL(`/login?return_to=${encodeURIComponent(returnTo)}`, request.url));
    }
    const {response, data} = await backendJson('/auth/me/', {headers: {Authorization: `Bearer ${token}`}});
    if (!response.ok || !data.user) {
      const result = NextResponse.redirect(new URL('/login', request.url));
      result.cookies.delete(SESSION_COOKIE);
      return result;
    }
    const destination = createConnectResponse({sso, sig}, {
      externalId: data.user.id,
      email: data.user.email,
      emailVerified: data.user.email_verified,
      username: data.user.username,
      name: data.user.name,
    }, secret, COMMUNITY_ORIGIN);
    return NextResponse.redirect(destination);
  } catch {
    return NextResponse.json({error: 'Invalid community sign-in request.'}, {status: 400});
  }
}
