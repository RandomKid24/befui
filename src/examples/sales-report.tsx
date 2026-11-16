import { SalesReport } from '@/components/ui/sales-report';

export default function SalesReportDemo() {
  return (
    <SalesReport
      organization="Kiran Foods Pvt Ltd"
      title="Monthly sales report"
      period="1 to 31 October 2026"
      number="SR-2026-10"
      generated="2 Nov 2026"
      breakdown={[
        { name: 'West', orders: 1840, revenue: 4820000 },
        { name: 'South', orders: 1260, revenue: 3150000 },
        { name: 'North', orders: 980, revenue: 2410000 },
        { name: 'East', orders: 420, revenue: 960000 },
      ]}
      topProducts={[
        { name: 'Cold-pressed groundnut oil, 1 L', orders: 1120, revenue: 2240000 },
        { name: 'Stone-ground atta, 5 kg', orders: 960, revenue: 1680000 },
        { name: 'Jaggery cubes, 500 g', orders: 730, revenue: 880000 },
      ]}
      summary="Revenue grew in the West and South. The East region is small but its orders per customer are the highest of the four. Oil and atta together made up 38% of revenue."
    />
  );
}
