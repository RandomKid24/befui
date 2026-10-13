import * as React from 'react';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function ProgressRingDemo() {
  const [v, setV] = React.useState(0);
  React.useEffect(() => { const t = setTimeout(() => setV(72), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="flex items-center gap-8">
      <ProgressRing value={v} aria-label="Upload progress" />
      <ProgressRing value={v / 2} aria-label="Setup progress" size={72} stroke={6} className="text-success" />
      <button className="text-sm text-primary hover:underline" onClick={() => setV((x) => (x === 72 ? 30 : 72))}>Animate</button>
    </div>
  );
}
