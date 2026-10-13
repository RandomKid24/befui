import { EyeIcon, IndianRupeeIcon, MousePointerClickIcon, TargetIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Sparkline } from '@/components/ui/charts';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const campaigns = [
  { name: 'Diwali early access', channel: 'Email', spend: 42000, leads: 214, budget: 80, status: 'Live' },
  { name: 'Trade show follow-up', channel: 'Email', spend: 18000, leads: 96, budget: 100, status: 'Done' },
  { name: 'Search: industrial pumps', channel: 'Google Ads', spend: 126000, leads: 310, budget: 62, status: 'Live' },
  { name: 'LinkedIn case studies', channel: 'LinkedIn', spend: 54000, leads: 71, budget: 45, status: 'Paused' },
] as const;
const tone = { Live: 'success', Done: 'default', Paused: 'warning' } as const;
const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function CampaignPerformance() {
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Campaigns</h2>
        <p className="text-[13px] text-muted-foreground">Last 30 days across all channels.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Impressions" value="1.2M" delta={8.4} icon={<EyeIcon />} chart={<Sparkline data={[4, 5, 5, 7, 6, 8, 9, 11]} />} />
        <StatCard label="Clicks" value="38.4K" delta={5.1} icon={<MousePointerClickIcon />} chart={<Sparkline data={[3, 4, 3.5, 5, 5.5, 6, 6.4, 7]} />} />
        <StatCard label="Leads" value="691" delta={14.2} icon={<TargetIcon />} chart={<Sparkline data={[2, 3, 4, 3.6, 5, 6, 7, 9]} className="text-success" />} />
        <StatCard label="Cost per lead" value="₹356" delta={-6.3} icon={<IndianRupeeIcon />} chart={<Sparkline data={[9, 8, 8.4, 7, 7.2, 6, 5.8, 5]} className="text-success" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Leads by week</CardTitle>
            <CardDescription>Wk 1 to Wk 5</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart height={170} data={[{ label: 'W1', value: 112 }, { label: 'W2', value: 134 }, { label: 'W3', value: 148 }, { label: 'W4', value: 171 }, { label: 'W5', value: 126 }]} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader><CardTitle>Active campaigns</CardTitle></CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Campaign</TableHead>
                <TableHead className="hidden sm:table-cell">Spend</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead className="hidden md:table-cell">Budget used</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.name}>
                  <TableCell>
                    <div className="grid leading-tight">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden tabular-nums sm:table-cell">{inr(c.spend)}</TableCell>
                  <TableCell className="tabular-nums">{c.leads}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={c.budget} aria-label={`${c.name} budget used`} className="w-20" tone={c.budget > 90 ? 'danger' : 'primary'} />
                      <span className="text-xs tabular-nums text-muted-foreground">{c.budget}%</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={tone[c.status]} dot>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
