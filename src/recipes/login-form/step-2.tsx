import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const badEmail = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your work email.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
        <Button className="w-full" disabled={!email || badEmail || !password}>Sign in</Button>
      </CardContent>
    </Card>
  );
}
