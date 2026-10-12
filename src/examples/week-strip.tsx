import * as React from 'react';
import { WeekStrip } from '@/components/ui/week-strip';

export default function WeekStripDemo() {
  const [day, setDay] = React.useState(() => new Date());
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const t = new Date();
  const at = (n: number) => { const d = new Date(t); d.setDate(d.getDate() + n); return iso(d); };
  return (
    <div className="grid w-[26rem] max-w-full gap-3">
      <WeekStrip value={day} onChange={setDay} marks={{ [at(-1)]: 1, [at(0)]: 2, [at(1)]: 3, [at(3)]: true }} />
      <p className="text-center text-xs text-muted-foreground">Selected: {day.toDateString()}</p>
    </div>
  );
}
