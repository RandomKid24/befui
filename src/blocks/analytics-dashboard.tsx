import { BarList } from '@/components/ui/bar-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, DonutChart, Sparkline } from '@/components/ui/charts';
import { EyeIcon, ClockIcon, MousePointerClickIcon, UsersIcon } from '@/components/ui/icons';
import { LineChart } from '@/components/ui/line-chart';
import { StatCard } from '@/components/ui/stat-card';

export default function AnalyticsDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitors" value="48.2K" delta={9.4} icon={<UsersIcon />} chart={<Sparkline data={[30, 34, 33, 39, 41, 40, 48]} />} />
        <StatCard label="Page views" value="132K" delta={6.1} icon={<EyeIcon />} chart={<Sparkline data={[90, 96, 101, 98, 110, 118, 132]} />} />
        <StatCard label="Avg. session" value="3m 42s" delta={-1.8} icon={<ClockIcon />} chart={<Sparkline data={[4, 3.9, 3.8, 3.9, 3.7, 3.8, 3.7]} className="text-destructive" />} />
        <StatCard label="Conversion" value="3.4%" delta={0.6} icon={<MousePointerClickIcon />} chart={<Sparkline data={[2.8, 3, 3.1, 3.2, 3.1, 3.3, 3.4]} className="text-success" />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Traffic, last 7 months</CardTitle></CardHeader>
          <CardContent>
            <LineChart area labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} format={(n) => `${n}K`} series={[{ name: 'Visitors', data: [22, 26, 25, 33, 37, 41, 48] }, { name: 'Signups', data: [3, 4, 4, 6, 7, 8, 9], color: 'text-success' }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent>
            <DonutChart size={120} centerLabel="48.2K" data={[{ label: 'Mobile', value: 29 }, { label: 'Desktop', value: 17 }, { label: 'Tablet', value: 2 }]} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top pages</CardTitle></CardHeader>
          <CardContent><BarList items={[{ label: '/pricing', value: 12840 }, { label: '/docs/getting-started', value: 9210 }, { label: '/blog/launch-notes', value: 5632 }, { label: '/signup', value: 3120 }]} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Signups by weekday</CardTitle></CardHeader>
          <CardContent><BarChart data={[{ label: 'Mon', value: 120 }, { label: 'Tue', value: 148 }, { label: 'Wed', value: 132 }, { label: 'Thu', value: 160 }, { label: 'Fri', value: 110 }, { label: 'Sat', value: 64 }, { label: 'Sun', value: 52 }]} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
