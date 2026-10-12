import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@/components/ui/icons';
import { Invoice } from '@/components/ui/invoice';

export default function InvoiceDemo() {
  return (
    <Invoice
      className="w-full max-w-2xl"
      number="INV-2026-0142"
      status="unpaid"
      issued="1 Oct 2026"
      due="15 Oct 2026"
      taxRate={0.18}
      from={{ name: 'Acme Industries Pvt Ltd', lines: ['12 MG Road, Pune 411001', 'GSTIN 27AAACA1234A1Z9'] }}
      to={{ name: 'Northwind Traders', lines: ['44 Park Street, Kolkata 700016', 'accounts@northwind.in'] }}
      lines={[
        { description: 'Business plan, 12 seats, October', qty: 12, price: 1299 },
        { description: 'Extra storage (100 GB)', qty: 2, price: 500 },
      ]}
      notes="Pay by bank transfer within 14 days. Late payments add 1.5% a month."
      actions={<Button size="sm" variant="outline"><DownloadIcon /> PDF</Button>}
    />
  );
}
