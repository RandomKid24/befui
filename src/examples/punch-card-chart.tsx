import { PunchCardChart } from '@/components/ui/punch-card-chart';

const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const cols = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];
const values = rows.map((_, r) => cols.map((_, c) => Math.max(0, Math.round((r > 4 ? 4 : 18) * (1 + Math.sin((c + 1) * 0.9) * 0.9) + ((r * 5 + c * 11) % 7) - 3))));

export default function PunchCardChartDemo() {
  return <PunchCardChart className="w-[34rem] max-w-full" rows={rows} cols={cols} values={values} format={(n) => `${n} commits`} />;
}
