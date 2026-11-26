import { CapsuleBars, DeskHeader, StatTile, TickDial } from '@/components/ui/desk-kit';

export default function DeskKitDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-3">
      <DeskHeader title="Good morning" summary="Demo figures" />
      <div className="grid gap-3 sm:grid-cols-2">
        <StatTile hero label="Orders this week" value="248" note="31 more than last week" trend={[21, 28, 25, 34, 31, 44, 41]} />
        <StatTile label="Returns" value="9" note="3 waiting for pickup" trend={[4, 2, 3, 1, 2, 2, 1]} />
      </div>
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto]">
        <CapsuleBars label="Orders by day" data={[['Mon', 31], ['Tue', 28], ['Wed', 40], ['Thu', 34], ['Fri', 52], ['Sat', 41], ['Sun', 22]].map(([label, value]) => ({ label: String(label), value: Number(value) }))} highlight={4} />
        <TickDial value={72} label="of target" display="72%" />
      </div>
    </div>
  );
}
