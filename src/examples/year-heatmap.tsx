import { YearHeatmap } from '@/components/ui/year-heatmap';

// Deterministic pseudo-random so the demo looks the same every time.
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const values: Record<string, number> = {};
for (let i = 0; i < 365; i++) {
  const d = new Date(2026, 0, 1 + i);
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  const v = Math.floor(rnd(i) ** 2 * (weekend ? 4 : 14));
  if (v) values[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`] = v;
}

export default function YearHeatmapDemo() {
  return <YearHeatmap className="w-[48rem] max-w-full" year={2026} values={values} unit="commits" />;
}
