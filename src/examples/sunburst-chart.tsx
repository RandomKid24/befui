import { SunburstChart } from '@/components/ui/sunburst-chart';

export default function SunburstChartDemo() {
  return (
    <SunburstChart
      format={(n) => `₹${(n / 100000).toFixed(1)}L`}
      data={[
        { label: 'Engineering', children: [{ label: 'Web', children: [{ label: 'Frontend', value: 2200000 }, { label: 'Backend', value: 1800000 }] }, { label: 'Mobile', value: 3000000 }, { label: 'Infra', value: 2000000 }] },
        { label: 'Sales', children: [{ label: 'India', value: 3000000 }, { label: 'Middle East', value: 2000000 }] },
        { label: 'People', children: [{ label: 'Hiring', value: 900000 }, { label: 'Benefits', value: 600000 }] },
        { label: 'Marketing', children: [{ label: 'Paid', value: 1500000 }, { label: 'Content', value: 900000 }] },
      ]}
    />
  );
}
