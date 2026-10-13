'use client';

import { Badge } from '@/components/ui/badge';
import { BarList } from '@/components/ui/bar-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkline } from '@/components/ui/charts';
import { Currency, formatCurrency } from '@/components/ui/format';
import { ArrowDownIcon, ArrowUpIcon, LandmarkIcon, PiggyBankIcon } from '@/components/ui/icons';
import { LineChart } from '@/components/ui/line-chart';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const transactions = [
  { date: '12 Oct', what: 'Salary, Acme Inc.', category: 'Income', amount: 185000 },
  { date: '11 Oct', what: 'Rent', category: 'Housing', amount: -42000 },
  { date: '10 Oct', what: 'Big Basket', category: 'Food', amount: -3860 },
  { date: '09 Oct', what: 'Metro card top-up', category: 'Transport', amount: -1000 },
  { date: '08 Oct', what: 'Freelance invoice #214', category: 'Income', amount: 36000 },
  { date: '07 Oct', what: 'Pharmacy', category: 'Health', amount: -1240 },
] as const;
const tone = { Income: 'success', Housing: 'info', Food: 'warning', Transport: 'default', Health: 'danger' } as const;

export default function FinanceDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Balance" value="₹12.4L" delta={5.2} icon={<LandmarkIcon />} chart={<Sparkline data={[9.8, 10.1, 10.6, 11.2, 11.0, 11.9, 12.4]} />} />
        <StatCard label="Income" value="₹2.21L" delta={8.1} icon={<ArrowDownIcon />} chart={<Sparkline data={[1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.21]} className="text-success" />} />
        <StatCard label="Spending" value="₹1.12L" delta={-3.4} icon={<ArrowUpIcon />} chart={<Sparkline data={[1.3, 1.2, 1.25, 1.18, 1.15, 1.14, 1.12]} className="text-warning" />} />
        <StatCard label="Savings rate" value="49%" delta={6} icon={<PiggyBankIcon />} chart={<Sparkline data={[38, 41, 40, 44, 46, 47, 49]} />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Cash flow</CardTitle></CardHeader>
          <CardContent>
            <LineChart
              labels={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']}
              format={(n) => `₹${n}L`}
              series={[{ name: 'Income', data: [1.9, 2.0, 2.1, 2.1, 2.2, 2.21], color: 'text-success' }, { name: 'Spending', data: [1.3, 1.25, 1.18, 1.15, 1.14, 1.12], color: 'text-warning' }]}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Spending by category</CardTitle></CardHeader>
          <CardContent>
            <BarList
              format={(n) => formatCurrency(n, { compact: true })}
              items={[{ label: 'Housing', value: 42000 }, { label: 'Food', value: 23500 }, { label: 'Transport', value: 12800 }, { label: 'Shopping', value: 21200 }, { label: 'Health', value: 8100 }]}
            />
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Recent transactions</CardTitle></CardHeader>
        <Table aria-label="Recent transactions">
          <TableHeader>
            <TableRow className="hover:bg-transparent"><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.what}>
                <TableCell className="whitespace-nowrap text-muted-foreground">{t.date}</TableCell>
                <TableCell className="font-medium">{t.what}</TableCell>
                <TableCell><Badge variant={tone[t.category]} dot>{t.category}</Badge></TableCell>
                <TableCell className="text-right"><Currency value={t.amount} signed /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
