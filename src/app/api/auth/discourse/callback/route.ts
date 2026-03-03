import { NextRequest, NextResponse } from 'next/server';
import { verifyDiscoursePayload } from '@/lib/discourse-auth';

async function fetchUserRole(username: string): Promise<string> {
  try {
    const response = await fetch(`https://community.workspherepulse.com/u/${username}.json`, {
      headers: {
        'Api-Key': process.env.DISCOURSE_API_KEY || '',
        'Api-Username': 'system',
      },
    });

    if (!response.ok) return 'user';

    const data = await response.json();
    const userFields = data.user?.user_fields;

    if (userFields && userFields['2']) {
      const role = userFields['2'].toLowerCase();
      if (role === 'advisor') return 'advisor';
      if (role === 'admin') return 'admin';
    }

    return 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
}

export async function GET(request: NextRequest) {
  const sso = request.nextUrl.searchParams.get('sso');
  const sig = request.nextUrl.searchParams.get('sig');

  if (!sso || !sig) {
    return NextResponse.redirect(new URL('/program/login?error=missing_params', request.url));
  }

  const user = verifyDiscoursePayload(sso, sig);

  if (!user) {
    return NextResponse.redirect(new URL('/program/login?error=invalid_signature', request.url));
  }

  const role = await fetchUserRole(user.username);

  const userData = {
    ...user,
    role,
    is_advisor: role === 'advisor',
    is_admin: role === 'admin',
  };

  let redirectUrl = '/program/dashboard';

  if (role === 'admin') {
    redirectUrl = '/admin/chat';
  } else if (role === 'advisor') {
    redirectUrl = '/program/advisor-dashboard';
  }

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));

  response.cookies.set('discourse_user', JSON.stringify(userData), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
