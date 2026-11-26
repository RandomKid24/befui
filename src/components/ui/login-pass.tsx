'use client';

import * as React from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';
import { PasswordInput } from './password-input';
import { cn } from '@/lib/utils';

const COMMON = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
const TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gamil.com': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'outlok.com': 'outlook.com', 'hotmial.com': 'hotmail.com', 'iclod.com': 'icloud.com',
};

/** "ana@gmial.com" gives "ana@gmail.com"; null when the domain looks fine. */
export function suggestEmail(email: string): string | null {
  const [local, domain = ''] = email.trim().split('@');
  const d = domain.toLowerCase();
  // ponytail: a fixed list of frequent misspellings, no edit distance, so real company domains are never "corrected"
  const fixed = TYPOS[d] ?? COMMON.find((c) => d === c.replace(/\.com$/, '.con') || d === c.replace(/\.com$/, '.co'));
  return local && fixed ? `${local}@${fixed}` : null;
}

function readEmail(email: string) {
  const [local = '', domain = ''] = email.trim().split('@');
  const words = local.split('+')[0].split(/[._-]+/).map((w) => w.replace(/\d+$/, '')).filter(Boolean);
  const name = words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  const initials = [words[0], words.length > 1 ? words[words.length - 1] : ''].map((w) => w?.[0] ?? '').join('').toUpperCase();
  return { name, initials, domain: domain.toLowerCase() };
}

type Status = 'idle' | 'checking' | 'admitted' | 'refused';
const STAMP: Record<Status, [string, string]> = {
  idle: ['Not signed in', 'text-muted-foreground border-border'],
  checking: ['Checking', 'text-primary border-primary'],
  admitted: ['Admitted', 'text-success border-success'],
  refused: ['Not admitted', 'text-destructive border-destructive'],
};

/** Bar widths come from the email only. The password is never read here, so the screen cannot leak anything about it. */
function bars(seed: string) {
  let h = 2166136261;
  return Array.from({ length: 44 }, (_, i) => {
    h = Math.imul(h ^ (seed.charCodeAt(i % (seed.length || 1)) || i), 16777619) >>> 0;
    return 1 + (h % 4);
  });
}

function Pass({ appName, email, status }: { appName: string; email: string; status: Status }) {
  const { name, initials, domain } = readEmail(email);
  const [stamp, tone] = STAMP[status];
  return (
    <div className="w-full max-w-72">
      <div aria-hidden className="mx-auto -mb-px h-16 w-6 bg-foreground/80 max-md:hidden" />
      <div className="rounded-xl border bg-card shadow-lg">
        <div className="px-5 pt-3">
          <div aria-hidden className="mx-auto mb-3 h-2 w-14 rounded-full border bg-muted max-md:hidden" />
          <div className="flex items-baseline justify-between gap-3 border-b pb-2 text-xs text-muted-foreground">
            <span className="truncate font-semibold text-foreground">{appName}</span>
            <span>Entry pass</span>
          </div>
        </div>
        <div className="flex items-center gap-4 px-5 py-4 md:flex-col md:items-start">
          <div aria-hidden className="grid size-14 shrink-0 place-items-center rounded-md bg-foreground font-mono text-xl font-semibold text-background md:size-24 md:text-3xl">{initials || '?'}</div>
          <dl className="grid min-w-0 gap-0.5">
            <dt className="sr-only">Name</dt>
            <dd className={cn('truncate text-lg font-semibold tracking-tight md:text-2xl', !name && 'text-muted-foreground')}>{name || 'Your name'}</dd>
            <dt className="sr-only">Company domain</dt>
            <dd className="truncate font-mono text-xs text-muted-foreground">{domain || 'your-company.com'}</dd>
          </dl>
        </div>
        <div className="relative border-t border-dashed px-5 py-4 max-md:hidden">
          <span aria-hidden className="absolute -left-2 -top-2 size-4 rounded-full border-r bg-muted" />
          <span aria-hidden className="absolute -right-2 -top-2 size-4 rounded-full border-l bg-muted" />
          <div aria-hidden className="flex h-9 items-stretch gap-0.5 overflow-hidden">
            {bars(email.trim().toLowerCase()).map((w, i) => <span key={i} className="bg-foreground" style={{ width: w }} />)}
          </div>
        </div>
        <div className="flex justify-end border-t px-5 py-3">
          <span key={status} className={cn('-rotate-3 rounded-sm border-2 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-widest motion-safe:animate-pop', tone)}>{stamp}</span>
        </div>
      </div>
    </div>
  );
}

export interface LoginValues { email: string; password: string; remember: boolean }

export interface LoginPassProps {
  /** Check the credentials here. Throw an Error to show its message; resolve to mark the pass admitted, then redirect. */
  onSignIn: (values: LoginValues) => Promise<void> | void;
  /** Shows "Forgot password?" and gets whatever is in the email field. */
  onForgotPassword?: (email: string) => void;
  appName?: string;
  className?: string;
}

/** A sign-in screen where an entry pass fills in from the email, so a wrong account or domain typo is visible before submitting. */
export function LoginPass({ onSignIn, onForgotPassword, appName = 'Acme', className }: LoginPassProps) {
  const id = React.useId();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; form?: string }>({});
  const [caps, setCaps] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const pwBox = React.useRef<HTMLDivElement>(null);
  const suggestion = suggestEmail(email);
  const busy = status === 'checking' || status === 'admitted';
  const focusPassword = () => pwBox.current?.querySelector('input')?.focus();

  function edit(set: (v: string) => void, v: string) {
    set(v);
    setErrors({});
    setStatus('idle');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter your full email, like name@company.com.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return focusPassword();
    setStatus('checking');
    try {
      await onSignIn({ email: email.trim(), password, remember });
      setStatus('admitted');
    } catch (err) {
      setStatus('refused');
      setErrors({ form: err instanceof Error && err.message ? err.message : 'Could not sign in. Try again.' });
      focusPassword();
    }
  }

  const capsCheck = (e: React.KeyboardEvent) => setCaps(e.getModifierState?.('CapsLock') ?? false);

  return (
    <div className={cn('grid w-full bg-background md:min-h-[36rem] md:grid-cols-2', className)}>
      <div className="flex items-start justify-center overflow-hidden bg-muted p-5 md:order-2 md:border-l md:pt-0">
        <Pass appName={appName} email={email} status={status} />
      </div>
      <div className="grid place-items-center px-6 py-10">
        <form onSubmit={submit} noValidate className="grid w-full max-w-80 gap-5">
          <div className="grid gap-1.5">
            <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">Your pass fills in as you type. Check it is you.</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input ref={emailRef} id={`${id}-email`} type="email" name="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="name@company.com" value={email} readOnly={busy} onChange={(e) => edit(setEmail, e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
            {errors.email && <p id={`${id}-email-err`} className="text-xs text-destructive">{errors.email}</p>}
            {suggestion && (
              <p className="text-xs text-muted-foreground">
                Did you mean <button type="button" className="font-semibold text-foreground underline underline-offset-2" onClick={() => { edit(setEmail, suggestion); focusPassword(); }}>{suggestion}</button>?
              </p>
            )}
          </div>
          <div ref={pwBox} className="grid gap-1.5" onKeyDown={capsCheck} onKeyUp={capsCheck}>
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor={`${id}-pw`}>Password</Label>
              {onForgotPassword && <Button type="button" variant="link" className="h-auto px-0 text-xs" onClick={() => onForgotPassword(email.trim())}>Forgot password?</Button>}
            </div>
            <PasswordInput id={`${id}-pw`} name="password" autoComplete="current-password" value={password} readOnly={busy} onChange={(e) => edit(setPassword, e.target.value)} aria-invalid={!!errors.password || !!errors.form} aria-describedby={errors.password ? `${id}-pw-err` : undefined} />
            {errors.password && <p id={`${id}-pw-err`} className="text-xs text-destructive">{errors.password}</p>}
            {caps && <p className="text-xs font-medium text-foreground">Caps Lock is on.</p>}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-rem`} checked={remember} disabled={busy} onCheckedChange={(v) => setRemember(v === true)} />
            <Label htmlFor={`${id}-rem`} className="font-normal">Keep me signed in on this device</Label>
          </div>
          {errors.form && <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">{errors.form}</p>}
          <Button type="submit" size="lg" loading={status === 'checking'} disabled={status === 'admitted'}>
            {status === 'checking' ? 'Signing in' : status === 'admitted' ? 'Signed in' : 'Sign in'}
          </Button>
          <p role="status" className="sr-only">{status === 'idle' ? '' : STAMP[status][0]}</p>
        </form>
      </div>
    </div>
  );
}
