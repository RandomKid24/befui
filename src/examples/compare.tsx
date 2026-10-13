import { Compare } from '@/components/ui/compare';

const svg = (a: string, t: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="${a}"/><text x="320" y="195" font-family="sans-serif" font-size="48" font-weight="700" fill="white" text-anchor="middle">${t}</text></svg>`)}`;

export default function CompareDemo() {
  return <Compare className="w-[32rem] max-w-full" before={svg('#1e293b', 'Before')} after={svg('#2563eb', 'After')} />;
}
