import { HeatCalendar } from '@/components/ui/heat-calendar';

/** October 2026, one number per day (leave a day out for no data). */
export default function HeatCalendarDemo() {
  const values = Array.from({ length: 31 }, (_, i) => (i % 7 === 5 || i % 7 === 6 ? undefined : Math.round(20 + 60 * Math.abs(Math.sin(i * 1.7)))));
  return <HeatCalendar year={2026} month={10} values={values} format={(n) => `${n} deals`} />;
}
