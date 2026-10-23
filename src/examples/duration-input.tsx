import * as React from 'react';
import { DurationInput } from '@/components/ui/duration-input';

export default function DurationInputDemo() {
  const [s, setS] = React.useState<number | undefined>(5400);
  return (
    <div className="grid gap-2">
      <DurationInput value={s} onChange={setS} min={60} max={604800} />
      <p className="text-xs text-muted-foreground">{s === undefined ? 'No duration' : `${s} seconds`}. Try 90m, 2d or 1h30m.</p>
    </div>
  );
}
