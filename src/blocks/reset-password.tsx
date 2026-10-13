'use client';

import * as React from 'react';
import { ArrowLeftIcon, CheckCircleIcon, LockIcon, MailIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { PasswordInput, passwordScore } from '@/components/ui/password-input';

type Step = 'email' | 'sent' | 'new' | 'done';

export default function ResetPassword() {
  const [step, setStep] = React.useState<Step>('email');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [again, setAgain] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [wait, setWait] = React.useState(0);

  React.useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const fake = (next: Step, after?: () => void) => { setLoading(true); setTimeout(() => { setLoading(false); setStep(next); after?.(); }, 800); };

  function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter the email you signed up with.');
    setError('');
    fake('sent', () => setWait(30));
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (passwordScore(pw) < 3) return setError('Use 8+ characters with a mix of letters, numbers and symbols.');
    if (pw !== again) return setError('The two passwords do not match.');
    setError('');
    fake('done');
  }

  return (
    <div className="grid min-h-[28rem] place-items-center">
      <Card className="w-full max-w-sm p-6">
        {step === 'email' && (
          <form onSubmit={sendLink} noValidate className="grid gap-4">
            <div className="grid gap-1">
              <span className="mb-2 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><LockIcon /></span>
              <h2 className="text-lg font-semibold tracking-tight">Forgot your password?</h2>
              <p className="text-[13px] text-muted-foreground">Enter your email and we will send a reset link.</p>
            </div>
            <Field label="Email" htmlFor="rp-email" error={error}>
              <Input id="rp-email" type="email" leftIcon={<MailIcon />} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} autoComplete="email" />
            </Field>
            <Button type="submit" loading={loading} className="w-full">Send reset link</Button>
            <Button type="button" variant="ghost" size="sm" className="justify-self-center"><ArrowLeftIcon className="rtl:rotate-180" /> Back to sign in</Button>
          </form>
        )}
        {step === 'sent' && (
          <div className="grid justify-items-center gap-3 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><MailIcon className="size-6" /></span>
            <h2 className="text-lg font-semibold tracking-tight">Check your email</h2>
            <p className="text-[13px] text-muted-foreground">If <b className="text-foreground">{email}</b> has an account, a reset link is on its way.</p>
            <Button className="w-full" onClick={() => setStep('new')}>I have the link (demo)</Button>
            <Button variant="ghost" size="sm" disabled={wait > 0} onClick={() => setWait(30)}>{wait > 0 ? `Resend in ${wait}s` : 'Resend email'}</Button>
          </div>
        )}
        {step === 'new' && (
          <form onSubmit={save} noValidate className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold tracking-tight">Choose a new password</h2>
              <p className="text-[13px] text-muted-foreground">You will be signed out everywhere else.</p>
            </div>
            <Field label="New password" htmlFor="rp-pw"><PasswordInput id="rp-pw" meter value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></Field>
            <Field label="Confirm password" htmlFor="rp-pw2" error={error}><PasswordInput id="rp-pw2" value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" aria-invalid={!!error} /></Field>
            <Button type="submit" loading={loading} className="w-full">Update password</Button>
          </form>
        )}
        {step === 'done' && (
          <div className="grid justify-items-center gap-3 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-success/15 text-success"><CheckCircleIcon className="size-6" /></span>
            <h2 className="text-lg font-semibold tracking-tight">Password updated</h2>
            <p className="text-[13px] text-muted-foreground">You can now sign in with your new password.</p>
            <Button className="w-full" onClick={() => { setStep('email'); setEmail(''); setPw(''); setAgain(''); }}>Back to sign in</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
