import { CandlestickChart, type Candle } from '@/components/ui/candlestick-chart';

// Deterministic walk so the demo looks the same every time.
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const data: Candle[] = (() => {
  let price = 100;
  return Array.from({ length: 24 }, (_, i) => {
    const open = price;
    const close = open + (rnd(i) - 0.45) * 8;
    price = close;
    return { label: `D${i + 1}`, open, close, high: Math.max(open, close) + rnd(i + 50) * 3, low: Math.min(open, close) - rnd(i + 90) * 3 };
  });
})();

export default function CandlestickChartDemo() {
  return <CandlestickChart className="w-full max-w-xl" data={data} />;
}
