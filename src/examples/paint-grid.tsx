import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PaintGrid } from '@/components/ui/paint-grid';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
// open 09:00 to 18:00 on weekdays, mornings on Saturday
const start = days.map((_, d) => hours.map((_, h) => (d < 5 ? (h >= 9 && h < 18 ? 2 : 0) : d === 5 && h >= 9 && h < 13 ? 1 : 0)));

export default function PaintGridDemo() {
  const [plan, setPlan] = React.useState<number[][]>(start);
  return (
    <div className="grid w-full max-w-3xl gap-3">
      <PaintGrid label="Support desk cover by hour" rows={days} cols={hours} levels={[{ label: 'Closed' }, { label: 'One agent' }, { label: 'Full team' }]} value={plan} onChange={setPlan} />
      <Button size="sm" variant="outline" className="justify-self-start" onClick={() => setPlan((p) => p.map((row, i) => (i > 0 && i < 5 ? [...p[0]!] : row)))}>Copy Monday to weekdays</Button>
    </div>
  );
}
