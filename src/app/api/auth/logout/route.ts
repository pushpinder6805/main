import { NextRequest, NextResponse } from 'next/server';
import { backendJson, clearSession, SESSION_COOKIE } from '@/lib/server/backend-auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) await backendJson('/auth/logout/', {method: 'POST', headers: {Authorization: `Bearer ${token}`}});
  const result = NextResponse.json({success: true});
  clearSession(result);
  return result;
}
