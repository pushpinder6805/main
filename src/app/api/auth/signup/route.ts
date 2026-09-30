import { NextRequest, NextResponse } from 'next/server';
import { backendJson } from '@/lib/server/backend-auth';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const {response, data} = await backendJson('/auth/signup/', {method: 'POST', body});
  return NextResponse.json(data, {status: response.status});
}
