'use client';

import * as React from 'react';
import { PlusIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventCalendar, type CalendarEvent, type EventTone } from '@/components/ui/event-calendar';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Segmented } from '@/components/ui/segmented';

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`; // crypto.randomUUID needs https
const now = new Date();
const on = (day: number, hour: number) => new Date(now.getFullYear(), now.getMonth(), day, hour);
const seed: CalendarEvent[] = [
  { id: 'e1', title: 'Sprint planning', start: on(3, 10), tone: 'primary' },
  { id: 'e2', title: 'Design review', start: on(8, 14), tone: 'warning' },
  { id: 'e3', title: 'Payroll run', start: on(10, 9), tone: 'success' },
  { id: 'e4', title: 'Team offsite', start: on(20, 9), end: on(22, 17), tone: 'primary' },
  { id: 'e5', title: 'Quarterly review', start: on(27, 15), tone: 'destructive' },
];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const colours: { value: EventTone; label: string }[] = [{ value: 'primary', label: 'Blue' }, { value: 'success', label: 'Green' }, { value: 'warning', label: 'Amber' }, { value: 'destructive', label: 'Red' }];

/** A calendar with a dialog to add events. Click a day, or use New event for the keyboard. */
export default function CalendarApp() {
  const [events, setEvents] = React.useState(seed);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState(iso(now));
  const [tone, setTone] = React.useState<EventTone>('primary');

  const show = (d: Date) => { setTitle(''); setDate(iso(d)); setTone('primary'); setOpen(true); };
  function save() {
    if (!title.trim() || !date) return;
    const [y, m, d] = date.split('-').map(Number);
    setEvents([...events, { id: uid(), title: title.trim(), start: new Date(y, m - 1, d, 9), tone }]);
    setOpen(false);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Calendar</h2>
          <p className="text-[13px] text-muted-foreground">{events.length} events</p>
        </div>
        <Button size="sm" onClick={() => show(new Date())}><PlusIcon /> New event</Button>
      </div>
      <EventCalendar events={events} onDayClick={show} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New event</DialogTitle>
            <DialogDescription>It shows on the calendar straight away.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Team lunch" /></Field>
            <Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Colour"><Segmented value={tone} onValueChange={setTone} options={colours} /></Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!title.trim()}>Save event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
