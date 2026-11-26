import * as React from 'react';
import { HealthVitals } from '@/components/ui/health-vitals';

// Demo data
export default function HealthVitalsDemo() {
  const [water, setWater] = React.useState(5);
  return (
    <HealthVitals
      heartRate={[64, 66, 63, 70, 78, 74, 69, 65, 62, 64, 71, 68, 63]}
      updatedAt="Demo readings, last at 09:40"
      readings={[{ label: 'Blood oxygen', value: '98', unit: '%' }, { label: 'Blood pressure', value: '118/76', unit: 'mmHg' }, { label: 'Sleep', value: '6h 30m', note: 'Last night' }, { label: 'Steps', value: '2,140', note: 'Goal 6,000' }]}
      water={water}
      onWaterChange={setWater}
    />
  );
}
