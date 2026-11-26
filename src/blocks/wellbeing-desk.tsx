'use client';

import * as React from 'react';
import { ChallengeTracker, type ChallengeDay } from '@/components/ui/challenge-tracker';
import { Checkbox } from '@/components/ui/checkbox';
import { CapsuleBars, DeskHeader, StatTile, TickDial } from '@/components/ui/desk-kit';
import { FloatingShell, GlassPanel, glass } from '@/components/ui/floating-shell';
import { HealthVitals } from '@/components/ui/health-vitals';
import { ActivityIcon, FlameIcon, GridIcon, HeartIcon } from '@/components/ui/icons';
import { RevealGroup } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

// Demo data: swap for your API.
const medicines = [['Iron, 1 tablet', '08:00'], ['Vitamin D', '13:00'], ['Magnesium', '21:00']] as const;
const steps = [['Mon', 6200], ['Tue', 8100], ['Wed', 4300], ['Thu', 7600], ['Fri', 9200], ['Sat', 3800], ['Sun', 2140]] as const;
const walk: (ChallengeDay | undefined)[] = Array.from({ length: 30 }, (_, i) => (i === 6 ? 'missed' : i < 12 ? 'kept' : undefined));

export default function WellbeingDesk() {
  const [view, setView] = React.useState('today');
  const [water, setWater] = React.useState(4);
  const [taken, setTaken] = React.useState<string[]>([medicines[0][0]]);
  const [days, setDays] = React.useState(walk);
  return (
    <FloatingShell
      layout="top"
      user={{ name: 'Ines Fernandes' }}
      brand={{ name: 'Tidal', mark: <HeartIcon /> }}
      value={view}
      onChange={setView}
      groups={[{ label: 'Views', items: [{ id: 'today', label: 'Today', icon: <GridIcon /> }, { id: 'activity', label: 'Activity', icon: <ActivityIcon /> }, { id: 'habit', label: 'Habit', icon: <FlameIcon /> }] }]}
    >
      {view === 'today' && <DeskHeader className="mx-auto w-full max-w-5xl" title="Good morning, Ines" summary={`${medicines.length - taken.length} medicines left today`} />}
      {view === 'today' && (
        <RevealGroup className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile hero label="Heart rate" value="63 bpm" note="At 09:40" trend={[64, 66, 63, 70, 78, 74, 69, 65, 62, 64, 71, 68, 63]} />
          <StatTile label="Water" value={`${water} of 8`} note="Glasses today" />
          <StatTile label="Steps today" value={steps[steps.length - 1][1].toLocaleString('en-IN')} trend={steps.map(([, v]) => v)} />
          <StatTile label="Sleep" value="6h 30m" note="Last night" />
        </RevealGroup>
      )}
      {view === 'today' && (
        <RevealGroup className="mx-auto grid w-full max-w-5xl items-start gap-3 lg:grid-cols-[1.4fr_1fr]">
          <HealthVitals className={cn(glass, 'max-w-none')} heartRate={[64, 66, 63, 70, 78, 74, 69, 65, 62, 64, 71, 68, 63]} updatedAt="Demo readings, last at 09:40" readings={[{ label: 'Blood oxygen', value: '98', unit: '%' }, { label: 'Blood pressure', value: '118/76', unit: 'mmHg' }, { label: 'Sleep', value: '6h 30m', note: 'Last night' }]} water={water} onWaterChange={setWater} />
          <div className="grid gap-3">
          <GlassPanel title="Steps goal" note="6,000 a day"><TickDial value={steps[steps.length - 1][1]} max={6000} label="steps so far" display={steps[steps.length - 1][1].toLocaleString('en-IN')} /></GlassPanel>
          <GlassPanel title="Medicines" note={`${taken.length} of ${medicines.length} taken today`}>
            <ul className="divide-y divide-foreground/10">
              {medicines.map(([name, at]) => <li key={name}><label className="flex items-center gap-3 py-3 text-sm"><Checkbox checked={taken.includes(name)} onCheckedChange={(v) => setTaken(v ? [...taken, name] : taken.filter((t) => t !== name))} /><span className={cn('flex-1', taken.includes(name) && 'text-muted-foreground line-through')}>{name}</span><span className="tabular-nums text-muted-foreground">{at}</span></label></li>)}
            </ul>
          </GlassPanel>
          </div>
        </RevealGroup>
      )}
      {view === 'activity' && <GlassPanel className="mx-auto w-full max-w-5xl" title="Steps this week" note="Sunday is still in progress"><CapsuleBars height={300} highlight={4} label="Steps each day" format={(n) => n.toLocaleString('en-IN')} data={steps.map(([label, value]) => ({ label, value }))} /></GlassPanel>}
      {view === 'habit' && <div className="grid justify-items-center"><ChallengeTracker className={glass} title="30 days of walking" days={days} today={13} onCheckIn={(r) => setDays((all) => all.map((d, i) => (i === 12 ? r : d)))} /></div>}
    </FloatingShell>
  );
}
