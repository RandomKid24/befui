import * as React from 'react';
import { Button } from '@/components/ui/button';
import { UpdateProgress } from '@/components/ui/update-progress';

const steps = ['fetch', 'apply', 'reopen'];
const messages = ['Connecting to GitHub', 'Downloading release', 'Installing files', 'Restarting the app'];

export default function UpdateProgressDemo() {
  const [tick, setTick] = React.useState(0); // 0 to 300: 100 per step
  const [shown, setShown] = React.useState(true);
  React.useEffect(() => {
    if (!shown || tick >= 299) return;
    const t = setTimeout(() => setTick((n) => n + 1), 60);
    return () => clearTimeout(t);
  }, [tick, shown]);
  const step = Math.floor(tick / 100);
  const value = tick % 100;
  if (!shown) return <Button variant="outline" onClick={() => { setTick(0); setShown(true); }}>Show update</Button>;
  return <UpdateProgress name="Serop" version="v2.15.1" steps={steps} step={step} value={value} message={value < 4 && step === 0 ? messages[0] : messages[step + 1 > 3 ? 3 : step + 1]} onHide={() => setShown(false)} />;
}
