import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BarChart, Sparkline } from '@/components/ui/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupeeIcon, MegaphoneIcon, UsersIcon } from '@/components/ui/icons';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const requests = [
  { name: 'Diya Rao', type: 'Casual leave', days: 2, status: 'Pending' },
  { name: 'Rohan Das', type: 'Sick leave', days: 1, status: 'Approved' },
  { name: 'Isha Nair', type: 'Earned leave', days: 5, status: 'Pending' },
  { name: 'Kabir Shah', type: 'Work from home', days: 3, status: 'Rejected' },
] as const;
const tone = { Pending: 'warning', Approved: 'success', Rejected: 'danger' } as const;

export default function Dashboard() {
  return (
    <div className="grid w-full gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Headcount" value="142" delta={4.2} icon={<UsersIcon />} chart={<Sparkline data={[3, 4, 4, 5, 6, 6, 8, 9]} />} />
        <StatCard label="Payroll" value="₹48.2L" delta={12.5} icon={<IndianRupeeIcon />} chart={<Sparkline data={[2, 3, 2.5, 4, 5, 4.6, 6, 7]} className="text-success" />} />
        <StatCard label="Open roles" value="9" delta={-3.1} icon={<MegaphoneIcon />} chart={<Sparkline data={[8, 7, 7.5, 6, 6.2, 5, 5.4, 4]} className="text-destructive" />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Hires per month</CardTitle><CardDescription>The last six months.</CardDescription></CardHeader>
          <CardContent><BarChart height={160} data={[{ label: 'May', value: 8 }, { label: 'Jun', value: 12 }, { label: 'Jul', value: 9 }, { label: 'Aug', value: 15 }, { label: 'Sep', value: 11 }, { label: 'Oct', value: 18 }]} /></CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader><CardTitle>Leave requests</CardTitle><CardDescription>Waiting on you first.</CardDescription></CardHeader>
          <Table>
            <TableHeader><TableRow><TableHead>Who</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.name}>
                  <TableCell><span className="flex items-center gap-2"><Avatar name={r.name} size="xs" />{r.name}</span></TableCell>
                  <TableCell>{r.days}</TableCell>
                  <TableCell><Badge variant={tone[r.status]} dot>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
