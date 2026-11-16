import { IncomeStatement } from '@/components/ui/income-statement';

export default function IncomeStatementDemo() {
  return (
    <IncomeStatement
      organization="Kiran Foods Pvt Ltd"
      title="Income statement"
      period="Quarter ended 30 September 2026"
      number="FS-Q2"
      generated="8 Oct 2026"
      previousLabel="Last quarter"
      income={[
        { title: 'Sales', lines: [{ label: 'Retail', amount: 9200000, previous: 8400000 }, { label: 'Wholesale', amount: 5100000, previous: 5300000 }] },
        { title: 'Other income', lines: [{ label: 'Interest', amount: 140000, previous: 120000 }] },
      ]}
      expenses={[
        { title: 'Cost of goods', lines: [{ label: 'Raw material', amount: 7300000, previous: 6900000 }, { label: 'Packaging', amount: 820000, previous: 790000 }] },
        { title: 'Operating', lines: [{ label: 'Salaries', amount: 3100000, previous: 3000000 }, { label: 'Rent and utilities', amount: 640000, previous: 640000 }, { label: 'Marketing', amount: 910000, previous: 540000 }] },
      ]}
      notes="Marketing was up because of the festival campaign. Wholesale fell after two distributors paused orders."
    />
  );
}
