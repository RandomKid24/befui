import { DumbbellChart } from '@/components/ui/dumbbell-chart';

export default function DumbbellChartDemo() {
  return (
    <DumbbellChart
      className="w-[34rem] max-w-full"
      fromLabel="2025"
      toLabel="2026"
      format={(n) => `${n}%`}
      rows={[
        { label: 'Engineering', from: 62, to: 78 },
        { label: 'Sales', from: 71, to: 69 },
        { label: 'Support', from: 55, to: 74 },
        { label: 'Marketing', from: 68, to: 81 },
        { label: 'Finance', from: 80, to: 77 },
      ]}
    />
  );
}
