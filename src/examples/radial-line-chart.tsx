import { RadialLineChart } from '@/components/ui/radial-line-chart';

export default function RadialLineChartDemo() {
  const hours = Array.from({ length: 24 }, (_, h) => `${h}`);
  const day = (peak: number, width: number, height: number) => hours.map((_, h) => { const d = Math.min(Math.abs(h - peak), 24 - Math.abs(h - peak)); return Math.round(6 + height * Math.exp(-(d * d) / (2 * width * width))); });
  return <RadialLineChart labels={hours} format={(n) => `${n} req/s`} series={[{ name: 'Web', data: day(14, 3.2, 90) }, { name: 'Mobile', data: day(21, 2.4, 70), color: 'text-success' }]} />;
}
