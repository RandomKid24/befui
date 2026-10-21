import { RoadmapTimeline } from '@/components/ui/roadmap-timeline';

export default function RoadmapTimelineDemo() {
  return (
    <RoadmapTimeline
      className="w-[42rem] max-w-full"
      today={new Date('2026-10-21')}
      items={[
        { label: 'Payroll 2.0', group: 'Product', start: '2026-09-01', end: '2026-10-31', progress: 80 },
        { label: 'Mobile app beta', group: 'Mobile', start: '2026-10-05', end: '2026-12-15', progress: 35 },
        { label: 'SOC 2 audit', group: 'Security', start: '2026-10-15', end: '2026-12-05', progress: 20 },
        { label: 'Self-serve billing', group: 'Product', start: '2026-11-01', end: '2027-01-20' },
        { label: 'Hiring plan Q1', group: 'People', start: '2026-11-10', end: '2026-12-20' },
      ]}
    />
  );
}
