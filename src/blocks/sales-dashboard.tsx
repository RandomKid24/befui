'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart } from '@/components/ui/funnel-chart';
import { Currency } from '@/components/ui/format';
import { LineChart } from '@/components/ui/line-chart';
import { Sparkline } from '@/components/ui/charts';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const deals = [
  { name: 'Northwind renewal', owner: 'Rohan Das', value: 1250000, stage: 'Negotiation' },
  { name: 'Globex rollout', owner: 'Diya Rao', value: 840000, stage: 'Proposal' },
  { name: 'Initech pilot', owner: 'Isha Nair', value: 360000, stage: 'Demo' },
  { name: 'Umbrella expansion', owner: 'Kabir Shah', value: 2100000, stage: 'Negotiation' },
];
const tone = { Negotiation: 'warning', Proposal: 'info', Demo: 'default' } as const;

export default function SalesDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue (Oct)" value="₹72.4L" delta={12.4} chart={<Sparkline data={[42, 48, 45, 58, 63, 61, 72]} />} />
        <StatCard label="New leads" value="1,240" delta={8.1} chart={<Sparkline data={[30, 34, 31, 40, 44, 41, 52]} />} />
        <StatCard label="Win rate" value="27.8%" delta={-2.3} chart={<Sparkline data={[31, 30, 29, 30, 28, 29, 28]} />} />
        <StatCard label="Avg deal size" value="₹4.2L" delta={5.6} chart={<Sparkline data={[3.6, 3.8, 3.9, 4, 3.9, 4.1, 4.2]} />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Revenue vs target</CardTitle></CardHeader>
          <CardContent><LineChart area labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} format={(n) => `₹${n}L`} series={[{ name: 'Revenue', data: [42, 48, 45, 58, 63, 61, 72] }, { name: 'Target', data: [45, 47, 50, 54, 58, 62, 66], color: 'text-warning' }]} /></CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Pipeline funnel</CardTitle></CardHeader>
          <CardContent><FunnelChart stages={[{ label: 'Leads', value: 1240 }, { label: 'Qualified', value: 560 }, { label: 'Proposal', value: 210 }, { label: 'Won', value: 58 }]} /></CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Top open deals</CardTitle></CardHeader>
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Deal</TableHead><TableHead>Owner</TableHead><TableHead>Stage</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
          <TableBody>
            {deals.map((d) => (
              <TableRow key={d.name}>
                <TableCell className="whitespace-nowrap font-medium">{d.name}</TableCell>
                <TableCell><span className="flex items-center gap-2 whitespace-nowrap text-muted-foreground"><Avatar name={d.owner} size="xs" />{d.owner}</span></TableCell>
                <TableCell><Badge variant={tone[d.stage as keyof typeof tone]} dot>{d.stage}</Badge></TableCell>
                <TableCell className="text-right"><Currency value={d.value} compact /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
