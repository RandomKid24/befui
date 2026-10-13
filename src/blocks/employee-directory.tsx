'use client';

import * as React from 'react';
import { DownloadIcon, MoreIcon, PlusIcon, SearchIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Segmented } from '@/components/ui/segmented';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Status = 'Active' | 'On leave' | 'Probation';
const people: { id: string; name: string; email: string; role: string; dept: string; status: Status; joined: string }[] = [
  { id: 'EMP-001', name: 'Aarav Mehta', email: 'aarav@acme.co', role: 'Engineering Manager', dept: 'Engineering', status: 'Active', joined: '12 Mar 2021' },
  { id: 'EMP-002', name: 'Diya Rao', email: 'diya@acme.co', role: 'Product Designer', dept: 'Design', status: 'Active', joined: '04 Aug 2022' },
  { id: 'EMP-003', name: 'Kabir Shah', email: 'kabir@acme.co', role: 'Account Executive', dept: 'Sales', status: 'On leave', joined: '19 Jan 2023' },
  { id: 'EMP-004', name: 'Meera Iyer', email: 'meera@acme.co', role: 'HR Business Partner', dept: 'People', status: 'Active', joined: '23 Jun 2020' },
  { id: 'EMP-005', name: 'Rohan Das', email: 'rohan@acme.co', role: 'Backend Engineer', dept: 'Engineering', status: 'Probation', joined: '01 Sep 2025' },
  { id: 'EMP-006', name: 'Isha Nair', email: 'isha@acme.co', role: 'Marketing Lead', dept: 'Marketing', status: 'Active', joined: '11 Nov 2021' },
  { id: 'EMP-007', name: 'Vikram Patel', email: 'vikram@acme.co', role: 'Finance Analyst', dept: 'Finance', status: 'Active', joined: '30 May 2024' },
  { id: 'EMP-008', name: 'Sana Khan', email: 'sana@acme.co', role: 'QA Engineer', dept: 'Engineering', status: 'On leave', joined: '08 Feb 2023' },
];
const tone = { Active: 'success', 'On leave': 'warning', Probation: 'info' } as const;
const PAGE = 5;

export default function EmployeeDirectory() {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | Status>('all');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);

  const rows = people.filter(
    (p) => (filter === 'all' || p.status === filter) && `${p.name} ${p.role} ${p.dept}`.toLowerCase().includes(q.toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const visible = rows.slice((page - 1) * PAGE, page * PAGE);
  const allOnPage = visible.length > 0 && visible.every((r) => selected.includes(r.id));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Employees</h2>
          <p className="text-[13px] text-muted-foreground">{people.length} people across 6 departments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><DownloadIcon /> Export</Button>
          <Button size="sm"><PlusIcon /> Add employee</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
          <div className="w-full sm:w-64">
            <Input leftIcon={<SearchIcon />} placeholder="Search name, role, team" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="h-8" />
          </div>
          <Segmented
            value={filter}
            onValueChange={(v) => { setFilter(v); setPage(1); }}
            options={[{ value: 'all', label: 'All' }, { value: 'Active', label: 'Active' }, { value: 'On leave', label: 'On leave' }, { value: 'Probation', label: 'Probation' }]}
          />
        </div>

        {selected.length > 0 && (
          <div className="flex items-center justify-between border-b bg-accent px-4 py-2 text-[13px] text-accent-foreground">
            <span className="font-medium">{selected.length} selected</span>
            <Button variant="ghost" size="xs" onClick={() => setSelected([])}>Clear</Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all"
                  checked={allOnPage}
                  onCheckedChange={(v) => setSelected(v ? [...new Set([...selected, ...visible.map((r) => r.id)])] : selected.filter((id) => !visible.some((r) => r.id === id)))}
                />
              </TableHead>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((p) => (
              <TableRow key={p.id} data-state={selected.includes(p.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${p.name}`}
                    checked={selected.includes(p.id)}
                    onCheckedChange={(v) => setSelected(v ? [...selected, p.id] : selected.filter((id) => id !== p.id))}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} />
                    <div className="grid leading-tight">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.role}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{p.dept}</TableCell>
                <TableCell><Badge variant={tone[p.status]} dot>{p.status}</Badge></TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{p.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Row actions"><MoreIcon /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive>Offboard</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No employees match.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t p-3 text-[13px] text-muted-foreground">
          <span>Showing {visible.length} of {rows.length}</span>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
