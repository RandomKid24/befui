'use client';

import * as React from 'react';
import { MailIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { GithubIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Field, Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

export default function SignIn() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '');
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!email.includes('@')) setError('Enter a valid work email.');
    }, 900);
  }

  return (
    <div className="grid min-h-[28rem] place-items-center">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 grid gap-1">
          <div className="mb-2 grid size-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">A</div>
          <h2 className="text-lg font-semibold tracking-tight">Sign in to Acme</h2>
          <p className="text-[13px] text-muted-foreground">Use your work account.</p>
        </div>
        <div className="mb-4 grid gap-2">
          <Button type="button" variant="outline" className="w-full"><GoogleIcon /> Continue with Google</Button>
          <Button type="button" variant="outline" className="w-full"><GithubIcon /> Continue with GitHub</Button>
        </div>
        <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
        <form onSubmit={submit} className="grid gap-4">
          {error && <Alert variant="danger" title={error} />}
          <Field label="Email" htmlFor="si-email">
            <Input id="si-email" name="email" leftIcon={<MailIcon />} placeholder="you@company.com" aria-invalid={!!error} />
          </Field>
          <Field label="Password" htmlFor="si-pw">
            <Input id="si-pw" type="password" placeholder="••••••••" />
          </Field>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Checkbox id="rem" defaultChecked /><Label htmlFor="rem" className="font-normal">Remember me</Label></div>
            <Button type="button" variant="link" size="xs">Forgot?</Button>
          </div>
          <Button type="submit" loading={loading} className="w-full">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
