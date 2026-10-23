import { SwimlaneTimeline } from '@/components/ui/swimlane-timeline';

export default function SwimlaneTimelineDemo() {
  return (
    <SwimlaneTimeline
      className="w-[48rem] max-w-full"
      today={new Date('2026-10-14')}
      lanes={[
        { name: 'Aarav', items: [{ label: 'Auth rewrite', start: '2026-10-01', end: '2026-10-09' }, { label: 'Rate limits', start: '2026-10-12', end: '2026-10-20', tone: 1 }] },
        { name: 'Diya', items: [{ label: 'Onboarding design', start: '2026-10-02', end: '2026-10-13', tone: 2 }, { label: 'Design review', start: '2026-10-10', end: '2026-10-15', tone: 3 }] },
        { name: 'Kabir', items: [{ label: 'Pricing page', start: '2026-10-05', end: '2026-10-11' }, { label: 'Launch prep', start: '2026-10-14', end: '2026-10-24', tone: 1 }] },
        { name: 'Meera', items: [{ label: 'Hiring loop', start: '2026-10-01', end: '2026-10-24', tone: 3 }] },
      ]}
    />
  );
}
