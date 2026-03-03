import { NextRequest, NextResponse } from 'next/server';
import { getDiscourseLoginUrl } from '@/lib/discourse-auth';

export async function GET(request: NextRequest) {
  try {
    const returnUrl = request.nextUrl.searchParams.get('return_url') || `${request.nextUrl.origin}/admin/chat`;

    console.log('Login attempt - return URL:', returnUrl);
    console.log('Discourse secret configured:', !!process.env.DISCOURSE_CONNECT_SECRET);

    const loginUrl = getDiscourseLoginUrl(returnUrl);

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(new URL('/admin/chat?error=login_failed', request.url));
  }
}
