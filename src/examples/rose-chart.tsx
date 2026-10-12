import { RoseChart } from '@/components/ui/rose-chart';

export default function RoseChartDemo() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sales = [32, 28, 41, 55, 62, 48, 39, 44, 70, 83, 66, 91];
  return <RoseChart data={months.map((label, i) => ({ label, value: sales[i]!, color: i % 3 === 0 ? 'text-primary' : i % 3 === 1 ? 'text-success' : 'text-info' }))} format={(n) => `₹${n}L`} />;
}
