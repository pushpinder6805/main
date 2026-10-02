import {NextRequest, NextResponse} from 'next/server';
import {backendOrigin, SESSION_COOKIE} from '@/lib/server/backend-auth';

function permitted(path: string, method: string): boolean {
  if (method === 'GET' && path === 'config') return true;
  if (method === 'POST' && path === 'bookings') return true;
  if (method === 'POST' && /^appointments\/\d+\/prepare$/.test(path)) return true;
  if (method === 'GET' && path === 'sessions') return true;
  if (method === 'GET' && path === 'advisor/status') return true;
  if (method === 'POST' && path === 'advisor/onboard') return true;
  return false;
}

async function proxy(request: NextRequest, context: {params: Promise<{path: string[]}>}) {
  const path = (await context.params).path.join('/');
  if (!permitted(path, request.method)) return NextResponse.json({error: 'Unsupported payment route.'}, {status: 404});
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (path !== 'config' && !token) return NextResponse.json({error: 'Sign in to continue.'}, {status: 401});
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  const upstream = await fetch(`${backendOrigin()}/payments/${path}/`, {
    method: request.method,
    headers,
    body: request.method === 'GET' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });
  return new NextResponse(upstream.body, {status: upstream.status,
    headers: {'Content-Type': upstream.headers.get('content-type') || 'application/json'}});
}

export const GET = proxy;
export const POST = proxy;
