'use client';

import * as React from 'react';
import { BuildingIcon, EyeIcon, MailIcon, PhoneIcon, TrophyIcon, UserIcon, XCircleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Segmented } from '@/components/ui/segmented';
import { OrderlaneKanban, type OrderlaneGroup } from '@/components/ui/orderlane-kanban';

interface Lead {
  id: string; name: string; company: string; plant?: string; owner: string; phone: string; email: string;
  tags: string[]; followUp?: string; quotes: number; quoted?: number; estimate?: number; status: string;
}

const groups: OrderlaneGroup[] = [
  { id: 'initialize', label: 'Initialize', statuses: [{ key: 'new', label: 'New' }, { key: 'quote_generated', label: 'Quote generated' }] },
  { id: 'a', label: 'A', statuses: [{ key: 'a', label: 'A' }] },
  { id: 'aplus', label: 'A+', statuses: [{ key: 'aplus', label: 'A+' }] },
  { id: 'c', label: 'C', statuses: [{ key: 'quotation_submitted', label: 'Quotation submitted' }, { key: 'technical_review', label: 'Technical review' }] },
  { id: 'closed', label: 'Closed', statuses: [{ key: 'won', label: 'Won' }, { key: 'lost', label: 'Lost' }] },
];
const needsAttachment = 'quotation_submitted';
const locked = new Set(['won', 'lost']);

const seed: Lead[] = [
  { id: 'l1', name: 'Shweta Pillai', company: 'Tata Consultancy Services', plant: 'Siruseri Campus', owner: 'ritu.banerjee', phone: '+91-98765-50502', email: 'shweta.pillai@tcs.example', tags: ['Domestic', 'East 1'], quotes: 0, estimate: 6100000, status: 'new' },
  { id: 'l2', name: 'Sachin Pawar', company: 'Bajaj Auto Ltd', plant: 'Chakan Plant', owner: 'sunita.rao', phone: '+91-98765-40401', email: 'sachin.pawar@bajaj.example', tags: ['Domestic', 'South 1'], quotes: 0, estimate: 38050000, status: 'new' },
  { id: 'l3', name: 'Divya Shetty', company: 'JSW Steel Ltd', plant: 'Vijayanagar Works', owner: 'neha.gupta', phone: '+91-98765-10102', email: 'divya.shetty@jsw.example', tags: ['Domestic', 'North 1'], quotes: 1, quoted: 222250000, status: 'quote_generated' },
  { id: 'l4', name: 'Priya Iyer', company: 'Infosys Ltd', plant: 'Bengaluru Campus', owner: 'neha.gupta', phone: '+91-98765-22201', email: 'priya.iyer@infosys.example', tags: ['Domestic', 'South 2'], quotes: 0, estimate: 12480000, status: 'quote_generated' },
  { id: 'l5', name: 'Rahul Verma', company: 'Reliance Industries Ltd', plant: 'Jamnagar Refinery', owner: 'vivek.joshi', phone: '+91-98765-55502', email: 'rahul.verma@ril.example', tags: ['Domestic', 'West 1'], quotes: 1, quoted: 453500000, status: 'a' },
  { id: 'l6', name: 'Aarav Sharma', company: 'Tata Steel Ltd', plant: 'Jamshedpur Plant', owner: 'lakshmi.iyer', phone: '+91-98765-11101', email: 'aarav.sharma@tata.example', tags: ['Domestic', 'South 2'], quotes: 1, quoted: 91200000, status: 'a' },
  { id: 'l7', name: 'Priya Iyer', company: 'Infosys Ltd', plant: 'Bengaluru Campus', owner: 'aditya', phone: '+91-98765-22201', email: 'priya.iyer@infosys.example', tags: ['Domestic', 'North 1'], quotes: 1, quoted: 43500000, status: 'aplus' },
  { id: 'l8', name: 'Sachin Pawar', company: 'Bajaj Auto Ltd', plant: 'Chakan Plant', owner: 'kavya.menon', phone: '+91-98765-40401', email: 'sachin.pawar@bajaj.example', tags: ['Domestic', 'South 1'], quotes: 1, quoted: 62000000, status: 'aplus' },
  { id: 'l9', name: 'Harish Tyagi', company: 'NTPC Ltd', plant: 'Dadri Power Station', owner: 'simran.kaur', phone: '+91-98765-20201', email: 'harish.tyagi@ntpc.example', tags: ['Domestic', 'North 1'], quotes: 1, quoted: 211850000, status: 'quotation_submitted' },
  { id: 'l10', name: 'Sneha Kapoor', company: 'Bharat Heavy Electricals Ltd', owner: 'ritu.banerjee', phone: '+91-98765-66601', email: 'sneha.kapoor@bhel.example', tags: ['Domestic', 'East 1'], quotes: 0, estimate: 90350000, status: 'quotation_submitted' },
  { id: 'l11', name: 'Meera Chatterjee', company: 'Infosys Ltd', owner: 'kavya.menon', phone: '+91-98765-22202', email: 'meera.chatterjee@infosys.example', tags: ['Domestic', 'South 1'], quotes: 1, quoted: 15800000, status: 'technical_review' },
  { id: 'l12', name: 'Rohan Mehta', company: 'Mahindra Logistics', plant: 'Pune Hub', owner: 'sunita.rao', phone: '+91-98765-44420', email: 'rohan.mehta@mahindra.example', tags: ['Domestic', 'West 1'], quotes: 1, quoted: 31500000, status: 'won' },
];

const rupees = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const label = (key: string) => groups.flatMap((g) => g.statuses).find((s) => s.key === key)?.label ?? key;

function Row({ icon, children, muted }: { icon: React.ReactNode; children: React.ReactNode; muted?: boolean }) {
  return (
    <div className={`mt-1 flex items-center gap-2 text-[13px] ${muted ? 'italic text-slate-400' : 'text-slate-500'}`}>
      <span className="text-slate-400">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

function LeadCardBody({ lead, onWon, onLost, onDelete }: { lead: Lead; onWon: () => void; onLost: () => void; onDelete: () => void }) {
  const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); fn(); };
  const done = locked.has(lead.status);
  return (
    <>
      <div className="text-base font-medium text-slate-900">{lead.name}</div>
      <div className="text-sm text-slate-500">{lead.company}</div>
      <Row icon={<BuildingIcon className="size-3.5" />} muted={!lead.plant}>{lead.plant ?? 'No plant'}</Row>
      <Row icon={<UserIcon className="size-3.5" />}>Owner: {lead.owner}</Row>
      <div className="mt-1 grid grid-cols-2 gap-x-2 text-[13px] font-medium text-slate-800">
        <span className="flex min-w-0 items-center gap-2"><PhoneIcon className="size-3.5 shrink-0 text-slate-400" /><span className="truncate">{lead.phone}</span></span>
        <span className="flex min-w-0 items-center gap-2"><MailIcon className="size-3.5 shrink-0 text-slate-400" /><span className="truncate">{lead.email}</span></span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {lead.tags.map((t, i) => (
          <span key={t} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${i === 0 ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>{t}</span>
        ))}
      </div>
      <div className="mt-3 text-[13px] text-slate-400">Next follow-up</div>
      <div className="text-[13px] italic text-slate-400">{lead.followUp ?? 'Not scheduled'}</div>
      {lead.quotes > 0 ? (
        <>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-slate-800">
            {lead.quotes} quotation uploaded <EyeIcon className="size-3.5 text-blue-600" />
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider">QUOTE</span>
            {lead.quotes} quote · {rupees(lead.quoted ?? 0)}
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 text-[13px] italic text-slate-400">No quotation yet</div>
          {lead.estimate ? (
            <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-800">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-slate-500">EST</span>
              {rupees(lead.estimate)}
            </div>
          ) : null}
        </>
      )}
      <div className="mt-4 flex items-center gap-5 text-sm font-medium">
        {!done && (
          <>
            <button type="button" onClick={stop(onWon)} className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"><TrophyIcon className="size-4" />Won</button>
            <button type="button" onClick={stop(onLost)} className="flex items-center gap-1 text-rose-600 hover:text-rose-700"><XCircleIcon className="size-4" />Lost</button>
          </>
        )}
        <button type="button" onClick={stop(onDelete)} className="text-slate-500 hover:text-rose-600">Delete</button>
      </div>
    </>
  );
}

/** Leads board built on OrderlaneKanban: groups that collapse, drag between columns, an attachment gate on Quotation submitted, a + on each column and a paginated table view. */
export default function OrderlaneKanbanDemo() {
  const [leads, setLeads] = React.useState(seed);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<'kanban' | 'table'>('kanban');
  const [hideEmpty, setHideEmpty] = React.useState(false);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<{ id: string; to: string } | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [page, setPage] = React.useState(0);

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const value = React.useMemo(() => {
    const v: Record<string, Lead[]> = {};
    for (const l of leads) (v[l.status] ??= []).push(l);
    return v;
  }, [leads]);

  const commit = (id: string, to: string) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: to } : l)));
    setSavingId(id);
    setTimeout(() => setSavingId(null), 700);
  };
  const onMove = (id: string, _from: string, to: string) => {
    if (to === needsAttachment) { setFiles([]); setPending({ id, to }); } else commit(id, to);
  };
  const add = (status: string) =>
    setLeads((ls) => [{ id: `n${Date.now()}`, name: 'New lead', company: 'Company name', owner: 'unassigned', phone: '+91-00000-00000', email: 'lead@example.com', tags: ['Domestic'], quotes: 0, status }, ...ls]);

  const open = leads.find((l) => l.id === openId);
  const perPage = 5;
  const pages = Math.max(1, Math.ceil(leads.length / perPage));

  return (
    <div className="rounded-xl bg-slate-50 py-3 font-sans text-slate-800">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-4">
        <Segmented value={view} onValueChange={setView} options={[{ value: 'kanban', label: 'Kanban' }, { value: 'table', label: 'Table' }]} />
        {view === 'kanban' && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={hideEmpty} onChange={(e) => setHideEmpty(e.target.checked)} />
            Hide empty columns
          </label>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="py-24 text-center">
          <div className="font-bold text-slate-900">No leads yet</div>
          <div className="mt-1 text-sm text-slate-500">Create your first lead to see it on the board.</div>
          <Button className="mt-4" onClick={() => setLeads(seed)}>New</Button>
        </div>
      ) : view === 'kanban' ? (
        <OrderlaneKanban<Lead>
          groups={groups}
          value={value}
          unit="leads"
          onMove={onMove}
          onAdd={add}
          hideEmpty={hideEmpty}
          savingId={savingId}
          isLocked={(l) => locked.has(l.status)}
          onCardClick={(l) => setOpenId(l.id)}
          renderCard={(l) => (
            <LeadCardBody
              lead={l}
              onWon={() => commit(l.id, 'won')}
              onLost={() => commit(l.id, 'lost')}
              onDelete={() => setLeads((ls) => ls.filter((x) => x.id !== l.id))}
            />
          )}
        />
      ) : (
        <div className="px-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>{['Lead', 'Company', 'Owner', 'Status', 'Quote'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {leads.slice(page * perPage, (page + 1) * perPage).map((l) => (
                  <tr key={l.id} onClick={() => setOpenId(l.id)} className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-medium text-slate-900">{l.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{l.company}</td>
                    <td className="px-3 py-2.5 text-slate-500">{l.owner}</td>
                    <td className="px-3 py-2.5">{label(l.status)}</td>
                    <td className="px-3 py-2.5 font-semibold text-blue-600">{l.quoted ? rupees(l.quoted) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-end gap-3 text-sm text-slate-500">
            <span>Page {page + 1} of {pages}</span>
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attachment required</DialogTitle>
            <DialogDescription>Moving to {pending ? label(pending.to) : ''} needs at least one attachment.</DialogDescription>
          </DialogHeader>
          <input type="file" multiple aria-label="Attachments" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="text-sm" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPending(null)}>Cancel</Button>
            <Button disabled={files.length === 0} onClick={() => { if (pending) commit(pending.id, pending.to); setPending(null); }}>Move</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent>
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.name}</DialogTitle>
                <DialogDescription>{open.company}{open.plant ? `, ${open.plant}` : ''}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-slate-500">Status</dt><dd>{label(open.status)}</dd>
                <dt className="text-slate-500">Owner</dt><dd>{open.owner}</dd>
                <dt className="text-slate-500">Phone</dt><dd>{open.phone}</dd>
                <dt className="text-slate-500">Email</dt><dd>{open.email}</dd>
                {open.quoted ? <><dt className="text-slate-500">Quote</dt><dd>{rupees(open.quoted)}</dd></> : null}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
