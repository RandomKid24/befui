import { DayAgenda } from '@/components/ui/day-agenda';

export default function DayAgendaDemo() {
  return (
    <DayAgenda
      className="w-[30rem] max-w-full"
      height={420}
      now="11:20"
      onSelect={() => {}}
      events={[
        { id: '1', title: 'Stand-up', start: '09:00', end: '09:30', location: 'Room 2' },
        { id: '2', title: 'Design review', start: '10:00', end: '11:30', location: 'Zoom', color: 'text-success' },
        { id: '3', title: '1:1 with Isha', start: '10:30', end: '11:00', color: 'text-warning' },
        { id: '4', title: 'Lunch', start: '13:00', end: '14:00', color: 'text-info' },
        { id: '5', title: 'Sprint planning', start: '15:00', end: '17:00', location: 'Main hall' },
      ]}
    />
  );
}
