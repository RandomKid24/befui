import { PaceChart } from '@/components/ui/pace-chart';

/** Cumulative won value to day 17 of a 30 day month, against a target of 42.8 Cr. */
export default function PaceChartDemo() {
  const daily = [0.4, 0.4, 1.1, 0.9, 1.6, 0.8, 2.4, 1.2, 0.7, 0.7, 1.6, 1.0, 1.3, 0.8, 0.5, 0.3, 0.2];
  let total = 0;
  const points = daily.map((v, i) => ({ day: i + 1, value: +(total += v).toFixed(2) }));
  return <PaceChart className="w-[34rem] max-w-full" points={points} target={42.8} daysInMonth={30} format={(n) => `₹${n.toFixed(2)} Cr`} />;
}
