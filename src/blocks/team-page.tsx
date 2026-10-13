import { ArrowRightIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const team = [
  { name: 'Aarav Mehta', role: 'Founder and CEO', bio: 'Builds the company and still answers support email.' },
  { name: 'Diya Nair', role: 'Head of Design', bio: 'Keeps every pixel and every empty state honest.' },
  { name: 'Rohan Shah', role: 'Engineering Lead', bio: 'Ships small changes often and writes the runbooks.' },
  { name: 'Isha Rao', role: 'Product Manager', bio: 'Turns customer calls into a roadmap people trust.' },
  { name: 'Kabir Singh', role: 'Customer Success', bio: 'First to know when something is confusing.' },
  { name: 'Meera Iyer', role: 'People and Operations', bio: 'Makes hiring, payroll and onboarding feel easy.' },
  { name: 'Sana Qureshi', role: 'Backend Engineer', bio: 'Loves boring databases and fast queries.' },
  { name: 'Dev Patel', role: 'Frontend Engineer', bio: 'Cares about keyboards, motion and contrast.' },
];

export default function TeamPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-6">
      <div className="mx-auto grid max-w-xl gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Meet the team</h2>
        <p className="text-muted-foreground">A small group that cares about the details. We work across three time zones and meet in the middle.</p>
      </div>
      <ul aria-label="Team members" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m) => (
          <li key={m.name} className="grid justify-items-center gap-1.5 rounded-xl border bg-card p-5 text-center">
            <Avatar name={m.name} size="lg" />
            <h3 className="mt-2 text-sm font-semibold">{m.name}</h3>
            <p className="text-[13px] text-primary">{m.role}</p>
            <p className="text-xs text-muted-foreground">{m.bio}</p>
          </li>
        ))}
      </ul>
      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold tracking-tight">We are hiring</h3>
          <p className="text-[13px] text-muted-foreground">Remote friendly. Small team, real ownership.</p>
        </div>
        <Button>See open roles <ArrowRightIcon className="rtl:rotate-180" /></Button>
      </Card>
    </div>
  );
}
