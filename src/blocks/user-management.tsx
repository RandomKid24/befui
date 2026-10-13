'use client';

import * as React from 'react';
import { UserInfo } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreIcon, UserPlusIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

interface User { id: string; name: string; email: string; role: string; status: 'Active' | 'Invited' | 'Suspended'; last: string }

const seed: User[] = [
  { id: '1', name: 'Aarav Mehta', email: 'aarav@acme.co', role: 'Owner', status: 'Active', last: 'Today' },
  { id: '2', name: 'Ananya Kulkarni', email: 'ananya@acme.co', role: 'Admin', status: 'Active', last: 'Today' },
  { id: '3', name: 'Rohan Das', email: 'rohan@acme.co', role: 'Editor', status: 'Active', last: 'Yesterday' },
  { id: '4', name: 'Isha Nair', email: 'isha@acme.co', role: 'Viewer', status: 'Invited', last: 'Never' },
  { id: '5', name: 'Kabir Shah', email: 'kabir@acme.co', role: 'Editor', status: 'Suspended', last: '3 weeks ago' },
];
const tone = { Active: 'success', Invited: 'info', Suspended: 'danger' } as const;

export default function UserManagement() {
  const [users, setUsers] = React.useState(seed);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('Viewer');

  const invite = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Enter a valid email');
    setUsers((u) => [{ id: String(Date.now()), name: email.split('@')[0]!, email, role, status: 'Invited', last: 'Never' }, ...u]);
    toast.success(`Invite sent to ${email}`);
    setEmail('');
    setOpen(false);
  };
  const setStatus = (id: string, status: User['status']) => setUsers((u) => u.map((x) => (x.id === id ? { ...x, status } : x)));

  const columns: Column<User>[] = [
    { key: 'name', header: 'User', value: (u) => u.name, sortable: true, render: (u) => <UserInfo name={u.name} subtitle={u.email} /> },
    { key: 'role', header: 'Role', value: (u) => u.role, sortable: true },
    { key: 'status', header: 'Status', value: (u) => u.status, sortable: true, render: (u) => <Badge variant={tone[u.status]} dot>{u.status}</Badge> },
    { key: 'last', header: 'Last active', value: (u) => u.last },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1"><h1 className="text-xl font-semibold tracking-tight">Team members</h1><p className="text-[13px] text-muted-foreground">{users.length} people have access to this workspace.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><UserPlusIcon /> Invite</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite a teammate</DialogTitle><DialogDescription>They get an email with a link to join.</DialogDescription></DialogHeader>
            <div className="grid gap-3">
              <Field label="Email" htmlFor="inv-email"><Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" /></Field>
              <Field label="Role">
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['Admin', 'Editor', 'Viewer'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={invite}>Send invite</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        rows={users}
        columns={columns}
        rowKey={(u) => u.id}
        filterPlaceholder="Search people"
        rowActions={(u) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Actions for ${u.name}`}><MoreIcon /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => toast.success('Role changer would open here')}>Change role</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setStatus(u.id, u.status === 'Suspended' ? 'Active' : 'Suspended')}>{u.status === 'Suspended' ? 'Reactivate' : 'Suspend'}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => setUsers((l) => l.filter((x) => x.id !== u.id))}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}
