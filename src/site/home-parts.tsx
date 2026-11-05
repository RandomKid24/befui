import * as React from 'react';
import { Users, IndianRupee } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BarChart, Sparkline } from '@/components/ui/charts';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui/stat-card';
import type { blocks } from '@/registry';
import { Link } from './router';

// The two pieces of the home page that other pages share or that the hero needs, kept out of pages.tsx so the home page does not pull in every docs page.

export function HeroCollage() {
  return (
    <div className="pointer-events-none relative mx-auto mt-14 w-full max-w-4xl select-none text-left" aria-hidden>
      <div className="absolute -inset-x-6 -top-6 bottom-0 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent)]" />
      <div className="rounded-2xl border bg-card p-3 shadow-xl shadow-black/5 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Headcount" value="142" delta={4.2} icon={<Users />} chart={<Sparkline data={[3, 4, 4, 5, 6, 6, 8, 9]} />} />
          <StatCard label="Revenue" value="₹48.2L" delta={12.5} icon={<IndianRupee />} chart={<Sparkline data={[2, 3, 2.5, 4, 5, 4.6, 6, 7]} className="text-success" />} />
          <Card className="hidden flex-col justify-between gap-3 p-5 sm:flex">
            <span className="text-[13px] font-medium text-muted-foreground">Leave balance</span>
            <div className="grid gap-2.5">
              <Progress value={70} /><Progress value={45} tone="success" /><Progress value={20} tone="warning" />
            </div>
          </Card>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-5">
          <Card className="p-5 sm:col-span-3">
            <p className="mb-3 text-sm font-semibold">Leads per month</p>
            <BarChart height={110} data={[{ label: 'May', value: 38 }, { label: 'Jun', value: 52 }, { label: 'Jul', value: 47 }, { label: 'Aug', value: 66 }, { label: 'Sep', value: 59 }, { label: 'Oct', value: 81 }]} />
          </Card>
          <Card className="grid content-start gap-3 p-5 sm:col-span-2">
            <p className="text-sm font-semibold">Approvals</p>
            {[['Diya Rao', 'Casual leave', 'success'], ['Rohan Das', 'Sick leave', 'warning'], ['Isha Nair', 'Earned leave', 'info']].map(([n, t, v]) => (
              <div key={n} className="flex items-center gap-2.5">
                <Avatar name={n!} size="sm" />
                <div className="grid flex-1 leading-tight"><span className="text-[13px] font-medium">{n}</span><span className="text-xs text-muted-foreground">{t}</span></div>
                <Badge variant={v as 'success' | 'warning' | 'info'} dot>{v === 'success' ? 'Done' : 'Open'}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/** Renders its children once it is within 1200px of the screen, and keeps them after that. Block previews are whole pages, so they should not all mount at once. */
function WhenNear({ children, fallback, className }: { children: React.ReactNode; fallback?: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '1200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{near ? children : fallback}</div>;
}

const SHOT_W = 1280;
const SHOT_H = 810;

/** Renders a whole screen at a real desktop size and scales it down to the card, so the thumbnail is the design itself and not a cropped slice of it. */
function Shot({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.3);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / SHOT_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: SHOT_H * scale }}>
      <div className="absolute left-0 top-0 origin-top-left overflow-hidden" style={{ width: SHOT_W, height: SHOT_H, transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}

export function BlockGrid({ items, base = '/blocks' }: { items: typeof blocks; base?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((b) => (
        // the previews contain links of their own, so the card is not one big <a>: the title link stretches over the card instead
        <div key={b.slug} className="group relative rounded-xl focus-within:ring-2 focus-within:ring-ring/50">
          <Card hoverable className="overflow-hidden">
            <div className="pointer-events-none relative border-b bg-muted/50" aria-hidden>
              <WhenNear fallback={<div className="grid aspect-[8/5] place-items-center text-lg font-semibold text-muted-foreground/60">{b.name}</div>}>
                <Shot><div className="p-6"><React.Suspense fallback={<span className="text-3xl font-semibold text-muted-foreground/60">{b.name}</span>}><b.Demo /></React.Suspense></div></Shot>
              </WhenNear>
            </div>
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <Link to={`${base}/${b.slug}`} className="text-sm font-semibold outline-none after:absolute after:inset-0 after:z-10 after:rounded-xl">{b.name}</Link>
                <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{b.description}</p>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-md">{b.module}</Badge>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
