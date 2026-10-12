import * as React from 'react';
import { CreditCard } from '@/components/ui/credit-card';
import { Input } from '@/components/ui/input';

export default function CreditCardDemo() {
  const [f, setF] = React.useState({ number: '4111 1111 1111 1111', name: 'Aarav Mehta', expiry: '08/28', cvv: '' });
  const [back, setBack] = React.useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="grid justify-items-center gap-5">
      <CreditCard {...f} flipped={back} onFlip={setBack} />
      <div className="grid w-80 max-w-full grid-cols-2 gap-2">
        <Input className="col-span-2" aria-label="Card number" inputMode="numeric" maxLength={19} value={f.number} onChange={set('number')} onFocus={() => setBack(false)} />
        <Input className="col-span-2" aria-label="Name" value={f.name} onChange={set('name')} onFocus={() => setBack(false)} />
        <Input aria-label="Expiry" placeholder="MM/YY" maxLength={5} value={f.expiry} onChange={set('expiry')} onFocus={() => setBack(false)} />
        <Input aria-label="CVV" placeholder="CVV" inputMode="numeric" maxLength={4} value={f.cvv} onChange={set('cvv')} onFocus={() => setBack(true)} />
      </div>
    </div>
  );
}
