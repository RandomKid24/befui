import { JsonTree } from '@/components/ui/json-tree';

const data = {
  id: 'ord_4471',
  status: 'shipped',
  total: 4999.5,
  paid: true,
  coupon: null,
  customer: { name: 'Aarav Mehta', email: 'aarav@acme.co', address: { city: 'Pune', pin: '411001' } },
  items: [
    { sku: 'TEE-BLK-M', qty: 2, price: 799 },
    { sku: 'CAP-NVY', qty: 1, price: 1200 },
  ],
  tags: ['gift', 'priority'],
};

export default function JsonTreeDemo() {
  return <JsonTree className="w-[32rem] max-w-full" data={data} defaultDepth={2} />;
}
