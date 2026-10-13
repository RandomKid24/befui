'use client';

import * as React from 'react';
import { CheckIcon, XIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';

type Req = { id: number; name: string; type: string; range: string; days: number; reason: string; balance: number; status: 'pending' | 'approved' | 'rejected' };
const seed: Req[] = [
  { id: 1, name: 'Diya Rao', type: 'Casual leave', range: '14 to 16 Oct', days: 3, reason: 'Family wedding in Pune.', balance: 8, status: 'pending' },
  { id: 2, name: 'Rohan Das', type: 'Sick leave', range: '09 Oct', days: 1, reason: 'Fever, doctor note attached.', balance: 5, status: 'pending' },
  { id: 3, name: 'Isha Nair', type: 'Earned leave', range: '27 Oct to 03 Nov', days: 6, reason: 'Trip planned a few months back.', balance: 12, status: 'pending' },
  { id: 4, name: 'Vikram Patel', type: 'Casual leave', range: '02 Oct', days: 1, reason: 'Bank work.', balance: 4, status: 'approved' },
];

export default function LeaveApprovals() {
  const [reqs, setReqs] = React.useState(seed);
  const decide = (id: number, status: 'approved' | 'rejected') => {
    setReqs((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    toast[status === 'approved' ? 'success' : 'info'](status === 'approved' ? 'Leave approved' : 'Leave rejected');
  };
  const list = (s: Req['status']) => reqs.filter((r) => r.status === s);

  const panel = (s: Req['status']) =>
    list(s).length === 0 ? (
      <EmptyState title={`No ${s} requests`} description="Nothing to show here right now." />
    ) : (
      <div className="grid gap-3">
        {list(s).map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
            <div className="flex min-w-48 flex-1 items-center gap-3">
              <Avatar name={r.name} size="md" />
              <div className="grid leading-tight">
                <span className="text-sm font-medium">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.type} · {r.range}</span>
              </div>
            </div>
            <div className="min-w-40 flex-1">
              <p className="text-[13px]">{r.reason}</p>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={(r.days / r.balance) * 100} aria-label={`${r.name} leave used`} className="max-w-24" tone={r.days > r.balance * 0.6 ? 'warning' : 'primary'} />
                <span className="text-[11px] text-muted-foreground">{r.days} of {r.balance} days left</span>
              </div>
            </div>
            {s === 'pending' ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => decide(r.id, 'rejected')}><XIcon /> Reject</Button>
                <Button size="sm" onClick={() => decide(r.id, 'approved')}><CheckIcon /> Approve</Button>
              </div>
            ) : (
              <Badge variant={s === 'approved' ? 'success' : 'danger'} dot className="capitalize">{s}</Badge>
            )}
          </Card>
        ))}
      </div>
    );

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Leave approvals</h2>
        <p className="text-[13px] text-muted-foreground">Requests from your direct reports.</p>
      </div>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending <Badge variant="primary" className="px-1.5">{list('pending').length}</Badge></TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{panel('pending')}</TabsContent>
        <TabsContent value="approved">{panel('approved')}</TabsContent>
        <TabsContent value="rejected">{panel('rejected')}</TabsContent>
      </Tabs>
    </div>
  );
}
