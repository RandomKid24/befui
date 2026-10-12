import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArchiveIcon, ForwardIcon, InboxIcon, ReplyIcon, TrashIcon } from '@/components/ui/icons';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { cn } from '@/lib/utils';

interface Mail { id: string; from: string; subject: string; preview: string; body: string; time: string; unread?: boolean }

const seed: Mail[] = [
  { id: '1', from: 'Ananya Kulkarni', subject: 'Q4 roadmap review', preview: 'Can we move the review to Thursday?', body: 'Hi,\n\nCan we move the roadmap review to Thursday 11am? Two of the leads are travelling on Wednesday.\n\nThanks,\nAnanya', time: '10:24', unread: true },
  { id: '2', from: 'Billing', subject: 'Invoice INV-0142 is ready', preview: 'Your October invoice for ₹18,588 is due on 15 Oct.', body: 'Your October invoice for ₹18,588 is ready and due on 15 Oct 2026. You can download it from the billing page.', time: '09:02', unread: true },
  { id: '3', from: 'Rohan Das', subject: 'Mobile build 2.4.0', preview: 'TestFlight build is out, please try it.', body: 'The 2.4.0 TestFlight build is out. Please check sign-in and the new onboarding carousel, and note anything odd in the thread.', time: 'Yesterday' },
];

export default function Inbox() {
  const [mails, setMails] = React.useState(seed);
  const [q, setQ] = React.useState('');
  const [openId, setOpenId] = React.useState<string>();
  const open = mails.find((m) => m.id === openId);
  const shown = mails.filter((m) => `${m.from} ${m.subject}`.toLowerCase().includes(q.toLowerCase()));
  const pick = (id: string) => { setOpenId(id); setMails((l) => l.map((m) => (m.id === id ? { ...m, unread: false } : m))); };
  const remove = () => { setMails((l) => l.filter((m) => m.id !== openId)); setOpenId(undefined); };

  return (
    <div className="grid h-[520px] overflow-hidden rounded-xl border text-left md:grid-cols-[20rem_1fr]">
      <div className={cn('flex min-h-0 flex-col border-r', open && 'max-md:hidden')}>
        <div className="border-b p-3"><SearchInput value={q} onValueChange={setQ} placeholder="Search mail" /></div>
        <ul className="min-h-0 flex-1 divide-y overflow-y-auto">
          {shown.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => pick(m.id)} aria-current={m.id === openId} className={cn('flex w-full gap-3 p-3 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted', m.id === openId && 'bg-accent')}>
                <Avatar name={m.from} size="sm" />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="flex items-center justify-between gap-2 text-[13px]"><span className={cn('truncate', m.unread && 'font-semibold')}>{m.from}</span><span className="shrink-0 text-xs text-muted-foreground">{m.time}</span></span>
                  <span className={cn('truncate text-[13px]', m.unread ? 'font-medium' : 'text-muted-foreground')}>{m.subject}</span>
                  <span className="truncate text-xs text-muted-foreground">{m.preview}</span>
                </span>
                {m.unread && <span aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn('flex min-h-0 flex-col', !open && 'max-md:hidden')}>
        {open ? (
          <>
            <div className="flex items-center gap-1 border-b p-2">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpenId(undefined)}>Back</Button>
              <Button variant="ghost" size="icon-sm" aria-label="Archive" onClick={remove}><ArchiveIcon /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={remove}><TrashIcon /></Button>
              <span className="ml-auto flex gap-1"><Button variant="outline" size="sm"><ReplyIcon /> Reply</Button><Button variant="outline" size="sm"><ForwardIcon /> Forward</Button></span>
            </div>
            <article className="min-h-0 flex-1 overflow-y-auto p-5">
              <h2 className="text-lg font-semibold tracking-tight">{open.subject}</h2>
              <p className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground"><Avatar name={open.from} size="xs" />{open.from} · {open.time}</p>
              <p className="mt-5 whitespace-pre-line text-sm leading-relaxed">{open.body}</p>
            </article>
          </>
        ) : (
          <EmptyState className="m-6 flex-1 justify-center" icon={<InboxIcon />} title={mails.length ? 'Select a message' : 'Inbox zero'} description={mails.length ? 'Pick something from the list to read it.' : 'Nothing left to read.'} />
        )}
      </div>
    </div>
  );
}
