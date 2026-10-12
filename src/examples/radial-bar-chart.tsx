import { RadialBarChart } from '@/components/ui/radial-bar-chart';

export default function RadialBarChartDemo() {
  return (
    <RadialBarChart
      className="w-full max-w-sm"
      data={[{ label: 'Revenue', value: 82 }, { label: 'New leads', value: 64 }, { label: 'Tickets closed', value: 91 }, { label: 'NPS', value: 48 }]}
    >
      <div className="grid"><span className="text-2xl font-semibold tabular-nums">71%</span><span className="text-xs text-muted-foreground">of target</span></div>
    </RadialBarChart>
  );
}
