import { NumberTicker } from '@/components/ui/number-ticker';

export default function NumberTickerDemo() {
  return (
    <div className="grid grid-cols-3 gap-10 text-center">
      {[
        { v: 14820, l: 'Employees onboarded', p: '' },
        { v: 98.6, l: 'Payroll accuracy', s: '%', d: 1 },
        { v: 4.2, l: 'Revenue', p: '₹', s: 'Cr', d: 1 },
      ].map((x) => (
        <div key={x.l}>
          <NumberTicker countUp value={x.v} prefix={x.p} suffix={x.s} decimals={x.d} className="text-4xl font-semibold tracking-tight" />
          <p className="mt-1 text-sm text-muted-foreground">{x.l}</p>
        </div>
      ))}
    </div>
  );
}
