import { AuditRecordHistory } from '@/components/ui/audit-record-history';
import type { AuditEntry } from '@/components/ui/audit-log';

const h = 3600000;
const entries: AuditEntry[] = [
  { id: '1', actor: 'Meera Iyer', action: 'updated', target: 'Salary structure, Engineering', at: Date.now() - 0.5 * h, changes: [{ field: 'Basic', from: '₹60,000', to: '₹64,000' }, { field: 'HRA', from: '₹24,000', to: '₹25,600' }] },
  { id: '2', actor: 'Kabir Shah', action: 'approved', target: 'Salary structure, Engineering', at: Date.now() - 26 * h, changes: [{ field: 'Status', from: 'Pending', to: 'Approved' }] },
  { id: '3', actor: 'Meera Iyer', action: 'updated', target: 'Salary structure, Engineering', at: Date.now() - 80 * h, changes: [{ field: 'Basic', from: '₹55,000', to: '₹60,000' }, { field: 'Status', from: 'Approved', to: 'Pending' }] },
  { id: '4', actor: 'Isha Nair', action: 'created', target: 'Salary structure, Engineering', at: Date.now() - 400 * h, changes: [{ field: 'Basic', to: '₹55,000' }, { field: 'HRA', to: '₹22,000' }, { field: 'Status', to: 'Approved' }] },
];

export default function AuditRecordHistoryDemo() {
  return <AuditRecordHistory className="w-full max-w-lg" title="Salary structure, Engineering" entries={entries} />;
}
