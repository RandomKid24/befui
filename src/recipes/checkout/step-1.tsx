import { Button } from '@/components/ui/button';
import { OrderSummary, type OrderLine } from '@/components/ui/order-summary';

const lines: OrderLine[] = [
  { id: '1', name: 'Wireless keyboard', detail: 'Graphite · UK layout', qty: 1, price: 3499 },
  { id: '2', name: 'Noise-cancelling headphones', detail: 'Midnight blue', qty: 2, price: 8999 },
];

export default function Checkout() {
  return <OrderSummary className="w-full max-w-sm" lines={lines} shipping={0} taxRate={0.18} action={<Button className="w-full" size="lg">Continue</Button>} />;
}
