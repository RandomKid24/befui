import { InspectionReport } from '@/components/ui/inspection-report';

export default function InspectionReportDemo() {
  return (
    <InspectionReport
      title="Monthly fire and safety inspection"
      number="FS-2026-11"
      site="Kiran Foods warehouse, Bhiwandi, Unit 3"
      date="14 November 2026"
      inspector="Imran Shaikh"
      sections={[
        { title: 'Fire safety', items: [
          { check: 'Extinguishers in date and sealed', result: 'pass' },
          { check: 'Exit routes clear', result: 'fail', note: 'Pallets stacked in front of the east exit.' },
          { check: 'Alarm test completed', result: 'pass' },
          { check: 'Sprinkler valves open', result: 'na' },
        ] },
        { title: 'Electrical', items: [
          { check: 'Panels closed and labelled', result: 'pass' },
          { check: 'No exposed or taped cables', result: 'fail', note: 'Taped extension lead near the packing bench.' },
          { check: 'Earthing test within 12 months', result: 'pass' },
        ] },
        { title: 'Storage', items: [
          { check: 'Racks within load rating', result: 'pass' },
          { check: 'Stacks no higher than 1.8 m', result: 'pass' },
          { check: 'Chemicals kept apart from food stock', result: 'pass' },
        ] },
        { title: 'People', items: [
          { check: 'First aid box stocked', result: 'pass' },
          { check: 'Drill held this quarter', result: 'pass' },
        ] },
      ]}
    />
  );
}
