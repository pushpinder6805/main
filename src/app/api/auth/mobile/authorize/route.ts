import { NextRequest, NextResponse } from 'next/server';
import { backendJson, SESSION_COOKIE } from '@/lib/server/backend-auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error: 'Sign in to continue.'}, {status: 401});

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({error: 'Invalid authorization request.'}, {status: 400});
  }
  const {response, data} = await backendJson('/auth/mobile/authorize/', {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`},
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, {status: response.status});
}
