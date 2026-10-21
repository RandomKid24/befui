import * as React from 'react';
import { DatePresetSelect } from '@/components/ui/date-preset-select';
import { toast } from '@/components/ui/toast';

export default function DatePresetSelectDemo() {
  const [label, setLabel] = React.useState('Last 7 days');
  return <DatePresetSelect value={label} onChange={(l, r) => { setLabel(l); toast.info(l, `${r.from?.toDateString()} to ${r.to?.toDateString()}`); }} />;
}
