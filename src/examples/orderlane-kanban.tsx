'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, MailIcon, PhoneIcon, TrashIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { OrderlaneKanban, ORDERLANE_NONE, type OrderlaneGroup } from '@/components/ui/orderlane-kanban';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Segmented } from '@/components/ui/segmented';

interface Status { key: string; label: string; color?: string; final?: 'won' | 'lost'; attachmentRequired?: boolean }
interface Group extends Omit<OrderlaneGroup, 'statuses'> { statuses: Status[] }
interface Order {
  id: string; series: string; status: string | null; name: string; company: string; quotes: string[];
  phone: string; email: string; value: number; wonDate?: string; delivery?: string; assignedTo?: string;
  created?: string; lastInquiry?: string; notes?: string;
}

const NONE = ORDERLANE_NONE;

const groups: Group[] = [
  { id: 'enquiry', label: 'Enquiry', color: '#3B82F6', statuses: [{ key: 'new', label: 'New' }, { key: 'quoted', label: 'Quotation submitted', color: '#6366F1' }] },
  { id: 'production', label: 'Production', color: '#F59E0B', statuses: [{ key: 'confirmed', label: 'Confirmed' }, { key: 'in_production', label: 'In production' }] },
  { id: 'dispatch', label: 'Dispatch', color: '#10B981', statuses: [{ key: 'shipped', label: 'Shipped', attachmentRequired: true }, { key: 'delivered', label: 'Delivered', final: 'won' }] },
  { id: 'closed', label: 'Closed', statuses: [{ key: 'cancelled', label: 'Cancelled', final: 'lost' }] },
];

const seed: Order[] = [
  { id: 'o1', series: 'SO-2041', status: null, name: 'Meera Chatterjee', company: 'Infosys Ltd', quotes: [], phone: '+91-98765-22202', email: 'meera.c@infosys.example', value: 0, created: '2025-03-02T10:00:00' },
  { id: 'o2', series: 'SO-2042', status: 'new', name: 'Sachin Pawar', company: 'Bajaj Auto Ltd', quotes: [], phone: '+91-98765-40401', email: 'sachin.pawar@bajaj.example', value: 8050000, created: '2025-03-04T09:30:00', assignedTo: 'Sunita Rao', lastInquiry: '2025-03-05T16:10:00' },
  { id: 'o3', series: 'SO-2043', status: 'new', name: 'Shweta Pillai', company: 'Tata Consultancy Services', quotes: [], phone: '+91-98765-50502', email: 'shweta.pillai@tcs.example', value: 6100000, created: '2025-03-04T11:45:00', assignedTo: 'Ritu Banerjee', notes: 'Wants delivery split across two campuses.' },
  { id: 'o4', series: 'SO-2044', status: 'quoted', name: 'Divya Shetty', company: 'JSW Steel Ltd', quotes: ['QTN-7781', 'QTN-7790'], phone: '+91-98765-10102', email: 'divya.shetty@jsw.example', value: 22250000, created: '2025-02-26T14:00:00', assignedTo: 'Neha Gupta', delivery: '2025-04-18T00:00:00' },
  { id: 'o5', series: 'SO-2045', status: 'quoted', name: 'Harish Tyagi', company: 'NTPC Ltd', quotes: ['QTN-7802'], phone: '+91-98765-20201', email: 'harish.tyagi@ntpc.example', value: 21185000, created: '2025-02-27T08:20:00', assignedTo: 'Simran Kaur', lastInquiry: '2025-03-03T12:05:00' },
  { id: 'o6', series: 'SO-2046', status: 'confirmed', name: 'Priya Iyer', company: 'Infosys Ltd', quotes: ['QTN-7655'], phone: '+91-98765-22201', email: 'priya.iyer@infosys.example', value: 12480000, created: '2025-02-14T10:10:00', assignedTo: 'Neha Gupta', delivery: '2025-05-02T00:00:00' },
  { id: 'o7', series: 'SO-2047', status: 'in_production', name: 'Sneha Kapoor', company: 'Bharat Heavy Electricals Ltd', quotes: ['QTN-7590', 'QTN-7611', 'QTN-7620'], phone: '+91-98765-66601', email: 'sneha.kapoor@bhel.example', value: 90350000, created: '2025-01-30T15:00:00', assignedTo: 'Ritu Banerjee', delivery: '2025-04-30T00:00:00', notes: 'Second batch waits on casting approval from the plant.' },
  { id: 'o8', series: 'SO-2048', status: 'shipped', name: 'Kabir Anand', company: 'Larsen & Toubro', quotes: ['QTN-7401'], phone: '+91-98765-31310', email: 'kabir.anand@lt.example', value: 4720000, created: '2025-01-12T09:00:00', assignedTo: 'Lakshmi Iyer', delivery: '2025-03-10T00:00:00' },
  { id: 'o9', series: 'SO-2049', status: 'delivered', name: 'Rohan Mehta', company: 'Mahindra Logistics', quotes: ['QTN-7288'], phone: '+91-98765-44420', email: 'rohan.mehta@mahindra.example', value: 3150000, wonDate: '2025-02-21T00:00:00', created: '2024-12-18T09:00:00', assignedTo: 'Sunita Rao' },
  { id: 'o10', series: 'SO-2050', status: 'cancelled', name: 'Anaya Desai', company: 'Reliance Retail', quotes: ['QTN-7012'], phone: '+91-98765-70071', email: 'anaya.desai@reliance.example', value: 1900000, created: '2024-12-02T13:30:00', notes: 'Buyer moved the project to next financial year.' },
];

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleString('en-IN', o);
const medium = (iso: string) => fmt(iso, { dateStyle: 'medium' });
const shortDate = (iso: string) => fmt(iso, { dateStyle: 'short' });
const shortTime = (iso: string) => fmt(iso, { timeStyle: 'short' });
const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function OrderCardBody({ order, onDelete }: { order: Order; onDelete: () => void }) {
  return (
    <>
    <div className="flex items-start justify-between gap-1">
      <div className="truncate text-base font-semibold text-blue-600">{order.series}</div>
      <button
        type="button"
        aria-label={`Delete ${order.series}`}
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="rounded p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
      >
        <TrashIcon className="size-[14px]" />
      </button>
    </div>
    <div className="mt-1">
      <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
        {order.status ? groups.flatMap((g) => g.statuses).find((s) => s.key === order.status)?.label : 'No status'}
      </span>
    </div>
    <div className="mt-1.5 truncate text-sm text-slate-700">{order.name}</div>
    <div className="mt-0.5 truncate text-xs text-slate-500">{order.company}</div>
    {order.quotes.length > 0 && (
      <div className="mt-1 truncate text-xs text-slate-600">
        Quote: <span className="font-medium">{order.quotes[0]}</span>
        {order.quotes.length > 1 && <span className="text-slate-400"> +{order.quotes.length - 1} more</span>}
      </div>
    )}
    <div className="mt-1.5 grid grid-cols-2 gap-x-2">
      <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-700">
        <PhoneIcon className="size-[11px] shrink-0 text-slate-400" />
        <span className="truncate">{order.phone}</span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-700">
        <MailIcon className="size-[11px] shrink-0 text-slate-400" />
        <span className="truncate">{order.email}</span>
      </div>
    </div>
    {order.value > 0 && <div className="mt-1.5 text-sm font-semibold text-slate-800">{rupees(order.value)}</div>}
    {order.wonDate && (
      <div className="mt-1.5 flex w-fit items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
        <CalendarIcon className="size-3 text-emerald-600" />
        <span>Won: <b>{medium(order.wonDate)}</b></span>
      </div>
    )}
    {order.delivery && <div className="mt-0.5 text-xs text-slate-500">Delivery: {shortDate(order.delivery)}</div>}
    {order.assignedTo && <div className="mt-0.5 text-xs text-slate-500">Assigned: {order.assignedTo}</div>}
    {order.created && <div className="mt-0.5 text-xs text-slate-400">Created: {shortDate(order.created)}</div>}
    {order.lastInquiry && <div className="mt-1 text-xs text-slate-500">Last inquiry: {shortDate(order.lastInquiry)} {shortTime(order.lastInquiry)}</div>}
    {order.notes && <div className="mt-1 truncate text-xs text-slate-500" title={order.notes}>{order.notes}</div>}
    </>
  );
}

/** Orders board built on OrderlaneKanban: collapsible status groups, drag between columns, an attachment gate on Shipped and a paginated table view. */
export default function OrderlaneKanbanDemo() {
  const [orders, setOrders] = React.useState(seed);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<'kanban' | 'table'>('kanban');
  const [hideEmpty, setHideEmpty] = React.useState(false);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<{ id: string; to: string } | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [page, setPage] = React.useState(0);

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const statusOf = (key: string) => groups.flatMap((g) => g.statuses).find((s) => s.key === key);
  const keyOf = (o: Order) => (o.status && statusOf(o.status) ? o.status : NONE);
  const value = React.useMemo(() => {
    const v: Record<string, Order[]> = {};
    for (const o of orders) (v[keyOf(o)] ??= []).push(o);
    return v;
  }, [orders]);

  const commit = (id: string, to: string) => {
    const s = statusOf(to);
    setOrders((os) => os.map((o) => o.id === id ? { ...o, status: to === NONE ? null : to, wonDate: s?.final === 'won' ? new Date().toISOString() : o.wonDate } : o));
    setSavingId(id);
    setTimeout(() => setSavingId(null), 700);
  };
  const onMove = (id: string, _from: string, to: string) => {
    if (statusOf(to)?.attachmentRequired) { setFiles([]); setPending({ id, to }); } else commit(id, to);
  };

  const open = orders.find((o) => o.id === openId);
  const perPage = 5;
  const pages = Math.max(1, Math.ceil(orders.length / perPage));

  return (
    <div className="rounded-xl bg-white py-3 font-[Outfit,sans-serif] text-slate-800">
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');"}</style>
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
        <div className="py-24 text-center text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-24 text-center">
          <div className="font-bold text-slate-900">No orders yet</div>
          <div className="mt-1 text-sm text-slate-500">Create your first order to see it on the board.</div>
          <Button className="mt-4" onClick={() => setOrders(seed)}>New</Button>
        </div>
      ) : view === 'kanban' ? (
        <OrderlaneKanban<Order>
          groups={groups}
          value={value}
          onMove={onMove}
          hideEmpty={hideEmpty}
          savingId={savingId}
          isLocked={(o) => !!(o.status && statusOf(o.status)?.final)}
          onCardClick={(o) => setOpenId(o.id)}
          renderCard={(o) => <OrderCardBody order={o} onDelete={() => setOrders((os) => os.filter((x) => x.id !== o.id))} />}
        />
      ) : (
        <div className="px-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>{['Order', 'Customer', 'Company', 'Status', 'Value'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {orders.slice(page * perPage, (page + 1) * perPage).map((o) => (
                  <tr key={o.id} onClick={() => setOpenId(o.id)} className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-semibold text-blue-600">{o.series}</td>
                    <td className="px-3 py-2.5">{o.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{o.company}</td>
                    <td className="px-3 py-2.5">{o.status ? statusOf(o.status)?.label : 'No status'}</td>
                    <td className="px-3 py-2.5 font-semibold">{o.value ? rupees(o.value) : '-'}</td>
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
            <DialogDescription>Moving to {pending ? statusOf(pending.to)?.label : ''} needs at least one attachment.</DialogDescription>
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
                <DialogTitle>{open.series}</DialogTitle>
                <DialogDescription>{open.name}, {open.company}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-slate-500">Status</dt><dd>{open.status ? statusOf(open.status)?.label : 'No status'}</dd>
                <dt className="text-slate-500">Phone</dt><dd>{open.phone}</dd>
                <dt className="text-slate-500">Email</dt><dd>{open.email}</dd>
                {open.value > 0 && <><dt className="text-slate-500">Value</dt><dd>{rupees(open.value)}</dd></>}
                {open.assignedTo && <><dt className="text-slate-500">Assigned</dt><dd>{open.assignedTo}</dd></>}
                {open.notes && <><dt className="text-slate-500">Notes</dt><dd>{open.notes}</dd></>}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
