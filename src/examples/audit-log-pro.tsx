import { AuditLogPro } from '@/components/ui/audit-log-pro';
import type { AuditEntry } from '@/components/ui/audit-log';

const h = 3600000;
const people = ['Meera Iyer', 'Isha Nair', 'Kabir Shah', 'Rohan Das', 'Aarav Mehta'];
const things: [string, string, AuditEntry['changes']?][] = [
  ['updated', 'Salary structure, Engineering', [{ field: 'Basic', from: '₹60,000', to: '₹64,000' }, { field: 'HRA', from: '₹24,000', to: '₹25,600' }]],
  ['created', 'Employee EMP-0412', [{ field: 'Name', to: 'Ananya Kulkarni' }, { field: 'Department', to: 'Engineering' }]],
  ['exported', 'Payroll report, September'],
  ['viewed', 'Payroll, October'],
  ['deleted', 'Draft offer letter v1'],
  ['updated', 'Leave policy 2026', [{ field: 'Carry-forward cap', from: '10 days', to: '12 days' }]],
];
const entries: AuditEntry[] = Array.from({ length: 24 }, (_, i) => {
  const [action, target, changes] = things[i % things.length];
  const failed = i % 9 === 4;
  return { id: String(i), actor: failed ? 'Unknown' : people[i % people.length], action: failed ? 'login' : action, target: failed ? 'Admin console, wrong password' : target, at: Date.now() - (i * 3.7 + 0.4) * h, ip: failed ? '203.0.113.9' : `10.0.4.${10 + (i % people.length)}`, ...(failed ? { status: 'failed' as const } : { changes }) };
});

export default function AuditLogProDemo() {
  return <AuditLogPro className="w-full max-w-5xl" entries={entries} />;
}
