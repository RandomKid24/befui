'use client';

import * as React from 'react';
import { SearchIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Kanban, type KanbanColumn } from '@/components/ui/kanban';
import { Segmented } from '@/components/ui/segmented';

type Priority = 'High' | 'Medium' | 'Low';
interface Task { id: string; title: string; assignee: string; priority: Priority; due: string; notes: string; col: string }

const columns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'doing', title: 'In progress', tone: 'info' },
  { id: 'review', title: 'Review', tone: 'warning' },
  { id: 'done', title: 'Done', tone: 'success' },
];
const seed: Task[] = [
  { id: 't1', title: 'Redesign the invoice PDF', assignee: 'Diya Nair', priority: 'Medium', due: '18 Oct', notes: 'New header, tax summary and a QR code for payment.', col: 'backlog' },
  { id: 't2', title: 'Fix timezone bug in reports', assignee: 'Rohan Shah', priority: 'High', due: '15 Oct', notes: 'Daily totals shift by a day for users east of UTC.', col: 'backlog' },
  { id: 't3', title: 'Write onboarding emails', assignee: 'Isha Rao', priority: 'Low', due: '25 Oct', notes: 'Three short emails over the first week.', col: 'backlog' },
  { id: 't4', title: 'Add CSV export to the table', assignee: 'Sana Qureshi', priority: 'Medium', due: '17 Oct', notes: 'Respect the current filters and sort order.', col: 'doing' },
  { id: 't5', title: 'Speed up the dashboard query', assignee: 'Rohan Shah', priority: 'High', due: '16 Oct', notes: 'Two slow joins. Add an index and cache the totals.', col: 'doing' },
  { id: 't6', title: 'Dark mode contrast pass', assignee: 'Dev Patel', priority: 'Medium', due: '19 Oct', notes: 'Check every status colour against the new background.', col: 'review' },
  { id: 't7', title: 'Update the pricing page copy', assignee: 'Isha Rao', priority: 'Low', due: '14 Oct', notes: 'Match the new plan names.', col: 'review' },
  { id: 't8', title: 'Set up error alerts', assignee: 'Sana Qureshi', priority: 'High', due: '12 Oct', notes: 'Page the on-call channel after five errors in a minute.', col: 'done' },
  { id: 't9', title: 'Archive old projects', assignee: 'Dev Patel', priority: 'Low', due: '10 Oct', notes: 'Anything untouched for a year.', col: 'done' },
];
const tone = { High: 'danger', Medium: 'warning', Low: 'default' } as const;

/** Full-page board with search and a priority filter. Drag a card, or focus it and press Alt + arrow keys. */
export default function KanbanBoardPage() {
  const [tasks, setTasks] = React.useState(seed);
  const [query, setQuery] = React.useState('');
  const [priority, setPriority] = React.useState<'All' | Priority>('All');
  const [openId, setOpenId] = React.useState<string | null>(null);

  const matches = (t: Task) => (priority === 'All' || t.priority === priority) && t.title.toLowerCase().includes(query.trim().toLowerCase());
  const visible = tasks.filter(matches);
  const value = Object.fromEntries(columns.map((c) => [c.id, visible.filter((t) => t.col === c.id)]));
  const open = tasks.find((t) => t.id === openId);

  // The board only knows the visible cards, so tasks hidden by a filter keep their column and go after the rest.
  const onChange = (next: Record<string, Task[]>) =>
    setTasks([...columns.flatMap((c) => next[c.id].map((t) => ({ ...t, col: c.id }))), ...tasks.filter((t) => !matches(t))]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Product board</h2>
          <p className="text-[13px] text-muted-foreground">{visible.length} of {tasks.length} tasks</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input leftIcon={<SearchIcon />} aria-label="Search tasks" placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} className="w-52" />
          <div role="group" aria-label="Priority">
            <Segmented value={priority} onValueChange={setPriority} options={(['All', 'High', 'Medium', 'Low'] as const).map((p) => ({ value: p, label: p }))} />
          </div>
        </div>
      </div>

      <Kanban
        columns={columns}
        value={value}
        onChange={onChange}
        renderCard={(t) => (
          <div className="grid gap-2">
            <button type="button" onClick={() => setOpenId(t.id)} className="text-start font-medium outline-none hover:underline focus-visible:underline">{t.title}</button>
            <div className="flex items-center justify-between gap-2">
              <Badge variant={tone[t.priority]}>{t.priority}</Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">{t.due}<Avatar name={t.assignee} size="xs" /></span>
            </div>
          </div>
        )}
      />

      <Dialog open={!!open} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <DialogContent>
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription>Due {open.due} · {open.assignee}</DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{open.notes}</p>
              <div className="grid gap-2">
                <span className="text-[13px] font-medium">Move to</span>
                <Segmented value={open.col} onValueChange={(col) => setTasks(tasks.map((t) => (t.id === open.id ? { ...t, col } : t)))} options={columns.map((c) => ({ value: c.id, label: c.title }))} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
