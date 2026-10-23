'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { XIcon } from './icons';

export interface InviteRole { value: string; label: string }
export interface Invite { email: string; role: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Invite people by email: type or paste a list (commas, spaces or new lines), each address becomes a chip, bad ones are flagged,
 * one role applies to all, and Send gives you the list. Duplicates and people already in `existing` are skipped with a note.
 */
export function TeamInvite({
  roles = [{ value: 'member', label: 'Member' }, { value: 'admin', label: 'Admin' }, { value: 'viewer', label: 'Viewer' }],
  defaultRole = 'member',
  existing = [],
  onSend,
  className,
}: {
  roles?: InviteRole[];
  defaultRole?: string;
  /** Emails already on the team. */
  existing?: string[];
  onSend?: (invites: Invite[]) => void;
  className?: string;
}) {
  const [emails, setEmails] = React.useState<string[]>([]);
  const [text, setText] = React.useState('');
  const [role, setRole] = React.useState(defaultRole);
  const [note, setNote] = React.useState('');
  const [sent, setSent] = React.useState(0);
  const id = React.useId();

  const add = (raw: string) => {
    const parts = raw.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!parts.length) return;
    const skipped: string[] = [];
    const next = [...emails];
    for (const p of parts) {
      if (next.includes(p) || existing.map((e) => e.toLowerCase()).includes(p)) skipped.push(p);
      else next.push(p);
    }
    setEmails(next);
    setText('');
    setNote(skipped.length ? `Skipped ${skipped.join(', ')}: already added or on the team.` : '');
  };
  const bad = emails.filter((e) => !EMAIL.test(e));
  const ok = emails.length > 0 && bad.length === 0;

  if (sent) {
    return (
      <div role="status" className={cn('grid gap-3 rounded-xl border bg-card p-5 text-sm', className)}>
        <p className="font-medium">{sent} invite{sent === 1 ? '' : 's'} sent.</p>
        <Button variant="outline" size="sm" className="w-fit" onClick={() => { setSent(0); setEmails([]); }}>Invite more</Button>
      </div>
    );
  }

  return (
    <form
      className={cn('grid gap-3 rounded-xl border bg-card p-4', className)}
      onSubmit={(e) => { e.preventDefault(); if (!ok) return; onSend?.(emails.map((email) => ({ email, role }))); setSent(emails.length); }}
    >
      <label htmlFor={id} className="text-sm font-medium">Email addresses</label>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15">
        {emails.map((e) => {
          const invalid = !EMAIL.test(e);
          return (
            <span key={e} className={cn('inline-flex h-7 items-center gap-1 rounded-full border ps-2.5 pe-1 text-xs', invalid ? 'border-destructive/40 bg-destructive/10 text-destructive' : 'bg-secondary')}>
              {e}{invalid && <span className="sr-only"> (not a valid email)</span>}
              <button type="button" aria-label={`Remove ${e}`} onClick={() => setEmails(emails.filter((x) => x !== e))} className="grid size-5 place-items-center rounded-full outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring/50"><XIcon className="size-3" /></button>
            </span>
          );
        })}
        <input
          id={id}
          value={text}
          onChange={(e) => (/[,;\s]$/.test(e.target.value) ? add(e.target.value) : setText(e.target.value))}
          onPaste={(e) => { e.preventDefault(); add(e.clipboardData.getData('text')); }}
          onBlur={() => add(text)}
          onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { e.preventDefault(); add(text); } else if (e.key === 'Backspace' && !text && emails.length) setEmails(emails.slice(0, -1)); }}
          placeholder={emails.length ? '' : 'name@company.com, paste a list'}
          className="min-w-40 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      {bad.length > 0 && <p role="alert" className="text-xs text-destructive">Fix or remove: {bad.join(', ')}</p>}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15">
            {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <Button type="submit" disabled={!ok}>Send {emails.length ? emails.length : ''} invite{emails.length === 1 ? '' : 's'}</Button>
      </div>
    </form>
  );
}
