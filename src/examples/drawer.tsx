import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';

type Side = 'bottom' | 'top' | 'left' | 'right';

/** Four edges. The bottom one rests half open (snap points 0.5 and 1): drag its grip up for full height, down to dismiss. */
export default function DrawerDemo() {
  const [side, setSide] = React.useState<Side>('bottom'); // kept after closing so it leaves through the edge it came from
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(['bottom', 'right', 'left', 'top'] as const).map((s) => <Button key={s} variant="outline" onClick={() => { setSide(s); setOpen(true); }} className="capitalize">{s}</Button>)}
      </div>
      <Drawer open={open} onOpenChange={setOpen} side={side} snapPoints={side === 'bottom' ? [0.5, 1] : undefined} title="Order #4821" description="Drag the grip toward the edge to dismiss.">
        <ul className="grid gap-2 pb-4 text-sm">
          {['Wireless keyboard', 'USB-C hub', 'Desk mat', 'Monitor arm', 'Cable organiser', 'Laptop stand', 'Webcam'].map((i) => (
            <li key={i} className="flex justify-between rounded-lg border px-3 py-2.5"><span>{i}</span><span className="text-muted-foreground">1 x</span></li>
          ))}
        </ul>
        <Button className="mb-4 w-full" onClick={() => setOpen(false)}>Done</Button>
      </Drawer>
    </>
  );
}
