import { TimesheetReport } from '@/components/ui/timesheet-report';

export default function TimesheetReportDemo() {
  return (
    <TimesheetReport
      organization="Kiran Foods Pvt Ltd"
      title="Weekly timesheet"
      period="9 to 13 November 2026"
      number="TS-4521"
      generated="14 Nov 2026"
      employee={{ name: 'Meera Joshi', role: 'Senior accountant' }}
      days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
      expected={40}
      rows={[
        { project: 'Month-end close', hours: [4, 5, 6, 3, 0], billable: false },
        { project: 'Client audit support', hours: [3, 2, 2, 4, 5], billable: true },
        { project: 'GST filing', hours: [0, 1, 0, 1, 3], billable: true },
        { project: 'Team meetings', hours: [1, 1, 1, 1, 1] },
      ]}
    />
  );
}
