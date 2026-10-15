import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CouponInput } from '@/components/ui/coupon-input';
import { OrderSummary, type OrderLine } from '@/components/ui/order-summary';

const lines: OrderLine[] = [
  { id: '1', name: 'Wireless keyboard', detail: 'Graphite · UK layout', qty: 1, price: 3499 },
  { id: '2', name: 'Noise-cancelling headphones', detail: 'Midnight blue', qty: 2, price: 8999 },
];

export default function Checkout() {
  const [code, setCode] = React.useState<string>();
  return (
    <OrderSummary className="w-full max-w-sm" lines={lines} discount={code ? 250 : 0} shipping={0} taxRate={0.18} action={<Button className="w-full" size="lg">Continue</Button>}>
      <CouponInput applied={code} hint={code && 'You save ₹250'} onApply={(c) => { const ok = c === 'FESTIVE250'; if (ok) setCode(c); return ok; }} onRemove={() => setCode(undefined)} />
    </OrderSummary>
  );
}
