'use client';

import { BarList } from '@/components/ui/bar-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart, Sparkline } from '@/components/ui/charts';
import { EyeIcon, ClockIcon, MousePointerClickIcon, UsersIcon } from '@/components/ui/icons';
import { AreaChart } from '@/components/ui/area-chart';
import { LiveChart } from '@/components/ui/live-chart';
import { RadialBarChart } from '@/components/ui/radial-bar-chart';
import { StackedBarChart } from '@/components/ui/stacked-bar-chart';
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
          <CardHeader><CardTitle>Visitors by source</CardTitle></CardHeader>
          <CardContent>
            <AreaChart stacked labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} format={(n) => `${n}K`} series={[{ name: 'Organic', data: [12, 14, 13, 18, 21, 24, 27] }, { name: 'Paid', data: [6, 8, 9, 10, 12, 11, 14] }, { name: 'Referral', data: [3, 3, 4, 5, 6, 8, 9] }]} />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent className="grid flex-1 content-center">
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
          <CardHeader><CardTitle>Sessions by device</CardTitle></CardHeader>
          <CardContent>
            <StackedBarChart height={170} keys={[{ key: 'mobile', label: 'Mobile' }, { key: 'desktop', label: 'Desktop', color: 'text-success' }, { key: 'tablet', label: 'Tablet', color: 'text-warning' }]} data={[
              { label: 'Mon', values: { mobile: 420, desktop: 310, tablet: 40 } }, { label: 'Tue', values: { mobile: 480, desktop: 350, tablet: 52 } },
              { label: 'Wed', values: { mobile: 450, desktop: 380, tablet: 48 } }, { label: 'Thu', values: { mobile: 520, desktop: 340, tablet: 60 } },
              { label: 'Fri', values: { mobile: 610, desktop: 290, tablet: 44 } }, { label: 'Sat', values: { mobile: 700, desktop: 150, tablet: 38 } },
              { label: 'Sun', values: { mobile: 640, desktop: 130, tablet: 35 } },
            ]} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Active users now</CardTitle></CardHeader>
          <CardContent><LiveChart next={(p) => Math.max(20, Math.min(95, p + (Math.random() - 0.5) * 12))} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Goals this month</CardTitle></CardHeader>
          <CardContent>
            <RadialBarChart size={150} thickness={10} data={[{ label: 'Signups', value: 82 }, { label: 'Trials', value: 64 }, { label: 'Upgrades', value: 47 }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
