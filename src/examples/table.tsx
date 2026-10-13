import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const rows = [
  { id: 'INV-204', client: 'Northwind Traders', owner: 'Aarav Mehta', due: '12 Oct', paid: 100, amount: 4200, status: 'Paid' },
  { id: 'INV-205', client: 'Globex Corp', owner: 'Diya Rao', due: '18 Oct', paid: 40, amount: 1150, status: 'Due' },
  { id: 'INV-206', client: 'Initech', owner: 'Rohan Das', due: '02 Oct', paid: 0, amount: 8900, status: 'Overdue' },
  { id: 'INV-207', client: 'Umbrella Labs', owner: 'Isha Nair', due: '24 Oct', paid: 100, amount: 3275, status: 'Paid' },
  { id: 'INV-208', client: 'Stark Industries', owner: 'Kabir Shah', due: '28 Oct', paid: 65, amount: 12400, status: 'Due' },
  { id: 'INV-209', client: 'Wayne Enterprises', owner: 'Meera Iyer', due: '29 Sep', paid: 0, amount: 6050, status: 'Overdue' },
  { id: 'INV-210', client: 'Hooli', owner: 'Vikram Joshi', due: '05 Nov', paid: 100, amount: 2380, status: 'Paid' },
  { id: 'INV-211', client: 'Soylent Co', owner: 'Aarav Mehta', due: '09 Nov', paid: 15, amount: 5120, status: 'Due' },
];
const tone = { Paid: 'success', Due: 'warning', Overdue: 'danger' } as const;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const total = rows.reduce((s, r) => s + r.amount, 0);
const outstanding = rows.reduce((s, r) => s + r.amount * (1 - r.paid / 100), 0);

export default function TableDemo() {
  return (
    <Card className="w-full max-w-3xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="w-32">Collected</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap font-mono text-xs">{r.id}</TableCell>
              <TableCell className="whitespace-nowrap font-medium">{r.client}</TableCell>
              <TableCell><span className="flex items-center gap-2 whitespace-nowrap text-muted-foreground"><Avatar name={r.owner} size="sm" />{r.owner}</span></TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{r.due}</TableCell>
              <TableCell><Progress value={r.paid} aria-label={`${r.client} paid`} className="h-1.5" /></TableCell>
              <TableCell className="text-right tabular-nums">{usd(r.amount)}</TableCell>
              <TableCell><Badge variant={tone[r.status as keyof typeof tone]} dot>{r.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={5}>Total · {usd(Math.round(outstanding))} outstanding</TableCell>
            <TableCell className="text-right tabular-nums">{usd(total)}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
        <TableCaption>October billing run, {rows.length} invoices</TableCaption>
      </Table>
    </Card>
  );
}
