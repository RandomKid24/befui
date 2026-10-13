'use client';

import * as React from 'react';
import { CheckCircleIcon, ShieldCheckIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OtpInput } from '@/components/ui/otp-input';

const CODE = '123456'; // demo only: check the code on your server

export default function OtpVerify() {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [wait, setWait] = React.useState(30);

  React.useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6 || loading) return;
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === CODE) setDone(true);
      else {
        setError('That code is not right. Check the email and try again.');
        setCode('');
      }
    }, 800);
  }

  if (done) {
    return (
      <div className="grid min-h-[28rem] place-items-center">
        <Card className="grid w-full max-w-sm justify-items-center gap-3 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success"><CheckCircleIcon className="size-6" /></span>
          <h2 className="text-lg font-semibold tracking-tight">You are verified</h2>
          <p className="text-[13px] text-muted-foreground">Thanks. You can keep going.</p>
          <Button className="w-full" onClick={() => { setDone(false); setCode(''); setWait(30); }}>Continue</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid min-h-[28rem] place-items-center">
      <Card className="w-full max-w-sm p-6">
        <form onSubmit={verify} noValidate className="grid gap-5">
          <div className="grid gap-1">
            <span className="mb-2 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><ShieldCheckIcon /></span>
            <h2 className="text-lg font-semibold tracking-tight">Verify it is you</h2>
            <p className="text-[13px] text-muted-foreground">Enter the 6-digit code we sent to <b className="text-foreground">a•••@acme.co</b>.</p>
          </div>
          <OtpInput value={code} onChange={setCode} invalid={!!error} className="justify-center" />
          {error && <p role="alert" className="text-center text-xs text-destructive">{error}</p>}
          <Button type="submit" loading={loading} disabled={code.length < 6} className="w-full">Verify</Button>
          <Button type="button" variant="ghost" size="sm" className="justify-self-center" disabled={wait > 0} onClick={() => { setWait(30); setCode(''); setError(''); }}>
            {wait > 0 ? `Resend in ${wait}s` : 'Resend code'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Demo: the code is 123456.</p>
        </form>
      </Card>
    </div>
  );
}
