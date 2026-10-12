import { Button } from '@/components/ui/button';
import { DownloadIcon, PrinterIcon, SendIcon } from '@/components/ui/icons';
import { Invoice } from '@/components/ui/invoice';
import { toast } from '@/components/ui/toast';

export default function InvoicePage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => window.print()}><PrinterIcon /> Print</Button>
        <Button size="sm" variant="outline" onClick={() => toast.success('PDF downloaded')}><DownloadIcon /> Download</Button>
        <Button size="sm" onClick={() => toast.success('Invoice emailed to accounts@northwind.in')}><SendIcon /> Send</Button>
      </div>
      <Invoice
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
          { description: 'Priority support', qty: 1, price: 2500 },
        ]}
        notes="Pay by bank transfer within 14 days. Account details are in your welcome email."
      />
    </div>
  );
}
