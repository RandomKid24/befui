import { MatrixHeatmap } from '@/components/ui/matrix-heatmap';

const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const cols = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];
// Busy weekday mid-mornings and afternoons, quiet weekends.
const values = rows.map((_, r) => cols.map((_, c) => Math.round((r > 4 ? 6 : 20) * (1 + Math.sin((c + 1) * 0.9) * 0.8) + ((r * 7 + c * 13) % 9))));

export default function MatrixHeatmapDemo() {
  return <MatrixHeatmap className="w-full max-w-xl" rows={rows} cols={cols} values={values} showValues format={(n) => String(Math.max(0, n))} />;
}
