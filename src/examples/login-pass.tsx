import { LoginPass } from '@/components/ui/login-pass';

export default function LoginPassDemo() {
  return (
    <LoginPass
      className="max-w-4xl overflow-hidden rounded-xl border"
      onForgotPassword={() => {}}
      // Demo only: any password of 8 or more characters gets in. Call your auth API here.
      onSignIn={async ({ password }) => {
        await new Promise((r) => setTimeout(r, 900));
        if (password.length < 8) throw new Error('That email and password do not match. For this demo, use 8 or more characters.');
      }}
    />
  );
}
