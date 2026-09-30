import { NextRequest, NextResponse } from 'next/server';
import { backendJson, clearSession, SESSION_COOKIE } from '@/lib/server/backend-auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({user: null}, {status: 401});
  const {response, data} = await backendJson('/auth/me/', {
    headers: {Authorization: `Bearer ${token}`},
  });
  const result = NextResponse.json(response.ok ? data : {user: null}, {status: response.status});
  if (response.status === 401) clearSession(result);
  return result;
}
