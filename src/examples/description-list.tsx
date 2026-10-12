import { Badge } from '@/components/ui/badge';
import { DescriptionList } from '@/components/ui/description-list';

export default function DescriptionListDemo() {
  return (
    <DescriptionList
      className="w-full max-w-xl"
      columns={2}
      bordered
      items={[
        { label: 'Customer', value: 'Northwind Traders' },
        { label: 'Status', value: <Badge variant="success" dot>Active</Badge> },
        { label: 'Plan', value: 'Business, yearly' },
        { label: 'Renews on', value: '14 Jan 2027' },
        { label: 'Billing email', value: 'accounts@northwind.in' },
        { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
        { label: 'Notes', value: 'Wants invoices sent to two people, reminder 7 days before renewal.', wide: true },
      ]}
    />
  );
}
