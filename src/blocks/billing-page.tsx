'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCardIcon, DownloadIcon } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

const invoices = [
  { id: 'INV-0142', date: '1 Oct 2026', amount: '₹18,588', status: 'Paid' },
  { id: 'INV-0131', date: '1 Sep 2026', amount: '₹18,588', status: 'Paid' },
  { id: 'INV-0120', date: '1 Aug 2026', amount: '₹15,588', status: 'Paid' },
];

export default function BillingPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between">
            <div className="grid gap-1"><CardTitle>Business plan</CardTitle><CardDescription>₹1,299 per seat per month, billed monthly. Renews 1 Nov 2026.</CardDescription></div>
            <Badge variant="success" dot>Active</Badge>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5"><div className="flex justify-between text-[13px]"><span>Seats</span><span className="text-muted-foreground">12 of 15 used</span></div><Progress value={80} aria-label="Seats used" /></div>
            <div className="grid gap-1.5"><div className="flex justify-between text-[13px]"><span>Storage</span><span className="text-muted-foreground">186 of 200 GB</span></div><Progress value={93} tone="warning" aria-label="Storage used" /></div>
            <div className="flex gap-2"><Button size="sm">Change plan</Button><Button size="sm" variant="outline" onClick={() => toast.success('Add-on request sent')}>Add storage</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border p-3"><CreditCardIcon className="size-5 text-muted-foreground" /><div className="grid text-[13px]"><span className="font-medium">Visa ending 4242</span><span className="text-muted-foreground">Expires 08/28</span></div></div>
            <Button size="sm" variant="outline">Update card</Button>
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="w-10"><span className="sr-only">Download</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {invoices.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.id}</TableCell><TableCell className="text-muted-foreground">{i.date}</TableCell><TableCell className="tabular-nums">{i.amount}</TableCell>
                <TableCell><Badge variant="success" dot>{i.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon-sm" aria-label={`Download ${i.id}`}><DownloadIcon /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
