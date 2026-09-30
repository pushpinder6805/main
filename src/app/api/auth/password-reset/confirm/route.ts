import {NextRequest, NextResponse} from 'next/server';
import {backendJson, clearSession} from '@/lib/server/backend-auth';

export async function POST(request: NextRequest) {
  const {response, data} = await backendJson('/auth/password-reset/confirm/', {method: 'POST', body: await request.text()});
  const result = NextResponse.json(data, {status: response.status});
  if (response.ok) clearSession(result);
  return result;
}
