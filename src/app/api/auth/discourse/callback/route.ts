import { NextRequest, NextResponse } from 'next/server';
import { verifyDiscoursePayload } from '@/lib/discourse-auth';

export async function GET(request: NextRequest) {
  const sso = request.nextUrl.searchParams.get('sso');
  const sig = request.nextUrl.searchParams.get('sig');

  if (!sso || !sig) {
    return NextResponse.redirect(new URL('/admin/chat?error=missing_params', request.url));
  }

  const user = verifyDiscoursePayload(sso, sig);

  if (!user) {
    return NextResponse.redirect(new URL('/admin/chat?error=invalid_signature', request.url));
  }

  const response = NextResponse.redirect(new URL('/admin/chat?auth=success', request.url));

  response.cookies.set('discourse_user', JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
