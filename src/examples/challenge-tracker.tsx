import * as React from 'react';
import { ChallengeTracker, type ChallengeDay } from '@/components/ui/challenge-tracker';

// Demo data
const start: (ChallengeDay | undefined)[] = Array.from({ length: 30 }, (_, i) => (i === 4 ? 'missed' : i < 16 ? 'kept' : undefined));

export default function ChallengeTrackerDemo() {
  const [days, setDays] = React.useState(start);
  return <ChallengeTracker title="No-spend month" days={days} today={17} savedPerDay={450} onCheckIn={(r) => setDays((d) => d.map((v, i) => (i === 16 ? r : v)))} />;
}
