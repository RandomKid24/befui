'use client';

import * as React from 'react';
import { BellIcon, CheckIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notice { id: number; who: string; text: string; time: string; read: boolean }

const SEED: Notice[] = [
  { id: 1, who: 'Diya Nair', text: 'commented on Q3 roadmap', time: '2 min ago', read: false },
  { id: 2, who: 'Rohan Shah', text: 'approved your leave request', time: '1 hour ago', read: false },
  { id: 3, who: 'Isha Rao', text: 'mentioned you in Design review', time: '3 hours ago', read: false },
  { id: 4, who: 'Kabir Singh', text: 'shared the invoice file with you', time: 'Yesterday', read: true },
  { id: 5, who: 'Aarav Mehta', text: 'joined your team', time: 'Yesterday', read: true },
  { id: 6, who: 'Meera Iyer', text: 'closed ticket CRM-042', time: '2 days ago', read: true },
];

function NoticeList({ items, onRead }: { items: Notice[]; onRead: (id: number) => void }) {
  if (!items.length) return <EmptyState icon={<BellIcon />} title="You are all caught up" description="New notifications will show up here." />;
  return (
    <ul aria-label="Notifications" className="divide-y">
      {items.map((n) => (
        <li key={n.id} className="flex items-center gap-3 px-4 py-3">
          <Avatar name={n.who} size="md" />
          <p className="min-w-0 flex-1 text-[13px]">
            <b className="font-medium">{n.who}</b> {n.text}
            <span className="block text-xs text-muted-foreground">{n.time}</span>
          </p>
          {!n.read && (
            <>
              <span className="size-2 rounded-full bg-primary"><span className="sr-only">Unread</span></span>
              <Button variant="ghost" size="xs" onClick={() => onRead(n.id)} aria-label={`Mark ${n.who}'s notification as read`}><CheckIcon /> Read</Button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function NotificationsPage() {
  const [items, setItems] = React.useState(SEED);
  const [tab, setTab] = React.useState('all');
  const unread = items.filter((n) => !n.read);
  const markRead = (id: number) => setItems((all) => all.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
          <p className="text-[13px] text-muted-foreground">{unread.length ? `${unread.length} unread` : 'Nothing new'}</p>
        </div>
        <Button variant="outline" size="sm" disabled={!unread.length} onClick={() => setItems((all) => all.map((n) => ({ ...n, read: true })))}>Mark all read</Button>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
        </TabsList>
        <Card className="mt-3 overflow-hidden">
          <TabsContent value="all" className="m-0"><NoticeList items={items} onRead={markRead} /></TabsContent>
          <TabsContent value="unread" className="m-0"><NoticeList items={unread} onRead={markRead} /></TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
