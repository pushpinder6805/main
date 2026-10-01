import { NextRequest, NextResponse } from 'next/server';
import { backendOrigin, SESSION_COOKIE } from '@/lib/server/backend-auth';

const ALLOWED = ['profile/', 'skills/', 'advisors/', 'appointments/', 'conversations/', 'audio/'];

async function proxy(request: NextRequest, context: {params: Promise<{path: string[]}>}) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error: 'Sign in to continue.'}, {status: 401});
  const path = (await context.params).path.join('/');
  if (!ALLOWED.some(prefix => `${path}/`.startsWith(prefix))) {
    return NextResponse.json({error: 'Unsupported API route.'}, {status: 404});
  }
  const url = `${backendOrigin()}/api/v1.0/${path}/${request.nextUrl.search}`;
  const headers: Record<string, string> = {Authorization: `Bearer ${token}`};
  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  const upstream = await fetch(url, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });
  return new NextResponse(upstream.body, {status: upstream.status,
    headers: {'Content-Type': upstream.headers.get('content-type') || 'application/json'}});
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
