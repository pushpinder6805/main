import { NextResponse } from 'next/server';

export const SESSION_COOKIE = 'worksphere_session';

export function backendOrigin(): string {
  const value = process.env.WORKSPHERE_BACKEND_ORIGIN || 'https://admin.workspherepulse.com';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/') {
    throw new Error('WORKSPHERE_BACKEND_ORIGIN must be an HTTPS origin.');
  }
  return url.origin;
}

export function setSession(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function backendJson(path: string, init: RequestInit = {}) {
  const response = await fetch(`${backendOrigin()}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {'Content-Type': 'application/json', ...(init.headers || {})},
  });
  const data = await response.json().catch(() => ({error: 'The account service returned an invalid response.'}));
  return {response, data};
}
