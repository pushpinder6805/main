import { NextRequest, NextResponse } from 'next/server';
import { getDiscourseLoginUrl } from '@/lib/discourse-auth';

export async function GET(request: NextRequest) {
  try {
    const requested = request.nextUrl.searchParams.get('return_to') || '/program/dashboard';
    const returnTo = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/program/dashboard';
    const callback = new URL('/api/auth/discourse/callback', request.nextUrl.origin);
    callback.searchParams.set('return_to', returnTo);
    const loginUrl = getDiscourseLoginUrl(callback.href);

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(new URL('/admin/chat?error=login_failed', request.url));
  }
}
