import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { toast } from '@/components/ui/toast';

export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const badEmail = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFailed(false);
    // swap this timeout for your sign-in request
    setTimeout(() => {
      setBusy(false);
      if (password === 'befui') toast.success('Welcome back', email);
      else setFailed(true);
    }, 900);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your work email. Try the password "befui".</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          {failed && <Alert variant="danger" title="Wrong email or password">Check them and try again.</Alert>}
          <Field label="Email" error={badEmail ? 'That does not look like an email.' : undefined}>
            <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Checkbox id="remember" defaultChecked /><Label htmlFor="remember" className="font-normal">Remember me</Label></span>
            <a href="#forgot" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full" loading={busy} disabled={!email || badEmail || !password}>Sign in</Button>
        </form>
      </CardContent>
    </Card>
  );
}
