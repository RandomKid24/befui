import { DiffViewer } from '@/components/ui/diff-viewer';

const before = `# Plan limits
seats: 10
storage_gb: 50
support: email
sso: false
audit_log: false

# Billing
currency: INR
tax_rate: 0.18
invoice_prefix: INV
net_days: 14
late_fee_percent: 1.5
`;
const after = `# Plan limits
seats: 25
storage_gb: 100
support: email
sso: true
audit_log: false

# Billing
currency: INR
tax_rate: 0.18
invoice_prefix: INV
net_days: 14
late_fee_percent: 1.5
grace_days: 3
`;

export default function DiffViewerDemo() {
  return <DiffViewer className="w-[36rem] max-w-full" title="plans.yml" before={before} after={after} context={1} />;
}
