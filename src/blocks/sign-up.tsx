'use client';

import * as React from 'react';
import { CheckCircleIcon, MailIcon, UserIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Field, Label } from '@/components/ui/label';
import { PasswordInput, passwordScore } from '@/components/ui/password-input';

export default function SignUp() {
  const [pw, setPw] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState('');

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') ?? '');
    const next: Record<string, string> = {};
    if (!String(f.get('name') ?? '').trim()) next.name = 'Tell us your name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid work email.';
    if (passwordScore(pw) < 3) next.pw = 'Use 8+ characters with a mix of letters, numbers and symbols.';
    if (!f.get('terms')) next.terms = 'Please accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(email); }, 900);
  }

  if (done)
    return (
      <div className="grid min-h-[28rem] place-items-center">
        <Card className="grid w-full max-w-sm justify-items-center gap-3 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-success/15 text-success"><CheckCircleIcon className="size-6" /></span>
          <h2 className="text-lg font-semibold tracking-tight">Check your inbox</h2>
          <p className="text-[13px] text-muted-foreground">We sent a confirmation link to <b className="text-foreground">{done}</b>. It expires in 24 hours.</p>
          <Button variant="outline" size="sm" onClick={() => { setDone(''); setPw(''); }}>Use a different email</Button>
        </Card>
      </div>
    );

  return (
    <div className="grid min-h-[28rem] place-items-center">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 grid gap-1">
          <div className="mb-2 grid size-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">A</div>
          <h2 className="text-lg font-semibold tracking-tight">Create your Acme account</h2>
          <p className="text-[13px] text-muted-foreground">Free for 14 days. No card needed.</p>
        </div>
        <form onSubmit={submit} noValidate className="grid gap-4">
          <Field label="Full name" htmlFor="su-name" error={errors.name}>
            <Input id="su-name" name="name" leftIcon={<UserIcon />} placeholder="Aditi Rao" autoComplete="name" aria-invalid={!!errors.name} />
          </Field>
          <Field label="Work email" htmlFor="su-email" error={errors.email}>
            <Input id="su-email" name="email" type="email" leftIcon={<MailIcon />} placeholder="you@company.com" autoComplete="email" aria-invalid={!!errors.email} />
          </Field>
          <Field label="Password" htmlFor="su-pw" error={errors.pw}>
            <PasswordInput id="su-pw" meter value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" aria-invalid={!!errors.pw} />
          </Field>
          <div className="grid gap-1">
            <div className="flex items-center gap-2"><Checkbox id="su-terms" name="terms" /><Label htmlFor="su-terms" className="font-normal">I agree to the terms and privacy policy</Label></div>
            {errors.terms && <p role="alert" className="text-xs text-destructive">{errors.terms}</p>}
          </div>
          <Button type="submit" loading={loading} className="w-full">Create account</Button>
        </form>
        <p className="mt-5 text-center text-[13px] text-muted-foreground">Already have an account? <button type="button" className="font-medium text-primary hover:underline">Sign in</button></p>
      </Card>
    </div>
  );
}
