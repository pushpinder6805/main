import ResetPassword from './ResetPassword';

export default async function ResetPasswordPage({searchParams}: {searchParams: Promise<{token?: string}>}) {
  const params = await searchParams;
  return <ResetPassword token={params.token || ''}/>;
}
