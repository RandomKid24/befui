import { AuditOverview } from '@/components/ui/audit-overview';
import type { AuditEntry } from '@/components/ui/audit-log';

const h = 3600000;
const entries: AuditEntry[] = [
  { id: '1', actor: 'Unknown', action: 'login', target: 'Admin console, 3rd wrong password', at: Date.now() - 0.3 * h, status: 'failed' },
  { id: '2', actor: 'Meera Iyer', action: 'updated', target: 'Salary structure, Engineering', at: Date.now() - 0.5 * h },
  { id: '3', actor: 'Rohan Das', action: 'deleted', target: 'Employee EMP-0388', at: Date.now() - 2 * h },
  { id: '4', actor: 'Isha Nair', action: 'created', target: 'Employee EMP-0412', at: Date.now() - 3 * h },
  { id: '5', actor: 'Kabir Shah', action: 'exported', target: 'Payroll report, September', at: Date.now() - 5 * h },
  { id: '6', actor: 'Aarav Mehta', action: 'updated', target: 'Leave policy 2026', at: Date.now() - 7 * h },
  { id: '7', actor: 'Unknown', action: 'login', target: 'Admin console', at: Date.now() - 8 * h, status: 'failed' },
];

export default function AuditOverviewDemo() {
  return <AuditOverview className="w-full max-w-2xl" entries={entries} />;
}
