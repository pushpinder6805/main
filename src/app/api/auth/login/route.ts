import { NextRequest, NextResponse } from 'next/server';
import { backendJson, setSession } from '@/lib/server/backend-auth';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const {response, data} = await backendJson('/auth/login/', {method: 'POST', body});
  const result = NextResponse.json(data.access_token ? {user: data.user} : data, {status: response.status});
  if (response.ok && data.access_token) setSession(result, data.access_token);
  return result;
}
