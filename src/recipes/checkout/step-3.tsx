import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CouponInput } from '@/components/ui/coupon-input';
import { CreditCard } from '@/components/ui/credit-card';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { OrderSummary, type OrderLine } from '@/components/ui/order-summary';
import { toast } from '@/components/ui/toast';

const lines: OrderLine[] = [
  { id: '1', name: 'Wireless keyboard', detail: 'Graphite · UK layout', qty: 1, price: 3499 },
  { id: '2', name: 'Noise-cancelling headphones', detail: 'Midnight blue', qty: 2, price: 8999 },
];

const group = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

export default function Checkout() {
  const [code, setCode] = React.useState<string>();
  const [card, setCard] = React.useState({ number: '', name: '', expiry: '', cvv: '' });
  const [back, setBack] = React.useState(false);
  const set = (k: keyof typeof card) => (v: string) => setCard((c) => ({ ...c, [k]: v }));
  const ready = card.number.replace(/\s/g, '').length === 16 && card.name && card.expiry.length === 5 && card.cvv.length >= 3;
  return (
    <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
      <div className="grid content-start gap-4">
        <CreditCard {...card} flipped={back} onFlip={setBack} className="w-full" />
        <Field label="Card number"><Input inputMode="numeric" placeholder="4111 1111 1111 1111" value={card.number} onChange={(e) => set('number')(group(e.target.value))} /></Field>
        <Field label="Name on card"><Input value={card.name} onChange={(e) => set('name')(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry"><Input placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => set('expiry')(e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5))} /></Field>
          <Field label="CVV"><Input inputMode="numeric" maxLength={4} value={card.cvv} onFocus={() => setBack(true)} onBlur={() => setBack(false)} onChange={(e) => set('cvv')(e.target.value.replace(/\D/g, ''))} /></Field>
        </div>
      </div>
      <OrderSummary lines={lines} discount={code ? 250 : 0} shipping={0} taxRate={0.18} action={<Button className="w-full" size="lg" disabled={!ready} onClick={() => toast.success('Payment received')}>Pay now</Button>}>
        <CouponInput applied={code} hint={code && 'You save ₹250'} onApply={(c) => { const ok = c === 'FESTIVE250'; if (ok) setCode(c); return ok; }} onRemove={() => setCode(undefined)} />
      </OrderSummary>
    </div>
  );
}
