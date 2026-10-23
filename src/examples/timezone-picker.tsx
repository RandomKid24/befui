import * as React from 'react';
import { TimezonePicker } from '@/components/ui/timezone-picker';

export default function TimezonePickerDemo() {
  const [tz, setTz] = React.useState('Asia/Kolkata');
  return <TimezonePicker value={tz} onChange={setTz} />;
}
