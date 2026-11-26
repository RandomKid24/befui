import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useFlip } from '@/components/ui/motion-hooks';

export default function MotionHooksDemo() {
  const [order, setOrder] = React.useState(['Design', 'Build', 'Test', 'Ship']);
  const list = React.useRef<HTMLUListElement>(null);
  useFlip(list);
  return (
    <div className="grid justify-items-center gap-3">
      <ul ref={list} className="relative flex flex-wrap justify-center gap-2">
        {order.map((o) => <li key={o} data-flip={o} className="rounded-lg border bg-card px-4 py-2 text-[13px] font-medium shadow-sm">{o}</li>)}
      </ul>
      <Button variant="outline" onClick={() => setOrder([...order.slice(1), order[0]!])}>Move the first to the end</Button>
    </div>
  );
}
