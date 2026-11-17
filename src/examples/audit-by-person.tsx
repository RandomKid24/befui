import { AuditByPerson } from '@/components/ui/audit-by-person';
import type { AuditEntry } from '@/components/ui/audit-log';

const h = 3600000;
const entries: AuditEntry[] = [
  { id: '1', actor: 'Meera Iyer', action: 'updated', target: 'Salary structure, Engineering', at: Date.now() - 0.5 * h, ip: '10.0.4.21', changes: [{ field: 'Basic', from: '₹60,000', to: '₹64,000' }, { field: 'HRA', from: '₹24,000', to: '₹25,600' }, { field: 'Approved by', from: 'Pending', to: 'Kabir Shah' }] },
  { id: '2', actor: 'Unknown', action: 'login', target: 'Admin console, 3rd wrong password', at: Date.now() - 1.2 * h, ip: '203.0.113.9', status: 'failed' },
  { id: '3', actor: 'Isha Nair', action: 'created', target: 'Employee EMP-0412', at: Date.now() - 3 * h, ip: '10.0.4.18', changes: [{ field: 'Name', to: 'Ananya Kulkarni' }, { field: 'Department', to: 'Engineering' }] },
  { id: '4', actor: 'Meera Iyer', action: 'viewed', target: 'Payroll, October', at: Date.now() - 5 * h, ip: '10.0.4.21' },
  { id: '5', actor: 'Kabir Shah', action: 'exported', target: 'Payroll report, September', at: Date.now() - 20 * h, ip: '10.0.7.5' },
  { id: '6', actor: 'Rohan Das', action: 'deleted', target: 'Draft offer letter v1', at: Date.now() - 30 * h, ip: '10.0.4.33' },
  { id: '7', actor: 'Aarav Mehta', action: 'updated', target: 'Leave policy 2026', at: Date.now() - 52 * h, ip: '10.0.4.2', changes: [{ field: 'Carry-forward cap', from: '10 days', to: '12 days' }] },
];

export default function AuditByPersonDemo() {
  return <AuditByPerson className="w-full max-w-3xl" entries={entries} />;
}
