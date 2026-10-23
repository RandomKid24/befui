import * as React from 'react';
import { ShortcutRecorder } from '@/components/ui/shortcut-recorder';

export default function ShortcutRecorderDemo() {
  const [combo, setCombo] = React.useState<string | undefined>('Mod+K');
  return <ShortcutRecorder value={combo} onChange={setCombo} />;
}
