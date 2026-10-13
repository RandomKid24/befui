'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkline } from '@/components/ui/charts';
import { DataTable, type Column } from '@/components/ui/data-table';
import { DownloadIcon, EyeIcon, FileIcon, MoreIcon, TrashIcon } from '@/components/ui/icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilterBar, type FilterValue } from '@/components/ui/filter-bar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

type Status = 'Ready' | 'Scheduled' | 'Failed';
interface Report { id: string; name: string; type: string; owner: string; updated: string; rows: number; status: Status; trend: number[] }

const seed: Report[] = [
  { id: 'R-101', name: 'Monthly payroll summary', type: 'Payroll', owner: 'Meera Iyer', updated: '2026-10-07', rows: 482, status: 'Ready', trend: [41, 43, 42, 46, 45, 48, 49] },
  { id: 'R-102', name: 'Attendance by department', type: 'Attendance', owner: 'Isha Nair', updated: '2026-10-08', rows: 1260, status: 'Ready', trend: [92, 91, 93, 90, 94, 95, 94] },
  { id: 'R-103', name: 'Leave balance liability', type: 'Leave', owner: 'Isha Nair', updated: '2026-10-05', rows: 318, status: 'Scheduled', trend: [12, 14, 13, 16, 18, 17, 19] },
  { id: 'R-104', name: 'Expense claims aging', type: 'Finance', owner: 'Kabir Shah', updated: '2026-10-03', rows: 96, status: 'Failed', trend: [30, 28, 35, 31, 26, 22, 0] },
  { id: 'R-105', name: 'Attrition and exits', type: 'People', owner: 'Aarav Mehta', updated: '2026-09-30', rows: 54, status: 'Ready', trend: [4, 3, 5, 2, 4, 6, 3] },
  { id: 'R-106', name: 'Hiring pipeline funnel', type: 'People', owner: 'Rohan Das', updated: '2026-10-06', rows: 213, status: 'Scheduled', trend: [20, 26, 24, 31, 29, 35, 38] },
  { id: 'R-107', name: 'Overtime by team', type: 'Payroll', owner: 'Meera Iyer', updated: '2026-10-01', rows: 148, status: 'Ready', trend: [8, 9, 12, 10, 14, 13, 11] },
  { id: 'R-108', name: 'Vendor payments due', type: 'Finance', owner: 'Kabir Shah', updated: '2026-10-08', rows: 71, status: 'Ready', trend: [15, 18, 14, 19, 21, 17, 23] },
  { id: 'R-109', name: 'Late check-ins', type: 'Attendance', owner: 'Vikram Joshi', updated: '2026-09-28', rows: 389, status: 'Failed', trend: [44, 40, 42, 39, 0, 0, 0] },
  { id: 'R-110', name: 'Training completion', type: 'People', owner: 'Diya Rao', updated: '2026-10-04', rows: 175, status: 'Ready', trend: [55, 58, 61, 66, 70, 74, 79] },
];

const tone = { Ready: 'success', Scheduled: 'info', Failed: 'danger' } as const;
const date = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ReportsTable() {
  const [reports, setReports] = React.useState(seed);
  const [filters, setFilters] = React.useState<FilterValue>({});
  const [open, setOpen] = React.useState<Report | null>(null);

  const shown = reports.filter((r) => (!filters.status || r.status === filters.status) && (!filters.type || r.type === filters.type) && (!filters.owner || r.owner === filters.owner));
  const uniq = (f: (r: Report) => string) => [...new Set(seed.map(f))];
  const download = (r: Report) => toast.success('Download started', `${r.name}.csv`);
  const remove = (r: Report) => { setReports((l) => l.filter((x) => x.id !== r.id)); setOpen(null); toast.info('Report deleted', r.name); };

  const columns: Column<Report>[] = [
    { key: 'name', header: 'Report', sortable: true, value: (r) => r.name, render: (r) => <span className="flex items-center gap-2 whitespace-nowrap font-medium"><FileIcon className="size-4 text-muted-foreground" />{r.name}</span> },
    { key: 'type', header: 'Type', sortable: true, value: (r) => r.type },
    { key: 'owner', header: 'Owner', sortable: true, value: (r) => r.owner },
    { key: 'updated', header: 'Updated', sortable: true, value: (r) => r.updated, render: (r) => <span className="whitespace-nowrap text-muted-foreground">{date(r.updated)}</span> },
    { key: 'rows', header: 'Rows', sortable: true, align: 'right', value: (r) => r.rows, render: (r) => r.rows.toLocaleString('en-IN') },
    { key: 'status', header: 'Status', sortable: true, value: (r) => r.status, render: (r) => <Badge variant={tone[r.status]} dot>{r.status}</Badge> },
  ];

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Reports</h2>
        <p className="text-[13px] text-muted-foreground">Search, filter and sort. Click a row for details, or use the menu for quick actions.</p>
      </div>
      <DataTable
        rows={shown}
        columns={columns}
        rowKey={(r) => r.id}
        pageSize={6}
        filterPlaceholder="Search reports"
        columnMenu
        onRowClick={setOpen}
        toolbar={
          <FilterBar
            value={filters}
            onChange={setFilters}
            fields={[
              { key: 'status', label: 'Status', options: ['Ready', 'Scheduled', 'Failed'] },
              { key: 'type', label: 'Type', options: uniq((r) => r.type) },
              { key: 'owner', label: 'Owner', options: uniq((r) => r.owner) },
            ]}
          />
        }
        rowActions={(r) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${r.name}`}><MoreIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => setOpen(r)}><EyeIcon /> View details</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => download(r)}><DownloadIcon /> Download CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => remove(r)}><TrashIcon /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent>
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
                <SheetDescription>{open.id} · {open.type} · owned by {open.owner}</SheetDescription>
              </SheetHeader>
              <div className="grid gap-5 overflow-y-auto">
                <div className="flex items-center gap-2"><Badge variant={tone[open.status]} dot>{open.status}</Badge><span className="text-xs text-muted-foreground">Updated {date(open.updated)}</span></div>
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">Rows</dt><dd className="text-xl font-semibold tabular-nums">{open.rows.toLocaleString('en-IN')}</dd></div>
                  <div className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">Last run</dt><dd className="text-xl font-semibold tabular-nums">{open.trend[open.trend.length - 1]}</dd></div>
                </dl>
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Last 7 runs</p>
                  <Sparkline data={open.trend} className="h-16 w-full text-primary" />
                </div>
                {open.status === 'Failed' && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-[13px] text-destructive">The last run failed. Check the data source and run it again.</p>}
              </div>
              <div className="mt-auto flex gap-2">
                <Button className="flex-1" onClick={() => download(open)}><DownloadIcon /> Download CSV</Button>
                <Button variant="outline" onClick={() => remove(open)}><TrashIcon /> Delete</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
