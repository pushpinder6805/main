import VerifyEmail from './VerifyEmail';

export default async function VerifyEmailPage({searchParams}: {searchParams: Promise<{token?: string}>}) {
  const params = await searchParams;
  return <VerifyEmail token={params.token || ''} />;
}
