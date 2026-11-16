import { BalanceSheet } from '@/components/ui/balance-sheet';

export default function BalanceSheetDemo() {
  return (
    <BalanceSheet
      organization="Kiran Foods Pvt Ltd"
      title="Balance sheet"
      period="As at 30 September 2026"
      number="FS-BS-Q2"
      generated="8 Oct 2026"
      assets={[
        { title: 'Current assets', lines: [{ label: 'Cash and bank', amount: 6200000 }, { label: 'Receivables', amount: 4100000 }, { label: 'Inventory', amount: 3850000 }] },
        { title: 'Fixed assets', lines: [{ label: 'Plant and machinery', amount: 9400000 }, { label: 'Vehicles', amount: 2100000 }, { label: 'Less depreciation', amount: -3300000 }] },
      ]}
      liabilities={[
        { title: 'Current liabilities', lines: [{ label: 'Payables', amount: 3600000 }, { label: 'GST payable', amount: 520000 }] },
        { title: 'Long-term liabilities', lines: [{ label: 'Term loan', amount: 6000000 }] },
      ]}
      equity={[
        { title: 'Owners equity', lines: [{ label: 'Share capital', amount: 5000000 }, { label: 'Retained earnings', amount: 7230000 }] },
      ]}
    />
  );
}
