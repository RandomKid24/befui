import { BarRace } from '@/components/ui/bar-race';

const series: Record<string, number[]> = {
  Pune: [210, 260, 320, 410, 520, 640], Mumbai: [480, 510, 540, 560, 590, 610], Delhi: [390, 430, 480, 540, 600, 690],
  Bengaluru: [300, 380, 470, 590, 720, 880], Chennai: [250, 280, 310, 350, 400, 450], Hyderabad: [180, 240, 330, 430, 560, 700],
};
const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

export default function BarRaceDemo() {
  return <BarRace className="w-[36rem] max-w-full" top={5} format={(n) => `${n}K`} frames={years.map((label, i) => ({ label, values: Object.fromEntries(Object.entries(series).map(([k, v]) => [k, v[i]!])) }))} />;
}
