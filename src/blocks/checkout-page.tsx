import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CouponInput } from '@/components/ui/coupon-input';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { OrderSummary } from '@/components/ui/order-summary';
import { RadioGroup } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/toast';

const lines = [
  { id: '1', name: 'Linen shirt', detail: 'Sand, M', qty: 2, price: 1999 },
  { id: '2', name: 'Canvas sneakers', detail: 'White, 9', qty: 1, price: 3499 },
];

export default function CheckoutPage() {
  const [coupon, setCoupon] = React.useState<string>();
  const [ship, setShip] = React.useState('standard');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const k of ['name', 'address', 'pin', 'phone']) if (!String(f.get(k) ?? '').trim()) next[k] = 'Required';
    if (f.get('pin') && !/^\d{6}$/.test(String(f.get('pin')))) next.pin = 'Enter a 6-digit PIN code';
    setErrors(next);
    if (!Object.keys(next).length) toast.success('Order placed');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
      <form id="checkout" onSubmit={submit} noValidate className="grid content-start gap-4">
        <Card>
          <CardHeader><CardTitle>Delivery address</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" error={errors.name} className="sm:col-span-2"><Input name="name" autoComplete="name" aria-invalid={!!errors.name} /></Field>
            <Field label="Address" error={errors.address} className="sm:col-span-2"><Input name="address" autoComplete="street-address" aria-invalid={!!errors.address} /></Field>
            <Field label="PIN code" error={errors.pin}><Input name="pin" inputMode="numeric" autoComplete="postal-code" aria-invalid={!!errors.pin} /></Field>
            <Field label="Phone" error={errors.phone}><Input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} /></Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Delivery</CardTitle></CardHeader>
          <CardContent>
            <RadioGroup name="ship" value={ship} onValueChange={setShip} options={[{ value: 'standard', label: 'Standard', description: '3 to 5 days, free' }, { value: 'express', label: 'Express', description: 'Next day, ₹149' }]} />
          </CardContent>
        </Card>
      </form>
      <OrderSummary
        lines={lines}
        discount={coupon ? 500 : 0}
        shipping={ship === 'express' ? 149 : 0}
        taxRate={0.05}
        action={<Button type="submit" form="checkout" className="w-full">Place order</Button>}
      >
        <CouponInput applied={coupon} onApply={(c) => { const ok = c.toUpperCase() === 'WELCOME500'; if (ok) setCoupon(c.toUpperCase()); return ok; }} onRemove={() => setCoupon(undefined)} hint={coupon ? 'You save ₹500' : 'Try WELCOME500'} />
      </OrderSummary>
    </div>
  );
}
