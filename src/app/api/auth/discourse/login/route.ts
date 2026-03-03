import { NextRequest, NextResponse } from 'next/server';
import { getDiscourseLoginUrl } from '@/lib/discourse-auth';

export async function GET(request: NextRequest) {
  const returnUrl = request.nextUrl.searchParams.get('return_url') || `${request.nextUrl.origin}/admin/chat`;

  const loginUrl = getDiscourseLoginUrl(returnUrl);

  return NextResponse.redirect(loginUrl);
}
