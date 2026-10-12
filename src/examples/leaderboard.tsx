import { Leaderboard } from '@/components/ui/leaderboard';

export default function LeaderboardDemo() {
  return (
    <Leaderboard
      className="w-[30rem] max-w-full"
      format={(n) => `₹${(n / 100000).toFixed(1)}L`}
      items={[
        { name: 'Rohan Das', subtitle: 'Enterprise', value: 2450000, delta: 2 },
        { name: 'Diya Rao', subtitle: 'Mid-market', value: 3120000, delta: -1 },
        { name: 'Isha Nair', subtitle: 'Enterprise', value: 2980000, delta: 1 },
        { name: 'Kabir Shah', subtitle: 'SMB', value: 1620000, delta: 0 },
        { name: 'Ananya Kulkarni', subtitle: 'SMB', value: 1240000, delta: -2 },
      ]}
    />
  );
}
