import { AuditReport } from '@/components/ui/audit-report';

export default function AuditReportDemo() {
  return (
    <AuditReport
      organization="Kiran Foods Pvt Ltd"
      title="Internal audit report"
      period="Procurement, FY 2025-26"
      number="IA-2026-04"
      generated="12 Nov 2026"
      auditor="Internal Audit"
      scope="Purchase orders above 50,000 rupees raised between April 2025 and March 2026, and the approvals and payments that followed."
      opinion="Satisfactory, with exceptions"
      findings={[
        { ref: 'F-01', title: 'Orders split to stay under the approval limit', severity: 'major', detail: 'Nine orders to one supplier were each just under 50,000 rupees within two weeks, avoiding second approval.', recommendation: 'Total orders per supplier per month and approve on the total.', where: 'Purchasing, Jan to Feb 2026' },
        { ref: 'F-02', title: 'Vendor bank details changed without a check', severity: 'critical', detail: 'Two vendors changed bank accounts by email and were paid the same week with no call-back.', recommendation: 'Confirm every bank change by phone with a known contact before paying.', where: 'Accounts payable' },
        { ref: 'F-03', title: 'Three quotes missing on two large orders', severity: 'minor', detail: 'Policy asks for three quotes above 2 lakh rupees. Two orders had one.' },
        { ref: 'F-04', title: 'Approval emails are not filed with the order', severity: 'note', detail: 'Approvals exist but are hard to find. Attach them to the order record.' },
      ]}
    />
  );
}
