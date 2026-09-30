import {NextRequest, NextResponse} from 'next/server';
import {backendJson} from '@/lib/server/backend-auth';

export async function POST(request: NextRequest) {
  const {response, data} = await backendJson('/auth/password-reset/request/', {method: 'POST', body: await request.text()});
  return NextResponse.json(data, {status: response.status});
}
