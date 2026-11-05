'use client';

import * as React from 'react';
import { BellIcon, CheckIcon, LayoutDashboardIcon, MailIcon, PlusIcon, SearchIcon, SettingsIcon, SparkleIcon, TargetIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.55 0.19 268)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.19 268)', '--accent': 'color-mix(in oklab, oklch(0.55 0.19 268) 14%, var(--background))', '--accent-foreground': 'oklch(0.55 0.19 268)' } as React.CSSProperties;


const STAGES = ['New', 'Contacted', 'Quoted', 'Won'] as const;
type Stage = (typeof STAGES)[number];
type Msg = { from: 'them' | 'me'; text: string; at: string };
type Lead = { id: number; company: string; contact: string; owner: string; value: number; stage: Stage; hot?: boolean; msgs: Msg[] };

const seed: Lead[] = [
  { id: 1, company: 'Sunrise Pharma', contact: 'Olivia Rao', owner: 'Isha Nair', value: 420000, stage: 'New', hot: true, msgs: [{ from: 'them', text: 'Hi, we are looking at a rollout across 40 branches. Can you share pricing?', at: '09:12' }] },
  { id: 2, company: 'Bharat Forge Supplies', contact: 'Noah Jain', owner: 'Kabir Shah', value: 180000, stage: 'New', msgs: [{ from: 'them', text: 'Does the starter plan include onboarding?', at: 'Yesterday' }] },
  { id: 3, company: 'Kaveri Chemicals', contact: 'Sam Verma', owner: 'Kabir Shah', value: 950000, stage: 'Contacted', msgs: [{ from: 'me', text: 'Sharing the security note we discussed.', at: 'Mon' }, { from: 'them', text: 'Thanks. Legal will review it this week.', at: 'Mon' }] },
  { id: 4, company: 'Orion Textiles', contact: 'Ava Menon', owner: 'Isha Nair', value: 310000, stage: 'Quoted', hot: true, msgs: [{ from: 'them', text: 'The quote looks fine. Can we start on the 1st?', at: '11:40' }] },
  { id: 5, company: 'Metro Packaging', contact: 'Ethan Dsouza', owner: 'Diya Rao', value: 275000, stage: 'Quoted', msgs: [{ from: 'them', text: 'We need a revised quote for 25 seats.', at: 'Tue' }] },
  { id: 6, company: 'Apex Dyes', contact: 'Sara Kulkarni', owner: 'Diya Rao', value: 640000, stage: 'Won', msgs: [{ from: 'them', text: 'Signed and sent back. Looking forward to it.', at: 'Last week' }] },
];
const lakh = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
const SUGGEST = ['Smart reply', 'Follow-up suggestions', 'Summarize thread', 'Send updated quote'];

/** A CRM inbox: pick a deal, read the thread, answer with or without the AI suggestions, and move the stage. */
export default function LeadPipeline() {
  const [leads, setLeads] = React.useState(seed);
  const [sel, setSel] = React.useState(1);
  const [draft, setDraft] = React.useState('');
  const [q, setQ] = React.useState('');
  const lead = leads.find((l) => l.id === sel)!;
  const shown = leads.filter((l) => l.company.toLowerCase().includes(q.toLowerCase()));
  const setStage = (stage: Stage) => {
    setLeads((ls) => ls.map((l) => (l.id === sel ? { ...l, stage } : l)));
    if (stage === 'Won') toast.success('Deal won', `${lead.company} moved to Won.`);
  };
  const post = (text: string) => setLeads((ls) => ls.map((l) => (l.id === sel ? { ...l, msgs: [...l.msgs, { from: 'me', text, at: 'Now' }] } : l)));
  const suggest = (s: string) => {
    if (s === 'Smart reply') setDraft(`Hi ${lead.contact.split(' ')[0]}, thanks for the note. I can have the details over to you today.`);
    else if (s === 'Summarize thread') post(`Summary: ${lead.company} is at ${lead.stage}, worth ${lakh(lead.value)}, last message "${lead.msgs[lead.msgs.length - 1]!.text.slice(0, 48)}".`);
    else if (s === 'Send updated quote') { post('Sending the updated quote now.'); if (lead.stage === 'New' || lead.stage === 'Contacted') setStage('Quoted'); }
    else setDraft('Just checking in. Would a short call this week help move this along?');
  };
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><SparkleIcon className="size-4" /></span>
              <span className="truncate text-sm font-semibold">Loopdesk</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="CRM">
                <SidebarItem icon={<LayoutDashboardIcon />} label="Overview" />
                <SidebarItem icon={<MailIcon />} label="Conversations" active badge={String(leads.length)} />
                <SidebarItem icon={<TargetIcon />} label="Pipeline" />
                <SidebarItem icon={<UsersIcon />} label="Contacts" />
              </SidebarGroup>
              <SidebarGroup><SidebarItem icon={<SettingsIcon />} label="Settings" /></SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <h1 className="text-sm font-semibold">{leads.length} open deals worth {lakh(leads.reduce((s, l) => s + l.value, 0))}</h1>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="ml-auto"><BellIcon /></Button>
          <Button size="sm"><PlusIcon /> New lead</Button>
        </Topbar>
        <AppContent className="@container bg-gradient-to-br from-accent/50 via-muted/40 to-muted/40 p-3 sm:p-4">
          <div className="grid gap-3 @3xl:h-full @3xl:grid-cols-[17rem_minmax(0,1fr)_15rem]">
            <section className="flex max-h-72 min-h-0 flex-col rounded-2xl border bg-card @3xl:max-h-none" aria-label="Deals">
              <label className="m-3 flex h-9 items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search deals" placeholder="Search deals" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
              <ul className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
                {shown.map((l) => (
                  <li key={l.id}>
                    <button type="button" aria-current={l.id === sel} onClick={() => setSel(l.id)} className={cn('flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50', l.id === sel ? 'bg-accent' : 'hover:bg-secondary')}>
                      <Avatar name={l.contact} size="sm" />
                      <span className="min-w-0 flex-1 leading-tight"><span className="flex items-center justify-between gap-2 text-[13px] font-semibold"><span className="truncate">{l.company}</span><span className="shrink-0 text-[11px] font-normal text-muted-foreground">{l.msgs[l.msgs.length - 1]!.at}</span></span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{l.msgs[l.msgs.length - 1]!.text}</span></span>
                      {l.hot && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-destructive" title="Hot" />}
                    </button>
                  </li>
                ))}
                {shown.length === 0 && <li className="p-4 text-center text-[13px] text-muted-foreground">No deal matches that.</li>}
              </ul>
            </section>

            <section className="flex h-[26rem] min-h-0 flex-col rounded-2xl border bg-card @3xl:h-auto" aria-label={`Conversation with ${lead.contact}`}>
              <header className="flex items-center gap-2.5 border-b px-4 py-3"><Avatar name={lead.contact} size="sm" /><div className="leading-tight"><p className="text-[13px] font-semibold">{lead.contact}</p><p className="text-xs text-muted-foreground">{lead.company}</p></div></header>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4" aria-live="polite">
                {lead.msgs.map((m, i) => <p key={i} className={cn('max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed', m.from === 'me' ? 'ml-auto bg-primary/12' : 'bg-secondary')}>{m.text}</p>)}
              </div>
              <div className="grid grid-cols-2 gap-2 px-4 pb-2">
                {SUGGEST.map((s) => <button key={s} type="button" onClick={() => suggest(s)} className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2 text-start text-xs font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"><SparkleIcon className="size-3.5 shrink-0 text-primary" />{s}</button>)}
              </div>
              <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { post(draft.trim()); setDraft(''); } }}>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Message" placeholder="Send a message" className="h-9 w-full rounded-xl border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
                <Button size="sm" type="submit" disabled={!draft.trim()}>Send</Button>
              </form>
            </section>

            <aside className="rounded-2xl border bg-card p-4 @3xl:min-h-0 @3xl:overflow-y-auto" aria-label="Deal details">
              <p className="text-xs text-muted-foreground">Deal value</p>
              <p className="font-display text-3xl font-semibold tabular-nums tracking-tight">{lakh(lead.value)}</p>
              <p className="mt-4 text-xs text-muted-foreground">Owner</p>
              <p className="mt-1 flex items-center gap-2 text-[13px] font-medium"><Avatar name={lead.owner} size="xs" />{lead.owner}</p>
              <p className="mt-4 text-xs text-muted-foreground">Stage</p>
              <ol className="mt-2 grid gap-1">
                {STAGES.map((s, i) => {
                  const at = STAGES.indexOf(lead.stage);
                  return (
                    <li key={s}>
                      <button type="button" aria-current={s === lead.stage} onClick={() => setStage(s)} className={cn('flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-start text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50', s === lead.stage ? 'bg-accent font-semibold' : 'text-muted-foreground hover:bg-secondary')}>
                        <span className={cn('grid size-5 place-items-center rounded-full border text-[10px]', i < at && 'border-primary bg-primary text-primary-foreground', i === at && 'border-primary')}>{i < at ? <CheckIcon className="size-3" /> : i + 1}</span>{s}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </aside>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
