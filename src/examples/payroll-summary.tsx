import { PayrollSummary } from '@/components/ui/payroll-summary';

export default function PayrollSummaryDemo() {
  return (
    <PayrollSummary
      organization="Kiran Foods Pvt Ltd"
      title="Payroll summary"
      period="October 2026"
      number="PAY-2026-10"
      generated="28 Oct 2026"
      note="Salaries are paid on 31 October by bank transfer."
      rows={[
        { name: 'Meera Joshi', department: 'Accounts', basic: 52000, allowances: 14000, deductions: 9800 },
        { name: 'Rohan Desai', department: 'Sales', basic: 38000, allowances: 12000, deductions: 6400 },
        { name: 'Anita Rao', department: 'Sales', basic: 61000, allowances: 17000, deductions: 12100 },
        { name: 'Imran Shaikh', department: 'Dispatch', basic: 31000, allowances: 8000, deductions: 4700 },
        { name: 'Kavita Nair', department: 'Warehouse', basic: 27000, allowances: 6500, deductions: 3900 },
      ]}
    />
  );
}
