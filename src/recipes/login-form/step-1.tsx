import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your work email.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Email"><Input type="email" placeholder="you@company.com" /></Field>
        <Field label="Password"><Input type="password" /></Field>
        <Button className="w-full">Sign in</Button>
      </CardContent>
    </Card>
  );
}
