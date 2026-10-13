'use client';

import { Avatar } from '@/components/ui/avatar';
import { BarList } from '@/components/ui/bar-list';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkline } from '@/components/ui/charts';
import { Currency, formatCurrency } from '@/components/ui/format';
import { IndianRupeeIcon, ShoppingCartIcon, TruckIcon, UsersIcon } from '@/components/ui/icons';
import { LineChart } from '@/components/ui/line-chart';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const orders = [
  { id: '#10492', customer: 'Meera Iyer', total: 4599, status: 'Delivered' },
  { id: '#10491', customer: 'Karan Malhotra', total: 12999, status: 'Shipped' },
  { id: '#10490', customer: 'Sana Qureshi', total: 899, status: 'Processing' },
  { id: '#10489', customer: 'Dev Patel', total: 2350, status: 'Cancelled' },
] as const;
const tone = { Delivered: 'success', Shipped: 'info', Processing: 'warning', Cancelled: 'danger' } as const;

export default function EcommerceDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales" value="₹8.4L" delta={14.2} icon={<IndianRupeeIcon />} chart={<Sparkline data={[5, 5.4, 6, 5.8, 7, 7.6, 8.4]} className="text-success" />} />
        <StatCard label="Orders" value="1,284" delta={7.9} icon={<ShoppingCartIcon />} chart={<Sparkline data={[800, 880, 940, 910, 1100, 1200, 1284]} />} />
        <StatCard label="Customers" value="936" delta={4.3} icon={<UsersIcon />} chart={<Sparkline data={[600, 650, 700, 760, 800, 880, 936]} />} />
        <StatCard label="To ship" value="42" delta={-12} icon={<TruckIcon />} chart={<Sparkline data={[60, 55, 58, 50, 48, 45, 42]} className="text-warning" />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
          <CardContent><LineChart area labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} format={(n) => `₹${n}L`} series={[{ name: 'Revenue', data: [4.1, 4.8, 4.5, 5.9, 6.4, 7.1, 8.4] }]} /></CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Top products</CardTitle></CardHeader>
          <CardContent><BarList format={(n) => formatCurrency(n, { compact: true })} items={[{ label: 'Linen shirt', value: 184000 }, { label: 'Canvas sneakers', value: 152000 }, { label: 'Leather wallet', value: 98000 }, { label: 'Tote bag', value: 61000 }]} /></CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Recent orders</CardTitle></CardHeader>
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell><span className="flex items-center gap-2 whitespace-nowrap text-muted-foreground"><Avatar name={o.customer} size="xs" />{o.customer}</span></TableCell>
                <TableCell><Badge variant={tone[o.status]} dot>{o.status}</Badge></TableCell>
                <TableCell className="text-right"><Currency value={o.total} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
