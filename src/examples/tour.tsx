import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tour, type TourStep } from '@/components/ui/tour';

export default function TourDemo() {
  const [open, setOpen] = React.useState(false);
  const search = React.useRef<HTMLDivElement>(null);
  const create = React.useRef<HTMLButtonElement>(null);
  const activity = React.useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    { target: search, title: 'Search everything', body: 'Find people, files and settings from one box.' },
    { target: create, title: 'Create something', body: 'Start a project, invite a teammate or upload a file.' },
    { target: activity, title: 'Stay in the loop', body: 'Everything your team does shows up here.', side: 'top' },
  ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center gap-2">
        <div ref={search} className="flex-1"><Input aria-label="Search" placeholder="Search" /></div>
        <Button ref={create} variant="outline">New project</Button>
      </div>
      <div ref={activity} className="rounded-lg border p-4 text-sm text-muted-foreground">Ada commented on Roadmap · 2 minutes ago</div>
      <Button variant="soft" onClick={() => setOpen(true)}>Take the tour</Button>
      <Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  );
}
