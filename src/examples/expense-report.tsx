import { ExpenseReport } from '@/components/ui/expense-report';

export default function ExpenseReportDemo() {
  return (
    <ExpenseReport
      organization="Kiran Foods Pvt Ltd"
      title="Expense claim"
      period="Pune trip, 12 to 14 October 2026"
      number="EXP-0412"
      generated="16 Oct 2026"
      employee={{ name: 'Rohan Desai', id: 'KF-0231', department: 'Sales' }}
      advance={5000}
      lines={[
        { date: '12 Oct', category: 'Travel', description: 'Train, Mumbai to Pune', amount: 1450 },
        { date: '12 Oct', category: 'Hotel', description: 'Two nights, Hotel Sapphire', amount: 6800 },
        { date: '13 Oct', category: 'Meals', description: 'Client dinner, four people', amount: 3200 },
        { date: '13 Oct', category: 'Local travel', description: 'Cabs, three rides', amount: 1180, receipt: false },
        { date: '14 Oct', category: 'Travel', description: 'Train, Pune to Mumbai', amount: 1450 },
      ]}
    />
  );
}
