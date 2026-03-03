import { createHmac } from 'crypto';

export interface DiscourseUser {
  id: number;
  username: string;
  name: string;
  email: string;
  admin: boolean;
  moderator: boolean;
  avatar_url?: string;
  role?: string;
  is_advisor?: boolean;
  is_admin?: boolean;
  wallet_balance?: number;
}

const DISCOURSE_URL = 'https://community.workspherepulse.com';
const DISCOURSE_CONNECT_SECRET = process.env.DISCOURSE_CONNECT_SECRET || '';

export function getDiscourseLoginUrl(returnUrl: string): string {
  if (!DISCOURSE_CONNECT_SECRET) {
    throw new Error('DISCOURSE_CONNECT_SECRET is not configured');
  }

  const payload = Buffer.from(`return_sso_url=${encodeURIComponent(returnUrl)}`).toString('base64');
  const sig = createHmac('sha256', DISCOURSE_CONNECT_SECRET).update(payload).digest('hex');

  return `${DISCOURSE_URL}/session/sso_provider?sso=${payload}&sig=${sig}`;
}

export function verifyDiscoursePayload(sso: string, sig: string): DiscourseUser | null {
  const expectedSig = createHmac('sha256', DISCOURSE_CONNECT_SECRET).update(sso).digest('hex');

  if (sig !== expectedSig) {
    console.error('Invalid signature');
    return null;
  }

  const payload = Buffer.from(sso, 'base64').toString('utf8');
  const params = new URLSearchParams(payload);

  return {
    id: parseInt(params.get('external_id') || '0'),
    username: params.get('username') || '',
    name: params.get('name') || '',
    email: params.get('email') || '',
    admin: params.get('admin') === 'true',
    moderator: params.get('moderator') === 'true',
    avatar_url: params.get('avatar_url') || undefined,
  };
}

export function isUserAdmin(user: DiscourseUser | null): boolean {
  return user?.admin === true || user?.moderator === true;
}
