import { AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, CheckCircleIcon, FlagIcon, PlusIcon } from '@/components/ui/icons';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Progress } from '@/components/ui/progress';
import { Timeline } from '@/components/ui/timeline';

const tasks = [
  { name: 'Design review', owner: 'Ananya K.', due: '14 Oct', status: 'Done' },
  { name: 'API contract', owner: 'Kabir Shah', due: '18 Oct', status: 'In progress' },
  { name: 'Mobile build', owner: 'Rohan Das', due: '24 Oct', status: 'In progress' },
  { name: 'Launch checklist', owner: 'Isha Nair', due: '30 Oct', status: 'To do' },
] as const;
const tone = { Done: 'success', 'In progress': 'info', 'To do': 'default' } as const;

export default function ProjectOverview() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight">Website relaunch</h1><Badge variant="info" dot>On track</Badge></div>
          <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground"><CalendarIcon className="size-3.5" /> 1 Oct to 30 Oct 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <AvatarGroup names={['Ananya K.', 'Kabir Shah', 'Rohan Das', 'Isha Nair', 'Diya Rao']} max={3} />
          <Button size="sm"><PlusIcon /> Add task</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-5">
            <ProgressRing value={62} aria-label="Project progress" />
            <div className="grid flex-1 gap-3 text-[13px]">
              <div className="grid gap-1"><span className="flex justify-between"><span>Design</span><span className="text-muted-foreground">100%</span></span><Progress value={100} tone="success" aria-label="Design progress" /></div>
              <div className="grid gap-1"><span className="flex justify-between"><span>Build</span><span className="text-muted-foreground">55%</span></span><Progress value={55} aria-label="Build progress" /></div>
              <div className="grid gap-1"><span className="flex justify-between"><span>Launch</span><span className="text-muted-foreground">10%</span></span><Progress value={10} tone="warning" aria-label="Launch progress" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
          <CardContent className="grid gap-1">
            {tasks.map((t) => (
              <div key={t.name} className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted">
                <CheckCircleIcon className={t.status === 'Done' ? 'text-success' : 'text-muted-foreground/50'} />
                <span className="flex-1 font-medium">{t.name}</span>
                <span className="hidden text-[13px] text-muted-foreground sm:inline">{t.owner}</span>
                <span className="w-14 text-right text-[13px] text-muted-foreground">{t.due}</span>
                <Badge variant={tone[t.status]}>{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
        <CardContent>
          <Timeline items={[
            { title: 'Kick-off', time: '1 Oct', tone: 'success', icon: <FlagIcon /> },
            { title: 'Design sign-off', time: '14 Oct', tone: 'success', icon: <CheckCircleIcon /> },
            { title: 'Beta release', description: 'Internal testers only', time: '24 Oct', tone: 'info', icon: <FlagIcon /> },
            { title: 'Public launch', time: '30 Oct', icon: <FlagIcon /> },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
