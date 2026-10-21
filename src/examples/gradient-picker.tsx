import * as React from 'react';
import { GradientPicker, type GradientStop } from '@/components/ui/gradient-picker';

export default function GradientPickerDemo() {
  const [stops, setStops] = React.useState<GradientStop[]>([{ color: '#6366f1', at: 0 }, { color: '#ec4899', at: 100 }]);
  const [angle, setAngle] = React.useState(135);
  return <GradientPicker stops={stops} angle={angle} onChange={(s, a) => { setStops(s); setAngle(a); }} />;
}
