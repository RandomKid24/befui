import { AttendanceReport } from '@/components/ui/attendance-report';

export default function AttendanceReportDemo() {
  return (
    <AttendanceReport
      organization="Kiran Foods Pvt Ltd"
      title="Attendance report"
      period="October 2026"
      number="HR-ATT-10"
      generated="1 Nov 2026"
      workingDays={22}
      signatures={['Prepared by, HR', 'Approved by, Operations head']}
      rows={[
        { name: 'Meera Joshi', role: 'Accounts', present: 21, absent: 0, late: 1, leave: 0, hours: 178 },
        { name: 'Rohan Desai', role: 'Warehouse', present: 16, absent: 3, late: 3, leave: 0, hours: 141 },
        { name: 'Anita Rao', role: 'Sales', present: 18, absent: 0, late: 0, leave: 4, hours: 150 },
        { name: 'Imran Shaikh', role: 'Dispatch', present: 20, absent: 1, late: 1, leave: 0, hours: 169 },
      ]}
    />
  );
}
